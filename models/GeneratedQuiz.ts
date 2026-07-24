import { Schema, model, models } from "mongoose";

const questionSchema = new Schema({
  /** The question text (quiz) or front of card (flashcard) */
  questionText: { type: String, required: true },
  /** Quiz only: 4 answer options */
  options: { type: [String] },
  /** Quiz only: index of correct option (0–3) */
  correctAnswerIndex: { type: Number },
  /** Flashcard only: answer/definition */
  answerText: { type: String },
  /** Explanation for the answer */
  explanation: { type: String },
});

const generatedQuizSchema = new Schema(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    /** Optional specific unit/topic that was targeted */
    unit: { type: String },
    type: { type: String, enum: ["quiz", "flashcards"], required: true },
    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true }
);

export const GeneratedQuiz =
  models.GeneratedQuiz || model("GeneratedQuiz", generatedQuizSchema);
