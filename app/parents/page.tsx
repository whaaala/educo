"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardPage from "@/components/shared/DashboardPage";
import StatCard from "@/components/shared/StatCard";
import PaymentModal from "@/components/shared/PaymentModal";
import SuccessModal from "@/components/shared/SuccessModal";
import type { FeeReminderItem } from "@/components/parents/dashboard/models";
import { ParentDashboardMasonryDnD } from "@/components/parents/dashboard/parent-dashboard-masonry-dnd";
import { useDashboardLayout } from "@/components/parents/dashboard/use-dashboard-layout";
import {
  ChildLeaveRequestsCard,
  EventsCard,
  ExamResultsCard,
  FeesReminderCard,
  HomeworkCard,
  MessagesCard,
  MyChildrenCard,
  NoticeBoardCard,
  ParentProfileCard,
  PaymentHistoryCard,
  QuickActionsCard,
  QuickLinksCard,
  RecentGradesCard,
  UpcomingMeetingsCard,
} from "@/components/parents/dashboard/cards";
import { useCountry } from "@/contexts/CountryContext";
import type { DashboardCardDefinition } from "@/components/parents/dashboard/parent-dashboard-masonry-dnd";
import {
  Calendar,
  CreditCard,
  GraduationCap,
  Award,
  Percent,
  BarChart3,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Users,
  MessageSquare,
  Search,
  Bell,
  HelpCircle,
  Activity,
} from "lucide-react";

// ============================================
// MOBILE STAT CARD COMPONENT
// ============================================

type StatColor = "blue" | "green" | "purple" | "amber";

interface MobileStatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  color: StatColor;
}

const colorConfig: Record<StatColor, { bg: string; iconBg: string; iconColor: string; valueColor: string }> = {
  blue: {
    bg: "bg-white dark:bg-gray-800/90 midnight:bg-gray-900/90 purple:bg-gray-900/90",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueColor: "text-blue-700 dark:text-blue-300",
  },
  green: {
    bg: "bg-white dark:bg-gray-800/90 midnight:bg-gray-900/90 purple:bg-gray-900/90",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    valueColor: "text-emerald-700 dark:text-emerald-300",
  },
  purple: {
    bg: "bg-white dark:bg-gray-800/90 midnight:bg-gray-900/90 purple:bg-gray-900/90",
    iconBg: "bg-purple-50 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    valueColor: "text-purple-700 dark:text-purple-300",
  },
  amber: {
    bg: "bg-white dark:bg-gray-800/90 midnight:bg-gray-900/90 purple:bg-gray-900/90",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    valueColor: "text-amber-700 dark:text-amber-300",
  },
};

