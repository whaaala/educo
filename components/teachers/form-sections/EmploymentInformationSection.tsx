"use client";

import { useState } from "react";
import {
  Briefcase,
  Calendar,
  BadgeCheck,
  DollarSign,
  ChevronUp,
  Building2,
  GraduationCap,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

interface EmploymentInformationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function EmploymentInformationSection({
  formData,
  onChange,
  errors = {},
}: EmploymentInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const roles = [
    { value: "Teacher", label: "Teacher" },
    { value: "Lecturer", label: "Lecturer" },
    { value: "Admin", label: "Admin" },
    { value: "Support", label: "Support" },
    { value: "Management", label: "Management" },
  ];

  const employmentTypes = [
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Contract", label: "Contract" },
    { value: "Temporary", label: "Temporary" },
  ];

  const employmentStatuses = [
    { value: "Active", label: "Active" },
    { value: "On Leave", label: "On Leave" },
    { value: "Suspended", label: "Suspended" },
    { value: "Terminated", label: "Terminated" },
  ];

  const departments = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Sciences", label: "Sciences" },
    { value: "Languages", label: "Languages" },
    { value: "Social Sciences", label: "Social Sciences" },
    { value: "Creative Arts", label: "Creative Arts" },
    { value: "Technology", label: "Technology" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Civil Engineering", label: "Civil Engineering" },
    { value: "Medicine", label: "Medicine" },
    { value: "Administration", label: "Administration" },
    { value: "Other", label: "Other" },
  ];

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Employment Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Job role, department, and employment details
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
            {/* Job Role & Department Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Job Role & Department
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={(value) => onChange("role", value)}
                  options={roles}
                  placeholder="Select role"
                  icon={Briefcase}
                  required
                  error={errors.role}
                />
                <FormDropdown
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={(value) => onChange("department", value)}
                  options={departments}
                  placeholder="Select department"
                  icon={Building2}
                  required
                  error={errors.department}
                />
                <FormInput
                  label="Branch/Campus"
                  name="branch"
                  value={formData.branch}
                  onChange={(e) => onChange("branch", e.target.value)}
                  placeholder="Enter branch or campus"
                  icon={Building2}
                />
              </div>
            </div>

            {/* Employment Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Employment Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Employment Type"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={(value) => onChange("employmentType", value)}
                  options={employmentTypes}
                  placeholder="Select employment type"
                  icon={Briefcase}
                  required
                  error={errors.employmentType}
                />
                <FormDropdown
                  label="Employment Status"
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={(value) => onChange("employmentStatus", value)}
                  options={employmentStatuses}
                  placeholder="Select status"
                  icon={BadgeCheck}
                  required
                  error={errors.employmentStatus}
                />
                <FormInput
                  label="Join Date"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => onChange("joinDate", e.target.value)}
                  icon={Calendar}
                  required
                  error={errors.joinDate}
                />
                <FormInput
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => onChange("experience", e.target.value)}
                  placeholder="Enter years"
                  icon={GraduationCap}
                  min="0"
                />
                <FormInput
                  label="Salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => onChange("salary", e.target.value)}
                  placeholder="Enter salary amount"
                  icon={DollarSign}
                  min="0"
                />
              </div>
            </div>

            {/* Qualifications Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Qualifications & Specialization
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={(e) => onChange("qualification", e.target.value)}
                  placeholder="e.g., B.Ed Mathematics, M.Sc Physics"
                  icon={GraduationCap}
                  required
                  error={errors.qualification}
                />
                <FormInput
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={(e) => onChange("specialization", e.target.value)}
                  placeholder="e.g., Algebra & Calculus, Organic Chemistry"
                  icon={GraduationCap}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
