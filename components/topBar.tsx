"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, Github, Sun, Moon, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS, GITHUB_URL, SITE_TITLE } from "../app/constants/constants";

const TopBar = () => {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on route change or outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setMobileSearchOpen(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
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
          query.split("").every((char: string) => name.includes(char))
        );
      })
      .slice(0, 6);
    setSuggestions(matches);
  }, [searchQuery, subjects]);

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
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    router.push("/subject");
  };

  const getLinkHref = (item: string) => {
    if (item.toLowerCase() === "home") return "/";
    if (item.toLowerCase() === "about") return "/about";
    if (item.toLowerCase() === "dev logs") return "/devlogs";
    return `/${item.toLowerCase()}`;
  };

  const SuggestionDropdown = () =>
    suggestions.length > 0 ? (
      <div
        className={`absolute top-full mt-2 w-full rounded-xl overflow-hidden z-50 ${
          isDark
            ? "bg-[#1a1d2e] border border-white/10"
            : "bg-white border border-gray-200"
        } shadow-2xl`}
      >
        {suggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => handleSelectSubject(s)}
            className={`px-4 py-3 cursor-pointer transition-colors ${
              isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
            }`}
          >
            <div
              className={`font-semibold text-sm ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
            >
              {s.name}
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
            >
              {Array.isArray(s.branch) ? s.branch.join(" / ") : s.branch} • SEM{" "}
              {Array.isArray(s.semester) ? s.semester.join(", ") : s.semester}
            </div>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isDark ? "bg-[#0a0d1a]/80" : "bg-white/80"
        } backdrop-blur-xl border-b ${isDark ? "border-white/5" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-lg">10</span>
              </div>
              <span
                className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {SITE_TITLE}
              </span>
            </Link>

            {/* Nav Links - Desktop Center */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item}
                  href={getLinkHref(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Desktop Search - centered between nav and icons */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects..."
                  className={`w-56 pl-9 pr-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isDark
                      ? "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/50"
                      : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500/50"
                  } focus:outline-none`}
                />
                <SuggestionDropdown />
              </div>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "hover:bg-white/5 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Github className="w-5 h-5" />
              </a>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "hover:bg-white/5 text-indigo-400"
                    : "hover:bg-gray-100 text-indigo-600"
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <a
                href="/profile"
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "hover:bg-white/5 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <User className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Right Actions */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => {
                  setMobileSearchOpen(!mobileSearchOpen);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "hover:bg-white/5 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "hover:bg-white/5 text-indigo-400"
                    : "hover:bg-gray-100 text-indigo-600"
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Hamburger */}
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  setMobileSearchOpen(false);
                }}
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "hover:bg-white/5 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div ref={mobileSearchRef} className="relative mt-3 lg:hidden">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/50"
                    : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500/50"
                } focus:outline-none`}
              />
              <SuggestionDropdown />
            </div>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t ${
              isDark
                ? "border-white/5 bg-[#0a0d1a]"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item}
                  href={getLinkHref(item)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </Link>
              ))}

              {/* GitHub in mobile menu */}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="/profile"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default TopBar;
