"use client";

import { DisciplineIncident } from "@/types/discipline";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import IncidentStatusBadge from "./IncidentStatusBadge";

interface DisciplineRecordsTableProps {
  incidents: DisciplineIncident[];
  onViewDetails: (incident: DisciplineIncident) => void;
  onEdit?: (incident: DisciplineIncident) => void;
  onDelete?: (incidentId: string) => void;
}

export default function DisciplineRecordsTable({
  incidents,
  onViewDetails,
  onEdit,
  onDelete,
}: DisciplineRecordsTableProps) {
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

  if (incidents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl p-12 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <FileText className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
          No Discipline Records
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          There are no discipline incidents matching your current filters.
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
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Incident
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Reported By
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
            {incidents.map((incident) => (
              <tr
                key={incident.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors"
              >
                {/* Date */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {formatDate(incident.incidentDate)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {incident.incidentTime}
                  </div>
                </td>

                {/* Student */}
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    {incident.profilePhoto ? (
                      <img
                        src={incident.profilePhoto}
                        alt={incident.studentName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                        {incident.studentName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {incident.studentName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                        {incident.studentClass} {incident.studentSection}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Incident Title */}
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 max-w-xs truncate">
                    {incident.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {incident.location}
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {getCategoryLabel(incident.category)}
                  </span>
                </td>

                {/* Severity */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <SeverityBadge severity={incident.severity} />
                </td>

                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <IncidentStatusBadge status={incident.status} />
                </td>

                {/* Reported By */}
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {incident.reportedByName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {formatDate(incident.reportedDate)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(incident)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </button>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(incident)}
                        className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/20 transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(incident.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
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
