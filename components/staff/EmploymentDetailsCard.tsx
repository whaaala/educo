"use client";

import { Briefcase, Calendar, Building2 } from "lucide-react";
import { EmploymentType, EmploymentStatus } from "@/lib/mockTeachers";

interface EmploymentDetailsCardProps {
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  joinDate: string;
  department: string;
}

export default function EmploymentDetailsCard({
  employmentType,
  employmentStatus,
  joinDate,
  department,
}: EmploymentDetailsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-gray-200/40 dark:border-[#1a1d24]/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
        </div>
        <h3 className="text-base font-bold text-ink">
          Employment Details
        </h3>
      </div>

      <div className="space-y-4">
        {/* Employment Type */}
        <div className="flex items-start gap-3">
          <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-0.5">
              Employment Type
            </p>
            <p className="text-sm font-semibold text-ink">
              {employmentType}
            </p>
          </div>
        </div>

        {/* Department */}
        <div className="flex items-start gap-3">
          <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-0.5">
              Department
            </p>
            <p className="text-sm font-semibold text-ink">
              {department}
            </p>
          </div>
        </div>

        {/* Join Date */}
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-0.5">
              Join Date
            </p>
            <p className="text-sm font-semibold text-ink">
              {formatDate(joinDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
