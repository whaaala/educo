"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import StatCard from "@/components/shared/StatCard";
import { usePageLoad } from "@/hooks/usePageLoad";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type {
  BreadcrumbItem,
  StatCardConfig,
  QuickActionConfig,
  ActivityItem,
  DashboardListItem,
  DashboardWidget,
  ColorVariant,
} from "@/types/components";

export interface DashboardPageProps<T = unknown> {
  /** Page title */
  title: string;
  /** Breadcrumb navigation items */
  breadcrumbs: BreadcrumbItem[];
  /** Data to compute stats from */
  data?: T[];

  // Stats
  /** Primary stats row (top row) */
  primaryStats?: StatCardConfig<T>[];
  /** Secondary stats row (optional second row) */
  secondaryStats?: StatCardConfig<T>[];
  /** Stats grid column configuration */
  statsColumns?: { default?: number; sm?: number; md?: number; lg?: number };

  // Quick Actions
  /** Quick action cards */
  quickActions?: QuickActionConfig[];
  /** Quick actions grid columns */
  quickActionsColumns?: { default?: number; sm?: number; md?: number; lg?: number };

  // Widgets
  /** Left column widgets */
  leftColumn?: DashboardWidget[];
  /** Right column widgets */
  rightColumn?: DashboardWidget[];

  // Header Actions
  /** Header action buttons */
  headerActions?: { label: string; href: string; icon?: LucideIcon }[];

  // Custom Content
  /** Custom content below stats */
  afterStats?: ReactNode;
  /** Custom content at the bottom */
  footerContent?: ReactNode;
  /** Children (additional content) */
  children?: ReactNode;

  // Styling
  /** Additional className */
  className?: string;
  /** Page load animation duration */
  pageLoadDuration?: number;
}

// Color configurations for quick action cards
const quickActionColors: Record<ColorVariant, { bg: string; iconBg: string; hover: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-800/50 midnight:bg-cyan-800/50 purple:bg-blue-800/50",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30 midnight:hover:bg-cyan-900/30 purple:hover:bg-blue-900/30",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20 midnight:bg-emerald-900/20 purple:bg-green-900/20",
    iconBg: "bg-green-100 dark:bg-green-800/50 midnight:bg-emerald-800/50 purple:bg-green-800/50",
    hover: "hover:bg-green-100 dark:hover:bg-green-900/30 midnight:hover:bg-emerald-900/30 purple:hover:bg-green-900/30",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20 midnight:bg-violet-900/20 purple:bg-purple-900/20",
    iconBg: "bg-purple-100 dark:bg-purple-800/50 midnight:bg-violet-800/50 purple:bg-purple-800/50",
    hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30 midnight:hover:bg-violet-900/30 purple:hover:bg-purple-900/30",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20",
    iconBg: "bg-amber-100 dark:bg-amber-800/50 midnight:bg-amber-800/50 purple:bg-amber-800/50",
    hover: "hover:bg-amber-100 dark:hover:bg-amber-900/30 midnight:hover:bg-amber-900/30 purple:hover:bg-amber-900/30",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20",
    iconBg: "bg-red-100 dark:bg-red-800/50 midnight:bg-red-800/50 purple:bg-red-800/50",
    hover: "hover:bg-red-100 dark:hover:bg-red-900/30 midnight:hover:bg-red-900/30 purple:hover:bg-red-900/30",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    iconBg: "bg-orange-100 dark:bg-orange-800/50",
    hover: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    iconBg: "bg-indigo-100 dark:bg-indigo-800/50",
    hover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    iconBg: "bg-teal-100 dark:bg-teal-800/50",
    hover: "hover:bg-teal-100 dark:hover:bg-teal-900/30",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/20",
    iconBg: "bg-pink-100 dark:bg-pink-800/50",
    hover: "hover:bg-pink-100 dark:hover:bg-pink-900/30",
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-800/50",
    iconBg: "bg-gray-100 dark:bg-gray-700",
    hover: "hover:bg-gray-100 dark:hover:bg-gray-700/50",
  },
};

// Activity item icon colors
const activityIconColors: Record<ColorVariant, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
};

/**
 * Reusable dashboard page component with stats, quick actions, and widget layout
 * Fully responsive for all screen sizes
 *
 * @example
 * ```tsx
 * <DashboardPage
 *   title="Parents Dashboard"
 *   breadcrumbs={[{ label: "Admin" }, { label: "Dashboard", isActive: true }]}
 *   data={parents}
 *   primaryStats={parentStats}
 *   quickActions={quickActions}
 *   leftColumn={[{ type: "activity", title: "Recent Activity", activityItems }]}
 *   rightColumn={[{ type: "list", title: "Top Parents", listItems }]}
 * />
 * ```
 */