function MobileStatCard({ icon: Icon, label, value, subtitle, color }: MobileStatCardProps) {
  const config = colorConfig[color];

  return (
    <div className={`${config.bg} rounded-2xl border border-gray-100/80 dark:border-gray-700/30 p-4 min-w-[140px] snap-start flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-200`}>
      {/* Icon */}
      <div className={`${config.iconBg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>

      {/* Value */}
      <p className={`text-2xl font-bold ${config.valueColor} mb-0.5`}>{value}</p>

      {/* Label */}
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

// ============================================
// TABLET STAT CARD COMPONENT
// ============================================

function TabletStatCard({ icon: Icon, label, value, subtitle, color }: MobileStatCardProps) {
  const config = colorConfig[color];

  return (
    <div className={`group relative ${config.bg} rounded-2xl border border-gray-100/80 dark:border-gray-700/30 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}>
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/[0.01] to-transparent pointer-events-none" />

      <div className="relative flex items-center gap-3">
        {/* Icon */}
        <div className={`${config.iconBg} w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
          <p className={`text-xl font-bold ${config.valueColor}`}>{value}</p>
          {subtitle && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// TYPES
// ============================================

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  admissionNumber: string;
  classLevel: string;
  section: string;
  profilePhoto: string;
  status: "Active" | "Inactive";
}

interface ChildProgress {
  childId: string;
  currentTermAverage: number;
  classPosition: number;
  totalStudents: number;
  attendanceRate: number;
  conductGrade: string;
  recentGrades: {
    subject: string;
    score: number;
    grade: string;
    trend: "up" | "down" | "stable";
  }[];
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_PARENT = {
  id: "P124556",
  fullName: "Mr. Emeka Okonkwo",
  email: "emeka.okonkwo@email.com",
  phone: "+234 803 456 7890",
  profilePhoto: "https://i.pravatar.cc/150?u=parent-emeka",
};

const MOCK_CHILDREN: Child[] = [
  {
    id: "child-001",
    firstName: "Adaeze",
    lastName: "Okonkwo",
    fullName: "Adaeze Okonkwo",
    admissionNumber: "ADM-2024-0145",
    classLevel: "JSS 2",
    section: "A",
    profilePhoto: "https://i.pravatar.cc/150?u=adaeze",
    status: "Active",
  },
  {
    id: "child-002",
    firstName: "Chukwuemeka",
    lastName: "Okonkwo",
    fullName: "Chukwuemeka Okonkwo",
    admissionNumber: "ADM-2024-0089",
    classLevel: "SS 1",
    section: "B",
    profilePhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    status: "Active",
  },
];

const MOCK_PROGRESS: ChildProgress[] = [
  {
    childId: "child-001",
    currentTermAverage: 78.5,
    classPosition: 5,
    totalStudents: 45,
    attendanceRate: 96.2,
    conductGrade: "A",
    recentGrades: [
      { subject: "Mathematics", score: 85, grade: "A", trend: "up" },
      { subject: "English", score: 78, grade: "B", trend: "stable" },
      { subject: "Science", score: 72, grade: "B", trend: "up" },
      { subject: "Social Studies", score: 80, grade: "A", trend: "up" },
    ],
  },
  {
    childId: "child-002",
    currentTermAverage: 82.3,
    classPosition: 3,
    totalStudents: 52,
    attendanceRate: 94.5,
    conductGrade: "A",
    recentGrades: [
      { subject: "Mathematics", score: 88, grade: "A", trend: "up" },
      { subject: "Physics", score: 80, grade: "A", trend: "stable" },
      { subject: "Chemistry", score: 79, grade: "B", trend: "down" },
      { subject: "Biology", score: 82, grade: "A", trend: "up" },
    ],
  },
];

// Child Leave Requests (parent requesting leave for their child)
const MOCK_CHILD_LEAVE_REQUESTS = [
  { id: "leave-001", childName: "Adaeze Okonkwo", reason: "Medical Appointment", fromDate: "2024-01-15", toDate: "2024-01-17", days: 3, status: "approved" as const },
  { id: "leave-002", childName: "Chukwuemeka Okonkwo", reason: "Family Event", fromDate: "2024-01-22", toDate: "2024-01-22", days: 1, status: "pending" as const },
  { id: "leave-003", childName: "Adaeze Okonkwo", reason: "Travel", fromDate: "2024-01-08", toDate: "2024-01-09", days: 2, status: "declined" as const },
];

// Messages from teachers
const MOCK_MESSAGES = [
  { id: "msg-001", from: "Mrs. Nkechi Eze", role: "Class Teacher", subject: "Adaeze's Progress Report", time: "2 hours ago", unread: true },
  { id: "msg-002", from: "Mr. Chidi Okoro", role: "Chemistry Teacher", subject: "Lab Session Reminder", time: "5 hours ago", unread: true },
  { id: "msg-003", from: "Admin Office", role: "School Admin", subject: "Fee Payment Confirmation", time: "1 day ago", unread: false },
];

// Payment History
const MOCK_PAYMENT_HISTORY = [
  { id: "pay-001", description: "School Fees (1st Term)", amount: 50000, date: "2024-01-05", status: "completed" as const, child: "Adaeze Okonkwo" },
  { id: "pay-002", description: "Bus Fees", amount: 25000, date: "2024-01-10", status: "completed" as const, child: "Chukwuemeka Okonkwo" },
  { id: "pay-003", description: "Books & Materials", amount: 15000, date: "2024-01-12", status: "completed" as const, child: "Adaeze Okonkwo" },
];

const MOCK_EVENTS = [
  { id: "evt-001", title: "Parents Teacher Meet", date: "2024-02-10", duration: "Half Day" as const, image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop", childId: "child-001" },
  { id: "evt-002", title: "Farewell Party", date: "2024-02-15", duration: "Full Day" as const, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop" },
  { id: "evt-003", title: "Annual Day", date: "2024-02-28", duration: "Full Day" as const, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
  { id: "evt-004", title: "Sports Day", date: "2024-03-05", duration: "Full Day" as const, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop" },
  { id: "evt-005", title: "Science Exhibition", date: "2024-03-15", duration: "Half Day" as const, image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", childId: "child-002" },
  { id: "evt-008", title: "JSS 2 Class Assembly", date: "2024-03-12", duration: "Half Day" as const, image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop", childId: "child-001" },
  { id: "evt-009", title: "Inter-School Debate", date: "2024-03-18", duration: "Half Day" as const, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop", childId: "child-002" },
];

const MOCK_HOMEWORK = [
  { id: "hw-001", childId: "child-001", subject: "Physics", color: "purple" as const, description: "Complete Chapter 5 Exercise", teacher: "Mrs. Nkechi Eze", dueDate: "2024-01-25" },
  { id: "hw-002", childId: "child-001", subject: "Chemistry", color: "green" as const, description: "Lab report on Acid-Base", teacher: "Mr. Chidi Okoro", dueDate: "2024-01-26" },
  { id: "hw-003", childId: "child-002", subject: "Mathematics", color: "blue" as const, description: "Quadratic Equations worksheet", teacher: "Mr. Tunde Adeyemi", dueDate: "2024-01-27" },
];

const MOCK_FEE_REMINDERS = [
  { id: "fee-001", childName: "Adaeze Okonkwo", feeType: "School Fees (2nd Term)", amount: 50000, dueDate: "2024-02-15", status: "due" as const },
  { id: "fee-002", childName: "Adaeze Okonkwo", feeType: "Bus Fees", amount: 25000, dueDate: "2024-02-10", status: "overdue" as const },
];

const MOCK_EXAM_RESULTS = [
  { id: "exam-001", childId: "child-001", studentName: "Adaeze Okonkwo", studentPhoto: "https://i.pravatar.cc/150?u=adaeze", class: "JSS 2", section: "A", percentage: 85, examType: "Mid-Term", status: "pass" as const },
  { id: "exam-002", childId: "child-002", studentName: "Chukwuemeka Okonkwo", studentPhoto: "https://i.pravatar.cc/150?u=chukwuemeka", class: "SS 1", section: "B", percentage: 78, examType: "Mid-Term", status: "pass" as const },
];

const MOCK_NOTICES = [
  { id: "notice-001", title: "School closed on 26th Jan for Republic Day", date: "2024-01-20", isNew: true },
  { id: "notice-002", title: "New Library Books Available", date: "2024-01-18", isNew: true },
  { id: "notice-003", title: "Parent-Teacher Meeting Schedule", date: "2024-01-15" },
  { id: "notice-004", title: "Uniform Guidelines Reminder", date: "2024-01-12" },
];

// Upcoming Meetings (Educo Meet, Zoom, Google Meet, WhatsApp)
const MOCK_MEETINGS = [
  {
    id: "meet-001",
    title: "Parent-Teacher Conference",
    platform: "zoom" as const,
    hostName: "Mrs. Nkechi Eze",
    hostRole: "Class Teacher",
    hostPhoto: "https://i.pravatar.cc/150?u=teacher-nkechi",
    scheduledDate: "2024-01-25",
    scheduledTime: "10:00 AM",
    duration: 30,
    status: "scheduled" as const,
    meetingLink: "https://zoom.us/j/1234567890",
    childName: "Adaeze Okonkwo",
  },
  {
    id: "meet-002",
    title: "Chemistry Lab Discussion",
    platform: "google-meet" as const,
    hostName: "Mr. Chidi Okoro",
    hostRole: "Chemistry Teacher",
    hostPhoto: "https://i.pravatar.cc/150?u=teacher-chidi",
    scheduledDate: "2024-01-26",
    scheduledTime: "2:00 PM",
    duration: 45,
    status: "scheduled" as const,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    childName: "Chukwuemeka Okonkwo",
  },
  {
    id: "meet-004",
    title: "Academic Counseling",
    platform: "educo-meet" as const,
    hostName: "Mrs. Funke Adeleke",
    hostRole: "Academic Counselor",
    hostPhoto: "https://i.pravatar.cc/150?u=counselor-funke",
    scheduledDate: "2024-01-28",
    scheduledTime: "3:00 PM",
    duration: 40,
    status: "scheduled" as const,
    meetingLink: "/meetings/room/educo-meet-abc123",
    childName: "Adaeze Okonkwo",
  },
];

// ============================================
// COMPONENT
// ============================================

export default function ParentDashboardPage() {
  const { countryCode } = useCountry();
  const [selectedChild, setSelectedChild] = useState<Child>(MOCK_CHILDREN[0]);

  // Client-side only date values to avoid hydration mismatch
  const [greeting, setGreeting] = useState("Welcome");
  const [currentDate, setCurrentDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setCurrentDate(new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }));

    setPaymentDate(new Date().toLocaleDateString());
  }, []);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeReminderItem | null>(null);
  const [paidFeeIds, setPaidFeeIds] = useState<Set<string>>(() => {
    // Load paid fees from localStorage on mount
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("educo.parent.paidFees");
        if (stored) {
          return new Set(JSON.parse(stored));
        }
      } catch {
        // Ignore errors
      }
    }
    return new Set();
  });

  const childProgress = MOCK_PROGRESS.find((p) => p.childId === selectedChild.id);

  // Filter out paid fees from reminders
  const activeReminders = MOCK_FEE_REMINDERS.filter((fee) => !paidFeeIds.has(fee.id));

  // Handle Pay Now button click
  const handlePayNow = useCallback((fee: FeeReminderItem) => {
    setSelectedFee(fee);
    setIsPaymentModalOpen(true);
  }, []);

  // Handle payment completion
  const handlePaymentComplete = useCallback(() => {
    if (selectedFee) {
      // Add to paid fees
      const newPaidFeeIds = new Set(paidFeeIds);
      newPaidFeeIds.add(selectedFee.id);
      setPaidFeeIds(newPaidFeeIds);

      // Persist to localStorage
      localStorage.setItem("educo.parent.paidFees", JSON.stringify([...newPaidFeeIds]));

      // Close payment modal and show success
      setIsPaymentModalOpen(false);
      setIsSuccessModalOpen(true);
    }
  }, [selectedFee, paidFeeIds]);

  // Handle success modal close
  const handleSuccessClose = useCallback(() => {
    setIsSuccessModalOpen(false);
    setSelectedFee(null);
  }, []);

  const dashboardCards: DashboardCardDefinition[] = [
    {
      id: "fees-reminder",
      title: "Fees Reminder",
      content: <FeesReminderCard reminders={activeReminders} countryCode={countryCode} onPayNow={handlePayNow} />,
    },
    {
      id: "messages",
      title: "Messages",
      content: <MessagesCard messages={MOCK_MESSAGES} />,
    },
    {
      id: "recent-grades",
      title: "Recent Grades",
      content: <RecentGradesCard selectedChildId={selectedChild.id} progress={childProgress} />,
    },
    {
      id: "exam-results",
      title: "Exam Results",
      content: <ExamResultsCard results={MOCK_EXAM_RESULTS} />,
    },
    {
      id: "homework",
      title: "Homework",
      content: <HomeworkCard homework={MOCK_HOMEWORK} />,
    },
    {
      id: "events",
      title: "Events",
      content: <EventsCard events={MOCK_EVENTS} selectedChildId={selectedChild.id} />,
    },
    {
      id: "leave-requests",
      title: "Child Leave Requests",
      content: <ChildLeaveRequestsCard leaves={MOCK_CHILD_LEAVE_REQUESTS} />,
    },
    {
      id: "quick-links",
      title: "Quick Links",
      content: <QuickLinksCard selectedChildId={selectedChild.id} />,
    },
    {
      id: "payment-history",
      title: "Payment History",
      content: <PaymentHistoryCard payments={MOCK_PAYMENT_HISTORY} countryCode={countryCode} />,
    },
    {
      id: "notice-board",
      title: "Notice Board",
      content: <NoticeBoardCard notices={MOCK_NOTICES} />,
    },
    {
      id: "my-children",
      title: "My Children",
      content: <MyChildrenCard children={MOCK_CHILDREN} selectedChild={selectedChild} onSelectChild={setSelectedChild} />,
    },
    {
      id: "quick-actions",
      title: "Quick Actions",
      content: <QuickActionsCard />,
    },
    {
      id: "parent-profile",
      title: "Parent Profile",
      content: <ParentProfileCard parent={MOCK_PARENT} />,
    },
    {
      id: "upcoming-meetings",
      title: "Upcoming Meetings",
      content: <UpcomingMeetingsCard meetings={MOCK_MEETINGS} />,
    },
  ];

  // Default dashboard order (PRD-aligned for Parents): fees + communication + progress first.
  // PRD highlights Parent priorities as: Progress, chat/communication, fees/payments.
  const defaultOrderV1 = [
    // Highest importance
    "my-children",
    "fees-reminder",
    "messages",
    "upcoming-meetings",
    "recent-grades",
    "exam-results",
    // Next
    "homework",
    "payment-history",
    "events",
    "notice-board",
    // Lowest importance / utility
    "leave-requests",
    "quick-links",
    "quick-actions",
    "parent-profile",
  ];

  // Default dashboard order (Screenshot-aligned for Parents): matches the portal layout shown in the PRD screenshots.
  const defaultOrderV2 = [
    "parent-profile",
    "my-children",
    "fees-reminder",
    "messages",
    "exam-results",
    "homework",
    "recent-grades",
    "upcoming-meetings",
    "payment-history",
    "events",
    "notice-board",
    "quick-links",
    "quick-actions",
    "leave-requests",
  ];

  const { order, setOrder, reset, customized } = useDashboardLayout(
    "educo.parents.dashboard.order.v1",
    dashboardCards.map((c) => c.id),
    defaultOrderV2,
    { defaultVersion: "v2", legacyDefaultOrder: defaultOrderV1 }
  );

  // Prevent hydration mismatch from browser extensions (e.g., password managers adding fdprocessedid)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <DashboardPage
      title="Dashboard"
      breadcrumbs={[
        { label: "Parent Portal", href: "/parents" },
        { label: "Dashboard", isActive: true },
      ]}
      loadingText="Loading Dashboard"
      afterStats={
        <>
          <div className="transition-opacity duration-500">

        {/* ============================================ */}
        {/* MOBILE LAYOUT (< md) */}
        {/* ============================================ */}
        <div className="md:hidden space-y-4">
          {/* Mobile Header - Clean & Modern */}
          <div className="relative">
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-cyan-500/[0.02] rounded-2xl pointer-events-none" />

            <div className="relative bg-white dark:bg-gray-800/90 midnight:bg-gray-900/90 purple:bg-gray-900/90 rounded-2xl border border-gray-100/80 dark:border-gray-700/30 p-4 shadow-sm">
              {/* Top Row: Date & Actions */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {currentDate}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={customized ? "Reset widgets to default" : "Widgets are already on the default layout"}
                    aria-label="Reset widgets"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Reset</span>
                  </button>
                </div>
              </div>

              {/* Greeting */}
              <h1 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-gray-100 purple:text-gray-100 mb-0.5">
                {greeting}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {MOCK_PARENT.fullName.split(" ").slice(1).join(" ")}
              </p>

              {/* Info Pills Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50/80 dark:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/20">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">Parent Portal</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 border border-gray-100/50 dark:border-gray-700/30">
                  <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">2nd Term 2024</span>
                </div>
              </div>

              {/* My Children Section */}
              <div className="bg-gray-50/80 dark:bg-gray-900/40 midnight:bg-gray-800/40 purple:bg-gray-800/40 rounded-xl p-3 border border-gray-100/80 dark:border-gray-700/30">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">My Children</span>
                  </div>
                  <Link href="/parents/children" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Open
                  </Link>
                </div>

                {/* Child Selector Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {MOCK_CHILDREN.map((child) => {
                    const isSelected = selectedChild.id === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => setSelectedChild(child)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                          isSelected
                            ? "bg-white dark:bg-gray-800 shadow-sm border-2 border-blue-500/50 dark:border-blue-400/50"
                            : "bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className={`relative w-8 h-8 rounded-lg overflow-hidden ${isSelected ? "ring-2 ring-blue-400/50 ring-offset-1 ring-offset-white dark:ring-offset-gray-800" : ""}`}>
                          <Image src={child.profilePhoto} alt={child.fullName} width={32} height={32} className="object-cover" unoptimized />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-semibold ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                            {child.firstName}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{child.classLevel}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Child Info & Message Button */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100/80 dark:border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-2 ring-white dark:ring-gray-700">
                    <Image src={selectedChild.profilePhoto} alt={selectedChild.fullName} width={40} height={40} className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Viewing</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedChild.firstName} {selectedChild.lastName} • {selectedChild.classLevel}</p>
                  </div>
                </div>
                <button className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            </div>

            {/* Search Bar - Below Header */}
            <div className="mt-3 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${selectedChild.firstName}'s fees, messages, results...`}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-100/80 dark:border-gray-700/30 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Mobile Stats - Current Term In Progress */}
          <div className="space-y-2">
            {/* Header with In Progress badge and View Details link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{selectedChild.firstName}&apos;s Stats</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Activity className="w-2.5 h-2.5" />
                  In Progress
                </span>
              </div>
              <Link
                href={`/parents/children/${selectedChild.id}/term-progress`}
                className="inline-flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                View Details
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {/* Stats Scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
              <MobileStatCard
                icon={TrendingUp}
                label="Term Average"
                value={`${childProgress?.currentTermAverage || 0}%`}
                color="blue"
              />
              <MobileStatCard
                icon={Award}
                label="Position"
                value={childProgress?.classPosition || 0}
                subtitle={`out of ${childProgress?.totalStudents || 0}`}
                color="green"
              />
              <MobileStatCard
                icon={Percent}
                label="Attendance"
                value={`${childProgress?.attendanceRate || 0}%`}
                color="purple"
              />
              <MobileStatCard
                icon={GraduationCap}
                label="Conduct"
                value={childProgress?.conductGrade || "-"}
                color="amber"
              />
            </div>
          </div>

          {/* Mobile Dashboard Widgets - Single Column */}
          <div className="space-y-3">
            {/* Priority widgets for mobile based on PRD */}
            <FeesReminderCard reminders={activeReminders} countryCode={countryCode} onPayNow={handlePayNow} />
            <MessagesCard messages={MOCK_MESSAGES} />
            <RecentGradesCard selectedChildId={selectedChild.id} progress={childProgress} />
            <UpcomingMeetingsCard meetings={MOCK_MEETINGS} />
            <HomeworkCard homework={MOCK_HOMEWORK} />
            <ExamResultsCard results={MOCK_EXAM_RESULTS} />
            <EventsCard events={MOCK_EVENTS} selectedChildId={selectedChild.id} />
            <NoticeBoardCard notices={MOCK_NOTICES} />
            <ChildLeaveRequestsCard leaves={MOCK_CHILD_LEAVE_REQUESTS} />
            <PaymentHistoryCard payments={MOCK_PAYMENT_HISTORY} countryCode={countryCode} />
            <QuickLinksCard selectedChildId={selectedChild.id} />
            <QuickActionsCard />
          </div>
        </div>

        {/* ============================================ */}
        {/* TABLET LAYOUT (md - lg) */}
        {/* ============================================ */}
        <div className="hidden md:block lg:hidden space-y-5">
          {/* Tablet Header - Two Column */}
          <div className="relative bg-white dark:bg-gray-800/90 midnight:bg-gray-900/90 purple:bg-gray-900/90 rounded-2xl border border-gray-100/80 dark:border-gray-700/30 p-5 shadow-sm overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-cyan-500/[0.02] pointer-events-none" />

            <div className="relative flex items-start justify-between gap-6">
              {/* Left Side */}
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{currentDate}</p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-gray-100 purple:text-gray-100 mb-0.5">
                  {greeting}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {MOCK_PARENT.fullName.split(" ").slice(1).join(" ")}
                </p>

                {/* Info Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/20">
                    <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Parent Portal</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 border border-gray-100/50 dark:border-gray-700/30">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">2nd Term 2024</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Children & Actions */}
              <div className="flex flex-col items-end gap-3">
                {/* Child Selector */}
                <div className="flex items-center gap-2">
                  {MOCK_CHILDREN.map((child) => {
                    const isSelected = selectedChild.id === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => setSelectedChild(child)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-400/50 shadow-sm"
                            : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg overflow-hidden ${isSelected ? "ring-2 ring-blue-400/50 ring-offset-1" : ""}`}>
                          <Image src={child.profilePhoto} alt={child.fullName} width={36} height={36} className="object-cover" unoptimized />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-semibold ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                            {child.firstName}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{child.classLevel}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Reset Widgets */}
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
                  title={customized ? "Reset widgets to default" : "Widgets are already on the default layout"}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset widgets
                </button>

                {/* Pay Fees Button */}
                <Link
                  href="/parents/fees"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Fees
                </Link>
              </div>
            </div>
          </div>

          {/* Tablet Stats - Current Term In Progress */}
          <div className="space-y-3">
            {/* Header with In Progress badge and View Details link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedChild.firstName}&apos;s Current Term</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Activity className="w-3 h-3" />
                  In Progress
                </span>
              </div>
              <Link
                href={`/parents/children/${selectedChild.id}/term-progress`}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              <TabletStatCard
                icon={TrendingUp}
                label="Term Average"
                value={`${childProgress?.currentTermAverage || 0}%`}
                color="blue"
              />
              <TabletStatCard
                icon={Award}
                label="Position"
                value={childProgress?.classPosition || 0}
                subtitle={`of ${childProgress?.totalStudents || 0}`}
                color="green"
              />
              <TabletStatCard
                icon={Percent}
                label="Attendance"
                value={`${childProgress?.attendanceRate || 0}%`}
                color="purple"
              />
              <TabletStatCard
                icon={GraduationCap}
                label="Conduct"
                value={childProgress?.conductGrade || "-"}
                color="amber"
              />
            </div>
          </div>

          {/* Tablet Dashboard - 2 Column Masonry */}
          <ParentDashboardMasonryDnD cards={dashboardCards} order={order} onOrderChange={setOrder} />
        </div>

        {/* ============================================ */}
        {/* DESKTOP LAYOUT (lg+) */}
        {/* ============================================ */}
        <div className="hidden lg:block space-y-5">
          {/* Desktop Header Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2">
              {/* Current Term Info */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Current Term</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">2nd Term 2024</p>
                </div>
              </div>

              {/* Selected Child Quick View */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <Image src={selectedChild.profilePhoto} alt={selectedChild.fullName} width={32} height={32} className="object-cover" unoptimized />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Viewing</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{selectedChild.firstName} • {selectedChild.classLevel}</p>
                </div>
              </div>

              {/* Reset Widgets */}
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-sm transition-all"
                title={customized ? "Reset widgets to default" : "Widgets are already on the default layout"}
              >
                <RotateCcw className="w-4 h-4" />
                Reset widgets
              </button>

              {/* Pay Fees Button */}
              <Link
                href="/parents/fees"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Pay Fees
              </Link>
          </div>

          {/* Desktop Stats Row - Current Term In Progress */}
          <div className="space-y-3">
            {/* Header with In Progress badge and View Details link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedChild.firstName}&apos;s Current Term</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Activity className="w-3 h-3" />
                  In Progress
                </span>
              </div>
              <Link
                href={`/parents/children/${selectedChild.id}/term-progress`}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={BarChart3} label="Term Average" value={`${childProgress?.currentTermAverage || 0}%`} color="blue" />
              <StatCard icon={Award} label="Class Position" value={childProgress?.classPosition || 0} color="green" subtitle={`out of ${childProgress?.totalStudents || 0} students`} />
              <StatCard icon={Percent} label="Attendance" value={`${childProgress?.attendanceRate || 0}%`} color="purple" />
              <StatCard icon={GraduationCap} label="Conduct" value={childProgress?.conductGrade || "-"} color="amber" />
            </div>
          </div>

          {/* Desktop Dashboard Masonry */}
          <ParentDashboardMasonryDnD cards={dashboardCards} order={order} onOrderChange={setOrder} />
        </div>
          </div>

      {/* Payment Modal */}
      {selectedFee && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedFee(null);
          }}
          onPaymentComplete={handlePaymentComplete}
          title={`Pay ${selectedFee.feeType}`}
          itemType={`${selectedFee.feeType} for ${selectedFee.childName}`}
          amount={selectedFee.amount}
          currency="₦"
        />
      )}

      {/* Success Modal */}
      {selectedFee && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessClose}
          title="Payment Successful!"
          subtitle="Your fee payment has been processed successfully."
          fields={[
            { icon: <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />, label: "Fee Type", value: selectedFee.feeType },
            { icon: <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />, label: "Child", value: selectedFee.childName },
            { icon: <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />, label: "Amount Paid", value: `₦${selectedFee.amount.toLocaleString()}` },
            { icon: <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />, label: "Date", value: paymentDate },
          ]}
          note="A receipt has been sent to your email. You can also view this payment in your Payment History."
          closeButtonText="Done"
        />
      )}
        </>
      }
    />
  );
}
