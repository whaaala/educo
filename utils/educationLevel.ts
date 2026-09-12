/**
 * Utility functions for detecting and managing education levels
 * Based on PRD requirements for Primary, Secondary, and Tertiary classification
 */

export type EducationLevel = "Nursery" | "Kindergarten" | "Primary" | "Junior Secondary" | "Secondary" | "Tertiary" | "";

/**
 * Auto-detect education level from class/grade name
 * Supports multiple naming conventions from different countries
 */
export function detectEducationLevelFromClass(className: string): EducationLevel {
  if (!className) return "";

  // Extract the class name part before the comma (e.g., "III, A" -> "III")
  const classPart = className.split(',')[0].trim();
  const classLower = classPart.toLowerCase();

  // Primary Level Detection
  if (
    classLower.includes("primary") ||
    classLower.includes("elementary") ||
    classLower.includes("prep") ||
    classLower.includes("kg") ||
    classLower.includes("kindergarten") ||
    classLower.includes("nursery") ||
    classLower.includes("grade 1") ||
    classLower.includes("grade 2") ||
    classLower.includes("grade 3") ||
    classLower.includes("grade 4") ||
    classLower.includes("grade 5") ||
    classLower.includes("grade 6") ||
    classLower.includes("std 1") ||
    classLower.includes("std 2") ||
    classLower.includes("std 3") ||
    classLower.includes("std 4") ||
    classLower.includes("std 5") ||
    classLower.includes("std 6") ||
    classLower.includes("year 1") || // UK/Australia primary
    classLower.includes("year 2") ||
    classLower.includes("year 3") ||
    classLower.includes("year 4") ||
    classLower.includes("year 5") ||
    classLower.includes("year 6") ||
    classLower.match(/^(i|ii|iii|iv|v|vi)$/) // Roman numerals 1-6
  ) {
    return "Primary";
  }

  // Secondary Level Detection
  if (
    classLower.includes("secondary") ||
    classLower.includes("jss") || // Junior Secondary School
    classLower.includes("sss") || // Senior Secondary School
    classLower.includes("ss ") ||
    classLower.includes("jhs") || // Junior High School
    classLower.includes("shs") || // Senior High School
    classLower.includes("senior") ||
    classLower.includes("grade 7") ||
    classLower.includes("grade 8") ||
    classLower.includes("grade 9") ||
    classLower.includes("grade 10") ||
    classLower.includes("grade 11") ||
    classLower.includes("grade 12") ||
    classLower.includes("std 7") ||
    classLower.includes("std 8") ||
    classLower.includes("std 9") ||
    classLower.includes("std 10") ||
    classLower.includes("std 11") ||
    classLower.includes("std 12") ||
    classLower.includes("year 7") || // UK/Australia secondary
    classLower.includes("year 8") ||
    classLower.includes("year 9") ||
    classLower.includes("year 10") ||
    classLower.includes("year 11") ||
    classLower.includes("year 12") ||
    classLower.includes("year 13") || // Some countries have Year 13
    classLower.match(/^(vii|viii|ix|x|xi|xii)$/) // Roman numerals 7-12
  ) {
    return "Secondary";
  }

  // Tertiary Level Detection
  if (
    classLower.includes("100 level") ||
    classLower.includes("200 level") ||
    classLower.includes("300 level") ||
    classLower.includes("400 level") ||
    classLower.includes("500 level") ||
    classLower.includes("600 level") ||
    classLower.includes("700 level") ||
    classLower.includes("800 level") ||
    classLower.includes("semester") ||
    classLower.includes("nd 1") || // National Diploma Year 1
    classLower.includes("nd 2") ||
    classLower.includes("hnd 1") || // Higher National Diploma Year 1
    classLower.includes("hnd 2") ||
    classLower.includes("bachelor") ||
    classLower.includes("undergraduate") ||
    classLower.includes("master") ||
    classLower.includes("postgraduate") ||
    classLower.includes("phd") ||
    classLower.includes("doctorate") ||
    classLower.includes("university")
  ) {
    return "Tertiary";
  }

  // Default: return empty string if cannot detect
  return "";
}

/**
 * Get education level display color classes for badges/indicators
 */
export function getEducationLevelColor(level: EducationLevel): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  switch (level) {
    case "Primary":
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300",
        border: "border-blue-300 dark:border-blue-700 midnight:border-blue-700 purple:border-blue-700",
        icon: "text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400"
      };
    case "Secondary":
      return {
        bg: "bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-purple-300",
        border: "border-purple-300 dark:border-purple-700 midnight:border-purple-700 purple:border-purple-700",
        icon: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400"
      };
    case "Tertiary":
      return {
        bg: "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
        text: "text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300",
        border: "border-green-300 dark:border-green-700 midnight:border-green-700 purple:border-green-700",
        icon: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400"
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300",
        border: "border-gray-300 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700",
        icon: "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400"
      };
  }
}

export type InstitutionType = "Public" | "Private" | "International" | "";

/**
 * Get institution type display color classes for badges/indicators
 */
export function getInstitutionTypeColor(type: InstitutionType): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  switch (type) {
    case "Public":
      return {
        bg: "bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300 midnight:text-emerald-300 purple:text-emerald-300",
        border: "border-emerald-300 dark:border-emerald-700 midnight:border-emerald-700 purple:border-emerald-700",
        icon: "text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
      };
    case "Private":
      return {
        bg: "bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300",
        border: "border-amber-300 dark:border-amber-700 midnight:border-amber-700 purple:border-amber-700",
        icon: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
      };
    case "International":
      return {
        bg: "bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30",
        text: "text-indigo-700 dark:text-indigo-300 midnight:text-indigo-300 purple:text-indigo-300",
        border: "border-indigo-300 dark:border-indigo-700 midnight:border-indigo-700 purple:border-indigo-700",
        icon: "text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300",
        border: "border-gray-300 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700",
        icon: "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400"
      };
  }
}
