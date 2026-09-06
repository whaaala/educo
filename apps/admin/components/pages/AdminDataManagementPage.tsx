"use client";

import AdminLayout from "@admin/components/layout/AdminLayout";
import DataManagementPageBase, {
  type DataManagementPageBaseProps,
} from "@/components/pages/DataManagementPageBase";

// An alias, not an extension — see components/pages/DataManagementPage.tsx.
export type AdminDataManagementPageProps<T> = DataManagementPageBaseProps<T>;

export default function AdminDataManagementPage<T>(props: AdminDataManagementPageProps<T>) {
  return (
    <AdminLayout>
      <DataManagementPageBase {...props} />
    </AdminLayout>
  );
}

