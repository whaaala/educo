"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Play, User, Calendar, FileText, DollarSign, Building2, ArrowRight } from "lucide-react";
import { TransferRequest } from "@/types/transfer";
import TransferStatusBadge from "./TransferStatusBadge";
import TransferTypeBadge from "./TransferTypeBadge";
import Modal from "@/components/shared/Modal";

interface TransferRequestDetailModalProps {
  request: TransferRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onProcess?: (requestId: string) => void;
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

  if (!request) return null;

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

  const handleReject = () => {
    console.log("handleReject called", { rejectionReason, requestId: request.id });
    if (rejectionReason.trim() && onReject) {
      onReject(request.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason("");
      // Don't close the modal immediately - let the parent update the request first
      setTimeout(() => onClose(), 100);
    }
  };

  const handleApprove = () => {
    console.log("handleApprove called", { requestId: request.id });
    if (onApprove) {
      onApprove(request.id);
      // Don't close the modal immediately - let the parent update the request first
      // setTimeout(() => onClose(), 100);
    }
  };

  const handleProcess = () => {
    console.log("handleProcess called", { requestId: request.id });
    if (onProcess) {
      onProcess(request.id);
      // Don't close the modal immediately - let the parent update the request first
      setTimeout(() => onClose(), 100);
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-[#2a2d35] dark:hover:bg-gray-500 midnight:bg-gray-700 midnight:hover:bg-gray-600 purple:bg-gray-700 purple:hover:bg-gray-600 text-ink font-semibold transition-colors cursor-pointer"
      >
        Close
      </button>

      {request.status === "pending" && onReject && onApprove && (
        <>
          <button
            onClick={() => setShowRejectModal(true)}
            className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={handleApprove}
            className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
        </>
      )}

      {request.status === "approved" && onProcess && (
        <button
          onClick={handleProcess}
          className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Play className="w-4 h-4" />
          Process Transfer
        </button>
      )}
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Transfer Request Details"
        subtitle={`Request ID: ${request.id}`}
        icon={<ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
        maxWidth="4xl"
        footer={footer}
      >
        <div className="space-y-6">
          {/* Student Information */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              Student Information
            </h3>
            <div className="flex items-start gap-4">
              {request.profilePhoto ? (
                <img
                  src={request.profilePhoto}
                  alt={request.studentName}
                  className="w-20 h-20 rounded-full ring-4 ring-gray-200 dark:ring-gray-600 midnight:ring-cyan-500/20 purple:ring-pink-500/20 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-blue-200 dark:ring-blue-900/30">
                  {request.studentName.charAt(0)}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <p className="text-lg font-bold text-ink">
                  {request.studentName}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Admission No:</span> {request.studentAdmissionNumber}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Class:</span> {request.sourceClass} {request.sourceSection}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <TransferStatusBadge status={request.status} size="md" />
                  <TransferTypeBadge type={request.transferType} size="md" />
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Location */}
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Current Location</p>
              </div>
              <div className="space-y-2 text-sm">
                {request.sourceBranchName && (
                  <p className="font-bold text-ink">
                    {request.sourceBranchName}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                  {request.sourceClass} - Section {request.sourceSection}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Destination</p>
              </div>
              <div className="space-y-2 text-sm">
                {request.destinationBranchName && (
                  <p className="font-bold text-ink">
                    {request.destinationBranchName}
                  </p>
                )}
                {request.destinationClass && (
                  <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                    {request.destinationClass} {request.destinationSection && `- Section ${request.destinationSection}`}
                  </p>
                )}
                {request.destinationSchoolName && (
                  <p className="font-bold text-ink">
                    {request.destinationSchoolName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Transfer Reason */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              Reason for Transfer
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 leading-relaxed">
              {request.reason}
            </p>
            {request.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Additional Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                  {request.notes}
                </p>
              </div>
            )}
          </div>

          {/* Timeline & Financial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Timeline */}
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Timeline</p>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Requested</p>
                  <p className="font-bold text-ink">
                    {formatDate(request.requestedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Effective Date</p>
                  <p className="font-bold text-ink">
                    {formatDate(request.effectiveDate)}
                  </p>
                </div>
                {request.approvedDate && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
                    <p className="font-bold text-ink">
                      {formatDateTime(request.approvedDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Status */}
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Financial Status</p>
              </div>
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fee Structure</span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    request.feeStructureUpdated
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-[#0f1115]/20 dark:text-gray-400"
                  }`}>
                    {request.feeStructureUpdated ? "Updated" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Requested By */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-ink mb-3">
              Requested By
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Name:</span> {request.requestedByName}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Role:</span> {request.requestedByRole}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Requested on:</span> {formatDateTime(request.requestedDate)}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => {
            setShowRejectModal(false);
            setRejectionReason("");
          }}
        >
          <div
            className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-ink mb-4">
              Reject Transfer Request
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-4">
              Please provide a reason for rejecting this transfer request.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-ink focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
