"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ArrowRight,
  Building2,
  Calendar,
  FileText,
  AlertCircle,
  GraduationCap,
  Send,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import FormButton from "@/components/shared/FormButton";
import { CreateTransferRequest, TransferType } from "@/types/transfer";

interface TransferRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  studentAdmissionNumber: string;
  studentAvatar?: string;
  currentClass: string;
  currentSection: string;
  currentBranchId?: string;
  currentBranchName?: string;
  onSubmit: (request: CreateTransferRequest) => void;
  isSubmitting?: boolean;
}

export default function TransferRequestModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  studentAdmissionNumber,
  studentAvatar,
  currentClass,
  currentSection,
  currentBranchId: _currentBranchId,
  currentBranchName,
  onSubmit,
  isSubmitting = false,
}: TransferRequestModalProps) {
  const [formData, setFormData] = useState<CreateTransferRequest>({
    studentId,
    transferType: "section-change",
    effectiveDate: new Date().toISOString().split("T")[0],
    reason: "",
    priority: "normal",
    notes: "",
    notifyParent: true,
  });
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

  // Tied to the request type, so an option value that is not a real priority stops compiling.
  const priorities: { value: NonNullable<CreateTransferRequest["priority"]>; label: string }[] = [
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

  const handleChange = <K extends keyof CreateTransferRequest>(field: K, value: CreateTransferRequest[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const needsBranch = formData.transferType === "cross-branch";
  const needsClass =
    formData.transferType === "class-change" ||
    formData.transferType === "internal" ||
    formData.transferType === "cross-branch";
  const needsSection =
    formData.transferType === "section-change" ||
    formData.transferType === "internal" ||
    formData.transferType === "cross-branch";
  const needsSchool = formData.transferType === "external";

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-md pt-4 pb-4 px-4 sm:px-6 overflow-y-auto">
      <div ref={modalRef} className="relative w-full max-w-3xl bg-surface rounded-xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-32px)] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header with Gradient */}
        <div className="flex-shrink-0 relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-500 dark:via-blue-600 dark:to-purple-500 midnight:from-cyan-600 midnight:via-cyan-700 midnight:to-purple-600 purple:from-pink-600 purple:via-pink-700 purple:to-purple-600 px-4 sm:px-6 py-4 sm:py-5 overflow-hidden">
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-700"></div>
          </div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 animate-pulse"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-left duration-500">
              <div className="relative group/icon">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/30 group-hover/icon:ring-white/50 group-hover/icon:scale-110 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover/icon:translate-x-1 transition-transform duration-300" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/30 rounded-xl blur-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg animate-in fade-in slide-in-from-left duration-500 delay-75">
                  Student Transfer Request
                </h2>
                <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium drop-shadow-md animate-in fade-in slide-in-from-left duration-500 delay-100">
                  Process transfer for student
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="relative p-2 sm:p-2.5 rounded-xl hover:bg-white/20 active:bg-white/30 transition-all duration-300 group/close cursor-pointer backdrop-blur-sm ring-1 ring-white/20 hover:ring-white/40 hover:scale-110 active:scale-95 animate-in fade-in zoom-in duration-500 delay-150"
              type="button"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 group-hover/close:text-white group-hover/close:rotate-90 transition-all duration-300" />
              {/* Hover glow */}
              <div className="absolute inset-0 bg-white/30 rounded-xl blur-lg opacity-0 group-hover/close:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="px-4 sm:px-5 py-3 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 dark:from-gray-800/50 dark:via-gray-800/40 dark:to-gray-800/30 midnight:from-cyan-900/10 midnight:via-cyan-800/8 midnight:to-cyan-700/5 purple:from-pink-900/10 purple:via-pink-800/8 purple:to-pink-700/5 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="relative group bg-surface rounded-xl p-4 shadow-lg border-2 border-blue-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:shadow-xl hover:border-blue-300/80 dark:hover:border-gray-600/80 midnight:hover:border-cyan-400/50 purple:hover:border-pink-400/50 transition-all duration-300 overflow-hidden">
            {/* Animated background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5 midnight:from-cyan-500/5 midnight:via-purple-500/5 midnight:to-cyan-500/5 purple:from-pink-500/5 purple:via-purple-500/5 purple:to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="relative flex items-center gap-3">
              {studentAvatar ? (
                <div className="relative cursor-pointer flex-shrink-0 group/avatar">
                  <img
                    src={studentAvatar}
                    alt={studentName}
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-500/30 dark:ring-blue-400/30 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-md group-hover/avatar:ring-4 group-hover/avatar:ring-blue-500/50 dark:group-hover/avatar:ring-blue-400/50 midnight:group-hover/avatar:ring-cyan-400/50 purple:group-hover/avatar:ring-pink-400/50 group-hover/avatar:scale-105 transition-all duration-300"
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 rounded-full flex items-center justify-center text-white text-[0.625rem] font-bold shadow-lg ring-2 ring-white dark:ring-gray-800 midnight:ring-gray-900 purple:ring-gray-900 animate-in zoom-in duration-300 delay-100">
                    ✓
                  </div>
                  {/* Pulsing glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-xl opacity-0 group-hover/avatar:opacity-30 blur-md transition-all duration-500 -z-10 animate-pulse"></div>
                </div>
              ) : (
                <div className="relative cursor-pointer flex-shrink-0 group/avatar">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 dark:from-blue-500 dark:via-blue-600 dark:to-purple-500 midnight:from-cyan-600 midnight:via-cyan-700 midnight:to-purple-600 purple:from-pink-600 purple:via-pink-700 purple:to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-blue-500/30 dark:ring-blue-400/30 midnight:ring-cyan-500/30 purple:ring-pink-500/30 group-hover/avatar:ring-4 group-hover/avatar:ring-blue-500/50 dark:group-hover/avatar:ring-blue-400/50 midnight:group-hover/avatar:ring-cyan-400/50 purple:group-hover/avatar:ring-pink-400/50 group-hover/avatar:scale-105 transition-all duration-300">
                    {studentName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  {/* Pulsing glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-xl opacity-0 group-hover/avatar:opacity-30 blur-md transition-all duration-500 -z-10 animate-pulse"></div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-ink truncate animate-in fade-in slide-in-from-left duration-300">
                    {studentName}
                  </h3>
                  <span className="px-2.5 py-1 text-[0.6875rem] font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 midnight:from-cyan-900/30 midnight:to-cyan-800/30 purple:from-pink-900/30 purple:to-pink-800/30 rounded-md shadow-sm border border-blue-300/30 dark:border-blue-700/30 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in fade-in zoom-in duration-300 delay-75">
                    {studentAdmissionNumber}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 midnight:from-cyan-900/20 midnight:to-cyan-900/10 purple:from-pink-900/20 purple:to-pink-900/10 rounded-lg p-2 border border-gray-200/50 dark:border-gray-600/30 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:shadow-md hover:scale-105 transition-all duration-300">
                    <span className="text-[0.625rem] font-bold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 uppercase tracking-wider block mb-1">
                      Class
                    </span>
                    <p className="text-sm font-bold text-ink">
                      {currentClass}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 midnight:from-cyan-900/20 midnight:to-cyan-900/10 purple:from-pink-900/20 purple:to-pink-900/10 rounded-lg p-2 border border-gray-200/50 dark:border-gray-600/30 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:shadow-md hover:scale-105 transition-all duration-300">
                    <span className="text-[0.625rem] font-bold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 uppercase tracking-wider block mb-1">
                      Section
                    </span>
                    <p className="text-sm font-bold text-ink">
                      {currentSection}
                    </p>
                  </div>
                  {currentBranchName && (
                    <div className="col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 midnight:from-cyan-900/20 midnight:to-cyan-900/10 purple:from-pink-900/20 purple:to-pink-900/10 rounded-lg p-2 border border-gray-200/50 dark:border-gray-600/30 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:shadow-md hover:scale-105 transition-all duration-300 animate-in fade-in zoom-in duration-500 delay-150">
                      <span className="text-[0.625rem] font-bold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 uppercase tracking-wider block mb-1">
                        Branch
                      </span>
                      <p className="text-sm font-bold text-ink">
                        {currentBranchName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form - Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-visible">
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
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
                      <div className="text-sm sm:text-base font-semibold text-ink">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {needsBranch && (
                <FormDropdown
                  label="Destination Branch"
                  icon={<Building2 className="w-3.5 h-3.5" />}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                  iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  value={formData.destinationBranchId || ""}
                  onChange={(value) => handleChange("destinationBranchId", value)}
                  options={branches}
                  required
                />
              )}

              {needsClass && (
                <FormDropdown
                  label="Destination Class"
                  icon={<GraduationCap className="w-3.5 h-3.5" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
                  iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
                  value={formData.destinationClass || ""}
                  onChange={(value) => handleChange("destinationClass", value)}
                  options={classes}
                  required
                />
              )}

              {needsSection && (
                <FormDropdown
                  label="Destination Section"
                  icon={<GraduationCap className="w-3.5 h-3.5" />}
                  iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                  iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                  value={formData.destinationSection || ""}
                  onChange={(value) => handleChange("destinationSection", value)}
                  options={sections}
                  required
                />
              )}

              {needsSchool && (
                <FormInput
                  label="Destination School Name"
                  icon={<Building2 className="w-3.5 h-3.5" />}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                  iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  value={formData.destinationSchoolName || ""}
                  onChange={(value) => handleChange("destinationSchoolName", value)}
                  placeholder="Enter school name"
                  type="text"
                  required
                />
              )}
            </div>

            {/* Transfer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <FormInput
                label="Effective Date"
                icon={<Calendar className="w-3.5 h-3.5" />}
                iconBgColor="bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30"
                iconColor="text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400"
                value={formData.effectiveDate}
                onChange={(value) => handleChange("effectiveDate", value)}
                type="date"
                required
              />

              <FormDropdown
                label="Priority"
                icon={<AlertCircle className="w-3.5 h-3.5" />}
                iconBgColor="bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30"
                iconColor="text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                value={formData.priority || "normal"}
                onChange={(value) => handleChange("priority", value)}
                options={priorities}
              />
            </div>

            {/* Reason */}
            <FormTextarea
              label="Reason for Transfer"
              icon={<FileText className="w-3.5 h-3.5" />}
              iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
              iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
              value={formData.reason}
              onChange={(value) => handleChange("reason", value)}
              placeholder="Provide detailed reason for transfer request..."
              rows={3}
              required
            />

            {/* Additional Notes */}
            <FormTextarea
              label="Additional Notes"
              icon={<FileText className="w-3.5 h-3.5" />}
              iconBgColor="bg-gray-100 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50"
              iconColor="text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400"
              value={formData.notes || ""}
              onChange={(value) => handleChange("notes", value)}
              placeholder="Add any additional notes or comments..."
              rows={3}
              optional={true}
            />

            {/* Notify Parent Toggle */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 midnight:from-cyan-900/10 midnight:to-purple-900/10 purple:from-pink-900/10 purple:to-purple-900/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-ink flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 animate-pulse"></span>
                    Notify Parent/Guardian
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-1">
                    Send notification via email and SMS
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("notifyParent", !formData.notifyParent)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all shadow-inner ${
                    formData.notifyParent
                      ? "bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/50"
                      : "bg-gray-300 dark:bg-[#2a2d35]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                      formData.notifyParent ? "translate-x-8" : "translate-x-1"
                    }`}
                  >
                    {formData.notifyParent && <span className="flex items-center justify-center text-green-600 text-xs">✓</span>}
                  </span>
                </button>
              </label>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 bg-surface border-t border-line px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shadow-lg">
          <FormButton
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </FormButton>
          <FormButton
            type="submit"
            onClick={handleSubmit}
            variant="primary"
            icon={<Send className="w-4 h-4" />}
            disabled={isSubmitting || !formData.reason}
            className="px-6 sm:px-8"
          >
            {isSubmitting ? "Submitting..." : "Submit Transfer"}
          </FormButton>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
