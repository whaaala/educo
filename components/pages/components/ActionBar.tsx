"use client";

import { useState, type ReactNode } from "react";
import { Trash2, X, ChevronDown } from "lucide-react";
import FilterButton from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import DateRangePicker from "@/components/shared/DateRangePicker";
import type {
  FilterField,
  FilterValues,
  SortOption,
  BulkAction,
  DateRange,
} from "@/types/components";

export interface ActionBarProps {
  // Filter props
  filterFields?: FilterField[];
  filters?: FilterValues;
  onFilterChange?: (filters: FilterValues) => void;
  filterResetKey?: number;
  hasActiveFilters?: boolean;

  // Sort props
  sortOptions?: SortOption[];
  sortOption?: string;
  onSortChange?: (sort: string) => void;

  // Date range props
  enableDateRange?: boolean;
  dateRange?: DateRange | null;
  onDateRangeChange?: (range: DateRange) => void;
  dateRangeLabel?: string;

  // View toggle props
  enableViewToggle?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;

  // Selection & bulk actions
  selectedCount?: number;
  bulkActions?: BulkAction[];
  onBulkAction?: (actionId: string) => void;
  onClearSelection?: () => void;

  // Record count
  totalCount?: number;
  filteredCount?: number;
  itemLabel?: string;
  itemLabelPlural?: string;

  // Custom content
  leftContent?: ReactNode;
  rightContent?: ReactNode;

  // Styling
  className?: string;
  sticky?: boolean;
}

/**
 * Reusable action bar component combining filters, sort, view toggle, and bulk actions
 * Fully responsive for all screen sizes
 */
export default function ActionBar({
  // Filter props
  filterFields,
  filters = {},
  onFilterChange,
  filterResetKey,
  hasActiveFilters,

  // Sort props
  sortOptions,
  sortOption,
  onSortChange,

  // Date range props
  enableDateRange,
  dateRange,
  onDateRangeChange,
  dateRangeLabel = "Date Range",

  // View toggle props
  enableViewToggle = true,
  viewMode = "list",
  onViewModeChange,

  // Selection & bulk actions
  selectedCount = 0,
  bulkActions,
  onBulkAction,
  onClearSelection,

  // Record count
  totalCount,
  filteredCount,
  itemLabel = "record",
  itemLabelPlural = "records",

  // Custom content
  leftContent,
  rightContent,

  // Styling
  className = "",
  sticky = false,
}: ActionBarProps) {
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const hasSelection = selectedCount > 0;
  const displayCount = filteredCount ?? totalCount;

  // Get record count text
  const getCountText = () => {
    if (displayCount === undefined) return "";
    const label = displayCount === 1 ? itemLabel : itemLabelPlural;
    if (totalCount !== undefined && filteredCount !== undefined && filteredCount !== totalCount) {
      return `${filteredCount} of ${totalCount} ${label}`;
    }
    return `${displayCount} ${label}`;
  };

  return (
    <div
      className={`
        ${sticky ? "sticky top-0 z-30" : ""}
        bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900
        ${className}
      `}
    >
      {/* Main Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Section - Filters & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Custom left content */}
          {leftContent}

          {/* Filter Button */}
          {filterFields && filterFields.length > 0 && onFilterChange && (
            <FilterButton
              fields={filterFields}
              values={filters}
              onChange={onFilterChange}
              resetKey={filterResetKey}
            />
          )}

          {/* Sort Button */}
          {sortOptions && sortOptions.length > 0 && onSortChange && (
            <SortButton
              options={sortOptions.map((opt) => ({
                id: opt.id,
                label: opt.label,
              }))}
              value={sortOption || ""}
              onChange={onSortChange}
            />
          )}

          {/* Date Range Picker */}
          {enableDateRange && onDateRangeChange && (
            <div className="hidden sm:block">
              <DateRangePicker
                value={dateRange}
                onChange={onDateRangeChange}
                label={dateRangeLabel}
              />
            </div>
          )}
        </div>

        {/* Right Section - View Toggle & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Record Count */}
          {displayCount !== undefined && (
            <span className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              {getCountText()}
            </span>
          )}

          {/* View Toggle */}
          {enableViewToggle && onViewModeChange && (
            <ViewToggle view={viewMode} onChange={onViewModeChange} />
          )}

          {/* Custom right content */}
          {rightContent}
        </div>
      </div>

      {/* Mobile Date Range - Shows below on small screens */}
      {enableDateRange && onDateRangeChange && (
        <div className="mt-3 sm:hidden">
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            label={dateRangeLabel}
          />
        </div>
      )}

      {/* Bulk Actions Bar - Shows when items are selected */}
      {hasSelection && bulkActions && bulkActions.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700 animate-in slide-in-from-top-2 duration-200">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
              {selectedCount} {selectedCount === 1 ? itemLabel : itemLabelPlural} selected
            </span>
            {onClearSelection && (
              <button
                onClick={onClearSelection}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline cursor-pointer"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary bulk actions shown as buttons */}
            {bulkActions.slice(0, 2).map((action) => {
              const Icon = action.icon;
              const isDanger = action.variant === "danger";
              const isWarning = action.variant === "warning";
              const shouldShow = action.condition ? action.condition(selectedCount) : true;

              if (!shouldShow) return null;

              return (
                <button
                  key={action.id}
                  onClick={() => onBulkAction?.(action.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95
                    ${
                      isDanger
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : isWarning
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{action.label}</span>
                  {action.showCount && (
                    <span className="px-1.5 py-0.5 rounded bg-white/20 text-xs">
                      {selectedCount}
                    </span>
                  )}
                </button>
              );
            })}

            {/* More bulk actions in dropdown */}
            {bulkActions.length > 2 && (
              <div className="relative">
                <button
                  onClick={() => setShowBulkMenu(!showBulkMenu)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  More
                  <ChevronDown className={`w-4 h-4 transition-transform ${showBulkMenu ? "rotate-180" : ""}`} />
                </button>

                {showBulkMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowBulkMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 animate-in zoom-in-95 duration-150">
                      {bulkActions.slice(2).map((action) => {
                        const Icon = action.icon;
                        const isDanger = action.variant === "danger";
                        const shouldShow = action.condition ? action.condition(selectedCount) : true;

                        if (!shouldShow) return null;

                        return (
                          <button
                            key={action.id}
                            onClick={() => {
                              onBulkAction?.(action.id);
                              setShowBulkMenu(false);
                            }}
                            className={`
                              w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors cursor-pointer
                              ${
                                isDanger
                                  ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }
                            `}
                          >
                            <Icon className="w-4 h-4" />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
