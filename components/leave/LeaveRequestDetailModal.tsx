"use client";

import { useState } from "react";
import { CheckCircle, XCircle, User, Calendar, FileText, Briefcase } from "lucide-react";
import { LeaveRequest } from "@/types/leave";
import LeaveStatusBadge from "./LeaveStatusBadge";
import Modal from "@/components/shared/Modal";

interface LeaveRequestDetailModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
}

export default function LeaveRequestDetailModal({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: LeaveRequestDetailModalProps) {
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
      setTimeout(() => onClose(), 100);
    }
  };

  const handleApprove = () => {
    console.log("handleApprove called", { requestId: request.id });
    if (onApprove) {
      onApprove(request.id);
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
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Leave Request Details"
        subtitle={`Request ID: ${request.id}`}
        icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
        maxWidth="4xl"
        footer={footer}
      >
        <div className="space-y-6">
          {/* Staff Information */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              Staff Information
            </h3>
            <div className="flex items-start gap-4">
              {request.profilePhoto ? (
                <img
                  src={request.profilePhoto}
                  alt={request.staffName}
                  className="w-20 h-20 rounded-full ring-4 ring-gray-200 dark:ring-gray-600 midnight:ring-cyan-500/20 purple:ring-pink-500/20 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-blue-200 dark:ring-blue-900/30">
                  {request.staffName.charAt(0)}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <p className="text-lg font-bold text-ink">
                  {request.staffName}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    <span className="font-semibold">Position:</span> {request.staffPosition}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    <span className="font-semibold">Department:</span> {request.staffDepartment}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    <span className="font-semibold">Email:</span> {request.staffEmail}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <LeaveStatusBadge status={request.status} size="md" />
                </div>
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Leave Type & Duration */}
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase">Leave Type</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-ink">
                  {request.leaveType}
                </p>
                <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                  Duration: {request.numberOfDays} day{request.numberOfDays > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Leave Period */}
            <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase">Leave Period</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                  <span className="font-semibold">Start:</span> {formatDate(request.startDate)}
                </p>
                <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                  <span className="font-semibold">End:</span> {formatDate(request.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20">
                <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
              </div>
              Reason for Leave
            </h3>
            <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 whitespace-pre-wrap">
              {request.reason}
            </p>
          </div>

          {/* Request Timeline */}
          <div className="bg-white dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 border border-line rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-ink mb-4">
              Request Timeline
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Requested on:</span>
                <span className="font-semibold text-ink">
                  {formatDate(request.requestedDate)}
                </span>
              </div>
              {request.managerName && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Reporting to:</span>
                  <span className="font-semibold text-ink">
                    {request.managerName}
                  </span>
                </div>
              )}
              {request.approvedDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Approved on:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatDateTime(request.approvedDate)}
                  </span>
                </div>
              )}
              {request.rejectionDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Rejected on:</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {formatDateTime(request.rejectionDate)}
                  </span>
                </div>
              )}
              {request.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 midnight:border-red-800 purple:border-red-800">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-900 dark:text-red-300 midnight:text-red-300 purple:text-red-300">
                    {request.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Leave Request"
          subtitle="Please provide a reason for rejection"
          icon={<XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:text-white midnight:text-cyan-50 purple:text-pink-50 resize-none"
                rows={4}
                placeholder="Please explain why this leave request is being rejected..."
                required
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-6 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-[#2a2d35] dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
