"use client";

import { TransferStatus } from "@/types/staffTransfer";

interface StaffTransferStatusBadgeProps {
  status: TransferStatus;
  size?: "sm" | "md" | "lg";
}

export default function StaffTransferStatusBadge({ status, size = "md" }: StaffTransferStatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 midnight:bg-yellow-900/20 midnight:text-yellow-400 purple:bg-yellow-900/20 purple:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50 midnight:border-yellow-700/30 purple:border-yellow-700/30",
    },
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 midnight:bg-green-900/20 midnight:text-green-400 purple:bg-green-900/20 purple:text-green-400 border border-green-200 dark:border-green-800/50 midnight:border-green-700/30 purple:border-green-700/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 midnight:bg-red-900/20 midnight:text-red-400 purple:bg-red-900/20 purple:text-red-400 border border-red-200 dark:border-red-800/50 midnight:border-red-700/30 purple:border-red-700/30",
    },
    "in-progress": {
      label: "In-progress",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 midnight:bg-cyan-900/20 midnight:text-cyan-400 purple:bg-pink-900/20 purple:text-pink-400 border border-blue-200 dark:border-blue-800/50 midnight:border-cyan-700/30 purple:border-pink-700/30",
    },
    completed: {
      label: "Completed",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 midnight:bg-emerald-900/20 midnight:text-emerald-400 purple:bg-emerald-900/20 purple:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 midnight:border-emerald-700/30 purple:border-emerald-700/30",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-gray-100 text-gray-800 dark:bg-[#0f1115]/30 dark:text-gray-300 midnight:bg-[#0a0e27]/20 midnight:text-gray-400 purple:bg-[#1a0b2e]/20 purple:text-gray-400 border border-gray-200 dark:border-[#1a1d24]/50 midnight:border-gray-700/30 purple:border-gray-700/30",
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center justify-center font-semibold rounded-full whitespace-nowrap ${sizeClasses[size]} ${config.className}`}>
      {config.label}
    </span>
  );
}
