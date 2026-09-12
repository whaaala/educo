"use client";

import AdminLayout from "@admin/components/layout/AdminLayout";
import DashboardPageBase, {
  type DashboardPageBaseProps,
} from "@/components/pages/DashboardPageBase";

export type AdminDashboardPageProps<T = unknown> = DashboardPageBaseProps<T>;

export default function AdminDashboardPage<T = unknown>(props: AdminDashboardPageProps<T>) {
  return (
    <AdminLayout>
      <DashboardPageBase {...props} />
    </AdminLayout>
  );
}

