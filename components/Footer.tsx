"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Github, Mail, Heart, ArrowUpRight, BookOpen } from "lucide-react";
import { GITHUB_URL } from "../app/constants/constants";

export default function Footer() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Subjects", href: "/subject" },
    { label: "About", href: "/about" },
    { label: "Dev Logs", href: "/devlogs" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const year = new Date().getFullYear();

  return (
    <footer
      className={`mt-16 border-t transition-colors duration-300 ${
        isDark
          ? "bg-[#080b18] border-white/8"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white font-black text-xs tracking-tighter">10G</span>
            </div>
            <span
              className={`text-xl font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              10GPA
            </span>
          </div>

          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Your free study hub for GGSIPU CSAM & Cyber Security students — syllabus, PYQs, video lectures, all in one place.
          </p>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
              <ArrowUpRight className="w-3 h-3 opacity-50" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3
            className={`text-sm font-bold uppercase tracking-wider ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Quick Links
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm transition-all duration-200 hover:translate-x-0.5 inline-flex items-center gap-1 ${
                    isDark
                      ? "text-gray-400 hover:text-indigo-300"
                      : "text-gray-500 hover:text-indigo-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div className="flex flex-col gap-4">
          <h3
            className={`text-sm font-bold uppercase tracking-wider ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            About
          </h3>
          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            10GPA is a student-driven initiative to simplify learning for underrepresented branches in GGSIPU. Every subject's essentials — organized beautifully.
          </p>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold w-fit ${
              isDark
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Actively maintained
          </div>
        </div>

        {/* Connect */}
        <div className="flex flex-col gap-4">
          <h3
            className={`text-sm font-bold uppercase tracking-wider ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Connect
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:codetillsleep@gmail.com"
                className={`flex items-center gap-2.5 text-sm transition-all duration-200 group ${
                  isDark
                    ? "text-gray-400 hover:text-indigo-300"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isDark
                    ? "bg-white/5 group-hover:bg-indigo-500/15"
                    : "bg-gray-100 group-hover:bg-indigo-50"
                }`}>
                  <Mail className="w-3.5 h-3.5" />
                </div>
                codetillsleep@gmail.com
              </a>
            </li>
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 text-sm transition-all duration-200 group ${
                  isDark
                    ? "text-gray-400 hover:text-indigo-300"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isDark
                    ? "bg-white/5 group-hover:bg-indigo-500/15"
                    : "bg-gray-100 group-hover:bg-indigo-50"
                }`}>
                  <Github className="w-3.5 h-3.5" />
                </div>
                @codetillsleep
              </a>
            </li>
          </ul>

          {/* Resources note */}
          <div
            className={`flex items-start gap-2 p-3 rounded-xl text-xs leading-relaxed ${
              isDark
                ? "bg-white/3 border border-white/6 text-gray-500"
                : "bg-gray-50 border border-gray-100 text-gray-400"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-400" />
            100% free resources. No paywalls, no ads.
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={`border-t ${
          isDark ? "border-white/5" : "border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p className={isDark ? "text-gray-500" : "text-gray-400"}>
            © {year} 10GPA. All rights reserved.
          </p>
          <p
            className={`flex items-center gap-1.5 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Crafted with{" "}
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />{" "}
            by{" "}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold hover:underline transition-colors ${
                isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600"
              }`}
            >
              @codetillsleep
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
