"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Calendar,
  FileText,
  AlertCircle,
  User,
  GraduationCap,
  Send,
} from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { CreateTransferRequest, TransferType } from "@/types/transfer";

interface TransferRequestFormProps {
  studentId: string;
  studentName: string;
  studentAdmissionNumber: string;
  currentClass: string;
  currentSection: string;
  currentBranchId?: string;
  currentBranchName?: string;
  onSubmit: (request: CreateTransferRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TransferRequestForm({
  studentId,
  studentName,
  studentAdmissionNumber,
  currentClass,
  currentSection,
  currentBranchId,
  currentBranchName,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TransferRequestFormProps) {
  const [formData, setFormData] = useState<CreateTransferRequest>({
    studentId,
    transferType: "section-change",
    effectiveDate: new Date().toISOString().split("T")[0],
    reason: "",
    priority: "normal",
    notes: "",
    notifyParent: true,
  });

  const transferTypes: { value: TransferType; label: string; description: string }[] = [
    {
      value: "section-change",
      label: "Section Change",
      description: "Change to different section in same class",
    },
    {
      value: "class-change",
      label: "Class Change",
      description: "Move to different class level",
    },
    {
      value: "internal",
      label: "Internal Transfer",
      description: "Change both class and section",
    },
    {
      value: "cross-branch",
      label: "Cross-Branch Transfer",
      description: "Transfer to different school branch",
    },
    {
      value: "external",
      label: "External Transfer",
      description: "Transfer to different school",
    },
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Mock data for dropdowns
  const branches = [
    { value: "main-campus", label: "Main Campus" },
    { value: "ikeja-branch", label: "Ikeja Branch" },
    { value: "lekki-branch", label: "Lekki Branch" },
    { value: "victoria-island", label: "Victoria Island Branch" },
  ];

  const classes = [
    { value: "Primary 1", label: "Primary 1" },
    { value: "Primary 2", label: "Primary 2" },
    { value: "Primary 3", label: "Primary 3" },
    { value: "Primary 4", label: "Primary 4" },
    { value: "Primary 5", label: "Primary 5" },
    { value: "Primary 6", label: "Primary 6" },
    { value: "JSS 1", label: "JSS 1" },
    { value: "JSS 2", label: "JSS 2" },
    { value: "JSS 3", label: "JSS 3" },
    { value: "SSS 1", label: "SSS 1" },
    { value: "SSS 2", label: "SSS 2" },
    { value: "SSS 3", label: "SSS 3" },
  ];

  const sections = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];

  const handleChange = (field: keyof CreateTransferRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const needsBranch =
    formData.transferType === "cross-branch";
  const needsClass =
    formData.transferType === "class-change" ||
    formData.transferType === "internal" ||
    formData.transferType === "cross-branch";
  const needsSection =
    formData.transferType === "section-change" ||
    formData.transferType === "internal" ||
    formData.transferType === "cross-branch";
  const needsSchool = formData.transferType === "external";

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Student Transfer Request"
      subtitle={`${studentName} (${studentAdmissionNumber})`}
      icon={
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
      }
      maxWidth="4xl"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.reason}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{isSubmitting ? "Submitting..." : "Submit Transfer Request"}</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Current Information */}
          <div className="p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800 midnight:border-cyan-500/50 purple:border-pink-500/50">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100">
                Current Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-medium">
                  Class:
                </span>{" "}
                <span className="text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100">
                  {currentClass}
                </span>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-medium">
                  Section:
                </span>{" "}
                <span className="text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100">
                  {currentSection}
                </span>
              </div>
              {currentBranchName && (
                <div className="sm:col-span-2">
                  <span className="text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-medium">
                    Branch:
                  </span>{" "}
                  <span className="text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100">
                    {currentBranchName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Type */}
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
              Transfer Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {transferTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex items-start p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.transferType === type.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="transferType"
                    value={type.value}
                    checked={formData.transferType === type.value}
                    onChange={(e) =>
                      handleChange("transferType", e.target.value as TransferType)
                    }
                    className="mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {type.label}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                      {type.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Destination Details */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              Destination Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {needsBranch && (
                <FormDropdown
                  label="Destination Branch"
                  icon={<Building2 className="w-full h-full" />}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                  iconColor="text-blue-600 dark:text-blue-400"
                  value={formData.destinationBranchId || ""}
                  onChange={(value) => handleChange("destinationBranchId", value)}
                  options={branches}
                  required
                />
              )}

              {needsClass && (
                <FormDropdown
                  label="Destination Class"
                  icon={<GraduationCap className="w-full h-full" />}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                  iconColor="text-blue-600 dark:text-blue-400"
                  value={formData.destinationClass || ""}
                  onChange={(value) => handleChange("destinationClass", value)}
                  options={classes}
                  required
                />
              )}

              {needsSection && (
                <FormDropdown
                  label="Destination Section"
                  icon={<GraduationCap className="w-full h-full" />}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                  iconColor="text-blue-600 dark:text-blue-400"
                  value={formData.destinationSection || ""}
                  onChange={(value) => handleChange("destinationSection", value)}
                  options={sections}
                  required
                />
              )}

              {needsSchool && (
                <FormInput
                  label="Destination School Name"
                  icon={<Building2 className="w-full h-full" />}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                  iconColor="text-blue-600 dark:text-blue-400"
                  value={formData.destinationSchoolName || ""}
                  onChange={(value) => handleChange("destinationSchoolName", value)}
                  placeholder="Enter school name"
                  type="text"
                  required
                />
              )}
            </div>
          </div>

          {/* Transfer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormInput
              label="Effective Date"
              icon={<Calendar className="w-full h-full" />}
              iconBgColor="bg-blue-100 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
              value={formData.effectiveDate}
              onChange={(value) => handleChange("effectiveDate", value)}
              type="date"
              required
            />

            <FormDropdown
              label="Priority"
              icon={<AlertCircle className="w-full h-full" />}
              iconBgColor="bg-blue-100 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
              value={formData.priority || "normal"}
              onChange={(value) => handleChange("priority", value)}
              options={priorities}
            />
          </div>

          {/* Reason */}
          <FormTextarea
            label="Reason for Transfer"
            icon={<FileText className="w-full h-full" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            value={formData.reason}
            onChange={(value) => handleChange("reason", value)}
            placeholder="Provide detailed reason for transfer request..."
            rows={3}
            required
          />

          {/* Additional Notes */}
          <FormTextarea
            label="Additional Notes (Optional)"
            icon={<FileText className="w-full h-full" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            value={formData.notes || ""}
            onChange={(value) => handleChange("notes", value)}
            placeholder="Any additional information..."
            rows={2}
          />

          {/* Notify Parent Checkbox */}
          <label className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.notifyParent}
              onChange={(e) => handleChange("notifyParent", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 sm:mt-0 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
              Notify parent/guardian via email and SMS
            </span>
          </label>
      </form>
    </Modal>
  );
}
