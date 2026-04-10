"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardPage from "@/components/pages/DashboardPage";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { DashboardProvider, adminDashboardConfig } from "@/contexts/DashboardContext";
import { getAllParents, getParentStats, getFeeStats, type AdminParent } from "@/lib/mockParents";
import {
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  MessageSquare,
  Calendar,
  AlertCircle,
  Banknote,
  Clock,
  CheckCircle2,
  Mail,
  BarChart3,
  PieChart,
  Activity,
  Bell,
} from "lucide-react";
import type { QuickActionConfig, StatCardConfig } from "@/types/components";
import {
  WidgetGrid,
  ActivityWidget,
  ListWidget,
  StatsWidget,
  type ActivityWidgetItem,
  type ListWidgetItem,
  type StatItem,
  type WidgetDefinition,
} from "@/components/widgets";

// ============================================================================
// Constants
// ============================================================================

const WIDGET_ORDER_KEY = "educo.admin.parents.dashboard.widgetOrder";
const DEFAULT_WIDGET_ORDER = ["activity", "topChildren", "outstanding", "feeDistribution", "parentStatus", "engagement", "quickStats"];

export default function AdminParentDashboardPage() {
  const { settings } = useSchoolSettings();
  const [isMounted, setIsMounted] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(DEFAULT_WIDGET_ORDER);

  // Mount effect - for hydration safety and load widget order
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(WIDGET_ORDER_KEY);
    if (saved) {
      try {
        setWidgetOrder(JSON.parse(saved));
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  // Save widget order when it changes
  const handleOrderChange = (newOrder: string[]) => {
    setWidgetOrder(newOrder);
    localStorage.setItem(WIDGET_ORDER_KEY, JSON.stringify(newOrder));
  };

  // Currency formatter
  const currencyCode = settings.currency || "NGN";
  const money = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });
    return (amount: number) => formatter.format(amount);
  }, [currencyCode]);

  // Get data
  const parents = useMemo(() => getAllParents(), []);
  const parentStats = useMemo(() => getParentStats(), []);
  const feeStats = useMemo(() => getFeeStats(), []);

  // Calculate additional metrics
  const metrics = useMemo(() => {
    const unreadMessages = 12; // Mock data
    const pendingRSVPs = 8; // Mock data
    const overduePayments = feeStats.overdueCount;
    const upcomingEvents = 3; // Mock data

    // Top parents by children count
    const topByChildren = [...parents].sort((a, b) => b.children.length - a.children.length).slice(0, 3);

    // Top parents by outstanding fees
    const topByFees = [...parents].sort((a, b) => b.totalOutstandingFees - a.totalOutstandingFees).slice(0, 3);

    return {
      unreadMessages,
      pendingRSVPs,
      overduePayments,
      upcomingEvents,
      topByChildren,
      topByFees,
    };
  }, [parents, feeStats]);

  // Recent activity items for ActivityWidget
  const activityItems = useMemo<ActivityWidgetItem[]>(() => {
    return [
      { id: "ra-1", icon: CreditCard, iconColor: "green", title: "Payment Received", description: "Mrs. Adaeze Okoro paid ₦150,000 for school fees", timestamp: "2 min ago" },
      { id: "ra-2", icon: Mail, iconColor: "blue", title: "New Message", description: "Mr. Chukwuma Eze sent a message about his child", timestamp: "15 min ago" },
      { id: "ra-3", icon: Users, iconColor: "purple", title: "New Parent Registered", description: "Mrs. Ngozi Okafor registered as a new parent", timestamp: "1 hour ago" },
      { id: "ra-4", icon: Calendar, iconColor: "amber", title: "Event RSVP", description: "5 parents confirmed attendance for Sports Day", timestamp: "2 hours ago" },
      { id: "ra-5", icon: AlertCircle, iconColor: "red", title: "Fee Overdue", description: "Mr. Emeka Okonkwo has overdue fees of ₦75,000", timestamp: "3 hours ago" },
    ];
  }, []);

  // Top children list items for ListWidget
  const topChildrenItems = useMemo<ListWidgetItem[]>(() => {
    return metrics.topByChildren.map((parent) => ({
      id: parent.id,
      primary: `${parent.firstName} ${parent.lastName}`,
      secondary: `${parent.children.length} ${parent.children.length === 1 ? "child" : "children"}`,
      left: parent.profilePhoto ? (
        <img src={parent.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
        </div>
      ),
      right: (
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">{parent.children.length}</span>
      ),
      href: `/admin/parents/${parent.id}`,
    }));
  }, [metrics.topByChildren]);

  // Outstanding fees list items for ListWidget
  const outstandingItems = useMemo<ListWidgetItem[]>(() => {
    return metrics.topByFees
      .filter((p) => p.totalOutstandingFees > 0)
      .map((parent) => ({
        id: parent.id,
        primary: `${parent.firstName} ${parent.lastName}`,
        secondary: "Outstanding balance",
        left: parent.profilePhoto ? (
          <img src={parent.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
          </div>
        ),
        right: (
          <span className="text-sm font-bold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">{money(parent.totalOutstandingFees)}</span>
        ),
        href: `/admin/parents/${parent.id}`,
        variant: "danger" as const,
      }));
  }, [metrics.topByFees, money]);

  // Fee distribution stats
  const feeDistributionStats = useMemo<StatItem[]>(() => [
    { id: "paid", label: "Paid", value: feeStats.paidCount, variant: "success" },
    { id: "partial", label: "Partial", value: feeStats.partialCount, variant: "warning" },
    { id: "pending", label: "Pending", value: feeStats.pendingCount, variant: "primary" },
    { id: "overdue", label: "Overdue", value: feeStats.overdueCount, variant: "danger" },
  ], [feeStats]);

  // Parent status stats
  const parentStatusStats = useMemo<StatItem[]>(() => [
    { id: "active", label: "Active", value: parentStats.activeParents, variant: "success" },
    { id: "inactive", label: "Inactive", value: parentStats.inactiveParents, variant: "default" },
  ], [parentStats]);

  // Engagement stats
  const engagementStats = useMemo<StatItem[]>(() => [
    { id: "messages", label: "Unread Messages", value: metrics.unreadMessages, variant: "primary" },
    { id: "rsvps", label: "Pending RSVPs", value: metrics.pendingRSVPs, variant: "warning" },
    { id: "events", label: "Upcoming Events", value: metrics.upcomingEvents, variant: "default" },
  ], [metrics]);

  // Widget definitions for the grid
  const widgets = useMemo<WidgetDefinition[]>(() => [
    {
      id: "activity",
      title: "Recent Activity",
      content: (
        <ActivityWidget
          title="Recent Activity"
          icon={<Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
          colorScheme="blue"
          items={activityItems}
          maxItems={5}
          viewAllHref="/admin/parents"
        />
      ),
    },
    {
      id: "topChildren",
      title: "Most Children",
      content: (
        <ListWidget
          title="Most Children"
          icon={<Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
          colorScheme="violet"
          items={topChildrenItems}
          maxItems={3}
        />
      ),
    },
    {
      id: "outstanding",
      title: "Highest Outstanding",
      content: outstandingItems.length > 0 ? (
        <ListWidget
          title="Highest Outstanding"
          icon={<AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />}
          colorScheme="red"
          items={outstandingItems}
          maxItems={3}
          viewAllHref="/admin/parents/fees?sort=highest_balance"
        />
      ) : (
        <ListWidget
          title="Highest Outstanding"
          icon={<AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />}
          colorScheme="green"
          items={[]}
          emptyIcon={<CheckCircle2 className="w-10 h-10 text-green-500" />}
          emptyTitle="All Clear!"
          emptyDescription="No outstanding fees"
        />
      ),
    },
    {
      id: "feeDistribution",
      title: "Fee Status Distribution",
      content: (
        <StatsWidget
          title="Fee Status"
          icon={<PieChart className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
          colorScheme="cyan"
          stats={feeDistributionStats}
          columns={2}
        />
      ),
    },
    {
      id: "parentStatus",
      title: "Parent Status",
      content: (
        <StatsWidget
          title="Parent Status"
          icon={<BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          colorScheme="emerald"
          stats={parentStatusStats}
          columns={2}
        />
      ),
    },
    {
      id: "engagement",
      title: "Engagement",
      content: (
        <StatsWidget
          title="Engagement"
          icon={<Bell className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />}
          colorScheme="amber"
          stats={engagementStats}
          columns={3}
        />
      ),
    },
    {
      id: "quickStats",
      title: "Quick Stats",
      content: (
        <StatsWidget
          title="Collection Rate"
          icon={<TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
          colorScheme="blue"
          stats={[
            {
              id: "rate",
              label: "Fee Collection Rate",
              value: `${parentStats.collectionRate}%`,
              variant: parentStats.collectionRate >= 80 ? "success" : parentStats.collectionRate >= 50 ? "warning" : "danger",
            },
            {
              id: "outstanding",
              label: "With Outstanding",
              value: parentStats.parentsWithOutstanding,
              variant: "default",
            },
          ]}
          columns={2}
        />
      ),
    },
  ], [activityItems, topChildrenItems, outstandingItems, feeDistributionStats, parentStatusStats, engagementStats, parentStats]);

  // Primary stats for DashboardPage header
  const primaryStats = useMemo<StatCardConfig<AdminParent>[]>(() => {
    const collectionColor = parentStats.collectionRate >= 80 ? "green" : parentStats.collectionRate >= 50 ? "amber" : "red";

    return [
      {
        icon: Users,
        label: "Total Parents",
        getValue: () => parentStats.totalParents,
        color: "blue",
        href: "/admin/parents",
        getBadge: () => `${parentStats.activeParents} Active`,
      },
      {
        icon: UserCheck,
        label: "Active Parents",
        getValue: () => parentStats.activeParents,
        color: "green",
      },
      {
        icon: Banknote,
        label: "Total Children",
        getValue: () => parentStats.totalChildren,
        color: "purple",
      },
      {
        icon: TrendingUp,
        label: "Collection Rate",
        getValue: () => `${parentStats.collectionRate}%`,
        color: collectionColor,
      },
    ];
  }, [parentStats]);

  // Secondary stats for DashboardPage header
  const secondaryStats = useMemo<StatCardConfig<AdminParent>[]>(() => {
    return [
      {
        icon: CreditCard,
        label: "Total Fees",
        getValue: () => money(feeStats.totalFees),
        color: "blue",
        href: "/admin/parents/fees",
      },
      {
        icon: CheckCircle2,
        label: "Collected",
        getValue: () => money(feeStats.totalCollected),
        color: "green",
      },
      {
        icon: Clock,
        label: "Outstanding",
        getValue: () => money(feeStats.totalOutstanding),
        color: feeStats.totalOutstanding > 0 ? "red" : "green",
      },
      {
        icon: AlertCircle,
        label: "Overdue",
        getValue: () => feeStats.overdueCount,
        color: feeStats.overdueCount > 0 ? "red" : "gray",
        getBadge: () => (feeStats.overdueCount > 0 ? "Action Required" : undefined),
      },
    ];
  }, [feeStats, money]);

  // Quick actions for DashboardPage
  const quickActions = useMemo<QuickActionConfig[]>(() => {
    return [
      {
        icon: Users,
        title: "All Parents",
        description: "View and manage parent profiles",
        href: "/admin/parents",
        color: "blue",
      },
      {
        icon: CreditCard,
        title: "Fee Records",
        description: "Track payment status",
        href: "/admin/parents/fees",
        color: "green",
        badge: feeStats.overdueCount > 0 ? feeStats.overdueCount : undefined,
      },
      {
        icon: MessageSquare,
        title: "Messages",
        description: "Parent communications",
        href: "/admin/parents/messages",
        color: "purple",
        badge: metrics.unreadMessages > 0 ? metrics.unreadMessages : undefined,
      },
      {
        icon: Calendar,
        title: "Events",
        description: "Manage parent events",
        href: "/admin/parents/events",
        color: "amber",
        badge: metrics.pendingRSVPs > 0 ? metrics.pendingRSVPs : undefined,
      },
    ];
  }, [feeStats.overdueCount, metrics.pendingRSVPs, metrics.unreadMessages]);

  // Widget grid as footer content
  const footerContent = useMemo(() => {
    if (!isMounted) return null;

    return (
      <DashboardProvider config={adminDashboardConfig}>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-3">
            Dashboard Widgets
            <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
              (Drag to reorder)
            </span>
          </h3>
          <WidgetGrid
            widgets={widgets}
            order={widgetOrder}
            onOrderChange={handleOrderChange}
            columns={{ sm: 2, lg: 3, "2xl": 4 }}
          />
        </div>
      </DashboardProvider>
    );
  }, [isMounted, widgets, widgetOrder]);

  // Prevent hydration mismatch from locale-dependent formatting
  if (!isMounted) return null;

  return (
    <DashboardPage<AdminParent>
      title="Parents Overview"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin" },
        { label: "Parents", href: "/admin/parents" },
        { label: "Overview", isActive: true },
      ]}
      data={parents}
      primaryStats={primaryStats}
      secondaryStats={secondaryStats}
      quickActions={quickActions}
      headerActions={[{ label: "Manage Parents", href: "/admin/parents", icon: Users }]}
      footerContent={footerContent}
      pageLoadDuration={600}
      loadingText="Loading Dashboard"
    />
  );
}
