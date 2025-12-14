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

  // Get grade color
  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
      B: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
      C: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
      D: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30",
      E: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
      F: "text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-900/30",
    };
    return colors[grade] || colors.C;
  };

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
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

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex-shrink-0 shadow-xl ring-4 ring-white dark:ring-gray-700">
                <Image
                  src={child.profilePhoto || `https://i.pravatar.cc/150?u=${child.id}`}
                  alt={child.fullName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {child.fullName}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      child.status === "Active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {child.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {child.classLevel} {child.section && `(${child.section})`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {child.admissionNumber}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {calculateAge(child.dateOfBirth)} years old ({new Date(child.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {child.gender}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" className="text-blue-600 dark:text-blue-400">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Teacher
                </Button>
                <Link href={`/parents/children/${child.id}/report-card`}>
                  <Button variant="primary">
                    <FileText className="w-4 h-4 mr-2" />
                    View Report Card
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 text-center border-r border-gray-200 dark:border-gray-700">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {academicData?.currentTermAverage?.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Term Average</p>
            </div>
            <div className="p-4 text-center border-r border-gray-200 dark:border-gray-700 md:border-r">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                #{academicData?.classPosition}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                of {academicData?.totalStudents} students
              </p>
            </div>
            <div className="p-4 text-center border-r border-gray-200 dark:border-gray-700">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {attendanceData?.rate}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Attendance Rate</p>
            </div>
            <div className="p-4 text-center">
              <p className={`text-2xl font-bold ${
                feeData?.status === "paid"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
                {feeData?.status === "paid" ? "Paid" : formatCurrency(feeData?.balance || 0, countryCode)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {feeData?.status === "paid" ? "Fees Cleared" : "Fee Balance"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Performance */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Recent Performance
                </h3>
                <div className="space-y-2">
                  {academicData?.subjectPerformance.slice(0, 5).map((subject) => (
                    <div
                      key={subject.subject}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {subject.subject}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              subject.score >= 80
                                ? "bg-green-500"
                                : subject.score >= 60
                                ? "bg-blue-500"
                                : subject.score >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${subject.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-10 text-right">
                          {subject.score}%
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(subject.grade)}`}
                        >
                          {subject.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Overview */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Attendance Overview
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {attendanceData?.present}
                    </p>
                    <p className="text-sm text-gray-500">Days Present</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-center">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {attendanceData?.absent}
                    </p>
                    <p className="text-sm text-gray-500">Days Absent</p>
                  </div>
                  <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-center">
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      {attendanceData?.late}
                    </p>
                    <p className="text-sm text-gray-500">Times Late</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {attendanceData?.rate}%
                    </p>
                    <p className="text-sm text-gray-500">Attendance Rate</p>
                  </div>
                </div>

                {/* Teacher's Remarks */}
                {academicData?.overallRemarks && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200/60 dark:border-amber-700/30">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                      Teacher&apos;s Remarks
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      &quot;{academicData.overallRemarks}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === "academics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Subject Performance - Current Term
                </h3>
                <Button variant="ghost" className="text-blue-600 dark:text-blue-400">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Subject</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Score</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Grade</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Teacher&apos;s Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicData?.subjectPerformance.map((subject, idx) => (
                      <tr
                        key={subject.subject}
                        className={`border-b border-gray-100 dark:border-gray-800 ${
                          idx % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/30" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {subject.subject}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {subject.score}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-sm font-bold ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {subject.teacherRemarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-700/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {attendanceData?.present}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Present</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-700/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {attendanceData?.absent}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Absent</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-700/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {attendanceData?.late}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Late</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-700/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {attendanceData?.rate}%
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Attendance calendar and detailed records coming soon...
                </p>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === "fees" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-700/30">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Fees</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(feeData?.total || 0, countryCode)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-700/30">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Paid</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(feeData?.paid || 0, countryCode)}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${
                  (feeData?.balance || 0) > 0
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200/60 dark:border-red-700/30"
                    : "bg-green-50 dark:bg-green-900/20 border-green-200/60 dark:border-green-700/30"
                }`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Balance</p>
                  <p className={`text-2xl font-bold ${
                    (feeData?.balance || 0) > 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}>
                    {formatCurrency(feeData?.balance || 0, countryCode)}
                  </p>
                </div>
              </div>

              {(feeData?.balance || 0) > 0 && (
                <Link
                  href={`/parents/fees/pay?child=${child.id}`}
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Outstanding Balance ({formatCurrency(feeData?.balance || 0, countryCode)})
                </Link>
              )}

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
