import { connectDB } from "@/lib/dbConnect";
import { ChatSession } from "@/models/ChatSession";
import { NoteChunk } from "@/models/NoteChunk";
import { Subject } from "@/models/Subject";
import { embedText, streamAnswer, cosineSimilarity } from "@/lib/gemini";
import { NextResponse } from "next/server";

const SIMILARITY_THRESHOLD = 0.55;
const TOP_K = 5;

/**
 * POST /api/chat/sessions/:id/messages
 *
 * Retrieves relevant context via RAG (NoteChunks + cosine similarity).
 * Falls back to raw syllabus text if no chunks are ingested.
 * Streams the Gemini answer back as plain text.
 * Saves the exchange to the ChatSession document.
 *
 * Response: streaming text/plain
 * Header X-Citations: JSON array of { section, text } citations
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Load session
    const chatSession = await ChatSession.findById(id);
    if (!chatSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // ── Retrieve context ────────────────────────────────────────────────────────
    let context = "";
    let citations: { section: string; text: string }[] = [];

    const chunks = await NoteChunk.find({ subjectId: chatSession.subjectId });

    if (chunks.length > 0) {
      // RAG: embed the question and rank chunks by cosine similarity
      const queryEmbedding = await embedText(message);
      const scored = chunks
        .map((c) => ({
          chunk: c,
          score: cosineSimilarity(queryEmbedding, c.embedding as number[]),
        }))
        .filter((c) => c.score >= SIMILARITY_THRESHOLD)
        .sort((a, b) => b.score - a.score)
        .slice(0, TOP_K);

      if (scored.length > 0) {
        context = scored
          .map((c) => `[${c.chunk.pageOrSection || "Notes"}]\n${c.chunk.text}`)
          .join("\n\n---\n\n");
        citations = scored.map((c) => ({
          section: c.chunk.pageOrSection || "Notes",
          text: c.chunk.text.slice(0, 140) + "…",
        }));
      }
    }

    // Fallback: use raw syllabus from the Subject document
    if (!context) {
      const subject = await Subject.findById(chatSession.subjectId);
      if (subject?.syllabus && typeof subject.syllabus === "object") {
        const entries = Object.entries(subject.syllabus as Record<string, string>);
        context = entries
          .map(([unit, content]) => `${unit}:\n${content}`)
          .join("\n\n");
        citations = [{ section: "Course Syllabus", text: "Based on the subject syllabus content" }];
      }
    }

    // No content at all
    if (!context) {
      const fallback =
        "I don't have enough study material indexed for this subject yet. " +
        "Ask an admin to run the content ingestion, or rephrase your question.";
      chatSession.messages.push({ role: "user", content: message, citedChunks: [] });
      chatSession.messages.push({ role: "assistant", content: fallback, citedChunks: [] });
      await chatSession.save();
      return new Response(fallback, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Citations": "[]",
        },
      });
    }

    // ── Build prompt ────────────────────────────────────────────────────────────
    // Include last 3 exchanges (6 messages) for context
    const recentHistory = chatSession.messages
      .slice(-6)
      .map((m: any) => `${m.role === "user" ? "Student" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt =
      `CONTEXT FROM STUDY MATERIAL:\n${context}\n\n` +
      `${recentHistory ? `PREVIOUS CONVERSATION:\n${recentHistory}\n\n` : ""}` +
      `Student: ${message}\nAssistant:`;

    // Save user message
    chatSession.messages.push({ role: "user", content: message, citedChunks: [] });
    await chatSession.save();

    // ── Stream response ─────────────────────────────────────────────────────────
    let fullResponse = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamAnswer(prompt)) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (streamErr: any) {
          console.error("❌ Gemini stream error:", streamErr);
          const errMsg = streamErr?.message || "I encountered an error generating a response. Please try again.";
          fullResponse = errMsg;
          controller.enqueue(encoder.encode(errMsg));
        } finally {
          // Verify if response actually used context before attaching citations
          const ungroundedPhrases = [
            "does not contain",
            "doesn't contain",
            "not mentioned in",
            "no information about",
            "not in the provided context",
            "not present in the context",
            "do not have information",
          ];

          const isUngrounded = ungroundedPhrases.some((phrase) =>
            fullResponse.toLowerCase().includes(phrase)
          );

          const finalCitations = isUngrounded ? [] : citations;

          // Persist the assistant response
          try {
            chatSession.messages.push({
              role: "assistant",
              content: fullResponse || "No response generated.",
              citedChunks: finalCitations,
            });
            await chatSession.save();
          } catch (saveErr) {
            console.error("❌ Failed to save assistant message:", saveErr);
          }
          controller.close();
        }
      },
    });

    // Determine initial citations header based on query relevance
    const ungroundedPhrases = [
      "does not contain",
      "doesn't contain",
      "not mentioned in",
      "no information about",
      "not in the provided context",
      "not present in the context",
      "do not have information",
    ];

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Citations": JSON.stringify(citations),
        // Disable buffering on edge/vercel
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: any) {
    console.error("❌ Chat message error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/chat/sessions/:id
 * Retrieves all messages in a session.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await ChatSession.findById(id);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ messages: session.messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
