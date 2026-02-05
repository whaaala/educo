"use client";

import Sidebar, { type MenuItem } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  LayoutDashboard,
  Building2,
  Plus,
  Settings,
  GraduationCap,
  Globe,
  ToggleLeft,
  CreditCard,
} from "lucide-react";

const adminMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/",
  },
  {
    id: "tenant-management",
    label: "Tenant Management",
    icon: <Building2 className="w-5 h-5" />,
    children: [
      {
        id: "all-tenants",
        label: "All Schools",
        icon: <Building2 className="w-4 h-4" />,
        href: "/tenants",
      },
      {
        id: "create-tenant",
        label: "Create School",
        icon: <Plus className="w-4 h-4" />,
        href: "/tenants/create",
      },
    ],
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: <Settings className="w-5 h-5" />,
    children: [
      {
        id: "school-profile",
        label: "School Profile",
        icon: <GraduationCap className="w-4 h-4" />,
        href: "/school-profile",
      },
      {
        id: "regional",
        label: "Regional Settings",
        icon: <Globe className="w-4 h-4" />,
        href: "/regional-settings",
      },
      {
        id: "feature-flags",
        label: "Feature Flags",
        icon: <ToggleLeft className="w-4 h-4" />,
        href: "/feature-flags",
      },
      {
        id: "subscription",
        label: "Subscription & Plans",
        icon: <CreditCard className="w-4 h-4" />,
        href: "/subscription",
      },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isCollapsed, setIsCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebar();

  const sidebarWidth = isCollapsed ? "80px" : "288px";

  return (
    <div
      className="flex h-screen bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] transition-colors duration-300"
      style={{ '--sidebar-width': sidebarWidth } as React.CSSProperties}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        customMenuItems={adminMenuItems}
        showTenantSwitcher={false}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-500 relative z-0 lg:z-10 h-screen overflow-hidden ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <Header
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto pt-4 px-4 pb-4 lg:pt-6 lg:px-8 lg:pb-6">{children}</main>
      </div>
    </div>
  );
}
