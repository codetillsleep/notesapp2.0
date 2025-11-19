"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_DESCRIPTION,
  HERO_BRANCHES,
  HERO_BRANCH_HEADING,
  HERO_SEMS,
} from "../app/constants/constants";

const Hero = () => {
  const router = useRouter();

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSem, setSelectedSem] = useState("");

  const semesters = HERO_SEMS;
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // auto navigate once both are selected
  useEffect(() => {
    if (selectedBranch && selectedSem) {
      localStorage.setItem("selectedBranch", selectedBranch);
      localStorage.setItem("selectedSem", selectedSem);
      router.push("/subject?from=home");
    }
  }, [selectedBranch, selectedSem, router]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center px-6 sm:px-10 lg:px-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          {/* LEFT SIDE */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
            <h1 className="w-full font-courgette  font-bold text-prime tracking-tight leading-[0.85] text-[4rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[9rem] xl:text-[13rem]">
              {HERO_TITLE}
            </h1>
            <h2 className="text-lg sm:text-2xl font-bold md:text-3xl lg:text-5xl tracking-[0.007em] font-tenor text-text uppercase max-w-3xl">
              {HERO_SUBTITLE}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-bdy leading-relaxed font-tenor max-w-2xl">
              {HERO_DESCRIPTION}
            </p>
            <p className=" sm:text-base md:text-lg lg:text-2xl text-bdy leading-relaxed font-tenor max-w-2xl">
              {capitalize("CURRENTLY AVAILABLE FOR SEM 1 & 3")}
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end w-full">
            <div className="rounded-2xl border-[1.5px] w-full max-w-[480px] p-8 bg-box border-[#3f3f46]">
              <p className="text-center font-bold uppercase mb-8">
                <span className="block text-3xl font-tenor text-text tracking-[0.2em]">
                  {HERO_BRANCH_HEADING}
                </span>
              </p>

              <div className="flex flex-col gap-5">
                {/* Semester Dropdown */}
                <select
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(e.target.value)}
                  className="appearance-none text-bdy bg-box border-bdrl border-2 px-5 py-3 rounded-lg w-full text-lg font-semibold tracking-wide focus:outline-none  transition-all duration-200"
                >
                  <option value="" hidden>
                    Semester
                  </option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem} SEM
                    </option>
                  ))}
                </select>

                {/* Branch Dropdown */}
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="appearance-none text-bdy bg-box border-bdrl border-2 px-5 py-3 rounded-lg w-full text-lg font-semibold tracking-wide focus:outline-none  transition-all duration-200"
                >
                  <option value="" hidden>
                    Branch
                  </option>
                  {HERO_BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
