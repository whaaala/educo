"use client";

import React, { useState } from "react";
import { Star, Award, Target, Users } from "lucide-react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";

// Performance Review Interface
interface PerformanceReview {
  id: string;
  reviewPeriod: string;
  reviewDate: string;
  reviewer: string;
  overallRating: number; // 1-5 scale
  teachingEffectiveness: number;
  classroomManagement: number;
  professionalDevelopment: number;
  studentEngagement: number;
  collaboration: number;
  comments: string;
  status: "Completed" | "Pending" | "In Progress";
  categories: {
    name: string;
    rating: number;
    feedback: string;
  }[];
}

interface StaffPerformanceReviewsProps {
  staffName: string;
}

// Mock Performance Reviews Data
const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [
  {
    id: "1",
    reviewPeriod: "January - June 2024",
    reviewDate: "30 Jun 2024",
    reviewer: "Dr. Adeyemi - Principal",
    overallRating: 4.5,
    teachingEffectiveness: 4.7,
    classroomManagement: 4.5,
    professionalDevelopment: 4.3,
    studentEngagement: 4.8,
    collaboration: 4.4,
    comments: "Excellent performance across all areas. Strong student engagement and innovative teaching methods.",
    status: "Completed",
    categories: [
      { name: "Teaching Effectiveness", rating: 4.7, feedback: "Uses diverse teaching methods effectively" },
      { name: "Classroom Management", rating: 4.5, feedback: "Maintains excellent discipline and learning environment" },
      { name: "Professional Development", rating: 4.3, feedback: "Actively participates in training programs" },
      { name: "Student Engagement", rating: 4.8, feedback: "Outstanding ability to engage students" },
      { name: "Collaboration", rating: 4.4, feedback: "Works well with colleagues and parents" },
    ],
  },
  {
    id: "2",
    reviewPeriod: "July - December 2023",
    reviewDate: "20 Dec 2023",
    reviewer: "Mrs. Okonkwo - Vice Principal",
    overallRating: 4.2,
    teachingEffectiveness: 4.3,
    classroomManagement: 4.0,
    professionalDevelopment: 4.5,
    studentEngagement: 4.2,
    collaboration: 4.1,
    comments: "Strong performance with noticeable improvement in professional development activities.",
    status: "Completed",
    categories: [
      { name: "Teaching Effectiveness", rating: 4.3, feedback: "Good lesson planning and delivery" },
      { name: "Classroom Management", rating: 4.0, feedback: "Effective classroom control" },
      { name: "Professional Development", rating: 4.5, feedback: "Completed advanced certification" },
      { name: "Student Engagement", rating: 4.2, feedback: "Good student participation" },
      { name: "Collaboration", rating: 4.1, feedback: "Cooperative team player" },
    ],
  },
  {
    id: "3",
    reviewPeriod: "January - June 2023",
    reviewDate: "15 Jun 2023",
    reviewer: "Dr. Adeyemi - Principal",
    overallRating: 4.0,
    teachingEffectiveness: 4.1,
    classroomManagement: 3.9,
    professionalDevelopment: 4.0,
    studentEngagement: 4.2,
    collaboration: 3.8,
    comments: "Solid performance with room for growth in collaboration.",
    status: "Completed",
    categories: [
      { name: "Teaching Effectiveness", rating: 4.1, feedback: "Consistent teaching quality" },
      { name: "Classroom Management", rating: 3.9, feedback: "Good classroom discipline" },
      { name: "Professional Development", rating: 4.0, feedback: "Participates in workshops" },
      { name: "Student Engagement", rating: 4.2, feedback: "Students show good interest" },
      { name: "Collaboration", rating: 3.8, feedback: "Can improve team collaboration" },
    ],
  },
];

