"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Education level types
export type EducationLevel = "Primary" | "Secondary" | "Tertiary";

// Grade scheme for a specific class-subject combination
export interface GradeScheme {
  id: string;
  educationLevel: EducationLevel;
  class: string;
  subject: string;
  gradeName: string; // e.g., "A", "B+", "First Class"
  minScore: number;
  maxScore: number;
  gradePoint: number; // For GPA calculation
  remark: string;
  color: string; // For UI display
}

// Grading context state
interface GradingContextState {
  gradeSchemes: GradeScheme[];
  saveGradeScheme: (scheme: GradeScheme) => void;
  saveGradeSchemes: (schemes: GradeScheme[]) => void;
  updateGradeScheme: (id: string, scheme: Partial<GradeScheme>) => void;
  deleteGradeScheme: (id: string) => void;
  getGradeForScore: (
    educationLevel: EducationLevel,
    classLevel: string,
    subject: string,
    score: number
  ) => GradeScheme | null;
  getGradeSchemesForClass: (
    educationLevel: EducationLevel,
    classLevel: string,
    subject?: string
  ) => GradeScheme[];
  clearGradeSchemes: () => void;
}

const GradingContext = createContext<GradingContextState | undefined>(undefined);

const STORAGE_KEY = "educo_grade_schemes";

// Default grade schemes for different education levels
const getDefaultGradeSchemes = (): GradeScheme[] => {
  return [
    // Secondary - Default WAEC-style grading (applies to all classes if not specifically configured)
    { id: "sec-1", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "A1", minScore: 90, maxScore: 100, gradePoint: 5.0, remark: "Excellent", color: "green" },
    { id: "sec-2", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "B2", minScore: 80, maxScore: 89, gradePoint: 4.5, remark: "Very Good", color: "blue" },
    { id: "sec-3", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "B3", minScore: 75, maxScore: 79, gradePoint: 4.0, remark: "Good", color: "blue" },
    { id: "sec-4", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "C4", minScore: 70, maxScore: 74, gradePoint: 3.5, remark: "Credit", color: "yellow" },
    { id: "sec-5", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "C5", minScore: 65, maxScore: 69, gradePoint: 3.0, remark: "Credit", color: "yellow" },
    { id: "sec-6", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "C6", minScore: 60, maxScore: 64, gradePoint: 2.5, remark: "Credit", color: "yellow" },
    { id: "sec-7", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "D7", minScore: 50, maxScore: 59, gradePoint: 2.0, remark: "Pass", color: "orange" },
    { id: "sec-8", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "E8", minScore: 45, maxScore: 49, gradePoint: 1.0, remark: "Pass", color: "orange" },
    { id: "sec-9", educationLevel: "Secondary", class: "All", subject: "All", gradeName: "F9", minScore: 0, maxScore: 44, gradePoint: 0.0, remark: "Fail", color: "red" },

    // Primary - Default grading (applies to all classes if not specifically configured)
    { id: "pri-1", educationLevel: "Primary", class: "All", subject: "All", gradeName: "A+", minScore: 90, maxScore: 100, gradePoint: 5.0, remark: "Excellent", color: "green" },
    { id: "pri-2", educationLevel: "Primary", class: "All", subject: "All", gradeName: "A", minScore: 80, maxScore: 89, gradePoint: 4.5, remark: "Very Good", color: "green" },
    { id: "pri-3", educationLevel: "Primary", class: "All", subject: "All", gradeName: "B", minScore: 70, maxScore: 79, gradePoint: 4.0, remark: "Good", color: "blue" },
    { id: "pri-4", educationLevel: "Primary", class: "All", subject: "All", gradeName: "C", minScore: 60, maxScore: 69, gradePoint: 3.0, remark: "Satisfactory", color: "yellow" },
    { id: "pri-5", educationLevel: "Primary", class: "All", subject: "All", gradeName: "D", minScore: 50, maxScore: 59, gradePoint: 2.0, remark: "Pass", color: "orange" },
    { id: "pri-6", educationLevel: "Primary", class: "All", subject: "All", gradeName: "F", minScore: 0, maxScore: 49, gradePoint: 0.0, remark: "Fail", color: "red" },

    // Tertiary - Default University grading (applies to all classes if not specifically configured)
    { id: "ter-1", educationLevel: "Tertiary", class: "All", subject: "All", gradeName: "A", minScore: 70, maxScore: 100, gradePoint: 5.0, remark: "First Class", color: "green" },
    { id: "ter-2", educationLevel: "Tertiary", class: "All", subject: "All", gradeName: "B", minScore: 60, maxScore: 69, gradePoint: 4.0, remark: "Second Class Upper", color: "blue" },
    { id: "ter-3", educationLevel: "Tertiary", class: "All", subject: "All", gradeName: "C", minScore: 50, maxScore: 59, gradePoint: 3.0, remark: "Second Class Lower", color: "yellow" },
    { id: "ter-4", educationLevel: "Tertiary", class: "All", subject: "All", gradeName: "D", minScore: 45, maxScore: 49, gradePoint: 2.0, remark: "Third Class", color: "orange" },
    { id: "ter-5", educationLevel: "Tertiary", class: "All", subject: "All", gradeName: "E", minScore: 40, maxScore: 44, gradePoint: 1.0, remark: "Pass", color: "orange" },
    { id: "ter-6", educationLevel: "Tertiary", class: "All", subject: "All", gradeName: "F", minScore: 0, maxScore: 39, gradePoint: 0.0, remark: "Fail", color: "red" },
  ];
};

