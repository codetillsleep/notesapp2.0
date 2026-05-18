"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_DESCRIPTION,
  HERO_BRANCHES,
  HERO_SEMS,
} from "../../app/constants/constants";
import {
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  Clock,
  Zap,
  ChevronDown,
  Target,
  Brain,
  Sparkles,
} from "lucide-react";

const Hero = () => {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);

  const semesters = HERO_SEMS;

  const features = [
    {
      icon: BookOpen,
      title: "Complete Syllabus",
      description: "University syllabus for each subject",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Video,
      title: "Video Library",
      description: "Hand picked lectures and tutorials",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: FileText,
      title: "Question Banks",
      description: "College Assignments",
      color: "from-orange-500 to-pink-400",
    },
    {
      icon: Clock,
      title: "PYQs",
      description: "IPU Previous year papers",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const highlights = [
    {
      icon: Target,
      title: "Exam Focused",
      description: "Content aligned with university syllabus",
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "Organized resources for better retention",
    },
    {
      icon: Sparkles,
      title: "All-in-One",
      description: "No need to search multiple platforms",
    },
  ];

  const handleSubmit = () => {
    if (!selectedSem || !selectedBranch) return;
    localStorage.setItem("selectedBranch", selectedBranch);
    localStorage.setItem("selectedSem", selectedSem);
    router.push("/subject?from=home");
  };

  const scrollToFeatures = () => {
    document
      .getElementById("features-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

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
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${isDark ? "bg-[#0a0d1a]" : "bg-gray-50"}`}>
      {/* SECTION2*/}
      <div
        id="features-section"
        className={`min-h-screen  content-center   ${isDark ? "bg-[#0a0d1a]" : "bg-white"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* SectionHeader */}
          <div className="text-center mb-10">
            <h3
              className={`text-3xl sm:text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Everything You Need
            </h3>
            <p
              className={`text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Comprehensive resources organized for maximum efficiency
            </p>
          </div>

          {/* MainGrid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LeftsideFeatures */}
            <div
              className={`rounded-2xl p-5 sm:p-6 ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}
            >
              <div className="space-y-3">
                {features.map((feature, idx) => (
                  <div
                    key={feature.title}
                    onMouseEnter={() => setActiveFeature(idx)}
                    onClick={() => setActiveFeature(idx)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      activeFeature === idx
                        ? `bg-gradient-to-r ${feature.color} scale-[1.02] shadow-lg`
                        : isDark
                          ? "bg-white/5 hover:bg-white/10"
                          : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          activeFeature === idx
                            ? "bg-white/20"
                            : "bg-indigo-500/10"
                        }`}
                      >
                        <feature.icon
                          className={`w-5 h-5 ${activeFeature === idx ? "text-white" : "text-indigo-500"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold text-sm mb-0.5 ${activeFeature === idx ? "text-white" : isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {feature.title}
                        </h4>
                        <p
                          className={`text-xs ${activeFeature === idx ? "text-white/80" : isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {feature.description}
                        </p>
                      </div>
                      {activeFeature === idx && (
                        <ChevronRight className="w-4 h-4 text-white shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RightsideQuick Start */}
            <div
              className={`rounded-2xl p-5 sm:p-6 ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}
            >
              {/* Header*/}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Quick Start
                  </h3>
                  <p
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Get started in 2 steps
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <label
                  className={`block text-xs font-semibold mb-2.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Step 1: Choose Semester
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {semesters.map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSelectedSem(sem)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                        selectedSem === sem
                          ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105"
                          : isDark
                            ? "bg-white/5 text-gray-400 hover:bg-white/10"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  className={`block text-xs font-semibold mb-2.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Step 2: Select Branch
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HERO_BRANCHES.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => setSelectedBranch(branch)}
                      className={`py-3 px-3 rounded-xl font-semibold text-xs transition-all duration-300 text-left ${
                        selectedBranch === branch
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105"
                          : isDark
                            ? "bg-white/5 text-gray-400 hover:bg-white/10"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleSubmit}
                disabled={!selectedSem || !selectedBranch}
                className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedSem && selectedBranch
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:scale-105 cursor-pointer"
                    : isDark
                      ? "bg-white/5 text-gray-600 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedSem && selectedBranch ? (
                  <>
                    Start Learning Now
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  "Select Semester & Branch"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
