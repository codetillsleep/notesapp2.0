"use client";
import React, { useState, useEffect } from "react";
import { Search, Github, MoonIcon, SunIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS, GITHUB_URL, SITE_TITLE } from "../app/constants/constants";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();

  // ✅ Fetch all subjects
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

  // ✅ Theme setup
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const darkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
    document.documentElement.classList.toggle("dark", darkMode);
    setIsDark(darkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  // ✅ Smart fuzzy search
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

  // ✅ Handle subject selection (instant update)
  const handleSelectSubject = async (subject: any) => {
    const selectedBranch =
      Array.isArray(subject.branch) && subject.branch.length > 0
        ? subject.branch[0]
        : subject.branch || "";

    const selectedSem =
      Array.isArray(subject.semester) && subject.semester.length > 0
        ? subject.semester[0]
        : subject.semester || "";

    // Save all details
    localStorage.setItem("selectedBranch", selectedBranch);
    localStorage.setItem("selectedSem", String(selectedSem));
    localStorage.setItem("selectedSubjectName", subject.name);

    // ✅ Fire an instant custom event so SubjectPage updates immediately
    window.dispatchEvent(new Event("subject-selection"));

    // Short delay for smooth transition
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-background  backdrop-blur-lg">
      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center justify-between w-full px-8 py-4">
        {/* Left Links */}
        <div className="flex items-center space-x-8 text-sm font-semibold text-text tracking-widest">
          {NAV_LINKS.map((item) => (
            <Link key={item} href={getLinkHref(item)}>
              {item}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex items-center w-1/3">
          <div className="flex items-center w-full px-3 py-2 border border-border rounded-full transition bg-box">
            <Search size={16} className="text-text mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH SUBJECT..."
              className="flex-grow text-sm text-text placeholder-text bg-transparent focus:outline-none"
            />
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-box border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSubject(s)}
                  className="px-4 py-2 text-sm text-text hover:bg-[#3f3f46]/30 cursor-pointer transition"
                >
                  <div className="font-semibold text-green-400">{s.name}</div>
                  <div className="text-xs text-bdy">
                    {Array.isArray(s.branch) ? s.branch.join(" / ") : s.branch}{" "}
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

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <Link href={GITHUB_URL} target="_blank">
            <Github size={30} className="text-drkmd transition" />
          </Link>
          <button
            className="border border-drkmd rounded-lg p-2 cursor-pointer transition"
            onClick={toggleDarkMode}
          >
            {isDark ? (
              <SunIcon className="w-4 h-4 text-yellow-400" />
            ) : (
              <MoonIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-text font-semibold tracking-widest text-lg"
          >
            {SITE_TITLE}
          </Link>

          <div className="flex items-center space-x-3">
            <Link href={GITHUB_URL} target="_blank">
              <Github size={26} className="text-drkmd transition" />
            </Link>

            <button
              className="border border-border rounded-lg p-2 text-text cursor-pointer transition"
              onClick={toggleDarkMode}
            >
              {isDark ? (
                <SunIcon className="w-4 h-4 text-yellow-400" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-md border-border border bg-background transition"
            >
              {isOpen ? (
                <X size={22} className="text-text" />
              ) : (
                <Menu size={22} className="text-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="mt-4 bg-background rounded-2xl shadow-lg p-4 space-y-4 transition-all duration-300">
            <div className="flex flex-col space-y-3 text-text font-semibold tracking-widest text-sm">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item}
                  href={getLinkHref(item)}
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Search in mobile */}
            <div className="relative">
              <div className="flex items-center w-full px-3 py-2 border border-border rounded-full transition bg-box">
                <Search size={16} className="text-text mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH SUBJECT..."
                  className="flex-grow text-sm text-text bg-transparent focus:outline-none"
                />
              </div>

              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-box border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSubject(s)}
                      className="px-4 py-2 text-sm text-text hover:bg-[#3f3f46]/30 cursor-pointer transition"
                    >
                      <div className="font-semibold text-green-400">
                        {s.name}
                      </div>
                      <div className="text-xs text-bdy">
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
        )}
      </div>
    </nav>
  );
};

export default TopBar;
