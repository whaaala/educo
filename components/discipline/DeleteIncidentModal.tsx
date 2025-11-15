"use client";

import { DisciplineIncident } from "@/types/discipline";
import { AlertTriangle, X } from "lucide-react";
import { format } from "date-fns";

interface DeleteIncidentModalProps {
  incident: DisciplineIncident | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (incidentId: string) => void;
}

export default function DeleteIncidentModal({
  incident,
  isOpen,
  onClose,
  onConfirmDelete,
}: DeleteIncidentModalProps) {
  if (!incident || !isOpen) return null;

  const handleDelete = () => {
    onConfirmDelete(incident.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-red-50/50 to-orange-50/30 dark:from-red-900/10 dark:to-red-800/10 midnight:from-red-900/10 midnight:to-red-800/10 purple:from-red-900/10 purple:to-red-800/10 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-t-2xl">
          <div className="flex-1 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 border border-red-200/50 dark:border-red-700/30 midnight:border-red-500/30 purple:border-red-500/30">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Delete Incident Record
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-red-100/50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Warning Message */}
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 border border-red-200 dark:border-red-800/50 midnight:border-red-500/30 purple:border-red-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900 dark:text-red-200 midnight:text-red-200 purple:text-red-200">
                Warning: This action is permanent
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300 mt-1.5 leading-relaxed">
                Once deleted, this incident record cannot be recovered. All associated data will be permanently removed.
              </p>
            </div>
          </div>

          {/* Incident Details */}
          <div className="bg-white dark:bg-gray-700/30 midnight:bg-gray-800/30 purple:bg-gray-800/30 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl p-5 space-y-4">
            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 flex items-center gap-2">
              <div className="w-1 h-5 bg-red-500 rounded-full"></div>
              Incident Details
            </h4>

            <div className="space-y-3 text-sm">
              {/* Student Info */}
              <div className="flex items-start gap-3 py-2">
                <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 min-w-[110px] font-medium">
                  Student:
                </span>
                <span className="text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 font-semibold flex-1">
                  {incident.studentName}
                </span>
              </div>

              {/* Incident Title */}
              <div className="flex items-start gap-3 py-2 border-t border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10">
                <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 min-w-[110px] font-medium">
                  Incident:
                </span>
                <span className="text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 font-semibold flex-1">
                  {incident.title}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-start gap-3 py-2 border-t border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10">
                <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 min-w-[110px] font-medium">
                  Date:
                </span>
                <span className="text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
                  {format(new Date(incident.incidentDate), "MMM dd, yyyy")}
                </span>
              </div>

              {/* Incident ID */}
              <div className="flex items-start gap-3 py-2 border-t border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10">
                <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 min-w-[110px] font-medium">
                  Incident ID:
                </span>
                <span className="text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 font-mono text-xs font-semibold">
                  {incident.id}
                </span>
              </div>

              {/* Severity */}
              <div className="flex items-start gap-3 py-2 border-t border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10">
                <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 min-w-[110px] font-medium">
                  Severity:
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ${
                  incident.severity === "minor"
                    ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30 text-blue-700 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300"
                    : incident.severity === "moderate"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 midnight:text-yellow-300 purple:text-yellow-300"
                    : incident.severity === "major"
                    ? "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30 text-orange-700 dark:text-orange-300 midnight:text-orange-300 purple:text-orange-300"
                    : "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300"
                }`}>
                  {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/80 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-700 midnight:bg-gray-700 purple:bg-gray-700 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-600 purple:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold transition-colors shadow-sm hover:shadow-md cursor-pointer"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}
