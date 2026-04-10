"use client";

import { useState, useMemo } from "react";
import { DashboardPage } from "@/components/pages";
import StatCard from "@/components/shared/StatCard";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  Search,
  TrendingUp,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";

// Mock data
const mockClasses = [
  {
    id: "CLS-001",
    name: "SS 1A",
    subject: "Mathematics",
    students: 35,
    schedule: "Mon, Wed, Fri",
    time: "9:00 AM - 10:00 AM",
    room: "Room 204",
    term: "First Term",
    academicYear: "2024/2025",
    averageAttendance: 92,
    averageGrade: 75,
    pendingGrades: 5,
    nextClass: "Tomorrow, 9:00 AM",
  },
  {
    id: "CLS-002",
    name: "SS 2B",
    subject: "Further Mathematics",
    students: 28,
    schedule: "Tue, Thu",
    time: "10:00 AM - 11:00 AM",
    room: "Room 205",
    term: "First Term",
    academicYear: "2024/2025",
    averageAttendance: 88,
    averageGrade: 68,
    pendingGrades: 3,
    nextClass: "Today, 10:00 AM",
  },
  {
    id: "CLS-003",
    name: "SS 3A",
    subject: "Mathematics",
    students: 32,
    schedule: "Mon, Wed",
    time: "2:00 PM - 3:00 PM",
    room: "Room 204",
    term: "First Term",
    academicYear: "2024/2025",
    averageAttendance: 95,
    averageGrade: 82,
    pendingGrades: 0,
    nextClass: "Monday, 2:00 PM",
  },
  {
    id: "CLS-004",
    name: "JSS 3B",
    subject: "Mathematics",
    students: 40,
    schedule: "Tue, Thu, Fri",
    time: "11:00 AM - 12:00 PM",
    room: "Room 103",
    term: "First Term",
    academicYear: "2024/2025",
    averageAttendance: 90,
    averageGrade: 72,
    pendingGrades: 4,
    nextClass: "Today, 11:00 AM",
  },
];

export default function MyClassesPage() {
  const [classes] = useState(mockClasses);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique subjects
  const subjects = useMemo(() => {
    const subjectSet = new Set(classes.map((cls) => cls.subject));
    return ["all", ...Array.from(subjectSet)];
  }, [classes]);

  // Filter classes
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || cls.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [classes, searchQuery, selectedSubject]);

  // Calculate total students
  const totalStudents = useMemo(() => {
    return filteredClasses.reduce((sum, cls) => sum + cls.students, 0);
  }, [filteredClasses]);

  const totalPendingGrades = useMemo(() => {
    return filteredClasses.reduce((sum, cls) => sum + cls.pendingGrades, 0);
  }, [filteredClasses]);

  return (
    <DashboardPage
      title="My Classes"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Teacher Portal", href: "/teachers/portal/dashboard" },
        { label: "My Classes", isActive: true },
      ]}
      loadingText="Loading My Classes"
      afterStats={
        <div className="mt-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
            <StatCard
              icon={BookOpen}
              label="Total Classes"
              value={filteredClasses.length}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Total Students"
              value={totalStudents}
              color="green"
            />
            <StatCard
              icon={ClipboardCheck}
              label="Pending Grades"
              value={totalPendingGrades}
              color="orange"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-200 ease-out">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject === "all" ? "All Subjects" : subject}
                </option>
              ))}
            </select>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-[900ms] delay-250 ease-out">
            {filteredClasses.map((cls) => (
              <Link
                key={cls.id}
                href={`/teachers/portal/my-classes/${cls.id}`}
                className="block bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 midnight:hover:border-cyan-400 purple:hover:border-pink-400 transition-all p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                      {cls.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-1">
                      {cls.subject}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                      {cls.students} Students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                      {cls.room}
                    </span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                      {cls.schedule}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                      {cls.time}
                    </span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1">
                      Attendance
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${cls.averageAttendance}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                        {cls.averageAttendance}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1">
                      Avg. Grade
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${cls.averageGrade}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                        {cls.averageGrade}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Class & Pending Grades */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                    Next: {cls.nextClass}
                  </span>
                  {cls.pendingGrades > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                      {cls.pendingGrades} Pending
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredClasses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
              <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
                No Classes Found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
