"use client";
import React from "react";
import { GitBranch, Sparkles, CheckCircle2, Cpu, Server, Rocket } from "lucide-react";
import TopBar from "@/components/topBar";
import { useTheme } from "@/hooks/useTheme";

const devLogs = [
  {
    version: "10GPA v2.1",
    date: "July 2026",
    tag: "v2.1",
    icon: Cpu,
    highlight: "Frontend Caching & RAG AI Integration",
    details: [
      "Introduced in-memory frontend singleton caching (subjectsCache.ts) with 15-minute stale-time",
      "Implemented in-flight request deduplication to eliminate redundant /api/subjects network calls between TopBar & SubjectPage",
      "Integrated RAG-powered Gemini AI Study Assistant with vector embeddings (text-embedding-004) and cosine similarity retrieval",
      "Added AI Practice Quiz and Flashcard generators with robust JSON fence sanitization and error fallback",
      "Built interactive All-Subjects Directory with custom sem/branch tag formatting (e.g. sem 3 csam, sem 3 cyber sec)",
    ],
  },
  {
    version: "10GPA v2.0",
    date: "March 2026",
    tag: "v2.0",
    icon: Server,
    highlight: "Full-Stack Next.js Monolith Overhaul",
    details: [
      "Migrated from separate Flask backend to pure Next.js full-stack monolith architecture (Route Handlers & Server Components)",
      "Shifted database from PostgreSQL to MongoDB & Mongoose schemas for flexible syllabus and chat session storage",
      "Integrated NextAuth authentication supporting credentials and OAuth (Google & GitHub) providers with auto-guest fallback",
      "Complete UI overhaul with responsive light/dark themes, glassmorphic cards, and dynamic search suggestions",
    ],
  },
  {
    version: "10GPA v1.0",
    date: "October 2025",
    tag: "v1.0",
    icon: Rocket,
    highlight: "Initial Launch (Flask & Next.js)",
    details: [
      "First release of 10GPA built to consolidate scattered study materials for GGSIPU CSAM & Cyber Security students",
      "Built initial architecture using a Python Flask REST API backend, Next.js frontend, and PostgreSQL database",
      "Provided basic subject browsing, syllabus viewing, and PYQs repository",
    ],
  },
];

export default function DevLogsPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#080b18] text-white" : "bg-slate-50 text-gray-900"}`}>
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitBranch className="w-3.5 h-3.5" /> Platform Timeline
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Development Logs
          </h1>
          <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            The evolution of 10GPA — from a simple Flask & Postgres app to a full-stack Next.js monolith with frontend caching and RAG AI features.
          </p>
        </div>

        {/* Log Entries */}
        <div className="space-y-6">
          {devLogs.map((log, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 sm:p-8 border transition-all ${
                isDark
                  ? "bg-white/[0.03] border-white/8 hover:border-indigo-500/30"
                  : "bg-white border-gray-200 shadow-sm hover:border-indigo-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-indigo-500/15 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
                    {log.tag}
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-indigo-400">
                    {log.version}
                  </h2>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                  {log.date}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm font-bold">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{log.highlight}</span>
              </div>

              <ul className="space-y-2.5">
                {log.details.map((item, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
