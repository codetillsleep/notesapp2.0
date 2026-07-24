"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Mail,
  LogOut,
  BookOpen,
  Layers,
  GraduationCap,
  ChevronRight,
  Target,
  Edit3,
  Check,
  Trash2,
  Plus,
} from "lucide-react";
import TopBar from "@/components/topBar";
import { useTheme } from "@/hooks/useTheme";

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email?.charAt(0).toUpperCase() ?? "?";
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [branch, setBranch] = useState("CSAM");
  const [sem, setSem] = useState("3");
  const [targetGpa, setTargetGpa] = useState("9.5");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [lastSubject, setLastSubject] = useState("");
  
  // Student Personal Sticky Notes (localStorage)
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBranch = localStorage.getItem("selectedBranch") || "CSAM";
      const savedSem = localStorage.getItem("selectedSem") || "3";
      const savedSubj = localStorage.getItem("selectedSubjectName") || "";
      const savedGpa = localStorage.getItem("targetGpa") || "9.5";
      const savedNotesRaw = localStorage.getItem("studentNotes");

      setBranch(savedBranch);
      setSem(savedSem);
      setLastSubject(savedSubj);
      setTargetGpa(savedGpa);
      
      if (savedNotesRaw) {
        try {
          setNotes(JSON.parse(savedNotesRaw));
        } catch {}
      }
    }
    setMounted(true);
  }, []);

  const handleSaveGoal = () => {
    localStorage.setItem("selectedBranch", branch);
    localStorage.setItem("selectedSem", sem);
    localStorage.setItem("targetGpa", targetGpa);
    window.dispatchEvent(new Event("subject-selection"));
    setIsEditingGoal(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updated = [newNote.trim(), ...notes];
    setNotes(updated);
    localStorage.setItem("studentNotes", JSON.stringify(updated));
    setNewNote("");
  };

  const handleDeleteNote = (idx: number) => {
    const updated = notes.filter((_, i) => i !== idx);
    setNotes(updated);
    localStorage.setItem("studentNotes", JSON.stringify(updated));
  };

  if (status === "loading" || !mounted) return null;

  const initials = getInitials(session?.user?.name, session?.user?.email);

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#080b18] text-white" : "bg-slate-50 text-gray-900"}`}>
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-6">

        {/* ── Profile Card ── */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border relative overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-indigo-950/40 via-[#0b0f24] to-[#080b18] border-white/10"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
                  {initials}
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                  {session?.user?.name || "Student Profile"}
                </h1>

                <div className={`flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm mb-3.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <Mail className="w-3.5 h-3.5" /> {session?.user?.email}
                </div>

                {/* Real Academic Badges */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <GraduationCap className="w-3.5 h-3.5" /> Branch: {branch}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Layers className="w-3.5 h-3.5" /> Semester {sem}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Target className="w-3.5 h-3.5" /> Target {targetGpa} GPA
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Goal Button */}
            <button
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                isEditingGoal
                  ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
                  : isDark
                  ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditingGoal ? "Close Editor" : "Edit Academic Info"}
            </button>
          </div>

          {/* Academic Preference Editor */}
          {isEditingGoal && (
            <div className="relative z-10 mt-6 pt-6 border-t border-indigo-500/20 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-indigo-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Update Your Academic Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold border outline-none ${
                      isDark ? "bg-[#0f1628] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="CSAM">CSAM</option>
                    <option value="CYBER">CYBER SECURITY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Semester</label>
                  <select
                    value={sem}
                    onChange={(e) => setSem(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold border outline-none ${
                      isDark ? "bg-[#0f1628] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Target GPA</label>
                  <input
                    type="text"
                    value={targetGpa}
                    onChange={(e) => setTargetGpa(e.target.value)}
                    placeholder="e.g. 9.5"
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold border outline-none ${
                      isDark ? "bg-[#0f1628] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>
              <button
                onClick={handleSaveGoal}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-all flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-3.5 h-3.5" /> Save Preferences
              </button>
            </div>
          )}
        </div>

        {/* ── Continue Learning & Quick Links ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Continue Learning */}
          <div
            onClick={() => {
              if (lastSubject) {
                localStorage.setItem("selectedSubjectName", lastSubject);
              }
              router.push("/subject?from=home");
            }}
            className={`p-5 rounded-2xl border cursor-pointer group transition-all flex items-center justify-between gap-4 ${
              isDark
                ? "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-indigo-500/40"
                : "bg-white border-gray-200 hover:border-indigo-300 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">
                  Continue Learning
                </div>
                <div className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                  {lastSubject || "Browse All Subjects"}
                </div>
                <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {branch} &nbsp;·&nbsp; Sem {sem}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* All Subjects Directory Shortcut */}
          <div
            onClick={() => router.push("/subject?view=catalog")}
            className={`p-5 rounded-2xl border cursor-pointer group transition-all flex items-center justify-between gap-4 ${
              isDark
                ? "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-indigo-500/40"
                : "bg-white border-gray-200 hover:border-indigo-300 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">All Subjects Directory</div>
                <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Explore full syllabus index
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ── Student Personal Notes ── */}
        <div
          className={`p-6 rounded-2xl border ${
            isDark ? "bg-white/[0.03] border-white/8" : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Study Notes & Reminders
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              placeholder="Type a quick study task or reminder..."
              className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400"
              }`}
            />
            <button
              onClick={handleAddNote}
              className="px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-all shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            {notes.length === 0 ? (
              <p className={`text-xs text-center py-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                No personal notes saved. Add tasks above to keep track of your study schedule.
              </p>
            ) : (
              notes.map((note, idx) => (
                <div
                  key={idx}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl border text-xs leading-relaxed ${
                    isDark ? "bg-white/4 border-white/6 text-gray-300" : "bg-gray-50 border-gray-100 text-gray-700"
                  }`}
                >
                  <span className="flex-1">{note}</span>
                  <button
                    onClick={() => handleDeleteNote(idx)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-0.5"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Sign Out Container ── */}
        <div
          className={`rounded-2xl p-5 border ${
            isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className={`text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                Sign out of account
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Signed in as {session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 shrink-0"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
