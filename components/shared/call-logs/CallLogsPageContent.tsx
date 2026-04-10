"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageSpinner from "@/components/shared/PageSpinner";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Tooltip from "@/components/shared/Tooltip";
import CallLogCard, { getCallStatusBadge } from "./CallLogCard";
import CallLogStats, { calculateCallLogStats } from "./CallLogStats";
import {
  CallLog,
  CallLogsPageConfig,
  CALL_LOG_SORT_OPTIONS,
  DEFAULT_CALL_LOG_FILTER_FIELDS,
  formatDuration,
  formatCallTime,
} from "./types";
import {
  PhoneCall,
  User,
  Video,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Eye,
  Trash2,
  RotateCcw,
  Play,
} from "lucide-react";

export interface CallLogsPageContentProps {
  calls: CallLog[];
  config: CallLogsPageConfig;
  onCallback?: (call: CallLog) => void;
  isLoading?: boolean;
}

export default function CallLogsPageContent({
  calls,
  config,
  onCallback,
  isLoading: externalLoading = false,
}: CallLogsPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get view mode from URL
  const urlView = searchParams.get("view");
  const initialView = urlView === "grid" ? "grid" : "list";

  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(12);

  // Calculate stats
  const stats = useMemo(() => calculateCallLogStats(calls), [calls]);

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`${config.basePath}/calls?view=${newMode}`);
    setTimeout(() => setIsSwitchingView(false), 700);
  };

  // Sync view mode with URL
  useEffect(() => {
    const urlView = searchParams.get("view");
    setViewMode(urlView === "grid" ? "grid" : "list");
  }, [searchParams]);

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortOption, setSortOption] = useState<string>("recent");
  const [isSorting, setIsSorting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);
  const [callToDelete, setCallToDelete] = useState<CallLog | null>(null);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setDateRange({ startDate, endDate });
      setDisplayedCount(12);
      setTimeout(() => setIsFiltering(false), 100);
    }, 300);
  };

  const handleFilterChange = (updatedFilters: FilterValues) => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters(updatedFilters);
      setDisplayedCount(12);
      setTimeout(() => setIsFiltering(false), 100);
    }, 300);
  };

  const handleClearFilters = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters({});
      setDateRange(null);
      setDisplayedCount(12);
      setTimeout(() => setIsFiltering(false), 100);
    }, 300);
  };

  const handleSortChange = (sortValue: string) => {
    setIsSorting(true);
    setTimeout(() => {
      setSortOption(sortValue);
      setTimeout(() => setIsSorting(false), 100);
    }, 300);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setDateRange(null);
    setFilters({});
    setSortOption("recent");
    setSelectedIds(new Set());
    setResetKey((prev) => prev + 1);
    setTimeout(() => {
      setDisplayedCount(12);
      setTimeout(() => setIsRefreshing(false), 100);
    }, 300);
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedCalls = filteredCalls.filter((c) => selectedIds.has(c.id));
      const items: BulkDeleteItem[] = selectedCalls.map((c) => ({
        id: c.id,
        name: c.recipientName,
        subtitle: `${c.callType === "video" ? "Video" : "Voice"} call - ${formatCallTime(c.startTime)}`,
      }));
      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleConfirmBulkDelete = (itemIds: string[]) => {
    console.log("Deleting calls:", itemIds);
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const handleRemoveFromDeleteList = (itemId: string) => {
    setItemsToDelete((prev) => prev.filter((i) => i.id !== itemId));
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      newIds.delete(itemId);
      return newIds;
    });
  };

  const handleRestoreItem = (item: BulkDeleteItem) => {
    setItemsToDelete((prev) => [...prev, item]);
    setSelectedIds((prev) => new Set([...prev, item.id]));
  };

  const handleRestoreAll = (items: BulkDeleteItem[]) => {
    setItemsToDelete((prev) => [...prev, ...items]);
    setSelectedIds((prev) => new Set([...prev, ...items.map((i) => i.id)]));
  };

  const handleDeleteClick = (call: CallLog) => {
    setCallToDelete(call);
  };

  const handleConfirmDelete = () => {
    if (callToDelete) {
      console.log("Deleting call:", callToDelete.id);
      setCallToDelete(null);
    }
  };

  const handleViewCall = (call: CallLog) => {
    if (config.viewCallUrl) {
      router.push(config.viewCallUrl(call));
    }
  };

  const handleCardSelect = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) newSelectedIds.add(id);
    else newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const hasActiveFilters =
    Object.values(filters).some((v) => v && v.length > 0) || dateRange !== null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setDisplayedCount(12);
      previousCountRef.current = 12;
    }
  }, [viewMode, isMounted]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  };

  // Apply sorting
  const sortedCalls = [...calls].sort((a, b) => {
    switch (sortOption) {
      case "recent":
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      case "oldest":
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      case "duration_desc":
        return (b.duration || 0) - (a.duration || 0);
      case "duration_asc":
        return (a.duration || 0) - (b.duration || 0);
      case "name_asc":
        return a.recipientName.localeCompare(b.recipientName);
      case "name_desc":
        return b.recipientName.localeCompare(a.recipientName);
      default:
        return 0;
    }
  });

  // Apply filters
  const filteredCalls = sortedCalls.filter((call) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters && !dateRange) return true;

    const matchesType =
      !filters.type ||
      filters.type.length === 0 ||
      filters.type.some((t) => t.toLowerCase() === call.callType);

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => {
        const statusLower = s.toLowerCase().replace(" ", "_");
        return statusLower === call.callStatus;
      });

    const matchesDirection =
      !filters.direction ||
      filters.direction.length === 0 ||
      filters.direction.some((d) => d.toLowerCase() === call.callDirection);

    let matchesDateRange = true;
    if (dateRange) {
      const callDate = new Date(call.startTime);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      matchesDateRange = callDate >= startDate && callDate <= endDate;
    }

    return matchesType && matchesStatus && matchesDirection && matchesDateRange;
  });

  const displayedCalls = filteredCalls.slice(0, displayedCount);
  const hasMore = displayedCount < filteredCalls.length;
  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView || externalLoading;

  // Define table columns for DataTable
  const callTableColumns: ColumnConfig<CallLog>[] = [
    {
      key: "select",
      label: "",
      sortable: false,
      className: "w-10 sm:w-12 text-center",
      hidden: { mobile: true },
      renderHeader: () => (
        <input
          type="checkbox"
          checked={selectedIds.size > 0 && selectedIds.size === filteredCalls.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(new Set(filteredCalls.map((c) => c.id)));
            } else {
              setSelectedIds(new Set());
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
      render: (call) => (
        <input
          type="checkbox"
          checked={selectedIds.has(call.id)}
          onChange={(e) => handleCardSelect(call.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
    },
    {
      key: "type",
      label: "",
      className: "w-10 px-1",
      render: (call) => (
        <Tooltip content={call.callType === "video" ? "Video Call" : "Voice Call"}>
          <div
            className={`p-1.5 rounded-lg ${
              call.callType === "video"
                ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                : "bg-emerald-100 dark:bg-emerald-900/30"
            }`}
          >
            {call.callType === "video" ? (
              <Video className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            ) : (
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      sortable: true,
      className: "text-left min-w-[140px] md:min-w-[180px]",
      sortValue: (call) => call.recipientName,
      render: (call) => {
        const isMissed = call.callStatus === "missed" || call.callStatus === "no_answer";
        return (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-shrink-0 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] transition-all duration-300 ease-out group-hover:scale-150 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-blue-500 group-hover:z-[100]">
                {call.recipientAvatar ? (
                  <Image
                    src={call.recipientAvatar}
                    alt={call.recipientName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {call.callDirection === "incoming" ? (
                  <PhoneIncoming
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isMissed ? "text-red-500" : "text-green-500"
                    }`}
                  />
                ) : (
                  <PhoneOutgoing
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isMissed ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                )}
                <Tooltip content={call.recipientName}>
                  <p
                    className={`text-xs sm:text-sm truncate ${
                      isMissed
                        ? "font-semibold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                        : "font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                    }`}
                  >
                    {call.recipientName}
                  </p>
                </Tooltip>
              </div>
              {call.recipientEmail && (
                <Tooltip content={call.recipientEmail} block>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate hidden sm:block">
                    {call.recipientEmail}
                  </p>
                </Tooltip>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      className: "min-w-[80px] md:min-w-[100px]",
      hidden: { mobile: true },
      render: (call) => getCallStatusBadge(call.callStatus),
    },
    {
      key: "duration",
      label: "Duration",
      sortable: true,
      className: "min-w-[70px] md:min-w-[90px]",
      hidden: { mobile: true, tablet: true },
      sortValue: (call) => call.duration || 0,
      render: (call) =>
        call.duration ? (
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            {formatDuration(call.duration)}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      key: "time",
      label: "Time",
      sortable: true,
      className: "min-w-[70px] md:min-w-[100px] text-left",
      sortValue: (call) => new Date(call.startTime).getTime(),
      render: (call) => (
        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
          {formatCallTime(call.startTime)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "min-w-[60px] md:min-w-[100px] text-center",
      render: (call) => (
        <div
          className="flex items-center justify-center gap-0.5 sm:gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {call.recordingUrl && (
            <Tooltip content="Play Recording">
              <button
                onClick={() => handleViewCall(call)}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </button>
            </Tooltip>
          )}
          {onCallback && (
            <Tooltip content="Call Back">
              <button
                onClick={() => onCallback(call)}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer hidden sm:block"
              >
                <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </Tooltip>
          )}
          <Tooltip content="Delete">
            <button
              onClick={() => handleDeleteClick(call)}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer hidden sm:block"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (!isMounted) return null;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
        <PageHeader title={config.pageTitle} breadcrumbs={config.breadcrumbs} />

        <PageActions
          addButtonLabel="New Call"
          exportDescription="Download call history"
          onAdd={config.startNewCallUrl ? () => router.push(config.startNewCallUrl!) : undefined}
          onRefresh={handleRefresh}
          onPrint={() => window.print()}
          onExportPDF={() => console.log("Export PDF")}
          onExportExcel={() => console.log("Export Excel")}
        />
      </div>

      {/* Stats */}
      <CallLogStats stats={stats} />

      {/* Filters Bar */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
          <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
            <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />
            <FilterButton
              fields={DEFAULT_CALL_LOG_FILTER_FIELDS}
              onFilterChange={handleFilterChange}
              resetKey={resetKey}
            />

            {selectedIds.size > 0 && (
              <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
            )}

            <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
              <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 whitespace-nowrap">
                {filteredCalls.length} calls
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 lg:flex-1">
            <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
            <SortButton
              options={[...CALL_LOG_SORT_OPTIONS]}
              defaultOption="recent"
              onSortChange={handleSortChange}
              resetKey={resetKey}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
        <div className="relative min-h-[400px]">
          {isLoading ? (
            <PageSpinner
              message={
                isSwitchingView
                  ? "Switching view..."
                  : isRefreshing
                  ? "Refreshing..."
                  : "Loading..."
              }
              size="md"
            />
          ) : filteredCalls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/20 flex items-center justify-center mb-4">
                <PhoneCall className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1">
                No call history found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                {hasActiveFilters
                  ? "Try adjusting your filters."
                  : `Start a call with a ${config.recipientLabel.toLowerCase()}.`}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : viewMode === "list" ? (
            <ResponsiveListTable
              variant="contained"
              data={filteredCalls}
              columns={callTableColumns}
              getRowKey={(call) => call.id}
              onRowClick={handleViewCall}
              emptyMessage="No call history found"
              defaultItemsPerPage={10}
              stickyColumnCount={1}
              disableHorizontalScroll={false}
            />
          ) : (
            <>
              <div
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {displayedCalls.map((call) => (
                  <CallLogCard
                    key={call.id}
                    call={call}
                    formatTime={formatCallTime}
                    isSelected={selectedIds.has(call.id)}
                    onSelect={handleCardSelect}
                    onView={handleViewCall}
                    onDelete={handleDeleteClick}
                    onCallback={onCallback}
                  />
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
      </div>

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        items={itemsToDelete}
        onRemoveItem={handleRemoveFromDeleteList}
        onRestoreItem={handleRestoreItem}
        onRestoreAll={handleRestoreAll}
        title="Delete Call Logs"
        warningMessage="This will permanently remove these call records. This action cannot be undone."
        confirmButtonText="Delete Calls"
      />

      {/* Single Delete Modal */}
      <DeleteConfirmationModal
        isOpen={!!callToDelete}
        onClose={() => setCallToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Call Log"
        itemName={callToDelete?.recipientName || ""}
        itemId={callToDelete?.id || ""}
        itemInitials={
          callToDelete?.recipientName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || ""
        }
        warningMessage="This will permanently delete this call record. This action cannot be undone."
      />
    </>
  );
}
