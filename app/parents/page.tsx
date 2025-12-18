"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageLoader from "@/components/shared/PageLoader";
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
import { usePageLoad } from "@/hooks/usePageLoad";
import { useCountry } from "@/contexts/CountryContext";
import type { DashboardCardDefinition } from "@/components/parents/dashboard/parent-dashboard-masonry-dnd";
import {
  Calendar,
  CreditCard,
  GraduationCap,
  Award,
  Percent,
  BarChart3,
} from "lucide-react";

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
  { id: "evt-001", title: "Parents Teacher Meet", date: "2024-02-10", duration: "Half Day" as const, image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop" },
  { id: "evt-002", title: "Farewell Party", date: "2024-02-15", duration: "Full Day" as const, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop" },
  { id: "evt-003", title: "Annual Day", date: "2024-02-28", duration: "Full Day" as const, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
  { id: "evt-004", title: "Sports Day", date: "2024-03-05", duration: "Full Day" as const, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop" },
];

const MOCK_HOMEWORK = [
  { id: "hw-001", subject: "Physics", color: "purple", description: "Complete Chapter 5 Exercise", teacher: "Mrs. Nkechi Eze", dueDate: "2024-01-25" },
  { id: "hw-002", subject: "Chemistry", color: "green", description: "Lab report on Acid-Base", teacher: "Mr. Chidi Okoro", dueDate: "2024-01-26" },
  { id: "hw-003", subject: "Mathematics", color: "blue", description: "Quadratic Equations worksheet", teacher: "Mr. Tunde Adeyemi", dueDate: "2024-01-27" },
];

const MOCK_FEE_REMINDERS = [
  { id: "fee-001", childName: "Adaeze Okonkwo", feeType: "School Fees (2nd Term)", amount: 50000, dueDate: "2024-02-15", status: "due" as const },
  { id: "fee-002", childName: "Adaeze Okonkwo", feeType: "Bus Fees", amount: 25000, dueDate: "2024-02-10", status: "overdue" as const },
];

const MOCK_EXAM_RESULTS = [
  { id: "exam-001", studentName: "Adaeze Okonkwo", studentPhoto: "https://i.pravatar.cc/150?u=adaeze", class: "JSS 2", section: "A", percentage: 85, examType: "Mid-Term", status: "pass" as const },
  { id: "exam-002", studentName: "Chukwuemeka Okonkwo", studentPhoto: "https://i.pravatar.cc/150?u=chukwuemeka", class: "SS 1", section: "B", percentage: 78, examType: "Mid-Term", status: "pass" as const },
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
  const isPageLoading = usePageLoad(600);
  const { countryCode } = useCountry();
  const [selectedChild, setSelectedChild] = useState<Child>(MOCK_CHILDREN[0]);

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
      content: <EventsCard events={MOCK_EVENTS} />,
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
  const defaultOrder = [
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

  const { order, setOrder } = useDashboardLayout(
    "educo.parents.dashboard.order.v1",
    dashboardCards.map((c) => c.id),
    defaultOrder
  );

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Dashboard" />

      <div className={`space-y-5 transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Custom Header with Right Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">Parent Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {MOCK_PARENT.fullName.split(" ").slice(1).join(" ")}</p>
          </div>

          {/* Right Side - Selected Child & Quick Stats */}
          <div className="flex flex-wrap items-center gap-2">
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

            {/* Pay Fees Button */}
            <Link
              href="/parents/fees"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Pay Fees
            </Link>
          </div>
        </div>

        {/* Dashboard Cards (parent priority) - draggable masonry */}
        <div className="space-y-0">
            {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard icon={BarChart3} label="Term Average" value={`${childProgress?.currentTermAverage || 0}%`} color="blue" />
            <StatCard icon={Award} label="Class Position" value={childProgress?.classPosition || 0} color="green" subtitle={`out of ${childProgress?.totalStudents || 0} students`} />
            <StatCard icon={Percent} label="Attendance" value={`${childProgress?.attendanceRate || 0}%`} color="purple" />
            <StatCard icon={GraduationCap} label="Conduct" value={childProgress?.conductGrade || "-"} color="amber" />
          </div>

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
            { label: "Fee Type", value: selectedFee.feeType },
            { label: "Child", value: selectedFee.childName },
            { label: "Amount Paid", value: `₦${selectedFee.amount.toLocaleString()}` },
            { label: "Date", value: new Date().toLocaleDateString() },
          ]}
          note="A receipt has been sent to your email. You can also view this payment in your Payment History."
          closeButtonText="Done"
        />
      )}
    </MainLayout>
  );
}
