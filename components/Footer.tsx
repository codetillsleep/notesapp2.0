"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-box border-t border-[#3f3f46] text-textbdy">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-courgette text-prime tracking-wider">
            10GPA
          </h2>
          <p className="text-bdy text-sm leading-relaxed">
            Your one-stop resource hub for CSAM & Cyber Security Students. We
            bring together scattered materials: syllabus, playlists, and PYQs,
            all in one clean platform.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-prime">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="hover:text-[#7ed957] transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-[#7ed957] transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-[#7ed957] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* About Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-prime">About</h3>
          <p className="text-sm text-bdy leading-relaxed">
            10GPA is a student-driven initiative made to simplify learning for
            underrepresented branches in GGSIPU. Every subject’s core — from
            syllabus to resources — organized beautifully.
          </p>
        </div>

        {/* Contact / Connect Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-prime">Connect</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:10gpa@gmail.com"
                className="hover:text-[#7ed957] transition-colors duration-200"
              >
                codetillsleep@gmail.com
              </a>
            </li>
            <li className="text-xs text-bdy/70">
              Currently under active development.
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#3f3f46]" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-bdy/70">
        <p>© {new Date().getFullYear()} 10GPA. All rights reserved.</p>
        <p>
          Crafted with ❤️‍🔥 by{" "}
          <span className="text-[#7ed957] font-semibold">@codetillsleep</span>
        </p>
      </div>
    </footer>
  );
}
