"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import StatCard from "@/components/shared/StatCard";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import Button from "@/components/shared/Button";
import jsPDF from "jspdf";
import PayFeesModal from "@/components/parents/PayFeesModal";
import ViewReceiptModal, { PaymentReceiptData } from "@/components/parents/ViewReceiptModal";
import PaymentHistoryModal from "@/components/parents/PaymentHistoryModal";
import ContactBursaryModal from "@/components/parents/ContactBursaryModal";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  FileText,
  History,
  FileCheck,
  Phone,
  Download,
  HelpCircle,
  Banknote,
} from "lucide-react";
import CurrencyIcon from "@/components/shared/CurrencyIcon";
import type { ParentFeeRecord } from "@/types/parent";

// Mock Fee Data
const MOCK_FEES: ParentFeeRecord[] = [
  {
    id: "fee-001",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    feeType: "School Fees",
    term: "2nd Term",
    academicYear: "2024/2025",
    amount: 150000,
    paidAmount: 100000,
    balance: 50000,
    dueDate: "2024-02-15",
    status: "partial",
    paymentHistory: [
      {
        id: "pay-001",
        date: "2024-01-10",
        amount: 100000,
        method: "Bank Transfer",
        reference: "TRF-2024-0891",
        receiptNumber: "RCP-2024-001",
      },
    ],
  },
  {
    id: "fee-002",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    feeType: "School Fees",
    term: "2nd Term",
    academicYear: "2024/2025",
    amount: 180000,
    paidAmount: 180000,
    balance: 0,
    dueDate: "2024-02-15",
    status: "paid",
    paymentHistory: [
      {
        id: "pay-002",
        date: "2024-01-05",
        amount: 180000,
        method: "Card",
        reference: "CARD-2024-445",
        receiptNumber: "RCP-2024-002",
      },
    ],
  },
  {
    id: "fee-003",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    feeType: "School Fees",
    term: "1st Term",
    academicYear: "2024/2025",
    amount: 150000,
    paidAmount: 150000,
    balance: 0,
    dueDate: "2023-10-15",
    status: "paid",
    paymentHistory: [
      {
        id: "pay-003",
        date: "2023-09-20",
        amount: 75000,
        method: "Bank Transfer",
        reference: "TRF-2023-8891",
        receiptNumber: "RCP-2023-045",
      },
      {
        id: "pay-004",
        date: "2023-10-10",
        amount: 75000,
        method: "Cash",
        reference: "CASH-2023-102",
        receiptNumber: "RCP-2023-089",
      },
    ],
  },
  {
    id: "fee-004",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    feeType: "School Fees",
    term: "1st Term",
    academicYear: "2024/2025",
    amount: 180000,
    paidAmount: 180000,
    balance: 0,
    dueDate: "2023-10-15",
    status: "paid",
    paymentHistory: [
      {
        id: "pay-005",
        date: "2023-09-15",
        amount: 180000,
        method: "Card",
        reference: "CARD-2023-889",
        receiptNumber: "RCP-2023-044",
      },
    ],
  },
  {
    id: "fee-005",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    feeType: "Bus Fee",
    term: "2nd Term",
    academicYear: "2024/2025",
    amount: 25000,
    paidAmount: 0,
    balance: 25000,
    dueDate: "2024-02-01",
    status: "overdue",
    paymentHistory: [],
  },
];

// Filter options
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
];

const CHILD_OPTIONS = [
  { value: "all", label: "All Children" },
  { value: "child-001", label: "Adaeze Okonkwo" },
  { value: "child-002", label: "Chukwuemeka Okonkwo" },
];

