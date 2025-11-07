"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface FeeRecord {
  id: string;
  feesGroup: string;
  feesCode: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Partial";
  refId: string;
  mode: string;
  datePaid: string;
  discount: string;
  fine: number;
}

interface FeesTableProps {
  records?: FeeRecord[];
}

const MOCK_RECORDS: FeeRecord[] = [
  {
    id: "1",
    feesGroup: "Class 1 General\n(Dec month Fees)",
    feesCode: "dec-month-fees",
    dueDate: "10 Jan 2024",
    amount: 2500,
    status: "Paid",
    refId: "#435443",
    mode: "Cash",
    datePaid: "05 Jan 2024",
    discount: "10%",
    fine: 0,
  },
  {
    id: "2",
    feesGroup: "Class 1 General\n(Jan month Fees)",
    feesCode: "jan-month-fees",
    dueDate: "10 Feb 2024",
    amount: 2000,
    status: "Paid",
    refId: "#435443",
    mode: "Cash",
    datePaid: "01 Feb 2024",
    discount: "10%",
    fine: 200,
  },
  {
    id: "3",
    feesGroup: "Class 1 General\n(Jul month Fees)",
    feesCode: "jul-month-fees",
    dueDate: "10 Aug 2024",
    amount: 2500,
    status: "Paid",
    refId: "#435449",
    mode: "Cash",
    datePaid: "01 Aug 2024",
    discount: "10%",
    fine: 200,
  },
  {
    id: "4",
    feesGroup: "Class 1 General\n(Mar month fees)",
    feesCode: "mar-month-fees",
    dueDate: "10 Apr 2024",
    amount: 2500,
    status: "Paid",
    refId: "#435453",
    mode: "Cash",
    datePaid: "03 Apr 2024",
    discount: "10%",
    fine: 0,
  },
  {
    id: "5",
    feesGroup: "Class 1 General\n(Apr month Fees)",
    feesCode: "apr-month-fees",
    dueDate: "10 May 2024",
    amount: 2500,
    status: "Paid",
    refId: "#435453",
    mode: "Cash",
    datePaid: "03 Apr 2024",
    discount: "10%",
    fine: 0,
  },
  {
    id: "6",
    feesGroup: "Class 1 General\n(Jun month Fees)",
    feesCode: "jun-month-fees",
    dueDate: "10 Jul 2024",
    amount: 2500,
    status: "Paid",
    refId: "#435450",
    mode: "Cash",
    datePaid: "05 Jul 2024",
    discount: "10%",
    fine: 200,
  },
  {
    id: "7",
    feesGroup: "Class 1 General\n(May month Fees)",
    feesCode: "may-month-fees",
    dueDate: "10 Jun 2024",
    amount: 2500,
    status: "Paid",
    refId: "#435451",
    mode: "Cash",
    datePaid: "02 Jun 2024",
    discount: "10%",
    fine: 200,
  },
  {
    id: "8",
    feesGroup: "Class 1 General\n(Admission Fees)",
    feesCode: "admission-fees",
    dueDate: "25 Mar 2024",
    amount: 2000,
    status: "Paid",
    refId: "#435454",
    mode: "Cash",
    datePaid: "25 Jan 2024",
    discount: "10%",
    fine: 200,
  },
];

export default function FeesTable({ records = MOCK_RECORDS }: FeesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("2024");

  // Calculate totals
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
  const totalDiscount = 200; // Based on mock data
  const totalFine = records.reduce((sum, record) => sum + record.fine, 0);

  const getStatusBadge = (status: FeeRecord["status"]) => {
    const variants = {
      Paid: "bg-green-100 dark:bg-green-950/30 midnight:bg-green-950/30 purple:bg-green-950/30 text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300",
      Unpaid: "bg-red-100 dark:bg-red-950/30 midnight:bg-red-950/30 purple:bg-red-950/30 text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300",
      Partial: "bg-amber-100 dark:bg-amber-950/30 midnight:bg-amber-950/30 purple:bg-amber-950/30 text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${variants[status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === "Paid" ? "bg-green-500" : status === "Unpaid" ? "bg-red-500" : "bg-amber-500"}`}></span>
        {status}
      </span>
    );
  };

  const filteredRecords = records.filter((record) =>
    record.feesGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.feesCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
          Fees
        </h3>

        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024">Year : 2024 / 2025</option>
            <option value="2023">Year : 2023 / 2024</option>
            <option value="2022">Year : 2022 / 2023</option>
          </select>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            Row Per Page
          </span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            Entries
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Fees Group
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Fees Code
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Due Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Amount $
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Ref ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Mode
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Date Paid
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Discount ($)
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Fine ($)
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Totals Row */}
            <tr className="bg-blue-900 dark:bg-blue-950 midnight:bg-blue-950 purple:bg-purple-950 text-white">
              <td colSpan={3} className="py-3 px-4"></td>
              <td className="py-3 px-4 text-sm font-bold">{totalAmount}</td>
              <td colSpan={4} className="py-3 px-4"></td>
              <td className="py-3 px-4 text-sm font-bold">{totalDiscount}</td>
              <td className="py-3 px-4 text-sm font-bold">{totalFine}</td>
            </tr>

            {/* Data Rows */}
            {paginatedRecords.map((record) => (
              <tr
                key={record.id}
                className="border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/30 purple:hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">
                      {record.feesGroup.split('\n')[0]}
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 text-xs">
                      {record.feesGroup.split('\n')[1]}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {record.feesCode}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {record.dueDate}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 font-medium">
                  {record.amount}
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(record.status)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {record.refId}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {record.mode}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {record.datePaid}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {record.discount}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {record.fine}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white text-sm font-semibold"
          >
            {currentPage}
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
