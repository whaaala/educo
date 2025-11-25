"use client";

import { useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  Clock,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle,
  Award,
  GraduationCap,
  UserCheck,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

// Mock data for lecturer
const mockLecturerData = {
  lecturerId: "LEC-001",
  name: "Dr. Ahmed Ibrahim",
  department: "Computer Science",
  faculty: "Faculty of Science",
  courses: [
    {
      id: "CSC-301",
      code: "CSC 301",
      title: "Data Structures & Algorithms",
      credits: 3,
      students: 85,
      schedule: "Mon, Wed - 10:00 AM",
      venue: "LT 5",
      level: "300 Level",
    },
    {
      id: "CSC-401",
      code: "CSC 401",
      title: "Artificial Intelligence",
      credits: 4,
      students: 62,
      schedule: "Tue, Thu - 2:00 PM",
      venue: "Lab 3",
      level: "400 Level",
    },
    {
      id: "CSC-502",
      code: "CSC 502",
      title: "Research Methodology",
      credits: 2,
      students: 28,
      schedule: "Fri - 9:00 AM",
      venue: "LT 2",
      level: "500 Level (MSc)",
    },
  ],
  todaySchedule: [
    {
      time: "10:00 AM - 12:00 PM",
      course: "CSC 301 - Data Structures",
      level: "300 Level",
      venue: "LT 5",
      status: "upcoming",
    },
    {
      time: "2:00 PM - 3:00 PM",
      course: "Office Hours",
      level: "All Levels",
      venue: "Office 204",
      status: "upcoming",
    },
  ],
  officeHours: {
    nextSession: "Today, 2:00 PM - 4:00 PM",
    location: "Office 204, 2nd Floor",
    bookedSlots: 5,
    availableSlots: 3,
  },
  pendingTasks: {
    grading: 24,
    supervision: 8,
    officeHours: 5,
  },
  supervision: {
    undergraduate: 6,
    masters: 2,
    phd: 0,
  },
  recentActivity: [
    {
      id: "1",
      type: "grade",
      message: "Graded CSC 301 Mid-Semester Exam",
      time: "3 hours ago",
    },
    {
      id: "2",
      type: "supervision",
      message: "Reviewed thesis draft - John Doe",
      time: "Yesterday",
    },
    {
      id: "3",
      type: "office",
      message: "Conducted office hours session",
      time: "2 days ago",
    },
  ],
};

export default function LecturerDashboardPage() {
  const isLoading = usePageLoad(600);
  const [lecturerData] = useState(mockLecturerData);

  const totalStudents = useMemo(() => {
    return lecturerData.courses.reduce((sum, course) => sum + course.students, 0);
  }, [lecturerData.courses]);

  const totalCredits = useMemo(() => {
    return lecturerData.courses.reduce((sum, course) => sum + course.credits, 0);
  }, [lecturerData.courses]);

  const totalSupervision = useMemo(() => {
    return (
      lecturerData.supervision.undergraduate +
      lecturerData.supervision.masters +
      lecturerData.supervision.phd
    );
  }, [lecturerData.supervision]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "grade":
        return <Award className="w-4 h-4" />;
      case "supervision":
        return <UserCheck className="w-4 h-4" />;
      case "office":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <MainLayout>
      <PageLoader isLoading={isLoading} loadingText="Loading Lecturer Portal" />

      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title={`Welcome, ${lecturerData.name}`}
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Lecturer Portal" },
              { label: "Dashboard", isActive: true },
            ]}
          />

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {lecturerData.department} • {lecturerData.faculty} • {lecturerData.lecturerId}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
          {/* Total Courses */}
          <Link href="/lecturers/portal/my-courses">
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                    My Courses
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mt-2">
                    {lecturerData.courses.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {totalCredits} Credit Hours
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-500/20 purple:bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
              </div>
            </div>
          </Link>

          {/* Total Students */}
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mt-2">
                  {totalStudents}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Across all courses
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 midnight:bg-cyan-500/20 purple:bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
            </div>
          </div>

          {/* Supervision */}
          <Link href="/lecturers/portal/supervision">
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                    Supervision
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mt-2">
                    {totalSupervision}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {lecturerData.supervision.undergraduate} UG • {lecturerData.supervision.masters} MSc
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 midnight:bg-cyan-500/20 purple:bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
              </div>
            </div>
          </Link>

          {/* Pending Grading */}
          <Link href="/lecturers/portal/grading">
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                    Pending Grading
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mt-2">
                    {lecturerData.pendingTasks.grading}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Assessments to grade
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 midnight:bg-cyan-500/20 purple:bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-orange-600 dark:text-orange-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Schedule & Courses */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-left-2 duration-[900ms] delay-200 ease-out">
            {/* Today's Schedule */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </h2>
                <Link
                  href="/lecturers/portal/schedule"
                  className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                >
                  View Full Schedule
                </Link>
              </div>

              <div className="space-y-3">
                {lecturerData.todaySchedule.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20"
                  >
                    <div className="flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                        {session.course}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.time} • {session.venue} • {session.level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Courses */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  My Courses
                </h2>
                <Link
                  href="/lecturers/portal/my-courses"
                  className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {lecturerData.courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/lecturers/portal/my-courses/${course.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-500 dark:hover:border-blue-500 midnight:hover:border-cyan-400 purple:hover:border-pink-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                          {course.code} - {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {course.students} Students • {course.credits} Credits • {course.level}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {course.schedule} • {course.venue}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        Active
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Office Hours, Quick Actions & Activity */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-[900ms] delay-200 ease-out">
            {/* Office Hours */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Office Hours
              </h2>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-500/10 purple:bg-blue-500/10 border border-blue-200 dark:border-blue-800 midnight:border-blue-500/30 purple:border-blue-500/30 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    {lecturerData.officeHours.nextSession}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {lecturerData.officeHours.location}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Booked Slots</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {lecturerData.officeHours.bookedSlots}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Available Slots</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {lecturerData.officeHours.availableSlots}
                  </span>
                </div>

                <Link
                  href="/lecturers/portal/office-hours"
                  className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors mt-3"
                >
                  Manage Office Hours
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mb-4">
                Quick Actions
              </h2>

              <div className="space-y-2">
                <Link
                  href="/lecturers/portal/mark-attendance"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark Attendance
                  </span>
                </Link>

                <Link
                  href="/lecturers/portal/grading"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <ClipboardCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter Grades
                  </span>
                </Link>

                <Link
                  href="/lecturers/portal/supervision"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Thesis Supervision
                  </span>
                </Link>

                <Link
                  href="/lecturers/portal/materials"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Materials
                  </span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mb-4">
                Recent Activity
              </h2>

              <div className="space-y-4">
                {lecturerData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
