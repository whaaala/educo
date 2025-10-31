"use client";

import { ReactNode } from "react";

interface FormTextareaProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  optional?: boolean;
}

export default function FormTextarea({
  label,
  icon,
  iconBgColor = "bg-gray-100 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50",
  iconColor = "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400",
  value,
  onChange,
  placeholder = "",
  rows = 4,
  optional = false,
}: FormTextareaProps) {
  return (
    <div className="group">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg ${iconBgColor} flex items-center justify-center`}>
          <div className={`w-3.5 h-3.5 ${iconColor}`}>{icon}</div>
        </div>
        <span>{label}</span>
        {optional && (
          <span className="text-xs text-gray-400 dark:text-gray-500">(Optional)</span>
        )}
      </label>
      <div className="relative">
        <div className={`absolute left-4 top-4 w-4 h-4 ${iconColor} pointer-events-none`}>
          {icon}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm resize-none"
        ></textarea>
      </div>
    </div>
  );
}
