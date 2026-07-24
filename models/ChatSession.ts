import { Schema, model, models } from "mongoose";

const messageSchema = new Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  /** Source chunks used to ground this assistant response */
  citedChunks: [
    {
      section: { type: String },
      text: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const chatSessionSchema = new Schema(
  {
    /** null = guest / unauthenticated */
    userId: { type: String, default: "guest" },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

export const ChatSession =
  models.ChatSession || model("ChatSession", chatSessionSchema);
