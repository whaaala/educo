import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/config/countries";
import Button from "@/components/shared/Button";
import {
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  GraduationCap,
  Mail,
  Minus,
  Send,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { DashboardDragHandle } from "@/components/parents/dashboard/parent-dashboard-masonry-dnd";
import type {
  Child,
  ChildLeaveRequest,
  ChildProgress,
  ExamResultItem,
  FeeReminderItem,
  HomeworkItem,
  NoticeItem,
  ParentEvent,
  ParentMessage,
  ParentProfile,
  PaymentHistoryItem,
} from "@/components/parents/dashboard/models";

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" | string }) {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-green-500" />;
  if (trend === "down") return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
  return <Minus className="w-3 h-3 text-gray-400" />;
}

export function ParentProfileCard({ parent }: { parent: ParentProfile }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="absolute top-2.5 right-2.5 z-10">
        <DashboardDragHandle />
      </div>
      <div className="relative h-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 midnight:from-cyan-950/40 midnight:via-slate-900/30 midnight:to-cyan-950/40 purple:from-pink-950/40 purple:via-slate-900/30 purple:to-purple-950/40">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>
      <div className="relative px-3 pb-3">
        <div className="relative -mt-8 mb-2.5">
          <div className="w-16 h-16 rounded-xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg">
            <Image src={parent.profilePhoto} alt={parent.fullName} width={64} height={64} className="object-cover" unoptimized />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
          {parent.id}
        </span>
        <h3 className="font-bold text-gray-900 dark:text-white text-base mt-1">{parent.fullName}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
          <Mail className="w-3 h-3" /> {parent.email}
        </p>
      </div>
    </div>
  );
}

