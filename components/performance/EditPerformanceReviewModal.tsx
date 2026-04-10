"use client";

import { useState, useEffect } from "react";
import { Edit, X, Calendar, User, Clock, Building2, FileText, BarChart3 } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { usePerformance } from "@/contexts/PerformanceContext";
import { PerformanceReview, ReviewPeriod, ReviewStatus, OverallRating } from "@/types/performance";

interface EditPerformanceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: PerformanceReview;
}

interface Reviewer {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface EditFormData {
  reviewPeriod: ReviewPeriod | "";
  reviewYear: string;
  reviewQuarter: string;
  reviewDueDate: string;
  status: ReviewStatus;
  reviewerId: string;
  reviewerName: string;
  reviewerPosition: string;
  reviewerDepartment: string;
  performanceRating: OverallRating | "";
  reviewNotes: string;
}

// Mock reviewer data with departments
const mockReviewers = [
  { id: "MGR001", name: "Dr. Adeyemi", position: "Principal", department: "Administration" },
  { id: "MGR002", name: "Mr. Williams", position: "VP Academics", department: "Administration" },
  { id: "HR001", name: "Ms. Okonkwo", position: "HR Manager", department: "Human Resources" },
  { id: "MGR003", name: "Dr. Patricia Jones", position: "VP Administration", department: "Administration" },
  { id: "MGR004", name: "Mr. Samuel Lee", position: "Academic Director", department: "Administration" },
  { id: "HR002", name: "Mrs. Grace Thompson", position: "HR Officer", department: "Human Resources" },
  { id: "MATH001", name: "Dr. Michael Roberts", position: "Mathematics HOD", department: "Mathematics" },
  { id: "SCI001", name: "Dr. Jennifer Lee", position: "Science HOD", department: "Science" },
  { id: "ENG001", name: "Prof. James Wilson", position: "English HOD", department: "English" },
];

// Get unique departments from reviewers
const getDepartments = () => {
  const departments = Array.from(new Set(mockReviewers.map(r => r.department)));
  return departments.sort();
};

export default function EditPerformanceReviewModal({
  isOpen,
  onClose,
  review,
}: EditPerformanceReviewModalProps) {
  const [formData, setFormData] = useState<EditFormData>({
    reviewPeriod: review.reviewPeriod,
    reviewYear: review.reviewYear,
    reviewQuarter: review.reviewQuarter || "",
    reviewDueDate: review.reviewDueDate,
    status: review.status,
    reviewerId: review.reviewerId,
    reviewerName: review.reviewerName,
    reviewerPosition: review.reviewerPosition,
    reviewerDepartment: "",
    performanceRating: review.overallRating,
    reviewNotes: review.reviewerComments || "",
  });

  const { updateReview } = usePerformance();

  useEffect(() => {
    if (isOpen) {
      // Find reviewer department
      const reviewer = mockReviewers.find(r => r.id === review.reviewerId);
      setFormData({
        reviewPeriod: review.reviewPeriod,
        reviewYear: review.reviewYear,
        reviewQuarter: review.reviewQuarter || "",
        reviewDueDate: review.reviewDueDate,
        status: review.status,
        reviewerId: review.reviewerId,
        reviewerName: review.reviewerName,
        reviewerPosition: review.reviewerPosition,
        reviewerDepartment: reviewer?.department || "",
        performanceRating: review.overallRating,
        reviewNotes: review.reviewerComments || "",
      });
    }
  }, [isOpen, review]);

  if (!isOpen) return null;

  const handleReviewerDepartmentChange = (department: string) => {
    setFormData({
      ...formData,
      reviewerDepartment: department,
      reviewerId: "",
      reviewerName: "",
      reviewerPosition: "",
    });
  };

  const handleReviewerChange = (reviewerId: string) => {
    const reviewer = mockReviewers.find((r) => r.id === reviewerId);
    if (reviewer) {
      setFormData({
        ...formData,
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        reviewerPosition: reviewer.position,
      });
    }
  };

  const getReviewersByDepartment = (department: string) => {
    return mockReviewers.filter(r => r.department === department);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reviewPeriod || !formData.reviewDueDate || !formData.reviewerId) {
      return;
    }

    // Update review in context
    updateReview(review.id, {
      reviewPeriod: formData.reviewPeriod as ReviewPeriod,
      reviewYear: formData.reviewYear,
      reviewQuarter: formData.reviewQuarter || undefined,
      reviewDueDate: formData.reviewDueDate,
      status: formData.status,
      reviewerId: formData.reviewerId,
      reviewerName: formData.reviewerName,
      reviewerPosition: formData.reviewerPosition,
      overallRating: formData.performanceRating as OverallRating,
      reviewerComments: formData.reviewNotes,
    });

    onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    label: (currentYear + i).toString(),
    value: (currentYear + i).toString(),
  }));

  // Check if review can be edited (not completed)
  const isCompleted = review.status === "completed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
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
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Edit Performance Review
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {review.staffName} - {review.id}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isCompleted && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 midnight:border-blue-700/30 purple:border-blue-700/30">
              <p className="text-sm text-blue-700 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300">
                This review has been completed. You can still view and update some details, but major changes should be avoided.
              </p>
            </div>
          )}

          {/* Staff Info - Read Only */}
          <div className="bg-gray-50 dark:bg-[#1a1d24]/30 midnight:bg-[#0a0e27]/30 purple:bg-[#1a0b2e]/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-3">
              {review.profilePhoto ? (
                <img
                  src={review.profilePhoto}
                  alt={review.staffName}
                  className="w-12 h-12 rounded-lg ring-2 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm ring-2 ring-blue-200 dark:ring-blue-900/30 flex-shrink-0">
                  {review.staffName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {review.staffName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {review.staffPosition} - {review.staffDepartment}
                </p>
              </div>
            </div>
          </div>

          {/* Review Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Review Status
              </h4>
            </div>
            <FormDropdown
              label="Status"
              icon={<BarChart3 className="w-4 h-4" />}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as ReviewStatus })}
              options={[
                { label: "Scheduled", value: "scheduled" },
                { label: "In Progress", value: "in-progress" },
                { label: "Completed", value: "completed" },
                { label: "Overdue", value: "overdue" },
              ]}
              required
            />
          </div>

          {/* Review Period Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Review Period
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormDropdown
                label="Review Period"
                icon={<Calendar className="w-4 h-4" />}
                value={formData.reviewPeriod}
                onChange={(value) => setFormData({ ...formData, reviewPeriod: value as ReviewPeriod | "" })}
                options={[
                  { label: "Quarterly", value: "quarterly" },
                  { label: "Half-Yearly", value: "half-yearly" },
                  { label: "Annual", value: "annual" },
                  { label: "Probation", value: "probation" },
                ]}
                required
              />
              <FormDropdown
                label="Year"
                icon={<Calendar className="w-4 h-4" />}
                value={formData.reviewYear}
                onChange={(value) => setFormData({ ...formData, reviewYear: value })}
                options={years}
                required
              />
            </div>
            {formData.reviewPeriod === "quarterly" && (
              <div className="mt-4">
                <FormDropdown
                  label="Quarter"
                  icon={<Calendar className="w-4 h-4" />}
                  value={formData.reviewQuarter}
                  onChange={(value) => setFormData({ ...formData, reviewQuarter: value })}
                  options={[
                    { label: "Q1 (Jan - Mar)", value: "Q1" },
                    { label: "Q2 (Apr - Jun)", value: "Q2" },
                    { label: "Q3 (Jul - Sep)", value: "Q3" },
                    { label: "Q4 (Oct - Dec)", value: "Q4" },
                  ]}
                  required
                />
              </div>
            )}
          </div>

          {/* Due Date */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Due Date
              </h4>
            </div>
            <FormInput
              label="Review Due Date"
              icon={<Clock className="w-4 h-4" />}
              type="date"
              value={formData.reviewDueDate}
              onChange={(value) => setFormData({ ...formData, reviewDueDate: value })}
              required
            />
          </div>

          {/* Reviewer */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 flex items-center justify-center">
                <User className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Reviewer
              </h4>
            </div>
            <div className="space-y-3">
              {/* Department Selection */}
              <FormDropdown
                label="Department"
                icon={<Building2 className="w-4 h-4" />}
                value={formData.reviewerDepartment}
                onChange={handleReviewerDepartmentChange}
                options={getDepartments().map((dept) => ({
                  label: dept,
                  value: dept,
                }))}
                required
              />
              {/* User Selection - Only show when department is selected */}
              {formData.reviewerDepartment && (
                <FormDropdown
                  label="Select Reviewer"
                  icon={<User className="w-4 h-4" />}
                  value={formData.reviewerId}
                  onChange={handleReviewerChange}
                  options={getReviewersByDepartment(formData.reviewerDepartment).map((r) => ({
                    label: `${r.name} - ${r.position}`,
                    value: r.id,
                  }))}
                  required
                />
              )}
            </div>
          </div>

          {/* Performance Rating */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Expected Performance Rating
              </h4>
            </div>
            <FormDropdown
              label="Overall Performance Rating"
              icon={<BarChart3 className="w-4 h-4" />}
              value={formData.performanceRating}
              onChange={(value) => setFormData({ ...formData, performanceRating: value as OverallRating | "" })}
              options={[
                { label: "Outstanding", value: "outstanding" },
                { label: "Exceeds Expectations", value: "exceeds-expectations" },
                { label: "Meets Expectations", value: "meets-expectations" },
                { label: "Needs Improvement", value: "needs-improvement" },
                { label: "Unsatisfactory", value: "unsatisfactory" },
              ]}
            />
          </div>

          {/* Review Notes */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Review Notes
              </h4>
            </div>
            <FormTextarea
              label="Notes & Discussion Points"
              icon={<FileText className="w-4 h-4" />}
              value={formData.reviewNotes}
              onChange={(value) => setFormData({ ...formData, reviewNotes: value })}
              placeholder="Add any notes, discussion topics, or key areas to focus on during the review..."
              rows={4}
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
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
        </form>
      </div>
    </div>
  );
}
