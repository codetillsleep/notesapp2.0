"use client";
import React from "react";

const devLogs = [
  {
    version: "10GPA 2.0 v0.1",
    date: "October 2025",
    highlight: "Revamped Structure & Design Launch",
    details: [
      "Complete UI overhaul with fresh minimal-dark aesthetic",
      "Integrated subject filtering based on Branch & Semester",
      "Introduced auto-navigation between pages using localStorage state",
      "Added detailed subject pages with syllabus, labs, videos, and PYQs",
      "Initial setup for Hero section with dropdown-based entry flow",
      "Refined component structure and introduced global constants for cleaner code",
    ],
  },
  // You can add future logs here:
  // {
  //   version: "10GPA 2.0 v0.2",
  //   date: "November 2025",
  //   highlight: "New subject upload system",
  //   details: [
  //     "Added admin panel for subject content updates",
  //     "Enhanced syllabus viewer with collapsible units",
  //     "Implemented smoother animations across components",
  //   ],
  // },
];

export default function DevLogsPage() {
  return (
    <section className="min-h-screen bg-background text-textbdy px-6 sm:px-10 lg:px-20 py-16 flex flex-col items-center">
      {/* Page Header */}
      <div className="max-w-5xl w-full text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-courgette text-prime mb-4 tracking-tight">
          Development Logs
        </h1>
        <p className="text-bdy text-lg font-tenor max-w-2xl mx-auto">
          Follow the evolution of{" "}
          <span className="text-prime font-semibold">10GPA</span> — track every
          improvement, design change, and new feature release.
        </p>
      </div>

      {/* Logs */}
      <div className="w-full max-w-5xl flex flex-col gap-10">
        {devLogs.map((log, index) => (
          <div
            key={index}
            className="bg-box border border-[#3f3f46] rounded-3xl p-8 shadow-lg hover:shadow-[0_0_12px_#7ed95755] transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#3f3f46] pb-4 mb-6">
              <h2 className="text-3xl font-bold text-prime font-tenor tracking-wider">
                {log.version}
              </h2>
              <span className="text-sm text-bdy/70 mt-2 sm:mt-0">
                {log.date}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-textbdy mb-4">
              ✨ {log.highlight}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-bdy text-sm sm:text-base">
              {log.details.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
