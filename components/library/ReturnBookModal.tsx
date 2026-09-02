"use client";

import React from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import {
  BookOpen,
  CheckCircle2,
  User,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  DollarSign,
} from "lucide-react";
import type { BookLoan, BorrowerType } from "@/types/library";

interface ReturnBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loan: BookLoan | null;
  formatCurrency: (amount: number) => string;
  isLoading?: boolean;
}

export default function ReturnBookModal({
  isOpen,
  onClose,
  onConfirm,
  loan,
  formatCurrency,
  isLoading = false,
}: ReturnBookModalProps) {
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

  // Calculate loan duration
  const borrowDate = new Date(loan.borrowDate);
  const dueDate = new Date(loan.dueDate);
  const today = new Date();
  const isOverdue = today > dueDate;
  const daysOverdue = isOverdue ? Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const loanDuration = Math.ceil((today.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));

  // Check for outstanding fine
  const hasOutstandingFine = loan.fineAmount > 0 && !loan.finePaid;

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Return Book"
      subtitle="Confirm book return"
      icon={<CheckCircle2 className="w-5 h-5" />}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Return
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Success Animation Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 midnight:from-emerald-900/30 midnight:via-green-900/30 midnight:to-teal-900/30 purple:from-emerald-900/30 purple:via-green-900/30 purple:to-teal-900/30 p-6 border border-emerald-200/60 dark:border-emerald-700/40 midnight:border-emerald-500/20 purple:border-emerald-500/20">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-4">
            {/* Animated Check Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-400 flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 midnight:text-emerald-200 purple:text-emerald-200 mb-1">
                Ready to Return
              </h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400">
                This book will be marked as returned and available for borrowing
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

        {/* Loan Duration Timeline */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-800/60 dark:to-gray-900/60 midnight:from-gray-800/60 midnight:to-gray-900/60 purple:from-gray-800/60 purple:to-gray-900/60 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center justify-between">
            {/* Borrow Date */}
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto mb-2">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Borrowed</p>
              <p className="text-xs font-semibold text-ink">
                {borrowDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </p>
            </div>

            {/* Arrow with Duration */}
            <div className="flex-1 flex items-center justify-center px-2">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 via-gray-300 to-emerald-500 dark:via-gray-600 rounded-full" />
              <div className="px-3 py-1 rounded-full bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-700 shadow-sm mx-2">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {loanDuration} days
                </p>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 via-gray-300 to-emerald-500 dark:from-gray-600 dark:via-gray-600 rounded-full" />
            </div>

            {/* Today */}
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <p className="text-[0.625rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Today</p>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {today.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </p>
            </div>
          </div>
        </div>

        {/* Overdue Warning */}
        {isOverdue && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 dark:from-red-900/30 dark:via-rose-900/30 dark:to-orange-900/30 midnight:from-red-900/30 midnight:via-rose-900/30 midnight:to-orange-900/30 purple:from-red-900/30 purple:via-rose-900/30 purple:to-orange-900/30 p-4 border border-red-200/60 dark:border-red-700/40 midnight:border-red-500/20 purple:border-red-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 midnight:bg-red-900/50 purple:bg-red-900/50 flex-shrink-0">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-red-800 dark:text-red-200 midnight:text-red-200 purple:text-red-200 text-sm mb-1">
                  Overdue by {daysOverdue} {daysOverdue === 1 ? "day" : "days"}
                </h4>
                <p className="text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                  Due date was {dueDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Outstanding Fine Warning */}
        {hasOutstandingFine && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 midnight:from-amber-900/30 midnight:via-yellow-900/30 midnight:to-orange-900/30 purple:from-amber-900/30 purple:via-yellow-900/30 purple:to-orange-900/30 p-4 border border-amber-200/60 dark:border-amber-700/40 midnight:border-amber-500/20 purple:border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 midnight:bg-amber-900/50 purple:bg-amber-900/50 flex-shrink-0">
                <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-800 dark:text-amber-200 midnight:text-amber-200 purple:text-amber-200 text-sm">
                    Outstanding Fine
                  </h4>
                  <span className="text-lg font-bold text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300">
                    {formatCurrency(loan.fineAmount)}
                  </span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 mt-1">
                  This fine must be collected before or after the book is returned
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loan Info Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <p className="font-mono">
            Loan #{loan.loanNumber}
          </p>
          <p>
            Renewals: {loan.renewalCount} / {loan.maxRenewals}
          </p>
        </div>
      </div>
    </Modal>
  );
}
