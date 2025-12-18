"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import StatCard from "@/components/shared/StatCard";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  BookOpen,
  ClipboardList,
  Calendar,
  FileText,
} from "lucide-react";

// Homework type
interface Homework {
  id: string;
  childId: string;
  childName: string;
  childPhoto: string;
  class: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  teacher: string;
  assignedDate: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  submissionDate?: string;
  grade?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
}

// Mock Data
const MOCK_HOMEWORK: Homework[] = [
  {
    id: "hw-001",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    subject: "Physics",
    title: "Complete Chapter 5 Exercise",
    description: "Solve all exercises from Chapter 5: Motion and Force. Show all workings clearly.",
    teacher: "Mrs. Nkechi Eze",
    assignedDate: "2024-01-20",
    dueDate: "2024-01-25",
    status: "graded",
    submissionDate: "2024-01-24",
    grade: "A",
    score: 18,
    maxScore: 20,
    feedback: "Excellent work! Clear presentation and correct solutions.",
  },
  {
    id: "hw-002",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    subject: "Chemistry",
    title: "Lab Report on Acid-Base Reactions",
    description: "Write a detailed lab report on the acid-base titration experiment conducted in class.",
    teacher: "Mr. Chidi Okoro",
    assignedDate: "2024-01-22",
    dueDate: "2024-01-26",
    status: "submitted",
    submissionDate: "2024-01-25",
  },
  {
    id: "hw-003",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "SS 1",
    section: "B",
    subject: "Mathematics",
    title: "Quadratic Equations Worksheet",
    description: "Complete the worksheet on solving quadratic equations using factorization and formula methods.",
    teacher: "Mr. Tunde Adeyemi",
    assignedDate: "2024-01-23",
    dueDate: "2024-01-27",
    status: "pending",
  },
  {
    id: "hw-004",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    subject: "English Language",
    title: "Essay Writing: My Favorite Place",
    description: "Write a 500-word descriptive essay about your favorite place. Use vivid imagery and sensory details.",
    teacher: "Mrs. Funke Adeleke",
    assignedDate: "2024-01-18",
    dueDate: "2024-01-22",
    status: "graded",
    submissionDate: "2024-01-21",
    grade: "B",
    score: 15,
    maxScore: 20,
    feedback: "Good effort. Work on using more descriptive language.",
  },
  {
    id: "hw-005",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "SS 1",
    section: "B",
    subject: "Biology",
    title: "Cell Structure Diagram",
    description: "Draw and label a detailed diagram of an animal cell and a plant cell. Include all organelles.",
    teacher: "Dr. Amina Bello",
    assignedDate: "2024-01-15",
    dueDate: "2024-01-20",
    status: "overdue",
  },
  {
    id: "hw-006",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "SS 1",
    section: "B",
    subject: "Physics",
    title: "Newton's Laws Problems",
    description: "Solve problems 1-15 from the textbook on Newton's Laws of Motion.",
    teacher: "Mr. Emeka Obi",
    assignedDate: "2024-01-24",
    dueDate: "2024-01-30",
    status: "pending",
  },
  {
    id: "hw-007",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    subject: "Social Studies",
    title: "Nigerian Government Structure",
    description: "Research and write about the three arms of government in Nigeria.",
    teacher: "Mr. Yusuf Ibrahim",
    assignedDate: "2024-01-25",
    dueDate: "2024-02-01",
    status: "pending",
  },
  {
    id: "hw-008",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 1",
    section: "A",
    subject: "Mathematics",
    title: "Algebra Basics Worksheet",
    description: "Complete exercises 1-20 on basic algebraic expressions and equations.",
    teacher: "Mr. Tunde Adeyemi",
    assignedDate: "2023-11-10",
    dueDate: "2023-11-17",
    status: "graded",
    submissionDate: "2023-11-15",
    grade: "A",
    score: 19,
    maxScore: 20,
    feedback: "Outstanding work! Perfect understanding of algebraic concepts.",
  },
  {
    id: "hw-009",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "JSS 3",
    section: "B",
    subject: "English Language",
    title: "Book Report: Things Fall Apart",
    description: "Write a comprehensive book report on Chinua Achebe's Things Fall Apart.",
    teacher: "Mrs. Funke Adeleke",
    assignedDate: "2023-10-05",
    dueDate: "2023-10-20",
    status: "graded",
    submissionDate: "2023-10-18",
    grade: "B",
    score: 16,
    maxScore: 20,
    feedback: "Good analysis of themes. Work on deeper character exploration.",
  },
  {
    id: "hw-010",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 1",
    section: "A",
    subject: "Biology",
    title: "Ecosystem Project",
    description: "Create a poster showing the food chain in a local ecosystem.",
    teacher: "Dr. Amina Bello",
    assignedDate: "2023-09-15",
    dueDate: "2023-09-25",
    status: "graded",
    submissionDate: "2023-09-24",
    grade: "A",
    score: 18,
    maxScore: 20,
    feedback: "Excellent visual representation. Great attention to detail.",
  },
];

