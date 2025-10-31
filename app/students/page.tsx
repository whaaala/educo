"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StudentCard, { Student } from "@/components/students/StudentCard";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import {
  Calendar,
  Filter,
  Grid3x3,
  List,
  Download,
  RefreshCw,
  Printer,
  Plus,
  ChevronDown,
} from "lucide-react";

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
  const [dateRange, setDateRange] = useState("10/24/2025 - 10/30/2025");
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 500);
  };

  const displayedStudents = students.slice(0, displayedCount);
  const hasMore = displayedCount < students.length;

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between py-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
            Students
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Peoples</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">Students Grid</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
          </button>

          {/* Print */}
          <button
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
            title="Print"
          >
            <Printer className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
          </button>

          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors">
            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Export</span>
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
          </button>

          {/* Add Student */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white transition-colors shadow-md">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Student</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Filters Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Date Range */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">{dateRange}</span>
              </div>

              {/* Filter */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Filter</span>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-gray-100 dark:bg-gray-700 midnight:bg-cyan-500/20 purple:bg-pink-500/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <List className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              {/* Sort */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Sort by A-Z</span>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </MainLayout>
  );
}
