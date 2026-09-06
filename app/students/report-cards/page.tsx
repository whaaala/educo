"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Printer,
  FileText,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  UserCheck,
  Shield,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { DashboardPage } from "@/components/pages";
import Button from "@/components/shared/Button";
import FormDropdown from "@/components/shared/FormDropdown";
import { Student } from "@/components/students/StudentCard";
import StudentSelectionGrid from "@/components/students/StudentSelectionGrid";
import ReportCardTemplate from "@/components/reports/ReportCardTemplate";
import { useStudentsByTenant } from "@/hooks/useStudentsByTenant";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useGrading, EducationLevel } from "@/contexts/GradingContext";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
type Term = "First Term" | "Second Term" | "Third Term" | "First Semester" | "Second Semester";

interface ReportCardConfig {
  educationLevel: EducationLevel;
  class: string;
  section: string;
  term: Term;
  academicYear: string;
  includeRemarks: boolean;
  includeAttendance: boolean;
  includeConduct: boolean;
  selectedStudents: Set<string>;
}

interface SubjectGrade {
  subject: string;
  score: number;
  grade: string;
  remarks: string;
  maxScore: number;
}

interface ReportCardData {
  student: Student;
  term: string;
  academicYear: string;
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
  conduct: {
    behavior: string;
    discipline: string;
    participation: string;
  };
  teacherRemarks: string;
  principalRemarks: string;
}

// Class options by education level
const PRIMARY_CLASSES = ["I", "II", "III", "IV", "V", "VI"];
const SECONDARY_CLASSES = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
const TERTIARY_CLASSES = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];

const SECTIONS = ["A", "B", "C", "D", "E"];
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

// Generate academic years (current year - 5 to current year + 1)
const currentYear = new Date().getFullYear();
const ACADEMIC_YEARS = Array.from({ length: 7 }, (_, i) => (currentYear - 5 + i).toString());