export default function StaffPerformanceReviews({ staffName: _staffName }: StaffPerformanceReviewsProps) {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [reviewsData] = useState<PerformanceReview[]>(MOCK_PERFORMANCE_REVIEWS);
  const [_expandedReview, _setExpandedReview] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "Completed" | "Pending" | "In Progress">("all");

  const yearOptions = [
    { label: "2024", value: "2024" },
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
  ];

  // Calculate status counts
  const statusCounts = {
    all: reviewsData.length,
    Completed: reviewsData.filter(r => r.status === "Completed").length,
    Pending: reviewsData.filter(r => r.status === "Pending").length,
    "In Progress": reviewsData.filter(r => r.status === "In Progress").length,
  };

  // Filter reviews based on status
  const filteredReviews = reviewsData.filter((review) => {
    if (statusFilter !== "all" && review.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Calculate overall statistics
  const completedReviews = reviewsData.filter(r => r.status === "Completed");
  const averageRating = completedReviews.length > 0
    ? (completedReviews.reduce((sum, r) => sum + r.overallRating, 0) / completedReviews.length).toFixed(1)
    : "0.0";
  const averageTeachingEffectiveness = completedReviews.length > 0
    ? (completedReviews.reduce((sum, r) => sum + r.teachingEffectiveness, 0) / completedReviews.length).toFixed(1)
    : "0.0";
  const averageStudentEngagement = completedReviews.length > 0
    ? (completedReviews.reduce((sum, r) => sum + r.studentEngagement, 0) / completedReviews.length).toFixed(1)
    : "0.0";

  // Get rating color
  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return "text-emerald-600 dark:text-emerald-400";
    if (rating >= 4.0) return "text-blue-600 dark:text-blue-400";
    if (rating >= 3.5) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  // Get status badge
  const getStatusBadge = (status: PerformanceReview["status"]) => {
    const variants = {
      Completed: "bg-green-100 dark:bg-green-950/30 midnight:bg-green-950/30 purple:bg-green-950/30 text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300 border-green-200 dark:border-green-800 midnight:border-green-800 purple:border-green-800",
      Pending: "bg-amber-100 dark:bg-amber-950/30 midnight:bg-amber-950/30 purple:bg-amber-950/30 text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300 border-amber-200 dark:border-amber-800 midnight:border-amber-800 purple:border-amber-800",
      "In Progress": "bg-cyan-100 dark:bg-cyan-950/30 midnight:bg-cyan-950/30 purple:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 midnight:text-cyan-300 purple:text-cyan-300 border-cyan-200 dark:border-cyan-800 midnight:border-cyan-800 purple:border-cyan-800",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${variants[status]}`}>
        <span className={`w-2 h-2 rounded-full ${status === "Completed" ? "bg-green-500" : status === "Pending" ? "bg-amber-500" : "bg-cyan-500"}`}></span>
        {status}
      </span>
    );
  };

  // Define columns for Performance Reviews DataTable
  const reviewColumns: ColumnConfig<PerformanceReview>[] = [
    {
      key: "reviewPeriod",
      label: "Review Period",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
          {item.reviewPeriod}
        </span>
      ),
    },
    {
      key: "reviewer",
      label: "Reviewer",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
          {item.reviewer}
        </span>
      ),
    },
    {
      key: "overallRating",
      label: "Overall Rating",
      sortable: true,
      className: "text-center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1">
          <Star className={`w-4 h-4 ${getRatingColor(item.overallRating)} fill-current`} />
          <span className={`text-sm font-bold ${getRatingColor(item.overallRating)}`}>
            {item.overallRating.toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      key: "reviewDate",
      label: "Review Date",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
          {item.reviewDate}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-center",
      render: (item) => getStatusBadge(item.status),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Statistics Grid - Matching ExamResults pattern */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Total Reviews Stat */}
          <div className="bg-blue-50/80 dark:bg-blue-950/30 midnight:bg-blue-950/30 purple:bg-blue-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-wide mb-0.5">
                Total Reviews
              </p>
              <p className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100 truncate leading-none">
                {reviewsData.length}
              </p>
            </div>
          </div>

          {/* Average Rating Stat */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/30 midnight:bg-emerald-950/30 purple:bg-emerald-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 fill-current" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-0.5">
                Average Rating
              </p>
              <p className="text-base sm:text-lg font-bold text-emerald-900 dark:text-emerald-100 truncate leading-none">
                {averageRating} / 5.0
              </p>
            </div>
          </div>

          {/* Teaching Effectiveness Stat */}
          <div className="bg-purple-50/80 dark:bg-purple-950/30 midnight:bg-purple-950/30 purple:bg-pink-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-pink-300" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400 uppercase tracking-wide mb-0.5">
                Teaching Score
              </p>
              <p className="text-base sm:text-lg font-bold text-purple-900 dark:text-purple-100 midnight:text-purple-100 purple:text-pink-100 truncate leading-none">
                {averageTeachingEffectiveness} / 5.0
              </p>
            </div>
          </div>

          {/* Student Engagement Stat */}
          <div className="bg-indigo-50/80 dark:bg-indigo-950/30 midnight:bg-indigo-950/30 purple:bg-indigo-950/30 rounded-xl p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md h-[88px] sm:h-[92px] flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-300" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-[0.5625rem] sm:text-[0.625rem] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-0.5">
                Engagement
              </p>
              <p className="text-base sm:text-lg font-bold text-indigo-900 dark:text-indigo-100 truncate leading-none">
                {averageStudentEngagement} / 5.0
              </p>
            </div>
          </div>
        </div>

        {/* Filter Buttons - Matching ExamResults pattern */}
        <div className="bg-surface rounded-xl border border-line shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            {/* Year Selector */}
            <div className="w-full sm:w-auto">
              <CustomDropdown
                value={selectedYear}
                options={yearOptions}
                onChange={(value) => setSelectedYear(value as string)}
                variant="blue"
                className="w-full sm:w-48"
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* All Button */}
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[0.625rem] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  All
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[0.5625rem] font-bold ${
                    statusFilter === "all"
                      ? "bg-blue-500 dark:bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-[#2a2d35] text-gray-700 dark:text-gray-300"
                  }`}>
                    {statusCounts.all}
                  </span>
                </span>
              </button>

              {/* Completed Button */}
              <button
                onClick={() => setStatusFilter("Completed")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[0.625rem] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  statusFilter === "Completed"
                    ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${statusFilter === "Completed" ? "bg-emerald-200" : "bg-gray-400 dark:bg-gray-500"}`}></span>
                  Completed
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[0.5625rem] font-bold ${
                    statusFilter === "Completed"
                      ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                      : "bg-gray-200 dark:bg-[#2a2d35] text-gray-700 dark:text-gray-300"
                  }`}>
                    {statusCounts.Completed}
                  </span>
                </span>
              </button>

              {/* Pending Button */}
              <button
                onClick={() => setStatusFilter("Pending")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[0.625rem] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  statusFilter === "Pending"
                    ? "bg-amber-600 dark:bg-amber-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${statusFilter === "Pending" ? "bg-amber-200" : "bg-gray-400 dark:bg-gray-500"}`}></span>
                  Pending
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[0.5625rem] font-bold ${
                    statusFilter === "Pending"
                      ? "bg-amber-500 dark:bg-amber-600 text-white"
                      : "bg-gray-200 dark:bg-[#2a2d35] text-gray-700 dark:text-gray-300"
                  }`}>
                    {statusCounts.Pending}
                  </span>
                </span>
              </button>

              {/* In Progress Button */}
              <button
                onClick={() => setStatusFilter("In Progress")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[0.625rem] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  statusFilter === "In Progress"
                    ? "bg-cyan-600 dark:bg-cyan-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${statusFilter === "In Progress" ? "bg-cyan-200" : "bg-gray-400 dark:bg-gray-500"}`}></span>
                  In Progress
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[0.5625rem] font-bold ${
                    statusFilter === "In Progress"
                      ? "bg-cyan-500 dark:bg-cyan-600 text-white"
                      : "bg-gray-200 dark:bg-[#2a2d35] text-gray-700 dark:text-gray-300"
                  }`}>
                    {statusCounts["In Progress"]}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Reviews Table */}
      <div className="bg-surface rounded-xl border border-line shadow-sm overflow-hidden">
        <ResponsiveListTable<PerformanceReview> variant="contained" showColumnHeaders={true}
          data={filteredReviews}
          columns={reviewColumns}
          searchPlaceholder="Search by period, reviewer, or status..."
          showSearch={true}
          defaultItemsPerPage={10}
          getRowKey={(item) => item.id}
          emptyMessage="No performance reviews found"
          enablePagination={true}
          enableItemsPerPage={true}
        />
      </div>
    </div>
  );
}
