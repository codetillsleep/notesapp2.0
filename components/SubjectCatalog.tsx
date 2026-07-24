"use client";

import React, { useState, useMemo } from "react";
import { Search, BookOpen, Layers, Sparkles, ChevronRight, FileText, Video, FlaskRound, GraduationCap, Zap } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface SubjectItem {
  _id: string;
  name: string;
  code: string;
  labCode?: string;
  branch: string[];
  semester: number[];
  theoryCredits?: number;
  labCredits?: number;
  syllabus?: Record<string, string>;
  lab?: Record<string, string>;
  questions?: any[];
  videos?: any[];
}

interface SubjectCatalogProps {
  subjects: SubjectItem[];
  onSelectSubject: (subject: SubjectItem, branch: string, sem: number) => void;
}

/**
 * Formats semester and branch combinations into tags matching:
 * "sem 3 csam, sem 3 cyber sec"
 */
export function formatSemBranchTags(subject: SubjectItem): string {
  const branches = Array.isArray(subject.branch) ? subject.branch : [subject.branch].filter(Boolean);
  const sems = Array.isArray(subject.semester) ? subject.semester : [subject.semester].filter(Boolean);

  const tags: string[] = [];
  for (const sem of sems) {
    for (const br of branches) {
      let brName = String(br).toLowerCase();
      if (brName === "cyber" || brName === "cybersecurity") {
        brName = "cyber sec";
      }
      tags.push(`sem ${sem} ${brName}`);
    }
  }
  return tags.join(", ");
}

