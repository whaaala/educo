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
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterField, FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Tooltip from "@/components/shared/Tooltip";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getAllParents, type AdminParent } from "@/lib/mockParents";
import {
  MessageSquare,
  Mail,
  MailOpen,
  Send,
  Inbox,
  Star,
  Eye,
  Reply,
  Trash2,
  MoreHorizontal,
  User,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Message types for admin view
interface AdminMessage {
  id: string;
  type: "received" | "sent";
  senderId: string;
  senderName: string;
  senderRole: "Parent" | "Teacher" | "Admin" | "Principal" | "System";
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientRole: "Parent" | "Teacher" | "Admin" | "Principal";
  recipientAvatar?: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
  priority: "low" | "normal" | "high";
  category: "Academic" | "Fee" | "Event" | "General" | "Complaint" | "Inquiry";
  childName?: string;
  childId?: string;
}

// Generate mock messages for admin view
const generateAdminMessages = (): AdminMessage[] => {
  const parents = getAllParents();
  const messages: AdminMessage[] = [];
  const subjects = [
    { category: "Academic" as const, subjects: ["Progress Report for", "Test Results Discussion", "Homework Submission Issue", "Parent-Teacher Meeting Request"] },
    { category: "Fee" as const, subjects: ["Fee Payment Confirmation", "Outstanding Balance Query", "Payment Plan Request", "Fee Receipt Request"] },
    { category: "Event" as const, subjects: ["School Event Invitation", "Sports Day Confirmation", "Cultural Day Participation", "Annual Day Registration"] },
    { category: "General" as const, subjects: ["General Inquiry", "School Policy Question", "Feedback and Suggestions", "Contact Information Update"] },
    { category: "Complaint" as const, subjects: ["Service Complaint", "Concern About Facilities", "Bus Service Issue", "Safety Concern"] },
    { category: "Inquiry" as const, subjects: ["Admission Inquiry", "Curriculum Question", "Extra-curricular Activities", "School Timings Query"] },
  ];
  const teachers = [
    { id: "teacher-001", name: "Mrs. Nkechi Eze", avatar: "https://i.pravatar.cc/150?u=nkechi" },
    { id: "teacher-002", name: "Mr. Oluwaseun Adeyemi", avatar: "https://i.pravatar.cc/150?u=oluwaseun" },
    { id: "teacher-003", name: "Miss Amaka Nwankwo", avatar: "https://i.pravatar.cc/150?u=amaka" },
    { id: "teacher-004", name: "Mr. Chidi Okafor", avatar: "https://i.pravatar.cc/150?u=chidi" },
  ];

  let msgId = 1;

  parents.forEach((parent) => {
    // Generate 2-5 messages per parent
    const numMessages = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < numMessages; i++) {
      const isReceived = Math.random() > 0.4; // 60% received from parents
      const categoryData = subjects[Math.floor(Math.random() * subjects.length)];
      const subjectTemplate = categoryData.subjects[Math.floor(Math.random() * categoryData.subjects.length)];
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const child = parent.children[Math.floor(Math.random() * parent.children.length)];

      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

      const subject = subjectTemplate.includes("for")
        ? `${subjectTemplate} ${child.fullName}`
        : subjectTemplate;

      if (isReceived) {
        // Message from parent to school
        messages.push({
          id: `msg-${String(msgId++).padStart(4, "0")}`,
          type: "received",
          senderId: parent.id,
          senderName: `${parent.firstName} ${parent.lastName}`,
          senderRole: "Parent",
          senderAvatar: parent.profilePhoto,
          recipientId: teacher.id,
          recipientName: teacher.name,
          recipientRole: "Teacher",
          recipientAvatar: teacher.avatar,
          subject,
          preview: `Dear ${teacher.name.split(" ")[0]}, I am writing to discuss ${subject.toLowerCase()}...`,
          timestamp: timestamp.toISOString(),
          isRead: Math.random() > 0.3,
          hasAttachment: Math.random() > 0.8,
          priority: Math.random() > 0.85 ? "high" : Math.random() > 0.7 ? "normal" : "low",
          category: categoryData.category,
          childName: child.fullName,
          childId: child.id,
        });
      } else {
        // Message from school to parent
        messages.push({
          id: `msg-${String(msgId++).padStart(4, "0")}`,
          type: "sent",
          senderId: teacher.id,
          senderName: teacher.name,
          senderRole: "Teacher",
          senderAvatar: teacher.avatar,
          recipientId: parent.id,
          recipientName: `${parent.firstName} ${parent.lastName}`,
          recipientRole: "Parent",
          recipientAvatar: parent.profilePhoto,
          subject,
          preview: `Dear Mr./Mrs. ${parent.lastName}, I am writing regarding ${subject.toLowerCase()}...`,
          timestamp: timestamp.toISOString(),
          isRead: true,
          hasAttachment: Math.random() > 0.85,
          priority: Math.random() > 0.9 ? "high" : "normal",
          category: categoryData.category,
          childName: child.fullName,
          childId: child.id,
        });
      }
    }
  });

  return messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const MOCK_MESSAGES = generateAdminMessages();

export default function AdminParentMessagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePageLoading = usePageLoad(600);
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  // Get view mode from URL, default to list
  const urlView = searchParams.get("view");
  const initialView = urlView === "grid" ? "grid" : "list";

  const [messages] = useState<AdminMessage[]>(MOCK_MESSAGES);
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
    const total = messages.length;
    const received = messages.filter((m) => m.type === "received").length;
    const sent = messages.filter((m) => m.type === "sent").length;
    const unread = messages.filter((m) => !m.isRead && m.type === "received").length;
    const highPriority = messages.filter((m) => m.priority === "high").length;
    return { total, received, sent, unread, highPriority };
  }, [messages]);

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`/admin/parents/messages?view=${newMode}`);

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

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      id: "type",
      label: "Type",
      options: ["Received", "Sent"],
      width: "half",
    },
    {
      id: "status",
      label: "Status",
      options: ["Read", "Unread"],
      width: "half",
    },
    {
      id: "category",
      label: "Category",
      options: ["Academic", "Fee", "Event", "General", "Complaint", "Inquiry"],
      width: "half",
    },
    {
      id: "priority",
      label: "Priority",
      options: ["High", "Normal", "Low"],
      width: "half",
    },
  ];

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

  // Sort options
  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "High Priority", value: "priority" },
    { label: "A-Z (Sender)", value: "sender_asc" },
    { label: "Z-A (Sender)", value: "sender_desc" },
  ];

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
        subtitle: `${msg.type === "received" ? "From" : "To"}: ${msg.type === "received" ? msg.senderName : msg.recipientName}`,
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
      // In a real app, you would call an API to delete the message here
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
    router.push(`/parents/messages?messageId=${msg.id}&from=admin&subject=${encodeURIComponent(msg.subject)}`);
  };

  const handleCardReply = (msg: AdminMessage) => {
    router.push(`/parents/messages?messageId=${msg.id}&from=admin&subject=${encodeURIComponent(msg.subject)}&action=reply`);
  };

  // Check if there are active filters
  const hasActiveFilters =
    Object.values(filters).some((values) => values && values.length > 0) || dateRange !== null;

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
    router.push("/admin/parents/messages/compose");
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
      !filters.category ||
      filters.category.length === 0 ||
      filters.category.includes(msg.category);

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
    } else {
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    }
  };

  // Get category badge
  const getCategoryBadge = (category: AdminMessage["category"]) => {
    const config: Record<string, { bg: string; text: string }> = {
      Academic: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
      Fee: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
      Event: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
      General: { bg: "bg-gray-100 dark:bg-gray-700/50", text: "text-gray-700 dark:text-gray-400" },
      Complaint: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
      Inquiry: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
    };
    const c = config[category];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        {category}
      </span>
    );
  };

  // Get priority badge
  const getPriorityIndicator = (priority: AdminMessage["priority"]) => {
    if (priority === "high") {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  // Table columns - Optimized for no horizontal scroll
  const columns: ColumnConfig<AdminMessage>[] = [
    {
      key: "checkbox",
      label: "",
      className: "w-10 px-2",
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
          <div className={`p-1 rounded-md ${msg.type === "received" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
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
      className: "w-[180px] min-w-[160px]",
      sortable: true,
      render: (msg) => (
        <div className="flex items-center gap-2">
          {/* Sender Avatar */}
          <div className="relative cursor-pointer group/avatar flex-shrink-0">
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-1 ring-white/80 dark:ring-gray-700/50 shadow-sm transition-all duration-300 ease-out group-hover/avatar:scale-125 group-hover/avatar:shadow-lg group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 group-hover/avatar:z-[100]">
              {msg.senderAvatar ? (
                <Image src={msg.senderAvatar} alt={msg.senderName} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm truncate leading-tight ${!msg.isRead && msg.type === "received" ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}>
              {msg.senderName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-tight">
              <span className="text-gray-400 dark:text-gray-500">→</span> {msg.recipientName}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      className: "w-auto",
      sortable: true,
      render: (msg) => (
        <div className="min-w-0 max-w-[350px]">
          <div className="flex items-center gap-1.5">
            {getPriorityIndicator(msg.priority)}
            {!msg.isRead && msg.type === "received" && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            )}
            <p className={`text-sm truncate leading-tight ${!msg.isRead && msg.type === "received" ? "font-semibold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
              {msg.subject}
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-tight">{msg.preview}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "w-[85px]",
      hidden: { mobile: true },
      render: (msg) => getCategoryBadge(msg.category),
    },
    {
      key: "student",
      label: "Student",
      className: "w-[90px]",
      hidden: { mobile: true, tablet: true },
      render: (msg) => (
        msg.childName ? (
          <span className="text-xs text-gray-700 dark:text-gray-300 truncate block">{msg.childName.split(" ")[0]} {msg.childName.split(" ").slice(1).map(n => n[0]).join("")}</span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )
      ),
    },
    {
      key: "actions",
      label: "",
      className: "w-[130px] text-right pr-2",
      render: (msg) => (
        <div className="flex items-center justify-end gap-0.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1.5 whitespace-nowrap">{formatTime(msg.timestamp)}</span>
          <Tooltip content="View">
            <button
              type="button"
              onClick={() => router.push(`/parents/messages?messageId=${msg.id}&from=admin&subject=${encodeURIComponent(msg.subject)}`)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </Tooltip>
          <Tooltip content="Reply">
            <button
              type="button"
              onClick={() => router.push(`/parents/messages?messageId=${msg.id}&from=admin&subject=${encodeURIComponent(msg.subject)}&action=reply`)}
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
      ),
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Messages" />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title="Parent Messages"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: "Parents", href: "/admin/parents" },
              { label: "Messages", isActive: true },
            ]}
          />

          <PageActions
            addButtonLabel="Compose Message"
            exportDescription="Download messages"
            onAdd={handleComposeMessage}
            onRefresh={handleRefresh}
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
          <StatCard
            icon={MessageSquare}
            label="Total Messages"
            value={stats.total.toString()}
            color="blue"
          />
          <StatCard
            icon={Inbox}
            label="Received"
            value={stats.received.toString()}
            color="purple"
            badge={stats.unread > 0 ? `${stats.unread} Unread` : undefined}
          />
          <StatCard
            icon={Send}
            label="Sent"
            value={stats.sent.toString()}
            color="green"
          />
          <StatCard
            icon={AlertCircle}
            label="High Priority"
            value={stats.highPriority.toString()}
            color={stats.highPriority > 0 ? "red" : "gray"}
          />
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
                  {filteredMessages.length} messages
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 lg:flex-1">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <SortButton
                options={sortOptions}
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
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No messages found</h3>
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
                  <div
                    ref={tableWrapRef}
                    key={`messages-table-${filterKey}`}
                    className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden"
                  >
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
                      stickyColumnCount={0}
                      disableHorizontalScroll={true}
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
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No messages found</h3>
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
                            formatTime={formatTime}
                            getCategoryBadge={getCategoryBadge}
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
          itemInitials={messageToDelete?.senderName?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || ""}
          warningMessage="This will permanently delete this message. This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}

// Message Card Component for Grid View
interface MessageCardProps {
  message: AdminMessage;
  formatTime: (timestamp: string) => string;
  getCategoryBadge: (category: AdminMessage["category"]) => React.ReactNode;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: (message: AdminMessage) => void;
  onReply: (message: AdminMessage) => void;
  onDelete: (message: AdminMessage) => void;
}

function MessageCard({ message, formatTime, getCategoryBadge, isSelected, onSelect, onView, onReply, onDelete }: MessageCardProps) {
  const isReceived = message.type === "received";

  return (
    <div className={`bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border ${isSelected ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20" : !message.isRead && isReceived ? "border-blue-300 dark:border-blue-500/50" : "border-gray-200 dark:border-gray-700"} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {/* Checkbox for bulk selection */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(message.id, e.target.checked)}
              className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            />
            {isReceived ? (
              <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Inbox className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
            {getCategoryBadge(message.category)}
          </div>
          <div className="flex items-center gap-1.5">
            {message.priority === "high" && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {!message.isRead && isReceived && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </div>
        </div>

        {/* From/To */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {message.senderAvatar ? (
              <Image
                src={message.senderAvatar}
                alt={message.senderName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm truncate ${!message.isRead && isReceived ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}>
              {message.senderName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              To: {message.recipientName}
            </p>
          </div>
        </div>

        {/* Subject */}
        <p className={`text-sm truncate ${!message.isRead && isReceived ? "font-semibold text-gray-900 dark:text-white" : "text-gray-800 dark:text-gray-200"}`}>
          {message.subject}
        </p>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {message.preview}
        </p>

        {message.childName && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
            Re: {message.childName}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          <div className="flex items-center gap-1">
            <Tooltip content="View">
              <button
                type="button"
                onClick={() => onView(message)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </Tooltip>
            <Tooltip content="Reply">
              <button
                type="button"
                onClick={() => onReply(message)}
                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <Reply className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                type="button"
                onClick={() => onDelete(message)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
