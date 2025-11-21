"use client";

import { useState, useEffect } from "react";
import { LeaveRequest } from "@/types/leave";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import LeaveStatusBadge from "./LeaveStatusBadge";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import Tooltip from "@/components/shared/Tooltip";

interface LeaveRequestsTableProps {
  requests: LeaveRequest[];
  onViewDetails: (request: LeaveRequest) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  filterKey?: string;
}

export default function LeaveRequestsTable({
  requests,
  onViewDetails,
  onApprove,
  onReject,
  filterKey = "",
}: LeaveRequestsTableProps) {
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Trigger animation when filterKey changes
  useEffect(() => {
    console.log('🔑 FilterKey changed from:', prevFilterKey, 'to:', filterKey);
    if (filterKey !== prevFilterKey) {
      console.log('✅ Triggering animation');
      setAnimationTrigger(prev => prev + 1);
      setPrevFilterKey(filterKey);
    } else {
      console.log('⏭️ FilterKey unchanged, skipping');
    }
  }, [filterKey]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Define columns for DataTable
  const columns: ColumnConfig<LeaveRequest>[] = [
    {
      key: "id",
      label: "Request ID",
      sortable: true,
      className: "text-left",
      render: (request) => {
        return (
          <Tooltip content={`Request ID: ${request.id}`}>
            <div className="font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 whitespace-nowrap truncate max-w-[100px]" style={{ fontSize: '11.8px' }}>
              {request.id}
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "staffName",
      label: "Staff Member",
      sortable: true,
      className: "text-left",
      render: (request) => {
        const staffInfo = `${request.staffName} - ${request.staffPosition}`;
        return (
          <Tooltip content={staffInfo}>
            <div className="flex items-center gap-2.5">
              {request.profilePhoto ? (
                <img
                  src={request.profilePhoto}
                  alt={request.staffName}
                  className="w-9 h-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-blue-200 dark:ring-blue-900/30 flex-shrink-0" style={{ fontSize: '11.8px' }}>
                  {request.staffName.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[140px]" style={{ fontSize: '11.8px' }}>
                  {request.staffName}
                </div>
                <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate max-w-[140px]" style={{ fontSize: '10px' }}>
                  {request.staffPosition}
                </div>
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "leaveType",
      label: "Leave Type",
      sortable: true,
      className: "text-left",
      render: (request) => (
        <Tooltip content={request.leaveType}>
          <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[120px]" style={{ fontSize: '11.8px' }}>
            {request.leaveType}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "startDate",
      label: "Leave Period",
      sortable: true,
      className: "text-left",
      sortValue: (request) => new Date(request.startDate).getTime(),
      render: (request) => {
        const periodInfo = `${formatDate(request.startDate)} to ${formatDate(request.endDate)} (${request.numberOfDays} day${request.numberOfDays > 1 ? 's' : ''})`;
        return (
          <Tooltip content={periodInfo}>
            <div className="flex flex-col">
              <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
                {formatDate(request.startDate)} - {formatDate(request.endDate)}
              </div>
              <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70" style={{ fontSize: '10px' }}>
                {request.numberOfDays} day{request.numberOfDays > 1 ? 's' : ''}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left",
      render: (request) => <LeaveStatusBadge status={request.status} size="sm" />,
    },
    {
      key: "requestedDate",
      label: "Requested",
      sortable: true,
      className: "text-left",
      sortValue: (request) => new Date(request.requestedDate).getTime(),
      render: (request) => {
        return (
          <Tooltip content={formatDate(request.requestedDate)}>
            <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
              {formatDate(request.requestedDate)}
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "text-center",
      render: (request) => (
        <div className="flex items-center justify-center gap-2.5">
          <Tooltip content="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(request);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-cyan-950/30 midnight:to-cyan-900/20 purple:from-pink-950/30 purple:to-pink-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 midnight:hover:from-cyan-900/40 midnight:hover:to-cyan-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/50 purple:hover:border-pink-500/50 active:scale-95"
              aria-label="View Details"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 midnight:group-hover:text-cyan-300 purple:group-hover:text-pink-300 transition-colors" />
            </button>
          </Tooltip>
          {request.status === "pending" && (
            <>
              <Tooltip content="Approve">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove(request.id);
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 hover:from-green-100 hover:to-green-100 dark:hover:from-green-900/40 dark:hover:to-green-800/30 transition-all duration-200 cursor-pointer border border-green-200/40 dark:border-green-800/30 hover:border-green-400/60 dark:hover:border-green-600/50 active:scale-95"
                  aria-label="Approve"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                </button>
              </Tooltip>
              <Tooltip content="Reject">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject(request.id, "Rejected by manager");
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 hover:from-red-100 hover:to-red-100 dark:hover:from-red-900/40 dark:hover:to-red-800/30 transition-all duration-200 cursor-pointer border border-red-200/40 dark:border-red-800/30 hover:border-red-400/60 dark:hover:border-red-600/50 active:scale-95"
                  aria-label="Reject"
                >
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden">
      <DataTable<LeaveRequest>
        data={requests}
        columns={columns}
        title="Leave Requests"
        searchPlaceholder="Search by staff name, position, or request ID..."
        showSearch={true}
        defaultItemsPerPage={10}
        getRowKey={(item) => item.id}
        emptyMessage="No leave requests found"
        enablePagination={true}
        enableItemsPerPage={true}
        onRowClick={onViewDetails}
      />
    </div>
  );
}