export default function SubjectCatalog({ subjects, onSelectSubject }: SubjectCatalogProps) {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("ALL");
  const [selectedSemFilter, setSelectedSemFilter] = useState<string>("ALL");

  // Extract unique branches & semesters
  const allBranches = useMemo(() => {
    const set = new Set<string>();
    subjects.forEach((s) => s.branch?.forEach((b) => set.add(b)));
    return Array.from(set);
  }, [subjects]);

  const allSemesters = useMemo(() => {
    const set = new Set<number>();
    subjects.forEach((s) => s.semester?.forEach((sem) => set.add(sem)));
    return Array.from(set).sort((a, b) => a - b);
  }, [subjects]);

  // Filtered list
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      // Search filter
      const q = searchQuery.trim().toLowerCase();
      const tagsText = formatSemBranchTags(s).toLowerCase();
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        tagsText.includes(q);

      // Branch filter
      const matchesBranch =
        selectedBranchFilter === "ALL" ||
        s.branch.includes(selectedBranchFilter);

      // Semester filter
      const matchesSem =
        selectedSemFilter === "ALL" ||
        s.semester.includes(Number(selectedSemFilter));

      return matchesQuery && matchesBranch && matchesSem;
    });
  }, [subjects, searchQuery, selectedBranchFilter, selectedSemFilter]);

  const handleCardClick = (subject: SubjectItem) => {
    // Pick first matching branch & sem based on current active filters
    let chosenBranch = subject.branch[0] || "CSAM";
    if (selectedBranchFilter !== "ALL" && subject.branch.includes(selectedBranchFilter)) {
      chosenBranch = selectedBranchFilter;
    }

    let chosenSem = subject.semester[0] || 3;
    if (selectedSemFilter !== "ALL" && subject.semester.includes(Number(selectedSemFilter))) {
      chosenSem = Number(selectedSemFilter);
    }

    onSelectSubject(subject, chosenBranch, chosenSem);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Catalog Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-indigo-950/60 via-[#0d1226] to-[#080b18] border-white/10"
            : "bg-gradient-to-br from-indigo-50 via-white to-slate-50 border-gray-200 shadow-sm"
        }`}
      >
        {/* Background glow orb */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5" /> Subject Directory
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              Explore All Subjects
            </h2>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Browse all engineering subjects available on 10GPA, complete with official syllabus, lab experiments, video lectures, and PYQs.
            </p>
          </div>

          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-semibold shrink-0 ${
            isDark ? "bg-white/5 border-white/10 text-gray-300" : "bg-white border-gray-200 text-gray-700 shadow-sm"
          }`}>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="font-extrabold text-sm">{subjects.length} Subjects</div>
              <div className="text-[10px] text-indigo-400 font-medium">Full GGSIPU Index</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-6 border-t border-indigo-500/15">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject name, code, or branch..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                isDark
                  ? "bg-white/6 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/60"
                  : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 shadow-sm"
              }`}
            />
          </div>

          {/* Branch Filter */}
          <div className="sm:col-span-3 flex gap-1 bg-white/4 p-1 rounded-xl border border-white/8">
            <button
              onClick={() => setSelectedBranchFilter("ALL")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedBranchFilter === "ALL"
                  ? "bg-indigo-500 text-white shadow-md"
                  : isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Branches
            </button>
            {allBranches.map((br) => (
              <button
                key={br}
                onClick={() => setSelectedBranchFilter(br)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedBranchFilter === br
                    ? "bg-indigo-500 text-white shadow-md"
                    : isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {br}
              </button>
            ))}
          </div>

          {/* Semester Filter */}
          <div className="sm:col-span-3 flex gap-1 bg-white/4 p-1 rounded-xl border border-white/8">
            <button
              onClick={() => setSelectedSemFilter("ALL")}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSemFilter === "ALL"
                  ? "bg-indigo-500 text-white shadow-md"
                  : isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Sems
            </button>
            {allSemesters.map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemFilter(String(sem))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSemFilter === String(sem)
                    ? "bg-indigo-500 text-white shadow-md"
                    : isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      {filteredSubjects.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/8 text-gray-400" : "bg-white border-gray-200 text-gray-500"}`}>
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-indigo-400 opacity-60" />
          <p className="font-semibold text-base">No subjects match your current filter.</p>
          <p className="text-xs mt-1 opacity-75">Try clearing your search query or selecting &quot;All Branches&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subj) => {
            const tagString = formatSemBranchTags(subj);
            const unitCount = subj.syllabus ? Object.keys(subj.syllabus).length : 0;
            const paperCount = subj.questions ? subj.questions.length : 0;
            const videoCount = subj.videos ? subj.videos.length : 0;

            return (
              <div
                key={subj._id}
                onClick={() => handleCardClick(subj)}
                className={`group relative rounded-2xl p-5 border cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between ${
                  isDark
                    ? "bg-white/[0.03] border-white/8 hover:bg-white/[0.07] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10"
                    : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md"
                }`}
              >
                {/* Top bar: Icon & Code */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      isDark
                        ? "bg-white/5 border-white/10 text-indigo-300"
                        : "bg-indigo-50 border-indigo-200 text-indigo-700"
                    }`}>
                      {subj.code}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-bold tracking-tight mb-2 group-hover:text-indigo-400 transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {subj.name}
                  </h3>

                  {/* Sem + Branch Tags string formatted: sem 3 csam, sem 3 cyber sec */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                      isDark
                        ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border-indigo-500/30 text-indigo-300"
                        : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 text-indigo-700"
                    }`}>
                      <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                      {tagString}
                    </span>
                  </div>
                </div>

                {/* Bottom stats & CTA */}
                <div className="pt-3 border-t border-white/6 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-gray-400">
                    {unitCount > 0 && (
                      <span className="flex items-center gap-1" title="Units in syllabus">
                        <BookOpen className="w-3 h-3 text-indigo-400" /> {unitCount} Units
                      </span>
                    )}
                    {paperCount > 0 && (
                      <span className="flex items-center gap-1" title="Question papers">
                        <FileText className="w-3 h-3 text-purple-400" /> {paperCount} PYQs
                      </span>
                    )}
                    {videoCount > 0 && (
                      <span className="flex items-center gap-1" title="Video lectures">
                        <Video className="w-3 h-3 text-pink-400" /> {videoCount} Videos
                      </span>
                    )}
                  </div>

                  <span className="text-indigo-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
