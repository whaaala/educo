"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { DataManagementPage } from "@/components/pages";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import BulkFeeReminderModal, { ChannelMessage, RecordCustomMessage } from "@/components/shared/BulkFeeReminderModal";
import Tooltip from "@/components/shared/Tooltip";
import FeeDetailModal, { FeeDetailRecord } from "@/components/shared/FeeDetailModal";
import PaymentHistoryModal from "@/components/shared/PaymentHistoryModal";
import SendFeeReminderModal from "@/components/shared/SendFeeReminderModal";
import FeeActionsDropdown from "@/components/shared/FeeActionsDropdown";
import FeeReminderHistoryModal from "@/components/shared/FeeReminderHistoryModal";
import AutoReminderScheduleModal from "@/components/shared/AutoReminderScheduleModal";
import RecordPaymentModal, { PaymentData } from "@/components/shared/RecordPaymentModal";
import { useNotifications } from "@/contexts/NotificationContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  getAllFeeRecords,
  addFeeReminder,
  getReminderCountByFeeRecordId,
  getRemindersByFeeRecordId,
  type AdminFeeRecord,
  type ReminderChannel,
} from "@/lib/mockParents";
import type { ColumnConfig, GridCardProps } from "@/types/components";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Eye,
  Send,
  History,
  FileText,
  Trash2,
} from "lucide-react";
import {
  adminParentFeeFilterFields,
  adminParentFeeSortOptions,
  filterAdminParentFees,
  sortAdminParentFees,
  searchAdminParentFees,
  getAdminParentFeeStats,
} from "./config";

