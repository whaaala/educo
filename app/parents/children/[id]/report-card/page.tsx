"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import Button from "@/components/shared/Button";
import FormDropdown from "@/components/shared/FormDropdown";
import ReportCardTemplate from "@/components/reports/ReportCardTemplate";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Download,
  Printer,
  AlertCircle,
  UserCheck,
  Calendar,
  GraduationCap,
} from "lucide-react";
import type { ParentChild, ChildAcademicSummary } from "@/types/parent";

// Mock Data (same as parent page)
const MOCK_CHILDREN: Record<string, ParentChild> = {
  "child-001": {
    id: "child-001",
    studentId: "STU-2024-001",
    firstName: "Adaeze",
    lastName: "Okonkwo",
    fullName: "Adaeze Okonkwo",
    admissionNumber: "ADM-2024-0145",
    classLevel: "JSS 2",
    section: "A",
    profilePhoto: "https://i.pravatar.cc/150?u=adaeze",
    dateOfBirth: "2012-03-15",
    gender: "Female",
    status: "Active",
    relationship: "Father",
  },
  "child-002": {
    id: "child-002",
    studentId: "STU-2024-002",
    firstName: "Chukwuemeka",
    lastName: "Okonkwo",
    fullName: "Chukwuemeka Okonkwo",
    admissionNumber: "ADM-2024-0089",
    classLevel: "SS 1",
    section: "B",
    profilePhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    dateOfBirth: "2009-07-22",
    gender: "Male",
    status: "Active",
    relationship: "Father",
  },
};

const MOCK_ACADEMIC_SUMMARY: Record<string, ChildAcademicSummary> = {
  "child-001": {
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    classLevel: "JSS 2",
    currentTermAverage: 78.5,
    classPosition: 5,
    totalStudents: 45,
    subjectPerformance: [
      { subject: "Mathematics", score: 85, grade: "A", teacherRemarks: "Excellent problem-solving skills" },
      { subject: "English Language", score: 78, grade: "B", teacherRemarks: "Good comprehension, needs to improve writing" },
      { subject: "Basic Science", score: 72, grade: "B", teacherRemarks: "Shows keen interest" },
      { subject: "Social Studies", score: 80, grade: "A", teacherRemarks: "Very participative" },
      { subject: "Civic Education", score: 75, grade: "B", teacherRemarks: "Good understanding of concepts" },
      { subject: "Computer Studies", score: 88, grade: "A", teacherRemarks: "Outstanding performance" },
      { subject: "French", score: 70, grade: "B", teacherRemarks: "Improving steadily" },
      { subject: "Creative Arts", score: 82, grade: "A", teacherRemarks: "Very creative" },
    ],
    overallRemarks: "Adaeze is a bright and hardworking student. She shows great potential and is a positive influence in class.",
    conductGrade: "A",
  },
  "child-002": {
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    classLevel: "SS 1",
    currentTermAverage: 82.3,
    classPosition: 3,
    totalStudents: 52,
    subjectPerformance: [
      { subject: "Mathematics", score: 88, grade: "A", teacherRemarks: "Exceptional analytical skills" },
      { subject: "Physics", score: 80, grade: "A", teacherRemarks: "Good practical understanding" },
      { subject: "Chemistry", score: 79, grade: "B", teacherRemarks: "Needs more practice in calculations" },
      { subject: "Biology", score: 85, grade: "A", teacherRemarks: "Excellent understanding of concepts" },
      { subject: "English Language", score: 78, grade: "B", teacherRemarks: "Good communication skills" },
      { subject: "Further Mathematics", score: 82, grade: "A", teacherRemarks: "Shows great potential" },
      { subject: "Data Processing", score: 90, grade: "A", teacherRemarks: "Outstanding" },
    ],
    overallRemarks: "Chukwuemeka is a dedicated student with excellent academic performance. He is focused and determined.",
    conductGrade: "A",
  },
};

const MOCK_ATTENDANCE: Record<string, { present: number; absent: number; late: number; total: number; rate: number }> = {
  "child-001": { present: 42, absent: 3, late: 2, total: 47, rate: 89.4 },
  "child-002": { present: 45, absent: 1, late: 1, total: 47, rate: 95.7 },
};

type Term = "First Term" | "Second Term" | "Third Term";

