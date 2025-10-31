"use client";

import { useState, useEffect, useRef } from "react";
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

// Sample data
const sampleStudents: Student[] = [
  {
    id: "AD9892434",
    name: "Janet Daniel",
    rollNo: "35013",
    class: "III, A",
    gender: "Female",
    joinedOn: "10 Jan 2017",
    status: "Active",
  },
  {
    id: "AD9892433",
    name: "Joann Michael",
    rollNo: "35012",
    class: "IV, B",
    gender: "Male",
    joinedOn: "19 Aug 2014",
    status: "Active",
  },
  {
    id: "AD9892432",
    name: "Kathleen Dison",
    rollNo: "35011",
    class: "III, A",
    gender: "Female",
    joinedOn: "5 Dec 2017",
    status: "Active",
  },
  {
    id: "AD9892431",
    name: "Lisa Gourley",
    rollNo: "35010",
    class: "II, B",
    gender: "Female",
    joinedOn: "13 May 2017",
    status: "Inactive",
  },
  {
    id: "AD9892430",
    name: "Ralph Claudia",
    rollNo: "35009",
    class: "II, B",
    gender: "Male",
    joinedOn: "20 Jun 20215",
    status: "Active",
  },
  {
    id: "AD9892429",
    name: "Ralph Claudia",
    rollNo: "35008",
    class: "II, B",
    gender: "Male",
    joinedOn: "20 Jun 20215",
    status: "Active",
  },
  {
    id: "AD9892428",
    name: "Julie Scott",
    rollNo: "35007",
    class: "V, A",
    gender: "Female",
    joinedOn: "18 Jan 2023",
    status: "Active",
  },
  {
    id: "AD9892427",
    name: "Susan Boswell",
    rollNo: "35006",
    class: "VIII, B",
    gender: "Female",
    joinedOn: "26 May 2020",
    status: "Active",
  },
  {
    id: "AD9892426",
    name: "David Johnson",
    rollNo: "35005",
    class: "VI, A",
    gender: "Male",
    joinedOn: "15 Mar 2019",
    status: "Active",
  },
  {
    id: "AD9892425",
    name: "Emily Brown",
    rollNo: "35004",
    class: "IV, B",
    gender: "Female",
    joinedOn: "22 Jul 2018",
    status: "Active",
  },
  {
    id: "AD9892424",
    name: "Michael Davis",
    rollNo: "35003",
    class: "V, A",
    gender: "Male",
    joinedOn: "10 Sep 2019",
    status: "Active",
  },
  {
    id: "AD9892423",
    name: "Sarah Wilson",
    rollNo: "35002",
    class: "III, B",
    gender: "Female",
    joinedOn: "5 Nov 2020",
    status: "Inactive",
  },
  {
    id: "AD9892422",
    name: "James Martinez",
    rollNo: "35001",
    class: "VII, A",
    gender: "Male",
    joinedOn: "18 Feb 2018",
    status: "Active",
  },
  {
    id: "AD9892421",
    name: "Jessica Taylor",
    rollNo: "35000",
    class: "II, B",
    gender: "Female",
    joinedOn: "30 Apr 2021",
    status: "Active",
  },
  {
    id: "AD9892420",
    name: "Christopher Anderson",
    rollNo: "34999",
    class: "VI, B",
    gender: "Male",
    joinedOn: "12 Aug 2019",
    status: "Active",
  },
  {
    id: "AD9892419",
    name: "Amanda Thomas",
    rollNo: "34998",
    class: "IV, A",
    gender: "Female",
    joinedOn: "25 Jan 2020",
    status: "Active",
  },
];

export default function AllStudentsPage() {
  const [students] = useState<Student[]>(sampleStudents);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(12);

  // Filter fields configuration
  const filterFields: FilterField[] = [
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
    setDateRange({ startDate, endDate });
    setDisplayedCount(12); // Reset to first page when date range changes
  };

  const handleFilterChange = (updatedFilters: FilterValues) => {
    setIsFiltering(true);
    // Delay to allow exit animation
    setTimeout(() => {
      setFilters(updatedFilters);
      setDisplayedCount(12); // Reset to first page when filters change
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

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
    // Delay to allow exit animation
    setTimeout(() => {
      // Reset to first page when refreshing
      setDisplayedCount(12);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  const handlePrint = () => {
    // Create a print window with the current data
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get current date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Use filtered students (all of them, not just displayed)
    const studentsToPrint = filteredStudents;

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
              <div class="student-avatar">${student.name.charAt(0)}</div>
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
                <div class="table-avatar">${student.name.charAt(0)}</div>
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

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      setDisplayedCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 500);
  };

  // Apply sorting to students
  const sortedStudents = [...students].sort((a, b) => {
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
        return 0;
    }
  });

  // Apply filters to students
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

    return matchesClass && matchesSection && matchesName && matchesGender && matchesStatus;
  });

  const displayedStudents = filteredStudents.slice(0, displayedCount);
  const hasMore = displayedCount < filteredStudents.length;

  // Check if we're in a loading state
  const isLoading = isFiltering || isSorting || isRefreshing;

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
        {/* Left Section - Title and Breadcrumb */}
        <PageHeader
          title="Students"
          breadcrumbs={[
            { label: "Dashboard" },
            { label: "Peoples" },
            { label: viewMode === "grid" ? "Students Grid" : "Students Table", isActive: true },
          ]}
        />

        {/* Right Section - Action Buttons */}
        <PageActions addButtonLabel="Add Student" onRefresh={handleRefresh} onPrint={handlePrint} />
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
        {/* Filters Bar */}
        <div className="mb-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
            {/* Left Section - Date and Filter */}
            <div className="flex items-center gap-3 lg:flex-1">
              {/* Date Range Picker */}
              <DateRangePicker onChange={handleDateRangeChange} />

              {/* Filter */}
              <FilterButton fields={filterFields} onFilterChange={handleFilterChange} />
            </div>

            {/* Right Section - View Toggle and Sort */}
            <div className="flex items-center justify-end gap-3 lg:flex-1">
              {/* View Toggle */}
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

              {/* Sort */}
              <SortButton
                options={sortOptions}
                defaultOption="ascending"
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        {/* Students Grid or Table */}
        <div className="relative min-h-[400px]">
          {viewMode === "grid" ? (
            <div
              key={`grid-view-${isFiltering ? 'filtering' : 'filtered'}-${isSorting ? 'sorting' : 'sorted'}-${isRefreshing ? 'refreshing' : 'refreshed'}-${sortOption}`}
              className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            >
              {isLoading ? (
                <PageSpinner message={isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."} size="md" />
              ) : (
                <>
                  <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
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
                            transform: shouldHide ? 'translateX(60px) scale(0.9)' : 'translateX(0) scale(1)',
                            height: shouldHide ? '0' : 'auto',
                            overflow: shouldHide ? 'hidden' : 'visible',
                            animation: searchQuery.trim() && !shouldHide ? `fadeSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index / 40}s both` : 'none',
                            transition: 'opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            transitionDelay: `${index / 40}s`,
                          } as React.CSSProperties}
                        >
                          <StudentCard student={student} colorIndex={index} />
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
                students={displayedStudents}
                isLoading={isLoading}
                loadingMessage={isRefreshing ? "Refreshing..." : isSorting ? "Sorting..." : "Filtering..."}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
