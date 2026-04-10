"use client";

import {
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Building2,
  GraduationCap,
  User,
  Calendar,
} from "lucide-react";
import { TransferHistory as TransferHistoryType, TransferRecord } from "@/types/transfer";

interface TransferHistoryProps {
  history: TransferHistoryType;
}

export default function TransferHistory({ history }: TransferHistoryProps) {
  if (!history || history.transfers.length === 0) {
    return (
      <div className="text-center py-12">
        <ArrowRight className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 opacity-50" />
        <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          No transfer history found for this student
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
          Transfer History
        </h3>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {history.totalTransfers} {history.totalTransfers === 1 ? "Transfer" : "Transfers"}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[21px] top-[28px] bottom-[28px] w-0.5 bg-gray-200 dark:bg-[#22262e] midnight:bg-cyan-500/20 purple:bg-pink-500/20" />

        {/* Transfer records */}
        <div className="space-y-6">
          {history.transfers.map((transfer, index) => (
            <TransferRecordCard
              key={transfer.id}
              transfer={transfer}
              isFirst={index === 0}
              isLast={index === history.transfers.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TransferRecordCardProps {
  transfer: TransferRecord;
  isFirst: boolean;
  isLast: boolean;
}

function TransferRecordCard({ transfer, isFirst, isLast }: TransferRecordCardProps) {
  const getStatusConfig = (status: TransferRecord["status"]) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/30",
          border: "border-green-300 dark:border-green-700",
          label: "Completed",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          border: "border-yellow-300 dark:border-yellow-700",
          label: "Pending",
        };
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/30",
          border: "border-blue-300 dark:border-blue-700",
          label: "Approved",
        };
      case "in-progress":
        return {
          icon: Clock,
          color: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-100 dark:bg-indigo-900/30",
          border: "border-indigo-300 dark:border-indigo-700",
          label: "In Progress",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-100 dark:bg-red-900/30",
          border: "border-red-300 dark:border-red-700",
          label: "Rejected",
        };
      case "cancelled":
        return {
          icon: AlertCircle,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-100 dark:bg-[#0f1115]/30",
          border: "border-gray-300 dark:border-gray-700",
          label: "Cancelled",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-100 dark:bg-[#0f1115]/30",
          border: "border-gray-300 dark:border-gray-700",
          label: status,
        };
    }
  };

  const getTransferTypeLabel = (type: TransferRecord["transferType"]) => {
    switch (type) {
      case "class-change":
        return "Class Change";
      case "section-change":
        return "Section Change";
      case "cross-branch":
        return "Cross-Branch Transfer";
      case "internal":
        return "Internal Transfer";
      case "external":
        return "External Transfer";
      default:
        return type;
    }
  };

  const statusConfig = getStatusConfig(transfer.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="relative pl-14">
      {/* Status Icon */}
      <div
        className={`absolute left-0 top-2 w-11 h-11 rounded-full ${statusConfig.bg} border-4 border-white dark:border-[#1a1d24] midnight:border-gray-900 purple:border-gray-900 flex items-center justify-center shadow-md`}
      >
        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
      </div>

      {/* Card */}
      <div
        className={`p-4 rounded-lg border-2 ${statusConfig.border} bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] hover:shadow-md transition-all`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {getTransferTypeLabel(transfer.transferType)}
              </h4>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              <Calendar className="w-3 h-3" />
              <span>
                Requested: {new Date(transfer.requestedDate).toLocaleDateString()}
              </span>
              {transfer.completedDate && (
                <>
                  <span>•</span>
                  <span>
                    Completed: {new Date(transfer.completedDate).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Transfer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          {/* From */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase">
              <ArrowRight className="w-3 h-3 rotate-180" />
              From
            </div>
            <div className="space-y-1">
              {transfer.from.branchName && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{transfer.from.branchName}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {transfer.from.class} - Section {transfer.from.section}
                </span>
              </div>
            </div>
          </div>

          {/* To */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase">
              <ArrowRight className="w-3 h-3" />
              To
            </div>
            <div className="space-y-1">
              {transfer.to.branchName && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{transfer.to.branchName}</span>
                </div>
              )}
              {transfer.to.schoolName && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{transfer.to.schoolName}</span>
                </div>
              )}
              {transfer.to.class && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {transfer.to.class}
                    {transfer.to.section && ` - Section ${transfer.to.section}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
              {transfer.reason}
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>Requested by: {transfer.requestedBy}</span>
            </div>
            {transfer.approvedBy && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                <span>Approved by: {transfer.approvedBy}</span>
              </div>
            )}
          </div>
          {transfer.notes && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
              Note: {transfer.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
