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
import Tooltip from "@/components/shared/Tooltip";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getAllParents } from "@/lib/mockParents";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Star,
  PartyPopper,
  Trophy,
  GraduationCap,
  Palmtree,
  FileText,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  UserCheck,
} from "lucide-react";

// Event types
type EventType = "academic" | "sports" | "cultural" | "meeting" | "holiday" | "examination";
type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface ParentRSVP {
  parentId: string;
  parentName: string;
  parentAvatar?: string;
  status: "confirmed" | "declined" | "pending";
  childrenAttending: string[];
  respondedAt?: string;
}

interface AdminEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  duration: "Half Day" | "Full Day";
  image: string;
  type: EventType;
  status: EventStatus;
  location?: string;
  isImportant: boolean;
  targetAudience: "All" | "Primary" | "Secondary" | "Specific Classes";
  targetClasses?: string[];
  invitedParents: number;
  confirmedParents: number;
  declinedParents: number;
  pendingParents: number;
  rsvpDeadline?: string;
  createdAt: string;
  createdBy: string;
  rsvps: ParentRSVP[];
}

// Generate mock events for admin view
const generateAdminEvents = (): AdminEvent[] => {
  const parents = getAllParents();
  const events: AdminEvent[] = [];
  // Use fixed base date to avoid hydration mismatch
  const BASE_DATE = new Date("2026-01-25T12:00:00");

  const eventData = [
    { title: "Parents Teacher Meet", type: "meeting" as EventType, image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop", location: "School Auditorium", important: true },
    { title: "Annual Day Celebration", type: "cultural" as EventType, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", location: "School Grounds", important: true },
    { title: "Sports Day", type: "sports" as EventType, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop", location: "Sports Field", important: false },
    { title: "Science Exhibition", type: "academic" as EventType, image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", location: "Science Labs", important: false },
    { title: "Mid-Term Examination", type: "examination" as EventType, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop", location: "Classrooms", important: true },
    { title: "Easter Holiday", type: "holiday" as EventType, image: "https://images.unsplash.com/photo-1457301547464-55675a0ffb8f?w=400&h=300&fit=crop", location: "", important: false },
    { title: "Cultural Day", type: "cultural" as EventType, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop", location: "School Hall", important: false },
    { title: "Inter-School Debate", type: "academic" as EventType, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop", location: "Conference Hall", important: false },
    { title: "End of Year Party", type: "cultural" as EventType, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop", location: "School Hall", important: true },
    { title: "Swimming Competition", type: "sports" as EventType, image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=300&fit=crop", location: "Swimming Pool", important: false },
  ];

  const audiences: AdminEvent["targetAudience"][] = ["All", "Primary", "Secondary", "Specific Classes"];
  const statuses: EventStatus[] = ["upcoming", "upcoming", "upcoming", "ongoing", "completed"];

  eventData.forEach((data, idx) => {
    const daysOffset = idx * 7 - 14;
    const eventDate = new Date(BASE_DATE);
    eventDate.setDate(eventDate.getDate() + daysOffset);

    const status = daysOffset < -7 ? "completed" : daysOffset < 0 ? "ongoing" : "upcoming";
    const audience = audiences[idx % audiences.length];

    // Generate RSVPs - use deterministic values based on idx
    const rsvps: ParentRSVP[] = [];
    const numRsvps = 3 + (idx % Math.min(parents.length, 10));
    const selectedParents = parents.slice(0, numRsvps);

    selectedParents.forEach((parent, pIdx) => {
      const rsvpStatusOptions: ParentRSVP["status"][] = ["confirmed", "confirmed", "declined", "pending"];
      const rsvpStatus = rsvpStatusOptions[(idx + pIdx) % rsvpStatusOptions.length];
      const daysAgoResponded = ((idx + pIdx) % 7) + 1;
      rsvps.push({
        parentId: parent.id,
        parentName: `${parent.firstName} ${parent.lastName}`,
        parentAvatar: parent.profilePhoto,
        status: rsvpStatus,
        childrenAttending: rsvpStatus === "confirmed" ? parent.children.map((c) => c.fullName) : [],
        respondedAt: rsvpStatus !== "pending" ? new Date(BASE_DATE.getTime() - daysAgoResponded * 24 * 60 * 60 * 1000).toISOString() : undefined,
      });
    });

    const confirmed = rsvps.filter((r) => r.status === "confirmed").length;
    const declined = rsvps.filter((r) => r.status === "declined").length;
    const pending = rsvps.filter((r) => r.status === "pending").length;

    const rsvpDeadline = new Date(eventDate);
    rsvpDeadline.setDate(rsvpDeadline.getDate() - 3);

    const startHour = 8 + (idx % 3);
    const endHour = 2 + (idx % 3);

    events.push({
      id: `evt-${String(idx + 1).padStart(3, "0")}`,
      title: data.title,
      description: `Join us for ${data.title.toLowerCase()}. This is an important event for all students and parents. Please confirm your attendance by the deadline.`,
      date: eventDate.toISOString().split("T")[0],
      endDate: data.type === "examination" || data.type === "holiday" ? new Date(eventDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : undefined,
      time: data.type !== "holiday" ? `${startHour}:00 AM - ${endHour}:00 PM` : undefined,
      duration: idx % 2 === 0 ? "Full Day" : "Half Day",
      image: data.image,
      type: data.type,
      status,
      location: data.location,
      isImportant: data.important,
      targetAudience: audience,
      targetClasses: audience === "Specific Classes" ? ["JSS 1", "JSS 2", "SS 1"] : undefined,
      invitedParents: parents.length,
      confirmedParents: confirmed,
      declinedParents: declined,
      pendingParents: pending,
      rsvpDeadline: rsvpDeadline.toISOString().split("T")[0],
      createdAt: new Date(eventDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "Admin",
      rsvps,
    });
  });

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const MOCK_EVENTS = generateAdminEvents();

// Helper functions
const getEventTypeInfo = (type: EventType) => {
  const config: Record<EventType, { label: string; icon: typeof Calendar; bgClass: string; textClass: string }> = {
    academic: { label: "Academic", icon: GraduationCap, bgClass: "bg-blue-100 dark:bg-blue-900/30", textClass: "text-blue-600 dark:text-blue-400" },
    sports: { label: "Sports", icon: Trophy, bgClass: "bg-emerald-100 dark:bg-emerald-900/30", textClass: "text-emerald-600 dark:text-emerald-400" },
    cultural: { label: "Cultural", icon: PartyPopper, bgClass: "bg-purple-100 dark:bg-purple-900/30", textClass: "text-purple-600 dark:text-purple-400" },
    meeting: { label: "Meeting", icon: Users, bgClass: "bg-amber-100 dark:bg-amber-900/30", textClass: "text-amber-600 dark:text-amber-400" },
    holiday: { label: "Holiday", icon: Palmtree, bgClass: "bg-rose-100 dark:bg-rose-900/30", textClass: "text-rose-600 dark:text-rose-400" },
    examination: { label: "Exam", icon: FileText, bgClass: "bg-red-100 dark:bg-red-900/30", textClass: "text-red-600 dark:text-red-400" },
  };
  return config[type];
};

const getStatusBadge = (status: EventStatus) => {
  const config: Record<EventStatus, { label: string; bgClass: string; textClass: string; icon: typeof CheckCircle2 }> = {
    upcoming: { label: "Upcoming", bgClass: "bg-blue-100 dark:bg-blue-900/30", textClass: "text-blue-700 dark:text-blue-400", icon: Clock },
    ongoing: { label: "Ongoing", bgClass: "bg-green-100 dark:bg-green-900/30", textClass: "text-green-700 dark:text-green-400", icon: CheckCircle2 },
    completed: { label: "Completed", bgClass: "bg-gray-100 dark:bg-gray-700/50", textClass: "text-gray-600 dark:text-gray-400", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", bgClass: "bg-red-100 dark:bg-red-900/30", textClass: "text-red-700 dark:text-red-400", icon: XCircle },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bgClass} ${c.textClass}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
};

export default function AdminParentEventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePageLoading = usePageLoad(600);
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  const urlView = searchParams.get("view");
  const initialView = urlView === "grid" ? "grid" : "list";

  const [events] = useState<AdminEvent[]>(MOCK_EVENTS);
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
    const total = events.length;
    const upcoming = events.filter((e) => e.status === "upcoming").length;
    const ongoing = events.filter((e) => e.status === "ongoing").length;
    const totalConfirmed = events.reduce((acc, e) => acc + e.confirmedParents, 0);
    const totalPending = events.reduce((acc, e) => acc + e.pendingParents, 0);
    return { total, upcoming, ongoing, totalConfirmed, totalPending };
  }, [events]);

  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`/admin/parents/events?view=${newMode}`);

    setTimeout(() => {
      setIsSwitchingView(false);
    }, 700);
  };

  useEffect(() => {
    const urlView = searchParams.get("view");
    const newViewMode = urlView === "grid" ? "grid" : "list";
    setViewMode(newViewMode);
  }, [searchParams]);

  // Filter fields
  const filterFields: FilterField[] = [
    {
      id: "status",
      label: "Status",
      options: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      width: "half",
    },
    {
      id: "type",
      label: "Event Type",
      options: ["Academic", "Sports", "Cultural", "Meeting", "Holiday", "Examination"],
      width: "half",
    },
    {
      id: "audience",
      label: "Audience",
      options: ["All", "Primary", "Secondary", "Specific Classes"],
      width: "half",
    },
    {
      id: "important",
      label: "Priority",
      options: ["Important Only", "All Events"],
      width: "half",
    },
  ];

  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortOption, setSortOption] = useState<string>("date_desc");
  const [isSorting, setIsSorting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  const filterKey = `${JSON.stringify(filters)}-${sortOption}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const sortOptions = [
    { label: "Date (Newest)", value: "date_desc" },
    { label: "Date (Oldest)", value: "date_asc" },
    { label: "Most RSVPs", value: "rsvp_desc" },
    { label: "Least RSVPs", value: "rsvp_asc" },
    { label: "A-Z (Title)", value: "title_asc" },
    { label: "Z-A (Title)", value: "title_desc" },
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

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedEvents = filteredEvents.filter((evt) => selectedIds.has(evt.id));
      const items: BulkDeleteItem[] = selectedEvents.map((evt) => ({
        id: evt.id,
        name: evt.title,
        subtitle: `${new Date(evt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} | ${evt.confirmedParents} confirmed`,
      }));
      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleRemoveFromDeleteList = (itemId: string) => {
    setItemsToDelete((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      newIds.delete(itemId);
      return newIds;
    });
  };

  const handleConfirmBulkDelete = (itemIds: string[]) => {
    console.log("Deleting events:", itemIds);
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const handleCloseBulkDeleteModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const handleRestoreItem = (item: BulkDeleteItem) => {
    setItemsToDelete((prev) => [...prev, item]);
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      newIds.add(item.id);
      return newIds;
    });
  };

  const handleRestoreAll = (items: BulkDeleteItem[]) => {
    setItemsToDelete((prev) => [...prev, ...items]);
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      items.forEach((item) => newIds.add(item.id));
      return newIds;
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v && v.length > 0) || dateRange !== null;

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
    setSortOption("date_desc");
    setSelectedIds(new Set());
    setResetKey((prev) => prev + 1);
    setTimeout(() => {
      setDisplayedCount(12);
      setTimeout(() => setIsRefreshing(false), 100);
    }, 300);
  };

  const handleAddEvent = () => {
    router.push("/admin/parents/events/add");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setDisplayedCount(12);
      previousCountRef.current = 12;
    }
  }, [viewMode, isMounted]);

  useEffect(() => {
    if (displayedCount > previousCountRef.current && gridRef.current) {
      const cards = gridRef.current.children;
      const firstNewCardIndex = previousCountRef.current;
      if (cards[firstNewCardIndex]) {
        setTimeout(() => {
          (cards[firstNewCardIndex] as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
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
      rows.forEach((row, idx) => {
        const htmlRow = row as HTMLElement;
        htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${idx / 80}s both`;
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

  // Sort and filter
  const sortedEvents = [...events].sort((a, b) => {
    switch (sortOption) {
      case "date_desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date_asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "rsvp_desc":
        return b.confirmedParents - a.confirmedParents;
      case "rsvp_asc":
        return a.confirmedParents - b.confirmedParents;
      case "title_asc":
        return a.title.localeCompare(b.title);
      case "title_desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const filteredEvents = sortedEvents.filter((evt) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters && !dateRange) return true;

    const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.some((s) => s.toLowerCase() === evt.status);
    const matchesType = !filters.type || filters.type.length === 0 || filters.type.some((t) => t.toLowerCase() === evt.type);
    const matchesAudience = !filters.audience || filters.audience.length === 0 || filters.audience.includes(evt.targetAudience);
    const matchesImportant = !filters.important || filters.important.length === 0 || (filters.important.includes("Important Only") ? evt.isImportant : true);

    let matchesDateRange = true;
    if (dateRange) {
      const evtDate = new Date(evt.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      matchesDateRange = evtDate >= startDate && evtDate <= endDate;
    }

    return matchesStatus && matchesType && matchesAudience && matchesImportant && matchesDateRange;
  });

  const displayedEvents = filteredEvents.slice(0, displayedCount);
  const hasMore = displayedCount < filteredEvents.length;
  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView;

  // Table columns
  const columns: ColumnConfig<AdminEvent>[] = [
    {
      key: "checkbox",
      label: "",
      className: "w-12",
      render: (evt) => (
        <input
          type="checkbox"
          checked={selectedIds.has(evt.id)}
          onChange={(e) => {
            const newSelectedIds = new Set(selectedIds);
            if (e.target.checked) {
              newSelectedIds.add(evt.id);
            } else {
              newSelectedIds.delete(evt.id);
            }
            setSelectedIds(newSelectedIds);
          }}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
    },
    {
      key: "event",
      label: "Event",
      sortable: true,
      render: (evt) => {
        const typeInfo = getEventTypeInfo(evt.type);
        const TypeIcon = typeInfo.icon;
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={evt.image} alt={evt.title} fill className="object-cover" unoptimized />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {evt.isImportant && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{evt.title}</p>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeInfo.bgClass} ${typeInfo.textClass}`}>
                  <TypeIcon className="w-3 h-3" />
                  {typeInfo.label}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (evt) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {new Date(evt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          {evt.time && <p className="text-xs text-gray-500 dark:text-gray-400">{evt.time}</p>}
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (evt) => (
        evt.location ? (
          <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {evt.location}
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
      ),
    },
    {
      key: "audience",
      label: "Audience",
      render: (evt) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {evt.targetAudience}
          {evt.targetClasses && <span className="text-gray-400"> ({evt.targetClasses.length} classes)</span>}
        </span>
      ),
    },
    {
      key: "rsvp",
      label: "RSVPs",
      sortable: true,
      render: (evt) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Tooltip content="Confirmed">
              <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{evt.confirmedParents}</span>
              </span>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content="Pending">
              <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{evt.pendingParents}</span>
              </span>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content="Declined">
              <span className="flex items-center gap-0.5 text-red-600 dark:text-red-400">
                <XCircle className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{evt.declinedParents}</span>
              </span>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (evt) => getStatusBadge(evt.status),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (evt) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip content="View Details">
            <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </Tooltip>
          <Tooltip content="Edit Event">
            <button type="button" className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
              <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          </Tooltip>
          <Tooltip content="Send Reminder">
            <button type="button" className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">
              <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button type="button" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
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
      <PageLoader isLoading={isPageLoading} loadingText="Loading Events" />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title="Parent Events"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: "Parents", href: "/admin/parents" },
              { label: "Events", isActive: true },
            ]}
          />

          <PageActions
            addButtonLabel="Create Event"
            exportDescription="Download events"
            onAdd={handleAddEvent}
            onRefresh={handleRefresh}
            onPrint={() => window.print()}
            onExportPDF={() => console.log("Export PDF")}
            onExportExcel={() => console.log("Export Excel")}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
          <StatCard icon={CalendarDays} label="Total Events" value={stats.total.toString()} color="blue" />
          <StatCard icon={Clock} label="Upcoming" value={stats.upcoming.toString()} color="purple" badge={stats.ongoing > 0 ? `${stats.ongoing} Ongoing` : undefined} />
          <StatCard icon={UserCheck} label="Confirmed" value={stats.totalConfirmed.toString()} color="green" />
          <StatCard icon={AlertCircle} label="Pending RSVPs" value={stats.totalPending.toString()} color={stats.totalPending > 0 ? "amber" : "gray"} />
        </div>

        {/* Filters */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
            <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
              <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />
              <FilterButton fields={filterFields} onFilterChange={handleFilterChange} resetKey={resetKey} />
              {selectedIds.size > 0 && <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />}
              <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{filteredEvents.length} events</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 lg:flex-1">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <SortButton options={sortOptions} defaultOption="date_desc" onSortChange={handleSortChange} resetKey={resetKey} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out" style={{ overflow: "visible" }}>
          <div className="relative min-h-[400px]" style={{ overflow: "visible" }}>
            {viewMode === "list" ? (
              <div key={`list-view-${filterKey}`} className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]">
                {isLoading ? (
                  <PageSpinner message={isSwitchingView ? "Switching view..." : isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."} size="md" />
                ) : filteredEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse flex items-center justify-center">
                        <CalendarDays className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No events found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{hasActiveFilters ? "Try adjusting your filters." : "No events available"}</p>
                    {hasActiveFilters && (
                      <button onClick={handleClearFilters} className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div ref={tableWrapRef} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <DataTable
                      data={filteredEvents}
                      columns={columns}
                      getRowKey={(evt) => evt.id}
                      emptyMessage="No events found"
                      title=""
                      showSearch={false}
                      defaultItemsPerPage={15}
                      itemsPerPageOptions={[10, 15, 25, 50]}
                      enablePagination={true}
                      enableItemsPerPage={true}
                      stickyColumnCount={2}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div key={`grid-view-${filterKey}`} className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]" style={{ overflow: "visible" }}>
                {isLoading ? (
                  <PageSpinner message={isSwitchingView ? "Switching view..." : isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."} size="md" />
                ) : displayedEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse flex items-center justify-center">
                        <CalendarDays className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No events found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{hasActiveFilters ? "Try adjusting your filters." : "No events available"}</p>
                    {hasActiveFilters && (
                      <button onClick={handleClearFilters} className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2" style={{ overflow: "visible" }}>
                      {displayedEvents.map((evt, idx) => (
                        <div key={evt.id} style={{ transition: "opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)", transitionDelay: `${idx / 40}s` }}>
                          <EventCard event={evt} getEventTypeInfo={getEventTypeInfo} getStatusBadge={getStatusBadge} />
                        </div>
                      ))}
                    </div>
                    {hasMore && <LoadMoreButton onClick={handleLoadMore} isLoading={isLoadingMore} text="Load More" loadingText="Loading..." />}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={handleCloseBulkDeleteModal}
          onConfirm={handleConfirmBulkDelete}
          items={itemsToDelete}
          onRemoveItem={handleRemoveFromDeleteList}
          onRestoreItem={handleRestoreItem}
          onRestoreAll={handleRestoreAll}
          title="Delete Events"
          warningMessage="This will permanently remove these events and all associated RSVPs. This action cannot be undone."
          confirmButtonText="Delete Events"
        />
      </div>
    </MainLayout>
  );
}

// Event Card Component
interface EventCardProps {
  event: AdminEvent;
  getEventTypeInfo: (type: EventType) => { label: string; icon: typeof Calendar; bgClass: string; textClass: string };
  getStatusBadge: (status: EventStatus) => React.ReactNode;
}

function EventCard({ event, getEventTypeInfo, getStatusBadge }: EventCardProps) {
  const typeInfo = getEventTypeInfo(event.type);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative h-36 w-full overflow-hidden">
        <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${typeInfo.bgClass} ${typeInfo.textClass} backdrop-blur-sm`}>
            <TypeIcon className="w-3 h-3" />
            {typeInfo.label}
          </span>
          {event.isImportant && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-sm">
              <Star className="w-3 h-3" />
              Important
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">{getStatusBadge(event.status)}</div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base leading-tight mb-1 line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          {event.time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {event.time}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {event.location}
            </span>
          )}
        </div>

        {/* RSVP Stats */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 mb-3">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{event.confirmedParents}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Confirmed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{event.pendingParents}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{event.declinedParents}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Declined</p>
          </div>
        </div>

        {/* Audience */}
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-gray-500 dark:text-gray-400">Target Audience</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{event.targetAudience}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Tooltip content="Send Reminder">
            <button className="p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">
              <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </button>
          </Tooltip>
          <Tooltip content="Edit">
            <button className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
              <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          </Tooltip>
          <Tooltip content="View Details">
            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
