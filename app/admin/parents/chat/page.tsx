"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageLoader from "@/components/shared/PageLoader";
import PageSpinner from "@/components/shared/PageSpinner";
import StatCard from "@/components/shared/StatCard";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterField, FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Tooltip from "@/components/shared/Tooltip";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getAllParents, type AdminParent } from "@/lib/mockParents";
import {
  MessageCircle,
  MessageSquare,
  Users,
  User,
  Clock,
  Eye,
  Trash2,
  CheckCheck,
  Check,
  Circle,
} from "lucide-react";

// Chat conversation type
interface ChatConversation {
  id: string;
  parentId: string;
  parentName: string;
  parentAvatar?: string;
  parentEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageFrom: "parent" | "admin";
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  childName?: string;
}

// Generate mock chat conversations
const generateChatConversations = (): ChatConversation[] => {
  const parents = getAllParents();
  const conversations: ChatConversation[] = [];
  const lastMessages = [
    "Thank you for the quick response!",
    "Can you please share the fee statement?",
    "When is the next parent-teacher meeting?",
    "I'll check it out and get back to you.",
    "That sounds great, thank you!",
    "Could you clarify the homework assignment?",
    "My child will be absent tomorrow.",
    "Is there any update on the school event?",
    "Thanks for letting me know!",
    "I have a question about the report card.",
  ];

  parents.forEach((parent, index) => {
    // Use deterministic values based on index to avoid hydration mismatch
    const daysAgo = index % 7;
    const hoursAgo = (index * 3) % 24;
    const timestamp = new Date("2026-01-25T12:00:00");
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    conversations.push({
      id: `chat-${parent.id}`,
      parentId: parent.id,
      parentName: `${parent.firstName} ${parent.lastName}`,
      parentAvatar: parent.profilePhoto,
      parentEmail: parent.email,
      lastMessage: lastMessages[index % lastMessages.length],
      lastMessageTime: timestamp.toISOString(),
      lastMessageFrom: index % 2 === 0 ? "parent" : "admin",
      unreadCount: index % 3 === 0 ? (index % 5) + 1 : 0,
      isOnline: index % 3 !== 2,
      isPinned: index % 10 === 0,
      childName: parent.children[0]?.fullName,
    });
  });

  // Sort by pinned first, then by timestamp
  return conversations.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });
};

const MOCK_CONVERSATIONS = generateChatConversations();

