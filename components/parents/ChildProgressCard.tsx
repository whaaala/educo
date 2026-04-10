"use client";

import Link from "next/link";
import { ChevronRight, TrendingUp, Award, CalendarCheck, BookOpen } from "lucide-react";

interface SubjectGrade {
  subject: string;
  score: number;
  grade: string;
  trend: "up" | "down" | "stable";
}

interface ChildProgressCardProps {
  childName: string;
  childId: string;
  termAverage: number;
  classPosition: number;
  totalStudents: number;
  attendanceRate: number;
  conductGrade: string;
  recentGrades: SubjectGrade[];
}

export default function ChildProgressCard({
  childName,
  childId,
  termAverage,
  classPosition,
  totalStudents,
  attendanceRate,
  conductGrade,
  recentGrades,
}: ChildProgressCardProps) {
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") {
      return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
    }
    if (trend === "down") {
      return <TrendingUp className="w-3.5 h-3.5 text-red-500 rotate-180" />;
    }
    return <span className="w-3.5 h-3.5 text-gray-400 text-center">-</span>;
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A" || grade === "A+") {
      return "from-green-500 to-emerald-600";
    }
    if (grade === "B" || grade === "B+") {
      return "from-blue-500 to-indigo-600";
    }
    if (grade === "C" || grade === "C+") {
      return "from-yellow-500 to-orange-600";
    }
    return "from-red-500 to-rose-600";
  };

  return (
    <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Academic Progress - {childName}
          </h3>
        </div>
        <Link
          href={`/parents/children/${childId}`}
          className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-1 font-medium"
        >
          View Details <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/30">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Term Average
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
            {termAverage}%
          </p>
        </div>
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border border-green-200/50 dark:border-green-800/30">
          <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
            Class Position
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
            {classPosition}<span className="text-sm font-normal text-green-500">/{totalStudents}</span>
          </p>
        </div>
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200/50 dark:border-purple-800/30">
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Attendance
          </p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
            {attendanceRate}%
          </p>
        </div>
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Conduct
          </p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
            {conductGrade}
          </p>
        </div>
      </div>

      {/* Recent Grades */}
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Recent Grades
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentGrades.map((grade, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/60 dark:border-gray-700/40"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradeColor(grade.grade)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {grade.grade}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">
                    {grade.subject}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {grade.score}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(grade.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex gap-3">
          <Link
            href={`/parents/children/${childId}/report-card`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200/50 dark:border-blue-800/30"
          >
            <Award className="w-4 h-4" />
            Report Card
          </Link>
          <Link
            href={`/parents/children/${childId}/attendance`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400 font-medium text-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-200/50 dark:border-purple-800/30"
          >
            <CalendarCheck className="w-4 h-4" />
            Attendance
          </Link>
        </div>
      </div>
    </div>
  );
}
