"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, GraduationCap, MoreVertical, Eye } from "lucide-react";

interface ExamResult {
  id: string;
  studentName: string;
  studentPhoto: string;
  class: string;
  section: string;
  percentage: number;
  examType: string;
  status: "pass" | "fail";
}

interface ExamResultsSectionProps {
  results: ExamResult[];
  viewAllLink?: string;
  onViewResult?: (resultId: string) => void;
}

export default function ExamResultsSection({
  results,
  viewAllLink = "/parents/results",
  onViewResult,
}: ExamResultsSectionProps) {
  return (
    <div className="bg-surface rounded-xl border border-line shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <h3 className="font-semibold text-ink">
            Exam Results
          </h3>
        </div>
        <Link
          href={viewAllLink}
          className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-1 font-medium"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Student
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Class
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Percentage
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Exam
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {results.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <GraduationCap className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No exam results available</p>
                </td>
              </tr>
            ) : (
              results.map((result) => (
                <tr
                  key={result.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#22262e]/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-[#2a2d35] flex-shrink-0">
                        <Image
                          src={result.studentPhoto}
                          alt={result.studentName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-sm font-medium text-ink">
                        {result.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {result.class} - {result.section}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-[#22262e] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            result.percentage >= 70
                              ? "bg-green-500"
                              : result.percentage >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {result.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {result.examType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        result.status === "pass"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {result.status === "pass" ? "Pass" : "Fail"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onViewResult?.(result.id)}
                        className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
