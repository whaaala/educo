"use client";

import SearchBar from "./SearchBar";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  className?: string;
}

export default function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  className = "",
}: SearchFilterBarProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            fullWidth
          />
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <select
            key={filter.label}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-500 purple:focus:ring-pink-500 focus:border-transparent transition-all text-sm font-medium cursor-pointer"
            aria-label={filter.label}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
