"use client";

import { useState } from "react";
import { X, CheckCircle, XCircle, Play, User, Calendar, FileText, AlertCircle, DollarSign, Building2 } from "lucide-react";
import { TransferRequest } from "@/types/transfer";
import TransferStatusBadge from "./TransferStatusBadge";
import TransferTypeBadge from "./TransferTypeBadge";

interface TransferRequestDetailModalProps {
  request: TransferRequest;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  onProcess: (requestId: string) => void;
}

export default function TransferRequestDetailModal({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onProcess,
}: TransferRequestDetailModalProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(request.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason("");
      onClose();
    }
  };

  const handleApprove = () => {
    onApprove(request.id);
    onClose();
  };

  const handleProcess = () => {
    onProcess(request.id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-500 dark:via-blue-600 dark:to-purple-500 midnight:from-cyan-600 midnight:via-cyan-700 midnight:to-purple-600 purple:from-pink-600 purple:via-pink-700 purple:to-purple-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Transfer Request Details
                </h2>
                <p className="text-sm text-white/90">Request ID: {request.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/20 active:bg-white/30 transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Student Information */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 midnight:from-cyan-900/20 midnight:to-purple-900/20 purple:from-pink-900/20 purple:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30">
              <div className="flex items-start gap-4">
                {request.profilePhoto ? (
                  <img
                    src={request.profilePhoto}
                    alt={request.studentName}
                    className="w-16 h-16 rounded-xl object-cover ring-4 ring-white dark:ring-gray-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-gray-800">
                    {request.studentName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
                    {request.studentName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-3">
                    Admission No: {request.studentAdmissionNumber}
                  </p>
                  <div className="flex items-center gap-3">
                    <TransferStatusBadge status={request.status} />
                    <TransferTypeBadge type={request.transferType} />
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source */}
              <div className="bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase tracking-wider mb-4">
                  Current Location
                </h4>
                <div className="space-y-3">
                  {request.sourceBranchName && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Branch</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {request.sourceBranchName}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Class & Section</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {request.sourceClass} - Section {request.sourceSection}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase tracking-wider mb-4">
                  Destination
                </h4>
                <div className="space-y-3">
                  {request.destinationBranchName && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Branch</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {request.destinationBranchName}
                        </p>
                      </div>
                    </div>
                  )}
                  {request.destinationClass && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Class & Section</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {request.destinationClass} {request.destinationSection && `- Section ${request.destinationSection}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {request.destinationSchoolName && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">School</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {request.destinationSchoolName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                    Reason for Transfer
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {request.reason}
                  </p>
                </div>
              </div>
              {request.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Additional Notes
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {request.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline & Financial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Timeline */}
              <div className="bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Requested</p>
                    <p className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formatDate(request.requestedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Effective Date</p>
                    <p className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formatDate(request.effectiveDate)}
                    </p>
                  </div>
                  {request.approvedDate && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
                      <p className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {formatDate(request.approvedDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial */}
              <div className="bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Status
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Clearance</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      request.financialClearance === "cleared"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}>
                      {request.financialClearance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fee Structure Updated</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      request.feeStructureUpdated
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                    }`}>
                      {request.feeStructureUpdated ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requested By */}
            <div className="bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-3">
                Requested By
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                  {request.requestedByName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {request.requestedByName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {request.requestedByRole}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Close
              </button>

              {request.status === "pending" && (
                <>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </>
              )}

              {request.status === "approved" && (
                <button
                  onClick={handleProcess}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Process Transfer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
              Reject Transfer Request
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-4">
              Please provide a reason for rejecting this transfer request.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
