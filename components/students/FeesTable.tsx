"use client";

import { useState } from "react";
import {
  Search,
  GraduationCap,
  FileText,
  BookOpen,
  Trophy,
  Bus,
  Users,
  Calendar,
  DollarSign
} from "lucide-react";

interface FeeRecord {
  id: string;
  feeDetails: string;
  feeCode: string;
  category: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Partial";
  paymentDate: string;
  methodOfPayment: string;
}

interface FeesTableProps {
  records?: FeeRecord[];
}

const MOCK_RECORDS: FeeRecord[] = [
  {
    id: "1",
    feeDetails: "Monthly Tuition Fee",
    feeCode: "TUI-DEC-2024",
    category: "Tuition Fees",
    amount: 2500,
    dueDate: "Dec 10, 2024",
    status: "Paid",
    paymentDate: "Dec 05, 2024",
    methodOfPayment: "Cash",
  },
  {
    id: "2",
    feeDetails: "Monthly Tuition Fee",
    feeCode: "TUI-JAN-2025",
    category: "Tuition Fees",
    amount: 2500,
    dueDate: "Jan 10, 2025",
    status: "Partial",
    paymentDate: "Jan 08, 2025",
    methodOfPayment: "Online",
  },
  {
    id: "3",
    feeDetails: "Admission Fee",
    feeCode: "ADM-2024",
    category: "Admission & Registration",
    amount: 5000,
    dueDate: "Mar 25, 2024",
    status: "Paid",
    paymentDate: "Mar 20, 2024",
    methodOfPayment: "Card",
  },
  {
    id: "4",
    feeDetails: "Library Fee",
    feeCode: "LIB-2024",
    category: "Academic Services",
    amount: 1000,
    dueDate: "Apr 15, 2024",
    status: "Paid",
    paymentDate: "Apr 10, 2024",
    methodOfPayment: "Cash",
  },
  {
    id: "5",
    feeDetails: "Computer Lab Fee",
    feeCode: "LAB-S1-2024",
    category: "Academic Services",
    amount: 1500,
    dueDate: "Jul 01, 2024",
    status: "Unpaid",
    paymentDate: "-",
    methodOfPayment: "-",
  },
  {
    id: "6",
    feeDetails: "Examination Fee",
    feeCode: "EXM-S1-2024",
    category: "Examination & Assessment",
    amount: 1200,
    dueDate: "Nov 30, 2024",
    status: "Paid",
    paymentDate: "Nov 25, 2024",
    methodOfPayment: "Online",
  },
  {
    id: "7",
    feeDetails: "Sports Fee",
    feeCode: "SPT-2024",
    category: "Sports & Activities",
    amount: 600,
    dueDate: "Aug 10, 2024",
    status: "Paid",
    paymentDate: "Aug 05, 2024",
    methodOfPayment: "Cash",
  },
  {
    id: "8",
    feeDetails: "Monthly Transport Fee",
    feeCode: "TRP-FEB-2025",
    category: "Transportation",
    amount: 800,
    dueDate: "Feb 05, 2025",
    status: "Unpaid",
    paymentDate: "-",
    methodOfPayment: "-",
  },
  {
    id: "9",
    feeDetails: "PTA Levy",
    feeCode: "PTA-2024",
    category: "PTA Fees",
    amount: 500,
    dueDate: "Apr 20, 2024",
    status: "Paid",
    paymentDate: "Apr 15, 2024",
    methodOfPayment: "Cash",
  },
];

