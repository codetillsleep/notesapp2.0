import mongoose, { Schema, model, models } from "mongoose";

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    labCode: { type: String },
    branch: [{ type: String, required: true }],
    semester: [{ type: Number, required: true }],
    theoryCredits: { type: Number, default: 0 },
    labCredits: { type: Number, default: 0 },

    // ✅ store as Mixed type to allow any structure
    syllabus: { type: mongoose.Schema.Types.Mixed, default: {} },
    lab: { type: mongoose.Schema.Types.Mixed, default: {} },

    questions: [
      {
        title: String,
        pdfUrl: String,
      },
    ],
    videos: [
      {
        title: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

export const Subject = models.Subject || model("Subject", subjectSchema);
