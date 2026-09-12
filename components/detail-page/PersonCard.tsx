"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PersonCardProps {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  avatarFallback?: string;
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "horizontal";
  className?: string;
}

export function PersonCard({
  name,
  role,
  email,
  phone,
  avatarUrl,
  avatarFallback,
  actions,
  size = "md",
  variant = "default",
  className = "",
}: PersonCardProps) {
  const sizeStyles = {
    sm: { avatar: "w-10 h-10", name: "text-sm", role: "text-xs" },
    md: { avatar: "w-12 h-12", name: "text-base", role: "text-sm" },
    lg: { avatar: "w-16 h-16", name: "text-lg", role: "text-sm" },
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = avatarFallback || getInitials(name);

  const AvatarComponent = () => (
    <div
      className={cn(
        sizeStyles[size].avatar,
        "rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center",
        "bg-gradient-to-br from-blue-400 to-blue-600",
        "dark:from-blue-500 dark:to-blue-700",
        "midnight:from-cyan-400 midnight:to-cyan-600",
        "purple:from-pink-400 purple:to-pink-600",
        "text-white font-semibold shadow-lg",
        "shadow-blue-500/20 dark:shadow-blue-600/20 midnight:shadow-cyan-500/20 purple:shadow-pink-500/20"
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={size === "lg" ? 64 : size === "md" ? 48 : 40}
          height={size === "lg" ? 64 : size === "md" ? 48 : 40}
          className="w-full h-full object-cover"
          unoptimized
        />
      ) : (
        <span className={size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"}>
          {initials}
        </span>
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <AvatarComponent />
        <div className="min-w-0">
          <p className={cn(
            "font-medium truncate",
            sizeStyles[size].name,
            "text-gray-900 dark:text-white midnight:text-white purple:text-white"
          )}>
            {name}
          </p>
          {role && (
            <p className={cn(
              "truncate",
              sizeStyles[size].role,
              "text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400"
            )}>
              {role}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <AvatarComponent />
        <div className="min-w-0 flex-1">
          <p className={cn(
            "font-semibold truncate",
            sizeStyles[size].name,
            "text-gray-900 dark:text-white midnight:text-white purple:text-white"
          )}>
            {name}
          </p>
          {role && (
            <p className={cn(
              "truncate",
              sizeStyles[size].role,
              "text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400"
            )}>
              {role}
            </p>
          )}
        </div>
      </div>

      {(email || phone) && (
        <div className="space-y-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
                "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
                "hover:text-primary-600 dark:hover:text-primary-400",
                "midnight:hover:text-cyan-400 purple:hover:text-pink-400"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{email}</span>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
                "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
                "hover:text-primary-600 dark:hover:text-primary-400",
                "midnight:hover:text-cyan-400 purple:hover:text-pink-400"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{phone}</span>
            </a>
          )}
        </div>
      )}

      {actions && <div className="pt-2">{actions}</div>}
    </div>
  );
}
