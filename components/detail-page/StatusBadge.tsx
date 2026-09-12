"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "pending"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "live";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  size = "md",
  pulse = false,
  className = "",
}: StatusBadgeProps) {
  const statusConfig: Record<
    StatusType,
    { bg: string; text: string; dot: string; defaultLabel: string }
  > = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400",
      dot: "bg-emerald-500",
      defaultLabel: "Success",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
      dot: "bg-amber-500",
      defaultLabel: "Warning",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
      text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
      dot: "bg-red-500",
      defaultLabel: "Error",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
      dot: "bg-blue-500",
      defaultLabel: "Info",
    },
    pending: {
      bg: "bg-orange-50 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
      dot: "bg-orange-500",
      defaultLabel: "Pending",
    },
    scheduled: {
      bg: cn(
        "bg-violet-50 dark:bg-violet-900/30",
        "midnight:bg-cyan-900/30 purple:bg-pink-900/30"
      ),
      text: cn(
        "text-violet-700 dark:text-violet-400",
        "midnight:text-cyan-400 purple:text-pink-400"
      ),
      dot: cn("bg-violet-500 midnight:bg-cyan-500 purple:bg-pink-500"),
      defaultLabel: "Scheduled",
    },
    completed: {
      bg: "bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400",
      dot: "bg-emerald-500",
      defaultLabel: "Completed",
    },
    cancelled: {
      bg: "bg-gray-100 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50",
      text: "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
      dot: "bg-gray-400",
      defaultLabel: "Cancelled",
    },
    live: {
      bg: "bg-red-50 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
      text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
      dot: "bg-red-500",
      defaultLabel: "Live Now",
    },
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        config.bg,
        config.text,
        sizeStyles[size],
        className
      )}
    >
      <span className="relative flex">
        <span className={cn(dotSizes[size], "rounded-full", config.dot)} />
        {(pulse || status === "live") && (
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-75",
              dotSizes[size],
              config.dot
            )}
          />
        )}
      </span>
      {displayLabel}
    </span>
  );
}
