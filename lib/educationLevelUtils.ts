// Utility functions for determining education levels based on class/grade
// Based on PRD Section 4.6 - Multi-level fee system for Tertiary, Private, and Public Schools

export type EducationLevel = "primary" | "secondary" | "tertiary";
export type SchoolType = "primary" | "secondary" | "private" | "public" | "tertiary";
export type ProgramType = "regular" | "evening" | "weekend";

/**
 * Determines the education level based on the student's class/grade
 * @param studentClass - The class/grade of the student (e.g., "Primary 5", "JSS 2", "SS 1", "200 Level")
 * @param schoolType - The type of school from settings
 * @returns The education level: "primary", "secondary", or "tertiary"
 */
export function getEducationLevelFromClass(
  studentClass: string,
  schoolType?: SchoolType
): EducationLevel {
  if (!studentClass) {
    // If no student class, determine from school type
    if (schoolType === "tertiary") return "tertiary";
    if (schoolType === "secondary") return "secondary";
    if (schoolType === "primary") return "primary";
    // For private/public multi-level schools, default to primary
    return "primary";
  }

  const classLower = studentClass.toLowerCase();

  // Check for evening/weekend program indicators
  // These programs exist across all levels (PRD Section 4.6)
  const isEveningWeekend = classLower.includes("evening") ||
                           classLower.includes("weekend") ||
                           classLower.includes("part-time") ||
                           classLower.includes("part time");

  // Tertiary/University patterns
  const tertiaryPatterns = [
    "100 level",
    "200 level",
    "300 level",
    "400 level",
    "500 level",
    "600 level",
    "year 1",
    "year 2",
    "year 3",
    "year 4",
    "year 5",
    "year 6",
    "undergraduate",
    "postgraduate",
    "diploma",
    "degree",
    "masters",
    "phd",
    "doctorate",
  ];

  if (
    tertiaryPatterns.some((pattern) => classLower.includes(pattern)) ||
    schoolType === "tertiary"
  ) {
    return "tertiary";
  }

  // Secondary School patterns
  const secondaryPatterns = [
    // Nigerian system
    "jss", // Junior Secondary School (JSS 1-3)
    "ss", // Senior Secondary (SS 1-3)
    "junior secondary",
    "senior secondary",

    // Ghanaian system
    "jhs", // Junior High School (JHS 1-3)
    "shs", // Senior High School (SHS 1-3)
    "junior high",
    "senior high",

    // Kenyan system
    "form", // Form 1-4

    // General patterns
    "grade 7",
    "grade 8",
    "grade 9",
    "grade 10",
    "grade 11",
    "grade 12",
    "class 7",
    "class 8",
    "class 9",
    "class 10",
    "class 11",
    "class 12",
    "secondary",
    "high school",
    "middle school",
  ];

  if (secondaryPatterns.some((pattern) => classLower.includes(pattern))) {
    return "secondary";
  }

  // Primary School patterns
  const primaryPatterns = [
    "primary",
    "elementary",
    "nursery",
    "kindergarten",
    "kg",
    "pre-primary",
    "reception",
    "grade r",
    // Grades 1-6
    "grade 1",
    "grade 2",
    "grade 3",
    "grade 4",
    "grade 5",
    "grade 6",
    // Class 1-6
    "class 1",
    "class 2",
    "class 3",
    "class 4",
    "class 5",
    "class 6",
    // Primary 1-6
    "primary 1",
    "primary 2",
    "primary 3",
    "primary 4",
    "primary 5",
    "primary 6",
  ];

  if (primaryPatterns.some((pattern) => classLower.includes(pattern))) {
    return "primary";
  }

  // Default fallback based on school type
  if (schoolType === "secondary") return "secondary";
  if (schoolType === "primary") return "primary";

  // If we can't determine from the class name, default to primary
  return "primary";
}

/**
 * Gets the current school type from localStorage
 * @returns The school type or null if not set
 */
export function getSchoolTypeFromStorage(): SchoolType | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem("schoolType") as SchoolType) || null;
}

/**
 * Determines education level from both student class and school settings
 * @param studentClass - The student's class/grade
 * @returns The determined education level
 */
export function determineEducationLevel(studentClass?: string): EducationLevel {
  const schoolType = getSchoolTypeFromStorage();

  if (studentClass) {
    return getEducationLevelFromClass(studentClass, schoolType || undefined);
  }

  // If no student class, use school type as fallback
  if (schoolType === "tertiary") return "tertiary";
  if (schoolType === "secondary") return "secondary";
  if (schoolType === "primary") return "primary";

  // Default to secondary for private/public schools without class info
  return schoolType ? "secondary" : "primary";
}

/**
 * Determines if a student is enrolled in an evening/weekend program
 * @param studentClass - The student's class/grade
 * @returns The program type: "regular", "evening", or "weekend"
 */
export function getProgramType(studentClass?: string): ProgramType {
  if (!studentClass) return "regular";

  const classLower = studentClass.toLowerCase();

  if (classLower.includes("evening") || classLower.includes("part-time") || classLower.includes("part time")) {
    return "evening";
  }

  if (classLower.includes("weekend") || classLower.includes("saturday")) {
    return "weekend";
  }

  return "regular";
}

/**
 * Gets a human-readable label for the program type
 * @param programType - The program type
 * @returns A display label
 */
export function getProgramTypeLabel(programType: ProgramType): string {
  const labels: Record<ProgramType, string> = {
    regular: "Regular Program",
    evening: "Evening Program",
    weekend: "Weekend Program",
  };
  return labels[programType];
}
