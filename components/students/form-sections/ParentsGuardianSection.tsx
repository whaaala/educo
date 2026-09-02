"use client";

import { useState } from "react";
import { Users, ChevronDown, ChevronUp, User, Mail, Phone, Briefcase, MapPin, Heart, Hash, Globe, Info } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

interface ParentsGuardianSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function ParentsGuardianSection({
  formData,
  onChange,
  errors = {},
}: ParentsGuardianSectionProps) {
  // Helper function to check if a parent/guardian section is complete
  const isFatherComplete = () => {
    return !!(
      formData.fatherFirstName &&
      formData.fatherLastName &&
      formData.fatherEmail &&
      formData.fatherPhone
    );
  };

  const isMotherComplete = () => {
    return !!(
      formData.motherFirstName &&
      formData.motherLastName &&
      formData.motherEmail &&
      formData.motherPhone
    );
  };

  const isGuardianComplete = () => {
    return !!(
      formData.guardianFirstName &&
      formData.guardianLastName &&
      formData.guardianEmail &&
      formData.guardianPhone
    );
  };

  // Check if at least one is complete
  const hasAtLeastOneComplete = isFatherComplete() || isMotherComplete() || isGuardianComplete();
  
  // Determine which fields should show as required
  // If none are complete, show all as required. If one is complete, others are optional
  const showFatherRequired = !hasAtLeastOneComplete || !isFatherComplete();
  const showMotherRequired = !hasAtLeastOneComplete || !isMotherComplete();
  const showGuardianRequired = !hasAtLeastOneComplete || !isGuardianComplete();
  const [isExpanded, setIsExpanded] = useState(true);

  // Dropdown options
  const genders = ["Male", "Female", "Other"].map(g => ({ value: g, label: g }));
  const guardianRelations = [
    "Father",
    "Mother",
    "Uncle",
    "Aunt",
    "Grandfather",
    "Grandmother",
    "Brother",
    "Sister",
    "Cousin",
    "Sponsor",
    "Other"
  ].map(r => ({ value: r, label: r }));

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-purple-50/50 dark:bg-purple-900/10 midnight:bg-purple-900/10 purple:bg-pink-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20 midnight:hover:bg-purple-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Parents & Guardian Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Parent and guardian contact details
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
            {/* Info Box - At least one parent/guardian required */}
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20 border border-purple-200 dark:border-purple-800/30 midnight:border-purple-800/30 purple:border-pink-800/30">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-pink-300">
                  <strong className="font-semibold">Required:</strong> At least one parent or guardian (Father, Mother, or Guardian) must have complete information including First Name, Last Name, Email Address, and Phone Number.
                </p>
              </div>
            </div>

        {/* Father's Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
            </div>
            <h3 className="text-sm font-semibold text-ink">
              Father&apos;s Information
            </h3>
          </div>

          {/* Father's Photo */}
          <div className="pl-2">
            <FileUpload
              value={formData.fatherPhoto}
              onChange={(file) => onChange("fatherPhoto", file)}
              helpText="Upload image size 4MB, Format JPG, PNG, SVG"
              circular
              compact
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
            <FormInput
              label="First Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherFirstName || ""}
              onChange={(value) => onChange("fatherFirstName", value)}
              placeholder="Enter father's first name"
              type="text"
              required={showFatherRequired}
              error={errors.fatherFirstName}
            />
            <FormInput
              label="Last Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherLastName || ""}
              onChange={(value) => onChange("fatherLastName", value)}
              placeholder="Enter father's last name"
              type="text"
              required={showFatherRequired}
              error={errors.fatherLastName}
            />
            <FormInput
              label="Middle Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherMiddleName || ""}
              onChange={(value) => onChange("fatherMiddleName", value)}
              placeholder="Enter father's middle name"
              type="text"
            />
            <FormInput
              label="Email Address"
              icon={<Mail className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherEmail || ""}
              onChange={(value) => onChange("fatherEmail", value)}
              placeholder="father@example.com"
              type="email"
              required={showFatherRequired}
              error={errors.fatherEmail}
            />
            <FormInput
              label="Phone Number"
              icon={<Phone className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherPhone || ""}
              onChange={(value) => onChange("fatherPhone", value)}
              placeholder="+234xxxxxxxxxx"
              type="text"
              required={showFatherRequired}
              error={errors.fatherPhone}
            />
            <FormInput
              label="Occupation"
              icon={<Briefcase className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherOccupation || ""}
              onChange={(value) => onChange("fatherOccupation", value)}
              placeholder="Enter father's occupation"
              type="text"
            />
            <FormInput
              label="Address Line 1"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherAddressLine1 || ""}
              onChange={(value) => onChange("fatherAddressLine1", value)}
              placeholder="Street address and house number"
              type="text"
            />
            <FormInput
              label="Address Line 2"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherAddressLine2 || ""}
              onChange={(value) => onChange("fatherAddressLine2", value)}
              placeholder="Apartment, suite, unit, or P.O. Box"
              type="text"
            />
            <FormInput
              label="City/Town"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherCity || ""}
              onChange={(value) => onChange("fatherCity", value)}
              placeholder="Enter city or town"
              type="text"
            />
            <FormInput
              label="State"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherState || ""}
              onChange={(value) => onChange("fatherState", value)}
              placeholder="State or FCT"
              type="text"
            />
            <FormInput
              label="Postal Code"
              icon={<Hash className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherPostalCode || ""}
              onChange={(value) => onChange("fatherPostalCode", value)}
              placeholder="6-digit postal code"
              type="text"
            />
            <FormInput
              label="Country"
              icon={<Globe className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.fatherCountry || "Nigeria"}
              onChange={(value) => onChange("fatherCountry", value)}
              placeholder="Nigeria"
              type="text"
            />
          </div>
        </div>

        {/* Mother's Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
            </div>
            <h3 className="text-sm font-semibold text-ink">
              Mother&apos;s Information
            </h3>
          </div>

          {/* Mother's Photo */}
          <div className="pl-2">
            <FileUpload
              value={formData.motherPhoto}
              onChange={(file) => onChange("motherPhoto", file)}
              helpText="Upload image size 4MB, Format JPG, PNG, SVG"
              circular
              compact
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
            <FormInput
              label="First Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherFirstName || ""}
              onChange={(value) => onChange("motherFirstName", value)}
              placeholder="Enter mother's first name"
              type="text"
              required={showMotherRequired}
              error={errors.motherFirstName}
            />
            <FormInput
              label="Last Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherLastName || ""}
              onChange={(value) => onChange("motherLastName", value)}
              placeholder="Enter mother's last name"
              type="text"
              required={showMotherRequired}
              error={errors.motherLastName}
            />
            <FormInput
              label="Middle Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherMiddleName || ""}
              onChange={(value) => onChange("motherMiddleName", value)}
              placeholder="Enter mother's middle name"
              type="text"
            />
            <FormInput
              label="Email Address"
              icon={<Mail className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherEmail || ""}
              onChange={(value) => onChange("motherEmail", value)}
              placeholder="mother@example.com"
              type="email"
              required={showMotherRequired}
              error={errors.motherEmail}
            />
            <FormInput
              label="Phone Number"
              icon={<Phone className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherPhone || ""}
              onChange={(value) => onChange("motherPhone", value)}
              placeholder="+234xxxxxxxxxx"
              type="text"
              required={showMotherRequired}
              error={errors.motherPhone}
            />
            <FormInput
              label="Occupation"
              icon={<Briefcase className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherOccupation || ""}
              onChange={(value) => onChange("motherOccupation", value)}
              placeholder="Enter mother's occupation"
              type="text"
            />
            <FormInput
              label="Address Line 1"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherAddressLine1 || ""}
              onChange={(value) => onChange("motherAddressLine1", value)}
              placeholder="Street address and house number"
              type="text"
            />
            <FormInput
              label="Address Line 2"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherAddressLine2 || ""}
              onChange={(value) => onChange("motherAddressLine2", value)}
              placeholder="Apartment, suite, unit, or P.O. Box"
              type="text"
            />
            <FormInput
              label="City/Town"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherCity || ""}
              onChange={(value) => onChange("motherCity", value)}
              placeholder="Enter city or town"
              type="text"
            />
            <FormInput
              label="State"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherState || ""}
              onChange={(value) => onChange("motherState", value)}
              placeholder="State or FCT"
              type="text"
            />
            <FormInput
              label="Postal Code"
              icon={<Hash className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherPostalCode || ""}
              onChange={(value) => onChange("motherPostalCode", value)}
              placeholder="6-digit postal code"
              type="text"
            />
            <FormInput
              label="Country"
              icon={<Globe className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.motherCountry || "Nigeria"}
              onChange={(value) => onChange("motherCountry", value)}
              placeholder="Nigeria"
              type="text"
            />
          </div>
        </div>

        {/* Guardian Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
            </div>
            <h3 className="text-sm font-semibold text-ink">
              Guardian Information
            </h3>
          </div>

          {/* Guardian Photo */}
          <div className="pl-2">
            <FileUpload
              value={formData.guardianPhoto}
              onChange={(file) => onChange("guardianPhoto", file)}
              helpText="Upload image size 4MB, Format JPG, PNG, SVG"
              circular
              compact
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
            <FormInput
              label="First Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianFirstName || ""}
              onChange={(value) => onChange("guardianFirstName", value)}
              placeholder="Enter guardian's first name"
              type="text"
              required={showGuardianRequired}
              error={errors.guardianFirstName}
            />
            <FormInput
              label="Last Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianLastName || ""}
              onChange={(value) => onChange("guardianLastName", value)}
              placeholder="Enter guardian's last name"
              type="text"
              required={showGuardianRequired}
              error={errors.guardianLastName}
            />
            <FormInput
              label="Middle Name"
              icon={<User className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianMiddleName || ""}
              onChange={(value) => onChange("guardianMiddleName", value)}
              placeholder="Enter guardian's middle name"
              type="text"
            />
            <FormDropdown
              label="Gender"
              icon={<Users className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianGender || ""}
              onChange={(value) => onChange("guardianGender", value)}
              options={genders}
              placeholder="Select gender"
            />
            <FormDropdown
              label="Guardian Relation"
              icon={<Users className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianRelation || ""}
              onChange={(value) => onChange("guardianRelation", value)}
              options={guardianRelations}
              placeholder="Select relation"
            />
            <FormInput
              label="Phone Number"
              icon={<Phone className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianPhone || ""}
              onChange={(value) => onChange("guardianPhone", value)}
              placeholder="+234xxxxxxxxxx"
              type="text"
              required={showGuardianRequired}
              error={errors.guardianPhone}
            />
            <FormInput
              label="Email Address"
              icon={<Mail className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianEmail || ""}
              onChange={(value) => onChange("guardianEmail", value)}
              placeholder="guardian@example.com"
              type="email"
              required={showGuardianRequired}
              error={errors.guardianEmail}
            />
            <FormInput
              label="Occupation"
              icon={<Briefcase className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianOccupation || ""}
              onChange={(value) => onChange("guardianOccupation", value)}
              placeholder="Enter guardian's occupation"
              type="text"
            />
            <FormInput
              label="Address Line 1"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianAddressLine1 || ""}
              onChange={(value) => onChange("guardianAddressLine1", value)}
              placeholder="Street address and house number"
              type="text"
            />
            <FormInput
              label="Address Line 2"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianAddressLine2 || ""}
              onChange={(value) => onChange("guardianAddressLine2", value)}
              placeholder="Apartment, suite, unit, or P.O. Box"
              type="text"
            />
            <FormInput
              label="City/Town"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianCity || ""}
              onChange={(value) => onChange("guardianCity", value)}
              placeholder="Enter city or town"
              type="text"
            />
            <FormInput
              label="State"
              icon={<MapPin className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianState || ""}
              onChange={(value) => onChange("guardianState", value)}
              placeholder="State or FCT"
              type="text"
            />
            <FormInput
              label="Postal Code"
              icon={<Hash className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianPostalCode || ""}
              onChange={(value) => onChange("guardianPostalCode", value)}
              placeholder="6-digit postal code"
              type="text"
            />
            <FormInput
              label="Country"
              icon={<Globe className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
              iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
              value={formData.guardianCountry || "Nigeria"}
              onChange={(value) => onChange("guardianCountry", value)}
              placeholder="Nigeria"
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
