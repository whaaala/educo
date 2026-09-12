"use client";

import MainLayout from "@/components/layout/MainLayout";
import DashboardPageBase, {
  type DashboardPageBaseProps,
} from "@/components/pages/DashboardPageBase";

export type DashboardPageProps<T = unknown> = DashboardPageBaseProps<T>;

export default function DashboardPage<T = unknown>(props: DashboardPageProps<T>) {
  return (
    <MainLayout>
      <DashboardPageBase {...props} />
    </MainLayout>
  );
}
