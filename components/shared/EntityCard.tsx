"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoreVertical, type LucideIcon } from "lucide-react";
import type { RowAction, ColorVariant } from "@/types/components";

export interface EntityCardProps<T> {
  /** The item data */
  item: T;
  /** Function to get unique key */
  getKey: (item: T) => string;
  /** Avatar image URL */
  avatar?: string;
  /** Avatar color (used when no avatar image) */
  avatarColor?: string;
  /** Initials (used when no avatar image) */
  initials?: string;
  /** Primary title */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Secondary info text */
  secondaryInfo?: string;
  /** Badge configuration */
  badge?: {
    text: string;
    color: ColorVariant;
  };
  /** Stats to display */
  stats?: {
    label: string;
    value: string | number;
    color?: ColorVariant;
    icon?: LucideIcon;
  }[];
  /** Row actions */
  actions?: RowAction<T>[];
  /** Whether the card is selected */
  isSelected?: boolean;
  /** Callback when selection changes */
  onSelectionChange?: (selected: boolean) => void;
  /** Callback when action is triggered */
  onAction?: (actionId: string) => void;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Enable selection checkbox */
  enableSelection?: boolean;
  /** Additional className */
  className?: string;
}

// Badge color classes
const badgeColors: Record<ColorVariant, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
  teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
  pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
};

// Stat color classes
const statColors: Record<ColorVariant, string> = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  red: "text-red-600 dark:text-red-400",
  orange: "text-orange-600 dark:text-orange-400",
  purple: "text-purple-600 dark:text-purple-400",
  amber: "text-amber-600 dark:text-amber-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
  teal: "text-teal-600 dark:text-teal-400",
  pink: "text-pink-600 dark:text-pink-400",
  gray: "text-gray-600 dark:text-gray-400",
};

/**
 * Generic entity card component for grid views
 * Fully responsive and customizable for different entity types
 *
 * @example
 * ```tsx
 * <EntityCard
 *   item={feeRecord}
 *   getKey={(item) => item.id}
 *   avatar={`https://i.pravatar.cc/150?u=${feeRecord.childId}`}
 *   title={feeRecord.childName}
 *   subtitle={feeRecord.childClass}
 *   secondaryInfo={`Parent: ${feeRecord.parentName}`}
 *   badge={{ text: feeRecord.status, color: statusColors[feeRecord.status] }}
 *   stats={[
 *     { label: "Balance", value: money(feeRecord.balance), color: "red" },
 *   ]}
 *   actions={rowActions}
 *   isSelected={selectedIds.has(feeRecord.id)}
 *   onSelectionChange={(selected) => handleSelect(feeRecord.id, selected)}
 *   enableSelection
 * />
 * ```
 */
export default function EntityCard<T>({
  item,
  getKey,
  avatar,
  avatarColor,
  initials,
  title,
  subtitle,
  secondaryInfo,
  badge,
  stats,
  actions,
  isSelected = false,
  onSelectionChange,
  onAction,
  onClick,
  enableSelection = true,
  className = "",
}: EntityCardProps<T>) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"top" | "bottom">("bottom");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Calculate menu position
  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showMenu && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMenuPosition(spaceBelow < 200 ? "top" : "bottom");
    }
    setShowMenu(!showMenu);
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Get visible actions
  const visibleActions = actions?.filter((action) =>
    action.condition ? action.condition(item) : true
  );

  return (
    <div
      ref={cardRef}
      className={`
        relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900
        rounded-xl border transition-all duration-200
        ${
          isSelected
            ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-500 purple:border-pink-500 ring-2 ring-blue-500/20"
            : "border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-gray-300 dark:hover:border-gray-600"
        }
        ${onClick ? "cursor-pointer hover:shadow-md" : ""}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      {enableSelection && onSelectionChange && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectionChange(e.target.checked);
            }}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Actions Menu */}
      {visibleActions && visibleActions.length > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <button
            ref={menuButtonRef}
            onClick={handleMenuToggle}
            className={`
              p-1.5 rounded-lg transition-colors cursor-pointer
              ${
                showMenu
                  ? "bg-gray-200 dark:bg-gray-600"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 bg-white/80 dark:bg-gray-800/80"
              }
            `}
          >
            <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {showMenu && (
            <div
              className={`
                absolute right-0 z-50 min-w-[160px]
                bg-white dark:bg-gray-800 rounded-xl shadow-xl
                border border-gray-200 dark:border-gray-700
                py-1 animate-in zoom-in-95 duration-150
                ${menuPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {visibleActions.map((action) => {
                const Icon = action.icon;
                const isDanger = action.variant === "danger";

                return (
                  <button
                    key={action.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction?.(action.id);
                      action.onClick(item);
                      setShowMenu(false);
                    }}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                      transition-colors cursor-pointer
                      ${
                        isDanger
                          ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 pt-10">
        {/* Avatar & Title Section */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
            {avatar ? (
              <Image
                src={avatar}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: avatarColor || "#3b82f6" }}
              >
                {initials || title.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {subtitle}
              </p>
            )}
            {secondaryInfo && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                {secondaryInfo}
              </p>
            )}
          </div>
        </div>

        {/* Badge */}
        {badge && (
          <div className="mb-3">
            <span
              className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${badgeColors[badge.color]}
              `}
            >
              {badge.text}
            </span>
          </div>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    {stat.label}
                  </p>
                  <p
                    className={`
                      text-sm font-semibold flex items-center justify-center gap-1
                      ${stat.color ? statColors[stat.color] : "text-gray-900 dark:text-white"}
                    `}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
