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

  // Read school type from localStorage, fallback to prop or default
  const [schoolType, setSchoolType] = useState<SchoolType>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("schoolType") as SchoolType | null;
      return saved || propSchoolType || "private";
    }
    return propSchoolType || "private";
  });

  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Update school type when settings change
  useEffect(() => {
    const handleSchoolTypeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ schoolType: SchoolType }>;
      if (customEvent.detail?.schoolType) {
        setSchoolType(customEvent.detail.schoolType);
      }
    };

    // Listen for custom event from settings page
    window.addEventListener("schoolTypeChanged", handleSchoolTypeChange);

    return () => {
      window.removeEventListener("schoolTypeChanged", handleSchoolTypeChange);
    };
  }, []);

  // Get categories applicable to the school type
  const applicableCategories = useMemo(() =>
    getFeeCategoriesForSchoolType(schoolType),
    [schoolType]
  );

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
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
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
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClasses[category.color]}`}>
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {category.name}
      </span>
    );
  };

  // Table columns
  const columns: Column<FeeRecord>[] = [
    {
      key: "feeType",
      label: "Fee Details",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            {row.feeType}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 font-mono">
            {row.feeCode}
          </span>
          {row.semester && (
            <span className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">
              {row.semester}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (row) => getCategoryBadge(row.category),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
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
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            {currencySymbol}{row.amount.toLocaleString()}
          </span>
          {row.paidAmount > 0 && row.paidAmount < row.amount && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Paid: {currencySymbol}{row.paidAmount.toLocaleString()}
            </span>
          )}
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
      key: "payment",
      label: "Payment Info",
      render: (row) => (
        row.refId ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-mono text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                {row.refId}
              </span>
            </div>
            {row.paymentMode && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {row.paymentMode}
              </span>
            )}
            {row.datePaid && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(row.datePaid).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
        )
      ),
    },
    {
      key: "adjustments",
      label: "Discount / Fine",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          {row.discount > 0 && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              -{currencySymbol}{row.discount}
            </span>
          )}
          {row.fine > 0 && (
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              +{currencySymbol}{row.fine}
            </span>
          )}
          {row.discount === 0 && row.fine === 0 && (
            <span className="text-xs text-gray-400">-</span>
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
    <div className="space-y-6">
      {/* School Type Indicator */}
      <div className="bg-blue-50 dark:bg-blue-950/20 midnight:bg-blue-950/20 purple:bg-blue-950/20 border border-blue-200 dark:border-blue-700 midnight:border-blue-700 purple:border-blue-700 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <span className="font-semibold">School Type:</span>{" "}
            <span className="capitalize">{schoolType === "tertiary" ? "Tertiary Institution" : schoolType + " School"}</span>
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Fees */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 midnight:from-cyan-950/20 midnight:to-blue-950/10 purple:from-pink-950/20 purple:to-purple-950/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-wide">
              Total Fees
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {currencySymbol}{stats.totalFees.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Paid Fees */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/10 midnight:from-green-950/20 midnight:to-emerald-950/10 purple:from-green-950/20 purple:to-emerald-950/10 rounded-xl p-4 border border-green-200/50 dark:border-green-800/30 midnight:border-green-500/20 purple:border-green-500/20">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              {stats.paymentPercentage}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
              Paid Fees
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {currencySymbol}{stats.paidFees.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50/50 dark:from-red-950/20 dark:to-rose-950/10 midnight:from-red-950/20 midnight:to-rose-950/10 purple:from-red-950/20 purple:to-rose-950/10 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30 midnight:border-red-500/20 purple:border-red-500/20">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 dark:bg-red-400/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
              Pending Fees
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {currencySymbol}{stats.pendingFees.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Discount */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/10 midnight:from-purple-950/20 midnight:to-violet-950/10 purple:from-pink-950/20 purple:to-purple-950/10 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30 midnight:border-purple-500/20 purple:border-pink-500/20">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400 uppercase tracking-wide">
              Total Discount
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {currencySymbol}{stats.totalDiscount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Fine */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/10 midnight:from-orange-950/20 midnight:to-amber-950/10 purple:from-orange-950/20 purple:to-amber-950/10 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/30 midnight:border-orange-500/20 purple:border-orange-500/20">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 dark:bg-orange-400/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
              Total Fine
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {currencySymbol}{stats.totalFine.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <CustomDropdown
            value={selectedYear}
            options={yearOptions}
            onChange={(value) => setSelectedYear(value as string)}
            variant="blue"
            className="w-40"
          />
          <CustomDropdown
            value={selectedCategory}
            options={categoryOptions}
            onChange={(value) => setSelectedCategory(value as string)}
            variant="purple"
            className="w-48"
          />
          <CustomDropdown
            value={selectedStatus}
            options={statusOptions}
            onChange={(value) => setSelectedStatus(value as string)}
            variant="blue"
            className="w-36"
          />
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 midnight:hover:bg-cyan-600 purple:hover:bg-pink-600 transition-colors cursor-pointer">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Data Table */}
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
  );
}
