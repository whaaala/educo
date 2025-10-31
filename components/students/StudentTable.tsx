"use client";

import { Student } from "./StudentCard";
import { MoreVertical, MessageCircle, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "@/components/shared/SearchBar";

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    if (!searchQuery.trim()) return true;

    const searchData = searchQuery.toLowerCase().trim();
    const studentData = [
      student.name,
      student.id,
      student.rollNo,
      student.class,
      student.gender,
      student.status,
      student.joinedOn,
    ]
      .join(' ')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    return studentData.includes(searchData);
  });

  // Calculate pagination from filtered students
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Apply staggered animation delays to rows
  useEffect(() => {
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row, index) => {
      (row as HTMLElement).style.setProperty('--delay', `${index / 25}s`);
    });
  }, [paginatedStudents]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 backdrop-blur-md shadow-lg rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/30 purple:border-pink-500/30 transition-all duration-300">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 midnight:from-gray-900 midnight:to-gray-850 purple:from-gray-900 purple:to-gray-850 backdrop-blur-md px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 flex flex-row items-center justify-between gap-3 border-b border-gray-200/70 dark:border-gray-700/70 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-t-xl md:rounded-t-2xl">
        <h2 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-300 purple:text-pink-300 tracking-tight whitespace-nowrap">
          Student Records {searchQuery && `(${filteredStudents.length})`}
        </h2>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search students..."
          size="sm"
          className="w-full sm:w-[45%] md:w-[35%]"
        />
      </div>

      {/* Table Body Container */}
      <div>
        <table className="w-full border-collapse bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
          {/* Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-750 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 border-b-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/50 purple:border-pink-500/50 shadow-sm">
              {/* ID - Hidden on mobile */}
              <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                ID
              </th>
              {/* Admission No - Hidden on mobile and tablet */}
              <th className="hidden xl:table-cell px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                Admission No
              </th>
              {/* Roll No - Hidden on mobile */}
              <th className="hidden md:table-cell px-3 md:px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                Roll No
              </th>
              {/* Name - Always visible */}
              <th className="px-3 md:px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                Name
              </th>
              {/* Class - Always visible */}
              <th className="px-3 md:px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                Class
              </th>
              {/* Section - Hidden on mobile */}
              <th className="hidden md:table-cell px-3 md:px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                Section
              </th>
              {/* Gender - Hidden on mobile and tablet */}
              <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                Gender
              </th>
              {/* Status - Always visible */}
              <th className="px-3 md:px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                Status
              </th>
              {/* Date of Join - Hidden on mobile */}
              <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                Date of Join
              </th>
              {/* Action - Always visible */}
              <th className="px-3 md:px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
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
                  className="border-b border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:shadow-sm"
                  data-visible="true"
                >
                  {/* ID - Hidden on mobile */}
                  <td className="hidden lg:table-cell px-4 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {startIndex + index + 1}
                    </span>
                  </td>

                  {/* Admission No - Hidden on mobile and tablet */}
                  <td className="hidden xl:table-cell px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.15s)` }}>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                      {student.id}
                    </span>
                  </td>

                  {/* Roll No - Hidden on mobile */}
                  <td className="hidden md:table-cell px-3 md:px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.2s)` }}>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.rollNo}
                    </span>
                  </td>

                  {/* Name with Avatar - Always visible */}
                  <td className="px-3 md:px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.25s)` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 transition-all duration-300 shadow-md">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-gray-900 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate max-w-[120px] md:max-w-none">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  {/* Class - Always visible */}
                  <td className="px-3 md:px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.3s)` }}>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {classNum}
                    </span>
                  </td>

                  {/* Section - Hidden on mobile */}
                  <td className="hidden md:table-cell px-3 md:px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.35s)` }}>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {section}
                    </span>
                  </td>

                  {/* Gender - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.4s)` }}>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.gender}
                    </span>
                  </td>

                  {/* Status - Always visible */}
                  <td className="px-3 md:px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.45s)` }}>
                    <div className="flex items-center justify-start">
                      <span
                        className={`inline-block px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold text-center min-w-[60px] md:min-w-[70px] shadow-sm transition-all duration-300 ${
                          student.status === "Active"
                            ? "bg-green-500 text-white dark:bg-green-600"
                            : "bg-red-500 text-white dark:bg-red-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                  </td>

                  {/* Date of Join - Hidden on mobile */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.5s)` }}>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                      {student.joinedOn}
                    </span>
                  </td>

                  {/* Action Buttons - Always visible, reduced on mobile */}
                  <td className="px-3 md:px-4 py-4 whitespace-nowrap transition-all duration-300" style={{ transitionDelay: `calc(var(--delay) + 0.55s)` }}>
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <button
                        className="p-1.5 md:p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-110 active:scale-95"
                        title="Message"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </button>
                      <button
                        className="hidden md:block p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-110 active:scale-95"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                      </button>
                      <button
                        className="hidden md:block p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-110 active:scale-95"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      </button>
                      <button
                        className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-110 active:scale-95"
                        title="More"
                      >
                        <MoreVertical className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
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
            {filteredStudents.length > 0 ? (
              <>
                Showing <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{Math.min(endIndex, filteredStudents.length)}</span> of{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-200 purple:text-pink-200">{filteredStudents.length}</span> {searchQuery ? 'filtered' : 'total'} entries
              </>
            ) : (
              <span>No matching entries found</span>
            )}
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
