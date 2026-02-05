"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertTriangle, GraduationCap, UserMinus, Check, Trash2, UserPlus, Users, Shield } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ParentCard from "@/components/admin/parents/ParentCard";
import ParentsTable from "@/components/admin/parents/ParentsTable";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageSpinner from "@/components/shared/PageSpinner";
import PageLoader from "@/components/shared/PageLoader";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import Modal from "@/components/shared/Modal";
import FormButton from "@/components/shared/FormButton";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getAllParents, type AdminParent } from "@/lib/mockParents";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { exportParentsToPDF } from "@/utils/parentsPdfExport";
import { exportParentsToExcel } from "@/utils/parentsExcelExport";
import {
  parentFilterFields,
  parentSortOptions,
  sortParents,
  filterParents,
  getCurrencySymbol,
  hasActiveFilters as checkHasActiveFilters,
} from "./config";

export default function AdminParentsPage() {
  const { settings } = useSchoolSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePageLoading = usePageLoad(600);

  // Get view mode from URL, default to grid
  const urlView = searchParams.get("view");
  const initialView = urlView === "list" ? "list" : "grid";

  const [parents, setParents] = useState<AdminParent[]>(getAllParents());
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(8);

  const isPageLoading = basePageLoading && !isSwitchingView;

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`/admin/parents?view=${newMode}`);

    setTimeout(() => {
      setIsSwitchingView(false);
    }, 700);
  };

  // Sync view mode with URL changes
  useEffect(() => {
    const urlView = searchParams.get("view");
    const newViewMode = urlView === "list" ? "list" : "grid";
    setViewMode(newViewMode);
  }, [searchParams]);

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sort state
  const [sortOption, setSortOption] = useState<string>("ascending");
  const [isSorting, setIsSorting] = useState(false);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Cannot delete modal state (for parents with children)
  const [isCannotBulkDeleteOpen, setIsCannotBulkDeleteOpen] = useState(false);
  const [parentsWithChildren, setParentsWithChildren] = useState<AdminParent[]>([]);
  const [selectedChildrenInModal, setSelectedChildrenInModal] = useState<Record<string, string[]>>({});

  // Add parent modal state
  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);

  const { addNotification } = useNotifications();

  // Apply sorting and filtering using config functions
  const sortedParents = sortParents(parents, sortOption);
  const filteredParents = filterParents(sortedParents, filters);

  // Helper to toggle child selection in the bulk modal
  const toggleChildInModal = (parentId: string, childId: string) => {
    setSelectedChildrenInModal((prev) => {
      const parentChildren = prev[parentId] || [];
      if (parentChildren.includes(childId)) {
        return {
          ...prev,
          [parentId]: parentChildren.filter((id) => id !== childId),
        };
      } else {
        return {
          ...prev,
          [parentId]: [...parentChildren, childId],
        };
      }
    });
  };

  // Toggle all children for a parent in the modal
  const toggleAllChildrenForParent = (parentId: string, children: { id: string }[]) => {
    setSelectedChildrenInModal((prev) => {
      const parentChildren = prev[parentId] || [];
      if (parentChildren.length === children.length) {
        return { ...prev, [parentId]: [] };
      } else {
        return { ...prev, [parentId]: children.map((c) => c.id) };
      }
    });
  };

  // Disconnect selected children from a parent in the modal
  const handleDisconnectInModal = (parentId: string) => {
    const childrenToDisconnect = selectedChildrenInModal[parentId] || [];
    if (childrenToDisconnect.length === 0) return;

    // Update the parent in parentsWithChildren
    setParentsWithChildren((prev) =>
      prev
        .map((parent) => {
          if (parent.id === parentId) {
            return {
              ...parent,
              children: parent.children.filter((c) => !childrenToDisconnect.includes(c.id)),
            };
          }
          return parent;
        })
        .filter((parent) => parent.children.length > 0) // Remove parents with no children left
    );

    // Update the main parents state
    setParents((prevParents) =>
      prevParents.map((parent) => {
        if (parent.id === parentId) {
          return {
            ...parent,
            children: parent.children.filter((c) => !childrenToDisconnect.includes(c.id)),
          };
        }
        return parent;
      })
    );

    // Clear selection for this parent
    setSelectedChildrenInModal((prev) => {
      const newState = { ...prev };
      delete newState[parentId];
      return newState;
    });

    addNotification({
      type: "success",
      title: "Children Disconnected",
      message: `${childrenToDisconnect.length} child${childrenToDisconnect.length > 1 ? "ren have" : " has"} been disconnected from the parent.`,
    });
  };

  // Delete a parent directly from the modal (after all children are disconnected)
  const handleDeleteParentInModal = (parentId: string) => {
    // Remove from main parents state
    setParents((prevParents) => prevParents.filter((p) => p.id !== parentId));

    // Remove from selected IDs
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(parentId);
      return newIds;
    });

    addNotification({
      type: "success",
      title: "Parent Deleted",
      message: "The parent has been removed from the system.",
    });
  };

  // Get parents that are now eligible for deletion (no children)
  const getEligibleForDeletion = () => {
    return Array.from(selectedIds)
      .map((id) => parents.find((p) => p.id === id))
      .filter((p) => p && p.children.length === 0) as AdminParent[];
  };

  // Delete all eligible parents from the modal
  const handleDeleteAllEligible = () => {
    const eligibleParents = getEligibleForDeletion();
    if (eligibleParents.length === 0) return;

    const eligibleIds = eligibleParents.map((p) => p.id);

    // Remove from main parents state
    setParents((prevParents) => prevParents.filter((p) => !eligibleIds.includes(p.id)));

    // Remove from selected IDs
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      eligibleIds.forEach((id) => newIds.delete(id));
      return newIds;
    });

    addNotification({
      type: "success",
      title: "Parents Deleted",
      message: `${eligibleParents.length} parent${eligibleParents.length > 1 ? "s have" : " has"} been removed from the system.`,
    });

    // If no more parents with children, close the modal
    if (parentsWithChildren.length === 0) {
      setIsCannotBulkDeleteOpen(false);
    }
  };

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

  const handleClearFilters = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters({});
      setDateRange(null);
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedParents = filteredParents.filter((parent) => selectedIds.has(parent.id));

      // Check if any selected parents have children
      const parentsWithActiveChildren = selectedParents.filter(
        (parent) => parent.children && parent.children.length > 0
      );

      if (parentsWithActiveChildren.length > 0) {
        // Show modal that some parents cannot be deleted
        setParentsWithChildren(parentsWithActiveChildren);
        setIsCannotBulkDeleteOpen(true);
        return;
      }

      // All selected parents have no children, proceed with deletion
      const items: BulkDeleteItem[] = selectedParents.map((parent) => ({
        id: parent.id,
        name: `${parent.firstName} ${parent.lastName}`,
        subtitle: parent.email,
        avatar: parent.profilePhoto,
      }));

      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleRemoveFromDeleteList = (itemId: string) => {
    setItemsToDelete((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(itemId);
      return newIds;
    });
  };

  const handleConfirmBulkDelete = (itemIds: string[]) => {
    // Actually delete the parents from state
    setParents((prevParents) => prevParents.filter((p) => !itemIds.includes(p.id)));
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);

    addNotification({
      type: "success",
      title: "Parents Deleted",
      message: `${itemIds.length} parent${itemIds.length > 1 ? "s have" : " has"} been removed from the system.`,
    });
  };

  const handleCloseBulkDeleteModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const handleRestoreItem = (item: BulkDeleteItem) => {
    setItemsToDelete((prevItems) => [...prevItems, item]);
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.add(item.id);
      return newIds;
    });
  };

  const handleRestoreAll = (items: BulkDeleteItem[]) => {
    setItemsToDelete((prevItems) => [...prevItems, ...items]);
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      items.forEach((item) => newIds.add(item.id));
      return newIds;
    });
  };

  // Check if there are active filters
  const hasActiveFilters = checkHasActiveFilters(filters, dateRange);

  const handleSortChange = (sortValue: string) => {
    setIsSorting(true);
    setTimeout(() => {
      setSortOption(sortValue);
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    }, 300);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setDateRange(null);
    setFilters({});
    setSortOption("ascending");
    setSelectedIds(new Set());
    setResetKey((prev) => prev + 1);
    setTimeout(() => {
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = useCallback(() => {
    const currencySymbol = getCurrencySymbol(settings.currency || "NGN");
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");

    exportParentsToPDF(filteredParents, `parents_${dateStr}.pdf`, {
      currencySymbol,
      schoolName: settings.schoolName || "School Management System",
    });
  }, [filteredParents, settings.currency, settings.schoolName]);

  const handleExportExcel = useCallback(() => {
    const currencySymbol = getCurrencySymbol(settings.currency || "NGN");
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");

    exportParentsToExcel(filteredParents, `parents_${dateStr}.xlsx`, {
      currencySymbol,
      schoolName: settings.schoolName || "School Management System",
    });
  }, [filteredParents, settings.currency, settings.schoolName]);

  const handleAddParent = () => {
    setIsAddParentModalOpen(true);
  };

  const handleAddParentType = (type: "parent" | "guardian") => {
    setIsAddParentModalOpen(false);
    router.push(`/admin/parents/add?type=${type}`);
  };

  // Handle parent update (e.g., after disconnecting children)
  const handleParentUpdated = (updatedParent: AdminParent) => {
    setParents((prevParents) =>
      prevParents.map((p) => (p.id === updatedParent.id ? updatedParent : p))
    );
  };

  // Handle parent deletion
  const handleParentDeleted = (parentId: string) => {
    setParents((prevParents) => prevParents.filter((p) => p.id !== parentId));
    // Also remove from selected if it was selected
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(parentId);
      return newIds;
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset displayedCount when view mode changes
  useEffect(() => {
    if (isMounted) {
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      previousCountRef.current = initialCount;
    }
  }, [viewMode, isMounted]);

  useEffect(() => {
    if (displayedCount > previousCountRef.current && gridRef.current) {
      const cards = gridRef.current.children;
      const firstNewCardIndex = previousCountRef.current;

      if (cards[firstNewCardIndex]) {
        setTimeout(() => {
          (cards[firstNewCardIndex] as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }

      previousCountRef.current = displayedCount;
    }
  }, [displayedCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 500);
  };

  const displayedParents = filteredParents.slice(0, displayedCount);
  const hasMore = displayedCount < filteredParents.length;

  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView;

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Parents" />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title="Parents"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: viewMode === "grid" ? "Parents Grid" : "Parents Table", isActive: true },
            ]}
          />

          <PageActions
            addButtonLabel="Add Parent"
            exportDescription="Download parent data"
            onAdd={handleAddParent}
            onRefresh={handleRefresh}
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />
        </div>

        {/* Filters Bar */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
            <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
              <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />
              <FilterButton fields={parentFilterFields} onFilterChange={handleFilterChange} resetKey={resetKey} />

              {viewMode === "list" && selectedIds.size > 0 && (
                <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
              )}

              {viewMode === "grid" && (
                <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                  <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    1 to {Math.min(displayedCount, filteredParents.length)} of {filteredParents.length}
                  </span>
                </div>
              )}

              {viewMode === "grid" && selectedIds.size > 0 && (
                <div className="hidden sm:flex items-center gap-2">
                  <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 lg:flex-1">
              {viewMode === "grid" && selectedIds.size > 0 && (
                <div className="flex sm:hidden items-center gap-2">
                  <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
                </div>
              )}

              {viewMode === "grid" && (
                <div className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
                  <input
                    type="checkbox"
                    ref={(el) => {
                      if (el) {
                        const isSomeSelected = selectedIds.size > 0 && selectedIds.size < displayedParents.length;
                        el.indeterminate = isSomeSelected;
                      }
                    }}
                    checked={selectedIds.size === displayedParents.length && displayedParents.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(displayedParents.map((p) => p.id)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select All
                  </span>
                </div>
              )}

              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <SortButton
                options={parentSortOptions}
                defaultOption="ascending"
                onSortChange={handleSortChange}
                resetKey={resetKey}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out"
          style={{ overflow: "visible" }}
        >
          <div className="relative min-h-[400px]" style={{ overflow: "visible" }}>
            {viewMode === "grid" ? (
              <div
                key={`grid-view-${isFiltering ? "filtering" : "filtered"}-${sortOption}`}
                className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]"
                style={{ overflow: "visible" }}
              >
                {isLoading ? (
                  <PageSpinner
                    message={
                      isSwitchingView
                        ? "Switching view..."
                        : isRefreshing
                        ? "Refreshing..."
                        : isSorting
                        ? "Sorting..."
                        : "Filtering..."
                    }
                    size="md"
                  />
                ) : displayedParents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                      </div>
                      <div className="relative z-10 flex items-center justify-center w-16 h-16">
                        <svg
                          className="w-8 h-8 text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No data available</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hasActiveFilters
                        ? "No results match the current filters. Try adjusting your filters."
                        : "No parents found"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      ref={gridRef}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2 pr-2 md:pr-0"
                      style={{ overflow: "visible" }}
                    >
                      {displayedParents.map((parent, index) => (
                        <div
                          key={parent.id}
                          style={{
                            transition: "opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                            transitionDelay: `${index / 40}s`,
                          }}
                        >
                          <ParentCard
                            parent={parent}
                            colorIndex={index}
                            isSelected={selectedIds.has(parent.id)}
                            onSelectionChange={(id, selected) => {
                              const newSelectedIds = new Set(selectedIds);
                              if (selected) {
                                newSelectedIds.add(id);
                              } else {
                                newSelectedIds.delete(id);
                              }
                              setSelectedIds(newSelectedIds);
                            }}
                            onParentUpdated={handleParentUpdated}
                            onParentDeleted={handleParentDeleted}
                          />
                        </div>
                      ))}
                    </div>

                    {hasMore && (
                      <LoadMoreButton
                        onClick={handleLoadMore}
                        isLoading={isLoadingMore}
                        text="Load More"
                        loadingText="Loading..."
                      />
                    )}
                  </>
                )}
              </div>
            ) : (
              <div
                key={`list-view-${isFiltering ? "filtering" : "filtered"}-${sortOption}`}
                className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]"
              >
                <ParentsTable
                  parents={filteredParents}
                  isLoading={isLoading}
                  loadingMessage={
                    isSwitchingView
                      ? "Switching view..."
                      : isRefreshing
                      ? "Refreshing..."
                      : isSorting
                      ? "Sorting..."
                      : "Filtering..."
                  }
                  onClearFilters={handleClearFilters}
                  hasActiveFilters={hasActiveFilters}
                  totalParentsCount={parents.length}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                />
              </div>
            )}
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
          title="Delete Parents"
          warningMessage="This will permanently remove these parents and all associated data. This action cannot be undone."
          confirmButtonText="Delete Parents"
        />

        {/* Cannot Bulk Delete Modal - shown when trying to delete parents with children */}
        <Modal
          isOpen={isCannotBulkDeleteOpen}
          onClose={() => {
            setIsCannotBulkDeleteOpen(false);
            setParentsWithChildren([]);
            setSelectedChildrenInModal({});
          }}
          maxWidth="lg"
          title="Manage Parents & Children"
          subtitle="Disconnect children to enable parent deletion"
          icon={<UserMinus className="w-5 h-5" />}
        >
          <div className="space-y-4">
            {/* Warning Message */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  {parentsWithChildren.length} parent{parentsWithChildren.length > 1 ? "s have" : " has"} connected children
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Select and disconnect children below, then delete the parents. You can also delete parents that already have no children connected.
                </p>
              </div>
            </div>

            {/* Parents with Children List */}
            {parentsWithChildren.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Parents with Connected Children:
                </h4>
                <div className="space-y-3 max-h-[280px] overflow-y-auto">
                  {parentsWithChildren.map((parent) => {
                    const selectedForParent = selectedChildrenInModal[parent.id] || [];
                    const allSelected = selectedForParent.length === parent.children.length;
                    const someSelected = selectedForParent.length > 0;

                    return (
                      <div
                        key={parent.id}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        {/* Parent Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {parent.profilePhoto ? (
                              <img
                                src={parent.profilePhoto}
                                alt={`${parent.firstName} ${parent.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {parent.firstName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {parent.firstName} {parent.lastName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {selectedForParent.length} of {parent.children.length} selected
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleAllChildrenForParent(parent.id, parent.children)}
                              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDisconnectInModal(parent.id)}
                              disabled={!someSelected}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                              Disconnect
                            </button>
                          </div>
                        </div>

                        {/* Children List */}
                        <div className="flex flex-wrap gap-2">
                          {parent.children.map((child) => {
                            const isSelected = selectedForParent.includes(child.id);
                            return (
                              <div
                                key={child.id}
                                onClick={() => toggleChildInModal(parent.id, child.id)}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                                }`}
                              >
                                {/* Checkbox */}
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected
                                      ? "bg-red-600 border-red-600"
                                      : "border-2 border-gray-300 dark:border-gray-500"
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <GraduationCap className={`w-3.5 h-3.5 ${isSelected ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`} />
                                <span className={`text-xs font-medium ${isSelected ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}`}>
                                  {child.firstName} {child.lastName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Eligible for Deletion Section */}
            {getEligibleForDeletion().length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Ready for Deletion ({getEligibleForDeletion().length}):
                  </h4>
                  <button
                    type="button"
                    onClick={handleDeleteAllEligible}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete All Eligible
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getEligibleForDeletion().map((parent) => (
                    <div
                      key={parent.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    >
                      {parent.profilePhoto ? (
                        <img
                          src={parent.profilePhoto}
                          alt={`${parent.firstName} ${parent.lastName}`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                          {parent.firstName.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">
                        {parent.firstName} {parent.lastName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteParentInModal(parent.id)}
                        className="ml-1 p-1 rounded hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
                        title="Delete this parent"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success message when all done */}
            {parentsWithChildren.length === 0 && getEligibleForDeletion().length === 0 && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    All done!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    All selected parents have been processed.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsCannotBulkDeleteOpen(false);
                  setParentsWithChildren([]);
                  setSelectedChildrenInModal({});
                }}
              >
                Close
              </FormButton>
            </div>
          </div>
        </Modal>

        {/* Add Parent/Guardian Selection Modal */}
        <Modal
          isOpen={isAddParentModalOpen}
          onClose={() => setIsAddParentModalOpen(false)}
          maxWidth="sm"
          title="Add Parent or Guardian"
          subtitle="Choose the type of account to create"
          icon={<UserPlus className="w-5 h-5" />}
        >
          <div className="space-y-3">
            {/* Parent Option */}
            <button
              type="button"
              onClick={() => handleAddParentType("parent")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  Parent
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Biological parent (Father or Mother) of a student
                </p>
              </div>
            </button>

            {/* Guardian Option */}
            <button
              type="button"
              onClick={() => handleAddParentType("guardian")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  Guardian
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Legal guardian, sponsor, or caregiver of a student
                </p>
              </div>
            </button>

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                After creating the account, you can link them to one or more students in the system.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
