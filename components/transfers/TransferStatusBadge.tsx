import { TransferStatus } from "@/types/transfer";
import { Clock, CheckCircle, XCircle, AlertCircle, Ban, Loader } from "lucide-react";

interface TransferStatusBadgeProps {
  status: TransferStatus;
  size?: "sm" | "md" | "lg";
}

export default function TransferStatusBadge({ status, size = "md" }: TransferStatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    },
    approved: {
      icon: CheckCircle,
      label: "Approved",
      className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 dark:border-green-800",
    },
    "in-progress": {
      icon: Loader,
      label: "In Progress",
      className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 dark:border-blue-800",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 dark:text-red-400 midnight:text-red-400 purple:text-red-400 dark:border-red-800",
    },
    cancelled: {
      icon: Ban,
      label: "Cancelled",
      className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-[#0f1115]/20 midnight:bg-[#0a0e27]/20 purple:bg-[#1a0b2e]/20 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 dark:border-[#1a1d24]",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses[size]} ${config.className}`}
      style={size === "sm" ? { fontSize: '0.7375rem' } : undefined}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );
}
