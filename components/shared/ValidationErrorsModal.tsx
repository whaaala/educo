"use client";

import { AlertCircle, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ValidationErrors } from "@/lib/validation";
import { getFieldLabel } from "@/lib/fieldLabels";

interface ValidationErrorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationErrors;
  title?: string;
  message?: string;
}

export default function ValidationErrorsModal({
  isOpen,
  onClose,
  errors,
  title = "Please Complete Required Fields",
  message = "Please fill in the following required fields before submitting the form:",
}: ValidationErrorsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Handle empty or invalid errors object
  if (!errors || typeof errors !== 'object') {
    return null;
  }

  const errorEntries = Object.entries(errors);
  const errorCount = errorEntries.length;
  
  // Don't render if there are no errors
  if (errorCount === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-start justify-center pt-16 sm:pt-20 p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 midnight:bg-yellow-900/20 purple:bg-yellow-900/20 px-6 pt-4 pb-3 rounded-t-2xl border-b border-yellow-100 dark:border-yellow-800/30 midnight:border-yellow-700/30 purple:border-yellow-700/30 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 flex-1">
              {/* Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 dark:bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
                <div className="relative w-9 h-9 bg-yellow-500 dark:bg-yellow-600 midnight:bg-yellow-600 purple:bg-yellow-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 midnight:hover:bg-yellow-900/30 purple:hover:bg-yellow-900/30 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 ml-12">
            {errorCount} {errorCount === 1 ? 'field' : 'fields'} {errorCount === 1 ? 'needs' : 'need'} to be completed
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6 overflow-y-auto flex-1">
          {/* Message */}
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 midnight:bg-yellow-900/10 purple:bg-yellow-900/10 border-l-4 border-yellow-500 dark:border-yellow-600 midnight:border-yellow-600 purple:border-yellow-600 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-300 midnight:text-yellow-300 purple:text-yellow-300">
              {message}
            </p>
          </div>

          {/* Errors List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {errorEntries.map(([fieldName, errorMessage], index) => {
              if (!fieldName) return null;
              const fieldLabel = getFieldLabel(fieldName) || fieldName;
              return (
                <div
                  key={fieldName}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 dark:bg-yellow-600 midnight:bg-yellow-600 purple:bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                      {fieldLabel}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Button */}
          <div className="mt-6 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 hover:bg-blue-700 dark:hover:bg-blue-600 midnight:hover:bg-cyan-700 purple:hover:bg-pink-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
            >
              I'll Complete These Fields
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
