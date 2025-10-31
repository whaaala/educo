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

  // Sort options
  const sortOptions = [
    { label: "Ascending", value: "ascending" },
    { label: "Descending", value: "descending" },
    { label: "Recently Viewed", value: "recently_viewed" },
    { label: "Recently Added", value: "recently_added" },
  ];

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    console.log("Date range changed:", startDate, "-", endDate);
    // You can add logic here to filter students based on the date range
  };

  const handleFilterChange = (updatedFilters: FilterValues) => {
    setFilters(updatedFilters);
    setDisplayedCount(12); // Reset to first page when filters change
  };

  const handleSortChange = (sortValue: string) => {
    console.log("Sort changed:", sortValue);
    // You can add logic here to sort students
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

  // Apply filters to students
  const filteredStudents = students.filter((student) => {
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

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-6 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
        {/* Left Section - Title and Breadcrumb */}
        <PageHeader
          title="Students"
          breadcrumbs={[
            { label: "Dashboard" },
            { label: "Peoples" },
            { label: "Students Grid", isActive: true },
          ]}
        />

        {/* Right Section - Action Buttons */}
        <PageActions addButtonLabel="Add Student" />
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
        {/* Filters Bar */}
        <div className="mb-6">
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
        <div className="relative overflow-hidden">
          {viewMode === "grid" ? (
            <div
              key="grid-view"
              className="animate-in fade-in zoom-in-95 slide-in-from-right-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            >
              <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedStudents.map((student, index) => (
                  <StudentCard key={student.id} student={student} colorIndex={index} />
                ))}
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
            </div>
          ) : (
            <div
              key="list-view"
              className="animate-in fade-in zoom-in-95 slide-in-from-left-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            >
              <StudentTable students={displayedStudents} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
