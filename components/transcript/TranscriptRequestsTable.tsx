"use client";

import { useState, useEffect } from "react";
import { Eye, Download, Edit2, Trash2 } from "lucide-react";
import { TranscriptRequest, TranscriptStatus, PaymentStatus } from "@/types/transcript";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import Tooltip from "@/components/shared/Tooltip";

interface TranscriptRequestsTableProps {
  requests: TranscriptRequest[];
  onViewDetails: (request: TranscriptRequest) => void;
  onEdit?: (request: TranscriptRequest) => void;
  onDelete?: (requestId: string) => void;
  onDownload?: (request: TranscriptRequest) => void;
  filterKey?: string;
}

export default function TranscriptRequestsTable({
  requests,
  onViewDetails,
  onEdit,
  onDelete,
  onDownload,
  filterKey = "",
}: TranscriptRequestsTableProps) {
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Trigger animation when filterKey changes
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

  const getStatusBadge = (status: TranscriptStatus) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 midnight:bg-amber-900/20 midnight:text-amber-400 purple:bg-amber-900/20 purple:text-amber-400",
      processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 midnight:bg-blue-900/20 midnight:text-blue-400 purple:bg-blue-900/20 purple:text-blue-400",
      ready: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:bg-green-900/20 midnight:text-green-400 purple:bg-green-900/20 purple:text-green-400",
      delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 midnight:bg-emerald-900/20 midnight:text-emerald-400 purple:bg-emerald-900/20 purple:text-emerald-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 midnight:bg-red-900/20 midnight:text-red-400 purple:bg-red-900/20 purple:text-red-400",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border whitespace-nowrap ${styles[status]}`} style={{ fontSize: '0.7375rem' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    const styles = {
      paid: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      unpaid: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      partial: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      waived: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-[#0f1115]/30 dark:text-gray-400 dark:border-[#1a1d24]",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border whitespace-nowrap ${styles[status]}`} style={{ fontSize: '0.7375rem' }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Define columns for DataTable
  const columns: ColumnConfig<TranscriptRequest>[] = [
    {
      key: "requestNumber",
      label: "Request #",
      sortable: true,
      className: "text-left",
      render: (request) => (
        <div className="font-semibold text-ink whitespace-nowrap" style={{ fontSize: '0.7375rem' }}>
          {request.requestNumber}
        </div>
      ),
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
      key: "transcriptType",
      label: "Type",
      sortable: true,
      className: "text-left",
      render: (request) => (
        <div>
          <div className="font-semibold text-ink capitalize" style={{ fontSize: '0.7375rem' }}>
            {request.transcriptType}
          </div>
          <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 capitalize" style={{ fontSize: '0.625rem' }}>
            {request.deliveryMethod}
          </div>
        </div>
      ),
    },
    {
      key: "purpose",
      label: "Purpose",
      sortable: true,
      className: "text-left",
      render: (request) => (
        <Tooltip content={request.purpose.replace(/-/g, " ")} block>
          <div className="font-semibold text-ink capitalize truncate max-w-[150px]" style={{ fontSize: '0.7375rem' }}>
            {request.purpose.replace(/-/g, " ")}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      sortable: true,
      className: "text-left",
      sortValue: (request) => request.payment.status,
      render: (request) => (
        <div className="flex flex-col gap-1">
          {getPaymentBadge(request.payment.status)}
          <div className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 font-medium" style={{ fontSize: '0.625rem' }}>
            {request.payment.currency} {request.payment.amount.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left",
      render: (request) => getStatusBadge(request.status),
    },
    {
      key: "requestDate",
      label: "Request Date",
      sortable: true,
      className: "text-left",
      sortValue: (request) => new Date(request.requestDate).getTime(),
      render: (request) => (
        <div className="font-semibold text-ink whitespace-nowrap" style={{ fontSize: '0.7375rem' }}>
          {formatDate(request.requestDate)}
        </div>
      ),
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
          {onDownload && (
            <Tooltip content="Download">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(request);
                }}
                className="group relative p-2 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 hover:from-green-100 hover:to-green-100 dark:hover:from-green-900/40 dark:hover:to-green-800/30 transition-all duration-200 cursor-pointer border border-green-200/40 dark:border-green-800/30 hover:border-green-400/60 dark:hover:border-green-600/50 active:scale-95"
                aria-label="Download"
              >
                <Download className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
              </button>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip content="Edit">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(request);
                }}
                className="group relative p-2 rounded-lg bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 hover:from-orange-100 hover:to-orange-100 dark:hover:from-orange-900/40 dark:hover:to-orange-800/30 transition-all duration-200 cursor-pointer border border-orange-200/40 dark:border-orange-800/30 hover:border-orange-400/60 dark:hover:border-orange-600/50 active:scale-95"
                aria-label="Edit"
              >
                <Edit2 className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
              </button>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip content="Delete">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(request.id);
                }}
                className="group relative p-2 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 hover:from-red-100 hover:to-red-100 dark:hover:from-red-900/40 dark:hover:to-red-800/30 transition-all duration-200 cursor-pointer border border-red-200/40 dark:border-red-800/30 hover:border-red-400/60 dark:hover:border-red-600/50 active:scale-95"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
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
        }, 300);
      }, 50);

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
        getRowKey={(request) => request.id}
        emptyMessage="No transcript requests found"
        enablePagination={true}
        enableItemsPerPage={true}
      />
    </div>
  );
}
