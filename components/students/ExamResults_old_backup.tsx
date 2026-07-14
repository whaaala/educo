"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import {
  determineEducationLevel,
  getEducationLevelFromClass,
  getProgramType,
  getProgramTypeLabel,
  type ProgramType
} from "@/lib/educationLevelUtils";

type EducationLevel = "primary" | "secondary" | "tertiary";
type SchoolType = "private" | "public" | "tertiary";

interface Subject {
  name: string;
  code: string;
  maxMarks: number;
  minMarks: number;
  marksObtained: number;
  grade?: string; // For tertiary: A, B+, C, etc.
  gpa?: number; // For tertiary: GPA points
  credits?: number; // For tertiary: credit hours
  result: "Pass" | "Fail";
}

interface Exam {
  id: string;
  name: string;
  rank?: number; // Optional for tertiary (not used in universities)
  total: number;
  marksObtained?: number; // Optional for tertiary (uses GPA instead)
  percentage?: number; // Optional for tertiary
  result: "Pass" | "Fail";
  subjects: Subject[];
  // Tertiary-specific fields
  cgpa?: number; // Cumulative GPA for universities
  semester?: string; // e.g., "Semester 1", "Semester 2"
  level?: string; // e.g., "100 Level", "200 Level"
}

interface ExamResultsProps {
  educationLevel?: EducationLevel;
  studentClass?: string; // Student's class/grade to auto-determine education level
}

// Mock data for PRIMARY SCHOOL
const PRIMARY_EXAMS: Exam[] = [
  {
    id: "1",
    name: "Monthly Test (May)",
    rank: 30,
    total: 500,
    marksObtained: 395,
    percentage: 79.00,
    result: "Pass",
    subjects: [
      { name: "English Language", code: "ENG", maxMarks: 100, minMarks: 40, marksObtained: 75, result: "Pass" },
      { name: "Mathematics", code: "MTH", maxMarks: 100, minMarks: 40, marksObtained: 82, result: "Pass" },
      { name: "Basic Science", code: "BSC", maxMarks: 100, minMarks: 40, marksObtained: 68, result: "Pass" },
      { name: "Social Studies", code: "SST", maxMarks: 100, minMarks: 40, marksObtained: 90, result: "Pass" },
      { name: "Creative Arts", code: "CRT", maxMarks: 100, minMarks: 40, marksObtained: 80, result: "Pass" },
    ],
  },
  {
    id: "2",
    name: "Mid-Term Test (Mar)",
    rank: 28,
    total: 500,
    marksObtained: 405,
    percentage: 81.00,
    result: "Pass",
    subjects: [
      { name: "English Language", code: "ENG", maxMarks: 100, minMarks: 40, marksObtained: 78, result: "Pass" },
      { name: "Mathematics", code: "MTH", maxMarks: 100, minMarks: 40, marksObtained: 85, result: "Pass" },
      { name: "Basic Science", code: "BSC", maxMarks: 100, minMarks: 40, marksObtained: 72, result: "Pass" },
      { name: "Social Studies", code: "SST", maxMarks: 100, minMarks: 40, marksObtained: 88, result: "Pass" },
      { name: "Creative Arts", code: "CRT", maxMarks: 100, minMarks: 40, marksObtained: 82, result: "Pass" },
    ],
  },
  {
    id: "3",
    name: "First Term Examination (Dec)",
    rank: 25,
    total: 500,
    marksObtained: 420,
    percentage: 84.00,
    result: "Pass",
    subjects: [
      { name: "English Language", code: "ENG", maxMarks: 100, minMarks: 40, marksObtained: 82, result: "Pass" },
      { name: "Mathematics", code: "MTH", maxMarks: 100, minMarks: 40, marksObtained: 88, result: "Pass" },
      { name: "Basic Science", code: "BSC", maxMarks: 100, minMarks: 40, marksObtained: 76, result: "Pass" },
      { name: "Social Studies", code: "SST", maxMarks: 100, minMarks: 40, marksObtained: 92, result: "Pass" },
      { name: "Creative Arts", code: "CRT", maxMarks: 100, minMarks: 40, marksObtained: 82, result: "Pass" },
    ],
  },
];

