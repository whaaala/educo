"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import DualCalendar from "./DualCalendar";

interface DateRangePickerProps {
  value?: { startDate: string; endDate: string };
  onChange?: (startDate: string, endDate: string) => void;
}

type QuickOption = {
  label: string;
  getValue: () => { startDate: Date; endDate: Date };
};

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("Last 7 Days");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Quick select options
  const quickOptions: QuickOption[] = [
    {
      label: "Today",
      getValue: () => {
        const today = new Date();
        return { startDate: today, endDate: today };
      },
    },
    {
      label: "Yesterday",
      getValue: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return { startDate: yesterday, endDate: yesterday };
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: "This Year",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: "Next Year",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear() + 1, 0, 1);
        const end = new Date(now.getFullYear() + 1, 11, 31);
        return { startDate: start, endDate: end };
      },
    },
  ];

  // Initialize with Last 7 Days
  useEffect(() => {
    if (!value) {
      const lastWeek = quickOptions.find((opt) => opt.label === "Last 7 Days");
      if (lastWeek) {
        const { startDate: start, endDate: end } = lastWeek.getValue();
        setStartDate(formatDate(start));
        setEndDate(formatDate(end));
      }
    } else {
      setStartDate(value.startDate);
      setEndDate(value.endDate);
    }
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomCalendar(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleQuickSelect = (option: QuickOption) => {
    const { startDate: start, endDate: end } = option.getValue();
    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);

    setStartDate(formattedStart);
    setEndDate(formattedEnd);
    setSelectedOption(option.label);
    setShowCustomCalendar(false);
    setIsOpen(false);

    if (onChange) {
      onChange(formattedStart, formattedEnd);
    }
  };

  const handleCustomRangeClick = () => {
    setShowCustomCalendar(true);
    setSelectedOption("Custom Range");
  };

  const handleCustomRangeApply = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedOption("Custom Range");
    setShowCustomCalendar(false);
    setIsOpen(false);

    if (onChange) {
      onChange(start, end);
    }
  };

  const handleCustomRangeCancel = () => {
    setShowCustomCalendar(false);
  };

  const getDisplayText = () => {
    if (!startDate || !endDate) return "Select date range";
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
          isOpen
            ? "bg-blue-50 border-blue-300 dark:bg-blue-500/20 dark:border-blue-500 midnight:bg-cyan-500/20 midnight:border-cyan-500 purple:bg-pink-500/20 purple:border-pink-500"
            : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
        }`}
      >
        <Calendar className={`w-4 h-4 transition-colors ${
          isOpen
            ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
        }`} />
        <span className={`text-sm whitespace-nowrap transition-colors ${
          isOpen
            ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
            : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
        }`}>
          {getDisplayText()}
        </span>
        <ChevronDown className={`w-4 h-4 transition-all duration-200 ${
          isOpen
            ? "rotate-180 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-3 bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-visible z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
          {!showCustomCalendar ? (
            /* Quick Select Options */
            <div className="py-2 w-56 overflow-hidden rounded-xl">
              {quickOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleQuickSelect(option)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-150 flex items-center justify-between ${
                    selectedOption === option.label
                      ? "bg-blue-50 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                >
                  <span>{option.label}</span>
                  {selectedOption === option.label && (
                    <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">✓</span>
                  )}
                </button>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 my-2" />
              <button
                onClick={handleCustomRangeClick}
                className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-150 flex items-center justify-between ${
                  selectedOption === "Custom Range"
                    ? "bg-blue-50 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
              >
                <span>Custom Range</span>
                {selectedOption === "Custom Range" && (
                  <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">✓</span>
                )}
              </button>
            </div>
          ) : (
            /* Dual Calendar View */
            <DualCalendar
              startDate={startDate}
              endDate={endDate}
              onApply={handleCustomRangeApply}
              onCancel={handleCustomRangeCancel}
            />
          )}
        </div>
      )}
    </div>
  );
}
