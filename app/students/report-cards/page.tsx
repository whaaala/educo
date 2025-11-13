"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Printer,
  Eye,
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
  BarChart3
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/shared/Button";
import PageHeader from "@/components/shared/PageHeader";
import FormDropdown from "@/components/shared/FormDropdown";
import { Student } from "@/components/students/StudentCard";
import StudentSelectionGrid from "@/components/students/StudentSelectionGrid";
import { useStudentsByTenant } from "@/hooks/useStudentsByTenant";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type EducationLevel = "Primary" | "Secondary" | "Tertiary";
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

const calculateGrade = (percentage: number, educationLevel: EducationLevel): string => {
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
  const { settings } = useSchoolSettings();
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

  const generateReportCards = () => {
    const cards: ReportCardData[] = Array.from(config.selectedStudents).map((studentId, index) => {
      const student = students.find((s) => s.id === studentId)!;
      const subjects = generateMockSubjects(config.educationLevel);

      // Calculate grades for each subject
      const gradedSubjects = subjects.map((subject) => {
        const percentage = (subject.score / subject.maxScore) * 100;
        const grade = calculateGrade(percentage, config.educationLevel);
        return {
          ...subject,
          grade: grade.split(" ")[0],
          remarks: percentage >= 70 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement",
        };
      });

      const totalMarks = gradedSubjects.reduce((sum, s) => sum + s.score, 0);
      const maxTotalMarks = gradedSubjects.reduce((sum, s) => sum + s.maxScore, 0);
      const percentage = (totalMarks / maxTotalMarks) * 100;

      return {
        student,
        term: config.term,
        academicYear: config.academicYear,
        subjects: gradedSubjects,
        totalMarks,
        percentage,
        overallGrade: calculateGrade(percentage, config.educationLevel),
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
    content: () => printRef.current,
  });

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    const pdf = new jsPDF("p", "mm", "a4");
    const totalCards = reportCards.length;

    for (let i = 0; i < totalCards; i++) {
      setCurrentPreviewIndex(i);
      setGenerationProgress(((i + 1) / totalCards) * 100);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    pdf.save(`report-cards-${config.class}-${config.term}-${config.academicYear}.pdf`);
    setIsGenerating(false);
    setCurrentPreviewIndex(0);
  };

  const currentReportCard = reportCards[currentPreviewIndex];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
      <PageHeader
        title="Generate Report Cards"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Peoples", href: "#" },
          { label: "Students", href: "/students" },
          { label: "Report Cards", isActive: true }
        ]}
      />

      {/* Configuration Step */}
      {currentStep === "config" && (
        <div className="space-y-6">
          {/* Quick Links Card */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    Term/Semester Report Cards
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Generate single term/semester report cards for multiple students in the same class
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/students/cumulative-report")}
                icon={<BarChart3 className="w-4 h-4" />}
              >
                Cumulative Reports
              </Button>
            </div>
          </div>
          {/* Config Form */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Report Card Settings
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Configure report card parameters and options
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-8">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Education Level */}
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
                        term: value === "Tertiary" ? "First Semester" : "First Term",
                      })
                    }
                    options={settings.supportedLevels.map((level) => ({
                      value: level,
                      label: level,
                    }))}
                    required
                    disabled={settings.supportedLevels.length === 1}
                  />

                  {/* Class */}
                  <FormDropdown
                    label="Class"
                    icon={<BookOpen className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-400"
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
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Term & Academic Year
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Attendance */}
                  <label className="group relative flex items-start gap-3 p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 has-[:checked]:border-blue-500 dark:has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900/20">
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
                        <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                        <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
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
            >
              Generate Report Cards ({config.selectedStudents.size})
            </Button>
          </div>
        </div>
      )}

      {/* Preview Step */}
      {(currentStep === "preview" || currentStep === "generate") && currentReportCard && (
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep("config")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Config
              </Button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPreviewIndex(Math.max(0, currentPreviewIndex - 1))}
                  disabled={currentPreviewIndex === 0 || isGenerating}
                  className="px-3 py-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {currentPreviewIndex + 1} of {reportCards.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentPreviewIndex(Math.min(reportCards.length - 1, currentPreviewIndex + 1))
                  }
                  disabled={currentPreviewIndex === reportCards.length - 1 || isGenerating}
                  className="px-3 py-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePrint} disabled={isGenerating}>
                <Printer className="w-4 h-4 mr-2" />
                Print Current
              </Button>
              <Button onClick={handleDownloadPDF} disabled={isGenerating}>
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? `Generating... ${Math.round(generationProgress)}%` : "Download All as PDF"}
              </Button>
            </div>
          </div>

          {/* Report Card Preview */}
          <div className="bg-neutral-100 dark:bg-neutral-900 p-8 rounded-lg">
            <div
              ref={printRef}
              className="bg-white w-[210mm] mx-auto p-8 shadow-lg"
              style={{ minHeight: "297mm" }}
            >
              {/* School Header */}
              <div className="text-center border-b-2 border-neutral-800 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Educo International School
                </h1>
                <p className="text-sm text-neutral-600">
                  Excellence in Education Since 2000
                </p>
                <p className="text-sm text-neutral-600">
                  123 Education Lane, Knowledge City, State - 123456
                </p>
              </div>

              {/* Report Card Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  PROGRESS REPORT CARD
                </h2>
                <p className="text-sm text-neutral-600">
                  {config.term} - Academic Year {config.academicYear}
                </p>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Student Name:</span>{" "}
                    {currentReportCard.student.name}
                  </p>
                  <p>
                    <span className="font-semibold">Admission No:</span>{" "}
                    {currentReportCard.student.rollNo}
                  </p>
                  <p>
                    <span className="font-semibold">Class:</span> {config.class}
                    {config.section && ` - Section ${config.section}`}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Gender:</span>{" "}
                    {currentReportCard.student.gender}
                  </p>
                  {config.includeAttendance && (
                    <p>
                      <span className="font-semibold">Attendance:</span>{" "}
                      {currentReportCard.attendance.present}/{currentReportCard.attendance.total}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Rank:</span> {currentReportCard.rank} of{" "}
                    {currentReportCard.totalStudents}
                  </p>
                </div>
              </div>

              {/* Grades Table */}
              <table className="w-full border-collapse mb-6 text-sm">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="border border-neutral-300 p-2 text-left">Subject</th>
                    <th className="border border-neutral-300 p-2 text-center">Max Marks</th>
                    <th className="border border-neutral-300 p-2 text-center">Marks Obtained</th>
                    <th className="border border-neutral-300 p-2 text-center">Grade</th>
                    {config.includeRemarks && (
                      <th className="border border-neutral-300 p-2 text-left">Remarks</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentReportCard.subjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="border border-neutral-300 p-2">{subject.subject}</td>
                      <td className="border border-neutral-300 p-2 text-center">
                        {subject.maxScore}
                      </td>
                      <td className="border border-neutral-300 p-2 text-center font-semibold">
                        {subject.score}
                      </td>
                      <td className="border border-neutral-300 p-2 text-center font-semibold">
                        {subject.grade}
                      </td>
                      {config.includeRemarks && (
                        <td className="border border-neutral-300 p-2 text-sm">
                          {subject.remarks}
                        </td>
                      )}
                    </tr>
                  ))}
                  <tr className="bg-neutral-100 font-bold">
                    <td className="border border-neutral-300 p-2">TOTAL</td>
                    <td className="border border-neutral-300 p-2 text-center">
                      {currentReportCard.subjects.reduce((sum, s) => sum + s.maxScore, 0)}
                    </td>
                    <td className="border border-neutral-300 p-2 text-center">
                      {currentReportCard.totalMarks}
                    </td>
                    <td className="border border-neutral-300 p-2 text-center" colSpan={config.includeRemarks ? 2 : 1}>
                      {currentReportCard.percentage.toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Overall Grade */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-center text-lg">
                  <span className="font-semibold">Overall Grade:</span>{" "}
                  <span className="text-2xl font-bold text-purple-600">
                    {currentReportCard.overallGrade}
                  </span>
                </p>
              </div>

              {/* Conduct */}
              {config.includeConduct && (
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Conduct & Behavior</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-neutral-50 rounded">
                      <p className="text-neutral-600 mb-1">Behavior</p>
                      <p className="font-semibold">{currentReportCard.conduct.behavior}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded">
                      <p className="text-neutral-600 mb-1">Discipline</p>
                      <p className="font-semibold">{currentReportCard.conduct.discipline}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded">
                      <p className="text-neutral-600 mb-1">Participation</p>
                      <p className="font-semibold">{currentReportCard.conduct.participation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks */}
              {config.includeRemarks && (
                <div className="space-y-4 mb-6 text-sm">
                  <div>
                    <p className="font-semibold mb-2">Class Teacher's Remarks:</p>
                    <p className="p-3 bg-neutral-50 rounded">{currentReportCard.teacherRemarks}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Principal's Remarks:</p>
                    <p className="p-3 bg-neutral-50 rounded">
                      {currentReportCard.principalRemarks}
                    </p>
                  </div>
                </div>
              )}

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-8 mt-12 text-sm text-center">
                <div>
                  <div className="border-t-2 border-neutral-800 pt-2">
                    <p className="font-semibold">Class Teacher</p>
                  </div>
                </div>
                <div>
                  <div className="border-t-2 border-neutral-800 pt-2">
                    <p className="font-semibold">Parent/Guardian</p>
                  </div>
                </div>
                <div>
                  <div className="border-t-2 border-neutral-800 pt-2">
                    <p className="font-semibold">Principal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
}
