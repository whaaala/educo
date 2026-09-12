import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import { CalendarDays, Star, Tag, Users } from "lucide-react";

export type EventType = "academic" | "sports" | "cultural" | "meeting" | "holiday" | "examination";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface SchoolEvent {
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
  isImportant?: boolean;
  childId?: string;
  childName?: string;
  classLevel?: string;
}

export const eventSortOptions: SortOption[] = [
  { id: "date_soon", label: "Date (Soonest)" },
  { id: "date_late", label: "Date (Latest)" },
  { id: "important", label: "Important First" },
  { id: "type", label: "Type" },
  { id: "status", label: "Status" },
  { id: "title", label: "Title (A-Z)" },
];

export function getEventFilterFields(data: SchoolEvent[]): FilterField[] {
  const childOptions = Array.from(
    new Map(
      data
        .filter((e) => e.childId && e.childName)
        .map((e) => [e.childId!, { value: e.childId!, label: e.childName! }])
    ).values()
  );

  return [
    {
      id: "childId",
      label: "Child",
      options: childOptions.length > 0 ? childOptions : [{ value: "all", label: "All Children" }],
      width: "half",
    },
    {
      id: "type",
      label: "Type",
      options: ["academic", "sports", "cultural", "meeting", "holiday", "examination"],
      width: "half",
    },
    {
      id: "status",
      label: "Status",
      options: ["upcoming", "ongoing", "completed", "cancelled"],
      width: "half",
    },
    {
      id: "important",
      label: "Important",
      options: [{ value: "true", label: "Important only" }],
      width: "half",
    },
  ];
}

export const filterEvents = (
  data: SchoolEvent[],
  filters: Record<string, string[]>
): SchoolEvent[] => {
  return data.filter((event) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const matchesChild =
      !filters.childId ||
      filters.childId.length === 0 ||
      (event.childId ? filters.childId.includes(event.childId) : true);

    const matchesType =
      !filters.type || filters.type.length === 0 || filters.type.includes(event.type);

    const matchesStatus =
      !filters.status || filters.status.length === 0 || filters.status.includes(event.status);

    const matchesImportant =
      !filters.important ||
      filters.important.length === 0 ||
      (filters.important.includes("true") ? !!event.isImportant : true);

    return matchesChild && matchesType && matchesStatus && matchesImportant;
  });
};

export const sortEvents = (data: SchoolEvent[], sortOption: string): SchoolEvent[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "date_soon":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date_late":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "important":
        return Number(!!b.isImportant) - Number(!!a.isImportant);
      case "type":
        return a.type.localeCompare(b.type);
      case "status":
        return a.status.localeCompare(b.status);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};

export const searchEvents = (data: SchoolEvent[], query: string): SchoolEvent[] => {
  const q = query.toLowerCase();
  return data.filter(
    (event) =>
      event.title.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      (event.childName ? event.childName.toLowerCase().includes(q) : false) ||
      (event.location ? event.location.toLowerCase().includes(q) : false)
  );
};

export const getEventStats = (): StatCardConfig<SchoolEvent>[] => [
  {
    icon: CalendarDays,
    label: "Total",
    color: "blue",
    getValue: (data) => data.length.toString(),
  },
  {
    icon: Users,
    label: "Upcoming",
    color: "green",
    getValue: (data) =>
      data.filter((e) => e.status === "upcoming" || e.status === "ongoing").length.toString(),
  },
  {
    icon: Star,
    label: "Important",
    color: "red",
    getValue: (data) => data.filter((e) => !!e.isImportant).length.toString(),
  },
  {
    icon: Tag,
    label: "Types",
    color: "purple",
    getValue: (data) => new Set(data.map((e) => e.type)).size.toString(),
  },
];

