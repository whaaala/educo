"use client";

import { useState, useEffect } from "react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { Building2, AlertCircle, GraduationCap, BadgeCheck } from "lucide-react";

type EducationLevel = "primary" | "secondary" | "tertiary" | "multi-level";
type InstitutionType = "private" | "public";

const EDUCATION_LEVEL_OPTIONS = [
  { label: "Primary School Only", value: "primary" },
  { label: "Secondary School Only", value: "secondary" },
  { label: "Tertiary Institution (University/College)", value: "tertiary" },
  { label: "Multi-Level School (Primary + Secondary)", value: "multi-level" },
];

const INSTITUTION_TYPE_OPTIONS = [
  { label: "Private Institution", value: "private" },
  { label: "Public/Government Institution", value: "public" },
];

export default function SchoolProfileSettings() {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("multi-level");
  const [institutionType, setInstitutionType] = useState<InstitutionType>("private");

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedEducationLevel = localStorage.getItem("educationLevel") as EducationLevel;
    const savedInstitutionType = localStorage.getItem("institutionType") as InstitutionType;

    if (savedEducationLevel) {
      setEducationLevel(savedEducationLevel);
    }
    if (savedInstitutionType) {
      setInstitutionType(savedInstitutionType);
    }
  }, []);

  const handleEducationLevelChange = (value: string | number) => {
    const newEducationLevel = value as EducationLevel;
    setEducationLevel(newEducationLevel);
    localStorage.setItem("educationLevel", newEducationLevel);

    // Dispatch custom event to notify other components about the change
    window.dispatchEvent(
      new CustomEvent("schoolProfileChanged", {
        detail: { educationLevel: newEducationLevel, institutionType },
      })
    );
  };

  const handleInstitutionTypeChange = (value: string | number) => {
    const newInstitutionType = value as InstitutionType;
    setInstitutionType(newInstitutionType);
    localStorage.setItem("institutionType", newInstitutionType);

    // Dispatch custom event to notify other components about the change
    window.dispatchEvent(
      new CustomEvent("schoolProfileChanged", {
        detail: { educationLevel, institutionType: newInstitutionType },
      })
    );
  };

  const getEducationLevelDescription = (level: EducationLevel): string => {
    const descriptions: Record<EducationLevel, string> = {
      primary: "For schools teaching grades/classes at the primary/elementary level only (typically ages 5-12). Supports Primary 1-6, Grade 1-6, Kindergarten, Nursery.",
      secondary: "For schools teaching grades/classes at the secondary level only (typically ages 13-18). Supports JSS/SS 1-3, JHS/SHS 1-3, Form 1-4, Grade 7-12.",
      tertiary: "For universities, colleges, polytechnics, and other higher education institutions. Displays GPA, credits, and letter grades instead of percentage-based marks.",
      "multi-level": "For institutions with multiple education levels (both primary and secondary sections). The system will automatically detect each student's level based on their class.",
    };
    return descriptions[level];
  };

  return (
    <div className="space-y-6">
      {/* Education Level Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
            Education Level
          </label>
        </div>
        <CustomDropdown
          value={educationLevel}
          options={EDUCATION_LEVEL_OPTIONS}
          onChange={handleEducationLevelChange}
          variant="blue"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
          {getEducationLevelDescription(educationLevel)}
        </p>
      </div>

      {/* Institution Type Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
            Institution Type (Ownership)
          </label>
        </div>
        <CustomDropdown
          value={institutionType}
          options={INSTITUTION_TYPE_OPTIONS}
          onChange={handleInstitutionTypeChange}
          variant="purple"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
          {institutionType === "private"
            ? "Privately owned and operated institution. Affects available fee categories and payment channels."
            : "Government-run or public institution. Affects available fee categories and payment channels."}
        </p>
      </div>

      {/* Important Notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-700 midnight:border-cyan-700 purple:border-pink-700 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
              How These Settings Affect Your Application
            </p>
            <ul className="text-xs text-blue-800 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-2 space-y-1 list-disc list-inside">
              <li><span className="font-medium">Exam Results:</span> Display format changes based on education level (marks vs. GPA/credits)</li>
              <li><span className="font-medium">Fee Structure:</span> Available fee categories and payment channels vary by institution type</li>
              <li><span className="font-medium">Student Forms:</span> Admission and registration fields adapt to your institution</li>
              <li><span className="font-medium">Reports:</span> Report card and transcript formats match your education level</li>
              <li><span className="font-medium">Academic Calendar:</span> Terms, semesters, and session structure based on your level</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Multi-level School Info */}
      {educationLevel === "multi-level" && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 border border-green-200 dark:border-green-700 midnight:border-green-700 purple:border-green-700 rounded-lg">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-900 dark:text-green-300 midnight:text-green-300 purple:text-green-300">
                Multi-Level School Configuration
              </p>
              <p className="text-xs text-green-800 dark:text-green-400 midnight:text-green-400 purple:text-green-400 mt-1">
                Your school has both primary and secondary sections. The system will automatically determine each student's education level based on their class:
              </p>
              <ul className="text-xs text-green-800 dark:text-green-400 midnight:text-green-400 purple:text-green-400 mt-2 space-y-1 list-disc list-inside ml-2">
                <li>Students in "Primary 1-6", "Grade 1-6", "Kindergarten" → <span className="font-semibold">Primary Level Display</span></li>
                <li>Students in "JSS/SS 1-3", "Form 1-4", "Grade 7-12" → <span className="font-semibold">Secondary Level Display</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Current Configuration Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 mb-2">
          Current Configuration
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Education Level
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 mt-1">
              {EDUCATION_LEVEL_OPTIONS.find(opt => opt.value === educationLevel)?.label}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Institution Type
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 mt-1">
              {INSTITUTION_TYPE_OPTIONS.find(opt => opt.value === institutionType)?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
