"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageSpinner from "@/components/shared/PageSpinner";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Tooltip from "@/components/shared/Tooltip";
import MessageCard, { getCategoryBadge, formatMessageTime } from "./MessageCard";
import MessageStats, { calculateMessageStats } from "./MessageStats";
import {
  AdminMessage,
  MessagesPageConfig,
  MESSAGE_SORT_OPTIONS,
  DEFAULT_MESSAGE_FILTER_FIELDS,
} from "./types";
import {
  MessageSquare,
  Inbox,
  Send,
  User,
  Eye,
  Reply,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface SelectedRecipient {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
}

export interface MessagesPageContentProps {
  messages: AdminMessage[];
  config: MessagesPageConfig;
  selectedRecipient?: SelectedRecipient | null;
  onClearRecipient?: () => void;
  isLoading?: boolean;
}

export default function MessagesPageContent({
  messages,
  config,
  selectedRecipient,
  onClearRecipient,
  isLoading: externalLoading = false,
}: MessagesPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  // Get view mode from URL, default to list
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
  const stats = useMemo(() => calculateMessageStats(messages), [messages]);

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`${config.basePath}/messages?view=${newMode}`);

    setTimeout(() => {
      setIsSwitchingView(false);
    }, 700);
  };

  // Sync view mode with URL changes
  useEffect(() => {
    const urlView = searchParams.get("view");
    const newViewMode = urlView === "grid" ? "grid" : "list";
    setViewMode(newViewMode);
  }, [searchParams]);

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sort state
  const [sortOption, setSortOption] = useState<string>("newest");
  const [isSorting, setIsSorting] = useState(false);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Single delete modal state
  const [messageToDelete, setMessageToDelete] = useState<AdminMessage | null>(null);

  // Animation trigger
  const filterKey = `${JSON.stringify(filters)}-${sortOption}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setDateRange({ startDate, endDate });
      const initialCount = viewMode === "grid" ? 12 : 15;
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
      const initialCount = viewMode === "grid" ? 12 : 15;
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
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedMessages = filteredMessages.filter((msg) => selectedIds.has(msg.id));

      const items: BulkDeleteItem[] = selectedMessages.map((msg) => ({
        id: msg.id,
        name: msg.subject,
        subtitle: `${msg.type === "received" ? "From" : "To"}: ${
          msg.type === "received" ? msg.senderName : msg.recipientName
        }`,
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
    console.log("Deleting messages:", itemIds);
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);
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

  // Single message delete handlers
  const handleDeleteClick = (msg: AdminMessage) => {
    setMessageToDelete(msg);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      console.log("Deleting message:", messageToDelete.id);
      setMessageToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setMessageToDelete(null);
  };

  // Card action handlers
  const handleCardSelect = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleCardView = (msg: AdminMessage) => {
    if (config.viewMessageUrl) {
      router.push(config.viewMessageUrl(msg));
    }
  };

  const handleCardReply = (msg: AdminMessage) => {
    if (config.replyMessageUrl) {
      router.push(config.replyMessageUrl(msg));
    }
  };

  // Check if there are active filters
  const hasActiveFilters =
    Object.values(filters).some((values) => values && values.length > 0) ||
    dateRange !== null ||
    selectedRecipient !== null;

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
    setDateRange(null);
    setFilters({});
    setSortOption("newest");
    setSelectedIds(new Set());
    setResetKey((prev) => prev + 1);
    setTimeout(() => {
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    console.log("Export to PDF");
  };

  const handleExportExcel = () => {
    console.log("Export to Excel");
  };

  const handleComposeMessage = () => {
    if (config.composeUrl) {
      router.push(config.composeUrl);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const initialCount = viewMode === "grid" ? 12 : 15;
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

  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger((prev) => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  useEffect(() => {
    if (animationTrigger <= 0) return;
    const timeoutId = setTimeout(() => {
      const root = tableWrapRef.current;
      if (!root) return;
      const rows = root.querySelectorAll("tbody tr");
      rows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        const delay = index / 80;
        htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
      });
      setTimeout(() => {
        rows.forEach((row) => {
          const htmlRow = row as HTMLElement;
          htmlRow.style.animation = "";
        });
      }, 600);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [animationTrigger]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  };

  // Apply sorting
  const sortedMessages = [...messages].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case "oldest":
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case "priority":
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "sender_asc":
        return a.senderName.localeCompare(b.senderName);
      case "sender_desc":
        return b.senderName.localeCompare(a.senderName);
      default:
        return 0;
    }
  });

  // Apply filters
  const filteredMessages = sortedMessages.filter((msg) => {
    // First, apply recipient filter if present
    if (selectedRecipient) {
      const matchesRecipient =
        msg.senderId === selectedRecipient.id || msg.recipientId === selectedRecipient.id;
      if (!matchesRecipient) return false;
    }

    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters && !dateRange) return true;

    // Type filter
    const matchesType =
      !filters.type ||
      filters.type.length === 0 ||
      filters.type.some((t) => t.toLowerCase() === msg.type);

    // Status filter
    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => {
        if (s === "Read") return msg.isRead;
        if (s === "Unread") return !msg.isRead;
        return false;
      });

    // Category filter
    const matchesCategory =
      !filters.category || filters.category.length === 0 || filters.category.includes(msg.category);

    // Priority filter
    const matchesPriority =
      !filters.priority ||
      filters.priority.length === 0 ||
      filters.priority.some((p) => p.toLowerCase() === msg.priority);

    // Date range filter
    let matchesDateRange = true;
    if (dateRange) {
      const msgDate = new Date(msg.timestamp);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      matchesDateRange = msgDate >= startDate && msgDate <= endDate;
    }

    return matchesType && matchesStatus && matchesCategory && matchesPriority && matchesDateRange;
  });

  const displayedMessages = filteredMessages.slice(0, displayedCount);
  const hasMore = displayedCount < filteredMessages.length;

  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView || externalLoading;

  // Get priority indicator
  const getPriorityIndicator = (priority: AdminMessage["priority"]) => {
    if (priority === "high") {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  // Table columns
  const columns: ColumnConfig<AdminMessage>[] = [
    {
      key: "checkbox",
      label: "",
      className: "w-10 px-2",
      hidden: { mobile: true },
      render: (msg) => (
        <input
          type="checkbox"
          checked={selectedIds.has(msg.id)}
          onChange={(e) => {
            const newSelectedIds = new Set(selectedIds);
            if (e.target.checked) {
              newSelectedIds.add(msg.id);
            } else {
              newSelectedIds.delete(msg.id);
            }
            setSelectedIds(newSelectedIds);
          }}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
    },
    {
      key: "type",
      label: "",
      className: "w-8 px-1",
      render: (msg) => (
        <Tooltip content={msg.type === "received" ? "Received" : "Sent"}>
          <div
            className={`p-1 rounded-md ${
              msg.type === "received"
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-emerald-100 dark:bg-emerald-900/30"
            }`}
          >
            {msg.type === "received" ? (
              <Inbox className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "participants",
      label: "From → To",
      className: "min-w-[120px] md:min-w-[160px]",
      sortable: true,
      render: (msg) => (
        <div className="flex items-center gap-2">
          <div className="relative cursor-pointer group/avatar flex-shrink-0">
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-1 ring-white/80 dark:ring-gray-700/50 shadow-sm transition-all duration-300 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-lg group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 group-hover/avatar:z-[100]">
              {msg.senderAvatar ? (
                <Image
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-xs sm:text-sm truncate leading-tight ${
                !msg.isRead && msg.type === "received"
                  ? "font-semibold text-gray-900 dark:text-white"
                  : "font-medium text-gray-700 dark:text-gray-300"
              }`}
            >
              {msg.senderName}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate leading-tight">
              <span className="text-gray-400 dark:text-gray-500">→</span> {msg.recipientName}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      className: "min-w-[150px] md:min-w-[200px]",
      sortable: true,
      render: (msg) => (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {getPriorityIndicator(msg.priority)}
            {!msg.isRead && msg.type === "received" && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            )}
            <p
              className={`text-xs sm:text-sm truncate leading-tight ${
                !msg.isRead && msg.type === "received"
                  ? "font-semibold text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {msg.subject}
            </p>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-tight">
            {msg.preview}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "min-w-[75px] md:min-w-[85px]",
      hidden: { mobile: true, tablet: true },
      render: (msg) => getCategoryBadge(msg.category),
    },
    {
      key: "student",
      label: "Student",
      className: "min-w-[80px] md:min-w-[90px]",
      hidden: { mobile: true, tablet: true },
      render: (msg) =>
        msg.childName ? (
          <span className="text-xs text-gray-700 dark:text-gray-300 truncate block">
            {msg.childName.split(" ")[0]}{" "}
            {msg.childName
              .split(" ")
              .slice(1)
              .map((n) => n[0])
              .join("")}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      key: "actions",
      label: "",
      className: "min-w-[80px] md:min-w-[130px] text-right pr-2",
      render: (msg) => (
        <div className="flex items-center justify-end gap-0.5">
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mr-1 sm:mr-1.5 whitespace-nowrap">
            {formatMessageTime(msg.timestamp)}
          </span>
          <div className="hidden sm:flex items-center gap-0.5">
            <Tooltip content="View">
              <button
                type="button"
                onClick={() => handleCardView(msg)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </button>
            </Tooltip>
            <Tooltip content="Reply">
              <button
                type="button"
                onClick={() => handleCardReply(msg)}
                className="p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <Reply className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                type="button"
                onClick={() => handleDeleteClick(msg)}
                className="p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              </button>
            </Tooltip>
          </div>
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => handleCardView(msg)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
        <PageHeader
          title={
            selectedRecipient
              ? `Messages with ${selectedRecipient.firstName} ${selectedRecipient.lastName}`
              : config.pageTitle
          }
          breadcrumbs={
            selectedRecipient
              ? [
                  ...config.breadcrumbs.slice(0, -1),
                  { label: "Messages", href: `${config.basePath}/messages` },
                  {
                    label: `${selectedRecipient.firstName} ${selectedRecipient.lastName}`,
                    isActive: true,
                  },
                ]
              : config.breadcrumbs
          }
        />

        <PageActions
          addButtonLabel="Compose Message"
          exportDescription="Download messages"
          onAdd={config.composeUrl ? handleComposeMessage : undefined}
          onRefresh={handleRefresh}
          onPrint={handlePrint}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />
      </div>

      {/* Stats */}
      <MessageStats stats={stats} />

      {/* Filters Bar */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
          <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
            <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />
            <FilterButton
              fields={DEFAULT_MESSAGE_FILTER_FIELDS}
              onFilterChange={handleFilterChange}
              resetKey={resetKey}
            />

            {selectedIds.size > 0 && (
              <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
            )}

            {/* Selected Recipient Filter Chip */}
            {selectedRecipient && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2">
                  {selectedRecipient.profilePhoto ? (
                    <Image
                      src={selectedRecipient.profilePhoto}
                      alt={`${selectedRecipient.firstName} ${selectedRecipient.lastName}`}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">
                        {selectedRecipient.firstName.charAt(0)}
                        {selectedRecipient.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {selectedRecipient.firstName} {selectedRecipient.lastName}
                  </span>
                </div>
                {onClearRecipient && (
                  <button
                    onClick={onClearRecipient}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
                    title="Clear filter"
                  >
                    <span className="text-sm font-bold">&times;</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {filteredMessages.length} messages
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 lg:flex-1">
            <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
            <SortButton
              options={[...MESSAGE_SORT_OPTIONS]}
              defaultOption="newest"
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
          {viewMode === "list" ? (
            <div
              key={`list-view-${isFiltering ? "filtering" : "filtered"}-${sortOption}`}
              className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]"
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
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                    </div>
                    <div className="relative z-10 flex items-center justify-center w-16 h-16">
                      <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    No messages found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasActiveFilters
                      ? "No results match the current filters. Try adjusting your filters."
                      : "No messages available"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        handleClearFilters();
                        if (onClearRecipient) onClearRecipient();
                      }}
                      className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors duration-200"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div
                  ref={tableWrapRef}
                  key={`messages-table-${filterKey}`}
                  className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm"
                >
                  <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none rounded-r-xl" />
                  <DataTable
                    data={filteredMessages}
                    columns={columns}
                    getRowKey={(msg) => msg.id}
                    emptyMessage="No messages found"
                    title=""
                    showSearch={false}
                    defaultItemsPerPage={15}
                    itemsPerPageOptions={[10, 15, 25, 50]}
                    enablePagination={true}
                    enableItemsPerPage={true}
                    stickyColumnCount={1}
                    disableHorizontalScroll={false}
                  />
                </div>
              )}
            </div>
          ) : (
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
              ) : displayedMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                    </div>
                    <div className="relative z-10 flex items-center justify-center w-16 h-16">
                      <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    No messages found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasActiveFilters
                      ? "No results match the current filters. Try adjusting your filters."
                      : "No messages available"}
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2 pr-2 md:pr-0"
                    style={{ overflow: "visible" }}
                  >
                    {displayedMessages.map((msg, index) => (
                      <div
                        key={msg.id}
                        style={{
                          transition: "opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                          transitionDelay: `${index / 40}s`,
                        }}
                      >
                        <MessageCard
                          message={msg}
                          formatTime={formatMessageTime}
                          isSelected={selectedIds.has(msg.id)}
                          onSelect={handleCardSelect}
                          onView={handleCardView}
                          onReply={handleCardReply}
                          onDelete={handleDeleteClick}
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
        title="Delete Messages"
        warningMessage="This will permanently remove these messages. This action cannot be undone."
        confirmButtonText="Delete Messages"
      />

      {/* Single Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!messageToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        itemName={messageToDelete?.subject || ""}
        itemId={messageToDelete?.id || ""}
        itemInitials={
          messageToDelete?.senderName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || ""
        }
        warningMessage="This will permanently delete this message. This action cannot be undone."
      />
    </>
  );
}
