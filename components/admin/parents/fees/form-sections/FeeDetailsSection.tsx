"use client";

import { useState } from "react";
import {
  CreditCard,
  Calendar,
  BookOpen,
  Hash,
  FileText,
  ChevronUp,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

// Fee Types
const FEE_TYPES = [
  { value: "School Fees", label: "School Fees" },
  { value: "Bus Fee", label: "Bus Fee" },
  { value: "Exam Fee", label: "Exam Fee" },
  { value: "Library Fee", label: "Library Fee" },
  { value: "Lab Fee", label: "Lab Fee" },
  { value: "Sports Fee", label: "Sports Fee" },
  { value: "Uniform Fee", label: "Uniform Fee" },
];

// Terms
const TERMS = [
  { value: "1st Term", label: "1st Term" },
  { value: "2nd Term", label: "2nd Term" },
  { value: "3rd Term", label: "3rd Term" },
];

// Academic Years
const ACADEMIC_YEARS = [
  { value: "2024/2025", label: "2024/2025" },
  { value: "2025/2026", label: "2025/2026" },
  { value: "2026/2027", label: "2026/2027" },
];

interface FeeDetailsSectionProps {
  formData: {
    feeType: string;
    term: string;
    academicYear: string;
    amount: string;
    dueDate: string;
    notes: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: ValidationErrors;
  currency?: string;
}

export default function FeeDetailsSection({
  formData,
  onChange,
  errors = {},
  currency = "NGN",
}: FeeDetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Format currency for display
  const formatCurrencyDisplay = (amount: string) => {
    if (!amount) return "";
    const num = parseFloat(amount);
    if (isNaN(num)) return "";
    return num.toLocaleString();
  };

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-green-50/50 dark:bg-green-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-green-50 dark:hover:bg-green-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Fee Details
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Enter the fee type, term, and amount details
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer">
          <ChevronUp
            className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Fee Classification Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Fee Classification
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Fee Type"
                  icon={<CreditCard className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30"
                  iconColor="text-green-600 dark:text-green-400"
                  value={formData.feeType}
                  onChange={(value) => onChange("feeType", value)}
                  options={FEE_TYPES}
                  placeholder="Select fee type"
                  required
                  error={errors.feeType}
                />

                <FormDropdown
                  label="Term"
                  icon={<Calendar className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30"
                  iconColor="text-green-600 dark:text-green-400"
                  value={formData.term}
                  onChange={(value) => onChange("term", value)}
                  options={TERMS}
                  placeholder="Select term"
                  required
                  error={errors.term}
                />

                <FormDropdown
                  label="Academic Year"
                  icon={<BookOpen className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30"
                  iconColor="text-green-600 dark:text-green-400"
                  value={formData.academicYear}
                  onChange={(value) => onChange("academicYear", value)}
                  options={ACADEMIC_YEARS}
                  placeholder="Select academic year"
                  required
                  error={errors.academicYear}
                />
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Hash className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Payment Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <div className="group" data-field="amount">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                      <div className="w-2.5 h-2.5 text-green-600 dark:text-green-400">
                        <Hash className="w-full h-full" />
                      </div>
                    </div>
                    <span>Amount ({currency})</span>
                    <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                      {currency}
                    </span>
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        onChange("amount", value);
                      }}
                      placeholder="0.00"
                      className={`w-full h-[46px] pl-14 pr-4 py-2.5 rounded-xl border ${
                        errors.amount
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                      } bg-surface text-gray-900 dark:text-white text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-1 focus:ring-blue-500/10 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500`}
                    />
                  </div>
                  {formData.amount && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {currency} {formatCurrencyDisplay(formData.amount)}
                    </p>
                  )}
                  {errors.amount && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {errors.amount}
                    </p>
                  )}
                </div>

                <FormInput
                  label="Due Date"
                  icon={<Calendar className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30"
                  iconColor="text-green-600 dark:text-green-400"
                  value={formData.dueDate}
                  onChange={(value) => onChange("dueDate", value)}
                  type="date"
                  placeholder="Select due date"
                  required
                  error={errors.dueDate}
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Additional Information
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                  (Optional)
                </span>
              </div>
              <div className="pl-2">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                      <div className="w-2.5 h-2.5 text-green-600 dark:text-green-400">
                        <FileText className="w-full h-full" />
                      </div>
                    </div>
                    <span>Notes</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => onChange("notes", e.target.value)}
                    placeholder="Add any additional notes or remarks about this fee..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-surface text-gray-900 dark:text-white text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-1 focus:ring-blue-500/10 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
