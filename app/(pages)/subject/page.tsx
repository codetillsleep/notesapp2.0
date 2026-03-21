"use client";
import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  BookOpen,
  FileText,
  Video,
  FlaskRound,
  GraduationCap,
  Menu,
  X,
  Layers,
  Play,
} from "lucide-react";
import Loader from "@/components/Loader";
import TopBar from "@/components/topBar";
import { useTheme } from "@/hooks/useTheme";
import { t } from "@/lib/theme";

// ── Helpers ───────────────────────────────────────────────────────────────────

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const getYoutubeThumbnail = (url: string): string | null => {
  try {
    const videoId = url.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
    const playlistId = url.match(/list=([^&]+)/)?.[1];
    if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    if (playlistId) return `https://i.ytimg.com/vi/${playlistId}/hqdefault.jpg`;
  } catch {}
  return null;
};

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string | number;
  isDark: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center px-4 py-3 rounded-xl ${
        isDark
          ? "bg-white/5 border border-white/8"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <span className={`text-xs ${t.subtext(isDark)}`}>{label}</span>
      <span className={`text-sm font-semibold ${t.heading(isDark)}`}>
        {value}
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SubjectPage() {
  const { isDark } = useTheme();

  const [openUnits, setOpenUnits] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("syllabus");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Drag-to-scroll for subject pills
  const dragScrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    drag.current = {
      isDown: true,
      startX: e.pageX - (dragScrollRef.current?.offsetLeft ?? 0),
      scrollLeft: dragScrollRef.current?.scrollLeft ?? 0,
    };
    dragScrollRef.current?.classList.add("cursor-grabbing");
  };
  const stopDrag = () => {
    drag.current.isDown = false;
    dragScrollRef.current?.classList.remove("cursor-grabbing");
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.isDown || !dragScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - dragScrollRef.current.offsetLeft;
    dragScrollRef.current.scrollLeft =
      drag.current.scrollLeft - (x - drag.current.startX) * 2;
  };

  // Load subjects
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/subjects", { cache: "no-store" });
        const data = await res.json();
        setSubjects(data || []);
      } catch (err) {
        console.error("❌ Error loading subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const applySelection = () => {
    const branch = localStorage.getItem("selectedBranch");
    const sem = localStorage.getItem("selectedSem");
    const subjName = localStorage.getItem("selectedSubjectName");
    if (branch) setSelectedBranch(branch);
    if (sem) setSelectedSem(Number(sem));
    if (subjects.length && subjName) {
      const match = subjects.find(
        (s) =>
          s.name.toLowerCase() === subjName.toLowerCase() &&
          s.branch.includes(branch) &&
          s.semester.includes(Number(sem)),
      );
      if (match) setSelectedSubject(match);
    }
  };

  useEffect(() => {
    if (subjects.length > 0) applySelection();
  }, [subjects]);

  useEffect(() => {
    window.addEventListener("subject-selection", applySelection);
    return () =>
      window.removeEventListener("subject-selection", applySelection);
  }, [subjects]);

  const toggleUnit = (idx: number) =>
    setOpenUnits((prev) =>
      prev.includes(idx) ? prev.filter((u) => u !== idx) : [...prev, idx],
    );

  const filteredSubjects = subjects.filter(
    (s) =>
      s.branch.includes(selectedBranch ?? "") &&
      s.semester.includes(selectedSem ?? 0),
  );

  const allBranches = [
    ...new Set(subjects.flatMap((s) => s.branch)),
  ] as string[];
  const allSems = [
    ...new Set(subjects.flatMap((s) => s.semester)),
  ].sort() as number[];

  const tabsConfig = [
    { id: "syllabus", label: "Syllabus", icon: BookOpen },
    ...(selectedSubject?.lab && Object.keys(selectedSubject.lab).length > 0
      ? [{ id: "lab", label: "Lab", icon: FlaskRound }]
      : []),
    { id: "questions", label: "Questions", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen ${t.bg(isDark)}`}>
      <TopBar />

      {/* Background atmosphere — matches Hero */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${
              isDark ? "#6366f1" : "#a5b4fc"
            } 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Mobile sidebar FAB */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30 transition-transform hover:scale-105"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="relative z-10 pt-20 px-4 md:px-6 lg:px-8 pb-10">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* ══════════════════════════════════════════════════
                  LEFT SIDEBAR
              ══════════════════════════════════════════════════ */}
              <aside
                className={`
                  fixed lg:sticky lg:top-24 left-0 top-0 h-full lg:h-auto w-72
                  transition-transform duration-300 ease-in-out z-40 lg:z-0
                  ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                  ${isDark ? "bg-[#0a0d1a]/95 lg:bg-transparent" : "bg-white/95 lg:bg-transparent"}
                  backdrop-blur-xl lg:backdrop-blur-none
                  overflow-y-auto lg:overflow-visible
                  pt-20 lg:pt-0 px-4 lg:px-0 shrink-0
                `}
              >
                <div className="flex flex-col gap-4 pb-24 lg:pb-0">
                  {/* Branch & Semester card */}
                  <div className={`rounded-2xl p-5 border ${t.card(isDark)}`}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-indigo-400" />
                      </div>
                      <h2 className={`text-sm font-bold ${t.heading(isDark)}`}>
                        Branch & Semester
                      </h2>
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* Branch Dropdown */}
                      <div>
                        <label
                          className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ml-0.5 ${t.muted(isDark)}`}
                        >
                          Branch
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => {
                              setBranchOpen(!branchOpen);
                              setSemesterOpen(false);
                            }}
                            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-all duration-200 border focus:outline-none ${
                              branchOpen
                                ? "border-indigo-500/50 bg-indigo-500/5"
                                : isDark
                                  ? "bg-white/5 border-white/10 text-white hover:border-white/20"
                                  : "bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300"
                            }`}
                          >
                            <span
                              className={
                                selectedBranch
                                  ? t.heading(isDark)
                                  : t.muted(isDark)
                              }
                            >
                              {selectedBranch || "Select Branch"}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-indigo-400 transition-transform duration-200 ${branchOpen ? "rotate-180" : ""}`}
                            />
                          </button>

                          {branchOpen && (
                            <div
                              className={`absolute z-50 w-full mt-1.5 rounded-xl border overflow-hidden shadow-2xl ${t.popover(isDark)}`}
                            >
                              {allBranches.map((br) => (
                                <button
                                  key={br}
                                  onClick={() => {
                                    setSelectedBranch(br);
                                    setBranchOpen(false);
                                    setSidebarOpen(false);
                                    localStorage.setItem("selectedBranch", br);
                                    localStorage.removeItem(
                                      "selectedSubjectName",
                                    );
                                    setSelectedSubject(null);
                                    window.dispatchEvent(
                                      new Event("subject-selection"),
                                    );
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                    selectedBranch === br
                                      ? "text-indigo-400 bg-indigo-500/10"
                                      : `${t.heading(isDark)} ${t.dropdownRow(isDark)}`
                                  }`}
                                >
                                  {br}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Semester Dropdown */}
                      {selectedBranch && (
                        <div>
                          <label
                            className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ml-0.5 ${t.muted(isDark)}`}
                          >
                            Semester
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => {
                                setSemesterOpen(!semesterOpen);
                                setBranchOpen(false);
                              }}
                              className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-all duration-200 border focus:outline-none ${
                                semesterOpen
                                  ? "border-indigo-500/50 bg-indigo-500/5"
                                  : isDark
                                    ? "bg-white/5 border-white/10 text-white hover:border-white/20"
                                    : "bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300"
                              }`}
                            >
                              <span
                                className={
                                  selectedSem
                                    ? t.heading(isDark)
                                    : t.muted(isDark)
                                }
                              >
                                {selectedSem
                                  ? `Semester ${selectedSem}`
                                  : "Select Semester"}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-indigo-400 transition-transform duration-200 ${semesterOpen ? "rotate-180" : ""}`}
                              />
                            </button>

                            {semesterOpen && (
                              <div
                                className={`absolute z-50 w-full mt-1.5 rounded-xl border overflow-hidden shadow-2xl ${t.popover(isDark)}`}
                              >
                                {allSems.map((sem) => (
                                  <button
                                    key={sem}
                                    onClick={() => {
                                      setSelectedSem(sem);
                                      setSemesterOpen(false);
                                      setSidebarOpen(false);
                                      localStorage.setItem(
                                        "selectedSem",
                                        String(sem),
                                      );
                                      localStorage.removeItem(
                                        "selectedSubjectName",
                                      );
                                      setSelectedSubject(null);
                                      window.dispatchEvent(
                                        new Event("subject-selection"),
                                      );
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                      selectedSem === sem
                                        ? "text-indigo-400 bg-indigo-500/10"
                                        : `${t.heading(isDark)} ${t.dropdownRow(isDark)}`
                                    }`}
                                  >
                                    Semester {sem}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject details card */}
                  {selectedSubject && (
                    <div
                      className={`rounded-2xl p-5 border animate-fadeIn ${t.card(isDark)}`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h2
                          className={`text-sm font-bold ${t.heading(isDark)}`}
                        >
                          Subject Details
                        </h2>
                      </div>

                      <div className="flex flex-col gap-2">
                        <InfoRow
                          label="Theory Code"
                          value={selectedSubject.code}
                          isDark={isDark}
                        />
                        <InfoRow
                          label="Theory Credits"
                          value={selectedSubject.theoryCredits}
                          isDark={isDark}
                        />
                        {selectedSubject.labCode &&
                          selectedSubject.labCode !== "0" && (
                            <InfoRow
                              label="Lab Code"
                              value={selectedSubject.labCode}
                              isDark={isDark}
                            />
                          )}
                        {selectedSubject.labCredits != null &&
                          selectedSubject.labCredits !== 0 && (
                            <InfoRow
                              label="Lab Credits"
                              value={selectedSubject.labCredits}
                              isDark={isDark}
                            />
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Mobile sidebar overlay */}
              {sidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              {/* ══════════════════════════════════════════════════
                  RIGHT PANEL
              ══════════════════════════════════════════════════ */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                {/* Subject pills — horizontal scroll */}
                <div
                  ref={dragScrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={stopDrag}
                  onMouseUp={stopDrag}
                  onMouseMove={handleMouseMove}
                  className={`rounded-2xl p-4 border overflow-x-auto no-scrollbar cursor-grab select-none ${t.card(isDark)}`}
                >
                  {filteredSubjects.length === 0 ? (
                    <p
                      className={`text-sm text-center py-1 ${t.muted(isDark)}`}
                    >
                      {selectedBranch && selectedSem
                        ? "No subjects found for this selection."
                        : "Select a branch and semester to see subjects."}
                    </p>
                  ) : (
                    <div className="flex gap-2.5 flex-nowrap">
                      {filteredSubjects.map((subj) => (
                        <button
                          key={subj._id}
                          onClick={() => {
                            setSelectedSubject(subj);
                            setActiveTab("syllabus");
                            localStorage.setItem(
                              "selectedSubjectName",
                              subj.name,
                            );
                            window.dispatchEvent(
                              new Event("subject-selection"),
                            );
                            setSidebarOpen(false);
                          }}
                          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            selectedSubject?._id === subj._id
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 scale-105"
                              : t.ghostBtn(isDark)
                          }`}
                        >
                          {capitalize(subj.name)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main content area */}
                {selectedSubject ? (
                  <div
                    className={`rounded-2xl border flex-1 animate-slideUp overflow-hidden ${t.card(isDark)}`}
                  >
                    {/* Subject header */}
                    <div
                      className={`px-6 py-5 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                          <Layers className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h1
                            className={`text-lg font-bold ${t.heading(isDark)}`}
                          >
                            {capitalize(selectedSubject.name)}
                          </h1>
                          <p className={`text-xs ${t.muted(isDark)}`}>
                            {selectedBranch} &nbsp;·&nbsp; Semester{" "}
                            {selectedSem}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div
                      className={`px-6 pt-4 pb-0 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}
                    >
                      <div className="flex gap-1 overflow-x-auto no-scrollbar">
                        {tabsConfig.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 -mb-px ${
                                isActive
                                  ? "text-indigo-400 border-indigo-500 bg-indigo-500/5"
                                  : `border-transparent ${t.subtext(isDark)} hover:${t.heading(isDark)} ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tab content */}
                    <div className="p-5 md:p-6">
                      {/* ── Syllabus ── */}
                      {activeTab === "syllabus" && (
                        <div className="flex flex-col gap-2.5">
                          {Object.entries(selectedSubject.syllabus || {}).map(
                            ([unit, content], idx) => (
                              <div
                                key={unit}
                                className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                                  isDark
                                    ? "border-white/8 hover:border-indigo-500/30"
                                    : "border-gray-200 hover:border-indigo-300"
                                }`}
                              >
                                <button
                                  onClick={() => toggleUnit(idx)}
                                  className={`flex justify-between items-center w-full px-5 py-3.5 text-left text-sm font-semibold transition-colors ${
                                    openUnits.includes(idx)
                                      ? isDark
                                        ? "bg-indigo-500/5 text-indigo-300"
                                        : "bg-indigo-50 text-indigo-700"
                                      : `${t.heading(isDark)} ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`
                                  }`}
                                >
                                  <span>{unit}</span>
                                  <ChevronDown
                                    className={`w-4 h-4 text-indigo-400 transition-transform duration-200 ${
                                      openUnits.includes(idx)
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>
                                {openUnits.includes(idx) && (
                                  <div
                                    className={`px-5 py-4 text-sm leading-relaxed border-t ${
                                      isDark
                                        ? "border-white/5 text-gray-300 bg-white/[0.02]"
                                        : "border-gray-100 text-gray-600 bg-gray-50/50"
                                    }`}
                                  >
                                    {content as string}
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      )}

                      {/* ── Lab ── */}
                      {activeTab === "lab" &&
                        selectedSubject.lab &&
                        Object.keys(selectedSubject.lab).length > 0 && (
                          <div className="flex flex-col gap-3">
                            {Object.entries(selectedSubject.lab).map(
                              ([exp, details]) => (
                                <div
                                  key={exp}
                                  className={`rounded-xl p-4 border ${
                                    isDark
                                      ? "bg-white/[0.02] border-white/8"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                      <FlaskRound className="w-3.5 h-3.5 text-indigo-400" />
                                    </div>
                                    <div>
                                      <p
                                        className={`font-semibold text-sm mb-1 ${t.heading(isDark)}`}
                                      >
                                        {capitalize(exp)}
                                      </p>
                                      <p
                                        className={`text-sm leading-relaxed ${t.subtext(isDark)}`}
                                      >
                                        {details as string}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                      {/* ── Questions ── */}
                      {activeTab === "questions" && (
                        <div className="flex flex-col gap-2.5">
                          {selectedSubject.questions?.length ? (
                            selectedSubject.questions.map((q: any) => (
                              <a
                                key={q._id || q.title}
                                href={q.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 hover:border-indigo-500/40 hover:scale-[1.01] ${
                                  isDark
                                    ? "bg-white/[0.02] border-white/8 hover:bg-indigo-500/5"
                                    : "bg-white border-gray-200 hover:bg-indigo-50/50 hover:shadow-sm"
                                }`}
                              >
                                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-indigo-400" />
                                </div>
                                <span
                                  className={`text-sm font-medium flex-1 ${t.heading(isDark)}`}
                                >
                                  {q.title}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 -rotate-90 transition-transform group-hover:translate-x-0.5 ${t.muted(isDark)}`}
                                />
                              </a>
                            ))
                          ) : (
                            <EmptyState
                              icon={FileText}
                              label="No question papers yet."
                              isDark={isDark}
                            />
                          )}
                        </div>
                      )}

                      {/* ── Videos ── */}
                      {activeTab === "videos" && (
                        <div>
                          {selectedSubject.videos?.length ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {selectedSubject.videos.map((v: any) => {
                                const thumb = getYoutubeThumbnail(v.url);
                                return (
                                  <a
                                    key={v._id || v.title}
                                    href={v.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group rounded-xl overflow-hidden border transition-all duration-200 hover:scale-[1.02] hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 ${
                                      isDark
                                        ? "bg-white/[0.02] border-white/8"
                                        : "bg-white border-gray-200"
                                    }`}
                                  >
                                    {thumb ? (
                                      <div className="relative overflow-hidden">
                                        <img
                                          src={thumb}
                                          alt={v.title}
                                          className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Play overlay */}
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                          <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center">
                                            <Play className="w-5 h-5 text-indigo-600 ml-0.5" />
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className={`w-full h-36 flex items-center justify-center ${
                                          isDark ? "bg-white/5" : "bg-gray-100"
                                        }`}
                                      >
                                        <Video
                                          className={`w-10 h-10 ${t.muted(isDark)}`}
                                        />
                                      </div>
                                    )}
                                    <div className="p-3.5">
                                      <p
                                        className={`text-sm font-semibold text-center leading-snug ${t.heading(isDark)}`}
                                      >
                                        {capitalize(v.title)}
                                      </p>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          ) : (
                            <EmptyState
                              icon={Video}
                              label="No videos added yet."
                              isDark={isDark}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Empty state when no subject selected */
                  <div
                    className={`rounded-2xl border flex-1 flex flex-col items-center justify-center py-24 ${t.card(isDark)}`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                      <Layers className="w-7 h-7 text-indigo-400" />
                    </div>
                    <p
                      className={`text-base font-semibold mb-1 ${t.heading(isDark)}`}
                    >
                      No subject selected
                    </p>
                    <p className={`text-sm ${t.muted(isDark)}`}>
                      Pick a branch, semester, and subject to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// ── Empty state helper ────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  label,
  isDark,
}: {
  icon: React.ElementType;
  label: string;
  isDark: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-indigo-400" />
      </div>
      <p className={`text-sm ${t.muted(isDark)}`}>{label}</p>
    </div>
  );
}
