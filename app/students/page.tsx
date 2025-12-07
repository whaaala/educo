"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import StudentCard, { Student } from "@/components/students/StudentCard";
import StudentTable from "@/components/students/StudentTable";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterField, FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageSpinner from "@/components/shared/PageSpinner";
import PageLoader from "@/components/shared/PageLoader";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import BulkTransferButton from "@/components/shared/BulkTransferButton";
import BulkTransferModal, { BulkTransferStudent, BulkTransferFormData } from "@/components/shared/BulkTransferModal";
import { useTransfers } from "@/contexts/TransferContext";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { filterStudentsByAcademicYear } from "@/utils/academicYear";
import { exportStudentsToPDF } from "@/utils/pdfExport";
import { exportStudentsToExcel } from "@/utils/excelExport";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getAllStudents } from "@/lib/mockStudents";
import { detectEducationLevelFromClass } from "@/utils/educationLevel";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useUser } from "@/contexts/UserContext";

// Use shared student data from mockStudents.ts
// This ensures the students displayed match the data available in the edit page

export default function AllStudentsPage() {
  const academicYearContext = useAcademicYear();
  const { selectedYear } = academicYearContext;
  const featureFlags = useFeatureFlags();
  const { settings } = useSchoolSettings();
  const { isSuperAdmin } = useUser();
  const { addTransferRequest } = useTransfers();
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePageLoading = usePageLoad(600);

  // Get view mode from URL, default to grid
  const urlView = searchParams.get("view");
  const initialView = urlView === "list" ? "list" : "grid";

  const [students] = useState<Student[]>(getAllStudents());
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(8); // 8 for grid, 10 for table
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(8);

  // Only show full-screen loader if not switching view with toggle button
  const isPageLoading = basePageLoading && !isSwitchingView;

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`/students?view=${newMode}`);

    // Keep isSwitchingView true for longer to prevent PageLoader from showing
    setTimeout(() => {
      setIsSwitchingView(false);
    }, 700); // Longer than PageLoader delay (600ms)
  };

  // Sync view mode with URL changes
  useEffect(() => {
    const urlView = searchParams.get("view");
    const newViewMode = urlView === "list" ? "list" : "grid";
    setViewMode(newViewMode);
  }, [searchParams]);

  // Check if school supports multiple education levels
  const supportsMultipleLevels = settings.supportsMultipleLevels && settings.supportedLevels.length > 1;

  // Filter fields configuration - dynamically built based on feature flags, settings, and user role
  const filterFields: FilterField[] = [
    // Branch/Campus filter only shown when FF_Branch_Hierarchy is enabled
    // Typically for: School Networks, Large Tertiary Institutions, International Schools
    ...(featureFlags.canUseBranchHierarchy ? [{
      id: "branch",
      label: "Branch/Campus",
      options: ["Main Campus", "North Campus", "South Campus", "East Campus", "West Campus"],
      width: "full" as const,
    }] : []),
    {
      id: "class",
      label: "Class",
      options: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"],
      width: "half",
    },
    {
      id: "section",
      label: "Section",
      options: ["A", "B"],
      width: "half",
    },
    // Education Level filter only shown for:
    // 1. Multi-level schools (supports Primary, Secondary, Tertiary)
    // 2. Super Admin users only (not visible to other user roles)
    ...(supportsMultipleLevels && isSuperAdmin ? [{
      id: "educationLevel",
      label: "Education Level",
      options: settings.supportedLevels, // Only show supported levels
      width: "full" as const,
    }] : []),
    {
      id: "name",
      label: "Name",
      options: ["A-E", "F-J", "K-O", "P-T", "U-Z"],
      width: "full",
    },
    {
      id: "gender",
      label: "Gender",
      options: ["Male", "Female"],
      width: "half",
    },
    {
      id: "status",
      label: "Status",
      options: ["Active", "Inactive"],
      width: "half",
    },
  ];

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sort state
  const [sortOption, setSortOption] = useState<string>("ascending");
  const [isSorting, setIsSorting] = useState(false);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Bulk transfer modal state
  const [isBulkTransferModalOpen, setIsBulkTransferModalOpen] = useState(false);
  const [studentsToTransfer, setStudentsToTransfer] = useState<BulkTransferStudent[]>([]);

  // Sort options
  const sortOptions = [
    { label: "Ascending", value: "ascending" },
    { label: "Descending", value: "descending" },
    { label: "Recently Viewed", value: "recently_viewed" },
    { label: "Recently Added", value: "recently_added" },
  ];

  // Parse date string in format "DD MMM YYYY" to Date object
  const parseJoinedOnDate = (dateStr: string): Date | null => {
    try {
      // Handle format like "10 Jan 2017" or "25 May 2024"
      const months: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };

      const parts = dateStr.trim().split(" ");
      if (parts.length !== 3) return null;

      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);

      if (isNaN(day) || month === undefined || isNaN(year)) return null;

      return new Date(year, month, day);
    } catch {
      return null;
    }
  };

  // Parse date string in format "MM/DD/YYYY" to Date object
  const parseDateRangeDate = (dateStr: string): Date | null => {
    try {
      const parts = dateStr.split("/");
      if (parts.length !== 3) return null;

      const month = parseInt(parts[0]) - 1; // 0-indexed
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);

      if (isNaN(month) || isNaN(day) || isNaN(year)) return null;

      return new Date(year, month, day);
    } catch {
      return null;
    }
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setIsFiltering(true);
    // Delay to allow exit animation
    setTimeout(() => {
      setDateRange({ startDate, endDate });
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount); // Reset to first page when date range changes
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleFilterChange = (updatedFilters: FilterValues) => {
    setIsFiltering(true);
    // Delay to allow exit animation
    setTimeout(() => {
      setFilters(updatedFilters);
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount); // Reset to first page when filters change
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleClearFilters = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters({});
      setDateRange(null);
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleDeleteAll = () => {
    console.log('🚀 NEW handleDeleteAll - Opening bulk delete modal');
    if (selectedIds.size > 0) {
      // Get the selected students' details
      const selectedStudents = filteredStudents.filter(student =>
        selectedIds.has(student.id)
      );

      // Convert to BulkDeleteItem format
      const items: BulkDeleteItem[] = selectedStudents.map(student => ({
        id: student.id,
        name: student.name,
        subtitle: student.id,
        avatarColor: student.avatar ? undefined : getRandomColor(student.name),
        avatar: student.avatar,
      }));

      console.log('📋 Items to show in modal:', items.length);
      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
      console.log('✅ Modal state set to true');
    }
  };

  // Helper function to get consistent color for a name
  const getRandomColor = (name: string): string => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleRemoveFromDeleteList = (itemId: string) => {
    setItemsToDelete(prevItems => prevItems.filter(item => item.id !== itemId));
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(itemId);
      return newIds;
    });
  };

  const handleConfirmBulkDelete = (itemIds: string[]) => {
    console.log('Deleting students:', itemIds);
    // Add your bulk delete logic here
    // For now, just clear the selection and close modal
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const handleCloseBulkDeleteModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const handleRestoreItem = (item: BulkDeleteItem) => {
    // Add item back to itemsToDelete
    setItemsToDelete(prevItems => [...prevItems, item]);
    // Add item back to selectedIds
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.add(item.id);
      return newIds;
    });
  };

  const handleRestoreAll = (items: BulkDeleteItem[]) => {
    // Add all items back to itemsToDelete
    setItemsToDelete(prevItems => [...prevItems, ...items]);
    // Add all items back to selectedIds
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      items.forEach(item => newIds.add(item.id));
      return newIds;
    });
  };

  // ============ Bulk Transfer Handlers ============

  const handleBulkTransfer = () => {
    if (selectedIds.size > 0) {
      // Get the selected students' details
      const selectedStudents = filteredStudents.filter(student =>
        selectedIds.has(student.id)
      );

      // Convert to BulkTransferStudent format
      const students: BulkTransferStudent[] = selectedStudents.map(student => {
        const [classNum, section] = student.class.split(", ");
        return {
          id: student.id,
          name: student.name,
          admissionNumber: student.id,
          class: classNum || student.class,
          section: section || "A",
          avatar: student.avatar,
        };
      });

      setStudentsToTransfer(students);
      setIsBulkTransferModalOpen(true);
    }
  };

  const handleRemoveFromTransferList = (studentId: string) => {
    setStudentsToTransfer(prevStudents => prevStudents.filter(s => s.id !== studentId));
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(studentId);
      return newIds;
    });
  };

  const handleConfirmBulkTransfer = (students: BulkTransferStudent[], transferData: BulkTransferFormData) => {
    // Create transfer requests for each student
    students.forEach(student => {
      addTransferRequest(
        {
          studentId: student.id,
          studentName: student.name,
          studentAdmissionNumber: student.admissionNumber,
          studentClass: student.class,
          studentSection: student.section,
        },
        {
          transferType: transferData.transferType,
          destinationClass: transferData.destinationClass,
          destinationSection: transferData.destinationSection,
          destinationSchoolName: transferData.destinationSchoolName,
          destinationSchoolAddress: transferData.destinationSchoolAddress,
          reason: transferData.reason,
          effectiveDate: transferData.effectiveDate,
          notes: transferData.notes,
        }
      );
    });

    // Clear the selection and close modal
    setSelectedIds(new Set());
    setIsBulkTransferModalOpen(false);
    setStudentsToTransfer([]);

    // Show success message (optional: you could add a toast notification here)
    console.log(`Successfully created ${students.length} transfer request(s)`);
  };

  const handleCloseBulkTransferModal = () => {
    setIsBulkTransferModalOpen(false);
  };

  const handleRestoreTransferStudent = (student: BulkTransferStudent) => {
    setStudentsToTransfer(prevStudents => [...prevStudents, student]);
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.add(student.id);
      return newIds;
    });
  };

  const handleRestoreAllTransferStudents = (students: BulkTransferStudent[]) => {
    setStudentsToTransfer(prevStudents => [...prevStudents, ...students]);
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      students.forEach(s => newIds.add(s.id));
      return newIds;
    });
  };

  // Check if there are active filters
  const hasActiveFilters =
    Object.values(filters).some((values) => values && values.length > 0) ||
    dateRange !== null;

  const handleSortChange = (sortValue: string) => {
    setIsSorting(true);
    // Delay to allow exit animation
    setTimeout(() => {
      setSortOption(sortValue);
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    }, 300);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Clear all filters and search
    setSearchQuery("");
    setDateRange(null);
    setFilters({});
    setSortOption("ascending");
    // Clear all selected checkboxes
    setSelectedIds(new Set());
    // Increment resetKey to trigger reset in FilterButton and SortButton
    setResetKey(prev => prev + 1);
    // Delay to allow exit animation
    setTimeout(() => {
      // Reset to first page when refreshing
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  const handlePrint = async () => {
    // Helper function to convert image URL to base64
    const getBase64Image = async (url: string): Promise<string> => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error loading image:', error);
        return '';
      }
    };

    // Convert all student avatars to base64
    const studentsWithBase64Avatars = await Promise.all(
      filteredStudents.map(async (student) => {
        if (student.avatar) {
          const base64 = await getBase64Image(student.avatar);
          return { ...student, avatar: base64 || student.avatar };
        }
        return student;
      })
    );

    // Create a print window with the current data
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get current date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Use filtered students with base64 avatars
    const studentsToPrint = studentsWithBase64Avatars;

    // Build the HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Records - ${dateStr}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              color: #1f2937;
            }

            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3b82f6;
            }

            .header h1 {
              font-size: 28px;
              color: #1f2937;
              margin-bottom: 8px;
            }

            .header .subtitle {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 4px;
            }

            .meta-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 12px;
              color: #6b7280;
            }

            ${viewMode === 'grid' ? `
              .grid-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-bottom: 20px;
              }

              .student-card {
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 16px;
                break-inside: avoid;
              }

              .student-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
              }

              .student-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
                object-fit: cover;
              }

              .student-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
              }

              .student-name {
                font-weight: 600;
                font-size: 14px;
                color: #1f2937;
              }

              .student-id {
                font-size: 11px;
                color: #3b82f6;
              }

              .student-info {
                display: grid;
                gap: 8px;
                font-size: 12px;
              }

              .info-row {
                display: flex;
                justify-content: space-between;
              }

              .info-label {
                color: #6b7280;
                font-weight: 500;
              }

              .info-value {
                color: #1f2937;
              }

              .status {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
              }

              .status-active {
                background-color: #dcfce7;
                color: #166534;
              }

              .status-inactive {
                background-color: #fee2e2;
                color: #991b1b;
              }
            ` : `
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
              }

              thead {
                background-color: #f3f4f6;
              }

              th {
                padding: 12px 8px;
                text-align: left;
                font-weight: 600;
                color: #374151;
                border-bottom: 2px solid #d1d5db;
              }

              td {
                padding: 10px 8px;
                border-bottom: 1px solid #e5e7eb;
              }

              tbody tr:hover {
                background-color: #f9fafb;
              }

              .student-name-cell {
                display: flex;
                align-items: center;
                gap: 8px;
              }

              .table-avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                flex-shrink: 0;
                object-fit: cover;
              }

              .table-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
              }

              .admission-no {
                color: #3b82f6;
                font-weight: 600;
              }

              .status {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 600;
              }

              .status-active {
                background-color: #dcfce7;
                color: #166534;
              }

              .status-inactive {
                background-color: #fee2e2;
                color: #991b1b;
              }
            `}

            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
            }

            @media print {
              body {
                padding: 10px;
              }

              .no-print {
                display: none;
              }

              @page {
                margin: 1cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Records</h1>
            <div class="subtitle">Educo - School ERP System</div>
            <div class="subtitle">View: ${viewMode === 'grid' ? 'Grid View' : 'Table View'}</div>
          </div>

          <div class="meta-info">
            <div>
              <strong>Date:</strong> ${dateStr} | <strong>Time:</strong> ${timeStr}
            </div>
            <div>
              <strong>Total Students:</strong> ${studentsToPrint.length}
            </div>
          </div>
    `;

    if (viewMode === 'grid') {
      // Grid view HTML
      htmlContent += '<div class="grid-container">';
      studentsToPrint.forEach((student) => {
        htmlContent += `
          <div class="student-card">
            <div class="student-header">
              <div class="student-avatar">
                ${student.avatar ? `<img src="${student.avatar}" alt="${student.name}" />` : student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <div class="student-name">${student.name}</div>
                <div class="student-id">${student.id}</div>
              </div>
            </div>
            <div class="student-info">
              <div class="info-row">
                <span class="info-label">Roll No:</span>
                <span class="info-value">${student.rollNo}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Class:</span>
                <span class="info-value">${student.class}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Gender:</span>
                <span class="info-value">${student.gender}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="status ${student.status === 'Active' ? 'status-active' : 'status-inactive'}">${student.status}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Joined:</span>
                <span class="info-value">${student.joinedOn}</span>
              </div>
            </div>
          </div>
        `;
      });
      htmlContent += '</div>';
    } else {
      // Table view HTML
      htmlContent += `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Admission No</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Date of Join</th>
            </tr>
          </thead>
          <tbody>
      `;

      studentsToPrint.forEach((student, index) => {
        const [classNum, section] = student.class.split(", ");
        htmlContent += `
          <tr>
            <td>${index + 1}</td>
            <td class="admission-no">${student.id}</td>
            <td>${student.rollNo}</td>
            <td>
              <div class="student-name-cell">
                <div class="table-avatar">
                  ${student.avatar ? `<img src="${student.avatar}" alt="${student.name}" />` : student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span>${student.name}</span>
              </div>
            </td>
            <td>${classNum}</td>
            <td>${section}</td>
            <td>${student.gender}</td>
            <td><span class="status ${student.status === 'Active' ? 'status-active' : 'status-inactive'}">${student.status}</span></td>
            <td>${student.joinedOn}</td>
          </tr>
        `;
      });

      htmlContent += `
          </tbody>
        </table>
      `;
    }

    htmlContent += `
          <div class="footer">
            <p>Generated on ${dateStr} at ${timeStr}</p>
            <p style="margin-top: 4px;">Educo School ERP System - Student Records Report</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for all images to load before printing
    printWindow.onload = () => {
      const images = printWindow.document.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true); // Resolve even on error to prevent hanging
          }
        });
      });

      Promise.all(imagePromises).then(() => {
        // Small delay to ensure rendering is complete
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 500);
      });
    };
  };

  const handleExportPDF = () => {
    // Feature flag check: Only allow exports if FF_Reports_Export is enabled
    if (!featureFlags.canExportReports) {
      alert(`Report export is not enabled for ${settings.institutionType} institutions`);
      return;
    }
    // Export all filtered students to PDF
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const filename = `students_${dateStr}.pdf`;

    exportStudentsToPDF(filteredStudents, filename);
  };

  const handleExportExcel = () => {
    // Feature flag check: Only allow exports if FF_Reports_Export is enabled
    if (!featureFlags.canExportReports) {
      alert(`Report export is not enabled for ${settings.institutionType} institutions`);
      return;
    }
    // Export all filtered students to Excel
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const filename = `students_${dateStr}.xlsx`;

    exportStudentsToExcel(filteredStudents, filename);
  };

  const handleAddStudent = () => {
    // Feature flag check: Only allow adding students if FF_Student_Profile is enabled
    if (!featureFlags.canManageProfile) {
      alert(`Student profile management is not enabled for ${settings.institutionType} institutions in ${settings.region}`);
      return;
    }
    // Navigate to Add Student page
    router.push('/students/add');
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset displayedCount when view mode changes
  useEffect(() => {
    if (isMounted) {
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      previousCountRef.current = initialCount;
    }
  }, [viewMode, isMounted]);

  // Handle academic year changes
  useEffect(() => {
    if (isMounted) {
      setIsFiltering(true);
      setTimeout(() => {
        // Reset to initial count based on view mode when academic year changes
        const initialCount = viewMode === "grid" ? 8 : 10;
        setDisplayedCount(initialCount);
        setTimeout(() => {
          setIsFiltering(false);
        }, 100);
      }, 300);
    }
  }, [selectedYear, isMounted, viewMode]);


  useEffect(() => {
    // Scroll to newly loaded content after displayedCount increases
    if (displayedCount > previousCountRef.current && gridRef.current) {
      // Find the first newly loaded card
      const cards = gridRef.current.children;
      const firstNewCardIndex = previousCountRef.current;

      if (cards[firstNewCardIndex]) {
        // Smooth scroll to the first new card
        setTimeout(() => {
          (cards[firstNewCardIndex] as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }

      previousCountRef.current = displayedCount;
    }
  }, [displayedCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      // Load 8 more cards
      setDisplayedCount((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 500);
  };

  // Filter students by academic year first
  const academicYearFilteredStudents = filterStudentsByAcademicYear(students, selectedYear);

  // Apply sorting to academically filtered students
  const sortedStudents = [...academicYearFilteredStudents].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        // Sort by name A-Z
        return a.name.localeCompare(b.name);
      case "descending":
        // Sort by name Z-A
        return b.name.localeCompare(a.name);
      case "recently_viewed":
        // Sort by ID descending (simulating recently viewed)
        return b.id.localeCompare(a.id);
      case "recently_added":
        // Sort by joined date descending (most recent first)
        const dateA = parseJoinedOnDate(a.joinedOn);
        const dateB = parseJoinedOnDate(b.joinedOn);
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
      default:
        // Default: Sort by joined date ascending (oldest first)
        const defaultDateA = parseJoinedOnDate(a.joinedOn);
        const defaultDateB = parseJoinedOnDate(b.joinedOn);
        if (!defaultDateA || !defaultDateB) return 0;
        return defaultDateA.getTime() - defaultDateB.getTime();
    }
  });

  // Apply additional filters to students
  const filteredStudents = sortedStudents.filter((student) => {
    // Check date range filter
    if (dateRange) {
      const joinedDate = parseJoinedOnDate(student.joinedOn);
      const startDate = parseDateRangeDate(dateRange.startDate);
      const endDate = parseDateRangeDate(dateRange.endDate);

      if (joinedDate && startDate && endDate) {
        // Normalize dates to start of day for comparison
        const joinedDateNormalized = new Date(joinedDate.getFullYear(), joinedDate.getMonth(), joinedDate.getDate());
        const startDateNormalized = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateNormalized = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        if (joinedDateNormalized < startDateNormalized || joinedDateNormalized > endDateNormalized) {
          return false;
        }
      }
    }

    // If no filters are active, show all students
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters) return true;

    // Check each filter type (AND logic between types, OR within type)
    const matchesClass = !filters.class || filters.class.length === 0 || filters.class.some((cls) => {
      return student.class.startsWith(cls);
    });

    const matchesSection = !filters.section || filters.section.length === 0 || filters.section.some((section) => {
      return student.class.includes(section);
    });

    const matchesName = !filters.name || filters.name.length === 0 || filters.name.some((range) => {
      const firstLetter = student.name.charAt(0).toUpperCase();
      // Map ranges like "A-E" to check if first letter is in range
      if (range === "A-E") return firstLetter >= "A" && firstLetter <= "E";
      if (range === "F-J") return firstLetter >= "F" && firstLetter <= "J";
      if (range === "K-O") return firstLetter >= "K" && firstLetter <= "O";
      if (range === "P-T") return firstLetter >= "P" && firstLetter <= "T";
      if (range === "U-Z") return firstLetter >= "U" && firstLetter <= "Z";
      return false;
    });

    const matchesGender = !filters.gender || filters.gender.length === 0 || filters.gender.includes(student.gender);

    const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(student.status);

    const matchesEducationLevel = !filters.educationLevel || filters.educationLevel.length === 0 || filters.educationLevel.some((level) => {
      const studentLevel = student.educationLevel || detectEducationLevelFromClass(student.class);
      return studentLevel === level;
    });

    // Branch/Campus filter - defaults to "Main Campus" if not set
    const matchesBranch = !filters.branch || filters.branch.length === 0 || filters.branch.some((branch) => {
      const studentBranch = student.branch || "Main Campus";
      return studentBranch === branch;
    });

    return matchesClass && matchesSection && matchesName && matchesGender && matchesStatus && matchesEducationLevel && matchesBranch;
  });

  const displayedStudents = filteredStudents.slice(0, displayedCount);
  const hasMore = displayedCount < filteredStudents.length;

  // Check if we're in a loading state
  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView;

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isPageLoading} loadingText="Loading Students" />

      {/* Main Content - Fades in after loading */}
      <div className={`transition-opacity duration-500 ${isPageLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
        {/* Left Section - Title and Breadcrumb */}
        <PageHeader
          title="Students"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Peoples" },
            { label: viewMode === "grid" ? "Students Grid" : "Students Table", isActive: true },
          ]}
        />

        {/* Right Section - Action Buttons */}
        <PageActions
          addButtonLabel="Add Student"
          exportDescription="Download student data"
          onAdd={handleAddStudent}
          onRefresh={handleRefresh}
          onPrint={handlePrint}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />
      </div>

      {/* Filters Bar */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
          {/* Left Section - Date and Filter */}
          <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
            {/* Date Range Picker */}
            <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />

            {/* Filter */}
            <FilterButton fields={filterFields} onFilterChange={handleFilterChange} resetKey={resetKey} />

            {/* Bulk Actions - Only show in table view when items are selected */}
            {viewMode === "list" && selectedIds.size > 0 && (
              <>
                <BulkTransferButton
                  selectedCount={selectedIds.size}
                  onBulkTransfer={handleBulkTransfer}
                />
                <DeleteAllButton
                  selectedCount={selectedIds.size}
                  onDeleteAll={handleDeleteAll}
                />
              </>
            )}

            {/* Student Count Badge (Grid View Only) - Shown on all screens */}
            {viewMode === "grid" && (
              <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
                <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                  1 to {Math.min(displayedCount, filteredStudents.length)} of {filteredStudents.length}
                </span>
              </div>
            )}

            {/* Bulk Actions - Grid view (desktop: after count badge, mobile: hidden here) */}
            {viewMode === "grid" && selectedIds.size > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <BulkTransferButton
                  selectedCount={selectedIds.size}
                  onBulkTransfer={handleBulkTransfer}
                />
                <DeleteAllButton
                  selectedCount={selectedIds.size}
                  onDeleteAll={handleDeleteAll}
                />
              </div>
            )}
          </div>

          {/* Right Section - View Toggle and Sort */}
          <div className="flex items-center justify-end gap-3 lg:flex-1">
            {/* Bulk Actions - Grid view (mobile: before checkbox, far left) */}
            {viewMode === "grid" && selectedIds.size > 0 && (
              <div className="flex sm:hidden items-center gap-2">
                <BulkTransferButton
                  selectedCount={selectedIds.size}
                  onBulkTransfer={handleBulkTransfer}
                />
                <DeleteAllButton
                  selectedCount={selectedIds.size}
                  onDeleteAll={handleDeleteAll}
                />
              </div>
            )}

            {/* Select All Checkbox - Only show in grid view */}
            {viewMode === "grid" && (
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-sm">
                <input
                  type="checkbox"
                  ref={(el) => {
                    if (el) {
                      const isSomeSelected = selectedIds.size > 0 && selectedIds.size < displayedStudents.length;
                      el.indeterminate = isSomeSelected;
                    }
                  }}
                  checked={selectedIds.size === displayedStudents.length && displayedStudents.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Select all displayed students
                      setSelectedIds(new Set(displayedStudents.map(s => s.id)));
                    } else {
                      // Deselect all
                      setSelectedIds(new Set());
                    }
                  }}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Select All
                </span>
              </div>
            )}
            {/* View Toggle */}
            <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />

            {/* Sort */}
            <SortButton
              options={sortOptions}
              defaultOption="ascending"
              onSortChange={handleSortChange}
              resetKey={resetKey}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out" style={{ overflow: 'visible' }}>
        {/* Students Grid or Table */}
        <div className="relative min-h-[400px]" style={{ overflow: 'visible' }}>
          {viewMode === "grid" ? (
            <div
              key={`grid-view-${isFiltering ? 'filtering' : 'filtered'}-${isSorting ? 'sorting' : 'sorted'}-${isRefreshing ? 'refreshing' : 'refreshed'}-${sortOption}`}
              className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ overflow: 'visible' }}
            >
              {isLoading ? (
                <PageSpinner message={isSwitchingView ? "Switching view..." : isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."} size="md" />
              ) : displayedStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  {/* Icon with gradient background */}
                  <div className="relative mb-4">
                    {/* Gradient background circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 midnight:from-cyan-500/5 midnight:to-cyan-600/5 purple:from-pink-500/5 purple:to-pink-600/5 animate-pulse" />
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1">
                    No data available
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                    {hasActiveFilters
                      ? 'No results match the current filters. Try adjusting your filters.'
                      : 'No students found'}
                  </p>

                  {/* Clear filters link */}
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline cursor-pointer transition-colors duration-200"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2 pr-2 md:pr-0" style={{ overflow: 'visible' }}>
                    {displayedStudents.map((student, index) => {
                      // Check if student matches current search/filters
                      const matchesSearch = searchQuery.trim() === "" ||
                        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.class.toLowerCase().includes(searchQuery.toLowerCase());

                      const shouldHide = searchQuery.trim() !== "" && !matchesSearch;

                      return (
                        <div
                          key={student.id}
                          style={{
                            opacity: shouldHide ? 0 : 1,
                            height: shouldHide ? '0' : 'auto',
                            overflow: shouldHide ? 'hidden' : 'visible',
                            transition: 'opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            transitionDelay: `${index / 40}s`,
                          } as React.CSSProperties}
                        >
                          <StudentCard
                            student={student}
                            colorIndex={index}
                            isSelected={selectedIds.has(student.id)}
                            onSelectionChange={(id, selected) => {
                              const newSelectedIds = new Set(selectedIds);
                              if (selected) {
                                newSelectedIds.add(id);
                              } else {
                                newSelectedIds.delete(id);
                              }
                              setSelectedIds(newSelectedIds);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <LoadMoreButton
                      onClick={handleLoadMore}
                      isLoading={isLoadingMore}
                      text="Load More"
                      loadingText="Loading..."
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            <div
              key={`list-view-${isFiltering ? 'filtering' : 'filtered'}-${isSorting ? 'sorting' : 'sorted'}-${isRefreshing ? 'refreshing' : 'refreshed'}-${sortOption}`}
              className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            >
              <StudentTable
                students={filteredStudents}
                isLoading={isLoading}
                loadingMessage={isSwitchingView ? "Switching view..." : isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                totalStudentsCount={students.length}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </div>
          )}
        </div>
      </div>

        {/* Bulk Delete Modal */}
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={handleCloseBulkDeleteModal}
          onConfirm={handleConfirmBulkDelete}
          items={itemsToDelete}
          onRemoveItem={handleRemoveFromDeleteList}
          onRestoreItem={handleRestoreItem}
          onRestoreAll={handleRestoreAll}
          title="Delete Students"
          warningMessage="This will permanently remove these students and all associated data. This action cannot be undone."
          confirmButtonText="Delete Students"
        />

        {/* Bulk Transfer Modal */}
        <BulkTransferModal
          isOpen={isBulkTransferModalOpen}
          onClose={handleCloseBulkTransferModal}
          onConfirm={handleConfirmBulkTransfer}
          students={studentsToTransfer}
          onRemoveStudent={handleRemoveFromTransferList}
          onRestoreStudent={handleRestoreTransferStudent}
          onRestoreAll={handleRestoreAllTransferStudents}
        />
      </div>
    </MainLayout>
  );
}
