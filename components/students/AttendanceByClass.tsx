"use client";

import { useState, useEffect, useMemo } from "react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import RefreshButton from "@/components/shared/RefreshButton";
import CustomDropdown from "@/components/shared/CustomDropdown";
import WeekNavigator from "@/components/shared/WeekNavigator";
import AttendanceStatusBadge from "@/components/shared/AttendanceStatusBadge";
import Tooltip from "@/components/shared/Tooltip";
import { Clock } from "lucide-react";
import { getSchoolConfig, type TimetableConfig } from "@/lib/timetableConfig";
import {
  getStudentEnrolledSubjects,
  getStudentAttendanceData,
  type ClassAttendanceData
} from "@/lib/mockStudents";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface AttendanceByClassProps {
  year?: number;
  onYearChange?: (year: number) => void;
  studentId?: string; // Optional: filter attendance by student's enrolled subjects
}

// Helper function to generate week options based on current date
// Shows weeks from start of year up to 2 weeks ahead of current date
const generateWeekOptions = (startYear: number = new Date().getFullYear()) => {
  const weeks: { label: string; value: number; startDate: string; endDate: string }[] = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Get current date
  const now = new Date();
  const currentYear = now.getFullYear();

  // Start from the first Monday of the selected year
  // January 1st might not be a Monday, so we need to adjust
  let weekStartDate = new Date(startYear, 0, 1); // Jan 1
  const dayOfWeek = weekStartDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // If Jan 1 is not Monday, move to the first Monday
  // If it's Sunday (0), add 1 day. If it's Tuesday-Saturday (2-6), subtract to previous Monday
  if (dayOfWeek === 0) {
    // Sunday - move forward 1 day to Monday
    weekStartDate.setDate(weekStartDate.getDate() + 1);
  } else if (dayOfWeek > 1) {
    // Tuesday-Saturday - move back to Monday
    weekStartDate.setDate(weekStartDate.getDate() - (dayOfWeek - 1));
  }
  // If dayOfWeek === 1, it's already Monday, no adjustment needed

  // Calculate how many weeks to generate
  // If viewing current year, generate up to 2 weeks ahead of today
  // If viewing past/future year, generate all weeks from Jan to Dec (52 weeks)
  let totalWeeks: number;

  if (startYear === currentYear) {
    // Calculate current week number
    const startOfYear = new Date(startYear, 0, 1);
    const diffInTime = now.getTime() - startOfYear.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    const currentWeekNumber = Math.floor(diffInDays / 7) + 1;

    // Generate weeks up to 2 weeks ahead
    totalWeeks = currentWeekNumber + 2;
  } else {
    // For other years, generate full year (52 weeks)
    totalWeeks = 52;
  }

  // Format date helper - compact format for single line display
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format date helper - very compact format (DD Mon)
  const formatCompactDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 6); // 7 days (0-6)

    const startDate = formatDate(weekStart);
    const endDate = formatDate(weekEnd);

    // Ultra-compact label format: "Week 45 (05-11 Nov)" - fits in one line
    const startDay = String(weekStart.getDate()).padStart(2, '0');
    const endDay = String(weekEnd.getDate()).padStart(2, '0');
    const endMonth = months[weekEnd.getMonth()];

    weeks.push({
      label: `Week ${weekNum} (${startDay}-${endDay} ${endMonth})`,
      value: weekNum,
      startDate,
      endDate
    });

    // Move to next week (7 days forward)
    weekStartDate.setDate(weekStartDate.getDate() + 7);
  }

  return weeks;
};

// Default subjects that can be used for any number of periods
const DEFAULT_SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Physical Education",
  "Art",
  "Music",
  "Geography",
  "Computer Science",
  "Chemistry",
  "Physics",
  "Biology",
  "Literature",
  "Spanish",
  "French",
];

// Get timetable configuration
const getTimetableConfig = (): TimetableConfig => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem('customTimetableConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load custom config:', error);
      }
    }
  }
  // Default fallback
  return getSchoolConfig("school-1");
};

