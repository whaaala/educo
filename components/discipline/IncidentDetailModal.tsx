"use client";

import { X, Calendar, Clock, MapPin, User, FileText, Shield, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { DisciplineIncident } from "@/types/discipline";
import SeverityBadge from "./SeverityBadge";
import IncidentStatusBadge from "./IncidentStatusBadge";

interface IncidentDetailModalProps {
  incident: DisciplineIncident | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function IncidentDetailModal({
  incident,
  isOpen,
  onClose,
}: IncidentDetailModalProps) {
  if (!isOpen || !incident) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryLabel = (category: string) => {
    return category
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getActionTypeLabel = (actionType: string) => {
    return actionType
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-700/30 dark:to-gray-700/40 midnight:from-gray-800/30 midnight:to-cyan-900/10 purple:from-gray-800/30 purple:to-pink-900/10 border-b border-line rounded-t-2xl">
          <div className="flex-1 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200/50 dark:border-blue-700/30 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink">
                Incident Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-1">
                Case #{incident.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Student Information */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              Student Information
            </h3>
            <div className="flex items-start gap-4">
              {incident.profilePhoto ? (
                <img
                  src={incident.profilePhoto}
                  alt={incident.studentName}
                  className="w-20 h-20 rounded-full ring-4 ring-gray-200 dark:ring-gray-600 midnight:ring-cyan-500/20 purple:ring-pink-500/20 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-blue-200 dark:ring-blue-900/30">
                  {incident.studentName.charAt(0)}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <p className="text-lg font-bold text-ink">
                  {incident.studentName}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Admission No:</span> {incident.studentAdmissionNumber}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Class:</span> {incident.studentClass} {incident.studentSection}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</p>
              </div>
              <p className="text-sm font-bold text-ink">
                {formatDate(incident.incidentDate)}
              </p>
            </div>

            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Time</p>
              </div>
              <p className="text-sm font-bold text-ink">
                {incident.incidentTime}
              </p>
            </div>

            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Location</p>
              </div>
              <p className="text-sm font-bold text-ink">
                {incident.location}
              </p>
            </div>

            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</p>
              </div>
              <p className="text-sm font-bold text-ink">
                {getCategoryLabel(incident.category)}
              </p>
            </div>
          </div>

          {/* Status & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Severity</p>
              </div>
              <SeverityBadge severity={incident.severity} size="md" />
            </div>

            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</p>
              </div>
              <IncidentStatusBadge status={incident.status} size="md" />
            </div>
          </div>

          {/* Incident Details */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-3">
              {incident.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 leading-relaxed">
              {incident.description}
            </p>
          </div>

          {/* Witnesses */}
          {incident.witnesses && incident.witnesses.length > 0 && (
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
                </div>
                Witnesses
              </h3>
              <ul className="space-y-2">
                {incident.witnesses.map((witness, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {witness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Taken */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-bold text-ink">
                Action Taken
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Type</p>
                <p className="text-sm font-bold text-ink">
                  {getActionTypeLabel(incident.actionType || "")}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Details</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                  {incident.actionDetails}
                </p>
              </div>
              {incident.actionStartDate && incident.actionEndDate && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Duration</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(incident.actionStartDate)} - {formatDate(incident.actionEndDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reporter Information */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-3">
              Reported By
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Name:</span> {incident.reportedByName}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Role:</span> {incident.reportedByRole}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Reported on:</span> {formatDateTime(incident.reportedDate || incident.createdAt)}
              </p>
            </div>
          </div>

          {/* Parent Notification */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-3">
              Parent Notification
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Status:</span>{" "}
                <span className={incident.parentNotified ? "text-green-600 dark:text-green-400 font-semibold" : "text-red-600 dark:text-red-400 font-semibold"}>
                  {incident.parentNotified ? "Notified" : "Not Notified"}
                </span>
              </p>
              {incident.parentNotified && incident.parentNotifiedDate && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Date:</span> {formatDate(incident.parentNotifiedDate)}
                </p>
              )}
            </div>
          </div>

          {/* Follow-up */}
          {incident.followUpRequired && (
            <div className="bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">
                Follow-up Required
              </h3>
              {incident.followUpDate && (
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  Scheduled for: {formatDate(incident.followUpDate)}
                </p>
              )}
            </div>
          )}

          {/* Resolution Info */}
          {incident.resolvedAt && (
            <div className="bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-2">
                Resolved
              </h3>
              <p className="text-sm text-green-800 dark:text-green-400">
                {formatDateTime(incident.resolvedAt)}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/80 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border-t border-line rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-[#2a2d35] dark:hover:bg-gray-500 midnight:bg-gray-700 midnight:hover:bg-gray-600 purple:bg-gray-700 purple:hover:bg-gray-600 text-ink font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
