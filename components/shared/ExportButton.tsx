"use client";

import { useState, useEffect, useRef } from "react";
import { Download, ChevronDown } from "lucide-react";

interface ExportButtonProps {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export default function ExportButton({ onExportPDF, onExportExcel }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleExportPDF = () => {
    setIsOpen(false);
    if (onExportPDF) {
      onExportPDF();
    } else {
      console.log("Export as PDF");
    }
  };

  const handleExportExcel = () => {
    setIsOpen(false);
    if (onExportExcel) {
      onExportExcel();
    } else {
      console.log("Export as Excel");
    }
  };

  return (
    <div className="relative" ref={exportRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
          isOpen
            ? "bg-blue-50 border-blue-300 dark:bg-blue-500/20 dark:border-blue-500 midnight:bg-cyan-500/20 midnight:border-cyan-500 purple:bg-pink-500/20 purple:border-pink-500"
            : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
        }`}
      >
        <Download className={`w-4 h-4 transition-colors ${
          isOpen
            ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
        }`} />
        <span className={`text-sm font-medium hidden sm:inline transition-colors ${
          isOpen
            ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
            : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
        }`}>
          Export
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-all duration-200 ${
            isOpen
              ? "rotate-180 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
              : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
          }`}
        />
      </button>

      {/* Export Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden z-50 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 midnight:from-cyan-500/10 midnight:to-blue-500/10 purple:from-pink-500/10 purple:to-purple-500/10 border-b border-gray-200 dark:border-gray-800 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Export Options
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-200/70 purple:text-pink-200/70 mt-0.5">
              Download student data
            </p>
          </div>

          {/* Export Items */}
          <div className="py-2">
            {/* Export as PDF */}
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 group-hover:scale-110 transition-transform duration-150">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Export as PDF
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                  Portable document format
                </p>
              </div>
            </button>

            {/* Export as Excel */}
            <button
              onClick={handleExportExcel}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 group-hover:scale-110 transition-transform duration-150">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Export as Excel
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                  Spreadsheet format (.xlsx)
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
