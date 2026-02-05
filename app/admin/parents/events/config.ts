import type { FilterField, SortOption, StatCardConfig, FilterValues } from "@/types/components";
import { AlertCircle, CalendarDays, CheckCircle2, Clock } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export type EventType = "academic" | "sports" | "cultural" | "meeting" | "holiday" | "examination";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface ParentRSVP {
  parentId: string;
  parentName: string;
  parentAvatar?: string;
  status: "confirmed" | "declined" | "pending";
  childrenAttending: string[];
  respondedAt?: string;
}

export interface AdminEvent {
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

// ============================================================================
// Filters / Sort / Search
// ============================================================================

export const adminParentEventFilterFields: FilterField[] = [
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
    options: ["Important Only"],
    width: "half",
  },
];

export const adminParentEventSortOptions: SortOption[] = [
  { id: "date_desc", label: "Date (Newest)" },
  { id: "date_asc", label: "Date (Oldest)" },
  { id: "rsvp_desc", label: "Most RSVPs" },
  { id: "rsvp_asc", label: "Least RSVPs" },
  { id: "title_asc", label: "A-Z (Title)" },
  { id: "title_desc", label: "Z-A (Title)" },
];

export function filterAdminParentEvents(data: AdminEvent[], filters: FilterValues): AdminEvent[] {
  const hasFilters = Object.values(filters).some((v) => Array.isArray(v) && v.length > 0);
  if (!hasFilters) return data;

  return data.filter((evt) => {
    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => s.toLowerCase() === evt.status);

    const matchesType =
      !filters.type ||
      filters.type.length === 0 ||
      filters.type.some((t) => t.toLowerCase() === evt.type);

    const matchesAudience =
      !filters.audience ||
      filters.audience.length === 0 ||
      filters.audience.includes(evt.targetAudience);

    const matchesImportant =
      !filters.important ||
      filters.important.length === 0 ||
      (filters.important.includes("Important Only") ? evt.isImportant : true);

    return matchesStatus && matchesType && matchesAudience && matchesImportant;
  });
}

export function sortAdminParentEvents(data: AdminEvent[], sortOption: string): AdminEvent[] {
  return [...data].sort((a, b) => {
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
}

export function searchAdminParentEvents(data: AdminEvent[], query: string): AdminEvent[] {
  const q = query.trim().toLowerCase();
  if (!q) return data;

  return data.filter((evt) => {
    const fields = [
      evt.title,
      evt.description,
      evt.location ?? "",
      evt.type,
      evt.status,
      evt.targetAudience,
    ];
    return fields.some((v) => v.toLowerCase().includes(q));
  });
}

// ============================================================================
// Stats
// ============================================================================

export const adminParentEventStats: StatCardConfig<AdminEvent>[] = [
  {
    icon: CalendarDays,
    label: "Total Events",
    color: "blue",
    getValue: (data) => data.length.toString(),
  },
  {
    icon: Clock,
    label: "Upcoming",
    color: "purple",
    getValue: (data) => data.filter((e) => e.status === "upcoming").length.toString(),
  },
  {
    icon: CheckCircle2,
    label: "Confirmed",
    color: "green",
    getValue: (data) => data.reduce((acc, e) => acc + e.confirmedParents, 0).toString(),
  },
  {
    icon: AlertCircle,
    label: "Pending RSVPs",
    color: "amber",
    getValue: (data) => data.reduce((acc, e) => acc + e.pendingParents, 0).toString(),
  },
];

