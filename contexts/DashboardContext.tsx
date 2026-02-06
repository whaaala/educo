"use client";

import { createContext, useContext, ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export type DashboardRole = "parent" | "teacher" | "admin" | "student" | "staff";

export interface DashboardConfig {
  /** Base path for this dashboard (e.g., "/parents", "/teachers/portal") */
  basePath: string;
  /** Current user role */
  role: DashboardRole;
  /** Storage key prefix for persisting widget order */
  storageKeyPrefix: string;
  /** Optional widget customizations */
  widgets?: {
    meetings?: { title?: string; maxItems?: number };
    messages?: { title?: string; maxItems?: number };
    leaves?: { title?: string; maxItems?: number };
    fees?: { title?: string; maxItems?: number };
    events?: { title?: string; maxItems?: number };
    homework?: { title?: string; maxItems?: number };
    grades?: { title?: string; maxItems?: number };
    notices?: { title?: string; maxItems?: number };
    payments?: { title?: string; maxItems?: number };
  };
}

interface DashboardContextValue extends DashboardConfig {
  /** Generate a link path within this dashboard */
  link: (path: string) => string;
}

// ============================================================================
// Context
// ============================================================================

const DashboardContext = createContext<DashboardContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface DashboardProviderProps {
  config: DashboardConfig;
  children: ReactNode;
}

export function DashboardProvider({ config, children }: DashboardProviderProps) {
  const value: DashboardContextValue = {
    ...config,
    link: (path: string) => {
      // Ensure path starts with /
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${config.basePath}${cleanPath}`;
    },
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

// ============================================================================
// Optional Hook (doesn't throw if not in provider)
// ============================================================================

export function useDashboardOptional() {
  return useContext(DashboardContext);
}

// ============================================================================
// Default configs for different dashboards
// ============================================================================

export const parentDashboardConfig: DashboardConfig = {
  basePath: "/parents",
  role: "parent",
  storageKeyPrefix: "educo.parents.dashboard",
  widgets: {
    meetings: { title: "Meetings", maxItems: 3 },
    messages: { title: "Messages", maxItems: 3 },
    leaves: { title: "Leave Requests", maxItems: 2 },
    fees: { title: "Fees", maxItems: 2 },
    events: { title: "Events", maxItems: 4 },
    homework: { title: "Homework", maxItems: 3 },
    grades: { title: "Grades", maxItems: 4 },
    notices: { title: "Notices", maxItems: 3 },
    payments: { title: "Payments", maxItems: 3 },
  },
};

export const teacherDashboardConfig: DashboardConfig = {
  basePath: "/teachers/portal",
  role: "teacher",
  storageKeyPrefix: "educo.teachers.dashboard",
  widgets: {
    meetings: { title: "My Meetings", maxItems: 3 },
    messages: { title: "Messages", maxItems: 3 },
    leaves: { title: "Leave Requests", maxItems: 3 },
  },
};

export const adminDashboardConfig: DashboardConfig = {
  basePath: "/admin",
  role: "admin",
  storageKeyPrefix: "educo.admin.dashboard",
};
