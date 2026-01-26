"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageLoader from "@/components/shared/PageLoader";
import PageSpinner from "@/components/shared/PageSpinner";
import StatCard from "@/components/shared/StatCard";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterField, FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import Tooltip from "@/components/shared/Tooltip";
import FeeDetailModal, { FeeDetailRecord } from "@/components/shared/FeeDetailModal";
import PaymentHistoryModal from "@/components/shared/PaymentHistoryModal";
import SendFeeReminderModal from "@/components/shared/SendFeeReminderModal";
import FeeActionsDropdown from "@/components/shared/FeeActionsDropdown";
import FeeReminderHistoryModal from "@/components/shared/FeeReminderHistoryModal";
import AutoReminderScheduleModal from "@/components/shared/AutoReminderScheduleModal";
import RecordPaymentModal, { PaymentData } from "@/components/shared/RecordPaymentModal";
import { useNotifications } from "@/contexts/NotificationContext";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  getAllFeeRecords,
  getFeeStats,
  addFeeReminder,
  getReminderCountByFeeRecordId,
  getRemindersByFeeRecordId,
  type AdminFeeRecord,
  type ReminderChannel,
  type FeeReminderRecord,
} from "@/lib/mockParents";
import {
  Banknote,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileCheck,
  Eye,
  Receipt,
  Send,
  History,
  CalendarClock,
  FileText,
} from "lucide-react";

