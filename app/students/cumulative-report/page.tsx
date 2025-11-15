"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Printer,
  ArrowLeft,
  TrendingUp,
  Award,
  Calendar,
  BookOpen,
  GraduationCap,
  BarChart3,
  Users,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/shared/Button";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import FormDropdown from "@/components/shared/FormDropdown";
import { Student } from "@/components/students/StudentCard";
import StudentSelectionGrid from "@/components/students/StudentSelectionGrid";
import { useStudentsByTenant } from "@/hooks/useStudentsByTenant";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type EducationLevel = "Primary" | "Secondary" | "Tertiary";
type Term = "First Term" | "Second Term" | "Third Term" | "First Semester" | "Second Semester";

interface SubjectGrade {
  subject: string;
  score: number;
  grade: string;
  remarks: string;
  maxScore: number;
}

interface TermReport {
  term: Term;
  academicYear: string;
  class: string;
  subjects: SubjectGrade[];
  totalMarks: number;
  percentage: number;
  overallGrade: string;
  rank: number;
  totalStudents: number;
  attendance: {
    present: number;
    absent: number;
    total: number;
  };
  teacherRemarks: string;
  principalRemarks: string;
}

interface CumulativeReportData {
  student: Student;
  educationLevel: EducationLevel;
  termReports: TermReport[];
  cumulativeStats: {
    averagePercentage: number;
    overallGrade: string;
    totalTermsCompleted: number;
    bestTerm: {
      term: Term;
      year: string;
      percentage: number;
    };
    subjectAverages: {
      subject: string;
      average: number;
      grade: string;
    }[];
    // For Tertiary
    cgpa?: number;
    semesterGPAs?: { semester: string; gpa: number }[];
  };
  progressionTimeline: {
    year: string;
    class: string;
    averagePercentage: number;
  }[];
}

// Class options by education level
const PRIMARY_CLASSES = ["I", "II", "III", "IV", "V", "VI"];
const SECONDARY_CLASSES = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
const TERTIARY_CLASSES = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];

const PRIMARY_TERMS: Term[] = ["First Term", "Second Term", "Third Term"];
const TERTIARY_TERMS: Term[] = ["First Semester", "Second Semester"];

// Helper function to get classes based on education level
const getClassesByLevel = (level: EducationLevel): string[] => {
  switch (level) {
    case "Primary":
      return PRIMARY_CLASSES;
    case "Secondary":
      return SECONDARY_CLASSES;
    case "Tertiary":
      return TERTIARY_CLASSES;
    default:
      return SECONDARY_CLASSES;
  }
};

// Helper function to get terms based on education level
const getTermsByLevel = (level: EducationLevel): Term[] => {
  return level === "Tertiary" ? TERTIARY_TERMS : PRIMARY_TERMS;
};

// Generate academic years (current year - 5 to current year + 1)
const currentYear = new Date().getFullYear();
const ACADEMIC_YEARS = Array.from({ length: 7 }, (_, i) => (currentYear - 5 + i).toString());

