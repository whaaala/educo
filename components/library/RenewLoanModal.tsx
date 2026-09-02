"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import {
  BookOpen,
  RefreshCw,
  User,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import type { BookLoan, BorrowerType } from "@/types/library";

interface RenewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDueDate: string) => void;
  loan: BookLoan | null;
  renewalDays?: number; // Default renewal period in days
  isLoading?: boolean;
}

export default function RenewLoanModal({
  isOpen,
  onClose,
  onConfirm,
  loan,
  renewalDays = 14,
  isLoading = false,
}: RenewLoanModalProps) {
  // Calculate default new due date
  const getDefaultNewDueDate = () => {
    const currentDueDate = loan ? new Date(loan.dueDate) : new Date();
    const today = new Date();
    // Start from whichever is later: current due date or today
    const startDate = currentDueDate > today ? currentDueDate : today;
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + renewalDays);
    return newDate.toISOString().split("T")[0];
  };

  const [newDueDate, setNewDueDate] = useState(getDefaultNewDueDate());

  // Reset state when modal opens with new loan
  React.useEffect(() => {
    if (isOpen && loan) {
      setNewDueDate(getDefaultNewDueDate());
    }
  }, [isOpen, loan?.id]);

  if (!loan) return null;

  const getMemberTypeConfig = (type: BorrowerType) => {
    const configs = {
      student: {
        label: "Student",
        bgClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
        textClass: "text-white",
      },
      staff: {
        label: "Staff",
        bgClass: "bg-gradient-to-r from-purple-500 to-pink-500",
        textClass: "text-white",
      },
      teacher: {
        label: "Teacher",
        bgClass: "bg-gradient-to-r from-amber-500 to-orange-500",
        textClass: "text-white",
      },
    };
    return configs[type] || configs.student;
  };

  const memberTypeConfig = getMemberTypeConfig(loan.memberType);

  // Calculate dates
  const currentDueDate = new Date(loan.dueDate);
  const newDueDateObj = new Date(newDueDate);
  const today = new Date();
  const isOverdue = today > currentDueDate;
  const extensionDays = Math.ceil((newDueDateObj.getTime() - currentDueDate.getTime()) / (1000 * 60 * 60 * 24));

  // Check renewal eligibility
  const canRenew = loan.renewalCount < loan.maxRenewals;
  const renewalsRemaining = loan.maxRenewals - loan.renewalCount;
  const isLastRenewal = renewalsRemaining === 1;

  // Generate avatar URL
  const getAvatarUrl = () => {
    const gender = loan.memberType === "teacher" || loan.memberType === "staff"
      ? "men"
      : loan.memberId.includes("002") || loan.memberId.includes("006")
        ? "women"
        : "men";
    const index = parseInt(loan.memberId.replace("mem-", "")) % 100;
    return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
  };

  const handleConfirm = () => {
    onConfirm(newDueDate);
  };

  // Calculate min date for the date picker (today)
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Renew Loan"
      subtitle="Extend the borrowing period"
      icon={<RefreshCw className="w-5 h-5" />}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading || !canRenew}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg shadow-purple-500/25"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Confirm Renewal
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/30 dark:via-indigo-900/30 dark:to-blue-900/30 midnight:from-purple-900/30 midnight:via-indigo-900/30 midnight:to-blue-900/30 purple:from-purple-900/30 purple:via-indigo-900/30 purple:to-blue-900/30 p-6 border border-purple-200/60 dark:border-purple-700/40 midnight:border-purple-500/20 purple:border-purple-500/20">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-4">
            {/* Animated Refresh Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">{renewalsRemaining}</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 midnight:text-purple-200 purple:text-purple-200 mb-1">
                Extend Loan Period
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400">
                {renewalsRemaining} renewal{renewalsRemaining !== 1 ? "s" : ""} remaining for this loan
              </p>
            </div>
          </div>
        </div>

        {/* Book & Borrower Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Book Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
              </div>
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Book</p>
            </div>

            <h4 className="font-bold text-ink text-sm mb-1 line-clamp-2 relative z-10">
              {loan.bookTitle}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono relative z-10">
              {loan.bookIsbn}
            </p>
          </div>

          {/* Borrower Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300" />

            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
              </div>
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Borrower</p>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-md flex-shrink-0">
                <Image
                  src={getAvatarUrl()}
                  alt={loan.memberName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-ink text-sm truncate">
                  {loan.memberName}
                </h4>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.625rem] font-bold ${memberTypeConfig.bgClass} ${memberTypeConfig.textClass} shadow-sm`}>
                  {memberTypeConfig.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-800/60 dark:to-gray-900/60 midnight:from-gray-800/60 midnight:to-gray-900/60 purple:from-gray-800/60 purple:to-gray-900/60 p-5 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-sm font-bold text-ink">
              Due Date Extension
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Current Due Date */}
            <div className="text-center">
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Current Due</p>
              <div className={`p-3 rounded-xl ${isOverdue ? "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700" : "bg-gray-100 dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700"}`}>
                <p className={`text-sm font-bold ${isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                  {currentDueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
                <p className={`text-xs ${isOverdue ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                  {currentDueDate.getFullYear()}
                </p>
              </div>
              {isOverdue && (
                <p className="text-[0.625rem] text-red-600 dark:text-red-400 mt-1 font-semibold">Overdue</p>
              )}
            </div>

            {/* Arrow with Extension Days */}
            <div className="flex flex-col items-center justify-center">
              <ArrowRight className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              <div className="mt-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  +{extensionDays} days
                </p>
              </div>
            </div>

            {/* New Due Date Input */}
            <div className="text-center">
              <p className="text-[0.625rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">New Due Date</p>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                min={minDate}
                className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Renewal Progress */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Renewal Progress</p>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {loan.renewalCount} / {loan.maxRenewals}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-gray-200 dark:bg-[#22262e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(loan.renewalCount / loan.maxRenewals) * 100}%` }}
            />
          </div>

          {/* Renewal Dots */}
          <div className="flex justify-between mt-2">
            {Array.from({ length: loan.maxRenewals }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < loan.renewalCount
                    ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30"
                    : i === loan.renewalCount
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 border-2 border-purple-400 dark:border-purple-500 animate-pulse"
                      : "bg-gray-100 dark:bg-[#22262e] text-gray-400 dark:text-gray-500"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Warning Messages */}
        {isLastRenewal && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 midnight:from-amber-900/30 midnight:via-yellow-900/30 midnight:to-orange-900/30 purple:from-amber-900/30 purple:via-yellow-900/30 purple:to-orange-900/30 p-4 border border-amber-200/60 dark:border-amber-700/40 midnight:border-amber-500/20 purple:border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-200 text-sm mb-1">
                  Final Renewal
                </h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  This is the last available renewal. After this, the book must be returned on the due date.
                </p>
              </div>
            </div>
          </div>
        )}

        {isOverdue && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 dark:from-red-900/30 dark:via-rose-900/30 dark:to-orange-900/30 midnight:from-red-900/30 midnight:via-rose-900/30 midnight:to-orange-900/30 purple:from-red-900/30 purple:via-rose-900/30 purple:to-orange-900/30 p-4 border border-red-200/60 dark:border-red-700/40 midnight:border-red-500/20 purple:border-red-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 flex-shrink-0">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-red-800 dark:text-red-200 text-sm mb-1">
                  Loan is Overdue
                </h4>
                <p className="text-xs text-red-600 dark:text-red-400">
                  This loan is currently overdue. Any applicable fines will still apply. The new due date will be calculated from today.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Renewing a loan extends the due date. The borrower should be notified of the new return date.
          </p>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <p className="font-mono">
            Loan #{loan.loanNumber}
          </p>
          <p>
            Borrowed: {new Date(loan.borrowDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>
    </Modal>
  );
}
