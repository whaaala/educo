"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardPage from "@/components/pages/DashboardPage";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  Calendar,
  Clock,
  Bell,
  CheckCircle,
  Award,
  GraduationCap,
  UserCheck,
  Briefcase,
} from "lucide-react";
import type { ActivityItem, DashboardWidget, QuickActionConfig, StatCardConfig } from "@/types/components";

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

interface LecturerDashboardDatum {
  lecturer: typeof mockLecturerData;
}

export default function LecturerDashboardPage() {
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

  const data = useMemo<LecturerDashboardDatum[]>(
    () => [{ lecturer: lecturerData }],
    [lecturerData]
  );

  const primaryStats = useMemo<StatCardConfig<LecturerDashboardDatum>[]>(() => {
    return [
      {
        icon: BookOpen,
        label: "My Courses",
        getValue: () => lecturerData.courses.length,
        color: "blue",
        href: "/lecturers/portal/my-courses",
        getSubtitle: () => `${totalCredits} Credit Hours`,
      },
      {
        icon: Users,
        label: "Total Students",
        getValue: () => totalStudents,
        color: "green",
        getSubtitle: () => "Across all courses",
      },
      {
        icon: UserCheck,
        label: "Supervision",
        getValue: () => totalSupervision,
        color: "purple",
        href: "/lecturers/portal/supervision",
        getSubtitle: () => `${lecturerData.supervision.undergraduate} UG • ${lecturerData.supervision.masters} MSc`,
      },
      {
        icon: ClipboardCheck,
        label: "Pending Grading",
        getValue: () => lecturerData.pendingTasks.grading,
        color: "orange",
        href: "/lecturers/portal/grading",
        getSubtitle: () => "Assessments to grade",
      },
    ];
  }, [lecturerData, totalCredits, totalStudents, totalSupervision]);

  const quickActions = useMemo<QuickActionConfig[]>(() => {
    return [
      {
        icon: CheckCircle,
        title: "Mark Attendance",
        description: "Record attendance for sessions",
        href: "/lecturers/portal/mark-attendance",
        color: "green",
      },
      {
        icon: ClipboardCheck,
        title: "Enter Grades",
        description: "Grade assessments and publish results",
        href: "/lecturers/portal/grading",
        color: "orange",
        badge: lecturerData.pendingTasks.grading > 0 ? lecturerData.pendingTasks.grading : undefined,
      },
      {
        icon: UserCheck,
        title: "Supervision",
        description: "Review student research progress",
        href: "/lecturers/portal/supervision",
        color: "purple",
        badge: lecturerData.pendingTasks.supervision > 0 ? lecturerData.pendingTasks.supervision : undefined,
      },
      {
        icon: BookOpen,
        title: "Materials",
        description: "Upload course resources",
        href: "/lecturers/portal/materials",
        color: "blue",
      },
    ];
  }, [lecturerData.pendingTasks]);

  const recentActivityItems = useMemo<ActivityItem[]>(() => {
    return lecturerData.recentActivity.map((activity) => {
      const icon =
        activity.type === "grade"
          ? Award
          : activity.type === "supervision"
            ? UserCheck
            : activity.type === "office"
              ? Briefcase
              : Bell;

      const iconColor =
        activity.type === "grade"
          ? "orange"
          : activity.type === "supervision"
            ? "purple"
            : activity.type === "office"
              ? "blue"
              : "gray";

      return {
        id: activity.id,
        icon,
        iconColor,
        title: activity.message,
        timestamp: activity.time,
      };
    });
  }, [lecturerData.recentActivity]);

  const leftColumn = useMemo<DashboardWidget[]>(() => {
    return [
      {
        type: "custom",
        title: "Today's Schedule",
        icon: Calendar,
        viewAllLink: "/lecturers/portal/schedule",
        customComponent: (
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
        ),
      },
      {
        type: "custom",
        title: "My Courses",
        icon: GraduationCap,
        viewAllLink: "/lecturers/portal/my-courses",
        customComponent: (
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
        ),
      },
    ];
  }, [lecturerData]);

  const rightColumn = useMemo<DashboardWidget[]>(() => {
    return [
      {
        type: "custom",
        title: "Office Hours",
        icon: Briefcase,
        viewAllLink: "/lecturers/portal/office-hours",
        customComponent: (
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
        ),
      },
      {
        type: "activity",
        title: "Recent Activity",
        icon: Bell,
        activityItems: recentActivityItems,
      },
    ];
  }, [lecturerData.officeHours, recentActivityItems]);

  return (
    <DashboardPage<LecturerDashboardDatum>
      title={`Welcome, ${lecturerData.name}`}
      subtitle={`${lecturerData.department} • ${lecturerData.faculty} • ${lecturerData.lecturerId}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Lecturer Portal" },
        { label: "Dashboard", isActive: true },
      ]}
      data={data}
      primaryStats={primaryStats}
      quickActions={quickActions}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      pageLoadDuration={600}
      loadingText="Loading Lecturer Portal"
    />
  );
}
