"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  CircleX,
  FileQuestion,
  CheckCircle2,
  FileText,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { ABSENCE_REASONS, AbsenceReason } from "@/contexts/AttendanceContext";

export interface AbsenceFormData {
  reason: AbsenceReason;
  excused: boolean;
  notes: string;
}

interface AbsenceReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: AbsenceFormData) => void;
  studentName: string;
  studentId?: string;
  studentAvatar?: string;
  initialData?: Partial<AbsenceFormData>;
}

export default function AbsenceReasonModal({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  studentId,
  studentAvatar,
  initialData,
}: AbsenceReasonModalProps) {
  const [mounted, setMounted] = useState(false);

  // Form state
  const [reason, setReason] = useState<AbsenceReason>(initialData?.reason || "unknown");
  const [excused, setExcused] = useState(initialData?.excused || false);
  const [notes, setNotes] = useState(initialData?.notes || "");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setReason(initialData?.reason || "unknown");
      setExcused(initialData?.excused || false);
      setNotes(initialData?.notes || "");
    }
  }, [isOpen, initialData]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = () => {
    onConfirm({
      reason,
      excused,
      notes,
    });
  };

  // Get reason label for display
  const getReasonLabel = (value: AbsenceReason): string => {
    return ABSENCE_REASONS.find((r) => r.value === value)?.label || value;
  };

  // Get reason category color
  const getReasonCategoryColor = (value: AbsenceReason): string => {
    const excusedReasons: AbsenceReason[] = [
      "sick",
      "medical_appointment",
      "family_emergency",
      "bereavement",
      "religious_holiday",
    ];
    const neutralReasons: AbsenceReason[] = ["travel", "weather", "transport_issue", "unknown", "other"];

    if (excusedReasons.includes(value)) {
      return "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400";
    } else if (neutralReasons.includes(value)) {
      return "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400";
    } else {
      return "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400";
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 midnight:from-red-600 midnight:to-rose-700 purple:from-red-600 purple:to-rose-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Student Avatar or Icon */}
            {studentAvatar ? (
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/30 shadow-lg">
                  <Image
                    src={studentAvatar}
                    alt={studentName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Absent indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <CircleX className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">Mark as Absent</h2>
              <p className="text-sm text-white/80">{studentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Student ID Display */}
          {studentId && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-gray-700 purple:border-gray-700">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400">
                ID:
              </span>
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300">
                {studentId}
              </span>
            </div>
          )}

          {/* Absence Reason */}
          <FormDropdown
            label="Reason for Absence"
            value={reason}
            onChange={(value) => setReason(value as AbsenceReason)}
            options={[...ABSENCE_REASONS]}
            icon={<FileQuestion className="w-2.5 h-2.5" />}
            iconBgColor="bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30"
            iconColor="text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
            placeholder="Select reason..."
            required
          />

          {/* Excused Checkbox Card */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300">
              Absence Status
            </label>
            <button
              type="button"
              onClick={() => setExcused(!excused)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                excused
                  ? "border-blue-500 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                  : "border-gray-200 dark:border-gray-600 midnight:border-gray-700 purple:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 midnight:hover:border-gray-600 purple:hover:border-gray-600 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    excused
                      ? "bg-blue-100 dark:bg-blue-800/50 midnight:bg-cyan-800/50 purple:bg-pink-800/50"
                      : "bg-gray-100 dark:bg-[#22262e] midnight:bg-gray-700 purple:bg-gray-700"
                  }`}
                >
                  <ShieldCheck
                    className={`w-5 h-5 transition-colors ${
                      excused
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                        : "text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-medium transition-colors ${
                        excused
                          ? "text-blue-900 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200"
                          : "text-gray-900 dark:text-gray-100 midnight:text-gray-100 purple:text-gray-100"
                      }`}
                    >
                      Excused Absence
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        excused
                          ? "bg-blue-500 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 border-blue-500 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500"
                          : "border-gray-300 dark:border-gray-500 midnight:border-gray-500 purple:border-gray-500"
                      }`}
                    >
                      {excused && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-1">
                    Mark if student has documentation (medical note, prior
                    permission, parent notification, etc.)
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Additional Notes */}
          <FormTextarea
            label="Additional Notes"
            value={notes}
            onChange={(value) => setNotes(value)}
            placeholder="Add any additional information about this absence..."
            icon={<FileText className="w-2.5 h-2.5" />}
            iconBgColor="bg-gray-100 dark:bg-[#22262e] midnight:bg-gray-700 purple:bg-gray-700"
            iconColor="text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400"
            rows={3}
            optional
          />

          {/* Summary Info Box */}
          <div
            className={`p-4 rounded-lg border ${
              excused
                ? "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700"
                : "bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border-amber-200 dark:border-amber-800 midnight:border-amber-700 purple:border-amber-700"
            }`}
          >
            <div className="flex items-start gap-3">
              {excused ? (
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 text-sm">
                <p
                  className={`font-medium ${
                    excused
                      ? "text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                      : "text-amber-900 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300"
                  }`}
                >
                  {excused ? "Excused Absence" : "Unexcused Absence"}
                </p>
                <p
                  className={`mt-1 ${
                    excused
                      ? "text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                  }`}
                >
                  <span className={getReasonCategoryColor(reason)}>
                    {getReasonLabel(reason)}
                  </span>
                  {notes && (
                    <>
                      {" "}
                      <span className="opacity-60">•</span>{" "}
                      <span className="opacity-80">
                        {notes.length > 50 ? `${notes.substring(0, 50)}...` : notes}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border-t border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 dark:from-red-600 dark:to-rose-700 dark:hover:from-red-700 dark:hover:to-rose-800 midnight:from-red-600 midnight:to-rose-700 midnight:hover:from-red-700 midnight:hover:to-rose-800 purple:from-red-600 purple:to-rose-700 purple:hover:from-red-700 purple:hover:to-rose-800 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <CircleX className="w-4 h-4" />
            Confirm Absence
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