export default function AdminParentFeesPage() {
  const { settings } = useSchoolSettings();
  const { addNotification } = useNotifications();
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePageLoading = usePageLoad(600);
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  // Get view mode from URL, default to list
  const urlView = searchParams.get("view");
  const initialView = urlView === "grid" ? "grid" : "list";

  // Load fee records from mock data and session storage (newly added fees)
  const [feeRecords, setFeeRecords] = useState<AdminFeeRecord[]>(() => {
    const mockRecords = getAllFeeRecords();
    // Check for new fee records added via the add page
    if (typeof window !== "undefined") {
      try {
        const newRecords = JSON.parse(sessionStorage.getItem("newFeeRecords") || "[]") as AdminFeeRecord[];
        return [...newRecords, ...mockRecords];
      } catch {
        return mockRecords;
      }
    }
    return mockRecords;
  });

  // Refresh fee records when navigating back to this page
  useEffect(() => {
    const loadNewRecords = () => {
      try {
        const newRecords = JSON.parse(sessionStorage.getItem("newFeeRecords") || "[]") as AdminFeeRecord[];
        const mockRecords = getAllFeeRecords();
        setFeeRecords([...newRecords, ...mockRecords]);
      } catch {
        // Ignore errors
      }
    };

    // Load on mount
    loadNewRecords();

    // Listen for storage changes (in case another tab adds a fee)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "newFeeRecords") {
        loadNewRecords();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(12);

  const isPageLoading = basePageLoading && !isSwitchingView;

  // Currency formatter
  const currencyCode = settings.currency || "NGN";
  const { money, currencySymbol } = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

    const symbol =
      formatter.formatToParts(0).find((p) => p.type === "currency")?.value ?? currencyCode;

    return {
      money: (amount: number) => formatter.format(amount),
      currencySymbol: symbol,
    };
  }, [currencyCode]);

  // Get stats
  const stats = useMemo(() => getFeeStats(), []);

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`/admin/parents/fees?view=${newMode}`);

    setTimeout(() => {
      setIsSwitchingView(false);
    }, 700);
  };

  // Sync view mode with URL changes
  useEffect(() => {
    const urlView = searchParams.get("view");
    const newViewMode = urlView === "grid" ? "grid" : "list";
    setViewMode(newViewMode);
  }, [searchParams]);

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      id: "status",
      label: "Status",
      options: ["Paid", "Partial", "Pending", "Overdue"],
      width: "half",
    },
    {
      id: "feeType",
      label: "Fee Type",
      options: ["School Fees", "Bus Fee", "Exam Fee", "Library Fee", "Lab Fee", "Sports Fee", "Uniform Fee"],
      width: "half",
    },
    {
      id: "term",
      label: "Term",
      options: ["1st Term", "2nd Term", "3rd Term"],
      width: "half",
    },
    {
      id: "balanceRange",
      label: "Balance Range",
      options: ["Fully Paid", "Under 50K", "50K - 100K", "Over 100K"],
      width: "half",
    },
  ];

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sort state
  const [sortOption, setSortOption] = useState<string>("highest_balance");
  const [isSorting, setIsSorting] = useState(false);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Action modals state
  const [selectedRecord, setSelectedRecord] = useState<AdminFeeRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isReminderHistoryModalOpen, setIsReminderHistoryModalOpen] = useState(false);
  const [isAutoReminderModalOpen, setIsAutoReminderModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);

  // Reminder counts - initialize from mock data, will update when reminders are sent
  const [reminderCounts, setReminderCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    feeRecords.forEach(record => {
      counts[record.id] = getReminderCountByFeeRecordId(record.id);
    });
    return counts;
  });

  // Animation trigger for table rows
  const filterKey = `${JSON.stringify(filters)}-${sortOption}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Sort options
  const sortOptions = [
    { label: "Highest Balance", value: "highest_balance" },
    { label: "Lowest Balance", value: "lowest_balance" },
    { label: "A-Z (Parent)", value: "ascending" },
    { label: "Z-A (Parent)", value: "descending" },
    { label: "Due Date (Nearest)", value: "due_date_asc" },
    { label: "Due Date (Farthest)", value: "due_date_desc" },
  ];

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setDateRange({ startDate, endDate });
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleFilterChange = (updatedFilters: FilterValues) => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters(updatedFilters);
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleClearFilters = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters({});
      setDateRange(null);
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedRecords = filteredRecords.filter((record) => selectedIds.has(record.id));

      const items: BulkDeleteItem[] = selectedRecords.map((record) => ({
        id: record.id,
        name: `${record.childName} - ${record.feeType}`,
        subtitle: `${record.parentName} | ${money(record.balance)} outstanding`,
      }));

      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleRemoveFromDeleteList = (itemId: string) => {
    setItemsToDelete((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(itemId);
      return newIds;
    });
  };

  const handleConfirmBulkDelete = (itemIds: string[]) => {
    console.log("Deleting fee records:", itemIds);
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const handleCloseBulkDeleteModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const handleRestoreItem = (item: BulkDeleteItem) => {
    setItemsToDelete((prevItems) => [...prevItems, item]);
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.add(item.id);
      return newIds;
    });
  };

  const handleRestoreAll = (items: BulkDeleteItem[]) => {
    setItemsToDelete((prevItems) => [...prevItems, ...items]);
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      items.forEach((item) => newIds.add(item.id));
      return newIds;
    });
  };

  // Check if there are active filters
  const hasActiveFilters =
    Object.values(filters).some((values) => values && values.length > 0) || dateRange !== null;

  const handleSortChange = (sortValue: string) => {
    setIsSorting(true);
    setTimeout(() => {
      setSortOption(sortValue);
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    }, 300);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setDateRange(null);
    setFilters({});
    setSortOption("highest_balance");
    setSelectedIds(new Set());
    setResetKey((prev) => prev + 1);
    setTimeout(() => {
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  const handleAddFee = () => {
    router.push("/admin/parents/fees/add");
  };

  // Action handlers for fee records
  const handleViewDetails = (record: AdminFeeRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleViewReceipt = (record: AdminFeeRecord) => {
    setSelectedRecord(record);
    setIsPaymentHistoryModalOpen(true);
  };

  const handleSendReminder = (record: AdminFeeRecord) => {
    setSelectedRecord(record);
    setIsReminderModalOpen(true);
  };

  const handleViewReminderHistory = (record: AdminFeeRecord) => {
    setSelectedRecord(record);
    setIsReminderHistoryModalOpen(true);
  };

  const handleAutoReminder = (record: AdminFeeRecord) => {
    setSelectedRecord(record);
    setIsAutoReminderModalOpen(true);
  };

  const handleEditRecord = (record: AdminFeeRecord) => {
    router.push(`/admin/parents/fees/${record.id}/edit`);
  };

  const handleDeleteRecord = (record: AdminFeeRecord) => {
    const items: BulkDeleteItem[] = [{
      id: record.id,
      name: `${record.childName} - ${record.feeType}`,
      subtitle: `${record.parentName} | ${money(record.balance)} outstanding`,
    }];
    setItemsToDelete(items);
    setIsBulkDeleteModalOpen(true);
  };

  const handleDownloadStatement = (record: AdminFeeRecord) => {
    // Generate professional PDF statement
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Helper function to parse hex color to RGB
    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 0, g: 0, b: 0 };
    };

    // Professional color palette
    const colors = {
      primary: hexToRgb("#1e40af"),      // Deep blue
      primaryLight: hexToRgb("#3b82f6"), // Light blue
      text: hexToRgb("#111827"),         // Near black
      textLight: hexToRgb("#6b7280"),    // Gray
      textMuted: hexToRgb("#9ca3af"),    // Light gray
      success: hexToRgb("#059669"),      // Green
      danger: hexToRgb("#dc2626"),       // Red
      warning: hexToRgb("#d97706"),      // Amber
      border: hexToRgb("#d1d5db"),       // Light border
      bgLight: hexToRgb("#f9fafb"),      // Very light gray
    };

    // Currency formatting
    const currencySymbol = settings.currency === "NGN" ? "NGN" : settings.currency === "USD" ? "USD" : settings.currency;
    const formatCurrency = (amount: number) => `${currencySymbol} ${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let y = margin;

    // ════════════════════════════════════════════════════════════
    // HEADER SECTION - School branding and statement title
    // ════════════════════════════════════════════════════════════

    // School name - left aligned, prominent
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.text((settings.schoolName || "EDUCO SCHOOL").toUpperCase(), margin, y);

    // Statement badge - right aligned
    const badgeText = "FEE STATEMENT";
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const badgeWidth = doc.getTextWidth(badgeText) + 12;
    doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.roundedRect(pageWidth - margin - badgeWidth, y - 6, badgeWidth, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(badgeText, pageWidth - margin - badgeWidth + 6, y + 1);

    y += 12;

    // Thin accent line
    doc.setDrawColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + 40, y);

    y += 15;

    // ════════════════════════════════════════════════════════════
    // TWO-COLUMN INFO SECTION - Bill To and Statement Details
    // ════════════════════════════════════════════════════════════

    const leftColX = margin;
    const rightColX = pageWidth / 2 + 10;
    let leftY = y;
    let rightY = y;

    // BILL TO section
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.textMuted.r, colors.textMuted.g, colors.textMuted.b);
    doc.text("BILL TO", leftColX, leftY);
    leftY += 6;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
    doc.text(record.childName, leftColX, leftY);
    leftY += 5;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.textLight.r, colors.textLight.g, colors.textLight.b);
    doc.text(record.childClass, leftColX, leftY);
    leftY += 6;

    doc.setFontSize(8);
    doc.text(`Parent: ${record.parentName}`, leftColX, leftY);
    leftY += 4;
    doc.text(record.parentEmail, leftColX, leftY);

    // STATEMENT DETAILS section (right side)
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.textMuted.r, colors.textMuted.g, colors.textMuted.b);
    doc.text("STATEMENT DETAILS", rightColX, rightY);
    rightY += 6;

    const detailsData = [
      ["Statement No:", record.id.toUpperCase()],
      ["Issue Date:", new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })],
      ["Due Date:", new Date(record.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })],
      ["Term:", record.term],
      ["Academic Year:", record.academicYear],
    ];

    doc.setFontSize(9);
    detailsData.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.textLight.r, colors.textLight.g, colors.textLight.b);
      doc.text(label, rightColX, rightY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      doc.text(value, rightColX + 35, rightY);
      rightY += 5;
    });

    y = Math.max(leftY, rightY) + 12;

    // ════════════════════════════════════════════════════════════
    // FEE DETAILS TABLE
    // ════════════════════════════════════════════════════════════

    // Table header
    const tableY = y;
    doc.setFillColor(colors.bgLight.r, colors.bgLight.g, colors.bgLight.b);
    doc.rect(margin, tableY, contentWidth, 10, "F");

    // Header border
    doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
    doc.setLineWidth(0.3);
    doc.line(margin, tableY, margin + contentWidth, tableY);
    doc.line(margin, tableY + 10, margin + contentWidth, tableY + 10);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
    doc.text("DESCRIPTION", margin + 4, tableY + 7);
    doc.text("AMOUNT", pageWidth - margin - 4, tableY + 7, { align: "right" });

    y = tableY + 14;

    // Fee row
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
    doc.text(record.feeType, margin + 4, y);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(record.amount), pageWidth - margin - 4, y, { align: "right" });

    y += 8;

    // Bottom border of table
    doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
    doc.line(margin, y, margin + contentWidth, y);

    y += 10;

    // ════════════════════════════════════════════════════════════
    // PAYMENT SUMMARY BOX - Right aligned totals
    // ════════════════════════════════════════════════════════════

    const summaryWidth = 80;
    const summaryX = pageWidth - margin - summaryWidth;
    let summaryY = y;

    // Summary rows
    const summaryRows = [
      { label: "Subtotal", value: formatCurrency(record.amount), bold: false },
      { label: "Amount Paid", value: formatCurrency(record.paidAmount), bold: false, color: colors.success },
    ];

    doc.setFontSize(9);
    summaryRows.forEach((row) => {
      doc.setFont("helvetica", row.bold ? "bold" : "normal");
      doc.setTextColor(colors.textLight.r, colors.textLight.g, colors.textLight.b);
      doc.text(row.label, summaryX, summaryY);
      doc.setTextColor(row.color?.r ?? colors.text.r, row.color?.g ?? colors.text.g, row.color?.b ?? colors.text.b);
      doc.text(row.value, pageWidth - margin - 4, summaryY, { align: "right" });
      summaryY += 6;
    });

    // Balance Due - highlighted
    summaryY += 2;
    doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.roundedRect(summaryX - 4, summaryY - 5, summaryWidth + 4, 12, 2, 2, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("BALANCE DUE", summaryX, summaryY + 2);
    doc.text(formatCurrency(record.balance), pageWidth - margin - 4, summaryY + 2, { align: "right" });

    y = summaryY + 20;

    // Status indicator
    const statusConfig: Record<string, { label: string; color: { r: number; g: number; b: number } }> = {
      paid: { label: "PAID IN FULL", color: colors.success },
      partial: { label: "PARTIALLY PAID", color: colors.warning },
      pending: { label: "PAYMENT PENDING", color: colors.primaryLight },
      overdue: { label: "OVERDUE", color: colors.danger },
    };

    const status = statusConfig[record.status] || statusConfig.pending;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(status.color.r, status.color.g, status.color.b);
    doc.text(`Status: ${status.label}`, margin, y);

    y += 15;

    // ════════════════════════════════════════════════════════════
    // PAYMENT HISTORY TABLE (if exists)
    // ════════════════════════════════════════════════════════════

    if (record.paymentHistory && record.paymentHistory.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      doc.text("Payment History", margin, y);

      y += 8;

      // Table header
      doc.setFillColor(colors.bgLight.r, colors.bgLight.g, colors.bgLight.b);
      doc.rect(margin, y, contentWidth, 8, "F");
      doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
      doc.setLineWidth(0.3);
      doc.line(margin, y, margin + contentWidth, y);
      doc.line(margin, y + 8, margin + contentWidth, y + 8);

      const colPositions = [margin + 4, margin + 35, margin + 75, margin + 115];
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.textLight.r, colors.textLight.g, colors.textLight.b);
      doc.text("DATE", colPositions[0], y + 5.5);
      doc.text("AMOUNT", colPositions[1], y + 5.5);
      doc.text("METHOD", colPositions[2], y + 5.5);
      doc.text("REFERENCE", colPositions[3], y + 5.5);

      y += 10;

      // Payment rows
      record.paymentHistory.forEach((payment, index) => {
        if (y > pageHeight - 50) return;

        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 252);
          doc.rect(margin, y - 1, contentWidth, 7, "F");
        }

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
        doc.text(new Date(payment.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), colPositions[0], y + 3);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(colors.success.r, colors.success.g, colors.success.b);
        doc.text(formatCurrency(payment.amount), colPositions[1], y + 3);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
        doc.text(payment.method || "-", colPositions[2], y + 3);

        doc.setTextColor(colors.textMuted.r, colors.textMuted.g, colors.textMuted.b);
        doc.text(payment.reference?.substring(0, 20) || "-", colPositions[3], y + 3);

        y += 7;
      });

      // Bottom border
      doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
      doc.line(margin, y, margin + contentWidth, y);
    }

    // ════════════════════════════════════════════════════════════
    // BANK DETAILS (if available)
    // ════════════════════════════════════════════════════════════

    if (settings.bankAccount && record.balance > 0) {
      y += 15;

      doc.setFillColor(colors.bgLight.r, colors.bgLight.g, colors.bgLight.b);
      doc.roundedRect(margin, y, contentWidth, 25, 2, 2, "F");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      doc.text("PAYMENT DETAILS", margin + 4, y + 6);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.textLight.r, colors.textLight.g, colors.textLight.b);
      const bankInfo = [
        `Bank: ${settings.bankAccount.bankName}`,
        `Account Name: ${settings.bankAccount.accountName}`,
        `Account Number: ${settings.bankAccount.accountNumber}`,
      ];
      let bankY = y + 12;
      bankInfo.forEach((info) => {
        doc.text(info, margin + 4, bankY);
        bankY += 4;
      });
    }

    // ════════════════════════════════════════════════════════════
    // FOOTER
    // ════════════════════════════════════════════════════════════

    const footerY = pageHeight - 20;

    // Footer line
    doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    // Footer text
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.textMuted.r, colors.textMuted.g, colors.textMuted.b);
    doc.text("This is a computer-generated statement.", margin, footerY + 5);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, pageWidth - margin, footerY + 5, { align: "right" });

    // School contact (if questions)
    doc.text("For enquiries, please contact the school administration.", margin, footerY + 10);

    doc.save(`Fee_Statement_${record.childName.replace(/\s+/g, "_")}_${record.feeType.replace(/\s+/g, "_")}.pdf`);

    addNotification({
      type: "success",
      title: "Statement Downloaded",
      message: `Fee statement for ${record.childName} has been downloaded.`,
    });
  };

  const handlePrintStatement = (record: AdminFeeRecord) => {
    // Generate printable HTML for individual fee record
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Statement - ${record.childName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; color: #1f2937; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3b82f6; }
          .header h1 { font-size: 24px; color: #3b82f6; margin-bottom: 8px; }
          .header p { font-size: 14px; color: #6b7280; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; font-weight: 600; color: #3b82f6; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-grid { display: grid; grid-template-columns: 150px 1fr; gap: 8px; }
          .info-label { color: #6b7280; font-size: 13px; }
          .info-value { color: #1f2937; font-size: 13px; font-weight: 500; }
          .summary-box { background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .summary-row:last-child { border-bottom: none; font-weight: 700; font-size: 16px; }
          .amount-paid { color: #22c55e; }
          .amount-due { color: #ef4444; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .status.paid { background: #d1fae5; color: #065f46; }
          .status.pending { background: #dbeafe; color: #1e40af; }
          .status.partial { background: #fef3c7; color: #92400e; }
          .status.overdue { background: #fee2e2; color: #991b1b; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #9ca3af; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          @media print { body { padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Fee Statement</h1>
          <p>${settings.schoolName || "School"}</p>
          <p>Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <div class="section">
          <div class="section-title">Student Information</div>
          <div class="info-grid">
            <span class="info-label">Student Name:</span>
            <span class="info-value">${record.childName}</span>
            <span class="info-label">Class:</span>
            <span class="info-value">${record.childClass}</span>
            <span class="info-label">Parent Name:</span>
            <span class="info-value">${record.parentName}</span>
            <span class="info-label">Email:</span>
            <span class="info-value">${record.parentEmail}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Fee Details</div>
          <div class="info-grid">
            <span class="info-label">Fee Type:</span>
            <span class="info-value">${record.feeType}</span>
            <span class="info-label">Term:</span>
            <span class="info-value">${record.term}</span>
            <span class="info-label">Academic Year:</span>
            <span class="info-value">${record.academicYear}</span>
            <span class="info-label">Due Date:</span>
            <span class="info-value">${new Date(record.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span class="info-label">Status:</span>
            <span class="info-value"><span class="status ${record.status}">${record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Payment Summary</div>
          <div class="summary-box">
            <div class="summary-row">
              <span>Total Amount</span>
              <span>${money(record.amount)}</span>
            </div>
            <div class="summary-row">
              <span>Amount Paid</span>
              <span class="amount-paid">${money(record.paidAmount)}</span>
            </div>
            <div class="summary-row">
              <span>Outstanding Balance</span>
              <span class="${record.balance > 0 ? 'amount-due' : 'amount-paid'}">${money(record.balance)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-generated statement. For any queries, please contact the school administration.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  const handleRecordPayment = (record: AdminFeeRecord) => {
    setSelectedRecord(record);
    setIsRecordPaymentModalOpen(true);
  };

  const handlePaymentRecorded = (paymentData: PaymentData) => {
    if (!selectedRecord) return;

    // Calculate total deduction including discount
    const totalDeduction = paymentData.amount + (paymentData.discount || 0);
    const newPaidAmount = selectedRecord.paidAmount + totalDeduction;
    const newBalance = Math.max(0, selectedRecord.amount - newPaidAmount);
    const newStatus = newBalance <= 0 ? "paid" : newPaidAmount > 0 ? "partial" : selectedRecord.status;

    // Update in state
    setFeeRecords((prev) =>
      prev.map((record) =>
        record.id === selectedRecord.id
          ? {
              ...record,
              paidAmount: newPaidAmount,
              balance: newBalance,
              status: newStatus,
              paymentHistory: [
                ...record.paymentHistory,
                {
                  id: `payment-${Date.now()}`,
                  amount: paymentData.amount,
                  date: paymentData.paymentDate,
                  method: paymentData.paymentMethod as "Bank Transfer" | "Card" | "Cash" | "USSD" | "POS",
                  reference: paymentData.referenceNumber || `REF-${Date.now()}`,
                  receiptNumber: `RCP-${Date.now().toString().slice(-8)}`,
                  ...(paymentData.discount > 0 && {
                    discount: paymentData.discount,
                    discountType: paymentData.discountType,
                  }),
                },
              ],
            }
          : record
      )
    );

    const discountMessage = paymentData.discount > 0
      ? ` (with ${money(paymentData.discount)} discount)`
      : "";
    addNotification({
      type: "success",
      title: "Payment Recorded",
      message: `${money(paymentData.amount)} payment recorded for ${selectedRecord.childName}${discountMessage}.`,
    });

    setIsRecordPaymentModalOpen(false);
    setSelectedRecord(null);
  };

  const handleSendMessage = (record: AdminFeeRecord) => {
    router.push(`/parents/chat/compose?parentId=${record.parentId}&from=admin`);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset displayedCount when view mode changes
  useEffect(() => {
    if (isMounted) {
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      previousCountRef.current = initialCount;
    }
  }, [viewMode, isMounted]);

  useEffect(() => {
    if (displayedCount > previousCountRef.current && gridRef.current) {
      const cards = gridRef.current.children;
      const firstNewCardIndex = previousCountRef.current;

      if (cards[firstNewCardIndex]) {
        setTimeout(() => {
          (cards[firstNewCardIndex] as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }

      previousCountRef.current = displayedCount;
    }
  }, [displayedCount]);

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

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  };

  // Apply sorting
  const sortedRecords = [...feeRecords].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        return a.parentName.localeCompare(b.parentName);
      case "descending":
        return b.parentName.localeCompare(a.parentName);
      case "highest_balance":
        return b.balance - a.balance;
      case "lowest_balance":
        return a.balance - b.balance;
      case "due_date_asc":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "due_date_desc":
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      default:
        return 0;
    }
  });

  // Apply filters
  const filteredRecords = sortedRecords.filter((record) => {
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters && !dateRange) return true;

    // Status filter
    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => s.toLowerCase() === record.status);

    // Fee type filter
    const matchesFeeType =
      !filters.feeType ||
      filters.feeType.length === 0 ||
      filters.feeType.includes(record.feeType);

    // Term filter
    const matchesTerm =
      !filters.term ||
      filters.term.length === 0 ||
      filters.term.includes(record.term);

    // Balance range filter
    const matchesBalanceRange =
      !filters.balanceRange ||
      filters.balanceRange.length === 0 ||
      filters.balanceRange.some((range) => {
        if (range === "Fully Paid") return record.balance === 0;
        if (range === "Under 50K") return record.balance > 0 && record.balance < 50000;
        if (range === "50K - 100K") return record.balance >= 50000 && record.balance <= 100000;
        if (range === "Over 100K") return record.balance > 100000;
        return false;
      });

    // Date range filter (based on due date)
    let matchesDateRange = true;
    if (dateRange) {
      const dueDate = new Date(record.dueDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      matchesDateRange = dueDate >= startDate && dueDate <= endDate;
    }

    return matchesStatus && matchesFeeType && matchesTerm && matchesBalanceRange && matchesDateRange;
  });

  const displayedRecords = filteredRecords.slice(0, displayedCount);
  const hasMore = displayedCount < filteredRecords.length;

  // Export handlers (must be after filteredRecords is defined)
  const handlePrint = () => {
    // Generate printable HTML for fee records
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Parent Fee Records - ${settings.schoolName || "School"}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #1f2937; }
          .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #3b82f6; }
          .header h1 { font-size: 22px; color: #3b82f6; margin-bottom: 5px; }
          .header p { font-size: 12px; color: #6b7280; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
          .stat-card { background: #f9fafb; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
          .stat-card .label { font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
          .stat-card .value { font-size: 18px; font-weight: 700; color: #1f2937; }
          .stat-card .value.green { color: #10b981; }
          .stat-card .value.red { color: #ef4444; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background: #3b82f6; color: white; padding: 10px 8px; text-align: left; font-weight: 600; }
          td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
          tr:nth-child(even) { background: #f9fafb; }
          .status { padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; }
          .status.paid { background: #d1fae5; color: #065f46; }
          .status.pending { background: #fef3c7; color: #92400e; }
          .status.overdue { background: #fee2e2; color: #991b1b; }
          .status.partial { background: #dbeafe; color: #1e40af; }
          .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #9ca3af; padding-top: 15px; border-top: 1px solid #e5e7eb; }
          @media print { body { padding: 10px; } .stats { grid-template-columns: repeat(4, 1fr); } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Parent Fee Records</h1>
          <p>${settings.schoolName || "School"} | Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="label">Total Fees</div>
            <div class="value">NGN ${stats.totalFees.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="label">Collected</div>
            <div class="value green">NGN ${stats.totalCollected.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="label">Outstanding</div>
            <div class="value red">NGN ${stats.totalOutstanding.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Records</div>
            <div class="value">${filteredRecords.length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Parent</th>
              <th>Student</th>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map(record => `
              <tr>
                <td>${record.parentName}</td>
                <td>${record.childName}</td>
                <td>${record.feeType}</td>
                <td>NGN ${record.amount.toLocaleString()}</td>
                <td>NGN ${record.paidAmount.toLocaleString()}</td>
                <td>NGN ${record.balance.toLocaleString()}</td>
                <td>${new Date(record.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td><span class="status ${record.status.toLowerCase()}">${record.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. | Total Records: ${filteredRecords.length}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header with blue background
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 35, "F");

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Parent Fee Records", 14, 15);

    // School name and date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(settings.schoolName || "School", 14, 22);
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, 14, 28);

    // Summary statistics box
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 40, pageWidth - 28, 20, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Summary Statistics", 18, 47);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Total Records: ${filteredRecords.length}`, 18, 53);
    doc.text(`Total Fees: NGN ${stats.totalFees.toLocaleString()}`, 70, 53);
    doc.text(`Collected: NGN ${stats.totalCollected.toLocaleString()}`, 140, 53);
    doc.text(`Outstanding: NGN ${stats.totalOutstanding.toLocaleString()}`, 210, 53);

    // Table data
    const tableData = filteredRecords.map(record => [
      record.parentName,
      record.childName,
      record.feeType,
      `NGN ${record.amount.toLocaleString()}`,
      `NGN ${record.paidAmount.toLocaleString()}`,
      `NGN ${record.balance.toLocaleString()}`,
      new Date(record.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      record.status,
    ]);

    autoTable(doc, {
      head: [["Parent", "Student", "Fee Type", "Amount", "Paid", "Balance", "Due Date", "Status"]],
      body: tableData,
      startY: 65,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 28, halign: "right" },
        4: { cellWidth: 28, halign: "right" },
        5: { cellWidth: 28, halign: "right" },
        6: { cellWidth: 25 },
        7: { cellWidth: 20, halign: "center" },
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // Page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`Fee_Records_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleExportExcel = () => {
    // Build worksheet data
    const worksheetData: (string | number)[][] = [];

    // Title
    worksheetData.push(["PARENT FEE RECORDS"]);
    worksheetData.push([settings.schoolName || "School"]);
    worksheetData.push([`Generated on: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`]);
    worksheetData.push([]);

    // Summary
    worksheetData.push(["SUMMARY STATISTICS"]);
    worksheetData.push(["Total Records:", filteredRecords.length, "", "Total Fees:", stats.totalFees]);
    worksheetData.push(["Collected:", stats.totalCollected, "", "Outstanding:", stats.totalOutstanding]);
    worksheetData.push([]);
    worksheetData.push([]);

    // Header row
    worksheetData.push(["Parent Name", "Parent Email", "Student Name", "Class", "Fee Type", "Term", "Amount", "Paid", "Balance", "Due Date", "Status"]);

    // Data rows
    filteredRecords.forEach(record => {
      worksheetData.push([
        record.parentName,
        record.parentEmail,
        record.childName,
        record.childClass,
        record.feeType,
        record.term,
        record.amount,
        record.paidAmount,
        record.balance,
        new Date(record.dueDate).toLocaleDateString("en-GB"),
        record.status,
      ]);
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 }, // Parent Name
      { wch: 30 }, // Parent Email
      { wch: 20 }, // Student Name
      { wch: 12 }, // Class
      { wch: 15 }, // Fee Type
      { wch: 15 }, // Term
      { wch: 12 }, // Amount
      { wch: 12 }, // Paid
      { wch: 12 }, // Balance
      { wch: 12 }, // Due Date
      { wch: 10 }, // Status
    ];

    // Create workbook and add sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fee Records");

    // Download
    XLSX.writeFile(workbook, `Fee_Records_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView;

  // Get status badge
  const getStatusBadge = (status: AdminFeeRecord["status"]) => {
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
  const columns: ColumnConfig<AdminFeeRecord>[] = [
    {
      key: "checkbox",
      label: "",
      className: "w-12",
      render: (record) => (
        <input
          type="checkbox"
          checked={selectedIds.has(record.id)}
          onChange={(e) => {
            const newSelectedIds = new Set(selectedIds);
            if (e.target.checked) {
              newSelectedIds.add(record.id);
            } else {
              newSelectedIds.delete(record.id);
            }
            setSelectedIds(newSelectedIds);
          }}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
    },
    {
      key: "parent",
      label: "Parent",
      sortable: true,
      className: "min-w-[140px]",
      render: (record) => (
        <Tooltip content={`${record.parentName}\n${record.parentEmail}`}>
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.parentId}`}
                alt={record.parentName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {record.parentName}
            </p>
          </div>
        </Tooltip>
      ),
    },
    {
      key: "child",
      label: "Student",
      sortable: true,
      className: "min-w-[120px]",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            <Image
              src={`https://i.pravatar.cc/150?u=${record.childId}`}
              alt={record.childName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {record.childName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {record.childClass}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "feeType",
      label: "Fee Type",
      sortable: true,
      className: "min-w-[90px]",
      render: (record) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{record.feeType}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {record.term} - {record.academicYear}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      className: "min-w-[80px]",
      render: (record) => (
        <span className="font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
          {money(record.amount)}
        </span>
      ),
    },
    {
      key: "paidAmount",
      label: "Paid",
      sortable: true,
      className: "min-w-[70px]",
      render: (record) => (
        <span className="font-medium text-green-600 dark:text-green-400 text-sm whitespace-nowrap">
          {money(record.paidAmount)}
        </span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: true,
      className: "min-w-[80px]",
      render: (record) => (
        <span
          className={`font-semibold text-sm whitespace-nowrap ${
            record.balance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
          }`}
        >
          {money(record.balance)}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      className: "min-w-[75px]",
      render: (record) => (
        <span className="text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap">
          {new Date(record.dueDate).toLocaleDateString("en-GB", {
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
      className: "min-w-[80px]",
      render: (record) => getStatusBadge(record.status),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[140px] pr-3",
      render: (record) => (
        <div className="flex items-center justify-end gap-0.5">
          <Tooltip content="View Details">
            <button
              type="button"
              onClick={() => handleViewDetails(record)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </Tooltip>
          {record.paymentHistory.length > 0 && (
            <Tooltip content="View Receipt">
              <button
                type="button"
                onClick={() => handleViewReceipt(record)}
                className="p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </Tooltip>
          )}
          <Tooltip content={reminderCounts[record.id] > 0 ? `Send Reminder (${reminderCounts[record.id]} sent)` : "Send Reminder"}>
            <button
              type="button"
              onClick={() => handleSendReminder(record)}
              className="relative p-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </button>
          </Tooltip>
          {reminderCounts[record.id] > 0 && (
            <Tooltip content={`View Reminder History (${reminderCounts[record.id]} sent)`}>
              <button
                type="button"
                onClick={() => handleViewReminderHistory(record)}
                className="relative p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
              >
                <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[12px] h-3 px-0.5 flex items-center justify-center text-[8px] font-bold bg-purple-500 text-white rounded-full">
                  {reminderCounts[record.id] > 9 ? "9+" : reminderCounts[record.id]}
                </span>
              </button>
            </Tooltip>
          )}
          <FeeActionsDropdown
            hasPayments={record.paymentHistory.length > 0}
            onEdit={() => handleEditRecord(record)}
            onDelete={() => handleDeleteRecord(record)}
            onDownload={() => handleDownloadStatement(record)}
            onPrint={() => handlePrintStatement(record)}
            onMessage={() => handleSendMessage(record)}
            onViewHistory={() => handleViewReceipt(record)}
            onRecordPayment={() => handleRecordPayment(record)}
            onAutoReminder={() => handleAutoReminder(record)}
          />
        </div>
      ),
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Fee Records" />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title="Parent Fee Records"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: "Parents", href: "/admin/parents" },
              { label: "Fee Records", isActive: true },
            ]}
          />

          <PageActions
            addButtonLabel="Add Fee Record"
            exportDescription="Download fee records"
            onAdd={handleAddFee}
            onRefresh={handleRefresh}
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
          <StatCard
            icon={Banknote}
            label="Total Fees"
            value={money(stats.totalFees)}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Collected"
            value={money(stats.totalCollected)}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Outstanding"
            value={money(stats.totalOutstanding)}
            color={stats.totalOutstanding > 0 ? "red" : "green"}
          />
          <StatCard
            icon={TrendingUp}
            label="Collection Rate"
            value={`${stats.collectionRate}%`}
            color={stats.collectionRate >= 80 ? "green" : stats.collectionRate >= 50 ? "amber" : "red"}
            badge={stats.overdueCount > 0 ? `${stats.overdueCount} Overdue` : undefined}
          />
        </div>

        {/* Filters Bar */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
            <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
              <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />
              <FilterButton fields={filterFields} onFilterChange={handleFilterChange} resetKey={resetKey} />

              {selectedIds.size > 0 && (
                <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
              )}

              <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {filteredRecords.length} records
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 lg:flex-1">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <SortButton
                options={sortOptions}
                defaultOption="highest_balance"
                onSortChange={handleSortChange}
                resetKey={resetKey}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out"
          style={{ overflow: "visible" }}
        >
          <div className="relative min-h-[400px]" style={{ overflow: "visible" }}>
            {viewMode === "list" ? (
              <div
                key={`list-view-${isFiltering ? "filtering" : "filtered"}-${sortOption}`}
                className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]"
              >
                {isLoading ? (
                  <PageSpinner
                    message={
                      isSwitchingView
                        ? "Switching view..."
                        : isRefreshing
                        ? "Refreshing..."
                        : isSorting
                        ? "Sorting..."
                        : "Filtering..."
                    }
                    size="md"
                  />
                ) : filteredRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                      </div>
                      <div className="relative z-10 flex items-center justify-center w-16 h-16">
                        <Receipt className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No fee records found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hasActiveFilters
                        ? "No results match the current filters. Try adjusting your filters."
                        : "No fee records available"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    ref={tableWrapRef}
                    key={`fees-table-${filterKey}`}
                    className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden"
                  >
                    <DataTable
                      data={filteredRecords}
                      columns={columns}
                      getRowKey={(record) => record.id}
                      emptyMessage="No fee records found"
                      title=""
                      showSearch={false}
                      defaultItemsPerPage={15}
                      itemsPerPageOptions={[10, 15, 25, 50]}
                      enablePagination={true}
                      enableItemsPerPage={true}
                      stickyColumnCount={0}
                      disableHorizontalScroll={true}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                key={`grid-view-${isFiltering ? "filtering" : "filtered"}-${sortOption}`}
                className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]"
                style={{ overflow: "visible" }}
              >
                {isLoading ? (
                  <PageSpinner
                    message={
                      isSwitchingView
                        ? "Switching view..."
                        : isRefreshing
                        ? "Refreshing..."
                        : isSorting
                        ? "Sorting..."
                        : "Filtering..."
                    }
                    size="md"
                  />
                ) : displayedRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                      </div>
                      <div className="relative z-10 flex items-center justify-center w-16 h-16">
                        <Receipt className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No fee records found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hasActiveFilters
                        ? "No results match the current filters. Try adjusting your filters."
                        : "No fee records available"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      ref={gridRef}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2 pr-2 md:pr-0"
                      style={{ overflow: "visible" }}
                    >
                      {displayedRecords.map((record, index) => (
                        <div
                          key={record.id}
                          style={{
                            transition: "opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                            transitionDelay: `${index / 40}s`,
                          }}
                        >
                          <FeeRecordCard
                            record={record}
                            money={money}
                            getStatusBadge={getStatusBadge}
                            reminderCount={reminderCounts[record.id] || 0}
                            onViewDetails={handleViewDetails}
                            onViewReceipt={handleViewReceipt}
                            onSendReminder={handleSendReminder}
                            onViewReminderHistory={handleViewReminderHistory}
                            onAutoReminder={handleAutoReminder}
                            onEdit={handleEditRecord}
                            onDelete={handleDeleteRecord}
                            onDownload={handleDownloadStatement}
                            onPrint={handlePrintStatement}
                            onMessage={handleSendMessage}
                            onRecordPayment={handleRecordPayment}
                          />
                        </div>
                      ))}
                    </div>

                    {hasMore && (
                      <LoadMoreButton
                        onClick={handleLoadMore}
                        isLoading={isLoadingMore}
                        text="Load More"
                        loadingText="Loading..."
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bulk Delete Modal */}
        {/* Bulk Delete Modal */}
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={handleCloseBulkDeleteModal}
          onConfirm={handleConfirmBulkDelete}
          items={itemsToDelete}
          onRemoveItem={handleRemoveFromDeleteList}
          onRestoreItem={handleRestoreItem}
          onRestoreAll={handleRestoreAll}
          title="Delete Fee Records"
          warningMessage="This will permanently remove these fee records. This action cannot be undone."
          confirmButtonText="Delete Records"
        />

        {/* Fee Detail Modal */}
        <FeeDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord as FeeDetailRecord}
          money={money}
        />

        {/* Payment History Modal */}
        {selectedRecord && (
          <PaymentHistoryModal
            isOpen={isPaymentHistoryModalOpen}
            onClose={() => {
              setIsPaymentHistoryModalOpen(false);
              setSelectedRecord(null);
            }}
            payments={selectedRecord.paymentHistory}
            studentName={selectedRecord.childName}
            studentId={selectedRecord.childId}
            feeType={selectedRecord.feeType}
            term={selectedRecord.term}
            totalAmount={selectedRecord.amount}
            paidAmount={selectedRecord.paidAmount}
            money={money}
          />
        )}

        {/* Send Reminder Modal */}
        {selectedRecord && (
          <SendFeeReminderModal
            isOpen={isReminderModalOpen}
            onClose={() => {
              setIsReminderModalOpen(false);
              setSelectedRecord(null);
            }}
            parentName={selectedRecord.parentName}
            parentEmail={selectedRecord.parentEmail}
            parentPhone={selectedRecord.parentPhone}
            parentId={selectedRecord.parentId}
            childName={selectedRecord.childName}
            childId={selectedRecord.childId}
            feeRecordId={selectedRecord.id}
            feeType={selectedRecord.feeType}
            amount={selectedRecord.amount}
            balance={selectedRecord.balance}
            dueDate={selectedRecord.dueDate}
            money={money}
            onSend={(data) => {
              // Save the reminder to our mock data store
              const reminderMessages: Record<string, { subject?: string; message: string; attachmentCount?: number }> = {};
              data.channels.forEach(channel => {
                const msg = data.messages[channel];
                reminderMessages[channel] = {
                  subject: msg?.subject,
                  message: msg?.message || "",
                  attachmentCount: msg?.attachments?.length || 0,
                };
              });

              addFeeReminder({
                feeRecordId: data.feeRecordId,
                parentId: data.parentId,
                parentName: selectedRecord.parentName,
                parentEmail: selectedRecord.parentEmail,
                parentPhone: selectedRecord.parentPhone,
                childId: data.childId,
                childName: selectedRecord.childName,
                feeType: selectedRecord.feeType,
                amount: selectedRecord.amount,
                balance: selectedRecord.balance,
                channels: data.channels as ReminderChannel[],
                status: data.scheduleDate ? "scheduled" : "sent",
                sentAt: new Date().toISOString(),
                scheduledFor: data.scheduleDate && data.scheduleTime
                  ? `${data.scheduleDate}T${data.scheduleTime}`
                  : undefined,
                messages: reminderMessages,
                sentBy: "Admin",
              });

              // Update reminder counts by forcing a re-render
              setReminderCounts(prev => ({
                ...prev,
                [selectedRecord.id]: (prev[selectedRecord.id] || 0) + 1,
              }));
            }}
          />
        )}

        {/* Reminder History Modal */}
        {selectedRecord && (
          <FeeReminderHistoryModal
            isOpen={isReminderHistoryModalOpen}
            onClose={() => {
              setIsReminderHistoryModalOpen(false);
              setSelectedRecord(null);
            }}
            reminders={getRemindersByFeeRecordId(selectedRecord.id)}
            feeType={selectedRecord.feeType}
            childName={selectedRecord.childName}
            balance={selectedRecord.balance}
            money={money}
          />
        )}

        {/* Auto Reminder Schedule Modal */}
        {selectedRecord && (
          <AutoReminderScheduleModal
            isOpen={isAutoReminderModalOpen}
            onClose={() => {
              setIsAutoReminderModalOpen(false);
              setSelectedRecord(null);
            }}
            parentName={selectedRecord.parentName}
            parentEmail={selectedRecord.parentEmail}
            parentPhone={selectedRecord.parentPhone}
            parentId={selectedRecord.parentId}
            childName={selectedRecord.childName}
            childId={selectedRecord.childId}
            feeRecordId={selectedRecord.id}
            feeType={selectedRecord.feeType}
            balance={selectedRecord.balance}
            dueDate={selectedRecord.dueDate}
            money={money}
            onSave={(schedule) => {
              console.log("Auto reminder schedule saved:", schedule);
              // In a real app, you would save this to your backend
            }}
          />
        )}

        {/* Record Payment Modal */}
        {selectedRecord && (
          <RecordPaymentModal
            isOpen={isRecordPaymentModalOpen}
            onClose={() => {
              setIsRecordPaymentModalOpen(false);
              setSelectedRecord(null);
            }}
            feeRecordId={selectedRecord.id}
            parentName={selectedRecord.parentName}
            parentId={selectedRecord.parentId}
            childName={selectedRecord.childName}
            childId={selectedRecord.childId}
            feeType={selectedRecord.feeType}
            amount={selectedRecord.amount}
            paidAmount={selectedRecord.paidAmount}
            balance={selectedRecord.balance}
            money={money}
            onRecordPayment={handlePaymentRecorded}
          />
        )}
      </div>
    </MainLayout>
  );
}

// Fee Record Card Component for Grid View
interface FeeRecordCardProps {
  record: AdminFeeRecord;
  money: (amount: number) => string;
  getStatusBadge: (status: AdminFeeRecord["status"]) => React.ReactNode;
  reminderCount: number;
  onViewDetails: (record: AdminFeeRecord) => void;
  onViewReceipt: (record: AdminFeeRecord) => void;
  onSendReminder: (record: AdminFeeRecord) => void;
  onViewReminderHistory: (record: AdminFeeRecord) => void;
  onAutoReminder: (record: AdminFeeRecord) => void;
  onEdit: (record: AdminFeeRecord) => void;
  onDelete: (record: AdminFeeRecord) => void;
  onDownload: (record: AdminFeeRecord) => void;
  onPrint: (record: AdminFeeRecord) => void;
  onMessage: (record: AdminFeeRecord) => void;
  onRecordPayment: (record: AdminFeeRecord) => void;
}

function FeeRecordCard({
  record,
  money,
  getStatusBadge,
  reminderCount,
  onViewDetails,
  onViewReceipt,
  onSendReminder,
  onViewReminderHistory,
  onAutoReminder,
  onEdit,
  onDelete,
  onDownload,
  onPrint,
  onMessage,
  onRecordPayment,
}: FeeRecordCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.childId}`}
                alt={record.childName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {record.childName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{record.childClass}</p>
            </div>
          </div>
          {getStatusBadge(record.status)}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Fee Type */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Fee Type</p>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{record.feeType}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{record.term} - {record.academicYear}</p>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount</p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{money(record.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Paid</p>
            <p className="font-medium text-green-600 dark:text-green-400 text-sm">{money(record.paidAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Balance</p>
            <p className={`font-semibold text-sm ${record.balance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
              {money(record.balance)}
            </p>
          </div>
        </div>

        {/* Parent Info */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Parent</p>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.parentId}`}
                alt={record.parentName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-xs truncate">{record.parentName}</p>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Due Date</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(record.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-end gap-2">
        <Tooltip content={reminderCount > 0 ? `Send Reminder (${reminderCount} sent)` : "Send Reminder"}>
          <button
            type="button"
            onClick={() => onSendReminder(record)}
            className="relative p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            {reminderCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold bg-orange-500 text-white rounded-full">
                {reminderCount > 9 ? "9+" : reminderCount}
              </span>
            )}
          </button>
        </Tooltip>
        {reminderCount > 0 && (
          <Tooltip content="View Reminder History">
            <button
              type="button"
              onClick={() => onViewReminderHistory(record)}
              className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>
          </Tooltip>
        )}
        {record.paymentHistory.length > 0 && (
          <Tooltip content="View Receipt">
            <button
              type="button"
              onClick={() => onViewReceipt(record)}
              className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          </Tooltip>
        )}
        <Tooltip content="View Details">
          <button
            type="button"
            onClick={() => onViewDetails(record)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </Tooltip>
        <FeeActionsDropdown
          hasPayments={record.paymentHistory.length > 0}
          onEdit={() => onEdit(record)}
          onDelete={() => onDelete(record)}
          onDownload={() => onDownload(record)}
          onPrint={() => onPrint(record)}
          onMessage={() => onMessage(record)}
          onViewHistory={() => onViewReceipt(record)}
          onRecordPayment={() => onRecordPayment(record)}
          onAutoReminder={() => onAutoReminder(record)}
        />
      </div>
    </div>
  );
}
