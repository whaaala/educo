"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle } from "lucide-react";

export interface SuccessModalField {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  fields: SuccessModalField[];
  note?: string;
  closeButtonText?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Request Submitted Successfully!",
  subtitle = "Your request has been registered and confirmed.",
  fields,
  note,
  closeButtonText = "Close",
}: SuccessModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-md pt-4 pb-4 px-4 sm:px-6 overflow-y-auto">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-32px)] flex flex-col animate-in fade-in zoom-in duration-200"
      >
        {/* Header with Gradient */}
        <div className="flex-shrink-0 relative bg-gradient-to-r from-green-500/90 to-emerald-500/90 dark:from-green-500/80 dark:to-emerald-500/80 midnight:from-green-500/90 midnight:to-emerald-500/90 purple:from-green-500/90 purple:to-emerald-500/90 px-4 sm:px-5 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {title}
                </h2>
                <p className="text-xs text-white/80 mt-0.5">{subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-6">
          <div className="space-y-6">
            {/* Fields Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-cyan-950/30 midnight:to-cyan-900/30 purple:from-pink-950/30 purple:to-pink-900/30 rounded-xl p-5 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 flex items-center justify-center">
                      {field.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mb-1">
                        {field.label}
                      </p>
                      <p className={`text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 ${field.valueClassName || ""}`}>
                        {field.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            {note && (
              <div className="bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800 midnight:border-amber-700 purple:border-amber-700">
                <p className="text-sm text-amber-800 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300">
                  <span className="font-semibold">Note:</span> {note}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Action Button */}
        <div className="flex-shrink-0 px-4 sm:px-5 py-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 rounded-b-xl sm:rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
          >
            {closeButtonText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
