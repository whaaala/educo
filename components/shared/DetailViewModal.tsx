"use client";

import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

// ============================================================================
// Types
// ============================================================================

/** A single key-value detail field */
export interface DetailField {
  label: string;
  value: ReactNode;
  /** Span full width of the grid */
  fullWidth?: boolean;
  /** Custom styling for the value */
  valueClassName?: string;
  /** Highlight color for the field card */
  highlight?: "green" | "red" | "blue" | "amber" | "purple";
}

/** A badge to display in the header area */
export interface DetailBadge {
  label: string;
  variant: "success" | "warning" | "danger" | "info" | "neutral" | "purple";
  /** Show pulse indicator */
  pulse?: boolean;
}

/** A tag chip */
export interface DetailTag {
  label: string;
  color?: string;
}

/** Section of content in the modal */
export interface DetailSection {
  id: string;
  /** Section title (optional, shows as uppercase tracking label) */
  title?: string;
  /** Section type determines layout */
  type: "grid" | "description" | "tags" | "custom" | "info-row";
  /** Grid columns (for type: "grid") */
  columns?: 2 | 3;
  /** Fields for grid layout */
  fields?: DetailField[];
  /** Text content for description type */
  content?: ReactNode;
  /** Tags for tags type */
  tags?: DetailTag[];
  /** Custom children for custom type */
  children?: ReactNode;
  /** Key-value rows for info-row type */
  rows?: { label: string; value: ReactNode }[];
}

/** Header configuration */
export interface DetailHeader {
  /** Image/avatar to show */
  image?: ReactNode;
  /** Badges to display */
  badges?: DetailBadge[];
  /** Subtitle text below badges */
  subtitle?: ReactNode;
  /** Additional chips/tags in header */
  chips?: DetailTag[];
}

/** Footer action button */
export interface DetailAction {
  id: string;
  label: string;
  icon?: LucideIcon;
  variant: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  /** Mobile-aligned alias */
  onPress?: () => void;
  /** Only show if condition is true */
  condition?: boolean;
  /** Position in footer */
  position?: "left" | "right";
}

/** Footer info (timestamps etc.) */
export interface DetailFooterInfo {
  items: { label: string; value: string }[];
}

export interface DetailViewModalProps {
  /** Preferred visibility prop */
  isOpen?: boolean;
  /** Back-compat visibility prop (mobile-aligned) */
  visible?: boolean;
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal subtitle */
  subtitle?: string;
  /** Modal icon */
  icon?: ReactNode;
  /** Modal size */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /** Header with image/badges */
  header?: DetailHeader;
  /** Content sections */
  sections: DetailSection[];
  /** Footer actions */
  actions?: DetailAction[];
  /** Footer info (timestamps etc.) */
  footerInfo?: DetailFooterInfo;
}

// ============================================================================
// Badge variant styles
// ============================================================================

const badgeVariants = {
  success: "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30",
  warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30",
  danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/30",
  info: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/30",
  neutral: "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-gray-500/30",
  purple: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/30",
};

const highlightStyles = {
  green: "from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-200/60 dark:border-emerald-700/60",
  red: "from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200/60 dark:border-red-700/60",
  blue: "from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200/60 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/60",
  amber: "from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-200/60 dark:border-amber-700/60",
  purple: "from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200/60 dark:border-purple-700/60",
};

// ============================================================================
// Component
// ============================================================================

