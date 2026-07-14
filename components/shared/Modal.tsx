"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import Portal from "./Portal";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"; // Alias for maxWidth
  showCloseButton?: boolean;
  preventBackdropClose?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth,
  size,
  showCloseButton = true,
  preventBackdropClose = false,
}: ModalProps) {
  // Support both maxWidth and size (alias)
  const effectiveMaxWidth = maxWidth || size || "4xl";
  // Close on escape key (unless prevented)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventBackdropClose) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, preventBackdropClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || undefined}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={preventBackdropClose ? undefined : onClose}
      >
        <div
          className={`bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl w-full ${maxWidthClasses[effectiveMaxWidth]} max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || icon || showCloseButton) && (
            <div className="flex-shrink-0 relative overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20 midnight:from-cyan-950/40 midnight:via-blue-950/30 midnight:to-indigo-950/20 purple:from-pink-950/40 purple:via-purple-950/30 purple:to-indigo-950/20" />

              {/* Animated Gradient Orbs */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-400/20 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -top-4 right-12 w-16 h-16 bg-indigo-400/20 dark:bg-indigo-500/10 midnight:bg-blue-500/10 purple:bg-purple-500/10 rounded-full blur-xl animate-pulse delay-150" />
              <div className="absolute top-8 right-0 w-20 h-20 bg-purple-400/15 dark:bg-purple-500/10 midnight:bg-indigo-500/10 purple:bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-300" />

              {/* Header Content */}
              <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-blue-100/50 dark:border-blue-900/30 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 animate-in slide-in-from-left-4 duration-500">
                    {icon && (
                      <div className="relative group">
                        {/* Icon Glow Effect */}
                        <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 midnight:bg-cyan-400/20 purple:bg-pink-400/20 rounded-xl blur-md group-hover:blur-lg transition-all opacity-60" />
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 midnight:shadow-cyan-500/20 purple:shadow-pink-500/20 transform group-hover:scale-105 transition-transform">
                          <div className="text-white">
                            {icon}
                          </div>
                        </div>
                      </div>
                    )}
                    {(title || subtitle) && (
                      <div className="min-w-0">
                        {title && (
                          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 midnight:from-cyan-50 midnight:via-white midnight:to-cyan-100 purple:from-pink-50 purple:via-white purple:to-pink-100 bg-clip-text text-transparent truncate">
                            {title}
                          </h2>
                        )}
                        {subtitle && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 mt-0.5 truncate">
                            {subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="relative group p-2 sm:p-2.5 hover:bg-white/60 dark:hover:bg-[#22262e]/60 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 rounded-xl transition-all flex-shrink-0 cursor-pointer animate-in slide-in-from-right-4 duration-500"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
