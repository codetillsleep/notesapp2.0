import { Subject } from "@/models/Subject";
import { connectDB } from "@/lib/dbConnect";

// 🔹 Get all subjects
export async function fetchSubjects() {
  await connectDB();
  return await Subject.find();
}

// 🔹 Create new subject
export async function createSubject(data: any) {
  await connectDB();

  const subjectData = {
    name: data.name,
    code: data.code,
    labCode: data.labCode,
    branch: data.branch,
    semester: data.semester,
    theoryCredits: data.theoryCredits,
    labCredits: data.labCredits,
    syllabus: data.syllabus || {},
    lab: data.lab || {},
    questions: data.questions || [],
    videos: data.videos || [],
  };

  if (!subjectData.name || !subjectData.code || !subjectData.syllabus)
    throw new Error("Missing required fields: name, code, or syllabus");

  return await Subject.create(subjectData);
}

// 🔹 Update existing subject
export async function updateSubject(id: string, data: any) {
  await connectDB();
  return await Subject.findByIdAndUpdate(id, data, { new: true });
}

// 🔹 Delete subject
export async function deleteSubject(id: string) {
  await connectDB();
  return await Subject.findByIdAndDelete(id);
}
