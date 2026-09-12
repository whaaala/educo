"use client";

import { useState } from "react";
import { Users, CheckCircle2, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";

/**
 * The minimum an item needs to be selectable. Callers pass richer types — a Student, a Teacher — and the
 * generic `T` below carries their real shape, which is what `displayFields` indexes into.
 *
 * Deliberately NO index signature: one used to sit here "to allow any additional properties", but a plain
 * interface like `Student` is not assignable to a type that has one, so it rejected exactly the types this
 * grid exists to display. The generic constraint already allows extra properties.
 */
interface SelectionGridItem {
  id: string;
  name: string;
}

interface StudentSelectionGridProps<T extends SelectionGridItem> {
  items: T[];
  selectedItems: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  singleSelect?: boolean; // Enable single selection mode (hides Select All button)
  // Customizable display fields
  displayFields?: {
    primaryField: keyof T; // Main display text (e.g., "name")
    secondaryField?: keyof T; // Secondary display text (e.g., "rollNo")
    secondaryFieldLabel?: string; // Label for secondary field (e.g., "Admission No:", "Roll No:")
    avatarField?: keyof T; // Avatar image URL field (optional)
  };
  // Custom search function (optional)
  searchFilter?: (item: T, query: string) => boolean;
}

export default function StudentSelectionGrid<T extends SelectionGridItem>({
  items,
  selectedItems,
  onSelectionChange,
  title = "Select Items",
  showSearch = true,
  searchPlaceholder = "Search by name...",
  itemsPerPage = 8,
  singleSelect = false,
  displayFields = {
    primaryField: "name" as keyof T,
    secondaryField: undefined,
    avatarField: undefined,
  },
  searchFilter,
}: StudentSelectionGridProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Default search filter if none provided
  const defaultSearchFilter = (item: T, query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    // Search in primary field
    const primaryValue = String(item[displayFields.primaryField] || "").toLowerCase();
    if (primaryValue.includes(lowerQuery)) return true;

    // Search in secondary field if it exists
    if (displayFields.secondaryField) {
      const secondaryValue = String(item[displayFields.secondaryField] || "").toLowerCase();
      if (secondaryValue.includes(lowerQuery)) return true;
    }

    return false;
  };

  // Filter items based on search
  const filteredItems = items.filter((item) =>
    searchFilter ? searchFilter(item, searchQuery) : defaultSearchFilter(item, searchQuery)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      // Deselect all
      onSelectionChange(new Set());
    } else {
      // Select all filtered items
      onSelectionChange(new Set(filteredItems.map((item) => item.id)));
    }
  };

  const handleToggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    onSelectionChange(newSelected);
  };

  const isAllSelected = filteredItems.length > 0 && selectedItems.size === filteredItems.length;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {selectedItems.size}
                </span>{" "}
                of {filteredItems.length} selected
              </p>
            </div>
          </div>

          {!singleSelect && (
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 font-medium text-sm"
            >
              {isAllSelected ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Deselect All
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Select All
                </>
              )}
            </button>
          )}
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mt-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              size="md"
              fullWidth
            />
          </div>
        )}
      </div>

      {/* Item Grid */}
      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">
              No items found
            </p>
            {searchQuery && (
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                Try adjusting your search query
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedItems.map((item, index) => {
              const isSelected = selectedItems.has(item.id);
              const primaryValue = String(item[displayFields.primaryField] || "");
              const secondaryValue = displayFields.secondaryField
                ? String(item[displayFields.secondaryField] || "")
                : null;
              const avatarUrl = displayFields.avatarField
                ? String(item[displayFields.avatarField] || "")
                : null;
              const initials = primaryValue
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                  }`}
                  style={{
                    animation: isSearching
                      ? `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index / 80}s both`
                      : undefined,
                  }}
                >
                  {/* Checkbox */}
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg group-hover:border-purple-400 transition-colors" />
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm transition-transform duration-200 ${
                      isSelected ? "scale-110" : "group-hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: avatarUrl
                        ? undefined
                        : `hsl(${
                            primaryValue.charCodeAt(0) * 137.5
                          }, 70%, 50%)`,
                    }}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={primaryValue}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm truncate transition-colors ${
                        isSelected
                          ? "text-purple-700 dark:text-purple-300"
                          : "text-neutral-900 dark:text-neutral-100"
                      }`}
                    >
                      {primaryValue}
                    </p>
                    {secondaryValue && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {displayFields.secondaryFieldLabel ? `${displayFields.secondaryFieldLabel} ` : ""}{secondaryValue}
                      </p>
                    )}
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && filteredItems.length > 0 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-neutral-200 dark:border-neutral-700">
          {/* Mobile Layout - Stacked */}
          <div className="flex flex-col gap-3 sm:hidden">
            {/* Page Info */}
            <div className="text-center">
              <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors active:scale-95"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Page Numbers - Mobile Compact */}
            {totalPages <= 5 && (
              <div className="flex items-center justify-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg cursor-pointer transition-all active:scale-95 ${
                      currentPage === page
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Previous</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                          currentPage === page
                            ? "bg-purple-600 text-white"
                            : "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-neutral-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Selection Summary */}
      {selectedItems.size > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""} selected
              </span>
            </div>
            <button
              onClick={() => onSelectionChange(new Set())}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
