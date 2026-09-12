"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  FileText,
  MessageSquare,
  History,
  Send,
  Stethoscope,
  Heart,
  Briefcase,
  Church,
  Trophy,
  PenLine,
  GraduationCap,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

export type LeaveStatus = "approved" | "pending" | "rejected" | "declined";
export type LeaveType = "Medical" | "Family" | "Personal" | "Religious" | "Sports" | "Other" | "sick" | "family_emergency" | "vacation" | "religious" | "other";

export interface ChildLeaveRequest {
  id: string;
  parentId?: string;
  childId: string;
  childName: string;
  childClass?: string;
  classLevel?: string;
  childPhoto?: string;
  leaveType: LeaveType;
  startDate?: string;
  endDate?: string;
  fromDate?: string;
  toDate?: string;
  days?: number;
  reason: string;
  status: LeaveStatus;
  requestedAt?: string;
  appliedDate?: string;
  processedAt?: string;
  processedBy?: string;
  approvedBy?: string;
  approvedDate?: string;
  adminNotes?: string;
  remarks?: string;
  documents?: string[];
}

export interface LeaveHistoryEntry {
  id: string;
  action: "submitted" | "approved" | "rejected" | "cancelled";
  timestamp: string;
  by: string;
  notes?: string;
}

interface ChildLeaveRequestDetailsModalProps {
  leave: ChildLeaveRequest;
  onClose: () => void;
  onApprove?: (leaveId: string, notes?: string) => void;
  onReject?: (leaveId: string, reason: string) => void;
  isAdmin?: boolean;
  history?: LeaveHistoryEntry[];
  showRejectFormInitially?: boolean;
}

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

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
        gradient: "from-emerald-500 to-green-600",
      };
    case "pending":
      return {
        label: "Pending Approval",
        icon: Clock,
        bg: "bg-amber-50 dark:bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        border: "border-amber-200 dark:border-amber-500/20",
        gradient: "from-amber-500 to-orange-600",
      };
    case "rejected":
    case "declined":
      return {
        label: status === "rejected" ? "Rejected" : "Declined",
        icon: XCircle,
        bg: "bg-rose-50 dark:bg-rose-500/10",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-500/20",
        gradient: "from-rose-500 to-red-600",
      };
    default:
      return {
        label: "Unknown",
        icon: AlertTriangle,
        bg: "bg-gray-50 dark:bg-gray-500/10",
        text: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
        border: "border-gray-200 dark:border-gray-500/20",
        gradient: "from-gray-500 to-gray-600",
      };
  }
}

