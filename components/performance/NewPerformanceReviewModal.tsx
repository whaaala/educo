"use client";

import { useState, useEffect } from "react";
import { Star, X, Calendar, User, Clock, Plus, Trash2, FileText, BarChart3, Users, Building2 } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import FormButton from "@/components/shared/FormButton";
import { usePerformance } from "@/contexts/PerformanceContext";
import { ReviewPeriod, OverallRating } from "@/types/performance";

interface NewPerformanceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Reviewer {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface ReviewFormData {
  staffId: string;
  staffName: string;
  staffEmail: string;
  staffDepartment: string;
  staffPosition: string;
  managedStaffIds: string[];
  reviewPeriod: ReviewPeriod | "";
  reviewYear: string;
  reviewQuarter: string;
  reviewDueDate: string;
  reviewers: Reviewer[];
  performanceRating: OverallRating | "";
  reviewNotes: string;
}

// Mock staff data with hierarchy - in real app, this would come from staff API/context
const mockStaffList = [
  {
    id: "STF001",
    name: "Mrs. Sarah Johnson",
    email: "sarah.johnson@school.com",
    department: "Mathematics",
    position: "Senior Teacher",
    manages: [],
  },
  {
    id: "STF002",
    name: "Mr. David Chen",
    email: "david.chen@school.com",
    department: "Science",
    position: "Biology Teacher",
    manages: [],
  },
  {
    id: "STF003",
    name: "Dr. Emily Williams",
    email: "emily.williams@school.com",
    department: "English",
    position: "Department Head",
    manages: ["STF005", "STF006", "STF007"],
  },
  {
    id: "STF004",
    name: "Mr. James Brown",
    email: "james.brown@school.com",
    department: "Physical Education",
    position: "PE Teacher",
    manages: [],
  },
  {
    id: "STF005",
    name: "Ms. Alice Cooper",
    email: "alice.cooper@school.com",
    department: "English",
    position: "English Teacher",
    manages: [],
  },
  {
    id: "STF006",
    name: "Mr. Robert Martinez",
    email: "robert.martinez@school.com",
    department: "English",
    position: "Literature Teacher",
    manages: [],
  },
  {
    id: "STF007",
    name: "Mrs. Lisa Anderson",
    email: "lisa.anderson@school.com",
    department: "English",
    position: "English Teacher",
    manages: [],
  },
];

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

export default function NewPerformanceReviewModal({
  isOpen,
  onClose,
}: NewPerformanceReviewModalProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    staffId: "",
    staffName: "",
    staffEmail: "",
    staffDepartment: "",
    staffPosition: "",
    managedStaffIds: [],
    reviewPeriod: "",
    reviewYear: new Date().getFullYear().toString(),
    reviewQuarter: "",
    reviewDueDate: "",
    reviewers: [],
    performanceRating: "",
    reviewNotes: "",
  });

  const [selectedStaff, setSelectedStaff] = useState<typeof mockStaffList[0] | null>(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    department: "",
    classSection: "",
  });
  const { addReview } = usePerformance();

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        staffId: "",
        staffName: "",
        staffEmail: "",
        staffDepartment: "",
        staffPosition: "",
        managedStaffIds: [],
        reviewPeriod: "",
        reviewYear: new Date().getFullYear().toString(),
        reviewQuarter: "",
        reviewDueDate: "",
        reviewers: [],
        performanceRating: "",
        reviewNotes: "",
      });
      setSelectedStaff(null);
      setFilters({
        year: new Date().getFullYear().toString(),
        department: "",
        classSection: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get unique departments from staff list
  const getStaffDepartments = () => {
    const departments = Array.from(new Set(mockStaffList.map(s => s.department)));
    return departments.sort();
  };

  // Filter staff based on selected filters
  const getFilteredStaff = () => {
    return mockStaffList.filter(staff => {
      if (filters.department && staff.department !== filters.department) {
        return false;
      }
      // Add more filter logic here when you have class/section data
      return true;
    });
  };

  const handleStaffChange = (value: string) => {
    const staff = mockStaffList.find((s) => s.id === value);
    if (staff) {
      setSelectedStaff(staff);
      setFormData({
        ...formData,
        staffId: staff.id,
        staffName: staff.name,
        staffEmail: staff.email,
        staffDepartment: staff.department,
        staffPosition: staff.position,
        managedStaffIds: staff.manages,
      });
    }
  };

  const handleAddReviewer = () => {
    setFormData({
      ...formData,
      reviewers: [...formData.reviewers, { id: "", name: "", position: "", department: "" }],
    });
  };

  const handleRemoveReviewer = (index: number) => {
    const newReviewers = formData.reviewers.filter((_, i) => i !== index);
    setFormData({ ...formData, reviewers: newReviewers });
  };

  const handleReviewerDepartmentChange = (index: number, department: string) => {
    const newReviewers = [...formData.reviewers];
    newReviewers[index] = { id: "", name: "", position: "", department };
    setFormData({ ...formData, reviewers: newReviewers });
  };

  const handleReviewerChange = (index: number, reviewerId: string) => {
    const reviewer = mockReviewers.find((r) => r.id === reviewerId);
    if (reviewer) {
      const newReviewers = [...formData.reviewers];
      newReviewers[index] = reviewer;
      setFormData({ ...formData, reviewers: newReviewers });
    }
  };

  const getReviewersByDepartment = (department: string) => {
    return mockReviewers.filter(r => r.department === department);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.staffId || !formData.reviewPeriod || !formData.reviewDueDate || formData.reviewers.length === 0) {
      return;
    }

    // Use first reviewer as primary reviewer
    const primaryReviewer = formData.reviewers[0];

    // Add review to context
    addReview({
      staffId: formData.staffId,
      staffName: formData.staffName,
      staffEmail: formData.staffEmail,
      staffDepartment: formData.staffDepartment,
      staffPosition: formData.staffPosition,
      reviewPeriod: formData.reviewPeriod as ReviewPeriod,
      reviewYear: formData.reviewYear,
      reviewQuarter: formData.reviewQuarter || undefined,
      reviewDueDate: formData.reviewDueDate,
      reviewerId: primaryReviewer.id,
      reviewerName: primaryReviewer.name,
      reviewerPosition: primaryReviewer.position,
    });

    onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    label: (currentYear + i).toString(),
    value: (currentYear + i).toString(),
  }));

  const getManagedStaffNames = () => {
    return formData.managedStaffIds
      .map((id) => mockStaffList.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Compact Header */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-blue-500/5 dark:from-purple-500/10 dark:via-indigo-500/10 dark:to-blue-500/10 midnight:from-cyan-500/10 midnight:via-blue-500/10 midnight:to-cyan-500/10 purple:from-pink-500/10 purple:via-purple-500/10 purple:to-pink-500/10 border-b border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-xl">
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 dark:via-purple-400/5 midnight:via-cyan-400/5 purple:via-pink-400/5 animate-pulse opacity-50"></div>

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent dark:via-purple-400/40 midnight:via-cyan-400/40 purple:via-pink-400/40"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Compact modern icon */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <Star className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  Schedule Performance Review
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Create a new performance review schedule
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
          {/* Staff Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Staff Member
              </h4>
            </div>

            {/* Filters */}
            <div className="mb-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 mb-3">
                Filter Staff Members
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormDropdown
                  label="Year"
                  icon={<Calendar className="w-4 h-4" />}
                  value={filters.year}
                  onChange={(value) => setFilters({ ...filters, year: value })}
                  options={years}
                />
                <FormDropdown
                  label="Department"
                  icon={<Building2 className="w-4 h-4" />}
                  value={filters.department}
                  onChange={(value) => setFilters({ ...filters, department: value })}
                  options={[
                    { label: "All Departments", value: "" },
                    ...getStaffDepartments().map((dept) => ({
                      label: dept,
                      value: dept,
                    })),
                  ]}
                />
                <FormDropdown
                  label="Class/Section"
                  icon={<Users className="w-4 h-4" />}
                  value={filters.classSection}
                  onChange={(value) => setFilters({ ...filters, classSection: value })}
                  options={[
                    { label: "All Classes", value: "" },
                    { label: "Primary 1A", value: "primary-1a" },
                    { label: "Primary 1B", value: "primary-1b" },
                    { label: "Primary 2A", value: "primary-2a" },
                    { label: "Primary 2B", value: "primary-2b" },
                    { label: "Primary 3A", value: "primary-3a" },
                    { label: "Primary 3B", value: "primary-3b" },
                  ]}
                />
              </div>
              <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                {getFilteredStaff().length} staff member{getFilteredStaff().length !== 1 ? "s" : ""} match{getFilteredStaff().length === 1 ? "es" : ""} your filters
              </div>
            </div>

            <FormDropdown
              label="Select Staff Member"
              icon={<User className="w-4 h-4" />}
              value={formData.staffId}
              onChange={handleStaffChange}
              options={getFilteredStaff().map((staff) => ({
                label: `${staff.name} - ${staff.position}`,
                value: staff.id,
              }))}
              placeholder={getFilteredStaff().length === 0 ? "No staff match the selected filters" : "Select a staff member"}
              required
            />
            {formData.staffId && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg border border-line">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Department:</span>
                    <span className="ml-1 font-medium text-ink">
                      {formData.staffDepartment}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="ml-1 font-medium text-ink">
                      {formData.staffEmail}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hierarchy - Managed Staff */}
          {formData.managedStaffIds.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
                </div>
                <h4 className="text-sm font-semibold text-ink">
                  Staff Hierarchy
                </h4>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 midnight:bg-indigo-900/10 purple:bg-indigo-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800/30 midnight:border-indigo-700/30 purple:border-indigo-700/30">
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">
                  <span className="font-semibold">{formData.staffName}</span> manages the following staff members:
                </p>
                <p className="text-sm font-medium text-ink">
                  {getManagedStaffNames()}
                </p>
              </div>
            </div>
          )}

          {/* Review Period Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
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
              <h4 className="text-sm font-semibold text-ink">
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

          {/* Reviewers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
                </div>
                <h4 className="text-sm font-semibold text-ink">
                  Reviewers
                </h4>
              </div>
              <button
                type="button"
                onClick={handleAddReviewer}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Reviewer
              </button>
            </div>
            {formData.reviewers.length === 0 ? (
              <div className="p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No reviewers added yet. Click "Add Reviewer" to add one.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.reviewers.map((reviewer, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg border border-line">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-ink">
                        Reviewer {index + 1}{index === 0 ? " (Primary)" : ""}
                      </h5>
                      {formData.reviewers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveReviewer(index)}
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                          aria-label="Remove reviewer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {/* Department Selection */}
                      <FormDropdown
                        label="Department"
                        icon={<Building2 className="w-4 h-4" />}
                        value={reviewer.department}
                        onChange={(value) => handleReviewerDepartmentChange(index, value)}
                        options={getDepartments().map((dept) => ({
                          label: dept,
                          value: dept,
                        }))}
                        required
                      />
                      {/* User Selection - Only show when department is selected */}
                      {reviewer.department && (
                        <FormDropdown
                          label="Select Reviewer"
                          icon={<User className="w-4 h-4" />}
                          value={reviewer.id}
                          onChange={(value) => handleReviewerChange(index, value)}
                          options={getReviewersByDepartment(reviewer.department).map((r) => ({
                            label: `${r.name} - ${r.position}`,
                            value: r.id,
                          }))}
                          required
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Rating */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
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
              placeholder="Select expected performance rating"
            />
          </div>

          {/* Review Notes */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                Review Notes
              </h4>
            </div>
            <FormTextarea
              label="Notes & Discussion Points"
              icon={<FileText className="w-4 h-4" />}
              value={formData.reviewNotes}
              onChange={(value) => setFormData({ ...formData, reviewNotes: value })}
              placeholder="Add any preliminary notes, discussion topics, or key areas to focus on during the review..."
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
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
              >
                Schedule Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
