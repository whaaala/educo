"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Settings, Search, ChevronLeft, ChevronRight } from "lucide-react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import SearchBar from "@/components/shared/SearchBar";
import {
  getEducationLevelFromClass
} from "@/lib/educationLevelUtils";
import GradingSystemConfig from "@/components/settings/GradingSystemConfig";
import {
  type EducationLevel,
} from "@/lib/gradingConfig";
// Assessment Component based on PRD Section 4.11
interface GradingComponent {
  id: string;
  name: string;
  type: "classwork" | "homework" | "test_quiz" | "project" | "practical" | "behavior" | "examination" |
        "assignment" | "continuous_assessment" | "midterm" | "lab_practical" | "final_exam" |
        "coursework" | "presentation" | "internship" | "evening_weekend";
  weight: number; // Percentage weight in final grade (based on PRD 4.11)
  maxScore: number;
  scoreObtained?: number; // undefined if not yet graded
  percentage?: number;
  status: "completed" | "pending" | "in_progress";
  dueDate?: string;
  submittedDate?: string;
  feedback?: string;
}

// Subject/Module with Adaptive Grading Engine (AGE) structure
interface SubjectModule {
  id: string;
  name: string;
  code: string;
  term?: string; // For Primary/Secondary: "First Term", "Second Term", "Third Term"
  semester?: string; // For Tertiary: "1st Semester", "2nd Semester"
  level?: string; // For Tertiary: "100 Level", "200 Level", etc.
  credits?: number; // For Tertiary only
  teacher?: string;

  // Grading Components (weighted based on education level)
  gradingComponents: GradingComponent[];

  // Overall Results
  totalScore: number; // Out of 100 or maxMarks
  percentage: number;
  grade?: string; // A1-F9 for Secondary, A-F for Tertiary
  gpa?: number; // For Tertiary: 0.0 - 5.0
  result: "Pass" | "Fail" | "In Progress";

  // Min passing marks
  minMarks: number;
}

interface ExamResultsProps {
  educationLevel?: EducationLevel;
  studentClass?: string;
  allowConfiguration?: boolean; // Allow teachers/admins to configure grading
}

// ============================================================================
// MOCK DATA: PRIMARY SCHOOL SUBJECTS (English Language Example)
// Based on PRD 4.11: Classwork & Homework (20%), Tests/Quizzes (20%),
//                    Projects/Practicals (10%), Behavior/Participation (10%), Examination (40%)
// ============================================================================

const PRIMARY_SUBJECTS: SubjectModule[] = [
  {
    id: "eng-t3",
    name: "English Language",
    code: "ENG",
    term: "Third Term",
    teacher: "Mrs. Adebayo",
    minMarks: 40,
    gradingComponents: [
      { id: "cw1", name: "Classwork & Homework", type: "classwork", weight: 20, maxScore: 20, scoreObtained: 17, percentage: 85, status: "completed" },
      { id: "tq1", name: "Tests & Quizzes", type: "test_quiz", weight: 20, maxScore: 20, scoreObtained: 16, percentage: 80, status: "completed" },
      { id: "pr1", name: "Reading Project", type: "project", weight: 10, maxScore: 10, scoreObtained: 9, percentage: 90, status: "completed", submittedDate: "15 May 2024" },
      { id: "bh1", name: "Behavior & Participation", type: "behavior", weight: 10, maxScore: 10, scoreObtained: 9, percentage: 90, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "examination", weight: 40, maxScore: 40, scoreObtained: 34, percentage: 85, status: "completed" },
    ],
    totalScore: 85,
    percentage: 85,
    result: "Pass",
  },
  {
    id: "mth-t3",
    name: "Mathematics",
    code: "MTH",
    term: "Third Term",
    teacher: "Mr. Okafor",
    minMarks: 40,
    gradingComponents: [
      { id: "cw1", name: "Classwork & Homework", type: "classwork", weight: 20, maxScore: 20, scoreObtained: 18, percentage: 90, status: "completed" },
      { id: "tq1", name: "Tests & Quizzes", type: "test_quiz", weight: 20, maxScore: 20, scoreObtained: 17, percentage: 85, status: "completed" },
      { id: "pr1", name: "Math Project", type: "project", weight: 10, maxScore: 10, scoreObtained: 8, percentage: 80, status: "completed" },
      { id: "bh1", name: "Behavior & Participation", type: "behavior", weight: 10, maxScore: 10, scoreObtained: 10, percentage: 100, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "examination", weight: 40, maxScore: 40, scoreObtained: 35, percentage: 87.5, status: "completed" },
    ],
    totalScore: 88,
    percentage: 88,
    result: "Pass",
  },
  {
    id: "bsc-t3",
    name: "Basic Science",
    code: "BSC",
    term: "Third Term",
    teacher: "Mrs. Ibrahim",
    minMarks: 40,
    gradingComponents: [
      { id: "cw1", name: "Classwork & Homework", type: "classwork", weight: 20, maxScore: 20, scoreObtained: 16, percentage: 80, status: "completed" },
      { id: "tq1", name: "Tests & Quizzes", type: "test_quiz", weight: 20, maxScore: 20, scoreObtained: 15, percentage: 75, status: "completed" },
      { id: "pr1", name: "Science Fair - Volcano", type: "practical", weight: 10, maxScore: 10, scoreObtained: 9, percentage: 90, status: "completed", submittedDate: "10 May 2024" },
      { id: "bh1", name: "Behavior & Participation", type: "behavior", weight: 10, maxScore: 10, scoreObtained: 8, percentage: 80, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "examination", weight: 40, maxScore: 40, scoreObtained: 28, percentage: 70, status: "completed" },
    ],
    totalScore: 76,
    percentage: 76,
    result: "Pass",
  },
  {
    id: "sst-t3",
    name: "Social Studies",
    code: "SST",
    term: "Third Term",
    teacher: "Mr. Yusuf",
    minMarks: 40,
    gradingComponents: [
      { id: "cw1", name: "Classwork & Homework", type: "classwork", weight: 20, maxScore: 20, scoreObtained: 14, percentage: 70, status: "completed" },
      { id: "tq1", name: "Tests & Quizzes", type: "test_quiz", weight: 20, maxScore: 20, scoreObtained: 13, percentage: 65, status: "completed" },
      { id: "pr1", name: "Community Project", type: "project", weight: 10, maxScore: 10, scoreObtained: 7, percentage: 70, status: "completed" },
      { id: "bh1", name: "Behavior & Participation", type: "behavior", weight: 10, maxScore: 10, scoreObtained: 7, percentage: 70, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "examination", weight: 40, maxScore: 40, scoreObtained: 24, percentage: 60, status: "in_progress" },
    ],
    totalScore: 65,
    percentage: 65,
    result: "In Progress",
  },
  {
    id: "crt-t3",
    name: "Creative Arts",
    code: "CRT",
    term: "Third Term",
    teacher: "Ms. Amina",
    minMarks: 40,
    gradingComponents: [
      { id: "cw1", name: "Classwork & Homework", type: "classwork", weight: 20, maxScore: 20, scoreObtained: 12, percentage: 60, status: "completed" },
      { id: "tq1", name: "Tests & Quizzes", type: "test_quiz", weight: 20, maxScore: 20, scoreObtained: 11, percentage: 55, status: "completed" },
      { id: "pr1", name: "Art Exhibition", type: "project", weight: 10, maxScore: 10, scoreObtained: 6, percentage: 60, status: "completed" },
      { id: "bh1", name: "Behavior & Participation", type: "behavior", weight: 10, maxScore: 10, scoreObtained: 6, percentage: 60, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "examination", weight: 40, maxScore: 40, scoreObtained: 14, percentage: 35, status: "completed" },
    ],
    totalScore: 35,
    percentage: 35,
    result: "Fail",
  },
];

