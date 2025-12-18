"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import FormInput from "@/components/shared/FormInput";
import { usePageLoad } from "@/hooks/usePageLoad";
import {
  CalendarDays,
  CalendarCheck,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Calendar,
  User,
  Search,
  X,
  FileText,
  Send,
  Stethoscope,
  Heart,
  Briefcase,
  Church,
  Trophy,
  Info,
  ArrowRight,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

type LeaveStatus = "approved" | "pending" | "declined";
type LeaveType = "Medical" | "Family" | "Personal" | "Religious" | "Sports";

interface ChildLeaveRequest {
  id: string;
  childId: string;
  childName: string;
  childPhoto?: string;
  classLevel: string;
  reason: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
  documents?: string[];
}

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
        text: "text-amber-600 dark:text-amber-400",
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

function getLeaveTypeConfig(type: LeaveType) {
  switch (type) {
    case "Medical":
      return { icon: Stethoscope, bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", color: "blue" };
    case "Family":
      return { icon: Heart, bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", color: "pink" };
    case "Personal":
      return { icon: Briefcase, bg: "bg-slate-50 dark:bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", color: "slate" };
    case "Religious":
      return { icon: Church, bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", color: "violet" };
    case "Sports":
      return { icon: Trophy, bg: "bg-teal-50 dark:bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", color: "teal" };
    default:
      return { icon: FileText, bg: "bg-gray-50 dark:bg-gray-500/10", text: "text-gray-600 dark:text-gray-400", color: "gray" };
  }
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

export default function ParentLeavesPage() {
  const isPageLoading = usePageLoad(600);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLeave, setSelectedLeave] = useState<ChildLeaveRequest | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Filter leaves
  const filteredLeaves = useMemo(() => {
    return MOCK_LEAVE_REQUESTS.filter((leave) => {
      const matchesSearch =
        leave.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChild = selectedChild === "all" || leave.childId === selectedChild;
      const matchesStatus = selectedStatus === "all" || leave.status === selectedStatus;
      const matchesType = selectedType === "all" || leave.leaveType === selectedType;
      return matchesSearch && matchesChild && matchesStatus && matchesType;
    });
  }, [searchQuery, selectedChild, selectedStatus, selectedType]);

  // Group leaves by status
  const pendingLeaves = filteredLeaves.filter((l) => l.status === "pending");
  const approvedLeaves = filteredLeaves.filter((l) => l.status === "approved");
  const declinedLeaves = filteredLeaves.filter((l) => l.status === "declined");

  // Stats
  const stats = useMemo(() => ({
    total: MOCK_LEAVE_REQUESTS.length,
    approved: MOCK_LEAVE_REQUESTS.filter((l) => l.status === "approved").length,
    pending: MOCK_LEAVE_REQUESTS.filter((l) => l.status === "pending").length,
    declined: MOCK_LEAVE_REQUESTS.filter((l) => l.status === "declined").length,
  }), []);

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Leave Requests" />

      <div className={`space-y-4 sm:space-y-6 transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Page Header */}
        <PageHeader
          title="Child Leave Requests"
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "Leaves" },
          ]}
          actions={
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Apply for Leave</span>
              <span className="xs:hidden">Apply</span>
            </button>
          }
        />

        {/* Stats Cards - Modern Glass Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={CalendarDays} label="Total" value={stats.total} color="blue" />
          <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} color="emerald" />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="amber" />
          <StatCard icon={XCircle} label="Declined" value={stats.declined} color="rose" />
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4 shadow-sm">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leave requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
              <FilterSelect
                value={selectedChild}
                onChange={setSelectedChild}
                options={[
                  { value: "all", label: "All Children" },
                  ...MOCK_CHILDREN.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
              <FilterSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "approved", label: "Approved" },
                  { value: "pending", label: "Pending" },
                  { value: "declined", label: "Declined" },
                ]}
              />
              <FilterSelect
                value={selectedType}
                onChange={setSelectedType}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "Medical", label: "Medical" },
                  { value: "Family", label: "Family" },
                  { value: "Personal", label: "Personal" },
                  { value: "Religious", label: "Religious" },
                  { value: "Sports", label: "Sports" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Pending Section */}
        {pendingLeaves.length > 0 && (
          <LeaveSection
            title="Pending Approval"
            count={pendingLeaves.length}
            icon={Clock}
            color="amber"
            leaves={pendingLeaves}
            onViewLeave={setSelectedLeave}
          />
        )}

        {/* Approved Section */}
        {approvedLeaves.length > 0 && (
          <LeaveSection
            title="Approved Leaves"
            count={approvedLeaves.length}
            icon={CheckCircle2}
            color="emerald"
            leaves={approvedLeaves}
            onViewLeave={setSelectedLeave}
          />
        )}

        {/* Declined Section */}
        {declinedLeaves.length > 0 && (
          <LeaveSection
            title="Declined Requests"
            count={declinedLeaves.length}
            icon={XCircle}
            color="rose"
            leaves={declinedLeaves}
            onViewLeave={setSelectedLeave}
          />
        )}

        {/* Empty State */}
        {filteredLeaves.length === 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No leave requests found</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              {searchQuery || selectedChild !== "all" || selectedStatus !== "all" || selectedType !== "all"
                ? "Try adjusting your filters."
                : "You haven't submitted any leave requests yet."}
            </p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              Apply for Leave
            </button>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-gradient-to-br from-cyan-50/80 via-blue-50/80 to-indigo-50/80 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-xl rounded-2xl border border-cyan-200/50 dark:border-cyan-800/30 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 shadow-sm shrink-0">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Leave Request Guidelines</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Submit leave requests at least 3 days in advance. Medical emergencies can be submitted anytime with supporting documents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Leave Modal */}
      {selectedLeave && (
        <LeaveDetailModal leave={selectedLeave} onClose={() => setSelectedLeave(null)} />
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <ApplyLeaveModal children={MOCK_CHILDREN} onClose={() => setShowApplyModal(false)} />
      )}
    </MainLayout>
  );
}

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    blue: { bg: "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20", icon: "text-blue-600 dark:text-blue-400", text: "text-blue-600 dark:text-blue-400" },
    emerald: { bg: "from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20", icon: "text-emerald-600 dark:text-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
    amber: { bg: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20", icon: "text-amber-600 dark:text-amber-400", text: "text-amber-600 dark:text-amber-400" },
    rose: { bg: "from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20", icon: "text-rose-600 dark:text-rose-400", text: "text-rose-600 dark:text-rose-400" },
  };
  const c = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${c.bg} backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 p-3 sm:p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">{label}</p>
          <p className={`text-xl sm:text-2xl font-bold ${c.text}`}>{value}</p>
        </div>
        <div className={`p-2 sm:p-2.5 rounded-xl bg-white/60 dark:bg-gray-800/60`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// FILTER SELECT COMPONENT
// ============================================

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-3 py-2 sm:py-2.5 pr-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ============================================
// LEAVE SECTION COMPONENT
// ============================================

function LeaveSection({
  title,
  count,
  icon: Icon,
  color,
  leaves,
  onViewLeave,
}: {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  leaves: ChildLeaveRequest[];
  onViewLeave: (leave: ChildLeaveRequest) => void;
}) {
  const colorClasses: Record<string, { iconBg: string; iconText: string; badge: string }> = {
    amber: { iconBg: "bg-amber-100 dark:bg-amber-500/20", iconText: "text-amber-600 dark:text-amber-400", badge: "bg-gradient-to-r from-amber-500 to-orange-500" },
    emerald: { iconBg: "bg-emerald-100 dark:bg-emerald-500/20", iconText: "text-emerald-600 dark:text-emerald-400", badge: "bg-gradient-to-r from-emerald-500 to-green-500" },
    rose: { iconBg: "bg-rose-100 dark:bg-rose-500/20", iconText: "text-rose-600 dark:text-rose-400", badge: "bg-gradient-to-r from-rose-500 to-red-500" },
  };
  const c = colorClasses[color] || colorClasses.amber;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${c.iconBg}`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${c.iconText}`} />
        </div>
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{title}</h2>
        <span className={`px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white ${c.badge} rounded-full`}>
          {count}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {leaves.map((leave) => (
          <LeaveCard key={leave.id} leave={leave} onClick={() => onViewLeave(leave)} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// LEAVE CARD COMPONENT
// ============================================

function LeaveCard({ leave, onClick }: { leave: ChildLeaveRequest; onClick: () => void }) {
  const status = getStatusConfig(leave.status);
  const type = getLeaveTypeConfig(leave.leaveType);
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 sm:p-2 rounded-lg ${status.bg}`}>
            <StatusIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${status.text}`} />
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${type.bg}`}>
          <TypeIcon className={`w-3 h-3 ${type.text}`} />
          <span className={`text-[10px] sm:text-xs font-medium ${type.text}`}>{leave.leaveType}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
        {leave.reason}
      </h3>

      {/* Child Info */}
      <div className="flex items-center gap-2 mb-3">
        <User className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs text-gray-600 dark:text-gray-300">{leave.childName}</span>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{leave.classLevel}</span>
      </div>

      {/* Date Info */}
      <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <div>
            <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
              {formatShortDate(leave.fromDate)} - {formatShortDate(leave.toDate)}
            </p>
            <p className="text-[10px] text-gray-500">{leave.days} {leave.days === 1 ? "day" : "days"}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400">Applied</p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{formatShortDate(leave.appliedDate)}</p>
        </div>
      </div>

      {/* Footer */}
      {leave.status === "approved" && leave.approvedBy && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] sm:text-xs text-gray-500">Approved by {leave.approvedBy}</span>
        </div>
      )}
      {leave.status === "declined" && leave.remarks && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-rose-100 dark:border-rose-500/20 flex items-start gap-2">
          <AlertTriangle className="w-3 h-3 text-rose-500 mt-0.5 shrink-0" />
          <span className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400">{leave.remarks}</span>
        </div>
      )}

      {/* Arrow */}
      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-4 h-4 text-cyan-500" />
      </div>
    </button>
  );
}

