"use client";

import { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown, X, RotateCcw, Check } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

export interface FilterField {
  id: string;
  label: string;
  options: string[];
  width?: "full" | "half"; // full = spans 2 columns, half = 1 column
}

export interface FilterValues {
  [key: string]: string[];
}

interface FilterButtonProps {
  fields: FilterField[];
  onFilterChange: (filters: FilterValues) => void;
  className?: string;
}

export default function FilterButton({ fields, onFilterChange, className = "" }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize selected values for each field
  const [selectedValues, setSelectedValues] = useState<FilterValues>(() => {
    const initial: FilterValues = {};
    fields.forEach((field) => {
      initial[field.id] = [];
    });
    return initial;
  });

  // Click outside handler for main dropdown and nested dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setOpenDropdownId(null);
      } else if (openDropdownId) {
        // If a nested dropdown is open, check if click is outside that specific dropdown
        const target = event.target as HTMLElement;
        const clickedDropdown = target.closest(`[data-dropdown-id="${openDropdownId}"]`);
        const clickedButton = target.closest(`[data-field-id="${openDropdownId}"]`);

        // Close if clicked outside both the button and dropdown
        if (!clickedDropdown && !clickedButton) {
          setOpenDropdownId(null);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, openDropdownId]);

  const handleToggle = (fieldId: string, value: string) => {
    setSelectedValues((prev) => {
      const fieldValues = prev[fieldId] || [];
      const updated = fieldValues.includes(value)
        ? fieldValues.filter((v) => v !== value)
        : [...fieldValues, value];
      return { ...prev, [fieldId]: updated };
    });
    // Close the dropdown after selection
    setOpenDropdownId(null);
  };

  const handleReset = () => {
    const resetValues: FilterValues = {};
    fields.forEach((field) => {
      resetValues[field.id] = [];
    });
    setSelectedValues(resetValues);
    onFilterChange(resetValues);
  };

  const handleApply = () => {
    onFilterChange(selectedValues);
    setIsOpen(false);
    setOpenDropdownId(null);
  };

  const toggleDropdown = (fieldId: string) => {
    setOpenDropdownId((prev) => (prev === fieldId ? null : fieldId));
  };

  const activeFilterCount = Object.values(selectedValues).reduce(
    (sum, values) => sum + values.length,
    0
  );

  const getDisplayText = (selected: string[]) => {
    if (selected.length === 0) return "Select";
    if (selected.length === 1) return selected[0];
    return `${selected.length} selected`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
          isOpen || activeFilterCount > 0
            ? "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-400 dark:from-blue-500/20 dark:to-blue-600/10 dark:border-blue-500 midnight:from-cyan-500/20 midnight:to-cyan-600/10 midnight:border-cyan-500 purple:from-pink-500/20 purple:to-pink-600/10 purple:border-pink-500"
            : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
      >
        <div
          className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
            isOpen || activeFilterCount > 0
              ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600"
              : "bg-gray-100 dark:bg-gray-700 midnight:bg-cyan-500/20 purple:bg-pink-500/20"
          }`}
        >
          <Filter
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
              isOpen || activeFilterCount > 0
                ? "text-white"
                : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
            }`}
          />
        </div>
        <span
          className={`text-xs sm:text-sm font-bold transition-colors ${
            isOpen || activeFilterCount > 0
              ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
              : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
          }`}
        >
          Filter
        </span>
        {activeFilterCount > 0 && (
          <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white rounded-full shadow-md animate-in zoom-in duration-200">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ml-auto ${
            isOpen
              ? "rotate-180 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
              : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed inset-x-4 top-20 sm:absolute sm:left-0 sm:right-auto sm:top-auto sm:inset-x-auto sm:mt-2 w-auto sm:w-[380px] max-w-[440px] bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-3 duration-300 max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Compact Header */}
          <div className="relative px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/30 midnight:from-cyan-500/10 midnight:to-cyan-600/5 purple:from-pink-500/10 purple:to-pink-600/5 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 shadow-md">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Filter Options
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                    {activeFilterCount > 0
                      ? `${activeFilterCount} active`
                      : "Customize view"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-colors cursor-pointer group"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 midnight:text-cyan-400 purple:text-pink-400" />
              </button>
            </div>
          </div>

          {/* Filter Fields using CustomDropdown */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {fields.map((field, index) => {
                const selectedForField = selectedValues[field.id] || [];
                const displayValue = getDisplayText(selectedForField);
                const isDropdownOpen = openDropdownId === field.id;
                const isLastRow = index >= fields.length - 2; // Last two fields

                return (
                  <div
                    key={field.id}
                    className={`${field.width === "full" ? "col-span-2" : ""} ${isDropdownOpen ? "z-50" : "z-10"}`}
                  >
                    <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 mb-1.5">
                      {field.label}
                    </label>
                    <div className="relative">
                      {/* Custom Multi-Select Button */}
                      <div className="relative">
                        <button
                          type="button"
                          data-field-id={field.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(field.id);
                          }}
                          className={`w-full px-3 py-2 sm:py-2.5 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md ${
                            isDropdownOpen
                              ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-500/20 dark:to-blue-600/10 midnight:from-cyan-500/20 midnight:to-cyan-600/10 purple:from-pink-500/20 purple:to-pink-600/10 ring-2 ring-blue-500/20 dark:ring-blue-400/20 midnight:ring-cyan-400/20 purple:ring-pink-400/20"
                              : selectedForField.length > 0
                              ? "border-blue-400 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500 bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                              : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
                          }`}
                        >
                          <span
                            className={`text-xs sm:text-sm font-medium transition-colors truncate ${
                              isDropdownOpen
                                ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold"
                                : selectedForField.length > 0
                                ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                                : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60"
                            }`}
                          >
                            {displayValue}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {selectedForField.length > 0 && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white shadow-sm">
                                {selectedForField.length}
                              </span>
                            )}
                            <ChevronDown className={`w-3.5 h-3.5 transition-all duration-200 ${
                              isDropdownOpen
                                ? "rotate-180 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                                : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/60 purple:text-pink-400/60"
                            }`} />
                          </div>
                        </button>

                        {/* Dropdown Options */}
                        {isDropdownOpen && (
                          <div
                            data-dropdown-id={field.id}
                            className={`absolute left-0 right-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border-2 border-blue-200 dark:border-blue-500/50 midnight:border-cyan-500/50 purple:border-pink-500/50 shadow-2xl max-h-32 overflow-y-auto z-[100] animate-in fade-in duration-200 ${
                            isLastRow
                              ? "bottom-full mb-2 slide-in-from-bottom-1"
                              : "top-full mt-2 slide-in-from-top-1"
                          }`}>
                            <div className="p-2">
                              {field.options.map((option) => {
                                const isSelected = selectedForField.includes(option);
                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggle(field.id, option);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 flex items-center justify-between group ${
                                      isSelected
                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white shadow-md scale-[1.02]"
                                        : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-700/80 midnight:hover:from-cyan-500/20 midnight:hover:to-cyan-600/10 purple:hover:from-pink-500/20 purple:hover:to-pink-600/10 hover:shadow-sm"
                                    }`}
                                  >
                                    <span className={isSelected ? "font-semibold" : ""}>{option}</span>
                                    {isSelected && (
                                      <Check className="w-4 h-4 text-white animate-in zoom-in duration-200" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Footer */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-br from-gray-50 to-gray-100/30 dark:from-gray-800/30 dark:to-gray-900/20 midnight:from-cyan-900/10 midnight:to-cyan-800/5 purple:from-pink-900/10 purple:to-pink-800/5">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