// ============================================================================
// MOCK DATA: SECONDARY SCHOOL SUBJECTS (Biology Example)
// Based on PRD 4.11: Class Tests (15%), Assignments/Projects (10%), Mid-Term (15%),
//                    Practical Work (10%), Final Exam (50%)
// ============================================================================

const SECONDARY_SUBJECTS: SubjectModule[] = [
  {
    id: "bio-t3",
    name: "Biology",
    code: "BIO105",
    term: "Third Term",
    teacher: "Dr. Chioma Eze",
    minMarks: 40,
    gradingComponents: [
      { id: "ct1", name: "Class Tests", type: "test_quiz", weight: 15, maxScore: 15, scoreObtained: 13, percentage: 86.7, status: "completed" },
      { id: "as1", name: "Assignments & Projects", type: "assignment", weight: 10, maxScore: 10, scoreObtained: 8, percentage: 80, status: "completed" },
      { id: "mt1", name: "Mid-Term Examination", type: "midterm", weight: 15, maxScore: 15, scoreObtained: 12, percentage: 80, status: "completed" },
      { id: "pr1", name: "Lab Practical Work", type: "lab_practical", weight: 10, maxScore: 10, scoreObtained: 9, percentage: 90, status: "completed", feedback: "Excellent dissection technique" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 50, maxScore: 50, scoreObtained: 42, percentage: 84, status: "completed" },
    ],
    totalScore: 84,
    percentage: 84,
    result: "Pass",
  },
  {
    id: "phy-t3",
    name: "Physics",
    code: "PHY103",
    term: "Third Term",
    teacher: "Mr. Adewale Johnson",
    minMarks: 40,
    gradingComponents: [
      { id: "ct1", name: "Class Tests", type: "test_quiz", weight: 15, maxScore: 15, scoreObtained: 11, percentage: 73.3, status: "completed" },
      { id: "as1", name: "Assignments & Projects", type: "assignment", weight: 10, maxScore: 10, scoreObtained: 7, percentage: 70, status: "completed" },
      { id: "mt1", name: "Mid-Term Examination", type: "midterm", weight: 15, maxScore: 15, scoreObtained: 11, percentage: 73.3, status: "completed" },
      { id: "pr1", name: "Lab Practical Work", type: "lab_practical", weight: 10, maxScore: 10, scoreObtained: 8, percentage: 80, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 50, maxScore: 50, scoreObtained: 38, percentage: 76, status: "completed" },
    ],
    totalScore: 75,
    percentage: 75,
    result: "Pass",
  },
  {
    id: "chm-t3",
    name: "Chemistry",
    code: "CHM104",
    term: "Third Term",
    teacher: "Dr. Fatima Bello",
    minMarks: 40,
    gradingComponents: [
      { id: "ct1", name: "Class Tests", type: "test_quiz", weight: 15, maxScore: 15, scoreObtained: 13, percentage: 86.7, status: "completed" },
      { id: "as1", name: "Assignments & Projects", type: "assignment", weight: 10, maxScore: 10, scoreObtained: 9, percentage: 90, status: "completed" },
      { id: "mt1", name: "Mid-Term Examination", type: "midterm", weight: 15, maxScore: 15, scoreObtained: 13, percentage: 86.7, status: "completed" },
      { id: "pr1", name: "Lab Practical Work", type: "lab_practical", weight: 10, maxScore: 10, scoreObtained: 10, percentage: 100, status: "completed", feedback: "Outstanding titration accuracy" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 50, maxScore: 50, scoreObtained: 44, percentage: 88, status: "completed" },
    ],
    totalScore: 89,
    percentage: 89,
    result: "Pass",
  },
  {
    id: "eng-t3",
    name: "English Language",
    code: "ENG101",
    term: "Third Term",
    teacher: "Mrs. Omotola",
    minMarks: 40,
    gradingComponents: [
      { id: "ct1", name: "Class Tests", type: "test_quiz", weight: 15, maxScore: 15, scoreObtained: 10, percentage: 66.7, status: "completed" },
      { id: "as1", name: "Assignments & Projects", type: "assignment", weight: 10, maxScore: 10, scoreObtained: 6, percentage: 60, status: "completed" },
      { id: "mt1", name: "Mid-Term Examination", type: "midterm", weight: 15, maxScore: 15, scoreObtained: 9, percentage: 60, status: "completed" },
      { id: "pr1", name: "Oral Presentation", type: "presentation", weight: 10, maxScore: 10, scoreObtained: 7, percentage: 70, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 50, maxScore: 50, scoreObtained: 18, percentage: 36, status: "completed" },
    ],
    totalScore: 38,
    percentage: 38,
    result: "Fail",
  },
  {
    id: "mth-t3",
    name: "Mathematics",
    code: "MTH102",
    term: "Third Term",
    teacher: "Mr. Bala",
    minMarks: 40,
    gradingComponents: [
      { id: "ct1", name: "Class Tests", type: "test_quiz", weight: 15, maxScore: 15, scoreObtained: 11, percentage: 73.3, status: "completed" },
      { id: "as1", name: "Assignments & Projects", type: "assignment", weight: 10, maxScore: 10, scoreObtained: 7, percentage: 70, status: "completed" },
      { id: "mt1", name: "Mid-Term Examination", type: "midterm", weight: 15, maxScore: 15, scoreObtained: 10, percentage: 66.7, status: "completed" },
      { id: "pr1", name: "Practical Work", type: "practical", weight: 10, maxScore: 10, scoreObtained: 7, percentage: 70, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 50, maxScore: 50, scoreObtained: undefined, percentage: undefined, status: "pending" },
    ],
    totalScore: 65,
    percentage: 65,
    result: "In Progress",
  },
];

