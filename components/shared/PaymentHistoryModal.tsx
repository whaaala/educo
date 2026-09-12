"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import jsPDF from "jspdf";
import {
  Receipt,
  CheckCircle2,
  Calendar,
  CreditCard,
  Hash,
  Download,
  Printer,
  Copy,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  Banknote,
  Smartphone,
  Building2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Tooltip from "./Tooltip";

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
  receiptNumber: string;
}

export interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: PaymentRecord[];
  studentName: string;
  studentId: string;
  feeType: string;
  term: string;
  totalAmount: number;
  paidAmount: number;
  money: (amount: number) => string;
  // Customization props
  title?: string;
  headerIcon?: LucideIcon;
  showStudentImage?: boolean;
  showProgressBar?: boolean;
  showDownloadButton?: boolean;
  showPrintButton?: boolean;
  paymentRecordsTitle?: string;
  emptyStateText?: string;
  emptyStateSubtext?: string;
  currencyLabel?: string;
}

export default function PaymentHistoryModal({
  isOpen,
  onClose,
  payments,
  studentName,
  studentId,
  feeType,
  term,
  totalAmount,
  paidAmount,
  money,
  // Customization props with defaults
  title = "Payment History",
  headerIcon: HeaderIcon = Receipt,
  showStudentImage = true,
  showProgressBar = true,
  showDownloadButton = true,
  showPrintButton = true,
  paymentRecordsTitle = "Payment Records",
  emptyStateText = "No payments recorded yet",
  emptyStateSubtext = "Payments will appear here once made",
  currencyLabel = "NGN",
}: PaymentHistoryModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [printingId, setPrintingId] = useState<string | null>(null);

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank transfer":
        return <Building2 className="w-3.5 h-3.5" />;
      case "card":
        return <CreditCard className="w-3.5 h-3.5" />;
      case "cash":
        return <Banknote className="w-3.5 h-3.5" />;
      case "ussd":
        return <Smartphone className="w-3.5 h-3.5" />;
      case "pos":
        return <Wallet className="w-3.5 h-3.5" />;
      default:
        return <CreditCard className="w-3.5 h-3.5" />;
    }
  };

  const getMethodStyles = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank transfer":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
          text: "text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
          border: "border-blue-200 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500",
        };
      case "card":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-700 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-700",
        };
      case "cash":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
          border: "border-green-200 dark:border-green-700",
        };
      case "ussd":
        return {
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "text-orange-700 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-700",
        };
      case "pos":
        return {
          bg: "bg-indigo-100 dark:bg-indigo-900/30",
          text: "text-indigo-700 dark:text-indigo-400",
          border: "border-indigo-200 dark:border-indigo-700",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30",
          text: "text-gray-700 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
          border: "border-line",
        };
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate receipt HTML content
  const generateReceiptHTML = (payment: PaymentRecord) => {
    const formattedDate = new Date(payment.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const balance = totalAmount - paidAmount;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Receipt - ${payment.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      max-width: 600px;
      margin: 0 auto;
      color: #1f2937;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #10b981;
    }
    .header h1 {
      font-size: 24px;
      color: #10b981;
      margin-bottom: 5px;
    }
    .header p { color: #6b7280; font-size: 14px; }
    .receipt-number {
      background: #f3f4f6;
      padding: 12px 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 25px;
    }
    .receipt-number span { color: #6b7280; font-size: 12px; }
    .receipt-number strong {
      display: block;
      font-size: 18px;
      color: #1f2937;
      margin-top: 4px;
      font-family: monospace;
    }
    .section { margin-bottom: 25px; }
    .section-title {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .info-item label {
      display: block;
      font-size: 11px;
      color: #9ca3af;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .info-item p { font-weight: 600; font-size: 14px; }
    .amount-box {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 25px;
    }
    .amount-box .label { color: #059669; font-size: 12px; margin-bottom: 5px; }
    .amount-box .value {
      font-size: 32px;
      font-weight: 700;
      color: #047857;
    }
    .summary {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .summary-row:last-child { border-bottom: none; }
    .summary-row .label { color: #6b7280; }
    .summary-row .value { font-weight: 600; }
    .summary-row.balance .value { color: #f59e0b; }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
    .status-badge {
      display: inline-block;
      background: #d1fae5;
      color: #047857;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Payment Receipt</h1>
    <p>${feeType} - ${term}</p>
  </div>

  <div class="receipt-number">
    <span>Receipt Number</span>
    <strong>${payment.receiptNumber}</strong>
  </div>

  <div class="amount-box">
    <div class="label">Amount Paid</div>
    <div class="value">${money(payment.amount)}</div>
    <div class="status-badge">Confirmed</div>
  </div>

  <div class="section">
    <div class="section-title">Student Information</div>
    <div class="info-grid">
      <div class="info-item">
        <label>Student Name</label>
        <p>${studentName}</p>
      </div>
      <div class="info-item">
        <label>Fee Type</label>
        <p>${feeType}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Payment Details</div>
    <div class="info-grid">
      <div class="info-item">
        <label>Date</label>
        <p>${formattedDate}</p>
      </div>
      <div class="info-item">
        <label>Payment Method</label>
        <p>${payment.method}</p>
      </div>
      <div class="info-item" style="grid-column: 1 / -1;">
        <label>Transaction Reference</label>
        <p style="font-family: monospace; word-break: break-all;">${payment.reference}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Payment Summary</div>
    <div class="summary">
      <div class="summary-row">
        <span class="label">Total Fee Amount</span>
        <span class="value">${money(totalAmount)}</span>
      </div>
      <div class="summary-row">
        <span class="label">Total Paid</span>
        <span class="value" style="color: #10b981;">${money(paidAmount)}</span>
      </div>
      ${balance > 0 ? `
      <div class="summary-row balance">
        <span class="label">Balance Remaining</span>
        <span class="value">${money(balance)}</span>
      </div>
      ` : `
      <div class="summary-row">
        <span class="label">Status</span>
        <span class="value" style="color: #10b981;">Fully Paid</span>
      </div>
      `}
    </div>
  </div>

  <div class="footer">
    <p>This is a computer-generated receipt.</p>
    <p>Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
  </div>
</body>
</html>`;
  };

  // Download receipt as PDF using jsPDF
  const handleDownloadReceipt = async (payment: PaymentRecord) => {
    setDownloadingId(payment.id);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      const balance = totalAmount - paidAmount;

      // PDF-safe currency formatter (jsPDF doesn't support special currency symbols like ₦)
      const formatCurrency = (amount: number) => {
        return `${currencyLabel} ${amount.toLocaleString()}`;
      };

      const formattedDate = new Date(payment.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const generatedDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      let y = 20;

      // ===== HEADER =====
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text("Payment Receipt", pageWidth / 2, y, { align: "center" });
      y += 8;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(`${feeType} - ${term}`, pageWidth / 2, y, { align: "center" });
      y += 10;

      // Green divider line
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.8);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;

      // ===== RECEIPT NUMBER BOX =====
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      doc.text("Receipt Number", pageWidth / 2, y + 6, { align: "center" });
      doc.setFontSize(13);
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      doc.text(payment.receiptNumber, pageWidth / 2, y + 13, { align: "center" });
      y += 24;

      // ===== AMOUNT PAID BOX =====
      doc.setFillColor(209, 250, 229);
      doc.roundedRect(margin, y, contentWidth, 30, 4, 4, "F");
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105);
      doc.setFont("helvetica", "normal");
      doc.text("Amount Paid", pageWidth / 2, y + 8, { align: "center" });
      doc.setFontSize(22);
      doc.setTextColor(4, 120, 87);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(payment.amount), pageWidth / 2, y + 20, { align: "center" });

      // Confirmed badge
      doc.setFillColor(167, 243, 208);
      doc.roundedRect(pageWidth / 2 - 15, y + 23, 30, 6, 2, 2, "F");
      doc.setFontSize(7);
      doc.setTextColor(4, 120, 87);
      doc.setFont("helvetica", "bold");
      doc.text("Confirmed", pageWidth / 2, y + 27, { align: "center" });
      y += 38;

      // ===== TWO COLUMN DETAILS =====
      const colWidth = (contentWidth - 8) / 2;
      const leftCol = margin;
      const rightCol = margin + colWidth + 8;
      const cardHeight = 36;
      const cardPadding = 6;

      // Student Details Card (Left)
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(leftCol, y, colWidth, cardHeight, 3, 3, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text("STUDENT DETAILS", leftCol + cardPadding, y + 8);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text("Student Name", leftCol + cardPadding, y + 16);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(studentName, leftCol + cardPadding, y + 22);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text("Fee Type", leftCol + cardPadding, y + 29);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(feeType, leftCol + cardPadding, y + 34);

      // Payment Details Card (Right)
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(rightCol, y, colWidth, cardHeight, 3, 3, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text("PAYMENT DETAILS", rightCol + cardPadding, y + 8);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text("Payment Date", rightCol + cardPadding, y + 16);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(formattedDate, rightCol + cardPadding, y + 22);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text("Payment Method", rightCol + cardPadding, y + 29);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(payment.method, rightCol + cardPadding, y + 34);

      y += cardHeight + 8;

      // ===== TRANSACTION REFERENCE =====
      doc.setFillColor(31, 41, 55);
      doc.roundedRect(margin, y, contentWidth, 16, 3, 3, "F");

      // Green accent bar on left
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(margin, y, 3, 16, 3, 0, "F");
      doc.rect(margin + 1.5, y, 1.5, 16, "F");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(156, 163, 175);
      doc.text("TRANSACTION REFERENCE", margin + 10, y + 6);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(payment.reference, margin + 10, y + 12);
      y += 22;

      // ===== FEE BREAKDOWN =====
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text("FEE BREAKDOWN", margin, y);
      y += 6;

      const numRows = balance > 0 ? 3 : 2;
      const rowHeight = 10;
      const boxHeight = numRows * rowHeight + 8;

      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, "FD");

      let rowY = y + 8;

      // Total Fee Amount
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      doc.text("Total Fee Amount", margin + 8, rowY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(formatCurrency(totalAmount), pageWidth - margin - 8, rowY, { align: "right" });
      rowY += rowHeight;

      // Dashed separator
      doc.setDrawColor(209, 213, 219);
      doc.setLineDashPattern([2, 2], 0);
      doc.setLineWidth(0.2);
      doc.line(margin + 8, rowY - 4, pageWidth - margin - 8, rowY - 4);
      doc.setLineDashPattern([], 0);

      // Amount Paid
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      doc.text("Amount Paid", margin + 8, rowY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text(formatCurrency(paidAmount), pageWidth - margin - 8, rowY, { align: "right" });
      rowY += rowHeight;

      // Balance Remaining (if any)
      if (balance > 0) {
        doc.setDrawColor(209, 213, 219);
        doc.setLineDashPattern([2, 2], 0);
        doc.setLineWidth(0.2);
        doc.line(margin + 8, rowY - 4, pageWidth - margin - 8, rowY - 4);
        doc.setLineDashPattern([], 0);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(75, 85, 99);
        doc.text("Balance Remaining", margin + 8, rowY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(239, 68, 68);
        doc.text(formatCurrency(balance), pageWidth - margin - 8, rowY, { align: "right" });
      }

      y += boxHeight + 10;

      // ===== FOOTER =====
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(margin, y, contentWidth, 16, 3, 3, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text("This is a computer-generated receipt.", pageWidth / 2, y + 6, { align: "center" });
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(`Generated on ${generatedDate}`, pageWidth / 2, y + 12, { align: "center" });

      // Save the PDF
      doc.save(`Receipt_${payment.receiptNumber}.pdf`);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }

    setTimeout(() => setDownloadingId(null), 1500);
  };

  // Print receipt
  const handlePrintReceipt = (payment: PaymentRecord) => {
    setPrintingId(payment.id);

    const receiptHTML = generateReceiptHTML(payment);
    const printWindow = window.open("", "_blank", "width=700,height=900");

    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

      // Fallback if onload doesn't fire
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    }

    setTimeout(() => setPrintingId(null), 1500);
  };

  const progressPercent =
    totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
  const balance = totalAmount - paidAmount;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`${feeType} • ${term}`}
      icon={<HeaderIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Summary Card - Subtle Design */}
        <div className="rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line p-4">
          {/* Top Section: Student Info + Amount */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              {showStudentImage && (
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] ring-2 ring-white dark:ring-gray-800 flex-shrink-0">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${studentId}`}
                    alt={studentName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">
                  {studentName}
                </p>
                <p className="text-sm text-muted">
                  {payments.length} payment{payments.length !== 1 ? "s" : ""}{" "}
                  made
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {money(paidAmount)}
              </p>
              <p className="text-xs text-muted">
                of {money(totalAmount)}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          {showProgressBar && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">
                Payment Progress
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {balance > 0 && (
              <p className="text-xs text-right text-muted">
                Balance remaining:{" "}
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  {money(balance)}
                </span>
              </p>
            )}
          </div>
          )}
        </div>

        {/* Payment Records Header */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
            <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
          </div>
          <h4 className="font-semibold text-ink text-sm">
            {paymentRecordsTitle}
          </h4>
        </div>

        {/* Payment List */}
        {payments.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-center">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-muted font-medium">
              {emptyStateText}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mt-1">
              {emptyStateSubtext}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {payments.map((payment) => {
              const methodStyles = getMethodStyles(payment.method);
              const isExpanded = expandedPayment === payment.id;
              const isDownloading = downloadingId === payment.id;
              const isPrinting = printingId === payment.id;

              return (
                <div
                  key={payment.id}
                  className="rounded-xl bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line overflow-hidden transition-all duration-200 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                  {/* Main Row - Always Visible */}
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      {/* Left: Check icon + Amount + Method */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-lg text-ink">
                            {money(payment.amount)}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${methodStyles.bg} ${methodStyles.text}`}
                          >
                            {getMethodIcon(payment.method)}
                            {payment.method}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Tooltip
                          content={
                            copiedId === `receipt-${payment.id}`
                              ? "Copied!"
                              : "Copy Receipt No."
                          }
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                payment.receiptNumber,
                                `receipt-${payment.id}`
                              )
                            }
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                          >
                            {copiedId === `receipt-${payment.id}` ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </Tooltip>
                        {showDownloadButton && (
                        <Tooltip
                          content={isDownloading ? "Downloading..." : "Download Receipt"}
                        >
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(payment)}
                            disabled={isDownloading}
                            className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isDownloading ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Download className="w-4 h-4 text-blue-500" />
                            )}
                          </button>
                        </Tooltip>
                        )}
                        {showPrintButton && (
                        <Tooltip
                          content={isPrinting ? "Opening..." : "Print Receipt"}
                        >
                          <button
                            type="button"
                            onClick={() => handlePrintReceipt(payment)}
                            disabled={isPrinting}
                            className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isPrinting ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Printer className="w-4 h-4 text-purple-500" />
                            )}
                          </button>
                        </Tooltip>
                        )}
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                      <div className="grid grid-cols-3 gap-2">
                        {/* Date */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-[0.625rem] uppercase tracking-wider text-gray-400 font-medium">
                              Date
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-ink">
                            {new Date(payment.date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        {/* Receipt No. */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Hash className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-[0.625rem] uppercase tracking-wider text-gray-400 font-medium">
                              Receipt
                            </span>
                          </div>
                          <Tooltip content={payment.receiptNumber}>
                            <p className="text-sm font-semibold text-ink font-mono truncate cursor-help">
                              {truncateText(payment.receiptNumber, 14)}
                            </p>
                          </Tooltip>
                        </div>

                        {/* Reference - with expand option */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-[0.625rem] uppercase tracking-wider text-gray-400 font-medium">
                              Reference
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tooltip content={payment.reference}>
                              <p className="text-sm font-semibold text-ink font-mono truncate cursor-help flex-1">
                                {truncateText(payment.reference, 12)}
                              </p>
                            </Tooltip>
                            {payment.reference.length > 12 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedPayment(
                                    isExpanded ? null : payment.id
                                  )
                                }
                                className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer flex-shrink-0"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Reference */}
                      {isExpanded && (
                        <div className="mt-3 p-2.5 rounded-lg bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-[0.625rem] uppercase tracking-wider text-gray-400 font-medium">
                                Full Reference
                              </span>
                              <p className="text-xs font-mono text-ink break-all mt-1">
                                {payment.reference}
                              </p>
                            </div>
                            <Tooltip
                              content={
                                copiedId === `ref-${payment.id}`
                                  ? "Copied!"
                                  : "Copy"
                              }
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    payment.reference,
                                    `ref-${payment.id}`
                                  )
                                }
                                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer flex-shrink-0"
                              >
                                {copiedId === `ref-${payment.id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