export default function AdminParentFeesPage() {
  const { settings } = useSchoolSettings();
  const { addNotification } = useNotifications();
  const router = useRouter();

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

  // Currency formatter
  const currencyCode = settings.currency || "NGN";
  const { money } = useMemo(() => {
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

  // Controlled selection (so bulk actions can clear it)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Bulk reminder modal state
  const [isBulkReminderModalOpen, setIsBulkReminderModalOpen] = useState(false);
  const [recordsToRemind, setRecordsToRemind] = useState<AdminFeeRecord[]>([]);

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

  const handleBulkDelete = (ids: Set<string>) => {
    if (ids.size === 0) return;

    const selectedRecords = feeRecords.filter((record) => ids.has(record.id));
    const items: BulkDeleteItem[] = selectedRecords.map((record) => ({
      id: record.id,
      name: `${record.childName} - ${record.feeType}`,
      subtitle: `${record.parentName} | ${money(record.balance)} outstanding`,
    }));

    setItemsToDelete(items);
    setIsBulkDeleteModalOpen(true);
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
    setFeeRecords((prev) => prev.filter((r) => !itemIds.includes(r.id)));
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

  // Bulk reminder handlers
  const handleBulkReminder = (ids: Set<string>) => {
    if (ids.size === 0) return;

    const selectedRecords = feeRecords.filter((record) => ids.has(record.id));
    const recordsWithBalance = selectedRecords.filter((record) => record.balance > 0);

    if (recordsWithBalance.length === 0) {
      addNotification({
        type: "info",
        title: "No outstanding balances",
        message: "All selected records are fully paid.",
      });
      return;
    }

    setRecordsToRemind(recordsWithBalance);
    setIsBulkReminderModalOpen(true);
  };

  const handleCloseBulkReminderModal = () => {
    setIsBulkReminderModalOpen(false);
    setRecordsToRemind([]);
  };

  const handleConfirmBulkReminder = (
    recordIds: string[],
    channels: string[],
    channelMessages: Record<string, ChannelMessage>,
    customMessages: Record<string, RecordCustomMessage>
  ) => {
    // Log the data for debugging (in a real app, this would be sent to the backend)
    console.log("Sending bulk reminders:", {
      recordIds,
      channels,
      channelMessages,
      customMessages,
    });

    // Update reminder counts for all sent reminders
    setReminderCounts(prev => {
      const newCounts = { ...prev };
      recordIds.forEach(id => {
        newCounts[id] = (newCounts[id] || 0) + 1;
      });
      return newCounts;
    });

    const channelText = channels.join(", ");
    addNotification({
      type: "success",
      title: "Reminders Sent",
      message: `Successfully sent ${channelText} reminders to ${recordIds.length} ${recordIds.length === 1 ? 'parent' : 'parents'}.`,
    });

    setSelectedIds(new Set());
    setIsBulkReminderModalOpen(false);
    setRecordsToRemind([]);
  };

  const handleRemoveFromReminderList = (recordId: string) => {
    setRecordsToRemind((prev) => prev.filter((record) => record.id !== recordId));
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

  const computeExportStats = (items: AdminFeeRecord[]) => {
    const totalFees = items.reduce((acc, r) => acc + r.amount, 0);
    const totalCollected = items.reduce((acc, r) => acc + r.paidAmount, 0);
    const totalOutstanding = items.reduce((acc, r) => acc + r.balance, 0);
    return { totalFees, totalCollected, totalOutstanding };
  };

  const handlePrintList = (items: AdminFeeRecord[]) => {
    const { totalFees, totalCollected, totalOutstanding } = computeExportStats(items);
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
            <div class="value">${totalFees.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="label">Collected</div>
            <div class="value green">${totalCollected.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="label">Outstanding</div>
            <div class="value red">${totalOutstanding.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Records</div>
            <div class="value">${items.length}</div>
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
            ${items
              .map(
                (record) => `
              <tr>
                <td>${record.parentName}</td>
                <td>${record.childName}</td>
                <td>${record.feeType}</td>
                <td>${record.amount.toLocaleString()}</td>
                <td>${record.paidAmount.toLocaleString()}</td>
                <td>${record.balance.toLocaleString()}</td>
                <td>${new Date(record.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td><span class="status ${record.status.toLowerCase()}">${record.status}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. | Total Records: ${items.length}</p>
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

  const handleExportPDFList = (items: AdminFeeRecord[]) => {
    const { totalFees, totalCollected, totalOutstanding } = computeExportStats(items);
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Parent Fee Records", 14, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(settings.schoolName || "School", 14, 22);
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, 14, 28);

    doc.setTextColor(0, 0, 0);
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 40, pageWidth - 28, 20, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Summary Statistics", 18, 47);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Total Records: ${items.length}`, 18, 53);
    doc.text(`Total Fees: ${totalFees.toLocaleString()}`, 70, 53);
    doc.text(`Collected: ${totalCollected.toLocaleString()}`, 140, 53);
    doc.text(`Outstanding: ${totalOutstanding.toLocaleString()}`, 210, 53);

    const tableData = items.map((record) => [
      record.parentName,
      record.childName,
      record.feeType,
      record.amount.toLocaleString(),
      record.paidAmount.toLocaleString(),
      record.balance.toLocaleString(),
      new Date(record.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      record.status,
    ]);

    autoTable(doc, {
      head: [["Parent", "Student", "Fee Type", "Amount", "Paid", "Balance", "Due Date", "Status"]],
      body: tableData,
      startY: 65,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold", halign: "center" },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`Fee_Records_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleExportExcelList = (items: AdminFeeRecord[]) => {
    const { totalFees, totalCollected, totalOutstanding } = computeExportStats(items);
    const worksheetData: (string | number)[][] = [];

    worksheetData.push(["PARENT FEE RECORDS"]);
    worksheetData.push([settings.schoolName || "School"]);
    worksheetData.push([`Generated on: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`]);
    worksheetData.push([]);

    worksheetData.push(["SUMMARY STATISTICS"]);
    worksheetData.push(["Total Records:", items.length, "", "Total Fees:", totalFees]);
    worksheetData.push(["Collected:", totalCollected, "", "Outstanding:", totalOutstanding]);
    worksheetData.push([]);
    worksheetData.push([]);

    worksheetData.push([
      "Parent Name",
      "Parent Email",
      "Student Name",
      "Class",
      "Fee Type",
      "Term",
      "Amount",
      "Paid",
      "Balance",
      "Due Date",
      "Status",
    ]);

    items.forEach((record) => {
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

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 30 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fee Records");
    XLSX.writeFile(workbook, `Fee_Records_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const renderStatusBadge = (status: AdminFeeRecord["status"]) => {
    const config = {
      paid: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
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
        bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
        text: "text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      overdue: {
        bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
        text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Overdue",
      },
    } as const;

    const c = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  const columns: ColumnConfig<AdminFeeRecord>[] = useMemo(
    () => [
      {
        key: "parent",
        label: "Parent",
        sortable: true,
        className: "w-[20%] lg:w-[14%] overflow-visible",
        render: (record) => (
          <div className="flex items-center gap-2 overflow-visible">
            <Tooltip content={`${record.parentName}\n${record.parentEmail}`}>
              <div className="group relative flex-shrink-0">
                <div className="relative w-8 h-8 rounded-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] cursor-pointer transition-all duration-300 ease-out group-hover:scale-[2] group-hover:ring-3 group-hover:ring-blue-500 group-hover:shadow-xl group-hover:z-[9999]">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${record.parentId}`}
                    alt={record.parentName}
                    fill
                    className="object-cover rounded-full"
                    unoptimized
                  />
                </div>
              </div>
            </Tooltip>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="font-medium text-ink text-xs sm:text-sm truncate">{record.parentName}</p>
              <p className="text-[0.625rem] sm:text-xs text-muted truncate hidden sm:block">{record.parentEmail}</p>
            </div>
          </div>
        ),
      },
      {
        key: "child",
        label: "Student",
        sortable: true,
        className: "w-[10%] overflow-visible",
        hidden: { mobile: true },
        render: (record) => (
          <div className="flex items-center gap-2 overflow-visible">
            <Tooltip content={`${record.childName}\n${record.childClass}`}>
              <div className="group relative flex-shrink-0">
                <div className="relative w-8 h-8 rounded-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] cursor-pointer transition-all duration-300 ease-out group-hover:scale-[2] group-hover:ring-3 group-hover:ring-green-500 group-hover:shadow-xl group-hover:z-[9999]">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${record.childId}`}
                    alt={record.childName}
                    fill
                    className="object-cover rounded-full"
                    unoptimized
                  />
                </div>
              </div>
            </Tooltip>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="font-medium text-ink text-xs sm:text-sm truncate">{record.childName}</p>
              <p className="text-[0.625rem] sm:text-xs text-muted truncate">{record.childClass}</p>
            </div>
          </div>
        ),
      },
      {
        key: "feeType",
        label: "Fee Type",
        sortable: true,
        className: "w-[12%]",
        hidden: { mobile: true, tablet: true, desktop: false },
        render: (record) => (
          <Tooltip content={`${record.feeType}\n${record.term} - ${record.academicYear}`}>
            <div className="overflow-hidden">
              <p className="font-medium text-ink text-xs sm:text-sm truncate">{record.feeType}</p>
              <p className="text-[0.625rem] sm:text-xs text-muted whitespace-nowrap">
                {record.term} - {record.academicYear}
              </p>
            </div>
          </Tooltip>
        ),
      },
      {
        key: "amount",
        label: "Amount",
        sortable: true,
        className: "w-[15%] lg:w-[7%]",
        render: (record) => (
          <span className="font-semibold text-ink text-xs sm:text-sm whitespace-nowrap">
            {money(record.amount)}
          </span>
        ),
      },
      {
        key: "paidAmount",
        label: "Paid",
        sortable: true,
        className: "w-[7%]",
        hidden: { mobile: true, tablet: true },
        render: (record) => (
          <span className="font-medium text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
            {money(record.paidAmount)}
          </span>
        ),
      },
      {
        key: "balance",
        label: "Balance",
        sortable: true,
        className: "w-[15%] lg:w-[7%]",
        render: (record) => (
          <span
            className={`font-semibold text-xs sm:text-sm whitespace-nowrap ${
              record.balance > 0 ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" : "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
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
        className: "w-[8%]",
        hidden: { mobile: true, tablet: true },
        render: (record) => (
          <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 text-xs sm:text-sm whitespace-nowrap">
            {new Date(record.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        className: "w-[18%] lg:w-[10%]",
        render: (record) => renderStatusBadge(record.status),
      },
      {
        key: "actions",
        label: "Actions",
        className: "w-[12%] lg:w-[12%]",
        sortable: false,
        searchable: false,
        render: (record) => (
          <div className="flex items-center justify-end gap-0">
            <div className="hidden lg:flex items-center gap-0">
              <Tooltip content="View Details">
                <button
                  type="button"
                  onClick={() => handleViewDetails(record)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-muted" />
                </button>
              </Tooltip>
              {record.paymentHistory.length > 0 && (
                <Tooltip content="View Receipt">
                  <button
                    type="button"
                    onClick={() => handleViewReceipt(record)}
                    className="p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
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
                    <span className="absolute -top-0.5 -right-0.5 min-w-[12px] h-3 px-0.5 flex items-center justify-center text-[0.5rem] font-bold bg-purple-500 text-white rounded-full">
                      {reminderCounts[record.id] > 9 ? "9+" : reminderCounts[record.id]}
                    </span>
                  </button>
                </Tooltip>
              )}
            </div>
            <FeeActionsDropdown
              hasPayments={record.paymentHistory.length > 0}
              hasReminders={reminderCounts[record.id] > 0}
              onViewDetails={() => handleViewDetails(record)}
              onEdit={() => handleEditRecord(record)}
              onDelete={() => handleDeleteRecord(record)}
              onDownload={() => handleDownloadStatement(record)}
              onPrint={() => handlePrintStatement(record)}
              onMessage={() => handleSendMessage(record)}
              onViewHistory={() => handleViewReceipt(record)}
              onRecordPayment={() => handleRecordPayment(record)}
              onAutoReminder={() => handleAutoReminder(record)}
              onSendReminder={() => handleSendReminder(record)}
              onViewReminderHistory={() => handleViewReminderHistory(record)}
            />
          </div>
        ),
      },
    ],
    [money, reminderCounts, router]
  );

  const FeeRecordGridCard = useMemo(() => {
    return function FeeRecordGridCardInner({
      item,
      isSelected,
      onSelectionChange,
    }: GridCardProps<AdminFeeRecord>) {
      return (
        <FeeRecordCard
          record={item}
          money={money}
          getStatusBadge={renderStatusBadge}
          reminderCount={reminderCounts[item.id] || 0}
          isSelected={isSelected}
          onSelectionChange={(id, selected) => {
            // id is provided for compatibility with existing card API
            void id;
            onSelectionChange(selected);
          }}
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
      );
    };
  }, [money, reminderCounts]);

  return (
    <DataManagementPage<AdminFeeRecord>
      title="Parent Fee Records"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin" },
        { label: "Parents", href: "/admin/parents" },
        { label: "Fee Records", isActive: true },
      ]}
      data={feeRecords}
      getRowKey={(record) => record.id}
      columns={columns}
      stats={getAdminParentFeeStats(money)}
      filterFields={adminParentFeeFilterFields}
      filterFn={filterAdminParentFees}
      sortOptions={adminParentFeeSortOptions}
      sortFn={sortAdminParentFees}
      defaultSort="highest_balance"
      searchFn={searchAdminParentFees}
      searchPlaceholder="Search fee records..."
      enableDateRange
      getDateForRange={(record) => record.dueDate}
      enableViewToggle
      gridCardComponent={FeeRecordGridCard}
      gridColumns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      enableSelection
      controlledSelection={{ selectedIds, onChange: setSelectedIds }}
      selectionColumnHidden={{ mobile: true }}
      bulkActions={[
        {
          id: "remind",
          label: "Send Reminders",
          icon: Send,
          variant: "warning",
          onClick: handleBulkReminder,
        },
        {
          id: "delete",
          label: "Delete Records",
          icon: Trash2,
          variant: "danger",
          onClick: handleBulkDelete,
        },
      ]}
      addButtonConfig={{
        label: "Add Fee Record",
        href: "/admin/parents/fees/add",
      }}
      enableExport
      exportConfig={{ filename: "fee-records" }}
      onPrint={handlePrintList}
      onExportPDF={handleExportPDFList}
      onExportExcel={handleExportExcelList}
      itemLabel="record"
      itemLabelPlural="records"
      emptyStateConfig={{
        title: "No fee records found",
        description: "Try adjusting your filters, search, or date range.",
        actionLabel: "Add Fee Record",
        actionHref: "/admin/parents/fees/add",
      }}
    >
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

      <BulkFeeReminderModal
        isOpen={isBulkReminderModalOpen}
        onClose={handleCloseBulkReminderModal}
        onConfirm={handleConfirmBulkReminder}
        records={recordsToRemind.map((record) => ({
          id: record.id,
          parentId: record.parentId,
          parentName: record.parentName,
          parentEmail: record.parentEmail,
          parentPhone: record.parentPhone,
          childId: record.childId,
          childName: record.childName,
          childClass: record.childClass,
          feeType: record.feeType,
          amount: record.amount,
          balance: record.balance,
          dueDate: record.dueDate,
        }))}
        onRemoveRecord={handleRemoveFromReminderList}
        money={money}
        title="Send Bulk Reminders"
      />

      <FeeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord as FeeDetailRecord}
        money={money}
      />

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
            const reminderMessages: Record<string, { subject?: string; message: string; attachmentCount?: number }> = {};
            data.channels.forEach((channel) => {
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
              scheduledFor: data.scheduleDate && data.scheduleTime ? `${data.scheduleDate}T${data.scheduleTime}` : undefined,
              messages: reminderMessages,
              sentBy: "Admin",
            });

            setReminderCounts((prev) => ({
              ...prev,
              [selectedRecord.id]: (prev[selectedRecord.id] || 0) + 1,
            }));
          }}
        />
      )}

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
          }}
        />
      )}

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
    </DataManagementPage>
  );
}

// Fee Record Card Component for Grid View
interface FeeRecordCardProps {
  record: AdminFeeRecord;
  money: (amount: number) => string;
  getStatusBadge: (status: AdminFeeRecord["status"]) => React.ReactNode;
  reminderCount: number;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
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
  isSelected = false,
  onSelectionChange,
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
    <div className={`bg-surface rounded-xl border ${isSelected ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20' : 'border-line'} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Selection Checkbox */}
            {onSelectionChange && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectionChange(record.id, e.target.checked)}
                className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.childId}`}
                alt={record.childName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ink text-sm truncate">
                {record.childName}
              </p>
              <p className="text-xs text-muted">{record.childClass}</p>
            </div>
          </div>
          {getStatusBadge(record.status)}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Fee Type */}
        <div>
          <p className="text-xs text-muted mb-0.5">Fee Type</p>
          <p className="font-medium text-ink text-sm">{record.feeType}</p>
          <p className="text-xs text-muted">{record.term} - {record.academicYear}</p>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-muted mb-0.5">Amount</p>
            <p className="font-semibold text-ink text-sm">{money(record.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Paid</p>
            <p className="font-medium text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 text-sm">{money(record.paidAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Balance</p>
            <p className={`font-semibold text-sm ${record.balance > 0 ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" : "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"}`}>
              {money(record.balance)}
            </p>
          </div>
        </div>

        {/* Parent Info */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <p className="text-xs text-muted mb-1">Parent</p>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.parentId}`}
                alt={record.parentName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-ink text-xs truncate">{record.parentName}</p>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Due Date</span>
          <span className="font-medium text-ink">
            {new Date(record.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 flex items-center justify-end gap-2">
        <Tooltip content={reminderCount > 0 ? `Send Reminder (${reminderCount} sent)` : "Send Reminder"}>
          <button
            type="button"
            onClick={() => onSendReminder(record)}
            className="relative p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            {reminderCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[0.625rem] font-bold bg-orange-500 text-white rounded-full">
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
              <History className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
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
              <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </Tooltip>
        )}
        <Tooltip content="View Details">
          <button
            type="button"
            onClick={() => onViewDetails(record)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
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
