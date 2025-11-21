import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import { Subject } from "@/models/Subject";

//  GET — fetch all subjects
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

//  POST — add a new subject
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const subjects = Array.isArray(body) ? body : [body];

    // for validation
    for (const subj of subjects) {
      if (!subj.name || !subj.code || !subj.branch || !subj.semester) {
        return NextResponse.json(
          { error: "Each subject must have name, code, branch, and semester" },
          { status: 400 }
        );
      }
    }

    // code for insert many at once
    const newSubjects = await Subject.insertMany(subjects);

    return NextResponse.json(
      { success: true, count: newSubjects.length, data: newSubjects },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding subjects:", error);
    return NextResponse.json(
      { error: "Failed to add subjects" },
      { status: 500 }
    );
  }
}

// PATCH — update an existing subject
export async function PATCH(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const code = url.searchParams.get("code"); // you’ll pass ?code=ES-201
    const update = await request.json();

    if (!code)
      return NextResponse.json(
        { success: false, message: "Subject code is required" },
        { status: 400 }
      );

    const updated = await Subject.findOneAndUpdate({ code }, update, {
      new: true,
    });

    if (!updated)
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating subject:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Update failed" },
      { status: 500 }
    );
  }
}
