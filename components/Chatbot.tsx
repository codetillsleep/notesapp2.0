"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Send,
  Bot,
  Loader2,
  AlertCircle,
  BookOpen,
  Zap,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Citation {
  section: string;
  text: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  subjectName: string;
}

const MAX_MESSAGES = 20; // per-session limit

// ── Component ─────────────────────────────────────────────────────────────────

export default function Chatbot({
  isOpen,
  onClose,
  subjectId,
  subjectName,
}: ChatbotProps) {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [initError, setInitError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Create session when panel opens ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || sessionId) return;
    setInitError(null);
    (async () => {
      try {
        const res = await fetch("/api/chat/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create session");
        setSessionId(data.sessionId);
      } catch (err: any) {
        setInitError("Could not start chat session. Please try again.");
        console.error("❌ Chat session init:", err);
      }
    })();
  }, [isOpen, subjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when subjectId changes (user switched subject)
  useEffect(() => {
    setSessionId(null);
    setMessages([]);
    setMessageCount(0);
    setSendError(null);
  }, [subjectId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 250);
  }, [isOpen]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !sessionId || messageCount >= MAX_MESSAGES) return;

    setInput("");
    setSendError(null);
    setMessageCount((c) => c + 1);

    // Optimistically append user message + placeholder
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "", isStreaming: true },
    ]);
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }

      // Parse citations from response header
      let citations: Citation[] = [];
      try {
        const raw = res.headers.get("X-Citations");
        if (raw) citations = JSON.parse(raw);
      } catch {}

      if (!res.body) {
        throw new Error("No response body received from chat service.");
      }

      // Stream response text
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: accumulated,
            isStreaming: true,
          };
          return next;
        });
      }

      // Finalise
      const ungroundedPhrases = [
        "does not contain",
        "doesn't contain",
        "not mentioned in",
        "no information about",
        "not in the provided context",
        "not present in the context",
      ];
      const isUngrounded = ungroundedPhrases.some((phrase) =>
        accumulated.toLowerCase().includes(phrase)
      );

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: accumulated || "No response received.",
          citations: isUngrounded ? [] : citations,
          isStreaming: false,
        };
        return next;
      });
    } catch (err: any) {
      setSendError("Failed to get a response — please try again.");
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Please try again.",
          isStreaming: false,
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, messageCount]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  const atLimit = messageCount >= MAX_MESSAGES;
  const nearLimit = messageCount >= MAX_MESSAGES - 3 && !atLimit;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Chat panel */}
      <div
        className={`fixed bottom-0 right-0 lg:bottom-6 lg:right-6 w-full lg:w-[22rem] z-50
          flex flex-col rounded-t-2xl lg:rounded-2xl overflow-hidden shadow-2xl
          animate-slideUp ${
            isDark
              ? "bg-[#0f1623] border border-white/10"
              : "bg-white border border-gray-200"
          }`}
        style={{ height: "min(580px, 90dvh)" }}
      >
        {/* ── Header ── */}
        <div
          className={`flex items-center justify-between px-4 py-3.5 shrink-0 border-b ${
            isDark
              ? "bg-[#0a0f1a] border-white/8"
              : "bg-gray-50 border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p
                className={`text-sm font-bold leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                AI Study Assistant
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
          <div className="flex items-center gap-2">
            {atLimit && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isDark
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                Limit reached
              </span>
            )}
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
          </div>
        </div>

        {/* ── Messages area ── */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin ${
            isDark ? "bg-[#0f1623]" : "bg-white"
          }`}
        >
          {/* Init error */}
          {initError && (
            <div
              className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl border ${
                isDark
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-red-50 text-red-600 border-red-100"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {initError}
            </div>
          )}

          {/* Empty state */}
          {messages.length === 0 && !initError && (
            <div className="flex flex-col items-center text-center gap-4 pt-6">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-indigo-500/10" : "bg-indigo-50"
                }`}
              >
                <BookOpen className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Ask about {subjectName}
                </p>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Answers are grounded in the subject&apos;s study material
                </p>
              </div>
              {/* Quick prompts */}
              <div className="w-full space-y-1.5">
                {[
                  `Explain the key concepts in ${subjectName}`,
                  "Summarize Unit 1 for me",
                  "What are the most important exam topics?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "border-white/8 text-gray-400 hover:bg-white/5 hover:border-white/15"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] flex flex-col gap-1 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm"
                      : isDark
                      ? "bg-white/6 border border-white/8 text-gray-200 rounded-bl-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {/* Typing dots */}
                  {msg.isStreaming && !msg.content && (
                    <span className="flex gap-1 items-center h-5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                            isDark ? "bg-gray-400" : "bg-gray-400"
                          }`}
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  )}
                  <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                  {/* Blinking cursor while streaming */}
                  {msg.isStreaming && msg.content && (
                    <span className="inline-block w-[2px] h-[14px] bg-current opacity-60 animate-pulse ml-0.5 align-text-bottom" />
                  )}
                </div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {msg.citations.map((c, ci) => (
                      <span
                        key={ci}
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
                          isDark
                            ? "bg-indigo-500/8 border-indigo-500/20 text-indigo-400"
                            : "bg-indigo-50 border-indigo-100 text-indigo-600"
                        }`}
                      >
                        <BookOpen className="w-2.5 h-2.5" />
                        {c.section}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Send error */}
          {sendError && (
            <div
              className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${
                isDark
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {sendError}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Near-limit warning */}
        {nearLimit && (
          <div
            className={`text-[11px] text-center py-1.5 border-t ${
              isDark
                ? "text-amber-400/70 border-white/5 bg-amber-500/5"
                : "text-amber-600/70 border-gray-100 bg-amber-50/60"
            }`}
          >
            {MAX_MESSAGES - messageCount} messages left this session
          </div>
        )}

        {/* ── Input area ── */}
        <div
          className={`px-4 py-3 border-t shrink-0 ${
            isDark ? "border-white/8 bg-[#0a0f1a]" : "border-gray-100 bg-gray-50"
          }`}
        >
          {atLimit ? (
            <p
              className={`text-xs text-center py-1 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Session limit reached — refresh the page to start fresh.
            </p>
          ) : (
            <div
              className={`flex items-end gap-2 rounded-xl border px-3 py-2 transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 focus-within:border-indigo-500/50"
                  : "bg-white border-gray-200 focus-within:border-indigo-400"
              }`}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question…"
                rows={1}
                disabled={loading || !sessionId}
                className={`flex-1 resize-none bg-transparent text-sm outline-none max-h-28 ${
                  isDark
                    ? "text-white placeholder:text-gray-600"
                    : "text-gray-900 placeholder:text-gray-400"
                }`}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || !sessionId}
                className={`p-1.5 rounded-lg shrink-0 transition-all ${
                  input.trim() && !loading && sessionId
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 active:scale-95"
                    : isDark
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
          <p
            className={`text-[10px] text-center mt-1.5 ${
              isDark ? "text-gray-700" : "text-gray-400"
            }`}
          >
            AI-generated · verify important information
          </p>
        </div>
      </div>
    </>
  );
}
