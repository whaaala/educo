"use client";

import { X, User, Calendar, AlertTriangle, FileText, Shield, CheckCircle2, Clock, Building2, Mail, MapPin, Eye, Edit } from "lucide-react";
import { DisciplinaryAction } from "@/types/discipline";
import DisciplineStatusBadge from "./DisciplineStatusBadge";

interface ViewDisciplinaryActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: DisciplinaryAction;
  onEdit?: () => void;
}

export default function ViewDisciplinaryActionModal({
  isOpen,
  onClose,
  action,
  onEdit,
}: ViewDisciplinaryActionModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      "minor": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      "moderate": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      "serious": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      "critical": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return colors[severity] || "bg-gray-100 text-gray-700 dark:bg-[#1a1d24] dark:text-gray-400";
  };

  const getSeverityLabel = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const getActionTakenLabel = (actionTaken?: string) => {
    if (!actionTaken) return "Pending";
    return actionTaken.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5 dark:from-red-500/10 dark:via-orange-500/10 dark:to-red-500/10 midnight:from-red-500/10 midnight:via-orange-500/10 midnight:to-red-500/10 purple:from-red-500/10 purple:via-orange-500/10 purple:to-red-500/10 border-b border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 dark:via-red-400/5 midnight:via-red-400/5 purple:via-red-400/5 animate-pulse opacity-50"></div>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent dark:via-red-400/40 midnight:via-red-400/40 purple:via-red-400/40"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-400 dark:to-orange-500 midnight:from-red-500 midnight:to-orange-600 purple:from-red-500 purple:to-orange-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <AlertTriangle className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Disciplinary Action Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Action ID: {action.id}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5/50 purple:hover:bg-pink-500/5/50 rounded-lg transition-all duration-200 hover:rotate-90 active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Staff Information */}
          <div className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 midnight:from-red-900/10 midnight:to-orange-900/10 purple:from-red-900/10 purple:to-orange-900/10 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30">
            <div className="flex items-start gap-4">
              {action.profilePhoto ? (
                <img
                  src={action.profilePhoto}
                  alt={action.staffName}
                  className="w-16 h-16 rounded-xl ring-2 ring-red-200 dark:ring-red-800/50 midnight:ring-red-500/30 purple:ring-red-500/30 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm ring-2 ring-red-200 dark:ring-red-900/30 flex-shrink-0">
                  {action.staffName.charAt(0)}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {action.staffName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {action.staffPosition}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                    <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {action.staffDepartment}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                    <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {action.staffEmail}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <DisciplineStatusBadge status={action.status} size="md" />
              </div>
            </div>
          </div>

          {/* Incident Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Incident Type */}
            <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Incident Type
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 capitalize">
                {action.incidentType.replace(/-/g, ' ')}
              </p>
            </div>

            {/* Severity */}
            <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Severity
                </span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getSeverityColor(action.severity)}`}>
                {getSeverityLabel(action.severity)}
              </span>
            </div>

            {/* Incident Date */}
            <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Incident Date
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {formatDate(action.incidentDate)}
              </p>
              {action.incidentTime && (
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-1">
                  {action.incidentTime}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Location
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {action.incidentLocation}
              </p>
            </div>

            {/* Reported Date */}
            <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Reported Date
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {formatDate(action.reportedDate)}
              </p>
            </div>

            {/* Action Taken */}
            {action.actionTaken && (
              <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Action Taken
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {getActionTakenLabel(action.actionTaken)}
                </p>
              </div>
            )}
          </div>

          {/* Reporter Information */}
          <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Reported By
              </h5>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {action.reportedByName}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Role:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {action.reportedByRole}
                </span>
              </div>
            </div>
          </div>

          {/* Incident Description */}
          <div className="bg-red-50/50 dark:bg-red-900/10 midnight:bg-red-900/10 purple:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Incident Description
              </h5>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-pre-wrap">
              {action.incidentDescription}
            </p>
          </div>

          {/* Witnesses */}
          {action.witnessNames && action.witnessNames.length > 0 && (
            <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Witnesses
                </h5>
              </div>
              <ul className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 space-y-1">
                {action.witnessNames.map((witness, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                    {witness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Investigation Details */}
          {action.investigatorName && (
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-blue-900/10 purple:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30 midnight:border-blue-700/30 purple:border-blue-700/30">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Investigation
                </h5>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Investigator:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {action.investigatorName}
                  </span>
                </div>
                {action.investigationStartDate && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Started:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formatDate(action.investigationStartDate)}
                    </span>
                  </div>
                )}
                {action.investigationEndDate && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Completed:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formatDate(action.investigationEndDate)}
                    </span>
                  </div>
                )}
                {action.investigationFindings && (
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/30">
                    <span className="text-gray-500 dark:text-gray-400 block mb-1">Findings:</span>
                    <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-pre-wrap">
                      {action.investigationFindings}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Details */}
          {action.actionDetails && (
            <div className="bg-orange-50/50 dark:bg-orange-900/10 midnight:bg-orange-900/10 purple:bg-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Action Details
                </h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-pre-wrap">
                {action.actionDetails}
              </p>
              {action.actionDate && (
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
                  Action Date: {formatDate(action.actionDate)}
                </p>
              )}
              {action.actionByName && (
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Action By: {action.actionByName}
                </p>
              )}
            </div>
          )}

          {/* Employee Statement */}
          {action.employeeStatement && (
            <div className="bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Employee Statement
                </h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-pre-wrap">
                {action.employeeStatement}
              </p>
              {action.employeeAcknowledged && action.employeeAcknowledgedDate && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Acknowledged on {formatDate(action.employeeAcknowledgedDate)}
                </p>
              )}
            </div>
          )}

          {/* HR Review */}
          {action.hrReviewed && (
            <div className="bg-purple-50/50 dark:bg-purple-900/10 midnight:bg-purple-900/10 purple:bg-purple-900/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800/30 midnight:border-purple-700/30 purple:border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  HR Review
                </h5>
              </div>
              {action.hrComments && (
                <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-pre-wrap mb-2">
                  {action.hrComments}
                </p>
              )}
              <div className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 space-y-1">
                {action.hrReviewedBy && (
                  <p>Reviewed by: {action.hrReviewedBy}</p>
                )}
                {action.hrReviewedDate && (
                  <p>Reviewed on: {formatDate(action.hrReviewedDate)}</p>
                )}
              </div>
            </div>
          )}

          {/* Follow-up */}
          {action.followUpRequired && (
            <div className="bg-yellow-50/50 dark:bg-yellow-900/10 midnight:bg-yellow-900/10 purple:bg-yellow-900/10 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/30 midnight:border-yellow-700/30 purple:border-yellow-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Follow-up Required
                </h5>
              </div>
              {action.followUpDate && (
                <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Follow-up Date: {formatDate(action.followUpDate)}
                </p>
              )}
              {action.followUpNotes && (
                <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mt-2 whitespace-pre-wrap">
                  {action.followUpNotes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
          <div className="flex justify-between items-center">
            {onEdit && action.status !== "resolved" && action.status !== "closed" && (
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-orange-700 dark:text-orange-300 midnight:text-orange-300 purple:text-orange-300 bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-900/20 purple:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 midnight:hover:bg-orange-900/30 purple:hover:bg-orange-900/30 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Action
              </button>
            )}
            <div className={`flex gap-2 ${!onEdit || action.status === "resolved" || action.status === "closed" ? "ml-auto" : ""}`}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 dark:from-red-500 dark:to-orange-500 midnight:from-red-600 midnight:to-orange-600 purple:from-red-600 purple:to-orange-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