// ============================================================================
// MOCK DATA: TERTIARY/UNIVERSITY MODULES (Example: CSC201 - Software Engineering)
// Based on PRD 4.11: Continuous Assessment (30%), Lab Work (10%),
//                    Mid-Semester Exam (20%), Final Exam (40%)
// ============================================================================

const TERTIARY_MODULES: SubjectModule[] = [
  {
    id: "csc201-s2",
    name: "Software Engineering",
    code: "CSC201",
    semester: "2nd Semester",
    level: "200 Level",
    credits: 4,
    teacher: "Prof. Adeyemi Ogunlade",
    minMarks: 40,
    gradingComponents: [
      { id: "ca1", name: "Continuous Assessment", type: "continuous_assessment", weight: 30, maxScore: 30, scoreObtained: 26, percentage: 86.7, status: "completed", feedback: "Strong grasp of Agile methodology" },
      { id: "lb1", name: "Lab Work", type: "lab_practical", weight: 10, maxScore: 10, scoreObtained: 9, percentage: 90, status: "completed" },
      { id: "mt1", name: "Mid-Semester Exam", type: "midterm", weight: 20, maxScore: 20, scoreObtained: 16, percentage: 80, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 40, maxScore: 40, scoreObtained: 34, percentage: 85, status: "completed" },
    ],
    totalScore: 85,
    percentage: 85,
    grade: "A",
    gpa: 4.0,
    result: "Pass",
  },
  {
    id: "csc202-s2",
    name: "Data Structures & Algorithms",
    code: "CSC202",
    semester: "2nd Semester",
    level: "200 Level",
    credits: 4,
    teacher: "Dr. Ngozi Okeke",
    minMarks: 40,
    gradingComponents: [
      { id: "ca1", name: "Continuous Assessment", type: "continuous_assessment", weight: 30, maxScore: 30, scoreObtained: 24, percentage: 80, status: "completed" },
      { id: "lb1", name: "Lab Work", type: "lab_practical", weight: 10, maxScore: 10, scoreObtained: 8, percentage: 80, status: "completed" },
      { id: "mt1", name: "Mid-Semester Exam", type: "midterm", weight: 20, maxScore: 20, scoreObtained: 15, percentage: 75, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 40, maxScore: 40, scoreObtained: 31, percentage: 77.5, status: "completed" },
    ],
    totalScore: 78,
    percentage: 78,
    grade: "B+",
    gpa: 3.5,
    result: "Pass",
  },
  {
    id: "csc203-s2",
    name: "Database Management Systems",
    code: "CSC203",
    semester: "2nd Semester",
    level: "200 Level",
    credits: 3,
    teacher: "Dr. Yusuf Mohammed",
    minMarks: 40,
    gradingComponents: [
      { id: "ca1", name: "Continuous Assessment", type: "continuous_assessment", weight: 30, maxScore: 30, scoreObtained: 27, percentage: 90, status: "completed" },
      { id: "lb1", name: "Lab Work", type: "lab_practical", weight: 10, maxScore: 10, scoreObtained: 9, percentage: 90, status: "completed", feedback: "Excellent SQL query optimization" },
      { id: "mt1", name: "Mid-Semester Exam", type: "midterm", weight: 20, maxScore: 20, scoreObtained: 17, percentage: 85, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 40, maxScore: 40, scoreObtained: 35, percentage: 87.5, status: "completed" },
    ],
    totalScore: 88,
    percentage: 88,
    grade: "A",
    gpa: 4.0,
    result: "Pass",
  },
  {
    id: "csc204-s2",
    name: "Computer Networks",
    code: "CSC204",
    semester: "2nd Semester",
    level: "200 Level",
    credits: 3,
    teacher: "Dr. Abdul Rahman",
    minMarks: 40,
    gradingComponents: [
      { id: "ca1", name: "Continuous Assessment", type: "continuous_assessment", weight: 30, maxScore: 30, scoreObtained: 18, percentage: 60, status: "completed" },
      { id: "lb1", name: "Lab Work", type: "lab_practical", weight: 10, maxScore: 10, scoreObtained: 6, percentage: 60, status: "completed" },
      { id: "mt1", name: "Mid-Semester Exam", type: "midterm", weight: 20, maxScore: 20, scoreObtained: 11, percentage: 55, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 40, maxScore: 40, scoreObtained: 14, percentage: 35, status: "completed" },
    ],
    totalScore: 37,
    percentage: 37,
    grade: "F",
    gpa: 0.0,
    result: "Fail",
  },
  {
    id: "eng201-s2",
    name: "Technical Writing",
    code: "ENG201",
    semester: "2nd Semester",
    level: "200 Level",
    credits: 2,
    teacher: "Dr. Amaka Nwosu",
    minMarks: 40,
    gradingComponents: [
      { id: "ca1", name: "Continuous Assessment", type: "continuous_assessment", weight: 30, maxScore: 30, scoreObtained: 22, percentage: 73.3, status: "completed" },
      { id: "lb1", name: "Assignments", type: "assignment", weight: 10, maxScore: 10, scoreObtained: 7, percentage: 70, status: "completed" },
      { id: "mt1", name: "Mid-Semester Exam", type: "midterm", weight: 20, maxScore: 20, scoreObtained: 13, percentage: 65, status: "completed" },
      { id: "ex1", name: "Final Examination", type: "final_exam", weight: 40, maxScore: 40, scoreObtained: undefined, percentage: undefined, status: "pending" },
    ],
    totalScore: 68,
    percentage: 68,
    grade: "C+",
    gpa: 2.5,
    result: "In Progress",
  },
];

