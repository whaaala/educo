"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardPage } from "@/components/pages";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useGrading, GradeScheme } from "@/contexts/GradingContext";
import Button from "@/components/shared/Button";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import ActionModal from "@/components/shared/ActionModal";
import {
  GraduationCap,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  TrendingUp,
  Award,
  BarChart3,
  BookMarked,
} from "lucide-react";

// Re-export type from context for consistency
import type { EducationLevel } from "@/contexts/GradingContext";

// Class lists for each education level
const PRIMARY_CLASSES = [
  "Nursery 1", "Nursery 2", "KG 1", "KG 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"
];

const SECONDARY_CLASSES = [
  "JSS 1", "JSS 2", "JSS 3",
  "SSS 1", "SSS 2", "SSS 3"
];

const TERTIARY_CLASSES = [
  "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"
];

// Subject lists for each education level
const PRIMARY_SUBJECTS = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Social Studies",
  "Civic Education",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Physical & Health Education",
  "Creative Arts",
  "Computer Studies",
  "Verbal Reasoning",
  "Quantitative Reasoning",
];

const SECONDARY_SUBJECTS = [
  "Mathematics",
  "English Language",
  "Biology",
  "Chemistry",
  "Physics",
  "Further Mathematics",
  "Economics",
  "Government",
  "Literature in English",
  "Geography",
  "History",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Computer Science",
  "Agricultural Science",
  "Home Economics",
  "Technical Drawing",
  "Visual Arts",
  "Music",
  "Physical Education",
  "Civic Education",
];

const TERTIARY_SUBJECTS = [
  "Core Courses",
  "Major Courses",
  "Elective Courses",
  "General Studies",
  "Research Methods",
  "Final Year Project",
];

// Helper function to get classes for education level
const getClassesForLevel = (level: EducationLevel): string[] => {
  switch (level) {
    case "Primary":
      return PRIMARY_CLASSES;
    case "Tertiary":
      return TERTIARY_CLASSES;
    default:
      return SECONDARY_CLASSES;
  }
};

// Helper function to get subjects for education level
const getSubjectsForLevel = (level: EducationLevel): string[] => {
  switch (level) {
    case "Primary":
      return PRIMARY_SUBJECTS;
    case "Tertiary":
      return TERTIARY_SUBJECTS;
    default:
      return SECONDARY_SUBJECTS;
  }
};

