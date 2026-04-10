"use client";

import { useState } from "react";
import {
  Building2,
  ChevronUp,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Hash,
  Calendar,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";

interface TertiaryDetailsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

export default function TertiaryDetailsSection({
  formData,
  onChange,
  errors = {},
}: TertiaryDetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Only show this section if education level is Tertiary
  if (formData.educationLevel !== "Tertiary") {
    return null;
  }

  const programmes = [
    { value: "B.Sc", label: "B.Sc (Bachelor of Science)" },
    { value: "B.Eng", label: "B.Eng (Bachelor of Engineering)" },
    { value: "B.A", label: "B.A (Bachelor of Arts)" },
    { value: "ND", label: "ND (National Diploma)" },
    { value: "HND", label: "HND (Higher National Diploma)" },
    { value: "NCE", label: "NCE (Nigeria Certificate in Education)" },
    { value: "MBBS", label: "MBBS (Bachelor of Medicine)" },
  ];

  const semesters = [
    { value: "First Semester", label: "First Semester" },
    { value: "Second Semester", label: "Second Semester" },
  ];

  // Add SIWES for ND/HND
  if (formData.programme === "ND" || formData.programme === "HND") {
    semesters.push({ value: "SIWES", label: "SIWES (Industrial Training)" });
  }

  // Level options based on programme
  const getLevelOptions = () => {
    if (formData.programme === "ND" || formData.programme === "HND") {
      return ["1", "2"].map(l => ({ value: l, label: l }));
    }
    if (formData.programme === "NCE") {
      return ["1", "2", "3"].map(l => ({ value: l, label: l }));
    }
    if (formData.programme === "MBBS") {
      return ["100L", "200L", "300L", "400L", "500L", "600L"].map(l => ({ value: l, label: l }));
    }
    return ["100L", "200L", "300L", "400L", "500L"].map(l => ({ value: l, label: l }));
  };

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-green-50/50 dark:bg-green-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-green-50 dark:hover:bg-green-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Faculty & Programme Details
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Row 1: Faculty & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Faculty"
              value={formData.faculty}
              onChange={(value) => onChange("faculty", value)}
              icon={<Building2 className="w-2.5 h-2.5" />}
              placeholder="e.g., Engineering, Sciences, Arts"
              required
              error={errors.faculty}
            />

            <FormInput
              label="Department"
              value={formData.department}
              onChange={(value) => onChange("department", value)}
              icon={<BookOpen className="w-2.5 h-2.5" />}
              placeholder="e.g., Computer Science, Electrical Engineering"
              required
              error={errors.department}
            />
          </div>

          {/* Row 2: Programme & Course Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDropdown
              label="Programme"
              value={formData.programme}
              onChange={(value) => {
                onChange("programme", value);
                onChange("courseLevel", "");
              }}
              options={programmes}
              icon={<GraduationCap className="w-2.5 h-2.5" />}
              placeholder="Select programme"
              required
              error={errors.programme}
            />

            <FormDropdown
              label="Course Level"
              value={formData.courseLevel}
              onChange={(value) => onChange("courseLevel", value)}
              options={getLevelOptions()}
              icon={<Hash className="w-2.5 h-2.5" />}
              placeholder="Select level"
              required
              error={errors.courseLevel}
              disabled={!formData.programme}
            />
          </div>

          {/* Row 3: Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDropdown
              label="Semester"
              value={formData.semester}
              onChange={(value) => onChange("semester", value)}
              options={semesters}
              icon={<Calendar className="w-2.5 h-2.5" />}
              placeholder="Select semester"
              required
              error={errors.semester}
            />
          </div>
        </div>
      )}
    </section>
  );
}