const generateMockSubjects = (educationLevel: EducationLevel): SubjectGrade[] => {
  if (educationLevel === "Primary") {
    return [
      { subject: "English", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Mathematics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Science", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Social Studies", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Arts", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Physical Education", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
    ];
  } else if (educationLevel === "Secondary") {
    return [
      { subject: "English Language", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Mathematics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Physics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Chemistry", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Biology", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Economics", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Geography", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Computer Science", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
    ];
  } else {
    return [
      { subject: "Data Structures", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Algorithms", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Database Systems", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Operating Systems", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
      { subject: "Computer Networks", score: Math.floor(Math.random() * 30 + 70), grade: "", remarks: "", maxScore: 100 },
    ];
  }
};

// This function will be replaced with context-based grading
// Kept here as fallback for old code
const calculateGradeFallback = (percentage: number, educationLevel: EducationLevel): string => {
  if (educationLevel === "Primary") {
    if (percentage >= 90) return "A+ (Excellent)";
    if (percentage >= 80) return "A (Very Good)";
    if (percentage >= 70) return "B (Good)";
    if (percentage >= 60) return "C (Satisfactory)";
    if (percentage >= 50) return "D (Pass)";
    return "F (Fail)";
  } else if (educationLevel === "Secondary") {
    if (percentage >= 90) return "A1";
    if (percentage >= 80) return "B2";
    if (percentage >= 75) return "B3";
    if (percentage >= 70) return "C4";
    if (percentage >= 65) return "C5";
    if (percentage >= 60) return "C6";
    if (percentage >= 50) return "D7";
    if (percentage >= 45) return "E8";
    return "F9";
  } else {
    const gpa = (percentage / 100) * 5;
    if (gpa >= 4.5) return "A (5.0)";
    if (gpa >= 3.5) return "B (4.0)";
    if (gpa >= 2.5) return "C (3.0)";
    if (gpa >= 1.5) return "D (2.0)";
    return "F (0.0)";
  }
};

export default function ReportCardsPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<"config" | "preview" | "generate">("config");

  // Educo v4.0 Multi-Tenant: Get students and settings for current tenant
  const tenantStudents = useStudentsByTenant();
  const { settings, currentTenant } = useSchoolSettings();
  const { getGradeForScore } = useGrading();
  const [students, setStudents] = useState<Student[]>([]);

  const [config, setConfig] = useState<ReportCardConfig>({
    educationLevel: settings.defaultEducationLevel,
    class: "",
    section: "",
    term: settings.defaultEducationLevel === "Tertiary" ? "First Semester" : "First Term",
    academicYear: "2024",
    includeRemarks: true,
    includeAttendance: true,
    includeConduct: true,
    selectedStudents: new Set(),
  });
  const [reportCards, setReportCards] = useState<ReportCardData[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    // Use tenant-filtered students
    setStudents(tenantStudents);

    // Set current year on client side only
    setConfig(prev => ({
      ...prev,
      academicYear: new Date().getFullYear().toString()
    }));
  }, [tenantStudents]);

  const filteredStudents = students.filter((student) => {
    // Parse student class format: "JSS 1, A" -> class: "JSS 1", section: "A"
    const [studentClass, studentSection] = student.class.split(", ").map((s) => s.trim());

    // Filter by class: check if class matches (or no class filter set)
    const classMatch = !config.class || studentClass === config.class;

    // Filter by section: check if section matches (or no section filter set)
    const sectionMatch = !config.section || studentSection === config.section;

    return classMatch && sectionMatch;
  });

  // Define currentReportCard before using it in handlePrint
  const currentReportCard = reportCards[currentPreviewIndex];

  const generateReportCards = () => {
    const cards: ReportCardData[] = Array.from(config.selectedStudents).map((studentId, index) => {
      const student = students.find((s) => s.id === studentId)!;
      const subjects = generateMockSubjects(config.educationLevel);

      // Parse student class to get just the class level (e.g., "JSS 1, A" -> "JSS 1")
      const [studentClass] = student.class.split(", ").map((s) => s.trim());
      const classLevel = config.class || studentClass;

      // Calculate grades for each subject using the grading context
      const gradedSubjects = subjects.map((subject) => {
        const percentage = (subject.score / subject.maxScore) * 100;
        const score = subject.score;

        // Get grade from grading context based on education level, class, subject, and score
        const gradeScheme = getGradeForScore(config.educationLevel, classLevel, subject.subject, score);

        const grade = gradeScheme
          ? gradeScheme.gradeName
          : calculateGradeFallback(percentage, config.educationLevel).split(" ")[0];

        const remarks = gradeScheme
          ? gradeScheme.remark
          : (percentage >= 70 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement");

        return {
          ...subject,
          grade,
          remarks,
        };
      });

      const totalMarks = gradedSubjects.reduce((sum, s) => sum + s.score, 0);
      const maxTotalMarks = gradedSubjects.reduce((sum, s) => sum + s.maxScore, 0);
      const percentage = (totalMarks / maxTotalMarks) * 100;

      // Calculate overall grade using weighted average
      const overallScore = percentage; // Could use totalMarks if grading scheme uses raw scores
      const overallGradeScheme = getGradeForScore(config.educationLevel, classLevel, "All", overallScore);
      const overallGrade = overallGradeScheme
        ? `${overallGradeScheme.gradeName} (${overallGradeScheme.remark})`
        : calculateGradeFallback(percentage, config.educationLevel);

      return {
        student,
        term: config.term,
        academicYear: config.academicYear,
        subjects: gradedSubjects,
        totalMarks,
        percentage,
        overallGrade,
        rank: index + 1,
        totalStudents: config.selectedStudents.size,
        attendance: {
          present: Math.floor(Math.random() * 20 + 80),
          absent: Math.floor(Math.random() * 10),
          total: 100,
        },
        conduct: {
          behavior: ["Excellent", "Very Good", "Good", "Satisfactory"][Math.floor(Math.random() * 4)],
          discipline: ["Excellent", "Very Good", "Good", "Satisfactory"][Math.floor(Math.random() * 4)],
          participation: ["Excellent", "Very Good", "Good", "Satisfactory"][Math.floor(Math.random() * 4)],
        },
        teacherRemarks: "Good academic performance. Keep up the good work!",
        principalRemarks: "Congratulations on your achievement.",
      };
    });

    setReportCards(cards);
    setCurrentStep("preview");
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: currentReportCard
      ? `Report-Card-${currentReportCard.student.name}-${config.term}-${config.academicYear}`
      : `Report-Card-${config.term}-${config.academicYear}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0 !important;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: white !important;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .print-content {
          display: flex !important;
          flex-direction: column !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          box-sizing: border-box !important;
        }
      }
    `,
  });

  const handleDownloadPDF = async () => {
    if (!printRef.current) {
      alert("Print reference not found. Please try again.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    const pdf = new jsPDF("p", "mm", "a4");
    const totalCards = reportCards.length;

    try {
      for (let i = 0; i < totalCards; i++) {
        setCurrentPreviewIndex(i);
        setGenerationProgress(((i + 0.5) / totalCards) * 100);

        console.log(`Generating PDF for card ${i + 1}/${totalCards}...`);

        // Wait for the component to render with new data
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get the template element
        const element = printRef.current;
        if (!element) continue;

        // Use html2canvas to capture the template
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: element.scrollWidth,
          height: element.scrollHeight,
        });

        // Add new page for subsequent cards
        if (i > 0) pdf.addPage();

        // A4 dimensions in mm
        const imgWidth = 210;
        const imgHeight = 297;

        // Convert canvas to image and add to PDF
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        setGenerationProgress(((i + 1) / totalCards) * 100);
      }

      console.log(`Saving PDF with ${totalCards} page(s)...`);
      pdf.save(`report-cards-${config.class}-${config.term}-${config.academicYear}.pdf`);
      setIsGenerating(false);
      setCurrentPreviewIndex(0);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGenerating(false);
      setCurrentPreviewIndex(0);
      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try using the Print button instead.`);
    }
  };
  return (
    <DashboardPage
      title="Generate Report Cards"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Peoples", href: "#" },
        { label: "Students", href: "/students" },
        { label: "Report Cards", isActive: true },
      ]}
      loadingText="Loading Report Cards"
      afterStats={
        <>
          {/* Print Styles */}
          <style jsx global>{`
        @media print {
          /* Hide everything except the report card */
          body * {
            visibility: hidden;
          }

          .print-content, .print-content * {
            visibility: visible;
          }

          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 210mm;
            padding: 20mm !important;
          }

          /* Hide elements with no-print class */
          .no-print {
            display: none !important;
          }

          /* Page setup */
          @page {
            size: A4;
            margin: 0;
          }

          /* Ensure colors print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Remove shadows and ensure clean printing */
          .print-content {
            box-shadow: none !important;
            background: white !important;
          }

          /* Ensure tables print correctly with borders */
          table {
            page-break-inside: avoid;
            border-collapse: collapse !important;
            width: 100% !important;
          }

          table th,
          table td {
            border: 1px solid #333 !important;
            padding: 8px !important;
          }

          table thead {
            background-color: #f3f4f6 !important;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          /* Prevent content from being cut off */
          thead {
            display: table-header-group;
          }

          tfoot {
            display: table-footer-group;
          }

          /* Optimize text for printing */
          body {
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
          }

          h1 {
            font-size: 22pt;
            color: #000;
            margin-bottom: 8pt;
          }

          h2 {
            font-size: 18pt;
            color: #000;
            margin-bottom: 6pt;
          }

          h3 {
            font-size: 14pt;
            color: #000;
          }

          p {
            color: #333;
            margin-bottom: 4pt;
          }

          /* Ensure all text colors are print-friendly */
          .text-neutral-900,
          .text-neutral-800,
          .text-neutral-700 {
            color: #000 !important;
          }

          .text-neutral-600 {
            color: #333 !important;
          }

          /* Ensure borders are visible */
          .border-neutral-800,
          .border-neutral-300 {
            border-color: #333 !important;
          }

          /* Page breaks */
          .page-break {
            page-break-before: always;
          }

          .page-break-before {
            page-break-before: always;
            margin-top: 0 !important;
            padding-top: 8mm !important;
          }

          .page-break-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .avoid-break {
            page-break-inside: avoid;
          }

          /* Ensure proper spacing at top of new pages */
          @page {
            margin: 8mm 10mm;
          }
        }

        /* Screen-only styles for preview */
        @media screen {
          .print-content {
            min-height: 297mm;
          }
        }
      `}</style>

          <div className="mt-6 p-6 space-y-6">

      {/* Configuration Step */}
      {currentStep === "config" && (
        <div className="space-y-6">
          {/* Quick Links Card */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1">
                <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    Term/Semester Report Cards
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    Generate single term/semester report cards for multiple students in the same class
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/students/cumulative-report")}
                icon={<BarChart3 className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Cumulative Reports
              </Button>
            </div>
          </div>
          {/* Config Form */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 rounded-lg flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Report Card Settings
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 hidden sm:block">
                    Configure report card parameters and options
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Academic Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Academic Configuration
                  </h4>
                </div>

                <div className={`grid grid-cols-1 ${settings.supportsMultipleLevels ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-4 sm:gap-5`}>
                  {/* Education Level - Only show for multi-level schools */}
                  {settings.supportsMultipleLevels && (
                    <FormDropdown
                      label="Education Level"
                      icon={<GraduationCap className="w-full h-full" />}
                      iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                      iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      value={config.educationLevel}
                      onChange={(value) =>
                        setConfig({
                          ...config,
                          educationLevel: value as EducationLevel,
                          term: value === "Tertiary" ? "First Semester" : "First Term",
                        })
                      }
                      options={settings.supportedLevels.map((level) => ({
                        value: level,
                        label: level,
                      }))}
                      required
                    />
                  )}

                  {/* Class */}
                  <FormDropdown
                    label="Class"
                    icon={<BookOpen className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                    value={config.class}
                    onChange={(value) => setConfig({ ...config, class: value })}
                    options={[
                      { value: "", label: "Select class..." },
                      ...getClassesByLevel(config.educationLevel).map((cls) => ({
                        value: cls,
                        label: cls,
                      })),
                    ]}
                    placeholder="Select class..."
                    required
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
                      ...SECTIONS.map((section) => ({
                        value: section,
                        label: `Section ${section}`,
                      })),
                    ]}
                    placeholder="All sections"
                  />
                </div>
              </div>

              {/* Term & Year Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Term & Academic Year
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Term/Semester */}
                  <FormDropdown
                    label="Term/Semester"
                    icon={<Calendar className="w-full h-full" />}
                    iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
                    iconColor="text-indigo-600 dark:text-indigo-400"
                    value={config.term}
                    onChange={(value) => setConfig({ ...config, term: value as Term })}
                    options={(config.educationLevel === "Tertiary" ? TERTIARY_TERMS : PRIMARY_TERMS).map(
                      (term) => ({
                        value: term,
                        label: term,
                      })
                    )}
                    required
                  />

                  {/* Academic Year */}
                  <FormDropdown
                    label="Academic Year"
                    icon={<Calendar className="w-full h-full" />}
                    iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                    iconColor="text-orange-600 dark:text-orange-400"
                    value={config.academicYear}
                    onChange={(value) => setConfig({ ...config, academicYear: value })}
                    options={ACADEMIC_YEARS.map((year) => ({
                      value: year,
                      label: year,
                    }))}
                    placeholder="Select year"
                    required
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Include in Report Card
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Attendance */}
                  <label className="group relative flex items-start gap-3 p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 midnight:hover:bg-cyan-900/10 purple:hover:bg-pink-900/10 has-[:checked]:border-blue-500 dark:has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900/20">
                    <input
                      type="checkbox"
                      checked={config.includeAttendance}
                      onChange={(e) =>
                        setConfig({ ...config, includeAttendance: e.target.checked })
                      }
                      className="mt-0.5 w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-colors"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                        <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                          Attendance
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Include attendance records
                      </p>
                    </div>
                  </label>

                  {/* Conduct & Behavior */}
                  <label className="group relative flex items-start gap-3 p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 has-[:checked]:border-purple-500 dark:has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                    <input
                      type="checkbox"
                      checked={config.includeConduct}
                      onChange={(e) => setConfig({ ...config, includeConduct: e.target.checked })}
                      className="mt-0.5 w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer transition-colors"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                          Conduct & Behavior
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Include behavioral assessment
                      </p>
                    </div>
                  </label>

                  {/* Teacher/Principal Remarks */}
                  <label className="group relative flex items-start gap-3 p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer transition-all duration-200 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50/50 dark:hover:bg-green-900/10 has-[:checked]:border-green-500 dark:has-[:checked]:border-green-500 has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20">
                    <input
                      type="checkbox"
                      checked={config.includeRemarks}
                      onChange={(e) => setConfig({ ...config, includeRemarks: e.target.checked })}
                      className="mt-0.5 w-5 h-5 rounded border-neutral-300 dark:border-neutral-600 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer transition-colors"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                        <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                          Teacher/Principal Remarks
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Include comments and feedback
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Student Selection */}
          <StudentSelectionGrid
            items={filteredStudents}
            selectedItems={config.selectedStudents}
            onSelectionChange={(selected) => setConfig({ ...config, selectedStudents: selected })}
            title="Select Students"
            searchPlaceholder="Search by name or admission number..."
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
          />

          <div className="flex justify-end">
            <Button
              onClick={generateReportCards}
              disabled={config.selectedStudents.size === 0 || !config.class}
              className="w-full sm:w-auto"
            >
              Generate Report Cards ({config.selectedStudents.size})
            </Button>
          </div>
        </div>
      )}

      {/* Preview Step */}
      {(currentStep === "preview" || currentStep === "generate") && currentReportCard && (
        <div className="space-y-6">
          {/* Actions - Print Control Bar */}
          <div className="no-print bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 sm:p-6 shadow-lg sticky top-0 z-50 before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-white dark:before:bg-neutral-900 before:-z-10">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              {/* Left: Navigation */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep("config")} className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Config
                </Button>
                <div className="flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 rounded-lg px-3 sm:px-4 py-2 border border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setCurrentPreviewIndex(Math.max(0, currentPreviewIndex - 1))}
                    disabled={currentPreviewIndex === 0 || isGenerating}
                    className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 min-w-[60px] sm:min-w-[80px] text-center">
                    {currentPreviewIndex + 1} of {reportCards.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPreviewIndex(Math.min(reportCards.length - 1, currentPreviewIndex + 1))
                    }
                    disabled={currentPreviewIndex === reportCards.length - 1 || isGenerating}
                    className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Print Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  disabled={isGenerating}
                  icon={<Printer className="w-4 h-4" />}
                >
                  Print Current
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  icon={<Download className="w-4 h-4" />}
                >
                  {isGenerating ? `Generating... ${Math.round(generationProgress)}%` : "Download All as PDF"}
                </Button>
              </div>
            </div>

            {/* Student Info Bar */}
            <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {currentReportCard.student.name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {currentReportCard.student.class} • Admission No: {currentReportCard.student.admissionNo}
                    </p>
                  </div>
                </div>
                <div className="h-8 w-px bg-neutral-300 dark:bg-neutral-600" />
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Term:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">{config.term}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Year:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">{config.academicYear}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Overall Grade:</span>
                    <span className="ml-2 font-bold text-purple-600 dark:text-purple-400">{currentReportCard.overallGrade}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Card Preview - Full Width */}
          <div className="no-print">
            <ReportCardTemplate
              ref={printRef}
              // School Info
              schoolName={currentTenant?.name || settings.schoolName}
              schoolMotto={currentTenant?.branding?.motto}
              schoolLogo={currentTenant?.branding?.logo}
              schoolAddress={{
                line1: currentTenant?.contact?.address?.line1,
                city: currentTenant?.contact?.address?.city,
                state: currentTenant?.contact?.address?.state,
              }}
              schoolContact={{
                email: currentTenant?.contact?.email,
                phone: currentTenant?.contact?.phone,
              }}
              primaryColor={currentTenant?.branding?.primaryColor || '#2563eb'}
              secondaryColor={currentTenant?.branding?.secondaryColor || '#1e40af'}
              principalName={currentTenant?.branding?.signatures?.principalName || "Principal"}
              principalTitle={currentTenant?.branding?.signatures?.principalTitle || "Principal"}
              classTeacherTitle={currentTenant?.branding?.signatures?.classTeacherTitle}
              // Student Info
              studentName={currentReportCard.student.name}
              admissionNumber={currentReportCard.student.rollNo}
              classLevel={config.class}
              section={config.section}
              gender={currentReportCard.student.gender}
              // Academic Info
              term={config.term}
              academicYear={config.academicYear}
              subjects={currentReportCard.subjects.map(s => ({
                subject: s.subject,
                score: s.score,
                grade: s.grade,
                remarks: s.remarks,
                maxScore: s.maxScore,
              }))}
              classPosition={currentReportCard.rank}
              totalStudents={currentReportCard.totalStudents}
              overallGrade={currentReportCard.overallGrade}
              // Optional Sections
              attendance={config.includeAttendance ? {
                present: currentReportCard.attendance.present,
                absent: currentReportCard.attendance.absent,
                total: currentReportCard.attendance.total,
              } : undefined}
              conduct={config.includeConduct ? currentReportCard.conduct : undefined}
              teacherRemarks={config.includeRemarks ? currentReportCard.teacherRemarks : undefined}
              principalRemarks={config.includeRemarks ? currentReportCard.principalRemarks : undefined}
              // Display Options
              includeRemarks={config.includeRemarks}
              includeAttendance={config.includeAttendance}
              includeConduct={config.includeConduct}
              // Viewer context
              viewerType="admin"
              // Tenant-level report card configuration
              config={currentTenant?.branding?.reportCardConfig}
            />
          </div>
        </div>
      )}
          </div>
        </>
      }
    />
  );
}
