"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

interface FormDropdownOption {
  value: string;
  label: string;
}

interface FormDropdownProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  onChange: (value: string) => void;
  options: FormDropdownOption[];
  placeholder?: string;
}

export default function FormDropdown({
  label,
  icon,
  iconBgColor = "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
  iconColor = "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
  value,
  onChange,
  options,
  placeholder = "Select an option",
}: FormDropdownProps) {
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

  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
        <div className={`w-4 h-4 rounded ${iconBgColor} flex items-center justify-center flex-shrink-0 opacity-70`}>
          <div className={`w-2.5 h-2.5 ${iconColor}`}>{icon}</div>
        </div>
        <span>{label}</span>
      </label>
      <div className="relative" ref={dropdownRef}>
        {/* Custom Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="appearance-none w-full text-sm font-normal text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 rounded-xl px-4 py-2.5 pr-10 cursor-pointer outline-none focus:ring-2 transition-all duration-200 border text-left"
        >
          {selectedOption?.label || <span className="text-gray-400/70 dark:text-gray-500/70 midnight:text-cyan-400/50 purple:text-pink-400/50 italic font-normal">{placeholder}</span>}
        </button>

        {/* Chevron Icon */}
        <ChevronRight className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 pointer-events-none transition-transform ${isOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />

        {/* Custom Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 max-h-64 overflow-y-auto z-[10000]">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  value === option.value
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
