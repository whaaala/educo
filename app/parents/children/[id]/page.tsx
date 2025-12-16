"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import StatCard from "@/components/shared/StatCard";
import Button from "@/components/shared/Button";
import ActionButton from "@/components/shared/ActionButton";
import MessageTeacherModal from "@/components/parents/MessageTeacherModal";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  FileText,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  User,
  ArrowLeft,
  Download,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  Languages,
  Globe,
  Monitor,
  Palette,
  Hash,
  Loader2,
  Eye,
  Receipt,
  Search,
  XCircle,
  Banknote,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getTenantById } from "@/lib/mockTenants";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import type { ParentChild, ChildAcademicSummary, ParentAttendanceRecord } from "@/types/parent";

// Mock Data
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

const MOCK_FEES: Record<string, { total: number; paid: number; balance: number; status: string }> = {
  "child-001": { total: 150000, paid: 100000, balance: 50000, status: "partial" },
  "child-002": { total: 180000, paid: 180000, balance: 0, status: "paid" },
};

// Payment History Types and Mock Data
interface PaymentRecord {
  id: string;
  feeType: string;
  category: string;
  amount: number;
  dueDate: string;
  paymentDate: string;
  term: string;
  method: "Bank Transfer" | "Card" | "Cash" | "Online";
  status: "Paid" | "Pending" | "Overdue" | "Partial";
  receiptNumber: string;
  reference: string;
}

const MOCK_PAYMENT_HISTORY: Record<string, PaymentRecord[]> = {
  "child-001": [
    {
      id: "pay-001",
      feeType: "Tuition Fee",
      category: "Tuition Fees",
      amount: 50000,
      dueDate: "2024-09-10",
      paymentDate: "2024-09-08",
      term: "First Term",
      method: "Bank Transfer",
      status: "Paid",
      receiptNumber: "RCP-2024-0001",
      reference: "TXN-98234567",
    },
    {
      id: "pay-002",
      feeType: "Tuition Fee",
      category: "Tuition Fees",
      amount: 50000,
      dueDate: "2024-10-10",
      paymentDate: "2024-10-12",
      term: "First Term",
      method: "Card",
      status: "Paid",
      receiptNumber: "RCP-2024-0002",
      reference: "TXN-98234789",
    },
    {
      id: "pay-003",
      feeType: "Examination Fee",
      category: "Examination & Certification",
      amount: 15000,
      dueDate: "2024-11-01",
      paymentDate: "",
      term: "First Term",
      method: "Online",
      status: "Pending",
      receiptNumber: "",
      reference: "",
    },
    {
      id: "pay-004",
      feeType: "Library Fee",
      category: "Miscellaneous",
      amount: 5000,
      dueDate: "2024-09-15",
      paymentDate: "2024-09-14",
      term: "First Term",
      method: "Cash",
      status: "Paid",
      receiptNumber: "RCP-2024-0003",
      reference: "CASH-00123",
    },
    {
      id: "pay-005",
      feeType: "Sports Fee",
      category: "Extra-Curricular",
      amount: 10000,
      dueDate: "2024-09-20",
      paymentDate: "",
      term: "First Term",
      method: "Online",
      status: "Overdue",
      receiptNumber: "",
      reference: "",
    },
    {
      id: "pay-006",
      feeType: "Lab Fee",
      category: "Laboratory",
      amount: 8000,
      dueDate: "2024-10-01",
      paymentDate: "2024-10-01",
      term: "First Term",
      method: "Online",
      status: "Paid",
      receiptNumber: "RCP-2024-0004",
      reference: "TXN-98235001",
    },
  ],
  "child-002": [
    {
      id: "pay-101",
      feeType: "Tuition Fee",
      category: "Tuition Fees",
      amount: 60000,
      dueDate: "2024-09-10",
      paymentDate: "2024-09-05",
      term: "First Term",
      method: "Bank Transfer",
      status: "Paid",
      receiptNumber: "RCP-2024-0101",
      reference: "TXN-99234567",
    },
  ],
};

type TabType = "overview" | "academics" | "attendance" | "fees";

