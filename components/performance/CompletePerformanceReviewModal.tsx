"use client";

import { useState, useEffect } from "react";
import { Star, X, FileText, BarChart3, Target, CheckCircle, User } from "lucide-react";
import FormTextarea from "@/components/shared/FormTextarea";
import FormDropdown from "@/components/shared/FormDropdown";
import { usePerformance } from "@/contexts/PerformanceContext";
import { PerformanceReview, OverallRating, PerformanceCriteria, PerformanceGoal, PERFORMANCE_CATEGORIES } from "@/types/performance";

interface CompletePerformanceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: PerformanceReview;
}

export default function CompletePerformanceReviewModal({
  isOpen,
  onClose,
  review,
}: CompletePerformanceReviewModalProps) {
  const [formData, setFormData] = useState({
    criteria: [] as PerformanceCriteria[],
    overallRating: "" as OverallRating | "",
    strengths: "",
    areasForImprovement: "",
    reviewerComments: "",
    newGoals: [] as PerformanceGoal[],
  });

  const { updateReview } = usePerformance();

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        criteria: [],
        overallRating: "",
        strengths: "",
        areasForImprovement: "",
        reviewerComments: "",
        newGoals: [],
      });
    } else {
      // Initialize criteria from categories
      const initialCriteria: PerformanceCriteria[] = [];
      PERFORMANCE_CATEGORIES.forEach((category) => {
        category.criteria.forEach((criterion) => {
          initialCriteria.push({
            id: `${category.id}-${criterion.toLowerCase().replace(/\s+/g, "-")}`,
            category: category.name,
            criterion,
            rating: 3, // Default to "Meets Expectations"
            comments: "",
          });
        });
      });
      setFormData({ ...formData, criteria: initialCriteria });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCriteriaRatingChange = (id: string, rating: number) => {
    const newCriteria = formData.criteria.map((c) =>
      c.id === id ? { ...c, rating } : c
    );
    setFormData({ ...formData, criteria: newCriteria });
  };

  const handleCriteriaCommentChange = (id: string, comments: string) => {
    const newCriteria = formData.criteria.map((c) =>
      c.id === id ? { ...c, comments } : c
    );
    setFormData({ ...formData, criteria: newCriteria });
  };

  const calculateAverageScore = () => {
    if (formData.criteria.length === 0) return 0;
    const sum = formData.criteria.reduce((acc, c) => acc + c.rating, 0);
    return Number((sum / formData.criteria.length).toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.overallRating || !formData.strengths || !formData.areasForImprovement) {
      return;
    }

    const averageScore = calculateAverageScore();

    // Update review with completed information
    updateReview(review.id, {
      ...review,
      criteria: formData.criteria,
      overallRating: formData.overallRating as OverallRating,
      averageScore,
      strengths: formData.strengths,
      areasForImprovement: formData.areasForImprovement,
      reviewerComments: formData.reviewerComments,
      newGoals: formData.newGoals,
      status: "completed",
      completedAt: new Date().toISOString(),
      reviewerSignedDate: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 dark:from-green-500/10 dark:via-emerald-500/10 dark:to-teal-500/10 midnight:from-cyan-500/10 midnight:via-blue-500/10 midnight:to-cyan-500/10 purple:from-pink-500/10 purple:via-purple-500/10 purple:to-pink-500/10 border-b border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 dark:via-green-400/5 midnight:via-cyan-400/5 purple:via-pink-400/5 animate-pulse opacity-50"></div>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent dark:via-green-400/40 midnight:via-cyan-400/40 purple:via-pink-400/40"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <CheckCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  Complete Performance Review
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {review.staffName} - {review.reviewPeriod} {review.reviewYear}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Staff Info Card */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {review.staffName.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-ink">
                  {review.staffName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.staffPosition} • {review.staffDepartment}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Criteria */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Performance Criteria
              </h4>
            </div>

            <div className="space-y-4">
              {PERFORMANCE_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="p-4 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg border border-line"
                >
                  <h5 className="text-sm font-semibold text-ink mb-3">
                    {category.name}
                  </h5>
                  <div className="space-y-3">
                    {category.criteria.map((criterion) => {
                      const criterionId = `${category.id}-${criterion.toLowerCase().replace(/\s+/g, "-")}`;
                      const criterionData = formData.criteria.find((c) => c.id === criterionId);

                      return (
                        <div key={criterionId} className="space-y-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400">{criterion}</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => handleCriteriaRatingChange(criterionId, rating)}
                                className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                                  criterionData?.rating === rating
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white dark:bg-[#22262e] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#2a2d35]"
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30 flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Overall Rating
              </h4>
            </div>
            <FormDropdown
              label="Overall Performance Rating"
              icon={<Star className="w-4 h-4" />}
              value={formData.overallRating}
              onChange={(value) => setFormData({ ...formData, overallRating: value as OverallRating | "" })}
              options={[
                { label: "Outstanding", value: "outstanding" },
                { label: "Exceeds Expectations", value: "exceeds-expectations" },
                { label: "Meets Expectations", value: "meets-expectations" },
                { label: "Needs Improvement", value: "needs-improvement" },
                { label: "Unsatisfactory", value: "unsatisfactory" },
              ]}
              required
            />
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Average Score: {calculateAverageScore()} / 5.0
            </div>
          </div>

          {/* Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Strengths
              </h4>
            </div>
            <FormTextarea
              label="Key Strengths"
              icon={<CheckCircle className="w-4 h-4" />}
              value={formData.strengths}
              onChange={(value) => setFormData({ ...formData, strengths: value })}
              placeholder="Describe the employee's key strengths and positive contributions..."
              rows={3}
              required
            />
          </div>

          {/* Areas for Improvement */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30 flex items-center justify-center">
                <Target className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Areas for Improvement
              </h4>
            </div>
            <FormTextarea
              label="Development Areas"
              icon={<Target className="w-4 h-4" />}
              value={formData.areasForImprovement}
              onChange={(value) => setFormData({ ...formData, areasForImprovement: value })}
              placeholder="Identify areas where the employee can improve and develop..."
              rows={3}
              required
            />
          </div>

          {/* Reviewer Comments */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Additional Comments
              </h4>
            </div>
            <FormTextarea
              label="Reviewer's Comments"
              icon={<FileText className="w-4 h-4" />}
              value={formData.reviewerComments}
              onChange={(value) => setFormData({ ...formData, reviewerComments: value })}
              placeholder="Add any additional comments, observations, or recommendations..."
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-line bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
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
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 dark:from-green-500 dark:to-emerald-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
              >
                Complete Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
