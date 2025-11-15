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
  BarChart3,
  ChevronLeft,
  ChevronRight
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
  const { settings, currentTenant } = useSchoolSettings();
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
    contentRef: printRef,
    documentTitle: currentReportCard
      ? `Report-Card-${currentReportCard.student.name}-${config.term}-${config.academicYear}`
      : `Report-Card-${config.term}-${config.academicYear}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  });

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    const pdf = new jsPDF("p", "mm", "a4");
    const totalCards = reportCards.length;

    try {
      for (let i = 0; i < totalCards; i++) {
        const card = reportCards[i];
        setCurrentPreviewIndex(i);
        setGenerationProgress(((i + 1) / totalCards) * 100);

        console.log(`Generating PDF for card ${i + 1}/${totalCards}...`);

        // Get tenant branding colors
        const primaryColor = currentTenant?.branding?.primaryColor || '#2563eb';

        // Convert hex to RGB for jsPDF
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 37, g: 99, b: 235 };
        };

        const primaryRgb = hexToRgb(primaryColor);

        if (i > 0) pdf.addPage();

        let yPos = 15; // Start position

        // ===== SCHOOL HEADER =====
        // Logo circle
        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.circle(105, yPos + 10, 8, 'F');

        // School name
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(currentTenant?.name || settings.schoolName, 105, yPos + 25, { align: 'center' });

        // Motto
        if (currentTenant?.branding?.motto) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(100, 100, 100);
          pdf.text(`"${currentTenant.branding.motto}"`, 105, yPos + 32, { align: 'center' });
        }

        // Address and contact
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        const addressLine = `${currentTenant?.contact.address.line1}, ${currentTenant?.contact.address.city}, ${currentTenant?.contact.address.state}`;
        const contactLine = `Email: ${currentTenant?.contact.email} | Phone: ${currentTenant?.contact.phone}`;
        pdf.text(addressLine, 105, yPos + 37, { align: 'center' });
        pdf.text(contactLine, 105, yPos + 41, { align: 'center' });

        yPos += 50;

        // ===== REPORT CARD TITLE =====
        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.rect(15, yPos, 180, 18, 'F');
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('PROGRESS REPORT CARD', 105, yPos + 8, { align: 'center' });
        pdf.setFontSize(11);
        pdf.text(`${config.term} - Academic Year ${config.academicYear}`, 105, yPos + 14, { align: 'center' });

        yPos += 25;

        // ===== STUDENT INFORMATION BOX =====
        pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setLineWidth(0.5);
        pdf.rect(15, yPos, 180, 35);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);

        const infoY = yPos + 7;
        const col1X = 20;
        const col2X = 110;
        const lineHeight = 8;

        // Left column
        pdf.text('Student Name:', col1X, infoY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(card.student.name, col1X + 35, infoY);

        pdf.setFont('helvetica', 'bold');
        pdf.text('Admission No:', col1X, infoY + lineHeight);
        pdf.setFont('helvetica', 'normal');
        pdf.text(card.student.rollNo, col1X + 35, infoY + lineHeight);

        pdf.setFont('helvetica', 'bold');
        pdf.text('Class:', col1X, infoY + lineHeight * 2);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${config.class}${config.section ? ` - Section ${config.section}` : ''}`, col1X + 35, infoY + lineHeight * 2);

        // Right column
        pdf.setFont('helvetica', 'bold');
        pdf.text('Gender:', col2X, infoY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(card.student.gender, col2X + 25, infoY);

        if (config.includeAttendance) {
          pdf.setFont('helvetica', 'bold');
          pdf.text('Attendance:', col2X, infoY + lineHeight);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`${card.attendance.present}/${card.attendance.total} Days`, col2X + 25, infoY + lineHeight);
        }

        pdf.setFont('helvetica', 'bold');
        pdf.text('Class Rank:', col2X, infoY + lineHeight * 2);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.text(`${card.rank} of ${card.totalStudents}`, col2X + 25, infoY + lineHeight * 2);

        yPos += 42;

        // ===== ACADEMIC PERFORMANCE TABLE =====
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Academic Performance', 15, yPos);

        yPos += 7;

        // Table header
        const tableX = 15;
        const tableWidth = 180;
        const colWidths = config.includeRemarks
          ? [60, 25, 30, 20, 45]  // With remarks
          : [70, 30, 35, 25];      // Without remarks

        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.rect(tableX, yPos, tableWidth, 8, 'F');

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);

        let currentX = tableX + 2;
        pdf.text('Subject', currentX, yPos + 5.5);
        currentX += colWidths[0];
        pdf.text('Max Marks', currentX, yPos + 5.5);
        currentX += colWidths[1];
        pdf.text('Marks Obtained', currentX, yPos + 5.5);
        currentX += colWidths[2];
        pdf.text('Grade', currentX, yPos + 5.5);
        if (config.includeRemarks) {
          currentX += colWidths[3];
          pdf.text('Remarks', currentX, yPos + 5.5);
        }

        yPos += 8;

        // Table rows
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);

        card.subjects.forEach((subject, idx) => {
          const rowHeight = 7;

          // Alternating row colors
          if (idx % 2 === 0) {
            pdf.setFillColor(245, 245, 245);
            pdf.rect(tableX, yPos, tableWidth, rowHeight, 'F');
          }

          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.1);
          pdf.line(tableX, yPos + rowHeight, tableX + tableWidth, yPos + rowHeight);

          currentX = tableX + 2;
          pdf.setFont('helvetica', 'bold');
          pdf.text(subject.subject, currentX, yPos + 5);

          currentX += colWidths[0];
          pdf.setFont('helvetica', 'normal');
          pdf.text(subject.maxScore.toString(), currentX, yPos + 5);

          currentX += colWidths[1];
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          pdf.text(subject.score.toString(), currentX, yPos + 5);

          currentX += colWidths[2];
          pdf.setTextColor(255, 255, 255);
          pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          pdf.roundedRect(currentX - 1, yPos + 1.5, 15, 5, 2, 2, 'F');
          pdf.text(subject.grade, currentX + 3, yPos + 5);

          if (config.includeRemarks) {
            currentX += colWidths[3];
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(7);
            pdf.setTextColor(100, 100, 100);
            pdf.text(subject.remarks, currentX, yPos + 5, { maxWidth: colWidths[4] - 4 });
            pdf.setFontSize(9);
          }

          pdf.setTextColor(0, 0, 0);
          yPos += rowHeight;
        });

        // Grand total row
        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.rect(tableX, yPos, tableWidth, 8, 'F');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);

        currentX = tableX + 2;
        pdf.text('GRAND TOTAL', currentX, yPos + 5.5);

        currentX += colWidths[0];
        pdf.text(card.subjects.reduce((sum, s) => sum + s.maxScore, 0).toString(), currentX, yPos + 5.5);

        currentX += colWidths[1];
        pdf.text(card.totalMarks.toString(), currentX, yPos + 5.5);

        currentX += colWidths[2];
        pdf.text(`${card.percentage.toFixed(2)}%`, currentX, yPos + 5.5);

        yPos += 15;

        // ===== OVERALL PERFORMANCE =====
        pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setLineWidth(0.5);
        pdf.rect(15, yPos, 180, 30);

        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.rect(15, yPos, 180, 8, 'F');
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('Overall Performance Summary', 105, yPos + 5.5, { align: 'center' });

        // Grade circle
        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.circle(40, yPos + 19, 10, 'F');
        pdf.setFontSize(24);
        pdf.setTextColor(255, 255, 255);
        pdf.text(card.overallGrade, 40, yPos + 22, { align: 'center' });
        pdf.setFontSize(7);
        pdf.text('Grade', 40, yPos + 27, { align: 'center' });

        // Stats
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Percentage Score:', 65, yPos + 15);
        pdf.setFontSize(16);
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.text(`${card.percentage.toFixed(1)}%`, 120, yPos + 15);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Total Marks:', 65, yPos + 23);
        pdf.setFontSize(12);
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.text(`${card.totalMarks}/${card.subjects.reduce((sum, s) => sum + s.maxScore, 0)}`, 95, yPos + 23);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Performance Status:', 130, yPos + 23);
        pdf.setFont('helvetica', 'normal');
        const status = card.percentage >= 90 ? "Outstanding" :
                      card.percentage >= 75 ? "Excellent" :
                      card.percentage >= 60 ? "Good" :
                      card.percentage >= 50 ? "Satisfactory" : "Needs Improvement";
        pdf.text(status, 165, yPos + 23);

        yPos += 37;

        // ===== CONDUCT (if enabled) =====
        if (config.includeConduct && yPos < 240) {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text('Conduct & Behavior Assessment', 15, yPos);
          yPos += 7;

          const conductWidth = 58;
          pdf.setFontSize(8);

          // Behavior
          pdf.setDrawColor(34, 197, 94);
          pdf.setLineWidth(0.5);
          pdf.rect(15, yPos, conductWidth, 12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('BEHAVIOR', 15 + conductWidth/2, yPos + 5, { align: 'center' });
          pdf.setFont('helvetica', 'normal');
          pdf.text(card.conduct.behavior, 15 + conductWidth/2, yPos + 9, { align: 'center' });

          // Discipline
          pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          pdf.rect(78, yPos, conductWidth, 12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('DISCIPLINE', 78 + conductWidth/2, yPos + 5, { align: 'center' });
          pdf.setFont('helvetica', 'normal');
          pdf.text(card.conduct.discipline, 78 + conductWidth/2, yPos + 9, { align: 'center' });

          // Participation
          pdf.setDrawColor(168, 85, 247);
          pdf.rect(141, yPos, conductWidth, 12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('PARTICIPATION', 141 + conductWidth/2, yPos + 5, { align: 'center' });
          pdf.setFont('helvetica', 'normal');
          pdf.text(card.conduct.participation, 141 + conductWidth/2, yPos + 9, { align: 'center' });

          yPos += 18;
        }

        // ===== REMARKS (if enabled) =====
        if (config.includeRemarks && yPos < 230) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);

          // Teacher's Remarks
          pdf.text("Class Teacher's Remarks", 15, yPos);
          yPos += 5;
          pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          pdf.setLineWidth(0.3);
          pdf.rect(15, yPos, 180, 12);
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(8);
          pdf.setTextColor(60, 60, 60);
          pdf.text(card.teacherRemarks, 17, yPos + 4, { maxWidth: 176 });
          yPos += 17;

          // Principal's Remarks
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(0, 0, 0);
          pdf.text("Principal's Remarks", 15, yPos);
          yPos += 5;
          pdf.rect(15, yPos, 180, 12);
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(8);
          pdf.setTextColor(60, 60, 60);
          pdf.text(card.principalRemarks, 17, yPos + 4, { maxWidth: 176 });
          yPos += 17;
        }

        // ===== SIGNATURES =====
        if (yPos < 260) {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text('OFFICIAL SIGNATURES & AUTHENTICATION', 105, yPos, { align: 'center' });
          yPos += 10;

          const sigWidth = 56;
          const sigHeight = 18;
          const sigY = yPos;
          const spacing = 6;

          // Calculate x positions for three equal boxes
          const totalWidth = (sigWidth * 3) + (spacing * 2);
          const startX = (210 - totalWidth) / 2; // Center the boxes

          // Class Teacher
          pdf.setDrawColor(220, 220, 220);
          pdf.setFillColor(250, 250, 250);
          pdf.setLineWidth(0.3);
          pdf.rect(startX, sigY, sigWidth, sigHeight, 'FD');
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text('Class Teacher', startX + sigWidth/2, sigY + sigHeight/2 - 1, { align: 'center' });
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          pdf.text('Signature & Date', startX + sigWidth/2, sigY + sigHeight/2 + 3, { align: 'center' });

          // Parent/Guardian
          pdf.setDrawColor(220, 220, 220);
          pdf.setFillColor(250, 250, 250);
          pdf.rect(startX + sigWidth + spacing, sigY, sigWidth, sigHeight, 'FD');
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text('Parent/Guardian', startX + sigWidth + spacing + sigWidth/2, sigY + sigHeight/2 - 1, { align: 'center' });
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          pdf.text('Signature & Date', startX + sigWidth + spacing + sigWidth/2, sigY + sigHeight/2 + 3, { align: 'center' });

          // Principal
          pdf.setDrawColor(220, 220, 220);
          pdf.setFillColor(250, 250, 250);
          pdf.rect(startX + (sigWidth * 2) + (spacing * 2), sigY, sigWidth, sigHeight, 'FD');
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          const principalName = currentTenant?.branding?.signatures?.principalName || "Principal";
          pdf.text(principalName, startX + (sigWidth * 2) + (spacing * 2) + sigWidth/2, sigY + sigHeight/2 - 1, { align: 'center' });
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          const principalTitle = currentTenant?.branding?.signatures?.principalTitle || "Principal";
          pdf.text(principalTitle, startX + (sigWidth * 2) + (spacing * 2) + sigWidth/2, sigY + sigHeight/2 + 3, { align: 'center' });

          yPos += sigHeight + 10;

          // Official document icon and text
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(120, 120, 120);
          pdf.text('O OFFICIAL DOCUMENT O', 105, yPos, { align: 'center' });
          yPos += 4;
        }

        // ===== FOOTER =====
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
        pdf.text('This is an official academic document issued by ' + (currentTenant?.name || settings.schoolName), 105, 287, { align: 'center' });
        pdf.text('Generated on: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 105, 291, { align: 'center' });
      }

      console.log(`Saving PDF with ${totalCards} page(s)...`);
      pdf.save(`report-cards-${config.class}-${config.term}-${config.academicYear}.pdf`);
      setIsGenerating(false);
      setCurrentPreviewIndex(0);
      alert(`Successfully generated PDF with ${totalCards} report card(s)!`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGenerating(false);
      setCurrentPreviewIndex(0);
      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try using the Print button instead.`);
    }
  };

  // Dummy function to maintain old code structure - we'll remove html2canvas code below
  const handleDownloadPDF_OLD = async () => {
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
        setGenerationProgress(((i + 1) / totalCards) * 100);

        // Wait for DOM to update and render
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!printRef.current) {
          console.warn(`Print ref not available for card ${i}`);
          continue;
        }

        console.log(`Generating PDF for card ${i + 1}/${totalCards}...`);

        // Scroll to the element to ensure it's visible
        printRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });

        // Wait for scroll and rendering
        await new Promise((resolve) => setTimeout(resolve, 200));

        let canvas;
        try {
          canvas = await html2canvas(printRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
            // Find the print content element first
            const printContent = clonedDoc.querySelector('.print-content') as HTMLElement;
            if (!printContent) {
              console.error('Print content element not found');
              return;
            }

            // Get tenant branding colors (use defaults if not available)
            const primaryColor = currentTenant?.branding?.primaryColor || '#2563eb';
            const secondaryColor = currentTenant?.branding?.secondaryColor || '#1e40af';

            // Reset all positioning and sizing - let it render naturally
            printContent.style.position = 'relative';
            printContent.style.margin = '0';
            printContent.style.padding = '3mm'; // Ultra minimal margin to maximize both width and height
            printContent.style.width = '100%';
            printContent.style.maxWidth = 'none';
            printContent.style.backgroundColor = '#ffffff';
            printContent.style.boxShadow = 'none';
            printContent.style.fontSize = '20px'; // Much larger base font for maximum visibility

            // CRITICAL: Replace ALL oklch colors with RGB before html2canvas parses
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;

              // Make everything visible first
              htmlEl.style.visibility = 'visible';

              // Get the current styles but don't force colors on everything
              // Only override when necessary to prevent oklch issues

              // Handle specific elements with proper styling
              if (htmlEl.tagName === 'TABLE') {
                htmlEl.style.borderCollapse = 'collapse';
                htmlEl.style.width = '100%';
                htmlEl.style.backgroundColor = '#ffffff';
              }

              if (htmlEl.tagName === 'THEAD') {
                htmlEl.style.backgroundColor = '#f3f4f6';
              }

              if (htmlEl.tagName === 'TD' || htmlEl.tagName === 'TH') {
                htmlEl.style.border = '1px solid #333333';
                htmlEl.style.padding = '12px'; // Maximum padding for readability
                htmlEl.style.color = '#000000';
                htmlEl.style.fontSize = '20px'; // Maximum text size in tables
                htmlEl.style.lineHeight = '1.5';
              }

              // Headers - maximum size for visibility
              if (htmlEl.tagName === 'H1') {
                htmlEl.style.color = '#000000';
                htmlEl.style.fontSize = '42px'; // Maximum school name size - increased from 34px
                htmlEl.style.fontWeight = 'bold';
                htmlEl.style.marginBottom = '8px';
                htmlEl.style.marginTop = '0';
                htmlEl.style.lineHeight = '1.3';
              }

              if (htmlEl.tagName === 'H2') {
                htmlEl.style.color = '#000000';
                htmlEl.style.fontSize = '48px'; // Maximum title banner size - increased from 32px
                htmlEl.style.fontWeight = 'bold';
                htmlEl.style.marginBottom = '8px';
                htmlEl.style.marginTop = '0';
                htmlEl.style.lineHeight = '1.3';
              }

              if (htmlEl.tagName === 'H3') {
                htmlEl.style.color = '#000000';
                // Check if this is the signatures heading
                if (htmlEl.textContent?.includes('Official Signatures')) {
                  htmlEl.style.fontSize = '28px'; // Larger for signatures heading
                } else {
                  htmlEl.style.fontSize = '22px'; // Maximum section headers size - increased from 18px
                }
                htmlEl.style.fontWeight = '600';
                htmlEl.style.marginBottom = '5px';
                htmlEl.style.marginTop = '0';
                htmlEl.style.lineHeight = '1.3';
              }

              // Better paragraph spacing for readability
              if (htmlEl.tagName === 'P') {
                htmlEl.style.marginBottom = '8px';
                htmlEl.style.marginTop = '5px';
                htmlEl.style.lineHeight = '1.5';

                // Larger font for signature labels
                const classList = Array.from(htmlEl.classList);
                if (classList.includes('text-lg')) {
                  htmlEl.style.fontSize = '22px'; // Signature role labels (Class Teacher, Parent/Guardian, Principal name)
                }
                if (classList.includes('text-sm') && (htmlEl.textContent?.includes('Signature') || htmlEl.textContent?.includes('Date'))) {
                  htmlEl.style.fontSize = '18px'; // "Signature & Date" text
                }
                if (classList.includes('text-xl')) {
                  htmlEl.style.fontSize = '24px'; // Term/Academic year in title banner and class rank
                }
              }

              // SPAN elements - handle student info section
              if (htmlEl.tagName === 'SPAN') {
                const classList = Array.from(htmlEl.classList);
                // Check if this span is in the student info section
                const isInStudentInfo = htmlEl.closest('.student-info-section');
                if (isInStudentInfo) {
                  htmlEl.style.fontSize = '22px'; // Larger text for student info
                  htmlEl.style.lineHeight = '1.6';
                }
              }

              // Improved div padding and margins to use full page height
              if (htmlEl.tagName === 'DIV') {
                const classList = Array.from(htmlEl.classList);
                // Better spacing for sections to utilize full height
                if (classList.includes('mb-6')) {
                  htmlEl.style.marginBottom = '12px';
                }
                if (classList.includes('mb-3')) {
                  htmlEl.style.marginBottom = '8px';
                }
                if (classList.includes('mb-4')) {
                  htmlEl.style.marginBottom = '10px';
                }
                if (classList.includes('mt-12')) {
                  htmlEl.style.marginTop = '20px';
                }
                if (classList.includes('mt-8')) {
                  htmlEl.style.marginTop = '15px';
                }
                if (classList.includes('mt-6')) {
                  htmlEl.style.marginTop = '12px';
                }
                if (classList.includes('mt-3')) {
                  htmlEl.style.marginTop = '8px';
                }
                if (classList.includes('pb-6')) {
                  htmlEl.style.paddingBottom = '12px';
                }
                if (classList.includes('pt-6')) {
                  htmlEl.style.paddingTop = '12px';
                }
                if (classList.includes('pt-4')) {
                  htmlEl.style.paddingTop = '10px';
                }
                if (classList.includes('py-4')) {
                  htmlEl.style.paddingTop = '10px';
                  htmlEl.style.paddingBottom = '10px';
                }
                if (classList.includes('px-6')) {
                  htmlEl.style.paddingLeft = '12px';
                  htmlEl.style.paddingRight = '12px';
                }
                if (classList.includes('p-6')) {
                  htmlEl.style.padding = '12px';
                }
                if (classList.includes('p-4')) {
                  htmlEl.style.padding = '10px';
                }
                if (classList.includes('p-3')) {
                  htmlEl.style.padding = '8px';
                }
                if (classList.includes('p-5')) {
                  htmlEl.style.padding = '11px';
                }
                // Better gap spacing
                if (classList.includes('gap-6')) {
                  htmlEl.style.gap = '12px';
                }
                if (classList.includes('gap-4')) {
                  htmlEl.style.gap = '10px';
                }
                if (classList.includes('gap-8')) {
                  htmlEl.style.gap = '15px';
                }
                // Signature spacing - good functional space
                if (classList.includes('pt-8') && !htmlEl.parentElement?.classList.contains('grid-cols-3')) {
                  htmlEl.style.paddingTop = '15px';
                } else if (classList.includes('pt-8')) {
                  htmlEl.style.paddingTop = '30px'; // Good space for signatures
                }
                // Better border padding for the main decorative border
                if (classList.includes('border-4') && classList.includes('border-double')) {
                  htmlEl.style.padding = '15mm';
                }
              }

              // Handle text colors more selectively
              if (htmlEl.classList.contains('text-neutral-600')) {
                htmlEl.style.color = '#525252';
              }
              if (htmlEl.classList.contains('text-neutral-900')) {
                htmlEl.style.color = '#171717';
              }
              if (htmlEl.classList.contains('text-neutral-500')) {
                htmlEl.style.color = '#737373';
              }
              if (htmlEl.classList.contains('text-neutral-800')) {
                htmlEl.style.color = '#262626';
              }
              if (htmlEl.classList.contains('text-neutral-700')) {
                htmlEl.style.color = '#404040';
              }
              // Use tenant's branding colors for accents
              if (htmlEl.classList.contains('text-purple-600')) {
                htmlEl.style.color = primaryColor; // Tenant primary color
              }
              if (htmlEl.classList.contains('text-purple-700')) {
                htmlEl.style.color = secondaryColor; // Tenant secondary color
              }
              // Blue colors - use tenant colors
              if (htmlEl.classList.contains('text-blue-600')) {
                htmlEl.style.color = primaryColor; // Tenant primary color
              }
              if (htmlEl.classList.contains('text-blue-700')) {
                htmlEl.style.color = secondaryColor; // Tenant secondary color
              }
              // Green colors
              if (htmlEl.classList.contains('text-green-700')) {
                htmlEl.style.color = '#15803d';
              }
              // White text
              if (htmlEl.classList.contains('text-white')) {
                htmlEl.style.color = '#ffffff';
              }

              // Handle borders
              if (htmlEl.classList.contains('border-neutral-800')) {
                htmlEl.style.borderColor = '#262626';
              }
              if (htmlEl.classList.contains('border-neutral-300')) {
                htmlEl.style.borderColor = '#d4d4d4';
              }
              if (htmlEl.classList.contains('border-neutral-200')) {
                htmlEl.style.borderColor = '#e5e5e5';
              }
              if (htmlEl.classList.contains('border-neutral-400')) {
                htmlEl.style.borderColor = '#a3a3a3';
              }
              if (htmlEl.classList.contains('border-purple-300')) {
                htmlEl.style.borderColor = primaryColor + '80'; // Tenant primary with transparency
              }
              if (htmlEl.classList.contains('border-purple-700')) {
                htmlEl.style.borderColor = secondaryColor; // Tenant secondary color
              }
              if (htmlEl.classList.contains('border-blue-200')) {
                htmlEl.style.borderColor = primaryColor + '60'; // Tenant primary lighter
              }
              if (htmlEl.classList.contains('border-blue-300')) {
                htmlEl.style.borderColor = primaryColor + '80'; // Tenant primary medium
              }
              if (htmlEl.classList.contains('border-green-300')) {
                htmlEl.style.borderColor = '#86efac';
              }

              // Handle background colors - preserve gradients by setting solid fallbacks
              if (htmlEl.classList.contains('bg-white')) {
                htmlEl.style.backgroundColor = '#ffffff';
              }
              if (htmlEl.classList.contains('bg-neutral-50')) {
                htmlEl.style.backgroundColor = '#fafafa';
              }
              if (htmlEl.classList.contains('bg-neutral-100')) {
                htmlEl.style.backgroundColor = '#f5f5f5';
              }
              if (htmlEl.classList.contains('bg-blue-50')) {
                htmlEl.style.backgroundColor = '#eff6ff';
              }
              if (htmlEl.classList.contains('bg-blue-600')) {
                htmlEl.style.backgroundColor = '#2563eb';
              }
              if (htmlEl.classList.contains('bg-purple-50')) {
                htmlEl.style.backgroundColor = primaryColor + '15'; // Tenant primary very light
              }
              if (htmlEl.classList.contains('bg-purple-600')) {
                htmlEl.style.backgroundColor = secondaryColor; // Tenant secondary color
              }
              if (htmlEl.classList.contains('bg-purple-500')) {
                htmlEl.style.backgroundColor = primaryColor; // Tenant primary color
              }
              if (htmlEl.classList.contains('bg-green-50')) {
                htmlEl.style.backgroundColor = '#f0fdf4';
              }
              if (htmlEl.classList.contains('bg-green-500')) {
                htmlEl.style.backgroundColor = '#22c55e';
              }

              // Keep gradient backgrounds intact - don't replace them

              // ONLY replace oklch colors - KEEP gradients intact
              try {
                const computedStyle = window.getComputedStyle(htmlEl)

                // Check and replace background color ONLY if it contains oklch
                if (computedStyle.backgroundColor) {
                  const bgColor = computedStyle.backgroundColor;
                  if (bgColor.includes('oklch')) {
                    htmlEl.style.backgroundColor = '#ffffff';
                  }
                }

                // Check and replace text color ONLY if it contains oklch
                if (computedStyle.color) {
                  const textColor = computedStyle.color;
                  if (textColor.includes('oklch')) {
                    htmlEl.style.color = '#000000';
                  }
                }

                // Check and replace border colors ONLY if it contains oklch
                if (computedStyle.borderColor) {
                  const borderColor = computedStyle.borderColor;
                  if (borderColor.includes('oklch')) {
                    htmlEl.style.borderColor = '#000000';
                  }
                }
              } catch (e) {
                // Silently continue if getComputedStyle fails
                console.warn('Failed to get computed style for element', e);
              }
            });

            // Specifically target the print content area - final cleanup for oklch ONLY
            const printElements = printContent.querySelectorAll('*');
            printElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;

              // SURGICALLY replace only oklch colors, preserve everything else including gradients
              // Check individual style properties instead of replacing entire cssText
              if (htmlEl.style.backgroundColor && htmlEl.style.backgroundColor.includes('oklch')) {
                htmlEl.style.backgroundColor = htmlEl.style.backgroundColor.replace(/oklch\([^)]+\)/g, '#ffffff');
              }
              if (htmlEl.style.color && htmlEl.style.color.includes('oklch')) {
                htmlEl.style.color = htmlEl.style.color.replace(/oklch\([^)]+\)/g, '#000000');
              }
              if (htmlEl.style.borderColor && htmlEl.style.borderColor.includes('oklch')) {
                htmlEl.style.borderColor = htmlEl.style.borderColor.replace(/oklch\([^)]+\)/g, '#000000');
              }
              // Note: We intentionally do NOT touch background or backgroundImage properties
              // as these may contain linear-gradient() which we want to preserve
            });
          },
          });
        } catch (canvasError: any) {
          // Log color errors but don't fail the PDF generation
          // html2canvas can usually work around color issues
          if (canvasError.message?.includes('oklch') || canvasError.message?.includes('color')) {
            console.warn('Color parsing warning during PDF generation (continuing):', canvasError.message);
            // Don't throw - let the process continue
          } else {
            // Re-throw non-color errors
            throw canvasError;
          }
        }

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error(`Canvas generation failed for card ${i + 1} - canvas is empty or has no dimensions`);
      }

      console.log(`Canvas created successfully: ${canvas.width}x${canvas.height}px`);

      const imgData = canvas.toDataURL("image/png", 1.0);

      // A4 page dimensions
      const pageWidth = 210; // mm
      const pageHeight = 297; // mm

      if (i > 0) pdf.addPage();

      // Calculate image height to maintain aspect ratio at full page width
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      console.log(`Canvas: ${canvas.width}x${canvas.height}px, PDF: ${pageWidth}x${imgHeight.toFixed(2)}mm`);

      // Add image at full page width (210mm) with NO margins - starts at 0,0
      // If taller than page, it will overflow but we'll scale it to fit
      if (imgHeight > pageHeight) {
        // Scale down to fit one page
        const scale = pageHeight / imgHeight;
        const scaledWidth = pageWidth * scale;
        const scaledHeight = pageHeight;

        // Center horizontally if scaled
        const xOffset = (pageWidth - scaledWidth) / 2;
        pdf.addImage(imgData, "PNG", xOffset, 0, scaledWidth, scaledHeight);
        console.log(`Scaled to fit: ${scaledWidth.toFixed(2)}x${scaledHeight}mm`);
      } else {
        // Add at full width, no offset
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
        console.log(`Full width: ${pageWidth}x${imgHeight.toFixed(2)}mm`);
      }
    }

    console.log(`Saving PDF with ${totalCards} page(s)...`);
    pdf.save(`report-cards-${config.class}-${config.term}-${config.academicYear}.pdf`);
    setIsGenerating(false);
    setCurrentPreviewIndex(0);
    alert(`Successfully generated PDF with ${totalCards} report card(s)!`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGenerating(false);
      setCurrentPreviewIndex(0);
      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the browser console for details or try using the Print button instead.`);
    }
  };

  return (
    <MainLayout>
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

          .avoid-break {
            page-break-inside: avoid;
          }
        }

        /* Screen-only styles for preview */
        @media screen {
          .print-content {
            min-height: 297mm;
          }
        }
      `}</style>

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

                <div className={`grid grid-cols-1 ${settings.supportsMultipleLevels ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-5`}>
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
          {/* Actions - Print Control Bar */}
          <div className="no-print bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 shadow-lg sticky top-0 z-50 before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-white dark:before:bg-neutral-900 before:-z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left: Navigation */}
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep("config")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Config
                </Button>
                <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-lg px-4 py-2 border border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setCurrentPreviewIndex(Math.max(0, currentPreviewIndex - 1))}
                    disabled={currentPreviewIndex === 0 || isGenerating}
                    className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 min-w-[80px] text-center">
                    {currentPreviewIndex + 1} of {reportCards.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPreviewIndex(Math.min(reportCards.length - 1, currentPreviewIndex + 1))
                    }
                    disabled={currentPreviewIndex === reportCards.length - 1 || isGenerating}
                    className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Print Actions */}
              <div className="flex items-center gap-3">
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

          {/* Report Card Preview */}
          <div className="no-print bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 p-8 rounded-lg">
            <div
              ref={printRef}
              className="print-content bg-white w-[210mm] mx-auto shadow-2xl print:shadow-none print:w-full rounded-2xl overflow-hidden"
              style={{
                minHeight: "297mm",
                padding: "15mm 12mm"
              }}
            >
              {(() => {
                // Get tenant branding colors for the entire document
                const primaryColor = currentTenant?.branding?.primaryColor || '#2563eb';
                const secondaryColor = currentTenant?.branding?.secondaryColor || '#1e40af';

                return (
                <>
              {/* Decorative Border */}
              <div
                className="border-4 border-double rounded-xl"
                style={{
                  borderColor: primaryColor,
                  background: `linear-gradient(135deg, ${primaryColor}05, ${secondaryColor}05)`,
                  padding: "8mm"
                }}
              >
                {/* School Header with Bold Gradient Background */}
                <div
                  className="text-center relative rounded-xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    padding: "5mm 0",
                    marginBottom: "4mm"
                  }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
                    <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-30 translate-y-30"></div>
                  </div>

                  {/* School Logo */}
                  <div className="relative">
                    <div
                      className="w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center border-4 shadow-2xl"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                        borderColor: '#ffffff'
                      }}
                    >
                      <GraduationCap
                        className="w-10 h-10"
                        style={{ color: primaryColor }}
                      />
                    </div>

                    <h1 className="text-4xl font-black text-white mb-2 tracking-wide uppercase drop-shadow-lg">
                      {currentTenant?.name || settings.schoolName}
                    </h1>
                    {currentTenant?.branding?.motto && (
                      <p className="text-base text-white font-bold italic mb-2 px-6 py-1.5 inline-block bg-white/20 rounded-full backdrop-blur-sm">
                        "{currentTenant.branding.motto}"
                      </p>
                    )}
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs text-white font-semibold drop-shadow">
                        {currentTenant?.contact.address.line1}, {currentTenant?.contact.address.city}, {currentTenant?.contact.address.state}
                      </p>
                      <p className="text-xs text-white font-medium drop-shadow">
                        <span className="font-bold">Email:</span> {currentTenant?.contact.email} | <span className="font-bold">Phone:</span> {currentTenant?.contact.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Report Card Title Banner */}
                <div
                  className="text-center text-white rounded-xl shadow-lg relative overflow-hidden"
                  style={{
                    background: `linear-gradient(120deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
                    padding: "4mm",
                    marginBottom: "4mm"
                  }}
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 translate-y-20"></div>
                  </div>
                  <div className="relative">
                    <h2 className="text-4xl font-black tracking-wider uppercase mb-1 drop-shadow-lg">
                      Progress Report Card
                    </h2>
                    <p className="text-lg font-bold opacity-95 drop-shadow">
                      {config.term} - Academic Year {config.academicYear}
                    </p>
                  </div>
                </div>

                {/* Student Info */}
                <div
                  className="rounded-xl shadow-md border-2"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}10)`,
                    borderColor: primaryColor + '40',
                    padding: "4mm",
                    marginBottom: "4mm"
                  }}
                >
                  <div className="grid grid-cols-2 gap-3 text-sm student-info-section">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                        <span className="font-bold text-neutral-700 w-32 text-xs">Student Name:</span>
                        <span
                          className="font-black text-base"
                          style={{ color: primaryColor }}
                        >
                          {currentReportCard.student.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                        <span className="font-bold text-neutral-700 w-32 text-xs">Admission No:</span>
                        <span className="text-neutral-900 font-bold">{currentReportCard.student.rollNo}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                        <span className="font-bold text-neutral-700 w-32 text-xs">Class:</span>
                        <span className="text-neutral-900 font-bold">
                          {config.class}{config.section && ` - Section ${config.section}`}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                        <span className="font-bold text-neutral-700 w-32 text-xs">Gender:</span>
                        <span className="text-neutral-900 font-bold">{currentReportCard.student.gender}</span>
                      </div>
                      {config.includeAttendance && (
                        <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                          <span className="font-bold text-neutral-700 w-32 text-xs">Attendance:</span>
                          <span className="text-neutral-900 font-bold">
                            {currentReportCard.attendance.present}/{currentReportCard.attendance.total} Days
                          </span>
                        </div>
                      )}
                      <div
                        className="flex items-center gap-2 p-2 rounded-lg shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                        }}
                      >
                        <span className="font-bold text-white w-32 text-xs">Class Rank:</span>
                        <span className="font-black text-lg text-white drop-shadow">
                          {currentReportCard.rank} of {currentReportCard.totalStudents}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Performance Header */}
                <div style={{ marginBottom: "3mm" }}>
                  <div
                    className="text-base font-black text-white rounded-lg shadow-md"
                    style={{
                      background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                      padding: "2mm 3mm"
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Academic Performance</span>
                    </div>
                  </div>
                </div>

                {/* Grades Table */}
                <div className="rounded-lg overflow-hidden shadow-md border-2" style={{
                  borderColor: primaryColor + '30',
                  marginBottom: "3mm"
                }}>
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr
                        className="text-white"
                        style={{
                          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
                        }}
                      >
                        <th className="p-2 text-left font-black text-sm">Subject</th>
                        <th className="p-2 text-center font-black text-sm">Max Marks</th>
                        <th className="p-2 text-center font-black text-sm">Marks Obtained</th>
                        <th className="p-2 text-center font-black text-sm">Grade</th>
                        {config.includeRemarks && (
                          <th className="p-2 text-left font-black text-sm">Remarks</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentReportCard.subjects.map((subject, index) => (
                        <tr
                          key={index}
                          className="border-b transition-all"
                          style={{
                            background: index % 2 === 0
                              ? `linear-gradient(90deg, ${primaryColor}05, ${secondaryColor}03)`
                              : '#ffffff',
                            borderColor: primaryColor + '15'
                          }}
                        >
                          <td className="p-2 font-bold text-neutral-900 text-sm">{subject.subject}</td>
                          <td className="p-2 text-center text-neutral-700 font-semibold text-xs">
                            {subject.maxScore}
                          </td>
                          <td className="p-2 text-center font-black text-sm" style={{ color: secondaryColor }}>
                            {subject.score}
                          </td>
                          <td className="p-2 text-center">
                            <span
                              className="font-black text-sm px-2 py-1 rounded-full text-white shadow-sm inline-block"
                              style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                              }}
                            >
                              {subject.grade}
                            </span>
                          </td>
                          {config.includeRemarks && (
                            <td className="p-2 text-xs italic text-neutral-600 font-medium">
                              {subject.remarks}
                            </td>
                          )}
                        </tr>
                      ))}
                      <tr
                        className="font-bold border-t-2"
                        style={{
                          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                          borderColor: primaryColor
                        }}
                      >
                        <td className="p-2 text-sm uppercase text-white font-black">Grand Total</td>
                        <td className="p-2 text-center text-xs text-white font-bold">
                          {currentReportCard.subjects.reduce((sum, s) => sum + s.maxScore, 0)}
                        </td>
                        <td className="p-2 text-center text-base text-white font-black">
                          {currentReportCard.totalMarks}
                        </td>
                        <td className="p-2 text-center text-base text-white font-black" colSpan={config.includeRemarks ? 2 : 1}>
                          {currentReportCard.percentage.toFixed(2)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Overall Performance Summary */}
                <div
                  className="rounded-lg overflow-hidden shadow-md border-2"
                  style={{
                    borderColor: primaryColor,
                    background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`,
                    marginBottom: "3mm"
                  }}
                >
                  {/* Header */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      background: `linear-gradient(120deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
                      padding: "2mm 3mm"
                    }}
                  >
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
                    </div>
                    <h3 className="text-base font-black text-white uppercase tracking-wide text-center relative drop-shadow-lg">
                      Overall Performance Summary
                    </h3>
                  </div>

                  {/* Content Grid */}
                  <div style={{ padding: "3mm" }}>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Circular Grade Badge */}
                      <div className="col-span-1 flex items-center justify-center">
                        <div className="relative">
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                            }}
                          >
                            <div className="text-center">
                              <div className="text-3xl font-black text-white drop-shadow-lg">
                                {currentReportCard.overallGrade}
                              </div>
                              <div className="text-xs font-black text-white/90 uppercase">
                                Grade
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="col-span-2 space-y-2">
                        {/* Percentage Score with Gradient Bar */}
                        <div>
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-black text-neutral-800 uppercase">Percentage Score</span>
                            <span
                              className="text-2xl font-black"
                              style={{ color: primaryColor }}
                            >
                              {currentReportCard.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className="h-3 rounded-full shadow-sm"
                              style={{
                                width: `${currentReportCard.percentage}%`,
                                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Total Marks Card */}
                          <div
                            className="rounded-lg p-2 shadow-sm border relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}15, #ffffff)`,
                              borderColor: primaryColor + '40'
                            }}
                          >
                            <p className="text-xs font-black text-neutral-600 uppercase mb-1">
                              Total Marks
                            </p>
                            <p className="text-lg font-black" style={{ color: primaryColor }}>
                              {currentReportCard.totalMarks}
                              <span className="text-xs font-bold text-neutral-500">
                                /{currentReportCard.subjects.reduce((sum, s) => sum + s.maxScore, 0)}
                              </span>
                            </p>
                          </div>

                          {/* Performance Status Card */}
                          <div
                            className="rounded-lg p-2 shadow-sm text-white relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                            }}
                          >
                            <p className="text-xs font-black uppercase mb-1">
                              Performance Status
                            </p>
                            <p className="text-sm font-black">
                              {currentReportCard.percentage >= 90 ? "Outstanding" :
                               currentReportCard.percentage >= 75 ? "Excellent" :
                               currentReportCard.percentage >= 60 ? "Good" :
                               currentReportCard.percentage >= 50 ? "Satisfactory" : "Needs Improvement"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conduct & Behavior */}
                {config.includeConduct && (
                  <div style={{ marginBottom: "3mm" }}>
                    <div style={{ marginBottom: "2mm" }}>
                      <div
                        className="text-base font-black text-white rounded-lg shadow-md"
                        style={{
                          background: `linear-gradient(90deg, #10b981, #059669)`,
                          padding: "2mm 3mm"
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>Conduct & Behavior Assessment</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {/* Behavior Card */}
                      <div className="rounded-lg shadow-md p-2 text-center relative overflow-hidden" style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)'
                      }}>
                        <div className="w-8 h-8 mx-auto mb-1 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-white mb-1 font-black uppercase text-xs">Behavior</p>
                        <p className="font-black text-base text-white">{currentReportCard.conduct.behavior}</p>
                      </div>

                      {/* Discipline Card */}
                      <div className="rounded-lg shadow-md p-2 text-center relative overflow-hidden" style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                      }}>
                        <div className="w-8 h-8 mx-auto mb-1 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <UserCheck className="w-4 h-4" style={{ color: primaryColor }} />
                        </div>
                        <p className="text-white mb-1 font-black uppercase text-xs">Discipline</p>
                        <p className="font-black text-base text-white">{currentReportCard.conduct.discipline}</p>
                      </div>

                      {/* Participation Card */}
                      <div className="rounded-lg shadow-md p-2 text-center relative overflow-hidden" style={{
                        background: 'linear-gradient(135deg, #a855f7, #9333ea)'
                      }}>
                        <div className="w-8 h-8 mx-auto mb-1 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-white mb-1 font-black uppercase text-xs">Participation</p>
                        <p className="font-black text-base text-white">{currentReportCard.conduct.participation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remarks */}
                {config.includeRemarks && (
                  <div className="space-y-2 text-xs" style={{ marginBottom: "3mm" }}>
                    {/* Teacher's Remarks */}
                    <div className="rounded-lg overflow-hidden shadow-md border" style={{ borderColor: primaryColor + '40' }}>
                      <div
                        className="text-white font-black flex items-center gap-2 text-sm"
                        style={{
                          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                          padding: "2mm 3mm"
                        }}
                      >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <MessageSquare className="w-3 h-3" style={{ color: primaryColor }} />
                        </div>
                        <span>Class Teacher's Remarks</span>
                      </div>
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}08, #ffffff)`,
                          padding: "2mm 3mm"
                        }}
                      >
                        <p className="text-neutral-800 italic font-medium text-xs leading-relaxed">
                          {currentReportCard.teacherRemarks}
                        </p>
                      </div>
                    </div>

                    {/* Principal's Remarks */}
                    <div className="rounded-lg overflow-hidden shadow-md border" style={{ borderColor: '#a855f740' }}>
                      <div
                        className="text-white font-black flex items-center gap-2 text-sm"
                        style={{
                          background: 'linear-gradient(90deg, #a855f7, #9333ea)',
                          padding: "2mm 3mm"
                        }}
                      >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <GraduationCap className="w-3 h-3 text-purple-600" />
                        </div>
                        <span>Principal's Remarks</span>
                      </div>
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #a855f708, #ffffff)',
                          padding: "2mm 3mm"
                        }}
                      >
                        <p className="text-neutral-800 italic font-medium text-xs leading-relaxed">
                          {currentReportCard.principalRemarks}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Signatures Section */}
                <div style={{ marginTop: "5mm", paddingTop: "3mm" }}>
                  <div style={{ marginBottom: "3mm" }}>
                    <h3 className="text-base font-bold text-center uppercase tracking-wide text-neutral-900">
                      Official Signatures & Authentication
                    </h3>
                  </div>

                  {/* Dotted separator */}
                  <div className="border-t-2 border-dotted border-neutral-300" style={{ marginBottom: "3mm" }}></div>

                  <div className="grid grid-cols-3 gap-3 text-sm" style={{ marginBottom: "3mm" }}>
                    {/* Class Teacher */}
                    <div className="text-center">
                      <div className="h-12 mb-2 bg-neutral-100 rounded"></div>
                      <div className="py-2">
                        <p className="font-bold text-neutral-900 text-sm">Class Teacher</p>
                        <p className="text-xs text-neutral-600 mt-0.5">Signature & Date</p>
                      </div>
                    </div>

                    {/* Parent/Guardian */}
                    <div className="text-center">
                      <div className="h-12 mb-2 bg-neutral-100 rounded"></div>
                      <div className="py-2">
                        <p className="font-bold text-neutral-900 text-sm">Parent/Guardian</p>
                        <p className="text-xs text-neutral-600 mt-0.5">Signature & Date</p>
                      </div>
                    </div>

                    {/* Principal */}
                    <div className="text-center">
                      <div className="h-12 mb-2 bg-neutral-100 rounded"></div>
                      <div className="py-2">
                        <p className="font-bold text-neutral-900 text-sm">
                          {currentTenant?.branding?.signatures?.principalName || "Prof. Chioma Okonkwo"}
                        </p>
                        <p className="text-xs text-neutral-600 mt-0.5">
                          {currentTenant?.branding?.signatures?.principalTitle || "Principal"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dotted separator */}
                  <div className="border-t-2 border-dotted border-neutral-300" style={{ marginBottom: "2mm" }}></div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: "2mm", paddingTop: "2mm" }} className="text-center">
                  <p className="text-xs font-bold text-neutral-900 mb-1 uppercase tracking-wide">
                    ⭕ Official Document ⭕
                  </p>
                  <p className="text-xs text-neutral-700">
                    This is an official academic document issued by {currentTenant?.name || settings.schoolName}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    Generated on: {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
}
