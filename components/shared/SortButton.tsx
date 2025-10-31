"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpDown, ChevronDown, ArrowUpAZ, ArrowDownAZ, Eye, Clock } from "lucide-react";

interface SortOption {
  label: string;
  value: string;
}

interface SortButtonProps {
  options: SortOption[];
  defaultOption?: string;
  onSortChange?: (value: string) => void;
  className?: string;
}

export default function SortButton({
  options,
  defaultOption = "ascending",
  onSortChange,
  className = "",
}: SortButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
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

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  const selectedLabel = options.find((opt) => opt.value === selectedOption)?.label || "Sort by A-Z";

  const getIconForOption = (value: string) => {
    switch (value) {
      case "ascending":
        return <ArrowUpAZ className="w-4 h-4" />;
      case "descending":
        return <ArrowDownAZ className="w-4 h-4" />;
      case "recently_viewed":
        return <Eye className="w-4 h-4" />;
      case "recently_added":
        return <Clock className="w-4 h-4" />;
      default:
        return <ArrowUpAZ className="w-4 h-4" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Sort Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
          isOpen
            ? "bg-blue-50 border-blue-300 dark:bg-blue-500/20 dark:border-blue-500 midnight:bg-cyan-500/20 midnight:border-cyan-500 purple:bg-pink-500/20 purple:border-pink-500"
            : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
        }`}
      >
        <div className={`transition-colors ${
          isOpen
            ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
        }`}>
          {getIconForOption(selectedOption)}
        </div>
        <span className={`text-sm whitespace-nowrap transition-colors ${
          isOpen
            ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
            : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
        }`}>
          {selectedLabel}
        </span>
        <ChevronDown className={`w-4 h-4 transition-all duration-200 ${
          isOpen
            ? "rotate-180 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
        }`} />
      </button>

      {/* Dropdown Menu with Enhanced Design */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-[#1a1d23] dark:via-[#1a1d23] dark:to-[#151821] midnight:from-[#0f1729] midnight:via-[#0f1729] midnight:to-[#0a0f1a] purple:from-[#2a1a3e] purple:via-[#2a1a3e] purple:to-[#1f1430] rounded-2xl shadow-2xl border-2 border-gray-200/80 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-sm">
          <div className="p-2 space-y-1">
            {options.map((option, index) => {
              const isSelected = selectedOption === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  style={{ animationDelay: `${index * 30}ms` }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 flex items-center gap-3 group/item animate-in fade-in slide-in-from-left-2 ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 dark:from-blue-500 dark:via-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:via-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:via-pink-600 purple:to-pink-700 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 midnight:shadow-cyan-400/20 purple:shadow-pink-400/20 scale-[1.02]"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gradient-to-br hover:from-gray-100 hover:via-gray-100 hover:to-gray-200/80 dark:hover:from-gray-800/60 dark:hover:via-gray-800/60 dark:hover:to-gray-700/60 midnight:hover:from-cyan-500/15 midnight:hover:via-cyan-500/10 midnight:hover:to-cyan-600/15 purple:hover:from-pink-500/15 purple:hover:via-pink-500/10 purple:hover:to-pink-600/15 hover:scale-[1.02] hover:shadow-md"
                  }`}
                >
                  {isSelected && (
                    <div className="flex-shrink-0 text-white animate-in zoom-in duration-200">
                      {getIconForOption(option.value)}
                    </div>
                  )}
                  <span className={`flex-1 transition-all duration-200 ${
                    isSelected
                      ? "translate-x-0"
                      : "group-hover/item:translate-x-1"
                  }`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
