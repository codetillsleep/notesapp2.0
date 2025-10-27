"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Loader from "@/components/Loader";

export default function SubjectPage() {
  const [openUnits, setOpenUnits] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("syllabus");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // ✅ Load subjects
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

  // ✅ Apply saved selection
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
          s.semester.includes(Number(sem))
      );
      if (match) setSelectedSubject(match);
    }
  };

  useEffect(() => {
    if (subjects.length > 0) applySelection();
  }, [subjects]);

  // ✅ Listen for updates from TopBar
  useEffect(() => {
    const handleSelectionChange = () => applySelection();
    window.addEventListener("subject-selection", handleSelectionChange);
    return () => {
      window.removeEventListener("subject-selection", handleSelectionChange);
    };
  }, [subjects]);

  const toggleUnit = (unit: number) =>
    setOpenUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );

  const filteredSubjects = subjects.filter(
    (s) =>
      s.branch.includes(selectedBranch || "") &&
      s.semester.includes(selectedSem || 0)
  );

  return (
    <div className="min-h-screen bg-background text-bdy px-6 md:px-12 py-10 flex justify-center">
      {loading ? (
        <div className="flex items-center justify-center w-full text-textbdy">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10 w-full max-w-7xl transition-all duration-300">
          {/* LEFT PANEL */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Branch & Sem */}
            <div className="border-y-2 border-[#3f3f46] rounded-lg p-4 bg-transparent">
              <h2 className="text-lg font-semibold text-bdy mb-4">
                Branch & Sem
              </h2>
              <div className="flex flex-col gap-3">
                <select
                  value={selectedBranch || ""}
                  onChange={(e) => {
                    const branch = e.target.value;
                    setSelectedBranch(branch);
                    localStorage.setItem("selectedBranch", branch);
                    localStorage.removeItem("selectedSubjectName");
                    setSelectedSubject(null);
                    window.dispatchEvent(new Event("subject-selection"));
                  }}
                  className="border border-[#3f3f46] rounded-lg px-3 py-2 text-sm bg-box text-bdy focus:outline-none"
                >
                  <option value="">Select Branch</option>
                  {[...new Set(subjects.flatMap((s) => s.branch))].map((br) => (
                    <option key={br} value={br}>
                      {br}
                    </option>
                  ))}
                </select>

                {selectedBranch && (
                  <select
                    value={selectedSem || ""}
                    onChange={(e) => {
                      const semValue = Number(e.target.value);
                      setSelectedSem(semValue);
                      localStorage.setItem("selectedSem", String(semValue));
                      localStorage.removeItem("selectedSubjectName");
                      setSelectedSubject(null);
                      window.dispatchEvent(new Event("subject-selection"));
                    }}
                    className="border border-[#3f3f46] rounded-lg px-3 py-2 text-sm bg-box text-textbdy focus:outline-none"
                  >
                    <option value="">Select Semester</option>
                    {[...new Set(subjects.flatMap((s) => s.semester))].map(
                      (sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>
            </div>

            {/* Subject Details */}
            {selectedSubject && (
              <div className="border-y-2 border-[#3f3f46] rounded-xl p-4 bg-transparent">
                <h2 className="text-lg font-semibold text-textbdy mb-4">
                  Subject Details
                </h2>
                <div className="flex flex-col gap-3 text-sm">
                  {[
                    ["Theory Code", selectedSubject.code],
                    ["Theory Credits", selectedSubject.theoryCredits],
                    ["Lab Code", selectedSubject.labCode || "N/A"],
                    ["Lab Credits", selectedSubject.labCredits || "N/A"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between border border-[#3f3f46] rounded-md px-3 py-2"
                    >
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col gap-6">
            {/* ✅ Subject Scroll Bar */}
            <div className="border-y-2 rounded-lg border-[#3f3f46] bg-transparent px-4 py-3 overflow-x-auto scrollbar-thin scrollbar-thumb-[#3f3f46] scrollbar-track-transparent">
              <div className="flex gap-3 w-max">
                {filteredSubjects.map((subj) => (
                  <button
                    key={subj._id}
                    onClick={() => {
                      setSelectedSubject(subj);
                      localStorage.setItem("selectedSubjectName", subj.name);
                      window.dispatchEvent(new Event("subject-selection"));
                    }}
                    className={`shrink-0 px-6 py-2 rounded-xl text-sm font-semibold transition ${
                      selectedSubject?._id === subj._id
                        ? "bg-[#7ed957]  text-black"
                        : " text-textbdy hover:cursor-pointer"
                    }`}
                  >
                    {capitalize(subj.name)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs & Content */}
            {selectedSubject && (
              <div className="rounded-xl p-6 flex flex-col gap-6 border border-[#3f3f46]">
                <h1 className="text-2xl sm:text-3xl font-bold text-bdr text-center tracking-wide">
                  {capitalize(selectedSubject.name)}
                </h1>

                {/* ✅ Tab Scroll Bar */}
                <div className="border-2 border-[#3f3f46] rounded-xl bg-transparent p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#3f3f46] scrollbar-track-transparent">
                  <div className="flex gap-3 w-max  font-semibold text-sm sm:text-base">
                    {["syllabus", "lab", "questions", "videos"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`shrink-0 px-12 py-2 rounded-xl transition-all duration-200 ${
                          activeTab === tab
                            ? "bg-[#7ed957]  text-black"
                            : "text-textbdy hover:cursor-pointer"
                        }`}
                      >
                        {capitalize(tab)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "syllabus" && (
                  <div className="flex flex-col gap-3 p-4 rounded-xl border-prime">
                    {Object.entries(selectedSubject.syllabus || {}).map(
                      ([unit, content], idx) => (
                        <div
                          key={unit}
                          className="rounded-xl bg-box overflow-hidden"
                        >
                          <button
                            onClick={() => toggleUnit(idx)}
                            className="flex justify-between items-center w-full px-5 py-3 text-left text-base font-semibold text-textbdy"
                          >
                            <span>{capitalize(unit)}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-textbdy transition-transform ${
                                openUnits.includes(idx) ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {openUnits.includes(idx) && (
                            <div className="px-5 py-3 text-sm text-textbdy border-t border-[#3f3f46] bg-box">
                              <p>{content as string}</p>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}

                {activeTab === "lab" && (
                  <div className="text-sm text-textbdy space-y-2">
                    {Object.entries(selectedSubject.lab || {}).map(
                      ([exp, details]) => (
                        <div
                          key={exp}
                          className="border border-[#3f3f46] rounded-md p-3"
                        >
                          <p className="font-semibold">{capitalize(exp)}</p>
                          <p>{details as string}</p>
                        </div>
                      )
                    )}
                  </div>
                )}

                {activeTab === "questions" && (
                  <div className="text-sm text-textbdy space-y-2">
                    {selectedSubject.questions?.length ? (
                      selectedSubject.questions.map((q: any) => (
                        <a
                          key={q._id || q.title}
                          href={q.pdfUrl}
                          target="_blank"
                          className="block border border-[#3f3f46] rounded-md px-4 py-2 hover:border-[#ff007f] transition"
                        >
                          📘 {capitalize(q.title)}
                        </a>
                      ))
                    ) : (
                      <p>No question papers yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "videos" && (
                  <div className="text-sm text-[#d1d5db] space-y-2">
                    {selectedSubject.videos?.length ? (
                      selectedSubject.videos.map((v: any) => (
                        <a
                          key={v._id || v.title}
                          href={v.url}
                          target="_blank"
                          className="block border border-[#3f3f46] rounded-md px-4 py-2 hover:border-[#ff007f] transition"
                        >
                          🎥 {capitalize(v.title)}
                        </a>
                      ))
                    ) : (
                      <p>No videos added yet.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