export default function GradingPage() {
  const { settings } = useSchoolSettings();
  const { gradeSchemes, saveGradeScheme, updateGradeScheme, deleteGradeScheme } = useGrading();

  // State management
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    settings?.supportedLevels?.[0] || "Secondary"
  );
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<GradeScheme | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingScheme, setDeletingScheme] = useState<GradeScheme | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    gradeName: "",
    minScore: "",
    maxScore: "",
    gradePoint: "",
    remark: "",
    color: "blue",
  });

  // Filter schemes based on selected filters
  const filteredSchemes = useMemo(() => {
    return gradeSchemes.filter((scheme) => {
      if (scheme.educationLevel !== educationLevel) return false;
      if (selectedSubject && scheme.subject !== selectedSubject) return false;
      return true;
    });
  }, [gradeSchemes, educationLevel, selectedSubject]);

  // Group schemes by subject for display
  const groupedSchemes = useMemo(() => {
    const groups: { [key: string]: GradeScheme[] } = {};

    filteredSchemes.forEach((scheme) => {
      const key = scheme.subject;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(scheme);
    });

    // Sort grades within each group by minScore descending
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => b.minScore - a.minScore);
    });

    return groups;
  }, [filteredSchemes]);

  // Handle scroll indicators and animations for horizontal scrolling
  useEffect(() => {
    const handleScrollIndicators = () => {
      // Get all grading tables and their scroll indicators
      const containers = document.querySelectorAll('.grading-table-container');

      containers.forEach((container) => {
        // Find the overflow-x-auto div inside the DataTable component
        const tableWrapper = container.querySelector('.overflow-x-auto') as HTMLElement;
        const subjectName = container.getAttribute('data-subject');
        const leftIndicator = document.getElementById(`scroll-left-indicator-${subjectName}`);
        const rightIndicator = document.getElementById(`scroll-right-indicator-${subjectName}`);
        const table = tableWrapper?.querySelector('table');

        if (!tableWrapper || !leftIndicator || !rightIndicator || !table) {
          console.log('Missing elements for', subjectName, { tableWrapper, leftIndicator, rightIndicator, table });
          return;
        }

        let scrollTimeout: ReturnType<typeof setTimeout>;
        let isScrolling = false;

        const handleScroll = () => {
          const scrollLeft = tableWrapper.scrollLeft;
          const scrollWidth = tableWrapper.scrollWidth;
          const clientWidth = tableWrapper.clientWidth;
          const maxScroll = scrollWidth - clientWidth;

          // Add scrolling class for animation
          if (!isScrolling) {
            table.classList.add('is-scrolling');
            isScrolling = true;
          }

          // Clear previous timeout
          clearTimeout(scrollTimeout);

          // Show left indicator when scrolled right
          if (scrollLeft > 10) {
            leftIndicator.style.opacity = '1';
          } else {
            leftIndicator.style.opacity = '0';
          }

          // Hide right indicator when scrolled to end
          if (scrollLeft >= maxScroll - 10) {
            rightIndicator.style.opacity = '0';
          } else if (scrollWidth > clientWidth) {
            rightIndicator.style.opacity = '1';
          } else {
            // If content doesn't overflow, hide right indicator
            rightIndicator.style.opacity = '0';
          }

          // Remove scrolling class after scrolling stops
          scrollTimeout = setTimeout(() => {
            table.classList.remove('is-scrolling');
            isScrolling = false;
          }, 150);
        };

        tableWrapper.addEventListener('scroll', handleScroll);
        // Check initial state
        handleScroll();

        // Cleanup function stored in a way TypeScript can understand
        const cleanup = () => {
          tableWrapper.removeEventListener('scroll', handleScroll);
          clearTimeout(scrollTimeout);
        };

        // Store cleanup in the container's dataset for later cleanup
        (container as any)._scrollCleanup = cleanup;
      });
    };

    // Delay to ensure DOM is ready and DataTable has rendered
    const timer = setTimeout(handleScrollIndicators, 200);

    return () => {
      clearTimeout(timer);
      // Cleanup all scroll listeners
      const containers = document.querySelectorAll('.grading-table-container');
      containers.forEach((container) => {
        if ((container as any)._scrollCleanup) {
          (container as any)._scrollCleanup();
        }
      });
    };
  }, [groupedSchemes]); // Re-run when grading schemes change

  // Handle education level change
  const handleEducationLevelChange = (level: string) => {
    setEducationLevel(level as EducationLevel);
    setSelectedSubject("");
  };

  // Handle add new grade
  const handleAddGrade = () => {
    if (!selectedSubject) {
      alert("Please select a subject first");
      return;
    }
    setFormData({
      gradeName: "",
      minScore: "",
      maxScore: "",
      gradePoint: "",
      remark: "",
      color: "blue",
    });
    setIsAddModalOpen(true);
  };

  // Handle edit grade
  const handleEditGrade = (scheme: GradeScheme) => {
    setEditingScheme(scheme);
    setFormData({
      gradeName: scheme.gradeName,
      minScore: scheme.minScore.toString(),
      maxScore: scheme.maxScore.toString(),
      gradePoint: scheme.gradePoint.toString(),
      remark: scheme.remark,
      color: scheme.color,
    });
    setIsEditModalOpen(true);
  };

  const requestDeleteGrade = (scheme: GradeScheme) => {
    setDeletingScheme(scheme);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteGrade = () => {
    if (!deletingScheme) return;
    deleteGradeScheme(deletingScheme.id);
    setIsDeleteModalOpen(false);
    setDeletingScheme(null);
  };

  // Handle save (add or edit)
  const handleSave = async () => {
    // Validation
    if (!formData.gradeName || !formData.minScore || !formData.maxScore || !formData.gradePoint || !formData.remark) {
      alert("Please fill in all required fields");
      return;
    }

    const minScore = parseFloat(formData.minScore);
    const maxScore = parseFloat(formData.maxScore);
    const gradePoint = parseFloat(formData.gradePoint);

    if (isNaN(minScore) || isNaN(maxScore) || isNaN(gradePoint)) {
      alert("Please enter valid numbers for scores and grade point");
      return;
    }

    if (minScore >= maxScore) {
      alert("Minimum score must be less than maximum score");
      return;
    }

    if (minScore < 0 || maxScore > 100) {
      alert("Scores must be between 0 and 100");
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isEditModalOpen && editingScheme) {
      // Update existing scheme
      updateGradeScheme(editingScheme.id, {
        gradeName: formData.gradeName,
        minScore,
        maxScore,
        gradePoint,
        remark: formData.remark,
        color: formData.color,
      });
      setIsEditModalOpen(false);
    } else {
      // Add new scheme (applies to all classes for this subject)
      const newScheme: GradeScheme = {
        id: Date.now().toString(),
        educationLevel,
        class: "All",
        subject: selectedSubject,
        gradeName: formData.gradeName,
        minScore,
        maxScore,
        gradePoint,
        remark: formData.remark,
        color: formData.color,
      };
      saveGradeScheme(newScheme);
      setIsAddModalOpen(false);
    }

    setIsSaving(false);
  };

  // Get grade color classes
  const getGradeColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      green: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      blue: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      cyan: "bg-cyan-100 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
      yellow: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      orange: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      amber: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      red: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    };
    return colors[color] || colors.blue;
  };

  // Table columns - matching attendance page structure exactly
  const columns: ColumnConfig<GradeScheme>[] = [
    {
      key: "gradeName",
      label: "GRADE",
      sortable: true,
      className: "text-left min-w-[100px]",
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] sm:text-xs md:text-sm font-bold border ${getGradeColorClass(item.color)}`}>
          {item.gradeName}
        </span>
      ),
    },
    {
      key: "minScore",
      label: "MIN SCORE",
      sortable: true,
      className: "text-left min-w-[90px]",
      render: (item) => (
        <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
          {item.minScore}
        </span>
      ),
    },
    {
      key: "maxScore",
      label: "MAX SCORE",
      sortable: true,
      className: "text-left min-w-[90px]",
      render: (item) => (
        <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
          {item.maxScore}
        </span>
      ),
    },
    {
      key: "gradePoint",
      label: "GRADE POINT",
      sortable: true,
      className: "text-left min-w-[110px]",
      render: (item) => (
        <span className="text-[11px] sm:text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
          {item.gradePoint.toFixed(1)}
        </span>
      ),
    },
    {
      key: "remark",
      label: "REMARK",
      sortable: true,
      className: "text-left min-w-[120px]",
      render: (item) => (
        <span className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
          {item.remark}
        </span>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      className: "text-center min-w-[100px]",
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleEditGrade(item)}
            className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 midnight:text-cyan-400 midnight:hover:text-cyan-300 purple:text-pink-400 purple:hover:text-pink-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => requestDeleteGrade(item)}
            className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 midnight:hover:bg-red-500/10 purple:hover:bg-red-500/10 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Smooth scrolling styles */}
      <style jsx>{`
        .overflow-x-auto {
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          scroll-snap-type: x proximity;
        }

        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:active {
          background-color: rgba(59, 130, 246, 0.8);
        }

        @media (prefers-color-scheme: dark) {
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.5);
          }

          .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background-color: rgba(75, 85, 99, 0.7);
          }

          .overflow-x-auto::-webkit-scrollbar-thumb:active {
            background-color: rgba(59, 130, 246, 0.6);
          }
        }

        /* Table scroll animations */
        table {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        table.is-scrolling {
          filter: brightness(0.98);
        }

        table th,
        table td {
          transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        table.is-scrolling th:not(.sticky),
        table.is-scrolling td:not(.sticky) {
          opacity: 0.95;
        }

        /* Sticky column enhanced shadow on scroll */
        table.is-scrolling th.sticky,
        table.is-scrolling td.sticky {
          box-shadow: 2px 0 8px -2px rgba(0, 0, 0, 0.15);
        }

        @media (prefers-color-scheme: dark) {
          table.is-scrolling {
            filter: brightness(1.02);
          }

          table.is-scrolling th.sticky,
          table.is-scrolling td.sticky {
            box-shadow: 2px 0 8px -2px rgba(0, 0, 0, 0.4);
          }
        }

        /* Smooth fade for scroll indicators */
        #scroll-left-indicator,
        #scroll-right-indicator {
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Add subtle pulse animation to scroll indicators */
        @keyframes pulse-indicator {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        div[id^="scroll-right-indicator"] {
          animation: pulse-indicator 2s ease-in-out infinite;
        }

        /* Smooth momentum scrolling for iOS */
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

    <DashboardPage
      title="Grading Schemes"
      description="Manage grading schemes per class and subject"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Students", href: "/students" },
        { label: "Grading", isActive: true },
      ]}
      loadingText="Loading Grading Schemes"
    >
      <div className="mt-6 space-y-5 sm:space-y-6">

        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-950/20 midnight:bg-blue-950/30 purple:bg-blue-950/30 border border-blue-200 dark:border-blue-800 midnight:border-blue-700 purple:border-blue-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Grading System Information
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Configure grading schemes for each class and subject. Each scheme defines grade boundaries,
                grade points for GPA/CGPA calculation, and remarks. Different classes and subjects can have
                different grading scales based on your institution's requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 px-4 sm:px-6 py-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Select Subject
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choose the subject to view or add grading schemes
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 relative z-10">
              {/* Education Level */}
              {settings?.supportsMultipleLevels && (
                <div className="relative z-20">
                  <FormDropdown
                    label="Education Level"
                    icon={<GraduationCap className="w-full h-full" />}
                    iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                    value={educationLevel}
                    onChange={handleEducationLevelChange}
                    options={settings?.supportedLevels?.map((level) => ({
                      value: level,
                      label: level,
                    })) || []}
                    required
                  />
                </div>
              )}

              {/* Subject */}
              <div className="relative z-10">
                <FormDropdown
                  label="Subject"
                  icon={<BookMarked className="w-full h-full" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400"
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  options={[
                    { value: "", label: "All Subjects" },
                    ...getSubjectsForLevel(educationLevel).map((subject) => ({
                      value: subject,
                      label: subject,
                    })),
                  ]}
                  placeholder="Select subject..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grading Schemes Display */}
        {Object.keys(groupedSchemes).length > 0 ? (
          <div className="space-y-5">
            {Object.entries(groupedSchemes).map(([subjectName, schemes]) => {
              return (
                <div
                  key={subjectName}
                  className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm grading-table-container"
                  data-subject={subjectName}
                >
                  <div className="border-b border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {subjectName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {schemes.length} grade(s) configured
                        </p>
                      </div>
                      {selectedSubject && (
                        <Button
                          onClick={handleAddGrade}
                          icon={<Plus className="w-4 h-4" />}
                          size="sm"
                        >
                          Add Grade
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Table matching attendance page design */}
                  <div className="bg-gray-50 dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 flex flex-row items-center justify-between gap-2 sm:gap-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
                    <h2 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-300 purple:text-pink-300 tracking-tight whitespace-nowrap">
                      Records
                    </h2>
                  </div>

                  <div className="relative">
                    {/* Scroll indicator gradients for better UX */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/80 to-transparent dark:from-gray-800/80 midnight:from-gray-900/80 purple:from-gray-900/80 pointer-events-none z-20 rounded-l-xl opacity-0 transition-opacity duration-300" id={`scroll-left-indicator-${subjectName}`}></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent dark:from-gray-800/80 midnight:from-gray-900/80 purple:from-gray-900/80 pointer-events-none z-20 rounded-r-xl opacity-100 transition-opacity duration-300 lg:opacity-0" id={`scroll-right-indicator-${subjectName}`}></div>

                    <DataTable<GradeScheme>
                      data={schemes}
                      columns={columns}
                      getRowKey={(item) => item.id}
                      showSearch={false}
                      enablePagination={false}
                      emptyMessage="No grades configured for this subject"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-8 sm:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Grading Schemes Found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {!selectedSubject
                  ? "Please select a subject to view or add grading schemes"
                  : "No grading schemes configured for the selected subject"}
              </p>
              {selectedSubject && (
                <Button onClick={handleAddGrade} icon={<Plus className="w-4 h-4" />}>
                  Add First Grade
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setEditingScheme(null);
        }}
        title={isEditModalOpen ? "Edit Grade" : "Add New Grade"}
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <span className="font-semibold">
                {selectedSubject}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Grade Name"
              value={formData.gradeName}
              onChange={(value) => setFormData({ ...formData, gradeName: value })}
              placeholder="e.g., A1, B+, First Class"
              required
            />

            <FormDropdown
              label="Color"
              value={formData.color}
              onChange={(value) => setFormData({ ...formData, color: value })}
              options={[
                { value: "green", label: "Green" },
                { value: "blue", label: "Blue" },
                { value: "cyan", label: "Cyan" },
                { value: "yellow", label: "Yellow" },
                { value: "orange", label: "Orange" },
                { value: "amber", label: "Amber" },
                { value: "red", label: "Red" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Minimum Score"
              type="number"
              value={formData.minScore}
              onChange={(value) => setFormData({ ...formData, minScore: value })}
              placeholder="0"
              min={0}
              max={100}
              required
            />

            <FormInput
              label="Maximum Score"
              type="number"
              value={formData.maxScore}
              onChange={(value) => setFormData({ ...formData, maxScore: value })}
              placeholder="100"
              min={0}
              max={100}
              required
            />
          </div>

          <FormInput
            label="Grade Point"
            type="number"
            value={formData.gradePoint}
            onChange={(value) => setFormData({ ...formData, gradePoint: value })}
            placeholder="e.g., 5.0, 4.0"
            step={0.1}
            min={0}
            max={5}
            required
          />

          <FormInput
            label="Remark"
            value={formData.remark}
            onChange={(value) => setFormData({ ...formData, remark: value })}
            placeholder="e.g., Excellent, Very Good, Pass"
            required
          />

          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={handleSave}
              icon={<Save className="w-4 h-4" />}
              isLoading={isSaving}
              className="flex-1"
            >
              {isEditModalOpen ? "Update Grade" : "Add Grade"}
            </Button>
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setEditingScheme(null);
              }}
              variant="outline"
              icon={<X className="w-4 h-4" />}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingScheme(null);
        }}
        title="Delete Grade"
        subtitle={deletingScheme ? `${deletingScheme.gradeName} (${deletingScheme.subject})` : undefined}
        variant="danger"
        message="Are you sure you want to delete this grade scheme? This action cannot be undone."
        details={
          deletingScheme
            ? [
                { label: "Grade", value: deletingScheme.gradeName },
                { label: "Range", value: `${deletingScheme.minScore} - ${deletingScheme.maxScore}` },
                { label: "Point", value: deletingScheme.gradePoint.toFixed(1) },
              ]
            : undefined
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteGrade}
      />
    </DashboardPage>
    </>
  );
}

