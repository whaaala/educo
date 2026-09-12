"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DetailPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export function DetailPageHeader({
  title,
  subtitle,
  breadcrumbs,
  backHref,
  backLabel = "Back",
  actions,
  icon,
  badge,
}: DetailPageHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2.5 text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 midnight:text-gray-600 purple:text-gray-600" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className={cn(
                    "px-1 transition-colors",
                    "text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
                    "hover:text-primary-600 dark:hover:text-primary-400",
                    "midnight:hover:text-cyan-400 purple:hover:text-pink-400"
                  )}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="px-1 text-gray-900 dark:text-white midnight:text-white purple:text-white font-medium">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Back Button */}
      {backHref && (
        <Link
          href={backHref}
          className={cn(
            "mt-2 inline-flex items-center gap-2 text-sm transition-colors group",
            "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
            "hover:text-primary-600 dark:hover:text-primary-400",
            "midnight:hover:text-cyan-400 purple:hover:text-pink-400"
          )}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>{backLabel}</span>
        </Link>
      )}

      {/* Title Section */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {icon && (
            <div className={cn(
              "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white",
              "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25",
              "midnight:from-cyan-500 midnight:to-cyan-600 midnight:shadow-cyan-500/25",
              "purple:from-pink-500 purple:to-pink-600 purple:shadow-pink-500/25"
            )}>
              <span className="[&>svg]:w-6 [&>svg]:h-6" style={{ color: 'white' }}>
                {icon}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white midnight:text-white purple:text-white">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className="mt-1 text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
