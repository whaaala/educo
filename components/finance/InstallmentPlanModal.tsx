"use client";

import { useState, useEffect, useMemo } from "react";
import { FileText, DollarSign, Calendar, Layers, User, Save, BookOpen, Settings2, Check, Users, GraduationCap } from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { FormSection } from "@/components/shared/FormWizard";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

// Types
interface Installment {
  id: string;
  sequence: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: "pending" | "paid" | "overdue" | "partially_paid" | "waived";
  paidDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  lateFeeApplied?: number;
}

interface InstallmentPlan {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classLevel: string;
  feeTypeName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  installmentCount: number;
  frequency: "monthly" | "quarterly" | "custom";
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "defaulted" | "cancelled";
  installments: Installment[];
  academicYear: string;
  term: string;
  createdAt: string;
  updatedAt: string;
  planType?: "per-term" | "per-course" | "custom";
}

export type PlanType = "per-term" | "per-course" | "custom";

// Configuration mode for per-term plans
export type TermConfigMode = "single" | "individual";

// Individual installment due date configuration
export interface InstallmentDueDate {
  sequence: number;
  dueDate: string;
  description: string;
}

// Configuration for each term/semester
export interface TermConfig {
  periodValue: string;
  periodLabel: string;
  shortLabel: string;
  enabled: boolean;
  amount: string;
  installmentCount: string;
  installmentDueDates: InstallmentDueDate[]; // Individual due dates for each installment
}

// Override for individual installment amounts in the schedule preview
export interface InstallmentAmountOverride {
  sequence: number;
  amount: string; // User-entered amount (string for form input)
}

/** The life-cycle of a plan. Defined here because this modal is what creates one. */
export type InstallmentPlanStatus = "active" | "completed" | "defaulted" | "cancelled";

/**
 * What the modal hands back on save — NOT the same shape as the form state below.
 *
 * The prop was typed `any`, so nobody noticed the two had diverged: the payload carries isBulkPlan,
 * targetType, affectedStudents and a computed schedule that the form state has no idea about.
 */
export interface InstallmentPlanSavePayload {
  feeTypeName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  installmentCount: number;
  frequency: "monthly" | "quarterly" | "custom";
  startDate: string;
  endDate: string;
  status: InstallmentPlanStatus;
  installments: Installment[];
  academicYear: string;
  term: string;
  planType: PlanType;
  isBulkPlan: boolean;
  /** Bulk plans only. */
  targetType?: "class" | "course";
  classLevel?: string;
  courseName?: string;
  affectedStudents?: number;
  termConfigMode?: TermConfigMode;
  terms?: string[];
  termConfigs?: TermConfig[];
  /** Custom (single-student) plans only. */
  studentId?: string;
  studentName?: string;
  studentNumber?: string;
}

export interface InstallmentPlanFormData {
  planType: PlanType;
  // For Per-Term/Semester (bulk - all students)
  termConfigMode: TermConfigMode; // single or individual term/semester configuration
  selectedPeriod: string; // single term/semester (for single mode)
  classLevel: string;
  termConfigs: TermConfig[]; // individual configuration per term/semester (for individual mode)
  // For Per-Course/Subject (bulk - all students)
  selectedCourse: string;
  // For Custom (per student)
  selectedCourseForCustom: string; // Course/Subject selection for custom plan (before student)
  studentId: string;
  studentName: string;
  studentNumber: string;
  studentClassLevel: string;
  // Common fields
  feeTypeName: string;
  totalAmount: string;
  installmentCount: string;
  frequency: "monthly" | "quarterly" | "custom";
  startDate: string;
  academicYear: string;
  customInstallments: { dueDate: string; amount: string; description: string }[];
  // Manual overrides for schedule preview amounts (for per-term and per-course plans)
  scheduleAmountOverrides: InstallmentAmountOverride[];
}

interface InstallmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InstallmentPlanSavePayload) => void;
  isEditing: boolean;
  editingPlan: InstallmentPlan | null;
  isSaving: boolean;
  currencySymbol: string;
}

// Mock students for dropdown (for custom plan) - with course/subject enrollment
const MOCK_STUDENTS = [
  // Secondary school students with subjects
  { value: "std-001", label: "John Adebayo (STU2024001) - SSS 1", name: "John Adebayo", number: "STU2024001", class: "SSS 1", subjects: ["math", "english", "physics", "chemistry"] },
  { value: "std-002", label: "Amina Bello (STU2024002) - SSS 2", name: "Amina Bello", number: "STU2024002", class: "SSS 2", subjects: ["math", "english", "biology", "economics"] },
  { value: "std-003", label: "Chukwuemeka Okonkwo (STU2024003) - JSS 3", name: "Chukwuemeka Okonkwo", number: "STU2024003", class: "JSS 3", subjects: ["math", "english", "economics", "government"] },
  { value: "std-004", label: "Fatima Yusuf (STU2024004) - SSS 3", name: "Fatima Yusuf", number: "STU2024004", class: "SSS 3", subjects: ["math", "english", "physics", "literature"] },
  { value: "std-005", label: "David Okafor (STU2024005) - JSS 1", name: "David Okafor", number: "STU2024005", class: "JSS 1", subjects: ["math", "english", "biology", "government"] },
  { value: "std-006", label: "Grace Eze (STU2024006) - JSS 2", name: "Grace Eze", number: "STU2024006", class: "JSS 2", subjects: ["math", "english", "chemistry", "literature"] },
  { value: "std-007", label: "Ibrahim Musa (STU2024007) - SSS 1", name: "Ibrahim Musa", number: "STU2024007", class: "SSS 1", subjects: ["math", "english", "economics", "government"] },
  { value: "std-008", label: "Jennifer Obi (STU2024008) - SSS 2", name: "Jennifer Obi", number: "STU2024008", class: "SSS 2", subjects: ["math", "english", "physics", "biology"] },
  // University students with courses
  { value: "std-101", label: "Oluwaseun Adeleke (UNI2024001) - 100 Level", name: "Oluwaseun Adeleke", number: "UNI2024001", class: "100 Level", courses: ["csc101", "mth101", "phy101", "gns101"] },
  { value: "std-102", label: "Ngozi Okoro (UNI2024002) - 100 Level", name: "Ngozi Okoro", number: "UNI2024002", class: "100 Level", courses: ["csc101", "mth101", "chm101", "bio101"] },
  { value: "std-103", label: "Yusuf Balogun (UNI2024003) - 200 Level", name: "Yusuf Balogun", number: "UNI2024003", class: "200 Level", courses: ["csc101", "phy101", "chm101", "gns101"] },
  { value: "std-104", label: "Chidinma Nwosu (UNI2024004) - 200 Level", name: "Chidinma Nwosu", number: "UNI2024004", class: "200 Level", courses: ["mth101", "phy101", "bio101", "gns101"] },
];

