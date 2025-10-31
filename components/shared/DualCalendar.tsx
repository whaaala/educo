"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

interface DualCalendarProps {
  startDate: string;
  endDate: string;
  onApply: (startDate: string, endDate: string) => void;
  onCancel: () => void;
}

export default function DualCalendar({ startDate, endDate, onApply, onCancel }: DualCalendarProps) {
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [leftMonth, setLeftMonth] = useState(new Date());
  const [rightMonth, setRightMonth] = useState(() => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    return next;
  });

  useEffect(() => {
    if (startDate) {
      const parts = startDate.split("/");
      setTempStartDate(new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1])));
    }
    if (endDate) {
      const parts = endDate.split("/");
      setTempEndDate(new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1])));
    }
  }, [startDate, endDate]);


  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
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

    // Next month days
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
    setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1));
    setRightMonth(new Date(rightMonth.getFullYear(), rightMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1));
    setRightMonth(new Date(rightMonth.getFullYear(), rightMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start new selection
      setTempStartDate(date);
      setTempEndDate(null);
    } else if (tempStartDate && !tempEndDate) {
      // Complete selection
      if (date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false;
    return date > tempStartDate && date < tempEndDate;
  };

  const isStartDate = (date: Date) => {
    if (!tempStartDate) return false;
    return isSameDay(date, tempStartDate);
  };

  const isEndDate = (date: Date) => {
    if (!tempEndDate) return false;
    return isSameDay(date, tempEndDate);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onApply(formatDate(tempStartDate), formatDate(tempEndDate));
    }
  };

  const handleMonthChange = (month: number, isLeft: boolean) => {
    if (isLeft) {
      const newDate = new Date(leftMonth.getFullYear(), month, 1);
      setLeftMonth(newDate);
      const nextMonth = new Date(newDate.getFullYear(), month + 1, 1);
      setRightMonth(nextMonth);
    } else {
      const newDate = new Date(rightMonth.getFullYear(), month, 1);
      setRightMonth(newDate);
      const prevMonth = new Date(newDate.getFullYear(), month - 1, 1);
      setLeftMonth(prevMonth);
    }
  };

  const handleYearChange = (year: number, isLeft: boolean) => {
    if (isLeft) {
      const newDate = new Date(year, leftMonth.getMonth(), 1);
      setLeftMonth(newDate);
      const nextMonth = new Date(year, leftMonth.getMonth() + 1, 1);
      setRightMonth(nextMonth);
    } else {
      const newDate = new Date(year, rightMonth.getMonth(), 1);
      setRightMonth(newDate);
      const prevMonth = new Date(year, rightMonth.getMonth() - 1, 1);
      setLeftMonth(prevMonth);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 111 }, (_, i) => currentYear - 100 + i);

  const renderCalendar = (currentMonth: Date, isLeft: boolean) => {
    const days = getDaysInMonth(currentMonth);

    return (
      <div className="flex-1 overflow-visible">
        {/* Month/Year Header with Dropdowns */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {/* Month Selector */}
          <CustomDropdown
            value={currentMonth.getMonth()}
            options={monthNames.map((month, index) => ({
              label: month,
              value: index,
            }))}
            onChange={(value) => handleMonthChange(Number(value), isLeft)}
            variant="blue"
            className="min-w-[100px] sm:min-w-[120px]"
          />

          {/* Year Selector */}
          <CustomDropdown
            value={currentMonth.getFullYear()}
            options={yearRange.map((year) => ({
              label: String(year),
              value: year,
            }))}
            onChange={(value) => handleYearChange(Number(value), isLeft)}
            variant="purple"
            className="min-w-[70px] sm:min-w-[90px]"
          />
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayInfo, index) => {
            const inRange = isInRange(dayInfo.date);
            const start = isStartDate(dayInfo.date);
            const end = isEndDate(dayInfo.date);
            const today = isToday(dayInfo.date);

            return (
              <button
                key={index}
                type="button"
                onClick={() => dayInfo.isCurrentMonth && handleDateClick(dayInfo.date)}
                disabled={!dayInfo.isCurrentMonth}
                className={`
                  relative h-9 rounded-lg text-sm font-medium transition-all duration-150
                  ${!dayInfo.isCurrentMonth ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "cursor-pointer"}
                  ${start || end
                    ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white shadow-md scale-105 z-10"
                    : inRange
                    ? "bg-blue-100 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                    : dayInfo.isCurrentMonth
                    ? "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                    : ""
                  }
                  ${today && !start && !end ? "ring-2 ring-blue-500 dark:ring-blue-400 midnight:ring-cyan-400 purple:ring-pink-400" : ""}
                `}
              >
                {dayInfo.day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 pt-4 sm:pt-6 w-full max-w-[95vw] sm:max-w-[600px] overflow-visible">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
        </button>

        <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 text-center">
          {tempStartDate && tempEndDate
            ? `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`
            : tempStartDate
            ? `${formatDate(tempStartDate)} - Select end date`
            : "Select start date"}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
        </button>
      </div>

      {/* Dual Calendars */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {renderCalendar(leftMonth, true)}
        <div className="h-px sm:h-auto sm:w-px bg-gray-200 dark:bg-gray-700 midnight:bg-cyan-500/20 purple:border-pink-500/20" />
        {renderCalendar(rightMonth, false)}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={!tempStartDate || !tempEndDate}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-md ${
            tempStartDate && tempEndDate
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white cursor-pointer"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
