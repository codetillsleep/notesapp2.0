import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import { Subject } from "@/models/Subject";
import { NoteChunk } from "@/models/NoteChunk";
import { embedText } from "@/lib/gemini";

/**
 * Split text into overlapping chunks.
 * Chunks at sentence boundaries where possible.
 */
function chunkText(text: string, chunkSize = 900, overlap = 120): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);
    // Try to end at a sentence boundary
    if (end < text.length) {
      const boundary = text.lastIndexOf(". ", end);
      if (boundary > start + chunkSize / 2) end = boundary + 1;
    }
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 60) chunks.push(chunk);
    start = end - overlap;
  }
  return chunks;
}

/**
 * POST /api/admin/ingest/:subjectId
 *
 * Reads the subject's syllabus → chunks text → embeds each chunk → stores
 * in NoteChunk collection. Previous chunks for this subject are deleted first.
 *
 * Usage: POST /api/admin/ingest/<subjectId>
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    await connectDB();
    const { subjectId } = await params;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Remove stale chunks for this subject
    await NoteChunk.deleteMany({ subjectId: subject._id });

    const toInsert: any[] = [];

    // Extract and chunk each unit's text from the syllabus
    if (subject.syllabus && typeof subject.syllabus === "object") {
      for (const [unitName, unitContent] of Object.entries(
        subject.syllabus as Record<string, string>
      )) {
        const fullText = `${unitName}:\n${String(unitContent)}`;
        const chunks = chunkText(fullText);

        for (const chunk of chunks) {
          const embedding = await embedText(chunk);
          toInsert.push({
            subjectId: subject._id,
            sourceFileName: "Syllabus",
            pageOrSection: unitName,
            text: chunk,
            embedding,
          });
        }
      }
    }

    if (toInsert.length === 0) {
      return NextResponse.json(
        { error: "No syllabus content found for this subject to ingest." },
        { status: 400 }
      );
    }

    await NoteChunk.insertMany(toInsert);

    return NextResponse.json({
      success: true,
      subjectName: subject.name,
      chunksCreated: toInsert.length,
    });
  } catch (err: any) {
    console.error("❌ Ingestion error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
