import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import { Subject } from "@/models/Subject";

export async function GET() {
  try {
    console.log("🔹 Connecting to DB...");
    await connectDB();
    console.log("🔹 Connected. Fetching subjects...");
    const subjects = await Subject.find();
    console.log("✅ Subjects fetched:", subjects.length);
    return NextResponse.json(subjects, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching subjects:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Database error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

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

    if (!name || !code || !branch || !semester)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const newSubject = await Subject.create({
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
    });

    return NextResponse.json(
      { success: true, data: newSubject },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding subject:", error);
    return NextResponse.json(
      { error: "Failed to add subject" },
      { status: 500 }
    );
  }
}
