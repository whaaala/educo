"use client";

import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Search, Loader2 } from "lucide-react";

interface SearchableDropdownOption {
  value: string;
  label: string;
  [key: string]: any; // Allow additional properties
}

interface SearchableDropdownProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (searchQuery: string) => Promise<SearchableDropdownOption[]>;
  options?: SearchableDropdownOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  excludeIds?: string[];
  loading?: boolean;
}

export default function SearchableDropdown({
  label,
  icon,
  iconBgColor = "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
  iconColor = "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
  value,
  onChange,
  onSearch,
  options = [],
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  excludeIds = [],
  loading = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<SearchableDropdownOption[]>(options);
  const [isSearching, setIsSearching] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SearchableDropdownOption[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSearchQueryRef = useRef<string>("");

  // Debounced search for async fetching
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!onSearch) return;
      
      // Prevent duplicate searches for the exact same query
      if (lastSearchQueryRef.current === query) {
        return;
      }

      // Update last search query before searching
      lastSearchQueryRef.current = query;

      setIsSearching(true);
      try {
        const results = await onSearch(query);
        setAsyncOptions(results);
      } catch (error) {
        console.error("Search error:", error);
        setAsyncOptions([]);
      } finally {
        setIsSearching(false);
      }
    },
    [onSearch]
  );

  // Handle search input with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!isOpen) {
      // Don't search if dropdown is closed
      return;
    }

    if (onSearch) {
      // For async search, debounce and fetch
      if (searchQuery.length >= 2) {
        // Only search if query is different from last search
        if (searchQuery !== lastSearchQueryRef.current) {
          searchTimeoutRef.current = setTimeout(() => {
            debouncedSearch(searchQuery);
          }, 300);
        }
      } else if (searchQuery.length === 0) {
        // Clear results when search is empty - but don't set state here to avoid loops
        // The onChange handler in the input will handle clearing
        lastSearchQueryRef.current = "";
      }
    } else {
      // Filter local options synchronously
      const filtered = options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !excludeIds.includes(option.value)
      );
      setFilteredOptions(filtered);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, options, excludeIds, onSearch, debouncedSearch, isOpen]);

  // Update options when async search completes
  useEffect(() => {
    if (onSearch) {
      const filtered = asyncOptions.filter((opt) => !excludeIds.includes(opt.value));
      // Only update if the filtered results are different to prevent loops
      setFilteredOptions((prev) => {
        // Check if arrays are different before updating
        if (prev.length !== filtered.length) {
          return filtered;
        }
        const prevIds = new Set(prev.map((opt) => opt.value));
        const filteredIds = new Set(filtered.map((opt) => opt.value));
        if (prevIds.size !== filteredIds.size) {
          return filtered;
        }
        for (const id of prevIds) {
          if (!filteredIds.has(id)) {
            return filtered;
          }
        }
        return prev; // No change, return previous to prevent update
      });
    }
  }, [asyncOptions, excludeIds, onSearch]);

  // Don't load initial options - require user to search first for better performance
  // This prevents loading potentially thousands of students on dropdown open

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search query and options when closing
        setSearchQuery("");
        if (onSearch) {
          setFilteredOptions([]);
          setAsyncOptions([]);
          lastSearchQueryRef.current = "";
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onSearch]);

  const selectedOption = options.find((opt) => opt.value === value) || 
                        asyncOptions.find((opt) => opt.value === value);

  const displayOptions = onSearch ? filteredOptions : filteredOptions;

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
          {selectedOption?.label || (
            <span className="text-gray-400/70 dark:text-gray-500/70 midnight:text-cyan-400/50 purple:text-pink-400/50 italic font-normal">
              {placeholder}
            </span>
          )}
        </button>

        {/* Chevron Icon */}
        <ChevronRight
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 pointer-events-none transition-transform ${
            isOpen ? "rotate-[-90deg]" : "rotate-90"
          }`}
        />

        {/* Custom Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[10000] flex flex-col max-h-80">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    // Clear filtered options and reset last search query when search is cleared
                    if (value.length === 0 && onSearch) {
                      setFilteredOptions([]);
                      setAsyncOptions([]);
                      lastSearchQueryRef.current = "";
                    }
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-8 py-2 text-sm bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500"
                  autoFocus
                  onKeyDown={(e) => {
                    // Prevent dropdown from closing on Escape if searching
                    if (e.key === "Escape" && searchQuery.length > 0) {
                      e.stopPropagation();
                      setSearchQuery("");
                      setFilteredOptions([]);
                      setAsyncOptions([]);
                    }
                  }}
                />
                {(isSearching || loading) && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 animate-spin pointer-events-none" />
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto flex-1 min-h-[100px]">
              {isSearching || loading ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Searching...
                </div>
              ) : displayOptions.length > 0 ? (
                displayOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                      value === option.value
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {onSearch && searchQuery.length === 0 
                    ? "Start typing to search (minimum 2 characters)" 
                    : onSearch && searchQuery.length < 2
                    ? "Type at least 2 characters to search..."
                    : "No results found"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