export default function ExamResults({
  educationLevel: propEducationLevel,
  studentClass,
  allowConfiguration = false
}: ExamResultsProps) {
  const [selectedYear, setSelectedYear] = useState("2024 / 2025");
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]); // Track expanded subjects
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedSubjectForConfig, setSelectedSubjectForConfig] = useState<SubjectModule | null>(null);
  const [_configRefresh, setConfigRefresh] = useState(0); // Force refresh when config changes

  // Determine education level from props, student class, or school settings
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(() => {
    if (propEducationLevel) return propEducationLevel;
    if (studentClass) return getEducationLevelFromClass(studentClass);

    if (typeof window !== "undefined") {
      const settingsEducationLevel = localStorage.getItem("educationLevel");
      if (settingsEducationLevel === "tertiary") return "tertiary";
      if (settingsEducationLevel === "secondary") return "secondary";
      if (settingsEducationLevel === "primary") return "primary";
      if (settingsEducationLevel === "multi-level") return "secondary";
    }
    return "secondary";
  });

  // Listen for school profile changes
  useEffect(() => {
    const handleSchoolProfileChange = (event: WindowEventMap["schoolProfileChanged"]) => {
      // The event carries `educationLevels` — an ARRAY of every level the school supports. This handler used
      // to read a singular `educationLevel` that is never sent, so it was always undefined and none of the
      // branches below ever ran: the view simply did not respond to a profile change.
      const levels = event.detail.educationLevels ?? [];

      if (studentClass) {
        const detectedLevel = getEducationLevelFromClass(studentClass);
        setEducationLevel(detectedLevel);
      } else {
        // A school supporting several levels shows the secondary view, which is the widest of the three.
        const settingsEducationLevel = levels.length === 1 ? levels[0] : "multi-level";
        if (settingsEducationLevel === "tertiary") setEducationLevel("tertiary");
        else if (settingsEducationLevel === "secondary") setEducationLevel("secondary");
        else if (settingsEducationLevel === "primary") setEducationLevel("primary");
        else if (settingsEducationLevel === "multi-level") setEducationLevel("secondary");
      }
    };

    window.addEventListener("schoolProfileChanged", handleSchoolProfileChange);
    return () => window.removeEventListener("schoolProfileChanged", handleSchoolProfileChange);
  }, [studentClass]);

  // Listen for grading configuration updates
  useEffect(() => {
    const handleGradingConfigUpdate = () => {
      setConfigRefresh(prev => prev + 1);
    };

    window.addEventListener("gradingConfigUpdated", handleGradingConfigUpdate);
    return () => window.removeEventListener("gradingConfigUpdated", handleGradingConfigUpdate);
  }, []);

  // Function to open configuration modal for a subject
  const openConfigModal = (subject: SubjectModule, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row expansion
    setSelectedSubjectForConfig(subject);
    setConfigModalOpen(true);
  };

  // Function to close configuration modal
  const closeConfigModal = () => {
    setConfigModalOpen(false);
    setSelectedSubjectForConfig(null);
  };

  // Select appropriate data based on education level
  const subjectsData = educationLevel === "tertiary"
    ? TERTIARY_MODULES
    : educationLevel === "secondary"
    ? SECONDARY_SUBJECTS
    : PRIMARY_SUBJECTS;

  const isTertiary = educationLevel === "tertiary";

  const yearOptions = [
    { label: "Year : 2024 / 2025", value: "2024 / 2025" },
    { label: "Year : 2023 / 2024", value: "2023 / 2024" },
    { label: "Year : 2022 / 2023", value: "2022 / 2023" },
  ];

  const toggleSubject = (subjectId: string) => {
    const isCurrentlyExpanded = expandedSubjects.includes(subjectId);

    if (isCurrentlyExpanded) {
      // Start collapse animation
      setCollapsingSubjects(prev => new Set(prev).add(subjectId));

      // Wait for animation to complete before removing from expanded
      setTimeout(() => {
        setExpandedSubjects(prev => prev.filter(id => id !== subjectId));
        setCollapsingSubjects(prev => {
          const next = new Set(prev);
          next.delete(subjectId);
          return next;
        });
      }, 250); // Match the collapse animation duration
    } else {
      // Expand immediately
      setExpandedSubjects(prev => [...prev, subjectId]);
    }
  };

  // Helper function to get grade color
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 75) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Helper function to get progress bar color
  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Search, Sort, Filter, and Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<"code" | "name" | "teacher" | "score" | "result" | null>(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "Pass" | "Fail" | "In Progress">("all");
  const itemsPerPage = 5;

  // Animation states
  const [isSorting, setIsSorting] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSearching, setIsSearching] = useState(false);
  const [sortCounter, setSortCounter] = useState(0);
  const [collapsingSubjects, setCollapsingSubjects] = useState<Set<string>>(new Set());

  // Calculate status counts
  const statusCounts = {
    all: subjectsData.length,
    Pass: subjectsData.filter(s => s.result === "Pass").length,
    Fail: subjectsData.filter(s => s.result === "Fail").length,
    "In Progress": subjectsData.filter(s => s.result === "In Progress").length,
  };

  // Subject color mapping (matching Timetable colors)
  const getSubjectColor = (subjectName: string): string => {
    const colorMap: Record<string, string> = {
      // Secondary subjects
      "Mathematics": "from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700",
      "Maths": "from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700",
      "Spanish": "from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700",
      "Computer": "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
      "Computer Science": "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
      "Physics": "from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700",
      "English": "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      "English Language": "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      "Science": "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
      "Chemistry": "from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700",
      "History": "from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
      "Geography": "from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700",
      "Biology": "from-lime-500 to-lime-600 dark:from-lime-600 dark:to-lime-700",
      "Economics": "from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700",
      "Literature": "from-violet-500 to-violet-600 dark:from-violet-600 dark:to-violet-700",
      // Primary subjects
      "Basic Science": "from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700",
      "Social Studies": "from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700",
      "Creative Arts": "from-fuchsia-500 to-fuchsia-600 dark:from-fuchsia-600 dark:to-fuchsia-700",
      "Physical Education": "from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700",
      "Religious Studies": "from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700",
      "Civic Education": "from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700",
      "Handwriting": "from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700",
      "Reading": "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
      // Tertiary subjects
      "Advanced Programming": "from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700",
      "Data Structures": "from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700",
      "Database Systems": "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
      "Web Development": "from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
      "Software Engineering": "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      "Operating Systems": "from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700",
      "Computer Networks": "from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700",
      "Artificial Intelligence": "from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700",
      "Machine Learning": "from-violet-500 to-violet-600 dark:from-violet-600 dark:to-violet-700",
      "Cybersecurity": "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
    };

    return colorMap[subjectName] || "from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700";
  };

  // Filter subjects based on search query and status filter
  const filteredSubjects = subjectsData.filter((subject) => {
    // Status filter
    if (statusFilter !== "all" && subject.result !== statusFilter) {
      return false;
    }

    // Search filter
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      subject.name.toLowerCase().includes(query) ||
      subject.code.toLowerCase().includes(query) ||
      (subject.teacher && subject.teacher.toLowerCase().includes(query)) ||
      subject.result.toLowerCase().includes(query)
    );
  });

  // Sort subjects
  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortColumn) {
      case "code":
        aValue = a.code;
        bValue = b.code;
        break;
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;
      case "teacher":
        aValue = a.teacher || "";
        bValue = b.teacher || "";
        break;
      case "score":
        aValue = a.percentage;
        bValue = b.percentage;
        break;
      case "result":
        aValue = a.result;
        bValue = b.result;
        break;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortAscending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortAscending ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  // Pagination
  const totalPages = Math.ceil(sortedSubjects.length / itemsPerPage);
  const paginatedSubjects = sortedSubjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Apply staggered animation delays to rows for sorting
  useEffect(() => {
    if (!isSorting) return;

    setTimeout(() => {
      const allRows = document.querySelectorAll('tbody tr');
      const totalRows = allRows.length;

      allRows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        const delay = sortAscending
          ? ((totalRows - 1 - index) / 150)
          : (index / 150);
        htmlRow.style.setProperty('--delay', `${delay}s`);
      });
    }, 0);
  }, [isSorting, sortAscending, sortDirection]);

  // Reset sorting animation after it completes
  useEffect(() => {
    if (isSorting) {
      const timer = setTimeout(() => {
        setIsSorting(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isSorting]);

  // Handle column sort with animation
  const handleSort = (column: typeof sortColumn) => {
    if (sortedSubjects.length === 0) return;

    if (sortColumn === column) {
      const newSortAsc = !sortAscending;
      setSortAscending(newSortAsc);
      setSortDirection(newSortAsc ? 'asc' : 'desc');
    } else {
      setSortColumn(column);
      setSortAscending(true);
      setSortDirection('asc');
    }

    setSortCounter(prev => prev + 1);

    setTimeout(() => {
      setIsSorting(true);
    }, 50);
  };

  // Handle search with animation
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Handle filter change with animation
  const handleFilterChange = (filter: "all" | "Pass" | "Fail" | "In Progress") => {
    setStatusFilter(filter);
    setCurrentPage(1);
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Calculate overall statistics
  const totalSubjects = subjectsData.length;
  const averagePercentage = subjectsData.reduce((sum, s) => sum + s.percentage, 0) / totalSubjects;
  const passedSubjects = subjectsData.filter(s => s.result === "Pass").length;
  const failedSubjects = subjectsData.filter(s => s.result === "Fail").length;
  const averageGPA = isTertiary
    ? (subjectsData.reduce((sum, s) => sum + (s.gpa || 0), 0) / totalSubjects).toFixed(2)
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Statistics and Filter Card - Following App Theme */}
      <div className="space-y-4 mb-6">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Total Subjects Stat */}
          <div className="bg-blue-50/80 dark:bg-blue-950/30 midnight:bg-blue-950/30 purple:bg-blue-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-wide mb-0.5">
                Total {isTertiary ? "Modules" : "Subjects"}
              </p>
              <p className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100 truncate leading-none">
                {totalSubjects}
              </p>
            </div>
          </div>

          {/* Passed Stat */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/30 midnight:bg-emerald-950/30 purple:bg-emerald-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-0.5">
                Passed
              </p>
              <p className="text-base sm:text-lg font-bold text-emerald-900 dark:text-emerald-100 truncate leading-none">
                {passedSubjects}
              </p>
            </div>
          </div>

          {/* Failed Stat */}
          <div className="bg-red-50/80 dark:bg-red-950/30 midnight:bg-red-950/30 purple:bg-red-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="bg-red-100 dark:bg-red-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-3.5 h-3.5 text-red-700 dark:text-red-300" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-0.5">
                Failed
              </p>
              <p className="text-base sm:text-lg font-bold text-red-900 dark:text-red-100 truncate leading-none">
                {failedSubjects}
              </p>
            </div>
          </div>

          {/* Average Score Stat */}
          <div className="bg-indigo-50/80 dark:bg-indigo-950/30 midnight:bg-indigo-950/30 purple:bg-indigo-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-300" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-0.5">
                Average Score
              </p>
              <p className="text-base sm:text-lg font-bold text-indigo-900 dark:text-indigo-100 truncate leading-none">
                {averagePercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* GPA Stat (Tertiary Only) */}
          {isTertiary && (
            <div className="bg-purple-50/80 dark:bg-purple-950/30 midnight:bg-purple-950/30 purple:bg-pink-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between mb-1.5">
                <div className="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-pink-300" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400 uppercase tracking-wide mb-0.5">
                  GPA
                </p>
                <p className="text-base sm:text-lg font-bold text-purple-900 dark:text-purple-100 midnight:text-purple-100 purple:text-pink-100 truncate leading-none">
                  {averageGPA}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="bg-surface rounded-xl border border-line shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            {/* Year Selector */}
            <div className="w-full sm:w-auto">
              <CustomDropdown
                value={selectedYear}
                options={yearOptions}
                onChange={(value) => setSelectedYear(value as string)}
                variant="blue"
                className="w-full sm:w-48"
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* All Button */}
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[0.625rem] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  All
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[0.5625rem] font-bold ${
                    statusFilter === "all"
                      ? "bg-blue-500 dark:bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-[#2a2d35] text-gray-700 dark:text-gray-300"
                  }`}>
                    {statusCounts.all}
                  </span>
                </span>
              </button>

              {/* Pass Button */}
              <button
                onClick={() => handleFilterChange("Pass")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[0.625rem] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  statusFilter === "Pass"
                    ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${statusFilter === "Pass" ? "bg-emerald-200" : "bg-gray-400 dark:bg-gray-500"}`}></span>
                  Pass
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[0.5625rem] font-bold ${
                    statusFilter === "Pass"
                      ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                      : "bg-gray-200 dark:bg-[#2a2d35] text-gray-700 dark:text-gray-300"
                  }`}>
                    {statusCounts.Pass}
                  </span>
                </span>
              </button>

              {/* Failed Button */}
              <button
                onClick={() => handleFilterChange("Fail")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[0.625rem] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  statusFilter === "Fail"
                    ? "bg-red-600 dark:bg-red-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${statusFilter === "Fail" ? "bg-red-200" : "bg-gray-400 dark:bg-gray-500"}`}></span>
                  Failed
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[0.5625rem] font-bold ${
                    statusFilter === "Fail"
                      ? "bg-red-500 dark:bg-red-600 text-white"
                      : "bg-gray-200 dark:bg-[#2a2d35] text-gray-700 dark:text-gray-300"
                  }`}>
                    {statusCounts.Fail}
                  </span>
                </span>
              </button>

              {/* In Progress Button */}
              <button
                onClick={() => handleFilterChange("In Progress")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[0.625rem] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  statusFilter === "In Progress"
                    ? "bg-amber-600 dark:bg-amber-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${statusFilter === "In Progress" ? "bg-amber-200" : "bg-gray-400 dark:bg-gray-500"}`}></span>
                  In Progress
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[0.5625rem] font-bold ${
                    statusFilter === "In Progress"
                      ? "bg-amber-500 dark:bg-amber-600 text-white"
                      : "bg-gray-200 dark:bg-[#2a2d35] text-gray-700 dark:text-gray-300"
                  }`}>
                    {statusCounts["In Progress"]}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects/Modules Table */}
      <div className="bg-surface rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden shadow-xl">
        {/* Search Bar */}
        <div className="bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 flex flex-row items-center justify-between gap-2 sm:gap-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-t-xl md:rounded-t-2xl">
          <h2 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-300 purple:text-pink-300 tracking-tight whitespace-nowrap">
            {isTertiary ? "Modules" : "Subjects"} {searchQuery && `(${sortedSubjects.length})`}
          </h2>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={`Search ${isTertiary ? "modules" : "subjects"}...`}
            size="sm"
            className="w-full sm:w-72"
          />
        </div>

        <div className="overflow-x-auto smooth-scroll">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border-b border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30">
                <th
                  onClick={() => handleSort("code")}
                  className={`px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-left text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap cursor-pointer group/header select-none hover:bg-gray-100/50 dark:hover:bg-[#2a2d35]/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-300 ease-in-out ${
                    sortColumn === "code"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="relative hidden sm:inline">{isTertiary ? "Module Code" : "Subject"}</span>
                    <span className="relative sm:hidden">Code</span>
                    <span className={`icon-arrow inline-flex items-center justify-center w-4 h-4 rounded transition-all duration-300 ease-in-out ${
                      sortColumn === "code"
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 scale-110 opacity-100"
                        : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 opacity-0 group-hover/header:opacity-100 scale-100"
                    } ${sortColumn === "code" && !sortAscending ? "rotate-180" : "rotate-0"}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                      </svg>
                    </span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className={`px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-left text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap cursor-pointer group/header select-none hover:bg-gray-100/50 dark:hover:bg-[#2a2d35]/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-300 ease-in-out hidden sm:table-cell ${
                    sortColumn === "name"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="relative">{isTertiary ? "Module Name" : "Subject Name"}</span>
                    <span className={`icon-arrow inline-flex items-center justify-center w-4 h-4 rounded transition-all duration-300 ease-in-out ${
                      sortColumn === "name"
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 scale-110 opacity-100"
                        : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 opacity-0 group-hover/header:opacity-100 scale-100"
                    } ${sortColumn === "name" && !sortAscending ? "rotate-180" : "rotate-0"}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                      </svg>
                    </span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort("teacher")}
                  className={`px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-left text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap cursor-pointer group/header select-none hover:bg-gray-100/50 dark:hover:bg-[#2a2d35]/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-300 ease-in-out hidden md:table-cell ${
                    sortColumn === "teacher"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="relative">Teacher</span>
                    <span className={`icon-arrow inline-flex items-center justify-center w-4 h-4 rounded transition-all duration-300 ease-in-out ${
                      sortColumn === "teacher"
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 scale-110 opacity-100"
                        : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 opacity-0 group-hover/header:opacity-100 scale-100"
                    } ${sortColumn === "teacher" && !sortAscending ? "rotate-180" : "rotate-0"}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                      </svg>
                    </span>
                  </div>
                </th>
                {isTertiary && (
                  <th className="px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-center text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 hidden lg:table-cell">
                    Credits
                  </th>
                )}
                <th className="px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-center text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 hidden sm:table-cell">
                  Progress
                </th>
                <th
                  onClick={() => handleSort("score")}
                  className={`px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-center text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap cursor-pointer group/header select-none hover:bg-gray-100/50 dark:hover:bg-[#2a2d35]/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-300 ease-in-out ${
                    sortColumn === "score"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="relative">Score</span>
                    <span className={`icon-arrow inline-flex items-center justify-center w-4 h-4 rounded transition-all duration-300 ease-in-out ${
                      sortColumn === "score"
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 scale-110 opacity-100"
                        : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 opacity-0 group-hover/header:opacity-100 scale-100"
                    } ${sortColumn === "score" && !sortAscending ? "rotate-180" : "rotate-0"}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                      </svg>
                    </span>
                  </div>
                </th>
                {isTertiary && (
                  <th className="px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-center text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 hidden lg:table-cell">
                    Grade
                  </th>
                )}
                <th
                  onClick={() => handleSort("result")}
                  className={`px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-center text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap cursor-pointer group/header select-none hover:bg-gray-100/50 dark:hover:bg-[#2a2d35]/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-300 ease-in-out ${
                    sortColumn === "result"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="relative">Result</span>
                    <span className={`icon-arrow inline-flex items-center justify-center w-4 h-4 rounded transition-all duration-300 ease-in-out ${
                      sortColumn === "result"
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 scale-110 opacity-100"
                        : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 opacity-0 group-hover/header:opacity-100 scale-100"
                    } ${sortColumn === "result" && !sortAscending ? "rotate-180" : "rotate-0"}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                      </svg>
                    </span>
                  </div>
                </th>
                <th className="px-2 sm:px-2 md:px-2 lg:px-3 py-2.5 sm:py-2 md:py-2.5 text-center text-[0.625rem] font-extrabold uppercase tracking-wide whitespace-nowrap text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">

                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubjects.length === 0 ? (
                <tr>
                  <td colSpan={isTertiary ? 9 : 7} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-base font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        {searchQuery ? `No results found for "${searchQuery}"` : "No subjects found"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSubjects.map((subject, index) => {
                const isExpanded = expandedSubjects.includes(subject.id);
                const isCollapsing = collapsingSubjects.has(subject.id);
                const completedComponents = subject.gradingComponents.filter(c => c.status === "completed").length;
                const totalComponents = subject.gradingComponents.length;
                const progressPercentage = (completedComponents / totalComponents) * 100;

                const animationClass = isSorting ? (sortDirection === 'asc' ? 'sorting-animate-asc' : 'sorting-animate-desc') : '';

                return (
                  <React.Fragment key={`${subject.id}-${sortCounter}-${searchQuery}`}>
                    {/* Table Row - Clickable */}
                    <tr
                      onClick={() => toggleSubject(subject.id)}
                      style={{
                        animation: isSearching ? `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index / 80}s both` : undefined,
                      } as React.CSSProperties}
                      className={`border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 ${!isSorting ? 'transition-all duration-200' : ''} ${animationClass} cursor-pointer`}
                    >
                      {/* Subject Code */}
                      <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-left align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${getSubjectColor(subject.name)} text-white font-bold text-[0.75rem] flex-shrink-0 shadow-md`}>
                            {subject.code.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-[0.75rem] font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 truncate">
                            {subject.code}
                          </span>
                        </div>
                      </td>

                      {/* Subject Name */}
                      <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-left align-middle hidden sm:table-cell">
                        <div className="text-[0.75rem] font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 truncate">
                          {subject.name}
                        </div>
                        <div className="text-[0.75rem] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 mt-0.5 truncate">
                          {isTertiary ? `${subject.semester} • ${subject.level}` : subject.term}
                        </div>
                      </td>

                      {/* Teacher */}
                      <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-left align-middle hidden md:table-cell">
                        <span className="text-[0.75rem] font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 truncate block">
                          {subject.teacher || "—"}
                        </span>
                      </td>

                      {/* Credits (Tertiary Only) */}
                      {isTertiary && (
                        <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-center align-middle hidden lg:table-cell">
                          <span className="text-[0.75rem] font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                            {subject.credits}
                          </span>
                        </td>
                      )}

                      {/* Progress */}
                      <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-center align-middle hidden sm:table-cell">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-full max-w-[80px] h-1.5 bg-gray-200 dark:bg-[#22262e] rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressBarColor(progressPercentage)} transition-all duration-500`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-[0.75rem] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {completedComponents}/{totalComponents}
                          </span>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-center align-middle">
                        <div className={`text-[0.75rem] font-bold ${getGradeColor(subject.percentage)}`}>
                          {subject.percentage.toFixed(1)}%
                        </div>
                        <div className="text-[0.75rem] text-gray-500 dark:text-gray-400">
                          {subject.totalScore}/100
                        </div>
                      </td>

                      {/* Grade (Tertiary Only) */}
                      {isTertiary && (
                        <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-center align-middle hidden lg:table-cell">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.75rem] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {subject.grade}
                          </span>
                          <div className="text-[0.75rem] text-gray-600 dark:text-gray-400 mt-0.5">
                            {subject.gpa?.toFixed(2)} GPA
                          </div>
                        </td>
                      )}

                      {/* Result */}
                      <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-center align-middle">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.75rem] font-bold ${
                          subject.result === "Pass"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : subject.result === "Fail"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            subject.result === "Pass" ? "bg-green-500" : subject.result === "Fail" ? "bg-red-500" : "bg-yellow-500"
                          }`} />
                          {subject.result}
                        </span>
                      </td>

                      {/* Expand Icon / Settings Button */}
                      <td className="px-2 sm:px-2 md:px-2 lg:px-3 py-3 sm:py-2 md:py-2.5 text-center align-middle">
                        <div className="flex items-center justify-center gap-1">
                          {allowConfiguration && (
                            <button
                              onClick={(e) => openConfigModal(subject, e)}
                              className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                              title="Configure grading system"
                            >
                              <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                          )}
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                            style={{
                              transitionDuration: isCollapsing ? '250ms' : '350ms',
                              transitionTimingFunction: isCollapsing ? 'cubic-bezier(0.4, 0, 0.6, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Grading Breakdown Row */}
                    {(isExpanded || isCollapsing) && (
                      <tr className={`bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 midnight:from-gray-800/50 midnight:to-gray-800/30 purple:from-gray-800/50 purple:to-gray-800/30 ${isCollapsing ? 'animate-collapseRow' : 'animate-expandRow'}`}>
                        <td colSpan={isTertiary ? 9 : 7} className="px-3 sm:px-4 py-0 overflow-hidden">
                          <div className={`space-y-3 py-3 sm:py-4 ${isCollapsing ? 'animate-fadeSlideUp' : 'animate-fadeSlideDown'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <h4 className="text-[0.75rem] font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200">
                                Assessment
                              </h4>
                            </div>

                            {/* Components Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {subject.gradingComponents.map((component) => (
                                <div
                                  key={component.id}
                                  className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-lg p-3 border border-line shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <h5 className="text-[0.75rem] font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
                                          {component.name}
                                        </h5>
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[0.75rem] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                          {component.weight}%
                                        </span>
                                      </div>
                                      {component.status === "completed" ? (
                                        <p className="text-[0.75rem] text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                                          Score: {component.scoreObtained}/{component.maxScore} • {component.percentage?.toFixed(1)}%
                                        </p>
                                      ) : (
                                        <p className="text-[0.75rem] text-yellow-600 dark:text-yellow-400">
                                          {component.status === "pending" ? "Not yet graded" : "In progress"}
                                          {component.dueDate && ` • Due: ${component.dueDate}`}
                                        </p>
                                      )}
                                      {component.feedback && (
                                        <p className="text-[0.75rem] text-gray-500 dark:text-gray-400 mt-1 italic">
                                          &quot;{component.feedback}&quot;
                                        </p>
                                      )}
                                    </div>
                                    {component.status === "completed" && component.percentage !== undefined && (
                                      <div className={`text-[0.75rem] font-bold ${getGradeColor(component.percentage)}`}>
                                        {component.percentage.toFixed(1)}%
                                      </div>
                                    )}
                                  </div>

                                  {/* Component Progress Bar */}
                                  {component.status === "completed" && component.percentage !== undefined && (
                                    <div className="w-full h-1.5 bg-gray-200 dark:bg-[#22262e] rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${getProgressBarColor(component.percentage)} transition-all duration-500`}
                                        style={{ width: `${component.percentage}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Summary */}
                            <div className="mt-3 p-3 bg-gray-100 dark:bg-[#22262e] rounded-lg">
                              <div className="flex items-center justify-between text-[0.75rem]">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Final Score:</span>
                                <span className={`text-[0.75rem] font-bold ${getGradeColor(subject.percentage)}`}>
                                  {subject.totalScore}/100 ({subject.percentage.toFixed(1)}%)
                                </span>
                              </div>
                              {isTertiary && subject.gpa && (
                                <div className="flex items-center justify-between text-[0.75rem] mt-1.5">
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">GPA:</span>
                                  <span className="text-[0.75rem] font-bold text-blue-600 dark:text-blue-400">
                                    {subject.gpa.toFixed(2)}/5.00
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 midnight:from-gray-900 midnight:via-gray-850 midnight:to-gray-900 purple:from-gray-900 purple:via-gray-850 purple:to-gray-900 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Showing info */}
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-medium">
                Showing <span className="font-bold text-gray-900 dark:text-gray-100">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100">{Math.min(currentPage * itemsPerPage, sortedSubjects.length)}</span> of{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100">{sortedSubjects.length}</span> {searchQuery || statusFilter !== "all" ? "filtered" : "total"} entries
              </div>

              {/* Page buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-[#22262e]"
                      : "hover:bg-blue-100 dark:hover:bg-blue-500/20 cursor-pointer hover:scale-110 shadow-sm"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#22262e] hover:scale-105 shadow-sm"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-[#22262e]"
                      : "hover:bg-blue-100 dark:hover:bg-blue-500/20 cursor-pointer hover:scale-110 shadow-sm"
                  }`}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grading Configuration Modal */}
      {configModalOpen && selectedSubjectForConfig && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <div>
                <h3 className="text-xl font-bold text-ink">
                  Configure Grading System
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 mt-1">
                  {selectedSubjectForConfig.name} ({selectedSubjectForConfig.code})
                </p>
              </div>
              <button
                onClick={closeConfigModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
              <div className="pb-64">
                <GradingSystemConfig
                  subjectId={selectedSubjectForConfig.id}
                  subjectCode={selectedSubjectForConfig.code}
                  subjectName={selectedSubjectForConfig.name}
                  educationLevel={educationLevel}
                  onSave={() => {
                    closeConfigModal();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
