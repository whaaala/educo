"use client";

import { useState } from "react";
import {
  DollarSign,
  ChevronUp,
  CreditCard,
  Building,
  Hash,
  Wallet,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

interface PayrollSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function PayrollSection({
  formData,
  onChange,
  errors = {},
}: PayrollSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const salaryStructures = [
    { value: "Monthly", label: "Monthly" },
    { value: "Bi-Weekly", label: "Bi-Weekly" },
    { value: "Hourly", label: "Hourly" },
  ];

  const nigerianBanks = [
    { value: "Access Bank", label: "Access Bank" },
    { value: "Ecobank Nigeria", label: "Ecobank Nigeria" },
    { value: "Fidelity Bank", label: "Fidelity Bank" },
    { value: "First Bank of Nigeria", label: "First Bank of Nigeria" },
    { value: "First City Monument Bank", label: "First City Monument Bank (FCMB)" },
    { value: "Guaranty Trust Bank", label: "Guaranty Trust Bank (GTB)" },
    { value: "Heritage Bank", label: "Heritage Bank" },
    { value: "Keystone Bank", label: "Keystone Bank" },
    { value: "Polaris Bank", label: "Polaris Bank" },
    { value: "Providus Bank", label: "Providus Bank" },
    { value: "Stanbic IBTC Bank", label: "Stanbic IBTC Bank" },
    { value: "Standard Chartered Bank", label: "Standard Chartered Bank" },
    { value: "Sterling Bank", label: "Sterling Bank" },
    { value: "Union Bank", label: "Union Bank" },
    { value: "United Bank for Africa", label: "United Bank for Africa (UBA)" },
    { value: "Unity Bank", label: "Unity Bank" },
    { value: "Wema Bank", label: "Wema Bank" },
    { value: "Zenith Bank", label: "Zenith Bank" },
    { value: "Other", label: "Other" },
  ];

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-emerald-50/50 dark:bg-emerald-900/10 midnight:bg-emerald-900/10 purple:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 midnight:hover:bg-emerald-900/20 purple:hover:bg-emerald-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Payroll & Financial Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Salary structure, bank details, and tax information
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
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Salary Structure Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Salary Structure
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Salary Structure"
                  icon={<Wallet className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.salaryStructure || ""}
                  onChange={(value) => onChange("salaryStructure", value)}
                  options={salaryStructures}
                  placeholder="Select structure"
                />
                <FormInput
                  label="Base Salary"
                  icon={<DollarSign className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.baseSalary || ""}
                  onChange={(value) => onChange("baseSalary", value)}
                  placeholder="Enter amount"
                  type="number"
                />
                <FormInput
                  label="Housing Allowance"
                  icon={<DollarSign className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.housingAllowance || ""}
                  onChange={(value) => onChange("housingAllowance", value)}
                  placeholder="Enter amount"
                  type="number"
                />
                <FormInput
                  label="Transport Allowance"
                  icon={<DollarSign className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.transportAllowance || ""}
                  onChange={(value) => onChange("transportAllowance", value)}
                  placeholder="Enter amount"
                  type="number"
                />
                <FormInput
                  label="Other Allowances"
                  icon={<DollarSign className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.otherAllowances || ""}
                  onChange={(value) => onChange("otherAllowances", value)}
                  placeholder="Enter amount"
                  type="number"
                />
              </div>
            </div>

            {/* Deductions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Deductions
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Pension Deduction"
                  icon={<DollarSign className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.pensionDeduction || ""}
                  onChange={(value) => onChange("pensionDeduction", value)}
                  placeholder="Enter amount"
                  type="number"
                />
                <FormInput
                  label="Tax Deduction"
                  icon={<DollarSign className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.taxDeduction || ""}
                  onChange={(value) => onChange("taxDeduction", value)}
                  placeholder="Enter amount"
                  type="number"
                />
              </div>
            </div>

            {/* Tax & Pension Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <Hash className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Tax & Pension Information
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Pension Number (PFA)"
                  icon={<Hash className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.pensionNumber || ""}
                  onChange={(value) => onChange("pensionNumber", value)}
                  placeholder="Enter pension number"
                  type="text"
                />
                <FormInput
                  label="Tax ID / TIN"
                  icon={<Hash className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.taxId || ""}
                  onChange={(value) => onChange("taxId", value)}
                  placeholder="Enter tax identification number"
                  type="text"
                />
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Bank Account Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Bank Name"
                  icon={<Building className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.bankName || ""}
                  onChange={(value) => onChange("bankName", value)}
                  options={nigerianBanks}
                  placeholder="Select bank"
                  required
                  error={errors.bankName}
                />
                <FormInput
                  label="Account Name"
                  icon={<CreditCard className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.accountName || ""}
                  onChange={(value) => onChange("accountName", value)}
                  placeholder="Enter account name"
                  type="text"
                  required
                  error={errors.accountName}
                />
                <FormInput
                  label="Account Number"
                  icon={<Hash className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.accountNumber || ""}
                  onChange={(value) => onChange("accountNumber", value)}
                  placeholder="Enter account number"
                  type="text"
                  required
                  error={errors.accountNumber}
                />
                <FormInput
                  label="Bank Sort Code / SWIFT"
                  icon={<Hash className="w-full h-full" />}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.bankSortCode || ""}
                  onChange={(value) => onChange("bankSortCode", value)}
                  placeholder="Enter sort code"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
