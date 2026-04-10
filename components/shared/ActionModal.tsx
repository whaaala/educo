"use client";

import { type ReactNode } from "react";
import { type LucideIcon, AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

// ============================================================================
// Types
// ============================================================================

export type ActionVariant = "danger" | "warning" | "info" | "success";

/** Action button configuration */
export interface ActionButton {
  id: string;
  label: string;
  icon?: LucideIcon;
  variant: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  /** Mobile-aligned alias */
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  position?: "left" | "right";
}

/** Detail item shown in the details section */
export interface ActionDetail {
  label: string;
  value: ReactNode;
}

export interface ActionModalProps {
  /** Preferred visibility prop */
  isOpen?: boolean;
  /** Back-compat visibility prop (mobile-aligned) */
  visible?: boolean;
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal subtitle */
  subtitle?: string;
  /** Modal icon (overrides variant default icon) */
  icon?: ReactNode;
  /** Modal size */
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Variant determines icon and accent colors */
  variant?: ActionVariant;
  /** Main message / description */
  message?: ReactNode;
  /** Additional detail text */
  detail?: ReactNode;
  /** Key-value detail items */
  details?: ActionDetail[];
  /** Custom content */
  children?: ReactNode;
  /** Footer action buttons */
  actions?: ActionButton[];
  /** Quick confirm/cancel mode: confirm button label */
  confirmLabel?: string;
  /** Quick confirm/cancel mode: cancel button label */
  cancelLabel?: string;
  /** Quick confirm callback */
  onConfirm?: () => void | Promise<void>;
  /** Whether confirm action is loading */
  isConfirming?: boolean;
}

// ============================================================================
// Variant styles
// ============================================================================

const variantConfig: Record<ActionVariant, {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
}> = {
  danger: {
    icon: XCircle,
    iconBg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    accentBorder: "border-l-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
    accentBorder: "border-l-amber-500",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
    iconColor: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
    accentBorder: "border-l-blue-500",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-l-emerald-500",
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * Generic action/confirmation modal. Use for delete confirmations,
 * status changes, issue/return actions, etc.
 *
 * @example
 * ```tsx
 * // Simple delete confirmation
 * <ActionModal
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   title="Delete Student"
 *   variant="danger"
 *   message="Are you sure you want to delete this student? This action cannot be undone."
 *   confirmLabel="Delete"
 *   onConfirm={handleDelete}
 *   isConfirming={isDeleting}
 * />
 *
 * // Action with details
 * <ActionModal
 *   isOpen={showIssue}
 *   onClose={() => setShowIssue(false)}
 *   title="Issue Book"
 *   variant="info"
 *   message="Confirm issuing this book to the student."
 *   details={[
 *     { label: "Book", value: book.title },
 *     { label: "Student", value: student.name },
 *     { label: "Due Date", value: "March 15, 2026" },
 *   ]}
 *   confirmLabel="Issue Book"
 *   onConfirm={handleIssue}
 * />
 * ```
 */
export default function ActionModal({
  isOpen,
  visible,
  onClose,
  title,
  subtitle,
  icon: customIcon,
  size = "md",
  variant = "info",
  message,
  detail,
  details,
  children,
  actions,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isConfirming = false,
}: ActionModalProps) {
  const config = variantConfig[variant];
  const VariantIcon = config.icon;
  const resolvedIsOpen = isOpen ?? visible ?? false;

  const modalIcon = customIcon ?? (
    <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}>
      <VariantIcon className={`w-4 h-4 ${config.iconColor}`} />
    </div>
  );

  // Build footer
  const leftActions = actions?.filter((a) => a.position === "left") ?? [];
  const rightActions = actions?.filter((a) => a.position === "right" || !a.position) ?? [];

  const footer = actions ? (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        {leftActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={action.onClick ?? action.onPress}
            disabled={action.disabled || action.loading}
          >
            {action.loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              action.icon && <action.icon className="w-4 h-4 mr-2" />
            )}
            {action.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        {rightActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={action.onClick ?? action.onPress}
            disabled={action.disabled || action.loading}
          >
            {action.loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              action.icon && <action.icon className="w-4 h-4 mr-2" />
            )}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-end gap-2 w-full">
      <Button variant="ghost" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button
        variant={variant === "danger" ? "danger" : "primary"}
        onClick={onConfirm}
        disabled={isConfirming}
      >
        {isConfirming && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {confirmLabel}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={resolvedIsOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={modalIcon}
      maxWidth={size}
      footer={footer}
    >
      <div className="space-y-4">
        {/* Message */}
        {message && (
          <div className={`rounded-xl border-l-4 ${config.accentBorder} bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/60 dark:to-gray-900/60 p-4`}>
            <div className="text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 leading-relaxed">
              {message}
            </div>
          </div>
        )}

        {/* Detail text */}
        {detail && (
          <div className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            {detail}
          </div>
        )}

        {/* Detail items */}
        {details && details.length > 0 && (
          <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/60 overflow-hidden">
            {details.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between px-4 py-3 ${
                  idx < details.length - 1 ? "border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50" : ""
                }`}
              >
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Custom content */}
        {children}
      </div>
    </Modal>
  );
}
