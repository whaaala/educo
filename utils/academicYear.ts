/**
 * Calculate the academic year for a given date
 * Academic year runs from September to August
 * Example: A date in October 2024 belongs to "2024 / 2025" academic year
 * Example: A date in July 2024 belongs to "2023 / 2024" academic year
 *
 * @param dateString - Date in format "DD MMM YYYY" (e.g., "10 Jan 2017")
 * @returns Academic year in format "YYYY / YYYY" (e.g., "2024 / 2025")
 */
export function getAcademicYearFromDate(dateString: string): string {
  try {
    // Parse the date string (format: "DD MMM YYYY")
    const parts = dateString.trim().split(" ");
    if (parts.length !== 3) {
      return "";
    }

    const [day, monthStr, year] = parts;
    const monthMap: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    const month = monthMap[monthStr];
    if (month === undefined) {
      return "";
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum)) {
      return "";
    }

    // If the month is September (8) or later, the academic year starts in that year
    // If the month is before September, the academic year started in the previous year
    const academicStartYear = month >= 8 ? yearNum : yearNum - 1;
    const academicEndYear = academicStartYear + 1;

    return `${academicStartYear} / ${academicEndYear}`;
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return "";
  }
}

/**
 * Check if a student should be shown based on the selected academic year
 * Shows students who joined within 5 years before and up to the selected year
 * Includes both active students and those who left/graduated
 *
 * @param joinedOn - Student's join date in format "DD MMM YYYY"
 * @param academicYear - Academic year in format "YYYY / YYYY"
 * @param leftOn - Optional: Student's departure date in format "DD MMM YYYY"
 * @returns true if the student should be included
 */
export function isStudentInAcademicYear(
  joinedOn: string,
  academicYear: string,
  leftOn?: string
): boolean {
  const studentJoinYear = getAcademicYearFromDate(joinedOn);
  if (!studentJoinYear) {
    return false;
  }

  // Extract the start year from the academic year string
  const selectedStartYear = parseInt(academicYear.split(" / ")[0], 10);
  const studentStartYear = parseInt(studentJoinYear.split(" / ")[0], 10);

  // Calculate the 5-year range: 5 years before up to the selected year
  const earliestYear = selectedStartYear - 5;

  // Student must have joined within the 5-year range (earliestYear to selectedStartYear)
  const joinedInRange = studentStartYear >= earliestYear && studentStartYear <= selectedStartYear;

  return joinedInRange;
}

/**
 * Filter students based on academic year
 * Students are included if they were enrolled during the selected academic year
 * Takes into account both join and departure dates
 *
 * @param students - Array of students
 * @param academicYear - Selected academic year in format "YYYY / YYYY"
 * @returns Filtered array of students
 */
export function filterStudentsByAcademicYear<T extends { joinedOn: string; leftOn?: string }>(
  students: T[],
  academicYear: string
): T[] {
  return students.filter((student) =>
    isStudentInAcademicYear(student.joinedOn, academicYear, student.leftOn)
  );
}
