import mongoose, { Schema, model, models } from "mongoose";

/**
 * NoteChunk — a chunk of text from a subject's notes/syllabus,
 * stored alongside its embedding vector for RAG retrieval.
 */
const noteChunkSchema = new Schema(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Subject",
      index: true,
    },
    sourceFileName: { type: String, default: "Syllabus" },
    /** The unit/section name this chunk came from, e.g. "Unit 2: Relational Model" */
    pageOrSection: { type: String },
    /** The raw text of this chunk */
    text: { type: String, required: true },
    /** text-embedding-004 produces 768-dim vectors */
    embedding: { type: [Number], required: true },
  },
  { timestamps: true }
);

export const NoteChunk =
  models.NoteChunk || model("NoteChunk", noteChunkSchema);
