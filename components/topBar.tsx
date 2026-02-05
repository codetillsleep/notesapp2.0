"use client";
import React, { useState, useEffect } from "react";
import { Search, Github, Sun, Moon, Palette, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS, GITHUB_URL, SITE_TITLE } from "../app/constants/constants";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [currentTheme, setCurrentTheme] = useState("default");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();

  const themes = [
    { id: "default", name: "Sky", colors: ["bg-sky-500", "bg-emerald-500"] },
    { id: "ocean", name: "Ocean", colors: ["bg-blue-500", "bg-cyan-500"] },
    { id: "sunset", name: "Sunset", colors: ["bg-orange-500", "bg-amber-500"] },
    {
      id: "forest",
      name: "Forest",
      colors: ["bg-green-500", "bg-emerald-500"],
    },
    {
      id: "purple",
      name: "Grape",
      colors: ["bg-purple-500", "bg-fuchsia-500"],
    },
    { id: "rose", name: "Rose", colors: ["bg-rose-500", "bg-pink-500"] },
    {
      id: "midnight",
      name: "Midnight",
      colors: ["bg-indigo-500", "bg-violet-500"],
    },
  ];

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await fetch("/api/subjects", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        setSubjects(data || []);
      } catch (err) {
        console.error("❌ Error loading subjects:", err);
      }
    };
    loadSubjects();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("colorTheme") || "default";
    const savedMode = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const darkMode = savedMode === "dark" || (!savedMode && prefersDark);

    setCurrentTheme(savedTheme);
    setIsDark(darkMode);

    const root = document.documentElement;
    if (savedTheme === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", savedTheme);
    }
    root.classList.toggle("dark", darkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    setThemeMenuOpen(false);

    const root = document.documentElement;
    if (themeId === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", themeId);
    }
    localStorage.setItem("colorTheme", themeId);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase().replace(/\s+/g, "");
    const matches = subjects
      .filter((s) => {
        const name = s.name?.toLowerCase().replace(/\s+/g, "") || "";
        return (
          name.includes(query) ||
          query.split("").every((char) => name.includes(char))
        );
      })
      .slice(0, 6);

    setSuggestions(matches);
  }, [searchQuery, subjects]);

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const handleSelectSubject = async (subject: any) => {
    const selectedBranch =
      Array.isArray(subject.branch) && subject.branch.length > 0
        ? subject.branch[0]
        : subject.branch || "";

    const selectedSem =
      Array.isArray(subject.semester) && subject.semester.length > 0
        ? subject.semester[0]
        : subject.semester || "";

    localStorage.setItem("selectedBranch", selectedBranch);
    localStorage.setItem("selectedSem", String(selectedSem));
    localStorage.setItem("selectedSubjectName", subject.name);

    window.dispatchEvent(new Event("subject-selection"));

    await new Promise((res) => setTimeout(res, 100));

    setSearchQuery("");
    setSuggestions([]);
    setIsOpen(false);

    router.push("/subject");
  };

  const getLinkHref = (item: string) => {
    if (item.toLowerCase() === "home") return "/";
    if (item.toLowerCase() === "about") return "/about";
    if (item.toLowerCase() === "dev logs") return "/devlogs";
    return `/${item.toLowerCase()}`;
  };

  return (
    <nav
      className={`absolute top-0 left-0 w-full z-50 transition-colors duration-300 backdrop-blur-xl ${
        isDark
          ? "bg-black/50 border-b border-slate-800"
          : "bg-white/50 border-b border-slate-200"
      }`}
    >
      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center justify-between w-full px-6 py-2">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center transform transition-transform group-hover:rotate-6">
              <span className="text-white font-bold text-xl">10</span>
            </div>
            <span
              className={`text-2xl font-bold transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {SITE_TITLE}
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item}
                href={getLinkHref(item)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-primary hover-primary"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                isDark ? "text-slate-500" : "text-slate-400"
              } group-focus-within:text-primary`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className={`w-full pl-12 border pr-4 py-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus-ring-primary ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
              }`}
            />

            {suggestions.length > 0 && (
              <div
                className={`absolute top-full mt-2 w-full rounded-2xl border-2 shadow-xl max-h-60 overflow-y-auto z-50 ${
                  isDark
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectSubject(s)}
                    className={`px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                      isDark
                        ? "hover:bg-slate-800 border-slate-700"
                        : "hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-primary">{s.name}</div>
                    <div
                      className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {Array.isArray(s.branch)
                        ? s.branch.join(" / ")
                        : s.branch}{" "}
                      • SEM{" "}
                      {Array.isArray(s.semester)
                        ? s.semester.join(", ")
                        : s.semester}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isDark
                ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Github className="w-5 h-5" />
          </a>

          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "bg-white hover:bg-slate-50 shadow-sm"
              }`}
            >
              <Palette className="w-5 h-5 text-primary" />
            </button>

            {themeMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-2xl border-2 shadow-xl overflow-hidden animate-slideDown z-50 ${
                  isDark
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <div
                  className={`p-2 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}
                >
                  <p
                    className={`text-xs font-semibold px-3 py-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    CHOOSE THEME
                  </p>
                </div>
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                      isDark
                        ? "hover:bg-slate-800 text-white"
                        : "hover:bg-slate-50 text-slate-900"
                    } ${currentTheme === theme.id ? (isDark ? "bg-slate-800" : "bg-slate-50") : ""}`}
                  >
                    <span className="font-medium">{theme.name}</span>
                    <div className="flex gap-1">
                      <div
                        className={`w-4 h-4 rounded-full ${theme.colors[0]}`}
                      ></div>
                      <div
                        className={`w-4 h-4 rounded-full ${theme.colors[1]}`}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-white hover:bg-slate-50 shadow-sm"
            }`}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center transform transition-transform group-hover:rotate-6">
              <span className="text-white font-bold text-lg">10</span>
            </div>
            <span
              className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {SITE_TITLE}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-xl transition-all ${
                isDark
                  ? "hover:bg-slate-800 text-slate-400"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <Github className="w-5 h-5" />
            </a>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all ${
                isDark ? "bg-slate-800" : "bg-white shadow-sm"
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-all ${
                isDark ? "bg-slate-800" : "bg-white shadow-sm"
              }`}
            >
              {isOpen ? (
                <X
                  className={`w-5 h-5 ${isDark ? "text-white" : "text-slate-900"}`}
                />
              ) : (
                <Menu
                  className={`w-5 h-5 ${isDark ? "text-white" : "text-slate-900"}`}
                />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            className={`mt-4 rounded-2xl shadow-lg p-4 space-y-4 transition-all duration-300 ${
              isDark ? "bg-slate-900/95" : "bg-white/95"
            }`}
          >
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item}
                  href={getLinkHref(item)}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-primary hover-primary`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <div className="relative">
              <div className="relative w-full group">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-4 focus-ring-primary ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>

              {suggestions.length > 0 && (
                <div
                  className={`mt-2 rounded-2xl border-2 shadow-xl max-h-60 overflow-y-auto ${
                    isDark
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-slate-200"
                  }`}
                >
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSubject(s)}
                      className={`px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                        isDark
                          ? "hover:bg-slate-800 border-slate-700"
                          : "hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="font-semibold text-primary">{s.name}</div>
                      <div
                        className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
                      >
                        {Array.isArray(s.branch)
                          ? s.branch.join(" / ")
                          : s.branch}{" "}
                        • SEM{" "}
                        {Array.isArray(s.semester)
                          ? s.semester.join(", ")
                          : s.semester}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Theme Selector */}
            <div className="pt-2 border-t border-slate-700">
              <p
                className={`text-xs font-semibold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                THEME
              </p>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                      currentTheme === theme.id
                        ? "bg-gradient-primary text-white"
                        : isDark
                          ? "bg-slate-800 text-white hover:bg-slate-700"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    <span>{theme.name}</span>
                    <div className="flex gap-1">
                      <div
                        className={`w-3 h-3 rounded-full ${theme.colors[0]}`}
                      ></div>
                      <div
                        className={`w-3 h-3 rounded-full ${theme.colors[1]}`}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
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

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default TopBar;
