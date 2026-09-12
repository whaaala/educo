"use client";

import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  GraduationCap,
  BadgeCheck,
  Hash,
  Users,
  BookOpen,
  Home,
  Heart,
  Tag,
  Phone,
  Mail,
  Languages,
  ChevronUp,
  Building2
} from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import TagInput from "@/components/shared/TagInput";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormBadge from "@/components/shared/FormBadge";
import { getLanguageOptions, getEducationalLevels, getBloodGroups, getReligions } from "@/config/countries";
import { useCountry } from "@/contexts/CountryContext";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { detectEducationLevelFromClass, getEducationLevelColor, getInstitutionTypeColor } from "@/utils/educationLevel";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import type { FormSectionProps } from "@/components/shared/form-section-types";
import type { StudentFormData } from "./types";

type PersonalInformationSectionProps = FormSectionProps<StudentFormData>;

export default function PersonalInformationSection({
  formData,
  onChange,
  errors = {},
}: PersonalInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { countryCode } = useCountry();
  const { academicYears: academicYearsFromContext } = useAcademicYear();
  const { settings: schoolSettings } = useSchoolSettings();

  // Auto-set institution type from school settings on mount
  useEffect(() => {
    if (schoolSettings.institutionType && !formData.institutionType) {
      onChange("institutionType", schoolSettings.institutionType);
    }
  }, [schoolSettings.institutionType]);

  // Auto-detect education level when class changes
  useEffect(() => {
    if (formData.class) {
      // Typed as the FORM's education level, not a bare string: the detector and the school setting both
      // return one of these, and saying so means a fourth value could never be written into the field.
      let educationLevel: StudentFormData["educationLevel"] = "";

      if (schoolSettings.supportsMultipleLevels) {
        // Multi-level school: detect from class name
        educationLevel = detectEducationLevelFromClass(formData.class);
      } else {
        // Single-level school: use school's default education level
        educationLevel = schoolSettings.defaultEducationLevel;
      }

      if (educationLevel && educationLevel !== formData.educationLevel) {
        onChange("educationLevel", educationLevel);
      }
    }
  }, [formData.class, schoolSettings.defaultEducationLevel, schoolSettings.supportsMultipleLevels]);
  
  // Use academic years from context, formatted for dropdown
  const academicYears = academicYearsFromContext.map(year => ({ value: year, label: year }));
  const statuses = ["Active", "Inactive", "Alumni", "Transferred"].map(s => ({ value: s, label: s }));
  const classes = getEducationalLevels(countryCode);
  const sections = ["A", "B", "C", "D"].map(s => ({ value: s, label: s }));
  const genders = ["Male", "Female", "Other"].map(g => ({ value: g, label: g }));
  const bloodGroups = getBloodGroups(countryCode);
  const houses = ["Mandela House", "Nyerere House", "Azikiwe House", "Lumumba House"].map(h => ({ value: h, label: h }));
  const religions = getReligions(countryCode);
  const categories = ["General", "OBC", "SC", "ST", "Other"].map(c => ({ value: c, label: c }));
  const motherTongues = getLanguageOptions(countryCode);
  const languageOptions = getLanguageOptions(countryCode).map(opt => opt.value);

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Personal Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Student details and academic information
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

          {/* Academic & School Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
                Academic & School Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormDropdown
                label="Academic Year"
                icon={<Calendar className="w-full h-full" />}
                value={formData.academicYear || ""}
                onChange={(value) => onChange("academicYear", value)}
                options={academicYears}
                placeholder="Select year"
                required
                error={errors.academicYear}
              />

              {/* NEW: Institution Type - From School Settings (Read-only Badge) */}
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

              {/* NEW: Education Level - Auto-detected from Class (Read-only Badge) */}
              <FormBadge
                label="Education Level"
                icon={<GraduationCap className="w-full h-full" />}
                value={formData.educationLevel || ""}
                placeholder="Select a class to auto-detect"
                helperText="Auto-detected"
                badgeColorClasses={formData.educationLevel ? getEducationLevelColor(formData.educationLevel) : undefined}
                error={errors.educationLevel}
              />

              <FormInput
                label="Admission Number"
                icon={<Hash className="w-full h-full" />}
                value={formData.admissionNumber || ""}
                onChange={(value) => onChange("admissionNumber", value)}
                placeholder="System Generated"
                type="text"
                disabled={true}
                error={errors.admissionNumber}
              />
              <FormInput
                label="Admission Date"
                icon={<Calendar className="w-full h-full" />}
                value={formData.admissionDate || ""}
                onChange={(value) => onChange("admissionDate", value)}
                type="date"
                placeholder="YYYY-MM-DD"
                required
                error={errors.admissionDate}
              />
                              <FormInput
                  label="Roll Number"
                  icon={<Hash className="w-full h-full" />}
                  value={formData.rollNumber || ""}
                  onChange={(value) => onChange("rollNumber", value)}
                  placeholder="System Generated"
                  type="text"
                  disabled={true}
                  error={errors.rollNumber}
                />
              <FormDropdown
                label="Status"
                icon={<BadgeCheck className="w-full h-full" />}
                value={formData.status || "Active"}
                onChange={(value) => onChange("status", value)}
                options={statuses}
                placeholder="Select status"
                required
                error={errors.status}
              />
              <FormDropdown
                label="Class"
                icon={<BookOpen className="w-full h-full" />}
                value={formData.class || ""}
                onChange={(value) => onChange("class", value)}
                options={classes}
                placeholder="Select class"
                required
                error={errors.class}
              />
              <FormDropdown
                label="Section"
                icon={<Users className="w-full h-full" />}
                value={formData.section || ""}
                onChange={(value) => onChange("section", value)}
                options={sections}
                placeholder="Select section"
                required
                error={errors.section}
              />
            </div>
          </div>

          {/* National Exam Numbers Section - Conditional based on Education Level */}
          {formData.educationLevel && formData.educationLevel !== "Primary" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  National Exam Numbers
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  ({formData.educationLevel} Level)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                {formData.educationLevel === "Secondary" && (
                  <>
                    <FormInput
                      label="WAEC Number"
                      icon={<Hash className="w-full h-full" />}
                      value={formData.waecNumber || ""}
                      onChange={(value) => onChange("waecNumber", value)}
                      placeholder="Enter WAEC number"
                      type="text"
                    />
                    <FormInput
                      label="NECO Number"
                      icon={<Hash className="w-full h-full" />}
                      value={formData.necoNumber || ""}
                      onChange={(value) => onChange("necoNumber", value)}
                      placeholder="Enter NECO number"
                      type="text"
                    />
                    <FormInput
                      label="National Exam Number"
                      icon={<Hash className="w-full h-full" />}
                      value={formData.nationalExamNumber || ""}
                      onChange={(value) => onChange("nationalExamNumber", value)}
                      placeholder="Enter national exam number"
                      type="text"
                    />
                  </>
                )}
                {formData.educationLevel === "Tertiary" && (
                  <>
                    <FormInput
                      label="JAMB Number"
                      icon={<Hash className="w-full h-full" />}
                      value={formData.jambNumber || ""}
                      onChange={(value) => onChange("jambNumber", value)}
                      placeholder="Enter JAMB number"
                      type="text"
                    />
                    <FormInput
                      label="Matriculation Number"
                      icon={<Hash className="w-full h-full" />}
                      value={formData.matricNumber || ""}
                      onChange={(value) => onChange("matricNumber", value)}
                      placeholder="Enter matric number"
                      type="text"
                    />
                    <FormInput
                      label="National Exam Number"
                      icon={<Hash className="w-full h-full" />}
                      value={formData.nationalExamNumber || ""}
                      onChange={(value) => onChange("nationalExamNumber", value)}
                      placeholder="Enter national exam number"
                      type="text"
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Personal Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
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
              <FormInput
                label="Ethnic Group"
                icon={<Users className="w-full h-full" />}
                value={formData.ethnicGroup || ""}
                onChange={(value) => onChange("ethnicGroup", value)}
                placeholder="Enter ethnic group"
                type="text"
              />
              <FormInput
                label="Caste"
                icon={<Tag className="w-full h-full" />}
                value={formData.caste || ""}
                onChange={(value) => onChange("caste", value)}
                placeholder="Enter caste"
                type="text"
              />
              <FormDropdown
                label="House"
                icon={<Home className="w-full h-full" />}
                value={formData.house || ""}
                onChange={(value) => onChange("house", value)}
                options={houses}
                placeholder="Select house"
              />
              <FormDropdown
                label="Category"
                icon={<Tag className="w-full h-full" />}
                value={formData.category || ""}
                onChange={(value) => onChange("category", value)}
                options={categories}
                placeholder="Select category"
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
                Contact Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormInput
                label="Primary Contact Number"
                icon={<Phone className="w-full h-full" />}
                value={formData.primaryContact || ""}
                onChange={(value) => onChange("primaryContact", value)}
                placeholder="+234xxxxxxxxxx"
                type="text"
                required
                error={errors.primaryContact}
              />
              <FormInput
                label="Secondary Contact Number"
                icon={<Phone className="w-full h-full" />}
                value={formData.secondaryContact || ""}
                onChange={(value) => onChange("secondaryContact", value)}
                placeholder="+234xxxxxxxxxx"
                type="text"
              />
              <FormInput
                label="Email Address"
                icon={<Mail className="w-full h-full" />}
                value={formData.email || ""}
                onChange={(value) => onChange("email", value)}
                placeholder="student@example.com"
                type="email"
                required
                error={errors.email}
              />
            </div>
          </div>

          {/* Language Proficiency Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
                Language Proficiency
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormDropdown
                label="Mother Tongue"
                icon={<Languages className="w-full h-full" />}
                value={formData.motherTongue || ""}
                onChange={(value) => onChange("motherTongue", value)}
                options={motherTongues}
                placeholder="Select mother tongue"
              />
              <div>
                <TagInput
                  label="Languages Known"
                  value={Array.isArray(formData.languagesKnown) ? formData.languagesKnown : []}
                  onChange={(tags) => onChange("languagesKnown", tags)}
                  placeholder="Type a language and press Enter"
                  suggestions={languageOptions}
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
