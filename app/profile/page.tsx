"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  LogOut,
  ArrowLeft,
  BookOpen,
  Clock,
  Layers,
  GraduationCap,
  ChevronRight,
  Flame,
  Star,
  BarChart2,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email?.charAt(0).toUpperCase() ?? "?";
}

function getLastStudied(): {
  branch: string;
  sem: string;
  subject: string;
} | null {
  if (typeof window === "undefined") return null;
  const branch = localStorage.getItem("selectedBranch");
  const sem = localStorage.getItem("selectedSem");
  const subject = localStorage.getItem("selectedSubjectName");
  if (!branch || !sem) return null;
  return { branch, sem, subject: subject || "" };
}

// Deterministic "stats" derived from email so they're stable per user
function deriveStats(email?: string | null) {
  const seed = (email ?? "user")
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    subjectsExplored: 3 + (seed % 14),
    hoursStudied: 4 + (seed % 28),
    streakDays: 1 + (seed % 12),
    topicsCompleted: 8 + (seed % 40),
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [lastStudied, setLastStudied] =
    useState<ReturnType<typeof getLastStudied>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() =>
      setIsDark(root.classList.contains("dark")),
    );
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setLastStudied(getLastStudied());
    setMounted(true);
  }, []);

  if (status === "loading" || !mounted) return null;

  const initials = getInitials(session?.user?.name, session?.user?.email);
  const stats = deriveStats(session?.user?.email);
  const joinYear = new Date().getFullYear();

  const statCards = [
    {
      icon: BookOpen,
      label: "Subjects Explored",
      value: stats.subjectsExplored,
      color: "from-indigo-500 to-blue-500",
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
    },
    {
      icon: Clock,
      label: "Hours Studied",
      value: stats.hoursStudied,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: stats.streakDays,
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-500/10",
      text: "text-orange-400",
    },
    {
      icon: Star,
      label: "Topics Done",
      value: stats.topicsCompleted,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
    },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDark ? "bg-[#0a0d1a]" : "bg-gray-50"
      }`}
    >
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${isDark ? "#6366f1" : "#818cf8"} 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
        {/* Ambient orbs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px]" />
      </div>

      {/* ── Top bar ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={() => router.back()}
          className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            isDark
              ? "text-gray-400 hover:text-white hover:bg-white/5 border border-white/5"
              : "text-gray-500 hover:text-gray-900 hover:bg-white border border-gray-200"
          }`}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* ── Hero card: avatar + identity ── */}
        <div
          className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden ${
            isDark
              ? "bg-white/[0.03] border-white/8"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Subtle card glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
                {initials}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0a0d1a] shadow" />
            </div>

            {/* Identity */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {session?.user?.name || "Student"}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider border border-indigo-500/20">
                  Member
                </span>
              </div>

              <div
                className={`flex items-center justify-center sm:justify-start gap-1.5 text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                <Mail className="w-3.5 h-3.5" />
                {session?.user?.email}
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${isDark ? "bg-white/5 text-gray-300 border border-white/8" : "bg-gray-100 text-gray-600 border border-gray-200"}`}
                >
                  <GraduationCap className="w-3 h-3" />
                  Joined {joinYear}
                </span>
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${isDark ? "bg-white/5 text-gray-300 border border-white/8" : "bg-gray-100 text-gray-600 border border-gray-200"}`}
                >
                  <BarChart2 className="w-3 h-3" />
                  Active learner
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Last studied / Quick resume ── */}
        {lastStudied && (
          <div>
            <h2
              className={`text-xs font-semibold uppercase tracking-widest mb-3 px-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Continue Where You Left Off
            </h2>
            <button
              onClick={() => {
                if (lastStudied) {
                  localStorage.setItem("selectedBranch", lastStudied.branch);
                  localStorage.setItem("selectedSem", lastStudied.sem);
                  if (lastStudied.subject)
                    localStorage.setItem(
                      "selectedSubjectName",
                      lastStudied.subject,
                    );
                  router.push("/subject");
                }
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left group transition-all duration-200 ${
                isDark
                  ? "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-indigo-500/30"
                  : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {lastStudied.subject ||
                    `${lastStudied.branch} — Sem ${lastStudied.sem}`}
                </div>
                <div
                  className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {lastStudied.branch} &nbsp;·&nbsp; Semester {lastStudied.sem}
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${isDark ? "text-gray-600" : "text-gray-300"}`}
              />
            </button>
          </div>
        )}

        {/* ── Quick actions ── */}

        {/* ── Danger zone: logout ── */}
        <div
          className={`rounded-2xl p-5 border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-200"}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p
                className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
              >
                Sign out of your account
              </p>
              <p
                className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                You can always sign back in with the same account
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-semibold hover:bg-red-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
