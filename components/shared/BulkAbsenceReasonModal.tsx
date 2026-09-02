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
  Users,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { ABSENCE_REASONS, AbsenceReason } from "@/contexts/AttendanceContext";

export interface BulkAbsenceStudent {
  id: string;
  name: string;
  rollNo: string;
  avatar?: string;
}

export interface BulkAbsenceFormData {
  reason: AbsenceReason;
  excused: boolean;
  notes: string;
}

interface BulkAbsenceReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (students: BulkAbsenceStudent[], data: BulkAbsenceFormData) => void;
  students: BulkAbsenceStudent[];
  onRemoveStudent: (studentId: string) => void;
  onRestoreStudent?: (student: BulkAbsenceStudent) => void;
  onRestoreAll?: (students: BulkAbsenceStudent[]) => void;
}

export default function BulkAbsenceReasonModal({
  isOpen,
  onClose,
  onConfirm,
  students,
  onRemoveStudent,
  onRestoreStudent,
  onRestoreAll,
}: BulkAbsenceReasonModalProps) {
  const [mounted, setMounted] = useState(false);
  const [removedStudents, setRemovedStudents] = useState<BulkAbsenceStudent[]>([]);

  // Form state
  const [reason, setReason] = useState<AbsenceReason>("unknown");
  const [excused, setExcused] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason("unknown");
      setExcused(false);
      setNotes("");
      setRemovedStudents([]);
    }
  }, [isOpen]);

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

  const handleRemoveStudent = (student: BulkAbsenceStudent) => {
    setRemovedStudents((prev) => [...prev, student]);
    onRemoveStudent(student.id);
  };

  const handleRestoreStudent = (student: BulkAbsenceStudent) => {
    setRemovedStudents((prev) => prev.filter((s) => s.id !== student.id));
    if (onRestoreStudent) {
      onRestoreStudent(student);
    }
  };

  const handleRestoreAll = () => {
    if (onRestoreAll && removedStudents.length > 0) {
      onRestoreAll(removedStudents);
      setRemovedStudents([]);
    }
  };

  const handleSubmit = () => {
    onConfirm(students, {
      reason,
      excused,
      notes,
    });

    // Reset form
    setReason("unknown");
    setExcused(false);
    setNotes("");
    setRemovedStudents([]);
  };

  const canSubmit = students.length > 0 && reason !== "unknown";

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get consistent color for a name
  const getAvatarColor = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-cyan-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Get reason label for display
  const getReasonLabel = (value: AbsenceReason): string => {
    return ABSENCE_REASONS.find((r) => r.value === value)?.label || value;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 midnight:from-red-600 midnight:to-rose-700 purple:from-red-600 purple:to-rose-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Bulk Mark as Absent</h2>
              <p className="text-sm text-white/80">
                {students.length} {students.length === 1 ? "student" : "students"} selected
              </p>
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
          {/* Students List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300">
                Students to Mark Absent ({students.length})
              </label>
              {removedStudents.length > 0 && (
                <button
                  onClick={handleRestoreAll}
                  className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restore All ({removedStudents.length})
                </button>
              )}
            </div>

            {students.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border border-amber-200 dark:border-amber-800 midnight:border-amber-700 purple:border-amber-700 rounded-lg">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">No students selected</span>
                </div>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 rounded-xl">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700/50 midnight:border-gray-700/50 purple:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-medium ${getAvatarColor(student.name)}`}
                        >
                          {getInitials(student.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-gray-100 purple:text-gray-100">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400">
                          Roll No: {student.rollNo}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(student)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                      title="Remove from list"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Removed Students (Undo) */}
            {removedStudents.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {removedStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleRestoreStudent(student)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100 dark:bg-[#22262e] text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35] transition-colors cursor-pointer"
                    title="Click to restore"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {student.name}
                  </button>
                ))}
              </div>
            )}
          </div>

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
                    Mark if all students have documentation (medical note, prior
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
            placeholder="Add any additional information about these absences..."
            icon={<FileText className="w-2.5 h-2.5" />}
            iconBgColor="bg-gray-100 dark:bg-[#22262e] midnight:bg-gray-700 purple:bg-gray-700"
            iconColor="text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400"
            rows={3}
            optional
          />

          {/* Summary Info Box */}
          {students.length > 0 && canSubmit && (
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
                    Ready to mark {students.length} {students.length === 1 ? "student" : "students"} as {excused ? "Excused" : "Unexcused"} Absent
                  </p>
                  <p
                    className={`mt-1 ${
                      excused
                        ? "text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                        : "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                    }`}
                  >
                    Reason: {getReasonLabel(reason)}
                    {notes && (
                      <>
                        {" "}
                        <span className="opacity-60">•</span>{" "}
                        <span className="opacity-80">
                          {notes.length > 40 ? `${notes.substring(0, 40)}...` : notes}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border-t border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400">
            {students.length} {students.length === 1 ? "student" : "students"} selected
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm text-white transition-all duration-200 flex items-center gap-2 ${
                canSubmit
                  ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 dark:from-red-600 dark:to-rose-700 dark:hover:from-red-700 dark:hover:to-rose-800 midnight:from-red-600 midnight:to-rose-700 midnight:hover:from-red-700 midnight:hover:to-rose-800 purple:from-red-600 purple:to-rose-700 purple:hover:from-red-700 purple:hover:to-rose-800 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                  : "bg-gray-400 dark:bg-[#2a2d35] cursor-not-allowed opacity-50"
              }`}
            >
              <CircleX className="w-4 h-4" />
              Mark {students.length} as Absent
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
