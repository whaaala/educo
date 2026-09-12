"use client";

import { useState, useEffect } from "react";
import { TransferRequest } from "@/types/transfer";
import { Eye, CheckCircle, XCircle, Play } from "lucide-react";
import TransferStatusBadge from "./TransferStatusBadge";
import TransferTypeBadge from "./TransferTypeBadge";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import Tooltip from "@/components/shared/Tooltip";

interface TransferRequestsTableProps {
  requests: TransferRequest[];
  onViewDetails: (request: TransferRequest) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  onProcess: (requestId: string) => void;
  filterKey?: string;
}

export default function TransferRequestsTable({
  requests,
  onViewDetails,
  onApprove,
  onReject,
  onProcess,
  filterKey = "",
}: TransferRequestsTableProps) {
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

  const getTransferTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "promotion": "Promotion",
      "section-change": "Section Change",
      "class-change": "Class Change",
      "internal": "Internal Transfer",
      "cross-branch": "Cross-Branch",
      "external": "External Transfer",
    };
    return labels[type] || type;
  };

  // Define columns for DataTable
  const columns: ColumnConfig<TransferRequest>[] = [
    {
      key: "id",
      label: "Request ID",
      sortable: true,
      className: "text-left",
      render: (request) => {
        return (
          <Tooltip content={`Request ID: ${request.id}`}>
            <div className="font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 whitespace-nowrap truncate max-w-[100px]" style={{ fontSize: '0.7375rem' }}>
              {request.id}
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "studentName",
      label: "Student",
      sortable: true,
      className: "text-left",
      render: (request) => {
        const studentInfo = `${request.studentName} - ${request.studentAdmissionNumber}`;
        return (
          <Tooltip content={studentInfo}>
            <div className="flex items-center gap-2.5">
              <div className="relative cursor-pointer group/avatar flex-shrink-0">
                {request.profilePhoto ? (
                  <img
                    src={request.profilePhoto}
                    alt={request.studentName}
                    className="w-9 h-9 rounded-full ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 object-cover shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                    style={{ position: 'relative', transformOrigin: 'center center' }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                    style={{ position: 'relative', transformOrigin: 'center center', fontSize: '0.7375rem' }}>
                    {request.studentName.charAt(0)}
                  </div>
                )}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
              </div>
              <div className="font-semibold text-ink truncate max-w-[140px]" style={{ fontSize: '0.7375rem' }}>
                {request.studentName}
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
      render: (request) => <TransferTypeBadge type={request.transferType} size="sm" />,
      sortValue: (request) => getTransferTypeLabel(request.transferType),
    },
    {
      key: "source",
      label: "From",
      sortable: true,
      className: "text-left",
      render: (request) => {
        const sourceInfo = request.sourceBranchName
          ? `${request.sourceClass} ${request.sourceSection} - ${request.sourceBranchName}`
          : `${request.sourceClass} ${request.sourceSection}`;
        return (
          <Tooltip content={sourceInfo}>
            <div className="flex flex-col max-w-[150px]">
              <div className="font-semibold text-ink truncate" style={{ fontSize: '0.7375rem' }}>
                {request.sourceClass} {request.sourceSection}
              </div>
              {request.sourceBranchName && (
                <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate" style={{ fontSize: '0.625rem' }}>
                  {request.sourceBranchName}
                </div>
              )}
            </div>
          </Tooltip>
        );
      },
      sortValue: (request) => `${request.sourceClass} ${request.sourceSection}`,
    },
    {
      key: "destination",
      label: "To",
      sortable: true,
      className: "text-left",
      render: (request) => {
        const destination = getDestination(request);
        return (
          <Tooltip content={destination}>
            <div className="font-semibold text-ink truncate max-w-[150px]" style={{ fontSize: '0.7375rem' }}>
              {destination}
            </div>
          </Tooltip>
        );
      },
      sortValue: (request) => getDestination(request),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left",
      render: (request) => <TransferStatusBadge status={request.status} size="sm" />,
    },
    {
      key: "requestedDate",
      label: "Requested",
      sortable: true,
      className: "text-left",
      sortValue: (request) => new Date(request.requestedDate).getTime(),
      render: (request) => {
        const fullDate = `${formatDate(request.requestedDate)} by ${request.requestedByName}`;
        return (
          <Tooltip content={fullDate}>
            <div className="flex flex-col">
              <div className="font-semibold text-ink whitespace-nowrap" style={{ fontSize: '0.7375rem' }}>
                {formatDate(request.requestedDate)}
              </div>
              <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate max-w-[120px]" style={{ fontSize: '0.625rem' }}>
                by {request.requestedByName}
              </div>
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
            <Tooltip content="Process Transfer">
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
          )}
        </div>
      ),
    },
  ];

  // Add animation styles directly to each row when filter changes
  useEffect(() => {
    if (animationTrigger > 0) {
      console.log('🎬 Animation trigger:', animationTrigger);

      // Wait for DataTable to render
      const timeoutId = setTimeout(() => {
        // Target tbody rows more specifically
        const tables = document.querySelectorAll('table');
        console.log('📊 Found tables:', tables.length);

        tables.forEach((table) => {
          const rows = table.querySelectorAll('tbody tr');
          console.log('📝 Found rows in table:', rows.length);

          rows.forEach((row, index) => {
            const htmlRow = row as HTMLElement;
            const delay = index / 80;
            // Apply the exact same animation as DataTable's isSearching state
            htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
            console.log(`✨ Applied animation to row ${index} with delay ${delay}s`);
          });
        });

        // Clear animations after they complete
        setTimeout(() => {
          tables.forEach((table) => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row) => {
              const htmlRow = row as HTMLElement;
              htmlRow.style.animation = '';
            });
          });
          console.log('🧹 Cleared animations');
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
    </div>
  );
}