export function MyChildrenCard({
  children,
  selectedChild,
  onSelectChild,
}: {
  children: Child[];
  selectedChild: Child;
  onSelectChild: (child: Child) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-shadow duration-300 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 midnight:from-cyan-900/40 midnight:to-indigo-900/40 purple:from-pink-900/40 purple:to-purple-900/40 shadow-sm">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">My Children</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 midnight:from-cyan-500 midnight:to-indigo-500 purple:from-pink-500 purple:to-purple-500 px-2.5 py-1 rounded-full shadow-sm">
            {children.length}
          </span>
          <DashboardDragHandle />
        </div>
      </div>
      <div className="space-y-2">
        {children.map((child) => {
          const isSelected = selectedChild.id === child.id;
          return (
            <button
              key={child.id}
              onClick={() => onSelectChild(child)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group ${
                isSelected
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 midnight:from-cyan-900/30 midnight:to-indigo-900/30 purple:from-pink-900/30 purple:to-purple-900/30 border border-blue-200 dark:border-blue-700/50 midnight:border-cyan-500/30 purple:border-pink-500/30 shadow-sm"
                  : "bg-gray-50/80 dark:bg-gray-700/20 midnight:bg-gray-800/30 purple:bg-gray-800/30 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/40 hover:border-gray-200 dark:hover:border-gray-600"
              }`}
              type="button"
            >
              <div
                className={`relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-blue-400 dark:ring-blue-500 midnight:ring-cyan-400 purple:ring-pink-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                    : "group-hover:scale-105"
                }`}
              >
                <Image src={child.profilePhoto} alt={child.fullName} width={40} height={40} className="object-cover w-full h-full" unoptimized />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p
                  className={`font-semibold text-sm truncate transition-colors ${
                    isSelected
                      ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                      : "text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                >
                  {child.fullName}
                </p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    isSelected
                      ? "text-blue-600/70 dark:text-blue-400/70 midnight:text-cyan-400/70 purple:text-pink-400/70"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {child.classLevel} • Sec {child.section}
                </p>
              </div>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 midnight:from-cyan-400 midnight:to-indigo-400 purple:from-pink-400 purple:to-purple-400 shadow-sm"
                    : "bg-gray-300 dark:bg-gray-600 opacity-0 group-hover:opacity-50"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function QuickActionsCard() {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-shadow duration-300 p-3">
      <div className="flex items-center justify-between mb-2.5">
        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Quick Actions</h4>
        <DashboardDragHandle />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          className="group flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 midnight:from-cyan-900/20 midnight:to-blue-900/10 purple:from-pink-900/20 purple:to-purple-900/10 border border-blue-100/50 dark:border-blue-800/30 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-md transition-all duration-200"
          type="button"
        >
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 midnight:bg-cyan-900/50 purple:bg-pink-900/50 group-hover:scale-105 transition-transform duration-200">
            <CalendarPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Request Leave
          </span>
        </button>
        <button
          className="group flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-50/80 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/10 midnight:from-indigo-900/20 midnight:to-purple-900/10 purple:from-purple-900/20 purple:to-pink-900/10 border border-purple-100/50 dark:border-purple-800/30 midnight:border-indigo-500/20 purple:border-purple-500/20 hover:border-purple-300 dark:hover:border-purple-600/50 hover:shadow-md transition-all duration-200"
          type="button"
        >
          <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 midnight:bg-indigo-900/50 purple:bg-pink-900/50 group-hover:scale-105 transition-transform duration-200">
            <Send className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 midnight:text-indigo-400 purple:text-pink-400" />
          </div>
          <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Message Teacher
          </span>
        </button>
      </div>
    </div>
  );
}

export function PaymentHistoryCard({
  payments,
  countryCode,
}: {
  payments: PaymentHistoryItem[];
  countryCode: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-shadow duration-300 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 midnight:from-emerald-900/40 midnight:to-green-900/40 purple:from-green-900/40 purple:to-emerald-900/40 shadow-sm">
            <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
          </div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Payment History</h4>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/parents/fees" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline">
            View All
          </Link>
          <DashboardDragHandle />
        </div>
      </div>
      <div className="space-y-2">
        {payments.map((payment, index) => (
          <div
            key={payment.id}
            className="group flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-700/30 dark:to-gray-700/10 midnight:from-gray-800/40 midnight:to-gray-800/20 purple:from-gray-800/40 purple:to-gray-800/20 border border-gray-100 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20 hover:border-green-200 dark:hover:border-green-700/40 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 midnight:from-green-900/50 midnight:to-emerald-900/50 purple:from-green-900/50 purple:to-emerald-900/50 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                {index === 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                  {payment.description}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5">{formatShortDate(payment.date)}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                {formatCurrency(payment.amount, countryCode)}
              </span>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Completed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExamResultsCard({ results }: { results: ExamResultItem[] }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 via-transparent to-transparent dark:from-indigo-400/10 midnight:from-indigo-400/10 purple:from-pink-400/10 pointer-events-none" />
      <div className="relative px-3 py-2.5 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-pink-900/30">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-pink-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Exam Results</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/parents/results"
            className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
          <DashboardDragHandle />
        </div>
      </div>
      <div className="relative flex-1 px-3 py-2.5 flex flex-col justify-between gap-2">
        {results.map((result) => (
          <div
            key={result.id}
            className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-x-0.5 ${
              result.status === "pass"
                ? "bg-gradient-to-r from-green-50/50 to-white dark:from-green-900/10 dark:to-gray-700/10 midnight:from-green-900/10 midnight:to-gray-800/20 purple:from-green-900/10 purple:to-gray-800/20 border-green-100 dark:border-green-700/20 midnight:border-green-700/15 purple:border-green-700/15 hover:border-green-300 dark:hover:border-green-500/40"
                : "bg-gradient-to-r from-red-50/50 to-white dark:from-red-900/10 dark:to-gray-700/10 midnight:from-red-900/10 midnight:to-gray-800/20 purple:from-red-900/10 purple:to-gray-800/20 border-red-100 dark:border-red-700/20 midnight:border-red-700/15 purple:border-red-700/15 hover:border-red-300 dark:hover:border-red-500/40"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-md">
                  <Image src={result.studentPhoto} alt={result.studentName} width={40} height={40} className="object-cover" unoptimized />
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                    result.status === "pass" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {result.status === "pass" ? <CheckCircle2 className="w-2.5 h-2.5 text-white" /> : <AlertTriangle className="w-2.5 h-2.5 text-white" />}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">{result.studentName}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400">
                  {result.class}-{result.section} • {result.examType}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 midnight:bg-gray-700 purple:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.percentage >= 70 ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-amber-400 to-orange-500"
                  }`}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
              <span
                className={`text-sm font-bold min-w-[36px] text-right ${result.percentage >= 70 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
              >
                {result.percentage}%
              </span>
            </div>
            <button
              className="flex-shrink-0 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-pink-900/30 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-pink-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-200 group-hover:scale-105"
              type="button"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentGradesCard({
  selectedChildId,
  progress,
}: {
  selectedChildId: string;
  progress: ChildProgress | undefined;
}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 via-transparent to-transparent dark:from-blue-400/10 midnight:from-cyan-400/10 purple:from-pink-400/10 pointer-events-none" />
      <div className="relative px-3 py-2.5 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Recent Grades</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/parents/children/${selectedChildId}`}
            className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
          <DashboardDragHandle />
        </div>
      </div>
      <div className="relative flex-1 px-3 py-2.5 flex flex-col justify-between gap-2">
        {progress?.recentGrades.map((grade, idx) => (
          <div
            key={idx}
            className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-700/30 dark:to-gray-700/10 midnight:from-gray-800/40 midnight:to-gray-800/20 purple:from-gray-800/40 purple:to-gray-800/20 border border-gray-100 dark:border-gray-600/20 midnight:border-gray-600/15 purple:border-gray-600/15 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md hover:-translate-x-0.5 transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 midnight:group-hover:text-cyan-300 purple:group-hover:text-pink-300 transition-colors truncate">
                {grade.subject}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 font-medium">{grade.score}%</p>
            </div>
            <div
              className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
                grade.trend === "up"
                  ? "bg-green-100 dark:bg-green-900/40 midnight:bg-green-900/40 purple:bg-green-900/40"
                  : grade.trend === "down"
                    ? "bg-red-100 dark:bg-red-900/40 midnight:bg-red-900/40 purple:bg-red-900/40"
                    : "bg-gray-100 dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50"
              }`}
            >
              <TrendIcon trend={grade.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventsCard({ events }: { events: ParentEvent[] }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/5 via-transparent to-transparent dark:from-purple-400/10 midnight:from-indigo-400/10 purple:from-pink-400/10 pointer-events-none" />
      <div className="relative px-3 py-2.5 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 midnight:bg-indigo-900/30 purple:bg-pink-900/30">
            <CalendarDays className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-indigo-400 purple:text-pink-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Events</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/parents/events"
            className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
          <DashboardDragHandle />
        </div>
      </div>
      <div className="relative flex-1 p-3 grid grid-cols-2 gap-2 auto-rows-fr">
        {events.map((event) => (
          <div
            key={event.id}
            className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600/20 midnight:border-gray-600/15 purple:border-gray-600/15 hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-gray-700/20 midnight:bg-gray-800/30 purple:bg-gray-800/30 flex flex-col"
          >
            <div className="relative flex-1 min-h-[60px] overflow-hidden">
              <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[8px] font-bold bg-white/95 text-gray-800 shadow-md">{event.duration}</span>
            </div>
            <div className="p-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-700/10 midnight:from-gray-800/40 midnight:to-gray-800/20 purple:from-gray-800/40 purple:to-gray-800/20 flex-shrink-0">
              <p className="text-[11px] font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {event.title}
              </p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 flex items-center gap-1">
                <CalendarDays className="w-2.5 h-2.5" /> {formatShortDate(event.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChildLeaveRequestsCard({ leaves }: { leaves: ChildLeaveRequest[] }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent dark:from-cyan-400/10 midnight:from-cyan-400/10 purple:from-pink-400/10 pointer-events-none" />
      <div className="relative px-3 py-2.5 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
            <CalendarCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Child Leave Requests</span>
        </div>
        <DashboardDragHandle />
      </div>
      <div className="relative flex-1 px-3 py-2.5 flex flex-col justify-between gap-2">
        {leaves.map((leave) => (
          <div
            key={leave.id}
            className={`group relative p-2.5 rounded-xl border transition-all duration-200 hover:shadow-md overflow-hidden ${
              leave.status === "approved"
                ? "bg-gradient-to-r from-green-50/80 to-white dark:from-green-900/20 dark:to-gray-700/10 midnight:from-green-900/20 midnight:to-gray-800/20 purple:from-green-900/20 purple:to-gray-800/20 border-green-100 dark:border-green-700/30 midnight:border-green-700/20 purple:border-green-700/20 hover:border-green-300 dark:hover:border-green-500/40"
                : leave.status === "pending"
                  ? "bg-gradient-to-r from-amber-50/80 to-white dark:from-amber-900/20 dark:to-gray-700/10 midnight:from-amber-900/20 midnight:to-gray-800/20 purple:from-amber-900/20 purple:to-gray-800/20 border-amber-100 dark:border-amber-700/30 midnight:border-amber-700/20 purple:border-amber-700/20 hover:border-amber-300 dark:hover:border-amber-500/40"
                  : "bg-gradient-to-r from-red-50/80 to-white dark:from-red-900/20 dark:to-gray-700/10 midnight:from-red-900/20 midnight:to-gray-800/20 purple:from-red-900/20 purple:to-gray-800/20 border-red-100 dark:border-red-700/30 midnight:border-red-700/20 purple:border-red-700/20 hover:border-red-300 dark:hover:border-red-500/40"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div
                className={`flex-shrink-0 p-2 rounded-lg ${
                  leave.status === "approved"
                    ? "bg-green-100 dark:bg-green-900/40 midnight:bg-green-900/40 purple:bg-green-900/40"
                    : leave.status === "pending"
                      ? "bg-amber-100 dark:bg-amber-900/40 midnight:bg-amber-900/40 purple:bg-amber-900/40"
                      : "bg-red-100 dark:bg-red-900/40 midnight:bg-red-900/40 purple:bg-red-900/40"
                }`}
              >
                {leave.status === "approved" && <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />}
                {leave.status === "pending" && <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                {leave.status === "declined" && <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />}
              </div>
              <span
                className={`flex-shrink-0 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                  leave.status === "approved"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : leave.status === "pending"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                }`}
              >
                {leave.status}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">{leave.reason}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 truncate">
                {leave.childName} • {formatShortDate(leave.fromDate)} - {formatShortDate(leave.toDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeworkCard({ homework }: { homework: HomeworkItem[] }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent dark:from-emerald-400/10 midnight:from-emerald-400/10 purple:from-pink-400/10 pointer-events-none" />
      <div className="relative px-3 py-2.5 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-pink-900/30">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-pink-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Homework</span>
        </div>
        <DashboardDragHandle />
      </div>
      <div className="relative flex-1 px-3 py-2.5 flex flex-col justify-between gap-2">
        {homework.map((hw) => (
          <div
            key={hw.id}
            className={`group relative p-2.5 rounded-xl border transition-all duration-200 hover:shadow-md overflow-hidden ${
              hw.color === "purple"
                ? "bg-gradient-to-r from-purple-50/80 to-white dark:from-purple-900/20 dark:to-gray-700/10 midnight:from-purple-900/20 midnight:to-gray-800/20 purple:from-purple-900/20 purple:to-gray-800/20 border-purple-100 dark:border-purple-700/30 midnight:border-purple-700/20 purple:border-purple-700/20 hover:border-purple-300 dark:hover:border-purple-500/40"
                : hw.color === "green"
                  ? "bg-gradient-to-r from-green-50/80 to-white dark:from-green-900/20 dark:to-gray-700/10 midnight:from-green-900/20 midnight:to-gray-800/20 purple:from-green-900/20 purple:to-gray-800/20 border-green-100 dark:border-green-700/30 midnight:border-green-700/20 purple:border-green-700/20 hover:border-green-300 dark:hover:border-green-500/40"
                  : "bg-gradient-to-r from-blue-50/80 to-white dark:from-blue-900/20 dark:to-gray-700/10 midnight:from-blue-900/20 midnight:to-gray-800/20 purple:from-blue-900/20 purple:to-gray-800/20 border-blue-100 dark:border-blue-700/30 midnight:border-blue-700/20 purple:border-blue-700/20 hover:border-blue-300 dark:hover:border-blue-500/40"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  hw.color === "purple"
                    ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                    : hw.color === "green"
                      ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                      : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                }`}
              >
                {hw.subject}
              </div>
              <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100/80 dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50">
                <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-300">{formatShortDate(hw.dueDate)}</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">{hw.description}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 truncate">{hw.teacher}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeesReminderCard({
  reminders,
  countryCode,
}: {
  reminders: FeeReminderItem[];
  countryCode: string;
}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-500/5 via-transparent to-transparent dark:from-rose-400/10 midnight:from-rose-400/10 purple:from-pink-400/10 pointer-events-none" />
      <div className="relative px-3 py-2.5 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-pink-900/30">
            <CreditCard className="w-4 h-4 text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-pink-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Fees Reminder</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/parents/fees"
            className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
          <DashboardDragHandle />
        </div>
      </div>
      <div className="relative flex-1 px-3 py-2.5 flex flex-col justify-between gap-2">
        {reminders.map((fee) => (
          <div
            key={fee.id}
            className={`group relative flex flex-col p-2.5 rounded-xl border transition-all duration-200 hover:shadow-md ${
              fee.status === "overdue"
                ? "bg-gradient-to-r from-red-50/80 to-white dark:from-red-900/20 dark:to-gray-700/10 midnight:from-red-900/20 midnight:to-gray-800/20 purple:from-red-900/20 purple:to-gray-800/20 border-red-200 dark:border-red-700/30 midnight:border-red-700/20 purple:border-red-700/20 hover:border-red-300 dark:hover:border-red-500/40"
                : "bg-gradient-to-r from-amber-50/80 to-white dark:from-amber-900/20 dark:to-gray-700/10 midnight:from-amber-900/20 midnight:to-gray-800/20 purple:from-amber-900/20 purple:to-gray-800/20 border-amber-200 dark:border-amber-700/30 midnight:border-amber-700/20 purple:border-amber-700/20 hover:border-amber-300 dark:hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate">{fee.feeType}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5">{fee.childName}</p>
              </div>
              <span
                className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                  fee.status === "overdue"
                    ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400"
                    : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
                }`}
              >
                {fee.status === "overdue" ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {fee.status === "overdue" ? "Overdue" : "Due"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-auto">
              <div>
                <p className={`text-lg font-bold ${fee.status === "overdue" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>
                  {formatCurrency(fee.amount, countryCode)}
                </p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 flex items-center gap-1">
                  <CalendarDays className="w-2.5 h-2.5" /> Due: {formatShortDate(fee.dueDate)}
                </p>
              </div>
              <Button
                size="sm"
                className={`text-[10px] px-3 py-1.5 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${
                  fee.status === "overdue"
                    ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                Pay Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MessagesCard({ messages }: { messages: ParentMessage[] }) {
  const unreadCount = messages.filter((m) => m.unread).length;
  return (
    <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/5 via-transparent to-transparent dark:from-teal-400/10 midnight:from-teal-400/10 purple:from-pink-400/10 pointer-events-none" />
      <div className="relative px-3 py-2.5 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-pink-900/30">
            <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-pink-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Messages</span>
          {unreadCount > 0 && (
            <span className="text-[9px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 px-1.5 py-0.5 rounded-full shadow-sm animate-pulse min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/parents/messages"
            className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
          <DashboardDragHandle />
        </div>
      </div>
      <div className="relative flex-1 px-3 py-2.5 flex flex-col justify-between gap-2">
        {messages.map((msg) => (
          <Link
            key={msg.id}
            href={`/parents/messages/${msg.id}`}
            className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-x-0.5 ${
              msg.unread
                ? "bg-gradient-to-r from-teal-50/80 to-white dark:from-teal-900/20 dark:to-gray-700/10 midnight:from-teal-900/20 midnight:to-gray-800/20 purple:from-teal-900/20 purple:to-gray-800/20 border-teal-100 dark:border-teal-700/30 midnight:border-teal-700/20 purple:border-teal-700/20 hover:border-teal-300 dark:hover:border-teal-500/40"
                : "bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-700/20 dark:to-gray-700/10 midnight:from-gray-800/30 midnight:to-gray-800/20 purple:from-gray-800/30 purple:to-gray-800/20 border-gray-100 dark:border-gray-700/30 midnight:border-gray-700/20 purple:border-gray-700/20 hover:border-gray-200 dark:hover:border-gray-600/40"
            }`}
          >
            <div className={`flex-shrink-0 w-2 h-2 rounded-full ${msg.unread ? "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-sm" : "bg-transparent"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {msg.subject}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 truncate">
                {msg.from} • {msg.time}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all duration-200" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function NoticeBoardCard({ notices }: { notices: NoticeItem[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/50 midnight:border-gray-700/30 purple:border-gray-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 midnight:from-amber-900/40 midnight:to-orange-900/40 purple:from-amber-900/40 purple:to-orange-900/40 shadow-sm">
            <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Notice Board</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/parents/notices" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-0.5">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
          <DashboardDragHandle />
        </div>
      </div>
      <div className="p-2">
        {notices.slice(0, 3).map((notice, index) => (
          <Link
            key={notice.id}
            href={`/parents/notices/${notice.id}`}
            className={`block p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 dark:hover:from-amber-900/10 dark:hover:to-orange-900/10 midnight:hover:from-amber-900/10 midnight:hover:to-orange-900/10 purple:hover:from-amber-900/10 purple:hover:to-orange-900/10 transition-all duration-200 group ${index !== 2 ? "mb-1" : ""}`}
          >
            <div className="flex items-start gap-3">
              {notice.isNew && <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mt-1.5 flex-shrink-0 shadow-sm animate-pulse" />}
              <div className={`flex-1 min-w-0 ${!notice.isNew ? "pl-5" : ""}`}>
                <p className="text-xs font-semibold text-gray-800 dark:text-white midnight:text-gray-100 purple:text-gray-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {notice.title}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" /> {formatShortDate(notice.date)}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function QuickLinksCard({ selectedChildId }: { selectedChildId: string }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />
      <div className="relative px-3 py-2.5 flex items-center justify-between gap-2.5 border-b border-gray-100/50 dark:border-gray-700/30 midnight:border-gray-700/30 purple:border-gray-700/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-pink-900/30 shadow-sm">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Quick Links</h4>
        </div>
        <DashboardDragHandle />
      </div>
      <div className="relative flex-1 px-3 py-2.5 flex flex-col justify-between gap-2">
        <Link
          href={`/parents/children/${selectedChildId}/report-card`}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 midnight:from-blue-900/20 midnight:to-indigo-900/10 purple:from-blue-900/20 purple:to-indigo-900/10 border border-blue-100/50 dark:border-blue-800/30 midnight:border-blue-800/20 purple:border-blue-800/20 hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-md hover:-translate-x-0.5 transition-all duration-200 group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 midnight:bg-gray-800/80 purple:bg-gray-800/80 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            View Report Card
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
        <Link
          href={`/parents/children/${selectedChildId}/attendance`}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-purple-50/80 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/10 midnight:from-purple-900/20 midnight:to-pink-900/10 purple:from-pink-900/20 purple:to-purple-900/10 border border-purple-100/50 dark:border-purple-800/30 midnight:border-purple-800/20 purple:border-pink-800/20 hover:border-purple-300 dark:hover:border-purple-700/50 hover:shadow-md hover:-translate-x-0.5 transition-all duration-200 group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 midnight:bg-gray-800/80 purple:bg-gray-800/80 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <CalendarCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-indigo-400 purple:text-pink-400" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            View Attendance
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
        <Link
          href="/parents/messages"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 midnight:from-green-900/20 midnight:to-emerald-900/10 purple:from-green-900/20 purple:to-emerald-900/10 border border-green-100/50 dark:border-green-800/30 midnight:border-green-800/20 purple:border-green-800/20 hover:border-green-300 dark:hover:border-green-700/50 hover:shadow-md hover:-translate-x-0.5 transition-all duration-200 group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 midnight:bg-gray-800/80 purple:bg-gray-800/80 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Send className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            Messages
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-green-500 dark:group-hover:text-green-400 group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
      </div>
    </div>
  );
}


