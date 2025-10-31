"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

interface CustomDropdownProps {
  value: string | number;
  options: Array<{ label: string; value: string | number }>;
  onChange: (value: string | number) => void;
  variant?: "blue" | "purple";
  className?: string;
}

export default function CustomDropdown({
  value,
  options,
  onChange,
  variant = "blue",
  className = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedOption = options.find((opt) => opt.value === value);

  const getVariantStyles = () => {
    if (variant === "blue") {
      return {
        button: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-700 dark:to-gray-700/50 midnight:from-cyan-900/30 midnight:to-cyan-800/20 purple:from-pink-900/30 purple:to-pink-800/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-600 midnight:hover:from-cyan-900/40 midnight:hover:to-cyan-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 border-blue-200/50 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 midnight:focus:ring-cyan-500/40 purple:focus:ring-pink-500/40",
        selected: "bg-blue-600 text-white",
      };
    }
    return {
      button: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-gray-700 dark:to-gray-700/50 midnight:from-purple-900/30 midnight:to-purple-800/20 purple:from-pink-900/30 purple:to-pink-800/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-600 midnight:hover:from-purple-900/40 midnight:hover:to-purple-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 border-purple-200/50 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 focus:ring-purple-500/40 dark:focus:ring-purple-400/40 midnight:focus:ring-cyan-500/40 purple:focus:ring-pink-500/40",
      selected: "bg-purple-600 text-white",
    };
  };

  const styles = getVariantStyles();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`appearance-none w-full text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 ${styles.button} rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-9 cursor-pointer outline-none focus:ring-2 transition-all shadow-sm border`}
      >
        {selectedOption?.label || value}
      </button>

      {/* Chevron Icon */}
      <ChevronRight className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 pointer-events-none rotate-90" />

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 max-h-48 sm:max-h-64 overflow-y-auto z-[10000]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium sm:font-semibold transition-colors ${
                value === option.value
                  ? styles.selected
                  : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
