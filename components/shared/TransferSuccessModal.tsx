"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, ArrowRightLeft, User, School, BookOpen, Calendar, FileText } from "lucide-react";

interface TransferSuccessField {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

interface TransferSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  fields: TransferSuccessField[];
  note?: string;
  closeButtonText?: string;
}

export default function TransferSuccessModal({
  isOpen,
  onClose,
  title = "Transfer Submitted Successfully!",
  subtitle = "The transfer request has been registered and is pending approval.",
  fields,
  note = "You can track the transfer request status in the Student Details section. The student and parent will be notified once the transfer is approved.",
  closeButtonText = "Close",
}: TransferSuccessModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      // Scroll modal into view
      setTimeout(() => {
        const modal = document.querySelector('[data-modal="transfer-success"]');
        if (modal) {
          modal.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [isOpen, mounted]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      data-modal="transfer-success"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 midnight:from-green-600 midnight:to-green-700 purple:from-green-600 purple:to-green-700 px-6 py-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Success icon and title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="text-sm text-white/80 mt-1">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Fields */}
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {field.icon}
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {field.label}
                </span>
              </div>
              <span
                className={
                  field.valueClassName ||
                  "text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                }
              >
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {/* Note */}
        {note && (
          <div className="px-6 pb-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border border-amber-200 dark:border-amber-800 midnight:border-amber-700 purple:border-amber-700 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">
                <strong>Note:</strong> {note}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 midnight:from-green-600 midnight:to-green-700 midnight:hover:from-green-700 midnight:hover:to-green-800 purple:from-green-600 purple:to-green-700 purple:hover:from-green-700 purple:hover:to-green-800 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {closeButtonText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Export helper function to create field objects
export function createTransferField(
  icon: React.ReactNode,
  label: string,
  value: string,
  valueClassName?: string
): TransferSuccessField {
  return { icon, label, value, valueClassName };
}
