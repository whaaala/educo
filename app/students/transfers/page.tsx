"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  FileText,
  Download,
} from "lucide-react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import {
  getTransferRequests,
  getTransferRequestsByStatus,
  getPendingTransfersCount,
} from "@/lib/mockTransferData";
import { TransferRequest } from "@/types/transfer";

export default function TransfersManagementPage() {
  const router = useRouter();
  const { canTransferStudents, tenantContext } = useFeatureFlags();
  const [isMounted, setIsMounted] = useState(false);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<TransferRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
    // Load transfer requests
    const allTransfers = getTransferRequests();
    setTransfers(allTransfers);
    setFilteredTransfers(allTransfers);
  }, []);

  // Check feature flag
  useEffect(() => {
    if (isMounted && !canTransferStudents) {
      alert(`Student transfer functionality is not enabled for ${tenantContext.institutionType} institutions`);
      router.push("/students");
    }
  }, [isMounted, canTransferStudents, tenantContext, router]);

  // Filter transfers
  useEffect(() => {
    let filtered = transfers;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.studentAdmissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransfers(filtered);
  }, [statusFilter, searchQuery, transfers]);

  if (!isMounted) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!canTransferStudents) {
    return null; // Will redirect
  }

  const getStatusCount = (status: string) => {
    if (status === "all") return transfers.length;
    return transfers.filter((t) => t.status === status).length;
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="py-4 mb-2">
          <PageHeader
            title="Student Transfers"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Students", href: "/students" },
              { label: "Transfers", isActive: true },
            ]}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Requests"
            count={transfers.length}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Pending"
            count={getStatusCount("pending")}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Approved"
            count={getStatusCount("approved") + getStatusCount("in-progress")}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Completed"
            count={getStatusCount("completed")}
            icon={CheckCircle}
            color="indigo"
          />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, admission number, or transfer ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transfers List */}
        <div className="flex-1 overflow-auto">
          {filteredTransfers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-12 text-center">
              <ArrowRight className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || statusFilter !== "all"
                  ? "No transfers found matching your filters"
                  : "No transfer requests yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransfers.map((transfer) => (
                <TransferCard key={transfer.id} transfer={transfer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// Stat Card Component
function StatCard({
  title,
  count,
  icon: Icon,
  color,
}: {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Transfer Card Component
function TransferCard({ transfer }: { transfer: TransferRequest }) {
  const getStatusBadge = (status: TransferRequest["status"]) => {
    const configs = {
      pending: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", label: "Pending" },
      approved: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", label: "Approved" },
      "in-progress": { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", label: "In Progress" },
      completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", label: "Completed" },
      rejected: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "Rejected" },
      cancelled: { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-700 dark:text-gray-300", label: "Cancelled" },
    };
    return configs[status] || configs.pending;
  };

  const statusBadge = getStatusBadge(transfer.status);

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {transfer.studentName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{transfer.studentName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transfer.studentAdmissionNumber} • {transfer.id}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
          {statusBadge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">From</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {transfer.sourceBranchName || "Main Campus"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {transfer.sourceClass} - Section {transfer.sourceSection}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">To</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {transfer.destinationBranchName || transfer.destinationSchoolName || "Same Campus"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {transfer.destinationClass && `${transfer.destinationClass}${transfer.destinationSection ? ` - Section ${transfer.destinationSection}` : ""}`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Effective Date</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(transfer.effectiveDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Requested: {new Date(transfer.requestedDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">{transfer.reason}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>
          Requested by: <span className="font-medium">{transfer.requestedByName}</span> ({transfer.requestedByRole})
        </div>
        {transfer.approvedByName && (
          <div>
            Approved by: <span className="font-medium">{transfer.approvedByName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
