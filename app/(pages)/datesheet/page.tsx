"use client";
import React, { useState } from "react";
import { DATESHEET_DATA } from "../../constants/constants";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const DateSheetPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="min-h-screen bg-background px-6 sm:px-10 lg:px-20 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Dropdown Header */}
        <p className="m-4 text-prime  font-bold ">
          *Dates are subject to change it is advised to confirm at university
          site bellow
          <br />
          <Link
            href="http://www.ipu.ac.in/exam_datesheet.php"
            className="underline"
          >
            http://www.ipu.ac.in/exam_datesheet.php
          </Link>
        </p>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between border border-[#3f3f46] rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-background cursor-pointer select-none transition-all duration-300 hover:bg-muted/30"
        >
          <h2 className="text-3xl sm:text-4xl font-tenor text-textbdy tracking-tight">
            2025 Date Sheet (CSAM & CYBER SECURITY)
          </h2>
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-text" />
          ) : (
            <ChevronDown className="w-6 h-6 text-text" />
          )}
        </div>
        {/* Dropdown Content */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            isOpen ? "max-h-[5000px] mt-12 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-16">
            {DATESHEET_DATA.map((branchData) => (
              <div
                key={branchData.branch}
                className="border border-[#3f3f46] rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-background shadow-sm"
              >
                {/* Branch Title */}
                <h2 className="text-3xl sm:text-4xl font-tenor text-textbdy tracking-tight mb-8 text-center lg:text-left">
                  {branchData.branch} Branch Date Sheet
                </h2>

                {/* Sem Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* SEM 3 */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-tenor text-text tracking-widest mb-4">
                      SEMESTER 1
                    </h3>
                    <div className="space-y-3">
                      {branchData.sem1.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center border border-[#3f3f46] rounded-xl p-3 sm:p-4 bg-background"
                        >
                          <span className="text-sm sm:text-base font-semibold text-bdy tracking-wide">
                            {item.subject}
                          </span>
                          <span className="text-sm sm:text-base text-text">
                            {new Date(item.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEM 5 */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-tenor text-text tracking-widest mb-4">
                      SEMESTER 3
                    </h3>
                    <div className="space-y-3">
                      {branchData.sem3.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center border border-[#3f3f46] rounded-xl p-3 sm:p-4 bg-background"
                        >
                          <span className="text-sm sm:text-base font-semibold text-bdy tracking-wide">
                            {item.subject}
                          </span>
                          <span className="text-sm sm:text-base text-text">
                            {new Date(item.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DateSheetPage;
