"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface LeaveApplication {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  appliedOn: string;
  status: "Approved" | "Pending" | "Rejected";
}

interface LeaveApplicationsTableProps {
  applications?: LeaveApplication[];
}

const MOCK_APPLICATIONS: LeaveApplication[] = [
  {
    id: "1",
    leaveType: "Casual Leave",
    startDate: "07 May 2024",
    endDate: "07 may 2024",
    numberOfDays: 1,
    appliedOn: "07 May 2024",
    status: "Approved",
  },
  {
    id: "2",
    leaveType: "Casual Leave",
    startDate: "08 May 2024",
    endDate: "08 may 2024",
    numberOfDays: 1,
    appliedOn: "04 May 2024",
    status: "Approved",
  },
  {
    id: "3",
    leaveType: "Casual Leave",
    startDate: "20 May 2024",
    endDate: "20 may 2024",
    numberOfDays: 1,
    appliedOn: "19 May 2024",
    status: "Pending",
  },
  {
    id: "4",
    leaveType: "Medical Leave",
    startDate: "05 May 2024",
    endDate: "09 may 2024",
    numberOfDays: 5,
    appliedOn: "05 May 2024",
    status: "Approved",
  },
  {
    id: "5",
    leaveType: "Medical Leave",
    startDate: "08 May 2024",
    endDate: "11 may 2024",
    numberOfDays: 4,
    appliedOn: "08 May 2024",
    status: "Pending",
  },
  {
    id: "6",
    leaveType: "Special Leave",
    startDate: "09 May 2024",
    endDate: "09 may 2024",
    numberOfDays: 1,
    appliedOn: "09 May 2024",
    status: "Pending",
  },
];

export default function LeaveApplicationsTable({
  applications = MOCK_APPLICATIONS,
}: LeaveApplicationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusBadge = (status: LeaveApplication["status"]) => {
    const variants = {
      Approved: "bg-green-100 dark:bg-green-950/30 midnight:bg-green-950/30 purple:bg-green-950/30 text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300",
      Pending: "bg-cyan-100 dark:bg-cyan-950/30 midnight:bg-cyan-950/30 purple:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 midnight:text-cyan-300 purple:text-cyan-300",
      Rejected: "bg-red-100 dark:bg-red-950/30 midnight:bg-red-950/30 purple:bg-red-950/30 text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${variants[status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === "Approved" ? "bg-green-500" : status === "Pending" ? "bg-cyan-500" : "bg-red-500"}`}></span>
        {status}
      </span>
    );
  };

  const filteredApplications = applications.filter((app) =>
    app.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
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
      <div className="overflow-x-auto smooth-scroll rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Leave Type
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Leave Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                No of Days
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Applied On
              </th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
            {paginatedApplications.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/30 purple:hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300/90 purple:text-pink-300/90">
                  {app.leaveType}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {app.startDate} - {app.endDate}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {app.numberOfDays}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  {app.appliedOn}
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(app.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredApplications.length)} of {filteredApplications.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white text-sm font-semibold"
          >
            {currentPage}
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
