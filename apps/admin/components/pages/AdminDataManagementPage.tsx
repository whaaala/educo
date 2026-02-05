"use client";

import AdminLayout from "@admin/components/layout/AdminLayout";
import DataManagementPageBase, {
  type DataManagementPageBaseProps,
} from "@/components/pages/DataManagementPageBase";

export interface AdminDataManagementPageProps<T> extends DataManagementPageBaseProps<T> {}

export default function AdminDataManagementPage<T>(props: AdminDataManagementPageProps<T>) {
  return (
    <AdminLayout>
      <DataManagementPageBase {...props} />
    </AdminLayout>
  );
}

