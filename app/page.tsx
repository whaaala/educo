"use client";

import DashboardPage from "@/components/pages/DashboardPage";
import { getAllStudents } from "@/lib/mockStudents";
import { getAllTeachers } from "@/lib/mockTeachers";
import { getAllParents } from "@/lib/mockParents";
import {
  Users,
  GraduationCap,
  UserCog,
  Wallet,
  Library,
  CalendarCheck2,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface HomeDashboardMetrics {
  students: number;
  staff: number;
  parents: number;
}

export default function Home() {
  const metrics: HomeDashboardMetrics = {
    students: getAllStudents().length,
    staff: getAllTeachers().length,
    parents: getAllParents().length,
  };

  return (
    <DashboardPage<HomeDashboardMetrics>
      title="Dashboard"
      breadcrumbs={[{ label: "Dashboard", href: "/", isActive: true }]}
      data={[metrics]}
      primaryStats={[
        {
          icon: GraduationCap,
          label: "Students",
          color: "blue",
          getValue: (d) => d[0]?.students ?? 0,
          href: "/students",
        },
        {
          icon: UserCog,
          label: "Staff",
          color: "purple",
          getValue: (d) => d[0]?.staff ?? 0,
          href: "/staff",
        },
        {
          icon: Users,
          label: "Parents",
          color: "green",
          getValue: (d) => d[0]?.parents ?? 0,
          href: "/admin/parents",
        },
        {
          icon: Wallet,
          label: "Finance",
          color: "amber",
          getValue: () => "View",
          getSubtitle: () => "Receipts • Installments • Fee structure",
          href: "/finance/fee-structure",
        },
      ]}
      quickActions={[
        {
          title: "Students",
          description: "Admissions, profiles, transfers, transcripts",
          href: "/students",
          icon: GraduationCap,
          color: "blue",
        },
        {
          title: "Staff",
          description: "Personnel, attendance, leave, discipline",
          href: "/staff",
          icon: UserCog,
          color: "purple",
        },
        {
          title: "Library",
          description: "Catalog, borrowing, members, fines",
          href: "/library",
          icon: Library,
          color: "green",
        },
        {
          title: "Finance",
          description: "Fee structure, receipts, installment plans",
          href: "/finance/fee-structure",
          icon: Wallet,
          color: "amber",
        },
      ]}
      leftColumn={[
        {
          type: "activity",
          title: "Recent Activity",
          icon: Activity,
          viewAllLink: "/",
          activityItems: [
            {
              id: "act-1",
              title: "New receipt generated",
              description: "Finance • Receipt RCP-2024-0008",
              timestamp: "2 min ago",
              icon: CheckCircle2,
              iconColor: "green",
            },
            {
              id: "act-2",
              title: "Leave request pending",
              description: "Staff • 1 request needs review",
              timestamp: "35 min ago",
              icon: Clock,
              iconColor: "amber",
            },
            {
              id: "act-3",
              title: "Overdue library loan",
              description: "Library • 2 loans overdue",
              timestamp: "Today",
              icon: AlertCircle,
              iconColor: "red",
            },
          ],
        },
      ]}
      rightColumn={[
        {
          type: "list",
          title: "Next up",
          icon: CalendarCheck2,
          listItems: [
            { id: "n-1", title: "Approve leave requests", subtitle: "Staff module", value: "1" },
            { id: "n-2", title: "Review discipline reports", subtitle: "Students & Staff", value: "3" },
            { id: "n-3", title: "Send fee reminders", subtitle: "Finance", value: "8" },
          ],
        },
      ]}
    />
  );
}
