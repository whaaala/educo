"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronUp,
  ChevronDown,
  Hash,
  GraduationCap,
  Boxes,
  Tag,
  Calendar,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import type { FormSectionProps } from "@/components/shared/form-section-types";
import type { ClassFormData } from "./types";

type BasicInformationSectionProps = FormSectionProps<ClassFormData>;

export default function BasicInformationSection({
  formData,
  onChange,
  errors = {},
}: BasicInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { settings } = useSchoolSettings();

  const isTertiary = formData.educationLevel === "Tertiary";  const isNursery = formData.educationLevel === "Nursery" || formData.educationLevel === "Kindergarten";
  // Section/Stream is optional for Nursery, required for others (except Tertiary)
  const isSectionOptional = isNursery;

  // Education levels from tenant settings
  const educationLevels = settings.supportedLevels.map(level => ({
    value: level,
    label: level
  }));

  // Level options based on education level
  const getLevelOptions = () => {
    if (formData.educationLevel === "Nursery" || formData.educationLevel === "Kindergarten") {
      return [
        { value: "Playgroup", label: "Playgroup" },
        { value: "Nursery 1", label: "Nursery 1" },
        { value: "Nursery 2", label: "Nursery 2" },
        { value: "KG 1", label: "KG 1" },
        { value: "KG 2", label: "KG 2" },
      ];
    }
    if (formData.educationLevel === "Primary") {
      return ["1", "2", "3", "4", "5", "6"].map(l => ({ value: l, label: `Primary ${l}` }));
    }
    if (formData.educationLevel === "Junior Secondary") {
      return ["1", "2", "3"].map(l => ({ value: l, label: `JSS ${l}` }));
    }
    if (formData.educationLevel === "Secondary") {
      return ["1", "2", "3"].map(l => ({ value: l, label: `SSS ${l}` }));
    }
    if (formData.educationLevel === "Tertiary" && formData.programme) {
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
    }
    return [];
  };

  const sections = ["A", "B", "C", "D"].map(s => ({ value: s, label: s }));
  const academicYears = ["2024/2025", "2023/2024", "2025/2026"].map(y => ({ value: y, label: y }));
  const terms = ["First Term", "Second Term", "Third Term"].map(t => ({ value: t, label: t }));
  const statuses = ["Active", "Inactive", "Archived"].map(s => ({ value: s, label: s }));

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-base font-semibold text-ink">
            Basic Information
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
          {/* Row 1: Education Level & Class Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDropdown
              label="Education Level"
              value={formData.educationLevel}
              onChange={(value) => {
                onChange("educationLevel", value);
                onChange("level", "");
                onChange("programme", "");
              }}
              options={educationLevels}
              icon={<GraduationCap className="w-2.5 h-2.5" />}
              placeholder="Select education level"
              required
              error={errors.educationLevel}
            />

            <FormInput
              label="Class Name"
              value={formData.className}
              onChange={(value) => onChange("className", value)}
              icon={<Tag className="w-2.5 h-2.5" />}
              placeholder={isTertiary ? "e.g., Computer Science 201" : "e.g., SSS 1A"}
              required
              error={errors.className}
            />
          </div>

          {/* Row 2: Level & Section (for non-tertiary) */}
          {!isTertiary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormDropdown
                label="Level"
                value={formData.level}
                onChange={(value) => onChange("level", value)}
                options={getLevelOptions()}
                icon={<Hash className="w-2.5 h-2.5" />}
                placeholder="Select level"
                required
                error={errors.level}
                disabled={!formData.educationLevel}
              />

              <FormDropdown
                label={`Section${isSectionOptional ? " (Optional)" : ""}`}
                value={formData.section}
                onChange={(value) => onChange("section", value)}
                options={sections}
                icon={<Boxes className="w-2.5 h-2.5" />}
                placeholder="Select section"
                required={!isSectionOptional}
                error={errors.section}
              />
            </div>
          )}

          {/* Row 3: Stream (optional for all) */}
          {!isTertiary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Stream (Optional)"
                value={formData.stream}
                onChange={(value) => onChange("stream", value)}
                icon={<Tag className="w-2.5 h-2.5" />}
                placeholder="e.g., Gold, Diamond"
                error={errors.stream}
              />
            </div>
          )}

          {/* Row 4: Academic Year & Term */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDropdown
              label="Academic Year"
              value={formData.academicYear}
              onChange={(value) => onChange("academicYear", value)}
              options={academicYears}
              icon={<Calendar className="w-2.5 h-2.5" />}
              placeholder="Select academic year"
              required
              error={errors.academicYear}
            />

            {!isTertiary && (
              <FormDropdown
                label="Term"
                value={formData.term}
                onChange={(value) => onChange("term", value)}
                options={terms}
                icon={<Calendar className="w-2.5 h-2.5" />}
                placeholder="Select term"
                required
                error={errors.term}
              />
            )}
          </div>

          {/* Row 5: Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDropdown
              label="Status"
              value={formData.status}
              onChange={(value) => onChange("status", value)}
              options={statuses}
              icon={<BookOpen className="w-2.5 h-2.5" />}
              placeholder="Select status"
              required
              error={errors.status}
            />
          </div>
        </div>
      )}
    </section>
  );
}
