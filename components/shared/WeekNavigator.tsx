"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomDropdown from "@/components/shared/CustomDropdown";

interface WeekNavigatorProps {
  selectedWeek: number;
  totalWeeks: number;
  weekOptions: { label: string; value: number }[];
  onWeekChange: (week: number) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  className?: string;
  compact?: boolean; // For compact design like second image
}

export default function WeekNavigator({
  selectedWeek,
  totalWeeks,
  weekOptions,
  onWeekChange,
  onPreviousWeek,
  onNextWeek,
  className = "",
  compact = false,
}: WeekNavigatorProps) {
  const handleWeekChange = (value: string | number) => {
    onWeekChange(Number(value));
  };

  if (compact) {
    // Compact design (second image style)
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={onPreviousWeek}
          disabled={selectedWeek === 1}
          className="cursor-pointer p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
        </button>

        <div className="min-w-[120px]">
          <CustomDropdown
            value={selectedWeek}
            options={weekOptions}
            onChange={handleWeekChange}
            variant="blue"
            className="w-full"
          />
        </div>

        <button
          onClick={onNextWeek}
          disabled={selectedWeek === totalWeeks}
          className="cursor-pointer p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 ml-2">
          Week {selectedWeek} of {totalWeeks}
        </span>
      </div>
    );
  }

  // Full design (original style)
  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 ${className}`}>
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={onPreviousWeek}
          disabled={selectedWeek === 1}
          className="cursor-pointer p-2 rounded-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
        </button>

        <div className="flex-1">
          <CustomDropdown
            value={selectedWeek}
            options={weekOptions}
            onChange={handleWeekChange}
            variant="blue"
            className="w-full"
          />
        </div>

        <button
          onClick={onNextWeek}
          disabled={selectedWeek === totalWeeks}
          className="cursor-pointer p-2 rounded-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
        </button>
      </div>

      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 text-center sm:text-right whitespace-nowrap">
        Week {selectedWeek} of {totalWeeks}
      </div>
    </div>
  );
}
