"use client";

import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  BadgeCheck,
  Hash,
  Phone,
  Mail,
  ChevronUp,
  Users,
  MapPin,
  Globe,
  Heart,
  BookOpen,
  Home,
  Building2,
  GraduationCap,
} from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import FormBadge from "@/components/shared/FormBadge";
import { ValidationErrors } from "@/lib/validation";
import { getAvailableCountries, getReligions } from "@/config/countries";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { getInstitutionTypeColor, getEducationLevelColor } from "@/utils/educationLevel";

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
  const { settings: schoolSettings } = useSchoolSettings();

  // Auto-set institution type from school settings on mount
  useEffect(() => {
    if (schoolSettings.institutionType && !formData.institutionType) {
      onChange("institutionType", schoolSettings.institutionType);
    }
  }, [schoolSettings.institutionType]);

  // Auto-set education level from school settings on mount (only for single-level schools)
  useEffect(() => {
    if (!schoolSettings.supportsMultipleLevels && schoolSettings.defaultEducationLevel && !formData.educationLevel) {
      onChange("educationLevel", schoolSettings.defaultEducationLevel);
    }
  }, [schoolSettings.defaultEducationLevel, schoolSettings.supportsMultipleLevels]);

  const genders = ["Male", "Female"].map(g => ({ value: g, label: g }));
  const educationLevelOptions = schoolSettings.supportedLevels?.map(level => ({
    value: level,
    label: level
  })) || [];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(b => ({ value: b, label: b }));
  const countries = getAvailableCountries();
  const religions = getReligions();

  // Nigeria-specific data
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
    "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
    "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ].map(s => ({ value: s, label: s }));

  const maritalStatuses = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated"
  ].map(s => ({ value: s, label: s }));

  const relationships = [
    "Spouse",
    "Parent",
    "Sibling",
    "Child",
    "Friend",
    "Colleague",
    "Other"
  ].map(r => ({ value: r, label: r }));

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                {/* Institution Type - From School Settings (Read-only Badge) */}
                <FormBadge
                  label="Institution Type"
                  icon={<Building2 className="w-full h-full" />}
                  value={formData.institutionType || ""}
                  placeholder="Set in school settings"
                  helperText="School setting"
                  badgeColorClasses={formData.institutionType ? getInstitutionTypeColor(formData.institutionType) : undefined}
                  required
                  error={errors.institutionType}
                />

                {/* Education Level - Dropdown for multi-level, Badge for single-level */}
                {schoolSettings.supportsMultipleLevels ? (
                  <FormDropdown
                    label="Education Level"
                    icon={<GraduationCap className="w-full h-full" />}
                    value={formData.educationLevel || ""}
                    onChange={(value) => onChange("educationLevel", value)}
                    options={educationLevelOptions}
                    placeholder="Select education level"
                    required
                    error={errors.educationLevel}
                  />
                ) : (
                  <FormBadge
                    label="Education Level"
                    icon={<GraduationCap className="w-full h-full" />}
                    value={formData.educationLevel || ""}
                    placeholder="Auto-detected from school"
                    helperText="Auto-detected"
                    badgeColorClasses={formData.educationLevel ? getEducationLevelColor(formData.educationLevel) : undefined}
                    error={errors.educationLevel}
                  />
                )}

                <FormInput
                  label="Staff ID"
                  icon={<Hash className="w-full h-full" />}
                  value={formData.staffId || ""}
                  onChange={(value) => onChange("staffId", value)}
                  placeholder="System Generated"
                  type="text"
                  disabled
                />
                <FormInput
                  label="Employee Number"
                  icon={<Hash className="w-full h-full" />}
                  value={formData.employeeNumber || ""}
                  onChange={(value) => onChange("employeeNumber", value)}
                  placeholder="System Generated"
                  type="text"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
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
                  label="Middle Name"
                  icon={<User className="w-full h-full" />}
                  value={formData.middleName || ""}
                  onChange={(value) => onChange("middleName", value)}
                  placeholder="Enter middle name"
                  type="text"
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
                  required
                  error={errors.dateOfBirth}
                />
                <FormDropdown
                  label="Blood Group"
                  icon={<Heart className="w-full h-full" />}
                  value={formData.bloodGroup || ""}
                  onChange={(value) => onChange("bloodGroup", value)}
                  options={bloodGroups}
                  placeholder="Select blood group"
                />
                <FormDropdown
                  label="Religion"
                  icon={<BookOpen className="w-full h-full" />}
                  value={formData.religion || ""}
                  onChange={(value) => onChange("religion", value)}
                  options={religions}
                  placeholder="Select religion"
                />
                <FormDropdown
                  label="Marital Status"
                  icon={<Heart className="w-full h-full" />}
                  value={formData.maritalStatus || ""}
                  onChange={(value) => onChange("maritalStatus", value)}
                  options={maritalStatuses}
                  placeholder="Select marital status"
                />
              </div>
            </div>

            {/* Nationality & Origin Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Nationality & Origin
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Nationality"
                  icon={<Globe className="w-full h-full" />}
                  value={formData.nationality || "NG"}
                  onChange={(value) => onChange("nationality", value)}
                  options={countries}
                  placeholder="Select nationality"
                  required
                  error={errors.nationality}
                />
                <FormDropdown
                  label="State of Origin"
                  icon={<MapPin className="w-full h-full" />}
                  value={formData.stateOfOrigin || ""}
                  onChange={(value) => onChange("stateOfOrigin", value)}
                  options={nigerianStates}
                  placeholder="Select state"
                />
                <FormInput
                  label="Local Government Area (LGA)"
                  icon={<MapPin className="w-full h-full" />}
                  value={formData.lga || ""}
                  onChange={(value) => onChange("lga", value)}
                  placeholder="Enter LGA"
                  type="text"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Primary Phone Number"
                  icon={<Phone className="w-full h-full" />}
                  value={formData.phone || ""}
                  onChange={(value) => onChange("phone", value)}
                  placeholder="+234 XXX XXX XXXX"
                  type="text"
                  required
                  error={errors.phone}
                />
                <FormInput
                  label="Secondary Phone Number"
                  icon={<Phone className="w-full h-full" />}
                  value={formData.secondaryPhone || ""}
                  onChange={(value) => onChange("secondaryPhone", value)}
                  placeholder="+234 XXX XXX XXXX"
                  type="text"
                />
                <FormInput
                  label="Email Address"
                  icon={<Mail className="w-full h-full" />}
                  value={formData.email || ""}
                  onChange={(value) => onChange("email", value)}
                  placeholder="email@example.com"
                  type="email"
                  required
                  error={errors.email}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Home className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Address
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormTextarea
                  label="Residential Address"
                  icon={<Home className="w-full h-full" />}
                  value={formData.residentialAddress || ""}
                  onChange={(value) => onChange("residentialAddress", value)}
                  placeholder="Enter current residential address"
                  rows={3}
                  required
                  error={errors.residentialAddress}
                />
                <FormTextarea
                  label="Permanent Address"
                  icon={<Home className="w-full h-full" />}
                  value={formData.permanentAddress || ""}
                  onChange={(value) => onChange("permanentAddress", value)}
                  placeholder="Enter permanent home address"
                  rows={3}
                />
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Emergency Contact
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Emergency Contact Name"
                  icon={<User className="w-full h-full" />}
                  value={formData.emergencyContactName || ""}
                  onChange={(value) => onChange("emergencyContactName", value)}
                  placeholder="Enter contact name"
                  type="text"
                  required
                  error={errors.emergencyContactName}
                />
                <FormInput
                  label="Emergency Contact Phone"
                  icon={<Phone className="w-full h-full" />}
                  value={formData.emergencyContactPhone || ""}
                  onChange={(value) => onChange("emergencyContactPhone", value)}
                  placeholder="+234 XXX XXX XXXX"
                  type="text"
                  required
                  error={errors.emergencyContactPhone}
                />
                <FormDropdown
                  label="Relationship"
                  icon={<Users className="w-full h-full" />}
                  value={formData.emergencyContactRelationship || ""}
                  onChange={(value) => onChange("emergencyContactRelationship", value)}
                  options={relationships}
                  placeholder="Select relationship"
                  required
                  error={errors.emergencyContactRelationship}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
