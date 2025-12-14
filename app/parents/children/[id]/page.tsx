"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import StatCard from "@/components/shared/StatCard";
import Button from "@/components/shared/Button";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  FileText,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  User,
  ArrowLeft,
  Download,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  Languages,
  Globe,
  Monitor,
  Palette,
  Hash,
} from "lucide-react";
import type { ParentChild, ChildAcademicSummary, ParentAttendanceRecord } from "@/types/parent";

// Mock Data
const MOCK_CHILDREN: Record<string, ParentChild> = {
  "child-001": {
    id: "child-001",
    studentId: "STU-2024-001",
    firstName: "Adaeze",
    lastName: "Okonkwo",
    fullName: "Adaeze Okonkwo",
    admissionNumber: "ADM-2024-0145",
    classLevel: "JSS 2",
    section: "A",
    profilePhoto: "https://i.pravatar.cc/150?u=adaeze",
    dateOfBirth: "2012-03-15",
    gender: "Female",
    status: "Active",
    relationship: "Father",
  },
  "child-002": {
    id: "child-002",
    studentId: "STU-2024-002",
    firstName: "Chukwuemeka",
    lastName: "Okonkwo",
    fullName: "Chukwuemeka Okonkwo",
    admissionNumber: "ADM-2024-0089",
    classLevel: "SS 1",
    section: "B",
    profilePhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    dateOfBirth: "2009-07-22",
    gender: "Male",
    status: "Active",
    relationship: "Father",
  },
};

const MOCK_ACADEMIC_SUMMARY: Record<string, ChildAcademicSummary> = {
  "child-001": {
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    classLevel: "JSS 2",
    currentTermAverage: 78.5,
    classPosition: 5,
    totalStudents: 45,
    subjectPerformance: [
      { subject: "Mathematics", score: 85, grade: "A", teacherRemarks: "Excellent problem-solving skills" },
      { subject: "English Language", score: 78, grade: "B", teacherRemarks: "Good comprehension, needs to improve writing" },
      { subject: "Basic Science", score: 72, grade: "B", teacherRemarks: "Shows keen interest" },
      { subject: "Social Studies", score: 80, grade: "A", teacherRemarks: "Very participative" },
      { subject: "Civic Education", score: 75, grade: "B", teacherRemarks: "Good understanding of concepts" },
      { subject: "Computer Studies", score: 88, grade: "A", teacherRemarks: "Outstanding performance" },
      { subject: "French", score: 70, grade: "B", teacherRemarks: "Improving steadily" },
      { subject: "Creative Arts", score: 82, grade: "A", teacherRemarks: "Very creative" },
    ],
    overallRemarks: "Adaeze is a bright and hardworking student. She shows great potential and is a positive influence in class.",
    conductGrade: "A",
  },
  "child-002": {
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    classLevel: "SS 1",
    currentTermAverage: 82.3,
    classPosition: 3,
    totalStudents: 52,
    subjectPerformance: [
      { subject: "Mathematics", score: 88, grade: "A", teacherRemarks: "Exceptional analytical skills" },
      { subject: "Physics", score: 80, grade: "A", teacherRemarks: "Good practical understanding" },
      { subject: "Chemistry", score: 79, grade: "B", teacherRemarks: "Needs more practice in calculations" },
      { subject: "Biology", score: 85, grade: "A", teacherRemarks: "Excellent understanding of concepts" },
      { subject: "English Language", score: 78, grade: "B", teacherRemarks: "Good communication skills" },
      { subject: "Further Mathematics", score: 82, grade: "A", teacherRemarks: "Shows great potential" },
      { subject: "Data Processing", score: 90, grade: "A", teacherRemarks: "Outstanding" },
    ],
    overallRemarks: "Chukwuemeka is a dedicated student with excellent academic performance. He is focused and determined.",
    conductGrade: "A",
  },
};

const MOCK_ATTENDANCE: Record<string, { present: number; absent: number; late: number; total: number; rate: number }> = {
  "child-001": { present: 42, absent: 3, late: 2, total: 47, rate: 89.4 },
  "child-002": { present: 45, absent: 1, late: 1, total: 47, rate: 95.7 },
};

