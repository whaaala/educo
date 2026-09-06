"use client";

import { useState, useEffect } from "react";
import { PerformanceReview } from "@/types/performance";
import DataManagementPage from "@/components/pages/DataManagementPage";
import PerformanceReviewsTable from "@/components/performance/PerformanceReviewsTable";
import NewPerformanceReviewModal from "@/components/performance/NewPerformanceReviewModal";
import ViewPerformanceReviewModal from "@/components/performance/ViewPerformanceReviewModal";
import EditPerformanceReviewModal from "@/components/performance/EditPerformanceReviewModal";
import ActionModal from "@/components/shared/ActionModal";
import { usePerformance } from "@/contexts/PerformanceContext";
import {
  performanceFilterFields,
  performanceSortOptions,
  performanceStats,
  filterPerformanceReviews,
  sortPerformanceReviews,
  searchPerformanceReviews,
} from "./config";

// Mock data - replace with actual API call
const mockReviews: PerformanceReview[] = [
  {
    id: "PR001",
    staffId: "STF001",
    staffName: "Mrs. Sarah Johnson",
    staffEmail: "sarah.johnson@school.com",
    staffDepartment: "Mathematics",
    staffPosition: "Senior Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    reviewPeriod: "annual",
    reviewYear: "2024",
    reviewDate: "2024-12-01",
    reviewDueDate: "2024-12-15",
    status: "scheduled",
    reviewerId: "MGR001",
    reviewerName: "Dr. Adeyemi",
    reviewerPosition: "Principal",
    criteria: [],
    overallRating: "meets-expectations",
    averageScore: 0,
    strengths: "",
    areasForImprovement: "",
    reviewerComments: "",
    createdAt: "2024-11-01T10:30:00Z",
    updatedAt: "2024-11-01T10:30:00Z",
  },
  {
    id: "PR002",
    staffId: "STF002",
    staffName: "Mr. David Chen",
    staffEmail: "david.chen@school.com",
    staffDepartment: "Science",
    staffPosition: "Biology Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    reviewPeriod: "quarterly",
    reviewYear: "2024",
    reviewQuarter: "Q4",
    reviewDate: "2024-10-15",
    reviewDueDate: "2024-10-30",
    status: "completed",
    reviewerId: "MGR001",
    reviewerName: "Dr. Adeyemi",
    reviewerPosition: "Principal",
    criteria: [
      {
        id: "1",
        category: "Job Knowledge & Skills",
        criterion: "Technical knowledge and expertise",
        rating: 4,
        comments: "Excellent understanding of subject matter",
      },
      {
        id: "2",
        category: "Productivity & Efficiency",
        criterion: "Ability to meet deadlines",
        rating: 5,
        comments: "Always meets or exceeds deadlines",
      },
    ],
    overallRating: "exceeds-expectations",
    averageScore: 4.5,
    strengths: "Strong subject knowledge, excellent classroom management",
    areasForImprovement: "Could improve student engagement techniques",
    reviewerComments: "Outstanding performance this quarter",
    completedAt: "2024-10-30T14:20:00Z",
    createdAt: "2024-09-15T09:15:00Z",
    updatedAt: "2024-10-30T14:20:00Z",
  },
  {
    id: "PR003",
    staffId: "STF003",
    staffName: "Dr. Emily Williams",
    staffEmail: "emily.williams@school.com",
    staffDepartment: "English",
    staffPosition: "Department Head",
    profilePhoto: "https://i.pravatar.cc/150?img=47",
    reviewPeriod: "half-yearly",
    reviewYear: "2024",
    reviewDate: "2024-11-10",
    reviewDueDate: "2024-11-25",
    status: "in-progress",
    reviewerId: "MGR002",
    reviewerName: "Mr. Williams",
    reviewerPosition: "VP Academics",
    criteria: [
      {
        id: "1",
        category: "Job Knowledge & Skills",
        criterion: "Technical knowledge and expertise",
        rating: 5,
        comments: "Exceptional expertise in English literature",
      },
    ],
    overallRating: "exceeds-expectations",
    averageScore: 5,
    strengths: "Outstanding leadership, excellent department management",
    areasForImprovement: "",
    reviewerComments: "Review in progress - preliminary assessment very positive",
    createdAt: "2024-10-20T08:00:00Z",
    updatedAt: "2024-11-15T16:30:00Z",
  },
  {
    id: "PR004",
    staffId: "STF004",
    staffName: "Mr. James Brown",
    staffEmail: "james.brown@school.com",
    staffDepartment: "Physical Education",
    staffPosition: "PE Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=33",
    reviewPeriod: "quarterly",
    reviewYear: "2024",
    reviewQuarter: "Q3",
    reviewDate: "2024-09-01",
    reviewDueDate: "2024-09-20",
    status: "overdue",
    reviewerId: "MGR001",
    reviewerName: "Dr. Adeyemi",
    reviewerPosition: "Principal",
    criteria: [],
    overallRating: "meets-expectations",
    averageScore: 0,
    strengths: "",
    areasForImprovement: "",
    reviewerComments: "",
    createdAt: "2024-08-15T11:20:00Z",
    updatedAt: "2024-08-15T11:20:00Z",
  },
];

