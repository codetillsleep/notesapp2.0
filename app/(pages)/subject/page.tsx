"use client";
import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  BookOpen,
  FileText,
  Video,
  FlaskRound,
  GraduationCap,
} from "lucide-react";
import Loader from "@/components/Loader";

export default function SubjectPage() {
  const [openUnits, setOpenUnits] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("syllabus");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);

  const dragScrollRef = useRef<any>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const handleMouseDown = (e: any) => {
    isDown = true;
    dragScrollRef.current.classList.add("cursor-grabbing");
    startX = e.pageX - dragScrollRef.current.offsetLeft;
    scrollLeft = dragScrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    dragScrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDown = false;
    dragScrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e: any) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - dragScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    dragScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // Get dark mode from document
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadSubjects = async () => {
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
    loadSubjects();
  }, []);

  const getYoutubeThumbnail = (url: string) => {
    try {
      const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
      const playlistIdMatch = url.match(/list=([^&]+)/);

      if (videoIdMatch) {
        return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
      }

      if (playlistIdMatch) {
        return `https://i.ytimg.com/vi/${playlistIdMatch[1]}/hqdefault.jpg`;
      }
    } catch (e) {}
    return null;
  };

  const applySelection = () => {
    const branch = localStorage.getItem("selectedBranch");
    const sem = localStorage.getItem("selectedSem");
    const subjName = localStorage.getItem("selectedSubjectName");

    if (branch) setSelectedBranch(branch);
    if (sem) setSelectedSem(Number(sem));

    if (subjects.length && subjName) {
      const match = subjects.find(
        (s: any) =>
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
    const handleSelectionChange = () => applySelection();
    window.addEventListener("subject-selection", handleSelectionChange);
    return () => {
      window.removeEventListener("subject-selection", handleSelectionChange);
    };
  }, [subjects]);

  const toggleUnit = (unit: number) =>
    setOpenUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit],
    );

  const filteredSubjects = subjects.filter(
    (s) =>
      s.branch.includes(selectedBranch || "") &&
      s.semester.includes(selectedSem || 0),
  );

  // Tabs array with icons
  const tabsConfig = [
    { id: "syllabus", label: "Syllabus", icon: BookOpen },
    ...(selectedSubject?.lab && Object.keys(selectedSubject.lab).length > 0
      ? [{ id: "lab", label: "Lab", icon: FlaskRound }]
      : []),
    { id: "questions", label: "Questions", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
  ];

  return (
    <div
      className={`min-h-screen  transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
      }`}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDark ? "opacity-10" : "opacity-30"
          }`}
          style={{
            animationDuration: "4s",
            backgroundColor: isDark
              ? `rgba(var(--primary-dark), 0.1)`
              : `rgba(var(--primary-light), 0.3)`,
          }}
        />
        <div
          className={`absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            isDark ? "opacity-10" : "opacity-20"
          }`}
          style={{
            animationDuration: "6s",
            animationDelay: "1s",
            backgroundColor: isDark
              ? `rgba(var(--secondary-dark), 0.1)`
              : `rgba(var(--secondary-light), 0.2)`,
          }}
        />
      </div>

      <div className="relative z-10 flex justify-center">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 w-fit">
            {/* LEFT PANEL */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              {/* Branch & Semester Selection */}
              <div
                className={`rounded-2xl p-6 backdrop-blur-xl border-2 transition-all duration-300 ${
                  isDark
                    ? "bg-slate-950 border-slate-900"
                    : "bg-white/80 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h2
                    className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    Branch & Semester
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Branch Dropdown */}
                  <div className="space-y-2">
                    <label
                      className={`block text-xs font-semibold ml-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      BRANCH
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setBranchOpen(!branchOpen);
                          setSemesterOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl border-2 font-medium text-left flex items-center justify-between transition-all duration-300 ${
                          isDark
                            ? "bg-slate-950 border-slate-900 text-white"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        } ${branchOpen ? "border-primary" : ""} hover:border-primary`}
                      >
                        <span
                          className={
                            selectedBranch
                              ? ""
                              : isDark
                                ? "text-slate-500"
                                : "text-slate-400"
                          }
                        >
                          {selectedBranch || "Select Branch"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-primary transition-transform duration-300 ${
                            branchOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {branchOpen && (
                        <div
                          className={`absolute z-50 w-full m-2 rounded-xl border-2 shadow-xl overflow-hidden animate-slideDown ${
                            isDark
                              ? "bg-slate-950 border-slate-900"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          {[...new Set(subjects.flatMap((s) => s.branch))].map(
                            (br) => (
                              <button
                                key={br}
                                onClick={() => {
                                  setSelectedBranch(br);
                                  setBranchOpen(false);
                                  localStorage.setItem("selectedBranch", br);
                                  localStorage.removeItem(
                                    "selectedSubjectName",
                                  );
                                  setSelectedSubject(null);
                                  window.dispatchEvent(
                                    new Event("subject-selection"),
                                  );
                                }}
                                className={`w-full px-4 py-2 text-left transition-colors ${
                                  isDark
                                    ? "hover:bg-slate-800 text-white"
                                    : "hover:bg-slate-50 text-slate-900"
                                } ${selectedBranch === br ? (isDark ? "bg-slate-800 text-primary" : "bg-slate-50 text-primary") : ""}`}
                              >
                                {br}
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Semester Dropdown */}
                  {selectedBranch && (
                    <div className="space-y-2">
                      <label
                        className={`block text-xs font-semibold ml-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                      >
                        SEMESTER
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => {
                            setSemesterOpen(!semesterOpen);
                            setBranchOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-xl border-2 font-medium text-left flex items-center justify-between transition-all duration-300 ${
                            isDark
                              ? "bg-slate-950 border-slate-900 text-white"
                              : "bg-slate-50 border-slate-300 text-slate-900"
                          } ${semesterOpen ? "border-primary" : ""} hover:border-primary`}
                        >
                          <span
                            className={
                              selectedSem
                                ? ""
                                : isDark
                                  ? "text-slate-500"
                                  : "text-slate-400"
                            }
                          >
                            {selectedSem
                              ? `Semester ${selectedSem}`
                              : "Select Semester"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-primary transition-transform duration-300 ${
                              semesterOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {semesterOpen && (
                          <div
                            className={`absolute z-50 w-full mt-2 rounded-xl border-2 shadow-xl overflow-hidden animate-slideDown ${
                              isDark
                                ? "bg-slate-950 border-slate-900"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            {[
                              ...new Set(subjects.flatMap((s) => s.semester)),
                            ].map((sem) => (
                              <button
                                key={sem}
                                onClick={() => {
                                  setSelectedSem(sem);
                                  setSemesterOpen(false);
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
                                className={`w-full px-4 py-2 text-left transition-colors ${
                                  isDark
                                    ? "hover:bg-slate-800 text-white"
                                    : "hover:bg-slate-50 text-slate-900"
                                } ${selectedSem === sem ? (isDark ? "bg-slate-800 text-primary" : "bg-slate-50 text-primary") : ""}`}
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

              {/* Subject Details */}
              {selectedSubject && (
                <div
                  className={`rounded-2xl p-6 backdrop-blur-xl border-2 transition-all duration-300 animate-fadeIn ${
                    isDark
                      ? "bg-slate-950 border-slate-900"
                      : "bg-white/80 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2
                      className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      Subject Details
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3 text-sm">
                    <div
                      className={`flex justify-between px-4 py-3 rounded-xl border ${
                        isDark
                          ? "border-slate-900 bg-slate-950/50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <span
                        className={isDark ? "text-slate-400" : "text-slate-600"}
                      >
                        Theory Code
                      </span>
                      <span
                        className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {selectedSubject.code}
                      </span>
                    </div>

                    <div
                      className={`flex justify-between px-4 py-3 rounded-xl border ${
                        isDark
                          ? "border-slate-900 bg-slate-950/50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <span
                        className={isDark ? "text-slate-400" : "text-slate-600"}
                      >
                        Theory Credits
                      </span>
                      <span
                        className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {selectedSubject.theoryCredits}
                      </span>
                    </div>

                    {selectedSubject.labCode &&
                      selectedSubject.labCode !== "0" && (
                        <div
                          className={`flex justify-between px-4 py-3 rounded-xl border ${
                            isDark
                              ? "border-slate-900 bg-slate-950/50"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <span
                            className={
                              isDark ? "text-slate-400" : "text-slate-600"
                            }
                          >
                            Lab Code
                          </span>
                          <span
                            className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                          >
                            {selectedSubject.labCode}
                          </span>
                        </div>
                      )}

                    {selectedSubject.labCredits != null &&
                      selectedSubject.labCredits !== 0 && (
                        <div
                          className={`flex justify-between px-4 py-3 rounded-xl border ${
                            isDark
                              ? "border-slate-900 bg-slate-950/50"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <span
                            className={
                              isDark ? "text-slate-400" : "text-slate-600"
                            }
                          >
                            Lab Credits
                          </span>
                          <span
                            className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                          >
                            {selectedSubject.labCredits}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Subject Pills - Horizontal Scroll */}
              <div
                ref={dragScrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`rounded-2xl p-4 backdrop-blur-xl border-2 overflow-x-auto no-scrollbar cursor-grab select-none transition-all  duration-300 ${
                  isDark
                    ? "bg-slate-950 border-slate-900"
                    : "bg-white/80 border-slate-200"
                }`}
              >
                <div className="flex gap-3  flex-nowrap">
                  {filteredSubjects.map((subj) => (
                    <button
                      key={subj._id}
                      onClick={() => {
                        setSelectedSubject(subj);
                        localStorage.setItem("selectedSubjectName", subj.name);
                        window.dispatchEvent(new Event("subject-selection"));
                      }}
                      className={`shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        selectedSubject?._id === subj._id
                          ? "bg-gradient-primary text-white shadow-primary scale-105"
                          : isDark
                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {capitalize(subj.name)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              {selectedSubject && (
                <div
                  className={`rounded-2xl max-w-5xl  p-6 backdrop-blur-xl border-2 transition-all duration-300 animate-slideUp ${
                    isDark
                      ? "bg-slate-950 border-slate-900"
                      : "bg-white/80 border-slate-200"
                  }`}
                >
                  <h1
                    className={`text-3xl font-bold text-center mb-8 text-primary`}
                  >
                    {capitalize(selectedSubject.name)}
                  </h1>

                  {/* Tabs */}
                  <div
                    className={`rounded-xl p-2 mb-6 border-2  overflow-x-auto ${
                      isDark
                        ? "bg-slate-950/50  border-slate-900"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex gap-2 justify-around">
                      {tabsConfig.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`shrink-0 px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-semibold text-sm ${
                              activeTab === tab.id
                                ? "bg-gradient-primary text-white shadow-lg"
                                : isDark
                                  ? "hover:bg-slate-700 text-white bg-slate-800"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[300px] ">
                    {activeTab === "syllabus" && (
                      <div className="flex flex-col gap-3">
                        {Object.entries(selectedSubject.syllabus || {}).map(
                          ([unit, content], idx) => (
                            <div
                              key={unit}
                              className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                isDark
                                  ? "bg-slate-950/50 border-slate-900 hover:border-primary/50"
                                  : "bg-white border-slate-200 hover:border-primary/50"
                              }`}
                            >
                              <button
                                onClick={() => toggleUnit(idx)}
                                className={`flex justify-between items-center w-full px-5 py-4 text-left font-semibold transition-colors ${
                                  isDark
                                    ? "text-white hover:bg-slate-900"
                                    : "text-slate-900 hover:bg-slate-50"
                                }`}
                              >
                                <span>{unit}</span>
                                <ChevronDown
                                  className={`w-5 h-5 text-primary transition-transform duration-300 ${
                                    openUnits.includes(idx) ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              {openUnits.includes(idx) && (
                                <div
                                  className={`px-5 py-4 border-t-2 ${
                                    isDark
                                      ? "border-slate-900 text-slate-300 bg-slate-900/50"
                                      : "border-slate-200 text-slate-700 bg-slate-50"
                                  }`}
                                >
                                  <p className="leading-relaxed">
                                    {content as string}
                                  </p>
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    {activeTab === "lab" &&
                      selectedSubject.lab &&
                      Object.keys(selectedSubject.lab).length > 0 && (
                        <div className="space-y-3">
                          {Object.entries(selectedSubject.lab).map(
                            ([exp, details]) => (
                              <div
                                key={exp}
                                className={`rounded-xl p-4 border-2 ${
                                  isDark
                                    ? "bg-slate-950/50 border-slate-900"
                                    : "bg-white border-slate-200"
                                }`}
                              >
                                <p
                                  className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
                                >
                                  {capitalize(exp)}
                                </p>
                                <p
                                  className={
                                    isDark ? "text-slate-300" : "text-slate-700"
                                  }
                                >
                                  {details as string}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                    {activeTab === "questions" && (
                      <div className="space-y-3">
                        {selectedSubject.questions?.length ? (
                          selectedSubject.questions.map((q: any) => (
                            <a
                              key={q._id || q.title}
                              href={q.pdfUrl}
                              target="_blank"
                              className={`block rounded-xl px-6 py-4 font-semibold transition-all duration-300 border-2 hover:scale-[1.02] ${
                                isDark
                                  ? "bg-slate-950/50 border-slate-900 text-white hover:border-primary"
                                  : "bg-white border-slate-200 text-slate-900 hover:border-primary hover:shadow-lg"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary" />
                                {q.title}
                              </div>
                            </a>
                          ))
                        ) : (
                          <p
                            className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                          >
                            No question papers yet.
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === "videos" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedSubject.videos?.length ? (
                          selectedSubject.videos.map((v: any) => {
                            const thumb = getYoutubeThumbnail(v.url);
                            return (
                              <a
                                key={v._id || v.title}
                                href={v.url}
                                target="_blank"
                                className={`rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] ${
                                  isDark
                                    ? "bg-slate-950/50 border-slate-900 hover:border-primary"
                                    : "bg-white border-slate-200 hover:border-primary hover:shadow-lg"
                                }`}
                              >
                                {thumb ? (
                                  <img
                                    src={thumb}
                                    alt={v.title}
                                    className="w-full h-40 object-cover"
                                  />
                                ) : (
                                  <div
                                    className={`w-full h-40 flex items-center justify-center ${
                                      isDark ? "bg-slate-800" : "bg-slate-100"
                                    }`}
                                  >
                                    <Video
                                      className={`w-12 h-12 ${isDark ? "text-slate-600" : "text-slate-400"}`}
                                    />
                                  </div>
                                )}
                                <div className="p-4">
                                  <p
                                    className={`font-semibold text-center ${isDark ? "text-white" : "text-slate-900"}`}
                                  >
                                    {capitalize(v.title)}
                                  </p>
                                </div>
                              </a>
                            );
                          })
                        ) : (
                          <p
                            className={`col-span-full text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                          >
                            No videos added yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
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
