// Grading Configuration System for Educo ERP
// Based on PRD Section 4.11 - Adaptive Grading Engine (AGE)

export type EducationLevel = "primary" | "secondary" | "tertiary";

export type GradingComponentType =
  // Primary Level
  | "classwork"
  | "homework"
  | "test_quiz"
  | "project"
  | "practical"
  | "behavior"
  | "sports"
  | "after_school"
  | "examination"
  // Secondary Level
  | "assignment"
  | "continuous_assessment"
  | "midterm"
  | "lab_practical"
  | "final_exam"
  // Tertiary Level
  | "coursework"
  | "presentation"
  | "internship"
  | "evening_weekend"
  // Custom
  | "custom";

export interface GradingComponentConfig {
  id: string;
  type: GradingComponentType;
  name: string;
  title?: string; // Custom title to signify the type/purpose of this component instance
  defaultWeight: number; // Percentage weight in final grade
  category: "Academic" | "Practical" | "Behavioral" | "Co-curricular" | "Professional";
  enabled: boolean;
  isCustom?: boolean;
  description?: string;
  minScore?: number;
  maxScore?: number;
}

export interface SubjectGradingConfig {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  educationLevel: EducationLevel;
  components: GradingComponentConfig[];
  totalWeightMustBe100: boolean; // Validation flag
  customComponents?: GradingComponentConfig[]; // Additional custom components
}

// ============================================================================
// DEFAULT GRADING CONFIGURATIONS (Based on PRD 4.11)
// ============================================================================

export const DEFAULT_PRIMARY_COMPONENTS: GradingComponentConfig[] = [
  {
    id: "pri-classwork",
    type: "classwork",
    name: "Classwork",
    defaultWeight: 10,
    category: "Academic",
    enabled: true,
    description: "Daily classwork activities",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-homework",
    type: "homework",
    name: "Homework",
    defaultWeight: 10,
    category: "Academic",
    enabled: true,
    description: "Take-home assignments",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-tests",
    type: "test_quiz",
    name: "Tests",
    defaultWeight: 10,
    category: "Academic",
    enabled: true,
    description: "Regular tests",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-quizzes",
    type: "test_quiz",
    name: "Quizzes",
    defaultWeight: 10,
    category: "Academic",
    enabled: true,
    description: "Quick assessment quizzes",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-projects",
    type: "project",
    name: "Projects",
    defaultWeight: 5,
    category: "Academic",
    enabled: true,
    description: "Project-based assessments",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-practicals",
    type: "practical",
    name: "Art/ICT Practicals",
    defaultWeight: 5,
    category: "Practical",
    enabled: true,
    description: "Hands-on practical work in Art and ICT",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-behavior",
    type: "behavior",
    name: "Behavior",
    defaultWeight: 5,
    category: "Behavioral",
    enabled: true,
    description: "Student behavior and conduct",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-participation",
    type: "behavior",
    name: "Participation",
    defaultWeight: 5,
    category: "Behavioral",
    enabled: true,
    description: "Class participation and engagement",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-sports",
    type: "sports",
    name: "Sports Activities",
    defaultWeight: 0,
    category: "Co-curricular",
    enabled: false,
    description: "Physical education and sports participation",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-afterschool",
    type: "after_school",
    name: "After-School Programs",
    defaultWeight: 0,
    category: "Co-curricular",
    enabled: false,
    description: "Participation in after-school activities",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "pri-exam",
    type: "examination",
    name: "Final Examination",
    defaultWeight: 40,
    category: "Academic",
    enabled: true,
    description: "End of term examination",
    minScore: 0,
    maxScore: 100,
  },
];

export const DEFAULT_SECONDARY_COMPONENTS: GradingComponentConfig[] = [
  {
    id: "sec-classtests",
    type: "test_quiz",
    name: "Class Tests",
    defaultWeight: 15,
    category: "Academic",
    enabled: true,
    description: "Regular class tests",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-assignments",
    type: "assignment",
    name: "Assignments",
    defaultWeight: 5,
    category: "Academic",
    enabled: true,
    description: "Homework assignments",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-projects",
    type: "project",
    name: "Projects",
    defaultWeight: 5,
    category: "Academic",
    enabled: true,
    description: "Project-based assessments",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-midterm",
    type: "midterm",
    name: "Mid-Term Examination",
    defaultWeight: 15,
    category: "Academic",
    enabled: true,
    description: "Mid-term assessment",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-labwork",
    type: "lab_practical",
    name: "Lab Work",
    defaultWeight: 5,
    category: "Practical",
    enabled: true,
    description: "Laboratory work and experiments",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-practicalwork",
    type: "practical",
    name: "Practical Work",
    defaultWeight: 5,
    category: "Practical",
    enabled: true,
    description: "Hands-on practical activities",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-ca",
    type: "continuous_assessment",
    name: "Continuous Assessment",
    defaultWeight: 0,
    category: "Academic",
    enabled: false,
    description: "Ongoing assessment throughout term",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-behavior",
    type: "behavior",
    name: "Behavior",
    defaultWeight: 0,
    category: "Behavioral",
    enabled: false,
    description: "Student behavior and attitude",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-conduct",
    type: "behavior",
    name: "Conduct",
    defaultWeight: 0,
    category: "Behavioral",
    enabled: false,
    description: "Discipline and general conduct",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-evening",
    type: "evening_weekend",
    name: "Evening Programs",
    defaultWeight: 0,
    category: "Co-curricular",
    enabled: false,
    description: "Participation in evening programs",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-weekend",
    type: "evening_weekend",
    name: "Weekend Programs",
    defaultWeight: 0,
    category: "Co-curricular",
    enabled: false,
    description: "Participation in weekend programs",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "sec-finalexam",
    type: "final_exam",
    name: "Final Examination",
    defaultWeight: 50,
    category: "Academic",
    enabled: true,
    description: "End of term examination",
    minScore: 0,
    maxScore: 100,
  },
];

