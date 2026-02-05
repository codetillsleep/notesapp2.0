"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_DESCRIPTION,
  HERO_BRANCHES,
  HERO_BRANCH_HEADING,
  HERO_SEMS,
} from "../app/constants/constants";
import {
  ChevronDown,
  BookOpen,
  Video,
  FileText,
  Award,
  Clock,
  Users,
} from "lucide-react";

const Hero = () => {
  const router = useRouter();

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const semesters = HERO_SEMS;
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const features = [
    {
      icon: BookOpen,
      title: "Complete Syllabus",
      description: "Comprehensive coverage of all topics",
    },
    {
      icon: Video,
      title: "Video Collections",
      description: "Curated learning resources",
    },
    {
      icon: FileText,
      title: "Important Questions",
      description: "Exam-focused preparation",
    },
    {
      icon: Award,
      title: "Practice Tests",
      description: "Track your progress",
    },
    {
      icon: Clock,
      title: "Previous Papers",
      description: "Past year question papers",
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Collaborative learning",
    },
  ];

  const handleSubmit = () => {
    if (!selectedSem || !selectedBranch) return;

    localStorage.setItem("selectedBranch", selectedBranch);
    localStorage.setItem("selectedSem", selectedSem);

    router.push("/subject?from=home");
  };

  // Get dark mode from document
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    // Watch for changes
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative max-w-fit  z-10 mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-24 mt-14 ">
        {/* Left Content */}
        <div className="space-y-6 animate-fadeIn">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20"
            style={{
              background: isDark
                ? `linear-gradient(to right, rgba(var(--primary-dark), 0.1), rgba(var(--secondary-dark), 0.1))`
                : `linear-gradient(to right, rgba(var(--primary-light), 0.1), rgba(var(--secondary-light), 0.1))`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: isDark
                  ? `rgb(var(--primary-dark))`
                  : `rgb(var(--primary-light))`,
              }}
            ></span>
            <span className="text-sm font-semibold text-primary">
              {capitalize("Currently Available for Sem 3, More Coming Soon")}
            </span>
          </div>

          {/* Main Heading */}
          <div className="">
            <h1
              className={`text-7xl font-bold leading-tight transition-colors ${
                isDark
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-black"
              }`}
            >
              {HERO_TITLE}
            </h1>
            <h2 className="text-5xl font-bold text-primary uppercase">
              {HERO_SUBTITLE}
            </h2>
          </div>

          {/* Description */}
          <p
            className={`text-xl leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {HERO_DESCRIPTION}
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-2 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 group ${
                  isDark
                    ? "bg-slate-950/50 border-slate-900 hover:bg-slate-950"
                    : "bg-white border-slate-200 hover:shadow-lg"
                } hover:border-primary/50`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="w-6 h-6 mb-2 transition-colors text-primary" />
                <h3
                  className={`font-semibold mb-1 text-sm ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Selection Card */}
        <div className="animate-slideUp">
          <div
            className={`relative p-12  border-2  rounded-3xl backdrop-blur-xl shadow-lg ${
              isDark
                ? "bg-slate-900/50 border-slate-900"
                : "bg-white/50 border-slate-200"
            }`}
          >
            {/* Decorative gradient */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: isDark
                  ? `linear-gradient(to bottom right, rgba(var(--primary-dark), 0.05), rgba(var(--secondary-dark), 0.05))`
                  : `linear-gradient(to bottom right, rgba(var(--primary-light), 0.05), rgba(var(--secondary-light), 0.05))`,
              }}
            ></div>

            <div className="relative space-y-8">
              <h3 className="text-3xl font-bold text-center mb-8 text-primary uppercase tracking-wider">
                {HERO_BRANCH_HEADING}
              </h3>

              {/* Semester Dropdown */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold ml-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  SEMESTER
                </label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setSemesterOpen(!semesterOpen);
                      setBranchOpen(false);
                    }}
                    className={`w-full px-6 py-4 rounded-2xl border-2 font-medium text-left flex items-center justify-between transition-all duration-300 focus:outline-none focus-ring-primary ${
                      isDark
                        ? "bg-slate-950 border-slate-900  text-white"
                        : "bg-slate-50 border-slate-300 text-slate-900"
                    } ${
                      semesterOpen ? "border-primary" : ""
                    } hover:border-primary`}
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
                      {selectedSem ? `${selectedSem} SEM` : "Select semester"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 text-primary ${
                        semesterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {semesterOpen && (
                    <div
                      className={`absolute z-50 w-full mt-2 rounded-2xl shadow-xl overflow-hidden animate-slideDown ${
                        isDark
                          ? "bg-slate-950 border-slate-900"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {semesters.map((sem) => (
                        <button
                          key={sem}
                          onClick={() => {
                            setSelectedSem(sem);
                            setSemesterOpen(false);
                          }}
                          className={`w-full px-6 py-3 text-left transition-colors ${
                            isDark
                              ? "hover:bg-slate-700 text-white"
                              : "hover-primary text-slate-900"
                          } ${
                            selectedSem === sem
                              ? isDark
                                ? "bg-slate-700 text-primary"
                                : "hover-primary text-primary"
                              : ""
                          }`}
                        >
                          {sem} SEM
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Branch Dropdown */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold ml-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  BRANCH
                </label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setBranchOpen(!branchOpen);
                      setSemesterOpen(false);
                    }}
                    className={`w-full px-6 py-4 rounded-2xl border-2 font-medium text-left flex items-center justify-between transition-all duration-300 focus:outline-none focus-ring-primary ${
                      isDark
                        ? "bg-slate-950 border-slate-900 text-white"
                        : "bg-slate-50 border-slate-300 text-slate-900"
                    } ${
                      branchOpen ? "border-primary" : ""
                    } hover:border-primary`}
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
                      {selectedBranch || "Select branch"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 text-primary ${
                        branchOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {branchOpen && (
                    <div
                      className={`absolute z-50 w-full mt-2 rounded-2xl shadow-xl overflow-hidden animate-slideDown ${
                        isDark
                          ? "bg-slate-950 border-slate-900"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {HERO_BRANCHES.map((branch) => (
                        <button
                          key={branch}
                          onClick={() => {
                            setSelectedBranch(branch);
                            setBranchOpen(false);
                          }}
                          className={`w-full px-6 py-3 text-left transition-colors ${
                            isDark
                              ? "hover:bg-slate-700 text-white"
                              : "hover-primary text-slate-900"
                          } ${
                            selectedBranch === branch
                              ? isDark
                                ? "bg-slate-700 text-primary"
                                : "hover-primary text-primary"
                              : ""
                          }`}
                        >
                          {branch}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}

              <button
                onClick={handleSubmit}
                disabled={!selectedSem || !selectedBranch}
                className={`w-full mt-12 px-6 py-4 rounded-2xl font-bold text-sm tracking-widest transition-all ${
                  selectedSem && selectedBranch
                    ? "bg-gradient-primary text-white shadow-primary hover:scale-[1.02]"
                    : isDark
                      ? "bg-slate-900 text-slate-500 cursor-not-allowed"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {selectedSem && selectedBranch
                  ? "GET STARTED ⫸"
                  : "SELECT SEMESTER & BRANCH !"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
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
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 1s ease-out 0.3s both;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Hero;
