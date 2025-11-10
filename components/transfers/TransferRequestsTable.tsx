"use client";

import { TransferRequest } from "@/types/transfer";
import { Eye, CheckCircle, XCircle, Play } from "lucide-react";
import TransferStatusBadge from "./TransferStatusBadge";
import TransferTypeBadge from "./TransferTypeBadge";

interface TransferRequestsTableProps {
  requests: TransferRequest[];
  onViewDetails: (request: TransferRequest) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  onProcess: (requestId: string) => void;
}

export default function TransferRequestsTable({
  requests,
  onViewDetails,
  onApprove,
  onReject,
  onProcess,
}: TransferRequestsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDestination = (request: TransferRequest) => {
    if (request.transferType === "external") {
      return request.destinationSchoolName || "External School";
    }
    if (request.transferType === "cross-branch") {
      return `${request.destinationBranchName} - ${request.destinationClass} ${request.destinationSection}`;
    }
    if (request.transferType === "class-change") {
      return `${request.destinationClass} ${request.destinationSection || ""}`.trim();
    }
    if (request.transferType === "section-change") {
      return `Section ${request.destinationSection}`;
    }
    if (request.transferType === "internal") {
      return `${request.destinationClass} ${request.destinationSection}`;
    }
    return "-";
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl p-12 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
          No Transfer Requests
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          There are no transfer requests matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border-b border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Request ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                From
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                To
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Requested
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                    {request.id}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    {request.profilePhoto ? (
                      <img
                        src={request.profilePhoto}
                        alt={request.studentName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                        {request.studentName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {request.studentName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                        {request.studentAdmissionNumber}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <TransferTypeBadge type={request.transferType} />
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {request.sourceClass} {request.sourceSection}
                  </div>
                  {request.sourceBranchName && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                      {request.sourceBranchName}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {getDestination(request)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <TransferStatusBadge status={request.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {formatDate(request.requestedDate)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    by {request.requestedByName}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(request)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </button>
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => onApprove(request.id)}
                          className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/20 transition-all"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                        <button
                          onClick={() => onReject(request.id, "Rejected by admin")}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/20 transition-all"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </>
                    )}
                    {request.status === "approved" && (
                      <button
                        onClick={() => onProcess(request.id)}
                        className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/20 transition-all"
                        title="Process Transfer"
                      >
                        <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
