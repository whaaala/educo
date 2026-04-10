"use client";

import Link from "next/link";
import { ChevronRight, CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";

interface LeaveRequest {
  id: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: "approved" | "pending" | "declined";
  appliedDate: string;
}

interface LeaveStatusSectionProps {
  leaveRequests: LeaveRequest[];
  viewAllLink?: string;
}

export default function LeaveStatusSection({
  leaveRequests,
  viewAllLink = "/parents/leaves",
}: LeaveStatusSectionProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-400",
          label: "Approved",
        };
      case "pending":
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-700 dark:text-yellow-400",
          label: "Pending",
        };
      case "declined":
        return {
          icon: <XCircle className="w-3.5 h-3.5" />,
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-700 dark:text-red-400",
          label: "Declined",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
            <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Leave Status
          </h3>
        </div>
        <Link
          href={viewAllLink}
          className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-1 font-medium"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Leave Requests List */}
      <div className="p-4 space-y-3">
        {leaveRequests.length === 0 ? (
          <div className="text-center py-6">
            <CalendarDays className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No leave requests</p>
          </div>
        ) : (
          leaveRequests.map((leave) => {
            const statusConfig = getStatusConfig(leave.status);
            return (
              <div
                key={leave.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/60 dark:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">
                    {leave.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {leave.days} {leave.days === 1 ? "day" : "days"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