// Fee types
const FEE_TYPES = [
  { value: "tuition", label: "Tuition Fee" },
  { value: "examination", label: "Examination Fee" },
  { value: "sports", label: "Sports Fee" },
  { value: "laboratory", label: "Laboratory Fee" },
  { value: "library", label: "Library Fee" },
  { value: "transport", label: "Transport Fee" },
  { value: "uniform", label: "Uniform Fee" },
  { value: "miscellaneous", label: "Miscellaneous Fee" },
];

// Academic years
const ACADEMIC_YEARS = [
  { value: "2024-2025", label: "2024/2025" },
  { value: "2025-2026", label: "2025/2026" },
  { value: "2023-2024", label: "2023/2024" },
];

// Terms for Primary/Secondary (3-term system)
const TERMS = [
  { value: "first-term", label: "First Term", shortLabel: "Term 1" },
  { value: "second-term", label: "Second Term", shortLabel: "Term 2" },
  { value: "third-term", label: "Third Term", shortLabel: "Term 3" },
];

// Semesters for Tertiary (3-semester system)
const SEMESTERS = [
  { value: "first-semester", label: "First Semester", shortLabel: "Sem 1" },
  { value: "second-semester", label: "Second Semester", shortLabel: "Sem 2" },
  { value: "third-semester", label: "Third Semester", shortLabel: "Sem 3" },
];

// Class levels for Primary/Secondary
const CLASS_LEVELS = [
  { value: "primary-1", label: "Primary 1", level: "Primary" },
  { value: "primary-2", label: "Primary 2", level: "Primary" },
  { value: "primary-3", label: "Primary 3", level: "Primary" },
  { value: "primary-4", label: "Primary 4", level: "Primary" },
  { value: "primary-5", label: "Primary 5", level: "Primary" },
  { value: "primary-6", label: "Primary 6", level: "Primary" },
  { value: "jss-1", label: "JSS 1", level: "Secondary" },
  { value: "jss-2", label: "JSS 2", level: "Secondary" },
  { value: "jss-3", label: "JSS 3", level: "Secondary" },
  { value: "sss-1", label: "SSS 1", level: "Secondary" },
  { value: "sss-2", label: "SSS 2", level: "Secondary" },
  { value: "sss-3", label: "SSS 3", level: "Secondary" },
];

// Levels for Tertiary
const TERTIARY_LEVELS = [
  { value: "100-level", label: "100 Level", level: "Tertiary" },
  { value: "200-level", label: "200 Level", level: "Tertiary" },
  { value: "300-level", label: "300 Level", level: "Tertiary" },
  { value: "400-level", label: "400 Level", level: "Tertiary" },
  { value: "500-level", label: "500 Level", level: "Tertiary" },
];

// Mock Subjects for Primary/Secondary
const SUBJECTS = [
  { value: "math", label: "Mathematics", amount: 15000 },
  { value: "english", label: "English Language", amount: 15000 },
  { value: "physics", label: "Physics", amount: 18000 },
  { value: "chemistry", label: "Chemistry", amount: 18000 },
  { value: "biology", label: "Biology", amount: 18000 },
  { value: "economics", label: "Economics", amount: 12000 },
  { value: "government", label: "Government", amount: 12000 },
  { value: "literature", label: "Literature", amount: 12000 },
];

// Mock Courses for Tertiary
const COURSES = [
  { value: "csc101", label: "CSC 101 - Introduction to Computing", amount: 25000, units: 3 },
  { value: "mth101", label: "MTH 101 - Elementary Mathematics I", amount: 25000, units: 3 },
  { value: "phy101", label: "PHY 101 - General Physics I", amount: 30000, units: 4 },
  { value: "chm101", label: "CHM 101 - General Chemistry I", amount: 30000, units: 4 },
  { value: "gns101", label: "GNS 101 - Use of English I", amount: 20000, units: 2 },
  { value: "bio101", label: "BIO 101 - General Biology I", amount: 30000, units: 4 },
];

// Installment count options
const INSTALLMENT_OPTIONS = [
  { value: "2", label: "2 Installments" },
  { value: "3", label: "3 Installments" },
  { value: "4", label: "4 Installments" },
  { value: "6", label: "6 Installments" },
];

const initialFormData: InstallmentPlanFormData = {
  planType: "per-term",
  termConfigMode: "single", // Default to single term/semester selection
  selectedPeriod: "",
  classLevel: "",
  termConfigs: [], // Will be initialized based on school type (terms/semesters)
  selectedCourse: "",
  selectedCourseForCustom: "", // Course/Subject for custom plan
  studentId: "",
  studentName: "",
  studentNumber: "",
  studentClassLevel: "",
  feeTypeName: "",
  totalAmount: "",
  installmentCount: "3",
  frequency: "monthly",
  startDate: "",
  academicYear: "2024-2025",
  customInstallments: [{ dueDate: "", amount: "", description: "Installment 1" }],
  scheduleAmountOverrides: [], // Manual overrides for schedule preview amounts
};

