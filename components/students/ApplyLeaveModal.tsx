"use client";

import { useState } from "react";
import { X, Calendar } from "lucide-react";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (leaveData: LeaveFormData) => void;
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
}: ApplyLeaveModalProps) {
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Apply for Leave
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-all duration-200 hover:rotate-90"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            >
              <option value="">Select Leave Type</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
              <option value="Special Leave">Special Leave</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                min={formData.startDate}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              rows={4}
              placeholder="Please provide a reason for your leave..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-6 bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-300 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-500 midnight:to-cyan-600 purple:from-pink-500 purple:to-pink-600 text-white hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:hover:from-cyan-600 midnight:hover:to-cyan-700 purple:hover:from-pink-600 purple:hover:to-pink-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}
