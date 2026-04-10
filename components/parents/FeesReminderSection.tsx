"use client";

import Link from "next/link";
import { ChevronRight, CreditCard, AlertTriangle, Clock } from "lucide-react";
import Button from "@/components/shared/Button";

interface FeeReminder {
  id: string;
  childName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: "due" | "overdue";
}

interface FeesReminderSectionProps {
  fees: FeeReminder[];
  currencySymbol?: string;
  formatCurrency: (amount: number) => string;
  viewAllLink?: string;
  onPayNow?: (feeId: string) => void;
}

export default function FeesReminderSection({
  fees,
  formatCurrency,
  viewAllLink = "/parents/fees",
  onPayNow,
}: FeesReminderSectionProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
            <CreditCard className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Fees Reminder
          </h3>
        </div>
        <Link
          href={viewAllLink}
          className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-1 font-medium"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Fees List */}
      <div className="p-4 space-y-3">
        {fees.length === 0 ? (
          <div className="text-center py-6">
            <CreditCard className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No pending fees</p>
          </div>
        ) : (
          fees.map((fee) => (
            <div
              key={fee.id}
              className={`p-4 rounded-xl border-2 ${
                fee.status === "overdue"
                  ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/40"
                  : "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/40"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">
                    {fee.feeType}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {fee.childName}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    fee.status === "overdue"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                  }`}
                >
                  {fee.status === "overdue" ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {fee.status === "overdue" ? "Overdue" : "Due"}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {formatCurrency(fee.amount)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Due: {formatDate(fee.dueDate)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onPayNow?.(fee.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
                >
                  Pay Now
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
