"use client";

import { useState } from "react";
import {
  Info,
  FileText,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Building2,
  User,
  CreditCard,
  Hash,
  FileCheck,
  Shield,
  CheckCircle2,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { getBanks, getIdTypes } from "@/lib/mockBanks";

interface OtherDetailsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function OtherDetailsSection({
  formData,
  onChange,
  errors = {},
}: OtherDetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-emerald-50/50 dark:bg-emerald-900/10 midnight:bg-emerald-900/10 purple:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 midnight:hover:bg-emerald-900/20 purple:hover:bg-emerald-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 flex items-center justify-center">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Other Details & Bank Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Additional information and financial details
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
        <div className="overflow-hidden">
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Bank Account Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Bank Account Details (Optional)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormDropdown
                label="Bank Name"
                icon={<Building2 className="w-full h-full" />}
                iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                value={formData.bankName || ""}
                onChange={(value) => onChange("bankName", value)}
                options={getBanks()}
                placeholder="Select Bank"
              />
              <FormInput
                label="Account Name"
                icon={<User className="w-full h-full" />}
                iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                value={formData.accountName || ""}
                onChange={(value) => onChange("accountName", value)}
                placeholder="Enter account holder name"
                type="text"
              />
              <FormInput
                label="Account Number"
                icon={<CreditCard className="w-full h-full" />}
                iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                value={formData.accountNumber || ""}
                onChange={(value) => onChange("accountNumber", value)}
                placeholder="Enter account number"
                type="text"
              />
              <FormInput
                label="IFSC / Sort Code"
                icon={<Hash className="w-full h-full" />}
                iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                value={formData.ifscCode || ""}
                onChange={(value) => onChange("ifscCode", value)}
                placeholder="Enter IFSC or Sort Code"
                type="text"
              />
            </div>
            <div className="pl-2">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 midnight:border-emerald-800/30 purple:border-emerald-800/30">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 midnight:text-emerald-300 purple:text-emerald-300">
                    <strong className="font-semibold">Note:</strong> Bank details
                    may be used for scholarship disbursements or refunds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* National Identification Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                National Identification (Optional)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormDropdown
                label="ID Type"
                icon={<Shield className="w-full h-full" />}
                iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                value={formData.idType || ""}
                onChange={(value) => onChange("idType", value)}
                options={getIdTypes()}
                placeholder="Select ID Type"
              />
              <FormInput
                label="ID Number"
                icon={<Hash className="w-full h-full" />}
                iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                value={formData.idNumber || ""}
                onChange={(value) => onChange("idNumber", value)}
                placeholder="Enter ID number"
                type="text"
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Additional Information
              </h3>
            </div>
            <div className="pl-2">
              <FormTextarea
                label="Notes / Comments"
                icon={<FileText className="w-full h-full" />}
                iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                value={formData.additionalNotes || ""}
                onChange={(value) => onChange("additionalNotes", value)}
                placeholder="Any other information that would be helpful for the school to know (special talents, interests, behavioral notes, etc.)"
                rows={5}
              />
            </div>
          </div>

          {/* Emergency Instructions Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Emergency Instructions
              </h3>
            </div>
            <div className="pl-2">
              <FormTextarea
                label="Special Instructions for Emergencies"
                icon={<AlertCircle className="w-full h-full" />}
                iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
                value={formData.emergencyInstructions || ""}
                onChange={(value) => onChange("emergencyInstructions", value)}
                placeholder="Provide any special instructions for the school staff in case of emergencies (e.g., who to contact first, special considerations, etc.)"
                rows={4}
              />
            </div>
          </div>

          {/* Consent & Agreement Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Consent & Agreement <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>
              </h3>
            </div>
            {(errors.photoConsent || errors.dataConsent || errors.medicalConsent) && (
              <div className="pl-2">
                <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                  <span>⚠</span>
                  <span>All consent fields are required</span>
                </div>
              </div>
            )}
            <div className="space-y-3 pl-2">
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 midnight:bg-emerald-900/10 purple:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 midnight:border-emerald-800/30 purple:border-emerald-800/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 midnight:hover:bg-emerald-900/20 purple:hover:bg-emerald-900/20 transition-all">
                <input
                  type="checkbox"
                  checked={formData.photoConsent || false}
                  onChange={(e) => onChange("photoConsent", e.target.checked)}
                  className="mt-1 w-5 h-5 text-emerald-600 dark:text-emerald-500 midnight:text-emerald-500 purple:text-emerald-500 rounded border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 midnight:focus:ring-emerald-400 purple:focus:ring-emerald-400 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Permission has been requested and granted for the student&apos;s photo/video to be used in
                  school publications, website, and promotional materials.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 midnight:bg-emerald-900/10 purple:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 midnight:border-emerald-800/30 purple:border-emerald-800/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 midnight:hover:bg-emerald-900/20 purple:hover:bg-emerald-900/20 transition-all">
                <input
                  type="checkbox"
                  checked={formData.dataConsent || false}
                  onChange={(e) => onChange("dataConsent", e.target.checked)}
                  className="mt-1 w-5 h-5 text-emerald-600 dark:text-emerald-500 midnight:text-emerald-500 purple:text-emerald-500 rounded border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 midnight:focus:ring-emerald-400 purple:focus:ring-emerald-400 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Permission has been requested and granted for the school to process and store the student&apos;s
                  personal data in accordance with data protection regulations.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 midnight:bg-emerald-900/10 purple:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 midnight:border-emerald-800/30 purple:border-emerald-800/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 midnight:hover:bg-emerald-900/20 purple:hover:bg-emerald-900/20 transition-all">
                <input
                  type="checkbox"
                  checked={formData.medicalConsent || false}
                  onChange={(e) => onChange("medicalConsent", e.target.checked)}
                  className="mt-1 w-5 h-5 text-emerald-600 dark:text-emerald-500 midnight:text-emerald-500 purple:text-emerald-500 rounded border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 midnight:focus:ring-emerald-400 purple:focus:ring-emerald-400 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Permission has been requested and granted for the school to provide emergency medical treatment for
                  the student if parents/guardians cannot be reached.
                </span>
              </label>
            </div>
          </div>

          {/* Final Info Box */}
          <div className="pl-2 pt-2">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 midnight:border-emerald-800/30 purple:border-emerald-800/30">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 midnight:text-emerald-300 purple:text-emerald-300">
                  <strong className="font-semibold">Review carefully:</strong> Please
                  review all information before submitting. Ensure all required
                  fields are completed accurately.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
