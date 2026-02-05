import { AlertCircle, CheckCircle2, Clock, Ticket } from "lucide-react";
import type { CommunicationRecord } from "@/lib/mockParents";
import type { FilterField, FilterValues, SortOption, StatCardConfig } from "@/types/components";

export type SupportTicket = CommunicationRecord;

export const parentSupportTicketFilterFields: FilterField[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { value: "open", label: "Open" },
      { value: "in_progress", label: "In Progress" },
      { value: "resolved", label: "Resolved" },
      { value: "closed", label: "Closed" },
    ],
    width: "half",
  },
  {
    id: "type",
    label: "Type",
    options: [
      { value: "complaint", label: "Complaint" },
      { value: "inquiry", label: "Inquiry" },
      { value: "feedback", label: "Feedback" },
      { value: "request", label: "Request" },
      { value: "meeting_request", label: "Meeting Request" },
    ],
    width: "half",
  },
  {
    id: "priority",
    label: "Priority",
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
    width: "half",
  },
];

export const parentSupportTicketSortOptions: SortOption[] = [
  { id: "created_desc", label: "Newest" },
  { id: "created_asc", label: "Oldest" },
  { id: "priority_desc", label: "Priority (High → Low)" },
  { id: "priority_asc", label: "Priority (Low → High)" },
  { id: "status", label: "Status" },
];

const priorityRank: Record<SupportTicket["priority"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const statusRank: Record<SupportTicket["status"], number> = {
  open: 1,
  in_progress: 2,
  resolved: 3,
  closed: 4,
};

export function filterParentSupportTickets(
  data: SupportTicket[],
  filters: FilterValues
): SupportTicket[] {
  const status = filters.status ?? [];
  const type = filters.type ?? [];
  const priority = filters.priority ?? [];

  return data.filter((ticket) => {
    const matchesStatus = status.length === 0 || status.includes(ticket.status);
    const matchesType = type.length === 0 || type.includes(ticket.type);
    const matchesPriority = priority.length === 0 || priority.includes(ticket.priority);
    return matchesStatus && matchesType && matchesPriority;
  });
}

export function searchParentSupportTickets(
  data: SupportTicket[],
  query: string
): SupportTicket[] {
  const q = query.trim().toLowerCase();
  if (!q) return data;

  return data.filter((ticket) => {
    return (
      ticket.subject.toLowerCase().includes(q) ||
      ticket.message.toLowerCase().includes(q)
    );
  });
}

export function sortParentSupportTickets(
  data: SupportTicket[],
  sortOption: string
): SupportTicket[] {
  const items = [...data];

  items.sort((a, b) => {
    switch (sortOption) {
      case "created_asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "priority_desc":
        return priorityRank[b.priority] - priorityRank[a.priority];
      case "priority_asc":
        return priorityRank[a.priority] - priorityRank[b.priority];
      case "status":
        return statusRank[a.status] - statusRank[b.status];
      case "created_desc":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return items;
}

export const parentSupportTicketStats: StatCardConfig<SupportTicket>[] = [
  {
    icon: Ticket,
    label: "Total Tickets",
    color: "blue",
    getValue: (data) => data.length.toString(),
  },
  {
    icon: AlertCircle,
    label: "Open",
    color: "amber",
    getValue: (data) => data.filter((t) => t.status === "open").length.toString(),
  },
  {
    icon: Clock,
    label: "In Progress",
    color: "purple",
    getValue: (data) => data.filter((t) => t.status === "in_progress").length.toString(),
  },
  {
    icon: CheckCircle2,
    label: "Resolved",
    color: "green",
    getValue: (data) =>
      data.filter((t) => t.status === "resolved" || t.status === "closed").length.toString(),
  },
];