/**
 * Generic detail view modal that replaces entity-specific view modals.
 * Configure via sections, header, and actions to display any entity's details.
 *
 * @example
 * ```tsx
 * <DetailViewModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title={book.title}
 *   subtitle={`by ${book.author}`}
 *   icon={<BookOpen className="w-5 h-5" />}
 *   header={{
 *     image: <BookCover src={book.coverImage} />,
 *     badges: [
 *       { label: "Available", variant: "success", pulse: true },
 *       { label: "Good Condition", variant: "info" },
 *     ],
 *   }}
 *   sections={[
 *     { id: "desc", type: "description", title: "Description", content: book.description },
 *     { id: "details", type: "grid", columns: 3, fields: [
 *       { label: "ISBN", value: book.isbn },
 *       { label: "Language", value: book.language },
 *       { label: "Pages", value: book.pages || "N/A" },
 *     ]},
 *     { id: "tags", type: "tags", title: "Tags", tags: book.tags.map(t => ({ label: t })) },
 *   ]}
 *   actions={[
 *     { id: "print", label: "Print", icon: Printer, variant: "secondary", position: "left" },
 *     { id: "close", label: "Close", variant: "ghost", position: "right" },
 *     { id: "issue", label: "Issue Book", icon: BookMarked, variant: "primary", position: "right" },
 *   ]}
 * />
 * ```
 */
export default function DetailViewModal({
  isOpen,
  visible,
  onClose,
  title,
  subtitle,
  icon,
  size = "2xl",
  header,
  sections,
  actions,
  footerInfo,
}: DetailViewModalProps) {
  const resolvedIsOpen = isOpen ?? visible ?? false;
  // Build footer from actions
  const leftActions = actions?.filter((a) => a.position === "left" && a.condition !== false) ?? [];
  const rightActions = actions?.filter((a) => (a.position === "right" || !a.position) && a.condition !== false) ?? [];

  const footer = (actions && actions.length > 0) ? (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        {leftActions.map((action) => (
          <Button key={action.id} variant={action.variant} onClick={action.onClick ?? action.onPress}>
            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
            {action.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        {rightActions.map((action) => (
          <Button key={action.id} variant={action.variant} onClick={action.onClick ?? action.onPress}>
            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  ) : undefined;

  return (
    <Modal
      isOpen={resolvedIsOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={icon}
      maxWidth={size}
      footer={footer}
    >
      <div className="space-y-6">
        {/* Header with image/badges */}
        {header && (
          <div className="flex gap-6">
            {header.image && (
              <div className="flex-shrink-0">{header.image}</div>
            )}
            <div className="flex-1 min-w-0">
              {header.badges && header.badges.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {header.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${badgeVariants[badge.variant]}`}
                    >
                      {badge.pulse && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                      )}
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}
              {header.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-4 font-medium">
                  {header.subtitle}
                </p>
              )}
              {header.chips && header.chips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {header.chips.map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 border border-gray-200/50 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 shadow-sm capitalize"
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.id}>
            {section.title && (
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-widest mb-3">
                {section.title}
              </h4>
            )}

            {/* Description */}
            {section.type === "description" && section.content && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/80 p-5 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
                <div className="text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 leading-relaxed relative z-10">
                  {section.content}
                </div>
              </div>
            )}

            {/* Grid */}
            {section.type === "grid" && section.fields && (
              <div className={`grid grid-cols-2 ${section.columns === 3 ? "md:grid-cols-3" : ""} gap-3`}>
                {section.fields.map((field, idx) => {
                  const hl = field.highlight ? highlightStyles[field.highlight] : "from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20";
                  return (
                    <div
                      key={idx}
                      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${hl} p-4 border shadow-sm hover:shadow-md transition-all duration-300 ${field.fullWidth ? "col-span-2 md:col-span-full" : ""}`}
                    >
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-widest mb-1.5">
                        {field.label}
                      </p>
                      <div className={`text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 relative z-10 ${field.valueClassName || ""}`}>
                        {field.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tags */}
            {section.type === "tags" && section.tags && section.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {section.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700 dark:to-slate-700 text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 border border-gray-200/50 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 shadow-sm"
                  >
                    #{tag.label}
                  </span>
                ))}
              </div>
            )}

            {/* Info rows */}
            {section.type === "info-row" && section.rows && (
              <div className="space-y-2">
                {section.rows.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{row.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Custom */}
            {section.type === "custom" && section.children}
          </div>
        ))}

        {/* Footer info */}
        {footerInfo && (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 border-t border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-4">
            {footerInfo.items.map((item, idx) => (
              <p key={idx} className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{item.label}:</span>
                {item.value}
              </p>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
