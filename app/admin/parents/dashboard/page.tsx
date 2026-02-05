"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardPage from "@/components/pages/DashboardPage";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
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
import type { ActivityItem, DashboardListItem, DashboardWidget, QuickActionConfig, StatCardConfig } from "@/types/components";

export default function AdminParentDashboardPage() {
  const { settings } = useSchoolSettings();
  const [isMounted, setIsMounted] = useState(false);

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

  // Mock recent activities
  const recentActivityItems = useMemo<ActivityItem[]>(() => {
    return [
      { id: "ra-1", icon: CreditCard, iconColor: "green", title: "Payment Received", description: "Mrs. Adaeze Okoro paid ₦150,000 for school fees", timestamp: "2 min ago" },
      { id: "ra-2", icon: Mail, iconColor: "blue", title: "New Message", description: "Mr. Chukwuma Eze sent a message about his child", timestamp: "15 min ago" },
      { id: "ra-3", icon: Users, iconColor: "purple", title: "New Parent Registered", description: "Mrs. Ngozi Okafor registered as a new parent", timestamp: "1 hour ago" },
      { id: "ra-4", icon: Calendar, iconColor: "amber", title: "Event RSVP", description: "5 parents confirmed attendance for Sports Day", timestamp: "2 hours ago" },
      { id: "ra-5", icon: AlertCircle, iconColor: "red", title: "Fee Overdue", description: "Mr. Emeka Okonkwo has overdue fees of ₦75,000", timestamp: "3 hours ago" },
    ];
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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

  const mostChildrenList = useMemo<DashboardListItem[]>(() => {
    return metrics.topByChildren.map((parent) => ({
      id: parent.id,
      title: `${parent.firstName} ${parent.lastName}`,
      subtitle: "Children",
      value: parent.children.length,
      avatar: parent.profilePhoto,
      href: `/admin/parents/${parent.id}`,
    }));
  }, [metrics.topByChildren]);

  const highestOutstandingList = useMemo<DashboardListItem[]>(() => {
    return metrics.topByFees
      .filter((p) => p.totalOutstandingFees > 0)
      .map((parent) => ({
        id: parent.id,
        title: `${parent.firstName} ${parent.lastName}`,
        subtitle: "Outstanding",
        value: money(parent.totalOutstandingFees),
        avatar: parent.profilePhoto,
        href: `/admin/parents/${parent.id}`,
      }));
  }, [metrics.topByFees, money]);

  const leftColumn = useMemo<DashboardWidget[]>(() => {
    return [
      {
        type: "activity",
        title: "Recent Activity",
        icon: Activity,
        viewAllLink: "/admin/parents",
        activityItems: recentActivityItems,
      },
    ];
  }, [recentActivityItems]);

  const rightColumn = useMemo<DashboardWidget[]>(() => {
    const widgets: DashboardWidget[] = [
      {
        type: "list",
        title: "Most Children",
        icon: Users,
        listItems: mostChildrenList,
      },
    ];

    if (highestOutstandingList.length > 0) {
      widgets.push({
        type: "list",
        title: "Highest Outstanding",
        icon: AlertCircle,
        viewAllLink: "/admin/parents/fees?sort=highest_balance",
        listItems: highestOutstandingList,
      });
    } else {
      widgets.push({
        type: "custom",
        title: "Highest Outstanding",
        icon: AlertCircle,
        viewAllLink: "/admin/parents/fees?sort=highest_balance",
        customComponent: (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No outstanding fees</p>
          </div>
        ),
      });
    }

    return widgets;
  }, [highestOutstandingList, mostChildrenList]);

  const footerContent = useMemo(() => {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fee Status Distribution</span>
            <PieChart className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Paid</span>
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{feeStats.paidCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Partial</span>
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{feeStats.partialCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Pending</span>
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{feeStats.pendingCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Overdue</span>
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{feeStats.overdueCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Parent Status</span>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{parentStats.activeParents}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Inactive</span>
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{parentStats.inactiveParents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Engagement</span>
            <Bell className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Unread Messages</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{metrics.unreadMessages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Pending RSVPs</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{metrics.pendingRSVPs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Upcoming Events</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{metrics.upcomingEvents}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-100">Quick Stats</span>
            <TrendingUp className="w-4 h-4 text-blue-200" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold">{parentStats.collectionRate}%</p>
              <p className="text-xs text-blue-100">Fee Collection Rate</p>
            </div>
            <div className="pt-2 border-t border-blue-400/30">
              <p className="text-sm font-semibold">{parentStats.parentsWithOutstanding}</p>
              <p className="text-xs text-blue-100">Parents with outstanding fees</p>
            </div>
          </div>
        </div>
      </div>
    );
  }, [feeStats, metrics.pendingRSVPs, metrics.unreadMessages, metrics.upcomingEvents, parentStats]);

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
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      headerActions={[{ label: "Manage Parents", href: "/admin/parents", icon: Users }]}
      footerContent={footerContent}
      pageLoadDuration={600}
      loadingText="Loading Dashboard"
    />
  );
}
