"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName: string;
  itemId: string;
  itemInitials?: string;
  warningMessage?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  itemName,
  itemId,
  itemInitials,
  warningMessage = "This will permanently remove this item and all associated data. This action cannot be undone.",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}: DeleteConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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
  const initials = itemInitials || itemName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

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
        <div className="bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 px-6 pt-4 pb-3 rounded-t-2xl border-b border-red-100 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30 flex-shrink-0">
          <div className="flex justify-center mb-2">
            {/* Icon with animated rings */}
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 dark:bg-red-400 rounded-full opacity-20 animate-ping"></div>
              <div className="relative w-9 h-9 bg-red-500 dark:bg-red-600 midnight:bg-red-600 purple:bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <h2 className="text-sm font-bold text-center text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6">
          {/* Item Info Card */}
          <div className="bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                {initials}
              </div>
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
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 midnight:bg-red-900/10 purple:bg-red-900/10 border-l-4 border-red-500 dark:border-red-600 midnight:border-red-600 purple:border-red-600 rounded">
            <p className="text-sm text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
              {warningMessage}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 active:scale-95"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-red-600 dark:bg-red-600 midnight:bg-red-600 purple:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 midnight:hover:bg-red-700 purple:hover:bg-red-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
