"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DetailCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: "default" | "gradient" | "elevated" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export function DetailCard({
  children,
  title,
  subtitle,
  icon,
  headerAction,
  variant = "default",
  padding = "md",
  className = "",
}: DetailCardProps) {
  const variantStyles = {
    default: cn(
      "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]",
      "border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/10 purple:border-pink-500/10"
    ),
    gradient: cn(
      "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850",
      "midnight:from-gray-900 midnight:to-gray-950 purple:from-gray-900 purple:to-gray-950",
      "border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/10 purple:border-pink-500/10"
    ),
    elevated: cn(
      "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]",
      "shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 midnight:shadow-cyan-900/20 purple:shadow-pink-900/20"
    ),
    glass: cn(
      "bg-white/80 dark:bg-[#1a1d24]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80",
      "backdrop-blur-xl border border-white/20 dark:border-gray-700/50",
      "midnight:border-cyan-500/20 purple:border-pink-500/20"
    ),
  };

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  const hasHeader = title || subtitle || icon || headerAction;

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-200",
        variantStyles[variant],
        className
      )}
    >
      {hasHeader && (
        <div className={cn(
          "px-5 sm:px-6 py-4 flex items-center justify-between gap-4",
          "border-b border-gray-100 dark:border-gray-700/50",
          "midnight:border-cyan-500/10 purple:border-pink-500/10"
        )}>
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-blue-50 dark:bg-blue-900/30",
                "midnight:bg-cyan-500/10 purple:bg-pink-500/10",
                "text-blue-600 dark:text-blue-400",
                "midnight:text-cyan-400 purple:text-pink-400"
              )}>
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-white purple:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction}
        </div>
      )}
      <div className={hasHeader ? paddingStyles[padding] : paddingStyles[padding]}>
        {children}
      </div>
    </div>
  );
}
