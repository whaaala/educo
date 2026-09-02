"use client";

import { useState } from "react";
import {
  Activity,
  ChevronUp,
  Heart,
  AlertCircle,
  FileText,
} from "lucide-react";
import TagInput from "@/components/shared/TagInput";
import FormTextarea from "@/components/shared/FormTextarea";
import FileUpload from "@/components/shared/FileUpload";
import { ValidationErrors } from "@/lib/validation";

interface MedicalInformationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function MedicalInformationSection({
  formData,
  onChange,
  errors = {},
}: MedicalInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const commonConditions = [
    "Asthma",
    "Diabetes",
    "Hypertension",
    "Heart Condition",
    "Epilepsy",
    "Migraine",
    "Arthritis",
    "Back Pain",
    "Vision Impairment",
    "Hearing Impairment",
    "Thyroid Disorder",
  ];

  const commonAllergies = [
    "Peanuts",
    "Tree Nuts",
    "Milk",
    "Eggs",
    "Wheat",
    "Soy",
    "Fish",
    "Shellfish",
    "Penicillin",
    "Aspirin",
    "Dust",
    "Pollen",
    "Pet Dander",
    "Insect Stings",
    "Latex",
  ];

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-pink-50/50 dark:bg-pink-900/10 midnight:bg-pink-900/10 purple:bg-pink-900/10 hover:bg-pink-50 dark:hover:bg-pink-900/20 midnight:hover:bg-pink-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Medical Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Health details and medical conditions
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
            {/* Medical Conditions & Allergies Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/20 midnight:bg-pink-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Medical Conditions & Allergies
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <div>
                  <TagInput
                    label="Medical Conditions (if any)"
                    value={formData.medicalConditions || []}
                    onChange={(tags) => onChange("medicalConditions", tags)}
                    placeholder="Type condition and press Enter"
                    suggestions={commonConditions}
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    List any chronic or ongoing medical conditions
                  </p>
                </div>
                <div>
                  <TagInput
                    label="Allergies"
                    value={formData.allergies || []}
                    onChange={(tags) => onChange("allergies", tags)}
                    placeholder="Type allergy and press Enter"
                    suggestions={commonAllergies}
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    List any known allergies (food, medication, environmental)
                  </p>
                </div>
              </div>
            </div>

            {/* Disability Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/20 midnight:bg-pink-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Disability Information
                </h3>
              </div>
              <div className="pl-2">
                <FormTextarea
                  label="Disability Details (if any)"
                  icon={<Heart className="w-full h-full" />}
                  iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                  iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                  value={formData.disabilityInfo || ""}
                  onChange={(value) => onChange("disabilityInfo", value)}
                  placeholder="Describe any physical or mental disabilities, and any accommodations needed"
                  rows={3}
                />
              </div>
            </div>

            {/* Medical Documentation Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/20 midnight:bg-pink-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Medical Documentation
                </h3>
              </div>
              <div className="pl-2">
                <FileUpload
                  label="Doctor's Note / Medical Certificate"
                  value={formData.doctorNote}
                  onChange={(file) => onChange("doctorNote", file)}
                  helpText="Upload PDF document (Max 5MB)"
                  accept=".pdf"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Optional: Upload medical certificate if required for accommodations
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="pl-2">
              <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 midnight:bg-pink-900/20 purple:bg-pink-900/20 border border-pink-200 dark:border-pink-800/30 midnight:border-pink-800/30 purple:border-pink-800/30">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
                  </div>
                  <p className="text-sm text-pink-700 dark:text-pink-300 midnight:text-pink-300 purple:text-pink-300">
                    <strong className="font-semibold">Confidential:</strong> All
                    medical information will be kept strictly confidential and used
                    only for the staff member&apos;s health and safety at the institution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
