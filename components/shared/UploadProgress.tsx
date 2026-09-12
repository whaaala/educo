"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp, Check, File, Folder, Loader2, AlertCircle, AlertTriangle } from "lucide-react";
import Portal from "@/components/shared/Portal";

// ── Types ──

export interface UploadFileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  /** 0 to 100 */
  progress: number;
  status: "uploading" | "complete" | "error";
  size?: string;
}

export interface UploadProgressProps {
  /** Whether the upload toast is visible */
  isOpen: boolean;
  /** List of files/folders being uploaded */
  files: UploadFileItem[];
  /** Called when user confirms cancel */
  onCancel: () => void;
  /** Called when user dismisses the toast */
  onDismiss: () => void;
  /** Called when upload should pause (cancel confirmation shown) */
  onPause?: () => void;
  /** Called when upload should resume (user chose to continue) */
  onResume?: () => void;
}

export default function UploadProgress({
  isOpen,
  files,
  onCancel,
  onDismiss,
  onPause,
  onResume,
}: UploadProgressProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen || files.length === 0) return null;

  const completedCount = files.filter(f => f.status === "complete").length;
  const totalCount = files.length;
  const allDone = completedCount === totalCount;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Estimate time remaining (mock)
  const remainingItems = totalCount - completedCount;
  const estimatedTime = allDone ? "" : remainingItems <= 1 ? "Less than a minute left..." : `${remainingItems} min left...`;

  return (
    <>
      {/* Upload toast — fixed bottom-right */}
      <div className="fixed bottom-4 right-4 z-[8000] w-[360px] bg-surface rounded-xl shadow-2xl border border-line overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#1a1d24]">
          <div className="flex-1 min-w-0">
            <p className="text-[0.8125rem] font-semibold text-ink">
              {allDone ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {totalCount} upload{totalCount !== 1 ? "s" : ""} complete
                </span>
              ) : (
                `Uploading ${totalCount} item${totalCount !== 1 ? "s" : ""}`
              )}
            </p>
            {!allDone && estimatedTime && (
              <p className="text-[0.6875rem] text-gray-400 dark:text-gray-500 mt-0.5">{estimatedTime}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!allDone && (
              <button
                onClick={() => { setShowCancelConfirm(true); onPause?.(); }}
                className="text-[0.75rem] font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline cursor-pointer px-2 py-1"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#22262e] transition-colors cursor-pointer"
            >
              {collapsed ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            <button
              onClick={onDismiss}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#22262e] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Overall progress bar */}
        {!allDone && (
          <div className="h-1 bg-gray-100 dark:bg-[#1a1d24]">
            <div
              className="h-full bg-blue-500 dark:bg-blue-400 midnight:bg-cyan-500 purple:bg-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        )}

        {/* File list */}
        {!collapsed && (
          <div className="max-h-[200px] overflow-y-auto">
            {files.map(file => (
              <div key={file.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 dark:border-[#1a1d24]/50 last:border-b-0">
                {/* File icon */}
                <div className="flex-shrink-0">
                  {file.type === "folder" ? (
                    <Folder className="w-5 h-5 text-gray-400" />
                  ) : (
                    <File className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {/* Name + progress */}
                <div className="flex-1 min-w-0">
                  <p className="text-[0.75rem] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate">{file.name}</p>
                  {file.status === "uploading" && (
                    <div className="mt-1 h-1 bg-gray-100 dark:bg-[#22262e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                {/* Status indicator */}
                <div className="flex-shrink-0">
                  {file.status === "uploading" && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  {file.status === "complete" && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <Portal>
          <div className="fixed inset-0 z-[9000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => { setShowCancelConfirm(false); onResume?.(); }} />
            <div className="relative z-10 w-[420px] max-w-[92vw] bg-white dark:bg-[#1e2028] midnight:bg-[#0a0e27] purple:bg-[#1e1030] rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] animate-in zoom-in-95 fade-in duration-200">
              <div className="flex items-center gap-3 px-6 pt-6 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-[1.0625rem] font-semibold text-ink">Cancel upload?</h2>
                </div>
              </div>
              <div className="px-6 py-3">
                <p className="text-[0.875rem] text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 leading-relaxed">
                  Your upload is not complete. Would you like to cancel the upload?
                </p>
              </div>
              <div className="flex items-center justify-end gap-2.5 px-6 pt-3 pb-6">
                <button onClick={() => { setShowCancelConfirm(false); onCancel(); }}
                  className="px-5 py-2.5 rounded-xl text-[0.8125rem] font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer">
                  Cancel upload
                </button>
                <button onClick={() => { setShowCancelConfirm(false); onResume?.(); }}
                  className="px-6 py-2.5 rounded-xl text-[0.8125rem] font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  Continue upload
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
