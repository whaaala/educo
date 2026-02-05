"use client";

import MainLayout from "@/components/layout/MainLayout";
import DataManagementPageBase, {
  type DataManagementPageBaseProps,
} from "@/components/pages/DataManagementPageBase";

export interface DataManagementPageProps<T> extends DataManagementPageBaseProps<T> {}

export default function DataManagementPage<T>(props: DataManagementPageProps<T>) {
  return (
    <MainLayout>
      <DataManagementPageBase {...props} />
    </MainLayout>
  );
}
