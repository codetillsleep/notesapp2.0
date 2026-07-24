"use client";
import React, { useState } from "react";
import {
  X,
  Wand2,
  Brain,
  FileQuestion,
  Loader2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuizQuestion {
  questionText: string;
  options?: string[];
  correctAnswerIndex?: number;
  answerText?: string;
  explanation?: string;
}

interface QuizPanelProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  subjectName: string;
}

type Phase = "setup" | "generating" | "active" | "results";

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuizPanel({
  isOpen,
  onClose,
  subjectId,
  subjectName,
}: QuizPanelProps) {
  const { isDark } = useTheme();

  // Config
  const [quizType, setQuizType] = useState<"quiz" | "flashcards">("quiz");
  const [count, setCount] = useState(5);

  // Runtime
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = answers.filter(
    (a, i) => a !== null && a === questions[i]?.correctAnswerIndex
  ).length;

  const q = questions[currentIdx];

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    setPhase("generating");
    setError(null);
    try {
      const res = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, type: quizType, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      if (!data.questions?.length) throw new Error("No questions were generated");

      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      setCurrentIdx(0);
      setSelected(null);
      setFlipped(false);
      setPhase("active");
    } catch (err: any) {
      setError(err.message);
      setPhase("setup");
    }
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return; // already answered
    setSelected(idx);
    const next = [...answers];
    next[currentIdx] = idx;
    setAnswers(next);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelected(answers[currentIdx + 1] ?? null);
      setFlipped(false);
    } else {
      setPhase("results");
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((c) => c - 1);
      setSelected(answers[currentIdx - 1] ?? null);
      setFlipped(false);
    }
  };

  const handleReset = () => {
    setPhase("setup");
    setQuestions([]);
    setCurrentIdx(0);
    setSelected(null);
    setAnswers([]);
    setFlipped(false);
    setError(null);
  };

  if (!isOpen) return null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={phase !== "generating" ? onClose : undefined}
      />

      {/* Modal Centering Wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        {/* Modal Card */}
        <div
          className={`pointer-events-auto w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[85vh] ${
            isDark
              ? "bg-[#0f1623] border border-white/10"
              : "bg-white border border-gray-200"
          }`}
        >
        {/* ── Header ── */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isDark
              ? "bg-[#0a0f1a] border-white/8"
              : "bg-gray-50 border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/20">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p
                className={`text-sm font-bold leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {phase === "results"
                  ? "Results"
                  : phase === "active"
                  ? quizType === "quiz"
                    ? "Practice Quiz"
                    : "Flashcards"
                  : "AI Generator"}
              </p>
              <p
                className={`text-[11px] leading-tight ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {subjectName}
              </p>
            </div>
          </div>
          {phase !== "generating" && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-white/8 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-5 overflow-y-auto scrollbar-thin flex-1 min-h-0">
          {/* ═══════════ SETUP ═══════════ */}
          {phase === "setup" && (
            <div className="space-y-5">
              {error && (
                <div
                  className={`flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl border ${
                    isDark
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Type */}
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      {
                        id: "quiz" as const,
                        label: "Practice Quiz",
                        icon: FileQuestion,
                        desc: "MCQ with 4 options",
                      },
                      {
                        id: "flashcards" as const,
                        label: "Flashcards",
                        icon: Brain,
                        desc: "Flip-card revision",
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setQuizType(opt.id)}
                      className={`flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
                        quizType === opt.id
                          ? "border-indigo-500 bg-indigo-500/10"
                          : isDark
                          ? "border-white/8 bg-white/3 hover:bg-white/6"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <opt.icon
                        className={`w-5 h-5 ${
                          quizType === opt.id
                            ? "text-indigo-400"
                            : isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          quizType === opt.id
                            ? isDark
                              ? "text-indigo-300"
                              : "text-indigo-700"
                            : isDark
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {quizType === "quiz" ? "Questions" : "Cards"}
                </label>
                <div className="flex gap-2">
                  {[5, 8, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        count === n
                          ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 scale-105"
                          : isDark
                          ? "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/8"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div
                className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs border ${
                  isDark
                    ? "bg-amber-500/6 border-amber-500/15 text-amber-400/80"
                    : "bg-amber-50 border-amber-100 text-amber-700"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                AI-generated practice material — not exam-verified. Use for
                self-study only.
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20 hover:opacity-90 hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                Generate {quizType === "quiz" ? "Quiz" : "Flashcards"}
              </button>
            </div>
          )}

          {/* ═══════════ GENERATING ═══════════ */}
          {phase === "generating" && (
            <div className="flex flex-col items-center justify-center py-14 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <div className="text-center">
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Generating your{" "}
                  {quizType === "quiz" ? "quiz" : "flashcards"}…
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Reading study material and crafting questions
                </p>
              </div>
            </div>
          )}

          {/* ═══════════ ACTIVE — QUIZ ═══════════ */}
          {phase === "active" && quizType === "quiz" && q && (
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`text-xs font-semibold ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Q {currentIdx + 1} / {questions.length}
                </span>
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {answers.filter((a) => a !== null).length} answered
                </span>
              </div>
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isDark ? "bg-white/8" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question */}
              <div
                className={`p-4 rounded-xl text-sm font-semibold leading-relaxed ${
                  isDark
                    ? "bg-white/4 border border-white/8 text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                }`}
              >
                {q.questionText}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options?.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isCorrect = q.correctAnswerIndex === oi;
                  const revealed = selected !== null;

                  return (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(oi)}
                      disabled={revealed}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        revealed
                          ? isCorrect
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : isSelected
                            ? "border-red-500 bg-red-500/10 text-red-400"
                            : isDark
                            ? "border-white/5 text-gray-600"
                            : "border-gray-100 text-gray-400"
                          : isDark
                          ? "border-white/8 bg-white/3 hover:bg-white/8 text-gray-300 cursor-pointer"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full border text-[11px] font-bold flex items-center justify-center shrink-0 ${
                            revealed && isCorrect
                              ? "border-emerald-500 text-emerald-400"
                              : revealed && isSelected
                              ? "border-red-500 text-red-400"
                              : isDark
                              ? "border-white/20 text-gray-400"
                              : "border-gray-300 text-gray-500"
                          }`}
                        >
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {selected !== null && q.explanation && (
                <div
                  className={`px-4 py-3 rounded-xl text-xs leading-relaxed border ${
                    isDark
                      ? "bg-indigo-500/6 border-indigo-500/15 text-indigo-300"
                      : "bg-indigo-50 border-indigo-100 text-indigo-700"
                  }`}
                >
                  <span className="font-bold">Explanation: </span>
                  {q.explanation}
                </div>
              )}

              {/* Nav */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentIdx === 0
                      ? isDark
                        ? "text-gray-700 cursor-not-allowed"
                        : "text-gray-300 cursor-not-allowed"
                      : isDark
                      ? "text-gray-300 hover:bg-white/8"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  onClick={handleNext}
                  disabled={selected === null}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selected !== null
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90"
                      : isDark
                      ? "text-gray-700 cursor-not-allowed"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {currentIdx === questions.length - 1 ? "Results" : "Next"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ ACTIVE — FLASHCARDS ═══════════ */}
          {phase === "active" && quizType === "flashcards" && q && (
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Card {currentIdx + 1} / {questions.length}
                </span>
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Tap to flip
                </span>
              </div>

              {/* 3-D Flip card */}
              <div
                className="relative w-full cursor-pointer select-none"
                style={{ perspective: "1000px", height: "200px" }}
                onClick={() => setFlipped((f) => !f)}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front */}
                  <div
                    className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center border ${
                      isDark
                        ? "bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/20"
                        : "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100"
                    }`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${
                        isDark ? "text-indigo-400/60" : "text-indigo-400"
                      }`}
                    >
                      Question
                    </p>
                    <p
                      className={`text-sm font-semibold leading-relaxed ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {q.questionText}
                    </p>
                  </div>

                  {/* Back */}
                  <div
                    className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center border ${
                      isDark
                        ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20"
                        : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${
                        isDark ? "text-emerald-400/60" : "text-emerald-500"
                      }`}
                    >
                      Answer
                    </p>
                    <p
                      className={`text-sm font-semibold leading-relaxed ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {q.answerText}
                    </p>
                    {q.explanation && (
                      <p
                        className={`text-xs mt-3 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    currentIdx === 0
                      ? isDark
                        ? "text-gray-700 cursor-not-allowed"
                        : "text-gray-300 cursor-not-allowed"
                      : isDark
                      ? "text-gray-300 hover:bg-white/8"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isDark
                        ? "text-gray-300 hover:bg-white/8"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setPhase("results")}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 transition-all"
                  >
                    Done <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═══════════ RESULTS ═══════════ */}
          {phase === "results" && (
            <div className="space-y-5 text-center">
              {quizType === "quiz" ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
                      score / questions.length >= 0.7
                        ? "border-emerald-500 bg-emerald-500/10"
                        : score / questions.length >= 0.4
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-red-500 bg-red-500/10"
                    }`}
                  >
                    <div>
                      <div
                        className={`text-3xl font-black ${
                          score / questions.length >= 0.7
                            ? "text-emerald-400"
                            : score / questions.length >= 0.4
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {score}
                      </div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        / {questions.length}
                      </div>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-black ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {score / questions.length >= 0.8
                      ? "Excellent! 🎉"
                      : score / questions.length >= 0.6
                      ? "Good job! 👍"
                      : score / questions.length >= 0.4
                      ? "Keep practising 📚"
                      : "Needs more review 💪"}
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {Math.round((score / questions.length) * 100)}% on this
                    AI-generated quiz
                  </p>
                </div>
              ) : (
                <div className="py-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p
                    className={`text-lg font-black mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    All done! 🃏
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    You reviewed all {questions.length} flashcards
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.02] ${
                    isDark
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 hover:scale-[1.02] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  );
}
