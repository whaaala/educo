"use client";

import { useState, useMemo, useEffect } from "react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import RefreshButton from "@/components/shared/RefreshButton";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { useAttendance } from "@/contexts/AttendanceContext";

type AttendanceStatus = "present" | "absent" | "late" | "halfday" | "holiday";

interface ClassAttendanceRecord {
  id: string;
  date: string;
  day: string;
  class: string;
  subject: string;
  period: string;
  status: AttendanceStatus;
  lateMinutes?: number;
  teacher: string;
}

interface AttendanceCalendarProps {
  year?: number;
  onYearChange?: (year: number) => void;
  studentId?: string;
}

type ViewMode = "day" | "week" | "month";

// Helper function to get week start and end dates
const getWeekRange = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // End of week (Saturday)
  return { start, end };
};

// Helper function to get month start and end dates
const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

export default function AttendanceCalendar({ year = 2024, onYearChange, studentId }: AttendanceCalendarProps) {
  const [selectedYear, setSelectedYear] = useState(year);
  const { getStudentAttendance } = useAttendance();
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get attendance data from context and transform to class-based records
  const classAttendanceData = useMemo(() => {
    if (!studentId) {
      // Generate mock data for demonstration
      const mockData: ClassAttendanceRecord[] = [
        {
          id: "1",
          date: "2025-11-15",
          day: "Friday",
          class: "JSS 1 A",
          subject: "Mathematics",
          period: "1st Period (8:00 AM - 9:00 AM)",
          status: "present",
          teacher: "Mr. Johnson",
        },
        {
          id: "2",
          date: "2025-11-15",
          day: "Friday",
          class: "JSS 1 A",
          subject: "English",
          period: "2nd Period (9:00 AM - 10:00 AM)",
          status: "present",
          teacher: "Mrs. Smith",
        },
      ];
      return mockData;
    }

    // Get all attendance records for this student
    const records = getStudentAttendance(studentId);

    // Transform to class-based records
    const classRecords: ClassAttendanceRecord[] = records.map((record, index) => ({
      id: `${record.studentId}-${record.date}-${index}`,
      date: record.date,
      day: new Date(record.date).toLocaleDateString("en-US", { weekday: "long" }),
      class: `${record.class} ${record.section}`,
      subject: record.subject || "General",
      period: "Full Day",
      status: record.status,
      lateMinutes: record.lateMinutes,
      teacher: record.teacher || "N/A",
    }));

    return classRecords;
  }, [studentId, getStudentAttendance]);

  // Filter data based on view mode
  const filteredData = useMemo(() => {
    const now = selectedDate;

    switch (viewMode) {
      case "day": {
        const todayStr = now.toISOString().split("T")[0];
        return classAttendanceData.filter((record) => record.date === todayStr);
      }
      case "week": {
        const { start, end } = getWeekRange(now);
        return classAttendanceData.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= start && recordDate <= end;
        });
      }
      case "month": {
        const { start, end } = getMonthRange(now);
        return classAttendanceData.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= start && recordDate <= end;
        });
      }
      default:
        return classAttendanceData;
    }
  }, [viewMode, selectedDate, classAttendanceData]);

  const handleYearChange = (value: string | number) => {
    const newYear = Number(value);
    setSelectedYear(newYear);
    onYearChange?.(newYear);
  };

  const handleRefresh = async () => {
    const now = new Date();
    setLastUpdated(now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
  };

  // Handle scroll indicators and animations for horizontal scrolling
  useEffect(() => {
    const handleScrollIndicators = () => {
      const tableContainer = document.querySelector('.overflow-x-auto');
      const leftIndicator = document.getElementById('scroll-left-indicator');
      const rightIndicator = document.getElementById('scroll-right-indicator');
      const table = tableContainer?.querySelector('table');

      if (!tableContainer || !leftIndicator || !rightIndicator || !table) return;

      let scrollTimeout: ReturnType<typeof setTimeout>;
      let isScrolling = false;

      const handleScroll = () => {
        const scrollLeft = tableContainer.scrollLeft;
        const scrollWidth = tableContainer.scrollWidth;
        const clientWidth = tableContainer.clientWidth;
        const maxScroll = scrollWidth - clientWidth;

        // Add scrolling class for animation
        if (!isScrolling) {
          table.classList.add('is-scrolling');
          isScrolling = true;
        }

        // Clear previous timeout
        clearTimeout(scrollTimeout);

        // Show left indicator when scrolled right
        if (scrollLeft > 10) {
          leftIndicator.style.opacity = '1';
        } else {
          leftIndicator.style.opacity = '0';
        }

        // Hide right indicator when scrolled to end
        if (scrollLeft >= maxScroll - 10) {
          rightIndicator.style.opacity = '0';
        } else if (scrollWidth > clientWidth) {
          rightIndicator.style.opacity = '1';
        }

        // Add smooth scale effect to non-sticky columns
        const scrollProgress = scrollLeft / maxScroll;
        const nonStickyHeaders = table.querySelectorAll('th:not(.sticky)');

        nonStickyHeaders.forEach((header: Element) => {
          const htmlHeader = header as HTMLElement;
          htmlHeader.style.transform = `scale(${0.98 + (0.02 * Math.abs(Math.sin(scrollProgress * Math.PI)))})`;
        });

        // Remove scrolling class after scrolling stops
        scrollTimeout = setTimeout(() => {
          table.classList.remove('is-scrolling');
          isScrolling = false;

          // Reset transforms
          nonStickyHeaders.forEach((header: Element) => {
            const htmlHeader = header as HTMLElement;
            htmlHeader.style.transform = 'scale(1)';
          });
        }, 150);
      };

      tableContainer.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();

      return () => {
        tableContainer.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    };

    // Delay to ensure DOM is ready
    const timer = setTimeout(handleScrollIndicators, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const getStatusBadge = (status: AttendanceStatus, lateMinutes?: number) => {
    const variants = {
      present: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      absent: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      late: "bg-cyan-100 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
      halfday: "bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      holiday: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    };

    const icons = {
      present: "✓",
      absent: "✗",
      late: "🕒",
      halfday: "◐",
      holiday: "🏖",
    };

    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold border ${variants[status]}`}>
          <span className="text-[11px] sm:text-xs">{icons[status]}</span>
          <span className="capitalize">{status}</span>
        </span>
        {status === "late" && lateMinutes && (
          <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">({lateMinutes} min)</span>
        )}
      </div>
    );
  };

  // Define columns for DataTable with mobile optimization
  const columns: ColumnConfig<ClassAttendanceRecord>[] = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      className: "text-left min-w-[80px]",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
            {new Date(item.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">{item.day}</span>
        </div>
      ),
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      className: "text-left min-w-[90px]",
      render: (item) => (
        <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
          {item.class}
        </span>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      className: "text-left min-w-[120px]",
      render: (item) => (
        <span className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
          {item.subject}
        </span>
      ),
    },
    {
      key: "period",
      label: "Period / Time",
      sortable: false,
      className: "text-left min-w-[140px]",
      render: (item) => (
        <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          {item.period}
        </span>
      ),
    },
    {
      key: "teacher",
      label: "Teacher",
      sortable: true,
      className: "text-left min-w-[100px]",
      render: (item) => (
        <span className="text-[11px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
          {item.teacher}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-center min-w-[120px]",
      render: (item) => getStatusBadge(item.status, item.lateMinutes),
    },
  ];

  const yearOptions = [
    { label: "Year : 2024 / 2025", value: 2024 },
    { label: "Year : 2023 / 2024", value: 2023 },
    { label: "Year : 2022 / 2023", value: 2022 },
  ];

  const viewModeOptions = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];

  return (
    <>
      {/* Smooth scrolling styles */}
      <style jsx>{`
        .overflow-x-auto {
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          scroll-snap-type: x proximity;
        }

        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:active {
          background-color: rgba(59, 130, 246, 0.8);
        }

        @media (prefers-color-scheme: dark) {
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.5);
          }

          .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background-color: rgba(75, 85, 99, 0.7);
          }

          .overflow-x-auto::-webkit-scrollbar-thumb:active {
            background-color: rgba(59, 130, 246, 0.6);
          }
        }

        /* Table scroll animations */
        table {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        table.is-scrolling {
          filter: brightness(0.98);
        }

        table th,
        table td {
          transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        table.is-scrolling th:not(.sticky),
        table.is-scrolling td:not(.sticky) {
          opacity: 0.95;
        }

        /* Sticky column enhanced shadow on scroll */
        table.is-scrolling th.sticky,
        table.is-scrolling td.sticky {
          box-shadow: 2px 0 8px -2px rgba(0, 0, 0, 0.15);
        }

        @media (prefers-color-scheme: dark) {
          table.is-scrolling {
            filter: brightness(1.02);
          }

          table.is-scrolling th.sticky,
          table.is-scrolling td.sticky {
            box-shadow: 2px 0 8px -2px rgba(0, 0, 0, 0.4);
          }
        }

        /* Smooth fade for scroll indicators */
        #scroll-left-indicator,
        #scroll-right-indicator {
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Add subtle pulse animation to scroll indicators */
        @keyframes pulse-indicator {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        #scroll-right-indicator {
          animation: pulse-indicator 2s ease-in-out infinite;
        }

        /* Smooth momentum scrolling for iOS */
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

    <div className="space-y-4 sm:space-y-5 md:space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl md:text-lg lg:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1 sm:mb-2">
            Attendance
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm md:text-xs lg:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Last Updated on : {lastUpdated}
            </p>
            <RefreshButton onRefresh={handleRefresh} size="sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <CustomDropdown
            value={viewMode}
            options={viewModeOptions}
            onChange={(value) => setViewMode(value as ViewMode)}
            variant="blue"
            className="w-32"
          />
          <CustomDropdown
            value={selectedYear}
            options={yearOptions}
            onChange={handleYearChange}
            variant="blue"
            className="w-48"
          />
        </div>
      </div>

      {/* Data Table - Responsive with smooth horizontal scrolling */}
      <div className="relative">
        {/* Scroll indicator gradients for better UX */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-100/80 to-transparent dark:from-gray-800/80 pointer-events-none z-20 rounded-l-xl opacity-0 transition-opacity duration-300" id="scroll-left-indicator"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100/80 to-transparent dark:from-gray-800/80 pointer-events-none z-20 rounded-r-xl opacity-100 transition-opacity duration-300 lg:opacity-0" id="scroll-right-indicator"></div>

        <DataTable<ClassAttendanceRecord>
          data={filteredData}
          columns={columns}
          getRowKey={(item) => item.id}
          showSearch={true}
          searchPlaceholder="Search by subject, teacher, or class..."
          enablePagination={true}
          enableItemsPerPage={true}
          itemsPerPageOptions={[10, 25, 50]}
          defaultItemsPerPage={10}
          emptyMessage={`No attendance records found for this ${viewMode}`}
        />
      </div>
    </div>
    </>
  );
}
