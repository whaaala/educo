"use client";

import { X, User, Calendar, Star, FileText, TrendingUp, Target, CheckCircle2, Clock, Building2, Mail, Award, Edit } from "lucide-react";
import { PerformanceReview } from "@/types/performance";
import PerformanceStatusBadge from "./PerformanceStatusBadge";

interface ViewPerformanceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: PerformanceReview;
  onEdit?: () => void;
}

export default function ViewPerformanceReviewModal({
  isOpen,
  onClose,
  review,
  onEdit,
}: ViewPerformanceReviewModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRatingLabel = (rating: string) => {
    const labels: Record<string, string> = {
      "outstanding": "Outstanding",
      "exceeds-expectations": "Exceeds Expectations",
      "meets-expectations": "Meets Expectations",
      "needs-improvement": "Needs Improvement",
      "unsatisfactory": "Unsatisfactory",
    };
    return labels[rating] || rating;
  };

  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      "outstanding": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      "exceeds-expectations": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "meets-expectations": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "needs-improvement": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      "unsatisfactory": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[rating] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  const getStarRating = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(score)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 midnight:from-cyan-500/10 midnight:via-blue-500/10 midnight:to-cyan-500/10 purple:from-pink-500/10 purple:via-purple-500/10 purple:to-pink-500/10 border-b border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 dark:via-blue-400/5 midnight:via-cyan-400/5 purple:via-pink-400/5 animate-pulse opacity-50"></div>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent dark:via-blue-400/40 midnight:via-cyan-400/40 purple:via-pink-400/40"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <FileText className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Performance Review Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Review ID: {review.id}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-gray-800/50 purple:hover:bg-gray-800/50 rounded-lg transition-all duration-200 hover:rotate-90 active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Staff Information */}
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 midnight:from-cyan-900/10 midnight:to-blue-900/10 purple:from-pink-900/10 purple:to-purple-900/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30">
            <div className="flex items-start gap-4">
              {review.profilePhoto ? (
                <img
                  src={review.profilePhoto}
                  alt={review.staffName}
                  className="w-16 h-16 rounded-xl ring-2 ring-blue-200 dark:ring-blue-800/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm ring-2 ring-blue-200 dark:ring-blue-900/30 flex-shrink-0">
                  {review.staffName.charAt(0)}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {review.staffName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {review.staffPosition}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {review.staffDepartment}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {review.staffEmail}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <PerformanceStatusBadge status={review.status} size="md" />
              </div>
            </div>
          </div>

          {/* Review Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Review Period */}
            <div className="bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Review Period
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {review.reviewPeriod.charAt(0).toUpperCase() + review.reviewPeriod.slice(1)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                {review.reviewQuarter ? `${review.reviewQuarter} ` : ""}{review.reviewYear}
              </p>
            </div>

            {/* Review Date */}
            <div className="bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Review Date
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {formatDate(review.reviewDate)}
              </p>
            </div>

            {/* Due Date */}
            <div className="bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Due Date
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {formatDate(review.reviewDueDate)}
              </p>
            </div>
          </div>

          {/* Reviewer Information */}
          <div className="bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Reviewer Information
              </h5>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {review.reviewerName}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Position:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {review.reviewerPosition}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 midnight:from-yellow-900/10 midnight:to-orange-900/10 purple:from-yellow-900/10 purple:to-orange-900/10 rounded-xl p-5 border border-yellow-200/50 dark:border-yellow-800/30 midnight:border-yellow-700/30 purple:border-yellow-700/30">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400" />
              <h5 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Overall Performance Rating
              </h5>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold ${getRatingColor(review.overallRating)}`}>
                  {getRatingLabel(review.overallRating)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">{getStarRating(review.averageScore)}</div>
                <span className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {review.averageScore.toFixed(1)}/5.0
                </span>
              </div>
            </div>
          </div>

          {/* Performance Criteria */}
          {review.criteria && review.criteria.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Performance Criteria
                </h5>
              </div>
              <div className="space-y-3">
                {review.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          {criterion.category}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-1">
                          {criterion.criterion}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStarRating(criterion.rating)}
                        <span className="ml-1 text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {criterion.rating}/5
                        </span>
                      </div>
                    </div>
                    {criterion.comments && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
                        {criterion.comments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {review.strengths && (
            <div className="bg-green-50/50 dark:bg-green-900/10 midnight:bg-green-900/10 purple:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800/30 midnight:border-green-700/30 purple:border-green-700/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Strengths
                </h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                {review.strengths}
              </p>
            </div>
          )}

          {/* Areas for Improvement */}
          {review.areasForImprovement && (
            <div className="bg-orange-50/50 dark:bg-orange-900/10 midnight:bg-orange-900/10 purple:bg-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Areas for Improvement
                </h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                {review.areasForImprovement}
              </p>
            </div>
          )}

          {/* Reviewer Comments */}
          {review.reviewerComments && (
            <div className="bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Reviewer Comments
                </h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                {review.reviewerComments}
              </p>
            </div>
          )}

          {/* Employee Comments */}
          {review.employeeComments && (
            <div className="bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Employee Comments
                </h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                {review.employeeComments}
              </p>
            </div>
          )}

          {/* Signatures Section */}
          {(review.reviewerSignedDate || review.employeeAcknowledgedDate || review.hrApprovedDate) && (
            <div className="bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-3">
                Signatures & Approvals
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {review.reviewerSignedDate && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Reviewer Signed:</span>
                    <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formatDate(review.reviewerSignedDate)}
                    </p>
                  </div>
                )}
                {review.employeeAcknowledgedDate && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Employee Acknowledged:</span>
                    <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formatDate(review.employeeAcknowledgedDate)}
                    </p>
                  </div>
                )}
                {review.hrApprovedDate && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">HR Approved:</span>
                    <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formatDate(review.hrApprovedDate)}
                    </p>
                    {review.hrApprovedBy && (
                      <p className="text-gray-600 dark:text-gray-400">by {review.hrApprovedBy}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50">
          <div className="flex justify-between items-center">
            {onEdit && review.status !== "completed" && (
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-orange-700 dark:text-orange-300 midnight:text-orange-300 purple:text-orange-300 bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-900/20 purple:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 midnight:hover:bg-orange-900/30 purple:hover:bg-orange-900/30 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Review
              </button>
            )}
            <div className={`flex gap-2 ${!onEdit || review.status === "completed" ? "ml-auto" : ""}`}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
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
