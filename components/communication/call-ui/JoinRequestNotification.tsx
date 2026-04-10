"use client";

import React from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface JoinRequest {
  id: string;
  name: string;
  avatar?: string;
  location?: string;
  timestamp?: Date;
}

export interface JoinRequestNotificationProps {
  request: JoinRequest;
  primaryColor?: string;
  secondaryColor?: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  className?: string;
}

export function JoinRequestNotification({
  request,
  primaryColor = "#2563eb",
  secondaryColor = "#1e40af",
  onAccept,
  onReject,
  className,
}: JoinRequestNotificationProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3",
        "bg-white dark:bg-[#1a1d24] rounded-full shadow-xl",
        "border border-gray-200 dark:border-gray-700",
        "animate-in slide-in-from-top-4 duration-300",
        className
      )}
    >
      {/* Avatar */}
      {request.avatar ? (
        <Image
          src={request.avatar}
          alt={request.name}
          width={36}
          height={36}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
        />
      ) : (
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-sm font-medium ring-2 ring-gray-100 dark:ring-gray-700"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          {request.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Want to join the meet
        </p>
        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
          {request.name}
          {request.location && (
            <span className="font-normal text-gray-500 dark:text-gray-400 ml-1">
              from {request.location}
            </span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          onClick={() => onReject(request.id)}
          className="p-1.5 sm:p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => onAccept(request.id)}
          className="p-1.5 sm:p-2 rounded-full text-white transition-colors hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

export default JoinRequestNotification;
