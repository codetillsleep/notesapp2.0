"use client";
import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { SITE_TITLE, GITHUB_URL } from "../../constants/constants";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-background text-text px-6 sm:px-16 py-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-text">
          About {SITE_TITLE}
        </h1>
        <p className="text-bdy text-lg mb-12 leading-relaxed">
          <strong>{SITE_TITLE}</strong> is a student-driven platform built to
          help underrepresented branches like <strong>CSAM</strong> (Computer
          Science and Applied Mathematics) and <strong>Cyber Security</strong>{" "}
          students at <strong>GGSIPU</strong>. These branches often struggle
          with scattered, incomplete, or outdated learning materials.{" "}
          <strong>{SITE_TITLE}</strong> solves that by consolidating all key
          academic resources — including subject playlists, syllabus, and
          previous year questions — into one place.
        </p>

        {/* Our Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-bdy">
            🎯 Our Mission
          </h2>
          <p className="text-bdy text-base leading-relaxed">
            Our goal is to make learning **simple, accessible, and reliable**.
            We want every GGSIPU student — especially from emerging branches —
            to have a single go-to space for organized study material and
            trustworthy resources. No more endless searching across Telegram,
            Drive folders, or random notes — everything you need is just a
            search away.
          </p>
        </section>

        {/* What We Offer */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-bdy">
            💡 What We Offer
          </h2>
          <ol className="list-disc list-inside text-bdy space-y-2">
            <li>Structured subject lists organized by semester and branch</li>
            <li>Curated YouTube video links and playlists for each subject</li>
            <li>Official syllabus for every subject</li>
            <li>Previous Year Questions (PYQs) for better exam prep</li>
            <li>Clean, distraction-free, dark-mode friendly interface</li>
            <li>Constantly updated and student-community driven</li>
          </ol>
        </section>

        {/* Development */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-bdy">
            🧑‍💻 Development & Contributions
          </h2>
          <p className="text-bdy text-base leading-relaxed mb-4">
            <strong>{SITE_TITLE}</strong> is an open and evolving platform,
            built by students for students. The project is currently in active
            development — version <strong>10GPA2.0v0.1</strong> introduces a
            fully revamped UI, better subject search, and structured data for
            all available resources.
          </p>
          <p className="text-bdy text-base leading-relaxed">
            Contributions, suggestions, and collaborations are always welcome!
            You can check out our source code and contribute ideas on our{" "}
            <Link
              href={GITHUB_URL}
              target="_blank"
              className="text-text hover:underline"
            >
              GitHub Repository
            </Link>
            .
          </p>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-bdy">
            📬 Contact Us
          </h2>
          <p className="text-bdy text-base leading-relaxed">
            Have feedback, ideas, or found an issue? Reach out at{" "}
            <a
              href="mailto:10gpa@gmail.com"
              className="text-text hover:underline"
            >
              10gpa@gmail.com
            </a>{" "}
            — we’d love to hear from you!
          </p>
        </section>

        {/* Footer */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6">
          <p className="text-sm text-bdy">
            © {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.
          </p>
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <Link href={GITHUB_URL} target="_blank">
              <Github size={22} className="text-drkmd hover:text-text" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
