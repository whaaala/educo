"use client";

import { useState, useEffect } from "react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { Building2, AlertCircle, GraduationCap, BadgeCheck, Check } from "lucide-react";

type EducationLevelOption = "Primary" | "Secondary" | "Tertiary";
type InstitutionType = "private" | "public";
type TertiaryType = "university" | "college" | "polytechnic" | "institute";
type SchoolScheduleType = "full-time" | "after-school" | "weekend" | "online" | "hybrid";

const INSTITUTION_TYPE_OPTIONS = [
  { label: "Private Institution", value: "private" },
  { label: "Public/Government Institution", value: "public" },
];

const TERTIARY_TYPE_OPTIONS = [
  { label: "University", value: "university" },
  { label: "College", value: "college" },
  { label: "Polytechnic", value: "polytechnic" },
  { label: "Technical Institute", value: "institute" },
];

const SCHOOL_SCHEDULE_OPTIONS = [
  { label: "Full-Time Day School", value: "full-time" },
  { label: "After-School Program", value: "after-school" },
  { label: "Weekend School", value: "weekend" },
  { label: "Online/Virtual School", value: "online" },
  { label: "Hybrid (Mixed Schedule)", value: "hybrid" },
];

export default function SchoolProfileSettings() {
  const [selectedLevels, setSelectedLevels] = useState<EducationLevelOption[]>(["Secondary"]);
  const [institutionType, setInstitutionType] = useState<InstitutionType>("private");
  const [tertiaryType, setTertiaryType] = useState<TertiaryType>("university");
  const [scheduleType, setScheduleType] = useState<SchoolScheduleType>("full-time");

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedLevels = localStorage.getItem("educationLevels");
    const savedInstitutionType = localStorage.getItem("institutionType") as InstitutionType;
    const savedTertiaryType = localStorage.getItem("tertiaryType") as TertiaryType;
    const savedScheduleType = localStorage.getItem("scheduleType") as SchoolScheduleType;

    if (savedLevels) {
      try {
        const levels = JSON.parse(savedLevels) as EducationLevelOption[];
        setSelectedLevels(levels);
      } catch (e) {
        // Fallback for old single-value format
        const oldValue = localStorage.getItem("educationLevel");
        if (oldValue === "primary") setSelectedLevels(["Primary"]);
        else if (oldValue === "secondary") setSelectedLevels(["Secondary"]);
        else if (oldValue === "tertiary") setSelectedLevels(["Tertiary"]);
        else if (oldValue === "multi-level") setSelectedLevels(["Primary", "Secondary"]);
      }
    }
    if (savedInstitutionType) {
      setInstitutionType(savedInstitutionType);
    }
    if (savedTertiaryType) {
      setTertiaryType(savedTertiaryType);
    }
    if (savedScheduleType) {
      setScheduleType(savedScheduleType);
    }
  }, []);

  const toggleEducationLevel = (level: EducationLevelOption) => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter(l => l !== level)
      : [...selectedLevels, level];

    // Ensure at least one level is selected
    if (newLevels.length === 0) return;

    setSelectedLevels(newLevels);
    localStorage.setItem("educationLevels", JSON.stringify(newLevels));

    // Dispatch custom event to notify other components about the change
    window.dispatchEvent(
      new CustomEvent("schoolProfileChanged", {
        detail: { educationLevels: newLevels, institutionType, tertiaryType, scheduleType },
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
        detail: { educationLevels: selectedLevels, institutionType: newInstitutionType, tertiaryType, scheduleType },
      })
    );
  };

  const handleTertiaryTypeChange = (value: string | number) => {
    const newTertiaryType = value as TertiaryType;
    setTertiaryType(newTertiaryType);
    localStorage.setItem("tertiaryType", newTertiaryType);

    // Dispatch custom event to notify other components about the change
    window.dispatchEvent(
      new CustomEvent("schoolProfileChanged", {
        detail: { educationLevels: selectedLevels, institutionType, tertiaryType: newTertiaryType, scheduleType },
      })
    );
  };

  const handleScheduleTypeChange = (value: string | number) => {
    const newScheduleType = value as SchoolScheduleType;
    setScheduleType(newScheduleType);
    localStorage.setItem("scheduleType", newScheduleType);

    // Dispatch custom event to notify other components about the change
    window.dispatchEvent(
      new CustomEvent("schoolProfileChanged", {
        detail: { educationLevels: selectedLevels, institutionType, tertiaryType, scheduleType: newScheduleType },
      })
    );
  };

  const getEducationLevelDescription = (level: EducationLevelOption): string => {
    const descriptions: Record<EducationLevelOption, string> = {
      Primary: "For schools teaching grades/classes at the primary/elementary level (typically ages 5-12). Supports Primary 1-6, Grade 1-6, Kindergarten, Nursery.",
      Secondary: "For schools teaching grades/classes at the secondary level (typically ages 13-18). Supports JSS/SS 1-3, JHS/SHS 1-3, Form 1-4, Grade 7-12.",
      Tertiary: "For universities, colleges, polytechnics, and other higher education institutions. Displays GPA, credits, and letter grades instead of percentage-based marks.",
    };
    return descriptions[level];
  };

  const getSelectedLevelsDescription = (): string => {
    if (selectedLevels.length === 1) {
      return getEducationLevelDescription(selectedLevels[0]);
    } else if (selectedLevels.length === 2) {
      return `Multi-level institution with both ${selectedLevels[0]} and ${selectedLevels[1]} sections. The system will automatically detect each student's level based on their class.`;
    } else {
      return `Multi-level institution with Primary, Secondary, and Tertiary sections. The system will automatically detect each student's level based on their class.`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Education Level Selector - Checkboxes */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
            Education Levels
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            (Select all that apply)
          </span>
        </div>

        <div className="space-y-3 p-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
          {(["Primary", "Secondary", "Tertiary"] as EducationLevelOption[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => toggleEducationLevel(level)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selectedLevels.includes(level)
                  ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}>
                {selectedLevels.includes(level) && (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {level} Education
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                  {getEducationLevelDescription(level)}
                </p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
          {getSelectedLevelsDescription()}
        </p>
      </div>

      {/* Tertiary Institution Type - Only shows if Tertiary is selected */}
      {selectedLevels.includes("Tertiary") && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
              Tertiary Institution Type
            </label>
          </div>
          <CustomDropdown
            value={tertiaryType}
            options={TERTIARY_TYPE_OPTIONS}
            onChange={handleTertiaryTypeChange}
            variant="purple"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
            Specify the type of tertiary institution. This affects program structures, degree nomenclature, and academic calendar formats.
          </p>
        </div>
      )}

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
          variant="blue"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
          {institutionType === "private"
            ? "Privately owned and operated institution. Affects available fee categories and payment channels."
            : "Government-run or public institution. Affects available fee categories and payment channels."}
        </p>
      </div>

      {/* School Schedule/Operation Type */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
            School Schedule/Operation Type
          </label>
        </div>
        <CustomDropdown
          value={scheduleType}
          options={SCHOOL_SCHEDULE_OPTIONS}
          onChange={handleScheduleTypeChange}
          variant="green"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
          {scheduleType === "full-time" && "Traditional full-time day school with regular daily schedule."}
          {scheduleType === "after-school" && "After-school program running outside regular school hours, typically for supplementary education."}
          {scheduleType === "weekend" && "Weekend school operating on Saturdays and/or Sundays."}
          {scheduleType === "online" && "Fully online or virtual school with remote learning."}
          {scheduleType === "hybrid" && "Hybrid model combining in-person and online learning, or mixed schedule patterns."}
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
      {selectedLevels.length > 1 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 border border-green-200 dark:border-green-700 midnight:border-green-700 purple:border-green-700 rounded-lg">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-900 dark:text-green-300 midnight:text-green-300 purple:text-green-300">
                Multi-Level Institution Configuration
              </p>
              <p className="text-xs text-green-800 dark:text-green-400 midnight:text-green-400 purple:text-green-400 mt-1">
                Your institution has {selectedLevels.join(", ")} sections. The system will automatically determine each student's education level based on their class:
              </p>
              <ul className="text-xs text-green-800 dark:text-green-400 midnight:text-green-400 purple:text-green-400 mt-2 space-y-1 list-disc list-inside ml-2">
                {selectedLevels.includes("Primary") && (
                  <li>Students in "Primary 1-6", "Grade 1-6", "Year 1-6", "Kindergarten" → <span className="font-semibold">Primary Level</span></li>
                )}
                {selectedLevels.includes("Secondary") && (
                  <li>Students in "JSS/SSS 1-3", "Year 7-13", "Form 1-4", "Grade 7-12" → <span className="font-semibold">Secondary Level</span></li>
                )}
                {selectedLevels.includes("Tertiary") && (
                  <li>Students in "100-800 Level", "ND/HND", "Undergraduate/Postgraduate" → <span className="font-semibold">Tertiary Level</span></li>
                )}
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
              Education Levels
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 mt-1">
              {selectedLevels.join(", ")}
              {selectedLevels.length > 1 && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Multi-level)</span>}
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
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              School Schedule
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 mt-1">
              {SCHOOL_SCHEDULE_OPTIONS.find(opt => opt.value === scheduleType)?.label}
            </p>
          </div>
          {selectedLevels.includes("Tertiary") && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                Tertiary Type
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 mt-1">
                {TERTIARY_TYPE_OPTIONS.find(opt => opt.value === tertiaryType)?.label}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
