"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  variant?: "default" | "highlight" | "muted";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function InfoRow({
  icon,
  label,
  value,
  variant = "default",
  size = "md",
  className = "",
}: InfoRowProps) {
  const variantStyles = {
    default: cn(
      "bg-gray-50 dark:bg-[#22262e]/30",
      "midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50"
    ),
    highlight: cn(
      "bg-primary-50 dark:bg-primary-900/20",
      "midnight:bg-cyan-500/10 purple:bg-pink-500/10",
      "border border-primary-100 dark:border-primary-800/30",
      "midnight:border-cyan-500/20 purple:border-pink-500/20"
    ),
    muted: cn(
      "bg-gray-50/50 dark:bg-[#22262e]/20",
      "midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30"
    ),
  };

  const sizeStyles = {
    sm: "p-3 rounded-lg",
    md: "p-4 rounded-xl",
    lg: "p-5 rounded-2xl",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 transition-colors",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {icon && (
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg shadow-sm flex items-center justify-center",
          "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]",
          "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
        )}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className={cn(
          "text-xs font-medium uppercase tracking-wider mb-1",
          "text-gray-500 dark:text-gray-400 midnight:text-gray-500 purple:text-gray-500"
        )}>
          {label}
        </p>
        <div className="text-gray-900 dark:text-white midnight:text-white purple:text-white font-medium">
          {value}
        </div>
      </div>
    </div>
  );
}

// Grid layout for multiple InfoRows
interface InfoGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function InfoGrid({ children, columns = 2, className = "" }: InfoGridProps) {
  const columnStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={cn("grid gap-4", columnStyles[columns], className)}>
      {children}
    </div>
  );
}