// Mock data for SECONDARY SCHOOL
const SECONDARY_EXAMS: Exam[] = [
  {
    id: "1",
    name: "Third Term Examination (June)",
    rank: 15,
    total: 700,
    marksObtained: 558,
    percentage: 79.71,
    result: "Pass",
    subjects: [
      { name: "English Language", code: "ENG101", maxMarks: 100, minMarks: 40, marksObtained: 78, result: "Pass" },
      { name: "Mathematics", code: "MTH102", maxMarks: 100, minMarks: 40, marksObtained: 85, result: "Pass" },
      { name: "Physics", code: "PHY103", maxMarks: 100, minMarks: 40, marksObtained: 72, result: "Pass" },
      { name: "Chemistry", code: "CHM104", maxMarks: 100, minMarks: 40, marksObtained: 88, result: "Pass" },
      { name: "Biology", code: "BIO105", maxMarks: 100, minMarks: 40, marksObtained: 80, result: "Pass" },
      { name: "Geography", code: "GEO106", maxMarks: 100, minMarks: 40, marksObtained: 75, result: "Pass" },
      { name: "Computer Science", code: "CSC107", maxMarks: 100, minMarks: 40, marksObtained: 80, result: "Pass" },
    ],
  },
  {
    id: "2",
    name: "Second Term Examination (Mar)",
    rank: 18,
    total: 700,
    marksObtained: 540,
    percentage: 77.14,
    result: "Pass",
    subjects: [
      { name: "English Language", code: "ENG101", maxMarks: 100, minMarks: 40, marksObtained: 75, result: "Pass" },
      { name: "Mathematics", code: "MTH102", maxMarks: 100, minMarks: 40, marksObtained: 82, result: "Pass" },
      { name: "Physics", code: "PHY103", maxMarks: 100, minMarks: 40, marksObtained: 68, result: "Pass" },
      { name: "Chemistry", code: "CHM104", maxMarks: 100, minMarks: 40, marksObtained: 85, result: "Pass" },
      { name: "Biology", code: "BIO105", maxMarks: 100, minMarks: 40, marksObtained: 78, result: "Pass" },
      { name: "Geography", code: "GEO106", maxMarks: 100, minMarks: 40, marksObtained: 72, result: "Pass" },
      { name: "Computer Science", code: "CSC107", maxMarks: 100, minMarks: 40, marksObtained: 80, result: "Pass" },
    ],
  },
  {
    id: "3",
    name: "First Term Examination (Dec)",
    rank: 12,
    total: 700,
    marksObtained: 575,
    percentage: 82.14,
    result: "Pass",
    subjects: [
      { name: "English Language", code: "ENG101", maxMarks: 100, minMarks: 40, marksObtained: 82, result: "Pass" },
      { name: "Mathematics", code: "MTH102", maxMarks: 100, minMarks: 40, marksObtained: 88, result: "Pass" },
      { name: "Physics", code: "PHY103", maxMarks: 100, minMarks: 40, marksObtained: 78, result: "Pass" },
      { name: "Chemistry", code: "CHM104", maxMarks: 100, minMarks: 40, marksObtained: 90, result: "Pass" },
      { name: "Biology", code: "BIO105", maxMarks: 100, minMarks: 40, marksObtained: 85, result: "Pass" },
      { name: "Geography", code: "GEO106", maxMarks: 100, minMarks: 40, marksObtained: 75, result: "Pass" },
      { name: "Computer Science", code: "CSC107", maxMarks: 100, minMarks: 40, marksObtained: 77, result: "Pass" },
    ],
  },
];

