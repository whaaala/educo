"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, TrendingUp, FileText, Briefcase, User, Edit2, Check } from "lucide-react";
import { Teacher } from "@/lib/mockTeachers";
import { getCountryConfig } from "@/config/countries";

interface CheckSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Teacher;
}

export default function CheckSalaryModal({
  isOpen,
  onClose,
  staff,
}: CheckSalaryModalProps) {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [newSalary, setNewSalary] = useState(staff.salary.toString());
  const [increaseReason, setIncreaseReason] = useState("");
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get tenant's currency configuration
  // TODO: Replace with actual tenant context when implemented
  const countryConfig = getCountryConfig(); // Uses DEFAULT_COUNTRY (NG) for now
  const currencySymbol = countryConfig.currency.symbol;

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

  if (!isOpen || !mounted) return null;

  const handleSalaryIncrease = () => {
    // Here you would typically make an API call to update the salary
    console.log("Increasing salary for:", staff.staffId);
    console.log("New salary:", newSalary);
    console.log("Reason:", increaseReason);

    // Reset and close
    setIsEditingMode(false);
    setNewSalary(staff.salary.toString());
    setIncreaseReason("");
    onClose();
  };

  const handleCancel = () => {
    setIsEditingMode(false);
    setNewSalary(staff.salary.toString());
    setIncreaseReason("");
  };

  // Calculate monthly salary breakdown
  const grossSalary = staff.salary;
  const taxRate = 0.075; // 7.5% tax
  const pensionRate = 0.08; // 8% pension
  const tax = grossSalary * taxRate;
  const pension = grossSalary * pensionRate;
  const netSalary = grossSalary - tax - pension;

  // Calculate annual salary
  const annualGrossSalary = grossSalary * 12;
  const annualNetSalary = netSalary * 12;

  // Calculate years of service
  const joinDate = new Date(staff.joinDate);
  const today = new Date();
  const yearsOfService = Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-md pt-4 pb-4 px-4 sm:px-6 overflow-y-auto">
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl bg-surface rounded-xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-32px)] flex flex-col animate-in fade-in zoom-in duration-200"
      >
        {/* Header with Gradient */}
        <div className="flex-shrink-0 relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 midnight:from-cyan-600 midnight:to-purple-600 purple:from-pink-600 purple:to-purple-600 px-4 sm:px-5 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{currencySymbol}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Salary Information
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  {staff.firstName} {staff.lastName} - {staff.staffId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-visible">
          <div className="p-4 sm:p-5 space-y-4">
          {/* Staff Profile Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-gray-800/30 midnight:from-gray-800/50 midnight:to-cyan-900/10 purple:from-gray-800/50 purple:to-pink-900/10 rounded-xl border border-line">
            <div className="flex items-start gap-4">
              {staff.imageUrl ? (
                <img
                  src={staff.imageUrl}
                  alt={`${staff.firstName} ${staff.lastName}`}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white dark:ring-gray-700">
                  {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                </div>
              )}
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Position</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {staff.role}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {staff.department}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Join Date</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {new Date(staff.joinDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Years of Service</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {yearsOfService} {yearsOfService === 1 ? "year" : "years"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Salary Breakdown */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-ink">
                Monthly Salary Breakdown
              </h3>
            </div>

            <div className="space-y-3">
              {/* Gross Salary */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 midnight:from-cyan-900/10 midnight:to-blue-900/10 purple:from-pink-900/10 purple:to-purple-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                    Gross Salary
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                    {currencySymbol}{grossSalary.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Deductions */}
              <div className="p-4 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  Deductions
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                      Tax (7.5%)
                    </span>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      -{currencySymbol}{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                      Pension (8%)
                    </span>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      -{currencySymbol}{pension.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 midnight:from-green-900/10 midnight:to-emerald-900/10 purple:from-green-900/10 purple:to-emerald-900/10 rounded-lg border-2 border-green-300 dark:border-green-700/50 midnight:border-green-600/50 purple:border-green-600/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                    Net Salary (Take Home)
                  </span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {currencySymbol}{netSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Summary */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-ink">
                Annual Summary
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 midnight:from-purple-900/10 midnight:to-pink-900/10 purple:from-pink-900/10 purple:to-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800/30 midnight:border-purple-700/30 purple:border-pink-700/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annual Gross</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {currencySymbol}{annualGrossSalary.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 midnight:from-green-900/10 midnight:to-emerald-900/10 purple:from-green-900/10 purple:to-emerald-900/10 rounded-lg border border-green-200 dark:border-green-800/30 midnight:border-green-700/30 purple:border-green-700/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annual Net</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {currencySymbol}{annualNetSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 midnight:from-amber-900/10 midnight:to-yellow-900/10 purple:from-amber-900/10 purple:to-yellow-900/10 rounded-lg border border-amber-200 dark:border-amber-800/30 midnight:border-amber-700/30 purple:border-amber-700/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Employment Type</p>
                <p className="text-sm font-semibold text-ink">
                  {staff.employmentType}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Employment Status</p>
                <p className="text-sm font-semibold text-ink">
                  {staff.employmentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Salary Increase Section */}
          {isEditingMode && (
            <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 midnight:from-green-900/10 midnight:to-emerald-900/10 purple:from-green-900/10 purple:to-emerald-900/10 rounded-xl border-2 border-green-300 dark:border-green-700/50 midnight:border-green-600/50 purple:border-green-600/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-ink">
                  Increase Salary
                </h3>
              </div>

              <div className="space-y-4">
                {/* Current vs New Salary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Current Salary
                    </label>
                    <div className="p-3 bg-white dark:bg-[#1a1d24] rounded-lg border border-gray-300 dark:border-gray-600">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {currencySymbol}{staff.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      New Salary <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white rounded-lg border-2 border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter new salary"
                    />
                  </div>
                </div>

                {/* Salary Increase Preview */}
                {parseFloat(newSalary) > staff.salary && (
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 midnight:from-green-900/30 midnight:to-emerald-900/30 purple:from-green-900/30 purple:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-300 mb-1">Salary Increase</p>
                        <p className="text-lg font-bold text-green-900 dark:text-green-200">
                          +{currencySymbol}{(parseFloat(newSalary) - staff.salary).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-700 dark:text-green-300 mb-1">Percentage</p>
                        <p className="text-lg font-bold text-green-900 dark:text-green-200">
                          +{(((parseFloat(newSalary) - staff.salary) / staff.salary) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Reason for Increase <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={increaseReason}
                    onChange={(e) => setIncreaseReason(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white rounded-lg border-2 border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Enter reason for salary increase (e.g., promotion, performance review, annual increment)"
                  />
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 bg-surface border-t border-line px-4 sm:px-5 py-3 flex items-center justify-between shadow-lg">
          {!isEditingMode ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditingMode(true)}
                className="px-5 py-2.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Increase Salary
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1d24] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] transition-colors shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSalaryIncrease}
                disabled={!newSalary || parseFloat(newSalary) <= staff.salary || !increaseReason}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm Increase
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
