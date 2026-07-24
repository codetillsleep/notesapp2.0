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
  Target,
  Brain,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

const Hero = () => {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mounted, setMounted] = useState(false);

  const semesters = HERO_SEMS;

  const features = [
    {
      icon: BookOpen,
      title: "Complete Syllabus",
      description: "University-aligned syllabus for every subject",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Video,
      title: "Video Library",
      description: "Hand-picked lectures and tutorials",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: FileText,
      title: "Question Banks",
      description: "College assignments & practicals",
      color: "from-orange-500 to-pink-400",
    },
    {
      icon: Clock,
      title: "PYQs",
      description: "IPU previous year papers",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const highlights = [
    {
      icon: Target,
      title: "Exam Focused",
      description: "Aligned with university syllabus",
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "Resources for better retention",
    },
    {
      icon: Sparkles,
      title: "All-in-One",
      description: "No juggling multiple platforms",
    },
  ];

  const handleSubmit = () => {
    if (!selectedSem || !selectedBranch) return;
    localStorage.setItem("selectedBranch", selectedBranch);
    localStorage.setItem("selectedSem", selectedSem);
    router.push("/subject?from=home");
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
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${isDark ? "bg-[#080b18]" : "bg-slate-50"}`}>
      {/* ── HERO HEADER ───────────────────────────────────────────────── */}
      <div
        className={`relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-12 overflow-hidden ${
          isDark ? "bg-[#080b18]" : "bg-slate-50"
        }`}
      >
        {/* Background atmosphere */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large glow blobs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/8 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/6 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[80px]" />

          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${
                isDark ? "#818cf8" : "#6366f1"
              } 1px, transparent 0)`,
              backgroundSize: "36px 36px",
            }}
          />

          {/* Floating orb */}
          <div
            className="absolute top-24 right-16 w-48 h-48 rounded-full opacity-20 animate-float"
            style={{
              background: "conic-gradient(from 0deg, #6366f1, #a78bfa, #f472b6, #6366f1)",
              filter: "blur(2px)",
            }}
          />
          <div className="absolute bottom-24 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-500/20 blur-sm animate-float"
            style={{ animationDelay: "2s", animationDuration: "8s" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border animate-fadeIn ${
              isDark
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                : "bg-indigo-50 border-indigo-200 text-indigo-600"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            GGSIPU • CSAM & Cyber Security
          </div>

          {/* Title */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4 leading-[1.05] animate-slideDown`}
          >
            <span className={isDark ? "text-white" : "text-gray-900"}>Study Smarter,</span>
            <br />
            <span className="hero-gradient-text">Score Higher.</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed animate-slideUp stagger-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Your all-in-one resource for syllabus, PYQs, video lectures, and question banks — organized for B.Tech students.
          </p>

          {/* Highlight pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-slideUp stagger-2">
            {highlights.map((h) => (
              <div
                key={h.title}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-all ${
                  isDark
                    ? "bg-white/4 border-white/8 text-gray-300 hover:bg-white/8"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <h.icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-medium">{h.title}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slideUp stagger-3">
            <button
              onClick={() => {
                document
                  .getElementById("features-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/subject"
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold border transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              Browse Subjects
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-fadeIn">
          <span className={`text-xs font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}>Scroll to explore</span>
          <div className={`w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5 ${isDark ? "border-white/15" : "border-gray-300"}`}>
            <div className={`w-1 h-2 rounded-full animate-bounce ${isDark ? "bg-gray-500" : "bg-gray-400"}`} />
          </div>
        </div>
      </div>

      {/* ── FEATURES + QUICK START ────────────────────────────────────── */}
      <div
        id="features-section"
        className={`min-h-screen content-center py-20 ${isDark ? "bg-[#080b18]" : "bg-white"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                isDark
                  ? "bg-indigo-500/10 text-indigo-300"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              What you get
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Everything You Need
            </h2>
            <p
              className={`text-sm sm:text-base max-w-sm mx-auto ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Comprehensive resources organized for maximum efficiency
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left — Feature List */}
            <div
              className={`rounded-2xl p-5 sm:p-6 border ${
                isDark
                  ? "bg-white/[0.03] border-white/8"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="space-y-2.5">
                {features.map((feature, idx) => (
                  <div
                    key={feature.title}
                    onMouseEnter={() => setActiveFeature(idx)}
                    onClick={() => setActiveFeature(idx)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      activeFeature === idx
                        ? `bg-gradient-to-r ${feature.color} scale-[1.02] shadow-lg`
                        : isDark
                        ? "bg-white/4 hover:bg-white/8"
                        : "bg-white hover:bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          activeFeature === idx
                            ? "bg-white/20"
                            : "bg-indigo-500/10"
                        }`}
                      >
                        <feature.icon
                          className={`w-5 h-5 ${
                            activeFeature === idx
                              ? "text-white"
                              : "text-indigo-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold text-sm mb-0.5 ${
                            activeFeature === idx
                              ? "text-white"
                              : isDark
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {feature.title}
                        </h4>
                        <p
                          className={`text-xs ${
                            activeFeature === idx
                              ? "text-white/75"
                              : isDark
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {feature.description}
                        </p>
                      </div>
                      {activeFeature === idx && (
                        <ChevronRight className="w-4 h-4 text-white shrink-0 animate-slideLeft" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Quick Start */}
            <div
              className={`rounded-2xl p-5 sm:p-6 border ${
                isDark
                  ? "bg-white/[0.03] border-white/8"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Quick Start
                  </h3>
                  <p
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Get your materials in 2 steps
                  </p>
                </div>
              </div>

              {/* Step 1: Semester */}
              <div className="mb-5">
                <label
                  className={`block text-xs font-bold mb-2.5 uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Step 1 — Choose Semester
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {semesters.map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSelectedSem(sem)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all duration-250 ${
                        selectedSem === sem
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                          : isDark
                          ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Branch */}
              <div className="mb-6">
                <label
                  className={`block text-xs font-bold mb-2.5 uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Step 2 — Select Branch
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HERO_BRANCHES.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => setSelectedBranch(branch)}
                      className={`py-3 px-3 rounded-xl font-semibold text-sm transition-all duration-250 text-left ${
                        selectedBranch === branch
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                          : isDark
                          ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-indigo-300"
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
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedSem && selectedBranch
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] cursor-pointer"
                    : isDark
                    ? "bg-white/4 text-gray-600 cursor-not-allowed border border-white/5"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }`}
              >
                {selectedSem && selectedBranch ? (
                  <>
                    Start Learning Now
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  "Select Semester & Branch to continue"
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
