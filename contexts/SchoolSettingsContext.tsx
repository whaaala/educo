"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type EducationLevel = "Primary" | "Secondary" | "Tertiary";
export type InstitutionType = "Public" | "Private" | "International";

export type SchoolScheduleType = "full-time" | "after-school" | "weekend" | "online" | "hybrid";

interface SchoolSettings {
  // School-wide settings
  supportedLevels: EducationLevel[]; // Array of supported education levels
  defaultEducationLevel: EducationLevel; // Default/fallback level
  institutionType: InstitutionType;
  schoolName: string;
  schoolType: string;
  tertiaryType?: string; // University, College, Polytechnic, etc.
  scheduleType: SchoolScheduleType; // Full-time, after-school, weekend, online, hybrid

  // Multi-level support
  supportsMultipleLevels: boolean; // If true, education level can be detected from class
}

interface SchoolSettingsContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
}

const defaultSettings: SchoolSettings = {
  supportedLevels: ["Primary", "Secondary"], // Default to multi-level
  defaultEducationLevel: "Secondary", // Default fallback
  institutionType: "Private",
  schoolName: "Educo School",
  schoolType: "Day School",
  tertiaryType: undefined,
  scheduleType: "full-time", // Default to full-time day school
  supportsMultipleLevels: true, // Allow class-based detection
};

const SchoolSettingsContext = createContext<SchoolSettingsContextType | undefined>(
  undefined
);

// Helper function to map localStorage education level values to context values
function mapEducationLevel(level: string): { educationLevel: EducationLevel; supportsMultipleLevels: boolean } {
  switch (level) {
    case "primary":
      return { educationLevel: "Primary", supportsMultipleLevels: false };
    case "secondary":
      return { educationLevel: "Secondary", supportsMultipleLevels: false };
    case "tertiary":
      return { educationLevel: "Tertiary", supportsMultipleLevels: false };
    case "multi-level":
      return { educationLevel: "Secondary", supportsMultipleLevels: true }; // Default to Secondary for multi-level
    default:
      return { educationLevel: "Secondary", supportsMultipleLevels: true };
  }
}

// Helper function to map localStorage institution type to context values
function mapInstitutionType(type: string): InstitutionType {
  switch (type) {
    case "public":
      return "Public";
    case "private":
      return "Private";
    default:
      return "Private";
  }
}

export function SchoolSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);

  // Load settings from localStorage on mount and listen for changes
  useEffect(() => {
    const loadSettings = () => {
      const savedLevels = localStorage.getItem("educationLevels");
      const savedInstitutionType = localStorage.getItem("institutionType");
      const savedTertiaryType = localStorage.getItem("tertiaryType");
      const savedScheduleType = localStorage.getItem("scheduleType");

      let supportedLevels: EducationLevel[] = defaultSettings.supportedLevels;
      let supportsMultipleLevels = defaultSettings.supportsMultipleLevels;

      // Try to load new multi-select format
      if (savedLevels) {
        try {
          const levels = JSON.parse(savedLevels) as EducationLevel[];
          supportedLevels = levels;
          supportsMultipleLevels = levels.length > 1;
        } catch (e) {
          // Fallback to old single-value format
          const oldValue = localStorage.getItem("educationLevel");
          if (oldValue) {
            const { educationLevel, supportsMultipleLevels: multiLevel } = mapEducationLevel(oldValue);
            supportedLevels = multiLevel ? ["Primary", "Secondary"] : [educationLevel];
            supportsMultipleLevels = multiLevel;
          }
        }
      } else {
        // Check for old format
        const oldValue = localStorage.getItem("educationLevel");
        if (oldValue) {
          const { educationLevel, supportsMultipleLevels: multiLevel } = mapEducationLevel(oldValue);
          supportedLevels = multiLevel ? ["Primary", "Secondary"] : [educationLevel];
          supportsMultipleLevels = multiLevel;
        }
      }

      const institutionType = savedInstitutionType
        ? mapInstitutionType(savedInstitutionType)
        : defaultSettings.institutionType;

      const tertiaryType = savedTertiaryType || undefined;

      const scheduleType = (savedScheduleType as SchoolScheduleType) || defaultSettings.scheduleType;

      // Determine default education level (first in the list or fallback)
      const defaultEducationLevel = supportedLevels[0] || defaultSettings.defaultEducationLevel;

      setSettings((prev) => ({
        ...prev,
        supportedLevels,
        defaultEducationLevel,
        institutionType,
        tertiaryType,
        scheduleType,
        supportsMultipleLevels,
      }));
    };

    // Load on mount
    loadSettings();

    // Listen for changes from SchoolProfileSettings component
    const handleSchoolProfileChange = () => {
      loadSettings();
    };

    window.addEventListener("schoolProfileChanged", handleSchoolProfileChange);

    return () => {
      window.removeEventListener("schoolProfileChanged", handleSchoolProfileChange);
    };
  }, []);

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SchoolSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SchoolSettingsContext.Provider>
  );
}

export function useSchoolSettings() {
  const context = useContext(SchoolSettingsContext);
  if (context === undefined) {
    throw new Error("useSchoolSettings must be used within a SchoolSettingsProvider");
  }
  return context;
}
