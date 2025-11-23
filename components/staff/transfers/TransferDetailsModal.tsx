"use client";

import { StaffTransferRequest } from "@/types/staffTransfer";
import {
  X,
  User,
  Mail,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  FileText,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import StaffTransferStatusBadge from "./StaffTransferStatusBadge";
import StaffTransferTypeBadge from "./StaffTransferTypeBadge";

interface TransferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: StaffTransferRequest;
  onApprove?: (transferId: string) => void;
  onReject?: (transferId: string, reason: string) => void;
  onProcess?: (transferId: string) => void;
}

export default function TransferDetailsModal({
  isOpen,
  onClose,
  transfer,
  onApprove,
  onReject,
  onProcess,
}: TransferDetailsModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTransferChange = () => {
    switch (transfer.transferType) {
      case "department":
        return {
          label: "Department Transfer",
          from: transfer.currentDepartment,
          to: transfer.newDepartment,
          icon: Building2,
        };
      case "branch":
        return {
          label: "Branch Transfer",
          from: transfer.currentBranch,
          to: transfer.newBranch,
          icon: MapPin,
        };
      case "designation":
        return {
          label: "Designation Change",
          from: transfer.currentDesignation,
          to: transfer.newDesignation,
          icon: Briefcase,
        };
      case "location":
        return {
          label: "Location Transfer",
          from: transfer.currentLocation,
          to: transfer.newLocation,
          icon: MapPin,
        };
      case "promotion":
        return {
          label: "Promotion",
          from: transfer.currentDesignation,
          to: transfer.newDesignation || "Pay Raise",
          icon: TrendingUp,
        };
      case "termination":
        const terminationTypeMap: Record<string, string> = {
          resignation: "Resignation",
          dismissal: "Dismissal",
          retirement: "Retirement",
          "contract-end": "Contract End",
          "mutual-agreement": "Mutual Agreement",
        };
        return {
          label: "Staff Termination",
          from: transfer.currentDesignation,
          to: terminationTypeMap[transfer.terminationType || "dismissal"] || "Termination",
          icon: AlertTriangle,
        };
      default:
        return {
          label: "Transfer",
          from: "-",
          to: "-",
          icon: ArrowRight,
        };
    }
  };

  const transferChange = getTransferChange();
  const Icon = transferChange.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 midnight:from-cyan-900/10 midnight:to-cyan-800/10 purple:from-pink-900/10 purple:to-pink-800/10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Staff Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {transfer.profilePhoto ? (
                  <img
                    src={transfer.profilePhoto}
                    alt={transfer.staffName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  transfer.staffName.split(" ").map((n) => n[0]).join("")
                )}
              </div>

              {/* Header Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Transfer Request Details
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-1">
                  Request ID: <span className="font-semibold">{transfer.id}</span>
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <StaffTransferStatusBadge status={transfer.status} />
                  <StaffTransferTypeBadge type={transfer.transferType} size="sm" />
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Staff Information Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-xl p-5 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Staff Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {transfer.staffName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {transfer.staffEmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Staff ID</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {transfer.staffId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Designation</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {transfer.currentDesignation}
                  </p>
                </div>
              </div>
            </div>

            {/* Transfer Change Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-cyan-900/20 midnight:to-cyan-800/20 purple:from-pink-900/20 purple:to-pink-800/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {transferChange.label}
              </h3>
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {transferChange.from || "-"}
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="flex-1 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">New</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {transferChange.to || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Promotion Details (if applicable) */}
            {transfer.transferType === "promotion" && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 midnight:from-amber-900/20 midnight:to-yellow-900/20 purple:from-amber-900/20 purple:to-yellow-900/20 rounded-xl p-5 border-2 border-amber-200 dark:border-amber-800/50 midnight:border-amber-500/30 purple:border-amber-500/30">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  Promotion Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transfer.currentSalary && transfer.newSalary && (
                    <>
                      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Salary</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          ₦{transfer.currentSalary.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">New Salary</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          ₦{transfer.newSalary.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Salary Increase</p>
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                          ₦{(transfer.newSalary - transfer.currentSalary).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Percentage Increase</p>
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                          {(((transfer.newSalary - transfer.currentSalary) / transfer.currentSalary) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {transfer.newResponsibilities && (
                  <div className="mt-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">New Responsibilities</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 whitespace-pre-wrap">
                      {transfer.newResponsibilities}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Termination Details (if applicable) */}
            {transfer.transferType === "termination" && (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 midnight:from-red-900/20 midnight:to-rose-900/20 purple:from-red-900/20 purple:to-rose-900/20 rounded-xl p-5 border-2 border-red-200 dark:border-red-800/50 midnight:border-red-500/30 purple:border-red-500/30">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Termination Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transfer.lastWorkingDay && (
                    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-red-200 dark:border-red-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Working Day</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {formatDate(transfer.lastWorkingDay)}
                      </p>
                    </div>
                  )}
                  {transfer.severancePackage && transfer.severancePackage > 0 && (
                    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-red-200 dark:border-red-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Severance Package</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        ₦{transfer.severancePackage.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                {transfer.terminationReason && (
                  <div className="mt-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-red-200 dark:border-red-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Termination Reason</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 whitespace-pre-wrap">
                      {transfer.terminationReason}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Current Position Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Current Department
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {transfer.currentDepartment}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Current Branch
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {transfer.currentBranch}
                </p>
              </div>
              {transfer.currentLocation && (
                <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Current Location
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {transfer.currentLocation}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-xl p-5 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Request Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {formatDate(transfer.transferDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Effective Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {formatDate(transfer.effectiveDate)}
                  </p>
                </div>
                {transfer.approvalDate && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Approval Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formatDate(transfer.approvalDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reason Section */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                Transfer Reason
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 whitespace-pre-wrap">
                {transfer.reason}
              </p>
            </div>

            {/* Remarks (if any) */}
            {transfer.remarks && (
              <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  Additional Remarks
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 whitespace-pre-wrap">
                  {transfer.remarks}
                </p>
              </div>
            )}

            {/* Approval Section (if approved/rejected) */}
            {(transfer.approvedBy || transfer.rejectedBy) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-xl p-5 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
                  Approval Information
                </h3>
                {transfer.approvedBy && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Approved By</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {transfer.approvedBy}
                    </p>
                  </div>
                )}
                {transfer.rejectedBy && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rejected By</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {transfer.rejectedBy}
                    </p>
                  </div>
                )}
                {transfer.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-900 dark:text-red-200">
                      {transfer.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {transfer.status === "pending" && (onApprove || onReject) && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-gray-800/50 midnight:bg-cyan-900/5 purple:bg-pink-900/5">
            <div className="flex items-center justify-end gap-3">
              {onReject && (
                <button
                  onClick={() => {
                    const reason = prompt("Please provide a reason for rejection:");
                    if (reason) {
                      onReject(transfer.id, reason);
                      onClose();
                    }
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 border-2 border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Request
                </button>
              )}
              {onApprove && (
                <button
                  onClick={() => {
                    onApprove(transfer.id);
                    onClose();
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Request
                </button>
              )}
            </div>
          </div>
        )}

        {transfer.status === "approved" && onProcess && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-gray-800/50 midnight:bg-cyan-900/5 purple:bg-pink-900/5">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  onProcess(transfer.id);
                  onClose();
                }}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Process Transfer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
