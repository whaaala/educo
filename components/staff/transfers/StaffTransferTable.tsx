"use client";

import { useState, useEffect } from "react";
import { StaffTransferRequest } from "@/types/staffTransfer";
import { Eye, CheckCircle, XCircle, Play, FileText, AlertTriangle } from "lucide-react";
import StaffTransferStatusBadge from "./StaffTransferStatusBadge";
import StaffTransferTypeBadge from "./StaffTransferTypeBadge";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import Tooltip from "@/components/shared/Tooltip";
import EditableTransferLetterModal from "./EditableTransferLetterModal";
import EditableTerminationLetterModal from "./EditableTerminationLetterModal";
import TransferDetailsModal from "./TransferDetailsModal";

interface StaffTransferTableProps {
  requests: StaffTransferRequest[];
  onViewDetails: (request: StaffTransferRequest) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  onProcess: (requestId: string) => void;
  filterKey?: string;
}

export default function StaffTransferTable({
  requests,
  onViewDetails,
  onApprove,
  onReject,
  onProcess,
  filterKey = "",
}: StaffTransferTableProps) {
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [selectedTransferForLetter, setSelectedTransferForLetter] = useState<StaffTransferRequest | null>(null);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [selectedTermination, setSelectedTermination] = useState<StaffTransferRequest | null>(null);
  const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(false);
  const [selectedTransferForDetails, setSelectedTransferForDetails] = useState<StaffTransferRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Trigger animation when filterKey changes
  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger(prev => prev + 1);
      setPrevFilterKey(filterKey);
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

  const getTransferDetails = (request: StaffTransferRequest) => {
    if (request.transferType === "department") {
      return `${request.currentDepartment} → ${request.newDepartment}`;
    }
    if (request.transferType === "branch") {
      return `${request.currentBranch} → ${request.newBranch}`;
    }
    if (request.transferType === "designation") {
      return `${request.currentDesignation} → ${request.newDesignation}`;
    }
    if (request.transferType === "promotion") {
      return request.newDesignation
        ? `${request.currentDesignation} → ${request.newDesignation}`
        : "Pay Raise";
    }
    if (request.transferType === "location") {
      return `${request.currentLocation} → ${request.newLocation}`;
    }
    if (request.transferType === "termination") {
      const typeMap: Record<string, string> = {
        resignation: "Resignation",
        dismissal: "Dismissal",
        retirement: "Retirement",
        "contract-end": "Contract End",
        "mutual-agreement": "Mutual Agreement",
      };
      return typeMap[request.terminationType || "dismissal"] || "Termination";
    }
    return "-";
  };

  // Handler for opening letter modal
  const handleGenerateLetter = (request: StaffTransferRequest) => {
    if (request.transferType === "termination") {
      setSelectedTermination(request);
      setIsTerminationModalOpen(true);
    } else {
      setSelectedTransferForLetter(request);
      setIsLetterModalOpen(true);
    }
  };

  // Define columns for DataTable
  const columns: ColumnConfig<StaffTransferRequest>[] = [
    {
      key: "id",
      label: "Transfer ID",
      sortable: true,
      className: "text-left",
      render: (request) => {
        return (
          <Tooltip content={`Transfer ID: ${request.id}`}>
            <div className="flex flex-col">
              <div className="font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
                {request.id}
              </div>
              <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70" style={{ fontSize: '10px' }}>
                {formatDate(request.requestedAt)}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "staffName",
      label: "Staff Details",
      sortable: true,
      className: "text-left",
      render: (request) => {
        const staffInfo = `${request.staffName} - ${request.currentDesignation}`;
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
                  {request.staffName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[140px]" style={{ fontSize: '11.8px' }}>
                  {request.staffName}
                </div>
                <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate max-w-[140px]" style={{ fontSize: '10px' }}>
                  {request.currentDesignation}
                </div>
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "transferType",
      label: "Type",
      sortable: true,
      className: "text-left",
      render: (request) => <StaffTransferTypeBadge type={request.transferType} size="sm" />,
    },
    {
      key: "transferDetails",
      label: "Transfer Details",
      sortable: false,
      className: "text-left",
      render: (request) => {
        const details = getTransferDetails(request);
        const reason = request.reason;
        return (
          <Tooltip content={reason}>
            <div className="flex flex-col max-w-[200px]">
              <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate" style={{ fontSize: '11.8px' }}>
                {details}
              </div>
              <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate" style={{ fontSize: '10px' }}>
                {reason}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "effectiveDate",
      label: "Effective Date",
      sortable: true,
      className: "text-left",
      sortValue: (request) => new Date(request.effectiveDate).getTime(),
      render: (request) => {
        return (
          <Tooltip content={`Effective: ${formatDate(request.effectiveDate)}`}>
            <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
              {formatDate(request.effectiveDate)}
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
      render: (request) => <StaffTransferStatusBadge status={request.status} size="sm" />,
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
                setSelectedTransferForDetails(request);
                setIsDetailsModalOpen(true);
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
                    onReject(request.id, "Rejected by admin");
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 hover:from-red-100 hover:to-red-100 dark:hover:from-red-900/40 dark:hover:to-red-800/30 transition-all duration-200 cursor-pointer border border-red-200/40 dark:border-red-800/30 hover:border-red-400/60 dark:hover:border-red-600/50 active:scale-95"
                  aria-label="Reject"
                >
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
                </button>
              </Tooltip>
            </>
          )}
          {request.status === "approved" && (
            <>
              <Tooltip content="Mark as In Progress">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProcess(request.id);
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/20 hover:from-emerald-100 hover:to-emerald-100 dark:hover:from-emerald-900/40 dark:hover:to-emerald-800/30 transition-all duration-200 cursor-pointer border border-emerald-200/40 dark:border-emerald-800/30 hover:border-emerald-400/60 dark:hover:border-emerald-600/50 active:scale-95"
                  aria-label="Process Transfer"
                >
                  <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors" />
                </button>
              </Tooltip>
              <Tooltip content="Generate Transfer Letter">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateLetter(request);
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 midnight:from-purple-950/30 midnight:to-purple-900/20 purple:from-purple-950/30 purple:to-purple-900/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-purple-900/40 dark:hover:to-purple-800/30 midnight:hover:from-purple-900/40 midnight:hover:to-purple-800/30 purple:hover:from-purple-900/40 purple:hover:to-purple-800/30 transition-all duration-200 cursor-pointer border border-purple-200/40 dark:border-purple-800/30 midnight:border-purple-700/30 purple:border-purple-700/30 hover:border-purple-400/60 dark:hover:border-purple-600/50 midnight:hover:border-purple-500/50 purple:hover:border-purple-500/50 active:scale-95"
                  aria-label="Generate Letter"
                >
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 midnight:group-hover:text-purple-300 purple:group-hover:text-purple-300 transition-colors" />
                </button>
              </Tooltip>
            </>
          )}
          {(request.status === "in-progress" || request.status === "completed") && (
            <Tooltip content="Generate Transfer Letter">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateLetter(request);
                }}
                className="group relative p-2 rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 midnight:from-purple-950/30 midnight:to-purple-900/20 purple:from-purple-950/30 purple:to-purple-900/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-purple-900/40 dark:hover:to-purple-800/30 midnight:hover:from-purple-900/40 midnight:hover:to-purple-800/30 purple:hover:from-purple-900/40 purple:hover:to-purple-800/30 transition-all duration-200 cursor-pointer border border-purple-200/40 dark:border-purple-800/30 midnight:border-purple-700/30 purple:border-purple-700/30 hover:border-purple-400/60 dark:hover:border-purple-600/50 midnight:hover:border-purple-500/50 purple:hover:border-purple-500/50 active:scale-95"
                aria-label="Generate Letter"
              >
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 midnight:group-hover:text-purple-300 purple:group-hover:text-purple-300 transition-colors" />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  // Add animation styles directly to each row when filter changes
  useEffect(() => {
    if (animationTrigger > 0) {
      const timeoutId = setTimeout(() => {
        const tables = document.querySelectorAll('table');

        tables.forEach((table) => {
          const rows = table.querySelectorAll('tbody tr');

          rows.forEach((row, index) => {
            const htmlRow = row as HTMLElement;
            const delay = index / 80;
            htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
          });
        });

        setTimeout(() => {
          tables.forEach((table) => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row) => {
              const htmlRow = row as HTMLElement;
              htmlRow.style.animation = '';
            });
          });
        }, 500);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [animationTrigger]);

  return (
    <div className="relative">
      {/* Mobile Scroll Indicator */}
      <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

      <ResponsiveListTable variant="contained" showColumnHeaders={true}
        data={requests}
        columns={columns}
        showSearch={false}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[5, 10, 15, 20, 25]}
        getRowKey={(request, index) => `${request.id}-${animationTrigger}-${index}`}
        emptyMessage="No transfer requests found"
        enablePagination={true}
        enableItemsPerPage={true}
      />

      {/* Editable Transfer Letter Modal */}
      {selectedTransferForLetter && (
        <EditableTransferLetterModal
          isOpen={isLetterModalOpen}
          onClose={() => {
            setIsLetterModalOpen(false);
            setSelectedTransferForLetter(null);
          }}
          transfer={selectedTransferForLetter}
        />
      )}

      {/* Editable Termination Letter Modal */}
      {selectedTermination && (
        <EditableTerminationLetterModal
          isOpen={isTerminationModalOpen}
          onClose={() => {
            setIsTerminationModalOpen(false);
            setSelectedTermination(null);
          }}
          termination={selectedTermination}
        />
      )}

      {/* Transfer Details Modal */}
      {selectedTransferForDetails && (
        <TransferDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTransferForDetails(null);
          }}
          transfer={selectedTransferForDetails}
          onApprove={onApprove}
          onReject={onReject}
          onProcess={onProcess}
        />
      )}
    </div>
  );
}
