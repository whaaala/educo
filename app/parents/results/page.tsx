"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import StatCard from "@/components/shared/StatCard";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import jsPDF from "jspdf";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  BookOpen,
  Trophy,
  Target,
  FileText,
} from "lucide-react";

// Exam result type matching the widget
interface ExamResult {
  id: string;
  childId: string;
  childName: string;
  childPhoto: string;
  class: string;
  section: string;
  examType: string;
  examDate: string;
  academicYear: string;
  term: string;
  percentage: number;
  status: "pass" | "fail";
}

// Child academic data for report card generation
interface ChildAcademicData {
  fullName: string;
  admissionNumber: string;
  classLevel: string;
  section: string;
  gender: string;
  classPosition: number;
  totalStudents: number;
  attendance: { present: number; total: number };
  subjectPerformance: {
    subject: string;
    score: number;
    grade: string;
    teacherRemarks: string;
  }[];
  overallRemarks: string;
}

// Mock academic data by child ID
const MOCK_ACADEMIC_DATA: Record<string, ChildAcademicData> = {
  "child-001": {
    fullName: "Adaeze Okonkwo",
    admissionNumber: "ADM-2024-0145",
    classLevel: "JSS 2",
    section: "A",
    gender: "Female",
    classPosition: 5,
    totalStudents: 45,
    attendance: { present: 42, total: 47 },
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
  },
  "child-002": {
    fullName: "Chukwuemeka Okonkwo",
    admissionNumber: "ADM-2024-0089",
    classLevel: "SS 1",
    section: "B",
    gender: "Male",
    classPosition: 3,
    totalStudents: 52,
    attendance: { present: 45, total: 47 },
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
  },
};

// Mock Data
const MOCK_RESULTS: ExamResult[] = [
  {
    id: "result-001",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    examType: "Mid-Term",
    examDate: "2024-02-15",
    academicYear: "2024/2025",
    term: "2nd Term",
    percentage: 85,
    status: "pass",
  },
  {
    id: "result-002",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "SS 1",
    section: "B",
    examType: "Mid-Term",
    examDate: "2024-02-15",
    academicYear: "2024/2025",
    term: "2nd Term",
    percentage: 78,
    status: "pass",
  },
  {
    id: "result-003",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    examType: "Final Exam",
    examDate: "2023-12-10",
    academicYear: "2024/2025",
    term: "1st Term",
    percentage: 83,
    status: "pass",
  },
  {
    id: "result-004",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "SS 1",
    section: "B",
    examType: "Final Exam",
    examDate: "2023-12-10",
    academicYear: "2024/2025",
    term: "1st Term",
    percentage: 75,
    status: "pass",
  },
  {
    id: "result-005",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 1",
    section: "A",
    examType: "Final Exam",
    examDate: "2023-07-15",
    academicYear: "2023/2024",
    term: "3rd Term",
    percentage: 80,
    status: "pass",
  },
];

// Filter Options
const CHILD_OPTIONS = [
  { value: "all", label: "All Children" },
  { value: "child-001", label: "Adaeze Okonkwo" },
  { value: "child-002", label: "Chukwuemeka Okonkwo" },
];

const EXAM_TYPE_OPTIONS = [
  { value: "all", label: "All Exam Types" },
  { value: "Mid-Term", label: "Mid-Term" },
  { value: "Final Exam", label: "Final Exam" },
];

const TERM_OPTIONS = [
  { value: "all", label: "All Terms" },
  { value: "1st Term", label: "1st Term" },
  { value: "2nd Term", label: "2nd Term" },
  { value: "3rd Term", label: "3rd Term" },
];

const YEAR_OPTIONS = [
  { value: "all", label: "All Years" },
  { value: "2024/2025", label: "2024/2025" },
  { value: "2023/2024", label: "2023/2024" },
];

