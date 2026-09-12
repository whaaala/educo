"use client";

import MainLayout from "@/components/layout/MainLayout";
import DataManagementPageBase, {
  type DataManagementPageBaseProps,
} from "@/components/pages/DataManagementPageBase";

// An alias, not an extension: it adds no members, and an empty `extends` interface is the shape ESLint flags
// because it reads as "this will grow" when it never does.
export type DataManagementPageProps<T> = DataManagementPageBaseProps<T>;

export default function DataManagementPage<T>(props: DataManagementPageProps<T>) {
  return (
    <MainLayout>
      <DataManagementPageBase {...props} />
    </MainLayout>
  );
}
