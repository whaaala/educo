"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface AcademicYearContextType {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  academicYears: string[];
}

// Generate academic years in descending order (newest to oldest)
const generateAcademicYears = () => {
  const currentYear = 2024; // Fixed year to avoid hydration issues
  const years = [];
  for (let i = 0; i <= 5; i++) {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    years.push(`${startYear} / ${endYear}`);
  }
  return years;
};

// Generate default years outside component to avoid recreation
const defaultAcademicYears = generateAcademicYears();

// Create context with a default value to prevent hydration errors
const AcademicYearContext = createContext<AcademicYearContextType>({
  selectedYear: defaultAcademicYears[0],
  setSelectedYear: () => {},
  academicYears: defaultAcademicYears,
});

export function AcademicYearProvider({ children }: { children: ReactNode }) {
  // Use the pre-generated academic years for consistency
  const academicYears = defaultAcademicYears;

  const [selectedYear, setSelectedYear] = useState(academicYears[0]);

  const value = useMemo(
    () => {
      return { selectedYear, setSelectedYear, academicYears };
    },
    [selectedYear, academicYears]
  );

  return (
    <AcademicYearContext.Provider value={value}>
      {children}
    </AcademicYearContext.Provider>
  );
}

export function useAcademicYear() {
  const context = useContext(AcademicYearContext);
  return context;
}
