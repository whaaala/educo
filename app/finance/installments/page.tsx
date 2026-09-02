"use client";

import { useState, useMemo, useEffect } from "react";
import { DataManagementPage } from "@/components/pages";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import Button from "@/components/shared/Button";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import StatCard from "@/components/shared/StatCard";
import Modal from "@/components/shared/Modal";
import InstallmentPlanModal from "@/components/finance/InstallmentPlanModal";
import ActionModal from "@/components/shared/ActionModal";
import FormInput from "@/components/shared/FormInput";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Eye,
  TrendingUp,
  XCircle,
  Layers,
  Copy,
  DollarSign,
  User,
} from "lucide-react";
import { exportInstallmentPlansToPDF } from "@/utils/installmentPdfExport";
import { exportInstallmentPlansToExcel } from "@/utils/installmentExcelExport";
import { ACADEMIC_YEARS, TERMS_WITH_ALL, CLASS_OPTIONS, INSTALLMENT_STATUS_OPTIONS } from "../config";

// Installment Plan Status
type InstallmentPlanStatus = "active" | "completed" | "defaulted" | "cancelled";

// Individual Installment Status
type InstallmentStatus = "pending" | "paid" | "overdue" | "partially_paid" | "waived";

// Individual Installment
interface Installment {
  id: string;
  sequence: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: InstallmentStatus;
  paidDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  lateFeeApplied?: number;
}

