"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { DataManagementPage } from "@/components/pages";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";
import FormDropdown from "@/components/shared/FormDropdown";
import {
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  X,
  FileText,
  Send,
  MessageSquare,
  HelpCircle,
  AlertCircle,
  Calendar,
  Loader2,
  Info,
  ArrowRight,
  User,
  PenLine,
  Flag,
} from "lucide-react";
import type { CommunicationRecord } from "@/lib/mockParents";
import type { ColumnConfig, GridCardProps } from "@/types/components";
import {
  type SupportTicket,
  filterParentSupportTickets,
  parentSupportTicketFilterFields,
  parentSupportTicketSortOptions,
  parentSupportTicketStats,
  searchParentSupportTickets,
  sortParentSupportTickets,
} from "./config";

// ============================================
// TYPES
// ============================================

type TicketStatus = CommunicationRecord["status"];
type TicketType = CommunicationRecord["type"];
type TicketPriority = CommunicationRecord["priority"];

interface Child {
  id: string;
  name: string;
  classLevel: string;
  section: string;
  photo: string;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_CHILDREN: Child[] = [
  { id: "child-001", name: "Adaeze Okonkwo", classLevel: "JSS 2", section: "A", photo: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop&crop=face" },
  { id: "child-002", name: "Chukwuemeka Okonkwo", classLevel: "SS 1", section: "B", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
];

// Mock parent ID (in real app, this would come from auth context)
const MOCK_PARENT_ID = "parent-001";

const MOCK_SUPPORT_TICKETS: CommunicationRecord[] = [
  {
    id: "ticket-001",
    parentId: "parent-001",
    type: "complaint",
    subject: "Issue with school bus pickup time",
    message: "Dear Admin, the school bus has been arriving late consistently for the past week, causing my child to miss morning assembly. Please look into this matter.",
    status: "in_progress",
    priority: "high",
    createdAt: "2024-01-15T10:30:00Z",
    assignedTo: "Mr. Adeyemi",
    responses: [
      {
        id: "resp-001",
        from: "admin",
        message: "Thank you for bringing this to our attention. We have notified the transport coordinator and will ensure timely pickups.",
        date: "2024-01-16T09:00:00Z",
      },
    ],
  },
  {
    id: "ticket-002",
    parentId: "parent-001",
    type: "inquiry",
    subject: "Question about exam schedule",
    message: "I would like to know the exact dates for the upcoming mid-term examinations and what topics will be covered.",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-10T14:20:00Z",
    resolvedAt: "2024-01-12T11:00:00Z",
    assignedTo: "Mrs. Okonkwo",
    responses: [
      {
        id: "resp-002",
        from: "admin",
        message: "The mid-term examinations are scheduled for February 5-9, 2024. The syllabus has been shared with all students.",
        date: "2024-01-11T10:00:00Z",
      },
      {
        id: "resp-003",
        from: "parent",
        message: "Thank you for the information. This is very helpful.",
        date: "2024-01-11T15:00:00Z",
      },
      {
        id: "resp-004",
        from: "admin",
        message: "You're welcome! Please don't hesitate to reach out if you have any more questions.",
        date: "2024-01-12T11:00:00Z",
      },
    ],
  },
  {
    id: "ticket-003",
    parentId: "parent-001",
    type: "request",
    subject: "Request for fee payment plan",
    message: "I would like to request an installment payment plan for the second term fees due to financial constraints.",
    status: "open",
    priority: "high",
    createdAt: "2024-01-18T08:45:00Z",
    responses: [],
  },
  {
    id: "ticket-004",
    parentId: "parent-001",
    type: "feedback",
    subject: "Feedback on new teaching methods",
    message: "I wanted to commend the new interactive teaching methods being used. My child has shown significant improvement in understanding concepts.",
    status: "closed",
    priority: "low",
    createdAt: "2024-01-05T16:30:00Z",
    resolvedAt: "2024-01-07T09:00:00Z",
    assignedTo: "Mrs. Bakare",
    responses: [
      {
        id: "resp-005",
        from: "admin",
        message: "Thank you for your positive feedback! We are glad to hear about the improvement. Your feedback has been shared with the teaching staff.",
        date: "2024-01-06T10:00:00Z",
      },
    ],
  },
  {
    id: "ticket-005",
    parentId: "parent-001",
    type: "meeting_request",
    subject: "Meeting request with class teacher",
    message: "I would like to schedule a meeting with my child's class teacher to discuss their academic progress and areas for improvement.",
    status: "in_progress",
    priority: "medium",
    createdAt: "2024-01-20T11:15:00Z",
    assignedTo: "Mr. Johnson",
    responses: [
      {
        id: "resp-006",
        from: "admin",
        message: "Your meeting request has been noted. The class teacher will contact you to schedule a convenient time.",
        date: "2024-01-20T14:00:00Z",
      },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function getStatusConfig(status: TicketStatus) {
  switch (status) {
    case "open":
      return {
        label: "Open",
        icon: AlertCircle,
        bg: "bg-amber-50 dark:bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        dot: "bg-amber-500",
        border: "border-amber-200 dark:border-amber-500/20",
        accent: "amber",
      };
    case "in_progress":
      return {
        label: "In Progress",
        icon: Loader2,
        bg: "bg-blue-50 dark:bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
        dot: "bg-blue-500",
        border: "border-blue-200 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/20",
        accent: "blue",
      };
    case "resolved":
      return {
        label: "Resolved",
        icon: CheckCircle2,
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
        dot: "bg-emerald-500",
        border: "border-emerald-200 dark:border-emerald-500/20",
        accent: "emerald",
      };
    case "closed":
      return {
        label: "Closed",
        icon: XCircle,
        bg: "bg-slate-50 dark:bg-slate-500/10",
        text: "text-slate-600 dark:text-slate-400",
        dot: "bg-slate-500",
        border: "border-slate-200 dark:border-slate-500/20",
        accent: "slate",
      };
  }
}

function getTypeConfig(type: TicketType) {
  switch (type) {
    case "complaint":
      return { icon: AlertTriangle, bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", label: "Complaint" };
    case "inquiry":
      return { icon: HelpCircle, bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400", label: "Inquiry" };
    case "feedback":
      return { icon: MessageSquare, bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", label: "Feedback" };
    case "request":
      return { icon: FileText, bg: "bg-cyan-50 dark:bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", label: "Request" };
    case "meeting_request":
      return { icon: Calendar, bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: "Meeting Request" };
    default:
      return { icon: FileText, bg: "bg-gray-50 dark:bg-gray-500/10", text: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300", label: "Other" };
  }
}

function getPriorityConfig(priority: TicketPriority) {
  switch (priority) {
    case "high":
      return { label: "High", bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400", dot: "bg-red-500" };
    case "medium":
      return { label: "Medium", bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400", dot: "bg-amber-500" };
    case "low":
      return { label: "Low", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" };
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ParentSupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<CommunicationRecord | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState<CommunicationRecord[]>(MOCK_SUPPORT_TICKETS);

  // Handle new ticket submission
  const handleAddTicket = (newTicket: CommunicationRecord) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const columns: ColumnConfig<SupportTicket>[] = useMemo(() => {
    return [
      {
        key: "subject",
        label: "Subject",
        sortable: true,
        sortValue: (t) => t.subject,
        render: (t) => {
          const type = getTypeConfig(t.type);
          return (
            <button
              type="button"
              onClick={() => setSelectedTicket(t)}
              className="text-left group"
            >
              <div className="flex items-start gap-2">
                <div className={`mt-0.5 p-1.5 rounded-lg ${type.bg}`}>
                  <type.icon className={`w-4 h-4 ${type.text}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors truncate">
                    {t.subject}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 line-clamp-2 mt-0.5">
                    {t.message}
                  </div>
                </div>
              </div>
            </button>
          );
        },
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        sortValue: (t) => t.status,
        render: (t) => {
          const status = getStatusConfig(t.status);
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          );
        },
      },
      {
        key: "priority",
        label: "Priority",
        sortable: true,
        sortValue: (t) => t.priority,
        render: (t) => {
          const priority = getPriorityConfig(t.priority);
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${priority.bg} ${priority.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
          );
        },
      },
      {
        key: "createdAt",
        label: "Created",
        sortable: true,
        sortValue: (t) => new Date(t.createdAt).getTime(),
        render: (t) => (
          <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            {new Date(t.createdAt).toLocaleDateString()}
          </span>
        ),
      },
    ];
  }, []);

  const TicketGridCard = useMemo(() => {
    return function TicketGridCardInner({ item }: GridCardProps<SupportTicket>) {
      return <TicketCard ticket={item} onClick={() => setSelectedTicket(item)} />;
    };
  }, []);

  return (
    <DataManagementPage<SupportTicket>
      title="Support Tickets"
      breadcrumbs={[
        { label: "Parent Portal", href: "/parents" },
        { label: "Support" },
      ]}
      data={tickets}
      getRowKey={(ticket) => ticket.id}
      columns={columns}
      stats={parentSupportTicketStats}
      filterFields={parentSupportTicketFilterFields}
      filterFn={filterParentSupportTickets}
      sortOptions={parentSupportTicketSortOptions}
      sortFn={sortParentSupportTickets}
      defaultSort="created_desc"
      searchFn={searchParentSupportTickets}
      searchPlaceholder="Search by subject or message..."
      enableViewToggle
      defaultViewMode="grid"
      gridCardComponent={TicketGridCard}
      gridColumns={{ sm: 1, md: 2, lg: 2, xl: 2 }}
      addButtonConfig={{ label: "Create Ticket", onClick: () => setShowCreateModal(true) }}
      beforeContent={
        <div className="mb-4 bg-gradient-to-br from-cyan-50/80 via-blue-50/80 to-indigo-50/80 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-xl rounded-2xl border border-cyan-200/50 dark:border-cyan-800/30 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-xl bg-white/80 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 shadow-sm shrink-0">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">Support Guidelines</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 leading-relaxed">
                Our support team typically responds within 24-48 hours. For urgent matters, please mark your ticket as
                high priority. You can track the status of your tickets here.
              </p>
            </div>
          </div>
        </div>
      }
      itemLabel="ticket"
      itemLabelPlural="tickets"
      emptyStateConfig={{
        icon: Ticket,
        title: "No tickets found",
        description: "Try adjusting your filters or create a new support ticket.",
        actionLabel: "Create Ticket",
        onAction: () => setShowCreateModal(true),
      }}
    >
      {selectedTicket && (
        <ViewTicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleAddTicket}
        />
      )}
    </DataManagementPage>
  );
}

// ============================================
// TICKET CARD COMPONENT
// ============================================

function TicketCard({ ticket, onClick }: { ticket: CommunicationRecord; onClick: () => void }) {
  const status = getStatusConfig(ticket.status);
  const type = getTypeConfig(ticket.type);
  const priority = getPriorityConfig(ticket.priority);
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  // Status-based subtle styling
  const statusStyles = {
    open: {
      card: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/90 midnight:bg-[#0a0e27]/90 purple:bg-[#1a0b2e]/90 border-gray-100/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30 hover:border-amber-200/60 dark:hover:border-amber-500/20",
      accent: "from-amber-500/[0.03] to-transparent",
      indicator: "bg-amber-500",
      glow: "group-hover:shadow-amber-500/5",
    },
    in_progress: {
      card: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/90 midnight:bg-[#0a0e27]/90 purple:bg-[#1a0b2e]/90 border-gray-100/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30 hover:border-blue-200/60 dark:hover:border-blue-500/20",
      accent: "from-blue-500/[0.03] to-transparent",
      indicator: "bg-blue-500",
      glow: "group-hover:shadow-blue-500/5",
    },
    resolved: {
      card: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/90 midnight:bg-[#0a0e27]/90 purple:bg-[#1a0b2e]/90 border-gray-100/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30 hover:border-emerald-200/60 dark:hover:border-emerald-500/20",
      accent: "from-emerald-500/[0.03] to-transparent",
      indicator: "bg-emerald-500",
      glow: "group-hover:shadow-emerald-500/5",
    },
    closed: {
      card: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/90 midnight:bg-[#0a0e27]/90 purple:bg-[#1a0b2e]/90 border-gray-100/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30 hover:border-slate-200/60 dark:hover:border-slate-500/20",
      accent: "from-slate-500/[0.03] to-transparent",
      indicator: "bg-slate-500",
      glow: "group-hover:shadow-slate-500/5",
    },
  };

  const currentStyle = statusStyles[ticket.status];

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 overflow-hidden ${currentStyle.card} ${currentStyle.glow}`}
    >
      {/* Subtle gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentStyle.accent} pointer-events-none`} />

      {/* Status indicator line */}
      <div className={`absolute top-4 bottom-4 left-0 w-[3px] ${currentStyle.indicator} rounded-r-full opacity-80`} />

      {/* Content */}
      <div className="relative pl-2">
        {/* Top Row - Type & Status */}
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Type Badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${type.bg}`}>
            <TypeIcon className={`w-3.5 h-3.5 ${type.text}`} />
            <span className={`text-[11px] font-medium ${type.text}`}>{type.label}</span>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${status.bg}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${status.text} ${ticket.status === "in_progress" ? "animate-spin" : ""}`} />
            <span className={`text-[11px] font-semibold ${status.text}`}>{status.label}</span>
          </div>
        </div>

        {/* Subject/Title */}
        <h3 className="text-sm sm:text-[15px] font-semibold text-gray-800 dark:text-gray-100 midnight:text-gray-100 purple:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors leading-relaxed">
          {ticket.subject}
        </h3>

        {/* Message Preview */}
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 line-clamp-2 mb-3">
          {ticket.message}
        </p>

        {/* Priority & Responses */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${priority.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            <span className={`text-[10px] font-medium ${priority.text}`}>{priority.label}</span>
          </div>
          {ticket.responses.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50">
              <MessageSquare className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{ticket.responses.length} response{ticket.responses.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {/* Date Information */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50/80 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/40 midnight:bg-[#0f1330]/40 purple:bg-[#251340]/40">
          {/* Created Date */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-sm flex items-center justify-center">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">
                {formatShortDate(ticket.createdAt)}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">
                Created
              </p>
            </div>
          </div>

          {/* Assigned To */}
          {ticket.assignedTo && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-wider font-medium">Assigned</p>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">{ticket.assignedTo}</p>
            </div>
          )}
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
        </div>
      </div>
    </button>
  );
}

// ============================================
// VIEW TICKET MODAL
// ============================================

function ViewTicketModal({
  ticket,
  onClose,
}: {
  ticket: CommunicationRecord;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const status = getStatusConfig(ticket.status);
  const type = getTypeConfig(ticket.type);
  const priority = getPriorityConfig(ticket.priority);
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="relative px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Ticket Details</h2>
                <p className="text-xs text-white/70">{ticket.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/20 transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${type.bg}`}>
              <TypeIcon className={`w-4 h-4 ${type.text}`} />
              <span className={`text-xs font-semibold ${type.text}`}>{type.label}</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${status.bg}`}>
              <StatusIcon className={`w-4 h-4 ${status.text}`} />
              <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${priority.bg}`}>
              <Flag className={`w-3.5 h-3.5 ${priority.text}`} />
              <span className={`text-xs font-semibold ${priority.text}`}>{priority.label} Priority</span>
            </div>
          </div>

          {/* Subject */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">{ticket.subject}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 leading-relaxed">{ticket.message}</p>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/40 midnight:bg-[#0a0e27]/40 purple:bg-[#1a0b2e]/40">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">Created</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">{formatDate(ticket.createdAt)}</p>
            </div>
            {ticket.assignedTo && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/40 midnight:bg-[#0a0e27]/40 purple:bg-[#1a0b2e]/40">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">Assigned To</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">{ticket.assignedTo}</p>
              </div>
            )}
            {ticket.resolvedAt && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-medium mb-1">Resolved</p>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{formatDate(ticket.resolvedAt)}</p>
              </div>
            )}
          </div>

          {/* Responses */}
          {ticket.responses.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Conversation ({ticket.responses.length})
              </h4>
              <div className="space-y-3">
                {ticket.responses.map((response) => (
                  <div
                    key={response.id}
                    className={`p-4 rounded-xl ${
                      response.from === "admin"
                        ? "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-100 dark:border-blue-800/30"
                        : "bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/40 midnight:bg-[#0a0e27]/40 purple:bg-[#1a0b2e]/40 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        response.from === "admin" ? "bg-blue-500" : "bg-gray-500"
                      }`}>
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className={`text-xs font-semibold ${
                        response.from === "admin" ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300" : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                      }`}>
                        {response.from === "admin" ? "School Admin" : "You"}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-auto">{formatDate(response.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 leading-relaxed">{response.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] hover:bg-gray-300 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// CREATE TICKET MODAL
// ============================================

function CreateTicketModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (ticket: CommunicationRecord) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState("");
  const [ticketType, setTicketType] = useState<TicketType>("inquiry");
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>("medium");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && !isSubmitting) onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, isSubmitting]);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    const newTicket: CommunicationRecord = {
      id: `ticket-${Date.now()}`,
      parentId: MOCK_PARENT_ID,
      type: ticketType,
      subject: subject.trim(),
      message: message.trim(),
      status: "open",
      priority: ticketPriority,
      createdAt: new Date().toISOString(),
      responses: [],
    };

    onSubmit(newTicket);
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(onClose, 2000);
  };

  const typeOptions = [
    { value: "inquiry", label: "Inquiry" },
    { value: "complaint", label: "Complaint" },
    { value: "feedback", label: "Feedback" },
    { value: "request", label: "Request" },
    { value: "meeting_request", label: "Meeting Request" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !isSubmitting && onClose()}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="relative px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Create Support Ticket</h2>
            </div>
            <button onClick={onClose} disabled={isSubmitting} className="p-2 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">Ticket Created!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Your support ticket has been submitted successfully.</p>
            </div>
          ) : (
            <>
              {/* Subject */}
              <FormInput
                label="Subject"
                icon={<PenLine className="w-full h-full" />}
                value={subject}
                onChange={setSubject}
                placeholder="Brief description of your issue"
                required
              />

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <FormDropdown
                  label="Type"
                  icon={<FileText className="w-full h-full" />}
                  value={ticketType}
                  onChange={(val) => setTicketType(val as TicketType)}
                  options={typeOptions}
                  required
                />
                <FormDropdown
                  label="Priority"
                  icon={<Flag className="w-full h-full" />}
                  value={ticketPriority}
                  onChange={(val) => setTicketPriority(val as TicketPriority)}
                  options={priorityOptions}
                  required
                />
              </div>

              {/* Message */}
              <FormTextarea
                label="Message"
                icon={<MessageSquare className="w-full h-full" />}
                value={message}
                onChange={setMessage}
                placeholder="Please describe your issue or request in detail..."
                rows={4}
                required
              />

              {/* Preview Card */}
              {(subject.trim() || message.trim()) && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/40 midnight:bg-[#0a0e27]/40 purple:bg-[#1a0b2e]/40 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">Preview</p>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${getTypeConfig(ticketType).bg}`}>
                      <span className={`text-[10px] font-medium ${getTypeConfig(ticketType).text}`}>{typeOptions.find(o => o.value === ticketType)?.label}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${getPriorityConfig(ticketPriority).bg}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getPriorityConfig(ticketPriority).dot}`} />
                      <span className={`text-[10px] font-medium ${getPriorityConfig(ticketPriority).text}`}>{priorityOptions.find(o => o.value === ticketPriority)?.label}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">Open</span>
                    </div>
                  </div>
                  {subject.trim() && (
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-1">{subject}</h4>
                  )}
                  {message.trim() && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 line-clamp-2">{message}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50 flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] hover:bg-gray-300 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!subject.trim() || !message.trim() || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