export default function ParentResultsPage() {
  const isPageLoading = usePageLoad(600);
  const { settings, currentTenant } = useSchoolSettings();
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  // Download full report card as PDF - same as report card page
  const handleDownloadReportCard = (result: ExamResult) => {
    const academicData = MOCK_ACADEMIC_DATA[result.childId];
    if (!academicData) return;

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
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return r
        ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) }
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
    pdf.text(`${result.term} - Academic Year ${result.academicYear}`, pageWidth / 2, y + 11, { align: "center" });

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
    pdf.text(academicData.fullName, margin + 18, y + 7);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Gender:", margin + 65, y + 7);
    pdf.setTextColor(30, 41, 59);
    pdf.setFont("helvetica", "bold");
    pdf.text(academicData.gender, margin + 82, y + 7);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Attendance:", margin + 125, y + 7);
    pdf.setTextColor(22, 163, 74);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${academicData.attendance.present}/${academicData.attendance.total}`, margin + 148, y + 7);

    // Row 2
    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Adm No:", margin + 4, y + 18);
    pdf.setTextColor(primary.r, primary.g, primary.b);
    pdf.setFont("helvetica", "bold");
    pdf.text(academicData.admissionNumber, margin + 22, y + 18);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "normal");
    pdf.text("Class:", margin + 65, y + 18);
    pdf.setTextColor(30, 41, 59);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${academicData.classLevel}${academicData.section ? ` - ${academicData.section}` : ""}`, margin + 78, y + 18);

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
    pdf.save(`Report-Card-${academicData.fullName}-${result.term}-${result.academicYear}.pdf`);
  };

  // Animation trigger for filter changes
  const filterKey = `${searchQuery}-${selectedChild}-${selectedExamType}-${selectedTerm}-${selectedYear}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Filter results
  const filteredResults = useMemo(() => {
    return MOCK_RESULTS.filter((result) => {
      const matchesChild = selectedChild === "all" || result.childId === selectedChild;
      const matchesExamType = selectedExamType === "all" || result.examType === selectedExamType;
      const matchesTerm = selectedTerm === "all" || result.term === selectedTerm;
      const matchesYear = selectedYear === "all" || result.academicYear === selectedYear;
      const matchesSearch =
        searchQuery === "" ||
        result.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.examType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.class.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChild && matchesExamType && matchesTerm && matchesYear && matchesSearch;
    });
  }, [selectedChild, selectedExamType, selectedTerm, selectedYear, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalExams = MOCK_RESULTS.length;
    const avgPercentage = Math.round(
      MOCK_RESULTS.reduce((sum, r) => sum + r.percentage, 0) / totalExams
    );
    const passCount = MOCK_RESULTS.filter((r) => r.status === "pass").length;
    const highestScore = Math.max(...MOCK_RESULTS.map((r) => r.percentage));
    return { totalExams, avgPercentage, passCount, highestScore };
  }, []);

  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger((prev) => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  useEffect(() => {
    if (animationTrigger <= 0) return;
    const timeoutId = setTimeout(() => {
      const root = tableWrapRef.current;
      if (!root) return;
      const rows = root.querySelectorAll("tbody tr");
      rows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        const delay = index / 80;
        htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
      });
      setTimeout(() => {
        rows.forEach((row) => {
          const htmlRow = row as HTMLElement;
          htmlRow.style.animation = "";
        });
      }, 600);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [animationTrigger]);

  // Table columns - Simple layout matching the widget style
  const columns: ColumnConfig<ExamResult>[] = [
    {
      key: "childName",
      label: "Student",
      sortable: true,
      render: (result) => (
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            <Image
              src={result.childPhoto}
              alt={result.childName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {result.childName}
          </span>
        </div>
      ),
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      render: (result) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {result.class} - {result.section}
        </span>
      ),
    },
    {
      key: "percentage",
      label: "Percentage",
      sortable: true,
      render: (result) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                result.percentage >= 70
                  ? "bg-green-500"
                  : result.percentage >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${result.percentage}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {result.percentage}%
          </span>
        </div>
      ),
    },
    {
      key: "examType",
      label: "Exam",
      sortable: true,
      render: (result) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">{result.examType}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{result.term}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (result) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            result.status === "pass"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {result.status === "pass" ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          {result.status === "pass" ? "Pass" : "Fail"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      className: "text-center",
      render: (result) => (
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/parents/children/${result.childId}/report-card?from=results`}
            className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Report Card"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleDownloadReportCard(result)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            title="Download Report Card"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Results" />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <PageHeader
          title="Exam Results"
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "Exam Results" },
          ]}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={BookOpen}
            label="Total Exams"
            value={stats.totalExams.toString()}
            color="blue"
          />
          <StatCard
            icon={Target}
            label="Average Score"
            value={`${stats.avgPercentage}%`}
            color="indigo"
          />
          <StatCard
            icon={CheckCircle2}
            label="Passed"
            value={`${stats.passCount}/${stats.totalExams}`}
            color="green"
          />
          <StatCard
            icon={Trophy}
            label="Highest Score"
            value={`${stats.highestScore}%`}
            color="amber"
          />
        </div>

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name, exam type, class..."
          filters={[
            {
              label: "Child",
              value: selectedChild,
              onChange: (val) => setSelectedChild(String(val)),
              options: CHILD_OPTIONS,
            },
            {
              label: "Year",
              value: selectedYear,
              onChange: (val) => setSelectedYear(String(val)),
              options: YEAR_OPTIONS,
            },
            {
              label: "Exam Type",
              value: selectedExamType,
              onChange: (val) => setSelectedExamType(String(val)),
              options: EXAM_TYPE_OPTIONS,
            },
            {
              label: "Term",
              value: selectedTerm,
              onChange: (val) => setSelectedTerm(String(val)),
              options: TERM_OPTIONS,
            },
          ]}
        />

        {/* Results Table */}
        <div className="relative">
          <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

          <div
            ref={tableWrapRef}
            key={`results-table-${filterKey}`}
            className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden"
          >
            <DataTable
              data={filteredResults}
              columns={columns}
              getRowKey={(result) => result.id}
              emptyMessage="No exam results found"
              title=""
              showSearch={false}
              defaultItemsPerPage={10}
              itemsPerPageOptions={[5, 10, 15, 20, 25]}
              enablePagination={true}
              enableItemsPerPage={true}
              stickyColumnCount={1}
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                View Detailed Report Cards
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click the eye icon on any result to view the full report card with subject-wise
                breakdown, teacher remarks, and more detailed performance analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