export default function ParentFeesPage() {
  const searchParams = useSearchParams();
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();
  const currencyCode = settings.currency || "NGN";
  const { money, currencySymbol } = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

    const symbol =
      formatter.formatToParts(0).find((p) => p.type === "currency")?.value ??
      currencyCode;

    return {
      money: (amount: number) => formatter.format(amount),
      currencySymbol: symbol,
    };
  }, [currencyCode]);

  const initialChild = searchParams.get("child") || "all";
  const [selectedChild, setSelectedChild] = useState(initialChild);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  // Fees state - combines mock data with newly added fees from admin portal
  const [fees, setFees] = useState<ParentFeeRecord[]>(MOCK_FEES);

  // Load newly added fees from session storage
  useEffect(() => {
    const loadNewFees = () => {
      try {
        const newRecords = JSON.parse(sessionStorage.getItem("newFeeRecords") || "[]");
        // Convert AdminFeeRecord to ParentFeeRecord format
        const convertedFees: ParentFeeRecord[] = newRecords.map((record: {
          id: string;
          childId: string;
          childName: string;
          feeType: string;
          term: string;
          academicYear: string;
          amount: number;
          paidAmount: number;
          balance: number;
          dueDate: string;
          status: "paid" | "partial" | "pending" | "overdue";
          paymentHistory: { id: string; date: string; amount: number; method: string; reference: string; receiptNumber: string; }[];
        }) => ({
          id: record.id,
          childId: record.childId,
          childName: record.childName,
          feeType: record.feeType,
          term: record.term,
          academicYear: record.academicYear,
          amount: record.amount,
          paidAmount: record.paidAmount,
          balance: record.balance,
          dueDate: record.dueDate,
          status: record.status,
          paymentHistory: record.paymentHistory.map((p: { id: string; date: string; amount: number; method: string; reference: string; receiptNumber: string; }) => ({
            id: p.id,
            date: p.date,
            amount: p.amount,
            method: p.method as "Cash" | "Card" | "Bank Transfer" | "Mobile Money",
            reference: p.reference,
            receiptNumber: p.receiptNumber,
          })),
        }));
        setFees([...convertedFees, ...MOCK_FEES]);
      } catch {
        // Ignore errors
      }
    };

    loadNewFees();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "newFeeRecords") {
        loadNewFees();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Modal states
  const [payFeesModalOpen, setPayFeesModalOpen] = useState(false);
  const [selectedFeeIdForPayment, setSelectedFeeIdForPayment] = useState<string | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceiptData | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [contactBursaryModalOpen, setContactBursaryModalOpen] = useState(false);

  // Match /finance/installments: trigger row animation when filters/search change.
  const filterKey = `${searchQuery}-${selectedChild}-${selectedStatus}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Filter fees
  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchesChild = selectedChild === "all" || fee.childId === selectedChild;
      const matchesStatus = selectedStatus === "all" || fee.status === selectedStatus;
      const matchesSearch =
        searchQuery === "" ||
        fee.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.feeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.term.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChild && matchesStatus && matchesSearch;
    });
  }, [fees, selectedChild, selectedStatus, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
    const totalPaid = fees.reduce((sum, f) => sum + f.paidAmount, 0);
    const totalBalance = fees.reduce((sum, f) => sum + f.balance, 0);
    const overdueCount = fees.filter((f) => f.status === "overdue").length;
    return { totalAmount, totalPaid, totalBalance, overdueCount };
  }, [fees]);

  // Convert fees to format needed for PayFeesModal
  const feesForPayModal = useMemo(() => {
    return fees.filter(f => f.balance > 0).map(f => ({
      id: f.id,
      childName: f.childName,
      feeType: f.feeType,
      term: f.term,
      academicYear: f.academicYear,
      amount: f.amount,
      paidAmount: f.paidAmount,
      balance: f.balance,
      dueDate: f.dueDate,
      status: f.status,
    }));
  }, [fees]);

  // Generate payment history data from fees
  const allPaymentHistory: PaymentReceiptData[] = useMemo(() => {
    const payments: PaymentReceiptData[] = [];
    fees.forEach(fee => {
      fee.paymentHistory.forEach(payment => {
        payments.push({
          id: payment.id,
          childName: fee.childName,
          childId: fee.childId,
          feeType: fee.feeType,
          term: fee.term,
          academicYear: fee.academicYear,
          amount: fee.amount,
          paidAmount: payment.amount,
          balance: fee.balance,
          paymentDate: payment.date,
          paymentMethod: payment.method as "Card" | "Bank Transfer" | "Cash",
          status: "completed",
          transactionRef: payment.reference,
          receiptNumber: payment.receiptNumber,
        });
      });
    });
    return payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [fees]);

  // Modal handlers
  const handleOpenPayModal = (feeId?: string) => {
    setSelectedFeeIdForPayment(feeId || null);
    setPayFeesModalOpen(true);
  };

  const handlePaymentComplete = (paymentDetails: any) => {
    console.log("Payment completed:", paymentDetails);
    setPayFeesModalOpen(false);
    // In production, this would refresh the data
  };

  const handleViewReceipt = (fee: ParentFeeRecord) => {
    if (fee.paymentHistory.length > 0) {
      const lastPayment = fee.paymentHistory[fee.paymentHistory.length - 1];
      setSelectedReceipt({
        id: lastPayment.id,
        childName: fee.childName,
        childId: fee.childId,
        feeType: fee.feeType,
        term: fee.term,
        academicYear: fee.academicYear,
        amount: fee.amount,
        paidAmount: lastPayment.amount,
        balance: fee.balance,
        paymentDate: lastPayment.date,
        paymentMethod: lastPayment.method as "Card" | "Bank Transfer" | "Cash",
        status: "completed",
        transactionRef: lastPayment.reference,
        receiptNumber: lastPayment.receiptNumber,
      });
      setReceiptModalOpen(true);
    }
  };

  const handleViewReceiptFromHistory = (payment: PaymentReceiptData) => {
    setSelectedReceipt(payment);
    setHistoryModalOpen(false);
    setReceiptModalOpen(true);
  };

  // Download Fee Statement as PDF
  const handleDownloadStatement = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Format currency for PDF
    const formatCurrency = (amount: number) => {
      return `${settings.currency || "NGN"} ${amount.toLocaleString()}`;
    };

    // ===== HEADER =====
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text("Fee Statement", pageWidth / 2, y, { align: "center" });
    y += 7;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(settings.schoolName || "School", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Divider line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // ===== SUMMARY SECTION =====
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin, y, contentWidth, 30, 3, 3, "FD");

    // Summary title
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text("ACCOUNT SUMMARY", margin + 8, y + 8);

    // Summary values in columns
    const colWidth = contentWidth / 4;
    const summaryY = y + 18;

    // Total Fees
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Total Fees", margin + 8, summaryY);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text(formatCurrency(stats.totalAmount), margin + 8, summaryY + 6);

    // Total Paid
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Total Paid", margin + colWidth + 8, summaryY);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text(formatCurrency(stats.totalPaid), margin + colWidth + 8, summaryY + 6);

    // Outstanding Balance
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Outstanding", margin + colWidth * 2 + 8, summaryY);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(stats.totalBalance > 0 ? 239 : 16, stats.totalBalance > 0 ? 68 : 185, stats.totalBalance > 0 ? 68 : 129);
    doc.text(formatCurrency(stats.totalBalance), margin + colWidth * 2 + 8, summaryY + 6);

    // Overdue
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Overdue Items", margin + colWidth * 3 + 8, summaryY);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(stats.overdueCount > 0 ? 239 : 31, stats.overdueCount > 0 ? 68 : 41, stats.overdueCount > 0 ? 68 : 55);
    doc.text(String(stats.overdueCount), margin + colWidth * 3 + 8, summaryY + 6);

    y += 40;

    // ===== FEE DETAILS TABLE =====
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text("FEE DETAILS", margin, y);
    y += 6;

    // Table header
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, y, contentWidth, 10, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);

    const cols = [
      { label: "Child / Fee Type", x: margin + 4, width: 50 },
      { label: "Amount", x: margin + 54, width: 30 },
      { label: "Paid", x: margin + 84, width: 30 },
      { label: "Balance", x: margin + 114, width: 30 },
      { label: "Due Date", x: margin + 144, width: 26 },
    ];

    cols.forEach((col) => {
      doc.text(col.label, col.x, y + 7);
    });

    y += 12;

    // Table rows
    fees.forEach((fee, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      // Alternating row background
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, y - 2, contentWidth, 14, "F");
      }

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(fee.childName, cols[0].x, y + 4);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(7);
      doc.text(`${fee.feeType} - ${fee.term}`, cols[0].x, y + 9);

      doc.setFontSize(8);
      doc.setTextColor(31, 41, 55);
      doc.text(formatCurrency(fee.amount), cols[1].x, y + 6);

      doc.setTextColor(16, 185, 129);
      doc.text(formatCurrency(fee.paidAmount), cols[2].x, y + 6);

      doc.setTextColor(fee.balance > 0 ? 239 : 16, fee.balance > 0 ? 68 : 185, fee.balance > 0 ? 68 : 129);
      doc.text(formatCurrency(fee.balance), cols[3].x, y + 6);

      doc.setTextColor(107, 114, 128);
      doc.text(
        new Date(fee.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
        cols[4].x,
        y + 6
      );

      y += 16;
    });

    y += 6;

    // ===== FOOTER =====
    doc.setFillColor(31, 41, 55);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Statement generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
      pageWidth / 2,
      y + 7,
      { align: "center" }
    );

    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(`${settings.schoolName || "School"} - Official Fee Statement`, pageWidth / 2, y + 12, { align: "center" });

    // Save PDF
    doc.save(`Fee-Statement-${new Date().toISOString().split("T")[0]}.pdf`);
  };

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

  // Get status badge
  const getStatusBadge = (status: ParentFeeRecord["status"]) => {
    const config = {
      paid: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Paid",
      },
      partial: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Partial",
      },
      pending: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      overdue: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Overdue",
      },
    };

    const c = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  // Table columns
  const columns: ColumnConfig<ParentFeeRecord>[] = [
    {
      key: "childName",
      label: "Child",
      sortable: true,
      render: (fee) => (
        <div className="flex items-center gap-2">
          <div className="relative cursor-pointer group/avatar flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]">
              <Image
                src={`https://i.pravatar.cc/150?u=${fee.childId}`}
                alt={fee.childName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {fee.childName}
          </span>
        </div>
      ),
    },
    {
      key: "feeType",
      label: "Fee Type",
      sortable: true,
      render: (fee) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{fee.feeType}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fee.term} - {fee.academicYear}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (fee) => (
        <span className="font-semibold text-gray-900 dark:text-white text-sm">
          {money(fee.amount)}
        </span>
      ),
    },
    {
      key: "paidAmount",
      label: "Paid",
      sortable: true,
      render: (fee) => (
        <span className="font-medium text-green-600 dark:text-green-400 text-sm">
          {money(fee.paidAmount)}
        </span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: true,
      render: (fee) => (
        <span className={`font-semibold text-sm ${
          fee.balance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
        }`}>
          {money(fee.balance)}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (fee) => (
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          {new Date(fee.dueDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (fee) => getStatusBadge(fee.status),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (fee) => (
        <div className="flex items-center justify-center gap-2">
          {fee.balance > 0 && (
            <button
              type="button"
              onClick={() => handleOpenPayModal(fee.id)}
              className="inline-flex h-8 items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors px-3 whitespace-nowrap cursor-pointer"
            >
              Pay Now
            </button>
          )}
          {fee.paymentHistory.length > 0 && (
            <button
              type="button"
              onClick={() => handleViewReceipt(fee)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              aria-label="View receipt"
            >
              <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Fees" />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <PageHeader
            title="Fees & Payments"
            breadcrumbs={[
              { label: "Parent Portal", href: "/parents" },
              { label: "Fees & Payments" },
            ]}
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-gray-600 dark:text-gray-400"
              onClick={() => setHistoryModalOpen(true)}
            >
              <History className="w-4 h-4 mr-2" />
              Download History
            </Button>
            {stats.totalBalance > 0 && (
              <Button
                variant="primary"
                onClick={() => handleOpenPayModal()}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Outstanding ({money(stats.totalBalance)})
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Banknote}
            label="Total Fees"
            value={money(stats.totalAmount)}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Total Paid"
            value={money(stats.totalPaid)}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Outstanding"
            value={money(stats.totalBalance)}
            color={stats.totalBalance > 0 ? "red" : "green"}
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={stats.overdueCount.toString()}
            color={stats.overdueCount > 0 ? "red" : "green"}
            badge={stats.overdueCount > 0 ? "Action Required" : undefined}
          />
        </div>

        {/* Outstanding Balance Alert */}
        {stats.totalBalance > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10 border border-red-200/60 dark:border-red-700/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">
                    Outstanding Balance: {money(stats.totalBalance)}
                  </p>
                  <p className="text-sm text-red-600/80 dark:text-red-400/70">
                    Please clear your outstanding balance to avoid late fees and service disruptions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPayModal()}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-sm transition-all whitespace-nowrap cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by child name, fee type..."
          filters={[
            {
              label: "Child",
              value: selectedChild,
              onChange: (val) => setSelectedChild(String(val)),
              options: CHILD_OPTIONS,
            },
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => setSelectedStatus(String(val)),
              options: STATUS_OPTIONS,
            },
          ]}
        />

        {/* Fee Table (match /finance/installments behavior) */}
        <div className="relative">
          {/* Mobile Scroll Indicator */}
          <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

          <div
            ref={tableWrapRef}
            key={`fees-table-${filterKey}`}
            className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden"
          >
            <DataTable
              data={filteredFees}
              columns={columns}
              getRowKey={(fee) => fee.id}
              emptyMessage="No fee records found"
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

        {/* Need Help? Quick Actions */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-4 sm:p-6">
          <div className="flex items-start gap-3 mb-4 sm:mb-5">
            <div className="p-2 sm:p-2.5 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 midnight:from-gray-800 midnight:to-gray-700 purple:from-gray-800 purple:to-gray-700">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm sm:text-base">
                Need Help?
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Quick actions & support
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* Contact Bursary */}
            <button
              type="button"
              onClick={() => setContactBursaryModalOpen(true)}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 midnight:from-cyan-900/20 midnight:to-cyan-800/10 purple:from-pink-900/20 purple:to-pink-800/10 border border-blue-200/50 dark:border-blue-500/20 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-300 dark:hover:border-blue-400/30 midnight:hover:border-cyan-400/30 purple:hover:border-pink-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 midnight:from-cyan-500 midnight:to-cyan-600 purple:from-pink-500 purple:to-pink-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-[10px] sm:text-xs text-center">
                Contact
              </p>
              <p className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-[10px] sm:text-xs text-center font-semibold">
                Finance
              </p>
            </button>

            {/* Payment History */}
            <button
              type="button"
              onClick={() => setHistoryModalOpen(true)}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 midnight:from-emerald-900/20 midnight:to-emerald-800/10 purple:from-emerald-900/20 purple:to-emerald-800/10 border border-green-200/50 dark:border-green-500/20 midnight:border-emerald-500/20 purple:border-emerald-500/20 hover:border-green-300 dark:hover:border-green-400/30 midnight:hover:border-emerald-400/30 purple:hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 dark:hover:shadow-green-500/5 hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 midnight:from-emerald-500 midnight:to-emerald-600 purple:from-emerald-500 purple:to-emerald-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg shadow-green-500/20 dark:shadow-green-500/10 group-hover:scale-110 transition-transform duration-300">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-[10px] sm:text-xs text-center">
                Payment
              </p>
              <p className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-[10px] sm:text-xs text-center font-semibold">
                History
              </p>
            </button>

            {/* Download Statement */}
            <button
              type="button"
              onClick={() => {
                // Trigger download of fee statement
                handleDownloadStatement();
              }}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 midnight:from-amber-900/20 midnight:to-amber-800/10 purple:from-amber-900/20 purple:to-amber-800/10 border border-orange-200/50 dark:border-orange-500/20 midnight:border-amber-500/20 purple:border-amber-500/20 hover:border-orange-300 dark:hover:border-orange-400/30 midnight:hover:border-amber-400/30 purple:hover:border-amber-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 midnight:from-amber-500 midnight:to-amber-600 purple:from-amber-500 purple:to-amber-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-[10px] sm:text-xs text-center">
                Download
              </p>
              <p className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-[10px] sm:text-xs text-center font-semibold">
                Statement
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Pay Fees Modal */}
      <PayFeesModal
        isOpen={payFeesModalOpen}
        onClose={() => {
          setPayFeesModalOpen(false);
          setSelectedFeeIdForPayment(null);
        }}
        onPaymentComplete={handlePaymentComplete}
        fees={feesForPayModal}
        selectedFeeId={selectedFeeIdForPayment}
      />

      {/* View Receipt Modal */}
      <ViewReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => {
          setReceiptModalOpen(false);
          setSelectedReceipt(null);
        }}
        payment={selectedReceipt}
      />

      {/* Payment History Modal */}
      <PaymentHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        payments={allPaymentHistory}
        onViewReceipt={handleViewReceiptFromHistory}
      />

      {/* Contact Bursary Modal */}
      <ContactBursaryModal
        isOpen={contactBursaryModalOpen}
        onClose={() => setContactBursaryModalOpen(false)}
      />
    </MainLayout>
  );
}
