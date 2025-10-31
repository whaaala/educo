"use client";

import { ReactNode } from "react";

interface FormInputProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email";
  leftIcon?: ReactNode;
  leftIconBg?: string;
}

export default function FormInput({
  label,
  icon,
  iconBgColor = "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
  iconColor = "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
  value,
  onChange,
  placeholder = "",
  type = "text",
  leftIcon,
  leftIconBg = "bg-gray-100 dark:bg-gray-700 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
}: FormInputProps) {
  return (
    <div className="group">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg ${iconBgColor} flex items-center justify-center`}>
          <div className={`w-3.5 h-3.5 ${iconColor}`}>{icon}</div>
        </div>
        <span>{label}</span>
      </label>
      <div className="relative">
        {leftIcon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded ${leftIconBg}`}>
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${leftIcon ? "pl-14" : "pl-4"} pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm`}
        />
      </div>
    </div>
  );
}