// Generate mock subjects based on education level
const generateMockSubjects = (educationLevel: EducationLevel, classLevel: string): SubjectGrade[] => {
  if (educationLevel === "Primary") {
    return [
      { subject: "English", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Mathematics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Science", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Social Studies", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Creative Arts", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Physical Education", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
    ];
  } else if (educationLevel === "Secondary") {
    const isJSS = classLevel.startsWith("JSS");
    return [
      { subject: "English Language", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Mathematics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Biology", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Chemistry", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Physics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: isJSS ? "Basic Technology" : "Computer Science", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Civic Education", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: isJSS ? "Home Economics" : "Economics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
    ];
  } else {
    // Tertiary
    return [
      { subject: "Advanced Mathematics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Research Methodology", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Professional Ethics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Core Subject 1", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Core Subject 2", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Elective 1", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
    ];
  }
};

// Calculate grade from percentage
const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

// Calculate GPA from percentage (for Tertiary)
const calculateGPA = (percentage: number): number => {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.5;
  if (percentage >= 70) return 3.0;
  if (percentage >= 60) return 2.5;
  if (percentage >= 50) return 2.0;
  if (percentage >= 40) return 1.5;
  return 0.0;
};

export default function CumulativeReportPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const isPageLoading = usePageLoad(600);
  const [currentStep, setCurrentStep] = useState<"config" | "preview">("config");

  const tenantStudents = useStudentsByTenant();
  const { settings } = useSchoolSettings();
  const [students, setStudents] = useState<Student[]>([]);

  const [config, setConfig] = useState({
    educationLevel: settings.defaultEducationLevel,
    class: "",
    section: "",
  });

  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [cumulativeReport, setCumulativeReport] = useState<CumulativeReportData | null>(null);

  useEffect(() => {
    setStudents(tenantStudents);
  }, [tenantStudents]);

  // Filter students based on config
  const filteredStudents = students.filter((student) => {
    // Parse student class format: "JSS 1, A" -> class: "JSS 1", section: "A"
    const [studentClass, studentSection] = student.class.split(", ").map((s) => s.trim());

    // Filter by class: check if class matches (or no class filter set)
    const classMatch = !config.class || studentClass === config.class;

    // Filter by section: check if section matches (or no section filter set)
    const sectionMatch = !config.section || studentSection === config.section;

    return classMatch && sectionMatch;
  });

  // Generate cumulative report for a student
  const generateCumulativeReport = () => {
    const student = students.find((s) => s.id === selectedStudent);
    if (!student) return;

    // Parse student class to determine education level
    const [studentClass] = student.class.split(", ");
    let educationLevel: EducationLevel = "Secondary";
    if (PRIMARY_CLASSES.includes(studentClass)) {
      educationLevel = "Primary";
    } else if (TERTIARY_CLASSES.includes(studentClass)) {
      educationLevel = "Tertiary";
    }

    // Generate term reports for the student's academic journey
    // For demonstration, we'll generate reports for the past 2 years
    const termReports: TermReport[] = [];
    const terms = getTermsByLevel(educationLevel);
    const classes = getClassesByLevel(educationLevel);

    // Find student's current class index
    const currentClassIndex = classes.indexOf(studentClass);

    // Generate reports for current class and previous class (if exists)
    const yearsToGenerate = 2;
    for (let yearOffset = yearsToGenerate - 1; yearOffset >= 0; yearOffset--) {
      const academicYear = (currentYear - yearOffset).toString();
      const classIndex = currentClassIndex - yearOffset;

      if (classIndex >= 0 && classIndex < classes.length) {
        const classLevel = classes[classIndex];

        terms.forEach((term) => {
          const subjects = generateMockSubjects(educationLevel, classLevel);

          // Calculate grades for each subject
          const gradedSubjects = subjects.map((subject) => {
            const percentage = (subject.score / subject.maxScore) * 100;
            return {
              ...subject,
              grade: calculateGrade(percentage),
              remarks: percentage >= 70 ? "Excellent" : percentage >= 50 ? "Good" : "Needs Improvement",
            };
          });

          const totalMarks = gradedSubjects.reduce((sum, s) => sum + s.score, 0);
          const maxMarks = gradedSubjects.reduce((sum, s) => sum + s.maxScore, 0);
          const percentage = (totalMarks / maxMarks) * 100;

          termReports.push({
            term,
            academicYear,
            class: classLevel,
            subjects: gradedSubjects,
            totalMarks,
            percentage,
            overallGrade: calculateGrade(percentage),
            rank: Math.floor(Math.random() * 20) + 1,
            totalStudents: 45,
            attendance: {
              present: Math.floor(Math.random() * 10) + 85,
              absent: Math.floor(Math.random() * 5),
              total: 95,
            },
            teacherRemarks: "Shows consistent performance and good understanding of concepts.",
            principalRemarks: "Keep up the good work!",
          });
        });
      }
    }

    // Calculate cumulative statistics
    const averagePercentage = termReports.reduce((sum, report) => sum + report.percentage, 0) / termReports.length;

    // Find best term
    const bestTermReport = termReports.reduce((best, current) =>
      current.percentage > best.percentage ? current : best
    );

    // Calculate subject averages
    const subjectMap = new Map<string, number[]>();
    termReports.forEach((report) => {
      report.subjects.forEach((subject) => {
        if (!subjectMap.has(subject.subject)) {
          subjectMap.set(subject.subject, []);
        }
        subjectMap.get(subject.subject)!.push((subject.score / subject.maxScore) * 100);
      });
    });

    const subjectAverages = Array.from(subjectMap.entries()).map(([subject, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return {
        subject,
        average,
        grade: calculateGrade(average),
      };
    });

    // Calculate progression timeline (year-wise average)
    const yearMap = new Map<string, { class: string; percentages: number[] }>();
    termReports.forEach((report) => {
      if (!yearMap.has(report.academicYear)) {
        yearMap.set(report.academicYear, { class: report.class, percentages: [] });
      }
      yearMap.get(report.academicYear)!.percentages.push(report.percentage);
    });

    const progressionTimeline = Array.from(yearMap.entries()).map(([year, data]) => ({
      year,
      class: data.class,
      averagePercentage: data.percentages.reduce((sum, p) => sum + p, 0) / data.percentages.length,
    }));

    // Calculate CGPA for Tertiary
    let cgpa: number | undefined;
    let semesterGPAs: { semester: string; gpa: number }[] | undefined;

    if (educationLevel === "Tertiary") {
      const gpas = termReports.map((report) => calculateGPA(report.percentage));
      cgpa = gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length;

      semesterGPAs = termReports.map((report) => ({
        semester: `${report.term} - ${report.academicYear}`,
        gpa: calculateGPA(report.percentage),
      }));
    }

    const cumulativeData: CumulativeReportData = {
      student,
      educationLevel,
      termReports,
      cumulativeStats: {
        averagePercentage,
        overallGrade: calculateGrade(averagePercentage),
        totalTermsCompleted: termReports.length,
        bestTerm: {
          term: bestTermReport.term,
          year: bestTermReport.academicYear,
          percentage: bestTermReport.percentage,
        },
        subjectAverages,
        cgpa,
        semesterGPAs,
      },
      progressionTimeline,
    };

    setCumulativeReport(cumulativeData);
    setCurrentStep("preview");
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handleDownloadPDF = () => {
    // Show instruction modal/alert
    const confirmed = window.confirm(
      'Click OK to open the print dialog.\n\n' +
      'In the print dialog:\n' +
      '1. Select "Save as PDF" or "Microsoft Print to PDF" as the destination\n' +
      '2. Click Save/Print\n' +
      '3. Choose where to save your PDF file\n\n' +
      'Note: Browser print dialog handles all modern color formats correctly.'
    );

    if (confirmed) {
      handlePrint();
    }
  };

  return (
    <MainLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isPageLoading} loadingText="Loading Cumulative Reports" />

      {/* Main Content - Fades in after loading */}
      <div className={`transition-opacity duration-500 ${isPageLoading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Cumulative Report Cards"
          description="Generate comprehensive academic reports showing all completed terms/semesters"
          icon={<BarChart3 className="w-6 h-6" />}
          breadcrumbs={[
            { label: "Students", href: "/students" },
            { label: "Cumulative Reports", isActive: true },
          ]}
        />

        {/* Configuration Step */}
        {currentStep === "config" && (
          <div className="space-y-6">
            {/* Quick Links Card */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      Cumulative Academic Reports
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      Generate comprehensive reports showing all completed terms/semesters for individual students
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/students/report-cards")}
                  icon={<FileText className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Term Reports (Bulk)
                </Button>
              </div>
            </div>

            {/* Instructions Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    What's Included in This Report
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    This comprehensive report shows a student's complete academic journey including:
                  </p>
                  <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-4">
                    <li>• All completed terms/semesters with detailed subject performance</li>
                    <li>• Cumulative statistics and subject averages across all terms</li>
                    <li>• Academic progression timeline showing year-by-year performance</li>
                    <li>• CGPA calculation for Tertiary education students</li>
                    <li>• Best performing term and overall class ranking</li>
                    <li>• Attendance records and remarks from all terms</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Filter Configuration */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Filter Students
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 hidden sm:block">
                      Narrow down student list by class and section
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Form */}
              <div className="p-4 sm:p-6">
                <div className={`grid grid-cols-1 ${settings.supportsMultipleLevels ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                  {/* Education Level - Only show for multi-level schools */}
                  {settings.supportsMultipleLevels && (
                    <FormDropdown
                      label="Education Level"
                      icon={<GraduationCap className="w-full h-full" />}
                      iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                      iconColor="text-blue-600 dark:text-blue-400"
                      value={config.educationLevel}
                      onChange={(value) =>
                        setConfig({
                          ...config,
                          educationLevel: value as EducationLevel,
                          class: "",
                          section: "",
                        })
                      }
                      options={settings.supportedLevels.map((level) => ({
                        value: level,
                        label: level,
                      }))}
                    />
                  )}

                  {/* Class */}
                  <FormDropdown
                    label="Class"
                    icon={<BookOpen className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-400"
                    value={config.class}
                    onChange={(value) => setConfig({ ...config, class: value })}
                    options={[
                      { value: "", label: "All classes" },
                      ...getClassesByLevel(config.educationLevel).map((cls) => ({
                        value: cls,
                        label: cls,
                      })),
                    ]}
                    placeholder="All classes"
                  />

                  {/* Section */}
                  <FormDropdown
                    label="Section"
                    icon={<Users className="w-full h-full" />}
                    iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                    value={config.section}
                    onChange={(value) => setConfig({ ...config, section: value })}
                    options={[
                      { value: "", label: "All sections" },
                      { value: "A", label: "Section A" },
                      { value: "B", label: "Section B" },
                      { value: "C", label: "Section C" },
                      { value: "D", label: "Section D" },
                      { value: "E", label: "Section E" },
                    ]}
                    placeholder="All sections"
                  />
                </div>

                {/* Results Summary */}
                <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {filteredStudents.length}
                    </span>{" "}
                    student{filteredStudents.length !== 1 ? "s" : ""} found
                    {config.class && ` in ${config.class}`}
                    {config.section && ` - Section ${config.section}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Selection */}
            <StudentSelectionGrid
              items={filteredStudents}
              selectedItems={selectedStudent ? new Set([selectedStudent]) : new Set()}
              onSelectionChange={(selected) => {
                const studentId = Array.from(selected)[0];
                setSelectedStudent(studentId || "");
              }}
              title="Select Student"
              searchPlaceholder="Search by name or admission number..."
              singleSelect={true}
              displayFields={{
                primaryField: "name",
                secondaryField: "id",
                avatarField: "avatar",
              }}
              searchFilter={(student, query) => {
                const lowerQuery = query.toLowerCase();
                return (
                  student.name.toLowerCase().includes(lowerQuery) ||
                  student.id.toLowerCase().includes(lowerQuery)
                );
              }}
              itemsPerPage={8}
            />

            <div className="flex justify-end">
              <Button
                onClick={generateCumulativeReport}
                disabled={!selectedStudent}
                icon={<FileText className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Generate Cumulative Report
              </Button>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {currentStep === "preview" && cumulativeReport && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("config")}
                icon={<ArrowLeft className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Back to Selection
              </Button>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  icon={<Printer className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Print
                </Button>
                <Button
                  onClick={handlePrint}
                  icon={<Download className="w-4 h-4" />}
                  title="Open print dialog to save as PDF"
                  className="w-full sm:w-auto"
                >
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Report Preview */}
            <div ref={printRef} data-print-target className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-neutral-200">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                  {settings.schoolName}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 mb-3 sm:mb-4">
                  {settings.institutionType} • {settings.region || "Nigeria"}
                </p>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-600 mb-1">
                  Cumulative Academic Report
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Complete Academic Transcript
                </p>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Student Name</p>
                  <p className="font-semibold text-neutral-900">{cumulativeReport.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Admission Number</p>
                  <p className="font-semibold text-neutral-900">{cumulativeReport.student.id}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Current Class</p>
                  <p className="font-semibold text-neutral-900">{cumulativeReport.student.class}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Education Level</p>
                  <p className="font-semibold text-neutral-900">{cumulativeReport.educationLevel}</p>
                </div>
              </div>

              {/* Cumulative Statistics */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Cumulative Performance Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-xs text-neutral-600 mb-1">Overall Average</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {cumulativeReport.cumulativeStats.averagePercentage.toFixed(1)}%
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-700 font-medium mt-1">
                      Grade: {cumulativeReport.cumulativeStats.overallGrade}
                    </p>
                  </div>

                  {cumulativeReport.cumulativeStats.cgpa && (
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <p className="text-xs text-neutral-600 mb-1">CGPA</p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-600">
                        {cumulativeReport.cumulativeStats.cgpa.toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-700 font-medium mt-1">
                        Out of 4.0
                      </p>
                    </div>
                  )}

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-xs text-neutral-600 mb-1">Terms Completed</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {cumulativeReport.cumulativeStats.totalTermsCompleted}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-700 font-medium mt-1">
                      {cumulativeReport.educationLevel === "Tertiary" ? "Semesters" : "Terms"}
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                    <p className="text-xs text-neutral-600 mb-1">Best Performance</p>
                    <p className="text-xl sm:text-2xl font-bold text-amber-600">
                      {cumulativeReport.cumulativeStats.bestTerm.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-700 font-medium mt-1 truncate">
                      {cumulativeReport.cumulativeStats.bestTerm.term}, {cumulativeReport.cumulativeStats.bestTerm.year}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject Averages */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Subject-wise Performance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {cumulativeReport.cumulativeStats.subjectAverages.map((subject, index) => (
                    <div
                      key={index}
                      className="p-2 sm:p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <p className="text-xs sm:text-sm font-medium text-neutral-900 mb-1 truncate">
                        {subject.subject}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base sm:text-lg font-bold text-blue-600">
                          {subject.average.toFixed(1)}%
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                          {subject.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progression Timeline */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Academic Progression
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {cumulativeReport.progressionTimeline.map((timeline, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg border border-neutral-200"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <p className="text-sm sm:text-base font-semibold text-neutral-900 truncate">
                          {timeline.class} - {timeline.year}
                        </p>
                        <div className="mt-2 bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${timeline.averagePercentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-left sm:text-right">
                        <p className="text-xl sm:text-2xl font-bold text-blue-600">
                          {timeline.averagePercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-neutral-600">
                          Grade: {calculateGrade(timeline.averagePercentage)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Term Reports */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Detailed Term/Semester Reports
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {cumulativeReport.termReports.map((report, index) => (
                    <div key={index} className="border-2 border-neutral-200 rounded-lg p-3 sm:p-4 md:p-5">
                      {/* Term Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 pb-3 border-b border-neutral-200 gap-2">
                        <div>
                          <h4 className="text-base sm:text-lg font-semibold text-neutral-900">
                            {report.term} - {report.academicYear}
                          </h4>
                          <p className="text-sm text-neutral-600">
                            Class: {report.class} | Rank: {report.rank}/{report.totalStudents}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xl sm:text-2xl font-bold text-blue-600">
                            {report.percentage.toFixed(1)}%
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-neutral-700">
                            Grade: {report.overallGrade}
                          </p>
                        </div>
                      </div>

                      {/* Subjects Table */}
                      <div className="overflow-x-auto mb-3 sm:mb-4 -mx-3 sm:mx-0">
                        <table className="w-full text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-neutral-50">
                              <th className="text-left p-1.5 sm:p-2 font-semibold text-neutral-700">Subject</th>
                              <th className="text-center p-1.5 sm:p-2 font-semibold text-neutral-700">Score</th>
                              <th className="text-center p-1.5 sm:p-2 font-semibold text-neutral-700 hidden sm:table-cell">Max</th>
                              <th className="text-center p-1.5 sm:p-2 font-semibold text-neutral-700">%</th>
                              <th className="text-center p-1.5 sm:p-2 font-semibold text-neutral-700">Grade</th>
                              <th className="text-left p-1.5 sm:p-2 font-semibold text-neutral-700 hidden md:table-cell">Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.subjects.map((subject, subIndex) => {
                              const percentage = (subject.score / subject.maxScore) * 100;
                              return (
                                <tr key={subIndex} className="border-t border-neutral-200">
                                  <td className="p-1.5 sm:p-2 text-neutral-900 text-xs sm:text-sm">{subject.subject}</td>
                                  <td className="p-1.5 sm:p-2 text-center font-semibold text-neutral-900">
                                    {subject.score}
                                  </td>
                                  <td className="p-1.5 sm:p-2 text-center text-neutral-600 hidden sm:table-cell">{subject.maxScore}</td>
                                  <td className="p-1.5 sm:p-2 text-center text-neutral-900">
                                    {percentage.toFixed(0)}%
                                  </td>
                                  <td className="p-1.5 sm:p-2 text-center">
                                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                                      {subject.grade}
                                    </span>
                                  </td>
                                  <td className="p-1.5 sm:p-2 text-neutral-600 text-xs sm:text-sm hidden md:table-cell">{subject.remarks}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Attendance */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-xs text-neutral-600">Present</p>
                          <p className="text-lg font-bold text-green-600">{report.attendance.present}</p>
                        </div>
                        <div className="p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-xs text-neutral-600">Absent</p>
                          <p className="text-lg font-bold text-red-600">{report.attendance.absent}</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs text-neutral-600">Total Days</p>
                          <p className="text-lg font-bold text-blue-600">{report.attendance.total}</p>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="space-y-2">
                        <div className="p-3 bg-neutral-50 rounded">
                          <p className="text-xs font-semibold text-neutral-700 mb-1">Teacher's Remarks</p>
                          <p className="text-sm text-neutral-900">{report.teacherRemarks}</p>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded">
                          <p className="text-xs font-semibold text-neutral-700 mb-1">Principal's Remarks</p>
                          <p className="text-sm text-neutral-900">{report.principalRemarks}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t-2 border-neutral-200 text-center">
                <p className="text-sm text-neutral-600">
                  Generated on {new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  This is an official document from {settings.schoolName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </MainLayout>
  );
}
