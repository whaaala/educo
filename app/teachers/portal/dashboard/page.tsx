"use client";

import { useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import StatCard from "@/components/shared/StatCard";
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
  Video,
} from "lucide-react";
import { useMeetings } from "@/contexts/MeetingsContext";
import Link from "next/link";

// Mock data - In production, this would come from API/context
const mockTeacherData = {
  teacherId: "TCH-001",
  name: "John Adebayo",
  department: "Mathematics",
  classes: [
    {
      id: "CLS-001",
      name: "SS 1A",
      subject: "Mathematics",
      students: 35,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      room: "Room 204",
    },
    {
      id: "CLS-002",
      name: "SS 2B",
      subject: "Further Mathematics",
      students: 28,
      schedule: "Tue, Thu - 10:00 AM",
      room: "Room 205",
    },
    {
      id: "CLS-003",
      name: "SS 3A",
      subject: "Mathematics",
      students: 32,
      schedule: "Mon, Wed - 2:00 PM",
      room: "Room 204",
    },
  ],
  todaySchedule: [
    {
      time: "9:00 AM - 10:00 AM",
      subject: "Mathematics",
      class: "SS 1A",
      room: "Room 204",
      status: "upcoming",
    },
    {
      time: "11:00 AM - 12:00 PM",
      subject: "Further Mathematics",
      class: "SS 2B",
      room: "Room 205",
      status: "upcoming",
    },
    {
      time: "2:00 PM - 3:00 PM",
      subject: "Mathematics",
      class: "SS 3A",
      room: "Room 204",
      status: "upcoming",
    },
  ],
  pendingTasks: {
    grading: 12,
    attendance: 2,
    assignments: 5,
  },
  recentActivity: [
    {
      id: "1",
      type: "grade",
      message: "Graded Mathematics Test for SS 1A",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "attendance",
      message: "Marked attendance for SS 2B",
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "assignment",
      message: "Created new assignment for SS 3A",
      time: "Yesterday",
    },
  ],
};

export default function TeacherDashboardPage() {
  const isLoading = usePageLoad(600);
  const [teacherData] = useState(mockTeacherData);

  // Get meetings from context
  const { getMeetingsByTeacher, meetings: contextMeetings } = useMeetings();
  const teacherMeetings = useMemo(() => {
    return getMeetingsByTeacher("tch-001"); // Mock teacher ID
  }, [contextMeetings, getMeetingsByTeacher]);

  const upcomingMeetingsCount = useMemo(() => {
    return teacherMeetings.filter(m => m.status === "scheduled" || m.status === "pending_approval").length;
  }, [teacherMeetings]);

  const totalStudents = useMemo(() => {
    return teacherData.classes.reduce((sum, cls) => sum + cls.students, 0);
  }, [teacherData.classes]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "grade":
        return <Award className="w-4 h-4" />;
      case "attendance":
        return <CheckCircle className="w-4 h-4" />;
      case "assignment":
        return <FileText className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <MainLayout>
      <PageLoader isLoading={isLoading} loadingText="Loading Teacher Portal" />

      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title={`Welcome, ${teacherData.name}`}
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Teacher Portal" },
              { label: "Dashboard", isActive: true },
            ]}
          />

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {teacherData.department} Department • {teacherData.teacherId}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
          <Link href="/teachers/portal/my-classes" className="block">
            <StatCard
              icon={BookOpen}
              label="My Classes"
              value={teacherData.classes.length}
              color="blue"
            />
          </Link>
          <StatCard
            icon={Users}
            label="Total Students"
            value={totalStudents}
            color="green"
          />
          <Link href="/teachers/portal/grading" className="block">
            <StatCard
              icon={ClipboardCheck}
              label="Pending Grading"
              value={teacherData.pendingTasks.grading}
              color="orange"
            />
          </Link>
          <Link href="/teachers/portal/assignments" className="block">
            <StatCard
              icon={FileText}
              label="Active Assignments"
              value={teacherData.pendingTasks.assignments}
              color="purple"
            />
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Today's Schedule & Classes */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-left-2 duration-[900ms] delay-200 ease-out">
            {/* Today's Schedule */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </h2>
                <Link
                  href="/teachers/portal/timetable"
                  className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                >
                  View Full Timetable
                </Link>
              </div>

              <div className="space-y-3">
                {teacherData.todaySchedule.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20"
                  >
                    <div className="flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                        {session.subject} - {session.class}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.time} • {session.room}
                      </p>
                    </div>
                    <Link
                      href={`/teachers/portal/mark-attendance?class=${session.class}`}
                      className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-500/10 purple:bg-pink-500/10 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Mark Attendance
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Parent Meetings */}
            {teacherMeetings.filter(m => m.status === "scheduled" || m.status === "pending_approval").length > 0 && (
              <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Upcoming Parent Meetings
                    <span className="text-xs font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">
                      {upcomingMeetingsCount}
                    </span>
                  </h2>
                  <Link
                    href="/teachers/portal/meetings"
                    className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {teacherMeetings
                    .filter(m => m.status === "scheduled" || m.status === "pending_approval")
                    .slice(0, 3)
                    .map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20"
                      >
                        <div className="flex-shrink-0">
                          <Video className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                            {meeting.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {meeting.parentName} - {meeting.childName} - {new Date(meeting.scheduledDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} at {meeting.scheduledTime}
                          </p>
                        </div>
                        {meeting.status === "pending_approval" && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                            Pending
                          </span>
                        )}
                        <Link
                          href="/teachers/portal/meetings"
                          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400 bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-cyan-500/10 purple:bg-pink-500/10 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* My Classes */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  My Classes
                </h2>
                <Link
                  href="/teachers/portal/my-classes"
                  className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {teacherData.classes.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/teachers/portal/my-classes/${cls.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-500 dark:hover:border-blue-500 midnight:hover:border-cyan-400 purple:hover:border-pink-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                          {cls.name} - {cls.subject}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {cls.students} Students • {cls.schedule}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {cls.room}
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

          {/* Right Column - Quick Actions & Recent Activity */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-[900ms] delay-200 ease-out">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mb-4">
                Quick Actions
              </h2>

              <div className="space-y-2">
                <Link
                  href="/teachers/portal/mark-attendance"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark Attendance
                  </span>
                </Link>

                <Link
                  href="/teachers/portal/grading"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <ClipboardCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter Grades
                  </span>
                </Link>

                <Link
                  href="/teachers/portal/assignments"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Create Assignment
                  </span>
                </Link>

                <Link
                  href="/teachers/portal/materials"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Materials
                  </span>
                </Link>

                <Link
                  href="/teachers/portal/meetings"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Video className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Parent Meetings
                  </span>
                  {upcomingMeetingsCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                      {upcomingMeetingsCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mb-4">
                Recent Activity
              </h2>

              <div className="space-y-4">
                {teacherData.recentActivity.map((activity) => (
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

            {/* Pending Tasks Alert */}
            {teacherData.pendingTasks.attendance > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-500/10 purple:bg-orange-500/10 border border-orange-200 dark:border-orange-800 midnight:border-orange-500/30 purple:border-orange-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-orange-900 dark:text-orange-200">
                      Pending Attendance
                    </h3>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                      You have {teacherData.pendingTasks.attendance} classes with
                      unmarked attendance today.
                    </p>
                    <Link
                      href="/teachers/portal/mark-attendance"
                      className="text-xs text-orange-600 dark:text-orange-400 hover:underline mt-2 inline-block"
                    >
                      Mark Now →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
