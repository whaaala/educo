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
import ChatCard, { formatChatTime } from "./ChatCard";
import ChatStats, { calculateChatStats } from "./ChatStats";
import {
  ChatConversation,
  ChatPageConfig,
  CHAT_SORT_OPTIONS,
  DEFAULT_CHAT_FILTER_FIELDS,
} from "./types";
import {
  MessageCircle,
  User,
  Eye,
  Trash2,
  CheckCheck,
} from "lucide-react";

export interface ChatPageContentProps {
  conversations: ChatConversation[];
  config: ChatPageConfig;
  isLoading?: boolean;
}

export default function ChatPageContent({
  conversations,
  config,
  isLoading: externalLoading = false,
}: ChatPageContentProps) {
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
  const stats = useMemo(() => calculateChatStats(conversations), [conversations]);

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`${config.basePath}/chat?view=${newMode}`);
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
  const [chatToDelete, setChatToDelete] = useState<ChatConversation | null>(null);

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

  const handleStartNewChat = () => {
    if (config.composeUrl) {
      router.push(config.composeUrl);
    }
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedChats = filteredConversations.filter((c) => selectedIds.has(c.id));
      const items: BulkDeleteItem[] = selectedChats.map((c) => ({
        id: c.id,
        name: c.recipientName,
        subtitle: `Last: ${c.lastMessage.slice(0, 30)}...`,
      }));
      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleConfirmBulkDelete = (itemIds: string[]) => {
    console.log("Deleting chats:", itemIds);
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

  const handleDeleteClick = (chat: ChatConversation) => {
    setChatToDelete(chat);
  };

  const handleConfirmDelete = () => {
    if (chatToDelete) {
      console.log("Deleting chat:", chatToDelete.id);
      setChatToDelete(null);
    }
  };

  const handleViewChat = (chat: ChatConversation) => {
    if (config.viewChatUrl) {
      router.push(config.viewChatUrl(chat));
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
  const sortedConversations = [...conversations].sort((a, b) => {
    switch (sortOption) {
      case "recent":
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      case "oldest":
        return new Date(a.lastMessageTime).getTime() - new Date(b.lastMessageTime).getTime();
      case "unread":
        return b.unreadCount - a.unreadCount;
      case "name_asc":
        return a.recipientName.localeCompare(b.recipientName);
      case "name_desc":
        return b.recipientName.localeCompare(a.recipientName);
      default:
        return 0;
    }
  });

  // Apply filters
  const filteredConversations = sortedConversations.filter((chat) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters && !dateRange) return true;

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => {
        if (s === "Online") return chat.isOnline;
        if (s === "Offline") return !chat.isOnline;
        return false;
      });

    const matchesMessages =
      !filters.messages ||
      filters.messages.length === 0 ||
      filters.messages.some((m) => {
        if (m === "Unread") return chat.unreadCount > 0;
        if (m === "Read") return chat.unreadCount === 0;
        return false;
      });

    let matchesDateRange = true;
    if (dateRange) {
      const chatDate = new Date(chat.lastMessageTime);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      matchesDateRange = chatDate >= startDate && chatDate <= endDate;
    }

    return matchesStatus && matchesMessages && matchesDateRange;
  });

  const displayedConversations = filteredConversations.slice(0, displayedCount);
  const hasMore = displayedCount < filteredConversations.length;
  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView || externalLoading;

  // Define table columns for DataTable
  const chatTableColumns: ColumnConfig<ChatConversation>[] = [
    {
      key: "select",
      label: "",
      sortable: false,
      className: "w-10 sm:w-12 text-center",
      hidden: { mobile: true },
      renderHeader: () => (
        <input
          type="checkbox"
          checked={selectedIds.size > 0 && selectedIds.size === filteredConversations.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(new Set(filteredConversations.map((c) => c.id)));
            } else {
              setSelectedIds(new Set());
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
      render: (chat) => (
        <input
          type="checkbox"
          checked={selectedIds.has(chat.id)}
          onChange={(e) => handleCardSelect(chat.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
    },
    {
      key: "contact",
      label: "Contact",
      sortable: true,
      className: "text-left min-w-[140px] md:min-w-[180px]",
      sortValue: (chat) => chat.recipientName,
      render: (chat) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-shrink-0 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] transition-all duration-300 ease-out group-hover:scale-150 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-blue-500 group-hover:z-[100]">
              {chat.recipientAvatar ? (
                <Image
                  src={chat.recipientAvatar}
                  alt={chat.recipientName}
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
            {chat.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 rounded-full" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Tooltip content={chat.recipientName}>
              <p
                className={`text-xs sm:text-sm truncate ${
                  chat.unreadCount > 0
                    ? "font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                    : "font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                }`}
              >
                {chat.recipientName}
              </p>
            </Tooltip>
            <Tooltip content={chat.recipientEmail} block>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate hidden sm:block">
                {chat.recipientEmail}
              </p>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      key: "lastMessage",
      label: "Last Message",
      sortable: false,
      className: "text-left min-w-[120px] md:min-w-[200px]",
      hidden: { mobile: true },
      render: (chat) => (
        <div className="flex items-center gap-2 min-w-0">
          {chat.lastMessageFrom === "admin" && (
            <CheckCheck
              className={`w-4 h-4 flex-shrink-0 ${
                chat.unreadCount === 0 ? "text-blue-500" : "text-gray-400"
              }`}
            />
          )}
          <Tooltip content={chat.lastMessage}>
            <p
              className={`text-xs sm:text-sm truncate ${
                chat.unreadCount > 0
                  ? "font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                  : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
              }`}
            >
              {chat.lastMessage}
            </p>
          </Tooltip>
        </div>
      ),
    },
    {
      key: "time",
      label: "Time",
      sortable: true,
      className: "min-w-[70px] md:min-w-[100px] text-left",
      sortValue: (chat) => new Date(chat.lastMessageTime).getTime(),
      render: (chat) => (
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            {formatChatTime(chat.lastMessageTime)}
          </span>
          {chat.unreadCount > 0 && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] sm:text-xs font-bold">
              {chat.unreadCount}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "min-w-[60px] md:min-w-[80px] text-center",
      render: (chat) => (
        <div
          className="flex items-center justify-center gap-0.5 sm:gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip content="Open Chat">
            <button
              onClick={() => handleViewChat(chat)}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button
              onClick={() => handleDeleteClick(chat)}
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
          addButtonLabel="New Chat"
          exportDescription="Download chat history"
          onAdd={config.composeUrl ? handleStartNewChat : undefined}
          onRefresh={handleRefresh}
          onPrint={() => window.print()}
          onExportPDF={() => console.log("Export PDF")}
          onExportExcel={() => console.log("Export Excel")}
        />
      </div>

      {/* Stats */}
      <ChatStats stats={stats} recipientLabel={config.recipientLabelPlural} />

      {/* Filters Bar */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
          <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
            <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />
            <FilterButton
              fields={DEFAULT_CHAT_FILTER_FIELDS}
              onFilterChange={handleFilterChange}
              resetKey={resetKey}
            />

            {selectedIds.size > 0 && (
              <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
            )}

            <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
              <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 whitespace-nowrap">
                {filteredConversations.length} chats
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 lg:flex-1">
            <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
            <SortButton
              options={[...CHAT_SORT_OPTIONS]}
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
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/20 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1">
                No chats found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                {hasActiveFilters
                  ? "Try adjusting your filters."
                  : `Start a new chat with a ${config.recipientLabel.toLowerCase()}.`}
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
              data={filteredConversations}
              columns={chatTableColumns}
              getRowKey={(chat) => chat.id}
              onRowClick={handleViewChat}
              emptyMessage="No chat conversations found"
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
                {displayedConversations.map((chat) => (
                  <ChatCard
                    key={chat.id}
                    chat={chat}
                    formatTime={formatChatTime}
                    isSelected={selectedIds.has(chat.id)}
                    onSelect={handleCardSelect}
                    onView={handleViewChat}
                    onDelete={handleDeleteClick}
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
        title="Delete Chats"
        warningMessage="This will permanently remove these chat conversations. This action cannot be undone."
        confirmButtonText="Delete Chats"
      />

      {/* Single Delete Modal */}
      <DeleteConfirmationModal
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Chat"
        itemName={chatToDelete?.recipientName || ""}
        itemId={chatToDelete?.id || ""}
        itemInitials={
          chatToDelete?.recipientName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || ""
        }
        warningMessage="This will permanently delete this chat conversation. This action cannot be undone."
      />
    </>
  );
}
