"use client";

import { useState, useEffect } from "react";
import { DisciplineIncident } from "@/types/discipline";
import { Eye, Trash2, MapPin, Tag } from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import IncidentStatusBadge from "./IncidentStatusBadge";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import Tooltip from "@/components/shared/Tooltip";

interface DisciplineRecordsTableProps {
  incidents: DisciplineIncident[];
  onViewDetails: (incident: DisciplineIncident) => void;
  onEdit?: (incident: DisciplineIncident) => void;
  onDelete?: (incidentId: string) => void;
  filterKey?: string;
}

export default function DisciplineRecordsTable({
  incidents,
  onViewDetails,
  onEdit,
  onDelete,
  filterKey = "",
}: DisciplineRecordsTableProps) {
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

  const getCategoryLabel = (category: string) => {
    return category
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Define columns for DataTable
  const columns: ColumnConfig<DisciplineIncident>[] = [
    {
      key: "incidentDate",
      label: "Date",
      sortable: true,
      className: "text-left",
      sortValue: (incident) => new Date(incident.incidentDate).getTime(),
      render: (incident) => {
        const fullDate = `${formatDate(incident.incidentDate)} at ${incident.incidentTime}`;
        return (
          <Tooltip content={fullDate}>
            <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
              {formatDate(incident.incidentDate)}
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
      render: (incident) => {
        const studentInfo = `${incident.studentName} - ${incident.studentClass} ${incident.studentSection}`;
        return (
          <Tooltip content={studentInfo}>
            <div className="flex items-center gap-2.5">
              {incident.profilePhoto ? (
                <img
                  src={incident.profilePhoto}
                  alt={incident.studentName}
                  className="w-9 h-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-blue-200 dark:ring-blue-900/30 flex-shrink-0" style={{ fontSize: '11.8px' }}>
                  {incident.studentName.charAt(0)}
                </div>
              )}
              <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[140px]" style={{ fontSize: '11.8px' }}>
                {incident.studentName}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "title",
      label: "Incident",
      sortable: true,
      className: "text-left",
      render: (incident) => {
        const fullIncident = `${incident.title} (Location: ${incident.location})`;
        return (
          <Tooltip content={fullIncident}>
            <div className="flex items-center gap-1.5 max-w-[200px]">
              <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate" style={{ fontSize: '11.8px' }}>
                {incident.title}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      className: "text-left",
      render: (incident) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 midnight:bg-purple-900/20 midnight:text-purple-400 midnight:border-purple-800 purple:bg-pink-900/20 purple:text-pink-400 purple:border-pink-800 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
          <Tag className="w-3 h-3" />
          {getCategoryLabel(incident.category)}
        </span>
      ),
      sortValue: (incident) => getCategoryLabel(incident.category),
    },
    {
      key: "severity",
      label: "Severity",
      sortable: true,
      className: "text-left",
      render: (incident) => <SeverityBadge severity={incident.severity} size="sm" />,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left",
      render: (incident) => <IncidentStatusBadge status={incident.status} size="sm" />,
    },
    {
      key: "reportedByName",
      label: "Reported By",
      sortable: true,
      className: "text-left",
      render: (incident) => {
        const reporterInfo = `${incident.reportedByName} (Reported on ${formatDate(incident.reportedDate)})`;
        return (
          <Tooltip content={reporterInfo}>
            <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[130px] whitespace-nowrap" style={{ fontSize: '11.8px' }}>
              {incident.reportedByName}
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
      render: (incident) => (
        <div className="flex items-center justify-center gap-2.5">
          <Tooltip content="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(incident);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-cyan-950/30 midnight:to-cyan-900/20 purple:from-pink-950/30 purple:to-pink-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 midnight:hover:from-cyan-900/40 midnight:hover:to-cyan-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/50 purple:hover:border-pink-500/50 active:scale-95"
              aria-label="View Details"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 midnight:group-hover:text-cyan-300 purple:group-hover:text-pink-300 transition-colors" />
            </button>
          </Tooltip>
          {onDelete && (
            <Tooltip content="Delete">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(incident.id);
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

      <DataTable
        data={incidents}
        columns={columns}
        title=""
        showSearch={false}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[5, 10, 15, 20, 25]}
        getRowKey={(incident, index) => `${incident.id}-${animationTrigger}-${index}`}
        emptyMessage="No discipline incidents found"
        enablePagination={true}
        enableItemsPerPage={true}
      />
    </div>
  );
}
