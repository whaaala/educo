"use client";

import { useState } from "react";
import { Users, ChevronDown, ChevronUp, User, Mail, Phone, Briefcase, MapPin, Heart, Hash, Globe } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";

interface ParentsGuardianSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function ParentsGuardianSection({
  formData,
  onChange,
}: ParentsGuardianSectionProps) {
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
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-purple-50/50 dark:bg-purple-900/10 midnight:bg-purple-900/10 purple:bg-pink-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20 midnight:hover:bg-purple-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Parents & Guardian Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Parent and guardian contact details
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10 animate-in fade-in duration-200">
        {/* Father's Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
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
      )}
    </section>
  );
}
