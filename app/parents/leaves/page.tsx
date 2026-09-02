"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DataManagementPage } from "@/components/pages";
import type { ColumnConfig } from "@/types/components";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";
import ChildLeaveRequestDetailsModal, { LeaveHistoryEntry } from "@/components/shared/ChildLeaveRequestDetailsModal";
import {
  CalendarDays,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  X,
  FileText,
  Send,
  Stethoscope,
  Heart,
  Briefcase,
  Church,
  Trophy,
  Info,
  PenLine,
} from "lucide-react";
import {
  type Child,
  type ChildLeaveRequest,
  type LeaveStatus,
  type LeaveType,
  getLeaveFilterFields,
  getLeaveStats,
  leaveSortOptions,
  filterLeaves,
  sortLeaves,
  searchLeaves,
} from "./config";

// ============================================
// TYPES
// ============================================

// (Moved to ./config.ts)

// ============================================
// MOCK DATA
// ============================================

const MOCK_CHILDREN: Child[] = [
  { id: "child-001", name: "Adaeze Okonkwo", classLevel: "JSS 2", section: "A", photo: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop&crop=face" },
  { id: "child-002", name: "Chukwuemeka Okonkwo", classLevel: "SS 1", section: "B", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
];

const MOCK_LEAVE_REQUESTS: ChildLeaveRequest[] = [
  {
    id: "leave-001",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop&crop=face",
    classLevel: "JSS 2",
    reason: "Medical Appointment - Regular checkup with pediatrician",
    leaveType: "Medical",
    fromDate: "2024-01-15",
    toDate: "2024-01-17",
    days: 3,
    status: "approved",
    appliedDate: "2024-01-10",
    approvedBy: "Mrs. Nkechi Eze",
    approvedDate: "2024-01-11",
  },
  {
    id: "leave-002",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    classLevel: "SS 1",
    reason: "Family Event - Cousin's wedding ceremony",
    leaveType: "Family",
    fromDate: "2024-01-22",
    toDate: "2024-01-22",
    days: 1,
    status: "pending",
    appliedDate: "2024-01-18",
  },
  {
    id: "leave-003",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop&crop=face",
    classLevel: "JSS 2",
    reason: "Travel - Family trip to hometown",
    leaveType: "Personal",
    fromDate: "2024-01-08",
    toDate: "2024-01-09",
    days: 2,
    status: "declined",
    appliedDate: "2024-01-05",
    remarks: "Leave period conflicts with mid-term examinations",
  },
  {
    id: "leave-004",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    classLevel: "SS 1",
    reason: "Medical Emergency - Dental surgery",
    leaveType: "Medical",
    fromDate: "2024-02-05",
    toDate: "2024-02-07",
    days: 3,
    status: "approved",
    appliedDate: "2024-02-01",
    approvedBy: "Mr. Okoro James",
    approvedDate: "2024-02-02",
  },
  {
    id: "leave-005",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop&crop=face",
    classLevel: "JSS 2",
    reason: "Religious Observance - Cultural festival",
    leaveType: "Religious",
    fromDate: "2024-02-12",
    toDate: "2024-02-12",
    days: 1,
    status: "approved",
    appliedDate: "2024-02-08",
    approvedBy: "Mrs. Nkechi Eze",
    approvedDate: "2024-02-09",
  },
  {
    id: "leave-006",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    classLevel: "SS 1",
    reason: "Sports Competition - Inter-school football tournament",
    leaveType: "Sports",
    fromDate: "2024-02-20",
    toDate: "2024-02-22",
    days: 3,
    status: "pending",
    appliedDate: "2024-02-15",
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

function getStatusConfig(status: LeaveStatus) {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        icon: CheckCircle2,
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-500/20",
        accent: "emerald",
      };
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        bg: "bg-amber-50 dark:bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        border: "border-amber-200 dark:border-amber-500/20",
        accent: "amber",
      };
    case "declined":
      return {
        label: "Declined",
        icon: XCircle,
        bg: "bg-rose-50 dark:bg-rose-500/10",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-500/20",
        accent: "rose",
      };
  }
}

function getLeaveTypeConfig(type: LeaveType | string) {
  switch (type) {
    case "Medical":
      return { icon: Stethoscope, bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400", color: "blue" };
    case "Family":
      return { icon: Heart, bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", color: "pink" };
    case "Personal":
      return { icon: Briefcase, bg: "bg-slate-50 dark:bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", color: "slate" };
    case "Religious":
      return { icon: Church, bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", color: "violet" };
    case "Sports":
      return { icon: Trophy, bg: "bg-teal-50 dark:bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", color: "teal" };
    case "Other":
      return { icon: PenLine, bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", color: "orange" };
    default:
      return { icon: FileText, bg: "bg-gray-50 dark:bg-gray-500/10", text: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300", color: "gray" };
  }
}

function calculateDays(from: string, to: string): number {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function generateLeaveHistory(leave: ChildLeaveRequest): LeaveHistoryEntry[] {
  const history: LeaveHistoryEntry[] = [
    {
      id: "1",
      action: "submitted",
      timestamp: leave.appliedDate || new Date().toISOString(),
      by: "Parent",
      notes: `Leave request submitted for ${leave.childName} (${leave.leaveType} - ${leave.days} day${leave.days === 1 ? '' : 's'})`,
    },
  ];

  if (leave.status === "approved" && leave.approvedBy) {
    history.push({
      id: "2",
      action: "approved",
      timestamp: leave.approvedDate || new Date().toISOString(),
      by: leave.approvedBy,
      notes: "Leave request has been approved. Student is excused from classes during the specified period.",
    });
  }

  if (leave.status === "declined") {
    history.push({
      id: "2",
      action: "rejected",
      timestamp: leave.approvedDate || new Date().toISOString(),
      by: leave.approvedBy || "School Administration",
      notes: leave.remarks || "Leave request was declined.",
    });
  }

  return history;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ParentLeavesPage() {
  const [selectedLeave, setSelectedLeave] = useState<ChildLeaveRequest | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<ChildLeaveRequest[]>(MOCK_LEAVE_REQUESTS);

  // Handle new leave submission
  const handleAddLeave = (newLeave: ChildLeaveRequest) => {
    setLeaveRequests((prev) => [newLeave, ...prev]);
  };

  const filterFields = useMemo(() => getLeaveFilterFields(MOCK_CHILDREN), []);
  const columns: ColumnConfig<ChildLeaveRequest>[] = useMemo(
    () => [
      {
        key: "childName",
        label: "Child",
        sortable: true,
        sortValue: (l) => l.childName,
        render: (leave) => (
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leave.childPhoto || "https://i.pravatar.cc/100?u=" + leave.childId}
                alt={leave.childName}
                className="w-9 h-9 object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink truncate">
                {leave.childName}
              </div>
              <div className="text-xs text-muted truncate">
                {leave.classLevel}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "leaveType",
        label: "Type",
        sortable: true,
        sortValue: (l) => l.leaveType,
        render: (leave) => {
          const cfg = getLeaveTypeConfig(leave.leaveType);
          const Icon = cfg.icon;
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
              <Icon className="w-3.5 h-3.5" />
              {leave.leaveType}
            </span>
          );
        },
      },
      {
        key: "dates",
        label: "Dates",
        sortable: true,
        sortValue: (l) => new Date(l.fromDate).getTime(),
        render: (leave) => (
          <div className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
            <div className="font-medium">{formatShortDate(leave.fromDate)} → {formatShortDate(leave.toDate)}</div>
            <div className="text-xs text-muted">
              Applied: {formatShortDate(leave.appliedDate)}
            </div>
          </div>
        ),
      },
      {
        key: "days",
        label: "Days",
        sortable: true,
        sortValue: (l) => l.days,
        render: (leave) => (
          <span className="text-sm font-semibold text-ink">
            {leave.days}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        sortValue: (l) => l.status,
        render: (leave) => {
          const cfg = getStatusConfig(leave.status);
          const Icon = cfg.icon;
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
              <Icon className="w-3.5 h-3.5" />
              {cfg.label}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: "Action",
        sortable: false,
        searchable: false,
        className: "text-right",
        render: (leave) => (
          <button
            type="button"
            onClick={() => setSelectedLeave(leave)}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 text-xs font-semibold"
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  return (
    <DataManagementPage
      title="Child Leave Requests"
      breadcrumbs={[
        { label: "Parent Portal", href: "/parents" },
        { label: "Leaves", isActive: true },
      ]}
      data={leaveRequests}
      getRowKey={(leave) => leave.id}
      columns={columns}
      stats={getLeaveStats()}
      filterFields={filterFields}
      sortOptions={leaveSortOptions}
      defaultSort="applied_newest"
      filterFn={filterLeaves}
      sortFn={sortLeaves}
      searchFn={searchLeaves}
      searchPlaceholder="Search by child name, reason, type..."
      itemLabel="leave request"
      itemLabelPlural="leave requests"
      enableSelection={false}
      enableExport={false}
      enableViewToggle={false}
      emptyStateConfig={{
        title: "No leave requests found",
        description: "Try adjusting your search or filters, or submit a new leave request.",
        icon: CalendarDays,
      }}
      addButtonConfig={{
        label: "Apply for Leave",
        onClick: () => setShowApplyModal(true),
      }}
    >
      {/* Guidelines */}
      <div className="mt-6 bg-gradient-to-br from-cyan-50/80 via-blue-50/80 to-indigo-50/80 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-xl rounded-2xl border border-cyan-200/50 dark:border-cyan-800/30 p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-xl bg-white/80 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80 shadow-sm shrink-0">
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink mb-1">Leave Request Guidelines</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 leading-relaxed">
              Submit leave requests at least 3 days in advance. Medical emergencies can be submitted anytime with supporting documents.
            </p>
          </div>
        </div>
      </div>

      {/* View Leave Modal */}
      {selectedLeave && (
        <ChildLeaveRequestDetailsModal
          leave={{
            id: selectedLeave.id,
            childId: selectedLeave.childId,
            childName: selectedLeave.childName,
            childPhoto: selectedLeave.childPhoto,
            classLevel: selectedLeave.classLevel,
            leaveType: selectedLeave.leaveType,
            fromDate: selectedLeave.fromDate,
            toDate: selectedLeave.toDate,
            days: selectedLeave.days,
            reason: selectedLeave.reason,
            status: selectedLeave.status,
            appliedDate: selectedLeave.appliedDate,
            approvedBy: selectedLeave.approvedBy,
            approvedDate: selectedLeave.approvedDate,
            remarks: selectedLeave.remarks,
            documents: selectedLeave.documents,
          }}
          onClose={() => setSelectedLeave(null)}
          isAdmin={false}
          history={generateLeaveHistory(selectedLeave)}
        />
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <ApplyLeaveModal
          children={MOCK_CHILDREN}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleAddLeave}
        />
      )}
    </DataManagementPage>
  );
}


// ============================================
// APPLY LEAVE MODAL
// ============================================

function ApplyLeaveModal({
  children,
  onClose,
  onSubmit,
}: {
  children: Child[];
  onClose: () => void;
  onSubmit: (leave: ChildLeaveRequest) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || "");
  const [leaveType, setLeaveType] = useState<LeaveType>("Medical");
  const [customLeaveType, setCustomLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const days = fromDate && toDate ? calculateDays(fromDate, toDate) : 0;

  // Validation: if "Other" is selected, require custom type
  const isLeaveTypeValid = leaveType !== "Other" || customLeaveType.trim().length > 0;

  // Get selected child info
  const selectedChild = children.find((c) => c.id === selectedChildId);

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
    if (!selectedChildId || !leaveType || !fromDate || !toDate || !reason || !isLeaveTypeValid || !selectedChild) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    // Create new leave request with pending status
    const newLeave: ChildLeaveRequest = {
      id: `leave-${Date.now()}`,
      childId: selectedChildId,
      childName: selectedChild.name,
      childPhoto: selectedChild.photo,
      classLevel: selectedChild.classLevel,
      reason: reason,
      leaveType: leaveType === "Other" ? customLeaveType as LeaveType : leaveType,
      fromDate: fromDate,
      toDate: toDate,
      days: days,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    onSubmit(newLeave);
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(onClose, 2000);
  };

  const leaveTypes: { type: LeaveType; icon: React.ElementType }[] = [
    { type: "Medical", icon: Stethoscope },
    { type: "Family", icon: Heart },
    { type: "Personal", icon: Briefcase },
    { type: "Religious", icon: Church },
    { type: "Sports", icon: Trophy },
    { type: "Other", icon: PenLine },
  ];

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !isSubmitting && onClose()}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="relative px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <CalendarCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Apply for Leave</h2>
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
              <h3 className="text-lg font-bold text-ink mb-2">Leave Request Submitted!</h3>
              <p className="text-sm text-muted">Your request has been sent for approval.</p>
            </div>
          ) : (
            <>
              {/* Select Child */}
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Select Child</label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        selectedChildId === child.id
                          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10"
                          : "border-line hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                        {child.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-ink">{child.name}</p>
                        <p className="text-xs text-gray-500">{child.classLevel}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Leave Type</label>
                <div className="flex flex-wrap gap-2">
                  {leaveTypes.map(({ type, icon: Icon }) => {
                    const config = getLeaveTypeConfig(type);
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setLeaveType(type);
                          if (type !== "Other") setCustomLeaveType("");
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                          leaveType === type
                            ? `border-${config.color}-500 ${config.bg} ${config.text}`
                            : "border-line text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Leave Type Input */}
                {leaveType === "Other" && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customLeaveType}
                      onChange={(e) => setCustomLeaveType(e.target.value)}
                      placeholder="Enter custom leave type (e.g., Bereavement, Cultural Event)"
                      className="w-full px-4 py-2.5 rounded-xl border border-orange-200 dark:border-orange-700/50 bg-orange-50/50 dark:bg-orange-900/10 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                    {!customLeaveType.trim() && (
                      <p className="mt-1.5 text-xs text-orange-600 dark:text-orange-400">Please specify the leave type</p>
                    )}
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="From Date"
                  icon={<Calendar className="w-full h-full" />}
                  type="date"
                  value={fromDate}
                  onChange={setFromDate}
                  placeholder="Select date"
                />
                <FormInput
                  label="To Date"
                  icon={<Calendar className="w-full h-full" />}
                  type="date"
                  value={toDate}
                  onChange={setToDate}
                  placeholder="Select date"
                />
              </div>

              {/* Duration Display */}
              {days > 0 && (
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 text-center">
                  <p className="text-xs text-cyan-600 dark:text-cyan-400">Total Duration</p>
                  <p className="text-xl font-bold text-cyan-700 dark:text-cyan-300">{days} {days === 1 ? "Day" : "Days"}</p>
                </div>
              )}

              {/* Reason */}
              <FormTextarea
                label="Reason for Leave"
                icon={<FileText className="w-full h-full" />}
                value={reason}
                onChange={setReason}
                placeholder="Please provide a detailed reason for the leave request..."
                rows={3}
                required
              />
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] hover:bg-gray-300 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedChildId || !leaveType || !fromDate || !toDate || !reason || !isLeaveTypeValid || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
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
