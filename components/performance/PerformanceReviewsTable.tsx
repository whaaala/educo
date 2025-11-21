"use client";

import { useState, useEffect } from "react";
import { PerformanceReview } from "@/types/performance";
import { Eye, Edit, Trash2 } from "lucide-react";
import PerformanceStatusBadge from "./PerformanceStatusBadge";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import Tooltip from "@/components/shared/Tooltip";

interface PerformanceReviewsTableProps {
  reviews: PerformanceReview[];
  onViewDetails: (review: PerformanceReview) => void;
  onEdit?: (review: PerformanceReview) => void;
  onDelete?: (review: PerformanceReview) => void;
  filterKey?: string;
}

export default function PerformanceReviewsTable({
  reviews,
  onViewDetails,
  onEdit,
  onDelete,
  filterKey = "",
}: PerformanceReviewsTableProps) {
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Trigger animation when filterKey changes
  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger(prev => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
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
      "outstanding": "text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400",
      "exceeds-expectations": "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
      "meets-expectations": "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
      "needs-improvement": "text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
      "unsatisfactory": "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    };
    return colors[rating] || "text-gray-600 dark:text-gray-400";
  };

  // Define columns for DataTable
  const columns: ColumnConfig<PerformanceReview>[] = [
    {
      key: "id",
      label: "Review ID",
      sortable: true,
      className: "text-left",
      render: (review) => {
        return (
          <Tooltip content={`Review ID: ${review.id}`}>
            <div className="font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 whitespace-nowrap truncate max-w-[100px]" style={{ fontSize: '11.8px' }}>
              {review.id}
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "staffName",
      label: "Staff Member",
      sortable: true,
      className: "text-left",
      render: (review) => {
        const staffInfo = `${review.staffName} - ${review.staffPosition}`;
        return (
          <Tooltip content={staffInfo}>
            <div className="flex items-center gap-2.5">
              {review.profilePhoto ? (
                <img
                  src={review.profilePhoto}
                  alt={review.staffName}
                  className="w-9 h-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-blue-200 dark:ring-blue-900/30 flex-shrink-0" style={{ fontSize: '11.8px' }}>
                  {review.staffName.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate max-w-[140px]" style={{ fontSize: '11.8px' }}>
                  {review.staffName}
                </div>
                <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate max-w-[140px]" style={{ fontSize: '10px' }}>
                  {review.staffPosition}
                </div>
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "reviewPeriod",
      label: "Review Period",
      sortable: true,
      className: "text-left",
      render: (review) => {
        const periodLabel = review.reviewPeriod === "quarterly" && review.reviewQuarter
          ? `${review.reviewQuarter} ${review.reviewYear}`
          : `${review.reviewPeriod.charAt(0).toUpperCase() + review.reviewPeriod.slice(1)} ${review.reviewYear}`;

        return (
          <Tooltip content={periodLabel}>
            <div className="flex flex-col">
              <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
                {review.reviewPeriod.charAt(0).toUpperCase() + review.reviewPeriod.slice(1)}
              </div>
              <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70" style={{ fontSize: '10px' }}>
                {review.reviewQuarter || review.reviewYear}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "overallRating",
      label: "Overall Rating",
      sortable: true,
      className: "text-left",
      render: (review) => {
        return (
          <Tooltip content={`Score: ${review.averageScore.toFixed(1)}/5`}>
            <div className="flex flex-col">
              <div className={`font-semibold whitespace-nowrap ${getRatingColor(review.overallRating)}`} style={{ fontSize: '11.8px' }}>
                {getRatingLabel(review.overallRating)}
              </div>
              <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70" style={{ fontSize: '10px' }}>
                Score: {review.averageScore.toFixed(1)}/5
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left",
      render: (review) => <PerformanceStatusBadge status={review.status} size="sm" />,
    },
    {
      key: "reviewDate",
      label: "Review Date",
      sortable: true,
      className: "text-left",
      sortValue: (review) => new Date(review.reviewDate).getTime(),
      render: (review) => {
        return (
          <Tooltip content={`Due: ${formatDate(review.reviewDueDate)}`}>
            <div className="flex flex-col">
              <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 whitespace-nowrap" style={{ fontSize: '11.8px' }}>
                {formatDate(review.reviewDate)}
              </div>
              <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70" style={{ fontSize: '10px' }}>
                Due: {formatDate(review.reviewDueDate)}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "text-center",
      render: (review) => (
        <div className="flex items-center justify-center gap-2.5">
          <Tooltip content="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(review);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-cyan-950/30 midnight:to-cyan-900/20 purple:from-pink-950/30 purple:to-pink-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 midnight:hover:from-cyan-900/40 midnight:hover:to-cyan-800/30 purple:hover:from-pink-900/40 purple:hover:to-pink-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/50 purple:hover:border-pink-500/50 active:scale-95"
              aria-label="View Details"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 midnight:group-hover:text-cyan-300 purple:group-hover:text-pink-300 transition-colors" />
            </button>
          </Tooltip>
          {onEdit && review.status !== "completed" && (
            <Tooltip content="Edit Review">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(review);
                }}
                className="group relative p-2 rounded-lg bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 midnight:from-orange-950/30 midnight:to-orange-900/20 purple:from-orange-950/30 purple:to-orange-900/20 hover:from-orange-100 hover:to-orange-100 dark:hover:from-orange-900/40 dark:hover:to-orange-800/30 midnight:hover:from-orange-900/40 midnight:hover:to-orange-800/30 purple:hover:from-orange-900/40 purple:hover:to-orange-800/30 transition-all duration-200 cursor-pointer border border-orange-200/40 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30 hover:border-orange-400/60 dark:hover:border-orange-600/50 midnight:hover:border-orange-500/50 purple:hover:border-orange-500/50 active:scale-95"
                aria-label="Edit Review"
              >
                <Edit className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 midnight:group-hover:text-orange-300 purple:group-hover:text-orange-300 transition-colors" />
              </button>
            </Tooltip>
          )}
          {onDelete && review.status !== "completed" && (
            <Tooltip content="Delete Review">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(review);
                }}
                className="group relative p-2 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 midnight:from-red-950/30 midnight:to-red-900/20 purple:from-red-950/30 purple:to-red-900/20 hover:from-red-100 hover:to-red-100 dark:hover:from-red-900/40 dark:hover:to-red-800/30 midnight:hover:from-red-900/40 midnight:hover:to-red-800/30 purple:hover:from-red-900/40 purple:hover:to-red-800/30 transition-all duration-200 cursor-pointer border border-red-200/40 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30 hover:border-red-400/60 dark:hover:border-red-600/50 midnight:hover:border-red-500/50 purple:hover:border-red-500/50 active:scale-95"
                aria-label="Delete Review"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 midnight:group-hover:text-red-300 purple:group-hover:text-red-300 transition-colors" />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden">
      <DataTable<PerformanceReview>
        data={reviews}
        columns={columns}
        title="Performance Reviews"
        searchPlaceholder="Search by staff name, position, or review ID..."
        showSearch={true}
        defaultItemsPerPage={10}
        getRowKey={(item) => item.id}
        emptyMessage="No performance reviews found"
        enablePagination={true}
        enableItemsPerPage={true}
        onRowClick={onViewDetails}
      />
    </div>
  );
}
