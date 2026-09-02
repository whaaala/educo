"use client";

import React from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import {
  BookOpen,
  BookMarked,
  Printer,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  RotateCcw,
  DollarSign,
  FileText,
  Hash,
} from "lucide-react";
import type { BookLoan, LoanStatus, BorrowerType } from "@/types/library";

interface LoanViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: BookLoan;
  formatCurrency: (amount: number) => string;
  onRenew?: () => void;
  onReturn?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
}

export default function LoanViewModal({
  isOpen,
  onClose,
  loan,
  formatCurrency,
  onRenew,
  onReturn,
  onPrint,
  onExport,
}: LoanViewModalProps) {
  const getStatusConfig = (status: LoanStatus) => {
    const configs = {
      active: {
        icon: BookMarked,
        label: "Active",
        bgClass: "bg-gradient-to-r from-blue-500 to-indigo-500",
        textClass: "text-white",
        shadowClass: "shadow-blue-500/30",
      },
      returned: {
        icon: CheckCircle2,
        label: "Returned",
        bgClass: "bg-gradient-to-r from-emerald-500 to-green-500",
        textClass: "text-white",
        shadowClass: "shadow-emerald-500/30",
      },
      overdue: {
        icon: AlertTriangle,
        label: "Overdue",
        bgClass: "bg-gradient-to-r from-red-500 to-rose-500",
        textClass: "text-white",
        shadowClass: "shadow-red-500/30",
      },
      lost: {
        icon: XCircle,
        label: "Lost",
        bgClass: "bg-gradient-to-r from-gray-600 to-gray-700",
        textClass: "text-white",
        shadowClass: "shadow-gray-500/30",
      },
    };
    return configs[status] || configs.active;
  };

  const getMemberTypeConfig = (type: BorrowerType) => {
    const configs = {
      student: {
        label: "Student",
        bgClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
        textClass: "text-white",
        shadowClass: "shadow-blue-500/30",
      },
      staff: {
        label: "Staff",
        bgClass: "bg-gradient-to-r from-purple-500 to-pink-500",
        textClass: "text-white",
        shadowClass: "shadow-purple-500/30",
      },
      teacher: {
        label: "Teacher",
        bgClass: "bg-gradient-to-r from-amber-500 to-orange-500",
        textClass: "text-white",
        shadowClass: "shadow-amber-500/30",
      },
    };
    return configs[type] || configs.student;
  };

  const statusConfig = getStatusConfig(loan.status);
  const memberTypeConfig = getMemberTypeConfig(loan.memberType);
  const StatusIcon = statusConfig.icon;

  // Calculate days info
  const borrowDate = new Date(loan.borrowDate);
  const dueDate = new Date(loan.dueDate);
  const today = new Date();
  const isOverdue = !loan.returnDate && today > dueDate;
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysOverdue = isOverdue ? Math.abs(daysUntilDue) : 0;

  // Generate avatar URL based on member info
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
      title={loan.bookTitle}
      subtitle={`Loan #${loan.loanNumber}`}
      icon={<BookMarked className="w-5 h-5" />}
      maxWidth="2xl"
      footer={
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="secondary" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {loan.status === "active" && loan.renewalCount < loan.maxRenewals && (
              <Button variant="secondary" onClick={onRenew}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Renew
              </Button>
            )}
            {loan.status === "active" && (
              <Button variant="primary" onClick={onReturn}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Return Book
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header with Status and Borrower */}
        <div className="flex gap-6">
          {/* Borrower Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0 shadow-2xl ring-4 ring-white dark:ring-gray-700">
            <Image
              src={getAvatarUrl()}
              alt={loan.memberName}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>

          {/* Borrower & Status Info */}
          <div className="flex-1 min-w-0">
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bgClass} ${statusConfig.textClass} shadow-lg ${statusConfig.shadowClass}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${memberTypeConfig.bgClass} ${memberTypeConfig.textClass} shadow-lg ${memberTypeConfig.shadowClass}`}>
                {memberTypeConfig.label}
              </span>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {daysOverdue} Days Overdue
                </span>
              )}
            </div>

            {/* Borrower Name */}
            <h3 className="text-lg font-bold text-ink mb-1">
              {loan.memberName}
            </h3>

            {/* Book ISBN */}
            <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 font-mono">
              ISBN: {loan.bookIsbn}
            </p>
          </div>
        </div>

        {/* Loan Timeline Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/80 midnight:from-gray-800/80 midnight:via-gray-800/60 midnight:to-gray-900/80 purple:from-gray-800/80 purple:via-gray-800/60 purple:to-gray-900/80 p-5 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />

          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <h4 className="text-sm font-bold text-ink">
              Loan Timeline
            </h4>
          </div>

          {/* Timeline Visual */}
          <div className="relative">
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-amber-500 to-emerald-500 dark:from-blue-400 dark:via-amber-400 dark:to-emerald-400" />

            <div className="space-y-4">
              {/* Borrow Date */}
              <div className="flex items-start gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0 z-10">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Borrowed</p>
                  <p className="text-sm font-semibold text-ink">
                    {borrowDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 z-10 ${
                  isOverdue
                    ? "bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/30"
                    : "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/30"
                }`}>
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Due Date</p>
                  <p className={`text-sm font-semibold ${isOverdue ? "text-red-600 dark:text-red-400" : "text-ink"}`}>
                    {dueDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {!loan.returnDate && !isOverdue && daysUntilDue > 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{daysUntilDue} days remaining</p>
                  )}
                </div>
              </div>

              {/* Return Date */}
              {loan.returnDate && (
                <div className="flex items-start gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0 z-10">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[0.625rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Returned</p>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {new Date(loan.returnDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Loan Number */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="flex items-center gap-2 mb-1.5">
              <Hash className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Loan #</p>
            </div>
            <p className="text-sm font-bold text-ink font-mono relative z-10">{loan.loanNumber}</p>
          </div>

          {/* Renewals */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="flex items-center gap-2 mb-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Renewals</p>
            </div>
            <p className="text-sm font-bold relative z-10">
              <span className={loan.renewalCount >= loan.maxRenewals ? "text-red-600 dark:text-red-400" : "text-ink"}>
                {loan.renewalCount}
              </span>
              <span className="text-gray-400 dark:text-gray-500"> / {loan.maxRenewals}</span>
            </p>
          </div>

          {/* Fine */}
          <div className={`group relative overflow-hidden rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 ${
            loan.fineAmount > 0
              ? loan.finePaid
                ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 midnight:from-green-900/30 midnight:to-emerald-900/30 purple:from-green-900/30 purple:to-emerald-900/30 border-green-200/60 dark:border-green-700/60 midnight:border-green-500/20 purple:border-green-500/20"
                : "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 midnight:from-red-900/30 midnight:to-rose-900/30 purple:from-red-900/30 purple:to-rose-900/30 border-red-200/60 dark:border-red-700/60 midnight:border-red-500/20 purple:border-red-500/20"
              : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20"
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <DollarSign className={`w-3.5 h-3.5 ${
                loan.fineAmount > 0
                  ? loan.finePaid ? "text-green-500" : "text-red-500"
                  : "text-gray-400 dark:text-gray-500"
              }`} />
              <p className={`text-[0.625rem] font-bold uppercase tracking-widest ${
                loan.fineAmount > 0
                  ? loan.finePaid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}>Fine</p>
            </div>
            <p className="text-sm font-bold relative z-10">
              {loan.fineAmount > 0 ? (
                <>
                  <span className={loan.finePaid ? "text-green-600 dark:text-green-400 line-through" : "text-red-600 dark:text-red-400"}>
                    {formatCurrency(loan.fineAmount)}
                  </span>
                  {loan.finePaid && (
                    <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold">
                      Paid
                    </span>
                  )}
                </>
              ) : (
                <span className="text-ink">No Fine</span>
              )}
            </p>
          </div>
        </div>

        {/* Notes */}
        {loan.notes && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 midnight:from-amber-900/20 midnight:via-yellow-900/20 midnight:to-orange-900/20 purple:from-amber-900/20 purple:via-yellow-900/20 purple:to-orange-900/20 p-5 border border-amber-200/60 dark:border-amber-700/40 midnight:border-amber-500/20 purple:border-amber-500/20 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">Notes</h4>
            </div>
            <p className="text-sm text-amber-900 dark:text-amber-200 midnight:text-amber-200 purple:text-amber-200 leading-relaxed relative z-10">
              {loan.notes}
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 border-t border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-4">
          <p className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Issued by:</span>
            {loan.issuedBy}
          </p>
          {loan.returnedTo && (
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Returned to:</span>
              {loan.returnedTo}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