// ============================================
// LEAVE DETAIL MODAL
// ============================================

function LeaveDetailModal({ leave, onClose }: { leave: ChildLeaveRequest; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const status = getStatusConfig(leave.status);
  const type = getLeaveTypeConfig(leave.leaveType);
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
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className={`relative px-4 sm:px-6 py-4 sm:py-5 ${status.bg} border-b ${status.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white/80 dark:bg-gray-800/80`}>
                <StatusIcon className={`w-5 h-5 ${status.text}`} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Leave Details</h2>
                <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Type Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${type.bg}`}>
            <TypeIcon className={`w-4 h-4 ${type.text}`} />
            <span className={`text-sm font-medium ${type.text}`}>{leave.leaveType} Leave</span>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</label>
            <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-white font-medium">{leave.reason}</p>
          </div>

          {/* Child Info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {leave.childName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{leave.childName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{leave.classLevel}</p>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">From</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(leave.fromDate)}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">To</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(leave.toDate)}</p>
            </div>
          </div>

          {/* Duration & Applied */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20">
            <div>
              <p className="text-xs text-cyan-600 dark:text-cyan-400">Duration</p>
              <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">{leave.days} {leave.days === 1 ? "Day" : "Days"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Applied on</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatDate(leave.appliedDate)}</p>
            </div>
          </div>

          {/* Approval Info */}
          {leave.status === "approved" && leave.approvedBy && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Approved</p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                By <span className="font-semibold">{leave.approvedBy}</span>
                {leave.approvedDate && <span className="text-gray-500"> on {formatDate(leave.approvedDate)}</span>}
              </p>
            </div>
          )}

          {/* Decline Reason */}
          {leave.status === "declined" && leave.remarks && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400">Reason for Decline</p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{leave.remarks}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold transition-colors"
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
// APPLY LEAVE MODAL
// ============================================

function ApplyLeaveModal({ children, onClose }: { children: Child[]; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || "");
  const [leaveType, setLeaveType] = useState<LeaveType>("Medical");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const days = fromDate && toDate ? calculateDays(fromDate, toDate) : 0;

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
    if (!selectedChildId || !leaveType || !fromDate || !toDate || !reason) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
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
  ];

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !isSubmitting && onClose()}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Leave Request Submitted!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your request has been sent for approval.</p>
            </div>
          ) : (
            <>
              {/* Select Child */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Select Child</label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        selectedChildId === child.id
                          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                        {child.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{child.name}</p>
                        <p className="text-xs text-gray-500">{child.classLevel}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Leave Type</label>
                <div className="flex flex-wrap gap-2">
                  {leaveTypes.map(({ type, icon: Icon }) => {
                    const config = getLeaveTypeConfig(type);
                    return (
                      <button
                        key={type}
                        onClick={() => setLeaveType(type)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                          leaveType === type
                            ? `border-${config.color}-500 ${config.bg} ${config.text}`
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type}
                      </button>
                    );
                  })}
                </div>
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
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Reason for Leave</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a detailed reason for the leave request..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700/50 flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedChildId || !leaveType || !fromDate || !toDate || !reason || isSubmitting}
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
