"use client";

import { Clock } from "lucide-react";

type StatusType = "present" | "absent" | "late" | "excused" | "not-attended" | "blocked";

interface AttendanceStatusBadgeProps {
  type: StatusType;
  label: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function AttendanceStatusBadge({
  type,
  label,
  size = "md",
  showLabel = true,
}: AttendanceStatusBadgeProps) {
  // Size mappings
  const sizeClasses = {
    sm: "w-6 h-6 sm:w-7 sm:h-7 text-xs",
    md: "w-7 h-7 sm:w-8 sm:h-8 text-xs",
    lg: "w-8 h-8 sm:w-9 sm:h-9 text-sm",
  };

  const iconSizes = {
    sm: "w-3 h-3 sm:w-3.5 sm:h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const labelSizes = {
    sm: "text-[10px] sm:text-xs",
    md: "text-xs sm:text-sm",
    lg: "text-sm sm:text-base",
  };

  // Color and style mappings
  const statusConfig = {
    present: {
      bg: "bg-green-500",
      text: "text-white",
      label: "P",
    },
    absent: {
      bg: "bg-red-500",
      text: "text-white",
      label: "A",
    },
    late: {
      bg: "bg-cyan-500",
      text: "text-white",
      label: "L",
    },
    excused: {
      bg: "bg-blue-500",
      text: "text-white",
      label: "E",
    },
    "not-attended": {
      bg: "bg-gray-200 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800",
      text: "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70",
      label: "",
    },
    "blocked": {
      bg: "bg-gray-300 dark:bg-gray-600 midnight:bg-gray-700 purple:bg-gray-700",
      text: "text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70",
      label: "—",
    },
  };

  const config = statusConfig[type];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full ${config.bg} flex items-center justify-center ${config.text} font-bold shadow-sm ${type === "blocked" ? "opacity-50" : ""}`}
      >
        {type === "not-attended" ? (
          <Clock className={iconSizes[size]} />
        ) : (
          config.label
        )}
      </div>
      {showLabel && (
        <span
          className={`${labelSizes[size]} font-medium sm:font-semibold ${type === "blocked" ? "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/50 purple:text-pink-400/50" : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