export const DEFAULT_TERTIARY_COMPONENTS: GradingComponentConfig[] = [
  {
    id: "ter-ca",
    type: "continuous_assessment",
    name: "Continuous Assessment",
    defaultWeight: 30,
    category: "Academic",
    enabled: true,
    description: "Assignments, tests, and ongoing evaluation",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-coursework",
    type: "coursework",
    name: "Coursework",
    defaultWeight: 0,
    category: "Academic",
    enabled: false,
    description: "Major coursework assignments",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-labwork",
    type: "lab_practical",
    name: "Lab Work",
    defaultWeight: 10,
    category: "Practical",
    enabled: true,
    description: "Laboratory practical work",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-projects",
    type: "project",
    name: "Projects",
    defaultWeight: 0,
    category: "Academic",
    enabled: false,
    description: "Major project work",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-presentation",
    type: "presentation",
    name: "Presentations",
    defaultWeight: 0,
    category: "Academic",
    enabled: false,
    description: "Oral presentations and demos",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-midterm",
    type: "midterm",
    name: "Mid-Semester Exam",
    defaultWeight: 20,
    category: "Academic",
    enabled: true,
    description: "Mid-semester examination",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-finalexam",
    type: "final_exam",
    name: "Final Examination",
    defaultWeight: 40,
    category: "Academic",
    enabled: true,
    description: "End of semester examination",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-internship",
    type: "internship",
    name: "Internship (SIWES)",
    defaultWeight: 0,
    category: "Professional",
    enabled: false,
    description: "Industrial training/internship",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-evening",
    type: "evening_weekend",
    name: "Evening Courses",
    defaultWeight: 0,
    category: "Professional",
    enabled: false,
    description: "Additional evening courses",
    minScore: 0,
    maxScore: 100,
  },
  {
    id: "ter-weekend",
    type: "evening_weekend",
    name: "Weekend Courses",
    defaultWeight: 0,
    category: "Professional",
    enabled: false,
    description: "Additional weekend courses",
    minScore: 0,
    maxScore: 100,
  },
];

// ============================================================================
// CONFIGURATION HELPERS
// ============================================================================

export function getDefaultComponentsForLevel(level: EducationLevel): GradingComponentConfig[] {
  switch (level) {
    case "primary":
      return [...DEFAULT_PRIMARY_COMPONENTS];
    case "secondary":
      return [...DEFAULT_SECONDARY_COMPONENTS];
    case "tertiary":
      return [...DEFAULT_TERTIARY_COMPONENTS];
    default:
      return [];
  }
}

export function validateGradingWeights(components: GradingComponentConfig[]): {
  isValid: boolean;
  totalWeight: number;
  errors: string[];
} {
  const enabledComponents = components.filter(c => c.enabled);
  const totalWeight = enabledComponents.reduce((sum, c) => sum + c.defaultWeight, 0);
  const errors: string[] = [];

  if (totalWeight !== 100) {
    errors.push(`Total weight must equal 100%. Current total: ${totalWeight}%`);
  }

  enabledComponents.forEach(c => {
    if (c.defaultWeight < 0) {
      errors.push(`${c.name}: Weight cannot be negative`);
    }
    if (c.defaultWeight > 100) {
      errors.push(`${c.name}: Weight cannot exceed 100%`);
    }
  });

  return {
    isValid: totalWeight === 100 && errors.length === 0,
    totalWeight,
    errors,
  };
}

export function createCustomComponent(
  name: string,
  weight: number,
  category: GradingComponentConfig["category"],
  educationLevel: EducationLevel
): GradingComponentConfig {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "custom",
    name,
    defaultWeight: weight,
    category,
    enabled: true,
    isCustom: true,
    description: `Custom grading component for ${educationLevel} level`,
    minScore: 0,
    maxScore: 100,
  };
}

// ============================================================================
// STORAGE HELPERS (localStorage)
// ============================================================================

const STORAGE_KEY_PREFIX = "educo_grading_config_";

export function saveSubjectGradingConfig(config: SubjectGradingConfig): void {
  const key = `${STORAGE_KEY_PREFIX}${config.educationLevel}_${config.subjectCode}`;
  localStorage.setItem(key, JSON.stringify(config));
}

export function loadSubjectGradingConfig(
  educationLevel: EducationLevel,
  subjectCode: string
): SubjectGradingConfig | null {
  const key = `${STORAGE_KEY_PREFIX}${educationLevel}_${subjectCode}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

export function getOrCreateSubjectConfig(
  subjectId: string,
  subjectCode: string,
  subjectName: string,
  educationLevel: EducationLevel
): SubjectGradingConfig {
  const existing = loadSubjectGradingConfig(educationLevel, subjectCode);

  if (existing) {
    return existing;
  }

  // Create new config with defaults
  return {
    subjectId,
    subjectCode,
    subjectName,
    educationLevel,
    components: getDefaultComponentsForLevel(educationLevel),
    totalWeightMustBe100: true,
    customComponents: [],
  };
}

export function resetToDefaults(
  educationLevel: EducationLevel,
  subjectCode: string
): void {
  const key = `${STORAGE_KEY_PREFIX}${educationLevel}_${subjectCode}`;
  localStorage.removeItem(key);
}

// ============================================================================
// EXPORT ALL LEVELS FOR EASY ACCESS
// ============================================================================

export const GRADING_SYSTEM_PRESETS = {
  primary: DEFAULT_PRIMARY_COMPONENTS,
  secondary: DEFAULT_SECONDARY_COMPONENTS,
  tertiary: DEFAULT_TERTIARY_COMPONENTS,
};
