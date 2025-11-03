"use client";

import { Activity } from "lucide-react";
import TagInput from "@/components/shared/TagInput";

interface MedicalHistorySectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function MedicalHistorySection({
  formData,
  onChange,
}: MedicalHistorySectionProps) {
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
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 midnight:from-red-700 midnight:to-pink-700 purple:from-pink-600 purple:to-red-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Medical History & Health Information
            </h2>
            <p className="text-sm text-white/80">
              Student health details and medical conditions
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Medical Conditions */}
        <TagInput
          label="Medical Conditions (if any)"
          value={formData.medicalConditions || []}
          onChange={(tags) => onChange("medicalConditions", tags)}
          placeholder="Type condition and press Enter"
          suggestions={commonConditions}
        />

        {/* Allergies */}
        <TagInput
          label="Allergies"
          value={formData.allergies || []}
          onChange={(tags) => onChange("allergies", tags)}
          placeholder="Type allergy and press Enter"
          suggestions={commonAllergies}
        />

        {/* Current Medications */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            Current Medications
          </label>
          <textarea
            value={formData.currentMedications || ""}
            onChange={(e) => onChange("currentMedications", e.target.value)}
            placeholder="List any medications the student is currently taking, including dosage and frequency"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
          />
        </div>

        {/* Previous Surgeries/Hospitalizations */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            Previous Surgeries or Hospitalizations
          </label>
          <textarea
            value={formData.previousSurgeries || ""}
            onChange={(e) => onChange("previousSurgeries", e.target.value)}
            placeholder="Describe any previous surgeries or major hospitalizations"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
          />
        </div>

        {/* Emergency Contact (Medical) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Doctor&apos;s Name
            </label>
            <input
              type="text"
              value={formData.doctorName || ""}
              onChange={(e) => onChange("doctorName", e.target.value)}
              placeholder="Enter family doctor's name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Doctor&apos;s Phone Number
            </label>
            <input
              type="tel"
              value={formData.doctorPhone || ""}
              onChange={(e) => onChange("doctorPhone", e.target.value)}
              placeholder="+234xxxxxxxxxx"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Hospital/Clinic Name
            </label>
            <input
              type="text"
              value={formData.hospitalName || ""}
              onChange={(e) => onChange("hospitalName", e.target.value)}
              placeholder="Enter preferred hospital/clinic"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Hospital Phone Number
            </label>
            <input
              type="tel"
              value={formData.hospitalPhone || ""}
              onChange={(e) => onChange("hospitalPhone", e.target.value)}
              placeholder="+234xxxxxxxxxx"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>
        </div>

        {/* Special Dietary Requirements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            Special Dietary Requirements
          </label>
          <textarea
            value={formData.dietaryRequirements || ""}
            onChange={(e) => onChange("dietaryRequirements", e.target.value)}
            placeholder="Describe any special dietary needs or restrictions (e.g., vegetarian, halal, kosher, food intolerances)"
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
          />
        </div>

        {/* Additional Medical Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            Additional Medical Notes
          </label>
          <textarea
            value={formData.additionalMedicalNotes || ""}
            onChange={(e) =>
              onChange("additionalMedicalNotes", e.target.value)
            }
            placeholder="Any other medical information the school should be aware of"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 border border-red-200 dark:border-red-800/30 midnight:border-red-800/30 purple:border-red-800/30">
          <p className="text-sm text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300">
            <strong>Confidential:</strong> All medical information will be kept
            strictly confidential and used only for the student&apos;s health
            and safety at school.
          </p>
        </div>
      </div>
    </div>
  );
}
