"use client";

import { useState, useMemo, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  CreditCard,
  Banknote,
  Wallet,
  Building2,
  GraduationCap,
  FileCheck,
  BookOpen,
  Bus,
  Home,
  FileText,
  Trophy,
  MoreHorizontal,
  Users,
  Landmark,
  Award,
  UtensilsCrossed,
} from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import CustomDropdown from "@/components/shared/CustomDropdown";
import Tooltip from "@/components/shared/Tooltip";
import StatCard from "@/components/shared/StatCard";
import ExportButton from "@/components/shared/ExportButton";
import { exportFeesToPDF } from "@/utils/feesPdfExport";
import { exportFeesToExcel } from "@/utils/feesExcelExport";
import { getStudentById } from "@/lib/mockStudents";
import {
  EducationLevel,
  SchoolType,
  getFeesByEducationLevel,
  getFeesBySchoolType,
  getFeeCategoriesForSchoolType,
  FEE_CATEGORIES
} from "@/lib/feeConfigNew";
import { useCountry } from "@/contexts/CountryContext";

// Icon mapping
const iconMap: Record<string, any> = {
  GraduationCap,
  FileCheck,
  Building2,
  BookOpen,
  Bus,
  Home,
  FileText,
  Trophy,
  MoreHorizontal,
  Users,
  Landmark,
  Award,
  UtensilsCrossed,
};

interface FeeRecord {
  id: string;
  category: string;
  feeType: string;
  feeCode: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: "Paid" | "Unpaid" | "Partial" | "Overdue";
  refId?: string;
  paymentMode?: string;
  datePaid?: string;
  discount: number;
  fine: number;
  semester?: string;
  academicYear: string;
}

interface FeesManagementProps {
  educationLevel?: EducationLevel;
  schoolType?: SchoolType;
  studentId?: string;
}

