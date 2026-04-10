"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";

// Action menu item for mobile action dropdown
interface ActionMenuItem {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

export interface MobileDropdownProps {
  // For select dropdown mode
  value?: string | number;
  options?: Array<{ label: string; value: string | number }>;
  onChange?: (value: string | number) => void;
  // For action menu mode
  items?: ActionMenuItem[];
  // Common props
  icon?: ReactNode;
  label?: string;
  className?: string;
}

export default function MobileDropdown({
  value,
  options = [],
  onChange,
  items,
  icon,
  label,
  className = "",
}: MobileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine mode: action menu or select dropdown
  const isActionMenu = items && items.length > 0;

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

  // Action menu mode
  if (isActionMenu) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        {/* Action Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 midnight:focus:ring-cyan-400/50 purple:focus:ring-pink-400/50 shadow-sm transition-all duration-200 cursor-pointer"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {/* Action Menu Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-1.5 right-0 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 min-w-40 overflow-hidden z-[10000] animate-slideDown">
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-all duration-150 ${
                  index !== items.length - 1 ? "border-b border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10" : ""
                } ${
                  item.variant === "danger"
                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20"
                    : "text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Select dropdown mode
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300/90 purple:text-pink-300/90 mb-1.5 px-1">
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 pl-9 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 rounded-lg border-2 border-blue-200/60 dark:border-blue-800/60 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gradient-to-r from-blue-50 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-cyan-950/30 midnight:to-blue-950/30 purple:from-pink-950/30 purple:to-purple-950/30 text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 midnight:focus:ring-cyan-400/50 purple:focus:ring-pink-400/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]"
      >
        {/* Icon overlay */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
            {icon}
          </div>
        )}

        <span className="flex-1 text-left truncate">
          {selectedOption?.label || value}
        </span>

        {/* Dropdown arrow */}
        <ChevronDown
          className={`w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && options.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg shadow-2xl border-2 border-blue-200/60 dark:border-blue-800/60 midnight:border-cyan-500/30 purple:border-pink-500/30 max-h-60 overflow-y-auto z-[10000] animate-slideDown">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-semibold transition-all duration-150 ${
                index !== options.length - 1 ? "border-b border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10" : ""
              } ${
                value === option.value
                  ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white"
                  : "text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 hover:bg-blue-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 active:bg-blue-100 dark:active:bg-gray-600"
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
