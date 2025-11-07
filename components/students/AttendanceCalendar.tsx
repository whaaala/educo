"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Search, Download, RefreshCw } from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | "halfday" | "holiday" | null;

interface AttendanceDay {
  date: number;
  status: AttendanceStatus;
}

interface AttendanceCalendarProps {
  year?: number;
  onYearChange?: (year: number) => void;
}

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

// Mock attendance data - Generate random attendance for demonstration
const generateMockAttendance = (): Record<string, AttendanceDay[]> => {
  const attendance: Record<string, AttendanceDay[]> = {};
  const statuses: AttendanceStatus[] = ["present", "absent", "late", "halfday", "holiday"];

  MONTHS.forEach((month) => {
    const days: AttendanceDay[] = [];
    const daysInMonth = 10; // Simplified for demo

    for (let i = 1; i <= daysInMonth; i++) {
      // Most days are present, with occasional other statuses
      const rand = Math.random();
      let status: AttendanceStatus;
      if (rand > 0.9) status = "absent";
      else if (rand > 0.85) status = "late";
      else if (rand > 0.82) status = "halfday";
      else if (rand > 0.78) status = "holiday";
      else status = "present";

      days.push({ date: i, status });
    }
    attendance[month] = days;
  });

  return attendance;
};

export default function AttendanceCalendar({ year = 2024, onYearChange }: AttendanceCalendarProps) {
  const [selectedYear, setSelectedYear] = useState(year);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceData] = useState(generateMockAttendance());

  const getStatusIndicator = (status: AttendanceStatus) => {
    if (!status) return <div className="w-2 h-2"></div>;

    const colors = {
      present: "bg-green-500",
      absent: "bg-red-500",
      late: "bg-cyan-500",
      halfday: "bg-gray-800 dark:bg-gray-700",
      holiday: "bg-blue-500",
    };

    return (
      <div className={`w-2 h-2 rounded-full ${colors[status]}`}></div>
    );
  };

  const days = attendanceData[MONTHS[0]] || [];
  const totalPages = Math.ceil(days.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedDays = days.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Attendance
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Last Updated on : 25 May 2024
            </p>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => {
              const newYear = Number(e.target.value);
              setSelectedYear(newYear);
              onYearChange?.(newYear);
            }}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2024}>Year : 2024 / 2025</option>
            <option value={2023}>Year : 2023 / 2024</option>
            <option value={2022}>Year : 2022 / 2023</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-cyan-500"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-800 dark:bg-gray-700"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Halfday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Holiday</span>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            Row Per Page
          </span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            Entries
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Attendance Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 sticky left-0 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50">
                Date | Month
              </th>
              {MONTHS.map((month) => (
                <th key={month} className="text-center py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
            {paginatedDays.map((day, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/30 purple:hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300/90 purple:text-pink-300/90 sticky left-0 bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]">
                  {String(day.date).padStart(2, "0")}
                </td>
                {MONTHS.map((month) => {
                  const monthData = attendanceData[month];
                  const dayData = monthData?.[rowIndex];
                  return (
                    <td key={month} className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        {dayData && getStatusIndicator(dayData.status)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          Showing {startIndex + 1} to {Math.min(endIndex, days.length)} of {days.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white text-sm font-semibold"
          >
            {currentPage}
          </button>
          <button
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-colors"
          >
            {currentPage + 1}
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