export default function ChildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const childId = params?.id as string;
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();
  const { countryCode } = useCountry();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Payment history filters
  const [paymentYearFilter, setPaymentYearFilter] = useState<string>("2024 / 2025");
  const [paymentCategoryFilter, setPaymentCategoryFilter] = useState<string>("All Categories");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("All Status");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const child = MOCK_CHILDREN[childId];
  const academicData = MOCK_ACADEMIC_SUMMARY[childId];
  const attendanceData = MOCK_ATTENDANCE[childId];
  const feeData = MOCK_FEES[childId];
  const paymentHistoryRaw = MOCK_PAYMENT_HISTORY[childId] || [];

  // Filter payment history based on selected filters
  const paymentHistory = useMemo(() => {
    return paymentHistoryRaw.filter((payment) => {
      const matchesStatus = paymentStatusFilter === "All Status" || payment.status === paymentStatusFilter;
      const matchesCategory = paymentCategoryFilter === "All Categories" || payment.category === paymentCategoryFilter;
      // Year filter would match based on payment date year - for now we show all
      return matchesStatus && matchesCategory;
    });
  }, [paymentHistoryRaw, paymentStatusFilter, paymentCategoryFilter]);

  // Get unique categories for filter
  const paymentCategories = useMemo(() => {
    const categories = new Set(paymentHistoryRaw.map(p => p.category));
    return ["All Categories", ...Array.from(categories)];
  }, [paymentHistoryRaw]);

  // Mock attendance calendar data - Generate realistic attendance data
  const attendanceCalendarData = useMemo(() => {
    const data: Record<string, "present" | "absent" | "late" | "holiday" | "weekend"> = {};
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Define school holidays (example dates)
    const holidays = [
      "2024-12-25", "2024-12-26", "2025-01-01", // Christmas & New Year
      "2024-10-01", // Independence Day
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();

      // Weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        data[dateStr] = "weekend";
      }
      // Holidays
      else if (holidays.includes(dateStr)) {
        data[dateStr] = "holiday";
      }
      // Future dates
      else if (date > new Date()) {
        // Skip future dates
      }
      // Random attendance based on child's attendance rate
      else {
        const random = Math.random() * 100;
        const rate = attendanceData?.rate || 90;
        if (random < rate - 5) {
          data[dateStr] = "present";
        } else if (random < rate) {
          data[dateStr] = "late";
        } else {
          data[dateStr] = "absent";
        }
      }
    }
    return data;
  }, [calendarMonth, attendanceData?.rate]);

  // Calendar helper functions
  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean; status?: string }[] = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split("T")[0];
      days.push({
        date,
        isCurrentMonth: true,
        status: attendanceCalendarData[dateStr],
      });
    }

    // Next month days to complete the grid
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCalendarMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Mock subject/lecture attendance data
  const subjectAttendanceData = useMemo(() => {
    if (!academicData?.subjectPerformance) return [];

    return academicData.subjectPerformance.map((subject) => {
      const totalClasses = Math.floor(Math.random() * 15) + 30; // 30-45 classes
      const baseRate = attendanceData?.rate || 90;
      const variance = (Math.random() - 0.5) * 10; // ±5% variance per subject
      const attendanceRate = Math.min(100, Math.max(70, baseRate + variance));
      const classesAttended = Math.round((attendanceRate / 100) * totalClasses);
      const classesLate = Math.floor(Math.random() * 3);
      const classesMissed = totalClasses - classesAttended;

      return {
        subject: subject.subject,
        totalClasses,
        attended: classesAttended,
        late: classesLate,
        missed: classesMissed,
        rate: Math.round((classesAttended / totalClasses) * 100),
        lastClass: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        teacher: ["Mr. Adebayo", "Mrs. Okonkwo", "Dr. Nwosu", "Miss Adeleke", "Prof. Chukwu"][
          Math.floor(Math.random() * 5)
        ],
      };
    });
  }, [academicData?.subjectPerformance, attendanceData?.rate]);

  // Calculate age
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Get grade color with enhanced styling
  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 ring-1 ring-green-200 dark:ring-green-800",
      B: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-200 dark:ring-blue-800",
      C: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 ring-1 ring-yellow-200 dark:ring-yellow-800",
      D: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 ring-1 ring-orange-200 dark:ring-orange-800",
      E: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 ring-1 ring-red-200 dark:ring-red-800",
      F: "text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-900/40 ring-1 ring-red-200 dark:ring-red-800",
    };
    return colors[grade] || colors.C;
  };

  // Subject icons mapping
  const subjectIcons: Record<string, { icon: React.ReactNode; bg: string; iconColor: string }> = {
    'Mathematics': { icon: <Calculator className="w-4 h-4" />, bg: 'bg-blue-100 dark:bg-blue-900/50', iconColor: 'text-blue-600 dark:text-blue-400' },
    'Further Mathematics': { icon: <Calculator className="w-4 h-4" />, bg: 'bg-indigo-100 dark:bg-indigo-900/50', iconColor: 'text-indigo-600 dark:text-indigo-400' },
    'Physics': { icon: <Atom className="w-4 h-4" />, bg: 'bg-purple-100 dark:bg-purple-900/50', iconColor: 'text-purple-600 dark:text-purple-400' },
    'Chemistry': { icon: <FlaskConical className="w-4 h-4" />, bg: 'bg-emerald-100 dark:bg-emerald-900/50', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    'Biology': { icon: <Leaf className="w-4 h-4" />, bg: 'bg-green-100 dark:bg-green-900/50', iconColor: 'text-green-600 dark:text-green-400' },
    'Basic Science': { icon: <Atom className="w-4 h-4" />, bg: 'bg-cyan-100 dark:bg-cyan-900/50', iconColor: 'text-cyan-600 dark:text-cyan-400' },
    'English Language': { icon: <Languages className="w-4 h-4" />, bg: 'bg-amber-100 dark:bg-amber-900/50', iconColor: 'text-amber-600 dark:text-amber-400' },
    'French': { icon: <Languages className="w-4 h-4" />, bg: 'bg-rose-100 dark:bg-rose-900/50', iconColor: 'text-rose-600 dark:text-rose-400' },
    'Social Studies': { icon: <Globe className="w-4 h-4" />, bg: 'bg-teal-100 dark:bg-teal-900/50', iconColor: 'text-teal-600 dark:text-teal-400' },
    'Civic Education': { icon: <Users className="w-4 h-4" />, bg: 'bg-orange-100 dark:bg-orange-900/50', iconColor: 'text-orange-600 dark:text-orange-400' },
    'Computer Studies': { icon: <Monitor className="w-4 h-4" />, bg: 'bg-violet-100 dark:bg-violet-900/50', iconColor: 'text-violet-600 dark:text-violet-400' },
    'Data Processing': { icon: <Monitor className="w-4 h-4" />, bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/50', iconColor: 'text-fuchsia-600 dark:text-fuchsia-400' },
    'Creative Arts': { icon: <Palette className="w-4 h-4" />, bg: 'bg-pink-100 dark:bg-pink-900/50', iconColor: 'text-pink-600 dark:text-pink-400' },
  };

  const getSubjectIcon = (subject: string) => {
    return subjectIcons[subject] || {
      icon: <BookOpen className="w-4 h-4" />,
      bg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-600 dark:text-gray-400'
    };
  };

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Student Details", icon: GraduationCap },
    { id: "academics", label: "Academics", icon: GraduationCap },
    { id: "attendance", label: "Attendance", icon: CheckCircle2 },
    { id: "fees", label: "Fees", icon: CreditCard },
  ];

  // Download Report PDF Function - Modern Design with Tenant Configuration
  const handleDownloadReport = async () => {
    if (!child || !academicData) return;

    setIsDownloading(true);

    try {
      // Get tenant configuration
      const tenantId = settings?.tenantId || "educo-default";
      const tenant = getTenantById(tenantId);
      const reportConfig = tenant?.branding?.reportCardConfig;
      const branding = tenant?.branding;
      const contact = tenant?.contact;

      // Extract colors (convert hex to RGB)
      const hexToRgb = (hex: string): [number, number, number] => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
          : [37, 99, 235]; // default blue
      };

      const primaryColor = hexToRgb(branding?.primaryColor || "#2563eb");
      const secondaryColor = hexToRgb(branding?.secondaryColor || "#1e40af");

      // Create PDF document - A4 size
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
      const margin = 12;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      // ===== HEADER SECTION WITH COLORED BACKGROUND =====
      const headerHeight = 45;
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, headerHeight, "F");

      // Add gradient effect overlay
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setGlobalAlpha?.(0.3);
      doc.rect(pageWidth * 0.6, 0, pageWidth * 0.4, headerHeight, "F");
      doc.setGlobalAlpha?.(1);

      // School Name - Large and Prominent
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(settings?.schoolName || tenant?.name || "School Name", pageWidth / 2, 15, {
        align: "center",
      });

      // School Motto
      if (branding?.motto && reportConfig?.header?.showMotto !== false) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.text(`"${branding.motto}"`, pageWidth / 2, 23, { align: "center" });
      }

      // School Address & Contact
      if (reportConfig?.header?.showAddress !== false && contact?.address) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const addressLine = `${contact.address.line1}, ${contact.address.city}, ${contact.address.state}`;
        doc.text(addressLine, pageWidth / 2, 30, { align: "center" });
      }

      if (reportConfig?.header?.showContact !== false && contact) {
        doc.setFontSize(8);
        doc.text(`${contact.phone} | ${contact.email}`, pageWidth / 2, 36, { align: "center" });
      }

      // Report Title Banner
      y = headerHeight + 2;
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(0, y, pageWidth, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("ACADEMIC PERFORMANCE REPORT", pageWidth / 2, y + 7, { align: "center" });

      y += 15;

      // ===== STUDENT INFORMATION CARD =====
      const studentCardHeight = 38;
      doc.setFillColor(249, 250, 251); // gray-50
      doc.roundedRect(margin, y, contentWidth, studentCardHeight, 3, 3, "F");

      // Student Info - Two Column Layout
      const col1X = margin + 8;
      const col2X = pageWidth / 2 + 5;
      let infoY = y + 8;

      doc.setTextColor(107, 114, 128); // gray-500
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("STUDENT NAME", col1X, infoY);
      doc.text("ADMISSION NUMBER", col2X, infoY);

      infoY += 5;
      doc.setTextColor(17, 24, 39); // gray-900
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(child.fullName, col1X, infoY);
      doc.setFontSize(10);
      doc.text(child.admissionNumber, col2X, infoY);

      infoY += 9;
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("CLASS", col1X, infoY);
      doc.text("GENDER", col1X + 35, infoY);
      doc.text("AGE", col2X, infoY);
      doc.text("STATUS", col2X + 35, infoY);

      infoY += 5;
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${child.classLevel}${child.section ? ` ${child.section}` : ""}`, col1X, infoY);
      doc.text(child.gender, col1X + 35, infoY);
      doc.text(`${calculateAge(child.dateOfBirth)} years`, col2X, infoY);

      // Status badge
      const statusColor = child.status === "Active" ? [22, 163, 74] : [156, 163, 175];
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(col2X + 35, infoY - 3.5, 18, 5, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.text(child.status, col2X + 44, infoY, { align: "center" });

      y += studentCardHeight + 6;

      // ===== ACADEMIC SUMMARY ROW =====
      const summaryBoxWidth = (contentWidth - 8) / 4;
      const summaryBoxHeight = 22;

      // Term Average Box
      doc.setFillColor(...primaryColor);
      doc.roundedRect(margin, y, summaryBoxWidth, summaryBoxHeight, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text("TERM AVERAGE", margin + summaryBoxWidth / 2, y + 6, { align: "center" });
      doc.setFontSize(14);
      doc.text(`${academicData.currentTermAverage?.toFixed(1)}%`, margin + summaryBoxWidth / 2, y + 16, {
        align: "center",
      });

      // Class Position Box
      doc.setFillColor(22, 163, 74); // green
      doc.roundedRect(margin + summaryBoxWidth + 2.5, y, summaryBoxWidth, summaryBoxHeight, 2, 2, "F");
      doc.setFontSize(6);
      doc.text("CLASS POSITION", margin + summaryBoxWidth * 1.5 + 2.5, y + 6, { align: "center" });
      doc.setFontSize(14);
      doc.text(
        `${academicData.classPosition}/${academicData.totalStudents}`,
        margin + summaryBoxWidth * 1.5 + 2.5,
        y + 16,
        { align: "center" }
      );

      // Conduct Grade Box
      doc.setFillColor(234, 88, 12); // orange
      doc.roundedRect(margin + (summaryBoxWidth + 2.5) * 2, y, summaryBoxWidth, summaryBoxHeight, 2, 2, "F");
      doc.setFontSize(6);
      doc.text("CONDUCT GRADE", margin + summaryBoxWidth * 2.5 + 5, y + 6, { align: "center" });
      doc.setFontSize(14);
      doc.text(academicData.conductGrade || "A", margin + summaryBoxWidth * 2.5 + 5, y + 16, {
        align: "center",
      });

      // Attendance Rate Box
      doc.setFillColor(139, 92, 246); // purple
      doc.roundedRect(margin + (summaryBoxWidth + 2.5) * 3, y, summaryBoxWidth, summaryBoxHeight, 2, 2, "F");
      doc.setFontSize(6);
      doc.text("ATTENDANCE", margin + summaryBoxWidth * 3.5 + 7.5, y + 6, { align: "center" });
      doc.setFontSize(14);
      doc.text(`${attendanceData?.rate || 0}%`, margin + summaryBoxWidth * 3.5 + 7.5, y + 16, {
        align: "center",
      });

      y += summaryBoxHeight + 8;

      // ===== SUBJECT PERFORMANCE TABLE =====
      doc.setTextColor(...primaryColor);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("SUBJECT PERFORMANCE", margin, y);
      y += 5;

      // Prepare table data with score visualization
      const tableData = academicData.subjectPerformance.map((subject) => {
        const gradeColor =
          subject.grade === "A"
            ? "#16a34a"
            : subject.grade === "B"
            ? "#2563eb"
            : subject.grade === "C"
            ? "#ca8a04"
            : subject.grade === "D"
            ? "#ea580c"
            : "#dc2626";

        return [subject.subject, `${subject.score}`, subject.grade, subject.teacherRemarks || "-"];
      });

      // Grade scale from tenant config
      const gradeScale = reportConfig?.gradingScale?.scale || [
        { grade: "A", minScore: 80, maxScore: 100, description: "Excellent", color: "#16a34a" },
        { grade: "B", minScore: 70, maxScore: 79, description: "Very Good", color: "#2563eb" },
        { grade: "C", minScore: 60, maxScore: 69, description: "Good", color: "#ca8a04" },
        { grade: "D", minScore: 50, maxScore: 59, description: "Satisfactory", color: "#ea580c" },
        { grade: "F", minScore: 0, maxScore: 49, description: "Needs Improvement", color: "#dc2626" },
      ];

      autoTable(doc, {
        startY: y,
        head: [["Subject", "Score", "Grade", "Teacher's Remarks"]],
        body: tableData,
        theme: "plain",
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [229, 231, 235],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [243, 244, 246], // gray-100
          textColor: [55, 65, 81], // gray-700
          fontStyle: "bold",
          fontSize: 7,
          halign: "left",
        },
        bodyStyles: {
          textColor: [31, 41, 55], // gray-800
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // gray-50
        },
        columnStyles: {
          0: { cellWidth: 42, fontStyle: "bold" },
          1: { cellWidth: 22, halign: "center" },
          2: { cellWidth: 18, halign: "center" },
          3: { cellWidth: "auto", fontStyle: "italic", textColor: [107, 114, 128] },
        },
        margin: { left: margin, right: margin },
        didDrawCell: (data) => {
          // Add colored badge for grade column
          if (data.section === "body" && data.column.index === 2) {
            const grade = String(data.cell.raw);
            const gradeInfo = gradeScale.find((g) => g.grade === grade);
            if (gradeInfo) {
              const rgb = hexToRgb(gradeInfo.color);
              doc.setFillColor(rgb[0], rgb[1], rgb[2]);
              doc.roundedRect(data.cell.x + 3, data.cell.y + 1.5, 12, 5, 1, 1, "F");
              doc.setTextColor(255, 255, 255);
              doc.setFontSize(7);
              doc.setFont("helvetica", "bold");
              doc.text(grade, data.cell.x + 9, data.cell.y + 5, { align: "center" });
            }
          }
          // Add score bar visualization
          if (data.section === "body" && data.column.index === 1) {
            const score = parseInt(String(data.cell.raw), 10);
            const barWidth = (score / 100) * 18;
            const barColor =
              score >= 80
                ? [22, 163, 74]
                : score >= 70
                ? [37, 99, 235]
                : score >= 60
                ? [202, 138, 4]
                : score >= 50
                ? [234, 88, 12]
                : [220, 38, 38];
            doc.setFillColor(229, 231, 235); // background
            doc.roundedRect(data.cell.x + 2, data.cell.y + data.cell.height - 3, 18, 1.5, 0.5, 0.5, "F");
            doc.setFillColor(barColor[0], barColor[1], barColor[2]);
            doc.roundedRect(data.cell.x + 2, data.cell.y + data.cell.height - 3, barWidth, 1.5, 0.5, 0.5, "F");
          }
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 8;

      // ===== ATTENDANCE SUMMARY (if enabled) =====
      if (attendanceData && reportConfig?.attendanceSection?.enabled !== false) {
        doc.setTextColor(...primaryColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("ATTENDANCE SUMMARY", margin, y);
        y += 5;

        const attBoxWidth = (contentWidth - 6) / 4;
        const attBoxHeight = 18;

        // Days Present
        doc.setFillColor(220, 252, 231); // green-100
        doc.roundedRect(margin, y, attBoxWidth, attBoxHeight, 2, 2, "F");
        doc.setTextColor(22, 101, 52); // green-800
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.text("PRESENT", margin + attBoxWidth / 2, y + 5, { align: "center" });
        doc.setFontSize(12);
        doc.text(String(attendanceData.present), margin + attBoxWidth / 2, y + 13, { align: "center" });

        // Days Absent
        doc.setFillColor(254, 226, 226); // red-100
        doc.roundedRect(margin + attBoxWidth + 2, y, attBoxWidth, attBoxHeight, 2, 2, "F");
        doc.setTextColor(153, 27, 27); // red-800
        doc.setFontSize(6);
        doc.text("ABSENT", margin + attBoxWidth * 1.5 + 2, y + 5, { align: "center" });
        doc.setFontSize(12);
        doc.text(String(attendanceData.absent), margin + attBoxWidth * 1.5 + 2, y + 13, { align: "center" });

        // Times Late
        doc.setFillColor(254, 243, 199); // amber-100
        doc.roundedRect(margin + (attBoxWidth + 2) * 2, y, attBoxWidth, attBoxHeight, 2, 2, "F");
        doc.setTextColor(146, 64, 14); // amber-800
        doc.setFontSize(6);
        doc.text("LATE", margin + attBoxWidth * 2.5 + 4, y + 5, { align: "center" });
        doc.setFontSize(12);
        doc.text(String(attendanceData.late), margin + attBoxWidth * 2.5 + 4, y + 13, { align: "center" });

        // Total Days
        doc.setFillColor(224, 231, 255); // indigo-100
        doc.roundedRect(margin + (attBoxWidth + 2) * 3, y, attBoxWidth, attBoxHeight, 2, 2, "F");
        doc.setTextColor(55, 48, 163); // indigo-800
        doc.setFontSize(6);
        doc.text("TOTAL DAYS", margin + attBoxWidth * 3.5 + 6, y + 5, { align: "center" });
        doc.setFontSize(12);
        doc.text(String(attendanceData.total), margin + attBoxWidth * 3.5 + 6, y + 13, { align: "center" });

        y += attBoxHeight + 8;
      }

      // ===== TEACHER'S REMARKS =====
      if (academicData.overallRemarks && reportConfig?.remarksSection?.showTeacherRemarks !== false) {
        doc.setTextColor(...primaryColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("TEACHER'S REMARKS", margin, y);
        y += 5;

        doc.setFillColor(254, 252, 232); // yellow-50
        const remarksHeight = 18;
        doc.roundedRect(margin, y, contentWidth, remarksHeight, 2, 2, "F");

        doc.setTextColor(113, 63, 18); // yellow-800
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        const splitRemarks = doc.splitTextToSize(`"${academicData.overallRemarks}"`, contentWidth - 10);
        doc.text(splitRemarks, margin + 5, y + 6);

        y += remarksHeight + 8;
      }

      // ===== GRADING SCALE (if enabled) =====
      if (reportConfig?.gradingScale?.showOnCard !== false) {
        doc.setTextColor(...primaryColor);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("GRADING SCALE", margin, y);
        y += 4;

        const scaleBoxWidth = contentWidth / gradeScale.length;
        gradeScale.forEach((grade, index) => {
          const rgb = hexToRgb(grade.color);
          doc.setFillColor(rgb[0], rgb[1], rgb[2]);
          doc.roundedRect(margin + index * scaleBoxWidth, y, scaleBoxWidth - 1, 10, 1, 1, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text(
            `${grade.grade}: ${grade.minScore}-${grade.maxScore}`,
            margin + index * scaleBoxWidth + scaleBoxWidth / 2 - 0.5,
            y + 4,
            { align: "center" }
          );
          doc.setFontSize(5);
          doc.setFont("helvetica", "normal");
          doc.text(
            grade.description,
            margin + index * scaleBoxWidth + scaleBoxWidth / 2 - 0.5,
            y + 8,
            { align: "center" }
          );
        });

        y += 14;
      }

      // ===== SIGNATURES SECTION =====
      if (reportConfig?.signaturesSection) {
        y = Math.max(y, pageHeight - 45);

        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;

        const sigWidth = (contentWidth - 20) / 3;

        // Class Teacher Signature
        if (reportConfig.signaturesSection.showClassTeacher !== false) {
          doc.setDrawColor(156, 163, 175);
          doc.line(margin, y + 8, margin + sigWidth, y + 8);
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.text("Class Teacher", margin + sigWidth / 2, y + 13, { align: "center" });
        }

        // Principal Signature
        if (reportConfig.signaturesSection.showPrincipal !== false) {
          doc.line(margin + sigWidth + 10, y + 8, margin + sigWidth * 2 + 10, y + 8);
          doc.text("Principal", margin + sigWidth * 1.5 + 10, y + 13, { align: "center" });
        }

        // Parent/Guardian Signature
        if (reportConfig.signaturesSection.showParentGuardian !== false) {
          doc.line(margin + sigWidth * 2 + 20, y + 8, margin + sigWidth * 3 + 20, y + 8);
          doc.text("Parent/Guardian", margin + sigWidth * 2.5 + 20, y + 13, { align: "center" });
        }
      }

      // ===== FOOTER =====
      const footerY = pageHeight - 10;
      doc.setFillColor(...primaryColor);
      doc.rect(0, footerY - 2, pageWidth, 12, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");

      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc.text(
        `Generated on ${currentDate}`,
        margin,
        footerY + 3
      );
      doc.text(
        `${settings?.schoolName || tenant?.name || "School"} | Academic Report`,
        pageWidth - margin,
        footerY + 3,
        { align: "right" }
      );

      // Save the PDF
      const fileName = `${child.fullName.replace(/\s+/g, "_")}_Report_Card_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!child) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Child Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The requested child profile could not be found.</p>
          <Button variant="primary" onClick={() => router.push("/parents/children")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Children
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText={`Loading ${child.firstName}'s Profile`} />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <PageHeader
          title={child.fullName}
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "My Children", href: "/parents/children" },
            { label: child.firstName },
          ]}
        />

        {/* Profile Card - Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm">
          <div className="relative p-4">
            {/* Main Content Row */}
            <div className="flex items-start gap-4">
              {/* Profile Photo */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/60 via-purple-400/60 to-pink-400/60 rounded-xl blur-[2px]" />
                <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-white dark:ring-gray-800">
                  <Image
                    src={child.profilePhoto || `https://i.pravatar.cc/150?u=${child.id}`}
                    alt={child.fullName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {/* Status indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center ${
                  child.status === "Active" ? "bg-emerald-400" : "bg-gray-400"
                }`}>
                  {child.status === "Active" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                {/* Name and status row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight truncate">
                    {child.fullName}
                  </h1>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide ${
                    child.status === "Active"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}>
                    {child.status}
                  </span>
                </div>

                {/* Info badges - inline with subtle colors */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
                    <GraduationCap className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    {child.classLevel} {child.section && `• ${child.section}`}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
                    <Hash className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    {child.admissionNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
                    <Calendar className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    {calculateAge(child.dateOfBirth)} yrs
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
                    <User className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    {child.gender}
                  </span>
                </div>

                {/* Action buttons - using ActionButton component */}
                <div className="flex items-center gap-2.5">
                  <ActionButton
                    variant="secondary"
                    color="blue"
                    size="md"
                    icon={<MessageSquare className="w-full h-full" />}
                    onClick={() => setIsMessageModalOpen(true)}
                  >
                    Message Teacher
                  </ActionButton>
                  <Link href={`/parents/children/${child.id}/report-card`}>
                    <ActionButton
                      variant="primary"
                      color="emerald"
                      size="md"
                      icon={<FileText className="w-full h-full" />}
                    >
                      View Report Card
                    </ActionButton>
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Row - Compact Card Design */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-900/20 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">Term Average</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {academicData?.currentTermAverage?.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-green-50/80 to-white dark:from-green-900/20 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-green-100 dark:bg-green-900/50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-0.5">Active</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {child.status === "Active" ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-900/20 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">Attendance</p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {attendanceData?.rate}%
                  </p>
                </div>
              </div>

              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-orange-50/80 to-orange-100/30 dark:from-orange-900/20 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/50">
                  <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">Best Position</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    #{academicData?.classPosition}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Modern Navigation */}
        <div className="relative bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-[#1a1d23]/30 dark:to-[#14161b]/50 midnight:from-[#0f1729]/30 midnight:to-[#0a0f1c]/50 purple:from-[#2a1a3e]/30 purple:to-[#1f1330]/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/30 dark:border-gray-800/30 midnight:border-cyan-500/10 purple:border-pink-500/10 p-1.5 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5 midnight:from-cyan-400/5 midnight:via-blue-400/5 midnight:to-cyan-400/5 purple:from-pink-400/5 purple:via-purple-400/5 purple:to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative flex gap-1.5 min-w-max lg:min-w-0">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  className={`relative flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ease-out whitespace-nowrap group overflow-hidden ${
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-950/20 midnight:bg-cyan-950/20 purple:bg-pink-950/20 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 shadow-sm border border-blue-100/50 dark:border-blue-900/30 midnight:border-cyan-900/30 purple:border-pink-900/30"
                      : "text-gray-700 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:bg-white/40 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/30 purple:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200 midnight:hover:text-cyan-200 purple:hover:text-pink-200 hover:shadow-sm"
                  } cursor-pointer active:scale-95`}
                >
                  {/* Shine effect on active tab */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}

                  {/* Hover glow effect for inactive tabs */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-xl" />
                  )}

                  <Icon className={`relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-600 dark:text-gray-500 midnight:text-cyan-300/70 purple:text-pink-300/70 group-hover:scale-110 group-hover:rotate-6"
                  }`} />
                  <span className={`relative text-[11.75px] sm:text-xs font-semibold transition-all duration-300 ${
                    isActive ? "tracking-wide" : "group-hover:tracking-wide"
                  }`}>
                    {tab.label}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 midnight:bg-cyan-400 purple:bg-pink-400 rounded-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-700/50 p-6 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 via-purple-500/3 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Performance */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/30">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Recent Performance</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Top 5 subjects this term</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {academicData?.subjectPerformance.slice(0, 5).map((subject, index) => {
                    const subjectStyle = getSubjectIcon(subject.subject);
                    return (
                      <div
                        key={subject.subject}
                        className="group relative p-4 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 shadow-sm hover:shadow-lg transition-all duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Subtle gradient overlay on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex items-center gap-4">
                          {/* Subject Icon */}
                          <div className={`p-3 rounded-xl ${subjectStyle.bg} ${subjectStyle.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                            {subjectStyle.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {subject.subject}
                              </span>
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                  {subject.score}%
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getGradeColor(subject.grade)}`}>
                                  {subject.grade}
                                </span>
                              </div>
                            </div>
                            {/* Progress bar - sleeker design */}
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${
                                  subject.score >= 80
                                    ? "bg-gradient-to-r from-emerald-400 to-green-500"
                                    : subject.score >= 60
                                    ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                                    : subject.score >= 50
                                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                    : "bg-gradient-to-r from-red-400 to-rose-500"
                                }`}
                                style={{ width: `${subject.score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance Overview */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 border border-emerald-200/50 dark:border-emerald-700/30">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Attendance Overview</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current term attendance</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Days Present Card */}
                  <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50/80 to-teal-50/50 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/10 border border-emerald-100/80 dark:border-emerald-800/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    {/* Decorative gradient blob */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-bl from-emerald-300/30 via-green-200/20 to-transparent rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-center justify-end mb-2">
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 tracking-tight">
                        {attendanceData?.present}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-widest">Days Present</p>
                    </div>
                  </div>

                  {/* Days Absent Card */}
                  <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-rose-50 via-red-50/80 to-pink-50/50 dark:from-rose-900/30 dark:via-red-900/20 dark:to-pink-900/10 border border-rose-100/80 dark:border-rose-800/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-bl from-rose-300/30 via-red-200/20 to-transparent rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-center justify-end mb-2">
                        <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 group-hover:scale-110 transition-transform duration-300">
                          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-rose-600 dark:text-rose-400 mb-1 tracking-tight">
                        {attendanceData?.absent}
                      </p>
                      <p className="text-[10px] font-bold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-widest">Days Absent</p>
                    </div>
                  </div>

                  {/* Times Late Card */}
                  <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50/50 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/10 border border-amber-100/80 dark:border-amber-800/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-bl from-amber-300/30 via-yellow-200/20 to-transparent rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-center justify-end mb-2">
                        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 group-hover:scale-110 transition-transform duration-300">
                          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-1 tracking-tight">
                        {attendanceData?.late}
                      </p>
                      <p className="text-[10px] font-bold text-amber-600/80 dark:text-amber-400/80 uppercase tracking-widest">Times Late</p>
                    </div>
                  </div>

                  {/* Attendance Rate Card */}
                  <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/80 to-violet-50/50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-violet-900/10 border border-blue-100/80 dark:border-blue-800/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-bl from-blue-300/30 via-indigo-200/20 to-transparent rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-center justify-end mb-2">
                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 tracking-tight">
                        {attendanceData?.rate}%
                      </p>
                      <p className="text-[10px] font-bold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-widest">Attendance Rate</p>
                    </div>
                  </div>
                </div>

                {/* Teacher's Remarks */}
                {academicData?.overallRemarks && (
                  <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-yellow-50/50 dark:from-amber-900/25 dark:via-orange-900/15 dark:to-yellow-900/10 border border-amber-200/60 dark:border-amber-700/30 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-amber-300/25 via-orange-200/15 to-transparent rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-orange-300/20 to-transparent rounded-full blur-xl" />

                    <div className="relative flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">
                          Teacher&apos;s Remarks
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                          &quot;{academicData.overallRemarks}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === "academics" && (
            <div className="relative space-y-6">
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-pink-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-10 w-32 h-32 bg-gradient-to-tr from-blue-400/15 via-cyan-400/10 to-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
                    <GraduationCap className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Subject Performance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current term results</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 cursor-pointer"
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Report
                    </>
                  )}
                </Button>
              </div>

              {/* Modern Card-Based Subject List */}
              <div className="relative grid gap-4">
                {academicData?.subjectPerformance.map((subject, index) => {
                  const subjectStyle = getSubjectIcon(subject.subject);
                  const scoreColor = subject.score >= 80
                    ? { gradient: "from-emerald-400 to-green-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" }
                    : subject.score >= 60
                    ? { gradient: "from-blue-400 to-indigo-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" }
                    : subject.score >= 50
                    ? { gradient: "from-amber-400 to-orange-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" }
                    : { gradient: "from-red-400 to-rose-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" };

                  return (
                    <div
                      key={subject.subject}
                      className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-white hover:to-gray-50/80 dark:hover:from-gray-800 dark:hover:to-gray-750/80 shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-gray-200/80 dark:ring-gray-700/60 hover:ring-gray-300/80 dark:hover:ring-gray-600/80 overflow-hidden hover:-translate-y-0.5"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* Decorative accent bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${scoreColor.gradient} rounded-l-2xl`} />

                      {/* Subtle hover glow */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${scoreColor.bg} to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl`} />

                      {/* Subject Icon */}
                      <div className={`relative p-3.5 rounded-xl ${subjectStyle.bg} ${subjectStyle.iconColor} ring-1 ring-gray-200/60 dark:ring-gray-700/40 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                        {subjectStyle.icon}
                      </div>

                      {/* Subject Info */}
                      <div className="relative flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-bold text-gray-900 dark:text-white text-base">
                            {subject.subject}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          <span className="italic">&quot;{subject.teacherRemarks || "No remarks"}&quot;</span>
                        </p>
                      </div>

                      {/* Score with Progress */}
                      <div className="relative flex items-center gap-5">
                        <div className="hidden sm:block w-40">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Score</span>
                            <span className={`font-bold ${scoreColor.text}`}>{subject.score}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden ring-1 ring-gray-200/50 dark:ring-gray-700/30">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${scoreColor.gradient} transition-all duration-700 ease-out shadow-sm`}
                              style={{ width: `${subject.score}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${scoreColor.text} sm:hidden`}>
                            {subject.score}%
                          </span>
                          <span className={`px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm ring-1 ring-inset ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conduct Grade */}
              {academicData?.conductGrade && (
                <div className="relative flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/80 to-blue-50/60 dark:from-purple-900/30 dark:via-indigo-900/20 dark:to-blue-900/15 ring-1 ring-purple-200/60 dark:ring-purple-700/40 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-400/15 via-indigo-400/10 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex items-center gap-4">
                    <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-50 dark:from-purple-900/50 dark:via-indigo-900/40 dark:to-blue-900/30 ring-1 ring-purple-200/60 dark:ring-purple-700/40 shadow-sm group-hover:scale-105 transition-transform">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-transparent dark:from-white/5" />
                      <Award className="relative w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">Conduct Grade</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Overall behavior assessment</p>
                    </div>
                  </div>
                  <span className={`relative px-6 py-3 rounded-2xl text-xl font-bold shadow-md ring-1 ring-inset ${getGradeColor(academicData.conductGrade)}`}>
                    {academicData.conductGrade}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="relative space-y-6">
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/15 via-green-400/10 to-teal-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-10 w-32 h-32 bg-gradient-to-tr from-blue-400/10 via-cyan-400/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Attendance Summary</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current term attendance record</p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Days Present */}
                <div className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700/60 hover:ring-emerald-200 dark:hover:ring-emerald-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-green-500 rounded-l-2xl" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-emerald-100/60 dark:from-emerald-900/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 tracking-tight">
                      {attendanceData?.present}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest">Days Present</p>
                  </div>
                </div>

                {/* Days Absent */}
                <div className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700/60 hover:ring-rose-200 dark:hover:ring-rose-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-red-500 rounded-l-2xl" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-rose-100/60 dark:from-rose-900/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/40 group-hover:scale-110 transition-transform duration-300">
                        <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 mb-1 tracking-tight">
                      {attendanceData?.absent}
                    </p>
                    <p className="text-[10px] font-bold text-rose-600/70 dark:text-rose-400/70 uppercase tracking-widest">Days Absent</p>
                  </div>
                </div>

                {/* Times Late */}
                <div className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700/60 hover:ring-amber-200 dark:hover:ring-amber-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-2xl" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-amber-100/60 dark:from-amber-900/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/40 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1 tracking-tight">
                      {attendanceData?.late}
                    </p>
                    <p className="text-[10px] font-bold text-amber-600/70 dark:text-amber-400/70 uppercase tracking-widest">Times Late</p>
                  </div>
                </div>

                {/* Attendance Rate */}
                <div className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700/60 hover:ring-blue-200 dark:hover:ring-blue-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-2xl" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-blue-100/60 dark:from-blue-900/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 tracking-tight">
                      {attendanceData?.rate}%
                    </p>
                    <p className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest">Attendance Rate</p>
                  </div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-700/60 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-emerald-100/40 dark:from-emerald-900/20 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-semibold text-gray-900 dark:text-white">Attendance Progress</span>
                    <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/60 text-sm font-medium text-gray-600 dark:text-gray-300">
                      {attendanceData?.present} of {attendanceData?.total} days
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden ring-1 ring-gray-200/50 dark:ring-gray-600/30">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-full transition-all duration-700 ease-out relative"
                      style={{ width: `${attendanceData?.rate || 0}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40 rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-3 text-xs font-medium text-gray-400 dark:text-gray-500">
                    <span>0%</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      (attendanceData?.rate || 0) >= 80
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    }`}>
                      {attendanceData?.rate}% Overall
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Subject/Lecture Attendance */}
              <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-700/60 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-blue-100/40 dark:from-blue-900/20 to-transparent rounded-full blur-2xl" />

                {/* Section Header */}
                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                      <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Subject Attendance</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Per-subject class attendance</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                    {subjectAttendanceData.length} subjects
                  </div>
                </div>

                {/* Subject Attendance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectAttendanceData.map((subject, index) => {
                    const subjectStyle = getSubjectIcon(subject.subject);
                    const rateColor = subject.rate >= 90
                      ? "text-emerald-600 dark:text-emerald-400"
                      : subject.rate >= 80
                      ? "text-blue-600 dark:text-blue-400"
                      : subject.rate >= 70
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-rose-600 dark:text-rose-400";

                    const progressColor = subject.rate >= 90
                      ? "bg-gradient-to-r from-emerald-400 to-green-500"
                      : subject.rate >= 80
                      ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                      : subject.rate >= 70
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-gradient-to-r from-rose-400 to-red-500";

                    return (
                      <div
                        key={subject.subject}
                        className="group relative p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Subject Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${subjectStyle.bg} ${subjectStyle.iconColor}`}>
                              {subjectStyle.icon}
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                                {subject.subject}
                              </h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {subject.teacher}
                              </p>
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${rateColor}`}>
                            {subject.rate}%
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
                            style={{ width: `${subject.rate}%` }}
                          />
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {subject.attended} attended
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-rose-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {subject.missed} missed
                              </span>
                            </div>
                            {subject.late > 0 && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {subject.late} late
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-gray-400 dark:text-gray-500">
                            {subject.totalClasses} classes
                          </div>
                        </div>

                        {/* Last Class Badge */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                            Last: {subject.lastClass}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {subjectAttendanceData.reduce((acc, s) => acc + s.attended, 0)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Classes Attended</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {subjectAttendanceData.reduce((acc, s) => acc + s.missed, 0)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Classes Missed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {Math.round(
                          subjectAttendanceData.reduce((acc, s) => acc + s.rate, 0) /
                            subjectAttendanceData.length
                        )}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Average Attendance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>≥90%</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>80-89%</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>70-79%</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>&lt;70%</span>
                  </div>
                </div>
              </div>

              {/* Attendance Calendar */}
              <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-700/60 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-indigo-100/40 dark:from-indigo-900/20 to-transparent rounded-full blur-2xl" />

                {/* Calendar Header */}
                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
                      <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Attendance Calendar</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Daily attendance record</p>
                    </div>
                  </div>

                  {/* Month Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateMonth("prev")}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[140px] text-center">
                      {formatMonthYear(calendarMonth)}
                    </span>
                    <button
                      onClick={() => navigateMonth("next")}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((day, index) => {
                    const isToday =
                      day.date.toDateString() === new Date().toDateString();
                    const statusColors: Record<string, string> = {
                      present:
                        "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800",
                      absent:
                        "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-800",
                      late:
                        "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800",
                      holiday:
                        "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-800",
                      weekend:
                        "bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500",
                    };

                    return (
                      <div
                        key={index}
                        className={`
                          relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                          ${!day.isCurrentMonth ? "opacity-30" : ""}
                          ${
                            day.status
                              ? statusColors[day.status]
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }
                          ${isToday ? "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 dark:ring-offset-gray-800" : ""}
                        `}
                      >
                        <span className={`font-medium ${isToday ? "font-bold" : ""}`}>
                          {day.date.getDate()}
                        </span>
                        {day.status && day.isCurrentMonth && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                            {day.status === "present" && (
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                            )}
                            {day.status === "absent" && (
                              <AlertCircle className="w-2.5 h-2.5 text-rose-500 dark:text-rose-400" />
                            )}
                            {day.status === "late" && (
                              <Clock className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" />
                            )}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/40 ring-1 ring-emerald-200 dark:ring-emerald-800 flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-100 dark:bg-rose-900/40 ring-1 ring-rose-200 dark:ring-rose-800 flex items-center justify-center">
                      <AlertCircle className="w-2.5 h-2.5 text-rose-500" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/40 ring-1 ring-amber-200 dark:ring-amber-800 flex items-center justify-center">
                      <Clock className="w-2.5 h-2.5 text-amber-500" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Late</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-900/40 ring-1 ring-purple-200 dark:ring-purple-800" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Holiday</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Weekend</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === "fees" && (
            <div className="relative space-y-6">
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/15 via-teal-400/10 to-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-10 w-32 h-32 bg-gradient-to-tr from-blue-400/10 via-indigo-400/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                  <CreditCard className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fee Summary</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current term fee status</p>
                </div>
              </div>

              {/* Fee Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Fees */}
                <div className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700/60 hover:ring-blue-200 dark:hover:ring-blue-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-2xl" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-blue-100/60 dark:from-blue-900/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      </div>
                      <p className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest">Total Fees</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                      {formatCurrency(feeData?.total || 0, countryCode)}
                    </p>
                  </div>
                </div>

                {/* Amount Paid */}
                <div className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700/60 hover:ring-emerald-200 dark:hover:ring-emerald-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-green-500 rounded-l-2xl" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-emerald-100/60 dark:from-emerald-900/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest">Amount Paid</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {formatCurrency(feeData?.paid || 0, countryCode)}
                    </p>
                  </div>
                </div>

                {/* Balance Due */}
                <div className={`group relative p-5 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700/60 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${
                  (feeData?.balance || 0) > 0
                    ? "hover:ring-rose-200 dark:hover:ring-rose-700/50"
                    : "hover:ring-emerald-200 dark:hover:ring-emerald-700/50"
                }`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                    (feeData?.balance || 0) > 0
                      ? "bg-gradient-to-b from-rose-400 to-red-500"
                      : "bg-gradient-to-b from-emerald-400 to-green-500"
                  }`} />
                  <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity ${
                    (feeData?.balance || 0) > 0
                      ? "bg-gradient-to-bl from-rose-100/60 dark:from-rose-900/30 to-transparent"
                      : "bg-gradient-to-bl from-emerald-100/60 dark:from-emerald-900/30 to-transparent"
                  }`} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
                        (feeData?.balance || 0) > 0
                          ? "bg-rose-50 dark:bg-rose-900/40"
                          : "bg-emerald-50 dark:bg-emerald-900/40"
                      }`}>
                        {(feeData?.balance || 0) > 0 ? (
                          <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        )}
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${
                        (feeData?.balance || 0) > 0
                          ? "text-rose-600/70 dark:text-rose-400/70"
                          : "text-emerald-600/70 dark:text-emerald-400/70"
                      }`}>
                        {(feeData?.balance || 0) > 0 ? "Balance Due" : "Fully Paid"}
                      </p>
                    </div>
                    <p className={`text-2xl font-bold tracking-tight ${
                      (feeData?.balance || 0) > 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {formatCurrency(feeData?.balance || 0, countryCode)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Progress */}
              <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-700/60 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-emerald-100/40 dark:from-emerald-900/20 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-semibold text-gray-900 dark:text-white">Payment Progress</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      ((feeData?.paid || 0) / (feeData?.total || 1)) * 100 >= 100
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300"
                    }`}>
                      {Math.round(((feeData?.paid || 0) / (feeData?.total || 1)) * 100)}% Complete
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden ring-1 ring-gray-200/50 dark:ring-gray-600/30">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                        (feeData?.balance || 0) > 0
                          ? "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"
                          : "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"
                      }`}
                      style={{ width: `${((feeData?.paid || 0) / (feeData?.total || 1)) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              {(feeData?.balance || 0) > 0 && (
                <Link
                  href={`/parents/fees/pay?child=${child.id}`}
                  className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100" />
                  <CreditCard className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">Pay Outstanding Balance ({formatCurrency(feeData?.balance || 0, countryCode)})</span>
                </Link>
              )}

              {/* Cleared Status */}
              {(feeData?.balance || 0) === 0 && (
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-green-50/50 to-teal-50/30 dark:from-emerald-900/20 dark:via-green-900/15 dark:to-teal-900/10 ring-1 ring-emerald-100/80 dark:ring-emerald-800/40 text-center overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-200/30 via-green-200/20 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full blur-xl" />
                  <div className="relative">
                    <div className="inline-flex p-4 rounded-2xl bg-white/60 dark:bg-gray-800/40 ring-1 ring-emerald-100 dark:ring-emerald-800/30 shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                      All Fees Cleared!
                    </p>
                    <p className="text-sm text-emerald-600/70 dark:text-emerald-400/60 mt-2">
                      This student has no outstanding balance.
                    </p>
                  </div>
                </div>
              )}

              {/* Payment History Section */}
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="group relative p-4 rounded-xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{paymentHistory.filter(p => p.status === "Paid").length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group relative p-4 rounded-xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-100/50 dark:bg-amber-900/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30">
                        <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending</p>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{paymentHistory.filter(p => p.status === "Pending").length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group relative p-4 rounded-xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-rose-100/50 dark:bg-rose-900/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-rose-900/30">
                        <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Overdue</p>
                        <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{paymentHistory.filter(p => p.status === "Overdue").length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group relative p-4 rounded-xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30">
                        <Banknote className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(paymentHistory.reduce((sum, p) => sum + p.amount, 0), countryCode)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Year Filter */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowYearDropdown(!showYearDropdown);
                          setShowCategoryDropdown(false);
                          setShowStatusDropdown(false);
                          setShowExportDropdown(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 min-w-[140px] justify-between"
                      >
                        <span className="text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200">{paymentYearFilter}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${showYearDropdown ? "rotate-180" : ""}`} />
                      </button>
                      {showYearDropdown && (
                        <div className="absolute left-0 mt-2 w-44 py-1 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/30 purple:ring-pink-500/30 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                          {["2024 / 2025", "2023 / 2024", "2022 / 2023"].map((year) => (
                            <button
                              key={year}
                              onClick={() => {
                                setPaymentYearFilter(year);
                                setShowYearDropdown(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors ${
                                paymentYearFilter === year
                                  ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                                  : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowCategoryDropdown(!showCategoryDropdown);
                          setShowYearDropdown(false);
                          setShowStatusDropdown(false);
                          setShowExportDropdown(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 min-w-[160px] justify-between"
                      >
                        <span className="text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 truncate max-w-[120px]">{paymentCategoryFilter}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${showCategoryDropdown ? "rotate-180" : ""}`} />
                      </button>
                      {showCategoryDropdown && (
                        <div className="absolute left-0 mt-2 w-56 py-1 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/30 purple:ring-pink-500/30 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                          {paymentCategories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setPaymentCategoryFilter(category);
                                setShowCategoryDropdown(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors ${
                                paymentCategoryFilter === category
                                  ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                                  : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowStatusDropdown(!showStatusDropdown);
                          setShowYearDropdown(false);
                          setShowCategoryDropdown(false);
                          setShowExportDropdown(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 min-w-[130px] justify-between"
                      >
                        <span className="text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200">{paymentStatusFilter}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${showStatusDropdown ? "rotate-180" : ""}`} />
                      </button>
                      {showStatusDropdown && (
                        <div className="absolute left-0 mt-2 w-40 py-1 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/30 purple:ring-pink-500/30 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                          {["All Status", "Paid", "Pending", "Overdue", "Partial"].map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                setPaymentStatusFilter(status);
                                setShowStatusDropdown(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors ${
                                paymentStatusFilter === status
                                  ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                                  : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowExportDropdown(!showExportDropdown);
                        setShowYearDropdown(false);
                        setShowCategoryDropdown(false);
                        setShowStatusDropdown(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-white dark:bg-gray-700/50 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 midnight:hover:border-cyan-400 purple:hover:border-pink-400 transition-all duration-200 text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${showExportDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showExportDropdown && (
                      <div className="absolute right-0 mt-2 w-44 py-1 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/30 purple:ring-pink-500/30 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => {
                            // Export as PDF
                            const doc = new jsPDF();
                            const tenant = getTenantById(settings.tenantId);
                            doc.setFontSize(18);
                            doc.setFont("helvetica", "bold");
                            doc.text(tenant?.name || "School Name", 105, 20, { align: "center" });
                            doc.setFontSize(14);
                            doc.setFont("helvetica", "normal");
                            doc.text("Payment History Report", 105, 30, { align: "center" });
                            doc.setFontSize(10);
                            doc.text(`Student: ${child.fullName} | Class: ${child.classLevel} ${child.section}`, 105, 40, { align: "center" });
                            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 48, { align: "center" });

                            autoTable(doc, {
                              startY: 55,
                              head: [["Fee Type", "Category", "Amount", "Due Date", "Status", "Method"]],
                              body: paymentHistory.map((p) => [
                                p.feeType,
                                p.category,
                                formatCurrency(p.amount, countryCode),
                                new Date(p.dueDate).toLocaleDateString(),
                                p.status,
                                p.method,
                              ]),
                              styles: { fontSize: 9 },
                              headStyles: { fillColor: [79, 70, 229] },
                            });

                            doc.save(`Payment-History-${child.fullName.replace(/\s/g, "-")}.pdf`);
                            setShowExportDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-red-500" />
                          Export as PDF
                        </button>
                        <button
                          onClick={() => {
                            // Export as CSV
                            const headers = ["Fee Type", "Category", "Amount", "Due Date", "Payment Date", "Term", "Method", "Status", "Receipt Number", "Reference"];
                            const csvContent = [
                              headers.join(","),
                              ...paymentHistory.map((p) =>
                                [
                                  `"${p.feeType}"`,
                                  `"${p.category}"`,
                                  p.amount,
                                  p.dueDate,
                                  p.paymentDate,
                                  `"${p.term}"`,
                                  `"${p.method}"`,
                                  p.status,
                                  p.receiptNumber,
                                  p.reference,
                                ].join(",")
                              ),
                            ].join("\n");

                            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = `Payment-History-${child.fullName.replace(/\s/g, "-")}.csv`;
                            link.click();
                            setShowExportDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-green-500" />
                          Export as CSV
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* DataTable */}
                <DataTable<PaymentRecord>
                  data={paymentHistory}
                  columns={[
                    {
                      key: "feeType",
                      label: "Fee Type",
                      sortable: true,
                      className: "text-left",
                      render: (item) => (
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            item.category === "Tuition Fees" ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30" :
                            item.category === "Examination & Certification" ? "bg-purple-50 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30" :
                            item.category === "Extra-Curricular" ? "bg-amber-50 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30" :
                            item.category === "Laboratory" ? "bg-cyan-50 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30" :
                            "bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50"
                          }`}>
                            <Banknote className={`w-4 h-4 ${
                              item.category === "Tuition Fees" ? "text-blue-500 dark:text-blue-400" :
                              item.category === "Examination & Certification" ? "text-purple-500 dark:text-purple-400" :
                              item.category === "Extra-Curricular" ? "text-amber-500 dark:text-amber-400" :
                              item.category === "Laboratory" ? "text-cyan-500 dark:text-cyan-400" :
                              "text-gray-500 dark:text-gray-400"
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">{item.feeType}</p>
                            {item.receiptNumber && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60">{item.receiptNumber}</p>
                            )}
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "category",
                      label: "Category",
                      sortable: true,
                      className: "text-left",
                      hidden: { mobile: true },
                      render: (item) => (
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                          {item.category}
                        </span>
                      ),
                    },
                    {
                      key: "amount",
                      label: "Amount",
                      sortable: true,
                      sortValue: (item) => item.amount,
                      className: "text-left",
                      render: (item) => (
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
                          {formatCurrency(item.amount, countryCode)}
                        </span>
                      ),
                    },
                    {
                      key: "dueDate",
                      label: "Due Date",
                      sortable: true,
                      sortValue: (item) => new Date(item.dueDate).getTime(),
                      className: "text-left",
                      hidden: { mobile: true },
                      render: (item) => (
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                          {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      ),
                    },
                    {
                      key: "term",
                      label: "Term",
                      sortable: true,
                      className: "text-center",
                      hidden: { mobile: true, tablet: true },
                      render: (item) => (
                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                          {item.term}
                        </span>
                      ),
                    },
                    {
                      key: "method",
                      label: "Method",
                      sortable: true,
                      className: "text-center",
                      hidden: { mobile: true },
                      render: (item) => (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${
                          item.method === "Bank Transfer" ? "bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" :
                          item.method === "Card" ? "bg-violet-50 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30 text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400" :
                          item.method === "Cash" ? "bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" :
                          "bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400"
                        }`}>
                          <CreditCard className="w-3 h-3" />
                          {item.method}
                        </span>
                      ),
                    },
                    {
                      key: "status",
                      label: "Status",
                      sortable: true,
                      className: "text-center",
                      render: (item) => {
                        const statusStyles = {
                          Paid: "bg-green-100 dark:bg-green-950/30 midnight:bg-green-950/30 purple:bg-green-950/30 text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300 border-green-200 dark:border-green-800 midnight:border-green-800 purple:border-green-800",
                          Pending: "bg-amber-100 dark:bg-amber-950/30 midnight:bg-amber-950/30 purple:bg-amber-950/30 text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300 border-amber-200 dark:border-amber-800 midnight:border-amber-800 purple:border-amber-800",
                          Overdue: "bg-red-100 dark:bg-red-950/30 midnight:bg-red-950/30 purple:bg-red-950/30 text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300 border-red-200 dark:border-red-800 midnight:border-red-800 purple:border-red-800",
                          Partial: "bg-orange-100 dark:bg-orange-950/30 midnight:bg-orange-950/30 purple:bg-orange-950/30 text-orange-700 dark:text-orange-300 midnight:text-orange-300 purple:text-orange-300 border-orange-200 dark:border-orange-800 midnight:border-orange-800 purple:border-orange-800",
                        };
                        const dotColor = {
                          Paid: "bg-green-500",
                          Pending: "bg-amber-500",
                          Overdue: "bg-red-500",
                          Partial: "bg-orange-500",
                        };
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusStyles[item.status]}`}>
                            <span className={`w-2 h-2 rounded-full ${dotColor[item.status]}`}></span>
                            {item.status}
                          </span>
                        );
                      },
                    },
                    {
                      key: "actions",
                      label: "Actions",
                      sortable: false,
                      className: "text-center",
                      render: (item) => (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // View receipt details
                            }}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 midnight:text-cyan-400 midnight:hover:text-cyan-300 purple:text-pink-400 purple:hover:text-pink-300 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {item.status === "Paid" && item.receiptNumber && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Download receipt PDF
                                const doc = new jsPDF();
                                const tenant = getTenantById(settings.tenantId);
                                const pageWidth = doc.internal.pageSize.getWidth();

                                // Header
                                doc.setFillColor(79, 70, 229);
                                doc.rect(0, 0, pageWidth, 45, "F");
                                doc.setTextColor(255, 255, 255);
                                doc.setFontSize(24);
                                doc.setFont("helvetica", "bold");
                                doc.text(tenant?.name || "School Name", pageWidth / 2, 20, { align: "center" });
                                doc.setFontSize(12);
                                doc.setFont("helvetica", "normal");
                                doc.text("PAYMENT RECEIPT", pageWidth / 2, 32, { align: "center" });
                                doc.text(item.receiptNumber, pageWidth / 2, 40, { align: "center" });

                                // Receipt details
                                doc.setTextColor(0, 0, 0);
                                doc.setFontSize(11);
                                let y = 60;

                                doc.setFont("helvetica", "bold");
                                doc.text("Student:", 20, y);
                                doc.setFont("helvetica", "normal");
                                doc.text(child.fullName, 70, y);
                                y += 10;

                                doc.setFont("helvetica", "bold");
                                doc.text("Class:", 20, y);
                                doc.setFont("helvetica", "normal");
                                doc.text(`${child.classLevel} ${child.section}`, 70, y);
                                y += 10;

                                doc.setFont("helvetica", "bold");
                                doc.text("Fee Type:", 20, y);
                                doc.setFont("helvetica", "normal");
                                doc.text(item.feeType, 70, y);
                                y += 10;

                                doc.setFont("helvetica", "bold");
                                doc.text("Category:", 20, y);
                                doc.setFont("helvetica", "normal");
                                doc.text(item.category, 70, y);
                                y += 10;

                                doc.setFont("helvetica", "bold");
                                doc.text("Term:", 20, y);
                                doc.setFont("helvetica", "normal");
                                doc.text(item.term, 70, y);
                                y += 10;

                                doc.setFont("helvetica", "bold");
                                doc.text("Payment Date:", 20, y);
                                doc.setFont("helvetica", "normal");
                                doc.text(new Date(item.paymentDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), 70, y);
                                y += 10;

                                doc.setFont("helvetica", "bold");
                                doc.text("Method:", 20, y);
                                doc.setFont("helvetica", "normal");
                                doc.text(item.method, 70, y);
                                y += 10;

                                doc.setFont("helvetica", "bold");
                                doc.text("Reference:", 20, y);
                                doc.setFont("helvetica", "normal");
                                doc.text(item.reference, 70, y);
                                y += 20;

                                // Amount box
                                doc.setFillColor(243, 244, 246);
                                doc.roundedRect(20, y, pageWidth - 40, 25, 3, 3, "F");
                                doc.setFontSize(14);
                                doc.setFont("helvetica", "bold");
                                doc.text("Amount Paid:", 30, y + 16);
                                doc.setTextColor(16, 185, 129);
                                doc.text(formatCurrency(item.amount, countryCode), pageWidth - 30, y + 16, { align: "right" });

                                // Footer
                                doc.setTextColor(128, 128, 128);
                                doc.setFontSize(9);
                                doc.setFont("helvetica", "normal");
                                doc.text("This is a computer-generated receipt. No signature required.", pageWidth / 2, 270, { align: "center" });
                                doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 278, { align: "center" });

                                doc.save(`Receipt-${item.receiptNumber}.pdf`);
                              }}
                              className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 midnight:text-cyan-400 midnight:hover:text-cyan-300 purple:text-pink-400 purple:hover:text-pink-300 transition-colors cursor-pointer"
                              title="Download Receipt"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          {(item.status === "Pending" || item.status === "Overdue") && (
                            <Link
                              href={`/parents/fees/pay?child=${child.id}&fee=${item.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 midnight:hover:bg-emerald-500/10 purple:hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 midnight:text-emerald-400 midnight:hover:text-emerald-300 purple:text-emerald-400 purple:hover:text-emerald-300 transition-colors cursor-pointer"
                              title="Pay Now"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      ),
                    },
                  ]}
                  title="Payment History"
                  searchPlaceholder="Search by fee type, receipt number..."
                  showSearch={true}
                  defaultItemsPerPage={10}
                  getRowKey={(item) => item.id}
                  emptyMessage="No payment records available"
                  enablePagination={true}
                  enableItemsPerPage={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Teacher Modal */}
      <MessageTeacherModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        childName={child.fullName}
        childClass={`${child.classLevel}${child.section ? ` ${child.section}` : ""}`}
      />
    </MainLayout>
  );
}