// Helper function to calculate current week number based on user's timezone
const getCurrentWeekNumber = (startYear: number): number => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // If current year doesn't match the selected year, default to week 1
  if (currentYear !== startYear) {
    return 1;
  }

  // Find the first Monday of the year (same logic as generateWeekOptions)
  let firstMonday = new Date(startYear, 0, 1); // Jan 1
  const dayOfWeek = firstMonday.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Adjust to get the first Monday
  if (dayOfWeek === 0) {
    // Sunday - move forward 1 day to Monday
    firstMonday.setDate(firstMonday.getDate() + 1);
  } else if (dayOfWeek > 1) {
    // Tuesday-Saturday - move back to Monday
    firstMonday.setDate(firstMonday.getDate() - (dayOfWeek - 1));
  }
  // If dayOfWeek === 1, it's already Monday, no adjustment needed

  const diffInTime = now.getTime() - firstMonday.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

  // Calculate week number (1-indexed)
  const weekNumber = Math.floor(diffInDays / 7) + 1;

  return Math.max(1, weekNumber);
};

export default function AttendanceByClass({ year = new Date().getFullYear(), onYearChange, studentId }: AttendanceByClassProps) {
  const [selectedYear, setSelectedYear] = useState(year);
  const [config, setConfig] = useState<TimetableConfig>(getTimetableConfig());
  const [attendanceData, setAttendanceData] = useState<ClassAttendanceData[]>([]);
  const [lastUpdated, setLastUpdated] = useState("25 May 2024");
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(() => getCurrentWeekNumber(year));

  // Load config and generate data when it changes
  useEffect(() => {
    const loadedConfig = getTimetableConfig();
    setConfig(loadedConfig);

    // Generate student-specific attendance data with selected year
    // Generate data for full year (365 days) to cover all weeks
    const studentIdToUse = studentId || "default-student";
    const data = getStudentAttendanceData(studentIdToUse, loadedConfig.periodsPerDay, 365, selectedYear);
    setAttendanceData(data);

    // If we have a specific student, get their subjects, otherwise use defaults
    if (studentId) {
      const subjects = getStudentEnrolledSubjects(studentId);
      setEnrolledSubjects(subjects);
    } else {
      setEnrolledSubjects([]);
    }

    // Listen for localStorage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customTimetableConfig') {
        const updatedConfig = getTimetableConfig();
        setConfig(updatedConfig);
        const newData = getStudentAttendanceData(studentIdToUse, updatedConfig.periodsPerDay, 365, selectedYear);
        setAttendanceData(newData);

        // Reload subjects if needed
        if (studentId) {
          const subjects = getStudentEnrolledSubjects(studentId);
          setEnrolledSubjects(subjects);
        }
      }
    };

    // Listen for custom event when config changes in same tab
    const handleConfigChange = () => {
      const updatedConfig = getTimetableConfig();
      setConfig(updatedConfig);
      const newData = getStudentAttendanceData(studentIdToUse, updatedConfig.periodsPerDay, 365, selectedYear);
      setAttendanceData(newData);

      // Reload subjects if needed
      if (studentId) {
        const subjects = getStudentEnrolledSubjects(studentId);
        setEnrolledSubjects(subjects);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('timetableConfigChanged', handleConfigChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('timetableConfigChanged', handleConfigChange);
    };
  }, [studentId, selectedYear]);

  const handleYearChange = (value: string | number) => {
    const newYear = Number(value);
    setSelectedYear(newYear);

    // Reset to current week for the new year
    setSelectedWeek(getCurrentWeekNumber(newYear));

    onYearChange?.(newYear);
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const now = new Date();
    setLastUpdated(now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));

    // Reload config in case it changed
    const loadedConfig = getTimetableConfig();
    setConfig(loadedConfig);

    // Regenerate student-specific attendance data with selected year (full year)
    const studentIdToUse = studentId || "default-student";
    setAttendanceData(getStudentAttendanceData(studentIdToUse, loadedConfig.periodsPerDay, 365, selectedYear));

    // Reload enrolled subjects if student is specified
    if (studentId) {
      const subjects = getStudentEnrolledSubjects(studentId);
      setEnrolledSubjects(subjects);
    }
  };

  const getStatusIndicator = (status: AttendanceStatus) => {
    const colors = {
      present: "bg-green-500 dark:bg-green-600",
      absent: "bg-red-500 dark:bg-red-600",
      late: "bg-cyan-500 dark:bg-cyan-600",
      excused: "bg-blue-500 dark:bg-blue-600",
    };

    const labels = {
      present: "P",
      absent: "A",
      late: "L",
      excused: "E",
    };

    return (
      <div className="flex items-center justify-center">
        <div
          className={`w-8 h-8 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full ${colors[status]} flex items-center justify-center text-white font-bold text-xs md:text-[10px] lg:text-xs shadow-sm transition-transform hover:scale-125`}
        >
          {labels[status]}
        </div>
      </div>
    );
  };

  // Helper function to check if a date is in the future (including future days in current week)
  const isFutureDate = (dateStr: string): boolean => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const monthIndex = months.indexOf(parts[1]);
      const year = parseInt(parts[2]);

      const dateToCheck = new Date(year, monthIndex, day);
      dateToCheck.setHours(0, 0, 0, 0); // Reset time to start of day

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

      // Return true if date is after today (including future days in current week)
      return dateToCheck > today;
    }
    return false;
  };

  // Helper function to check if a day is blocked (no classes)
  const isBlockedDay = (dayShortName: string): boolean => {
    const blockedDays = config.blockedDays || [];
    const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Convert blocked day names (full names like "Saturday") to short names for comparison
    const blockedShortDays = blockedDays.map(day => {
      const index = fullDayNames.indexOf(day);
      return index !== -1 ? shortDayNames[index] : day;
    });

    return blockedShortDays.includes(dayShortName);
  };

  // Generate columns dynamically based on periodsPerDay and enrolled subjects
  const columns: ColumnConfig<ClassAttendanceData>[] = useMemo(() => {
    const periodsPerDay = config.periodsPerDay;

    // Use enrolled subjects if available, otherwise use default subjects
    const availableSubjects = enrolledSubjects.length > 0 ? enrolledSubjects : DEFAULT_SUBJECTS;
    const subjects = availableSubjects.slice(0, periodsPerDay);

    // Determine number of periods to show (match number of enrolled subjects if specified)
    const periodsToShow = enrolledSubjects.length > 0
      ? Math.min(enrolledSubjects.length, periodsPerDay)
      : periodsPerDay;

    const periodLabels = Array.from({ length: periodsToShow }, (_, i) => `Period ${i + 1}`);

    return [
      {
        key: "date",
        label: "Date",
        sortable: true,
        className: "text-left sticky left-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 z-10",
        render: (row: ClassAttendanceData) => {
          const isDayBlocked = isBlockedDay(row.day);
          return (
            <div className="flex flex-col items-start justify-center min-w-[80px] md:min-w-[70px] h-full">
              <span className={`text-xs md:text-[10px] lg:text-xs font-bold leading-tight ${isDayBlocked ? 'text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40' : 'text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100'}`}>
                {row.date}
              </span>
              <span className={`text-[10px] md:text-[9px] lg:text-[10px] leading-tight ${isDayBlocked ? 'text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40' : 'text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70'}`}>
                {row.day}
              </span>
            </div>
          );
        },
      },
      ...periodLabels.map((period, index) => ({
        key: `period${index + 1}`,
        label: period,
        sortable: false,
        className: "text-center",
        render: (row: ClassAttendanceData) => {
          // FIRST: Check if this day is blocked (no classes) - this takes priority over everything
          const isDayBlocked = isBlockedDay(row.day);

          if (isDayBlocked) {
            // Show blocked indicator for days with no classes (regardless of date - past, present, or future)
            return (
              <div className="flex flex-col items-center justify-center gap-1.5 h-full min-h-[60px]">
                <div className="w-8 h-8 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-gray-300 dark:bg-gray-600 midnight:bg-gray-700 purple:bg-gray-700 flex items-center justify-center shadow-sm opacity-50 flex-shrink-0">
                  <span className="text-xs md:text-[10px] font-bold text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">—</span>
                </div>
                <Tooltip content="No Class">
                  <span className="text-[10px] md:text-[9px] lg:text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 leading-tight text-center max-w-[80px] truncate block">
                    No Class
                  </span>
                </Tooltip>
              </div>
            );
          }

          // SECOND: Check if this date is in the future (only for non-blocked days)
          const isInFuture = isFutureDate(row.date);

          if (isInFuture) {
            // Show clock icon for future dates (not yet attended)
            return (
              <div className="flex flex-col items-center justify-center gap-1.5 h-full min-h-[60px]">
                <div className="w-8 h-8 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-gray-200 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 flex items-center justify-center shadow-sm flex-shrink-0">
                  <Clock className="w-4 h-4 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70" />
                </div>
                <Tooltip content={subjects[index]}>
                  <span className="text-[10px] md:text-[9px] lg:text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 leading-tight text-center max-w-[80px] truncate block">
                    {subjects[index]}
                  </span>
                </Tooltip>
              </div>
            );
          }

          // THIRD: Show regular attendance status for past/present dates (only for non-blocked days)
          const periodKey = `period${index + 1}` as keyof ClassAttendanceData;
          const status = row[periodKey] as AttendanceStatus;
          return (
            <div className="flex flex-col items-center justify-center gap-1.5 h-full min-h-[60px]">
              {getStatusIndicator(status)}
              <Tooltip content={subjects[index]}>
                <span className="text-[10px] md:text-[9px] lg:text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 leading-tight text-center max-w-[80px] truncate block">
                  {subjects[index]}
                </span>
              </Tooltip>
            </div>
          );
        },
      })),
    ];
  }, [config.periodsPerDay, enrolledSubjects]);

  // Generate week options based on selected year and current date
  const weekOptions = useMemo(() => generateWeekOptions(selectedYear), [selectedYear]);

  // Get current week's data (7 days) - matching the week boundaries from weekOptions
  const currentWeekData = useMemo(() => {
    const selectedWeekOption = weekOptions.find(w => w.value === selectedWeek);
    if (!selectedWeekOption) return [];

    // Parse the start date from the week option
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startParts = selectedWeekOption.startDate.split(' ');
    const startDay = parseInt(startParts[0]);
    const startMonth = months.indexOf(startParts[1]);
    const startYear = parseInt(startParts[2]);

    // Get configured school days (e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
    const schoolDays = config.daysOfWeek || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Filter attendance data to only include dates within this week (include ALL days, even blocked ones)
    return attendanceData.filter(item => {
      const dateParts = item.date.split(' ');
      const day = parseInt(dateParts[0]);
      const month = months.indexOf(dateParts[1]);
      const year = parseInt(dateParts[2]);

      const itemDate = new Date(year, month, day);
      const weekStart = new Date(startYear, startMonth, startDay);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // 7 days (0-6)

      return itemDate >= weekStart && itemDate <= weekEnd;
    }).slice(0, 7); // Ensure we only get 7 days max
  }, [attendanceData, selectedWeek, weekOptions]);

  const handleWeekChange = (value: string | number) => {
    setSelectedWeek(Number(value));
  };

  const handlePreviousWeek = () => {
    if (selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek < weekOptions.length) {
      setSelectedWeek(selectedWeek + 1);
    }
  };

  // Generate year options dynamically based on current year
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { label: `Year : ${currentYear} / ${currentYear + 1}`, value: currentYear },
    { label: `Year : ${currentYear - 1} / ${currentYear}`, value: currentYear - 1 },
    { label: `Year : ${currentYear - 2} / ${currentYear - 1}`, value: currentYear - 2 },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-4 lg:space-y-6 xl:space-y-7 2xl:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Year Dropdown */}
        <CustomDropdown
          value={selectedYear}
          options={yearOptions}
          onChange={handleYearChange}
          variant="blue"
          className="w-full sm:w-48 lg:w-52 xl:w-56 2xl:w-52"
        />

        {/* Week Navigation */}
        <WeekNavigator
          selectedWeek={selectedWeek}
          totalWeeks={weekOptions.length}
          weekOptions={weekOptions}
          onWeekChange={setSelectedWeek}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          compact={true}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-3 lg:gap-5 xl:gap-6 2xl:gap-5 p-3 sm:p-4 md:p-3 lg:p-4 xl:p-5 2xl:p-4 bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-sm">
        <AttendanceStatusBadge type="present" label="Present" size="sm" />
        <AttendanceStatusBadge type="absent" label="Absent" size="sm" />
        <AttendanceStatusBadge type="late" label="Late" size="sm" />
        <AttendanceStatusBadge type="excused" label="Excused" size="sm" />
        <AttendanceStatusBadge type="not-attended" label="Not Yet Attended" size="sm" />
        <AttendanceStatusBadge type="blocked" label="No Class" size="sm" />
      </div>

      {/* Data Table */}
      <DataTable<ClassAttendanceData>
        data={currentWeekData}
        columns={columns}
        getRowKey={(item) => item.date}
        enablePagination={false}
        enableItemsPerPage={false}
        emptyMessage="No attendance data available for this week"
      />
    </div>
  );
}
