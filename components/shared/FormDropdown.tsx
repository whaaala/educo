"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import ErrorMessage from "./ErrorMessage";
import Tooltip from "./Tooltip";

interface FormDropdownOption<T extends string = string> {
  value: T;
  label: string;
}

/**
 * Generic over the VALUE, defaulting to string so every existing call site is unchanged.
 *
 * A dropdown whose field is a union — an education level, an academic track — was handing back a bare
 * `string`, so the page had to widen the field to `any` to accept it. Carrying the type through means the
 * options and the field have to agree, and a stray option value stops compiling.
 */
export interface FormDropdownProps<T extends string = string> {
  label: string;
  icon?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: T;
  onChange: (value: T) => void;
  options: FormDropdownOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export default function FormDropdown<T extends string = string>({
  label,
  icon,
  iconBgColor = "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
  iconColor = "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  error,
}: FormDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Scroll dropdown menu into view when opened
  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Small delay to allow the menu to render
      setTimeout(() => {
        menuRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="group">
      {label && (
        <Tooltip content={label}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5 cursor-help">
            <div className={`w-4 h-4 rounded ${iconBgColor} flex items-center justify-center flex-shrink-0 opacity-70`}>
              <div className={`w-2.5 h-2.5 ${iconColor}`}>{icon}</div>
            </div>
            <span>{label}</span>
            {required && <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>}
          </label>
        </Tooltip>
      )}
      <div
        className="relative"
        ref={dropdownRef}
      >
        {/* Custom Dropdown Button */}
        <Tooltip content={selectedOption?.label || placeholder} block>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`appearance-none w-full min-h-[46px] text-sm font-normal text-ink bg-surface ${error ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"} hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 rounded-xl px-4 py-2.5 pr-10 outline-none focus:ring-2 transition-all duration-200 border text-left ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span className="block truncate">
              {selectedOption?.label || <span className="text-gray-400/70 dark:text-gray-500/70 midnight:text-cyan-400/50 purple:text-pink-400/50 italic font-normal">{placeholder}</span>}
            </span>
          </button>
        </Tooltip>

        {/* Chevron Icon */}
        <ChevronRight className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 pointer-events-none transition-transform ${isOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />

        {/* Custom Dropdown Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute top-full mt-1 left-0 right-0 bg-surface rounded-xl shadow-xl border border-line max-h-64 overflow-y-auto z-50"
          >
            {options.map((option) => (
              <Tooltip key={option.value} content={option.label}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    value === option.value
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                >
                  {option.label}
                </button>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
      <ErrorMessage message={error} />
    </div>
  );
}
