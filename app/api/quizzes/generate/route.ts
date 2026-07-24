import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import { Subject } from "@/models/Subject";
import { NoteChunk } from "@/models/NoteChunk";
import { embedText, generateJSON, cosineSimilarity } from "@/lib/gemini";

/**
 * POST /api/quizzes/generate
 * Body: { subjectId, unit?, type: "quiz" | "flashcards", count: number }
 *
 * Generates AI MCQs or flashcards from the subject's indexed content.
 * Falls back to raw syllabus if no NoteChunks are ingested.
 * Retries once if Gemini returns malformed JSON.
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      subjectId,
      unit,
      type = "quiz",
      count = 5,
    }: {
      subjectId: string;
      unit?: string;
      type: "quiz" | "flashcards";
      count: number;
    } = await req.json();

    if (!subjectId) {
      return NextResponse.json({ error: "subjectId is required" }, { status: 400 });
    }
    if (!["quiz", "flashcards"].includes(type)) {
      return NextResponse.json({ error: "type must be 'quiz' or 'flashcards'" }, { status: 400 });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // ── Build context ───────────────────────────────────────────────────────────
    let context = "";
    const chunks = await NoteChunk.find({ subjectId });

    if (chunks.length > 0) {
      if (unit) {
        // Filter by unit similarity
        const unitEmbedding = await embedText(unit);
        const scored = chunks
          .map((c) => ({
            text: c.text,
            score: cosineSimilarity(unitEmbedding, c.embedding as number[]),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        context = scored.map((c) => c.text).join("\n\n");
      } else {
        context = chunks.map((c) => c.text).join("\n\n");
      }
    }

    // Fallback: use raw syllabus from Subject document
    if (!context && subject.syllabus && typeof subject.syllabus === "object") {
      const entries = Object.entries(subject.syllabus as Record<string, string>);
      if (unit) {
        const match = entries.find(([k]) =>
          k.toLowerCase().includes(unit.toLowerCase())
        );
        context = match
          ? `${match[0]}:\n${match[1]}`
          : entries.map(([k, v]) => `${k}:\n${v}`).join("\n\n");
      } else {
        context = entries.map(([k, v]) => `${k}:\n${v}`).join("\n\n");
      }
    }

    if (!context) {
      return NextResponse.json(
        { error: "No study material found for this subject." },
        { status: 404 }
      );
    }

    // Trim to safe token limit (~8 000 chars ≈ ~2 000 tokens)
    const trimmedContext = context.slice(0, 8000);

    // ── Build prompt ────────────────────────────────────────────────────────────
    const quizPrompt = `Generate exactly ${count} multiple-choice questions based solely on this study material.

STUDY MATERIAL:
${trimmedContext}

RULES:
- Every question must be answerable from the provided material only
- 4 options per question
- One correct answer (correctAnswerIndex: 0-3)
- Include a brief explanation (1-2 sentences) for the correct answer

Return ONLY this JSON (no markdown, no extra text):
{
  "questions": [
    {
      "questionText": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswerIndex": 0,
      "explanation": "..."
    }
  ]
}`;

    const flashcardPrompt = `Generate exactly ${count} flashcards based solely on this study material.

STUDY MATERIAL:
${trimmedContext}

RULES:
- Each card must test one key concept, term, or definition
- Front: a question or term
- Back: a concise answer or definition
- Include a brief explanation where helpful

Return ONLY this JSON (no markdown, no extra text):
{
  "questions": [
    {
      "questionText": "...",
      "answerText": "...",
      "explanation": "..."
    }
  ]
}`;

    const prompt = type === "quiz" ? quizPrompt : flashcardPrompt;

    // ── Generate + validate (1 retry) ───────────────────────────────────────────
    let parsed: { questions: any[] } | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await generateJSON(prompt);
        let candidate: any = null;
        try {
          candidate = JSON.parse(raw);
        } catch {
          // Extract JSON substring if raw has surrounding text
          const firstBrace = raw.indexOf("{");
          const lastBrace = raw.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            candidate = JSON.parse(raw.slice(firstBrace, lastBrace + 1));
          }
        }

        if (Array.isArray(candidate?.questions) && candidate.questions.length > 0) {
          parsed = candidate;
          break;
        }
      } catch (err: any) {
        if (attempt === 1) {
          return NextResponse.json(
            { error: err.message || "Failed to generate valid questions. Please try again." },
            { status: 500 }
          );
        }
      }
    }

    if (!parsed) {
      return NextResponse.json(
        { error: "Could not generate questions. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      type,
      subjectName: subject.name,
      questions: parsed.questions.slice(0, count),
      aiGenerated: true,
    });
  } catch (err: any) {
    console.error("❌ Quiz generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
