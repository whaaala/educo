"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import ModernCalendar from "./ModernCalendar";
import ModernTimePicker from "./ModernTimePicker";
import ErrorMessage from "./ErrorMessage";

interface FormInputProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email" | "date" | "time";
  leftIcon?: ReactNode;
  leftIconBg?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  timeFormat?: "12h" | "24h";
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
  disabled = false,
  required = false,
  error,
  timeFormat = "12h",
}: FormInputProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const timePickerContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeButtonRef = useRef<HTMLButtonElement>(null);

  // Note: Click outside handling is done by ModernCalendar component via portal

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (type === "date") {
    return (
      <div className="group">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded ${iconBgColor} flex items-center justify-center flex-shrink-0 opacity-70`}>
            <div className={`w-2.5 h-2.5 ${iconColor}`}>{icon}</div>
          </div>
          <span>{label}</span>
          {required && <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>}
        </label>
        <div className="relative" ref={calendarContainerRef}>
          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10" />
          <button
            ref={buttonRef}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled) {
                setShowCalendar((prev) => {
                  console.log("Calendar toggle:", !prev);
                  return !prev;
                });
              }
            }}
            disabled={disabled}
            className={`w-full h-[46px] pl-12 pr-10 py-2.5 rounded-xl border ${error ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"} bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-normal focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 text-left cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {value ? formatDateDisplay(value) : <span className="text-gray-400/70 dark:text-gray-500/70 midnight:text-cyan-400/50 purple:text-pink-400/50 italic font-normal">{placeholder}</span>}
          </button>
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />

          {showCalendar && buttonRef.current && (
            <ModernCalendar
              value={value}
              onChange={(date) => {
                onChange(date);
                setShowCalendar(false);
              }}
              onClose={() => setShowCalendar(false)}
              triggerRef={buttonRef}
            />
          )}
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (type === "time") {
    return (
      <div className="group">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded ${iconBgColor} flex items-center justify-center flex-shrink-0 opacity-70`}>
            <div className={`w-2.5 h-2.5 ${iconColor}`}>{icon}</div>
          </div>
          <span>{label}</span>
          {required && <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>}
        </label>
        <div className="relative" ref={timePickerContainerRef}>
          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10" />
          <button
            ref={timeButtonRef}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled) {
                setShowTimePicker((prev) => !prev);
              }
            }}
            disabled={disabled}
            className={`w-full h-[46px] pl-12 pr-10 py-2.5 rounded-xl border ${error ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"} bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-normal focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 text-left cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {value || <span className="text-gray-400/70 dark:text-gray-500/70 midnight:text-cyan-400/50 purple:text-pink-400/50 italic font-normal">{placeholder}</span>}
          </button>
          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />

          {showTimePicker && timeButtonRef.current && (
            <ModernTimePicker
              value={value}
              onChange={(time) => {
                onChange(time);
                setShowTimePicker(false);
              }}
              onClose={() => setShowTimePicker(false)}
              triggerRef={timeButtonRef}
              format={timeFormat}
            />
          )}
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
        <div className={`w-4 h-4 rounded ${iconBgColor} flex items-center justify-center flex-shrink-0 opacity-70`}>
          <div className={`w-2.5 h-2.5 ${iconColor}`}>{icon}</div>
        </div>
        <span>{label}</span>
        {required && <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>}
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
          disabled={disabled}
          className={`w-full h-[46px] ${leftIcon ? "pl-14" : "pl-4"} pr-4 py-2.5 rounded-xl border ${error ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"} bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 placeholder:font-normal focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-400 dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>
      <ErrorMessage message={error} />
    </div>
  );
}
