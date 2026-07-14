"use client";

import { useState, useEffect } from "react";
import { CheckCheck, Trash2, Clock, ChevronRight, FileText, CheckCircle2, XCircle, Bell, Calendar, Users, AlertTriangle } from "lucide-react";
import Image from "next/image";

// Single source of truth. This file used to redeclare its own NotificationType union, which
// drifted from the context's (it was missing permission_request/granted/denied) — so those
// notifications were a type error at every call site.
import type { NotificationType } from "@/contexts/NotificationContext";

interface NotificationCardProps {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  avatar?: string;
  userName?: string;
  unread: boolean;
  actions?: { label: string; variant?: "primary" | "secondary"; onClick?: () => void }[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  isOdd?: boolean;
  onClick?: () => void;
}

export default function NotificationCard({
  id,
  type,
  message,
  time,
  avatar,
  userName,
  unread,
  actions,
  onMarkAsRead,
  onDelete,
  onClick,
}: NotificationCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTypeConfig = (type: NotificationType) => {
    switch (type) {
      case "performance":
        return {
          icon: AlertTriangle,
          gradient: "from-amber-500 to-orange-500",
          bg: "bg-amber-50/80 dark:bg-amber-500/10",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-100/50 dark:border-amber-500/20",
          label: "Performance",
        };
      case "appointment":
        return {
          icon: Calendar,
          gradient: "from-purple-500 to-pink-500",
          bg: "bg-purple-50/80 dark:bg-purple-500/10",
          text: "text-purple-600 dark:text-purple-400",
          border: "border-purple-100/50 dark:border-purple-500/20",
          label: "Appointment",
        };
      case "record":
        return {
          icon: Users,
          gradient: "from-blue-500 to-indigo-500",
          bg: "bg-blue-50/80 dark:bg-blue-500/10",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-100/50 dark:border-blue-500/20",
          label: "Record",
        };
      case "leave_submitted":
        return {
          icon: FileText,
          gradient: "from-cyan-500 to-blue-500",
          bg: "bg-cyan-50/80 dark:bg-cyan-500/10",
          text: "text-cyan-600 dark:text-cyan-400",
          border: "border-cyan-100/50 dark:border-cyan-500/20",
          label: "Leave Request",
        };
      case "leave_approved":
        return {
          icon: CheckCircle2,
          gradient: "from-emerald-500 to-green-500",
          bg: "bg-emerald-50/80 dark:bg-emerald-500/10",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-100/50 dark:border-emerald-500/20",
          label: "Leave Approved",
        };
      case "leave_rejected":
        return {
          icon: XCircle,
          gradient: "from-rose-500 to-red-500",
          bg: "bg-rose-50/80 dark:bg-rose-500/10",
          text: "text-rose-600 dark:text-rose-400",
          border: "border-rose-100/50 dark:border-rose-500/20",
          label: "Leave Rejected",
        };
      case "meeting_scheduled":
        return {
          icon: Calendar,
          gradient: "from-indigo-500 to-purple-500",
          bg: "bg-indigo-50/80 dark:bg-indigo-500/10",
          text: "text-indigo-600 dark:text-indigo-400",
          border: "border-indigo-100/50 dark:border-indigo-500/20",
          label: "Meeting",
        };
      case "meeting_cancelled":
        return {
          icon: XCircle,
          gradient: "from-rose-500 to-red-500",
          bg: "bg-rose-50/80 dark:bg-rose-500/10",
          text: "text-rose-600 dark:text-rose-400",
          border: "border-rose-100/50 dark:border-rose-500/20",
          label: "Cancelled",
        };
      case "payment":
        return {
          icon: CheckCircle2,
          gradient: "from-green-500 to-emerald-500",
          bg: "bg-green-50/80 dark:bg-green-500/10",
          text: "text-green-600 dark:text-green-400",
          border: "border-green-100/50 dark:border-green-500/20",
          label: "Payment",
        };
      case "message":
        return {
          icon: Bell,
          gradient: "from-blue-500 to-cyan-500",
          bg: "bg-blue-50/80 dark:bg-blue-500/10",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-100/50 dark:border-blue-500/20",
          label: "Message",
        };
      case "alert":
        return {
          icon: AlertTriangle,
          gradient: "from-red-500 to-rose-500",
          bg: "bg-red-50/80 dark:bg-red-500/10",
          text: "text-red-600 dark:text-red-400",
          border: "border-red-100/50 dark:border-red-500/20",
          label: "Alert",
        };
      case "success":
        return {
          icon: CheckCircle2,
          gradient: "from-emerald-500 to-green-500",
          bg: "bg-emerald-50/80 dark:bg-emerald-500/10",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-100/50 dark:border-emerald-500/20",
          label: "Success",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          gradient: "from-amber-500 to-yellow-500",
          bg: "bg-amber-50/80 dark:bg-amber-500/10",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-100/50 dark:border-amber-500/20",
          label: "Warning",
        };
      case "info":
        return {
          icon: Bell,
          gradient: "from-blue-500 to-indigo-500",
          bg: "bg-blue-50/80 dark:bg-blue-500/10",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-100/50 dark:border-blue-500/20",
          label: "Info",
        };
      default:
        return {
          icon: Bell,
          gradient: "from-gray-500 to-gray-600",
          bg: "bg-gray-50/80 dark:bg-gray-500/10",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-100/50 dark:border-gray-500/20",
          label: "General",
        };
    }
  };

  const config = getTypeConfig(type);
  const TypeIcon = config.icon;

  if (!isMounted) {
    return (
      <div className="p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-[#22262e]"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-[#22262e] rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-[#22262e] rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <div
      className={`group relative p-4 transition-all duration-200 ${onClick ? "cursor-pointer" : ""} ${
        unread
          ? "bg-gradient-to-r from-blue-50/50 via-transparent to-transparent dark:from-blue-500/5 dark:via-transparent"
          : ""
      } hover:bg-gray-50/50 dark:hover:bg-[#22262e]/30`}
      suppressHydrationWarning
      onClick={onClick}
    >
      {/* Unread indicator line */}
      {unread && (
        <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full" />
      )}

      <div className="flex gap-4" suppressHydrationWarning>
        {/* Avatar / Icon */}
        <div className="flex-shrink-0 relative">
          {avatar ? (
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm ring-2 ring-white/80 dark:ring-gray-700/50">
              <Image
                src={avatar}
                alt={userName || "User"}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className={`w-12 h-12 rounded-xl ${config.bg} ${config.border} border flex items-center justify-center shadow-sm`}>
              <TypeIcon className={`w-5 h-5 ${config.text}`} />
            </div>
          )}
          {/* Unread dot */}
          {unread && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0" suppressHydrationWarning>
          {/* Type Badge & Time */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.text}`}>
              {config.label}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
          </div>

          {/* Message */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {userName && (
                <span className="font-semibold text-gray-900 dark:text-white">
                  {userName}{" "}
                </span>
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {message}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {unread && onMarkAsRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                  title="Mark as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {actions.map((action, index) => (
                <button
                  key={`${id}-${action.label}-${index}`}
                  onClick={(e) => { e.stopPropagation(); action.onClick?.(); }}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    action.variant === "primary"
                      ? "text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md"
                      : "text-gray-700 dark:text-gray-200 bg-gray-100/80 dark:bg-[#22262e]/50 hover:bg-gray-200/80 dark:hover:bg-[#2a2d35]/50 border border-gray-200/50 dark:border-gray-600/50"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clickable indicator */}
        {onClick && (
          <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-1.5 rounded-lg bg-gray-100/80 dark:bg-[#22262e]/50">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
