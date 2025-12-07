"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ArrowRightLeft,
  Users,
  School,
  BookOpen,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import FormInput from "@/components/shared/FormInput";
import { TransferType, TRANSFER_REASONS } from "@/types/transfer";
import { getEducationalLevels } from "@/config/countries";
import { useCountry } from "@/contexts/CountryContext";

export interface BulkTransferStudent {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  section: string;
  avatar?: string;
}

export interface BulkTransferFormData {
  transferType: TransferType;
  destinationClass: string;
  destinationSection: string;
  destinationSchoolName?: string;
  destinationSchoolAddress?: string;
  reason: string;
  effectiveDate: string;
  notes: string;
}

interface BulkTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (students: BulkTransferStudent[], transferData: BulkTransferFormData) => void;
  students: BulkTransferStudent[];
  onRemoveStudent: (studentId: string) => void;
  onRestoreStudent?: (student: BulkTransferStudent) => void;
  onRestoreAll?: (students: BulkTransferStudent[]) => void;
}

export default function BulkTransferModal({
  isOpen,
  onClose,
  onConfirm,
  students,
  onRemoveStudent,
  onRestoreStudent,
  onRestoreAll,
}: BulkTransferModalProps) {
  const { countryCode } = useCountry();
  const [mounted, setMounted] = useState(false);
  const [removedStudents, setRemovedStudents] = useState<BulkTransferStudent[]>([]);

  // Form state
  const [transferType, setTransferType] = useState<TransferType>("class-change");
  const [destinationClass, setDestinationClass] = useState("");
  const [destinationSection, setDestinationSection] = useState("");
  const [destinationSchoolName, setDestinationSchoolName] = useState("");
  const [destinationSchoolAddress, setDestinationSchoolAddress] = useState("");
  const [reason, setReason] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [notes, setNotes] = useState("");

  // Get classes and sections
  const classes = getEducationalLevels(countryCode);
  const sections = ["A", "B", "C", "D"].map((s) => ({ value: s, label: s }));

  // Transfer type options (limited for bulk transfer)
  const transferTypes = [
    { value: "class-change", label: "Class Change" },
    { value: "section-change", label: "Section Change" },
    { value: "internal", label: "Internal Transfer" },
    { value: "promotion", label: "Promotion to Higher Level" },
    { value: "external", label: "External Transfer (Different School)" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-set default effective date to today
  useEffect(() => {
    if (isOpen && !effectiveDate) {
      const today = new Date().toISOString().split("T")[0];
      setEffectiveDate(today);
    }
  }, [isOpen, effectiveDate]);

  // Reset removed students when modal opens
  useEffect(() => {
    if (isOpen) {
      setRemovedStudents([]);
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleRemoveStudent = (student: BulkTransferStudent) => {
    setRemovedStudents((prev) => [...prev, student]);
    onRemoveStudent(student.id);
  };

  const handleRestoreStudent = (student: BulkTransferStudent) => {
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
      transferType,
      destinationClass,
      destinationSection,
      destinationSchoolName: transferType === "external" ? destinationSchoolName : undefined,
      destinationSchoolAddress: transferType === "external" ? destinationSchoolAddress : undefined,
      reason,
      effectiveDate,
      notes,
    });

    // Reset form
    setTransferType("class-change");
    setDestinationClass("");
    setDestinationSection("");
    setDestinationSchoolName("");
    setDestinationSchoolAddress("");
    setReason("");
    setEffectiveDate("");
    setNotes("");
    setRemovedStudents([]);
  };

  // Validation logic based on transfer type
  const canSubmit = () => {
    // Must have at least one student
    if (students.length === 0) return false;

    // Base requirements
    if (!reason || !effectiveDate) return false;

    // For external transfers, only school name is required
    if (transferType === "external") {
      return !!destinationSchoolName;
    }

    // For all other transfers, class and section are required
    return !!(destinationClass && destinationSection);
  };

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

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Bulk Transfer Students</h2>
              <p className="text-sm text-white/80">
                Transfer {students.length} {students.length === 1 ? "student" : "students"} at once
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Students List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Students to Transfer ({students.length})
              </label>
              {removedStudents.length > 0 && (
                <button
                  onClick={handleRestoreAll}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline cursor-pointer"
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
                  <span className="text-sm font-medium">No students selected for transfer</span>
                </div>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 rounded-xl">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700/50 midnight:border-cyan-700/20 purple:border-pink-700/20 hover:bg-gray-50 dark:hover:bg-gray-700/30 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAvatarColor(student.name)}`}
                        >
                          {getInitials(student.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                          {student.admissionNumber} • Class {student.class}, Section {student.section}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(student)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                      title="Remove from transfer"
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
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    title="Click to restore"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {student.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transfer Type */}
          <FormDropdown
            label="Transfer Type"
            value={transferType}
            onChange={(value) => setTransferType(value as TransferType)}
            options={transferTypes}
            icon={<ArrowRightLeft className="w-2.5 h-2.5" />}
            required
          />

          {/* Conditional Fields based on Transfer Type */}
          {transferType === "external" ? (
            // External Transfer Fields
            <>
              <FormInput
                label="Destination School Name"
                value={destinationSchoolName}
                onChange={(value) => setDestinationSchoolName(value)}
                placeholder="e.g., St. Mary's High School"
                icon={<School className="w-2.5 h-2.5" />}
                required
              />
              <FormInput
                label="Destination School Address"
                value={destinationSchoolAddress}
                onChange={(value) => setDestinationSchoolAddress(value)}
                placeholder="e.g., 123 Education Road, Lagos"
                icon={<School className="w-2.5 h-2.5" />}
              />
            </>
          ) : (
            // Internal Transfer Fields (Class & Section)
            <div className="grid grid-cols-2 gap-4">
              <FormDropdown
                label="Destination Class"
                value={destinationClass}
                onChange={(value) => setDestinationClass(value)}
                options={classes}
                icon={<School className="w-2.5 h-2.5" />}
                placeholder="Select class"
                disabled={transferType === "section-change"}
                required
              />
              <FormDropdown
                label="Destination Section"
                value={destinationSection}
                onChange={(value) => setDestinationSection(value)}
                options={sections}
                icon={<BookOpen className="w-2.5 h-2.5" />}
                placeholder="Select section"
                disabled={transferType === "class-change"}
                required
              />
            </div>
          )}

          {/* Reason */}
          <FormDropdown
            label="Reason for Transfer"
            value={reason}
            onChange={(value) => setReason(value)}
            options={[...TRANSFER_REASONS]}
            icon={<FileText className="w-2.5 h-2.5" />}
            placeholder="Select reason"
            required
          />

          {/* Effective Date */}
          <FormInput
            label="Effective Date"
            type="date"
            value={effectiveDate}
            onChange={(value) => setEffectiveDate(value)}
            placeholder="Select effective date"
            icon={<Calendar className="w-2.5 h-2.5" />}
            required
          />

          {/* Notes */}
          <FormTextarea
            label="Additional Notes"
            value={notes}
            onChange={(value) => setNotes(value)}
            placeholder="Add any additional information about this bulk transfer..."
            icon={<FileText className="w-2.5 h-2.5" />}
            rows={3}
            optional
          />

          {/* Summary Info Box */}
          {students.length > 0 && canSubmit() && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                    Ready to transfer {students.length} {students.length === 1 ? "student" : "students"}
                  </p>
                  <p className="mt-1 text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                    {transferType === "external"
                      ? `To: ${destinationSchoolName}`
                      : `To: Class ${destinationClass}, Section ${destinationSection}`}
                    {" • "}
                    Effective: {new Date(effectiveDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            {students.length} {students.length === 1 ? "student" : "students"} selected
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit()}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm text-white transition-all duration-200 flex items-center gap-2 ${
                canSubmit()
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Transfer {students.length} {students.length === 1 ? "Student" : "Students"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
