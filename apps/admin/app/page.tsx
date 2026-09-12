"use client";

import AdminDashboardPage from "@admin/components/pages/AdminDashboardPage";
import { getAllTenants } from "@/lib/mockTenants";
import { Building2, Plus, ToggleLeft, Globe } from "lucide-react";

export default function AdminDashboard() {
  const tenants = getAllTenants();
  const activeTenants = tenants.filter((t) => t.status === "Active");
  const trialTenants = tenants.filter((t) => t.status === "Trial");

  return (
    <AdminDashboardPage
      title="Admin Console"
      loadingText="Loading Admin Console"
      breadcrumbs={[{ label: "Admin Console", isActive: true }]}
      data={tenants}
      primaryStats={[
        {
          icon: Building2,
          label: "Total Schools",
          color: "blue",
          getValue: (data) => data.length,
          href: "/tenants",
        },
        {
          icon: Building2,
          label: "Active",
          color: "green",
          getValue: () => activeTenants.length,
          href: "/tenants",
        },
        {
          icon: Building2,
          label: "Trial",
          color: "orange",
          getValue: () => trialTenants.length,
          href: "/tenants",
        },
        {
          icon: ToggleLeft,
          label: "Total Features",
          color: "purple",
          getValue: () => 42,
          href: "/feature-flags",
        },
      ]}
      quickActions={[
        {
          icon: Plus,
          title: "Create School",
          description: "Set up a new tenant",
          href: "/tenants/create",
          color: "blue",
        },
        {
          icon: ToggleLeft,
          title: "Feature Flags",
          description: "Manage tenant features",
          href: "/feature-flags",
          color: "purple",
        },
        {
          icon: Globe,
          title: "Regional Settings",
          description: "Country, language, currency",
          href: "/regional-settings",
          color: "green",
        },
      ]}
      statsColumns={{ default: 2, sm: 2, md: 4 }}
      quickActionsColumns={{ default: 1, sm: 2, md: 3 }}
    />
  );
}
