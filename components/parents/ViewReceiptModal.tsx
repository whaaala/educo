"use client";

import { useState, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import {
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  CreditCard,
  Building2,
  Banknote,
  Calendar,
  User,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import Modal from "../shared/Modal";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
export interface PaymentReceiptData {
  id: string;
  childName: string;
  childId: string;
  feeType: string;
  term: string;
  academicYear: string;
  amount: number;
  paidAmount: number;
  balance: number;
  paymentDate: string;
  paymentMethod: "Card" | "Bank Transfer" | "Cash";
  status: "completed" | "pending" | "failed" | "refunded";
  transactionRef: string;
  receiptNumber: string;
}

interface ViewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentReceiptData | null;
}

export default function ViewReceiptModal({
  isOpen,
  onClose,
  payment,
}: ViewReceiptModalProps) {
  const { settings } = useSchoolSettings();
  const currencyCode = settings.currency || "NGN";
  const [copied, setCopied] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { money } = useMemo(() => {
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

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateReceiptHTML = () => {
    if (!payment) return "";

    const statusColors = {
      completed: { bg: "#d1fae5", text: "#065f46", label: "Paid" },
      pending: { bg: "#fef3c7", text: "#92400e", label: "Pending" },
      failed: { bg: "#fee2e2", text: "#991b1b", label: "Failed" },
      refunded: { bg: "#ede9fe", text: "#5b21b6", label: "Refunded" },
    };

    const status = statusColors[payment.status];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${payment.receiptNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
          .header h1 { font-size: 24px; color: #1f2937; margin-bottom: 5px; }
          .header p { font-size: 14px; color: #6b7280; }
          .receipt-number { font-size: 12px; color: #9ca3af; margin-top: 5px; }
          .status-banner { padding: 20px; border-radius: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; background: ${status.bg}; }
          .status-left { display: flex; align-items: center; gap: 12px; }
          .status-badge { padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; color: ${status.text}; background: white; }
          .status-date { font-size: 13px; color: ${status.text}; }
          .amount-paid { text-align: right; }
          .amount-paid .label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
          .amount-paid .value { font-size: 28px; font-weight: 700; color: ${status.text}; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
          .details-card { padding: 20px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; }
          .details-card h4 { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; }
          .detail-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
          .detail-row:last-child { margin-bottom: 0; }
          .detail-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
          .detail-icon.blue { background: #dbeafe; color: #2563eb; }
          .detail-icon.purple { background: #ede9fe; color: #7c3aed; }
          .detail-icon.green { background: #d1fae5; color: #059669; }
          .detail-icon.orange { background: #ffedd5; color: #ea580c; }
          .detail-info .label { font-size: 11px; color: #6b7280; }
          .detail-info .value { font-size: 14px; font-weight: 600; color: #1f2937; }
          .fee-breakdown { background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 25px; overflow: hidden; }
          .fee-breakdown h4 { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; padding: 15px 20px; border-bottom: 1px solid #e5e7eb; }
          .fee-row { display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px dashed #e5e7eb; }
          .fee-row:last-child { border-bottom: none; }
          .fee-row .label { color: #4b5563; font-size: 14px; }
          .fee-row .value { font-weight: 600; color: #1f2937; font-size: 14px; }
          .fee-row .value.green { color: #059669; }
          .fee-row .value.red { color: #dc2626; }
          .transaction-ref { background: linear-gradient(135deg, #1f2937, #374151); border-radius: 12px; padding: 20px; margin-bottom: 25px; }
          .transaction-ref .label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
          .transaction-ref .value { font-family: 'Courier New', monospace; font-size: 16px; font-weight: 600; color: white; }
          .footer { text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .footer p { font-size: 12px; color: #6b7280; }
          .footer .school-name { font-weight: 600; color: #1f2937; }
          @media print {
            body { padding: 20px; }
            .status-banner, .details-card, .fee-breakdown, .transaction-ref { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Payment Receipt</h1>
          <p>${settings.schoolName || "School"}</p>
          <p class="receipt-number">Receipt #${payment.receiptNumber}</p>
        </div>

        <div class="status-banner">
          <div class="status-left">
            <span class="status-badge">${status.label}</span>
            <span class="status-date">${formatDate(payment.paymentDate)}</span>
          </div>
          <div class="amount-paid">
            <div class="label">Amount Paid</div>
            <div class="value">${money(payment.paidAmount)}</div>
          </div>
        </div>

        <div class="details-grid">
          <div class="details-card">
            <h4>Student Details</h4>
            <div class="detail-row">
              <div class="detail-icon blue">👤</div>
              <div class="detail-info">
                <div class="label">Student Name</div>
                <div class="value">${payment.childName}</div>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-icon purple">📄</div>
              <div class="detail-info">
                <div class="label">Student ID</div>
                <div class="value">${payment.childId}</div>
              </div>
            </div>
          </div>

          <div class="details-card">
            <h4>Payment Details</h4>
            <div class="detail-row">
              <div class="detail-icon green">💳</div>
              <div class="detail-info">
                <div class="label">Payment Method</div>
                <div class="value">${payment.paymentMethod}</div>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-icon orange">📅</div>
              <div class="detail-info">
                <div class="label">Academic Period</div>
                <div class="value">${payment.term} - ${payment.academicYear}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="fee-breakdown">
          <h4>Fee Breakdown</h4>
          <div class="fee-row">
            <span class="label">${payment.feeType}</span>
            <span class="value">${money(payment.amount)}</span>
          </div>
          <div class="fee-row">
            <span class="label">Amount Paid</span>
            <span class="value green">${money(payment.paidAmount)}</span>
          </div>
          ${payment.balance > 0 ? `
          <div class="fee-row">
            <span class="label">Remaining Balance</span>
            <span class="value red">${money(payment.balance)}</span>
          </div>
          ` : ""}
        </div>

        <div class="transaction-ref">
          <div class="label">Transaction Reference</div>
          <div class="value">${payment.transactionRef}</div>
        </div>

        <div class="footer">
          <p>This is an official receipt from <span class="school-name">${settings.schoolName || "School"}</span></p>
          <p style="margin-top: 5px;">Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleDownload = async () => {
    if (!payment) return;
    setIsDownloading(true);

    try {
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
        return `${currencyCode} ${amount.toLocaleString()}`;
      };

      // Colors
      const statusColors: Record<string, { r: number; g: number; b: number; label: string }> = {
        completed: { r: 5, g: 150, b: 105, label: "PAID" },
        pending: { r: 217, g: 119, b: 6, label: "PENDING" },
        failed: { r: 220, g: 38, b: 38, label: "FAILED" },
        refunded: { r: 124, g: 58, b: 237, label: "REFUNDED" },
      };
      const statusConfig = statusColors[payment.status] || statusColors.completed;

      // ===== HEADER =====
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text("Payment Receipt", pageWidth / 2, y, { align: "center" });
      y += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(settings.schoolName || "School", pageWidth / 2, y, { align: "center" });
      y += 5;

      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(`Receipt #${payment.receiptNumber}`, pageWidth / 2, y, { align: "center" });
      y += 8;

      // Divider line
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // ===== STATUS BANNER =====
      doc.setFillColor(statusConfig.r, statusConfig.g, statusConfig.b);
      doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");

      // Status label (left side)
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(statusConfig.label, margin + 8, y + 9);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(formatDate(payment.paymentDate), margin + 8, y + 16);

      // Amount (right side)
      doc.setFontSize(8);
      doc.text("Amount Paid", pageWidth - margin - 8, y + 7, { align: "right" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(payment.paidAmount), pageWidth - margin - 8, y + 16, { align: "right" });
      y += 28;

      // ===== TWO COLUMN DETAILS =====
      const colWidth = (contentWidth - 6) / 2;
      const leftColX = margin;
      const rightColX = margin + colWidth + 6;
      const detailsStartY = y;
      const cardHeight = 38;
      const cardPadding = 6;

      // Student Details Card (Left)
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(leftColX, detailsStartY, colWidth, cardHeight, 2, 2, "FD");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text("STUDENT DETAILS", leftColX + cardPadding, detailsStartY + 7);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text("Student Name", leftColX + cardPadding, detailsStartY + 15);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(payment.childName, leftColX + cardPadding, detailsStartY + 21);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text("Student ID", leftColX + cardPadding, detailsStartY + 29);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(payment.childId, leftColX + cardPadding, detailsStartY + 35);

      // Payment Details Card (Right)
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(rightColX, detailsStartY, colWidth, cardHeight, 2, 2, "FD");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text("PAYMENT DETAILS", rightColX + cardPadding, detailsStartY + 7);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text("Payment Method", rightColX + cardPadding, detailsStartY + 15);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(payment.paymentMethod, rightColX + cardPadding, detailsStartY + 21);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text("Academic Period", rightColX + cardPadding, detailsStartY + 29);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(`${payment.term} - ${payment.academicYear}`, rightColX + cardPadding, detailsStartY + 35);

      y = detailsStartY + cardHeight + 6;

      // ===== FEE BREAKDOWN =====
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text("FEE BREAKDOWN", margin, y);
      y += 5;

      const feeBoxPadding = 8;
      const rowHeight = 10;
      const numRows = payment.balance > 0 ? 3 : 2;
      const boxHeight = numRows * rowHeight + feeBoxPadding + 4;

      // Fee breakdown container
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, "FD");

      let rowY = y + feeBoxPadding;

      // Fee Type Row
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text(payment.feeType, margin + feeBoxPadding, rowY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(formatCurrency(payment.amount), pageWidth - margin - feeBoxPadding, rowY, { align: "right" });
      rowY += rowHeight;

      // Dashed separator
      doc.setDrawColor(209, 213, 219);
      doc.setLineDashPattern([2, 2], 0);
      doc.setLineWidth(0.2);
      doc.line(margin + feeBoxPadding, rowY - 4, pageWidth - margin - feeBoxPadding, rowY - 4);
      doc.setLineDashPattern([], 0);

      // Amount Paid Row
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text("Amount Paid", margin + feeBoxPadding, rowY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text(formatCurrency(payment.paidAmount), pageWidth - margin - feeBoxPadding, rowY, { align: "right" });
      rowY += rowHeight;

      // Remaining Balance Row
      if (payment.balance > 0) {
        doc.setDrawColor(209, 213, 219);
        doc.setLineDashPattern([2, 2], 0);
        doc.setLineWidth(0.2);
        doc.line(margin + feeBoxPadding, rowY - 4, pageWidth - margin - feeBoxPadding, rowY - 4);
        doc.setLineDashPattern([], 0);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        doc.text("Remaining Balance", margin + feeBoxPadding, rowY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(239, 68, 68);
        doc.text(formatCurrency(payment.balance), pageWidth - margin - feeBoxPadding, rowY, { align: "right" });
      }

      y += boxHeight + 6;

      // ===== TRANSACTION REFERENCE =====
      const refBoxHeight = 18;

      doc.setFillColor(31, 41, 55);
      doc.roundedRect(margin, y, contentWidth, refBoxHeight, 2, 2, "F");

      // Green accent bar
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(margin, y, 3, refBoxHeight, 2, 0, "F");
      doc.rect(margin + 1.5, y, 1.5, refBoxHeight, "F");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(156, 163, 175);
      doc.text("TRANSACTION REFERENCE", margin + 10, y + 7);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(payment.transactionRef, margin + 10, y + 14);

      y += refBoxHeight + 6;

      // ===== FOOTER =====
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      const footerText = `This is an official receipt from ${settings.schoolName || "School"}`;
      doc.text(footerText, pageWidth / 2, y + 6, { align: "center" });

      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
        pageWidth / 2,
        y + 12,
        { align: "center" }
      );

      // Save PDF
      doc.save(`Receipt-${payment.receiptNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!payment) return;

    // Generate HTML and open in new window for printing
    const htmlContent = generateReceiptHTML();
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: PaymentReceiptData["status"]) => {
    const configs = {
      completed: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: "Paid",
        ringColor: "ring-green-500/20",
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: <Clock className="w-4 h-4" />,
        label: "Pending",
        ringColor: "ring-yellow-500/20",
      },
      failed: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <XCircle className="w-4 h-4" />,
        label: "Failed",
        ringColor: "ring-red-500/20",
      },
      refunded: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        icon: <RotateCcw className="w-4 h-4" />,
        label: "Refunded",
        ringColor: "ring-purple-500/20",
      },
    };
    return configs[status];
  };

  const getMethodConfig = (method: PaymentReceiptData["paymentMethod"]) => {
    const configs = {
      "Card": {
        icon: <CreditCard className="w-4 h-4" />,
        label: "Debit/Credit Card",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900/30",
      },
      "Bank Transfer": {
        icon: <Building2 className="w-4 h-4" />,
        label: "Bank Transfer",
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
      },
      "Cash": {
        icon: <Banknote className="w-4 h-4" />,
        label: "Cash Payment",
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-100 dark:bg-green-900/30",
      },
    };
    return configs[method];
  };

  if (!payment) return null;

  const statusConfig = getStatusConfig(payment.status);
  const methodConfig = getMethodConfig(payment.paymentMethod);

  const footer = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#22262e] transition-all cursor-pointer"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print</span>
      </button>

      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 text-white font-semibold shadow-lg shadow-green-500/20 transition-all disabled:opacity-50 cursor-pointer"
      >
        {isDownloading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Receipt"
      subtitle={`Receipt #${payment.receiptNumber}`}
      icon={<Receipt className="w-5 h-5 sm:w-6 sm:h-6" />}
      footer={footer}
      maxWidth="lg"
    >
      <div ref={printRef} className="space-y-6">
        {/* Status Banner */}
        <div className={`rounded-xl p-4 ${statusConfig.bg} border border-transparent ring-1 ${statusConfig.ringColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${statusConfig.text} bg-white/50 dark:bg-black/20`}>
                {statusConfig.icon}
              </div>
              <div>
                <p className={`font-semibold ${statusConfig.text}`}>
                  Payment {statusConfig.label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formatDate(payment.paymentDate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Amount Paid</p>
              <p className={`text-2xl font-bold ${statusConfig.text}`}>
                {money(payment.paidAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Student Details */}
          <div className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/20 purple:border-pink-700/20">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Student Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Student Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {payment.childName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Student ID</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {payment.childId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/20 purple:border-pink-700/20">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Payment Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${methodConfig.bg}`}>
                  <span className={methodConfig.color}>{methodConfig.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {methodConfig.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Academic Period</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {payment.term} - {payment.academicYear}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/20 purple:border-pink-700/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-700/20 purple:border-pink-700/20">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fee Breakdown
            </h4>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">{payment.feeType}</span>
              <span className="font-medium text-gray-900 dark:text-white text-sm">{money(payment.amount)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-dashed border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Amount Paid</span>
              <span className="font-semibold text-green-600 dark:text-green-400 text-sm">{money(payment.paidAmount)}</span>
            </div>
            {payment.balance > 0 && (
              <div className="flex items-center justify-between py-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Remaining Balance</span>
                <span className="font-semibold text-red-600 dark:text-red-400 text-sm">{money(payment.balance)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Reference */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 midnight:from-gray-800 midnight:to-cyan-950/50 purple:from-gray-800 purple:to-pink-950/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Transaction Reference
              </p>
              <p className="font-mono text-white font-semibold text-sm">
                {payment.transactionRef}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(payment.transactionRef, "ref")}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              {copied === "ref" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* School Info Footer */}
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-700/20 purple:border-pink-700/20">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This is an official receipt from <span className="font-semibold">{settings.schoolName}</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            For inquiries, contact: {settings.bankAccount.accountName}
          </p>
        </div>
      </div>
    </Modal>
  );
}
