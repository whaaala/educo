"use client";

import { useState } from "react";
import DataTable, { Column } from "@/components/shared/DataTable";
import RefreshButton from "@/components/shared/RefreshButton";
import CustomDropdown from "@/components/shared/CustomDropdown";

type AttendanceStatus = "present" | "absent" | "late" | "halfday" | "holiday";

interface AttendanceDayData {
  date: number;
  [month: string]: AttendanceStatus | number;
}

interface AttendanceCalendarProps {
  year?: number;
  onYearChange?: (year: number) => void;
}

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

// Generate mock attendance data
const generateMockAttendance = (): AttendanceDayData[] => {
  const data: AttendanceDayData[] = [];
  const statuses: AttendanceStatus[] = ["present", "absent", "late", "halfday", "holiday"];

  for (let date = 1; date <= 31; date++) {
    const row: AttendanceDayData = { date };

    MONTHS.forEach((month) => {
      const rand = Math.random();
      let status: AttendanceStatus;
      if (rand > 0.9) status = "absent";
      else if (rand > 0.85) status = "late";
      else if (rand > 0.82) status = "halfday";
      else if (rand > 0.78) status = "holiday";
      else status = "present";

      row[month] = status;
    });

    data.push(row);
  }

  return data;
};

export default function AttendanceCalendar({ year = 2024, onYearChange }: AttendanceCalendarProps) {
  const [selectedYear, setSelectedYear] = useState(year);
  const [attendanceData] = useState(generateMockAttendance());
  const [lastUpdated, setLastUpdated] = useState("25 May 2024");

  const handleYearChange = (value: string | number) => {
    const newYear = Number(value);
    setSelectedYear(newYear);
    onYearChange?.(newYear);
  };

  const handleRefresh = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const now = new Date();
    setLastUpdated(now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
  };

  const getStatusIndicator = (status: AttendanceStatus | number) => {
    if (typeof status === "number" || !status) return null;

    const colors = {
      present: "bg-green-500 dark:bg-green-600 midnight:bg-green-500 purple:bg-green-500",
      absent: "bg-red-500 dark:bg-red-600 midnight:bg-red-500 purple:bg-red-500",
      late: "bg-cyan-500 dark:bg-cyan-600 midnight:bg-cyan-400 purple:bg-cyan-500",
      halfday: "bg-gray-800 dark:bg-gray-600 midnight:bg-gray-700 purple:bg-gray-700",
      holiday: "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-600 purple:bg-pink-500",
    };

    return (
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-3 2xl:h-3 rounded-full shadow-sm transition-transform hover:scale-150"
        style={{ backgroundColor: colors[status as AttendanceStatus]?.replace(/bg-(\w+)-(\d+)/, (_, color, shade) => `var(--${color}-${shade})`) }}>
        <div className={`w-full h-full ${colors[status as AttendanceStatus]} rounded-full`}></div>
      </div>
    );
  };

  // Define columns for DataTable
  const columns: Column<AttendanceDayData>[] = [
    {
      key: "date",
      label: "Date | Month",
      sortable: true,
      className: "text-left sticky left-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 z-10",
      render: (row) => (
        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
          {String(row.date).padStart(2, "0")}
        </span>
      ),
    },
    ...MONTHS.map((month) => ({
      key: month,
      label: month,
      sortable: false,
      className: "text-center",
      render: (row: AttendanceDayData) => (
        <div className="flex items-center justify-center">
          {getStatusIndicator(row[month])}
        </div>
      ),
    })),
  ];

  const yearOptions = [
    { label: "Year : 2024 / 2025", value: 2024 },
    { label: "Year : 2023 / 2024", value: 2023 },
    { label: "Year : 2022 / 2023", value: 2022 },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-4 lg:space-y-6 xl:space-y-7 2xl:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl md:text-lg lg:text-2xl xl:text-3xl 2xl:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1 sm:mb-2 md:mb-1 lg:mb-2">
            Attendance
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Last Updated on : {lastUpdated}
            </p>
            <RefreshButton onRefresh={handleRefresh} size="sm" />
          </div>
        </div>

        <CustomDropdown
          value={selectedYear}
          options={yearOptions}
          onChange={handleYearChange}
          variant="blue"
          className="w-full sm:w-auto lg:w-48 xl:w-56 2xl:w-52"
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-3 lg:gap-5 xl:gap-6 2xl:gap-5 p-3 sm:p-4 md:p-3 lg:p-4 xl:p-5 2xl:p-4 bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-4 2xl:h-4 rounded bg-green-500 shadow-sm"></div>
          <span className="text-[10px] sm:text-xs md:text-[10px] lg:text-sm xl:text-base 2xl:text-sm font-medium sm:font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Present</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-4 2xl:h-4 rounded bg-red-500 shadow-sm"></div>
          <span className="text-[10px] sm:text-xs md:text-[10px] lg:text-sm xl:text-base 2xl:text-sm font-medium sm:font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Absent</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-4 2xl:h-4 rounded bg-cyan-500 shadow-sm"></div>
          <span className="text-[10px] sm:text-xs md:text-[10px] lg:text-sm xl:text-base 2xl:text-sm font-medium sm:font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Late</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-4 2xl:h-4 rounded bg-gray-800 dark:bg-gray-600 shadow-sm"></div>
          <span className="text-[10px] sm:text-xs md:text-[10px] lg:text-sm xl:text-base 2xl:text-sm font-medium sm:font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Halfday</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-4 2xl:h-4 rounded bg-blue-500 shadow-sm"></div>
          <span className="text-[10px] sm:text-xs md:text-[10px] lg:text-sm xl:text-base 2xl:text-sm font-medium sm:font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Holiday</span>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<AttendanceDayData>
        data={attendanceData}
        columns={columns}
        getRowKey={(item, index) => `date-${item.date}-${index}`}
        enablePagination={true}
        enableSearch={false}
        enableItemsPerPage={true}
        itemsPerPageOptions={[10, 25, 31]}
        defaultItemsPerPage={10}
        searchPlaceholder="Search by date..."
        emptyMessage="No attendance data available"
      />
    </div>
  );
}
