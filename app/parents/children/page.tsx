"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardPage from "@/components/pages/DashboardPage";
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
  FileText,
  CreditCard,
  Sparkles,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  Languages,
  Globe,
  Monitor,
  Palette,
  Bus,
  MapPin,
  Bell,
  MessageSquare,
  AlertTriangle,
  Info,
  Star,
  ArrowUpRight,
} from "lucide-react";
import type { ParentChild } from "@/types/parent";
import {
  MOCK_ACADEMIC_SUMMARY,
  MOCK_ATTENDANCE,
  MOCK_CHILDREN,
  MOCK_NOTIFICATIONS,
  MOCK_TRANSPORT,
  parentChildrenPrimaryStats,
} from "./config";

// Subject icons mapping
const subjectIcons: Record<string, { icon: ReactNode; bg: string; iconColor: string }> = {
  'Mathematics': { icon: <Calculator className="w-4 h-4" />, bg: 'bg-blue-100 dark:bg-blue-900/50 midnight:bg-blue-900/40 purple:bg-blue-900/40', iconColor: 'text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400' },
  'Physics': { icon: <Atom className="w-4 h-4" />, bg: 'bg-purple-100 dark:bg-purple-900/50 midnight:bg-purple-900/40 purple:bg-purple-900/40', iconColor: 'text-purple-600 dark:text-purple-400' },
  'Chemistry': { icon: <FlaskConical className="w-4 h-4" />, bg: 'bg-green-100 dark:bg-green-900/50 midnight:bg-green-900/40 purple:bg-green-900/40', iconColor: 'text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400' },
  'Biology': { icon: <Leaf className="w-4 h-4" />, bg: 'bg-emerald-100 dark:bg-emerald-900/50 midnight:bg-emerald-900/40 purple:bg-emerald-900/40', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  'English': { icon: <Languages className="w-4 h-4" />, bg: 'bg-orange-100 dark:bg-orange-900/50 midnight:bg-orange-900/40 purple:bg-orange-900/40', iconColor: 'text-orange-600 dark:text-orange-400' },
  'Science': { icon: <Atom className="w-4 h-4" />, bg: 'bg-cyan-100 dark:bg-cyan-900/50 midnight:bg-cyan-900/40 purple:bg-cyan-900/40', iconColor: 'text-cyan-600 dark:text-cyan-400' },
  'Social Studies': { icon: <Globe className="w-4 h-4" />, bg: 'bg-indigo-100 dark:bg-indigo-900/50 midnight:bg-indigo-900/40 purple:bg-indigo-900/40', iconColor: 'text-indigo-600 dark:text-indigo-400' },
  'Civic Education': { icon: <Users className="w-4 h-4" />, bg: 'bg-teal-100 dark:bg-teal-900/50 midnight:bg-teal-900/40 purple:bg-teal-900/40', iconColor: 'text-teal-600 dark:text-teal-400' },
  'Computer Science': { icon: <Monitor className="w-4 h-4" />, bg: 'bg-slate-100 dark:bg-slate-900/50 midnight:bg-slate-900/40 purple:bg-slate-900/40', iconColor: 'text-slate-600 dark:text-slate-400' },
  'Art': { icon: <Palette className="w-4 h-4" />, bg: 'bg-pink-100 dark:bg-pink-900/50 midnight:bg-pink-900/40 purple:bg-pink-900/40', iconColor: 'text-pink-600 dark:text-pink-400' },
};

const getSubjectIcon = (subject: string) => {
  return subjectIcons[subject] || {
    icon: <BookOpen className="w-4 h-4" />,
    bg: 'bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0f1330]/40 purple:bg-[#251340]/40',
    iconColor: 'text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300'
  };
};

export default function ParentChildrenPage() {
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

  // Get grade color with ring styling
  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 bg-green-100 dark:bg-green-900/40 ring-1 ring-green-200 dark:ring-green-800",
      B: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-200 dark:ring-blue-800",
      C: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 ring-1 ring-yellow-200 dark:ring-yellow-800",
      D: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 ring-1 ring-orange-200 dark:ring-orange-800",
      E: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 bg-red-100 dark:bg-red-900/40 ring-1 ring-red-200 dark:ring-red-800",
      F: "text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-900/40 ring-1 ring-red-200 dark:ring-red-800",
    };
    return colors[grade] || colors.C;
  };

  // Get notification icon and colors
  const getNotificationStyle = (type: string) => {
    const styles: Record<string, { icon: React.ReactNode; bg: string; iconColor: string; border: string }> = {
      info: {
        icon: <Info className="w-4 h-4" />,
        bg: 'bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400',
        border: 'border-blue-200 dark:border-blue-800/50'
      },
      success: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        bg: 'bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400',
        border: 'border-green-200 dark:border-green-800/50'
      },
      warning: {
        icon: <AlertTriangle className="w-4 h-4" />,
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        iconColor: 'text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800/50'
      },
    };
    return styles[type] || styles.info;
  };

  return (
    <DashboardPage<ParentChild>
      title="My Children"
      breadcrumbs={[
        { label: "Parent Portal", href: "/parents" },
        { label: "My Children" },
      ]}
      data={MOCK_CHILDREN}
      primaryStats={parentChildrenPrimaryStats}
      loadingText="Loading Children"
      afterStats={
        <div className="mt-6 space-y-6">
          {MOCK_CHILDREN.map((child) => {
            const academicData = MOCK_ACADEMIC_SUMMARY.find((a) => a.childId === child.id);
            const attendanceData = MOCK_ATTENDANCE[child.id as keyof typeof MOCK_ATTENDANCE];
            const transportData = MOCK_TRANSPORT[child.id as keyof typeof MOCK_TRANSPORT];
            const notifications = MOCK_NOTIFICATIONS[child.id as keyof typeof MOCK_NOTIFICATIONS] || [];

            return (
              <div
                key={child.id}
                className="group bg-surface rounded-2xl border border-line shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Child Header - Modern Design */}
                <div className="relative px-4 py-4 sm:px-5 sm:py-4 bg-surface border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <div className="flex items-center gap-4">
                    {/* Profile Photo - Enhanced Avatar */}
                    <div className="relative flex-shrink-0 group/avatar">
                      {/* Gradient ring behind avatar */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 rounded-2xl opacity-60 group-hover/avatar:opacity-80 blur-sm transition-opacity duration-300" />
                      {/* Avatar container */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 ring-2 ring-white dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-lg">
                        <Image
                          src={child.profilePhoto || `https://i.pravatar.cc/150?u=${child.id}`}
                          alt={child.fullName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      {/* Status indicator on avatar */}
                      {child.status === "Active" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-base sm:text-lg font-bold text-ink">
                          {child.fullName}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-semibold tracking-wide ${
                            child.status === "Active"
                              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200/50 dark:ring-emerald-700/50"
                              : "bg-surface-2 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 ring-1 ring-gray-200/50 dark:ring-gray-600/50"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${child.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                          {child.status}
                        </span>
                      </div>

                      {/* Meta Info - Pill style */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-medium">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {child.classLevel} {child.section && `(${child.section})`}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                          <BookOpen className="w-3.5 h-3.5" />
                          {child.admissionNumber}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {calculateAge(child.dateOfBirth)} yrs
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={`/parents/children/${child.id}`} className="hidden sm:block">
                      <Button
                        variant="primary"
                        size="md"
                        className="gap-1.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group/btn"
                      >
                        View Profile
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Academic, Attendance, Transport & Notifications Summary */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Academic Performance */}
                  {academicData && (
                    <div className="flex flex-col h-full p-4 rounded-xl bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-blue-900/20 midnight:from-gray-800/40 midnight:via-gray-900/30 midnight:to-cyan-900/10 purple:from-gray-800/40 purple:via-gray-900/30 purple:to-pink-900/10 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-ink text-sm">
                            Academic Performance
                          </h3>
                        </div>
                        <Link
                          href={`/parents/children/${child.id}/grades`}
                          className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-0.5 transition-colors hover:gap-1"
                        >
                          View Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Performance Stats - Compact */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="relative p-2.5 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-blue-100 dark:border-blue-800/30 overflow-hidden group/stat">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 pointer-events-none" />
                          <div className="relative text-center">
                            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                              {academicData.currentTermAverage?.toFixed(1)}%
                            </p>
                            <p className="text-[0.625rem] text-muted font-medium uppercase tracking-wide">Term Avg</p>
                          </div>
                        </div>
                        <div className="relative p-2.5 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-emerald-100 dark:border-emerald-800/30 overflow-hidden group/stat">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 pointer-events-none" />
                          <div className="relative text-center">
                            <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                              #{academicData.classPosition}
                            </p>
                            <p className="text-[0.625rem] text-muted font-medium uppercase tracking-wide">of {academicData.totalStudents}</p>
                          </div>
                        </div>
                        <div className="relative p-2.5 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-purple-100 dark:border-purple-800/30 overflow-hidden group/stat">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 pointer-events-none" />
                          <div className="relative text-center">
                            <p className={`text-lg font-bold ${getGradeColor(academicData.conductGrade || "A").split(" ").slice(0, 2).join(" ")}`}>
                              {academicData.conductGrade}
                            </p>
                            <p className="text-[0.625rem] text-muted font-medium uppercase tracking-wide">Conduct</p>
                          </div>
                        </div>
                      </div>

                      {/* Subject Performance - Full Width */}
                      <div className="flex-1 flex flex-col">
                        <p className="text-[0.625rem] font-semibold text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-wider mb-2">
                          Subject Performance
                        </p>
                        <div className="flex-1 flex flex-col gap-1.5">
                          {academicData.subjectPerformance.slice(0, 4).map((subject) => {
                            const subjectStyle = getSubjectIcon(subject.subject);
                            return (
                              <div
                                key={subject.subject}
                                className="flex items-center gap-2 p-2 rounded-lg bg-white/80 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/40 purple:bg-[#1a0b2e]/40 border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-200/60 dark:hover:border-blue-700/40 transition-all duration-200 group/subject"
                              >
                                <div className={`flex-shrink-0 p-1 rounded-md ${subjectStyle.bg} ${subjectStyle.iconColor} group-hover/subject:scale-105 transition-transform`}>
                                  {subjectStyle.icon}
                                </div>
                                <span className="flex-shrink-0 text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 w-20 truncate">
                                  {subject.subject}
                                </span>
                                <div className="flex-1 h-1.5 bg-surface-2/50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                    style={{ width: `${subject.score}%` }}
                                  />
                                </div>
                                <span className="flex-shrink-0 text-xs font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 w-9 text-right tabular-nums">
                                  {subject.score}%
                                </span>
                                <span
                                  className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[0.625rem] font-bold ${getGradeColor(subject.grade)}`}
                                >
                                  {subject.grade}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attendance Section */}
                  <div className="flex flex-col h-full p-4 rounded-xl bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-emerald-900/20 midnight:from-gray-800/40 midnight:via-gray-900/30 midnight:to-cyan-900/10 purple:from-gray-800/40 purple:via-gray-900/30 purple:to-pink-900/10 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
                    {attendanceData && (
                      <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-ink text-sm">
                              Attendance
                            </h3>
                          </div>
                          <Link
                            href={`/parents/children/${child.id}/attendance`}
                            className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-0.5 transition-colors hover:gap-1"
                          >
                            View Details
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* Attendance Rate Progress */}
                        <div className="relative p-3 rounded-lg bg-white/80 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/40 purple:bg-[#1a0b2e]/40 border border-emerald-100/60 dark:border-emerald-800/30 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-muted">Attendance Rate</span>
                            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">{attendanceData.rate}%</span>
                          </div>
                          <div className="w-full h-2 bg-surface-2/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full transition-all duration-500"
                              style={{ width: `${attendanceData.rate}%` }}
                            />
                          </div>
                        </div>

                        {/* Attendance Stats - Fill Remaining Space */}
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div className="relative flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-emerald-100 dark:border-emerald-800/30 overflow-hidden group/stat">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 pointer-events-none" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mb-1.5" />
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{attendanceData.present}</p>
                            <p className="text-[0.625rem] text-muted font-medium uppercase tracking-wide">Present</p>
                          </div>
                          <div className="relative flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-red-100 dark:border-red-800/30 overflow-hidden group/stat">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 dark:from-red-500/10 dark:to-rose-500/10 pointer-events-none" />
                            <div className="w-2 h-2 rounded-full bg-red-500 mb-1.5" />
                            <p className="text-xl font-bold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">{attendanceData.absent}</p>
                            <p className="text-[0.625rem] text-muted font-medium uppercase tracking-wide">Absent</p>
                          </div>
                          <div className="relative flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-amber-100 dark:border-amber-800/30 overflow-hidden group/stat">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 dark:from-amber-500/10 dark:to-yellow-500/10 pointer-events-none" />
                            <div className="w-2 h-2 rounded-full bg-amber-500 mb-1.5" />
                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">{attendanceData.late}</p>
                            <p className="text-[0.625rem] text-muted font-medium uppercase tracking-wide">Late</p>
                          </div>
                          <div className="relative flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-blue-100 dark:border-blue-800/30 overflow-hidden group/stat">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 pointer-events-none" />
                            <div className="w-2 h-2 rounded-full bg-blue-500 mb-1.5" />
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">{attendanceData.total}</p>
                            <p className="text-[0.625rem] text-muted font-medium uppercase tracking-wide">Total</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Transport Section */}
                  {transportData && (
                    <div className="flex flex-col h-full p-4 rounded-xl bg-gradient-to-br from-slate-50 via-white to-orange-50/30 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-orange-900/20 midnight:from-gray-800/40 midnight:via-gray-900/30 midnight:to-orange-900/10 purple:from-gray-800/40 purple:via-gray-900/30 purple:to-pink-900/10 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
                            <Bus className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-ink text-sm">
                            Transport
                          </h3>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[0.625rem] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm ${
                          transportData.status === "On Route"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                            : transportData.status === "At School"
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                            : "bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            transportData.status === "On Route" ? "bg-white animate-pulse" : "bg-white"
                          }`} />
                          {transportData.status}
                        </span>
                      </div>

                      {/* Route & Pickup Info - Fills Space */}
                      <div className="flex-1 grid grid-cols-2 gap-2 mb-3">
                        <div className="relative flex flex-col justify-center p-3 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-orange-100 dark:border-orange-800/30 overflow-hidden group/stat">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 dark:from-orange-500/10 dark:to-amber-500/10 pointer-events-none" />
                          <div className="relative">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Bus className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                              <span className="text-[0.625rem] font-medium text-muted uppercase tracking-wide">Route</span>
                            </div>
                            <p className="text-sm font-bold text-ink truncate">{transportData.routeName}</p>
                          </div>
                        </div>
                        <div className="relative flex flex-col justify-center p-3 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-red-100 dark:border-red-800/30 overflow-hidden group/stat">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 dark:from-red-500/10 dark:to-rose-500/10 pointer-events-none" />
                          <div className="relative">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="w-3 h-3 text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                              <span className="text-[0.625rem] font-medium text-muted uppercase tracking-wide">Pickup</span>
                            </div>
                            <p className="text-sm font-bold text-ink truncate">{transportData.pickupLocation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Time Bar */}
                      <div className="relative flex items-stretch rounded-lg bg-gradient-to-r from-orange-100 via-amber-50 to-amber-100 dark:from-orange-900/40 dark:via-amber-900/20 dark:to-amber-900/40 border border-orange-200/60 dark:border-orange-700/30 overflow-hidden">
                        {/* Pickup Time */}
                        <div className="flex-1 flex items-center gap-2.5 p-2.5 border-r border-orange-200/60 dark:border-orange-700/30">
                          <div className="p-1.5 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <p className="text-[0.625rem] font-medium text-orange-600/70 dark:text-orange-400/70 uppercase tracking-wide">Pickup</p>
                            <p className="text-base font-bold text-orange-700 dark:text-orange-300">{transportData.pickupTime}</p>
                          </div>
                        </div>
                        {/* Arrow Indicator */}
                        <div className="flex items-center justify-center px-2 bg-gradient-to-b from-transparent via-orange-200/30 to-transparent dark:via-orange-700/20">
                          <ChevronRight className="w-4 h-4 text-orange-400 dark:text-orange-500" />
                        </div>
                        {/* Drop-off Time */}
                        <div className="flex-1 flex items-center justify-end gap-2.5 p-2.5">
                          <div className="text-right">
                            <p className="text-[0.625rem] font-medium text-amber-600/70 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400/70 uppercase tracking-wide">Drop-off</p>
                            <p className="text-base font-bold text-amber-700 dark:text-amber-300">{transportData.dropoffTime}</p>
                          </div>
                          <div className="p-1.5 rounded-md bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real-time Notifications */}
                  {notifications.length > 0 && (
                    <div className="flex flex-col h-full p-4 rounded-xl bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-purple-900/20 midnight:from-gray-800/40 midnight:via-gray-900/30 midnight:to-indigo-900/10 purple:from-gray-800/40 purple:via-gray-900/30 purple:to-pink-900/10 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="relative p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm">
                            <Bell className="w-4 h-4 text-white" />
                            {notifications.filter(n => !n.read).length > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center text-[0.5625rem] text-white font-bold shadow-sm ring-2 ring-white dark:ring-gray-800">
                                {notifications.filter(n => !n.read).length}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-ink text-sm">
                            Notifications
                          </h3>
                        </div>
                        <Link
                          href={`/parents/children/${child.id}/notifications`}
                          className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-0.5 transition-colors hover:gap-1"
                        >
                          View All
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Notifications List - Fills Space */}
                      <div className="flex-1 flex flex-col gap-2">
                        {notifications.slice(0, 3).map((notification) => {
                          const style = getNotificationStyle(notification.type);
                          const gradientStyles = {
                            info: 'from-blue-500/8 to-indigo-500/5 dark:from-blue-500/15 dark:to-indigo-500/10 border-blue-200/60 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/40',
                            success: 'from-emerald-500/8 to-green-500/5 dark:from-emerald-500/15 dark:to-green-500/10 border-emerald-200/60 dark:border-emerald-700/40',
                            warning: 'from-amber-500/8 to-yellow-500/5 dark:from-amber-500/15 dark:to-yellow-500/10 border-amber-200/60 dark:border-amber-700/40',
                          };
                          const iconGradients = {
                            info: 'from-blue-500 to-indigo-600',
                            success: 'from-emerald-500 to-green-600',
                            warning: 'from-amber-500 to-orange-600',
                          };
                          return (
                            <div
                              key={notification.id}
                              className={`relative flex-1 flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${gradientStyles[notification.type as keyof typeof gradientStyles] || gradientStyles.info} border overflow-hidden group/notif hover:shadow-sm transition-all duration-200 ${!notification.read ? 'ring-1 ring-purple-300/50 dark:ring-purple-600/30' : ''}`}
                            >
                              {/* Subtle gradient overlay */}
                              <div className="absolute inset-0 bg-white/40 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/20 pointer-events-none" />

                              {/* Icon */}
                              <div className={`relative flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${iconGradients[notification.type as keyof typeof iconGradients] || iconGradients.info} shadow-sm`}>
                                <span className="text-white">{style.icon}</span>
                              </div>

                              {/* Content */}
                              <div className="relative flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 line-clamp-2 leading-snug">{notification.message}</p>
                                <p className="text-[0.625rem] text-muted mt-1 font-medium">{notification.time}</p>
                              </div>

                              {/* Unread indicator */}
                              {!notification.read && (
                                <div className="relative flex-shrink-0">
                                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full block shadow-sm" />
                                  <span className="absolute inset-0 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping opacity-75" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex flex-col h-full p-4 rounded-xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-indigo-900/20 midnight:from-gray-800/40 midnight:via-gray-900/30 midnight:to-cyan-900/10 purple:from-gray-800/40 purple:via-gray-900/30 purple:to-pink-900/10 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-ink text-sm">
                        Quick Actions
                      </h3>
                    </div>
                    {/* Actions Grid */}
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-2">
                      <Link
                        href={`/parents/children/${child.id}/term-progress?from=children`}
                        className="relative flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 dark:from-indigo-900/20 dark:to-indigo-800/10 border border-indigo-100/80 dark:border-indigo-800/30 hover:border-indigo-200 dark:hover:border-indigo-700/50 hover:shadow-md transition-all duration-200 group/action overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity" />
                        <div className="relative p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 group-hover/action:scale-105 transition-transform shadow-sm flex-shrink-0">
                          <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="relative flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink leading-tight">Term Progress</p>
                          <p className="text-[0.625rem] text-indigo-600/70 dark:text-indigo-400/70 leading-tight">Track progress</p>
                        </div>
                      </Link>
                      <Link
                        href={`/parents/children/${child.id}/report-card`}
                        className="relative flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-blue-50/80 to-blue-100/40 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-100/80 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/50 hover:shadow-md transition-all duration-200 group/action overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity" />
                        <div className="relative p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 group-hover/action:scale-105 transition-transform shadow-sm flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                        </div>
                        <div className="relative flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink leading-tight">Report Card</p>
                          <p className="text-[0.625rem] text-blue-600/70 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400/70 leading-tight">View grades</p>
                        </div>
                      </Link>
                      <Link
                        href={`/parents/fees?child=${child.id}`}
                        className="relative flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-green-50/80 to-green-100/40 dark:from-green-900/20 dark:to-green-800/10 border border-green-100/80 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/50 hover:shadow-md transition-all duration-200 group/action overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity" />
                        <div className="relative p-2 rounded-lg bg-green-100 dark:bg-green-900/50 group-hover/action:scale-105 transition-transform shadow-sm flex-shrink-0">
                          <CreditCard className="w-3.5 h-3.5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                        </div>
                        <div className="relative flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink leading-tight">Pay Fees</p>
                          <p className="text-[0.625rem] text-green-600/70 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400/70 leading-tight">Make payment</p>
                        </div>
                      </Link>
                      <Link
                        href={`/parents/children/${child.id}/messages`}
                        className="relative flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-purple-50/80 to-purple-100/40 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-100/80 dark:border-purple-800/30 hover:border-purple-200 dark:hover:border-purple-700/50 hover:shadow-md transition-all duration-200 group/action overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity" />
                        <div className="relative p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 group-hover/action:scale-105 transition-transform shadow-sm flex-shrink-0">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="relative flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink leading-tight">Message</p>
                          <p className="text-[0.625rem] text-purple-600/70 dark:text-purple-400/70 leading-tight">Contact teacher</p>
                        </div>
                      </Link>
                      <Link
                        href={`/parents/children/${child.id}/timetable`}
                        className="relative flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-red-50/80 to-red-100/40 dark:from-red-900/20 dark:to-red-800/10 border border-red-100/80 dark:border-red-800/30 hover:border-red-200 dark:hover:border-red-700/50 hover:shadow-md transition-all duration-200 group/action overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity" />
                        <div className="relative p-2 rounded-lg bg-red-100 dark:bg-red-900/50 group-hover/action:scale-105 transition-transform shadow-sm flex-shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                        </div>
                        <div className="relative flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink leading-tight">Timetable</p>
                          <p className="text-[0.625rem] text-red-600/70 dark:text-red-400 midnight:text-red-400 purple:text-red-400/70 leading-tight">View schedule</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Teacher's Remarks */}
                  {academicData?.overallRemarks && (
                    <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50/30 dark:from-amber-900/20 dark:via-orange-900/10 dark:to-yellow-900/5 border border-amber-200/60 dark:border-amber-700/30 shadow-sm">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/15 to-transparent pointer-events-none" />

                      <div className="relative flex items-center gap-4 p-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20">
                          <Star className="w-5 h-5 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.625rem] font-bold text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 uppercase tracking-wider mb-1">
                            Teacher&apos;s Remarks
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 italic leading-relaxed">
                            &quot;{academicData.overallRemarks}&quot;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      }
    />
  );
}
