"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import {
  AlertTriangle,
  Clock,
  BookX,
  Hammer,
  User,
  BookOpen,
  Calendar,
  Info,
  Loader2,
} from "lucide-react";
import type { BookLoan, BorrowerType } from "@/types/library";

interface IssueFineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssueFine: (loanId: string, fineAmount: number, fineType: "overdue" | "lost" | "damaged", notes?: string) => void;
  loan: BookLoan | null;
  formatCurrency: (amount: number) => string;
  currencySymbol?: string;
  finePerDay?: number;
  lostBookMultiplier?: number;
  damagedBookPercentage?: number;
  isLoading?: boolean;
}

const FINE_TYPE_OPTIONS = [
  { value: "overdue", label: "Overdue Fine" },
  { value: "lost", label: "Lost Book" },
  { value: "damaged", label: "Damaged Book" },
];

export default function IssueFineModal({
  isOpen,
  onClose,
  onIssueFine,
  loan,
  formatCurrency,
  currencySymbol = "₦",
  finePerDay = 100,
  lostBookMultiplier = 2,
  damagedBookPercentage = 50,
  isLoading = false,
}: IssueFineModalProps) {
  const [fineType, setFineType] = useState<"overdue" | "lost" | "damaged">("overdue");
  const [fineAmount, setFineAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [useAutoCalculation, setUseAutoCalculation] = useState(true);

  // Calculate days overdue
  const calculateDaysOverdue = () => {
    if (!loan) return 0;
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysOverdue = calculateDaysOverdue();

  // Auto-calculate fine based on type
  useEffect(() => {
    if (!loan || !useAutoCalculation) return;

    let calculatedFine = 0;
    const bookPrice = 5000; // Default book price for calculation (would come from book data in real app)

    switch (fineType) {
      case "overdue":
        calculatedFine = daysOverdue * finePerDay;
        break;
      case "lost":
        calculatedFine = bookPrice * lostBookMultiplier;
        break;
      case "damaged":
        calculatedFine = bookPrice * (damagedBookPercentage / 100);
        break;
    }

    setFineAmount(calculatedFine);
  }, [fineType, daysOverdue, finePerDay, lostBookMultiplier, damagedBookPercentage, loan, useAutoCalculation]);

  // Reset form when modal opens with new loan
  useEffect(() => {
    if (isOpen && loan) {
      setFineType("overdue");
      setNotes("");
      setUseAutoCalculation(true);
    }
  }, [isOpen, loan]);

  if (!loan) return null;

  const getMemberTypeConfig = (type: BorrowerType) => {
    const configs = {
      student: {
        label: "Student",
        bgClass: "bg-gradient-to-r from-purple-500 to-violet-500",
        textClass: "text-white",
      },
      staff: {
        label: "Staff",
        bgClass: "bg-gradient-to-r from-orange-500 to-amber-500",
        textClass: "text-white",
      },
      teacher: {
        label: "Teacher",
        bgClass: "bg-gradient-to-r from-cyan-500 to-blue-500",
        textClass: "text-white",
      },
    };
    return configs[type] || configs.student;
  };

  const memberTypeConfig = getMemberTypeConfig(loan.memberType);

  // Get fine type icon
  const getFineTypeIcon = (type: "overdue" | "lost" | "damaged") => {
    switch (type) {
      case "overdue":
        return <Clock className="w-4 h-4" />;
      case "lost":
        return <BookX className="w-4 h-4" />;
      case "damaged":
        return <Hammer className="w-4 h-4" />;
    }
  };

  // Get fine type config
  const getFineTypeConfig = (type: "overdue" | "lost" | "damaged") => {
    const configs = {
      overdue: {
        label: "Overdue Fine",
        description: `${currencySymbol}${finePerDay.toLocaleString()} per day`,
        bgClass: "bg-amber-100 dark:bg-amber-900/30",
        textClass: "text-amber-600 dark:text-amber-400",
        borderClass: "border-amber-200 dark:border-amber-700/30",
      },
      lost: {
        label: "Lost Book",
        description: `${lostBookMultiplier}x book price`,
        bgClass: "bg-red-100 dark:bg-red-900/30",
        textClass: "text-red-600 dark:text-red-400",
        borderClass: "border-red-200 dark:border-red-700/30",
      },
      damaged: {
        label: "Damaged Book",
        description: `${damagedBookPercentage}% of book price`,
        bgClass: "bg-orange-100 dark:bg-orange-900/30",
        textClass: "text-orange-600 dark:text-orange-400",
        borderClass: "border-orange-200 dark:border-orange-700/30",
      },
    };
    return configs[type];
  };

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

  const handleSubmit = () => {
    if (fineAmount <= 0) return;
    onIssueFine(loan.id, fineAmount, fineType, notes || undefined);
  };

  const fineTypeConfig = getFineTypeConfig(fineType);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Fine"
      subtitle="Add fine to borrowing record"
      icon={<span className="text-lg font-bold">{currencySymbol}</span>}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading || fineAmount <= 0}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span className="text-sm font-bold mr-1">{currencySymbol}</span>
                Issue Fine
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Warning Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 midnight:from-amber-900/30 midnight:via-yellow-900/30 midnight:to-orange-900/30 purple:from-amber-900/30 purple:via-yellow-900/30 purple:to-orange-900/30 p-6 border border-amber-200/60 dark:border-amber-700/40 midnight:border-amber-500/20 purple:border-amber-500/20">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-4">
            {/* Warning Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 midnight:text-amber-200 purple:text-amber-200 mb-1">
                Issue Fine
              </h3>
              <p className="text-sm text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">
                Add a fine to this borrowing record for overdue, lost, or damaged books
              </p>
            </div>
          </div>
        </div>

        {/* Book & Borrower Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Book Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
              </div>
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Book</p>
            </div>

            <h4 className="font-bold text-ink text-sm mb-1 line-clamp-2">
              {loan.bookTitle}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {loan.bookIsbn}
            </p>
          </div>

          {/* Borrower Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
              </div>
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Borrower</p>
            </div>

            <div className="flex items-center gap-3">
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

        {/* Loan Status Info */}
        {daysOverdue > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
              <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                {daysOverdue} {daysOverdue === 1 ? "day" : "days"} overdue
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Due date: {new Date(loan.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        )}

        {/* Fine Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Fine Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["overdue", "lost", "damaged"] as const).map((type) => {
              const config = getFineTypeConfig(type);
              const isSelected = fineType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setFineType(type);
                    setUseAutoCalculation(true);
                  }}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? `${config.borderClass} ${config.bgClass} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ${config.textClass.replace("text-", "ring-")}`
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-lg ${isSelected ? config.bgClass : "bg-gray-100 dark:bg-[#1a1d24]"}`}>
                      <span className={isSelected ? config.textClass : "text-gray-500 dark:text-gray-400"}>
                        {getFineTypeIcon(type)}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold ${isSelected ? config.textClass : "text-gray-700 dark:text-gray-300"}`}>
                        {config.label}
                      </p>
                      <p className="text-[0.625rem] text-gray-500 dark:text-gray-400 mt-0.5">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fine Amount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Fine Amount
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={useAutoCalculation}
                onChange={(e) => setUseAutoCalculation(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500"
              />
              Auto-calculate
            </label>
          </div>

          <div className="relative">
            <FormInput
              label=""
              icon={<span className="text-sm font-bold">{currencySymbol}</span>}
              type="number"
              value={fineAmount.toString()}
              onChange={(val) => {
                setFineAmount(Number(val));
                setUseAutoCalculation(false);
              }}
              placeholder="Enter fine amount"
            />
          </div>

          {/* Calculation breakdown */}
          {useAutoCalculation && fineType === "overdue" && daysOverdue > 0 && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-[#1a1d24]/50 text-xs text-gray-500 dark:text-gray-400">
              <Info className="w-4 h-4" />
              <span>
                {daysOverdue} days × {formatCurrency(finePerDay)} = {formatCurrency(fineAmount)}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        <FormInput
          label="Notes (Optional)"
          icon={<Calendar className="w-full h-full" />}
          type="text"
          value={notes}
          onChange={(val) => setNotes(String(val))}
          placeholder="Add any notes about this fine..."
        />

        {/* Fine Summary */}
        <div className={`p-4 rounded-xl ${fineTypeConfig.bgClass} border ${fineTypeConfig.borderClass}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20`}>
                <span className={fineTypeConfig.textClass}>
                  {getFineTypeIcon(fineType)}
                </span>
              </div>
              <div>
                <p className={`text-sm font-semibold ${fineTypeConfig.textClass}`}>
                  {fineTypeConfig.label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Loan #{loan.loanNumber}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${fineTypeConfig.textClass}`}>
                {formatCurrency(fineAmount)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Fine
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