// Mock data - Comprehensive fee records for all school types
const MOCK_FEE_RECORDS: FeeRecord[] = [
  // COMMON FEES (applicable to all school types)
  {
    id: "1",
    category: "tuition",
    feeType: "Monthly Tuition Fee",
    feeCode: "TUI-DEC-2024",
    dueDate: "2024-12-10",
    amount: 2500,
    paidAmount: 2500,
    status: "Paid",
    refId: "#TXN435443",
    paymentMode: "Cash",
    datePaid: "2024-12-05",
    discount: 0,
    fine: 0,
    academicYear: "2024-2025",
  },
  {
    id: "2",
    category: "tuition",
    feeType: "Monthly Tuition Fee",
    feeCode: "TUI-JAN-2025",
    dueDate: "2025-01-10",
    amount: 2500,
    paidAmount: 2250,
    status: "Partial",
    refId: "#TXN435450",
    paymentMode: "Online",
    datePaid: "2025-01-08",
    discount: 250,
    fine: 0,
    academicYear: "2024-2025",
  },
  {
    id: "3",
    category: "admission",
    feeType: "Admission Fee",
    feeCode: "ADM-2024",
    dueDate: "2024-03-25",
    amount: 5000,
    paidAmount: 5000,
    status: "Paid",
    refId: "#TXN435454",
    paymentMode: "Card",
    datePaid: "2024-03-20",
    discount: 0,
    fine: 0,
    academicYear: "2024-2025",
  },
  {
    id: "4",
    category: "academic",
    feeType: "Library Fee",
    feeCode: "LIB-2024",
    dueDate: "2024-04-15",
    amount: 1000,
    paidAmount: 1000,
    status: "Paid",
    refId: "#TXN435460",
    paymentMode: "Cash",
    datePaid: "2024-04-10",
    discount: 0,
    fine: 0,
    academicYear: "2024-2025",
  },
  {
    id: "5",
    category: "academic",
    feeType: "Computer Lab Fee",
    dueDate: "2024-07-01",
    feeCode: "LAB-S1-2024",
    amount: 1500,
    paidAmount: 0,
    status: "Unpaid",
    discount: 0,
    fine: 150,
    semester: "Semester 1",
    academicYear: "2024-2025",
  },
  {
    id: "7",
    category: "examination",
    feeType: "Examination Fee",
    feeCode: "EXM-S1-2024",
    dueDate: "2024-11-30",
    amount: 1200,
    paidAmount: 1200,
    status: "Paid",
    refId: "#TXN435470",
    paymentMode: "Online",
    datePaid: "2024-11-25",
    discount: 0,
    fine: 0,
    semester: "Semester 1",
    academicYear: "2024-2025",
  },
  {
    id: "8",
    category: "sports",
    feeType: "Sports Fee",
    feeCode: "SPT-2024",
    dueDate: "2024-08-10",
    amount: 600,
    paidAmount: 600,
    status: "Paid",
    refId: "#TXN435475",
    paymentMode: "Cash",
    datePaid: "2024-08-05",
    discount: 100,
    fine: 0,
    academicYear: "2024-2025",
  },

  // PRIVATE & PUBLIC SCHOOL ONLY (transport)
  {
    id: "6",
    category: "transport",
    feeType: "Monthly Transport Fee",
    feeCode: "TRP-FEB-2025",
    dueDate: "2025-02-05",
    amount: 800,
    paidAmount: 0,
    status: "Unpaid",
    discount: 0,
    fine: 0,
    academicYear: "2024-2025",
  },

  // TERTIARY ONLY
  {
    id: "9",
    category: "hostel",
    feeType: "Hostel Accommodation",
    feeCode: "HST-S1-2024",
    dueDate: "2024-09-15",
    amount: 3500,
    paidAmount: 3500,
    status: "Paid",
    refId: "#TXN435480",
    paymentMode: "Online",
    datePaid: "2024-09-10",
    discount: 0,
    fine: 0,
    semester: "Semester 1",
    academicYear: "2024-2025",
  },
  {
    id: "10",
    category: "departmental",
    feeType: "Departmental Fee",
    feeCode: "DEPT-2024",
    dueDate: "2024-10-01",
    amount: 2000,
    paidAmount: 2000,
    status: "Paid",
    refId: "#TXN435485",
    paymentMode: "Bank Transfer",
    datePaid: "2024-09-28",
    discount: 0,
    fine: 0,
    academicYear: "2024-2025",
  },

  // PRIVATE SCHOOL ONLY
  {
    id: "11",
    category: "pta",
    feeType: "PTA Levy",
    feeCode: "PTA-2024",
    dueDate: "2024-04-20",
    amount: 500,
    paidAmount: 500,
    status: "Paid",
    refId: "#TXN435490",
    paymentMode: "Cash",
    datePaid: "2024-04-15",
    discount: 0,
    fine: 0,
    academicYear: "2024-2025",
  },

  // PUBLIC SCHOOL ONLY
  {
    id: "12",
    category: "govt_levy",
    feeType: "Government Exam Levy",
    feeCode: "GOV-2024",
    dueDate: "2024-05-10",
    amount: 1000,
    paidAmount: 1000,
    status: "Paid",
    refId: "#TXN435495",
    paymentMode: "Cash",
    datePaid: "2024-05-08",
    discount: 0,
    fine: 0,
    academicYear: "2024-2025",
  },
];

