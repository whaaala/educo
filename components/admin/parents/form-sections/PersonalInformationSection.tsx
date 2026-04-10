"use client";

import { useState } from "react";
import {
  User,
  Calendar,
  Heart,
  ChevronUp,
  Hash,
  Users,
  Shield,
} from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

interface PersonalInformationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
  isGuardian?: boolean;
}

export default function PersonalInformationSection({
  formData,
  onChange,
  errors = {},
  isGuardian = false,
}: PersonalInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const genders = ["Male", "Female", "Other"].map((g) => ({ value: g, label: g }));

  const relationships = isGuardian
    ? [
        { value: "Guardian", label: "Guardian" },
        { value: "Legal Guardian", label: "Legal Guardian" },
        { value: "Foster Parent", label: "Foster Parent" },
        { value: "Sponsor", label: "Sponsor" },
        { value: "Caregiver", label: "Caregiver" },
        { value: "Uncle", label: "Uncle" },
        { value: "Aunt", label: "Aunt" },
        { value: "Grandparent", label: "Grandparent" },
        { value: "Sibling", label: "Sibling" },
        { value: "Other", label: "Other" },
      ]
    : [
        { value: "Father", label: "Father" },
        { value: "Mother", label: "Mother" },
        { value: "Step-Father", label: "Step-Father" },
        { value: "Step-Mother", label: "Step-Mother" },
      ];

  const guardianTypes = [
    { value: "Legal Guardian", label: "Legal Guardian" },
    { value: "Temporary Guardian", label: "Temporary Guardian" },
    { value: "Educational Guardian", label: "Educational Guardian" },
    { value: "Financial Sponsor", label: "Financial Sponsor" },
    { value: "Emergency Contact", label: "Emergency Contact" },
  ];

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Personal Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              {isGuardian ? "Guardian's personal details" : "Parent's personal details"}
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
            {/* Profile Photo Upload */}
            <div>
              <FileUpload
                value={formData.profilePhoto}
                onChange={(file) => onChange("profilePhoto", file)}
                helpText="Upload image size 4MB, Format JPG, PNG, SVG"
                circular
                compact
              />
            </div>

            {/* Basic Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Basic Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="First Name"
                  icon={<User className="w-full h-full" />}
                  value={formData.firstName || ""}
                  onChange={(value) => onChange("firstName", value)}
                  placeholder="Enter first name"
                  type="text"
                  required
                  error={errors.firstName}
                />
                <FormInput
                  label="Last Name"
                  icon={<User className="w-full h-full" />}
                  value={formData.lastName || ""}
                  onChange={(value) => onChange("lastName", value)}
                  placeholder="Enter last name"
                  type="text"
                  required
                  error={errors.lastName}
                />
                <FormInput
                  label="Middle Name"
                  icon={<User className="w-full h-full" />}
                  value={formData.middleName || ""}
                  onChange={(value) => onChange("middleName", value)}
                  placeholder="Enter middle name"
                  type="text"
                  error={errors.middleName}
                />
                <FormDropdown
                  label="Gender"
                  icon={<Users className="w-full h-full" />}
                  value={formData.gender || ""}
                  onChange={(value) => onChange("gender", value)}
                  options={genders}
                  placeholder="Select gender"
                  required
                  error={errors.gender}
                />
                <FormInput
                  label="Date of Birth"
                  icon={<Calendar className="w-full h-full" />}
                  value={formData.dateOfBirth || ""}
                  onChange={(value) => onChange("dateOfBirth", value)}
                  type="date"
                  placeholder="YYYY-MM-DD"
                  error={errors.dateOfBirth}
                />
                <FormInput
                  label="National ID / NIN"
                  icon={<Hash className="w-full h-full" />}
                  value={formData.nationalId || ""}
                  onChange={(value) => onChange("nationalId", value)}
                  placeholder="Enter national ID"
                  type="text"
                  error={errors.nationalId}
                />
              </div>
            </div>

            {/* Relationship Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  {isGuardian ? (
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
                  ) : (
                    <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Relationship to Student
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Relationship"
                  icon={<Heart className="w-full h-full" />}
                  value={formData.relationship || ""}
                  onChange={(value) => onChange("relationship", value)}
                  options={relationships}
                  placeholder="Select relationship"
                  required
                  error={errors.relationship}
                />
                {isGuardian && (
                  <FormDropdown
                    label="Guardian Type"
                    icon={<Shield className="w-full h-full" />}
                    value={formData.guardianType || ""}
                    onChange={(value) => onChange("guardianType", value)}
                    options={guardianTypes}
                    placeholder="Select guardian type"
                    required
                    error={errors.guardianType}
                  />
                )}
                {isGuardian && (
                  <FormInput
                    label="Relationship Details"
                    icon={<User className="w-full h-full" />}
                    value={formData.relationshipDetails || ""}
                    onChange={(value) => onChange("relationshipDetails", value)}
                    placeholder="e.g., Maternal uncle, Family friend"
                    type="text"
                    error={errors.relationshipDetails}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