export default function PerformanceReviewsPage() {
  const { reviews: contextReviews, deleteReview } = usePerformance();
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [isNewReviewModalOpen, setIsNewReviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<PerformanceReview | null>(null);

  // Initialize with mock data and merge with context reviews
  useEffect(() => {
    console.log("Performance Reviews Page: Context reviews changed", contextReviews);
    const merged = [
      ...contextReviews,
      ...mockReviews.filter(
        mock => !contextReviews.some(ctx => ctx.id === mock.id)
      )
    ];
    console.log("Performance Reviews Page: Merged reviews", merged);

    setReviews(prev => {
      if (contextReviews.length === 0 && prev.length > 0) {
        return prev;
      }
      return merged;
    });
  }, [contextReviews]);

  // Update selected review when reviews change
  useEffect(() => {
    if (selectedReview) {
      const updated = reviews.find(rev => rev.id === selectedReview.id);
      if (updated) {
        setSelectedReview(updated);
      }
    }
  }, [reviews, selectedReview]);

  const handleExportExcel = () => {
    console.log("Export to Excel clicked");
  };

  const handleExportPDF = () => {
    console.log("Export to PDF clicked");
  };

  const handleDeleteReview = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete.id);
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
      if (selectedReview?.id === reviewToDelete.id) {
        setSelectedReview(null);
        setIsEditModalOpen(false);
      }
    }
  };

  return (
    <DataManagementPage<PerformanceReview>
      title="Performance Reviews"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Staff", href: "/staff" },
        { label: "Performance Reviews", isActive: true },
      ]}
      data={reviews}
      getRowKey={(item) => item.id}
      columns={[]}
      stats={performanceStats}
      statsColumns={{ default: 1, sm: 2, md: 4, lg: 7 }}
      filterFields={performanceFilterFields}
      sortOptions={performanceSortOptions}
      filterFn={filterPerformanceReviews}
      sortFn={sortPerformanceReviews}
      searchFn={searchPerformanceReviews}
      addButtonConfig={{
        label: "New Review",
        onClick: () => setIsNewReviewModalOpen(true),
      }}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      enableViewToggle={false}
      enableSelection={false}
      enablePagination={false}
      showTableSearch={false}
      itemLabel="performance review"
      itemLabelPlural="performance reviews"
      customListComponent={
        <PerformanceReviewsTable
          reviews={reviews}
          onViewDetails={(review) => setSelectedReview(review)}
          onEdit={(review) => {
            setSelectedReview(review);
            setIsEditModalOpen(true);
          }}
          onDelete={(review) => {
            setReviewToDelete(review);
            setIsDeleteModalOpen(true);
          }}
        />
      }
    >
      {/* New Review Modal */}
      <NewPerformanceReviewModal
        isOpen={isNewReviewModalOpen}
        onClose={() => setIsNewReviewModalOpen(false)}
      />

      {/* View Review Modal */}
      {selectedReview && !isEditModalOpen && (
        <ViewPerformanceReviewModal
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
          onEdit={() => setIsEditModalOpen(true)}
        />
      )}

      {/* Edit Review Modal */}
      {selectedReview && isEditModalOpen && (
        <EditPerformanceReviewModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          review={selectedReview}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
        title="Delete Performance Review"
        variant="danger"
        message={
          reviewToDelete
            ? `Are you sure you want to delete the performance review for ${reviewToDelete.staffName} (${reviewToDelete.id})? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Review"
        cancelLabel="Cancel"
        onConfirm={handleDeleteReview}
      />
    </DataManagementPage>
  );
}