// Filter Options
const CHILD_OPTIONS = [
  { value: "all", label: "All Children" },
  { value: "child-001", label: "Adaeze Okonkwo" },
  { value: "child-002", label: "Chukwuemeka Okonkwo" },
];

const SUBJECT_OPTIONS = [
  { value: "all", label: "All Subjects" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "English Language", label: "English Language" },
  { value: "Biology", label: "Biology" },
  { value: "Social Studies", label: "Social Studies" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "submitted", label: "Submitted" },
  { value: "graded", label: "Graded" },
  { value: "overdue", label: "Overdue" },
];

const YEAR_OPTIONS = [
  { value: "all", label: "All Years" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusConfig(status: Homework["status"]) {
  switch (status) {
    case "graded":
      return {
        label: "Graded",
        icon: CheckCircle2,
        className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      };
    case "submitted":
      return {
        label: "Submitted",
        icon: Clock,
        className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      };
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      };
    case "overdue":
      return {
        label: "Overdue",
        icon: AlertTriangle,
        className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      };
  }
}

export default function ParentHomeworkPage() {
  const isPageLoading = usePageLoad(600);
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  // Animation trigger for filter changes
  const filterKey = `${searchQuery}-${selectedChild}-${selectedSubject}-${selectedStatus}-${selectedYear}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Filter homework
  const filteredHomework = useMemo(() => {
    return MOCK_HOMEWORK.filter((hw) => {
      const matchesChild = selectedChild === "all" || hw.childId === selectedChild;
      const matchesSubject = selectedSubject === "all" || hw.subject === selectedSubject;
      const matchesStatus = selectedStatus === "all" || hw.status === selectedStatus;
      const homeworkYear = new Date(hw.dueDate).getFullYear().toString();
      const matchesYear = selectedYear === "all" || homeworkYear === selectedYear;
      const matchesSearch =
        searchQuery === "" ||
        hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hw.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hw.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hw.childName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChild && matchesSubject && matchesStatus && matchesYear && matchesSearch;
    });
  }, [selectedChild, selectedSubject, selectedStatus, selectedYear, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = MOCK_HOMEWORK.length;
    const pending = MOCK_HOMEWORK.filter((hw) => hw.status === "pending").length;
    const submitted = MOCK_HOMEWORK.filter((hw) => hw.status === "submitted").length;
    const graded = MOCK_HOMEWORK.filter((hw) => hw.status === "graded").length;
    const overdue = MOCK_HOMEWORK.filter((hw) => hw.status === "overdue").length;
    return { total, pending, submitted, graded, overdue };
  }, []);

  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger((prev) => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  useEffect(() => {
    if (animationTrigger <= 0) return;
    const timeoutId = setTimeout(() => {
      const root = tableWrapRef.current;
      if (!root) return;
      const rows = root.querySelectorAll("tbody tr");
      rows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        const delay = index / 80;
        htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
      });
      setTimeout(() => {
        rows.forEach((row) => {
          const htmlRow = row as HTMLElement;
          htmlRow.style.animation = "";
        });
      }, 600);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [animationTrigger]);

  // Table columns
  const columns: ColumnConfig<Homework>[] = [
    {
      key: "childName",
      label: "Student",
      sortable: true,
      render: (hw) => (
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            <Image
              src={hw.childPhoto}
              alt={hw.childName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-white block">
              {hw.childName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {hw.class} - {hw.section}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (hw) => (
        <div>
          <span className="text-sm font-medium text-gray-900 dark:text-white block">
            {hw.subject}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {hw.teacher}
          </span>
        </div>
      ),
    },
    {
      key: "title",
      label: "Assignment",
      sortable: true,
      render: (hw) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {hw.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {hw.description}
          </p>
        </div>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (hw) => {
        const isOverdue = hw.status === "overdue";
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${isOverdue ? "text-red-500" : "text-gray-400"}`} />
            <span className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-600 dark:text-gray-300"}`}>
              {formatDate(hw.dueDate)}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (hw) => {
        const config = getStatusConfig(hw.status);
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        );
      },
    },
    {
      key: "score",
      label: "Score",
      sortable: true,
      render: (hw) => {
        if (hw.status !== "graded" || hw.score === undefined) {
          return <span className="text-sm text-gray-400">-</span>;
        }
        const percentage = (hw.score / (hw.maxScore || 100)) * 100;
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  percentage >= 70 ? "bg-green-500" : percentage >= 50 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {hw.score}/{hw.maxScore}
            </span>
            {hw.grade && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                hw.grade === "A" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                hw.grade === "B" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                hw.grade === "C" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {hw.grade}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Action",
      className: "text-center",
      render: (hw) => (
        <div className="flex items-center justify-center">
          <Link
            href={`/parents/homework/${hw.id}`}
            className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Homework" />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <PageHeader
          title="Homework"
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "Homework" },
          ]}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            icon={BookOpen}
            label="Total"
            value={stats.total.toString()}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pending.toString()}
            color="amber"
          />
          <StatCard
            icon={ClipboardList}
            label="Submitted"
            value={stats.submitted.toString()}
            color="indigo"
          />
          <StatCard
            icon={CheckCircle2}
            label="Graded"
            value={stats.graded.toString()}
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            label="Overdue"
            value={stats.overdue.toString()}
            color="red"
          />
        </div>

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by title, subject, teacher..."
          filters={[
            {
              label: "Child",
              value: selectedChild,
              onChange: (val) => setSelectedChild(String(val)),
              options: CHILD_OPTIONS,
            },
            {
              label: "Year",
              value: selectedYear,
              onChange: (val) => setSelectedYear(String(val)),
              options: YEAR_OPTIONS,
            },
            {
              label: "Subject",
              value: selectedSubject,
              onChange: (val) => setSelectedSubject(String(val)),
              options: SUBJECT_OPTIONS,
            },
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => setSelectedStatus(String(val)),
              options: STATUS_OPTIONS,
            },
          ]}
        />

        {/* Homework Table */}
        <div className="relative">
          <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

          <div
            ref={tableWrapRef}
            key={`homework-table-${filterKey}`}
            className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden"
          >
            <DataTable
              data={filteredHomework}
              columns={columns}
              getRowKey={(hw) => hw.id}
              emptyMessage="No homework found"
              title=""
              showSearch={false}
              defaultItemsPerPage={10}
              itemsPerPageOptions={[5, 10, 15, 20, 25]}
              enablePagination={true}
              enableItemsPerPage={true}
              stickyColumnCount={1}
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Track Your Child&apos;s Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click the eye icon on any homework to view full details including assignment
                instructions, submission status, teacher feedback, and grades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