// Mock data for TERTIARY/UNIVERSITY
const TERTIARY_EXAMS: Exam[] = [
  {
    id: "1",
    name: "Second Semester 2024/2025",
    semester: "2nd Semester",
    level: "200 Level",
    total: 24, // Total credits
    cgpa: 3.65,
    result: "Pass",
    subjects: [
      { name: "Software Engineering", code: "CSC201", maxMarks: 100, minMarks: 40, marksObtained: 82, grade: "A", gpa: 4.0, credits: 4, result: "Pass" },
      { name: "Data Structures & Algorithms", code: "CSC202", maxMarks: 100, minMarks: 40, marksObtained: 78, grade: "B+", gpa: 3.5, credits: 4, result: "Pass" },
      { name: "Database Management Systems", code: "CSC203", maxMarks: 100, minMarks: 40, marksObtained: 85, grade: "A", gpa: 4.0, credits: 3, result: "Pass" },
      { name: "Computer Networks", code: "CSC204", maxMarks: 100, minMarks: 40, marksObtained: 75, grade: "B", gpa: 3.0, credits: 3, result: "Pass" },
      { name: "Operating Systems", code: "CSC205", maxMarks: 100, minMarks: 40, marksObtained: 88, grade: "A", gpa: 4.0, credits: 4, result: "Pass" },
      { name: "Discrete Mathematics", code: "MTH201", maxMarks: 100, minMarks: 40, marksObtained: 72, grade: "B", gpa: 3.0, credits: 3, result: "Pass" },
      { name: "Technical Writing", code: "ENG201", maxMarks: 100, minMarks: 40, marksObtained: 80, grade: "A-", gpa: 3.7, credits: 3, result: "Pass" },
    ],
  },
  {
    id: "2",
    name: "First Semester 2024/2025",
    semester: "1st Semester",
    level: "200 Level",
    total: 21, // Total credits
    cgpa: 3.52,
    result: "Pass",
    subjects: [
      { name: "Object-Oriented Programming", code: "CSC211", maxMarks: 100, minMarks: 40, marksObtained: 80, grade: "A-", gpa: 3.7, credits: 4, result: "Pass" },
      { name: "Web Development", code: "CSC212", maxMarks: 100, minMarks: 40, marksObtained: 85, grade: "A", gpa: 4.0, credits: 3, result: "Pass" },
      { name: "Computer Architecture", code: "CSC213", maxMarks: 100, minMarks: 40, marksObtained: 70, grade: "B-", gpa: 2.7, credits: 3, result: "Pass" },
      { name: "Linear Algebra", code: "MTH211", maxMarks: 100, minMarks: 40, marksObtained: 75, grade: "B", gpa: 3.0, credits: 3, result: "Pass" },
      { name: "Digital Logic Design", code: "CSC214", maxMarks: 100, minMarks: 40, marksObtained: 78, grade: "B+", gpa: 3.5, credits: 4, result: "Pass" },
      { name: "Probability & Statistics", code: "STA211", maxMarks: 100, minMarks: 40, marksObtained: 82, grade: "A", gpa: 4.0, credits: 4, result: "Pass" },
    ],
  },
  {
    id: "3",
    name: "Second Semester 2023/2024",
    semester: "2nd Semester",
    level: "100 Level",
    total: 22, // Total credits
    cgpa: 3.45,
    result: "Pass",
    subjects: [
      { name: "Introduction to Programming", code: "CSC101", maxMarks: 100, minMarks: 40, marksObtained: 88, grade: "A", gpa: 4.0, credits: 4, result: "Pass" },
      { name: "Computer Fundamentals", code: "CSC102", maxMarks: 100, minMarks: 40, marksObtained: 75, grade: "B", gpa: 3.0, credits: 3, result: "Pass" },
      { name: "Calculus I", code: "MTH101", maxMarks: 100, minMarks: 40, marksObtained: 68, grade: "C+", gpa: 2.5, credits: 4, result: "Pass" },
      { name: "Physics I", code: "PHY101", maxMarks: 100, minMarks: 40, marksObtained: 72, grade: "B", gpa: 3.0, credits: 3, result: "Pass" },
      { name: "Use of English", code: "ENG101", maxMarks: 100, minMarks: 40, marksObtained: 85, grade: "A", gpa: 4.0, credits: 2, result: "Pass" },
      { name: "Chemistry I", code: "CHM101", maxMarks: 100, minMarks: 40, marksObtained: 70, grade: "B-", gpa: 2.7, credits: 3, result: "Pass" },
      { name: "Nigerian Peoples & Culture", code: "GST101", maxMarks: 100, minMarks: 40, marksObtained: 80, grade: "A-", gpa: 3.7, credits: 3, result: "Pass" },
    ],
  },
];

