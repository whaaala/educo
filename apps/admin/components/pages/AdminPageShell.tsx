"use client";

import { type ReactNode } from "react";
import AdminLayout from "@admin/components/layout/AdminLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import type { BreadcrumbItem } from "@/types/components";

export interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  isLoading?: boolean;
  loadingText?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function AdminPageShell({
  title,
  subtitle,
  breadcrumbs,
  isLoading = false,
  loadingText,
  headerActions,
  children,
  className = "",
}: AdminPageShellProps) {
  return (
    <AdminLayout>
      <PageLoader isLoading={isLoading} loadingText={loadingText} />

      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
      >
        <div className="py-4 mb-2">
          <PageHeader
            title={title}
            subtitle={subtitle}
            breadcrumbs={breadcrumbs}
            actions={headerActions}
          />
        </div>

        {children}
      </div>
    </AdminLayout>
  );
}

