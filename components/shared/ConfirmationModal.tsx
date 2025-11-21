"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getVariantColors = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "from-red-500 to-red-600",
          iconBg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
          button: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
        };
      case "warning":
        return {
          icon: "from-orange-500 to-orange-600",
          iconBg: "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30",
          iconColor: "text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
          button: "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
        };
      case "info":
        return {
          icon: "from-blue-500 to-blue-600",
          iconBg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
          button: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
              <AlertTriangle className={`w-6 h-6 ${colors.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-gray-800/50 purple:hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50">
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${colors.button} rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
