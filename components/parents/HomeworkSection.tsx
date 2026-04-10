"use client";

import Link from "next/link";
import { ChevronRight, BookOpen, Clock } from "lucide-react";

interface Homework {
  id: string;
  subject: string;
  subjectColor: "purple" | "green" | "blue" | "orange" | "red" | "cyan";
  description: string;
  teacher: string;
  dueDate: string;
}

interface HomeworkSectionProps {
  homework: Homework[];
  viewAllLink?: string;
}

export default function HomeworkSection({
  homework,
  viewAllLink = "/parents/homework",
}: HomeworkSectionProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const getSubjectColor = (color: Homework["subjectColor"]) => {
    const colors = {
      purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
      green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
      red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400",
    };
    return colors[color];
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
            <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Homework
          </h3>
        </div>
        <Link
          href={viewAllLink}
          className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-1 font-medium"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Homework List */}
      <div className="p-4 space-y-3">
        {homework.length === 0 ? (
          <div className="text-center py-6">
            <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No homework assigned</p>
          </div>
        ) : (
          homework.map((hw) => {
            const daysUntilDue = getDaysUntilDue(hw.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0;

            return (
              <div
                key={hw.id}
                className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/60 dark:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getSubjectColor(hw.subjectColor)}`}
                  >
                    {hw.subject}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-2 line-clamp-2">
                  {hw.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {hw.teacher}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Clock className={`w-3.5 h-3.5 ${
                      isOverdue ? "text-red-500" : isDueSoon ? "text-orange-500" : "text-gray-400"
                    }`} />
                    <span className={`text-xs font-medium ${
                      isOverdue
                        ? "text-red-600 dark:text-red-400"
                        : isDueSoon
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {isOverdue
                        ? "Overdue"
                        : daysUntilDue === 0
                        ? "Due Today"
                        : `Due ${formatDate(hw.dueDate)}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
