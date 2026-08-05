import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import { Subject } from "@/models/Subject";
import { NoteChunk } from "@/models/NoteChunk";

// ── Admin email guard ─────────────────────────────────────────────────────────
async function requireAdmin(req?: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized — not logged in" }, { status: 401 });
  }
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json({ error: "Forbidden — not an admin" }, { status: 403 });
  }
  return null; // null = OK
}

// ── GET /api/admin/subjects — fetch all subjects ──────────────────────────────
export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    await connectDB();
    const subjects = await Subject.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: subjects }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Admin GET subjects error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/admin/subjects — create a new subject ───────────────────────────
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      code,
      labCode,
      branch,
      semester,
      theoryCredits,
      labCredits,
      syllabus,
      lab,
      questions,
      videos,
    } = body;

    if (!name || !code || !branch?.length || !semester?.length) {
      return NextResponse.json(
        { error: "Missing required fields: name, code, branch, semester" },
        { status: 400 }
      );
    }

    const subject = await Subject.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      labCode: labCode?.trim() || undefined,
      branch: Array.isArray(branch) ? branch : [branch],
      semester: Array.isArray(semester) ? semester.map(Number) : [Number(semester)],
      theoryCredits: Number(theoryCredits) || 0,
      labCredits: Number(labCredits) || 0,
      syllabus: syllabus || {},
      lab: lab || {},
      questions: questions || [],
      videos: videos || [],
    });

    return NextResponse.json({ success: true, data: subject }, { status: 201 });
  } catch (err: any) {
    console.error("❌ Admin POST subject error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── DELETE /api/admin/subjects?id=xxx — delete subject + its embeddings ───────
export async function DELETE(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subject id is required" }, { status: 400 });
    }

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Clean up AI embeddings for this subject
    const deleted = await NoteChunk.deleteMany({ subjectId: id });

    return NextResponse.json(
      {
        success: true,
        deletedSubject: subject.name,
        embeddingsRemoved: deleted.deletedCount,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Admin DELETE subject error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── PATCH /api/admin/subjects?id=xxx — update a subject ──────────────────────
export async function PATCH(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subject id is required" }, { status: 400 });
    }

    const body = await req.json();
    const updated = await Subject.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Admin PATCH subject error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
