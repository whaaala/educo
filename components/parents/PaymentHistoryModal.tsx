"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  History,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  CreditCard,
  Building2,
  Banknote,
  Calendar,
  Receipt,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  ChevronDown,
} from "lucide-react";
import Modal from "../shared/Modal";
import SearchBar from "../shared/SearchBar";
import CustomDropdown from "../shared/CustomDropdown";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import type { PaymentReceiptData } from "./ViewReceiptModal";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: PaymentReceiptData[];
  onViewReceipt: (payment: PaymentReceiptData) => void;
}

export default function PaymentHistoryModal({
  isOpen,
  onClose,
  payments,
  onViewReceipt,
}: PaymentHistoryModalProps) {
  const { settings } = useSchoolSettings();
  const currencyCode = settings.currency || "NGN";
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const { money } = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

    return {
      money: (amount: number) => formatter.format(amount),
    };
  }, [currencyCode]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch =
        searchQuery === "" ||
        payment.feeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionRef.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "all" || payment.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, searchQuery, statusFilter, methodFilter]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const completed = payments.filter(p => p.status === "completed").length;
    return { total, count: payments.length, completed };
  }, [payments]);

  // Group payments by year
  const paymentsByYear = useMemo(() => {
    const grouped: Record<string, PaymentReceiptData[]> = {};
    filteredPayments.forEach(payment => {
      const year = new Date(payment.paymentDate).getFullYear().toString();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(payment);
    });
    return grouped;
  }, [filteredPayments]);

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Export dropdown state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close export menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportMenu]);

  // Export payments to CSV
  const handleExportCSV = () => {
    if (filteredPayments.length === 0) return;

    // CSV headers
    const headers = [
      "Receipt Number",
      "Transaction Ref",
      "Child Name",
      "Fee Type",
      "Term",
      "Academic Year",
      "Amount Paid",
      "Payment Method",
      "Payment Date",
      "Status",
    ];

    // CSV rows
    const rows = filteredPayments.map((payment) => [
      payment.receiptNumber,
      payment.transactionRef,
      payment.childName,
      payment.feeType,
      payment.term,
      payment.academicYear,
      payment.paidAmount.toString(),
      payment.paymentMethod,
      formatFullDate(payment.paymentDate),
      payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payment-history-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export payments to PDF
  const handleExportPDF = () => {
    if (filteredPayments.length === 0) return;

    // Create printable HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment History Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
          .header h1 { font-size: 24px; color: #1f2937; margin-bottom: 5px; }
          .header p { font-size: 14px; color: #6b7280; }
          .summary { display: flex; justify-content: space-between; margin-bottom: 30px; gap: 20px; }
          .summary-card { flex: 1; padding: 15px; background: #f9fafb; border-radius: 8px; text-align: center; }
          .summary-card .label { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
          .summary-card .value { font-size: 20px; font-weight: 700; color: #1f2937; }
          .summary-card.green .value { color: #059669; }
          .summary-card.blue .value { color: #2563eb; }
          .summary-card.purple .value { color: #7c3aed; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f3f4f6; padding: 12px 8px; text-align: left; font-size: 11px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e7eb; }
          td { padding: 12px 8px; font-size: 13px; border-bottom: 1px solid #e5e7eb; color: #4b5563; }
          tr:hover { background: #f9fafb; }
          .status { display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
          .status.completed { background: #d1fae5; color: #065f46; }
          .status.pending { background: #fef3c7; color: #92400e; }
          .status.failed { background: #fee2e2; color: #991b1b; }
          .status.refunded { background: #ede9fe; color: #5b21b6; }
          .amount { font-weight: 600; color: #1f2937; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
          @media print { body { padding: 20px; } .summary-card { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Payment History Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <div class="summary">
          <div class="summary-card green">
            <div class="label">Total Paid</div>
            <div class="value">${money(summaryStats.total)}</div>
          </div>
          <div class="summary-card blue">
            <div class="label">Total Payments</div>
            <div class="value">${filteredPayments.length}</div>
          </div>
          <div class="summary-card purple">
            <div class="label">Completed</div>
            <div class="value">${filteredPayments.filter(p => p.status === "completed").length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Child</th>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPayments.map(payment => `
              <tr>
                <td>${payment.receiptNumber}</td>
                <td>${payment.childName}</td>
                <td>${payment.feeType}<br><small style="color:#9ca3af">${payment.term} - ${payment.academicYear}</small></td>
                <td class="amount">${money(payment.paidAmount)}</td>
                <td>${payment.paymentMethod}</td>
                <td>${formatFullDate(payment.paymentDate)}</td>
                <td><span class="status ${payment.status}">${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>${settings.schoolName || "School"} • Payment History Report</p>
        </div>
      </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    setShowExportMenu(false);
  };

  const getStatusConfig = (status: PaymentReceiptData["status"]) => {
    const configs = {
      completed: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Paid",
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      failed: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <XCircle className="w-3 h-3" />,
        label: "Failed",
      },
      refunded: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        icon: <RotateCcw className="w-3 h-3" />,
        label: "Refunded",
      },
    };
    return configs[status];
  };

  const getMethodIcon = (method: PaymentReceiptData["paymentMethod"]) => {
    const icons = {
      "Card": <CreditCard className="w-4 h-4" />,
      "Bank Transfer": <Building2 className="w-4 h-4" />,
      "Cash": <Banknote className="w-4 h-4" />,
    };
    return icons[method];
  };

  const footer = (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredPayments.length} of {payments.length} payments
      </p>
      <div className="relative" ref={exportMenuRef}>
        <button
          type="button"
          onClick={() => setShowExportMenu(!showExportMenu)}
          disabled={filteredPayments.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#1a1d24] hover:bg-gray-200 dark:hover:bg-[#22262e] text-gray-700 dark:text-gray-300 font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export
          <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
        </button>

        {/* Export Dropdown Menu */}
        {showExportMenu && (
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-2 z-50">
            <button
              type="button"
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e] transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-600 dark:text-green-400" />
              Export as CSV
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e] transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
              Export as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment History"
      subtitle={`${summaryStats.count} payments totaling ${money(summaryStats.total)}`}
      icon={<History className="w-5 h-5 sm:w-6 sm:h-6" />}
      footer={footer}
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 midnight:from-green-950/30 midnight:to-emerald-950/30 purple:from-green-950/30 purple:to-emerald-950/30 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Total Paid</p>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">{money(summaryStats.total)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-blue-950/30 midnight:to-indigo-950/30 purple:from-blue-950/30 purple:to-indigo-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Total Payments</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{summaryStats.count}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 midnight:from-purple-950/30 midnight:to-pink-950/30 purple:from-purple-950/30 purple:to-pink-950/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Completed</p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{summaryStats.completed}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search payments..."
              size="md"
              fullWidth
            />
          </div>

          <div className="flex gap-2">
            <CustomDropdown
              value={statusFilter}
              onChange={(val) => setStatusFilter(String(val))}
              options={[
                { value: "all", label: "All Status" },
                { value: "completed", label: "Completed" },
                { value: "pending", label: "Pending" },
                { value: "failed", label: "Failed" },
                { value: "refunded", label: "Refunded" },
              ]}
              variant="blue"
            />

            <CustomDropdown
              value={methodFilter}
              onChange={(val) => setMethodFilter(String(val))}
              options={[
                { value: "all", label: "All Methods" },
                { value: "Card", label: "Card" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Cash", label: "Cash" },
              ]}
              variant="blue"
            />
          </div>
        </div>

        {/* Payment List */}
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {Object.keys(paymentsByYear).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1a1d24] flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No payments found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            Object.keys(paymentsByYear)
              .sort((a, b) => parseInt(b) - parseInt(a))
              .map((year) => (
                <div key={year}>
                  {/* Year Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">{year}</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-[#22262e]" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {paymentsByYear[year].length} payment{paymentsByYear[year].length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Payments */}
                  <div className="space-y-2">
                    {paymentsByYear[year].map((payment) => {
                      const statusConfig = getStatusConfig(payment.status);

                      return (
                        <button
                          key={payment.id}
                          type="button"
                          onClick={() => onViewReceipt(payment)}
                          className="w-full p-4 rounded-xl bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/20 purple:border-pink-700/20 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all cursor-pointer text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-[#22262e]/50 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                                {getMethodIcon(payment.paymentMethod)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                  {payment.feeType}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {payment.childName} • {formatShortDate(payment.paymentDate)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-right">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">
                                  {money(payment.paidAmount)}
                                </p>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                  {statusConfig.icon}
                                  {statusConfig.label}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </Modal>
  );
}
