"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import StatCard from "@/components/shared/StatCard";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Calendar,
  Award,
  BarChart3,
  FileText,
  CheckCircle,
  PieChart,
  Info,
  Activity,
  BookOpen,
} from "lucide-react";

// Subject progress interface
interface SubjectProgress {
  name: string;
  testsCompleted: number;
  totalTests: number;
  currentAverage: number;
  lastTestScore: number | null;
  lastTestDate: string | null;
  status: "completed" | "in_progress" | "pending";
  trend: "up" | "down" | "stable" | null;
}

// Mock subject progress data
const MOCK_SUBJECT_PROGRESS: SubjectProgress[] = [
  {
    name: "Mathematics",
    testsCompleted: 3,
    totalTests: 4,
    currentAverage: 78,
    lastTestScore: 82,
    lastTestDate: "2025-02-10",
    status: "in_progress",
    trend: "up",
  },
  {
    name: "English Language",
    testsCompleted: 4,
    totalTests: 4,
    currentAverage: 72,
    lastTestScore: 75,
    lastTestDate: "2025-02-08",
    status: "completed",
    trend: "stable",
  },
  {
    name: "Physics",
    testsCompleted: 2,
    totalTests: 4,
    currentAverage: 68,
    lastTestScore: 70,
    lastTestDate: "2025-02-05",
    status: "in_progress",
    trend: "down",
  },
  {
    name: "Chemistry",
    testsCompleted: 3,
    totalTests: 4,
    currentAverage: 74,
    lastTestScore: 76,
    lastTestDate: "2025-02-12",
    status: "in_progress",
    trend: "up",
  },
  {
    name: "Biology",
    testsCompleted: 0,
    totalTests: 4,
    currentAverage: 0,
    lastTestScore: null,
    lastTestDate: null,
    status: "pending",
    trend: null,
  },
  {
    name: "Geography",
    testsCompleted: 1,
    totalTests: 3,
    currentAverage: 80,
    lastTestScore: 80,
    lastTestDate: "2025-01-28",
    status: "in_progress",
    trend: "stable",
  },
  {
    name: "Civic Education",
    testsCompleted: 2,
    totalTests: 3,
    currentAverage: 85,
    lastTestScore: 88,
    lastTestDate: "2025-02-01",
    status: "in_progress",
    trend: "up",
  },
];

// Mock child data
const MOCK_CHILD = {
  id: "1",
  name: "Adaeze Okonkwo",
  class: "JSS 2",
  avatar: "https://i.pravatar.cc/150?u=adaeze",
  term: "Term 1",
  year: "2025",
  currentAverage: 74,
  currentPosition: 8,
  totalStudents: 42,
  attendance: 92,
  conduct: "A",
  lastUpdated: "2025-02-12",
};

function getScoreGradient(score: number): string {
  if (score >= 70) return "from-emerald-500 to-emerald-600";
  if (score >= 50) return "from-amber-500 to-amber-600";
  return "from-red-500 to-red-600";
}

function getStatusInfo(status: SubjectProgress["status"]): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case "completed":
      return { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-400", label: "Completed" };
    case "in_progress":
      return { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-400", label: "In Progress" };
    case "pending":
      return { bg: "bg-gray-100 dark:bg-gray-700/40", text: "text-gray-600 dark:text-gray-400", label: "Pending" };
  }
}

