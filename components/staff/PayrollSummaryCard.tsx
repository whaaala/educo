"use client";

import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface PayrollSummaryCardProps {
  grossSalary: number;
  deductions: number;
  netSalary: number;
  currency?: string;
}

export default function PayrollSummaryCard({
  grossSalary,
  deductions,
  netSalary,
  currency = "₦",
}: PayrollSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString()}`;
  };

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1 flex items-center gap-2">
        <Wallet className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
        Salary Summary
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-3"></div>

      <div className="space-y-3">
        {/* Gross Salary */}
        <div className="flex items-start gap-2 p-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-green-50 hover:to-green-100/60 dark:hover:from-green-900/30 dark:hover:to-green-900/20 midnight:hover:from-green-900/30 midnight:hover:to-green-900/20 purple:hover:from-green-900/30 purple:hover:to-green-900/20 hover:border-green-300/50 dark:hover:border-green-600/50 midnight:hover:border-green-500/30 purple:hover:border-green-500/30 shadow-sm hover:shadow-md hover:shadow-green-500/10 transition-all duration-300 group/gross">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-900/20 midnight:from-green-900/40 midnight:to-green-900/20 purple:from-green-900/40 purple:to-green-900/20 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/gross:scale-110 group-hover/gross:from-green-200 group-hover/gross:to-green-300">
            <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400 transition-transform duration-300 group-hover/gross:scale-110" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-0.5">
              Gross Salary
            </p>
            <p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400 midnight:text-green-300 purple:text-green-300 leading-snug">
              {formatCurrency(grossSalary)}
            </p>
          </div>
        </div>

        {/* Deductions */}
        <div className="flex items-start gap-2 p-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-red-50 hover:to-red-100/60 dark:hover:from-red-900/30 dark:hover:to-red-900/20 midnight:hover:from-red-900/30 midnight:hover:to-red-900/20 purple:hover:from-red-900/30 purple:hover:to-red-900/20 hover:border-red-300/50 dark:hover:border-red-600/50 midnight:hover:border-red-500/30 purple:hover:border-red-500/30 shadow-sm hover:shadow-md hover:shadow-red-500/10 transition-all duration-300 group/deduct">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-900/20 midnight:from-red-900/40 midnight:to-red-900/20 purple:from-red-900/40 purple:to-red-900/20 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/deduct:scale-110 group-hover/deduct:from-red-200 group-hover/deduct:to-red-300">
            <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 transition-transform duration-300 group-hover/deduct:scale-110" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-0.5">
              Total Deductions
            </p>
            <p className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 midnight:text-red-300 purple:text-red-300 leading-snug">
              {formatCurrency(deductions)}
            </p>
          </div>
        </div>

        {/* Net Salary - Highlighted */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/20 midnight:from-cyan-900/40 midnight:to-blue-900/20 purple:from-pink-900/40 purple:to-purple-900/20 border-2 border-blue-200/60 dark:border-blue-700/40 midnight:border-cyan-600/40 purple:border-pink-600/40 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/60 dark:hover:to-cyan-900/40 midnight:hover:from-cyan-900/60 midnight:hover:to-blue-900/40 purple:hover:from-pink-900/60 purple:hover:to-purple-900/40 hover:border-blue-300/80 dark:hover:border-blue-600/60 midnight:hover:border-cyan-500/60 purple:hover:border-pink-500/60 shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group/net">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800/60 dark:to-cyan-800/40 midnight:from-cyan-800/60 midnight:to-blue-800/40 purple:from-pink-800/60 purple:to-purple-800/40 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/net:scale-110 group-hover/net:from-blue-300 group-hover/net:to-cyan-300">
            <DollarSign className="w-4 h-4 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 transition-transform duration-300 group-hover/net:scale-110" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
              Net Salary
            </p>
            <p className="text-lg sm:text-xl font-extrabold text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 leading-none">
              {formatCurrency(netSalary)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-1">
              Take-home pay this month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