function getLeaveTypeConfig(type: LeaveType | string) {
  const normalizedType = type.toLowerCase().replace("_", " ");

  if (normalizedType.includes("medical") || normalizedType === "sick") {
    return { icon: Stethoscope, bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400", label: "Medical/Sick" };
  }
  if (normalizedType.includes("family") || normalizedType === "family emergency") {
    return { icon: Heart, bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", label: "Family" };
  }
  if (normalizedType.includes("personal") || normalizedType === "vacation") {
    return { icon: Briefcase, bg: "bg-slate-50 dark:bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", label: "Personal/Vacation" };
  }
  if (normalizedType.includes("religious")) {
    return { icon: Church, bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", label: "Religious" };
  }
  if (normalizedType.includes("sports")) {
    return { icon: Trophy, bg: "bg-teal-50 dark:bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", label: "Sports" };
  }
  return { icon: PenLine, bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) };
}

function calculateDays(from: string, to: string): number {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ChildLeaveRequestDetailsModal({
  leave,
  onClose,
  onApprove,
  onReject,
  isAdmin = false,
  history = [],
  showRejectFormInitially = false,
}: ChildLeaveRequestDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const [showRejectForm, setShowRejectForm] = useState(showRejectFormInitially);
  const [rejectReason, setRejectReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Normalize the leave data
  const startDate = leave.startDate || leave.fromDate || "";
  const endDate = leave.endDate || leave.toDate || "";
  const childClass = leave.childClass || leave.classLevel || "";
  const appliedDate = leave.requestedAt || leave.appliedDate || "";
  const days = leave.days || (startDate && endDate ? calculateDays(startDate, endDate) : 0);
  const rejectionReason = leave.adminNotes || leave.remarks || "";
  const approvedBy = leave.processedBy || leave.approvedBy || "";
  const approvedDate = leave.processedAt || leave.approvedDate || "";

  const status = getStatusConfig(leave.status);
  const type = getLeaveTypeConfig(leave.leaveType);
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  // Generate default history if not provided
  const leaveHistory: LeaveHistoryEntry[] = history.length > 0 ? history : [
    {
      id: "1",
      action: "submitted" as const,
      timestamp: appliedDate || new Date().toISOString(),
      by: "Parent",
      notes: `Leave request submitted for ${leave.childName}`,
    },
    ...(leave.status !== "pending" ? [{
      id: "2",
      action: (leave.status === "approved" ? "approved" : "rejected") as "approved" | "rejected",
      timestamp: approvedDate || new Date().toISOString(),
      by: approvedBy || "Admin",
      notes: leave.status === "approved"
        ? "Leave request has been approved."
        : rejectionReason || "Leave request was rejected.",
    }] : []),
  ];

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, isProcessing]);

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    onApprove(leave.id, approvalNotes || undefined);
    setIsProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    if (!onReject || !rejectReason.trim()) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    onReject(leave.id, rejectReason);
    setIsProcessing(false);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className={`relative px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r ${status.gradient}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <StatusIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Leave Request Details</h2>
                <span className="text-xs font-medium text-white/80">{status.label}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-line">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "details"
                ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-muted hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "history"
                ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-muted hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <History className="w-4 h-4" />
              History
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {activeTab === "details" ? (
            <div className="space-y-4 sm:space-y-5">
              {/* Leave Type Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${type.bg}`}>
                <TypeIcon className={`w-4 h-4 ${type.text}`} />
                <span className={`text-sm font-medium ${type.text}`}>{type.label} Leave</span>
              </div>

              {/* Child Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {leave.childPhoto ? (
                    <img src={leave.childPhoto} alt={leave.childName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    leave.childName.split(" ").map((n) => n[0]).join("")
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-ink">{leave.childName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-sm text-muted">{childClass}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[0.625rem] font-medium text-gray-400 uppercase tracking-wider">Request ID</p>
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{leave.id}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <label className="text-xs font-medium text-muted uppercase tracking-wider">Reason for Leave</label>
                </div>
                <p className="text-sm sm:text-base text-ink leading-relaxed">{leave.reason}</p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-[0.625rem] font-medium text-gray-400 uppercase tracking-wider">From</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{startDate ? formatDate(startDate) : "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-[0.625rem] font-medium text-gray-400 uppercase tracking-wider">To</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{endDate ? formatDate(endDate) : "N/A"}</p>
                </div>
              </div>

              {/* Duration & Applied */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/20">
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">Total Duration</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">{days} {days === 1 ? "Day" : "Days"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Applied on</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{appliedDate ? formatDate(appliedDate) : "N/A"}</p>
                </div>
              </div>

              {/* Approval Info */}
              {leave.status === "approved" && approvedBy && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Approved</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                    By <span className="font-semibold">{approvedBy}</span>
                    {approvedDate && <span className="text-gray-500"> on {formatDate(approvedDate)}</span>}
                  </p>
                </div>
              )}

              {/* Rejection Reason */}
              {(leave.status === "rejected" || leave.status === "declined") && rejectionReason && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Reason for {leave.status === "rejected" ? "Rejection" : "Decline"}</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 leading-relaxed">{rejectionReason}</p>
                  {approvedBy && (
                    <p className="text-xs text-muted mt-2">
                      Processed by <span className="font-semibold">{approvedBy}</span>
                      {approvedDate && <span> on {formatDate(approvedDate)}</span>}
                    </p>
                  )}
                </div>
              )}

              {/* Documents */}
              {leave.documents && leave.documents.length > 0 && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-muted uppercase tracking-wider">Attached Documents</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {leave.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Document {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              {isAdmin && leave.status === "pending" && !showRejectForm && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
                      Approval Notes (Optional)
                    </label>
                    <textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Add any notes for approval..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-line bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Reject Form */}
              {isAdmin && leave.status === "pending" && showRejectForm && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">Reject Leave Request</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                      Reason for Rejection *
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please provide a reason for rejecting this leave request..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-700 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowRejectForm(false); setRejectReason(""); }}
                      className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] hover:bg-gray-300 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={!rejectReason.trim() || isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Confirm Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">Request Timeline</h3>
              </div>

              <div className="relative pl-6">
                {/* Timeline line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]" />

                {leaveHistory.map((entry, _idx) => {
                  const getActionConfig = (action: string) => {
                    switch (action) {
                      case "submitted":
                        return { icon: Send, color: "bg-blue-500", text: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" };
                      case "approved":
                        return { icon: CheckCircle2, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
                      case "rejected":
                        return { icon: XCircle, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" };
                      case "cancelled":
                        return { icon: X, color: "bg-gray-500", text: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" };
                      default:
                        return { icon: Clock, color: "bg-gray-500", text: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" };
                    }
                  };

                  const config = getActionConfig(entry.action);
                  const ActionIcon = config.icon;

                  return (
                    <div key={entry.id} className="relative pb-6 last:pb-0">
                      {/* Timeline dot */}
                      <div className={`absolute -left-4 w-4 h-4 rounded-full ${config.color} flex items-center justify-center`}>
                        <ActionIcon className="w-2.5 h-2.5 text-white" />
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 ml-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${config.text} capitalize`}>{entry.action}</span>
                          <span className="text-xs text-muted">{formatDateTime(entry.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{entry.by}</span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-2 pl-5 border-l-2 border-line">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {leave.status === "pending" && (
                  <div className="relative pb-0">
                    <div className="absolute -left-4 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
                      <Clock className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 ml-2">
                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">Awaiting Approval</span>
                      <p className="text-xs text-muted mt-1">This request is pending review by school administration.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          {isAdmin && leave.status === "pending" && !showRejectForm ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] hover:bg-gray-300 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] hover:bg-gray-300 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