export default function AdminParentChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePageLoading = usePageLoad(600);

  // Get view mode from URL
  const urlView = searchParams.get("view");
  const initialView = urlView === "grid" ? "grid" : "list";

  const [conversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(12);

  const isPageLoading = basePageLoading && !isSwitchingView;

  // Calculate stats
  const stats = useMemo(() => {
    const total = conversations.length;
    const active = conversations.filter((c) => c.isOnline).length;
    const unread = conversations.filter((c) => c.unreadCount > 0).length;
    const totalUnreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    return { total, active, unread, totalUnreadMessages };
  }, [conversations]);

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`/admin/parents/chat?view=${newMode}`);
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

  // Filter fields
  const filterFields: FilterField[] = [
    { id: "status", label: "Status", options: ["Online", "Offline"], width: "half" },
    { id: "messages", label: "Messages", options: ["Unread", "Read"], width: "half" },
  ];

  // Sort options
  const sortOptions = [
    { label: "Most Recent", value: "recent" },
    { label: "Oldest First", value: "oldest" },
    { label: "Most Unread", value: "unread" },
    { label: "A-Z (Name)", value: "name_asc" },
    { label: "Z-A (Name)", value: "name_desc" },
  ];

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
    router.push("/admin/parents/chat/compose");
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedChats = filteredConversations.filter((c) => selectedIds.has(c.id));
      const items: BulkDeleteItem[] = selectedChats.map((c) => ({
        id: c.id,
        name: c.parentName,
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
    router.push(`/parents/chat?chatId=${chat.id}&from=admin&parentName=${encodeURIComponent(chat.parentName)}`);
  };

  const handleCardSelect = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) newSelectedIds.add(id);
    else newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v && v.length > 0) || dateRange !== null;

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
        return a.parentName.localeCompare(b.parentName);
      case "name_desc":
        return b.parentName.localeCompare(a.parentName);
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
  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView;

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  // Define table columns for DataTable
  const chatTableColumns: ColumnConfig<ChatConversation>[] = [
    {
      key: "select",
      label: "",
      sortable: false,
      className: "w-12 text-center",
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
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
      render: (chat) => (
        <input
          type="checkbox"
          checked={selectedIds.has(chat.id)}
          onChange={(e) => handleCardSelect(chat.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
    },
    {
      key: "contact",
      label: "Contact",
      sortable: true,
      className: "text-left",
      sortValue: (chat) => chat.parentName,
      render: (chat) => (
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {chat.parentAvatar ? (
                <Image src={chat.parentAvatar} alt={chat.parentName} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </div>
            {chat.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
            )}
          </div>
          <div className="min-w-0">
            <p className={`text-sm truncate max-w-[180px] ${chat.unreadCount > 0 ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}>
              {chat.parentName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{chat.parentEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: "lastMessage",
      label: "Last Message",
      sortable: false,
      className: "text-left",
      render: (chat) => (
        <div className="flex items-center gap-2 min-w-0">
          {chat.lastMessageFrom === "admin" && (
            <CheckCheck className={`w-4 h-4 flex-shrink-0 ${chat.unreadCount === 0 ? "text-blue-500" : "text-gray-400"}`} />
          )}
          <p className={`text-sm truncate max-w-[220px] ${chat.unreadCount > 0 ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
            {chat.lastMessage}
          </p>
        </div>
      ),
    },
    {
      key: "time",
      label: "Time",
      sortable: true,
      className: "w-28 text-left",
      sortValue: (chat) => new Date(chat.lastMessageTime).getTime(),
      render: (chat) => (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(chat.lastMessageTime)}</span>
          {chat.unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">{chat.unreadCount}</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "w-24 text-center",
      render: (chat) => (
        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Tooltip content="Open Chat">
            <button onClick={() => handleViewChat(chat)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => handleDeleteClick(chat)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (!isMounted) return null;

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Chats" />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title="Parent Chats"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: "Parents", href: "/admin/parents" },
              { label: "Chat", isActive: true },
            ]}
          />

          <PageActions
            addButtonLabel="New Chat"
            exportDescription="Download chat history"
            onAdd={handleStartNewChat}
            onRefresh={handleRefresh}
            onPrint={() => window.print()}
            onExportPDF={() => console.log("Export PDF")}
            onExportExcel={() => console.log("Export Excel")}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
          <StatCard icon={MessageCircle} label="Total Chats" value={stats.total.toString()} color="blue" />
          <StatCard
            icon={Circle}
            label="Active Now"
            value={stats.active.toString()}
            color="green"
            badge={`${stats.active} Online`}
          />
          <StatCard
            icon={MessageSquare}
            label="Unread Chats"
            value={stats.unread.toString()}
            color="purple"
            badge={stats.totalUnreadMessages > 0 ? `${stats.totalUnreadMessages} messages` : undefined}
          />
          <StatCard icon={Users} label="Parents" value={stats.total.toString()} color="amber" />
        </div>

        {/* Filters Bar */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
            <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
              <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />
              <FilterButton fields={filterFields} onFilterChange={handleFilterChange} resetKey={resetKey} />

              {selectedIds.size > 0 && (
                <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
              )}

              <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {filteredConversations.length} chats
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 lg:flex-1">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <SortButton options={sortOptions} defaultOption="recent" onSortChange={handleSortChange} resetKey={resetKey} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
          <div className="relative min-h-[400px]">
            {isLoading ? (
              <PageSpinner message={isSwitchingView ? "Switching view..." : isRefreshing ? "Refreshing..." : "Loading..."} size="md" />
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/20 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No chats found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {hasActiveFilters ? "Try adjusting your filters." : "Start a new chat with a parent."}
                </p>
                {hasActiveFilters && (
                  <button onClick={handleClearFilters} className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Clear filters
                  </button>
                )}
              </div>
            ) : viewMode === "list" ? (
              <DataTable
                data={filteredConversations}
                columns={chatTableColumns}
                title="Chat Conversations"
                showSearch={false}
                getRowKey={(chat) => chat.id}
                onRowClick={handleViewChat}
                emptyMessage="No chat conversations found"
                enablePagination={true}
                enableItemsPerPage={true}
                defaultItemsPerPage={10}
                stickyColumnCount={1}
              />
            ) : (
              <>
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedConversations.map((chat, index) => (
                    <ChatCard
                      key={chat.id}
                      chat={chat}
                      formatTime={formatTime}
                      isSelected={selectedIds.has(chat.id)}
                      onSelect={handleCardSelect}
                      onView={handleViewChat}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
                {hasMore && <LoadMoreButton onClick={handleLoadMore} isLoading={isLoadingMore} text="Load More" loadingText="Loading..." />}
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
          onRemoveItem={(id) => {
            setItemsToDelete((prev) => prev.filter((i) => i.id !== id));
            setSelectedIds((prev) => {
              const newIds = new Set(prev);
              newIds.delete(id);
              return newIds;
            });
          }}
          onRestoreItem={(item) => {
            setItemsToDelete((prev) => [...prev, item]);
            setSelectedIds((prev) => new Set([...prev, item.id]));
          }}
          onRestoreAll={(items) => {
            setItemsToDelete((prev) => [...prev, ...items]);
            setSelectedIds((prev) => new Set([...prev, ...items.map((i) => i.id)]));
          }}
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
          itemName={chatToDelete?.parentName || ""}
          itemId={chatToDelete?.id || ""}
          itemInitials={chatToDelete?.parentName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || ""}
          warningMessage="This will permanently delete this chat conversation. This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}

// Chat Card Component for Grid View
interface ChatCardProps {
  chat: ChatConversation;
  formatTime: (timestamp: string) => string;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: (chat: ChatConversation) => void;
  onDelete: (chat: ChatConversation) => void;
}

function ChatCard({ chat, formatTime, isSelected, onSelect, onView, onDelete }: ChatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border ${
        isSelected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200 dark:border-gray-700"
      } shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer`}
      onClick={() => onView(chat)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-2 mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(chat.id, e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer mt-1"
          />
          <div className="flex items-center gap-2">
            {chat.unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">{chat.unreadCount}</span>
            )}
            {chat.isOnline && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Circle className="w-2 h-2 fill-current" />
                Online
              </span>
            )}
          </div>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {chat.parentAvatar ? (
              <Image src={chat.parentAvatar} alt={chat.parentName} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
            {chat.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm truncate ${chat.unreadCount > 0 ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}>
              {chat.parentName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.parentEmail}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          {chat.lastMessageFrom === "admin" && <CheckCheck className={`w-4 h-4 flex-shrink-0 mt-0.5 ${chat.unreadCount === 0 ? "text-blue-500" : "text-gray-400"}`} />}
          <p className={`text-sm line-clamp-2 ${chat.unreadCount > 0 ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
            {chat.lastMessage}
          </p>
        </div>

        {chat.childName && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">Re: {chat.childName}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(chat.lastMessageTime)}</span>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Tooltip content="Open Chat">
              <button onClick={() => onView(chat)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button onClick={() => onDelete(chat)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
