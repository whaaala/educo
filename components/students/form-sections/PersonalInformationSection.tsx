"use client";

import { useState } from "react";
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
  ChevronDown
} from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import TagInput from "@/components/shared/TagInput";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";

interface PersonalInformationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function PersonalInformationSection({
  formData,
  onChange,
}: PersonalInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Sample data for dropdowns
  const academicYears = ["2024/2025", "2025/2026"].map(year => ({ value: year, label: year }));
  const statuses = ["Active", "Inactive", "Alumni", "Transferred"].map(s => ({ value: s, label: s }));
  const classes = [
    "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
    "JSS 1", "JSS 2", "JSS 3",
    "SS 1", "SS 2", "SS 3"
  ].map(c => ({ value: c, label: c }));
  const sections = ["A", "B", "C", "D"].map(s => ({ value: s, label: s }));
  const genders = ["Male", "Female", "Other"].map(g => ({ value: g, label: g }));
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => ({ value: bg, label: bg }));
  const houses = ["Mandela House", "Nyerere House", "Azikiwe House", "Lumumba House"].map(h => ({ value: h, label: h }));
  const religions = ["Christianity", "Islam", "Traditional", "Other"].map(r => ({ value: r, label: r }));
  const categories = ["General", "OBC", "SC", "ST", "Other"].map(c => ({ value: c, label: c }));
  const motherTongues = ["English", "Yoruba", "Hausa", "Igbo", "Swahili", "French", "Arabic"].map(l => ({ value: l, label: l }));
  const languageOptions = ["English", "French", "Yoruba", "Hausa", "Igbo", "Swahili", "Arabic", "Spanish"];

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
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
              Student details and academic information
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-6 space-y-8 animate-in fade-in duration-200">
          {/* Profile Photo Upload */}
          <div>
            <FileUpload
              value={formData.profilePhoto}
              onChange={(file) => onChange("profilePhoto", file)}
              helpText="Upload image size 4MB, Format JPG, PNG, SVG"
            />
          </div>

          {/* Academic Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Academic Details
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FormDropdown
                label="Academic Year"
                icon={<Calendar className="w-full h-full" />}
                value={formData.academicYear || ""}
                onChange={(value) => onChange("academicYear", value)}
                options={academicYears}
                placeholder="Select year"
              />
              <FormInput
                label="Admission Number"
                icon={<Hash className="w-full h-full" />}
                value={formData.admissionNumber || ""}
                onChange={(value) => onChange("admissionNumber", value)}
                placeholder="e.g., ADM-000345"
                type="text"
              />
              <FormInput
                label="Admission Date"
                icon={<Calendar className="w-full h-full" />}
                value={formData.admissionDate || ""}
                onChange={(value) => onChange("admissionDate", value)}
                type="text"
                placeholder="YYYY-MM-DD"
              />
              <FormInput
                label="Roll Number"
                icon={<Hash className="w-full h-full" />}
                value={formData.rollNumber || ""}
                onChange={(value) => onChange("rollNumber", value)}
                placeholder="Enter roll number"
                type="text"
              />
              <FormDropdown
                label="Status"
                icon={<BadgeCheck className="w-full h-full" />}
                value={formData.status || ""}
                onChange={(value) => onChange("status", value)}
                options={statuses}
                placeholder="Select status"
              />
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Personal Details
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FormInput
                label="First Name"
                icon={<User className="w-full h-full" />}
                value={formData.firstName || ""}
                onChange={(value) => onChange("firstName", value)}
                placeholder="Enter first name"
                type="text"
              />
              <FormInput
                label="Last Name"
                icon={<User className="w-full h-full" />}
                value={formData.lastName || ""}
                onChange={(value) => onChange("lastName", value)}
                placeholder="Enter last name"
                type="text"
              />
              <FormInput
                label="Other Names"
                icon={<User className="w-full h-full" />}
                value={formData.otherNames || ""}
                onChange={(value) => onChange("otherNames", value)}
                placeholder="Enter other names"
                type="text"
              />
              <FormDropdown
                label="Class"
                icon={<BookOpen className="w-full h-full" />}
                value={formData.class || ""}
                onChange={(value) => onChange("class", value)}
                options={classes}
                placeholder="Select class"
              />
              <FormDropdown
                label="Section"
                icon={<Users className="w-full h-full" />}
                value={formData.section || ""}
                onChange={(value) => onChange("section", value)}
                options={sections}
                placeholder="Select section"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FormDropdown
                label="Gender"
                icon={<Users className="w-full h-full" />}
                value={formData.gender || ""}
                onChange={(value) => onChange("gender", value)}
                options={genders}
                placeholder="Select gender"
              />
              <FormInput
                label="Date of Birth"
                icon={<Calendar className="w-full h-full" />}
                value={formData.dateOfBirth || ""}
                onChange={(value) => onChange("dateOfBirth", value)}
                type="text"
                placeholder="YYYY-MM-DD"
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
                label="House"
                icon={<Home className="w-full h-full" />}
                value={formData.house || ""}
                onChange={(value) => onChange("house", value)}
                options={houses}
                placeholder="Select house"
              />
              <FormDropdown
                label="Religion"
                icon={<BookOpen className="w-full h-full" />}
                value={formData.religion || ""}
                onChange={(value) => onChange("religion", value)}
                options={religions}
                placeholder="Select religion"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FormDropdown
                label="Category"
                icon={<Tag className="w-full h-full" />}
                value={formData.category || ""}
                onChange={(value) => onChange("category", value)}
                options={categories}
                placeholder="Select category"
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
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Contact Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormInput
                label="Primary Contact Number"
                icon={<Phone className="w-full h-full" />}
                value={formData.primaryContact || ""}
                onChange={(value) => onChange("primaryContact", value)}
                placeholder="+234xxxxxxxxxx"
                type="text"
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
              />
            </div>
          </div>

          {/* Language Proficiency Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Language Proficiency
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  value={formData.languagesKnown || []}
                  onChange={(tags) => onChange("languagesKnown", tags)}
                  placeholder="Type a language and press Enter"
                  suggestions={languageOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
