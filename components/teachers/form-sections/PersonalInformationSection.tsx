"use client";

import { useState } from "react";
import {
  User,
  Calendar,
  BadgeCheck,
  Hash,
  Phone,
  Mail,
  ChevronUp,
  Users,
  Briefcase,
} from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

interface PersonalInformationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function PersonalInformationSection({
  formData,
  onChange,
  errors = {},
}: PersonalInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const genders = ["Male", "Female"].map(g => ({ value: g, label: g }));
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(b => ({ value: b, label: b }));

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
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Personal Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Basic personal details and contact information
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

            {/* Staff ID Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Staff ID Information
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Staff ID"
                  name="staffId"
                  value={formData.staffId}
                  onChange={(e) => onChange("staffId", e.target.value)}
                  placeholder="Enter staff ID"
                  icon={Hash}
                  required
                  error={errors.staffId}
                />
                <FormInput
                  label="Employee Number"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={(e) => onChange("employeeNumber", e.target.value)}
                  placeholder="Auto-generated"
                  icon={Hash}
                  disabled
                />
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Personal Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                  icon={User}
                  required
                  error={errors.firstName}
                />
                <FormInput
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={(e) => onChange("middleName", e.target.value)}
                  placeholder="Enter middle name"
                  icon={User}
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                  icon={User}
                  required
                  error={errors.lastName}
                />
                <FormDropdown
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(value) => onChange("gender", value)}
                  options={genders}
                  placeholder="Select gender"
                  icon={Users}
                  required
                  error={errors.gender}
                />
                <FormInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => onChange("dateOfBirth", e.target.value)}
                  icon={Calendar}
                  required
                  error={errors.dateOfBirth}
                />
                <FormDropdown
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(value) => onChange("bloodGroup", value)}
                  options={bloodGroups}
                  placeholder="Select blood group"
                  icon={Users}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Contact Information
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                  icon={Phone}
                  required
                  error={errors.phone}
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="email@example.com"
                  icon={Mail}
                  required
                  error={errors.email}
                />
                <FormInput
                  label="Emergency Contact"
                  name="emergencyContact"
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => onChange("emergencyContact", e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                  icon={Phone}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Address
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Full Address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  placeholder="Enter full address"
                  required
                  error={errors.address}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
