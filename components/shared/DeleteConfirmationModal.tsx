"use client";

import { AlertTriangle } from "lucide-react";

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
  if (!isOpen) return null;

  // Generate initials from name if not provided
  const initials = itemInitials || itemName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-4 overflow-y-auto animate-in fade-in duration-200"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', zIndex: 1000000 }}
      >
        {/* Gradient Header Background */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-red-500 via-red-600 to-orange-600 dark:from-red-600 dark:via-red-700 dark:to-orange-700 midnight:from-red-500 midnight:via-red-600 midnight:to-rose-600 purple:from-red-500 purple:via-pink-600 purple:to-rose-600 opacity-10 rounded-t-3xl"></div>

        {/* Content */}
        <div className="relative pt-4 pb-3 px-5">
          {/* Icon with animated rings */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 dark:bg-red-400 rounded-full opacity-20 animate-ping"></div>
              <div className="relative w-9 h-9 bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-500 dark:to-red-600 midnight:from-red-500 midnight:to-rose-600 purple:from-red-500 purple:to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 dark:shadow-red-500/30">
                <AlertTriangle className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-sm font-bold text-center text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-3">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="relative px-5 pt-3 pb-5">
          {/* Item Info Card */}
          <div className="bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg p-2.5 mb-2.5 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                  {itemName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                  {itemId}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message - Red Background */}
          <div className="bg-red-50 dark:bg-red-900/20 midnight:bg-red-500/10 purple:bg-red-500/10 border-l-4 border-red-500 dark:border-red-400 rounded-lg p-2.5 mb-3.5">
            <p className="text-xs leading-relaxed text-red-800 dark:text-red-300 midnight:text-red-300 purple:text-red-300">
              {warningMessage}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 transition-all duration-200 cursor-pointer shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