export default function FeesManagement({
  educationLevel = "primary",
  schoolType: propSchoolType,
  studentId
}: FeesManagementProps) {
  const { countryConfig } = useCountry();
  const currencySymbol = countryConfig.currency.symbol;

  // Read institution type from School Profile settings
  const [schoolType, setSchoolType] = useState<SchoolType>(() => {
    if (typeof window !== "undefined") {
      // Read from new School Profile settings
      const institutionType = localStorage.getItem("institutionType");
      const educationLevelSetting = localStorage.getItem("educationLevel");

      // Map institutionType to schoolType
      if (institutionType === "public") return "public";
      if (institutionType === "private") return "private";
      if (educationLevelSetting === "tertiary") return "tertiary";

      // Legacy fallback
      const saved = localStorage.getItem("schoolType") as SchoolType | null;
      return saved || propSchoolType || "private";
    }
    return propSchoolType || "private";
  });

  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Listen for School Profile changes
  useEffect(() => {
    const handleSchoolProfileChange = (event: CustomEvent<{ educationLevel: string; institutionType: string }>) => {
      const { educationLevel: settingsEducationLevel, institutionType } = event.detail;

      // Map institutionType to schoolType
      if (institutionType === "public") {
        setSchoolType("public");
      } else if (institutionType === "private") {
        setSchoolType("private");
      } else if (settingsEducationLevel === "tertiary") {
        setSchoolType("tertiary");
      }
    };

    window.addEventListener("schoolProfileChanged" as any, handleSchoolProfileChange);
    return () => window.removeEventListener("schoolProfileChanged" as any, handleSchoolProfileChange);
  }, []);

  // Get categories applicable to the school type
  const applicableCategories = useMemo(() =>
    getFeeCategoriesForSchoolType(schoolType),
    [schoolType]
  );

  // Filter records
  const filteredRecords = useMemo(() => {
    // Get valid category IDs for the current school type
    const validCategoryIds = applicableCategories.map(cat => cat.id);

    return MOCK_FEE_RECORDS.filter((record) => {
      // Filter out records with categories not applicable to this school type
      if (!validCategoryIds.includes(record.category)) return false;

      if (selectedCategory !== "all" && record.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && record.status.toLowerCase() !== selectedStatus) return false;
      return true;
    });
  }, [selectedCategory, selectedStatus, applicableCategories]);

  // Export handlers
  const handleExportPDF = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const filename = `fee_records_${dateStr}.pdf`;

    // Get student information if studentId is provided
    let studentInfo;
    if (studentId) {
      const student = getStudentById(studentId);
      if (student) {
        studentInfo = {
          name: student.name,
          rollNo: student.rollNo,
          class: student.class,
          admissionNumber: student.id, // Using ID as admission number
        };
      }
    }

    // Transform filteredRecords to match export interface
    const exportData = filteredRecords.map(record => {
      const category = applicableCategories.find(cat => cat.id === record.category);
      return {
        feeType: record.feeType,
        feeCode: record.feeCode,
        category: category ? category.name : record.category,
        amount: record.amount,
        dueDate: record.dueDate,
        status: record.status,
        paymentDate: record.datePaid,
        paymentMode: record.paymentMode,
        discount: record.discount,
        fine: record.fine,
        academicYear: record.academicYear,
      };
    });

    exportFeesToPDF(exportData, filename, studentInfo);
  };

  const handleExportExcel = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const filename = `fee_records_${dateStr}.xlsx`;

    // Get student information if studentId is provided
    let studentInfo;
    if (studentId) {
      const student = getStudentById(studentId);
      if (student) {
        studentInfo = {
          name: student.name,
          rollNo: student.rollNo,
          class: student.class,
          admissionNumber: student.id, // Using ID as admission number
        };
      }
    }

    // Transform filteredRecords to match export interface
    const exportData = filteredRecords.map(record => {
      const category = applicableCategories.find(cat => cat.id === record.category);
      return {
        feeType: record.feeType,
        feeCode: record.feeCode,
        category: category ? category.name : record.category,
        amount: record.amount,
        dueDate: record.dueDate,
        status: record.status,
        paymentDate: record.datePaid,
        paymentMode: record.paymentMode,
        discount: record.discount,
        fine: record.fine,
        academicYear: record.academicYear,
      };
    });

    exportFeesToExcel(exportData, filename, studentInfo);
  };

  // Handle scroll indicators and animations for horizontal scrolling
  useEffect(() => {
    const handleScrollIndicators = () => {
      const tableContainer = document.querySelector('.overflow-x-auto');
      const leftIndicator = document.getElementById('scroll-left-indicator');
      const rightIndicator = document.getElementById('scroll-right-indicator');
      const table = tableContainer?.querySelector('table');

      if (!tableContainer || !leftIndicator || !rightIndicator || !table) return;

      let scrollTimeout: NodeJS.Timeout;
      let isScrolling = false;

      const handleScroll = () => {
        const scrollLeft = tableContainer.scrollLeft;
        const scrollWidth = tableContainer.scrollWidth;
        const clientWidth = tableContainer.clientWidth;
        const maxScroll = scrollWidth - clientWidth;

        // Add scrolling class for animation
        if (!isScrolling) {
          table.classList.add('is-scrolling');
          isScrolling = true;
        }

        // Clear previous timeout
        clearTimeout(scrollTimeout);

        // Show left indicator when scrolled right
        if (scrollLeft > 10) {
          leftIndicator.style.opacity = '1';
        } else {
          leftIndicator.style.opacity = '0';
        }

        // Hide right indicator when scrolled to end
        if (scrollLeft >= maxScroll - 10) {
          rightIndicator.style.opacity = '0';
        } else if (scrollWidth > clientWidth) {
          rightIndicator.style.opacity = '1';
        }

        // Add smooth scale effect to non-sticky columns
        const scrollProgress = scrollLeft / maxScroll;
        const nonStickyHeaders = table.querySelectorAll('th:not(.sticky)');

        nonStickyHeaders.forEach((header: Element) => {
          const htmlHeader = header as HTMLElement;
          htmlHeader.style.transform = `scale(${0.98 + (0.02 * Math.abs(Math.sin(scrollProgress * Math.PI)))})`;
        });

        // Remove scrolling class after scrolling stops
        scrollTimeout = setTimeout(() => {
          table.classList.remove('is-scrolling');
          isScrolling = false;

          // Reset transforms
          nonStickyHeaders.forEach((header: Element) => {
            const htmlHeader = header as HTMLElement;
            htmlHeader.style.transform = 'scale(1)';
          });
        }, 150);
      };

      tableContainer.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();

      return () => {
        tableContainer.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    };

    // Delay to ensure DOM is ready
    const timer = setTimeout(handleScrollIndicators, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Calculate statistics (only for applicable categories)
  const stats = useMemo(() => {
    const validCategoryIds = applicableCategories.map(cat => cat.id);
    const relevantRecords = MOCK_FEE_RECORDS.filter(r => validCategoryIds.includes(r.category));

    const total = relevantRecords.reduce((sum, r) => sum + r.amount, 0);
    const paid = relevantRecords.reduce((sum, r) => sum + r.paidAmount, 0);
    const pending = total - paid;
    const totalDiscount = relevantRecords.reduce((sum, r) => sum + r.discount, 0);
    const totalFine = relevantRecords.reduce((sum, r) => sum + r.fine, 0);

    return {
      totalFees: total,
      paidFees: paid,
      pendingFees: pending,
      totalDiscount,
      totalFine,
      paymentPercentage: total > 0 ? ((paid / total) * 100).toFixed(1) : "0",
    };
  }, [applicableCategories]);

  // Get status badge
  const getStatusBadge = (status: FeeRecord["status"]) => {
    const variants = {
      Paid: {
        bg: "bg-green-50 dark:bg-green-950/20 midnight:bg-green-950/20 purple:bg-green-950/20",
        text: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
        dot: "bg-green-500",
        border: "border-green-200 dark:border-green-800/50 midnight:border-green-800/50 purple:border-green-800/50",
      },
      Unpaid: {
        bg: "bg-red-50 dark:bg-red-950/20 midnight:bg-red-950/20 purple:bg-red-950/20",
        text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        dot: "bg-red-500",
        border: "border-red-200 dark:border-red-800/50 midnight:border-red-800/50 purple:border-red-800/50",
      },
      Partial: {
        bg: "bg-amber-50 dark:bg-amber-950/20 midnight:bg-amber-950/20 purple:bg-amber-950/20",
        text: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        dot: "bg-amber-500",
        border: "border-amber-200 dark:border-amber-800/50 midnight:border-amber-800/50 purple:border-amber-800/50",
      },
      Overdue: {
        bg: "bg-orange-50 dark:bg-orange-950/20 midnight:bg-orange-950/20 purple:bg-orange-950/20",
        text: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
        dot: "bg-orange-500",
        border: "border-orange-200 dark:border-orange-800/50 midnight:border-orange-800/50 purple:border-orange-800/50",
      },
    };

    const style = variants[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`}></span>
        {status}
      </span>
    );
  };

  // Get category icon and color
  const getCategoryBadge = (categoryId: string) => {
    const category = FEE_CATEGORIES[categoryId];
    if (!category) return null;

    const Icon = iconMap[category.icon];
    const colorClasses: Record<string, string> = {
      blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
      green: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
      purple: "bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
      indigo: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50",
      amber: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
      rose: "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50",
      cyan: "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50",
      orange: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
      gray: "bg-gray-50 dark:bg-gray-800/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700/50",
      violet: "bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/50",
      emerald: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
      sky: "bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/50",
      lime: "bg-lime-50 dark:bg-lime-950/20 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800/50",
      slate: "bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800/50",
      yellow: "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
      pink: "bg-pink-50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800/50",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium border ${colorClasses[category.color]}`}>
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {category.name}
      </span>
    );
  };

  // Get category name with tooltip
  const getCategoryName = (categoryId: string) => {
    const category = FEE_CATEGORIES[categoryId];
    if (!category) return categoryId;

    const Icon = iconMap[category.icon];
    const colorClasses: Record<string, string> = {
      blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
      green: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
      purple: "bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
      indigo: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50",
      amber: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
      rose: "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50",
      cyan: "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50",
      orange: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
      gray: "bg-gray-50 dark:bg-gray-800/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700/50",
      violet: "bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/50",
      emerald: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
      sky: "bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/50",
      lime: "bg-lime-50 dark:bg-lime-950/20 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800/50",
      slate: "bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800/50",
      yellow: "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
      pink: "bg-pink-50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800/50",
    };

    const badgeContent = (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium border ${colorClasses[category.color]} whitespace-nowrap max-w-[140px]`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
        <span className="truncate">{category.name}</span>
      </span>
    );

    // Only show tooltip if category name is long enough to be truncated
    if (category.name.length > 15) {
      return (
        <Tooltip content={category.name} delay={200}>
          {badgeContent}
        </Tooltip>
      );
    }

    return badgeContent;
  };

  // Table columns
  const columns: Column<FeeRecord>[] = [
    {
      key: "feeType",
      label: "Fee Details",
      sortable: true,
      className: "text-left sticky left-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-gradient-to-b after:from-transparent after:via-gray-200 after:to-transparent dark:after:via-gray-700",
      render: (row) => {
        const content = (
          <div className="flex flex-col gap-1 pr-4">
            <span className="text-[12px] font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap">
              {row.feeType}
            </span>
            <span className="text-[12px] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 font-mono">
              {row.feeCode}
            </span>
          </div>
        );

        // Show tooltip if fee type is long
        if (row.feeType.length > 20) {
          return (
            <Tooltip content={`${row.feeType} (${row.feeCode})`} delay={300}>
              {content}
            </Tooltip>
          );
        }

        return content;
      },
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (row) => getCategoryName(row.category),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row) => {
        const content = (
          <span className="text-xs font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap">
            {currencySymbol}{row.amount.toLocaleString()}
          </span>
        );

        // Show tooltip with breakdown for partial payments
        if (row.paidAmount > 0 && row.paidAmount < row.amount) {
          const remaining = row.amount - row.paidAmount;
          return (
            <Tooltip
              content={`Total: ${currencySymbol}${row.amount.toLocaleString()} | Paid: ${currencySymbol}${row.paidAmount.toLocaleString()} | Remaining: ${currencySymbol}${remaining.toLocaleString()}`}
              delay={200}
            >
              {content}
            </Tooltip>
          );
        }

        return content;
      },
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
            {new Date(row.dueDate).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "datePaid",
      label: "Payment Date",
      sortable: true,
      render: (row) => (
        row.datePaid ? (
          <span className="text-xs text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
            {new Date(row.datePaid).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
        )
      ),
    },
    {
      key: "paymentMode",
      label: "Method of Payment",
      sortable: true,
      render: (row) => (
        row.paymentMode ? (
          <span className="text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
            {row.paymentMode}
          </span>
        ) : (
          <span className="text-[12px] text-gray-400 dark:text-gray-500">-</span>
        )
      ),
    },
    {
      key: "adjustments",
      label: "Adjustments",
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          {row.discount > 0 && (
            <span className="text-[12px] text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
              -{currencySymbol}{row.discount}
            </span>
          )}
          {row.fine > 0 && (
            <span className="text-[12px] text-red-600 dark:text-red-400 font-medium whitespace-nowrap">
              +{currencySymbol}{row.fine}
            </span>
          )}
          {row.discount === 0 && row.fine === 0 && (
            <span className="text-[12px] text-gray-400">-</span>
          )}
        </div>
      ),
    },
  ];

  const yearOptions = [
    { label: "2024 / 2025", value: "2024-2025" },
    { label: "2023 / 2024", value: "2023-2024" },
    { label: "2022 / 2023", value: "2022-2023" },
  ];

  // Category options for dropdown (using the memoized applicableCategories from above)
  const categoryOptions = [
    { label: "All Categories", value: "all" },
    ...applicableCategories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Partial", value: "partial" },
    { label: "Overdue", value: "overdue" },
  ];

  return (
    <>
      {/* Smooth scrolling styles */}
      <style jsx>{`
        .overflow-x-auto {
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          scroll-snap-type: x proximity;
        }

        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:active {
          background-color: rgba(59, 130, 246, 0.8);
        }

        @media (prefers-color-scheme: dark) {
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.5);
          }

          .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background-color: rgba(75, 85, 99, 0.7);
          }

          .overflow-x-auto::-webkit-scrollbar-thumb:active {
            background-color: rgba(59, 130, 246, 0.6);
          }
        }

        /* Table scroll animations */
        table {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        table.is-scrolling {
          filter: brightness(0.98);
        }

        table th,
        table td {
          transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        table.is-scrolling th:not(.sticky),
        table.is-scrolling td:not(.sticky) {
          opacity: 0.95;
        }

        /* Sticky column enhanced shadow on scroll */
        table.is-scrolling th.sticky,
        table.is-scrolling td.sticky {
          box-shadow: 2px 0 8px -2px rgba(0, 0, 0, 0.15);
        }

        @media (prefers-color-scheme: dark) {
          table.is-scrolling {
            filter: brightness(1.02);
          }

          table.is-scrolling th.sticky,
          table.is-scrolling td.sticky {
            box-shadow: 2px 0 8px -2px rgba(0, 0, 0, 0.4);
          }
        }

        /* Smooth fade for scroll indicators */
        #scroll-left-indicator,
        #scroll-right-indicator {
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Add subtle pulse animation to scroll indicators */
        @keyframes pulse-indicator {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        #scroll-right-indicator {
          animation: pulse-indicator 2s ease-in-out infinite;
        }

        /* Smooth momentum scrolling for iOS */
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      <div className="space-y-4 sm:space-y-6">
        {/* Statistics Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            icon={Banknote}
            label="Total Fees"
            value={stats.totalFees.toLocaleString()}
            color="blue"
            currencySymbol={currencySymbol}
            badge="100%"
          />

          <StatCard
            icon={TrendingUp}
            label="Paid Fees"
            value={stats.paidFees.toLocaleString()}
            color="green"
            currencySymbol={currencySymbol}
            badge={`${stats.paymentPercentage}%`}
          />

          <StatCard
            icon={TrendingDown}
            label="Pending Fees"
            value={stats.pendingFees.toLocaleString()}
            color="red"
            currencySymbol={currencySymbol}
            badge={`${(100 - parseFloat(stats.paymentPercentage)).toFixed(1)}%`}
          />

          <StatCard
            icon={Wallet}
            label="Total Discount"
            value={stats.totalDiscount.toLocaleString()}
            color="purple"
            currencySymbol={currencySymbol}
            badge={`${stats.totalFees > 0 ? ((stats.totalDiscount / stats.totalFees) * 100).toFixed(1) : '0'}%`}
          />

          <StatCard
            icon={AlertCircle}
            label="Total Fine"
            value={stats.totalFine.toLocaleString()}
            color="orange"
            currencySymbol={currencySymbol}
            badge={`${stats.totalFees > 0 ? ((stats.totalFine / stats.totalFees) * 100).toFixed(1) : '0'}%`}
          />
        </div>

      {/* Filters Section - Fully Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
          <CustomDropdown
            value={selectedYear}
            options={yearOptions}
            onChange={(value) => setSelectedYear(value as string)}
            variant="blue"
            className="w-full sm:w-40"
          />
          <CustomDropdown
            value={selectedCategory}
            options={categoryOptions}
            onChange={(value) => setSelectedCategory(value as string)}
            variant="purple"
            className="w-full sm:w-48"
          />
          <CustomDropdown
            value={selectedStatus}
            options={statusOptions}
            onChange={(value) => setSelectedStatus(value as string)}
            variant="blue"
            className="w-full sm:w-36"
          />
        </div>

        <ExportButton
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          description="Download fee records"
        />
      </div>

      {/* Data Table - Responsive with smooth horizontal scrolling */}
      <div className="relative">
        {/* Scroll indicator gradients for better UX */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-100/80 to-transparent dark:from-gray-800/80 pointer-events-none z-20 rounded-l-xl opacity-0 transition-opacity duration-300" id="scroll-left-indicator"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100/80 to-transparent dark:from-gray-800/80 pointer-events-none z-20 rounded-r-xl opacity-100 transition-opacity duration-300 lg:opacity-0" id="scroll-right-indicator"></div>

        <DataTable
          columns={columns}
          data={filteredRecords}
          getRowKey={(item) => item.id}
          enablePagination={true}
          enableSearch={true}
          enableItemsPerPage={true}
          emptyMessage="No fee records found"
        />
      </div>
      </div>
    </>
  );
}
