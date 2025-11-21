"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { PerformanceReview, ReviewStatus, ReviewPeriod } from "@/types/performance";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import PerformanceStatisticsCards from "@/components/performance/PerformanceStatisticsCards";
import PerformanceReviewsTable from "@/components/performance/PerformanceReviewsTable";
import NewPerformanceReviewModal from "@/components/performance/NewPerformanceReviewModal";
import ViewPerformanceReviewModal from "@/components/performance/ViewPerformanceReviewModal";
import EditPerformanceReviewModal from "@/components/performance/EditPerformanceReviewModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import { usePerformance } from "@/contexts/PerformanceContext";
// Import will be added when needed for export functionality

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
  const { reviews: contextReviews, updateReview, deleteReview } = usePerformance();
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "all">("all");
  const [filterPeriod, setFilterPeriod] = useState<ReviewPeriod | "all">("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesStatus = filterStatus === "all" || review.status === filterStatus;
      const matchesPeriod = filterPeriod === "all" || review.reviewPeriod === filterPeriod;
      const matchesYear = filterYear === "all" || review.reviewYear === filterYear;
      const matchesSearch = searchQuery === "" ||
        review.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.staffPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesPeriod && matchesYear && matchesSearch;
    });
  }, [reviews, filterStatus, filterPeriod, filterYear, searchQuery]);


  const handleExportExcel = () => {
    // Export functionality will be added later
    console.log("Export to Excel clicked");
  };

  const handleExportPDF = () => {
    // Export functionality will be added later
    console.log("Export to PDF clicked");
  };

  const handleDeleteReview = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete.id);
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
      // Close view/edit modals if the deleted review was selected
      if (selectedReview?.id === reviewToDelete.id) {
        setSelectedReview(null);
        setIsEditModalOpen(false);
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Breadcrumbs and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <PageHeader
            title="Performance Reviews"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Staff", href: "/staff" },
              { label: "Performance Reviews", isActive: true },
            ]}
          />
          <PageActions
            actions={[
              {
                label: "New Review",
                icon: Plus,
                onClick: () => setIsNewReviewModalOpen(true),
                variant: "primary",
              },
            ]}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            exportDescription="Download performance reviews data"
          />
        </div>

        {/* Statistics Cards */}
        <PerformanceStatisticsCards reviews={reviews} />

        {/* Search and Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by staff name, position, or review ID..."
          filters={[
            {
              label: "Year Filter",
              value: filterYear,
              onChange: (value) => setFilterYear(value as string),
              options: [
                { label: "All Years", value: "all" },
                { label: "2025", value: "2025" },
                { label: "2024", value: "2024" },
                { label: "2023", value: "2023" },
              ],
            },
            {
              label: "Period Filter",
              value: filterPeriod,
              onChange: (value) => setFilterPeriod(value as ReviewPeriod | "all"),
              options: [
                { label: "All Periods", value: "all" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Half-Yearly", value: "half-yearly" },
                { label: "Annual", value: "annual" },
                { label: "Probation", value: "probation" },
              ],
            },
            {
              label: "Status Filter",
              value: filterStatus,
              onChange: (value) => setFilterStatus(value as ReviewStatus | "all"),
              options: [
                { label: "All Status", value: "all" },
                { label: "Scheduled", value: "scheduled" },
                { label: "In Progress", value: "in-progress" },
                { label: "Completed", value: "completed" },
                { label: "Overdue", value: "overdue" },
              ],
            },
          ]}
        />

        {/* Reviews Table */}
        <PerformanceReviewsTable
          reviews={filteredReviews}
          onViewDetails={(review) => setSelectedReview(review)}
          onEdit={(review) => {
            setSelectedReview(review);
            setIsEditModalOpen(true);
          }}
          onDelete={(review) => {
            setReviewToDelete(review);
            setIsDeleteModalOpen(true);
          }}
          filterKey={`${filterStatus}-${filterPeriod}-${filterYear}-${searchQuery}`}
        />
      </div>

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
            // Keep the view modal open after editing
          }}
          review={selectedReview}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={handleDeleteReview}
        title="Delete Performance Review"
        message={
          reviewToDelete
            ? `Are you sure you want to delete the performance review for ${reviewToDelete.staffName} (${reviewToDelete.id})? This action cannot be undone.`
            : ""
        }
      />
    </MainLayout>
  );
}
