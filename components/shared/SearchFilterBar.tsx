"use client";

import SearchBar from "./SearchBar";
import CustomDropdown from "./CustomDropdown";

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
    <div className={`bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm ${className}`}>
      <div className="flex flex-col gap-4">
        {/* Filters - Show first on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filters.map((filter) => (
            <CustomDropdown
              key={filter.label}
              value={filter.value}
              onChange={(value) => filter.onChange(value as string)}
              options={filter.options}
              variant="blue"
            />
          ))}
        </div>

        {/* Search Bar - Show below filters on mobile */}
        <div className="w-full">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            fullWidth
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
