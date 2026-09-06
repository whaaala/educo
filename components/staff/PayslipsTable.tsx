"use client";

import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import { Download, Eye } from "lucide-react";

export interface Payslip {
  id: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  status: "Paid" | "Pending" | "Processing";
}

const columns: ColumnConfig<Payslip>[] = [
  {
    key: "month",
    label: "Month",
    sortable: true,
    className: "text-left",
    render: (item) => (
      <div className="font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
        {item.month} {item.year}
      </div>
    ),
  },
  {
    key: "grossSalary",
    label: "Gross Salary",
    sortable: true,
    className: "text-left",
    render: (item) => (
      <div className="font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
        ₦{item.grossSalary.toLocaleString()}
      </div>
    ),
  },
  {
    key: "deductions",
    label: "Deductions",
    sortable: true,
    className: "text-left",
    render: (item) => (
      <div className="font-semibold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
        ₦{item.deductions.toLocaleString()}
      </div>
    ),
  },
  {
    key: "netSalary",
    label: "Net Salary",
    sortable: true,
    className: "text-left",
    render: (item) => (
      <div className="font-bold text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400">
        ₦{item.netSalary.toLocaleString()}
      </div>
    ),
  },
  {
    key: "paymentDate",
    label: "Payment Date",
    sortable: true,
    className: "text-left",
    render: (item) => (
      <div className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
        {item.paymentDate}
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    className: "text-center",
    render: (item) => {
      const statusStyles = {
        Paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 midnight:bg-green-900/30 midnight:text-green-400 purple:bg-green-900/30 purple:text-green-400 border-green-200 dark:border-green-800/50 midnight:border-green-800/50 purple:border-green-800/50",
        Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 midnight:bg-amber-900/30 midnight:text-amber-400 purple:bg-amber-900/30 purple:text-amber-400 border-amber-200 dark:border-amber-800/50 midnight:border-amber-800/50 purple:border-amber-800/50",
        Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 midnight:bg-blue-900/30 midnight:text-cyan-400 purple:bg-blue-900/30 purple:text-blue-400 border-blue-200 dark:border-blue-800/50 midnight:border-blue-800/50 purple:border-blue-800/50",
      };

      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusStyles[item.status as keyof typeof statusStyles]}`}>
          {item.status}
        </span>
      );
    },
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    className: "text-center",
    render: (_item) => (
      <div className="flex items-center gap-2 justify-center">
        <button className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-lg transition-colors flex items-center gap-1">
          <Eye className="w-3 h-3" />
          View
        </button>
        <button className="px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 midnight:hover:bg-green-900/20 purple:hover:bg-green-900/20 rounded-lg transition-colors flex items-center gap-1">
          <Download className="w-3 h-3" />
          PDF
        </button>
      </div>
    ),
  },
];

interface PayslipsTableProps {
  data: Payslip[];
}

export default function PayslipsTable({ data }: PayslipsTableProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20">
      <ResponsiveListTable<Payslip> variant="contained" showColumnHeaders={true}
        data={data}
        columns={columns}
        searchPlaceholder="Search payslips..."
        showSearch={true}
        defaultItemsPerPage={10}
        getRowKey={(item) => item.id}
        emptyMessage="No payslips found"
        enablePagination={true}
        enableItemsPerPage={true}
      />
    </div>
  );
}
