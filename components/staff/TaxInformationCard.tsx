"use client";

import { FileText, Receipt, Percent } from "lucide-react";

interface TaxInformationCardProps {
  taxableIncome: number;
  incomeTax: number;
  pension: number;
  nhf: number; // National Housing Fund
  currency?: string;
}

export default function TaxInformationCard({
  taxableIncome,
  incomeTax,
  pension,
  nhf,
  currency = "₦",
}: TaxInformationCardProps) {
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString()}`;
  };

  const taxItems = [
    {
      label: "Income Tax (PAYE)",
      amount: incomeTax,
      icon: Receipt,
      color: "purple",
    },
    {
      label: "Pension (8%)",
      amount: pension,
      icon: FileText,
      color: "blue",
    },
    {
      label: "NHF (2.5%)",
      amount: nhf,
      icon: Percent,
      color: "green",
    },
  ];

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1 flex items-center gap-2">
        <Receipt className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
        Tax & Deductions
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-3"></div>

      <div className="space-y-2">
        {/* Taxable Income */}
        <div className="p-2 rounded-lg bg-gradient-to-br from-gray-50/60 to-gray-100/40 dark:from-gray-800/30 dark:to-gray-800/15 midnight:from-gray-900/30 midnight:to-gray-900/15 purple:from-gray-900/30 purple:to-gray-900/15 border border-gray-200/20 dark:border-gray-700/20 midnight:border-cyan-500/10 purple:border-pink-500/10">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">
            Taxable Income
          </p>
          <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
            {formatCurrency(taxableIncome)}
          </p>
        </div>

        {/* Tax Items */}
        {taxItems.map((item, index) => {
          const Icon = item.icon;
          const colorClasses = {
            purple: {
              bg: "from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/20 midnight:from-purple-900/40 midnight:to-purple-900/20 purple:from-pink-900/40 purple:to-pink-900/20",
              icon: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
              hover: "hover:from-purple-50 hover:to-purple-100/60 dark:hover:from-purple-900/30 dark:hover:to-purple-900/20 midnight:hover:from-purple-900/30 midnight:hover:to-purple-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-purple-300/50 dark:hover:border-purple-600/50 midnight:hover:border-purple-500/30 purple:hover:border-pink-500/30 hover:shadow-purple-500/10",
            },
            blue: {
              bg: "from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/20 midnight:from-blue-900/40 midnight:to-blue-900/20 purple:from-blue-900/40 purple:to-blue-900/20",
              icon: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-blue-400",
              hover: "hover:from-blue-50 hover:to-blue-100/60 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 midnight:hover:from-cyan-900/30 midnight:hover:to-cyan-900/20 purple:hover:from-blue-900/30 purple:hover:to-blue-900/20 hover:border-blue-300/50 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/30 purple:hover:border-blue-500/30 hover:shadow-blue-500/10",
            },
            green: {
              bg: "from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-900/20 midnight:from-green-900/40 midnight:to-green-900/20 purple:from-green-900/40 purple:to-green-900/20",
              icon: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
              hover: "hover:from-green-50 hover:to-green-100/60 dark:hover:from-green-900/30 dark:hover:to-green-900/20 midnight:hover:from-green-900/30 midnight:hover:to-green-900/20 purple:hover:from-green-900/30 purple:hover:to-green-900/20 hover:border-green-300/50 dark:hover:border-green-600/50 midnight:hover:border-green-500/30 purple:hover:border-green-500/30 hover:shadow-green-500/10",
            },
          }[item.color as "purple" | "blue" | "green"];

          return (
            <div
              key={index}
              className={`flex items-center justify-between gap-2 p-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 ${colorClasses.hover} shadow-sm hover:shadow-md transition-all duration-300 group/item`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${colorClasses.bg} flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/item:scale-110`}>
                  <Icon className={`w-3 h-3 ${colorClasses.icon} transition-transform duration-300 group-hover/item:scale-110`} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate">
                  {item.label}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                {formatCurrency(item.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