export default function FeesTable({ records = MOCK_RECORDS }: FeesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryBadge = (category: string) => {
    const categoryConfig: Record<
      string,
      { icon: React.ReactNode; bgColor: string; textColor: string; borderColor: string }
    > = {
      "Tuition Fees": {
        icon: <GraduationCap className="w-3.5 h-3.5" />,
        bgColor: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20",
        textColor: "text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
        borderColor: "border-blue-200 dark:border-blue-800/30 midnight:border-blue-800/30 purple:border-blue-800/30",
      },
      "Admission & Registration": {
        icon: <FileText className="w-3.5 h-3.5" />,
        bgColor: "bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20",
        textColor: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
        borderColor: "border-green-200 dark:border-green-800/30 midnight:border-green-800/30 purple:border-green-800/30",
      },
      "Academic Services": {
        icon: <BookOpen className="w-3.5 h-3.5" />,
        bgColor: "bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-purple-900/20",
        textColor: "text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
        borderColor: "border-purple-200 dark:border-purple-800/30 midnight:border-purple-800/30 purple:border-purple-800/30",
      },
      "Examination & Assessment": {
        icon: <FileText className="w-3.5 h-3.5" />,
        bgColor: "bg-cyan-50 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20",
        textColor: "text-cyan-700 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400",
        borderColor: "border-cyan-200 dark:border-cyan-800/30 midnight:border-cyan-800/30 purple:border-cyan-800/30",
      },
      "Sports & Activities": {
        icon: <Trophy className="w-3.5 h-3.5" />,
        bgColor: "bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-900/20 purple:bg-orange-900/20",
        textColor: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
        borderColor: "border-orange-200 dark:border-orange-800/30 midnight:border-orange-800/30 purple:border-orange-800/30",
      },
      "Transportation": {
        icon: <Bus className="w-3.5 h-3.5" />,
        bgColor: "bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20",
        textColor: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        borderColor: "border-amber-200 dark:border-amber-800/30 midnight:border-amber-800/30 purple:border-amber-800/30",
      },
      "PTA Fees": {
        icon: <Users className="w-3.5 h-3.5" />,
        bgColor: "bg-lime-50 dark:bg-lime-900/20 midnight:bg-lime-900/20 purple:bg-lime-900/20",
        textColor: "text-lime-700 dark:text-lime-400 midnight:text-lime-400 purple:text-lime-400",
        borderColor: "border-lime-200 dark:border-lime-800/30 midnight:border-lime-800/30 purple:border-lime-800/30",
      },
    };

    const config = categoryConfig[category] || categoryConfig["Tuition Fees"];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      >
        {config.icon}
        {category}
      </span>
    );
  };

  const getStatusBadge = (status: FeeRecord["status"]) => {
    const variants = {
      Paid: {
        bg: "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
        text: "text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300",
        dot: "bg-green-500",
      },
      Unpaid: {
        bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
        text: "text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300",
        dot: "bg-red-500",
      },
      Partial: {
        bg: "bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300",
        dot: "bg-amber-500",
      },
    };

    const variant = variants[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${variant.bg} ${variant.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${variant.dot}`}></span>
        {status}
      </span>
    );
  };

  const filteredRecords = records.filter((record) =>
    record.feeDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.feeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredRecords.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-8 sm:p-12 border border-line shadow-sm text-center animate-in fade-in duration-300">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <DollarSign className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-semibold text-ink mb-2">
          No Fee Records
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          There are no fee records matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg font-bold text-ink">
          Records
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-surface text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="block lg:hidden">
        <div className="space-y-3">
          {filteredRecords.map((record, index) => (
            <div
              key={record.id}
              className="bg-surface rounded-xl p-4 border border-line shadow-sm hover:shadow-md transition-all duration-200 animate-in slide-in-from-right duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Fee Details */}
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-ink mb-1">
                  {record.feeDetails}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {record.feeCode}
                </p>
              </div>

              {/* Category */}
              <div className="mb-3">{getCategoryBadge(record.category)}</div>

              {/* Amount and Due Date */}
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">
                    Amount
                  </p>
                  <p className="font-semibold text-ink">
                    ₦{record.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">
                    Due Date
                  </p>
                  <div className="flex items-center gap-1 text-ink">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs">{record.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mb-3">{getStatusBadge(record.status)}</div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/10 purple:border-pink-500/10 text-xs">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-0.5">
                    Payment Date
                  </p>
                  <p className="text-ink font-medium">
                    {record.paymentDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-0.5">
                    Method
                  </p>
                  <p className="text-ink font-medium">
                    {record.methodOfPayment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 transition-colors duration-200">
          <div className="inline-block min-w-full align-middle">
            <div className="bg-surface rounded-xl border border-line shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-700 dark:to-gray-700/50 midnight:from-gray-800 midnight:to-gray-800/50 purple:from-gray-800 purple:to-gray-800/50">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider whitespace-nowrap">
                      Fee Details
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider whitespace-nowrap">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider whitespace-nowrap">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider whitespace-nowrap">
                      Due Date
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider whitespace-nowrap">
                      Payment Date
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider whitespace-nowrap">
                      Method of Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
                  {filteredRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all duration-200 animate-in slide-in-from-bottom duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Fee Details */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-ink">
                            {record.feeDetails}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                            {record.feeCode}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">{getCategoryBadge(record.category)}</td>

                      {/* Amount */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-ink">
                          ₦{record.amount.toLocaleString()}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-ink">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {record.dueDate}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(record.status)}</td>

                      {/* Payment Date */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-ink">
                          {record.paymentDate}
                        </span>
                      </td>

                      {/* Method of Payment */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-ink">
                          {record.methodOfPayment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
