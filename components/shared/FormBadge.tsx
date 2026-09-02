"use client";

import { ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";

interface FormBadgeProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  placeholder?: string;
  helperText?: string;
  badgeColorClasses?: {
    bg: string;
    text: string;
    border: string;
    icon: string;
  };
  required?: boolean;
  error?: string;
}

export default function FormBadge({
  label,
  icon,
  iconBgColor = "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
  iconColor = "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
  value,
  placeholder = "Not set",
  helperText,
  badgeColorClasses,
  required = false,
  error,
}: FormBadgeProps) {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
        <div className={`w-4 h-4 rounded ${iconBgColor} flex items-center justify-center flex-shrink-0 opacity-70`}>
          <div className={`w-2.5 h-2.5 ${iconColor}`}>{icon}</div>
        </div>
        <span>{label}</span>
        {helperText && (
          <span className="text-[0.625rem] font-normal text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            ({helperText})
          </span>
        )}
        {required && <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>}
      </label>
      <div
        className={`appearance-none w-full h-[46px] text-sm font-normal text-ink bg-surface ${
          error ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
        } rounded-xl px-4 py-2.5 border transition-all duration-200 flex items-center`}
      >
        {value && badgeColorClasses ? (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${badgeColorClasses.bg} ${badgeColorClasses.text} ${badgeColorClasses.border}`}
          >
            <div className={`w-3 h-3 ${badgeColorClasses.icon}`}>{icon}</div>
            {value}
          </span>
        ) : (
          <span className="text-gray-400/70 dark:text-gray-500/70 midnight:text-cyan-400/50 purple:text-pink-400/50 italic font-normal text-sm">
            {placeholder}
          </span>
        )}
      </div>
      <ErrorMessage message={error} />
    </div>
  );
}
