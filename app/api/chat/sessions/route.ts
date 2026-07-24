import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import { ChatSession } from "@/models/ChatSession";

/**
 * POST /api/chat/sessions
 * Creates a new chat session scoped to a subject.
 * Body: { subjectId: string }
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const { subjectId } = await req.json();

    if (!subjectId) {
      return NextResponse.json(
        { error: "subjectId is required" },
        { status: 400 }
      );
    }

    const session = await ChatSession.create({
      subjectId,
      messages: [],
    });

    return NextResponse.json(
      { sessionId: session._id.toString() },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Chat session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
