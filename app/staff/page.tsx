"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import StaffCard from "@/components/staff/StaffCard";
import StaffTable from "@/components/staff/StaffTable";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterField, FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageSpinner from "@/components/shared/PageSpinner";
import PageLoader from "@/components/shared/PageLoader";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getAllTeachers, Teacher } from "@/lib/mockTeachers";
import { exportStaffToPDF } from "@/utils/staffPdfExport";
import { exportStaffToExcel } from "@/utils/staffExcelExport";
import {
  Plus,
  Download,
  Upload,
  RefreshCw,
  Printer,
} from "lucide-react";

export default function StaffPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPageLoading = usePageLoad(600);

  // Filter for non-teaching staff (Admin, Support, Management)
  const [staff] = useState<Teacher[]>(
    getAllTeachers().filter((t) => ["Admin", "Support", "Management"].includes(t.role))
  );

  // Get view mode from URL, default to grid
  const urlView = searchParams.get("view");
  const initialView = urlView === "list" ? "list" : "grid";

  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [displayedCount, setDisplayedCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter fields
  const filterFields: FilterField[] = [
    {
      id: "department",
      label: "Department",
      options: ["Administration", "IT", "HR", "Finance", "Operations"],
      width: "half",
    },
    {
      id: "role",
      label: "Role",
      options: ["Admin", "Support", "Management"],
      width: "half",
    },
    {
      id: "employmentType",
      label: "Employment Type",
      options: ["Full-Time", "Part-Time", "Contract"],
      width: "half",
    },
    {
      id: "status",
      label: "Status",
      options: ["Active", "On Leave", "Suspended", "Terminated"],
      width: "half",
    },
  ];

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sort state
  const [sortOption, setSortOption] = useState<string>("ascending");
  const [isSorting, setIsSorting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Sort options
  const sortOptions = [
    { label: "Ascending", value: "ascending" },
    { label: "Descending", value: "descending" },
    { label: "Recently Added", value: "recently_added" },
  ];

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setTimeout(() => {
      setViewMode(newMode);
      router.push(`/staff?view=${newMode}`);
      setTimeout(() => {
        setIsSwitchingView(false);
      }, 100);
    }, 300);
  };

  // Sync view mode with URL changes
  useEffect(() => {
    const urlView = searchParams.get("view");
    const newViewMode = urlView === "list" ? "list" : "grid";
    setViewMode(newViewMode);
  }, [searchParams, setViewMode]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setDateRange({ startDate, endDate });
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleFilterChange = (updatedFilters: FilterValues) => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters(updatedFilters);
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleSortChange = (option: string) => {
    setIsSorting(true);
    setTimeout(() => {
      setSortOption(option);
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    }, 300);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSelectedIds(new Set());
    setFilters({});
    setDateRange(null);
    setSortOption("ascending");
    setResetKey(prev => prev + 1);
    setTimeout(() => {
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  const handleExportPDF = () => {
    // Export all filtered staff to PDF
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const filename = `staff_${dateStr}.pdf`;

    exportStaffToPDF(filteredStaff, filename);
  };

  const handleExportExcel = () => {
    // Export all filtered staff to Excel
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const filename = `staff_${dateStr}.xlsx`;

    exportStaffToExcel(filteredStaff, filename);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + (viewMode === "grid" ? 8 : 10));
      setIsLoadingMore(false);
    }, 500);
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      // Get the selected staff details
      const selectedStaff = filteredStaff.filter(staffMember =>
        selectedIds.has(staffMember.id)
      );

      // Convert to BulkDeleteItem format
      const items: BulkDeleteItem[] = selectedStaff.map(staffMember => ({
        id: staffMember.id,
        name: `${staffMember.firstName} ${staffMember.lastName}`,
        subtitle: staffMember.staffId,
        avatarColor: staffMember.imageUrl ? undefined : getRandomColor(`${staffMember.firstName} ${staffMember.lastName}`),
        avatar: staffMember.imageUrl,
      }));

      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    }
  };

  // Helper function to get consistent color for a name
  const getRandomColor = (name: string): string => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleRemoveFromDeleteList = (itemId: string) => {
    setItemsToDelete(prevItems => prevItems.filter(item => item.id !== itemId));
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(itemId);
      return newIds;
    });
  };

  const handleConfirmBulkDelete = (itemIds: string[]) => {
    console.log('Deleting staff:', itemIds);
    // Add your bulk delete logic here
    // For now, just clear the selection and close modal
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const handleCloseBulkDeleteModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const handleRestoreItem = (item: BulkDeleteItem) => {
    // Add item back to itemsToDelete
    setItemsToDelete(prevItems => [...prevItems, item]);
    // Add item back to selectedIds
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.add(item.id);
      return newIds;
    });
  };

  const handleRestoreAll = (items: BulkDeleteItem[]) => {
    // Add all items back to itemsToDelete
    setItemsToDelete(prevItems => [...prevItems, ...items]);
    // Add all items back to selectedIds
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      items.forEach(item => newIds.add(item.id));
      return newIds;
    });
  };

  // Parse date helper
  const parseDate = (dateStr: string): Date | null => {
    try {
      const parts = dateStr.split("/");
      if (parts.length !== 3) return null;
      const month = parseInt(parts[0]) - 1;
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
      return new Date(year, month, day);
    } catch {
      return null;
    }
  };

  // Apply sorting
  const sortedStaff = [...staff].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case "descending":
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
      case "recently_added":
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default:
        return 0;
    }
  });

  // Apply filters
  const filteredStaff = sortedStaff.filter((staffMember) => {
    // Check date range filter
    if (dateRange) {
      const joinedDate = new Date(staffMember.joinDate);
      const startDate = parseDate(dateRange.startDate);
      const endDate = parseDate(dateRange.endDate);
      if (joinedDate && startDate && endDate) {
        if (joinedDate < startDate || joinedDate > endDate) {
          return false;
        }
      }
    }

    // Check other filters
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters) return true;

    const matchesDepartment = !filters.department || filters.department.length === 0 || filters.department.includes(staffMember.department);
    const matchesRole = !filters.role || filters.role.length === 0 || filters.role.includes(staffMember.role);
    const matchesEmploymentType = !filters.employmentType || filters.employmentType.length === 0 || filters.employmentType.includes(staffMember.employmentType);
    const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(staffMember.employmentStatus);

    return matchesDepartment && matchesRole && matchesEmploymentType && matchesStatus;
  });

  const displayedStaff = filteredStaff.slice(0, displayedCount);
  const hasMore = displayedCount < filteredStaff.length;

  return (
    <MainLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isPageLoading} loadingText="Loading Staff" />

      {/* Main Content - Fades in after loading */}
      <div className={`transition-opacity duration-500 ${isPageLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
        {/* Left Section - Title and Breadcrumb */}
        <PageHeader
          title="Staff"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Peoples" },
            { label: viewMode === "grid" ? "Staff Grid" : "Staff Table", isActive: true },
          ]}
        />

        {/* Right Section - Action Buttons */}
        <PageActions
          addButtonLabel="Add Staff"
          exportDescription="Download staff data"
          onAdd={() => router.push("/staff/add")}
          onRefresh={handleRefresh}
          onPrint={() => console.log("Print staff")}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />
      </div>

        {/* Filters Bar */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
          {/* Left Section - Date and Filter */}
          <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
            {/* Date Range Picker */}
            <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />

            {/* Filter */}
            <FilterButton fields={filterFields} onFilterChange={handleFilterChange} resetKey={resetKey} />

            {/* Delete All Button - Only show in table view when items are selected */}
            {viewMode === "list" && selectedIds.size > 0 && (
              <DeleteAllButton
                selectedCount={selectedIds.size}
                onDeleteAll={handleDeleteAll}
              />
            )}

            {/* Staff Count Badge (Grid View Only) */}
            {viewMode === "grid" && (
              <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
                <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                  1 to {Math.min(displayedCount, filteredStaff.length)} of {filteredStaff.length}
                </span>
              </div>
            )}

            {/* Delete All Button - Grid view (desktop: after count badge, mobile: hidden here) */}
            {viewMode === "grid" && selectedIds.size > 0 && (
              <div className="hidden sm:block">
                <DeleteAllButton
                  selectedCount={selectedIds.size}
                  onDeleteAll={handleDeleteAll}
                />
              </div>
            )}
          </div>

          {/* Right Section - View Toggle and Sort */}
          <div className="flex items-center justify-end gap-3 lg:flex-1">
            {/* Delete All Button - Grid view (mobile: before checkbox, far left) */}
            {viewMode === "grid" && selectedIds.size > 0 && (
              <div className="block sm:hidden">
                <DeleteAllButton
                  selectedCount={selectedIds.size}
                  onDeleteAll={handleDeleteAll}
                />
              </div>
            )}

            {/* Select All Checkbox - Only show in grid view */}
            {viewMode === "grid" && (
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-sm">
                <input
                  type="checkbox"
                  ref={(el) => {
                    if (el) {
                      const isSomeSelected = selectedIds.size > 0 && selectedIds.size < displayedStaff.length;
                      el.indeterminate = isSomeSelected;
                    }
                  }}
                  checked={selectedIds.size === displayedStaff.length && displayedStaff.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Select all displayed staff
                      setSelectedIds(new Set(displayedStaff.map(s => s.id)));
                    } else {
                      // Deselect all
                      setSelectedIds(new Set());
                    }
                  }}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Select All
                </span>
              </div>
            )}

            {/* View Toggle */}
            <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />

            {/* Sort */}
            <SortButton
              options={sortOptions}
              defaultOption="ascending"
              onSortChange={handleSortChange}
              resetKey={resetKey}
            />
          </div>
        </div>
      </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out" style={{ overflow: 'visible' }}>
          {/* Staff Grid or Table */}
          <div className="relative min-h-[400px]" style={{ overflow: 'visible' }}>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div
              key={`grid-view-${isFiltering ? 'filtering' : 'filtered'}-${isSorting ? 'sorting' : 'sorted'}-${isRefreshing ? 'refreshing' : 'refreshed'}-${sortOption}`}
              className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ overflow: 'visible' }}
            >
              {(isFiltering || isSorting || isRefreshing || isSwitchingView) ? (
                <PageSpinner message={isSwitchingView ? "Switching view..." : isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."} size="md" />
              ) : displayedStaff.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  {/* Icon with gradient background */}
                  <div className="relative mb-4">
                    {/* Gradient background circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 midnight:from-cyan-500/5 midnight:to-cyan-600/5 purple:from-pink-500/5 purple:to-pink-600/5 animate-pulse" />
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1">
                    No data available
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                    No staff found
                  </p>
                </div>
              ) : (
                <>
                  <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5" style={{ overflow: 'visible' }}>
                    {displayedStaff.map((staffMember, index) => (
                      <StaffCard
                        key={staffMember.id}
                        staff={staffMember}
                        colorIndex={index}
                        isSelected={selectedIds.has(staffMember.id)}
                        onSelectionChange={(id, selected) => {
                          const newIds = new Set(selectedIds);
                          if (selected) {
                            newIds.add(id);
                          } else {
                            newIds.delete(id);
                          }
                          setSelectedIds(newIds);
                        }}
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="flex justify-center pt-4">
                      <LoadMoreButton onClick={handleLoadMore} isLoading={isLoadingMore} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div
              key={`list-view-${isFiltering ? 'filtering' : 'filtered'}-${isSorting ? 'sorting' : 'sorted'}-${isRefreshing ? 'refreshing' : 'refreshed'}-${sortOption}`}
              className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            >
              {isSwitchingView ? (
                <PageSpinner message="Switching view..." size="md" />
              ) : (
                <StaffTable
                  staff={filteredStaff}
                  isLoading={isFiltering || isSorting || isRefreshing}
                  loadingMessage={isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."}
                  totalStaffCount={staff.length}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                />
              )}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={handleCloseBulkDeleteModal}
        onConfirm={handleConfirmBulkDelete}
        items={itemsToDelete}
        onRemoveItem={handleRemoveFromDeleteList}
        onRestoreItem={handleRestoreItem}
        onRestoreAll={handleRestoreAll}
        title="Delete Staff"
        warningMessage="This will permanently remove these staff members and all associated data. This action cannot be undone."
        confirmButtonText="Delete Staff"
      />
    </MainLayout>
  );
}