export default function ExamResults({
  educationLevel: propEducationLevel,
  studentClass
}: ExamResultsProps) {
  const [selectedYear, setSelectedYear] = useState("2024 / 2025");
  const [expandedExams, setExpandedExams] = useState<string[]>(["1"]); // First exam expanded by default

  // Determine education level from props, student class, or school settings
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(() => {
    // 1. If explicitly provided via props, use that
    if (propEducationLevel) return propEducationLevel;

    // 2. If student class is provided, determine from class
    if (studentClass) {
      return getEducationLevelFromClass(studentClass);
    }

    // 3. Otherwise, determine from school settings in localStorage
    return determineEducationLevel();
  });

  // Determine program type (regular, evening, weekend)
  const programType: ProgramType = studentClass ? getProgramType(studentClass) : "regular";
  const isEveningWeekend = programType !== "regular";

  // Listen for school type changes from settings
  useEffect(() => {
    const handleSchoolTypeChange = (event: CustomEvent<{ schoolType: SchoolType }>) => {
      const { schoolType } = event.detail;

      // Re-determine education level based on new school type
      if (studentClass) {
        // If we have student class, use that with the new school type
        setEducationLevel(getEducationLevelFromClass(studentClass, schoolType));
      } else if (schoolType === "tertiary") {
        setEducationLevel("tertiary");
      } else {
        // For private/public without class info, default to secondary
        setEducationLevel("secondary");
      }
    };

    window.addEventListener("schoolTypeChanged" as any, handleSchoolTypeChange);

    return () => {
      window.removeEventListener("schoolTypeChanged" as any, handleSchoolTypeChange);
    };
  }, [studentClass]);

  // Select the appropriate exam data based on education level
  const examData = educationLevel === "tertiary"
    ? TERTIARY_EXAMS
    : educationLevel === "secondary"
    ? SECONDARY_EXAMS
    : PRIMARY_EXAMS;

  const isTertiary = educationLevel === "tertiary";

  const yearOptions = [
    { label: "Year : 2024 / 2025", value: "2024 / 2025" },
    { label: "Year : 2023 / 2024", value: "2023 / 2024" },
    { label: "Year : 2022 / 2023", value: "2022 / 2023" },
  ];

  const toggleExam = (examId: string) => {
    setExpandedExams(prev =>
      prev.includes(examId)
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with Year Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Exams & Results
          </h2>
          {isEveningWeekend && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 midnight:bg-purple-900/30 midnight:text-purple-300 purple:bg-pink-900/30 purple:text-pink-300">
              {getProgramTypeLabel(programType)}
            </span>
          )}
        </div>
        <CustomDropdown
          value={selectedYear}
          options={yearOptions}
          onChange={(value) => setSelectedYear(value as string)}
          variant="blue"
          className="w-48"
        />
      </div>

      {/* Exams List */}
      <div className="space-y-3">
        {examData.map((exam) => {
          const isExpanded = expandedExams.includes(exam.id);

          return (
            <div
              key={exam.id}
              className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Exam Header - Clickable */}
              <button
                onClick={() => toggleExam(exam.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 hover:bg-gray-100 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 block">
                      {exam.name}
                    </span>
                    {isTertiary && exam.level && (
                      <span className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                        {exam.level} • {exam.semester}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {/* Exam Details - Expanded Content */}
              {isExpanded && (
                <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Subjects Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-[#22262e]/30 midnight:bg-gray-700/30 purple:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                            {isTertiary ? "Course" : "Subject"}
                          </th>
                          {isTertiary && (
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                              Credits
                            </th>
                          )}
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                            Max Marks
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                            Min Marks
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                            Marks Obtained
                          </th>
                          {isTertiary && (
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                              Grade
                            </th>
                          )}
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                            Result
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
                        {exam.subjects.map((subject, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#22262e]/20 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
                              {subject.name} ({subject.code})
                            </td>
                            {isTertiary && (
                              <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                                {subject.credits}
                              </td>
                            )}
                            <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                              {subject.maxMarks}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                              {subject.minMarks}
                            </td>
                            <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
                              {subject.marksObtained}
                            </td>
                            {isTertiary && (
                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                  {subject.grade}
                                </span>
                              </td>
                            )}
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                subject.result === "Pass"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${subject.result === "Pass" ? "bg-green-500" : "bg-red-500"}`} />
                                {subject.result}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-900 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-lg text-white">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      {!isTertiary && exam.rank !== undefined && (
                        <div className="text-sm">
                          <span className="font-medium">Rank : </span>
                          <span className="font-bold">{exam.rank}</span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">{isTertiary ? "Total Credits" : "Total"} : </span>
                        <span className="font-bold">{exam.total}</span>
                      </div>
                      {!isTertiary && exam.marksObtained !== undefined && (
                        <div className="text-sm">
                          <span className="font-medium">Marks Obtained : </span>
                          <span className="font-bold">{exam.marksObtained}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      {isTertiary && exam.cgpa !== undefined ? (
                        <div className="text-sm">
                          <span className="font-medium">CGPA : </span>
                          <span className="font-bold text-blue-400">{exam.cgpa.toFixed(2)}</span>
                        </div>
                      ) : exam.percentage !== undefined ? (
                        <div className="text-sm">
                          <span className="font-medium">Percentage : </span>
                          <span className="font-bold">{exam.percentage.toFixed(2)}%</span>
                        </div>
                      ) : null}
                      <div className="text-sm">
                        <span className="font-medium">Result : </span>
                        <span className={`font-bold ${exam.result === "Pass" ? "text-green-400" : "text-red-400"}`}>
                          {exam.result}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
