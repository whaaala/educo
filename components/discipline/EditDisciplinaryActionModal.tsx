"use client";

import { useState, useEffect } from "react";
import { Edit, X, AlertTriangle, Shield, Calendar, User, FileText, CheckCircle2, Clock } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { useDiscipline } from "@/contexts/DisciplineContext";
import { DisciplinaryAction, StaffIncidentStatus, StaffIncidentSeverity, ActionTaken } from "@/types/discipline";

interface EditDisciplinaryActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: DisciplinaryAction;
}

interface EditFormData {
  status: StaffIncidentStatus;
  severity: StaffIncidentSeverity;
  investigatorName: string;
  investigationStartDate: string;
  investigationEndDate: string;
  investigationFindings: string;
  actionTaken: ActionTaken | "";
  actionDetails: string;
  actionDate: string;
  actionByName: string;
  followUpRequired: boolean;
  followUpDate: string;
  followUpNotes: string;
  hrComments: string;
}

export default function EditDisciplinaryActionModal({
  isOpen,
  onClose,
  action,
}: EditDisciplinaryActionModalProps) {
  const [formData, setFormData] = useState<EditFormData>({
    status: action.status,
    severity: action.severity,
    investigatorName: action.investigatorName || "",
    investigationStartDate: action.investigationStartDate || "",
    investigationEndDate: action.investigationEndDate || "",
    investigationFindings: action.investigationFindings || "",
    actionTaken: action.actionTaken || "",
    actionDetails: action.actionDetails || "",
    actionDate: action.actionDate || "",
    actionByName: action.actionByName || "",
    followUpRequired: action.followUpRequired,
    followUpDate: action.followUpDate || "",
    followUpNotes: action.followUpNotes || "",
    hrComments: action.hrComments || "",
  });

  const { updateDisciplinaryAction } = useDiscipline();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: action.status,
        severity: action.severity,
        investigatorName: action.investigatorName || "",
        investigationStartDate: action.investigationStartDate || "",
        investigationEndDate: action.investigationEndDate || "",
        investigationFindings: action.investigationFindings || "",
        actionTaken: action.actionTaken || "",
        actionDetails: action.actionDetails || "",
        actionDate: action.actionDate || "",
        actionByName: action.actionByName || "",
        followUpRequired: action.followUpRequired,
        followUpDate: action.followUpDate || "",
        followUpNotes: action.followUpNotes || "",
        hrComments: action.hrComments || "",
      });
    }
  }, [isOpen, action]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update action in context
    updateDisciplinaryAction(action.id, {
      status: formData.status,
      severity: formData.severity,
      investigatorName: formData.investigatorName || undefined,
      investigationStartDate: formData.investigationStartDate || undefined,
      investigationEndDate: formData.investigationEndDate || undefined,
      investigationFindings: formData.investigationFindings || undefined,
      actionTaken: formData.actionTaken || undefined,
      actionDetails: formData.actionDetails || undefined,
      actionDate: formData.actionDate || undefined,
      actionByName: formData.actionByName || undefined,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate || undefined,
      followUpNotes: formData.followUpNotes || undefined,
      hrComments: formData.hrComments || undefined,
    });

    onClose();
  };

  // Check if action is resolved or closed
  const isClosed = action.status === "resolved" || action.status === "closed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-yellow-500/5 dark:from-orange-500/10 dark:via-amber-500/10 dark:to-yellow-500/10 midnight:from-orange-500/10 midnight:via-amber-500/10 midnight:to-yellow-500/10 purple:from-orange-500/10 purple:via-amber-500/10 purple:to-yellow-500/10 border-b border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 dark:via-orange-400/5 midnight:via-orange-400/5 purple:via-orange-400/5 animate-pulse opacity-50"></div>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent dark:via-orange-400/40 midnight:via-orange-400/40 purple:via-orange-400/40"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-400 dark:to-amber-500 midnight:from-orange-500 midnight:to-amber-600 purple:from-orange-500 purple:to-amber-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <Edit className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  Edit Disciplinary Action
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {action.staffName} - {action.id}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 rounded-lg transition-all duration-200 hover:rotate-90 active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isClosed && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 midnight:border-blue-700/30 purple:border-blue-700/30">
              <p className="text-sm text-blue-700 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300">
                This action has been {action.status}. You can still view and update some details, but major changes should be avoided.
              </p>
            </div>
          )}

          {/* Staff Info - Read Only */}
          <div className="bg-gray-50 dark:bg-[#1a1d24]/30 midnight:bg-[#0a0e27]/30 purple:bg-[#1a0b2e]/30 rounded-lg p-4 border border-line">
            <div className="flex items-center gap-3">
              {action.profilePhoto ? (
                <img
                  src={action.profilePhoto}
                  alt={action.staffName}
                  className="w-12 h-12 rounded-lg ring-2 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-sm ring-2 ring-red-200 dark:ring-red-900/30 flex-shrink-0">
                  {action.staffName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-semibold text-ink">
                  {action.staffName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {action.staffPosition} - {action.staffDepartment}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 midnight:text-cyan-500/70 purple:text-pink-500/70 mt-1">
                  Incident: {action.incidentType.replace(/-/g, ' ').charAt(0).toUpperCase() + action.incidentType.replace(/-/g, ' ').slice(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Status & Severity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Status & Severity
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormDropdown
                label="Status"
                icon={<AlertTriangle className="w-4 h-4" />}
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value as StaffIncidentStatus })}
                options={[
                  { label: "Reported", value: "reported" },
                  { label: "Under Investigation", value: "under-investigation" },
                  { label: "Resolved", value: "resolved" },
                  { label: "Closed", value: "closed" },
                  { label: "Escalated", value: "escalated" },
                ]}
                required
              />
              <FormDropdown
                label="Severity"
                icon={<Shield className="w-4 h-4" />}
                value={formData.severity}
                onChange={(value) => setFormData({ ...formData, severity: value as StaffIncidentSeverity })}
                options={[
                  { label: "Minor", value: "minor" },
                  { label: "Moderate", value: "moderate" },
                  { label: "Serious", value: "serious" },
                  { label: "Critical", value: "critical" },
                ]}
                required
              />
            </div>
          </div>

          {/* Investigation Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Investigation
              </h4>
            </div>
            <div className="space-y-4">
              <FormInput
                label="Investigator Name"
                icon={<User className="w-4 h-4" />}
                value={formData.investigatorName}
                onChange={(value) => setFormData({ ...formData, investigatorName: value })}
                placeholder="Enter investigator name"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Investigation Start Date"
                  icon={<Calendar className="w-4 h-4" />}
                  type="date"
                  value={formData.investigationStartDate}
                  onChange={(value) => setFormData({ ...formData, investigationStartDate: value })}
                />
                <FormInput
                  label="Investigation End Date"
                  icon={<Calendar className="w-4 h-4" />}
                  type="date"
                  value={formData.investigationEndDate}
                  onChange={(value) => setFormData({ ...formData, investigationEndDate: value })}
                />
              </div>
              <FormTextarea
                label="Investigation Findings"
                icon={<FileText className="w-4 h-4" />}
                value={formData.investigationFindings}
                onChange={(value) => setFormData({ ...formData, investigationFindings: value })}
                placeholder="Enter investigation findings and conclusions..."
                rows={4}
              />
            </div>
          </div>

          {/* Action Taken */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Action Taken
              </h4>
            </div>
            <div className="space-y-4">
              <FormDropdown
                label="Type of Action"
                icon={<CheckCircle2 className="w-4 h-4" />}
                value={formData.actionTaken}
                onChange={(value) => setFormData({ ...formData, actionTaken: value as ActionTaken | "" })}
                options={[
                  { label: "No Action", value: "" },
                  { label: "Verbal Warning", value: "verbal-warning" },
                  { label: "Written Warning", value: "written-warning" },
                  { label: "Final Warning", value: "final-warning" },
                  { label: "Suspension", value: "suspension" },
                  { label: "Demotion", value: "demotion" },
                  { label: "Termination", value: "termination" },
                  { label: "Counseling", value: "counseling" },
                  { label: "Training", value: "training" },
                  { label: "Other", value: "other" },
                ]}
              />
              <FormTextarea
                label="Action Details"
                icon={<FileText className="w-4 h-4" />}
                value={formData.actionDetails}
                onChange={(value) => setFormData({ ...formData, actionDetails: value })}
                placeholder="Provide details about the action taken..."
                rows={3}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Action Date"
                  icon={<Calendar className="w-4 h-4" />}
                  type="date"
                  value={formData.actionDate}
                  onChange={(value) => setFormData({ ...formData, actionDate: value })}
                />
                <FormInput
                  label="Action By"
                  icon={<User className="w-4 h-4" />}
                  value={formData.actionByName}
                  onChange={(value) => setFormData({ ...formData, actionByName: value })}
                  placeholder="Name of person taking action"
                />
              </div>
            </div>
          </div>

          {/* Follow-up */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Follow-up
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  checked={formData.followUpRequired}
                  onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-[#22262e] dark:border-gray-600 cursor-pointer"
                />
                <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 cursor-pointer">
                  Follow-up Required
                </label>
              </div>
              {formData.followUpRequired && (
                <>
                  <FormInput
                    label="Follow-up Date"
                    icon={<Calendar className="w-4 h-4" />}
                    type="date"
                    value={formData.followUpDate}
                    onChange={(value) => setFormData({ ...formData, followUpDate: value })}
                  />
                  <FormTextarea
                    label="Follow-up Notes"
                    icon={<FileText className="w-4 h-4" />}
                    value={formData.followUpNotes}
                    onChange={(value) => setFormData({ ...formData, followUpNotes: value })}
                    placeholder="Add notes about the follow-up..."
                    rows={3}
                  />
                </>
              )}
            </div>
          </div>

          {/* HR Comments */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                HR Comments
              </h4>
            </div>
            <FormTextarea
              label="HR Review Comments"
              icon={<FileText className="w-4 h-4" />}
              value={formData.hrComments}
              onChange={(value) => setFormData({ ...formData, hrComments: value })}
              placeholder="Add HR review comments..."
              rows={3}
            />
          </div>
          </div>

          {/* Footer - Sticky */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-line bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 dark:from-orange-500 dark:to-amber-500 midnight:from-orange-600 midnight:to-amber-600 purple:from-orange-600 purple:to-amber-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
