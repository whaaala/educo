"use client";

import { Student } from "./StudentCard";
import { MoreVertical, MessageCircle, Phone, Mail, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    const searchLower = searchQuery.toLowerCase();
    return !searchQuery ||
      student.id.toLowerCase().includes(searchLower) ||
      student.name.toLowerCase().includes(searchLower) ||
      student.rollNo.toLowerCase().includes(searchLower) ||
      student.class.toLowerCase().includes(searchLower) ||
      student.gender.toLowerCase().includes(searchLower) ||
      student.status.toLowerCase().includes(searchLower) ||
      student.joinedOn.toLowerCase().includes(searchLower);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
  }, [paginatedStudents]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 backdrop-blur-md shadow-lg rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/30 purple:border-pink-500/30 transition-all duration-300">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 midnight:from-gray-900 midnight:to-gray-850 purple:from-gray-900 purple:to-gray-850 backdrop-blur-md px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 flex flex-row items-center justify-between gap-3 border-b border-gray-200/70 dark:border-gray-700/70 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-t-xl md:rounded-t-2xl">
        <h2 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-300 purple:text-pink-300 tracking-tight whitespace-nowrap">
          Student Records
        </h2>

        {/* Search Input Group */}
        <div className="group relative flex items-center gap-2 w-full sm:w-[45%] md:w-[35%] h-7 sm:h-8 px-2.5 py-1 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 transition-all duration-300 sm:hover:w-[50%] md:hover:w-[45%] hover:border-blue-400 dark:hover:border-blue-500 midnight:hover:border-cyan-400 purple:hover:border-pink-400 hover:shadow-sm sm:focus-within:w-[50%] md:focus-within:w-[45%] focus-within:border-blue-500 dark:focus-within:border-blue-400 midnight:focus-within:border-cyan-400 purple:focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20">
          <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/70 purple:text-pink-400/70 flex-shrink-0 transition-colors duration-300 group-hover:text-blue-500 group-focus-within:text-blue-500 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full bg-transparent border-none outline-none text-[11px] sm:text-xs text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Table Body Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
          {/* Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-750 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 border-b-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/50 purple:border-pink-500/50 shadow-sm">
              <th className="sticky left-0 z-30 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-750 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 px-4 sm:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[3rem] sm:min-w-[4rem]">
                ID
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[100px]">
                Admission No
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[80px]">
                Roll No
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[150px]">
                Name
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[70px]">
                Class
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[80px]">
                Section
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[80px]">
                Gender
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[100px]">
                Status
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[110px]">
                Date of Join
              </th>
              <th className="px-3 sm:px-4 md:px-5 py-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap min-w-[120px]">
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body - with Zebra Striping */}
          <tbody>
            {paginatedStudents.map((student, index) => {
              // Extract class and section from "III, A" format
              const [classNum, section] = student.class.split(", ");

              return (
                <tr
                  key={student.id}
                  style={{
                    '--delay': `${index / 25}s`,
                  } as React.CSSProperties}
                  className="border-b border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:shadow-sm animate-in fade-in slide-in-from-right-4 duration-300"
                  data-visible="true"
                >
                  {/* ID */}
                  <td className="px-4 sm:px-5 py-4 text-left transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.1s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {startIndex + index + 1}
                    </span>
                  </td>

                  {/* Admission No */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.15s)` }}>
                    <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                      {student.id}
                    </span>
                  </td>

                  {/* Roll No */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.2s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.rollNo}
                    </span>
                  </td>

                  {/* Name with Avatar */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.25s)` }}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0 transition-all duration-300 shadow-md">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  {/* Class */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.3s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {classNum}
                    </span>
                  </td>

                  {/* Section */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.35s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {section}
                    </span>
                  </td>

                  {/* Gender */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.4s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.gender}
                    </span>
                  </td>

                  {/* Status - Pill Badge */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.45s)` }}>
                    <div className="flex items-center justify-start">
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-center min-w-[75px] shadow-sm transition-all duration-300 ${
                          student.status === "Active"
                            ? "bg-green-500 text-white dark:bg-green-600"
                            : "bg-red-500 text-white dark:bg-red-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                  </td>

                  {/* Date of Join */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.5s)` }}>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                      {student.joinedOn}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-3 sm:px-4 md:px-5 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.55s)` }}>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-110 active:scale-95"
                        title="Message"
                      >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-110 active:scale-95"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-110 active:scale-95"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-110 active:scale-95"
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

      {/* Pagination Controls */}
      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 midnight:from-gray-900 midnight:to-gray-850 purple:from-gray-900 purple:to-gray-850 backdrop-blur-md px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 border-t border-gray-200/70 dark:border-gray-700/70 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-b-xl md:rounded-b-2xl">
          {/* Left - Showing info */}
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-medium order-2 sm:order-1">
            Showing <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{startIndex + 1}</span> to{" "}
            <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{Math.min(endIndex, filteredStudents.length)}</span> of{" "}
            <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{filteredStudents.length}</span> entries
          </div>

          {/* Center - Page numbers */}
          <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-blue-100 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 cursor-pointer hover:scale-110 active:scale-95"
              }`}
              title="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1;

                // Show ellipsis
                const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
                  return null;
                }

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span key={pageNum} className="px-2 text-gray-400 dark:text-gray-500 font-bold">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[30px] h-7 sm:h-8 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white shadow-md scale-105"
                        : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-blue-100 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 cursor-pointer hover:scale-110 active:scale-95"
              }`}
              title="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>

          {/* Right - Items per page */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 order-3">
            <label htmlFor="itemsPerPage" className="whitespace-nowrap">Items per page:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-500 purple:focus:ring-pink-500 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
          </div>
      </div>
    </div>
  );
}
