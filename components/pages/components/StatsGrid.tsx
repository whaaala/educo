"use client";

import StatCard, { type StatCardColor } from "@/components/shared/StatCard";
import type { StatCardConfig, ColorVariant } from "@/types/components";

export interface StatsGridProps<T> {
  /** Stats configuration array */
  stats: StatCardConfig<T>[];
  /** Data to compute stats from */
  data: T[];
  /** Grid columns for different breakpoints */
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Animation delay between cards (in ms) */
  animationDelay?: number;
  /** Gap between cards */
  gap?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
}

// Map color variants to StatCard colors
const colorMap: Record<ColorVariant, StatCardColor> = {
  blue: "blue",
  green: "green",
  red: "red",
  orange: "orange",
  purple: "purple",
  amber: "amber",
  indigo: "indigo",
  teal: "teal",
  pink: "pink",
  gray: "gray",
};

// Gap size classes
const gapClasses = {
  sm: "gap-2 sm:gap-3",
  md: "gap-3 sm:gap-4",
  lg: "gap-4 sm:gap-6",
};

/**
 * Reusable stats grid component that renders an array of StatCards
 * Fully responsive with configurable columns and animations
 *
 * @example
 * ```tsx
 * <StatsGrid
 *   stats={[
 *     { icon: Users, label: "Total Users", getValue: (data) => data.length, color: "blue" },
 *     { icon: CheckCircle, label: "Active", getValue: (data) => data.filter(u => u.active).length, color: "green" },
 *   ]}
 *   data={users}
 *   columns={{ default: 2, md: 4 }}
 * />
 * ```
 */
export default function StatsGrid<T>({
  stats,
  data,
  columns = { default: 2, sm: 2, md: 4, lg: 4 },
  animationDelay = 100,
  gap = "md",
  className = "",
}: StatsGridProps<T>) {
  // Build responsive grid classes
  const getGridClasses = () => {
    const classes = ["grid"];

    // Default columns
    if (columns.default) {
      classes.push(`grid-cols-${columns.default}`);
    } else {
      classes.push("grid-cols-2");
    }

    // Responsive columns
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);

    // Gap
    classes.push(gapClasses[gap]);

    return classes.join(" ");
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const value = stat.getValue(data);
        const badge = stat.getBadge?.(data);
        const subtitle = stat.getSubtitle?.(data);
        const delay = index * animationDelay;

        return (
          <div
            key={stat.label}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${delay}ms` }}
          >
            <StatCard
              icon={Icon}
              label={stat.label}
              value={String(value)}
              color={colorMap[stat.color] || "blue"}
              badge={badge}
              subtitle={subtitle}
              href={stat.href}
            />
          </div>
        );
      })}
    </div>
  );
}
