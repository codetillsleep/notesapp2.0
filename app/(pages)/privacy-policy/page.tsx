"use client";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="min-h-screen bg-background text-text px-6 sm:px-10 lg:px-20 py-16 font-tenor">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl sm:text-6xl font-courgette text-prime mb-6">
          Privacy Policy
        </h1>

        <p className="text-lg text-bdy">
          Welcome to <strong>10GPA</strong>. Your privacy is important to us.
          This Privacy Policy explains how we handle your information when you
          use our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          1. Information We Do Not Collect
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          10GPA does not collect or store any personal information from users.
          You can access all materials without creating an account, logging in,
          or sharing any personal details.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          2. Local Storage
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          We use your browser’s local storage to temporarily remember your
          selected branch and semester. This helps provide a smoother user
          experience. This information never leaves your device and is not
          shared with anyone.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          3. Third-Party Links
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          Our site includes links to external resources, such as YouTube
          playlists and other educational materials. We are not responsible for
          the content, privacy practices, or data collection policies of these
          external sites.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">4. Cookies</h2>
        <p className="text-bdy text-lg leading-relaxed">
          10GPA does not use cookies or tracking technologies.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          5. Data Security
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          As no personal data is collected, there are no risks related to data
          breaches or leaks. All browsing information remains within your
          device.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          6. Contact Us
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          If you have any questions about this Privacy Policy, feel free to
          contact us at{" "}
          <a
            href="mailto:codetillsleep@gmail.com"
            className="text-prime hover:underline"
          >
            codetillsleep@gmail.com
          </a>
          .
        </p>

        <p className="text-sm text-bdy mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