export default function DashboardPage<T = unknown>({
  title,
  breadcrumbs,
  data = [] as T[],
  primaryStats,
  secondaryStats,
  statsColumns = { default: 2, sm: 2, md: 4 },
  quickActions,
  quickActionsColumns = { default: 2, sm: 2, md: 4 },
  leftColumn,
  rightColumn,
  headerActions,
  afterStats,
  footerContent,
  children,
  className = "",
  pageLoadDuration = 600,
}: DashboardPageProps<T>) {
  const isPageLoading = usePageLoad(pageLoadDuration);

  // Render stat card
  const renderStatCard = (stat: StatCardConfig<T>, index: number) => {
    const value = stat.getValue(data);
    const badge = stat.getBadge?.(data);
    const subtitle = stat.getSubtitle?.(data);

    return (
      <div
        key={stat.label}
        className="animate-in fade-in slide-in-from-bottom-2 duration-500"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <StatCard
          icon={stat.icon}
          label={stat.label}
          value={String(value)}
          color={stat.color}
          badge={badge}
          subtitle={subtitle}
          href={stat.href}
        />
      </div>
    );
  };

  // Render quick action card
  const renderQuickAction = (action: QuickActionConfig, index: number) => {
    const Icon = action.icon;
    const colors = quickActionColors[action.color] || quickActionColors.blue;

    return (
      <Link
        key={action.title}
        href={action.href}
        className={`
          relative p-4 rounded-xl border border-gray-200 dark:border-gray-700
          midnight:border-cyan-700/30 purple:border-pink-700/30
          ${colors.bg} ${colors.hover}
          transition-all duration-200 group
          animate-in fade-in slide-in-from-bottom-2 duration-500
        `}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {action.badge !== undefined && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
            {action.badge}
          </span>
        )}
        <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center mb-3`}>
          <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mb-1">
          {action.title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          {action.description}
        </p>
        <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
      </Link>
    );
  };

  // Render widget
  const renderWidget = (widget: DashboardWidget, index: number) => {
    const Icon = widget.icon;

    return (
      <div
        key={widget.title}
        className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500"
        style={{ animationDelay: `${index * 150}ms` }}
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
            <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
              {widget.title}
            </h3>
          </div>
          {widget.viewAllLink && (
            <Link
              href={widget.viewAllLink}
              className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
            >
              View All
            </Link>
          )}
        </div>

        {/* Widget Content */}
        <div className="p-4">
          {widget.type === "activity" && widget.activityItems && (
            <div className="space-y-4">
              {widget.activityItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activityIconColors[item.iconColor]}`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {widget.type === "list" && widget.listItems && (
            <div className="space-y-3">
              {widget.listItems.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                      {i + 1}
                    </span>
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.title} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: item.avatarColor || "#3b82f6" }}
                      >
                        {item.title.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {widget.type === "custom" && widget.customComponent}
        </div>
      </div>
    );
  };

  // Build grid classes
  const getGridClasses = (cols: { default?: number; sm?: number; md?: number; lg?: number }) => {
    const classes = ["grid gap-4"];
    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    else classes.push("grid-cols-2");
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    return classes.join(" ");
  };

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} />

      <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${className}`}>
        {/* Page Header */}
        <PageHeader
          title={title}
          breadcrumbs={breadcrumbs}
          actions={
            headerActions && headerActions.length > 0 ? (
              <div className="flex items-center gap-2">
                {headerActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            ) : undefined
          }
        />

        {/* Primary Stats */}
        {primaryStats && primaryStats.length > 0 && (
          <div className={`mt-6 ${getGridClasses(statsColumns)}`}>
            {primaryStats.map((stat, i) => renderStatCard(stat, i))}
          </div>
        )}

        {/* Secondary Stats */}
        {secondaryStats && secondaryStats.length > 0 && (
          <div className={`mt-4 ${getGridClasses(statsColumns)}`}>
            {secondaryStats.map((stat, i) => renderStatCard(stat, i + (primaryStats?.length || 0)))}
          </div>
        )}

        {/* After Stats Content */}
        {afterStats}

        {/* Quick Actions */}
        {quickActions && quickActions.length > 0 && (
          <div className={`mt-6 ${getGridClasses(quickActionsColumns)}`}>
            {quickActions.map((action, i) => renderQuickAction(action, i))}
          </div>
        )}

        {/* Two Column Widget Layout */}
        {(leftColumn || rightColumn) && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3) */}
            {leftColumn && (
              <div className="lg:col-span-2 space-y-6">
                {leftColumn.map((widget, i) => renderWidget(widget, i))}
              </div>
            )}

            {/* Right Column (1/3) */}
            {rightColumn && (
              <div className="space-y-6">
                {rightColumn.map((widget, i) => renderWidget(widget, i + (leftColumn?.length || 0)))}
              </div>
            )}
          </div>
        )}

        {/* Footer Content */}
        {footerContent}

        {/* Children */}
        {children}
      </div>
    </MainLayout>
  );
}
