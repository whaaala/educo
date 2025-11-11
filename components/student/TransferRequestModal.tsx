"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRightLeft, User, School, BookOpen, Calendar, FileText } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { TransferType, TRANSFER_REASONS } from "@/types/transfer";
import { getEducationalLevels } from "@/config/countries";
import { useCountry } from "@/contexts/CountryContext";

interface TransferRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transferData: TransferFormData) => void;
  currentClass: string;
  currentSection: string;
  studentName: string;
  admissionNumber: string;
}

export interface TransferFormData {
  transferType: TransferType;
  destinationClass: string;
  destinationSection: string;
  destinationSchoolName?: string; // For external transfers
  destinationSchoolAddress?: string; // For external transfers
  reason: string;
  effectiveDate: string;
  notes: string;
}

export default function TransferRequestModal({
  isOpen,
  onClose,
  onSubmit,
  currentClass,
  currentSection,
  studentName,
  admissionNumber,
}: TransferRequestModalProps) {
  const { countryCode } = useCountry();
  const [mounted, setMounted] = useState(false);

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
  const sections = ["A", "B", "C", "D"].map(s => ({ value: s, label: s }));

  // Transfer type options
  const transferTypes = [
    { value: "class-change", label: "Class Change" },
    { value: "section-change", label: "Section Change" },
    { value: "internal", label: "Internal Transfer" },
    { value: "promotion", label: "Promotion to Higher Level" },
    { value: "external", label: "External Transfer (Different School)" },
  ];

  // Auto-set default effective date to today
  useEffect(() => {
    if (isOpen && !effectiveDate) {
      const today = new Date().toISOString().split("T")[0];
      setEffectiveDate(today);
    }
  }, [isOpen]);

  // Auto-populate destination based on transfer type
  useEffect(() => {
    if (transferType === "class-change") {
      setDestinationSection(currentSection); // Keep same section
    } else if (transferType === "section-change") {
      setDestinationClass(currentClass); // Keep same class
    }
  }, [transferType, currentClass, currentSection]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
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
  };

  // Validation logic based on transfer type
  const canSubmit = () => {
    // Base requirements
    if (!reason || !effectiveDate) return false;

    // For external transfers, only school name is required
    if (transferType === "external") {
      return !!destinationSchoolName;
    }

    // For all other transfers, class and section are required
    return !!(destinationClass && destinationSection);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {transferType === "external"
                  ? "External Transfer"
                  : transferType === "promotion"
                  ? "Promote Student"
                  : "Transfer Student"}
              </h2>
              <p className="text-sm text-white/80">
                {transferType === "external"
                  ? "Transfer to a different school"
                  : transferType === "promotion"
                  ? "Promote to higher level"
                  : "Request class or section transfer"}
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
          {/* Student Info Banner */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700 rounded-lg">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                    {studentName}
                  </span>
                  <span className="text-xs text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                    ({admissionNumber})
                  </span>
                </div>
                <div className="mt-1 text-xs text-blue-800 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                  Current: <span className="font-medium">Class {currentClass}, Section {currentSection}</span>
                </div>
              </div>
            </div>
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
            options={TRANSFER_REASONS}
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
            placeholder="Add any additional information about this transfer..."
            icon={<FileText className="w-2.5 h-2.5" />}
            rows={4}
            optional
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 flex items-center justify-end gap-3">
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
            Submit Transfer Request
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
