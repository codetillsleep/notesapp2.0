"use client";
import React from "react";
import Link from "next/link";
import { Github, Target, Sparkles, Code2, Mail, BookOpen } from "lucide-react";
import { SITE_TITLE, GITHUB_URL } from "@/app/constants/constants";
import TopBar from "@/components/topBar";
import { useTheme } from "@/hooks/useTheme";

export default function AboutPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#080b18] text-white" : "bg-slate-50 text-gray-900"}`}>
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5" /> Student Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            About {SITE_TITLE}
          </h1>
          <p className={`text-base sm:text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            <strong className="text-indigo-400">{SITE_TITLE}</strong> is a student-driven platform built to help underrepresented branches like{" "}
            <strong>CSAM</strong> (Computer Science & Applied Mathematics) and <strong>Cyber Security</strong> students at <strong>GGSIPU</strong>.
            These branches often struggle with scattered, incomplete, or outdated learning materials. {SITE_TITLE} solves that by consolidating all key academic resources — including subject playlists, official syllabus, assignment banks, and previous year questions — into one seamless space.
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border ${
              isDark ? "bg-white/[0.02] border-white/8" : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Our Mission</h2>
            </div>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Our goal is to make learning <strong>simple, accessible, and reliable</strong>. We want every GGSIPU student — especially from emerging branches — to have a single go-to space for organized study material and trustworthy resources. No more endless searching across Telegram channels, Drive folders, or random notes.
            </p>
          </div>

          {/* What We Offer */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border ${
              isDark ? "bg-white/[0.02] border-white/8" : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">What We Offer</h2>
            </div>
            <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {[
                "Structured subject lists by semester and branch",
                "Curated video playlists for each subject",
                "Official university syllabus breakdown",
                "Previous Year Questions (PYQs) for exam prep",
                "AI Study Assistant grounded in course materials",
                "AI Quiz & Flashcards revision generator",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Development */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border ${
              isDark ? "bg-white/[0.02] border-white/8" : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Development & Open Source</h2>
            </div>
            <p className={`text-sm sm:text-base leading-relaxed mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              <strong>{SITE_TITLE}</strong> is an open and evolving platform, built by students for students. The platform features an updated UI, subject search, and RAG-powered AI study tools.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
            >
              <Github className="w-4 h-4" /> View GitHub Repository
            </a>
          </div>

          {/* Contact */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border ${
              isDark ? "bg-white/[0.02] border-white/8" : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Contact Us</h2>
            </div>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Have feedback, ideas, or found an issue? Reach out at{" "}
              <a
                href="mailto:codetillsleep@gmail.com"
                className="text-indigo-400 font-semibold underline hover:opacity-80"
              >
                codetillsleep@gmail.com
              </a>{" "}
              — we&apos;d love to hear from you!
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs ${isDark ? "border-white/8 text-gray-500" : "border-gray-200 text-gray-400"}`}>
          <p>© {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.</p>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors mt-2 sm:mt-0">
            GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
}
