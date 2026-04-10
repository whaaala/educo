"use client";

import { AlertTriangle, X, CheckCircle, Info, HelpCircle, type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info" | "success" | "primary";
  // Customization props
  icon?: LucideIcon;
  showCloseButton?: boolean;
  confirmButtonClassName?: string;
  closeOnConfirm?: boolean;
}

// Variant configurations
const variantConfig = {
  danger: {
    iconBg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    button: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
    defaultIcon: AlertTriangle,
  },
  warning: {
    iconBg: "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
    button: "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
    defaultIcon: AlertTriangle,
  },
  info: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
    button: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    defaultIcon: Info,
  },
  success: {
    iconBg: "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
    button: "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
    defaultIcon: CheckCircle,
  },
  primary: {
    iconBg: "bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
    button: "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
    defaultIcon: HelpCircle,
  },
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  icon,
  showCloseButton = true,
  confirmButtonClassName,
  closeOnConfirm = true,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colors = variantConfig[variant];
  const IconComponent = icon || colors.defaultIcon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 ${colors.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {title}
              </h3>
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5/50 purple:hover:bg-pink-500/5/50 rounded-lg transition-all duration-200 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {typeof message === "string" ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
              {message}
            </p>
          ) : (
            message
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                if (closeOnConfirm) {
                  onClose();
                }
              }}
              className={confirmButtonClassName || `px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${colors.button} rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
