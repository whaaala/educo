"use client";

import { AlertTriangle, type LucideIcon } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

// Color configurations for different variants
const variantConfig = {
  red: {
    headerBg: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20",
    headerBorder: "border-red-100 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30",
    iconBg: "bg-red-500 dark:bg-red-600 midnight:bg-red-600 purple:bg-red-600",
    iconPing: "bg-red-500 dark:bg-red-400",
    warningBg: "bg-red-50 dark:bg-red-900/10 midnight:bg-red-900/10 purple:bg-red-900/10",
    warningBorder: "border-red-500 dark:border-red-600 midnight:border-red-600 purple:border-red-600",
    warningText: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    buttonBg: "bg-red-600 dark:bg-red-600 midnight:bg-red-600 purple:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 midnight:hover:bg-red-700 purple:hover:bg-red-700",
  },
  orange: {
    headerBg: "bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-900/20 purple:bg-orange-900/20",
    headerBorder: "border-orange-100 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30",
    iconBg: "bg-orange-500 dark:bg-orange-600 midnight:bg-orange-600 purple:bg-orange-600",
    iconPing: "bg-orange-500 dark:bg-orange-400",
    warningBg: "bg-orange-50 dark:bg-orange-900/10 midnight:bg-orange-900/10 purple:bg-orange-900/10",
    warningBorder: "border-orange-500 dark:border-orange-600 midnight:border-orange-600 purple:border-orange-600",
    warningText: "text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
    buttonBg: "bg-orange-600 dark:bg-orange-600 midnight:bg-orange-600 purple:bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-700 midnight:hover:bg-orange-700 purple:hover:bg-orange-700",
  },
  blue: {
    headerBg: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20",
    headerBorder: "border-blue-100 dark:border-blue-800/30 midnight:border-blue-700/30 purple:border-blue-700/30",
    iconBg: "bg-blue-500 dark:bg-blue-600 midnight:bg-blue-600 purple:bg-blue-600",
    iconPing: "bg-blue-500 dark:bg-blue-400",
    warningBg: "bg-blue-50 dark:bg-blue-900/10 midnight:bg-blue-900/10 purple:bg-blue-900/10",
    warningBorder: "border-blue-500 dark:border-blue-600 midnight:border-blue-600 purple:border-blue-600",
    warningText: "text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
    buttonBg: "bg-blue-600 dark:bg-blue-600 midnight:bg-blue-600 purple:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 midnight:hover:bg-blue-700 purple:hover:bg-blue-700",
  },
  green: {
    headerBg: "bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20",
    headerBorder: "border-green-100 dark:border-green-800/30 midnight:border-green-700/30 purple:border-green-700/30",
    iconBg: "bg-green-500 dark:bg-green-600 midnight:bg-green-600 purple:bg-green-600",
    iconPing: "bg-green-500 dark:bg-green-400",
    warningBg: "bg-green-50 dark:bg-green-900/10 midnight:bg-green-900/10 purple:bg-green-900/10",
    warningBorder: "border-green-500 dark:border-green-600 midnight:border-green-600 purple:border-green-600",
    warningText: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
    buttonBg: "bg-green-600 dark:bg-green-600 midnight:bg-green-600 purple:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700 midnight:hover:bg-green-700 purple:hover:bg-green-700",
  },
  purple: {
    headerBg: "bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-purple-900/20",
    headerBorder: "border-purple-100 dark:border-purple-800/30 midnight:border-purple-700/30 purple:border-purple-700/30",
    iconBg: "bg-purple-500 dark:bg-purple-600 midnight:bg-purple-600 purple:bg-purple-600",
    iconPing: "bg-purple-500 dark:bg-purple-400",
    warningBg: "bg-purple-50 dark:bg-purple-900/10 midnight:bg-purple-900/10 purple:bg-purple-900/10",
    warningBorder: "border-purple-500 dark:border-purple-600 midnight:border-purple-600 purple:border-purple-600",
    warningText: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
    buttonBg: "bg-purple-600 dark:bg-purple-600 midnight:bg-purple-600 purple:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-700 midnight:hover:bg-purple-700 purple:hover:bg-purple-700",
  },
};

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string; // Made optional for simpler usages
  itemId?: string;   // Made optional for simpler usages
  itemInitials?: string;
  itemAvatar?: string;
  avatarColor?: string;
  warningMessage?: string;
  message?: string; // Alias for warningMessage
  confirmButtonText?: string;
  cancelButtonText?: string;
  // Customization props
  headerIcon?: LucideIcon;
  variant?: "red" | "orange" | "blue" | "green" | "purple";
  subtitle?: string | ReactNode;
  showWarning?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  itemName,
  itemId,
  itemInitials,
  itemAvatar,
  avatarColor,
  warningMessage,
  message,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  headerIcon: HeaderIcon = AlertTriangle,
  variant = "red",
  subtitle,
  showWarning = true,
}: DeleteConfirmationModalProps) {
  // Use message as alias for warningMessage
  const displayMessage = warningMessage || message || "This will permanently remove this item and all associated data. This action cannot be undone.";
  const modalRef = useRef<HTMLDivElement>(null);
  const colors = variantConfig[variant];

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate initials from name if not provided
  const initials = itemInitials || (itemName || "").split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-start justify-center pt-16 sm:pt-20 p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${colors.headerBg} px-6 pt-4 pb-3 rounded-t-2xl border-b ${colors.headerBorder} flex-shrink-0`}>
          <div className="flex justify-center mb-2">
            {/* Icon with animated rings */}
            <div className="relative">
              <div className={`absolute inset-0 ${colors.iconPing} rounded-full opacity-20 animate-ping`}></div>
              <div className={`relative w-9 h-9 ${colors.iconBg} rounded-full flex items-center justify-center`}>
                <HeaderIcon className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <h2 className="text-sm font-bold text-center text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-center text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6">
          {/* Item Info Card */}
          <div className="bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-3">
              {itemAvatar ? (
                <img
                  src={itemAvatar}
                  alt={itemName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : avatarColor ? (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
                  {itemName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {itemId}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {showWarning && (
            <div className={`mb-4 p-3 ${colors.warningBg} border-l-4 ${colors.warningBorder} rounded`}>
              <p className={`text-sm ${colors.warningText}`}>
                {displayMessage}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm text-white ${colors.buttonBg} transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer`}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
