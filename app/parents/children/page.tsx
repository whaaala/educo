"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import StatCard from "@/components/shared/StatCard";
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
} from "lucide-react";
import type { ParentChild, ChildAcademicSummary } from "@/types/parent";

// Mock Data
const MOCK_CHILDREN: ParentChild[] = [
  {
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
  {
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
];

const MOCK_ACADEMIC_SUMMARY: ChildAcademicSummary[] = [
  {
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    classLevel: "JSS 2",
    currentTermAverage: 78.5,
    classPosition: 5,
    totalStudents: 45,
    subjectPerformance: [
      { subject: "Mathematics", score: 85, grade: "A" },
      { subject: "English", score: 78, grade: "B" },
      { subject: "Science", score: 72, grade: "B" },
      { subject: "Social Studies", score: 80, grade: "A" },
      { subject: "Civic Education", score: 75, grade: "B" },
    ],
    overallRemarks: "Good performance. Keep it up!",
    conductGrade: "A",
  },
  {
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    classLevel: "SS 1",
    currentTermAverage: 82.3,
    classPosition: 3,
    totalStudents: 52,
    subjectPerformance: [
      { subject: "Mathematics", score: 88, grade: "A" },
      { subject: "Physics", score: 80, grade: "A" },
      { subject: "Chemistry", score: 79, grade: "B" },
      { subject: "Biology", score: 85, grade: "A" },
      { subject: "English", score: 78, grade: "B" },
    ],
    overallRemarks: "Excellent performance!",
    conductGrade: "A",
  },
];

// Mock attendance data
const MOCK_ATTENDANCE = {
  "child-001": { present: 42, absent: 3, late: 2, total: 47, rate: 89.4 },
  "child-002": { present: 45, absent: 1, late: 1, total: 47, rate: 95.7 },
};

export default function ParentChildrenPage() {
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();

  // Calculate age from date of birth
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

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Children" />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <PageHeader
          title="My Children"
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "My Children" },
          ]}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Users}
            label="Total Children"
            value={MOCK_CHILDREN.length.toString()}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Active"
            value={MOCK_CHILDREN.filter((c) => c.status === "Active").length.toString()}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg. Performance"
            value={`${(MOCK_ACADEMIC_SUMMARY.reduce((sum, a) => sum + (a.currentTermAverage || 0), 0) / MOCK_ACADEMIC_SUMMARY.length).toFixed(1)}%`}
            color="purple"
          />
          <StatCard
            icon={Award}
            label="Best Position"
            value={`#${Math.min(...MOCK_ACADEMIC_SUMMARY.map((a) => a.classPosition || 999))}`}
            color="orange"
          />
        </div>

        {/* Children Cards */}
        <div className="space-y-6">
          {MOCK_CHILDREN.map((child) => {
            const academicData = MOCK_ACADEMIC_SUMMARY.find((a) => a.childId === child.id);
            const attendanceData = MOCK_ATTENDANCE[child.id as keyof typeof MOCK_ATTENDANCE];

            return (
              <div
                key={child.id}
                className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden"
              >
                {/* Child Header */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex-shrink-0 shadow-lg ring-4 ring-white dark:ring-gray-700">
                      <Image
                        src={child.profilePhoto || `https://i.pravatar.cc/150?u=${child.id}`}
                        alt={child.fullName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {child.fullName}
                        </h2>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            child.status === "Active"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {child.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {child.classLevel} {child.section && `(${child.section})`}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {child.admissionNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {calculateAge(child.dateOfBirth)} years old
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/parents/children/${child.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Academic & Attendance Summary */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Academic Performance */}
                  {academicData && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Academic Performance
                        </h3>
                        <Link
                          href={`/parents/children/${child.id}/grades`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Details
                        </Link>
                      </div>

                      {/* Performance Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {academicData.currentTermAverage?.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Term Average</p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-center">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            #{academicData.classPosition}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            of {academicData.totalStudents}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-center">
                          <p className={`text-2xl font-bold ${getGradeColor(academicData.conductGrade || "A").split(" ").slice(0, 2).join(" ")}`}>
                            {academicData.conductGrade}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Conduct</p>
                        </div>
                      </div>

                      {/* Top Subjects */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Subject Performance
                        </p>
                        <div className="space-y-2">
                          {academicData.subjectPerformance.slice(0, 4).map((subject) => (
                            <div
                              key={subject.subject}
                              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {subject.subject}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {subject.score}%
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-xs font-bold ${getGradeColor(subject.grade)}`}
                                >
                                  {subject.grade}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attendance & Quick Actions */}
                  <div className="space-y-4">
                    {attendanceData && (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                            Attendance
                          </h3>
                          <Link
                            href={`/parents/children/${child.id}/attendance`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Details
                          </Link>
                        </div>

                        {/* Attendance Stats */}
                        <div className="grid grid-cols-4 gap-2">
                          <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              {attendanceData.present}
                            </p>
                            <p className="text-xs text-gray-500">Present</p>
                          </div>
                          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                              {attendanceData.absent}
                            </p>
                            <p className="text-xs text-gray-500">Absent</p>
                          </div>
                          <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-center">
                            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                              {attendanceData.late}
                            </p>
                            <p className="text-xs text-gray-500">Late</p>
                          </div>
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {attendanceData.rate}%
                            </p>
                            <p className="text-xs text-gray-500">Rate</p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Quick Actions */}
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Quick Actions
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/parents/children/${child.id}/report-card`}
                          className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Report Card
                        </Link>
                        <Link
                          href={`/parents/fees?child=${child.id}`}
                          className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                          Pay Fees
                        </Link>
                      </div>
                    </div>

                    {/* Teacher's Remarks */}
                    {academicData?.overallRemarks && (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200/60 dark:border-amber-700/30">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                          Teacher&apos;s Remarks
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          &quot;{academicData.overallRemarks}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
