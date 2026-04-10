"use client";

import { useState } from "react";
import { X, CalendarDays, FileText, CalendarCheck, CalendarClock } from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";
import FormButton from "@/components/shared/FormButton";
import { useLeaves } from "@/contexts/LeaveContext";
import { LeaveType } from "@/types/leave";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (leaveData: LeaveFormData) => void;
  staffData?: {
    staffId: string;
    staffName: string;
    staffEmail: string;
    staffDepartment: string;
    staffPosition: string;
  };
}

interface LeaveFormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export default function ApplyLeaveModal({
  isOpen,
  onClose,
  onSubmit,
  staffData,
}: ApplyLeaveModalProps) {
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const { addLeaveRequest } = useLeaves();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If staffData is provided, submit to leave context (staff leave request)
    if (staffData) {
      addLeaveRequest(staffData, {
        leaveType: formData.leaveType as LeaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        priority: "normal",
      });
    }

    // Call optional onSubmit callback
    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form
    setFormData({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200/50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Compact Header */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 midnight:from-cyan-500/10 midnight:via-blue-500/10 midnight:to-cyan-500/10 purple:from-pink-500/10 purple:via-purple-500/10 purple:to-pink-500/10 border-b border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-xl">
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 dark:via-blue-400/5 midnight:via-cyan-400/5 purple:via-pink-400/5 animate-pulse opacity-50"></div>

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent dark:via-blue-400/40 midnight:via-cyan-400/40 purple:via-pink-400/40"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Compact modern icon */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <CalendarDays className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Title with modern typography */}
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 tracking-tight leading-none">
                  Apply for Leave
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 font-medium mt-0.5">
                  Submit your leave request
                </p>
              </div>
            </div>

            {/* Modern close button */}
            <button
              onClick={onClose}
              className="cursor-pointer w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-gray-100/80 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 hover:rotate-90 active:scale-90 group flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/70 purple:text-pink-400/70 group-hover:text-gray-600 dark:group-hover:text-gray-300 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-5 sm:space-y-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {/* Leave Type */}
          <FormDropdown
            label="Leave Type"
            icon={<FileText className="w-2.5 h-2.5" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
            iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            value={formData.leaveType}
            onChange={(value) => setFormData({ ...formData, leaveType: value })}
            options={[
              { value: "Casual Leave", label: "Casual Leave" },
              { value: "Medical Leave", label: "Medical Leave" },
              { value: "Maternity Leave", label: "Maternity Leave" },
              { value: "Paternity Leave", label: "Paternity Leave" },
              { value: "Special Leave", label: "Special Leave" },
            ]}
            placeholder="Select Leave Type"
            required
          />

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormInput
              label="Start Date"
              icon={<CalendarCheck className="w-2.5 h-2.5" />}
              iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30"
              iconColor="text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400"
              value={formData.startDate}
              onChange={(value) => setFormData({ ...formData, startDate: value })}
              type="date"
              placeholder="Select start date"
              required
            />
            <FormInput
              label="End Date"
              icon={<CalendarClock className="w-2.5 h-2.5" />}
              iconBgColor="bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
              value={formData.endDate}
              onChange={(value) => setFormData({ ...formData, endDate: value })}
              type="date"
              placeholder="Select end date"
              required
            />
          </div>

          {/* Reason */}
          <FormTextarea
            label="Reason"
            icon={<FileText className="w-2.5 h-2.5" />}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400"
            value={formData.reason}
            onChange={(value) => setFormData({ ...formData, reason: value })}
            placeholder="Please provide a reason for your leave..."
            rows={4}
            required
          />
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-gray-50/50 via-gray-100/30 to-gray-50/50 dark:from-gray-800/20 dark:via-gray-800/30 dark:to-gray-800/20 midnight:from-gray-800/20 midnight:via-cyan-900/10 midnight:to-gray-800/20 purple:from-gray-800/20 purple:via-pink-900/10 purple:to-gray-800/20 border-t border-gray-200/40 dark:border-gray-700/40 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <FormButton
            type="button"
            variant="secondary"
            onClick={onClose}
            className="py-2.5 sm:py-3"
          >
            Cancel
          </FormButton>
          <FormButton
            type="submit"
            variant="primary"
            className="py-2.5 sm:py-3"
          >
            Submit Application
          </FormButton>
        </div>
      </div>
    </div>
  );
}
