"use client";

import { Student } from "./StudentCard";
import { MoreVertical, MessageCircle, Phone, Mail, Search } from "lucide-react";
import { useState, useEffect } from "react";

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Update zebra striping for visible rows
  useEffect(() => {
    const visibleRows = document.querySelectorAll('tr[data-visible="true"]');
    visibleRows.forEach((row, index) => {
      const isEven = index % 2 === 0;
      if (isEven) {
        row.classList.add('bg-black/5', 'dark:bg-black/20');
        row.classList.remove('bg-transparent');
      } else {
        row.classList.add('bg-transparent');
        row.classList.remove('bg-black/5', 'dark:bg-black/20');
      }
    });
  }, [searchQuery]);

  return (
    <div className="w-full h-[90vh] bg-white/80 dark:bg-gray-800/80 midnight:bg-gray-900/80 purple:bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-x-auto overflow-y-auto scrollbar-thin hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-600 scrollbar-thumb-transparent scrollbar-track-transparent transition-all duration-300">
      {/* Table Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 midnight:bg-gray-900/90 purple:bg-gray-900/90 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-300 purple:text-pink-300">
          Student Records
        </h2>

        {/* Search Input Group */}
        <div className="group relative flex items-center gap-2 w-[35%] h-full px-3 py-2 bg-white/60 dark:bg-white/10 midnight:bg-white/5 purple:bg-white/5 rounded-lg transition-all duration-200 hover:w-[45%] hover:bg-white/90 dark:hover:bg-white/20 hover:shadow-lg">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search data..."
            className="w-full bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Table Body Container */}
      <div className="w-full bg-white/60 dark:bg-gray-800/60 midnight:bg-gray-900/60 purple:bg-gray-900/60">
        <table className="w-full border-collapse">
          {/* Table Header - Sticky */}
          <thead className="sticky top-[68px] z-20">
            <tr className="bg-gray-200 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/50 purple:border-pink-500/50">
              <th className="sticky left-0 z-30 bg-gray-200 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[3rem] sm:min-w-[4rem]">
                ID
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[100px]">
                Admission No
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[80px]">
                Roll No
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[150px]">
                Name
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[70px]">
                Class
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[80px]">
                Section
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[80px]">
                Gender
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[100px]">
                Status
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[110px]">
                Date of Join
              </th>
              <th className="px-2 sm:px-3 md:px-4 py-3 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[120px]">
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body - with Zebra Striping */}
          <tbody>
            {students.map((student, index) => {
              // Extract class and section from "III, A" format
              const [classNum, section] = student.class.split(", ");

              // Check if student matches search query
              const searchLower = searchQuery.toLowerCase();
              const isVisible = !searchQuery ||
                student.id.toLowerCase().includes(searchLower) ||
                student.name.toLowerCase().includes(searchLower) ||
                student.rollNo.toLowerCase().includes(searchLower) ||
                student.class.toLowerCase().includes(searchLower) ||
                student.gender.toLowerCase().includes(searchLower) ||
                student.status.toLowerCase().includes(searchLower) ||
                student.joinedOn.toLowerCase().includes(searchLower);

              return (
                <tr
                  key={student.id}
                  style={{
                    '--delay': `${index / 25}s`,
                    display: isVisible ? 'table-row' : 'none',
                  } as React.CSSProperties}
                  className={`transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-700/80 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 ${
                    isVisible
                      ? 'animate-in fade-in slide-in-from-right-4 duration-300'
                      : ''
                  }`}
                  data-visible={isVisible}
                >
                  {/* ID */}
                  <td className="px-3 sm:px-4 py-3 text-left transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.1s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {index + 1}
                    </span>
                  </td>

                  {/* Admission No */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.15s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                      {student.id}
                    </span>
                  </td>

                  {/* Roll No */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.2s)` }}>
                    <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.rollNo}
                    </span>
                  </td>

                  {/* Name with Avatar */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.25s)` }}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0 transition-all duration-300">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  {/* Class */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.3s)` }}>
                    <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {classNum}
                    </span>
                  </td>

                  {/* Section */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.35s)` }}>
                    <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {section}
                    </span>
                  </td>

                  {/* Gender */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.4s)` }}>
                    <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.gender}
                    </span>
                  </td>

                  {/* Status - Pill Badge */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.45s)` }}>
                    <div className="flex items-center justify-center">
                      <span
                        className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-center min-w-[70px] sm:min-w-[80px] ${
                          student.status === "Active"
                            ? "bg-green-500/90 text-green-50 dark:bg-green-600/90"
                            : "bg-red-500/90 text-red-50 dark:bg-red-600/90"
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                  </td>

                  {/* Date of Join */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.5s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                      {student.joinedOn}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.55s)` }}>
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-blue-500/20 dark:hover:bg-blue-400/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group"
                        title="Message"
                      >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </button>
                      <button
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-green-500/20 dark:hover:bg-green-400/20 transition-all duration-200 group"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                      </button>
                      <button
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-purple-500/20 dark:hover:bg-purple-400/20 transition-all duration-200 group"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      </button>
                      <button
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-500/20 dark:hover:bg-gray-400/20 transition-all duration-200 group"
                        title="More"
                      >
                        <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
