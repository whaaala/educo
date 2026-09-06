// Grading System Adapter - Converts between different grading systems

import { EducationLevel, GradingScale } from "@/types/transcript";

// Primary Grading Scale (0-100 Numeric)
export const primaryGradingScale: GradingScale = {
  level: "primary",
  type: "numeric",
  ranges: [
    { min: 90, max: 100, grade: "90-100", gradePoint: undefined, remarks: "Excellent" },
    { min: 80, max: 89, grade: "80-89", gradePoint: undefined, remarks: "Very Good" },
    { min: 70, max: 79, grade: "70-79", gradePoint: undefined, remarks: "Good" },
    { min: 60, max: 69, grade: "60-69", gradePoint: undefined, remarks: "Credit" },
    { min: 50, max: 59, grade: "50-59", gradePoint: undefined, remarks: "Pass" },
    { min: 40, max: 49, grade: "40-49", gradePoint: undefined, remarks: "Fair" },
    { min: 0, max: 39, grade: "0-39", gradePoint: undefined, remarks: "Fail" },
  ],
};

// Secondary Grading Scale (WAEC/NECO A1-F9)
export const secondaryGradingScale: GradingScale = {
  level: "secondary",
  type: "letter",
  ranges: [
    { min: 75, max: 100, grade: "A1", gradePoint: undefined, remarks: "Excellent" },
    { min: 70, max: 74, grade: "B2", gradePoint: undefined, remarks: "Very Good" },
    { min: 65, max: 69, grade: "B3", gradePoint: undefined, remarks: "Good" },
    { min: 60, max: 64, grade: "C4", gradePoint: undefined, remarks: "Credit" },
    { min: 55, max: 59, grade: "C5", gradePoint: undefined, remarks: "Credit" },
    { min: 50, max: 54, grade: "C6", gradePoint: undefined, remarks: "Credit" },
    { min: 45, max: 49, grade: "D7", gradePoint: undefined, remarks: "Pass" },
    { min: 40, max: 44, grade: "E8", gradePoint: undefined, remarks: "Pass" },
    { min: 0, max: 39, grade: "F9", gradePoint: undefined, remarks: "Fail" },
  ],
};

// Tertiary Grading Scale (GPA 5.0-0.0)
export const tertiaryGradingScale: GradingScale = {
  level: "tertiary",
  type: "gpa",
  ranges: [
    { min: 70, max: 100, grade: "A", gradePoint: 5.0, remarks: "Excellent" },
    { min: 60, max: 69, grade: "B", gradePoint: 4.0, remarks: "Very Good" },
    { min: 50, max: 59, grade: "C", gradePoint: 3.0, remarks: "Good" },
    { min: 45, max: 49, grade: "D", gradePoint: 2.0, remarks: "Fair" },
    { min: 40, max: 44, grade: "E", gradePoint: 1.0, remarks: "Pass" },
    { min: 0, max: 39, grade: "F", gradePoint: 0.0, remarks: "Fail" },
  ],
};

/**
 * Convert numeric score to grade based on education level
 */
export function scoreToGrade(score: number, level: EducationLevel): string {
  const scale = getGradingScale(level);
  const range = scale.ranges.find((r) => score >= r.min && score <= r.max);
  return range?.grade || "F9";
}

/**
 * Convert numeric score to grade point (for tertiary)
 */
export function scoreToGradePoint(score: number): number {
  const range = tertiaryGradingScale.ranges.find((r) => score >= r.min && score <= r.max);
  return range?.gradePoint || 0.0;
}

/**
 * Convert numeric score to remarks
 */
export function scoreToRemarks(score: number, level: EducationLevel): string {
  const scale = getGradingScale(level);
  const range = scale.ranges.find((r) => score >= r.min && score <= r.max);
  return range?.remarks || "Fail";
}

/**
 * Calculate GPA from grades (tertiary only)
 */
export function calculateGPA(
  subjects: Array<{ score: number; creditHours: number }>
): number {
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach((subject) => {
    const gradePoint = scoreToGradePoint(subject.score);
    totalPoints += gradePoint * subject.creditHours;
    totalCredits += subject.creditHours;
  });

  return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0.0;
}

/**
 * Calculate overall average (primary/secondary)
 */
export function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return parseFloat((sum / scores.length).toFixed(2));
}

/**
 * Determine graduation class (tertiary)
 */
export function getGraduationClass(gpa: number): string {
  if (gpa >= 4.5) return "First Class";
  if (gpa >= 3.5) return "Second Class Upper";
  if (gpa >= 2.5) return "Second Class Lower";
  if (gpa >= 1.5) return "Third Class";
  if (gpa >= 1.0) return "Pass";
  return "Fail";
}

/**
 * Get grading scale for education level
 */
export function getGradingScale(level: EducationLevel): GradingScale {
  switch (level) {
    case "primary":
      return primaryGradingScale;
    case "secondary":
      return secondaryGradingScale;
    case "tertiary":
      return tertiaryGradingScale;
    default:
      return primaryGradingScale;
  }
}

/**
 * Calculate attendance percentage
 */
export function calculateAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0;
  return parseFloat(((present / total) * 100).toFixed(2));
}

/**
 * Determine conduct rating based on discipline records
 */
export function getConductRating(incidentCount: number): string {
  if (incidentCount === 0) return "Excellent";
  if (incidentCount === 1) return "Very Good";
  if (incidentCount === 2) return "Good";
  if (incidentCount <= 4) return "Fair";
  return "Poor";
}

/**
 * Format GPA display
 */
export function formatGPA(gpa: number): string {
  return gpa.toFixed(2);
}

/**
 * Format percentage display
 */
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}
