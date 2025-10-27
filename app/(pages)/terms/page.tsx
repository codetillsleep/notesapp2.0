"use client";
import React from "react";

const Terms = () => {
  return (
    <section className="min-h-screen bg-background text-text px-6 sm:px-10 lg:px-20 py-16 font-tenor">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl sm:text-6xl font-courgette text-prime mb-6">
          Terms & Conditions
        </h1>

        <p className="text-lg text-bdy">
          Welcome to <strong>10GPA</strong>. By accessing and using our website,
          you agree to comply with the following Terms and Conditions. Please
          read them carefully before using the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          1. Purpose of the Platform
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          10GPA is designed to help students of GGSIPU — especially in branches
          like CSAM and Cyber Security — access consolidated study materials,
          syllabi, video playlists, and previous year question papers. The
          platform is purely educational and non-commercial.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          2. Public Access
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          All content on 10GPA is publicly accessible without registration or
          payment. Users are not required to log in or share personal
          information to browse materials.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          3. Content Ownership
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          The materials shared or linked on 10GPA are for educational purposes.
          External video or reference links belong to their respective creators
          and are used under fair educational use.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          4. Limitation of Liability
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          10GPA is not responsible for any errors, outdated content, or external
          links that may change or become unavailable. Use the materials at your
          own discretion.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          5. Changes to the Platform
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          We may update, modify, or remove materials on 10GPA without prior
          notice to improve the user experience or ensure accuracy.
        </p>

        <h2 className="text-2xl font-semibold mt-10 text-text">
          6. Contact Information
        </h2>
        <p className="text-bdy text-lg leading-relaxed">
          For any concerns or suggestions, please contact us at{" "}
          <a
            href="mailto:10gpa@gmail.com"
            className="text-prime hover:underline"
          >
            10gpa@gmail.com
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

export default Terms;