export function GradingProvider({ children }: { children: ReactNode }) {
  const [gradeSchemes, setGradeSchemes] = useState<GradeScheme[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load grade schemes from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as GradeScheme[];
          setGradeSchemes(parsed);
        } else {
          // Initialize with default schemes if nothing in storage
          const defaults = getDefaultGradeSchemes();
          setGradeSchemes(defaults);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        }
      } catch (error) {
        console.error("Error loading grade schemes from localStorage:", error);
        // Fallback to defaults on error
        setGradeSchemes(getDefaultGradeSchemes());
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save grade schemes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gradeSchemes));
      } catch (error) {
        console.error("Error saving grade schemes to localStorage:", error);
      }
    }
  }, [gradeSchemes, isLoaded]);

  // Save a single grade scheme
  const saveGradeScheme = (scheme: GradeScheme) => {
    setGradeSchemes((prev) => {
      const existing = prev.find((s) => s.id === scheme.id);
      if (existing) {
        return prev.map((s) => (s.id === scheme.id ? scheme : s));
      }
      return [...prev, scheme];
    });
  };

  // Save multiple grade schemes at once
  const saveGradeSchemes = (schemes: GradeScheme[]) => {
    setGradeSchemes((prev) => {
      const newSchemes = [...prev];
      schemes.forEach((scheme) => {
        const index = newSchemes.findIndex((s) => s.id === scheme.id);
        if (index >= 0) {
          newSchemes[index] = scheme;
        } else {
          newSchemes.push(scheme);
        }
      });
      return newSchemes;
    });
  };

  // Update a grade scheme
  const updateGradeScheme = (id: string, updates: Partial<GradeScheme>) => {
    setGradeSchemes((prev) =>
      prev.map((scheme) => (scheme.id === id ? { ...scheme, ...updates } : scheme))
    );
  };

  // Delete a grade scheme
  const deleteGradeScheme = (id: string) => {
    setGradeSchemes((prev) => prev.filter((scheme) => scheme.id !== id));
  };

  // Get the appropriate grade for a given score
  // Priority: specific class+subject > class+all subjects > all classes+specific subject > all classes+all subjects
  const getGradeForScore = (
    educationLevel: EducationLevel,
    classLevel: string,
    subject: string,
    score: number
  ): GradeScheme | null => {
    // Filter schemes for the education level
    const levelSchemes = gradeSchemes.filter((s) => s.educationLevel === educationLevel);

    // Priority 1: Specific class + specific subject
    let matchingSchemes = levelSchemes.filter(
      (s) => s.class === classLevel && s.subject === subject && score >= s.minScore && score <= s.maxScore
    );

    if (matchingSchemes.length > 0) {
      return matchingSchemes[0];
    }

    // Priority 2: Specific class + All subjects
    matchingSchemes = levelSchemes.filter(
      (s) => s.class === classLevel && s.subject === "All" && score >= s.minScore && score <= s.maxScore
    );

    if (matchingSchemes.length > 0) {
      return matchingSchemes[0];
    }

    // Priority 3: All classes + specific subject
    matchingSchemes = levelSchemes.filter(
      (s) => s.class === "All" && s.subject === subject && score >= s.minScore && score <= s.maxScore
    );

    if (matchingSchemes.length > 0) {
      return matchingSchemes[0];
    }

    // Priority 4: All classes + All subjects (default)
    matchingSchemes = levelSchemes.filter(
      (s) => s.class === "All" && s.subject === "All" && score >= s.minScore && score <= s.maxScore
    );

    if (matchingSchemes.length > 0) {
      return matchingSchemes[0];
    }

    return null;
  };

  // Get all grade schemes for a class (optionally filtered by subject)
  const getGradeSchemesForClass = (
    educationLevel: EducationLevel,
    classLevel: string,
    subject?: string
  ): GradeScheme[] => {
    const schemes = gradeSchemes.filter((s) => {
      if (s.educationLevel !== educationLevel) return false;
      if (s.class !== classLevel && s.class !== "All") return false;
      if (subject && s.subject !== subject && s.subject !== "All") return false;
      return true;
    });

    // Sort by minScore descending
    return schemes.sort((a, b) => b.minScore - a.minScore);
  };

  // Clear all grade schemes
  const clearGradeSchemes = () => {
    const defaults = getDefaultGradeSchemes();
    setGradeSchemes(defaults);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    }
  };

  return (
    <GradingContext.Provider
      value={{
        gradeSchemes,
        saveGradeScheme,
        saveGradeSchemes,
        updateGradeScheme,
        deleteGradeScheme,
        getGradeForScore,
        getGradeSchemesForClass,
        clearGradeSchemes,
      }}
    >
      {children}
    </GradingContext.Provider>
  );
}

// Custom hook to use grading context
export function useGrading() {
  const context = useContext(GradingContext);
  if (context === undefined) {
    throw new Error("useGrading must be used within a GradingProvider");
  }
  return context;
}
