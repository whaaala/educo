"use client";

import { ArrowRightLeft, CheckCircle, Clock, XCircle, Calendar } from "lucide-react";
import { TransferRequest } from "@/types/transfer";
import { useTransfers } from "@/contexts/TransferContext";

interface TransferHistoryCardProps {
  studentId: string;
}

export default function TransferHistoryCard({ studentId }: TransferHistoryCardProps) {
  const { getStudentTransfers } = useTransfers();
  const transfers = getStudentTransfers(studentId);

  // Sort by date (newest first)
  const sortedTransfers = [...transfers].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusIcon = (status: TransferRequest["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400" />;
    }
  };

  const getStatusColor = (status: TransferRequest["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 text-green-800 dark:text-green-200 midnight:text-green-200 purple:text-green-200 border border-green-200 dark:border-green-800 midnight:border-green-800 purple:border-green-800";
      case "approved":
        return "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200 border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 text-red-800 dark:text-red-200 midnight:text-red-200 purple:text-red-200 border border-red-200 dark:border-red-800 midnight:border-red-800 purple:border-red-800";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 midnight:text-yellow-200 purple:text-yellow-200 border border-yellow-200 dark:border-yellow-800 midnight:border-yellow-800 purple:border-yellow-800";
      case "in-progress":
        return "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200 border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800";
      default:
        return "bg-gray-100 dark:bg-[#0f1115]/30 midnight:bg-[#0a0e27]/30 purple:bg-[#1a0b2e]/30 text-gray-800 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 border border-gray-200 dark:border-[#1a1d24] midnight:border-gray-800 purple:border-gray-800";
    }
  };

  const getTransferTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "promotion": "Promotion",
      "section-change": "Section Change",
      "class-change": "Class Change",
      "internal": "Internal Transfer",
      "cross-branch": "Cross-Branch",
      "external": "External Transfer",
    };
    return labels[type] || type;
  };

  if (sortedTransfers.length === 0) {
    return (
      <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
        {/* Header */}
        <h3 className="text-sm sm:text-base font-bold text-ink mb-1">
          Transfer History
        </h3>

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 mb-3"></div>

        {/* Empty State */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] mb-3">
            <ArrowRightLeft className="w-6 h-6 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
            No transfer history found for this student
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm sm:text-base font-bold text-ink">
          Transfer History
        </h3>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
          {sortedTransfers.length} {sortedTransfers.length === 1 ? "transfer" : "transfers"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 mb-3"></div>

      {/* Timeline */}
      <div className="space-y-3 sm:space-y-4">
        {sortedTransfers.map((transfer, index) => (
          <div
            key={transfer.id}
            className="relative pl-6 sm:pl-8 pb-3 sm:pb-4 border-l-2 border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 last:border-l-0 last:pb-0"
          >
            {/* Timeline dot */}
            <div className="absolute left-[-9px] sm:left-[-9px] top-0">
              {getStatusIcon(transfer.status)}
            </div>

            {/* Transfer Card */}
            <div className="bg-gray-50/50 dark:bg-[#1a1d24]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5">
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-ink truncate">
                    {getTransferTypeLabel(transfer.transferType)}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-0.5">
                    {new Date(transfer.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-[0.625rem] sm:text-xs font-semibold whitespace-nowrap ${getStatusColor(transfer.status)}`}>
                  {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1).replace("-", " ")}
                </span>
              </div>

              {/* Transfer Details */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm mb-2 sm:mb-3">
                <div className="bg-white/50 dark:bg-[#0f1115]/20 midnight:bg-[#0a0e27]/20 purple:bg-[#1a0b2e]/20 rounded-lg p-2 sm:p-2.5">
                  <p className="text-[0.625rem] sm:text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                    From
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
                    {transfer.sourceClass && transfer.sourceSection
                      ? `${transfer.sourceClass}, Sec ${transfer.sourceSection}`
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-[#0f1115]/20 midnight:bg-[#0a0e27]/20 purple:bg-[#1a0b2e]/20 rounded-lg p-2 sm:p-2.5">
                  <p className="text-[0.625rem] sm:text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                    To
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
                    {transfer.destinationClass && transfer.destinationSection
                      ? `${transfer.destinationClass}, Sec ${transfer.destinationSection}`
                      : transfer.destinationSchoolName || "N/A"}
                  </p>
                </div>
              </div>

              {/* Effective Date */}
              {transfer.effectiveDate && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-300/90 purple:text-pink-300/90 mb-2 sm:mb-3 bg-white/50 dark:bg-[#0f1115]/20 midnight:bg-[#0a0e27]/20 purple:bg-[#1a0b2e]/20 rounded-lg p-2 sm:p-2.5">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">
                    Effective: {new Date(transfer.effectiveDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {/* Reason */}
              {transfer.reason && (
                <div className="pt-2 sm:pt-3 border-t border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <p className="text-[0.625rem] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1 uppercase tracking-wide">
                    Reason
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 leading-relaxed">
                    {transfer.reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