const TERMS: Term[] = ["First Term", "Second Term", "Third Term"];
const currentYear = new Date().getFullYear();
const ACADEMIC_YEARS = Array.from({ length: 3 }, (_, i) => (currentYear - 1 + i).toString());

function ResponsiveReportPreview({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const compute = () => {
      // Use offset* so transforms don't affect measurement
      const containerWidth = container.clientWidth;
      const contentWidth = content.offsetWidth;
      const contentHeight = content.offsetHeight;
      if (!containerWidth || !contentWidth || !contentHeight) return;

      const nextScale = Math.min(1, containerWidth / contentWidth);
      setScale(nextScale);
      setScaledHeight(contentHeight * nextScale);
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(container);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* Reserve vertical space so layout doesn't jump when scaling */}
      <div style={{ height: scaledHeight ?? undefined }} className="w-full">
        <div
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
          className="w-full flex justify-center"
        >
          <div ref={contentRef}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ReportCardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const childId = params?.id as string;
  const fromResults = searchParams.get("from") === "results";
  const highlightedSubject = searchParams.get("subject");
  const { settings, currentTenant } = useSchoolSettings();
  const printRef = useRef<HTMLDivElement>(null);

  const [selectedTerm, setSelectedTerm] = useState<Term>("First Term");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const child = MOCK_CHILDREN[childId];
  const academicData = MOCK_ACADEMIC_SUMMARY[childId];
  const attendanceData = MOCK_ATTENDANCE[childId];
  const previewKey = useMemo(() => `${childId}-${selectedTerm}-${selectedYear}`, [childId, selectedTerm, selectedYear]);

  // Scroll to highlighted subject when navigating from dashboard
  useEffect(() => {
    if (highlightedSubject) {
      const subjectSlug = highlightedSubject.toLowerCase().replace(/\s+/g, "-");
      // Wait for content to render
      const timer = setTimeout(() => {
        const element = document.getElementById(`subject-${subjectSlug}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 800); // Delay to allow page content to load
      return () => clearTimeout(timer);
    }
  }, [highlightedSubject]);

  // Handle print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Report-Card-${child?.fullName}-${selectedTerm}-${selectedYear}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0 !important;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          background: white !important;
          overflow: hidden !important;
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
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          max-height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          page-break-inside: avoid !important;
        }
      }
    `,
  });

  // Handle PDF download - generates PDF using jsPDF
  const handleDownloadPDF = () => {
    if (!child || !academicData) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 0;

    // Get branding colors
    const primaryColor = currentTenant?.branding?.primaryColor || "#2563eb";

    // Helper to convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 37, g: 99, b: 235 };
    };

    const primary = hexToRgb(primaryColor);

    // Header background
    pdf.setFillColor(primary.r, primary.g, primary.b);
    pdf.rect(0, 0, pageWidth, 28, "F");

    // School name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(currentTenant?.name || settings.schoolName, pageWidth / 2, 12, { align: "center" });

    // School motto
    if (currentTenant?.branding?.motto) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      pdf.text(`"${currentTenant.branding.motto}"`, pageWidth / 2, 18, { align: "center" });
    }

    // School contact
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    const contactLine = `${currentTenant?.contact?.address?.line1 || "123 Education Avenue"}, ${currentTenant?.contact?.address?.city || "Lagos"} | ${currentTenant?.contact?.email || "info@school.edu"} | ${currentTenant?.contact?.phone || "+234 123 456 7890"}`;
    pdf.text(contactLine, pageWidth / 2, 24, { align: "center" });

    // Report Card Title Banner
    y = 28;
    pdf.setFillColor(29, 78, 216);
    pdf.rect(0, y, pageWidth, 14, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROGRESS REPORT CARD", pageWidth / 2, y + 6, { align: "center" });
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${selectedTerm} - Academic Year ${selectedYear}`, pageWidth / 2, y + 11, { align: "center" });

    // Student Info Section
    y = 48;
    pdf.setDrawColor(226, 232, 240);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");

    // Row 1
    pdf.text("Name:", margin + 4, y + 7);
    pdf.setTextColor(primary.r, primary.g, primary.b);
    pdf.setFont("helvetica", "bold");
    pdf.text(child.fullName, margin + 18, y + 7);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Gender:", margin + 65, y + 7);
    pdf.setTextColor(30, 41, 59);
    pdf.setFont("helvetica", "bold");
    pdf.text(child.gender, margin + 82, y + 7);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Attendance:", margin + 125, y + 7);
    pdf.setTextColor(22, 163, 74);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${attendanceData?.present || 0}/${attendanceData?.total || 0}`, margin + 148, y + 7);

    // Row 2
    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Adm No:", margin + 4, y + 18);
    pdf.setTextColor(primary.r, primary.g, primary.b);
    pdf.setFont("helvetica", "bold");
    pdf.text(child.admissionNumber, margin + 22, y + 18);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Class:", margin + 65, y + 18);
    pdf.setTextColor(30, 41, 59);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${child.classLevel}${child.section ? ` - ${child.section}` : ""}`, margin + 78, y + 18);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Rank:", margin + 125, y + 18);
    pdf.setTextColor(220, 38, 38);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${academicData.classPosition} of ${academicData.totalStudents}`, margin + 138, y + 18);

    // Academic Performance Title
    y = 78;
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Academic Performance", margin, y);

    // Table Header
    y = 84;
    pdf.setFillColor(primary.r, primary.g, primary.b);
    pdf.rect(margin, y, contentWidth, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("Subject", margin + 4, y + 5.5);
    pdf.text("Max", margin + 58, y + 5.5);
    pdf.text("Obtained", margin + 75, y + 5.5);
    pdf.text("Grade", margin + 100, y + 5.5);
    pdf.text("Remarks", margin + 120, y + 5.5);

    // Table Rows
    y = 92;
    const rowHeight = 8;
    const subjects = academicData.subjectPerformance;
    let totalMarks = 0;
    let maxTotalMarks = 0;

    const getGradeColor = (score: number) => {
      if (score >= 80) return { r: 22, g: 163, b: 74 }; // green
      if (score >= 70) return { r: 37, g: 99, b: 235 }; // blue
      if (score >= 60) return { r: 202, g: 138, b: 4 }; // yellow
      if (score >= 50) return { r: 234, g: 88, b: 12 }; // orange
      return { r: 220, g: 38, b: 38 }; // red
    };

    subjects.forEach((subject, idx) => {
      const isEven = idx % 2 === 0;
      if (isEven) {
        pdf.setFillColor(255, 255, 255);
      } else {
        pdf.setFillColor(248, 250, 252);
      }
      pdf.rect(margin, y, contentWidth, rowHeight, "F");
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

      // Subject name
      pdf.setTextColor(primary.r, primary.g, primary.b);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text(subject.subject, margin + 4, y + 5.5);

      // Max score
      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "normal");
      pdf.text("100", margin + 60, y + 5.5);

      // Obtained score
      const gradeColor = getGradeColor(subject.score);
      pdf.setTextColor(gradeColor.r, gradeColor.g, gradeColor.b);
      pdf.setFont("helvetica", "bold");
      pdf.text(subject.score.toString(), margin + 80, y + 5.5);

      // Grade badge
      pdf.setFillColor(gradeColor.r, gradeColor.g, gradeColor.b);
      pdf.roundedRect(margin + 98, y + 1.5, 12, 5, 1, 1, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text(subject.grade, margin + 104, y + 5, { align: "center" });

      // Remarks
      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(8);
      const remarks = subject.teacherRemarks || "Good progress";
      pdf.text(remarks.substring(0, 35) + (remarks.length > 35 ? "..." : ""), margin + 120, y + 5.5);

      totalMarks += subject.score;
      maxTotalMarks += 100;
      y += rowHeight;
    });

    // Total Row
    pdf.setFillColor(primary.r, primary.g, primary.b);
    pdf.rect(margin, y, contentWidth, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL", margin + 4, y + 5.5);
    pdf.text(maxTotalMarks.toString(), margin + 60, y + 5.5);
    pdf.text(totalMarks.toString(), margin + 80, y + 5.5);
    const percentage = (totalMarks / maxTotalMarks) * 100;
    pdf.text(`${percentage.toFixed(1)}%`, margin + 100, y + 5.5);

    // Overall Grade Section
    y += 14;
    pdf.setFillColor(219, 234, 254);
    pdf.setDrawColor(147, 197, 253);
    pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, "FD");

    // Grade circle
    pdf.setFillColor(primary.r, primary.g, primary.b);
    pdf.circle(margin + 12, y + 10, 7, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    const overallGrade = percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : "F";
    pdf.text(overallGrade, margin + 12, y + 12, { align: "center" });

    // Overall Grade text
    pdf.setTextColor(29, 78, 216);
    pdf.setFontSize(10);
    pdf.text("Overall Grade", margin + 24, y + 8);
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    const gradeStatus = percentage >= 80 ? "Excellent" : percentage >= 70 ? "Very Good" : percentage >= 60 ? "Good" : percentage >= 50 ? "Satisfactory" : "Needs Improvement";
    pdf.text(gradeStatus, margin + 24, y + 14);

    // Percentage and Total
    pdf.setTextColor(29, 78, 216);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${percentage.toFixed(1)}%`, margin + 130, y + 10);
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(7);
    pdf.text("Percentage", margin + 130, y + 15);

    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(11);
    pdf.text(`${totalMarks}/${maxTotalMarks}`, margin + 158, y + 10);
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(7);
    pdf.text("Total Marks", margin + 158, y + 15);

    // Conduct Section
    y += 26;
    const conductWidth = (contentWidth - 8) / 3;
    const conductItems = [
      { label: "Behavior", value: "Excellent" },
      { label: "Discipline", value: "Very Good" },
      { label: "Participation", value: "Excellent" },
    ];
    conductItems.forEach((item, idx) => {
      const x = margin + idx * (conductWidth + 4);
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(x, y, conductWidth, 14, 2, 2, "FD");
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(item.label, x + conductWidth / 2, y + 5, { align: "center" });
      pdf.setTextColor(primary.r, primary.g, primary.b);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(item.value, x + conductWidth / 2, y + 11, { align: "center" });
    });

    // Remarks Section
    y += 20;
    const remarksWidth = (contentWidth - 4) / 2;

    // Teacher Remarks
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("Class Teacher's Remarks:", margin, y);
    y += 4;
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, y, remarksWidth, 16, 2, 2, "FD");
    pdf.setTextColor(71, 85, 105);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    const teacherRemarks = academicData.overallRemarks || "Good academic performance. Keep up the excellent work!";
    const splitTeacher = pdf.splitTextToSize(teacherRemarks, remarksWidth - 8);
    pdf.text(splitTeacher.slice(0, 2), margin + 4, y + 6);

    // Principal Remarks
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("Principal's Remarks:", margin + remarksWidth + 4, y - 4);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin + remarksWidth + 4, y, remarksWidth, 16, 2, 2, "FD");
    pdf.setTextColor(71, 85, 105);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    const principalRemarks = "Congratulations on your achievement. Keep up the excellent work!";
    const splitPrincipal = pdf.splitTextToSize(principalRemarks, remarksWidth - 8);
    pdf.text(splitPrincipal.slice(0, 2), margin + remarksWidth + 8, y + 6);

    // Signatures Section
    y += 24;
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("OFFICIAL SIGNATURES", pageWidth / 2, y, { align: "center" });

    y += 6;
    const sigWidth = (contentWidth - 8) / 3;
    const signatures = [
      { title: "Class Teacher", sub: "Signature" },
      { title: "Parent/Guardian", sub: "Signature" },
      { title: currentTenant?.branding?.signatures?.principalName || "Principal", sub: "Principal" },
    ];
    signatures.forEach((sig, idx) => {
      const x = margin + idx * (sigWidth + 4);
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(x, y, sigWidth, 18, 2, 2, "FD");

      // Signature line
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineDashPattern([2, 2], 0);
      pdf.line(x + 8, y + 8, x + sigWidth - 8, y + 8);
      pdf.setLineDashPattern([], 0);

      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text(sig.title, x + sigWidth / 2, y + 13, { align: "center" });
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text(sig.sub, x + sigWidth / 2, y + 16, { align: "center" });
    });

    // Footer
    y = pageHeight - 12;
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, y - 4, pageWidth - margin, y - 4);
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, y - 4, pageWidth, 16, "F");
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    const footerText = `Official document issued by ${currentTenant?.name || settings.schoolName} | Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`;
    pdf.text(footerText, pageWidth / 2, y + 2, { align: "center" });

    // Save PDF
    pdf.save(`Report-Card-${child.fullName}-${selectedTerm}-${selectedYear}.pdf`);
  };

  if (!child) {
    return (
      <DashboardPage
        title="Student Not Found"
        breadcrumbs={[
          { label: "Parent Portal", href: "/parents" },
          { label: "My Children", href: "/parents/children" },
          { label: "Report Card", isActive: true },
        ]}
        loadingText="Loading Report Card"
        afterStats={
          <div className="mt-6 flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
              Student Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-6">
              The student you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/parents/children">
              <Button variant="primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Children
              </Button>
            </Link>
          </div>
        }
      />
    );
  }

  // Get branding colors
  const primaryColor = currentTenant?.branding?.primaryColor || '#2563eb';
  const secondaryColor = currentTenant?.branding?.secondaryColor || '#1e40af';

  // Transform subject data for the shared template
  const subjects = academicData?.subjectPerformance.map(s => ({
    subject: s.subject,
    score: s.score,
    grade: s.grade,
    teacherRemarks: s.teacherRemarks,
    maxScore: 100,
  })) || [];

  const breadcrumbs = fromResults
    ? [
        { label: "Parent Portal", href: "/parents" },
        { label: "Exam Results", href: "/parents/results" },
        { label: child.fullName },
      ]
    : [
        { label: "Parent Portal", href: "/parents" },
        { label: "My Children", href: "/parents/children" },
        { label: child.firstName, href: `/parents/children/${child.id}` },
        { label: "Report Card" },
      ];

  return (
    <DashboardPage
      title="Report Card"
      breadcrumbs={breadcrumbs}
      loadingText="Loading Report Card"
      pageLoadDuration={600}
      afterStats={
        <>
          {/* Print Styles */}
          <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0 !important;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            background: white !important;
            overflow: hidden !important;
          }

          /* Hide everything */
          body > * {
            display: none !important;
          }

          /* Show print content */
          .print-content {
            display: flex !important;
            flex-direction: column !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
          }

          .print-content,
          .print-content * {
            visibility: visible !important;
          }

          /* Hide no-print elements */
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          /* Ensure colors print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Tables full width */
          table {
            page-break-inside: avoid;
            border-collapse: collapse !important;
            width: 100% !important;
          }

          tr {
            page-break-inside: avoid;
          }

          thead {
            display: table-header-group;
          }

          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>

          <div className="mt-6 space-y-6">

        {/* Modern Report Card Controls */}
        <div className="no-print relative rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-800/95 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]">
          {/* Subtle gradient accent line at top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent rounded-t-2xl" />

          <div className="relative px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Section: Student + Period */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 lg:gap-5 min-w-0">
                {/* Student Card */}
                <div className="flex items-center gap-3 pr-0 sm:pr-4 lg:pr-5 sm:border-r border-slate-200/70 dark:border-slate-700/50 min-w-0">
                  <div
                    className="relative cursor-pointer group/avatar flex-shrink-0 w-11 h-11 z-10"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.zIndex = '9999';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.zIndex = '10';
                    }}
                  >
                    <Image
                      src={child.profilePhoto || `https://i.pravatar.cc/150?u=${child.id}`}
                      alt={child.fullName}
                      width={44}
                      height={44}
                      className="absolute inset-0 w-11 h-11 rounded-xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-md transition-all duration-300 ease-out group-hover/avatar:scale-[2.5] group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 group-hover/avatar:rounded-2xl"
                      style={{ transformOrigin: 'left center' }}
                      unoptimized
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center transition-opacity duration-300 group-hover/avatar:opacity-0">
                      <UserCheck className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{child.fullName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-medium">
                        {child.classLevel}{child.section && `-${child.section}`}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="truncate">{child.admissionNumber}</span>
                    </p>
                  </div>
                </div>

                {/* Period Selection */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <div className="w-full sm:w-32">
                    <FormDropdown
                      label=""
                      icon={<Calendar className="w-full h-full" />}
                      value={selectedTerm}
                      onChange={(value) => setSelectedTerm(value as Term)}
                      options={TERMS.map((term) => ({ value: term, label: term }))}
                      placeholder="Select term"
                    />
                  </div>
                  <div className="w-full sm:w-28">
                    <FormDropdown
                      label=""
                      icon={<GraduationCap className="w-full h-full" />}
                      value={selectedYear}
                      onChange={setSelectedYear}
                      options={ACADEMIC_YEARS.map((year) => ({ value: year, label: year }))}
                      placeholder="Select year"
                    />
                  </div>
                </div>

                {/* Stats Pills - Desktop */}
                <div className="hidden xl:flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      {academicData?.currentTermAverage?.toFixed(1) || 0}% avg
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/20">
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                      #{academicData?.classPosition}
                    </span>
                    <span className="text-xs text-blue-600/70 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400/70">rank</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200/60 dark:border-violet-500/20">
                    <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                      {academicData?.conductGrade}
                    </span>
                    <span className="text-xs text-violet-600/70 dark:text-violet-400/70">conduct</span>
                  </div>
                </div>
              </div>

              {/* Right Section: Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="gap-2 w-full sm:w-auto justify-center"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  variant="primary"
                  className="gap-2 w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </Button>
              </div>
            </div>

            {/* Mobile/Tablet Stats Row */}
            <div className="xl:hidden flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/40">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {academicData?.currentTermAverage?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/20">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                  #{academicData?.classPosition}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200/60 dark:border-violet-500/20">
                <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                  {academicData?.conductGrade}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Card Preview (screen): scale-to-fit, no horizontal scrolling */}
        <div className="no-print -mx-4 sm:mx-0 px-4 sm:px-0">
          <ResponsiveReportPreview key={previewKey}>
            <ReportCardTemplate
              ref={printRef}
            // School Info
            schoolName={currentTenant?.name || settings.schoolName}
            schoolMotto={currentTenant?.branding?.motto}
            schoolLogo={currentTenant?.branding?.logo}
            schoolAddress={{
              line1: currentTenant?.contact?.address?.line1 || "123 Education Avenue",
              city: currentTenant?.contact?.address?.city || "Lagos",
              state: currentTenant?.contact?.address?.state || "Nigeria",
            }}
            schoolContact={{
              email: currentTenant?.contact?.email || "info@school.edu",
              phone: currentTenant?.contact?.phone || "+234 123 456 7890",
            }}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            principalName={currentTenant?.branding?.signatures?.principalName || "Principal"}
            principalTitle={currentTenant?.branding?.signatures?.principalTitle || "Principal"}
            classTeacherTitle={currentTenant?.branding?.signatures?.classTeacherTitle}
            // Student Info
            studentName={child.fullName}
            admissionNumber={child.admissionNumber}
            classLevel={child.classLevel}
            section={child.section}
            gender={child.gender}
            dateOfBirth={child.dateOfBirth}
            studentPhoto={child.profilePhoto}
            // Academic Info
            term={selectedTerm}
            academicYear={selectedYear}
            subjects={subjects}
            classPosition={academicData?.classPosition}
            totalStudents={academicData?.totalStudents}
            conductGrade={academicData?.conductGrade}
            // Optional Sections
            attendance={attendanceData ? {
              present: attendanceData.present,
              absent: attendanceData.absent,
              late: attendanceData.late,
              total: attendanceData.total,
              rate: attendanceData.rate,
            } : undefined}
            conduct={{
              behavior: "Excellent",
              discipline: "Very Good",
              participation: "Excellent",
              punctuality: "Good",
              neatness: "Excellent",
            }}
            teacherRemarks={academicData?.overallRemarks}
            principalRemarks="Congratulations on your achievement. Keep up the excellent work!"
            // Display Options - Parent always sees all sections
            includeRemarks={true}
            includeAttendance={true}
            includeConduct={true}
            // Viewer context
            viewerType="parent"
            // Tenant-level report card configuration
            config={currentTenant?.branding?.reportCardConfig}
            // Highlighted subject from dashboard navigation
            highlightedSubject={highlightedSubject || undefined}
            />
          </ResponsiveReportPreview>
        </div>

        {/* Parent Portal Notice */}
        <div className="no-print relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/80 via-green-50/50 to-teal-50/30 dark:from-emerald-900/20 dark:via-green-900/15 dark:to-teal-900/10 ring-1 ring-emerald-100/80 dark:ring-emerald-800/40 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/30 via-green-200/20 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">Parent Portal View</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                You are viewing your child&apos;s report card through the Parent Portal.
                Use the Print or Download options above to save a copy for your records.
              </p>
            </div>
          </div>
        </div>
          </div>
        </>
      }
    />
  );
}
