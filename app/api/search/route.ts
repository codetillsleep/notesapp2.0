import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/dbConnect";
import { Subject } from "@/models/Subject";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const results = await Subject.find({
    name: { $regex: q, $options: "i" },
  })
    .limit(10)
    .lean();

  return NextResponse.json(results);
}
