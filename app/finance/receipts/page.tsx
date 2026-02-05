"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { DataManagementPage } from "@/components/pages";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import { exportReceiptsToPDF, exportReceiptsToExcel } from "@/lib/export-utils";
import { printReceipt, downloadReceipt, emailReceipt, type ReceiptData } from "@/lib/document-utils";
import Button from "@/components/shared/Button";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import StatCard from "@/components/shared/StatCard";
import ActionModal from "@/components/shared/ActionModal";
import DetailViewModal from "@/components/shared/DetailViewModal";
import ReceiptModal from "@/components/finance/ReceiptModal";
import PageSpinner from "@/components/shared/PageSpinner";
import {
  Plus,
  Receipt,
  Printer,
  Download,
  Eye,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { RECEIPT_ACADEMIC_YEARS, RECEIPT_TERMS, CLASS_OPTIONS, RECEIPT_STATUS_OPTIONS } from "../config";

// Receipt status type
type ReceiptStatus = "issued" | "pending" | "voided";

// Payment method type
type PaymentMethod = "cash" | "bank_transfer" | "card" | "mobile_money" | "cheque" | "online";

// Receipt interface
interface ReceiptItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

interface ReceiptRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classLevel: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  status: ReceiptStatus;
  issueDate: string;
  dueDate?: string;
  academicYear: string;
  term: string;
  issuedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const MOCK_RECEIPTS: ReceiptRecord[] = [
  {
    id: "rec-001",
    receiptNumber: "RCP-2024-0001",
    studentId: "std-001",
    studentName: "John Adebayo",
    studentNumber: "STU2024001",
    classLevel: "SSS 1",
    items: [
      { id: "item-1", description: "Tuition Fee - First Term", amount: 75000, quantity: 1 },
      { id: "item-2", description: "Laboratory Fee", amount: 5000, quantity: 1 },
    ],
    subtotal: 80000,
    discount: 0,
    totalAmount: 80000,
    amountPaid: 80000,
    balance: 0,
    paymentMethod: "bank_transfer",
    paymentReference: "TRF-123456789",
    status: "issued",
    issueDate: "2024-01-15",
    academicYear: "2024-2025",
    term: "first-term",
    issuedBy: "Admin User",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "rec-002",
    receiptNumber: "RCP-2024-0002",
    studentId: "std-002",
    studentName: "Amina Bello",
    studentNumber: "STU2024002",
    classLevel: "SSS 2",
    items: [
      { id: "item-1", description: "Tuition Fee - First Term", amount: 85000, quantity: 1 },
    ],
    subtotal: 85000,
    discount: 5000,
    totalAmount: 80000,
    amountPaid: 50000,
    balance: 30000,
    paymentMethod: "cash",
    status: "issued",
    issueDate: "2024-01-16",
    academicYear: "2024-2025",
    term: "first-term",
    issuedBy: "Admin User",
    notes: "Partial payment - balance due by Feb 15",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "rec-003",
    receiptNumber: "RCP-2024-0003",
    studentId: "std-003",
    studentName: "Chukwuemeka Okonkwo",
    studentNumber: "STU2024003",
    classLevel: "JSS 3",
    items: [
      { id: "item-1", description: "Examination Fee", amount: 15000, quantity: 1 },
      { id: "item-2", description: "Sports Fee", amount: 3000, quantity: 1 },
      { id: "item-3", description: "Library Fee", amount: 2000, quantity: 1 },
    ],
    subtotal: 20000,
    discount: 0,
    totalAmount: 20000,
    amountPaid: 20000,
    balance: 0,
    paymentMethod: "mobile_money",
    paymentReference: "MM-987654321",
    status: "issued",
    issueDate: "2024-01-17",
    academicYear: "2024-2025",
    term: "first-term",
    issuedBy: "Bursar",
    createdAt: "2024-01-17T14:45:00Z",
    updatedAt: "2024-01-17T14:45:00Z",
  },
  {
    id: "rec-004",
    receiptNumber: "RCP-2024-0004",
    studentId: "std-004",
    studentName: "Fatima Yusuf",
    studentNumber: "STU2024004",
    classLevel: "SSS 3",
    items: [
      { id: "item-1", description: "WAEC Registration Fee", amount: 35000, quantity: 1 },
      { id: "item-2", description: "NECO Registration Fee", amount: 25000, quantity: 1 },
    ],
    subtotal: 60000,
    discount: 0,
    totalAmount: 60000,
    amountPaid: 60000,
    balance: 0,
    paymentMethod: "card",
    paymentReference: "CARD-456789123",
    status: "issued",
    issueDate: "2024-01-18",
    academicYear: "2024-2025",
    term: "first-term",
    issuedBy: "Admin User",
    createdAt: "2024-01-18T11:20:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
  },
  {
    id: "rec-005",
    receiptNumber: "RCP-2024-0005",
    studentId: "std-005",
    studentName: "David Okafor",
    studentNumber: "STU2024005",
    classLevel: "JSS 1",
    items: [
      { id: "item-1", description: "Tuition Fee - First Term", amount: 65000, quantity: 1 },
      { id: "item-2", description: "Uniform Fee", amount: 15000, quantity: 1 },
      { id: "item-3", description: "Book Fee", amount: 8000, quantity: 1 },
    ],
    subtotal: 88000,
    discount: 8000,
    totalAmount: 80000,
    amountPaid: 0,
    balance: 80000,
    paymentMethod: "bank_transfer",
    status: "pending",
    issueDate: "2024-01-19",
    dueDate: "2024-02-19",
    academicYear: "2024-2025",
    term: "first-term",
    issuedBy: "Bursar",
    notes: "Invoice issued - awaiting payment",
    createdAt: "2024-01-19T08:30:00Z",
    updatedAt: "2024-01-19T08:30:00Z",
  },
  {
    id: "rec-006",
    receiptNumber: "RCP-2024-0006",
    studentId: "std-006",
    studentName: "Grace Eze",
    studentNumber: "STU2024006",
    classLevel: "JSS 2",
    items: [
      { id: "item-1", description: "Tuition Fee - First Term", amount: 70000, quantity: 1 },
    ],
    subtotal: 70000,
    discount: 0,
    totalAmount: 70000,
    amountPaid: 70000,
    balance: 0,
    paymentMethod: "cheque",
    paymentReference: "CHQ-112233445",
    status: "voided",
    issueDate: "2024-01-10",
    academicYear: "2024-2025",
    term: "first-term",
    issuedBy: "Admin User",
    notes: "Voided - cheque bounced, re-issued as RCP-2024-0007",
    createdAt: "2024-01-10T16:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
];

// Mock students for dropdown
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

// Fee types for receipt items (used for mapping in handleCreateReceiptFromModal)
const FEE_TYPES = [
  { value: "tuition", label: "Tuition Fee" },
  { value: "examination", label: "Examination Fee" },
  { value: "laboratory", label: "Laboratory Fee" },
  { value: "library", label: "Library Fee" },
  { value: "sports", label: "Sports Fee" },
  { value: "uniform", label: "Uniform Fee" },
  { value: "books", label: "Book Fee" },
  { value: "transport", label: "Transport Fee" },
  { value: "registration", label: "Registration Fee" },
  { value: "waec", label: "WAEC Registration Fee" },
  { value: "neco", label: "NECO Registration Fee" },
  { value: "other", label: "Other Fee" },
];

export default function ReceiptsPage() {
  const { settings } = useSchoolSettings();
  const { countryCode, countryConfig } = useCountry();
  const currencySymbol = countryConfig.currency.symbol;

  // Get the default education level from tenant settings
  const educationLevel = settings.defaultEducationLevel;

  // State
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(MOCK_RECEIPTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<ReceiptRecord | null>(null);
  const [voidingReceipt, setVoidingReceipt] = useState<ReceiptRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Animation trigger
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Create a filterKey to track filter/search changes
  const filterKey = `${searchQuery}-${selectedYear}-${selectedTerm}-${selectedStatus}-${selectedClass}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Handle filter changes with animation
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => setIsFiltering(false), 100);
    }, 200);
  };

  // Filter receipts
  const filteredData = useMemo(() => {
    return receipts.filter((receipt) => {
      const matchesSearch =
        receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.studentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = selectedYear === "all" || receipt.academicYear === selectedYear;
      const matchesTerm = selectedTerm === "all" || receipt.term === selectedTerm;
      const matchesStatus = selectedStatus === "all" || receipt.status === selectedStatus;
      const matchesClass = selectedClass === "all" || receipt.classLevel === selectedClass;
      return matchesSearch && matchesYear && matchesTerm && matchesStatus && matchesClass;
    });
  }, [receipts, searchQuery, selectedYear, selectedTerm, selectedStatus, selectedClass]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalReceipts = receipts.length;
    const issuedReceipts = receipts.filter((r) => r.status === "issued").length;
    const pendingReceipts = receipts.filter((r) => r.status === "pending").length;
    const voidedReceipts = receipts.filter((r) => r.status === "voided").length;
    const totalCollected = receipts
      .filter((r) => r.status === "issued")
      .reduce((sum, r) => sum + r.amountPaid, 0);
    const totalOutstanding = receipts
      .filter((r) => r.status !== "voided")
      .reduce((sum, r) => sum + r.balance, 0);
    const totalAmount = receipts
      .filter((r) => r.status !== "voided")
      .reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      totalReceipts,
      issuedReceipts,
      pendingReceipts,
      voidedReceipts,
      totalCollected,
      totalOutstanding,
      totalAmount,
    };
  }, [receipts]);

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

  // Status badge renderer
  const getStatusBadge = (status: ReceiptStatus) => {
    const statusConfig = {
      issued: {
        bg: "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/20 purple:bg-green-900/20",
        text: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
        border: "border-green-200 dark:border-green-800",
        icon: CheckCircle2,
        label: "Issued",
      },
      pending: {
        bg: "bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/20 purple:bg-amber-900/20",
        text: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        icon: Clock,
        label: "Pending",
      },
      voided: {
        bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/20 purple:bg-red-900/20",
        text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        border: "border-red-200 dark:border-red-800",
        icon: XCircle,
        label: "Voided",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border}`} style={{ fontSize: '11.8px' }}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Payment method label
  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels: Record<PaymentMethod, string> = {
      cash: "Cash",
      bank_transfer: "Bank Transfer",
      card: "Card",
      mobile_money: "Mobile Money",
      cheque: "Cheque",
      online: "Online",
    };
    return labels[method];
  };

  // Handle actions
  const handleView = (receipt: ReceiptRecord) => {
    setViewingReceipt(receipt);
    setIsViewModalOpen(true);
  };

  // Convert ReceiptRecord to ReceiptData format for document utilities
  const convertToReceiptData = (receipt: ReceiptRecord): ReceiptData => ({
    receiptNumber: receipt.receiptNumber,
    studentName: receipt.studentName,
    studentNumber: receipt.studentNumber,
    studentClass: receipt.classLevel,
    items: receipt.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      amount: item.amount,
    })),
    subtotal: receipt.subtotal,
    discount: receipt.discount,
    totalAmount: receipt.totalAmount,
    amountPaid: receipt.amountPaid,
    balance: receipt.balance,
    paymentMethod: receipt.paymentMethod,
    paymentReference: receipt.paymentReference,
    status: receipt.status,
    issueDate: receipt.issueDate,
    academicYear: receipt.academicYear,
    term: receipt.term,
    issuedBy: receipt.issuedBy,
    notes: receipt.notes,
  });

  const handlePrint = (receipt: ReceiptRecord) => {
    const receiptData = convertToReceiptData(receipt);
    printReceipt(
      receiptData,
      (amount) => formatCurrency(amount, countryCode),
      settings.schoolName
    );
  };

  const handleDownload = (receipt: ReceiptRecord) => {
    const receiptData = convertToReceiptData(receipt);
    downloadReceipt(
      receiptData,
      (amount) => formatCurrency(amount, countryCode),
      settings.schoolName
    );
  };

  const handleEmail = (receipt: ReceiptRecord) => {
    const receiptData = convertToReceiptData(receipt);
    emailReceipt(
      receiptData,
      (amount) => formatCurrency(amount, countryCode),
      settings.schoolName
    );
  };

  const handleVoid = async () => {
    if (!voidingReceipt) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setReceipts((prev) =>
      prev.map((r) =>
        r.id === voidingReceipt.id
          ? { ...r, status: "voided" as ReceiptStatus, updatedAt: new Date().toISOString() }
          : r
      )
    );

    setIsSaving(false);
    setIsVoidModalOpen(false);
    setVoidingReceipt(null);
  };

  // Handle create receipt from modal
  const handleCreateReceiptFromModal = async (data: {
    subjectOrCourse?: string; // Optional: subject/course for filtering
    studentId: string;
    items: { description: string; amount: string; quantity: string }[];
    discount: string;
    paymentMethod: PaymentMethod;
    paymentReference: string;
    academicYear: string;
    term: string;
    notes: string;
    amountPaid: string;
  }) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const student = MOCK_STUDENTS.find((s) => s.value === data.studentId);
    if (!student) {
      setIsSaving(false);
      return;
    }

    const items = data.items
      .filter((item) => item.description && item.amount)
      .map((item, index) => {
        // Get the label for the fee type
        const feeType = FEE_TYPES.find((f) => f.value === item.description);
        return {
          id: `item-${Date.now()}-${index}`,
          description: feeType?.label || item.description,
          amount: parseFloat(item.amount) || 0,
          quantity: parseInt(item.quantity) || 1,
        };
      });

    const subtotal = items.reduce((sum, item) => sum + item.amount * item.quantity, 0);
    const discount = parseFloat(data.discount) || 0;
    const totalAmount = subtotal - discount;
    const amountPaid = parseFloat(data.amountPaid) || totalAmount;
    const balance = totalAmount - amountPaid;

    const newReceipt: ReceiptRecord = {
      id: `rec-${Date.now()}`,
      receiptNumber: `RCP-2024-${String(receipts.length + 1).padStart(4, "0")}`,
      studentId: data.studentId,
      studentName: student.name,
      studentNumber: student.number,
      classLevel: student.class,
      items,
      subtotal,
      discount,
      totalAmount,
      amountPaid,
      balance,
      paymentMethod: data.paymentMethod,
      paymentReference: data.paymentReference || undefined,
      status: amountPaid >= totalAmount ? "issued" : amountPaid > 0 ? "issued" : "pending",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: amountPaid < totalAmount ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : undefined,
      academicYear: data.academicYear,
      term: data.term,
      issuedBy: "Admin User",
      notes: data.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReceipts([newReceipt, ...receipts]);
    setIsSaving(false);
    setIsCreateModalOpen(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setSelectedYear("all");
    setSelectedTerm("all");
    setSelectedStatus("all");
    setSelectedClass("all");
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Table columns
  const columns: ColumnConfig<ReceiptRecord>[] = [
    {
      key: "receiptNumber",
      label: "Receipt #",
      sortable: true,
      className: "text-left",
      render: (receipt) => (
        <span className="font-mono font-semibold text-blue-600 dark:text-blue-400" style={{ fontSize: '11.8px' }}>
          {receipt.receiptNumber}
        </span>
      ),
    },
    {
      key: "studentName",
      label: "Student",
      sortable: true,
      className: "text-left",
      render: (receipt) => (
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer group/avatar flex-shrink-0">
            <Image
              src={`https://i.pravatar.cc/150?u=${receipt.studentId}`}
              alt={receipt.studentName}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
              style={{ position: 'relative', transformOrigin: 'center center' }}
              unoptimized
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50" style={{ fontSize: '11.8px' }}>
              {receipt.studentName}
            </div>
            <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60" style={{ fontSize: '10px' }}>
              {receipt.studentNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "classLevel",
      label: "Class",
      sortable: true,
      className: "text-left",
      render: (receipt) => (
        <span className="inline-flex px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/20 purple:bg-blue-900/20 text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 border border-blue-200 dark:border-blue-800" style={{ fontSize: '11.8px' }}>
          {receipt.classLevel}
        </span>
      ),
    },
    {
      key: "totalAmount",
      label: "Total",
      sortable: true,
      className: "text-left",
      render: (receipt) => (
        <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50" style={{ fontSize: '11.8px' }}>
          {formatCurrency(receipt.totalAmount, countryCode)}
        </div>
      ),
    },
    {
      key: "amountPaid",
      label: "Paid",
      sortable: true,
      className: "text-left",
      render: (receipt) => (
        <div className="font-semibold text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" style={{ fontSize: '11.8px' }}>
          {formatCurrency(receipt.amountPaid, countryCode)}
        </div>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: true,
      className: "text-left",
      render: (receipt) => (
        <div className={`font-semibold ${receipt.balance === 0 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`} style={{ fontSize: '11.8px' }}>
          {formatCurrency(receipt.balance, countryCode)}
        </div>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment",
      sortable: true,
      className: "text-left",
      render: (receipt) => (
        <span className="text-gray-600 dark:text-gray-400" style={{ fontSize: '11.8px' }}>
          {getPaymentMethodLabel(receipt.paymentMethod)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "text-left",
      render: (receipt) => getStatusBadge(receipt.status),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (receipt) => (
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(receipt);
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-blue-950/30 midnight:to-blue-900/20 purple:from-blue-950/30 purple:to-blue-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 active:scale-95"
            title="View"
          >
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrint(receipt);
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-950/30 dark:to-gray-900/20 midnight:from-gray-950/30 midnight:to-gray-900/20 purple:from-gray-950/30 purple:to-gray-900/20 hover:from-gray-100 hover:to-gray-100 dark:hover:from-gray-900/40 dark:hover:to-gray-800/30 transition-all duration-200 cursor-pointer border border-gray-200/40 dark:border-gray-800/30 hover:border-gray-400/60 dark:hover:border-gray-600/50 active:scale-95"
            title="Print"
          >
            <Printer className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(receipt);
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 midnight:from-green-950/30 midnight:to-green-900/20 purple:from-green-950/30 purple:to-green-900/20 hover:from-green-100 hover:to-green-100 dark:hover:from-green-900/40 dark:hover:to-green-800/30 transition-all duration-200 cursor-pointer border border-green-200/40 dark:border-green-800/30 hover:border-green-400/60 dark:hover:border-green-600/50 active:scale-95"
            title="Download PDF"
          >
            <Download className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
          </button>
          {receipt.status !== "voided" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setVoidingReceipt(receipt);
                setIsVoidModalOpen(true);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 midnight:from-red-950/30 midnight:to-red-900/20 purple:from-red-950/30 purple:to-red-900/20 hover:from-red-100 hover:to-red-100 dark:hover:from-red-900/40 dark:hover:to-red-800/30 transition-all duration-200 cursor-pointer border border-red-200/40 dark:border-red-800/30 hover:border-red-400/60 dark:hover:border-red-600/50 active:scale-95"
              title="Void"
            >
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const isLoading = isRefreshing || isFiltering;

  return (
    <DataManagementPage<ReceiptRecord>
      title="Receipts"
      breadcrumbs={[
        { label: "Finance", href: "/finance/fee-structure" },
        { label: "Receipts" },
      ]}
      data={filteredData}
      getRowKey={(item) => item.id}
      columns={columns}
      enableSelection={false}
      enableViewToggle={false}
      showTableSearch={false}
      addButtonConfig={{
        label: "Generate Receipt",
        onClick: () => setIsCreateModalOpen(true),
      }}
      onRefresh={handleRefresh}
      onExportPDF={() => exportReceiptsToPDF(
        filteredData,
        "receipts",
        (amount) => formatCurrency(amount, countryCode),
        "School Management System"
      )}
      onExportExcel={() => exportReceiptsToExcel(
        filteredData,
        "receipts",
        (amount) => formatCurrency(amount, countryCode)
      )}
      headerContent={
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mt-6">
            <StatCard
              icon={FileText}
              label="Total Amount"
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
              label="Outstanding"
              value={formatCurrency(stats.totalOutstanding, countryCode)}
              color="amber"
              badge={`${stats.pendingReceipts}`}
            />
            <StatCard
              icon={CheckCircle2}
              label="Issued"
              value={stats.issuedReceipts.toString()}
              color="emerald"
              badge={`${stats.totalReceipts > 0 ? ((stats.issuedReceipts / stats.totalReceipts) * 100).toFixed(0) : 0}%`}
            />
            <StatCard
              icon={XCircle}
              label="Voided"
              value={stats.voidedReceipts.toString()}
              color="red"
              badge={`${stats.voidedReceipts}`}
            />
          </div>

          {/* Filters Bar */}
          <div className="mt-6">
            <SearchFilterBar
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search by receipt #, student name or ID..."
              filters={[
                {
                  label: "Academic Year",
                  value: selectedYear,
                  onChange: (val) => handleFilterChange(setSelectedYear, String(val)),
                  options: RECEIPT_ACADEMIC_YEARS,
                },
                {
                  label: "Term",
                  value: selectedTerm,
                  onChange: (val) => handleFilterChange(setSelectedTerm, String(val)),
                  options: RECEIPT_TERMS,
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
                  options: RECEIPT_STATUS_OPTIONS,
                },
              ]}
            />
          </div>
        </>
      }
      customListComponent={
        <div>
          {isLoading ? (
            <PageSpinner message={isRefreshing ? "Refreshing..." : "Filtering..."} size="md" />
          ) : filteredData.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-16 h-16">
                    <Receipt className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-1 text-center">
                  No receipts found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                  {searchQuery
                    ? "No results match your search. Try adjusting your filters."
                    : "Get started by generating your first receipt."}
                </p>
                {!searchQuery && (
                  <Button variant="primary" onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Generate Receipt
                  </Button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
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
                className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm"
              >
                <DataTable
                  columns={columns}
                  data={filteredData}
                  getRowKey={(receipt) => receipt.id}
                  emptyMessage="No receipts found. Click 'Generate Receipt' to create one."
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
      {/* Create Receipt Modal */}
      <ReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateReceiptFromModal}
        isSaving={isSaving}
        currencySymbol={currencySymbol}
        educationLevel={educationLevel}
      />

      {/* View Receipt Modal */}
      {viewingReceipt && (
        <ReceiptViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingReceipt(null);
          }}
          receipt={viewingReceipt}
          countryCode={countryCode}
          currencySymbol={currencySymbol}
          getStatusBadge={getStatusBadge}
          getPaymentMethodLabel={getPaymentMethodLabel}
          onPrint={() => handlePrint(viewingReceipt)}
          onDownload={() => handleDownload(viewingReceipt)}
          onEmail={() => handleEmail(viewingReceipt)}
        />
      )}

      {/* Void Confirmation Modal */}
      <ActionModal
        isOpen={isVoidModalOpen}
        onClose={() => {
          setIsVoidModalOpen(false);
          setVoidingReceipt(null);
        }}
        title="Void Receipt"
        subtitle={voidingReceipt?.receiptNumber}
        variant="danger"
        message={`Are you sure you want to void this receipt? This action cannot be undone.`}
        details={
          voidingReceipt
            ? [
                { label: "Student", value: voidingReceipt.studentName },
                { label: "Class", value: voidingReceipt.classLevel },
                { label: "Total", value: formatCurrency(voidingReceipt.totalAmount, countryCode) },
                { label: "Balance", value: formatCurrency(voidingReceipt.balance, countryCode) },
              ]
            : undefined
        }
        confirmLabel="Void Receipt"
        cancelLabel="Cancel"
        onConfirm={handleVoid}
        isConfirming={isSaving}
      />
    </DataManagementPage>
  );
}

// View Receipt Modal Component
interface ReceiptViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptRecord;
  countryCode: string;
  currencySymbol: string;
  getStatusBadge: (status: ReceiptStatus) => React.ReactNode;
  getPaymentMethodLabel: (method: PaymentMethod) => string;
  onPrint: () => void;
  onDownload: () => void;
  onEmail: () => void;
}

function ReceiptViewModal({
  isOpen,
  onClose,
  receipt,
  countryCode,
  currencySymbol,
  getStatusBadge,
  getPaymentMethodLabel,
  onPrint,
  onDownload,
  onEmail,
}: ReceiptViewModalProps) {
  const itemRows = receipt.items.map((item) => (
    <tr key={item.id}>
      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
        {item.description}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right">
        {item.quantity}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
        {formatCurrency(item.amount * item.quantity, countryCode)}
      </td>
    </tr>
  ));

  return (
    <DetailViewModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Receipt ${receipt.receiptNumber}`}
      subtitle={`Issued on ${new Date(receipt.issueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`}
      icon={<Receipt className="w-5 h-5" />}
      size="2xl"
      header={{
        image: (
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-200 dark:ring-blue-800 midnight:ring-cyan-800/50 purple:ring-pink-800/50">
            <Image
              src={`https://i.pravatar.cc/150?u=${receipt.studentId}`}
              alt={receipt.studentName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ),
        badges: [
          {
            label: receipt.status.toUpperCase(),
            variant: receipt.status === "issued" ? "success" : receipt.status === "pending" ? "warning" : "danger",
            pulse: receipt.status !== "voided",
          },
        ],
        subtitle: (
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {receipt.studentName} • {receipt.studentNumber} • {receipt.classLevel}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {receipt.academicYear} • {receipt.term.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>
        ),
      }}
      sections={[
        {
          id: "items",
          title: "Items",
          type: "custom",
          children: (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{itemRows}</tbody>
              </table>
            </div>
          ),
        },
        {
          id: "totals",
          title: "Totals",
          type: "grid",
          columns: 3,
          fields: [
            { label: "Subtotal", value: formatCurrency(receipt.subtotal, countryCode) },
            { label: "Discount", value: receipt.discount > 0 ? `-${formatCurrency(receipt.discount, countryCode)}` : "-" },
            { label: "Total", value: formatCurrency(receipt.totalAmount, countryCode), highlight: "blue" },
            { label: "Paid", value: formatCurrency(receipt.amountPaid, countryCode), highlight: "green" },
            { label: "Balance", value: formatCurrency(receipt.balance, countryCode), highlight: receipt.balance > 0 ? "amber" : "green" },
            { label: "Due Date", value: receipt.dueDate ? new Date(receipt.dueDate).toLocaleDateString("en-GB") : "-" },
          ],
        },
        {
          id: "payment",
          title: "Payment",
          type: "grid",
          columns: 2,
          fields: [
            { label: "Method", value: getPaymentMethodLabel(receipt.paymentMethod) },
            { label: "Reference", value: receipt.paymentReference || "-" },
          ],
        },
        receipt.notes
          ? {
              id: "notes",
              title: "Notes",
              type: "description",
              content: receipt.notes,
            }
          : { id: "notes-empty", type: "custom", children: null },
      ]}
      actions={[
        { id: "print", label: "Print", icon: Printer, variant: "secondary", position: "left", onClick: onPrint },
        { id: "download", label: "Download", icon: Download, variant: "secondary", position: "left", onClick: onDownload },
        { id: "email", label: "Email", icon: Mail, variant: "secondary", position: "left", onClick: onEmail },
        { id: "close", label: "Close", variant: "ghost", position: "right", onClick: onClose },
      ]}
      footerInfo={{
        items: [
          { label: "Issued by", value: receipt.issuedBy },
          { label: "Generated", value: new Date(receipt.createdAt).toLocaleString() },
        ],
      }}
    />
  );
}
