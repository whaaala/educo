"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ModernCalendarProps {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

export default function ModernCalendar({ value, onChange, onClose }: ModernCalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date()
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Generate year range (current year - 100 to current year + 10)
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 111 }, (_, i) => currentYear - 100 + i);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    // Adjust firstDay to start from Monday (0 = Monday)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Convert Sunday (0) to 6, others shift by -1
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    onChange(formattedDate);
    onClose();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div
      ref={calendarRef}
      className="absolute top-full mt-2 left-0 z-[9999] w-full min-w-[320px] bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
        </button>

        <div className="flex items-center gap-2">
          <select
            value={currentDate.getMonth()}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded px-2 py-1 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 transition-colors"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index} className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
                {month}
              </option>
            ))}
          </select>
          <select
            value={currentDate.getFullYear()}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded px-2 py-1 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 transition-colors"
          >
            {yearRange.map((year) => (
              <option key={year} value={year} className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 py-1.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayInfo, index) => {
          const selected = isSelected(dayInfo.date);
          const today = isToday(dayInfo.date);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateSelect(dayInfo.date)}
              className={`
                relative h-9 w-full flex items-center justify-center text-sm font-medium rounded-full transition-all duration-150
                ${!dayInfo.isCurrentMonth
                  ? "text-gray-300 dark:text-gray-600 midnight:text-cyan-300/30 purple:text-pink-300/30 hover:bg-gray-50 dark:hover:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100"
                }
                ${selected
                  ? "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-500 purple:bg-pink-500 text-white font-semibold shadow-md hover:bg-blue-600 dark:hover:bg-blue-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20"
                }
                ${today && !selected
                  ? "ring-1 ring-blue-500 dark:ring-blue-400 midnight:ring-cyan-400 purple:ring-pink-400"
                  : ""
                }
              `}
            >
              {dayInfo.day}
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <button
          type="button"
          onClick={() => {
            const today = new Date();
            const formattedDate = today.toISOString().split("T")[0];
            onChange(formattedDate);
            onClose();
          }}
          className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-lg transition-colors"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
