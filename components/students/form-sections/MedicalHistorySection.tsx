"use client";

import { useState } from "react";
import {
  Activity,
  ChevronUp,
  ChevronDown,
  Info,
  Heart,
  Pill,
  Stethoscope,
  Phone,
  Building2,
  UtensilsCrossed,
  FileText,
  AlertCircle,
} from "lucide-react";
import TagInput from "@/components/shared/TagInput";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";
import { ValidationErrors } from "@/lib/validation";

interface MedicalHistorySectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function MedicalHistorySection({
  formData,
  onChange,
  errors = {},
}: MedicalHistorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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

  const commonConditions = [
    "Asthma",
    "Diabetes",
    "Epilepsy",
    "Heart Condition",
    "ADHD",
    "Autism",
    "Dyslexia",
    "Vision Impairment",
    "Hearing Impairment",
    "Sickle Cell",
    "Hemophilia",
    "Food Intolerance",
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
              Medical History & Health Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Student health details and medical conditions
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400">
                      <Stethoscope className="w-full h-full" />
                    </div>
                  </div>
                  <span>Medical Conditions (if any)</span>
                </label>
                <TagInput
                  value={Array.isArray(formData.medicalConditions) ? formData.medicalConditions : []}
                  onChange={(tags) => onChange("medicalConditions", tags)}
                  placeholder="Type condition and press Enter"
                  suggestions={commonConditions}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400">
                      <Heart className="w-full h-full" />
                    </div>
                  </div>
                  <span>Allergies</span>
                </label>
                <TagInput
                  value={Array.isArray(formData.allergies) ? formData.allergies : []}
                  onChange={(tags) => onChange("allergies", tags)}
                  placeholder="Type allergy and press Enter"
                  suggestions={commonAllergies}
                />
              </div>
            </div>
          </div>

          {/* Medications & Medical History Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/20 midnight:bg-pink-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <Pill className="w-4 h-4 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
                Medications & Medical History
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormTextarea
                label="Current Medications"
                icon={<Pill className="w-full h-full" />}
                iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                value={formData.currentMedications || ""}
                onChange={(value) => onChange("currentMedications", value)}
                placeholder="List any medications the student is currently taking, including dosage and frequency"
                rows={3}
              />
              <FormTextarea
                label="Previous Surgeries or Hospitalizations"
                icon={<Stethoscope className="w-full h-full" />}
                iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                value={formData.previousSurgeries || ""}
                onChange={(value) => onChange("previousSurgeries", value)}
                placeholder="Describe any previous surgeries or major hospitalizations"
                rows={3}
              />
            </div>
          </div>

          {/* Emergency Contact (Medical) Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/20 midnight:bg-pink-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
                Emergency Contact (Medical)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormInput
                label="Doctor's Name"
                icon={<Stethoscope className="w-full h-full" />}
                iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                value={formData.doctorName || ""}
                onChange={(value) => onChange("doctorName", value)}
                placeholder="Enter family doctor's name"
                type="text"
              />
              <FormInput
                label="Doctor's Phone Number"
                icon={<Phone className="w-full h-full" />}
                iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                value={formData.doctorPhone || ""}
                onChange={(value) => onChange("doctorPhone", value)}
                placeholder="+234xxxxxxxxxx"
                type="text"
              />
              <FormInput
                label="Hospital/Clinic Name"
                icon={<Building2 className="w-full h-full" />}
                iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                value={formData.hospitalName || ""}
                onChange={(value) => onChange("hospitalName", value)}
                placeholder="Enter preferred hospital/clinic"
                type="text"
              />
              <FormInput
                label="Hospital Phone Number"
                icon={<Phone className="w-full h-full" />}
                iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                value={formData.hospitalPhone || ""}
                onChange={(value) => onChange("hospitalPhone", value)}
                placeholder="+234xxxxxxxxxx"
                type="text"
              />
            </div>
          </div>

          {/* Dietary & Additional Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/20 midnight:bg-pink-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
                Dietary & Additional Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormTextarea
                label="Special Dietary Requirements"
                icon={<UtensilsCrossed className="w-full h-full" />}
                iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                value={formData.dietaryRequirements || ""}
                onChange={(value) => onChange("dietaryRequirements", value)}
                placeholder="Describe any special dietary needs or restrictions (e.g., vegetarian, halal, kosher, food intolerances)"
                rows={2}
              />
              <FormTextarea
                label="Additional Medical Notes"
                icon={<FileText className="w-full h-full" />}
                iconBgColor="bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30"
                iconColor="text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400"
                value={formData.additionalMedicalNotes || ""}
                onChange={(value) => onChange("additionalMedicalNotes", value)}
                placeholder="Any other medical information the school should be aware of"
                rows={2}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="pl-2">
            <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 midnight:bg-pink-900/20 purple:bg-pink-900/20 border border-pink-200 dark:border-pink-800/30 midnight:border-pink-800/30 purple:border-pink-800/30">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-pink-100 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400" />
                </div>
                <p className="text-sm text-pink-700 dark:text-pink-300 midnight:text-pink-300 purple:text-pink-300">
                  <strong className="font-semibold">Confidential:</strong> All
                  medical information will be kept strictly confidential and used
                  only for the student&apos;s health and safety at school.
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
