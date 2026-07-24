"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, Github, Sun, Moon, Menu, X, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NAV_LINKS, GITHUB_URL, SITE_TITLE } from "../app/constants/constants";
import { useSubjects } from "../hooks/useSubjects";

const TopBar = () => {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  // Shared cache — same request as SubjectPage
  const { subjects } = useSubjects();



  // Track scroll for nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  // Close mobile search on outside click
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

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
    const query = searchQuery.trim().toLowerCase();
    const cleanQuery = query.replace(/\s+/g, "");
    const matches = subjects
      .filter((s) => {
        const name = (s.name || "").toLowerCase();
        const cleanName = name.replace(/\s+/g, "");
        const code = (s.code || "").toLowerCase();
        return (
          cleanName.includes(cleanQuery) ||
          code.includes(query) ||
          name.split(" ").some((word: string) => word.startsWith(query))
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
    const key = item.toLowerCase();
    if (key === "home") return "/";
    if (key === "about") return "/about";
    if (key === "dev logs") return "/devlogs";
    if (key === "subjects" || key === "subject") return "/subject?view=catalog";
    return `/${key}`;
  };

  const isActiveLink = (item: string) => {
    const href = getLinkHref(item);
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const SuggestionDropdown = () =>
    suggestions.length > 0 ? (
      <div
        className={`absolute top-full mt-2 w-full rounded-2xl overflow-hidden z-50 shadow-2xl ${
          isDark
            ? "bg-[#111827] border border-white/10"
            : "bg-white border border-gray-200"
        }`}
      >
        {suggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => handleSelectSubject(s)}
            className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
              isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-indigo-500/15" : "bg-indigo-50"}`}>
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <div
                className={`font-semibold text-sm ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
              >
                {s.name}
              </div>
              <div
                className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
              >
                {Array.isArray(s.branch) ? s.branch.join(" / ") : s.branch} • SEM{" "}
                {Array.isArray(s.semester) ? s.semester.join(", ") : s.semester}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isDark ? "bg-[#080b18]/85" : "bg-white/85"
        } backdrop-blur-2xl border-b ${
          scrolled
            ? isDark
              ? "border-white/10 shadow-xl shadow-black/20"
              : "border-gray-200 shadow-lg shadow-black/5"
            : isDark
            ? "border-white/5"
            : "border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              {/* Gradient badge */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
                <span className="text-white font-black text-xs tracking-tighter">10G</span>
              </div>
              <span
                className={`text-lg font-extrabold tracking-tight transition-colors ${
                  isDark
                    ? "text-white group-hover:text-indigo-300"
                    : "text-gray-900 group-hover:text-indigo-600"
                }`}
              >
                {SITE_TITLE}
              </span>
            </Link>

            {/* Nav Links - Desktop Center */}
            {NAV_LINKS.length > 0 && (
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                {NAV_LINKS.map((item) => {
                  const active = isActiveLink(item);
                  return (
                    <Link
                      key={item}
                      href={getLinkHref(item)}
                      onClick={() => {
                        if (item.toLowerCase().includes("subject")) {
                          window.dispatchEvent(new Event("open-catalog"));
                        }
                      }}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? isDark
                            ? "text-indigo-300 bg-indigo-500/10"
                            : "text-indigo-600 bg-indigo-50"
                          : isDark
                          ? "text-gray-400 hover:text-white hover:bg-white/6"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {item}
                      {active && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {/* Search */}
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects..."
                  className={`w-52 pl-8.5 pr-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                    isDark
                      ? "bg-white/6 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/60 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                      : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  } focus:outline-none`}
                />
                <SuggestionDropdown />
              </div>

              {/* GitHub */}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl transition-all ${
                  isDark
                    ? "hover:bg-white/8 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                }`}
                title="GitHub"
              >
                <Github className="w-4.5 h-4.5" />
              </a>

              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all ${
                  isDark
                    ? "hover:bg-white/8 text-indigo-400 hover:text-indigo-300"
                    : "hover:bg-gray-100 text-indigo-500 hover:text-indigo-700"
                }`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="w-4.5 h-4.5" />
                ) : (
                  <Moon className="w-4.5 h-4.5" />
                )}
              </button>

              {/* Profile */}
              <Link
                href="/profile"
                className={`p-2 rounded-xl transition-all ${
                  pathname === "/profile"
                    ? isDark
                      ? "bg-indigo-500/15 text-indigo-300"
                      : "bg-indigo-50 text-indigo-600"
                    : isDark
                    ? "hover:bg-white/8 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                }`}
                title="Profile"
              >
                <User className="w-4.5 h-4.5" />
              </Link>
            </div>

            {/* Mobile Right Actions */}
            <div className="flex lg:hidden items-center gap-1.5">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => {
                  setMobileSearchOpen(!mobileSearchOpen);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl transition-all ${
                  mobileSearchOpen
                    ? isDark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-50 text-indigo-600"
                    : isDark
                    ? "hover:bg-white/8 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all ${
                  isDark
                    ? "hover:bg-white/8 text-indigo-400"
                    : "hover:bg-gray-100 text-indigo-500"
                }`}
              >
                {isDark ? (
                  <Sun className="w-4.5 h-4.5" />
                ) : (
                  <Moon className="w-4.5 h-4.5" />
                )}
              </button>

              {/* Hamburger */}
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  setMobileSearchOpen(false);
                }}
                className={`p-2 rounded-xl transition-all ${
                  mobileMenuOpen
                    ? isDark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-50 text-indigo-600"
                    : isDark
                    ? "hover:bg-white/8 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-4.5 h-4.5" />
                ) : (
                  <Menu className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div ref={mobileSearchRef} className="relative mt-3 lg:hidden animate-slideDown">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects..."
                className={`w-full pl-8.5 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isDark
                    ? "bg-white/6 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/60"
                    : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400"
                } focus:outline-none`}
              />
              <SuggestionDropdown />
            </div>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t animate-mobile-drawer ${
              isDark
                ? "border-white/6 bg-[#080b18]"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-0.5">
              {NAV_LINKS.map((item) => {
                const active = isActiveLink(item);
                return (
                  <Link
                    key={item}
                    href={getLinkHref(item)}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item.toLowerCase().includes("subject")) {
                        window.dispatchEvent(new Event("open-catalog"));
                      }
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                      active
                        ? isDark
                          ? "text-indigo-300 bg-indigo-500/10"
                          : "text-indigo-600 bg-indigo-50"
                        : isDark
                        ? "text-gray-300 hover:text-white hover:bg-white/5"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item}</span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </Link>
                );
              })}

              <div className={`my-1 border-t ${isDark ? "border-white/5" : "border-gray-100"}`} />

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === "/profile"
                    ? isDark
                      ? "text-indigo-300 bg-indigo-500/10"
                      : "text-indigo-600 bg-indigo-50"
                    : isDark
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default TopBar;
