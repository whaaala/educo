"use client";

import { Building2, CreditCard, User } from "lucide-react";

interface BankDetailsCardProps {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function BankDetailsCard({
  bankName,
  accountNumber,
  accountName,
}: BankDetailsCardProps) {
  const bankDetails = [
    {
      label: "Bank Name",
      value: bankName,
      icon: Building2,
      color: "blue",
    },
    {
      label: "Account Number",
      value: accountNumber,
      icon: CreditCard,
      color: "purple",
    },
    {
      label: "Account Name",
      value: accountName,
      icon: User,
      color: "green",
    },
  ];

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-ink mb-1 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
        Bank Details
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 mb-3"></div>

      <div className="space-y-2">
        {/* Bank Details Items */}
        {bankDetails.map((item, index) => {
          const Icon = item.icon;
          const colorClasses = {
            blue: {
              bg: "from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/20 midnight:from-blue-900/40 midnight:to-blue-900/20 purple:from-blue-900/40 purple:to-blue-900/20",
              icon: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-blue-400",
              hover: "hover:from-blue-50 hover:to-blue-100/60 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 midnight:hover:from-cyan-900/30 midnight:hover:to-cyan-900/20 purple:hover:from-blue-900/30 purple:hover:to-blue-900/20 hover:border-blue-300/50 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/30 purple:hover:border-blue-500/30 hover:shadow-blue-500/10",
            },
            purple: {
              bg: "from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/20 midnight:from-purple-900/40 midnight:to-purple-900/20 purple:from-pink-900/40 purple:to-pink-900/20",
              icon: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
              hover: "hover:from-purple-50 hover:to-purple-100/60 dark:hover:from-purple-900/30 dark:hover:to-purple-900/20 midnight:hover:from-purple-900/30 midnight:hover:to-purple-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-purple-300/50 dark:hover:border-purple-600/50 midnight:hover:border-purple-500/30 purple:hover:border-pink-500/30 hover:shadow-purple-500/10",
            },
            green: {
              bg: "from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-900/20 midnight:from-green-900/40 midnight:to-green-900/20 purple:from-green-900/40 purple:to-green-900/20",
              icon: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
              hover: "hover:from-green-50 hover:to-green-100/60 dark:hover:from-green-900/30 dark:hover:to-green-900/20 midnight:hover:from-green-900/30 midnight:hover:to-green-900/20 purple:hover:from-green-900/30 purple:hover:to-green-900/20 hover:border-green-300/50 dark:hover:border-green-600/50 midnight:hover:border-green-500/30 purple:hover:border-green-500/30 hover:shadow-green-500/10",
            },
          }[item.color as "blue" | "purple" | "green"];

          return (
            <div
              key={index}
              className={`flex items-start gap-2 p-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 ${colorClasses.hover} shadow-sm hover:shadow-md transition-all duration-300 group/item`}
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${colorClasses.bg} flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/item:scale-110`}>
                <Icon className={`w-3 h-3 ${colorClasses.icon} transition-transform duration-300 group-hover/item:scale-110`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.625rem] font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-0.5">
                  {item.label}
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
