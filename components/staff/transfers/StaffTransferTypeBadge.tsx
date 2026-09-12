"use client";

import { TransferType } from "@/types/staffTransfer";
import { Building2, MapPin, Briefcase, TrendingUp } from "lucide-react";

interface StaffTransferTypeBadgeProps {
  type: TransferType;
  size?: "sm" | "md" | "lg";
}

export default function StaffTransferTypeBadge({ type, size = "md" }: StaffTransferTypeBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const typeConfig = {
    department: {
      label: "Department",
      icon: Building2,
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 midnight:bg-cyan-900/20 midnight:text-cyan-400 purple:bg-pink-900/20 purple:text-pink-400 border border-blue-200 dark:border-blue-800/50 midnight:border-cyan-700/30 purple:border-pink-700/30",
    },
    branch: {
      label: "Branch",
      icon: MapPin,
      className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 midnight:bg-purple-900/20 midnight:text-purple-400 purple:bg-purple-900/20 purple:text-purple-400 border border-purple-200 dark:border-purple-800/50 midnight:border-purple-700/30 purple:border-purple-700/30",
    },
    designation: {
      label: "Designation",
      icon: Briefcase,
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 midnight:bg-emerald-900/20 midnight:text-emerald-400 purple:bg-emerald-900/20 purple:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 midnight:border-emerald-700/30 purple:border-emerald-700/30",
    },
    promotion: {
      label: "Promotion",
      icon: TrendingUp,
      className: "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-900 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-amber-200 midnight:from-yellow-900/20 midnight:to-amber-900/20 midnight:text-amber-300 purple:from-yellow-900/20 purple:to-amber-900/20 purple:text-amber-300 border border-amber-300 dark:border-amber-700/50 midnight:border-amber-600/30 purple:border-amber-600/30 shadow-sm",
    },
    location: {
      label: "Location",
      icon: MapPin,
      className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 midnight:bg-orange-900/20 midnight:text-orange-400 purple:bg-orange-900/20 purple:text-orange-400 border border-orange-200 dark:border-orange-800/50 midnight:border-orange-700/30 purple:border-orange-700/30",
    },
    termination: {
      label: "Termination",
      icon: Briefcase,
      className: "bg-gradient-to-r from-red-100 to-rose-100 text-red-900 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-200 midnight:from-red-900/20 midnight:to-rose-900/20 midnight:text-red-300 purple:from-red-900/20 purple:to-rose-900/20 purple:text-red-300 border border-red-300 dark:border-red-700/50 midnight:border-red-600/30 purple:border-red-600/30 shadow-sm",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center justify-center font-semibold rounded-full whitespace-nowrap ${sizeClasses[size]} ${config.className}`}>
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
}
