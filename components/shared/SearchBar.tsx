"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  size = "md",
  fullWidth = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange("");
  };

  // Size-based classes
  const sizeClasses = {
    sm: {
      container: "h-8 px-3 py-1.5",
      icon: "w-3.5 h-3.5",
      text: "text-xs",
    },
    md: {
      container: "h-10 px-4 py-2",
      icon: "w-4 h-4",
      text: "text-sm",
    },
    lg: {
      container: "h-12 px-5 py-3",
      icon: "w-5 h-5",
      text: "text-base",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`group relative flex items-center gap-2.5 ${currentSize.container} bg-white dark:bg-[#252930] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg border transition-all duration-200 ${
        isFocused
          ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400"
          : "border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-500 midnight:hover:border-cyan-400/30 purple:hover:border-pink-400/30"
      } ${fullWidth ? "w-full" : "w-auto"} ${className}`}
    >
      {/* Search Icon */}
      <Search
        className={`${currentSize.icon} flex-shrink-0 transition-colors duration-200 ${
          isFocused
            ? "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
            : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/70 purple:text-pink-400/70"
        }`}
      />

      {/* Input Field */}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent border-none outline-none ${currentSize.text} font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 midnight:placeholder-cyan-400/50 purple:placeholder-pink-400/50 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden`}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="flex-shrink-0 p-1 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 hover:scale-110 active:scale-95"
          title="Clear search"
        >
          <X
            className={`${currentSize.icon} text-gray-400 dark:text-gray-500 midnight:text-cyan-400/70 purple:text-pink-400/70 hover:text-gray-600 dark:hover:text-gray-300 midnight:hover:text-cyan-400 purple:hover:text-pink-400 transition-colors`}
          />
        </button>
      )}
    </div>
  );
}