const MOCK_FEES: Record<string, { total: number; paid: number; balance: number; status: string }> = {
  "child-001": { total: 150000, paid: 100000, balance: 50000, status: "partial" },
  "child-002": { total: 180000, paid: 180000, balance: 0, status: "paid" },
};

type TabType = "overview" | "academics" | "attendance" | "fees";

export default function ChildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const childId = params?.id as string;
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();
  const { countryCode } = useCountry();

  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const child = MOCK_CHILDREN[childId];
  const academicData = MOCK_ACADEMIC_SUMMARY[childId];
  const attendanceData = MOCK_ATTENDANCE[childId];
  const feeData = MOCK_FEES[childId];

  // Calculate age
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Get grade color with enhanced styling
  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 ring-1 ring-green-200 dark:ring-green-800",
      B: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-200 dark:ring-blue-800",
      C: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 ring-1 ring-yellow-200 dark:ring-yellow-800",
      D: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 ring-1 ring-orange-200 dark:ring-orange-800",
      E: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 ring-1 ring-red-200 dark:ring-red-800",
      F: "text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-900/40 ring-1 ring-red-200 dark:ring-red-800",
    };
    return colors[grade] || colors.C;
  };

  // Subject icons mapping
  const subjectIcons: Record<string, { icon: React.ReactNode; bg: string; iconColor: string }> = {
    'Mathematics': { icon: <Calculator className="w-4 h-4" />, bg: 'bg-blue-100 dark:bg-blue-900/50', iconColor: 'text-blue-600 dark:text-blue-400' },
    'Further Mathematics': { icon: <Calculator className="w-4 h-4" />, bg: 'bg-indigo-100 dark:bg-indigo-900/50', iconColor: 'text-indigo-600 dark:text-indigo-400' },
    'Physics': { icon: <Atom className="w-4 h-4" />, bg: 'bg-purple-100 dark:bg-purple-900/50', iconColor: 'text-purple-600 dark:text-purple-400' },
    'Chemistry': { icon: <FlaskConical className="w-4 h-4" />, bg: 'bg-emerald-100 dark:bg-emerald-900/50', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    'Biology': { icon: <Leaf className="w-4 h-4" />, bg: 'bg-green-100 dark:bg-green-900/50', iconColor: 'text-green-600 dark:text-green-400' },
    'Basic Science': { icon: <Atom className="w-4 h-4" />, bg: 'bg-cyan-100 dark:bg-cyan-900/50', iconColor: 'text-cyan-600 dark:text-cyan-400' },
    'English Language': { icon: <Languages className="w-4 h-4" />, bg: 'bg-amber-100 dark:bg-amber-900/50', iconColor: 'text-amber-600 dark:text-amber-400' },
    'French': { icon: <Languages className="w-4 h-4" />, bg: 'bg-rose-100 dark:bg-rose-900/50', iconColor: 'text-rose-600 dark:text-rose-400' },
    'Social Studies': { icon: <Globe className="w-4 h-4" />, bg: 'bg-teal-100 dark:bg-teal-900/50', iconColor: 'text-teal-600 dark:text-teal-400' },
    'Civic Education': { icon: <Users className="w-4 h-4" />, bg: 'bg-orange-100 dark:bg-orange-900/50', iconColor: 'text-orange-600 dark:text-orange-400' },
    'Computer Studies': { icon: <Monitor className="w-4 h-4" />, bg: 'bg-violet-100 dark:bg-violet-900/50', iconColor: 'text-violet-600 dark:text-violet-400' },
    'Data Processing': { icon: <Monitor className="w-4 h-4" />, bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/50', iconColor: 'text-fuchsia-600 dark:text-fuchsia-400' },
    'Creative Arts': { icon: <Palette className="w-4 h-4" />, bg: 'bg-pink-100 dark:bg-pink-900/50', iconColor: 'text-pink-600 dark:text-pink-400' },
  };

  const getSubjectIcon = (subject: string) => {
    return subjectIcons[subject] || {
      icon: <BookOpen className="w-4 h-4" />,
      bg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-600 dark:text-gray-400'
    };
  };

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Student Details", icon: GraduationCap },
    { id: "academics", label: "Academics", icon: GraduationCap },
    { id: "attendance", label: "Attendance", icon: CheckCircle2 },
    { id: "fees", label: "Fees", icon: CreditCard },
  ];

  if (!child) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Child Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The requested child profile could not be found.</p>
          <Button variant="primary" onClick={() => router.push("/parents/children")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Children
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText={`Loading ${child.firstName}'s Profile`} />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <PageHeader
          title={child.fullName}
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "My Children", href: "/parents/children" },
            { label: child.firstName },
          ]}
        />

        {/* Profile Card - Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm">
          <div className="relative p-4">
            {/* Main Content Row */}
            <div className="flex items-start gap-4">
              {/* Profile Photo */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/60 via-purple-400/60 to-pink-400/60 rounded-xl blur-[2px]" />
                <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-white dark:ring-gray-800">
                  <Image
                    src={child.profilePhoto || `https://i.pravatar.cc/150?u=${child.id}`}
                    alt={child.fullName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {/* Status indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center ${
                  child.status === "Active" ? "bg-emerald-400" : "bg-gray-400"
                }`}>
                  {child.status === "Active" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                {/* Name and status row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight truncate">
                    {child.fullName}
                  </h1>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide ${
                    child.status === "Active"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}>
                    {child.status}
                  </span>
                </div>

                {/* Info badges - inline with subtle colors */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
                    <GraduationCap className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    {child.classLevel} {child.section && `• ${child.section}`}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
                    <Hash className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    {child.admissionNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
                    <Calendar className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    {calculateAge(child.dateOfBirth)} yrs
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
                    <User className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    {child.gender}
                  </span>
                </div>

                {/* Action buttons - compact */}
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium text-xs border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    Message Teacher
                  </button>
                  <Link href={`/parents/children/${child.id}/report-card`}>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                      <FileText className="w-3.5 h-3.5" />
                      View Report Card
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Row - Compact Card Design */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-900/20 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">Term Average</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {academicData?.currentTermAverage?.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-green-50/80 to-white dark:from-green-900/20 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-green-100 dark:bg-green-900/50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-0.5">Active</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {child.status === "Active" ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-900/20 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">Attendance</p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {attendanceData?.rate}%
                  </p>
                </div>
              </div>

              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-orange-50/80 to-orange-100/30 dark:from-orange-900/20 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/50">
                  <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">Best Position</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    #{academicData?.classPosition}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Modern Navigation */}
        <div className="relative bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-[#1a1d23]/30 dark:to-[#14161b]/50 midnight:from-[#0f1729]/30 midnight:to-[#0a0f1c]/50 purple:from-[#2a1a3e]/30 purple:to-[#1f1330]/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/30 dark:border-gray-800/30 midnight:border-cyan-500/10 purple:border-pink-500/10 p-1.5 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5 midnight:from-cyan-400/5 midnight:via-blue-400/5 midnight:to-cyan-400/5 purple:from-pink-400/5 purple:via-purple-400/5 purple:to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative flex gap-1.5 min-w-max lg:min-w-0">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  className={`relative flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ease-out whitespace-nowrap group overflow-hidden ${
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-950/20 midnight:bg-cyan-950/20 purple:bg-pink-950/20 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 shadow-sm border border-blue-100/50 dark:border-blue-900/30 midnight:border-cyan-900/30 purple:border-pink-900/30"
                      : "text-gray-700 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:bg-white/40 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/30 purple:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200 midnight:hover:text-cyan-200 purple:hover:text-pink-200 hover:shadow-sm"
                  } cursor-pointer active:scale-95`}
                >
                  {/* Shine effect on active tab */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}

                  {/* Hover glow effect for inactive tabs */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-xl" />
                  )}

                  <Icon className={`relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-600 dark:text-gray-500 midnight:text-cyan-300/70 purple:text-pink-300/70 group-hover:scale-110 group-hover:rotate-6"
                  }`} />
                  <span className={`relative text-[11.75px] sm:text-xs font-semibold transition-all duration-300 ${
                    isActive ? "tracking-wide" : "group-hover:tracking-wide"
                  }`}>
                    {tab.label}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 midnight:bg-cyan-400 purple:bg-pink-400 rounded-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-700/50 p-6 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 via-purple-500/3 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Performance */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/30">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Recent Performance</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Top 5 subjects this term</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {academicData?.subjectPerformance.slice(0, 5).map((subject, index) => {
                    const subjectStyle = getSubjectIcon(subject.subject);
                    return (
                      <div
                        key={subject.subject}
                        className="group relative p-4 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 shadow-sm hover:shadow-lg transition-all duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Subtle gradient overlay on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex items-center gap-4">
                          {/* Subject Icon */}
                          <div className={`p-3 rounded-xl ${subjectStyle.bg} ${subjectStyle.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                            {subjectStyle.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {subject.subject}
                              </span>
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                  {subject.score}%
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getGradeColor(subject.grade)}`}>
                                  {subject.grade}
                                </span>
                              </div>
                            </div>
                            {/* Progress bar - sleeker design */}
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${
                                  subject.score >= 80
                                    ? "bg-gradient-to-r from-emerald-400 to-green-500"
                                    : subject.score >= 60
                                    ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                                    : subject.score >= 50
                                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                    : "bg-gradient-to-r from-red-400 to-rose-500"
                                }`}
                                style={{ width: `${subject.score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance Overview */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 border border-emerald-200/50 dark:border-emerald-700/30">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Attendance Overview</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current term attendance</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Days Present Card */}
                  <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50/80 to-teal-50/50 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/10 border border-emerald-100/80 dark:border-emerald-800/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    {/* Decorative gradient blob */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-bl from-emerald-300/30 via-green-200/20 to-transparent rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-center justify-end mb-2">
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 tracking-tight">
                        {attendanceData?.present}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-widest">Days Present</p>
                    </div>
                  </div>

                  {/* Days Absent Card */}
                  <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-rose-50 via-red-50/80 to-pink-50/50 dark:from-rose-900/30 dark:via-red-900/20 dark:to-pink-900/10 border border-rose-100/80 dark:border-rose-800/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-bl from-rose-300/30 via-red-200/20 to-transparent rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-center justify-end mb-2">
                        <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 group-hover:scale-110 transition-transform duration-300">
                          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-rose-600 dark:text-rose-400 mb-1 tracking-tight">
                        {attendanceData?.absent}
                      </p>
                      <p className="text-[10px] font-bold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-widest">Days Absent</p>
                    </div>
                  </div>

                  {/* Times Late Card */}
                  <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50/50 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/10 border border-amber-100/80 dark:border-amber-800/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-bl from-amber-300/30 via-yellow-200/20 to-transparent rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-center justify-end mb-2">
                        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 group-hover:scale-110 transition-transform duration-300">
                          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-1 tracking-tight">
                        {attendanceData?.late}
                      </p>
                      <p className="text-[10px] font-bold text-amber-600/80 dark:text-amber-400/80 uppercase tracking-widest">Times Late</p>
                    </div>
                  </div>

                  {/* Attendance Rate Card */}
                  <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/80 to-violet-50/50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-violet-900/10 border border-blue-100/80 dark:border-blue-800/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-bl from-blue-300/30 via-indigo-200/20 to-transparent rounded-full blur-xl" />
                    <div className="relative">
                      <div className="flex items-center justify-end mb-2">
                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 tracking-tight">
                        {attendanceData?.rate}%
                      </p>
                      <p className="text-[10px] font-bold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-widest">Attendance Rate</p>
                    </div>
                  </div>
                </div>

                {/* Teacher's Remarks */}
                {academicData?.overallRemarks && (
                  <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-yellow-50/50 dark:from-amber-900/25 dark:via-orange-900/15 dark:to-yellow-900/10 border border-amber-200/60 dark:border-amber-700/30 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-amber-300/25 via-orange-200/15 to-transparent rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-orange-300/20 to-transparent rounded-full blur-xl" />

                    <div className="relative flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">
                          Teacher&apos;s Remarks
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                          &quot;{academicData.overallRemarks}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === "academics" && (
            <div className="relative space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Subject Performance</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current term results</p>
                  </div>
                </div>
                <button className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Download Report
                </button>
              </div>

              {/* Modern Card-Based Subject List */}
              <div className="grid gap-4">
                {academicData?.subjectPerformance.map((subject, index) => {
                  const subjectStyle = getSubjectIcon(subject.subject);
                  return (
                    <div
                      key={subject.subject}
                      className="group relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-800/40 hover:from-white hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700/50 hover:shadow-xl transition-all duration-300 ring-1 ring-gray-200/60 dark:ring-gray-700/50 hover:ring-gray-300 dark:hover:ring-gray-600 overflow-hidden"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* Decorative accent */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        subject.score >= 80 ? "bg-gradient-to-b from-green-400 to-emerald-500" :
                        subject.score >= 60 ? "bg-gradient-to-b from-blue-400 to-indigo-500" :
                        subject.score >= 50 ? "bg-gradient-to-b from-amber-400 to-orange-500" :
                        "bg-gradient-to-b from-red-400 to-rose-500"
                      }`} />

                      {/* Subject Icon */}
                      <div className={`p-3 rounded-xl ${subjectStyle.bg} ${subjectStyle.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        {subjectStyle.icon}
                      </div>

                      {/* Subject Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {subject.subject}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate italic">
                          &quot;{subject.teacherRemarks || "No remarks"}&quot;
                        </p>
                      </div>

                      {/* Score with Progress */}
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:block w-36">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-gray-500 dark:text-gray-400">Score</span>
                            <span className="font-bold text-gray-900 dark:text-white">{subject.score}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${
                                subject.score >= 80
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                  : subject.score >= 60
                                  ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                                  : subject.score >= 50
                                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                  : "bg-gradient-to-r from-red-400 to-rose-500"
                              }`}
                              style={{ width: `${subject.score}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white sm:hidden">
                            {subject.score}%
                          </span>
                          <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conduct Grade */}
              {academicData?.conductGrade && (
                <div className="relative flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/15 dark:to-blue-900/20 ring-1 ring-purple-200/60 dark:ring-purple-800/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/10 to-transparent" />
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">Conduct Grade</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Overall behavior assessment</p>
                    </div>
                  </div>
                  <span className={`px-5 py-2.5 rounded-xl text-lg font-bold shadow-sm ${getGradeColor(academicData.conductGrade)}`}>
                    {academicData.conductGrade}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="relative space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Attendance Summary</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current term attendance record</p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 group hover:shadow-lg transition-all duration-300 ring-1 ring-green-100 dark:ring-green-800/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-400/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/50 ring-1 ring-green-200 dark:ring-green-700 shadow-sm group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {attendanceData?.present}
                    </p>
                    <p className="text-xs font-semibold text-green-600/70 dark:text-green-400/70 uppercase tracking-wide">Days Present</p>
                  </div>
                </div>

                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 group hover:shadow-lg transition-all duration-300 ring-1 ring-red-100 dark:ring-red-800/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-400/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/50 ring-1 ring-red-200 dark:ring-red-700 shadow-sm group-hover:scale-110 transition-transform">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                      {attendanceData?.absent}
                    </p>
                    <p className="text-xs font-semibold text-red-600/70 dark:text-red-400/70 uppercase tracking-wide">Days Absent</p>
                  </div>
                </div>

                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20 group hover:shadow-lg transition-all duration-300 ring-1 ring-amber-100 dark:ring-amber-800/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 ring-1 ring-amber-200 dark:ring-amber-700 shadow-sm group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                      {attendanceData?.late}
                    </p>
                    <p className="text-xs font-semibold text-amber-600/70 dark:text-amber-400/70 uppercase tracking-wide">Times Late</p>
                  </div>
                </div>

                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 group hover:shadow-lg transition-all duration-300 ring-1 ring-blue-100 dark:ring-blue-800/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-400/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 ring-1 ring-blue-200 dark:ring-blue-700 shadow-sm group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {attendanceData?.rate}%
                    </p>
                    <p className="text-xs font-semibold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wide">Attendance Rate</p>
                  </div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900 dark:text-white">Attendance Progress</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {attendanceData?.present} of {attendanceData?.total} days
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 rounded-full transition-all duration-500 relative"
                    style={{ width: `${attendanceData?.rate || 0}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span>0%</span>
                  <span className={`font-bold ${(attendanceData?.rate || 0) >= 80 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {attendanceData?.rate}% Overall
                  </span>
                  <span>100%</span>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/10 ring-1 ring-indigo-100 dark:ring-indigo-800/50 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/10 to-transparent" />
                <Calendar className="w-10 h-10 text-indigo-400 dark:text-indigo-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Detailed attendance calendar coming soon...
                </p>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === "fees" && (
            <div className="relative space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Fee Summary</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current term fee status</p>
                </div>
              </div>

              {/* Fee Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 group hover:shadow-lg transition-all duration-300 ring-1 ring-blue-100 dark:ring-blue-800/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 ring-1 ring-blue-200 dark:ring-blue-700 shadow-sm">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-xs font-semibold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wide">Total Fees</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(feeData?.total || 0, countryCode)}
                    </p>
                  </div>
                </div>

                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 group hover:shadow-lg transition-all duration-300 ring-1 ring-green-100 dark:ring-green-800/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-400/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/50 ring-1 ring-green-200 dark:ring-green-700 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-xs font-semibold text-green-600/70 dark:text-green-400/70 uppercase tracking-wide">Amount Paid</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(feeData?.paid || 0, countryCode)}
                    </p>
                  </div>
                </div>

                <div className={`relative p-5 rounded-2xl group hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  (feeData?.balance || 0) > 0
                    ? "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 ring-1 ring-red-100 dark:ring-red-800/50"
                    : "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20 ring-1 ring-emerald-100 dark:ring-emerald-800/50"
                }`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl to-transparent ${
                    (feeData?.balance || 0) > 0 ? "from-red-400/10" : "from-emerald-400/10"
                  }`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2.5 rounded-xl ring-1 shadow-sm ${
                        (feeData?.balance || 0) > 0
                          ? "bg-red-100 dark:bg-red-900/50 ring-red-200 dark:ring-red-700"
                          : "bg-emerald-100 dark:bg-emerald-900/50 ring-emerald-200 dark:ring-emerald-700"
                      }`}>
                        {(feeData?.balance || 0) > 0 ? (
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${
                        (feeData?.balance || 0) > 0
                          ? "text-red-600/70 dark:text-red-400/70"
                          : "text-emerald-600/70 dark:text-emerald-400/70"
                      }`}>
                        {(feeData?.balance || 0) > 0 ? "Balance Due" : "Fully Paid"}
                      </p>
                    </div>
                    <p className={`text-2xl font-bold ${
                      (feeData?.balance || 0) > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {formatCurrency(feeData?.balance || 0, countryCode)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Progress */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900 dark:text-white">Payment Progress</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {Math.round(((feeData?.paid || 0) / (feeData?.total || 1)) * 100)}% Complete
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 relative ${
                      (feeData?.balance || 0) > 0
                        ? "bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"
                        : "bg-gradient-to-r from-green-400 via-green-500 to-emerald-500"
                    }`}
                    style={{ width: `${((feeData?.paid || 0) / (feeData?.total || 1)) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              {(feeData?.balance || 0) > 0 && (
                <Link
                  href={`/parents/fees/pay?child=${child.id}`}
                  className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CreditCard className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Pay Outstanding Balance ({formatCurrency(feeData?.balance || 0, countryCode)})</span>
                </Link>
              )}

              {/* Cleared Status */}
              {(feeData?.balance || 0) === 0 && (
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/10 ring-1 ring-emerald-100 dark:ring-emerald-800/50 text-center overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/10 to-transparent" />
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    All Fees Cleared!
                  </p>
                  <p className="text-sm text-emerald-600/70 dark:text-emerald-400/60 mt-1">
                    This student has no outstanding balance.
                  </p>
                </div>
              )}

              {/* Coming Soon */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/10 ring-1 ring-indigo-100 dark:ring-indigo-800/50 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/10 to-transparent" />
                <FileText className="w-10 h-10 text-indigo-400 dark:text-indigo-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Payment history and receipts coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