export default function InstallmentPlanModal({
  isOpen,
  onClose,
  onSave,
  isEditing,
  editingPlan,
  isSaving,
  currencySymbol,
}: InstallmentPlanModalProps) {
  const { settings, currentTenant } = useSchoolSettings();
  const [formData, setFormData] = useState<InstallmentPlanFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Determine if this is a tertiary institution from tenant config
  const isTertiary = useMemo(() => {
    const termSystem = currentTenant?.config?.termSystem;
    if (termSystem === "2-semester") return true;
    return settings.supportedLevels.includes("Tertiary") && !settings.supportedLevels.includes("Secondary") && !settings.supportedLevels.includes("Primary");
  }, [settings.supportedLevels, currentTenant?.config?.termSystem]);

  // Get appropriate labels and data based on school type
  const labels = useMemo(() => ({
    termOrSemester: isTertiary ? "Semester" : "Term",
    termsOrSemesters: isTertiary ? "Semesters" : "Terms",
    subjectOrCourse: isTertiary ? "Course" : "Subject",
    subjectsOrCourses: isTertiary ? "Courses" : "Subjects",
    periodsData: isTertiary ? SEMESTERS : TERMS,
    coursesData: isTertiary ? COURSES : SUBJECTS,
    classLevelsData: isTertiary ? TERTIARY_LEVELS : CLASS_LEVELS.filter(c =>
      settings.supportedLevels.includes(c.level as "Primary" | "Secondary")
    ),
  }), [isTertiary, settings.supportedLevels]);

  // Get students filtered by selected course/subject for custom plan
  const filteredStudents = useMemo(() => {
    if (formData.planType !== "custom" || !formData.selectedPeriod || !formData.selectedCourseForCustom) return [];

    // Filter students by the selected course/subject
    const selectedCourseValue = formData.selectedCourseForCustom;

    return MOCK_STUDENTS.filter((student) => {
      if (isTertiary) {
        // University: filter by courses array
        return student.courses?.includes(selectedCourseValue);
      } else {
        // Secondary/Primary: filter by subjects array
        return student.subjects?.includes(selectedCourseValue);
      }
    });
  }, [formData.planType, formData.selectedPeriod, formData.selectedCourseForCustom, isTertiary]);

  // Calculate affected students count (mock)
  const affectedStudentsCount = useMemo(() => {
    if (formData.planType === "per-term" && formData.selectedPeriod && formData.classLevel) {
      // Mock: return random count based on class
      return Math.floor(Math.random() * 30) + 20;
    }
    if (formData.planType === "per-course" && formData.selectedCourse) {
      return Math.floor(Math.random() * 50) + 15;
    }
    return 0;
  }, [formData.planType, formData.selectedPeriod, formData.classLevel, formData.selectedCourse]);

  // Populate form when editing
  useEffect(() => {
    if (isEditing && editingPlan) {
      setFormData({
        ...initialFormData,
        planType: editingPlan.planType || "custom",
        studentId: editingPlan.studentId,
        studentName: editingPlan.studentName,
        studentNumber: editingPlan.studentNumber,
        studentClassLevel: editingPlan.classLevel,
        feeTypeName: editingPlan.feeTypeName,
        totalAmount: editingPlan.totalAmount.toString(),
        installmentCount: editingPlan.installmentCount.toString(),
        frequency: editingPlan.frequency,
        startDate: editingPlan.startDate,
        academicYear: editingPlan.academicYear,
        selectedPeriod: editingPlan.term,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [isEditing, editingPlan, isOpen]);

  // Generate default installment due dates for a term
  const generateDefaultDueDates = (count: number, shortLabel: string): InstallmentDueDate[] => {
    return Array.from({ length: count }, (_, i) => ({
      sequence: i + 1,
      dueDate: "",
      description: `${shortLabel} - Installment ${i + 1}`,
    }));
  };

  // Initialize term configs based on school type
  const initializeTermConfigs = (): TermConfig[] => {
    const periods = isTertiary ? SEMESTERS : TERMS;
    const defaultInstallmentCount = 3;
    return periods.map((period) => ({
      periodValue: period.value,
      periodLabel: period.label,
      shortLabel: period.shortLabel,
      enabled: true,
      amount: "",
      installmentCount: defaultInstallmentCount.toString(),
      installmentDueDates: generateDefaultDueDates(defaultInstallmentCount, period.shortLabel),
    }));
  };

  // Handle plan type change
  const handlePlanTypeChange = (planType: PlanType) => {
    setFormData({
      ...initialFormData,
      planType,
      academicYear: formData.academicYear,
      termConfigs: planType === "per-term" ? initializeTermConfigs() : [],
      scheduleAmountOverrides: [], // Clear overrides when plan type changes
    });
    setErrors({});
  };

  // Handle term config mode change
  const handleTermConfigModeChange = (mode: TermConfigMode) => {
    setFormData({
      ...formData,
      termConfigMode: mode,
      termConfigs: mode === "individual" ? initializeTermConfigs() : [],
      selectedPeriod: mode === "single" ? formData.selectedPeriod : "",
      scheduleAmountOverrides: [], // Clear overrides when mode changes
    });
    setErrors({});
  };

  // Update individual term config
  const updateTermConfig = (index: number, field: keyof TermConfig, value: string | boolean | InstallmentDueDate[]) => {
    const newTermConfigs = [...formData.termConfigs];
    const termConfig = newTermConfigs[index];

    // If changing installment count, regenerate due dates
    if (field === "installmentCount" && typeof value === "string") {
      const newCount = parseInt(value) || 3;
      const currentDueDates = termConfig.installmentDueDates || [];

      // Preserve existing due dates where possible, add new ones or trim extras
      const newDueDates: InstallmentDueDate[] = Array.from({ length: newCount }, (_, i) => {
        if (i < currentDueDates.length) {
          return { ...currentDueDates[i], sequence: i + 1 };
        }
        return {
          sequence: i + 1,
          dueDate: "",
          description: `${termConfig.shortLabel} - Installment ${i + 1}`,
        };
      });

      newTermConfigs[index] = {
        ...termConfig,
        installmentCount: value,
        installmentDueDates: newDueDates,
      };
    } else {
      newTermConfigs[index] = { ...termConfig, [field]: value };
    }

    setFormData({ ...formData, termConfigs: newTermConfigs });
  };

  // Update individual installment due date within a term config
  const updateInstallmentDueDate = (termIndex: number, installmentIndex: number, dueDate: string) => {
    const newTermConfigs = [...formData.termConfigs];
    const termConfig = newTermConfigs[termIndex];
    const newDueDates = [...termConfig.installmentDueDates];
    newDueDates[installmentIndex] = { ...newDueDates[installmentIndex], dueDate };
    newTermConfigs[termIndex] = { ...termConfig, installmentDueDates: newDueDates };
    setFormData({ ...formData, termConfigs: newTermConfigs });
  };

  // Handle student selection (for custom plan)
  const handleStudentChange = (studentId: string) => {
    const student = MOCK_STUDENTS.find((s) => s.value === studentId);
    if (student) {
      setFormData({
        ...formData,
        studentId: student.value,
        studentName: student.name,
        studentNumber: student.number,
        studentClassLevel: student.class,
      });
      if (errors.studentId) setErrors({ ...errors, studentId: "" });
    }
  };

  // Handle course selection
  const handleCourseChange = (courseValue: string) => {
    const course = labels.coursesData.find((c) => c.value === courseValue);
    setFormData({
      ...formData,
      selectedCourse: courseValue,
      totalAmount: course?.amount.toString() || "",
    });
  };

  // Add custom installment
  const addCustomInstallment = () => {
    setFormData({
      ...formData,
      customInstallments: [
        ...formData.customInstallments,
        { dueDate: "", amount: "", description: `Installment ${formData.customInstallments.length + 1}` },
      ],
    });
  };

  // Remove custom installment
  const removeCustomInstallment = (index: number) => {
    if (formData.customInstallments.length > 1) {
      const newInstallments = formData.customInstallments.filter((_, i) => i !== index);
      setFormData({ ...formData, customInstallments: newInstallments });
    }
  };

  // Update custom installment
  const updateCustomInstallment = (index: number, field: string, value: string) => {
    const newInstallments = [...formData.customInstallments];
    newInstallments[index] = { ...newInstallments[index], [field]: value };

    // Update total amount
    const totalAmount = newInstallments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);

    setFormData({
      ...formData,
      customInstallments: newInstallments,
      totalAmount: totalAmount.toString(),
    });
  };

  // Get the total amount for the plan (course price or entered amount)
  const getTotalPlanAmount = (): number => {
    return parseFloat(formData.totalAmount) || 0;
  };

  // Update schedule amount override for a specific installment
  // Redistributes remaining amount across other installments
  // IMPORTANT: Total of all installments must NEVER exceed the plan total
  const updateScheduleAmountOverride = (sequence: number, amount: string) => {
    const totalPlanAmount = getTotalPlanAmount();

    // If empty or invalid, reset this override
    if (amount === "" || isNaN(parseFloat(amount))) {
      // Remove override for this sequence
      const newOverrides = formData.scheduleAmountOverrides.filter(o => o.sequence !== sequence);
      setFormData({
        ...formData,
        scheduleAmountOverrides: newOverrides,
      });
      return;
    }

    // Parse the new amount
    let newAmount = parseFloat(amount);

    // Get all current overrides except the one being edited
    const otherOverrides = formData.scheduleAmountOverrides.filter(o => o.sequence !== sequence);

    // Calculate total already allocated to OTHER overridden installments
    let allocatedToOthers = 0;
    const overriddenSequences = new Set<number>();
    otherOverrides.forEach(o => {
      if (o.amount !== "") {
        const amt = parseFloat(o.amount);
        if (!isNaN(amt)) {
          allocatedToOthers += amt;
          overriddenSequences.add(o.sequence);
        }
      }
    });

    // Calculate the maximum this installment can be:
    // It cannot exceed (totalPlanAmount - allocatedToOthers)
    // This ensures total never exceeds the plan amount
    const maxAllowedForThis = Math.max(0, totalPlanAmount - allocatedToOthers);

    // Cap the amount at the maximum allowed
    newAmount = Math.min(Math.max(0, newAmount), maxAllowedForThis);

    // Build new overrides array with the capped amount
    const newOverrides: InstallmentAmountOverride[] = [
      ...otherOverrides,
      { sequence, amount: newAmount.toString() },
    ];

    setFormData({
      ...formData,
      scheduleAmountOverrides: newOverrides,
    });
  };

  // Get the override amount for a specific installment (if any)
  // Now also considers redistribution of remaining amounts
  const getOverrideAmount = (sequence: number, defaultAmount: number, allSequences: number[]): number => {
    // Safety check for undefined allSequences
    if (!allSequences || !Array.isArray(allSequences)) {
      return defaultAmount;
    }

    const totalPlanAmount = getTotalPlanAmount();
    const installmentCount = allSequences.length;

    // Check if this sequence has an explicit override
    const override = formData.scheduleAmountOverrides.find(o => o.sequence === sequence);
    if (override && override.amount !== "") {
      const parsedAmount = parseFloat(override.amount);
      if (!isNaN(parsedAmount)) {
        return parsedAmount;
      }
    }

    // If no override for this sequence, calculate based on remaining amount
    // after accounting for all overridden installments
    let allocatedToOverrides = 0;
    const overriddenSequences = new Set<number>();

    formData.scheduleAmountOverrides.forEach(o => {
      if (o.amount !== "" && allSequences.includes(o.sequence)) {
        const amt = parseFloat(o.amount);
        if (!isNaN(amt)) {
          allocatedToOverrides += amt;
          overriddenSequences.add(o.sequence);
        }
      }
    });

    // If no overrides at all, return default
    if (overriddenSequences.size === 0) {
      return defaultAmount;
    }

    // Calculate remaining amount to distribute among non-overridden installments
    const remaining = totalPlanAmount - allocatedToOverrides;
    const nonOverriddenCount = installmentCount - overriddenSequences.size;

    if (nonOverriddenCount > 0 && !overriddenSequences.has(sequence)) {
      return Math.max(0, remaining / nonOverriddenCount);
    }

    return defaultAmount;
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.academicYear) newErrors.academicYear = "Please select an academic year";
    if (!formData.feeTypeName) newErrors.feeTypeName = "Please select a fee type";

    if (formData.planType === "per-term") {
      if (!formData.classLevel) {
        newErrors.classLevel = "Please select a class level";
      }

      if (formData.termConfigMode === "single") {
        // Single term/semester mode validation
        if (!formData.selectedPeriod) {
          newErrors.selectedPeriod = `Please select a ${labels.termOrSemester.toLowerCase()}`;
        }
        if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
          newErrors.totalAmount = "Please enter a valid amount";
        }
        if (!formData.startDate) newErrors.startDate = "Please select a start date";
      } else {
        // Individual term/semester mode validation
        const enabledConfigs = formData.termConfigs.filter(tc => tc.enabled);
        if (enabledConfigs.length === 0) {
          newErrors.termConfigs = `Please enable at least one ${labels.termOrSemester.toLowerCase()}`;
        } else {
          const hasInvalidConfig = enabledConfigs.some(
            tc => !tc.amount || parseFloat(tc.amount) <= 0 ||
            tc.installmentDueDates.some(dd => !dd.dueDate)
          );
          if (hasInvalidConfig) {
            newErrors.termConfigs = `Please fill in amount and all due dates for enabled ${labels.termsOrSemesters.toLowerCase()}`;
          }
        }
      }
    } else if (formData.planType === "per-course") {
      if (!formData.selectedCourse) {
        newErrors.selectedCourse = `Please select a ${labels.subjectOrCourse.toLowerCase()}`;
      }
      if (!formData.startDate) newErrors.startDate = "Please select a start date";
    } else if (formData.planType === "custom") {
      if (!formData.selectedPeriod) {
        newErrors.selectedPeriod = `Please select a ${labels.termOrSemester.toLowerCase()} first`;
      }
      if (!formData.selectedCourseForCustom) {
        newErrors.selectedCourseForCustom = `Please select a ${labels.subjectOrCourse.toLowerCase()} first`;
      }
      if (!formData.studentId) {
        newErrors.studentId = "Please select a student";
      }
      const hasEmptyInstallment = formData.customInstallments.some(
        (inst) => !inst.dueDate || !inst.amount || parseFloat(inst.amount) <= 0
      );
      if (hasEmptyInstallment) {
        newErrors.customInstallments = "Please fill in all installment details";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate schedule preview
  const generateSchedulePreview = () => {
    if (formData.planType === "per-term") {
      if (formData.termConfigMode === "individual") {
        // Individual term/semester mode - use configured due dates
        const enabledConfigs = formData.termConfigs.filter(tc => tc.enabled && tc.amount);
        const allInstallments: { sequence: number; dueDate: string; amount: number; description: string; termLabel: string }[] = [];

        enabledConfigs.forEach((termConfig) => {
          const total = parseFloat(termConfig.amount) || 0;
          const count = parseInt(termConfig.installmentCount) || 3;
          const amountPerInstallment = total / count;

          // Use individual due dates from config
          termConfig.installmentDueDates.forEach((dueDateConfig, i) => {
            if (dueDateConfig.dueDate) {
              allInstallments.push({
                sequence: i + 1,
                dueDate: dueDateConfig.dueDate,
                amount: amountPerInstallment,
                description: dueDateConfig.description || `${termConfig.shortLabel} - Installment ${i + 1}`,
                termLabel: termConfig.shortLabel,
              });
            }
          });
        });

        // Sort by due date and reassign sequence numbers
        const sortedInstallments = allInstallments
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .map((inst, idx) => ({ ...inst, sequence: idx + 1 }));

        // Get all sequences for redistribution calculation
        const allSequences = sortedInstallments.map(inst => inst.sequence);

        // Apply overrides with redistribution
        return sortedInstallments.map((inst) => ({
          ...inst,
          amount: getOverrideAmount(inst.sequence, inst.amount, allSequences),
        }));
      } else {
        // Single term/semester mode
        const total = parseFloat(formData.totalAmount) || 0;
        const count = parseInt(formData.installmentCount) || 3;
        const amountPerInstallment = total / count;
        const startDate = new Date(formData.startDate || new Date());

        // Generate all sequences first
        const allSequences = Array.from({ length: count }, (_, i) => i + 1);

        return Array.from({ length: count }, (_, index) => {
          const dueDate = new Date(startDate);
          dueDate.setMonth(dueDate.getMonth() + index);
          const sequence = index + 1;

          return {
            sequence,
            dueDate: dueDate.toISOString().split("T")[0],
            amount: getOverrideAmount(sequence, amountPerInstallment, allSequences),
            description: `Installment ${sequence}`,
          };
        });
      }
    } else if (formData.planType === "per-course") {
      const total = parseFloat(formData.totalAmount) || 0;
      const count = parseInt(formData.installmentCount) || 3;
      const amountPerInstallment = total / count;
      const startDate = new Date(formData.startDate || new Date());

      // Generate all sequences first
      const allSequences = Array.from({ length: count }, (_, i) => i + 1);

      return Array.from({ length: count }, (_, index) => {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + index);
        const sequence = index + 1;

        return {
          sequence,
          dueDate: dueDate.toISOString().split("T")[0],
          amount: getOverrideAmount(sequence, amountPerInstallment, allSequences),
          description: `Installment ${sequence}`,
        };
      });
    } else if (formData.planType === "custom") {
      return formData.customInstallments
        .filter((inst) => inst.dueDate && inst.amount)
        .map((inst, index) => ({
          sequence: index + 1,
          dueDate: inst.dueDate,
          amount: parseFloat(inst.amount) || 0,
          description: inst.description,
        }));
    }

    return [];
  };

  // Handle submit
  const handleSubmit = () => {
    if (validateForm()) {
      const schedule = generateSchedulePreview();
      const installments: Installment[] = schedule.map((s, index) => ({
        id: `ins-${Date.now()}-${index}`,
        sequence: s.sequence,
        dueDate: s.dueDate,
        amount: s.amount,
        paidAmount: 0,
        status: "pending" as const,
      }));

      const totalAmount = schedule.reduce((sum, s) => sum + s.amount, 0);
      const endDate = schedule.length > 0 ? schedule[schedule.length - 1].dueDate : formData.startDate;

      const baseData = {
        feeTypeName: FEE_TYPES.find((f) => f.value === formData.feeTypeName)?.label || formData.feeTypeName,
        totalAmount,
        paidAmount: 0,
        remainingAmount: totalAmount,
        installmentCount: installments.length,
        frequency: (formData.planType === "custom" ? "custom" : "monthly") as "monthly" | "quarterly" | "custom",
        startDate: formData.startDate || schedule[0]?.dueDate || new Date().toISOString().split("T")[0],
        endDate,
        status: "active" as InstallmentPlanStatus,
        installments,
        academicYear: formData.academicYear,
        term: formData.selectedPeriod,
        planType: formData.planType,
      };

      if (formData.planType === "per-term") {
        // Bulk plan for all students in class/term(s)
        const enabledTerms = formData.termConfigMode === "individual"
          ? formData.termConfigs.filter(tc => tc.enabled).map(tc => tc.periodLabel)
          : [labels.periodsData.find(p => p.value === formData.selectedPeriod)?.label || formData.selectedPeriod];

        onSave({
          ...baseData,
          isBulkPlan: true,
          targetType: "class",
          classLevel: labels.classLevelsData.find(c => c.value === formData.classLevel)?.label || formData.classLevel,
          affectedStudents: affectedStudentsCount,
          termConfigMode: formData.termConfigMode,
          terms: enabledTerms,
          termConfigs: formData.termConfigMode === "individual" ? formData.termConfigs.filter(tc => tc.enabled) : undefined,
        });
      } else if (formData.planType === "per-course") {
        // Bulk plan for all students taking the course
        const course = labels.coursesData.find(c => c.value === formData.selectedCourse);
        onSave({
          ...baseData,
          isBulkPlan: true,
          targetType: "course",
          courseName: course?.label || formData.selectedCourse,
          affectedStudents: affectedStudentsCount,
        });
      } else {
        // Custom plan for single student
        onSave({
          ...baseData,
          isBulkPlan: false,
          studentId: formData.studentId,
          studentName: formData.studentName,
          studentNumber: formData.studentNumber,
          classLevel: formData.studentClassLevel,
        });
      }
    }
  };

  // Handle close
  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const schedulePreview = generateSchedulePreview();
  const totalAmount = schedulePreview.reduce((sum, s) => sum + s.amount, 0);

  const footer = (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
      <button
        type="button"
        onClick={handleClose}
        className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#22262e] dark:hover:bg-[#2a2d35] midnight:bg-cyan-900/20 midnight:hover:bg-cyan-900/30 purple:bg-pink-900/20 purple:hover:bg-pink-900/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSaving}
        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isEditing ? "Update Plan" : "Create Plan"}
          </>
        )}
      </button>
    </div>
  );

  // Plan Type Cards
  const planTypes = [
    {
      id: "per-term" as PlanType,
      title: isTertiary ? "Per Semester" : "Per Term",
      description: isTertiary
        ? "Create plan for ALL students in a semester"
        : "Create plan for ALL students in a term",
      icon: Calendar,
      color: "blue",
      badge: "Bulk",
    },
    {
      id: "per-course" as PlanType,
      title: isTertiary ? "Per Course" : "Per Subject",
      description: isTertiary
        ? "Create plan for ALL students in a course"
        : "Create plan for ALL students in a subject",
      icon: BookOpen,
      color: "green",
      badge: "Bulk",
    },
    {
      id: "custom" as PlanType,
      title: "Custom Plan",
      description: "Create a custom plan for a specific student",
      icon: User,
      color: "purple",
      badge: "Individual",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Installment Plan" : "Create Installment Plan"}
      subtitle={isEditing ? "Update the payment plan details" : "Set up a payment installment plan"}
      icon={<Layers className="w-5 h-5" />}
      maxWidth="3xl"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Tenant/School Info Banner */}
        {currentTenant && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-lg border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentTenant.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isTertiary ? "Semester-based" : "Term-based"} system | {settings.supportedLevels.join(", ")} | {currentTenant.config?.currency || "NGN"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Type Selection */}
        <FormSection
          title="Plan Type"
          description="Choose how you want to create the installment plan"
          icon={<Layers className="w-5 h-5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {planTypes.map((plan) => {
              const isSelected = formData.planType === plan.id;
              const Icon = plan.icon;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handlePlanTypeChange(plan.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left cursor-pointer group ${
                    isSelected
                      ? plan.color === "blue"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                        : plan.color === "green"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20"
                        : "border-purple-500 bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-surface"
                  }`}
                >
                  {/* Badge */}
                  <span className={`absolute top-2 right-2 px-2 py-0.5 text-[0.625rem] font-bold rounded-full ${
                    plan.badge === "Bulk"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}>
                    {plan.badge}
                  </span>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className={`absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.color === "blue"
                        ? "bg-blue-500"
                        : plan.color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    }`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 mt-4 ${
                    isSelected
                      ? plan.color === "blue"
                        ? "bg-blue-500 text-white"
                        : plan.color === "green"
                        ? "bg-green-500 text-white"
                        : "bg-purple-500 text-white"
                      : "bg-gray-100 dark:bg-[#22262e] text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h4 className={`font-semibold text-sm ${
                    isSelected
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {plan.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {plan.description}
                  </p>
                </button>
              );
            })}
          </div>
        </FormSection>

        {/* Academic Year & Fee Type - Always shown */}
        <FormSection
          title="Basic Details"
          description="Select the academic year and fee type"
          icon={<FileText className="w-5 h-5 text-green-600 dark:text-green-400" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormDropdown
              label="Academic Year"
              icon={<Calendar className="w-2.5 h-2.5" />}
              value={formData.academicYear}
              onChange={(value) => setFormData({ ...formData, academicYear: value })}
              options={ACADEMIC_YEARS}
              placeholder="Select year"
              required
              error={errors.academicYear}
            />

            <FormDropdown
              label="Fee Type"
              icon={<FileText className="w-2.5 h-2.5" />}
              value={formData.feeTypeName}
              onChange={(value) => {
                setFormData({ ...formData, feeTypeName: value });
                if (errors.feeTypeName) setErrors({ ...errors, feeTypeName: "" });
              }}
              options={FEE_TYPES}
              placeholder="Select fee type"
              required
              error={errors.feeTypeName}
            />
          </div>
        </FormSection>

        {/* Per-Term/Semester Configuration */}
        {formData.planType === "per-term" && (
          <FormSection
            title={`${labels.termOrSemester} & Class Selection`}
            description={`Configure the ${labels.termOrSemester.toLowerCase()}(s) and class for this bulk plan`}
            icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          >
            <div className="space-y-5">
              {/* Class Selection - Always shown */}
              <FormDropdown
                label={isTertiary ? "Level" : "Class"}
                icon={<GraduationCap className="w-2.5 h-2.5" />}
                value={formData.classLevel}
                onChange={(value) => {
                  setFormData({ ...formData, classLevel: value });
                  if (errors.classLevel) setErrors({ ...errors, classLevel: "" });
                }}
                options={labels.classLevelsData}
                placeholder={`Select ${isTertiary ? "level" : "class"}`}
                required
                error={errors.classLevel}
              />

              {/* Configuration Mode Toggle */}
              <div className="p-4 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Configuration Mode
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleTermConfigModeChange("single")}
                    className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all cursor-pointer ${
                      formData.termConfigMode === "single"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1a1d24] text-gray-600 dark:text-gray-400 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {formData.termConfigMode === "single" && <Check className="w-4 h-4" />}
                      <span>Single {labels.termOrSemester}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      One {labels.termOrSemester.toLowerCase()} only
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTermConfigModeChange("individual")}
                    className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all cursor-pointer ${
                      formData.termConfigMode === "individual"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1a1d24] text-gray-600 dark:text-gray-400 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {formData.termConfigMode === "individual" && <Check className="w-4 h-4" />}
                      <span>All {labels.termsOrSemesters}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Configure each {labels.termOrSemester.toLowerCase()}
                    </p>
                  </button>
                </div>
              </div>

              {/* Single Term/Semester Mode */}
              {formData.termConfigMode === "single" && (
                <>
                  <FormDropdown
                    label={labels.termOrSemester}
                    icon={<Calendar className="w-2.5 h-2.5" />}
                    value={formData.selectedPeriod}
                    onChange={(value) => {
                      setFormData({ ...formData, selectedPeriod: value });
                      if (errors.selectedPeriod) setErrors({ ...errors, selectedPeriod: "" });
                    }}
                    options={labels.periodsData}
                    placeholder={`Select ${labels.termOrSemester.toLowerCase()}`}
                    required
                    error={errors.selectedPeriod}
                  />

                  {/* Affected Students Info */}
                  {formData.selectedPeriod && formData.classLevel && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                            {affectedStudentsCount} students will be affected
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            This plan will be created for all students in {labels.classLevelsData.find(c => c.value === formData.classLevel)?.label} for {labels.periodsData.find(p => p.value === formData.selectedPeriod)?.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormInput
                      label={`Amount per Student (${currencySymbol})`}
                      icon={<DollarSign className="w-2.5 h-2.5" />}
                      type="number"
                      value={formData.totalAmount}
                      onChange={(value) => {
                        setFormData({ ...formData, totalAmount: value });
                        if (errors.totalAmount) setErrors({ ...errors, totalAmount: "" });
                      }}
                      placeholder="0.00"
                      required
                      error={errors.totalAmount}
                    />

                    <FormDropdown
                      label="Installments"
                      icon={<Layers className="w-2.5 h-2.5" />}
                      value={formData.installmentCount}
                      onChange={(value) => setFormData({ ...formData, installmentCount: value, scheduleAmountOverrides: [] })}
                      options={INSTALLMENT_OPTIONS}
                      placeholder="Select count"
                    />

                    <FormInput
                      label="Start Date"
                      icon={<Calendar className="w-2.5 h-2.5" />}
                      type="date"
                      value={formData.startDate}
                      onChange={(value) => {
                        setFormData({ ...formData, startDate: value });
                        if (errors.startDate) setErrors({ ...errors, startDate: "" });
                      }}
                      placeholder="Select start date"
                      required
                      error={errors.startDate}
                    />
                  </div>
                </>
              )}

              {/* Individual Term/Semester Configuration Mode */}
              {formData.termConfigMode === "individual" && (
                <>
                  {/* Affected Students Info */}
                  {formData.classLevel && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                            {affectedStudentsCount} students will be affected
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            Plans will be created for all students in {labels.classLevelsData.find(c => c.value === formData.classLevel)?.label} for all enabled {labels.termsOrSemesters.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Individual Term/Semester Cards */}
                  <div className="space-y-4">
                    {formData.termConfigs.map((termConfig, index) => (
                      <div
                        key={termConfig.periodValue}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          termConfig.enabled
                            ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10"
                            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1d24]/50 opacity-60"
                        }`}
                      >
                        {/* Term Header with Toggle */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => updateTermConfig(index, "enabled", !termConfig.enabled)}
                              className={`w-10 h-6 rounded-full transition-all cursor-pointer relative ${
                                termConfig.enabled
                                  ? "bg-blue-500 dark:bg-blue-600"
                                  : "bg-gray-300 dark:bg-[#2a2d35]"
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${
                                  termConfig.enabled ? "left-5" : "left-1"
                                }`}
                              />
                            </button>
                            <div>
                              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {termConfig.periodLabel}
                              </h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {termConfig.enabled ? "Enabled" : "Disabled"}
                              </p>
                            </div>
                          </div>
                          {termConfig.enabled && termConfig.amount && (
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {currencySymbol}{parseFloat(termConfig.amount).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Term Configuration Fields */}
                        {termConfig.enabled && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Amount and Installment Count */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormInput
                                label={`Total Amount (${currencySymbol})`}
                                icon={<DollarSign className="w-2.5 h-2.5" />}
                                type="number"
                                value={termConfig.amount}
                                onChange={(value) => updateTermConfig(index, "amount", value)}
                                placeholder="0.00"
                                required
                              />
                              <FormDropdown
                                label="Number of Installments"
                                icon={<Layers className="w-2.5 h-2.5" />}
                                value={termConfig.installmentCount}
                                onChange={(value) => updateTermConfig(index, "installmentCount", value)}
                                options={INSTALLMENT_OPTIONS}
                                placeholder="Select"
                              />
                            </div>

                            {/* Individual Installment Due Dates */}
                            <div className="mt-4">
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
                                Due Dates for Each Installment
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {termConfig.installmentDueDates.map((dueDateConfig, dueDateIndex) => (
                                  <div
                                    key={dueDateIndex}
                                    className="p-3 bg-white dark:bg-[#1a1d24] rounded-lg border border-gray-200 dark:border-gray-700"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                                        {dueDateConfig.sequence}
                                      </span>
                                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {dueDateConfig.description}
                                      </span>
                                    </div>
                                    <input
                                      type="date"
                                      value={dueDateConfig.dueDate}
                                      onChange={(e) => updateInstallmentDueDate(index, dueDateIndex, e.target.value)}
                                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                      required
                                    />
                                    {termConfig.amount && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Amount: {currencySymbol}{(parseFloat(termConfig.amount) / parseInt(termConfig.installmentCount || "3")).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {errors.termConfigs && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.termConfigs}</p>
                  )}
                </>
              )}
            </div>
          </FormSection>
        )}

        {/* Per-Course/Subject Configuration */}
        {formData.planType === "per-course" && (
          <FormSection
            title={`${labels.subjectOrCourse} Selection`}
            description={`Select the ${labels.subjectOrCourse.toLowerCase()} for this bulk plan`}
            icon={<BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />}
          >
            <div className="space-y-5">
              {/* Course/Subject Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {labels.coursesData.map((course) => {
                  const isSelected = formData.selectedCourse === course.value;
                  return (
                    <button
                      key={course.value}
                      type="button"
                      onClick={() => handleCourseChange(course.value)}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] hover:border-green-300 dark:hover:border-green-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          isSelected
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 dark:bg-[#22262e]"
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-sm font-medium ${
                          isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {course.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {currencySymbol}{course.amount.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.selectedCourse && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.selectedCourse}</p>
              )}

              {/* Affected Students Info */}
              {formData.selectedCourse && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                        {affectedStudentsCount} students will be affected
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        This plan will be created for all students taking {labels.coursesData.find(c => c.value === formData.selectedCourse)?.label}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount per Student - Editable */}
              <FormInput
                label={`Amount per Student (${currencySymbol})`}
                icon={<DollarSign className="w-2.5 h-2.5" />}
                type="number"
                value={formData.totalAmount}
                onChange={(value) => {
                  setFormData({ ...formData, totalAmount: value });
                  if (errors.totalAmount) setErrors({ ...errors, totalAmount: "" });
                }}
                placeholder="Enter amount"
                required
                error={errors.totalAmount}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormDropdown
                  label="Number of Installments"
                  icon={<Layers className="w-2.5 h-2.5" />}
                  value={formData.installmentCount}
                  onChange={(value) => setFormData({ ...formData, installmentCount: value, scheduleAmountOverrides: [] })}
                  options={INSTALLMENT_OPTIONS}
                  placeholder="Select count"
                />

                <FormInput
                  label="Start Date"
                  icon={<Calendar className="w-2.5 h-2.5" />}
                  type="date"
                  value={formData.startDate}
                  onChange={(value) => {
                    setFormData({ ...formData, startDate: value });
                    if (errors.startDate) setErrors({ ...errors, startDate: "" });
                  }}
                  placeholder="Select start date"
                  required
                  error={errors.startDate}
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* Custom Plan Configuration */}
        {formData.planType === "custom" && (
          <>
            {/* Step 1: Select Term/Semester First */}
            <FormSection
              title={`Step 1: Select ${labels.termOrSemester}`}
              description={`Select the ${labels.termOrSemester.toLowerCase()} first`}
              icon={<Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            >
              <div className="flex flex-wrap gap-3">
                {labels.periodsData.map((period) => {
                  const isSelected = formData.selectedPeriod === period.value;
                  return (
                    <button
                      key={period.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, selectedPeriod: period.value, selectedCourseForCustom: "", studentId: "", studentName: "", studentNumber: "", studentClassLevel: "" });
                        if (errors.selectedPeriod) setErrors({ ...errors, selectedPeriod: "" });
                      }}
                      className={`px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-500 text-white dark:bg-blue-600 dark:border-blue-600"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 inline mr-2" />}
                      {period.label}
                    </button>
                  );
                })}
              </div>
              {errors.selectedPeriod && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">{errors.selectedPeriod}</p>
              )}
            </FormSection>

            {/* Step 2: Select Course/Subject (only after term is selected) */}
            {formData.selectedPeriod && (
              <FormSection
                title={`Step 2: Select ${labels.subjectOrCourse}`}
                description={`Select the ${labels.subjectOrCourse.toLowerCase()} to load enrolled students`}
                icon={<BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {labels.coursesData.map((course) => {
                    const isSelected = formData.selectedCourseForCustom === course.value;
                    return (
                      <button
                        key={course.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, selectedCourseForCustom: course.value, studentId: "", studentName: "", studentNumber: "", studentClassLevel: "" });
                          if (errors.selectedCourseForCustom) setErrors({ ...errors, selectedCourseForCustom: "" });
                        }}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
                          isSelected
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] hover:border-green-300 dark:hover:border-green-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 dark:bg-[#22262e]"
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span className={`text-sm font-medium ${
                            isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {course.label}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {currencySymbol}{course.amount.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.selectedCourseForCustom && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">{errors.selectedCourseForCustom}</p>
                )}
              </FormSection>
            )}

            {/* Step 3: Select Student (only after course/subject is selected) */}
            {formData.selectedPeriod && formData.selectedCourseForCustom && (
              <FormSection
                title="Step 3: Select Student"
                description={`Students enrolled in ${labels.coursesData.find(c => c.value === formData.selectedCourseForCustom)?.label}`}
                icon={<User className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              >
                <div className="space-y-5">
                  {filteredStudents.length === 0 ? (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        No students found enrolled in {labels.coursesData.find(c => c.value === formData.selectedCourseForCustom)?.label}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          <span className="font-semibold">{filteredStudents.length}</span> student{filteredStudents.length !== 1 ? "s" : ""} enrolled in this {labels.subjectOrCourse.toLowerCase()}
                        </p>
                      </div>
                      <FormDropdown
                        label="Select Student"
                        icon={<User className="w-2.5 h-2.5" />}
                        value={formData.studentId}
                        onChange={handleStudentChange}
                        options={filteredStudents}
                        placeholder="Search and select a student"
                        required
                        error={errors.studentId}
                        disabled={isEditing}
                      />
                    </>
                  )}

                  {/* Show selected student info */}
                  {formData.studentId && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 midnight:border-purple-800 purple:border-pink-800 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Student Name</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{formData.studentName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Student Number</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{formData.studentNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Class</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{formData.studentClassLevel}</p>
                      </div>
                    </div>
                  )}
                </div>
              </FormSection>
            )}

            {/* Step 4: Custom Installments */}
            {formData.studentId && (
              <FormSection
                title="Step 4: Define Custom Installments"
                description="Create a custom payment schedule for this student"
                icon={<Settings2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              >
                <div className="space-y-4">
                  {formData.customInstallments.map((installment, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          Installment {index + 1}
                        </h5>
                        {formData.customInstallments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCustomInstallment(index)}
                            className="text-red-500 hover:text-red-600 text-xs font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormInput
                          label="Description"
                          icon={<FileText className="w-2.5 h-2.5" />}
                          value={installment.description}
                          onChange={(value) => updateCustomInstallment(index, "description", value)}
                          placeholder="e.g., First Payment"
                        />
                        <FormInput
                          label="Due Date"
                          icon={<Calendar className="w-2.5 h-2.5" />}
                          type="date"
                          value={installment.dueDate}
                          onChange={(value) => updateCustomInstallment(index, "dueDate", value)}
                          placeholder="Select date"
                        />
                        <FormInput
                          label={`Amount (${currencySymbol})`}
                          icon={<DollarSign className="w-2.5 h-2.5" />}
                          type="number"
                          value={installment.amount}
                          onChange={(value) => updateCustomInstallment(index, "amount", value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}

                  {errors.customInstallments && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.customInstallments}</p>
                  )}

                  <button
                    type="button"
                    onClick={addCustomInstallment}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-500 dark:hover:text-purple-400 transition-all cursor-pointer"
                  >
                    + Add Another Installment
                  </button>
                </div>
              </FormSection>
            )}
          </>
        )}

        {/* Schedule Preview */}
        {schedulePreview.length > 0 && (
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 midnight:from-cyan-900/20 midnight:to-cyan-800/20 purple:from-pink-900/20 purple:to-pink-800/20 rounded-xl border-2 border-green-200 dark:border-green-800 midnight:border-cyan-800 purple:border-pink-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-600 dark:bg-green-500 midnight:bg-cyan-600 purple:bg-pink-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-ink">
                  Payment Schedule Preview
                </h4>
                {formData.planType !== "custom" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {affectedStudentsCount > 0 && `This schedule will be applied to ${affectedStudentsCount} students. `}
                    Click on amounts to customize each installment.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {schedulePreview.map((item) => {
                // Check if this installment has an override
                const override = formData.scheduleAmountOverrides.find(o => o.sequence === item.sequence);
                const hasOverride = override && override.amount !== "";
                const isCustomPlan = formData.planType === "custom";

                return (
                  <div
                    key={item.sequence}
                    className="flex items-center justify-between p-3 bg-surface rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        hasOverride
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300"
                      }`}>
                        {item.sequence}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {/* Editable amount for non-custom plans */}
                    {!isCustomPlan ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{currencySymbol}</span>
                        <input
                          type="number"
                          value={override?.amount ?? item.amount.toString()}
                          onChange={(e) => updateScheduleAmountOverride(item.sequence, e.target.value)}
                          placeholder={item.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          className={`w-28 px-3 py-1.5 text-sm font-semibold text-right rounded-lg border transition-all ${
                            hasOverride
                              ? "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          } focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 dark:focus:border-blue-500 outline-none`}
                        />
                        {hasOverride && (
                          <button
                            type="button"
                            onClick={() => updateScheduleAmountOverride(item.sequence, "")}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Reset to default"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {currencySymbol}{item.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t-2 border-green-300 dark:border-green-700 midnight:border-cyan-700 purple:border-pink-700 flex justify-between items-center">
              <span className="font-bold text-ink">
                Total Amount {formData.planType !== "custom" ? "per Student" : ""}
              </span>
              <span className="font-bold text-xl text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400">
                {currencySymbol}{totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
