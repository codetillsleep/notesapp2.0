"use client";
import { useEffect, useState, useRef } from "react";
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
          s.semester.includes(Number(sem))
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
                  <div className="flex justify-between border border-[#3f3f46] rounded-md px-3 py-2">
                    <span>Theory Code</span>
                    <span>{selectedSubject.code}</span>
                  </div>

                  <div className="flex justify-between border border-[#3f3f46] rounded-md px-3 py-2">
                    <span>Theory Credits</span>
                    <span>{selectedSubject.theoryCredits}</span>
                  </div>

                  {selectedSubject.labCode &&
                    selectedSubject.labCode !== "0" && (
                      <div className="flex justify-between border border-[#3f3f46] rounded-md px-3 py-2">
                        <span>Lab Code</span>
                        <span>{selectedSubject.labCode}</span>
                      </div>
                    )}

                  {selectedSubject.labCredits != null &&
                    selectedSubject.labCredits !== 0 && (
                      <div className="flex justify-between border border-[#3f3f46] rounded-md px-3 py-2">
                        <span>Lab Credits</span>
                        <span>{selectedSubject.labCredits}</span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col gap-6">
            <div
              ref={dragScrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="border-y-2 rounded-lg border-[#3f3f46] bg-transparent px-4 py-4 
                overflow-x-auto no-scrollbar cursor-grab select-none"
            >
              <div className="flex gap-3 flex-nowrap ">
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
                        ? "bg-[#7ed957] text-black"
                        : "text-textbdy hover:cursor-pointer"
                    }`}
                  >
                    {capitalize(subj.name)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs & Content */}
            {selectedSubject && (
              <div className="rounded-xl p-3 flex flex-col gap-6 border border-[#3f3f46]">
                <h1 className="text-2xl sm:text-3xl font-bold text-bdr text-center tracking-wide">
                  {capitalize(selectedSubject.name)}
                </h1>

                {/* Tabs */}
                <div className="border-2 border-[#3f3f46] rounded-xl bg-transparent p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#3f3f46] scrollbar-track-transparent md:flex justify-center items-center">
                  <div className="flex gap-3 w-max font-semibold text-sm sm:text-base">
                    {["syllabus", "lab", "questions", "videos"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`shrink-0 px-12 py-2 rounded-xl transition-all duration-200 ${
                          activeTab === tab
                            ? "bg-[#7ed957] text-black"
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
                  <div className="flex flex-col gap-3 rounded-xl border-prime">
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
                            <span>{unit}</span>
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
                          className="block border border-[#3f3f46] rounded-md px-6 py-6 hover:border-[#025913] font-semibold"
                        >
                          {q.title}
                        </a>
                      ))
                    ) : (
                      <p>No question papers yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "videos" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-bdy">
                    {selectedSubject.videos?.length ? (
                      selectedSubject.videos.map((v: any) => {
                        const thumb = getYoutubeThumbnail(v.url);

                        return (
                          <a
                            key={v._id || v.title}
                            href={v.url}
                            target="_blank"
                            className="border border-[#3f3f46] rounded-md p-2 hover:border-tab transition block"
                          >
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={v.title}
                                className="w-full h-40 object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-40 bg-gray-800 flex items-center justify-center rounded">
                                <span className="text-gray-400 text-xs">
                                  No Thumbnail
                                </span>
                              </div>
                            )}
                            <p className="mt-2 font-semibold text-center">
                              {capitalize(v.title)}
                            </p>
                          </a>
                        );
                      })
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
