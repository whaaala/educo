"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import StatCard from "@/components/shared/StatCard";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { getAllParents, getParentStats, getFeeStats, type AdminParent } from "@/lib/mockParents";
import {
  Users,
  UserCheck,
  UserX,
  CreditCard,
  TrendingUp,
  MessageSquare,
  Calendar,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Banknote,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Bell,
} from "lucide-react";

// Quick action card component
interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  color: "blue" | "green" | "purple" | "amber" | "red";
  badge?: string;
}

function QuickActionCard({ icon: Icon, title, description, href, color, badge }: QuickActionCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-700/30 hover:border-blue-400/50",
    green: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-700/30 hover:border-emerald-400/50",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200/50 dark:border-purple-700/30 hover:border-purple-400/50",
    amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-700/30 hover:border-amber-400/50",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/30 hover:border-red-400/50",
  };

  const iconClasses = {
    blue: "bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400",
    green: "bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400",
    purple: "bg-purple-100 dark:bg-purple-800/30 text-purple-600 dark:text-purple-400",
    amber: "bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-400",
    red: "bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400",
  };

  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-4 p-4 rounded-xl border ${colorClasses[color]} hover:shadow-md transition-all duration-200`}
    >
      <div className={`p-3 rounded-xl ${iconClasses[color]} group-hover:scale-105 transition-transform duration-200`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

// Recent activity item component
interface ActivityItemProps {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}

function ActivityItem({ icon: Icon, iconColor, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white text-sm">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{description}</p>
      </div>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  );
}

// Top parent card component
interface TopParentCardProps {
  parent: AdminParent;
  rank: number;
  metric: string;
  value: string;
}

function TopParentCard({ parent, rank, metric, value }: TopParentCardProps) {
  const rankColors = ["bg-amber-500", "bg-gray-400", "bg-orange-600"];

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
      <div className={`w-6 h-6 rounded-full ${rankColors[rank - 1] || "bg-gray-300"} flex items-center justify-center text-white text-xs font-bold`}>
        {rank}
      </div>
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
        {parent.profilePhoto ? (
          <Image src={parent.profilePhoto} alt={`${parent.firstName} ${parent.lastName}`} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Users className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
          {parent.firstName} {parent.lastName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{metric}</p>
      </div>
      <span className="font-bold text-gray-900 dark:text-white text-sm">{value}</span>
    </div>
  );
}

export default function AdminParentDashboardPage() {
  const isPageLoading = usePageLoad(600);
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
  const recentActivities = [
    { icon: CreditCard, iconColor: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", title: "Payment Received", description: "Mrs. Adaeze Okoro paid ₦150,000 for school fees", time: "2 min ago" },
    { icon: Mail, iconColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", title: "New Message", description: "Mr. Chukwuma Eze sent a message about his child", time: "15 min ago" },
    { icon: Users, iconColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400", title: "New Parent Registered", description: "Mrs. Ngozi Okafor registered as a new parent", time: "1 hour ago" },
    { icon: Calendar, iconColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", title: "Event RSVP", description: "5 parents confirmed attendance for Sports Day", time: "2 hours ago" },
    { icon: AlertCircle, iconColor: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400", title: "Fee Overdue", description: "Mr. Emeka Okonkwo has overdue fees of ₦75,000", time: "3 hours ago" },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Dashboard" />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-6 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title="Parents Overview"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: "Parents", href: "/admin/parents" },
              { label: "Overview", isActive: true },
            ]}
          />

          <div className="flex items-center gap-3">
            <Link
              href="/admin/parents"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm transition-all"
            >
              <Users className="w-4 h-4" />
              Manage Parents
            </Link>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
          <StatCard
            icon={Users}
            label="Total Parents"
            value={parentStats.totalParents.toString()}
            color="blue"
            badge={`${parentStats.activeParents} Active`}
          />
          <StatCard
            icon={UserCheck}
            label="Active Parents"
            value={parentStats.activeParents.toString()}
            color="green"
          />
          <StatCard
            icon={Banknote}
            label="Total Children"
            value={parentStats.totalChildren.toString()}
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="Collection Rate"
            value={`${parentStats.collectionRate}%`}
            color={parentStats.collectionRate >= 80 ? "green" : parentStats.collectionRate >= 50 ? "amber" : "red"}
          />
        </div>

        {/* Fee Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
          <StatCard
            icon={CreditCard}
            label="Total Fees"
            value={money(feeStats.totalFees)}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Collected"
            value={money(feeStats.totalCollected)}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Outstanding"
            value={money(feeStats.totalOutstanding)}
            color={feeStats.totalOutstanding > 0 ? "red" : "green"}
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={feeStats.overdueCount.toString()}
            color={feeStats.overdueCount > 0 ? "red" : "gray"}
            badge={feeStats.overdueCount > 0 ? "Action Required" : undefined}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-200 ease-out">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickActionCard
              icon={Users}
              title="All Parents"
              description="View and manage parent profiles"
              href="/admin/parents"
              color="blue"
            />
            <QuickActionCard
              icon={CreditCard}
              title="Fee Records"
              description="Track payment status"
              href="/admin/parents/fees"
              color="green"
              badge={feeStats.overdueCount > 0 ? feeStats.overdueCount.toString() : undefined}
            />
            <QuickActionCard
              icon={MessageSquare}
              title="Messages"
              description="Parent communications"
              href="/admin/parents/messages"
              color="purple"
              badge={metrics.unreadMessages > 0 ? metrics.unreadMessages.toString() : undefined}
            />
            <QuickActionCard
              icon={Calendar}
              title="Events"
              description="Manage parent events"
              href="/admin/parents/events"
              color="amber"
            />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-250 ease-out">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <Link
                href="/admin/parents"
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="p-4">
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Top Parents */}
          <div className="space-y-6">
            {/* By Children */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-white">Most Children</h2>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {metrics.topByChildren.map((parent, index) => (
                  <TopParentCard
                    key={parent.id}
                    parent={parent}
                    rank={index + 1}
                    metric="Children"
                    value={parent.children.length.toString()}
                  />
                ))}
              </div>
            </div>

            {/* By Outstanding Fees */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-white">Highest Outstanding</h2>
                </div>
                <Link
                  href="/admin/parents/fees?sort=highest_balance"
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="p-4 space-y-2">
                {metrics.topByFees.filter(p => p.totalOutstandingFees > 0).map((parent, index) => (
                  <TopParentCard
                    key={parent.id}
                    parent={parent}
                    rank={index + 1}
                    metric="Outstanding"
                    value={money(parent.totalOutstandingFees)}
                  />
                ))}
                {metrics.topByFees.filter(p => p.totalOutstandingFees > 0).length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No outstanding fees</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-300 ease-out">
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
      </div>
    </MainLayout>
  );
}
