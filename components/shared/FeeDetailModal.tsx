"use client";

import Image from "next/image";
import Modal from "./Modal";
import {
  Receipt,
  User,
  GraduationCap,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Banknote,
  FileText,
  Mail,
  Phone,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode } from "react";

export interface FeeDetailRecord {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childId: string;
  childName: string;
  childClass: string;
  feeType: string;
  term: string;
  academicYear: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: "paid" | "partial" | "pending" | "overdue";
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    method: string;
    reference: string;
    receiptNumber: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Status configuration type
export interface StatusConfig {
  bg: string;
  text: string;
  icon: ReactNode;
  label: string;
}

// Custom status configurations that can be provided
export type CustomStatusConfigs = Record<string, StatusConfig>;

export interface FeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FeeDetailRecord | null;
  money: (amount: number) => string;
  // Customization props
  title?: string;
  headerIcon?: LucideIcon;
  showStudentInfo?: boolean;
  showParentInfo?: boolean;
  showPaymentHistory?: boolean;
  studentInfoTitle?: string;
  parentInfoTitle?: string;
  feeDetailsTitle?: string;
  amountSummaryTitle?: string;
  paymentsTitle?: string;
  totalLabel?: string;
  paidLabel?: string;
  balanceLabel?: string;
  customStatusConfigs?: CustomStatusConfigs;
  maxPaymentsToShow?: number;
}

// Default status configurations
const defaultStatusConfigs: Record<string, StatusConfig> = {
  paid: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: "Paid",
  },
  partial: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: <Clock className="w-4 h-4" />,
    label: "Partial",
  },
  pending: {
    bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
    text: "text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
    icon: <Clock className="w-4 h-4" />,
    label: "Pending",
  },
  overdue: {
    bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
    text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    icon: <AlertCircle className="w-4 h-4" />,
    label: "Overdue",
  },
};

export default function FeeDetailModal({
  isOpen,
  onClose,
  record,
  money,
  // Customization props with defaults
  title = "Fee Record Details",
  headerIcon: HeaderIcon = Receipt,
  showStudentInfo = true,
  showParentInfo = true,
  showPaymentHistory = true,
  studentInfoTitle = "Student Information",
  parentInfoTitle = "Parent Information",
  feeDetailsTitle = "Fee Details",
  amountSummaryTitle = "Amount Summary",
  paymentsTitle = "Recent Payments",
  totalLabel = "Total Amount",
  paidLabel = "Amount Paid",
  balanceLabel = "Balance",
  customStatusConfigs,
  maxPaymentsToShow = 3,
}: FeeDetailModalProps) {
  if (!record) return null;

  const getStatusConfig = (status: FeeDetailRecord["status"]) => {
    // Use custom configs if provided, otherwise use defaults
    const configs = customStatusConfigs || defaultStatusConfigs;
    return configs[status] || defaultStatusConfigs[status];
  };

  const statusConfig = getStatusConfig(record.status);
  const progressPercent = record.amount > 0 ? Math.round((record.paidAmount / record.amount) * 100) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`${record.feeType} - ${record.term}`}
      icon={<HeaderIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status Banner */}
        <div className={`flex items-center justify-between p-4 rounded-xl ${statusConfig.bg}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/60 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/60 ${statusConfig.text}`}>
              {statusConfig.icon}
            </div>
            <div>
              <p className={`font-semibold ${statusConfig.text}`}>{statusConfig.label}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Payment Status</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-ink">{progressPercent}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Completed</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Payment Progress</span>
            <span className="font-medium text-ink">
              {money(record.paidAmount)} / {money(record.amount)}
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100
                  ? "bg-green-500"
                  : progressPercent >= 50
                  ? "bg-blue-500"
                  : progressPercent > 0
                  ? "bg-yellow-500"
                  : "bg-gray-300"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Student & Parent Info */}
        {(showStudentInfo || showParentInfo) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Card */}
          {showStudentInfo && (
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              <h4 className="font-semibold text-ink text-sm">{studentInfoTitle}</h4>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
                <Image
                  src={`https://i.pravatar.cc/150?u=${record.childId}`}
                  alt={record.childName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="font-semibold text-ink">{record.childName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{record.childClass}</p>
              </div>
            </div>
          </div>
          )}

          {/* Parent Card */}
          {showParentInfo && (
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-ink text-sm">{parentInfoTitle}</h4>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
                <Image
                  src={`https://i.pravatar.cc/150?u=${record.parentId}`}
                  alt={record.parentName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink">{record.parentName}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{record.parentEmail}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                  <Phone className="w-3 h-3" />
                  <span>{record.parentPhone}</span>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
        )}

        {/* Fee Details */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-ink text-sm">{feeDetailsTitle}</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted mb-1">Fee Type</p>
              <p className="font-medium text-ink text-sm">{record.feeType}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Term</p>
              <p className="font-medium text-ink text-sm">{record.term}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Academic Year</p>
              <p className="font-medium text-ink text-sm">{record.academicYear}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Due Date</p>
              <p className="font-medium text-ink text-sm">
                {new Date(record.dueDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Record ID</p>
              <p className="font-medium text-ink text-sm font-mono">{record.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Last Updated</p>
              <p className="font-medium text-ink text-sm">
                {new Date(record.updatedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-4">
            <Banknote className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            <h4 className="font-semibold text-ink text-sm">{amountSummaryTitle}</h4>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/60">
              <p className="text-xs text-muted mb-1">{totalLabel}</p>
              <p className="text-lg font-bold text-ink">{money(record.amount)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/60">
              <p className="text-xs text-muted mb-1">{paidLabel}</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">{money(record.paidAmount)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/60">
              <p className="text-xs text-muted mb-1">{balanceLabel}</p>
              <p className={`text-lg font-bold ${record.balance > 0 ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" : "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"}`}>
                {money(record.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        {showPaymentHistory && record.paymentHistory.length > 0 && (
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
              <h4 className="font-semibold text-ink text-sm">{paymentsTitle}</h4>
              <span className="ml-auto text-xs text-muted">
                {record.paymentHistory.length} payment(s)
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {record.paymentHistory.slice(0, maxPaymentsToShow).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">
                        {money(payment.amount)}
                      </p>
                      <p className="text-xs text-muted">
                        {payment.method} • {new Date(payment.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{payment.receiptNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
