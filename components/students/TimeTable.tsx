"use client";

import { useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import type { TimetableEntry } from "@/lib/mockStudents";
import TimetableCell from "./TimetableCell";
import CustomDropdown from "@/components/shared/CustomDropdown";

interface TimeTableProps {
  timetable?: TimetableEntry[];
}

export default function TimeTable({ timetable }: TimeTableProps) {
  const [selectedYear, setSelectedYear] = useState("this-year");
  const [currentWeek, setCurrentWeek] = useState(1);

  const yearOptions = [
    { label: "This Year", value: "this-year" },
    { label: "Last Year", value: "last-year" },
    { label: "2 Years Ago", value: "2-years-ago" },
  ];

  // Calculate total weeks in a year (52 weeks)
  const totalWeeks = 52;

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < totalWeeks) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleWeekChange = (value: string | number) => {
    setCurrentWeek(Number(value));
  };

  // Generate week options for dropdown
  const weekOptions = Array.from({ length: totalWeeks }, (_, i) => ({
    label: `Week ${i + 1}`,
    value: i + 1,
  }));

  if (!timetable || timetable.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 p-8">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-cyan-950/30 midnight:to-blue-950/30 purple:from-pink-950/30 purple:to-purple-950/30 mb-6 mx-auto">
            <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
            No Timetable Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 max-w-sm mx-auto">
            Student timetable will be displayed here once available
          </p>
        </div>
      </div>
    );
  }

  // Color palettes for different subjects
  const subjectColors: Record<string, { bg: string; text: string }> = {
    Maths: {
      bg: "bg-pink-50 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30",
      text: "text-pink-700 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400",
    },
    Spanish: {
      bg: "bg-cyan-50 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30",
      text: "text-cyan-700 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400",
    },
    Computer: {
      bg: "bg-green-50 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
      text: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
    },
    Physics: {
      bg: "bg-amber-50 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
    },
    English: {
      bg: "bg-purple-50 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
    },
    Science: {
      bg: "bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
    },
    Chemistry: {
      bg: "bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30",
      text: "text-gray-700 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
    },
  };

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject] || subjectColors.Science;
  };

  // Get all class periods (non-break periods)
  const allClassPeriods = timetable[0].periods.filter((p) => p.type === "class");

  // Get break periods for the legend
  const breaks = timetable[0].periods.filter((p) => p.type === "break");

  return (
    <div className="space-y-6">
      {/* Timetable Grid with integrated header */}
      <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-2.5 border-b border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/5 dark:to-indigo-900/5 midnight:from-cyan-900/5 midnight:to-blue-900/5 purple:from-pink-900/5 purple:to-purple-900/5">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Timetable
              </h2>
            </div>

            {/* Center: Week Navigation */}
            <div className="flex items-center gap-2">
              {/* Previous Week Button */}
              <button
                onClick={handlePreviousWeek}
                disabled={currentWeek === 1}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Week Selector */}
              <CustomDropdown
                value={currentWeek}
                options={weekOptions}
                onChange={handleWeekChange}
                variant="blue"
                className="w-32"
              />

              {/* Next Week Button */}
              <button
                onClick={handleNextWeek}
                disabled={currentWeek === totalWeeks}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Current Week Info */}
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 ml-2">
                Week {currentWeek} of {totalWeeks}
              </div>
            </div>

            {/* Right: Year Selector */}
            <CustomDropdown
              value={selectedYear}
              options={yearOptions}
              onChange={(value) => setSelectedYear(value as string)}
              variant="blue"
              className="w-40"
            />
          </div>
        </div>

        {/* Timetable Content */}
        <div className="p-6">
            {/* Week Selection Info Banner */}
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                    Viewing timetable for Week {currentWeek} ({selectedYear === "this-year" ? "This Year" : selectedYear === "last-year" ? "Last Year" : "2 Years Ago"})
                  </span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">
                  {/* Calculate date range for the week */}
                  {(() => {
                    const now = new Date();
                    const startOfYear = new Date(now.getFullYear(), 0, 1);
                    const weekStart = new Date(startOfYear);
                    weekStart.setDate(startOfYear.getDate() + (currentWeek - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                  })()}
                </span>
              </div>
            </div>

            {/* Days Header Row */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {timetable.map((daySchedule) => (
                <div
                  key={daySchedule.day}
                  className="relative"
                >
                  <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900/10 dark:to-indigo-900/10 midnight:from-cyan-900/10 midnight:to-blue-900/10 purple:from-pink-900/10 purple:to-purple-900/10 rounded-lg py-2.5 px-3 border border-blue-100/50 dark:border-blue-800/20 midnight:border-cyan-500/20 purple:border-pink-500/20">
                    <h3 className="text-xs font-bold text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 text-center uppercase tracking-wider">
                      {daySchedule.day}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Period Rows */}
            {allClassPeriods.map((_, periodIndex) => {
              return (
                <div
                  key={periodIndex}
                  className="grid grid-cols-6 gap-4 mb-4 last:mb-0"
                >
                  {/* Day Columns */}
                  {timetable.map((daySchedule) => {
                    const classPeriods = daySchedule.periods.filter((p) => p.type === "class");
                    const period = classPeriods[periodIndex];

                    if (!period) return <div key={daySchedule.day} className=""></div>;

                    const colors = getSubjectColor(period.subject);

                    return (
                      <div key={daySchedule.day}>
                        <TimetableCell
                          time={period.time}
                          subject={period.subject}
                          teacher={period.teacher}
                          teacherAvatar={period.teacherAvatar}
                          backgroundColor={colors.bg}
                          textColor={colors.text}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>

      {/* Break Times */}
      {breaks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {breaks.map((breakPeriod, index) => {
            // Assign colors based on break type
            let bgColor = "bg-blue-500";
            let label = breakPeriod.subject;

            if (label === "Morning Break") {
              bgColor = "bg-blue-500";
            } else if (label === "Lunch") {
              bgColor = "bg-amber-500";
            } else if (label === "Evening Break") {
              bgColor = "bg-indigo-500";
            }

            return (
              <div
                key={index}
                className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 flex items-center gap-3"
              >
                <div className={`${bgColor} text-white px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap`}>
                  {label}
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{breakPeriod.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
