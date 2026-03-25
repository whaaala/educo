"use client";

import { useState, useEffect } from "react";
import { DisciplinaryAction } from "@/types/discipline";
import { Eye, Edit, Trash2 } from "lucide-react";
import DisciplineStatusBadge from "./DisciplineStatusBadge";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import Tooltip from "@/components/shared/Tooltip";

interface DisciplinaryActionsTableProps {
  actions: DisciplinaryAction[];
  onViewDetails: (action: DisciplinaryAction) => void;
  onEdit?: (action: DisciplinaryAction) => void;
  onDelete?: (action: DisciplinaryAction) => void;
  filterKey?: string;
}

export default function DisciplinaryActionsTable({
  actions,
  onViewDetails,
  onEdit,
  onDelete,
  filterKey = "",
}: DisciplinaryActionsTableProps) {
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

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      "minor": "text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400",
      "moderate": "text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
      "serious": "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
      "critical": "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
    };
    return colors[severity] || "text-gray-600 dark:text-gray-400";
  };

  const columns: ColumnConfig<DisciplinaryAction>[] = [
    {
      key: "id",
      label: "Action ID",
      sortable: true,
      className: "text-left",
      render: (action) => {
        return (
          <Tooltip content={`Action ID: ${action.id}`}>
            <div className="font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 whitespace-nowrap truncate max-w-[100px]" style={{ fontSize: '11.8px' }}>
              {action.id}
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
      render: (action) => {
        const staffInfo = `${action.staffName} - ${action.staffPosition}`;
        return (
          <Tooltip content={staffInfo}>
            <div className="flex items-center gap-2.5">
              <div className="relative cursor-pointer group/avatar flex-shrink-0">
                {action.profilePhoto ? (
                  <img
                    src={action.profilePhoto}
                    alt={action.staffName}
                    className="w-9 h-9 rounded-full ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 object-cover shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                    style={{ position: 'relative', transformOrigin: 'center center' }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                    style={{ position: 'relative', transformOrigin: 'center center', fontSize: '11.8px' }}>
                    {action.staffName.charAt(0)}
                  </div>
                )}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[140px]" style={{ fontSize: '11.8px' }}>
                  {action.staffName}
                </div>
                <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate max-w-[140px]" style={{ fontSize: '10px' }}>
                  {action.staffPosition}
                </div>
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "incidentType",
      label: "Incident Type",
      sortable: true,
      className: "text-left",
      render: (action) => (
        <Tooltip content={action.incidentType}>
          <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[120px] capitalize" style={{ fontSize: '11.8px' }}>
            {action.incidentType.replace(/-/g, ' ')}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "severity",
      label: "Severity",
      sortable: true,
      className: "text-left",
      render: (action) => (
        <Tooltip content={`Severity: ${action.severity}`}>
          <div className={`font-semibold capitalize ${getSeverityColor(action.severity)}`} style={{ fontSize: '11.8px' }}>
            {action.severity}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left",
      render: (action) => <DisciplineStatusBadge status={action.status} size="sm" />,
    },
    {
      key: "incidentDate",
      label: "Incident Date",
      sortable: true,
      className: "text-left",
      sortValue: (action) => new Date(action.incidentDate).getTime(),
      render: (action) => {
        return (
          <Tooltip content={`Reported: ${formatDate(action.reportedDate)}`}>
            <div className="flex flex-col">
              <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
                {formatDate(action.incidentDate)}
              </div>
              <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70" style={{ fontSize: '10px' }}>
                {action.incidentTime || 'N/A'}
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
      render: (action) => (
        <div className="flex items-center justify-center gap-2.5">
          <Tooltip content="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(action);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-cyan-950/30 midnight:to-cyan-900/20 purple:from-pink-950/30 purple:to-pink-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 midnight:hover:from-cyan-900/40 midnight:hover:to-cyan-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/50 purple:hover:border-pink-500/50 active:scale-95"
              aria-label="View Details"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 midnight:group-hover:text-cyan-300 purple:group-hover:text-pink-300 transition-colors" />
            </button>
          </Tooltip>
          {onEdit && action.status !== "resolved" && action.status !== "closed" && (
            <Tooltip content="Edit Action">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(action);
                }}
                className="group relative p-2 rounded-lg bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 midnight:from-orange-950/30 midnight:to-orange-900/20 purple:from-orange-950/30 purple:to-orange-900/20 hover:from-orange-100 hover:to-orange-100 dark:hover:from-orange-900/40 dark:hover:to-orange-800/30 midnight:hover:from-orange-900/40 midnight:hover:to-orange-800/30 purple:hover:from-orange-900/40 purple:hover:to-orange-800/30 transition-all duration-200 cursor-pointer border border-orange-200/40 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30 hover:border-orange-400/60 dark:hover:border-orange-600/50 midnight:hover:border-orange-500/50 purple:hover:border-orange-500/50 active:scale-95"
                aria-label="Edit Action"
              >
                <Edit className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 midnight:group-hover:text-orange-300 purple:group-hover:text-orange-300 transition-colors" />
              </button>
            </Tooltip>
          )}
          {onDelete && action.status !== "resolved" && action.status !== "closed" && (
            <Tooltip content="Delete Action">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(action);
                }}
                className="group relative p-2 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 midnight:from-red-950/30 midnight:to-red-900/20 purple:from-red-950/30 purple:to-red-900/20 hover:from-red-100 hover:to-red-100 dark:hover:from-red-900/40 dark:hover:to-red-800/30 midnight:hover:from-red-900/40 midnight:hover:to-red-800/30 purple:hover:from-red-900/40 purple:hover:to-red-800/30 transition-all duration-200 cursor-pointer border border-red-200/40 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30 hover:border-red-400/60 dark:hover:border-red-600/50 midnight:hover:border-red-500/50 purple:hover:border-red-500/50 active:scale-95"
                aria-label="Delete Action"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 midnight:group-hover:text-red-300 purple:group-hover:text-red-300 transition-colors" />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden">
      <ResponsiveListTable<DisciplinaryAction> variant="contained" showColumnHeaders={true}
        data={actions}
        columns={columns}
        searchPlaceholder="Search by staff name, incident type, or action ID..."
        showSearch={true}
        defaultItemsPerPage={10}
        getRowKey={(item) => item.id}
        emptyMessage="No disciplinary actions found"
        enablePagination={true}
        enableItemsPerPage={true}
        onRowClick={onViewDetails}
      />
    </div>
  );
}
