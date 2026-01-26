"use client";

import { useState } from "react";
import { Briefcase, Building2, Phone, Mail, DollarSign, ChevronUp } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

interface EmploymentSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function EmploymentSection({
  formData,
  onChange,
  errors = {},
}: EmploymentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const incomeRanges = [
    { value: "Under ₦500,000", label: "Under ₦500,000" },
    { value: "₦500,000 - ₦1,000,000", label: "₦500,000 - ₦1,000,000" },
    { value: "₦1,000,000 - ₦2,500,000", label: "₦1,000,000 - ₦2,500,000" },
    { value: "₦2,500,000 - ₦5,000,000", label: "₦2,500,000 - ₦5,000,000" },
    { value: "₦5,000,000 - ₦10,000,000", label: "₦5,000,000 - ₦10,000,000" },
    { value: "Above ₦10,000,000", label: "Above ₦10,000,000" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Employment Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Work details and occupation (optional)
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
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
            {/* Occupation Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Occupation Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Occupation / Job Title"
                  icon={<Briefcase className="w-full h-full" />}
                  value={formData.occupation || ""}
                  onChange={(value) => onChange("occupation", value)}
                  placeholder="e.g., Software Engineer, Doctor"
                  type="text"
                  error={errors.occupation}
                />
                <FormInput
                  label="Employer / Company"
                  icon={<Building2 className="w-full h-full" />}
                  value={formData.employer || ""}
                  onChange={(value) => onChange("employer", value)}
                  placeholder="Company or organization name"
                  type="text"
                  error={errors.employer}
                />
                <FormDropdown
                  label="Annual Income Range"
                  icon={<DollarSign className="w-full h-full" />}
                  value={formData.annualIncome || ""}
                  onChange={(value) => onChange("annualIncome", value)}
                  options={incomeRanges}
                  placeholder="Select income range"
                  error={errors.annualIncome}
                />
              </div>
            </div>

            {/* Work Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Work Contact Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Work Phone"
                  icon={<Phone className="w-full h-full" />}
                  value={formData.workPhone || ""}
                  onChange={(value) => onChange("workPhone", value)}
                  placeholder="+234xxxxxxxxxx"
                  type="tel"
                  error={errors.workPhone}
                />
                <FormInput
                  label="Work Email"
                  icon={<Mail className="w-full h-full" />}
                  value={formData.workEmail || ""}
                  onChange={(value) => onChange("workEmail", value)}
                  placeholder="work@company.com"
                  type="email"
                  error={errors.workEmail}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
