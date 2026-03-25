"use client";

import { useState, useEffect } from "react";
import { Complaint } from "@/types/discipline";
import { Eye, UserX } from "lucide-react";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import Tooltip from "@/components/shared/Tooltip";

interface ComplaintsTableProps {
  complaints: Complaint[];
  onViewDetails: (complaint: Complaint) => void;
  filterKey?: string;
}

export default function ComplaintsTable({
  complaints,
  onViewDetails,
  filterKey = "",
}: ComplaintsTableProps) {
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger(prev => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      "low": "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
      "medium": "text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400",
      "high": "text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
      "urgent": "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    };
    return colors[priority] || "text-gray-600 dark:text-gray-400";
  };

  const columns: ColumnConfig<Complaint>[] = [
    {
      key: "id",
      label: "Complaint ID",
      sortable: true,
      className: "text-left",
      render: (complaint) => {
        return (
          <Tooltip content={`Complaint ID: ${complaint.id}`}>
            <div className="font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 whitespace-nowrap truncate max-w-[100px]" style={{ fontSize: '11.8px' }}>
              {complaint.id}
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "complainantName",
      label: "Complainant",
      sortable: true,
      className: "text-left",
      render: (complaint) => {
        const displayName = complaint.isAnonymous ? "Anonymous" : complaint.complainantName || "Unknown";
        return (
          <Tooltip content={displayName}>
            <div className="flex items-center gap-2.5">
              {complaint.isAnonymous ? (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white shadow-sm ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                  <UserX className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-blue-200 dark:ring-blue-900/30 flex-shrink-0" style={{ fontSize: '11.8px' }}>
                  {displayName.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[140px]" style={{ fontSize: '11.8px' }}>
                  {displayName}
                </div>
                <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate max-w-[140px]" style={{ fontSize: '10px' }}>
                  {complaint.isAnonymous ? "Anonymous Report" : (complaint.complainantPosition || "N/A")}
                </div>
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      className: "text-left",
      render: (complaint) => (
        <Tooltip content={complaint.subject}>
          <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[200px]" style={{ fontSize: '11.8px' }}>
            {complaint.subject}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      className: "text-left",
      render: (complaint) => (
        <Tooltip content={`Priority: ${complaint.priority}`}>
          <div className={`font-semibold capitalize ${getPriorityColor(complaint.priority)}`} style={{ fontSize: '11.8px' }}>
            {complaint.priority}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left",
      render: (complaint) => <ComplaintStatusBadge status={complaint.status} size="sm" />,
    },
    {
      key: "complaintDate",
      label: "Date",
      sortable: true,
      className: "text-left",
      sortValue: (complaint) => new Date(complaint.complaintDate).getTime(),
      render: (complaint) => {
        return (
          <Tooltip content={formatDate(complaint.complaintDate)}>
            <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
              {formatDate(complaint.complaintDate)}
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
      render: (complaint) => (
        <div className="flex items-center justify-center gap-2.5">
          <Tooltip content="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(complaint);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-cyan-950/30 midnight:to-cyan-900/20 purple:from-pink-950/30 purple:to-pink-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 midnight:hover:from-cyan-900/40 midnight:hover:to-cyan-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/50 purple:hover:border-pink-500/50 active:scale-95"
              aria-label="View Details"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 midnight:group-hover:text-cyan-300 purple:group-hover:text-pink-300 transition-colors" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden">
      <ResponsiveListTable<Complaint> variant="contained" showColumnHeaders={true}
        data={complaints}
        columns={columns}
        searchPlaceholder="Search by complainant, subject, or complaint ID..."
        showSearch={true}
        defaultItemsPerPage={10}
        getRowKey={(item) => item.id}
        emptyMessage="No complaints found"
        enablePagination={true}
        enableItemsPerPage={true}
        onRowClick={onViewDetails}
      />
    </div>
  );
}
