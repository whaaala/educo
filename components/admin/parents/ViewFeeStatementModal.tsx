"use client";

import { useMemo } from "react";
import { Receipt, ExternalLink, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";
import FormButton from "@/components/shared/FormButton";
import type { AdminParent } from "@/lib/mockParents";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

interface ViewFeeStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  parent: AdminParent;
}

// Mock fee records for demo
interface FeeRecord {
  id: string;
  childName: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  status: "paid" | "partial" | "pending" | "overdue";
  dueDate: string;
  term: string;
}

const generateMockFeeRecords = (parent: AdminParent): FeeRecord[] => {
  const records: FeeRecord[] = [];
  const feeTypes = ["Tuition Fee", "Bus Fee", "Uniform Fee", "Lab Fee"];
  const statuses: ("paid" | "partial" | "pending" | "overdue")[] = ["paid", "partial", "pending", "overdue"];

  parent.children.forEach((child, childIndex) => {
    feeTypes.slice(0, 2 + childIndex).forEach((feeType, feeIndex) => {
      const amount = (feeIndex + 1) * 25000 + childIndex * 10000;
      const statusIndex = (childIndex + feeIndex) % statuses.length;
      const status = statuses[statusIndex];
      const paidAmount = status === "paid" ? amount : status === "partial" ? amount * 0.6 : 0;

      records.push({
        id: `fee-${child.id}-${feeIndex}`,
        childName: `${child.firstName} ${child.lastName}`,
        feeType,
        amount,
        paidAmount,
        status,
        dueDate: new Date(Date.now() + (feeIndex - 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        term: "Term 2, 2024/2025",
      });
    });
  });

  return records;
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "paid":
      return {
        icon: CheckCircle,
        label: "Paid",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-700 dark:text-green-400",
        iconColor: "text-green-600 dark:text-green-400",
      };
    case "partial":
      return {
        icon: Clock,
        label: "Partial",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        textColor: "text-amber-700 dark:text-amber-400",
        iconColor: "text-amber-600 dark:text-amber-400",
      };
    case "pending":
      return {
        icon: Clock,
        label: "Pending",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-700 dark:text-blue-400",
        iconColor: "text-blue-600 dark:text-blue-400",
      };
    case "overdue":
      return {
        icon: AlertCircle,
        label: "Overdue",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-700 dark:text-red-400",
        iconColor: "text-red-600 dark:text-red-400",
      };
    default:
      return {
        icon: XCircle,
        label: "Unknown",
        bgColor: "bg-gray-100 dark:bg-gray-700",
        textColor: "text-gray-700 dark:text-gray-400",
        iconColor: "text-gray-600 dark:text-gray-400",
      };
  }
};

export default function ViewFeeStatementModal({
  isOpen,
  onClose,
  parent,
}: ViewFeeStatementModalProps) {
  const router = useRouter();
  const { settings } = useSchoolSettings();

  // Get currency symbol from settings
  const currencySymbol = useMemo(() => {
    const currencyCode = settings.currency || "NGN";
    try {
      const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode });
      const parts = formatter.formatToParts(0);
      return parts.find((p) => p.type === "currency")?.value || "₦";
    } catch {
      return "₦";
    }
  }, [settings.currency]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  // Generate mock fee records
  const feeRecords = useMemo(() => generateMockFeeRecords(parent), [parent]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalAmount = feeRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalPaid = feeRecords.reduce((sum, record) => sum + record.paidAmount, 0);
    const totalOutstanding = totalAmount - totalPaid;
    const paidCount = feeRecords.filter((r) => r.status === "paid").length;
    const pendingCount = feeRecords.filter((r) => r.status === "pending" || r.status === "partial").length;
    const overdueCount = feeRecords.filter((r) => r.status === "overdue").length;

    return { totalAmount, totalPaid, totalOutstanding, paidCount, pendingCount, overdueCount };
  }, [feeRecords]);

  const handleViewFullDetails = () => {
    onClose();
    router.push(`/admin/parents/${parent.id}?tab=fees`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title="Fee Statement"
      subtitle={`${parent.firstName} ${parent.lastName}`}
      icon={<Receipt className="w-5 h-5" />}
    >
      <div className="space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Total Fees</p>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{formatCurrency(summary.totalAmount)}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-800">
            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Total Paid</p>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">{formatCurrency(summary.totalPaid)}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border border-red-200 dark:border-red-800">
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Outstanding</p>
            <p className="text-lg font-bold text-red-900 dark:text-red-100">{formatCurrency(summary.totalOutstanding)}</p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{summary.paidCount} Paid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{summary.pendingCount} Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{summary.overdueCount} Overdue</span>
          </div>
        </div>

        {/* Recent Fee Records */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Fee Records</h3>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {feeRecords.slice(0, 6).map((record) => {
              const statusConfig = getStatusConfig(record.status);
              const StatusIcon = statusConfig.icon;
              const balance = record.amount - record.paidAmount;

              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg ${statusConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {record.feeType}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {record.childName} • {record.term}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(record.amount)}
                    </p>
                    {balance > 0 && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Bal: {formatCurrency(balance)}
                      </p>
                    )}
                    {balance === 0 && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        {statusConfig.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleViewFullDetails}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            View Full Details
          </button>
          <FormButton type="button" variant="secondary" onClick={onClose}>
            Close
          </FormButton>
        </div>
      </div>
    </Modal>
  );
}