// Installment Plan
interface InstallmentPlan {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classLevel: string;
  feeTypeName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  installmentCount: number;
  frequency: "monthly" | "quarterly" | "custom";
  startDate: string;
  endDate: string;
  status: InstallmentPlanStatus;
  installments: Installment[];
  academicYear: string;
  term: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const MOCK_INSTALLMENT_PLANS: InstallmentPlan[] = [
  {
    id: "ip-001",
    studentId: "std-001",
    studentName: "John Adebayo",
    studentNumber: "STU2024001",
    classLevel: "SSS 1",
    feeTypeName: "Tuition Fee",
    totalAmount: 150000,
    paidAmount: 100000,
    remainingAmount: 50000,
    installmentCount: 3,
    frequency: "monthly",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    status: "active",
    academicYear: "2024-2025",
    term: "first-term",
    installments: [
      { id: "ins-001", sequence: 1, dueDate: "2024-01-15", amount: 50000, paidAmount: 50000, status: "paid", paidDate: "2024-01-14", paymentMethod: "Bank Transfer", paymentReference: "TRF123456" },
      { id: "ins-002", sequence: 2, dueDate: "2024-02-15", amount: 50000, paidAmount: 50000, status: "paid", paidDate: "2024-02-15", paymentMethod: "Online", paymentReference: "ONL789012" },
      { id: "ins-003", sequence: 3, dueDate: "2024-03-15", amount: 50000, paidAmount: 0, status: "pending" },
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-02-15",
  },
  {
    id: "ip-002",
    studentId: "std-002",
    studentName: "Amina Bello",
    studentNumber: "STU2024002",
    classLevel: "SSS 2",
    feeTypeName: "Tuition Fee",
    totalAmount: 180000,
    paidAmount: 60000,
    remainingAmount: 120000,
    installmentCount: 3,
    frequency: "monthly",
    startDate: "2024-01-20",
    endDate: "2024-03-20",
    status: "active",
    academicYear: "2024-2025",
    term: "first-term",
    installments: [
      { id: "ins-004", sequence: 1, dueDate: "2024-01-20", amount: 60000, paidAmount: 60000, status: "paid", paidDate: "2024-01-19", paymentMethod: "Cash", paymentReference: "CSH345678" },
      { id: "ins-005", sequence: 2, dueDate: "2024-02-20", amount: 60000, paidAmount: 0, status: "overdue", lateFeeApplied: 3000 },
      { id: "ins-006", sequence: 3, dueDate: "2024-03-20", amount: 60000, paidAmount: 0, status: "pending" },
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-21",
  },
  {
    id: "ip-003",
    studentId: "std-003",
    studentName: "Chukwuemeka Okonkwo",
    studentNumber: "STU2024003",
    classLevel: "JSS 3",
    feeTypeName: "Tuition Fee",
    totalAmount: 120000,
    paidAmount: 120000,
    remainingAmount: 0,
    installmentCount: 4,
    frequency: "monthly",
    startDate: "2024-01-01",
    endDate: "2024-04-01",
    status: "completed",
    academicYear: "2024-2025",
    term: "first-term",
    installments: [
      { id: "ins-007", sequence: 1, dueDate: "2024-01-01", amount: 30000, paidAmount: 30000, status: "paid", paidDate: "2024-01-01", paymentMethod: "Online" },
      { id: "ins-008", sequence: 2, dueDate: "2024-02-01", amount: 30000, paidAmount: 30000, status: "paid", paidDate: "2024-01-30", paymentMethod: "Online" },
      { id: "ins-009", sequence: 3, dueDate: "2024-03-01", amount: 30000, paidAmount: 30000, status: "paid", paidDate: "2024-03-01", paymentMethod: "Online" },
      { id: "ins-010", sequence: 4, dueDate: "2024-04-01", amount: 30000, paidAmount: 30000, status: "paid", paidDate: "2024-03-28", paymentMethod: "Bank Transfer" },
    ],
    createdAt: "2023-12-20",
    updatedAt: "2024-03-28",
  },
  {
    id: "ip-004",
    studentId: "std-004",
    studentName: "Fatima Yusuf",
    studentNumber: "STU2024004",
    classLevel: "SSS 3",
    feeTypeName: "Examination Fee",
    totalAmount: 45000,
    paidAmount: 15000,
    remainingAmount: 30000,
    installmentCount: 3,
    frequency: "monthly",
    startDate: "2024-02-01",
    endDate: "2024-04-01",
    status: "defaulted",
    academicYear: "2024-2025",
    term: "second-term",
    installments: [
      { id: "ins-011", sequence: 1, dueDate: "2024-02-01", amount: 15000, paidAmount: 15000, status: "paid", paidDate: "2024-02-05", paymentMethod: "Cash", lateFeeApplied: 1500 },
      { id: "ins-012", sequence: 2, dueDate: "2024-03-01", amount: 15000, paidAmount: 0, status: "overdue", lateFeeApplied: 1500 },
      { id: "ins-013", sequence: 3, dueDate: "2024-04-01", amount: 15000, paidAmount: 0, status: "overdue", lateFeeApplied: 1500 },
    ],
    createdAt: "2024-01-25",
    updatedAt: "2024-04-02",
  },
  {
    id: "ip-005",
    studentId: "std-005",
    studentName: "David Okafor",
    studentNumber: "STU2024005",
    classLevel: "JSS 1",
    feeTypeName: "Tuition Fee",
    totalAmount: 100000,
    paidAmount: 25000,
    remainingAmount: 75000,
    installmentCount: 4,
    frequency: "monthly",
    startDate: "2024-01-10",
    endDate: "2024-04-10",
    status: "active",
    academicYear: "2024-2025",
    term: "first-term",
    installments: [
      { id: "ins-014", sequence: 1, dueDate: "2024-01-10", amount: 25000, paidAmount: 25000, status: "paid", paidDate: "2024-01-10", paymentMethod: "Mobile Money" },
      { id: "ins-015", sequence: 2, dueDate: "2024-02-10", amount: 25000, paidAmount: 10000, status: "partially_paid" },
      { id: "ins-016", sequence: 3, dueDate: "2024-03-10", amount: 25000, paidAmount: 0, status: "pending" },
      { id: "ins-017", sequence: 4, dueDate: "2024-04-10", amount: 25000, paidAmount: 0, status: "pending" },
    ],
    createdAt: "2024-01-05",
    updatedAt: "2024-02-12",
  },
];

// Mock students for duplicate selection
const MOCK_STUDENTS = [
  { value: "std-001", label: "John Adebayo (STU2024001) - SSS 1", name: "John Adebayo", number: "STU2024001", class: "SSS 1" },
  { value: "std-002", label: "Amina Bello (STU2024002) - SSS 2", name: "Amina Bello", number: "STU2024002", class: "SSS 2" },
  { value: "std-003", label: "Chukwuemeka Okonkwo (STU2024003) - JSS 3", name: "Chukwuemeka Okonkwo", number: "STU2024003", class: "JSS 3" },
  { value: "std-004", label: "Fatima Yusuf (STU2024004) - SSS 3", name: "Fatima Yusuf", number: "STU2024004", class: "SSS 3" },
  { value: "std-005", label: "David Okafor (STU2024005) - JSS 1", name: "David Okafor", number: "STU2024005", class: "JSS 1" },
  { value: "std-006", label: "Grace Eze (STU2024006) - JSS 2", name: "Grace Eze", number: "STU2024006", class: "JSS 2" },
  { value: "std-007", label: "Ibrahim Musa (STU2024007) - SSS 1", name: "Ibrahim Musa", number: "STU2024007", class: "SSS 1" },
  { value: "std-008", label: "Jennifer Obi (STU2024008) - SSS 2", name: "Jennifer Obi", number: "STU2024008", class: "SSS 2" },
];

export default function InstallmentPlansPage() {
  useSchoolSettings();
  const { countryCode, countryConfig } = useCountry();
  const currencySymbol = countryConfig.currency.symbol;

  // State
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>(MOCK_INSTALLMENT_PLANS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedTerm, setSelectedTerm] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InstallmentPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<InstallmentPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<InstallmentPlan | null>(null);
  const [duplicatingPlan, setDuplicatingPlan] = useState<InstallmentPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Animation trigger
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Create a filterKey to track filter/search changes
  const filterKey = `${searchQuery}-${selectedYear}-${selectedTerm}-${selectedStatus}-${selectedClass}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Filter data
  const filteredData = useMemo(() => {
    return installmentPlans.filter((plan) => {
      const matchesSearch =
        searchQuery === "" ||
        plan.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.feeTypeName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear = plan.academicYear === selectedYear;
      const matchesTerm = selectedTerm === "all" || plan.term === selectedTerm;
      const matchesStatus = selectedStatus === "all" || plan.status === selectedStatus;
      const matchesClass = selectedClass === "all" || plan.classLevel === selectedClass;

      return matchesSearch && matchesYear && matchesTerm && matchesStatus && matchesClass;
    });
  }, [installmentPlans, searchQuery, selectedYear, selectedTerm, selectedStatus, selectedClass]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalAmount = filteredData.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalCollected = filteredData.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalPending = filteredData.reduce((sum, p) => sum + p.remainingAmount, 0);
    const activePlans = filteredData.filter((p) => p.status === "active");
    const completedPlans = filteredData.filter((p) => p.status === "completed");
    const overduePlans = filteredData.filter((p) => p.installments.some((i) => i.status === "overdue"));

    return {
      totalAmount,
      totalCollected,
      totalPending,
      activePlansCount: activePlans.length,
      activePlansAmount: activePlans.reduce((sum, p) => sum + p.totalAmount, 0),
      completedPlansCount: completedPlans.length,
      completedPlansAmount: completedPlans.reduce((sum, p) => sum + p.totalAmount, 0),
      overduePlansCount: overduePlans.length,
      overduePlansAmount: overduePlans.reduce((sum, p) => sum + p.remainingAmount, 0),
    };
  }, [filteredData]);

  // Trigger animation when filterKey changes
  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger(prev => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  // Apply row animation when filter/search changes
  useEffect(() => {
    if (animationTrigger > 0) {
      const timeoutId = setTimeout(() => {
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach((row, index) => {
            const htmlRow = row as HTMLElement;
            const delay = index / 80;
            htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
          });
        });

        // Cleanup after animation completes
        setTimeout(() => {
          tables.forEach((table) => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row) => {
              const htmlRow = row as HTMLElement;
              htmlRow.style.animation = '';
            });
          });
        }, 600);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [animationTrigger]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setSelectedTerm("all");
    setSelectedStatus("all");
    setSelectedClass("all");
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Handle filter changes with animation
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => setIsFiltering(false), 100);
    }, 200);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Open add modal
  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  // Open edit modal (uses view modal in edit mode)
  const handleEdit = (plan: InstallmentPlan) => {
    setViewingPlan(plan);
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  };

  // Open view modal
  const handleView = (plan: InstallmentPlan) => {
    setViewingPlan(plan);
    setIsViewModalOpen(true);
  };

  // Handle duplicate - open modal to select student and optionally edit
  const handleDuplicate = (plan: InstallmentPlan) => {
    setDuplicatingPlan(plan);
    setIsDuplicateModalOpen(true);
  };

  // Create the duplicate with selected student
  const handleCreateDuplicate = (selectedStudentId: string, editedInstallments: Installment[]) => {
    if (!duplicatingPlan) return;

    const selectedStudent = MOCK_STUDENTS.find((s) => s.value === selectedStudentId);
    if (!selectedStudent) return;

    // Calculate new totals based on edited installments
    const newTotalAmount = editedInstallments.reduce((sum, inst) => sum + inst.amount, 0);

    const duplicated: InstallmentPlan = {
      ...duplicatingPlan,
      id: `ip-${Date.now()}`,
      studentId: selectedStudentId,
      studentName: selectedStudent.name,
      studentNumber: selectedStudent.number,
      classLevel: selectedStudent.class,
      status: "active",
      paidAmount: 0,
      totalAmount: newTotalAmount,
      remainingAmount: newTotalAmount,
      installments: editedInstallments.map((inst, index) => ({
        ...inst,
        id: `ins-${Date.now()}-${index}`,
        paidAmount: 0,
        status: "pending" as InstallmentStatus,
        paidDate: undefined,
        paymentMethod: undefined,
        paymentReference: undefined,
        lateFeeApplied: undefined,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInstallmentPlans([...installmentPlans, duplicated]);
    setIsDuplicateModalOpen(false);
    setDuplicatingPlan(null);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingPlan) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    setInstallmentPlans((prev) => prev.filter((p) => p.id !== deletingPlan.id));
    setIsDeleteModalOpen(false);
    setDeletingPlan(null);
  };

  // Handle save (add/edit)
  const handleSave = async (data: any) => {
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingPlan) {
      setInstallmentPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? { ...p, ...data, updatedAt: new Date().toISOString() }
            : p
        )
      );
      setIsEditModalOpen(false);
      setEditingPlan(null);
    } else {
      const newPlan: InstallmentPlan = {
        id: `ip-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInstallmentPlans([...installmentPlans, newPlan]);
      setIsAddModalOpen(false);
    }

    setIsSaving(false);
  };

  // Status badge renderer
  const getStatusBadge = (status: InstallmentPlanStatus) => {
    const statusConfig = {
      active: {
        bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/20 purple:bg-blue-900/20",
        text: "text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        icon: Clock,
        label: "Active",
      },
      completed: {
        bg: "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/20 purple:bg-green-900/20",
        text: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
        border: "border-green-200 dark:border-green-800",
        icon: CheckCircle2,
        label: "Completed",
      },
      defaulted: {
        bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/20 purple:bg-red-900/20",
        text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        border: "border-red-200 dark:border-red-800",
        icon: AlertTriangle,
        label: "Defaulted",
      },
      cancelled: {
        bg: "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340]",
        text: "text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
        border: "border-line",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border}`} style={{ fontSize: '0.7375rem' }}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Installment status badge
  const getInstallmentStatusBadge = (status: InstallmentStatus) => {
    const statusConfig = {
      pending: { bg: "bg-surface-2", text: "text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200", label: "Pending" },
      paid: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", label: "Paid" },
      overdue: { bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "Overdue" },
      partially_paid: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", label: "Partial" },
      waived: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", label: "Waived" },
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.625rem] font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Table columns
  const columns: ColumnConfig<InstallmentPlan>[] = [
    {
      key: "studentName",
      label: "Student",
      sortable: true,
      className: "text-left",
      render: (plan) => (
        <div>
          <div className="font-semibold text-ink" style={{ fontSize: '0.7375rem' }}>
            {plan.studentName}
          </div>
          <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60" style={{ fontSize: '0.625rem' }}>
            {plan.studentNumber}
          </div>
        </div>
      ),
    },
    {
      key: "classLevel",
      label: "Class",
      sortable: true,
      className: "text-left",
      render: (plan) => (
        <span className="inline-flex px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/20 purple:bg-blue-900/20 text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 border border-blue-200 dark:border-blue-800" style={{ fontSize: '0.7375rem' }}>
          {plan.classLevel}
        </span>
      ),
    },
    {
      key: "feeTypeName",
      label: "Fee Type",
      sortable: true,
      className: "text-left",
      render: (plan) => (
        <div className="font-semibold text-ink" style={{ fontSize: '0.7375rem' }}>
          {plan.feeTypeName}
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Total",
      sortable: true,
      className: "text-left",
      render: (plan) => (
        <div className="font-semibold text-ink" style={{ fontSize: '0.7375rem' }}>
          {formatCurrency(plan.totalAmount, countryCode)}
        </div>
      ),
    },
    {
      key: "paidAmount",
      label: "Paid",
      sortable: true,
      className: "text-left",
      render: (plan) => (
        <div className="font-semibold text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" style={{ fontSize: '0.7375rem' }}>
          {formatCurrency(plan.paidAmount, countryCode)}
        </div>
      ),
    },
    {
      key: "remainingAmount",
      label: "Balance",
      sortable: true,
      className: "text-left",
      render: (plan) => (
        <div className={`font-semibold ${plan.remainingAmount === 0 ? "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" : "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"}`} style={{ fontSize: '0.7375rem' }}>
          {formatCurrency(plan.remainingAmount, countryCode)}
        </div>
      ),
    },
    {
      key: "installmentCount",
      label: "Installments",
      className: "text-left",
      render: (plan) => {
        const paidCount = plan.installments.filter(i => i.status === "paid").length;
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/20 purple:bg-pink-900/20 text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400 border border-purple-200 dark:border-purple-800" style={{ fontSize: '0.7375rem' }}>
            <Layers className="w-3 h-3" />
            {paidCount}/{plan.installmentCount}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      className: "text-left",
      render: (plan) => getStatusBadge(plan.status),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (plan) => (
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(plan);
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-blue-950/30 midnight:to-blue-900/20 purple:from-blue-950/30 purple:to-blue-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 active:scale-95"
            title="View"
          >
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(plan);
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 midnight:from-orange-950/30 midnight:to-orange-900/20 purple:from-orange-950/30 purple:to-orange-900/20 hover:from-orange-100 hover:to-orange-100 dark:hover:from-orange-900/40 dark:hover:to-orange-800/30 transition-all duration-200 cursor-pointer border border-orange-200/40 dark:border-orange-800/30 hover:border-orange-400/60 dark:hover:border-orange-600/50 active:scale-95"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicate(plan);
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 midnight:from-purple-950/30 midnight:to-purple-900/20 purple:from-purple-950/30 purple:to-purple-900/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-purple-900/40 dark:hover:to-purple-800/30 transition-all duration-200 cursor-pointer border border-purple-200/40 dark:border-purple-800/30 hover:border-purple-400/60 dark:hover:border-purple-600/50 active:scale-95"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeletingPlan(plan);
              setIsDeleteModalOpen(true);
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 midnight:from-red-950/30 midnight:to-red-900/20 purple:from-red-950/30 purple:to-red-900/20 hover:from-red-100 hover:to-red-100 dark:hover:from-red-900/40 dark:hover:to-red-800/30 transition-all duration-200 cursor-pointer border border-red-200/40 dark:border-red-800/30 hover:border-red-400/60 dark:hover:border-red-600/50 active:scale-95"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
          </button>
        </div>
      ),
    },
  ];

  const isLoading = isRefreshing || isFiltering;

  return (
    <DataManagementPage<InstallmentPlan>
      title="Installment Plans"
      breadcrumbs={[
        { label: "Finance", href: "/finance/fee-structure" },
        { label: "Installment Plans" },
      ]}
      data={filteredData}
      getRowKey={(item) => item.id}
      columns={columns}
      enableSelection={false}
      enableViewToggle={false}
      showTableSearch={false}
      addButtonConfig={{
        label: "Add Plan",
        onClick: handleAddNew,
      }}
      onRefresh={handleRefresh}
      onExportPDF={() => {
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        exportInstallmentPlansToPDF(filteredData, `installment-plans_${dateStr}.pdf`, currencySymbol);
      }}
      onExportExcel={() => {
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        exportInstallmentPlansToExcel(filteredData, `installment-plans_${dateStr}.xlsx`, currencySymbol);
      }}
      headerContent={
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mt-6">
            <StatCard
              icon={FileText}
              label="Total Plans"
              value={formatCurrency(stats.totalAmount, countryCode)}
              color="blue"
              badge={`${filteredData.length}`}
            />
            <StatCard
              icon={TrendingUp}
              label="Collected"
              value={formatCurrency(stats.totalCollected, countryCode)}
              color="green"
              badge={`${stats.totalAmount > 0 ? ((stats.totalCollected / stats.totalAmount) * 100).toFixed(0) : 0}%`}
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={formatCurrency(stats.totalPending, countryCode)}
              color="amber"
              badge={`${stats.totalAmount > 0 ? ((stats.totalPending / stats.totalAmount) * 100).toFixed(0) : 0}%`}
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={formatCurrency(stats.completedPlansAmount, countryCode)}
              color="emerald"
              badge={`${stats.completedPlansCount}`}
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue"
              value={formatCurrency(stats.overduePlansAmount, countryCode)}
              color="red"
              badge={`${stats.overduePlansCount}`}
            />
          </div>

          {/* Filters Bar */}
          <div className="mt-6">
            <SearchFilterBar
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search by student name, ID, or fee type..."
              filters={[
                {
                  label: "Academic Year",
                  value: selectedYear,
                  onChange: (val) => handleFilterChange(setSelectedYear, String(val)),
                  options: ACADEMIC_YEARS,
                },
                {
                  label: "Term",
                  value: selectedTerm,
                  onChange: (val) => handleFilterChange(setSelectedTerm, String(val)),
                  options: TERMS_WITH_ALL,
                },
                {
                  label: "Class",
                  value: selectedClass,
                  onChange: (val) => handleFilterChange(setSelectedClass, String(val)),
                  options: CLASS_OPTIONS,
                },
                {
                  label: "Status",
                  value: selectedStatus,
                  onChange: (val) => handleFilterChange(setSelectedStatus, String(val)),
                  options: INSTALLMENT_STATUS_OPTIONS,
                },
              ]}
            />
          </div>
        </>
      }
      customListComponent={
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm text-muted">
                  {isRefreshing ? "Refreshing..." : "Filtering..."}
                </p>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="bg-surface rounded-xl border border-line shadow-sm p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-16 h-16">
                    <Layers className="w-8 h-8 text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1 text-center">
                  No installment plans found
                </h3>
                <p className="text-xs sm:text-sm text-muted mb-4 text-center">
                  {searchQuery
                    ? "No results match your search. Try adjusting your filters."
                    : "Get started by adding your first installment plan."}
                </p>
                {!searchQuery && (
                  <Button variant="primary" onClick={handleAddNew} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Plan
                  </Button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Mobile Scroll Indicator */}
              <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

              <div
                key={`table-data-${filterKey}`}
                className="bg-surface rounded-xl border border-line shadow-sm overflow-hidden"
              >
                <ResponsiveListTable variant="contained" showColumnHeaders={true}
                  columns={columns}
                  data={filteredData}
                  getRowKey={(item) => item.id}
                  emptyMessage="No installment plans found. Click 'Add Plan' to create one."
                  title=""
                  showSearch={false}
                  defaultItemsPerPage={10}
                  itemsPerPageOptions={[5, 10, 15, 20, 25]}
                  enablePagination={true}
                  enableItemsPerPage={true}
                  onRowClick={handleView}
                />
              </div>
            </div>
          )}
        </div>
      }
    >
      {/* Add Modal */}
      <InstallmentPlanModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        onSave={handleSave}
        isEditing={false}
        editingPlan={null}
        isSaving={isSaving}
        currencySymbol={currencySymbol}
      />

      {/* View/Edit Modal */}
      {viewingPlan && (
        <InstallmentPlanViewModal
          isOpen={isViewModalOpen || isEditModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(false);
            setViewingPlan(null);
            setEditingPlan(null);
          }}
          plan={viewingPlan}
          countryCode={countryCode}
          getInstallmentStatusBadge={getInstallmentStatusBadge}
          getStatusBadge={getStatusBadge}
          isEditMode={isEditModalOpen}
          onSave={(updatedPlan) => {
            setInstallmentPlans((prev) =>
              prev.map((p) =>
                p.id === updatedPlan.id
                  ? { ...updatedPlan, updatedAt: new Date().toISOString() }
                  : p
              )
            );
            setIsEditModalOpen(false);
            setViewingPlan(null);
            setEditingPlan(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingPlan(null);
        }}
        title="Delete Installment Plan"
        subtitle={deletingPlan ? `${deletingPlan.studentName} • ${deletingPlan.classLevel}` : undefined}
        variant="danger"
        message="Are you sure you want to delete this installment plan? This action cannot be undone."
        details={
          deletingPlan
            ? [
                { label: "Student", value: deletingPlan.studentName },
                { label: "Fee Type", value: deletingPlan.feeTypeName },
                { label: "Total", value: formatCurrency(deletingPlan.totalAmount, countryCode) },
                { label: "Balance", value: formatCurrency(deletingPlan.remainingAmount, countryCode) },
              ]
            : undefined
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />

      {/* Duplicate Plan Modal */}
      {duplicatingPlan && (
        <DuplicatePlanModal
          isOpen={isDuplicateModalOpen}
          onClose={() => {
            setIsDuplicateModalOpen(false);
            setDuplicatingPlan(null);
          }}
          plan={duplicatingPlan}
          students={MOCK_STUDENTS}
          existingStudentIds={installmentPlans
            .filter((p) => p.feeTypeName === duplicatingPlan.feeTypeName && p.academicYear === duplicatingPlan.academicYear && p.term === duplicatingPlan.term)
            .map((p) => p.studentId)}
          onConfirm={handleCreateDuplicate}
          countryCode={countryCode}
        />
      )}
    </DataManagementPage>
  );
}

// View Modal Component
interface InstallmentPlanViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: InstallmentPlan;
  countryCode: string;
  getInstallmentStatusBadge: (status: InstallmentStatus) => React.ReactNode;
  getStatusBadge: (status: InstallmentPlanStatus) => React.ReactNode;
  isEditMode?: boolean;
  onSave?: (updatedPlan: InstallmentPlan) => void;
}

function InstallmentPlanViewModal({
  isOpen,
  onClose,
  plan,
  countryCode,
  getInstallmentStatusBadge,
  getStatusBadge,
  isEditMode = false,
  onSave,
}: InstallmentPlanViewModalProps) {
  const [editedPlan, setEditedPlan] = useState<InstallmentPlan>(plan);
  const [isSaving, setIsSaving] = useState(false);

  // Reset edited plan when plan changes or modal opens
  useEffect(() => {
    setEditedPlan(plan);
  }, [plan, isOpen]);

  const handleInstallmentChange = (index: number, field: "amount" | "dueDate", value: string) => {
    const newInstallments = [...editedPlan.installments];
    if (field === "amount") {
      const newAmount = parseFloat(value) || 0;
      newInstallments[index] = { ...newInstallments[index], amount: newAmount };
    } else if (field === "dueDate") {
      newInstallments[index] = { ...newInstallments[index], dueDate: value };
    }

    // Recalculate total amount
    const newTotalAmount = newInstallments.reduce((sum, inst) => sum + inst.amount, 0);
    const newRemainingAmount = newTotalAmount - editedPlan.paidAmount;

    setEditedPlan({
      ...editedPlan,
      installments: newInstallments,
      totalAmount: newTotalAmount,
      remainingAmount: newRemainingAmount,
    });
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(editedPlan);
    setIsSaving(false);
  };

  const displayPlan = isEditMode ? editedPlan : plan;
  const percentage = (displayPlan.paidAmount / displayPlan.totalAmount) * 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Installment Plan" : "Installment Plan Details"}
      subtitle={`${displayPlan.studentName} - ${displayPlan.feeTypeName}`}
      icon={<FileText className="w-5 h-5" />}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Edit Mode Banner */}
        {isEditMode && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center gap-2">
            <Edit className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
            <span className="text-sm text-amber-700 dark:text-amber-300">
              Edit mode enabled - You can modify installment amounts and due dates below
            </span>
          </div>
        )}

        {/* Plan Overview */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-ink">
                {displayPlan.studentName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                {displayPlan.studentNumber} | {displayPlan.classLevel}
              </p>
            </div>
            {getStatusBadge(displayPlan.status)}
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Payment Progress</span>
              <span className="font-semibold text-ink">
                {formatCurrency(displayPlan.paidAmount, countryCode)} / {formatCurrency(displayPlan.totalAmount, countryCode)}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentage === 100
                    ? "bg-green-500"
                    : percentage >= 50
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">{percentage.toFixed(0)}% Complete</span>
              <span className="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 font-medium">
                {formatCurrency(displayPlan.remainingAmount, countryCode)} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Plan Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg p-3">
            <p className="text-xs text-muted">Fee Type</p>
            <p className="text-sm font-semibold text-ink mt-1">{displayPlan.feeTypeName}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg p-3">
            <p className="text-xs text-muted">Installments</p>
            <p className="text-sm font-semibold text-ink mt-1">{displayPlan.installmentCount} payments</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg p-3">
            <p className="text-xs text-muted">Start Date</p>
            <p className="text-sm font-semibold text-ink mt-1">
              {new Date(displayPlan.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg p-3">
            <p className="text-xs text-muted">End Date</p>
            <p className="text-sm font-semibold text-ink mt-1">
              {new Date(displayPlan.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Installments Timeline */}
        <div>
          <h4 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Payment Schedule
          </h4>
          <div className="space-y-3">
            {displayPlan.installments.map((installment, index) => (
              <div
                key={installment.id}
                className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  installment.status === "paid"
                    ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                    : installment.status === "overdue"
                    ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                    : installment.status === "partially_paid"
                    ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                    : "bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-line"
                }`}
              >
                {/* Sequence Number */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  installment.status === "paid"
                    ? "bg-green-500 text-white"
                    : installment.status === "overdue"
                    ? "bg-red-500 text-white"
                    : installment.status === "partially_paid"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-300 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                }`}>
                  {installment.sequence}
                </div>

                {/* Installment Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">
                        Installment {installment.sequence}
                      </p>
                      {isEditMode ? (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput
                            label="Due Date"
                            icon={<Calendar className="w-2.5 h-2.5" />}
                            type="date"
                            value={installment.dueDate}
                            onChange={(value) => handleInstallmentChange(index, "dueDate", value)}
                            placeholder="Select due date"
                          />
                          <FormInput
                            label="Amount"
                            icon={<DollarSign className="w-2.5 h-2.5" />}
                            type="number"
                            value={installment.amount.toString()}
                            onChange={(value) => handleInstallmentChange(index, "amount", value)}
                            placeholder="Enter amount"
                          />
                        </div>
                      ) : (
                        <p className="text-xs text-muted mt-0.5">
                          Due: {new Date(installment.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    {!isEditMode && getInstallmentStatusBadge(installment.status)}
                  </div>

                  {!isEditMode && (
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Amount: </span>
                        <span className="font-semibold text-ink">
                          {formatCurrency(installment.amount, countryCode)}
                        </span>
                      </div>
                      {installment.paidAmount > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Paid: </span>
                          <span className="font-semibold text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                            {formatCurrency(installment.paidAmount, countryCode)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {isEditMode && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30">
                      <div className="flex items-center gap-2">
                        {getInstallmentStatusBadge(installment.status)}
                      </div>
                      {installment.paidAmount > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Paid: </span>
                          <span className="font-semibold text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                            {formatCurrency(installment.paidAmount, countryCode)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Info */}
                  {installment.paidDate && (
                    <div className="mt-2 pt-2 border-t border-line">
                      <div className="flex flex-wrap gap-4 text-xs text-muted">
                        <span>Paid: {new Date(installment.paidDate).toLocaleDateString()}</span>
                        {installment.paymentMethod && <span>Via: {installment.paymentMethod}</span>}
                        {installment.paymentReference && <span>Ref: {installment.paymentReference}</span>}
                      </div>
                    </div>
                  )}

                  {/* Late Fee */}
                  {installment.lateFeeApplied && installment.lateFeeApplied > 0 && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                      Late fee applied: {formatCurrency(installment.lateFeeApplied, countryCode)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Mode Actions */}
        {isEditMode && (
          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 bg-surface-2 hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Duplicate Plan Modal Component
interface DuplicatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: InstallmentPlan;
  students: { value: string; label: string; name: string; number: string; class: string }[];
  existingStudentIds: string[];
  onConfirm: (studentId: string, installments: Installment[]) => void;
  countryCode: string;
}

function DuplicatePlanModal({
  isOpen,
  onClose,
  plan,
  students,
  existingStudentIds,
  onConfirm,
  countryCode,
}: DuplicatePlanModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [editInstallments, setEditInstallments] = useState(false);
  const [editedInstallments, setEditedInstallments] = useState<Installment[]>(plan.installments);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStudentId("");
      setEditInstallments(false);
      setEditedInstallments(plan.installments);
    }
  }, [isOpen, plan.installments]);

  // Filter out students who already have this plan
  const availableStudents = students.filter(
    (s) => !existingStudentIds.includes(s.value)
  );

  const handleInstallmentAmountChange = (index: number, value: string) => {
    const newInstallments = [...editedInstallments];
    newInstallments[index] = { ...newInstallments[index], amount: parseFloat(value) || 0 };
    setEditedInstallments(newInstallments);
  };

  const handleInstallmentDateChange = (index: number, value: string) => {
    const newInstallments = [...editedInstallments];
    newInstallments[index] = { ...newInstallments[index], dueDate: value };
    setEditedInstallments(newInstallments);
  };

  const totalAmount = editedInstallments.reduce((sum, inst) => sum + inst.amount, 0);

  const handleConfirm = () => {
    if (!selectedStudentId) return;
    onConfirm(selectedStudentId, editedInstallments);
  };

  const selectedStudent = students.find((s) => s.value === selectedStudentId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Copy Installment Plan"
      subtitle={`Copy plan from ${plan.studentName}`}
      icon={<Copy className="w-5 h-5" />}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Source Plan Info */}
        <div className="bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl p-4 border border-line">
          <p className="text-xs text-muted mb-2">Copying from:</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">{plan.studentName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{plan.feeTypeName} - {plan.installmentCount} installments</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-ink">{formatCurrency(plan.totalAmount, countryCode)}</p>
              <p className="text-xs text-gray-500">{plan.academicYear} | {plan.term.replace("-", " ")}</p>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
              <User className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <span>Select Student</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          {availableStudents.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                All students already have this installment plan for {plan.feeTypeName} in {plan.term.replace("-", " ")}.
              </p>
            </div>
          ) : (
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full h-[46px] px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-surface text-ink text-sm focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Select a student...</option>
              {availableStudents.map((student) => (
                <option key={student.value} value={student.value}>
                  {student.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Student Preview */}
        {selectedStudent && (
          <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mb-1">New plan will be created for:</p>
            <p className="font-semibold text-blue-900 dark:text-blue-100">{selectedStudent.name}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">{selectedStudent.number} - {selectedStudent.class}</p>
          </div>
        )}

        {/* Edit Toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-line">
          <input
            type="checkbox"
            id="editInstallments"
            checked={editInstallments}
            onChange={(e) => setEditInstallments(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="editInstallments" className="flex-1 cursor-pointer">
            <p className="text-sm font-medium text-ink">Modify installment amounts and dates</p>
            <p className="text-xs text-muted">Leave unchecked to keep the same schedule as the original plan</p>
          </label>
        </div>

        {/* Editable Installments */}
        {editInstallments && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Edit Payment Schedule
            </h4>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {editedInstallments.map((inst, index) => (
                <div
                  key={inst.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg border border-line"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                    {inst.sequence}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <FormInput
                      label="Due Date"
                      icon={<Calendar className="w-2.5 h-2.5" />}
                      type="date"
                      value={inst.dueDate}
                      onChange={(value) => handleInstallmentDateChange(index, value)}
                      placeholder="Select date"
                    />
                    <FormInput
                      label="Amount"
                      icon={<DollarSign className="w-2.5 h-2.5" />}
                      type="number"
                      value={inst.amount.toString()}
                      onChange={(value) => handleInstallmentAmountChange(index, value)}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-line">
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Total: </span>
                <span className="font-semibold text-ink">{formatCurrency(totalAmount, countryCode)}</span>
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 bg-surface-2 hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedStudentId || availableStudents.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Create Copy
          </button>
        </div>
      </div>
    </Modal>
  );
}
