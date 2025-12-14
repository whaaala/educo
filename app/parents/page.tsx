"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageLoader from "@/components/shared/PageLoader";
import StatCard from "@/components/shared/StatCard";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import {
  Mail,
  CheckCircle2,
  Users,
  ChevronRight,
  CalendarPlus,
  Send,
  Calendar,
  BookOpen,
  CalendarDays,
  Clock,
  XCircle,
  CreditCard,
  AlertTriangle,
  GraduationCap,
  Eye,
  Bell,
  TrendingUp,
  Award,
  CalendarCheck,
  Percent,
  BarChart3,
  Minus,
  Zap,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  Languages,
  Globe,
  History,
  Music,
  Palette,
  Dumbbell,
} from "lucide-react";
import Button from "@/components/shared/Button";

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

// ============================================
// COMPONENT
// ============================================

export default function ParentDashboardPage() {
  const isPageLoading = usePageLoad(600);
  const { countryCode } = useCountry();
  const [selectedChild, setSelectedChild] = useState<Child>(MOCK_CHILDREN[0]);

  const childProgress = MOCK_PROGRESS.find((p) => p.childId === selectedChild.id);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === "down") return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

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

        {/* Main Grid - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ========== LEFT COLUMN (3 cols) ========== */}
          <div className="lg:col-span-3 space-y-5">
            {/* Parent Profile Card - Compact */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="relative h-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 midnight:from-cyan-950/40 midnight:via-slate-900/30 midnight:to-cyan-950/40 purple:from-pink-950/40 purple:via-slate-900/30 purple:to-purple-950/40">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              </div>
              <div className="relative px-4 pb-4">
                <div className="relative -mt-8 mb-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg">
                    <Image src={MOCK_PARENT.profilePhoto} alt={MOCK_PARENT.fullName} width={64} height={64} className="object-cover" unoptimized />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  {MOCK_PARENT.id}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white text-base mt-1">{MOCK_PARENT.fullName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3" /> {MOCK_PARENT.email}
                </p>
              </div>
            </div>

            {/* My Children - Modern Design */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-shadow duration-300 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 midnight:from-cyan-900/40 midnight:to-indigo-900/40 purple:from-pink-900/40 purple:to-purple-900/40 shadow-sm">
                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">My Children</span>
                </div>
                <span className="text-[10px] font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 midnight:from-cyan-500 midnight:to-indigo-500 purple:from-pink-500 purple:to-purple-500 px-2.5 py-1 rounded-full shadow-sm">{MOCK_CHILDREN.length}</span>
              </div>
              <div className="space-y-2.5">
                {MOCK_CHILDREN.map((child) => {
                  const isSelected = selectedChild.id === child.id;
                  return (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 midnight:from-cyan-900/30 midnight:to-indigo-900/30 purple:from-pink-900/30 purple:to-purple-900/30 border border-blue-200 dark:border-blue-700/50 midnight:border-cyan-500/30 purple:border-pink-500/30 shadow-sm"
                          : "bg-gray-50/80 dark:bg-gray-700/20 midnight:bg-gray-800/30 purple:bg-gray-800/30 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/40 hover:border-gray-200 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className={`relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-blue-400 dark:ring-blue-500 midnight:ring-cyan-400 purple:ring-pink-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                          : "group-hover:scale-105"
                      }`}>
                        <Image src={child.profilePhoto} alt={child.fullName} width={40} height={40} className="object-cover w-full h-full" unoptimized />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className={`font-semibold text-sm truncate transition-colors ${
                          isSelected
                            ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                            : "text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}>
                          {child.fullName}
                        </p>
                        <p className={`text-[11px] mt-0.5 ${
                          isSelected
                            ? "text-blue-600/70 dark:text-blue-400/70 midnight:text-cyan-400/70 purple:text-pink-400/70"
                            : "text-gray-500 dark:text-gray-400"
                        }`}>
                          {child.classLevel} • Sec {child.section}
                        </p>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 midnight:from-cyan-400 midnight:to-indigo-400 purple:from-pink-400 purple:to-purple-400 shadow-sm"
                          : "bg-gray-300 dark:bg-gray-600 opacity-0 group-hover:opacity-50"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions - Modern Design */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-shadow duration-300 p-3">
              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 mb-2.5">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="group flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 midnight:from-cyan-900/20 midnight:to-blue-900/10 purple:from-pink-900/20 purple:to-purple-900/10 border border-blue-100/50 dark:border-blue-800/30 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-md transition-all duration-200">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 midnight:bg-cyan-900/50 purple:bg-pink-900/50 group-hover:scale-105 transition-transform duration-200">
                    <CalendarPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Request Leave</span>
                </button>
                <button className="group flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-50/80 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/10 midnight:from-indigo-900/20 midnight:to-purple-900/10 purple:from-purple-900/20 purple:to-pink-900/10 border border-purple-100/50 dark:border-purple-800/30 midnight:border-indigo-500/20 purple:border-purple-500/20 hover:border-purple-300 dark:hover:border-purple-600/50 hover:shadow-md transition-all duration-200">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 midnight:bg-indigo-900/50 purple:bg-pink-900/50 group-hover:scale-105 transition-transform duration-200">
                    <Send className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 midnight:text-indigo-400 purple:text-pink-400" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Message Teacher</span>
                </button>
              </div>
            </div>

            {/* Payment History - Modern Design */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-shadow duration-300 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 midnight:from-emerald-900/40 midnight:to-green-900/40 purple:from-green-900/40 purple:to-emerald-900/40 shadow-sm">
                    <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Payment History</h4>
                </div>
                <Link href="/parents/fees" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline">View All</Link>
              </div>
              <div className="space-y-2.5">
                {MOCK_PAYMENT_HISTORY.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-700/30 dark:to-gray-700/10 midnight:from-gray-800/40 midnight:to-gray-800/20 purple:from-gray-800/40 purple:to-gray-800/20 border border-gray-100 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20 hover:border-green-200 dark:hover:border-green-700/40 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 midnight:from-green-900/50 midnight:to-emerald-900/50 purple:from-green-900/50 purple:to-emerald-900/50 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                        </div>
                        {index === 0 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">{payment.description}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5">{formatDate(payment.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">{formatCurrency(payment.amount, countryCode)}</span>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========== MIDDLE COLUMN (6 cols) ========== */}
          <div className="lg:col-span-6 space-y-5">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={BarChart3}
                label="Term Average"
                value={`${childProgress?.currentTermAverage || 0}%`}
                color="blue"
              />
              <StatCard
                icon={Award}
                label="Class Position"
                value={childProgress?.classPosition || 0}
                color="green"
                subtitle={`out of ${childProgress?.totalStudents || 0} students`}
              />
              <StatCard
                icon={Percent}
                label="Attendance"
                value={`${childProgress?.attendanceRate || 0}%`}
                color="purple"
              />
              <StatCard
                icon={GraduationCap}
                label="Conduct"
                value={childProgress?.conductGrade || "-"}
                color="amber"
              />
            </div>

            {/* Academic Progress + Events Row */}
            <div className="grid grid-cols-2 gap-5">
              {/* Recent Grades - Modern Design */}
              <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 via-transparent to-transparent dark:from-blue-400/10 midnight:from-cyan-400/10 purple:from-pink-400/10 pointer-events-none" />

                {/* Header */}
                <div className="relative px-4 py-3 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
                      <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Recent Grades</span>
                  </div>
                  <Link href={`/parents/children/${selectedChild.id}`} className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors">
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Content */}
                <div className="relative flex-1 px-4 py-3 flex flex-col justify-between gap-2">
                  {childProgress?.recentGrades.map((grade, idx) => {
                    const subjectIcons: Record<string, { icon: React.ReactNode; bg: string; iconColor: string }> = {
                      'Mathematics': { icon: <Calculator className="w-4 h-4" />, bg: 'bg-blue-100 dark:bg-blue-900/50', iconColor: 'text-blue-600 dark:text-blue-400' },
                      'Physics': { icon: <Atom className="w-4 h-4" />, bg: 'bg-purple-100 dark:bg-purple-900/50', iconColor: 'text-purple-600 dark:text-purple-400' },
                      'Chemistry': { icon: <FlaskConical className="w-4 h-4" />, bg: 'bg-emerald-100 dark:bg-emerald-900/50', iconColor: 'text-emerald-600 dark:text-emerald-400' },
                      'Biology': { icon: <Leaf className="w-4 h-4" />, bg: 'bg-green-100 dark:bg-green-900/50', iconColor: 'text-green-600 dark:text-green-400' },
                      'English': { icon: <Languages className="w-4 h-4" />, bg: 'bg-amber-100 dark:bg-amber-900/50', iconColor: 'text-amber-600 dark:text-amber-400' },
                      'Geography': { icon: <Globe className="w-4 h-4" />, bg: 'bg-cyan-100 dark:bg-cyan-900/50', iconColor: 'text-cyan-600 dark:text-cyan-400' },
                      'History': { icon: <History className="w-4 h-4" />, bg: 'bg-orange-100 dark:bg-orange-900/50', iconColor: 'text-orange-600 dark:text-orange-400' },
                      'Music': { icon: <Music className="w-4 h-4" />, bg: 'bg-pink-100 dark:bg-pink-900/50', iconColor: 'text-pink-600 dark:text-pink-400' },
                      'Art': { icon: <Palette className="w-4 h-4" />, bg: 'bg-rose-100 dark:bg-rose-900/50', iconColor: 'text-rose-600 dark:text-rose-400' },
                      'Physical Education': { icon: <Dumbbell className="w-4 h-4" />, bg: 'bg-red-100 dark:bg-red-900/50', iconColor: 'text-red-600 dark:text-red-400' },
                    };
                    const subjectStyle = subjectIcons[grade.subject] || { icon: <BookOpen className="w-4 h-4" />, bg: 'bg-gray-100 dark:bg-gray-700/50', iconColor: 'text-gray-600 dark:text-gray-400' };

                    return (
                      <div
                        key={idx}
                        className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-700/30 dark:to-gray-700/10 midnight:from-gray-800/40 midnight:to-gray-800/20 purple:from-gray-800/40 purple:to-gray-800/20 border border-gray-100 dark:border-gray-600/20 midnight:border-gray-600/15 purple:border-gray-600/15 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md hover:-translate-x-0.5 transition-all duration-200 flex-1"
                      >
                        {/* Subject Icon */}
                        <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${subjectStyle.bg} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200`}>
                          <span className={subjectStyle.iconColor}>{subjectStyle.icon}</span>
                        </div>

                        {/* Subject Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 midnight:group-hover:text-cyan-300 purple:group-hover:text-pink-300 transition-colors truncate">{grade.subject}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 font-medium">{grade.score}%</p>
                        </div>

                        {/* Trend Indicator */}
                        <div className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
                          grade.trend === 'up'
                            ? 'bg-green-100 dark:bg-green-900/40 midnight:bg-green-900/40 purple:bg-green-900/40'
                            : grade.trend === 'down'
                              ? 'bg-red-100 dark:bg-red-900/40 midnight:bg-red-900/40 purple:bg-red-900/40'
                              : 'bg-gray-100 dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50'
                        }`}>
                          {getTrendIcon(grade.trend)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Events - Modern Design */}
              <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/5 via-transparent to-transparent dark:from-purple-400/10 midnight:from-indigo-400/10 purple:from-pink-400/10 pointer-events-none" />

                {/* Header */}
                <div className="relative px-4 py-3 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 midnight:bg-indigo-900/30 purple:bg-pink-900/30">
                      <CalendarDays className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-indigo-400 purple:text-pink-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Events</span>
                  </div>
                  <Link href="/parents/events" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors">
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Content */}
                <div className="relative flex-1 p-4 grid grid-cols-2 gap-2.5 auto-rows-fr">
                  {MOCK_EVENTS.map((event) => (
                    <div key={event.id} className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600/20 midnight:border-gray-600/15 purple:border-gray-600/15 hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-gray-700/20 midnight:bg-gray-800/30 purple:bg-gray-800/30 flex flex-col">
                      <div className="relative flex-1 min-h-[60px] overflow-hidden">
                        <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[8px] font-bold bg-white/95 text-gray-800 shadow-md">{event.duration}</span>
                      </div>
                      <div className="p-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-700/10 midnight:from-gray-800/40 midnight:to-gray-800/20 purple:from-gray-800/40 purple:to-gray-800/20 flex-shrink-0">
                        <p className="text-[11px] font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{event.title}</p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 flex items-center gap-1">
                          <CalendarDays className="w-2.5 h-2.5" /> {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Child Leave Requests + Homework Row */}
            <div className="grid grid-cols-2 gap-5">
              {/* Child Leave Requests - Modern Design */}
              <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent dark:from-cyan-400/10 midnight:from-cyan-400/10 purple:from-pink-400/10 pointer-events-none" />

                {/* Header */}
                <div className="relative px-4 py-3 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
                      <CalendarCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Child Leave Requests</span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 px-4 py-3 flex flex-col justify-between gap-2">
                  {MOCK_CHILD_LEAVE_REQUESTS.map((leave) => (
                    <div
                      key={leave.id}
                      className={`group relative p-3 rounded-xl border transition-all duration-200 flex-1 hover:shadow-md overflow-hidden ${
                        leave.status === 'approved'
                          ? 'bg-gradient-to-r from-green-50/80 to-white dark:from-green-900/20 dark:to-gray-700/10 midnight:from-green-900/20 midnight:to-gray-800/20 purple:from-green-900/20 purple:to-gray-800/20 border-green-100 dark:border-green-700/30 midnight:border-green-700/20 purple:border-green-700/20 hover:border-green-300 dark:hover:border-green-500/40'
                          : leave.status === 'pending'
                            ? 'bg-gradient-to-r from-amber-50/80 to-white dark:from-amber-900/20 dark:to-gray-700/10 midnight:from-amber-900/20 midnight:to-gray-800/20 purple:from-amber-900/20 purple:to-gray-800/20 border-amber-100 dark:border-amber-700/30 midnight:border-amber-700/20 purple:border-amber-700/20 hover:border-amber-300 dark:hover:border-amber-500/40'
                            : 'bg-gradient-to-r from-red-50/80 to-white dark:from-red-900/20 dark:to-gray-700/10 midnight:from-red-900/20 midnight:to-gray-800/20 purple:from-red-900/20 purple:to-gray-800/20 border-red-100 dark:border-red-700/30 midnight:border-red-700/20 purple:border-red-700/20 hover:border-red-300 dark:hover:border-red-500/40'
                      }`}
                    >
                      {/* Top Row: Status Icon + Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className={`flex-shrink-0 p-2 rounded-lg ${
                          leave.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/40 midnight:bg-green-900/40 purple:bg-green-900/40'
                            : leave.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-900/40 midnight:bg-amber-900/40 purple:bg-amber-900/40'
                              : 'bg-red-100 dark:bg-red-900/40 midnight:bg-red-900/40 purple:bg-red-900/40'
                        }`}>
                          {leave.status === 'approved' && <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />}
                          {leave.status === 'pending' && <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                          {leave.status === 'declined' && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                        </div>
                        <span className={`flex-shrink-0 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                          leave.status === 'approved'
                            ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                            : leave.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'bg-red-500/10 text-red-700 dark:text-red-400'
                        }`}>
                          {leave.status}
                        </span>
                      </div>

                      {/* Bottom Row: Leave Info */}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">{leave.reason}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 truncate">{leave.childName} • {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework - Modern Design */}
              <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent dark:from-emerald-400/10 midnight:from-emerald-400/10 purple:from-pink-400/10 pointer-events-none" />

                {/* Header */}
                <div className="relative px-4 py-3 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-pink-900/30">
                      <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-pink-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Homework</span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 px-4 py-3 flex flex-col justify-between gap-2">
                  {MOCK_HOMEWORK.map((hw) => (
                    <div
                      key={hw.id}
                      className={`group relative p-3 rounded-xl border transition-all duration-200 flex-1 hover:shadow-md overflow-hidden ${
                        hw.color === 'purple'
                          ? 'bg-gradient-to-r from-purple-50/80 to-white dark:from-purple-900/20 dark:to-gray-700/10 midnight:from-purple-900/20 midnight:to-gray-800/20 purple:from-purple-900/20 purple:to-gray-800/20 border-purple-100 dark:border-purple-700/30 midnight:border-purple-700/20 purple:border-purple-700/20 hover:border-purple-300 dark:hover:border-purple-500/40'
                          : hw.color === 'green'
                            ? 'bg-gradient-to-r from-green-50/80 to-white dark:from-green-900/20 dark:to-gray-700/10 midnight:from-green-900/20 midnight:to-gray-800/20 purple:from-green-900/20 purple:to-gray-800/20 border-green-100 dark:border-green-700/30 midnight:border-green-700/20 purple:border-green-700/20 hover:border-green-300 dark:hover:border-green-500/40'
                            : 'bg-gradient-to-r from-blue-50/80 to-white dark:from-blue-900/20 dark:to-gray-700/10 midnight:from-blue-900/20 midnight:to-gray-800/20 purple:from-blue-900/20 purple:to-gray-800/20 border-blue-100 dark:border-blue-700/30 midnight:border-blue-700/20 purple:border-blue-700/20 hover:border-blue-300 dark:hover:border-blue-500/40'
                      }`}
                    >
                      {/* Top Row: Subject Badge + Due Date */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          hw.color === 'purple'
                            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                            : hw.color === 'green'
                              ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                              : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        }`}>
                          {hw.subject}
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100/80 dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50">
                          <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                          <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-300">{formatDate(hw.dueDate)}</span>
                        </div>
                      </div>

                      {/* Bottom Row: Description + Teacher */}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">{hw.description}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 truncate">{hw.teacher}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Exam Results - Modern Design */}
            <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 via-transparent to-transparent dark:from-indigo-400/10 midnight:from-indigo-400/10 purple:from-pink-400/10 pointer-events-none" />

              {/* Header */}
              <div className="relative px-4 py-3 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-pink-900/30">
                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-pink-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Exam Results</span>
                </div>
                <Link href="/parents/results" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Content */}
              <div className="relative flex-1 px-4 py-3 flex flex-col justify-between gap-2">
                {MOCK_EXAM_RESULTS.map((result) => (
                  <div
                    key={result.id}
                    className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 flex-1 hover:shadow-md hover:-translate-x-0.5 ${
                      result.status === 'pass'
                        ? 'bg-gradient-to-r from-green-50/50 to-white dark:from-green-900/10 dark:to-gray-700/10 midnight:from-green-900/10 midnight:to-gray-800/20 purple:from-green-900/10 purple:to-gray-800/20 border-green-100 dark:border-green-700/20 midnight:border-green-700/15 purple:border-green-700/15 hover:border-green-300 dark:hover:border-green-500/40'
                        : 'bg-gradient-to-r from-red-50/50 to-white dark:from-red-900/10 dark:to-gray-700/10 midnight:from-red-900/10 midnight:to-gray-800/20 purple:from-red-900/10 purple:to-gray-800/20 border-red-100 dark:border-red-700/20 midnight:border-red-700/15 purple:border-red-700/15 hover:border-red-300 dark:hover:border-red-500/40'
                    }`}
                  >
                    {/* Student Photo & Name */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-md">
                          <Image src={result.studentPhoto} alt={result.studentName} width={40} height={40} className="object-cover" unoptimized />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                          result.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {result.status === 'pass' ? (
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                          ) : (
                            <XCircle className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">{result.studentName}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400">{result.class}-{result.section} • {result.examType}</p>
                      </div>
                    </div>

                    {/* Score Progress */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 midnight:bg-gray-700 purple:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            result.percentage >= 70
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : 'bg-gradient-to-r from-amber-400 to-orange-500'
                          }`}
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold min-w-[36px] text-right ${
                        result.percentage >= 70
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {result.percentage}%
                      </span>
                    </div>

                    {/* Action Button */}
                    <button className="flex-shrink-0 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-pink-900/30 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-pink-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-200 group-hover:scale-105">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========== RIGHT COLUMN (3 cols) ========== */}
          <div className="lg:col-span-3 space-y-5">
            {/* Fees Reminder - Modern Design */}
            <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-500/5 via-transparent to-transparent dark:from-rose-400/10 midnight:from-rose-400/10 purple:from-pink-400/10 pointer-events-none" />

              {/* Header */}
              <div className="relative px-4 py-3 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-pink-900/30">
                    <CreditCard className="w-4 h-4 text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-pink-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Fees Reminder</span>
                </div>
                <Link href="/parents/fees" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Content */}
              <div className="relative flex-1 px-4 py-3 flex flex-col justify-between gap-2.5">
                {MOCK_FEE_REMINDERS.map((fee) => (
                  <div
                    key={fee.id}
                    className={`group relative flex flex-col p-3 rounded-xl border transition-all duration-200 flex-1 hover:shadow-md ${
                      fee.status === 'overdue'
                        ? 'bg-gradient-to-r from-red-50/80 to-white dark:from-red-900/20 dark:to-gray-700/10 midnight:from-red-900/20 midnight:to-gray-800/20 purple:from-red-900/20 purple:to-gray-800/20 border-red-200 dark:border-red-700/30 midnight:border-red-700/20 purple:border-red-700/20 hover:border-red-300 dark:hover:border-red-500/40'
                        : 'bg-gradient-to-r from-amber-50/80 to-white dark:from-amber-900/20 dark:to-gray-700/10 midnight:from-amber-900/20 midnight:to-gray-800/20 purple:from-amber-900/20 purple:to-gray-800/20 border-amber-200 dark:border-amber-700/30 midnight:border-amber-700/20 purple:border-amber-700/20 hover:border-amber-300 dark:hover:border-amber-500/40'
                    }`}
                  >
                    {/* Top Row - Fee Type & Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">{fee.feeType}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5">{fee.childName}</p>
                      </div>
                      <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                        fee.status === 'overdue'
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
                          : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'
                      }`}>
                        {fee.status === 'overdue' ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {fee.status === 'overdue' ? 'Overdue' : 'Due'}
                      </span>
                    </div>

                    {/* Bottom Row - Amount & Pay Button */}
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      <div>
                        <p className={`text-lg font-bold ${
                          fee.status === 'overdue'
                            ? 'text-red-700 dark:text-red-400'
                            : 'text-amber-700 dark:text-amber-400'
                        }`}>
                          {formatCurrency(fee.amount, countryCode)}
                        </p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 flex items-center gap-1">
                          <CalendarDays className="w-2.5 h-2.5" /> Due: {formatDate(fee.dueDate)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className={`text-[10px] px-3 py-1.5 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${
                          fee.status === 'overdue'
                            ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                        }`}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages - Modern Design */}
            <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/5 via-transparent to-transparent dark:from-teal-400/10 midnight:from-teal-400/10 purple:from-pink-400/10 pointer-events-none" />

              {/* Header */}
              <div className="relative px-4 py-3 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-pink-900/30">
                    <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-pink-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Messages</span>
                  <span className="text-[9px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 px-1.5 py-0.5 rounded-full shadow-sm animate-pulse min-w-[18px] text-center">2</span>
                </div>
                <Link href="/parents/messages" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Content */}
              <div className="relative flex-1 px-4 py-3 flex flex-col justify-between gap-2">
                {MOCK_MESSAGES.map((msg) => (
                  <Link
                    key={msg.id}
                    href={`/parents/messages/${msg.id}`}
                    className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 flex-1 hover:shadow-md hover:-translate-x-0.5 ${
                      msg.unread
                        ? 'bg-gradient-to-r from-teal-50/80 to-white dark:from-teal-900/20 dark:to-gray-700/10 midnight:from-teal-900/20 midnight:to-gray-800/20 purple:from-teal-900/20 purple:to-gray-800/20 border-teal-100 dark:border-teal-700/30 midnight:border-teal-700/20 purple:border-teal-700/20 hover:border-teal-300 dark:hover:border-teal-500/40'
                        : 'bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-700/20 dark:to-gray-700/10 midnight:from-gray-800/30 midnight:to-gray-800/20 purple:from-gray-800/30 purple:to-gray-800/20 border-gray-100 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20 hover:border-gray-200 dark:hover:border-gray-600/40'
                    }`}
                  >
                    {/* Unread Indicator */}
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                      msg.unread
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-sm'
                        : 'bg-transparent'
                    }`} />

                    {/* Message Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {msg.subject}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 truncate">{msg.from} • {msg.time}</p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Notice Board - Modern Design */}
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 midnight:border-gray-700/30 purple:border-gray-700/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 midnight:from-amber-900/40 midnight:to-orange-900/40 purple:from-amber-900/40 purple:to-orange-900/40 shadow-sm">
                    <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Notice Board</span>
                </div>
                <Link href="/parents/notices" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-0.5">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="p-2">
                {MOCK_NOTICES.slice(0, 3).map((notice, index) => (
                  <Link key={notice.id} href={`/parents/notices/${notice.id}`} className={`block p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 dark:hover:from-amber-900/10 dark:hover:to-orange-900/10 midnight:hover:from-amber-900/10 midnight:hover:to-orange-900/10 purple:hover:from-amber-900/10 purple:hover:to-orange-900/10 transition-all duration-200 group ${index !== 2 ? 'mb-1' : ''}`}>
                    <div className="flex items-start gap-3">
                      {notice.isNew && (
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mt-1.5 flex-shrink-0 shadow-sm animate-pulse" />
                      )}
                      <div className={`flex-1 min-w-0 ${!notice.isNew ? "pl-5" : ""}`}>
                        <p className="text-xs font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {notice.title}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" /> {formatDate(notice.date)}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links - Modern Design */}
            <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative px-4 py-3 flex items-center gap-2.5 border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/30 purple:border-gray-700/30">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-pink-900/30 shadow-sm">
                  <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Quick Links</h4>
              </div>

              {/* Content */}
              <div className="relative flex-1 px-4 py-3 flex flex-col justify-between gap-2">
                <Link href={`/parents/children/${selectedChild.id}/report-card`} className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 midnight:from-blue-900/20 midnight:to-indigo-900/10 purple:from-blue-900/20 purple:to-indigo-900/10 border border-blue-100/50 dark:border-blue-800/30 midnight:border-blue-800/20 purple:border-blue-800/20 hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-md hover:-translate-x-0.5 transition-all duration-200 group flex-1">
                  <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 midnight:bg-gray-800/80 purple:bg-gray-800/80 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">View Report Card</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
                <Link href={`/parents/children/${selectedChild.id}/attendance`} className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-purple-50/80 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/10 midnight:from-purple-900/20 midnight:to-pink-900/10 purple:from-pink-900/20 purple:to-purple-900/10 border border-purple-100/50 dark:border-purple-800/30 midnight:border-purple-800/20 purple:border-pink-800/20 hover:border-purple-300 dark:hover:border-purple-700/50 hover:shadow-md hover:-translate-x-0.5 transition-all duration-200 group flex-1">
                  <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 midnight:bg-gray-800/80 purple:bg-gray-800/80 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <CalendarCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-indigo-400 purple:text-pink-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">View Attendance</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
                <Link href="/parents/messages" className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 midnight:from-green-900/20 midnight:to-emerald-900/10 purple:from-green-900/20 purple:to-emerald-900/10 border border-green-100/50 dark:border-green-800/30 midnight:border-green-800/20 purple:border-green-800/20 hover:border-green-300 dark:hover:border-green-700/50 hover:shadow-md hover:-translate-x-0.5 transition-all duration-200 group flex-1">
                  <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 midnight:bg-gray-800/80 purple:bg-gray-800/80 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <Send className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Messages</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-green-500 dark:group-hover:text-green-400 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