function getTrendInfo(trend: SubjectProgress["trend"]): {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
} {
  switch (trend) {
    case "up":
      return {
        icon: <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />,
        label: "Improving",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
      };
    case "down":
      return {
        icon: <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />,
        label: "Declining",
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-500/10",
      };
    case "stable":
      return {
        icon: <Minus className="w-3 h-3 md:w-4 md:h-4" />,
        label: "Stable",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-500/10",
      };
    default:
      return {
        icon: <Minus className="w-3 h-3 md:w-4 md:h-4" />,
        label: "-",
        color: "text-gray-400 dark:text-gray-500",
        bg: "bg-gray-50 dark:bg-gray-500/10",
      };
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

export default function TermProgressPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const childId = params.id as string;
  const isPageLoading = usePageLoad(600);

  // In a real app, fetch child data based on childId
  const child = MOCK_CHILD;

  // Determine navigation source for dynamic breadcrumbs
  const fromPage = searchParams.get("from");

  // Build breadcrumbs based on where user navigated from
  const breadcrumbs = useMemo(() => {
    const baseBreadcrumbs = [
      { label: "Parent Portal", href: "/parents" },
    ];

    if (fromPage === "profile") {
      // Came from child profile page
      return [
        ...baseBreadcrumbs,
        { label: "My Children", href: "/parents/children" },
        { label: child.name.split(" ")[0], href: `/parents/children/${childId}` },
        { label: "Term Progress" },
      ];
    } else {
      // Default: came from My Children list (from=children) or direct navigation
      return [
        ...baseBreadcrumbs,
        { label: "My Children", href: "/parents/children" },
        { label: "Term Progress" },
      ];
    }
  }, [fromPage, childId, child.name]);

  // Calculate overall progress
  const completedSubjects = MOCK_SUBJECT_PROGRESS.filter(
    (s) => s.status === "completed"
  ).length;
  const totalSubjects = MOCK_SUBJECT_PROGRESS.length;
  const overallProgress = Math.round(
    (MOCK_SUBJECT_PROGRESS.reduce((sum, s) => sum + s.testsCompleted, 0) /
      MOCK_SUBJECT_PROGRESS.reduce((sum, s) => sum + s.totalTests, 0)) *
      100
  );

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Term Progress" />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Page Header with Breadcrumbs */}
        <PageHeader
          title="Term Progress"
          breadcrumbs={breadcrumbs}
        />

        {/* Stats Row - Using StatCard component for consistency */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={BarChart3}
            label="Current Avg"
            value={`${child.currentAverage}%`}
            color="green"
          />
          <StatCard
            icon={Trophy}
            label="Position"
            value={`#${child.currentPosition}`}
            color="orange"
          />
          <StatCard
            icon={Calendar}
            label="Attendance"
            value={`${child.attendance}%`}
            color="blue"
          />
          <StatCard
            icon={Award}
            label="Conduct"
            value={child.conduct}
            color="purple"
          />
        </div>

        {/* Student Info Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-blue-900/20 border border-gray-200/60 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0 group/avatar">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 rounded-2xl opacity-60 group-hover/avatar:opacity-80 blur-sm transition-opacity duration-300" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 ring-2 ring-white dark:ring-gray-700 shadow-lg">
                <Image
                  src={child.avatar}
                  alt={child.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                {child.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  {child.class}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {child.term} {child.year}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  Updated: {formatDate(child.lastUpdated)}
                </span>
              </div>
            </div>

            {/* Status Badge - Top Right */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200/50 dark:ring-amber-700/50 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              In Progress
            </span>
          </div>

          {/* Term Completion Progress */}
          <div className="mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                  <PieChart className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Term Completion
                </h3>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {overallProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mt-1.5">
              {completedSubjects} of {totalSubjects} subjects completed
            </p>
          </div>
        </div>

        {/* Subject Progress Section */}
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Subject Progress
              </h3>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {totalSubjects} subjects
            </span>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MOCK_SUBJECT_PROGRESS.map((subject) => {
              const statusInfo = getStatusInfo(subject.status);
              const trendInfo = getTrendInfo(subject.trend);
              const progressPercent =
                subject.totalTests > 0
                  ? Math.round(
                      (subject.testsCompleted / subject.totalTests) * 100
                    )
                  : 0;
              const scoreGradient =
                subject.currentAverage > 0
                  ? getScoreGradient(subject.currentAverage)
                  : "from-gray-400 to-gray-500";

              return (
                <div
                  key={subject.name}
                  className="group p-5 rounded-xl bg-gradient-to-br from-slate-50 via-white to-gray-50/50 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-900/30 border border-gray-200/60 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {subject.name}
                      </h4>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide ${statusInfo.bg} ${statusInfo.text} ring-1 ring-inset ring-current/10 mt-0.5`}
                      >
                        <span className={`w-1 h-1 rounded-full ${
                          subject.status === "completed" ? "bg-emerald-500" :
                          subject.status === "in_progress" ? "bg-amber-500 animate-pulse" :
                          "bg-gray-400"
                        }`} />
                        {statusInfo.label}
                      </span>
                    </div>
                    {/* Score Circle */}
                    <div className="relative">
                      {/* Outer glow ring */}
                      <div className={`absolute -inset-1 rounded-full bg-gradient-to-br ${scoreGradient} opacity-30 blur-md`} />
                      {/* Main circle */}
                      <div
                        className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${scoreGradient} flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-700`}
                      >
                        <span className="text-[11px] font-bold text-white drop-shadow-sm">
                          {subject.currentAverage > 0
                            ? `${subject.currentAverage}%`
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Stats Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {/* Average */}
                    <div className="relative py-3 px-2.5 rounded-lg bg-emerald-50/40 dark:bg-emerald-900/20 border border-emerald-100/60 dark:border-emerald-800/30 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-green-500/[0.03] dark:from-emerald-500/[0.05] dark:to-green-500/[0.05] pointer-events-none" />
                      <div className="relative text-center">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {subject.currentAverage > 0
                            ? `${subject.currentAverage}%`
                            : "-"}
                        </p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Average</p>
                      </div>
                    </div>

                    {/* Tests */}
                    <div className="relative py-3 px-2.5 rounded-lg bg-amber-50/40 dark:bg-amber-900/20 border border-amber-100/60 dark:border-amber-800/30 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-orange-500/[0.03] dark:from-amber-500/[0.05] dark:to-orange-500/[0.05] pointer-events-none" />
                      <div className="relative text-center">
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                          {subject.testsCompleted}/{subject.totalTests}
                        </p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Tests</p>
                      </div>
                    </div>

                    {/* Last Test */}
                    <div className="relative py-3 px-2.5 rounded-lg bg-indigo-50/40 dark:bg-indigo-900/20 border border-indigo-100/60 dark:border-indigo-800/30 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] dark:from-indigo-500/[0.05] dark:to-purple-500/[0.05] pointer-events-none" />
                      <div className="relative text-center">
                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          {subject.lastTestScore
                            ? `${subject.lastTestScore}%`
                            : "-"}
                        </p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Last Test</p>
                      </div>
                    </div>

                    {/* Trend */}
                    <div className={`relative py-3 px-2.5 rounded-lg overflow-hidden ${
                      subject.trend === "up"
                        ? "bg-emerald-50/40 dark:bg-emerald-900/20 border border-emerald-100/60 dark:border-emerald-800/30"
                        : subject.trend === "down"
                        ? "bg-red-50/40 dark:bg-red-900/20 border border-red-100/60 dark:border-red-800/30"
                        : subject.trend === "stable"
                        ? "bg-amber-50/40 dark:bg-amber-900/20 border border-amber-100/60 dark:border-amber-800/30"
                        : "bg-gray-50/40 dark:bg-gray-900/20 border border-gray-100/60 dark:border-gray-700/30"
                    }`}>
                      <div className={`absolute inset-0 pointer-events-none ${
                        subject.trend === "up"
                          ? "bg-gradient-to-br from-emerald-500/[0.03] to-green-500/[0.03] dark:from-emerald-500/[0.05] dark:to-green-500/[0.05]"
                          : subject.trend === "down"
                          ? "bg-gradient-to-br from-red-500/[0.03] to-rose-500/[0.03] dark:from-red-500/[0.05] dark:to-rose-500/[0.05]"
                          : subject.trend === "stable"
                          ? "bg-gradient-to-br from-amber-500/[0.03] to-orange-500/[0.03] dark:from-amber-500/[0.05] dark:to-orange-500/[0.05]"
                          : "bg-gradient-to-br from-gray-500/[0.02] to-slate-500/[0.02] dark:from-gray-500/[0.03] dark:to-slate-500/[0.03]"
                      }`} />
                      <div className="relative text-center">
                        <p className={`text-sm font-bold ${trendInfo.color}`}>
                          {trendInfo.label}
                        </p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Trend</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Row */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    <span className="text-[10px] font-bold text-gray-900 dark:text-white">
                      {progressPercent}%
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          subject.status === "completed"
                            ? "bg-gradient-to-r from-emerald-500 to-green-500"
                            : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      complete
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            The final report card will be generated at the end of the term once
            all assessments are completed.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
