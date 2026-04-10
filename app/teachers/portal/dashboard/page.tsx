"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardPage from "@/components/pages/DashboardPage";
import { useMeetings, type Meeting } from "@/contexts/MeetingsContext";
import {
  BookOpen,
  Users,
  ClipboardCheck,
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
import type { ActivityItem, DashboardWidget, QuickActionConfig, StatCardConfig } from "@/types/components";

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

interface TeacherDashboardDatum {
  teacher: typeof mockTeacherData;
  meetings: Meeting[];
}

export default function TeacherDashboardPage() {
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

  const data = useMemo<TeacherDashboardDatum[]>(
    () => [{ teacher: teacherData, meetings: teacherMeetings }],
    [teacherData, teacherMeetings]
  );

  const primaryStats = useMemo<StatCardConfig<TeacherDashboardDatum>[]>(() => {
    return [
      {
        icon: BookOpen,
        label: "My Classes",
        getValue: () => teacherData.classes.length,
        color: "blue",
        href: "/teachers/portal/my-classes",
      },
      {
        icon: Users,
        label: "Total Students",
        getValue: () => totalStudents,
        color: "green",
      },
      {
        icon: ClipboardCheck,
        label: "Pending Grading",
        getValue: () => teacherData.pendingTasks.grading,
        color: "orange",
        href: "/teachers/portal/grading",
      },
      {
        icon: FileText,
        label: "Active Assignments",
        getValue: () => teacherData.pendingTasks.assignments,
        color: "purple",
        href: "/teachers/portal/assignments",
      },
    ];
  }, [teacherData, totalStudents]);

  const quickActions = useMemo<QuickActionConfig[]>(() => {
    return [
      {
        icon: CheckCircle,
        title: "Mark Attendance",
        description: "Record attendance for today’s classes",
        href: "/teachers/portal/mark-attendance",
        color: "green",
        badge: teacherData.pendingTasks.attendance > 0 ? teacherData.pendingTasks.attendance : undefined,
      },
      {
        icon: ClipboardCheck,
        title: "Enter Grades",
        description: "Grade assessments and publish results",
        href: "/teachers/portal/grading",
        color: "orange",
        badge: teacherData.pendingTasks.grading > 0 ? teacherData.pendingTasks.grading : undefined,
      },
      {
        icon: FileText,
        title: "Assignments",
        description: "Create and manage assignments",
        href: "/teachers/portal/assignments",
        color: "purple",
        badge: teacherData.pendingTasks.assignments > 0 ? teacherData.pendingTasks.assignments : undefined,
      },
      {
        icon: BookOpen,
        title: "Materials",
        description: "Upload notes and learning resources",
        href: "/teachers/portal/materials",
        color: "blue",
      },
      {
        icon: Video,
        title: "Parent Meetings",
        description: "Review and join upcoming meetings",
        href: "/teachers/portal/meetings",
        color: "indigo",
        badge: upcomingMeetingsCount > 0 ? upcomingMeetingsCount : undefined,
      },
    ];
  }, [teacherData.pendingTasks, upcomingMeetingsCount]);

  const recentActivityItems = useMemo<ActivityItem[]>(() => {
    return teacherData.recentActivity.map((activity) => {
      const icon =
        activity.type === "grade"
          ? Award
          : activity.type === "attendance"
            ? CheckCircle
            : activity.type === "assignment"
              ? FileText
              : Bell;

      const iconColor =
        activity.type === "grade"
          ? "purple"
          : activity.type === "attendance"
            ? "green"
            : activity.type === "assignment"
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
  }, [teacherData.recentActivity]);

  const leftColumn = useMemo<DashboardWidget[]>(() => {
    const widgets: DashboardWidget[] = [
      {
        type: "custom",
        title: "Today's Schedule",
        icon: Calendar,
        viewAllLink: "/teachers/portal/timetable",
        customComponent: (
          <div className="space-y-3">
            {teacherData.todaySchedule.map((session, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20"
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
        ),
      },
    ];

    if (upcomingMeetingsCount > 0) {
      widgets.push({
        type: "custom",
        title: `Upcoming Parent Meetings (${upcomingMeetingsCount})`,
        icon: Video,
        viewAllLink: "/teachers/portal/meetings",
        customComponent: (
          <div className="space-y-3">
            {teacherMeetings
              .filter(m => m.status === "scheduled" || m.status === "pending_approval")
              .slice(0, 3)
              .map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20"
                >
                  <div className="flex-shrink-0">
                    <Video className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                      {meeting.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {meeting.parentName} - {meeting.childName} -{" "}
                      {new Date(meeting.scheduledDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}{" "}
                      at {meeting.scheduledTime}
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
        ),
      });
    }

    widgets.push({
      type: "custom",
      title: "My Classes",
      icon: GraduationCap,
      viewAllLink: "/teachers/portal/my-classes",
      customComponent: (
        <div className="space-y-3">
          {teacherData.classes.map((cls) => (
            <Link
              key={cls.id}
              href={`/teachers/portal/my-classes/${cls.id}`}
              className="block p-4 bg-gray-50 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-500 dark:hover:border-blue-500 midnight:hover:border-cyan-400 purple:hover:border-pink-400 transition-colors"
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
      ),
    });

    return widgets;
  }, [teacherData, teacherMeetings, upcomingMeetingsCount]);

  const rightColumn = useMemo<DashboardWidget[]>(() => {
    const widgets: DashboardWidget[] = [
      {
        type: "activity",
        title: "Recent Activity",
        icon: Bell,
        activityItems: recentActivityItems,
      },
    ];

    if (teacherData.pendingTasks.attendance > 0) {
      widgets.push({
        type: "custom",
        title: "Pending Attendance",
        icon: AlertCircle,
        customComponent: (
          <div className="bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-500/10 purple:bg-orange-500/10 border border-orange-200 dark:border-orange-800 midnight:border-orange-500/30 purple:border-orange-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                  You have {teacherData.pendingTasks.attendance} classes with unmarked attendance today.
                </p>
                <Link
                  href="/teachers/portal/mark-attendance"
                  className="text-xs text-orange-700 dark:text-orange-300 hover:underline mt-2 inline-block"
                >
                  Mark Now →
                </Link>
              </div>
            </div>
          </div>
        ),
      });
    }

    return widgets;
  }, [recentActivityItems, teacherData.pendingTasks.attendance]);

  return (
    <DashboardPage<TeacherDashboardDatum>
      title={`Welcome, ${teacherData.name}`}
      subtitle={`${teacherData.department} Department • ${teacherData.teacherId}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Teacher Portal" },
        { label: "Dashboard", isActive: true },
      ]}
      data={data}
      primaryStats={primaryStats}
      quickActions={quickActions}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      pageLoadDuration={600}
      loadingText="Loading Teacher Portal"
    />
  );
}
