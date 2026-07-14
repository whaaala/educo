"use client";

import Image from "next/image";
import { Briefcase, User } from "lucide-react";
import { Teacher } from "@/lib/mockTeachers";

interface StaffProfileCardProps {
  staffData: Teacher;
  fullName: string;
}

// Helper function to format date from YYYY-MM-DD to "25 Jan 2008"
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

export default function StaffProfileCard({ staffData, fullName }: StaffProfileCardProps) {
  const profilePhotoUrl = staffData.imageUrl;

  const getStatusColor = (status: string) => {
    if (status === "Active") {
      return {
        bg: "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
        border: "border-green-300/60 dark:border-green-700/50 midnight:border-green-600/50 purple:border-green-600/50",
        text: "text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300",
        dot: "bg-green-500 dark:bg-green-400 midnight:bg-green-400 purple:bg-green-400",
      };
    } else if (status === "On Leave") {
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30",
        border: "border-yellow-300/60 dark:border-yellow-700/50 midnight:border-yellow-600/50 purple:border-yellow-600/50",
        text: "text-yellow-700 dark:text-yellow-300 midnight:text-yellow-300 purple:text-yellow-300",
        dot: "bg-yellow-500 dark:bg-yellow-400 midnight:bg-yellow-400 purple:bg-yellow-400",
      };
    } else if (status === "Suspended") {
      return {
        bg: "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30",
        border: "border-orange-300/60 dark:border-orange-700/50 midnight:border-orange-600/50 purple:border-orange-600/50",
        text: "text-orange-700 dark:text-orange-300 midnight:text-orange-300 purple:text-orange-300",
        dot: "bg-orange-500 dark:bg-orange-400 midnight:bg-orange-400 purple:bg-orange-400",
      };
    } else {
      return {
        bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
        border: "border-red-300/60 dark:border-red-700/50 midnight:border-red-600/50 purple:border-red-600/50",
        text: "text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300",
        dot: "bg-red-500 dark:bg-red-400 midnight:bg-red-400 purple:bg-red-400",
      };
    }
  };

  const getRoleColor = (role: string) => {
    if (role === "Teacher") {
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
        border: "border-blue-300/60 dark:border-blue-700/50 midnight:border-cyan-700/50 purple:border-pink-700/50",
        text: "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300",
        icon: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
      };
    } else if (role === "Lecturer") {
      return {
        bg: "bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30",
        border: "border-purple-300/60 dark:border-purple-700/50 midnight:border-purple-700/50 purple:border-purple-700/50",
        text: "text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-purple-300",
        icon: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
      };
    } else if (role === "Admin") {
      return {
        bg: "bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30",
        border: "border-green-300/60 dark:border-green-700/50 midnight:border-emerald-700/50 purple:border-emerald-700/50",
        text: "text-green-700 dark:text-green-300 midnight:text-emerald-300 purple:text-emerald-300",
        icon: "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
      };
    } else if (role === "Management") {
      return {
        bg: "bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
        border: "border-amber-300/60 dark:border-amber-700/50 midnight:border-amber-700/50 purple:border-amber-700/50",
        text: "text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300",
        icon: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
      };
    } else {
      return {
        bg: "bg-gray-100 dark:bg-[#1a1d24]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30",
        border: "border-gray-300/60 dark:border-gray-700/50 midnight:border-gray-700/50 purple:border-gray-700/50",
        text: "text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300",
        icon: "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
      };
    }
  };

  const statusColors = getStatusColor(staffData.employmentStatus);
  const roleColors = getRoleColor(staffData.role);

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Profile Header with gradient background */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-gray-800/40 dark:to-gray-900/40 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 p-3 sm:p-6 pb-4 sm:pb-8">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 dark:bg-blue-400/5 midnight:bg-cyan-400/5 purple:bg-pink-400/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/5 dark:bg-indigo-400/5 midnight:bg-blue-400/5 purple:bg-purple-400/5 rounded-full -ml-12 -mb-12"></div>

        <div className="relative flex items-center gap-2 sm:gap-3">
          {/* Profile Picture with enhanced styling */}
          <div className="relative flex-shrink-0">
            {profilePhotoUrl ? (
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden ring-2 ring-white/50 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg">
                <Image
                  src={profilePhotoUrl}
                  alt={fullName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center ring-2 ring-white/50 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg">
                <span className="text-lg sm:text-2xl font-bold text-white">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name and Details */}
          <div className="flex flex-col justify-center gap-0.5 sm:gap-1 flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-1 w-fit px-1.5 sm:px-2 py-0.5 rounded-md border shadow-sm ${statusColors.bg} ${statusColors.border}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} animate-pulse`}></div>
                <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide ${statusColors.text}`}>
                  {staffData.employmentStatus}
                </span>
              </div>

              {/* Role Badge */}
              <div className={`inline-flex items-center gap-1 w-fit px-1.5 sm:px-2 py-0.5 rounded-md border shadow-sm ${roleColors.bg} ${roleColors.border}`}>
                <Briefcase className={`w-2.5 h-2.5 ${roleColors.icon}`} />
                <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide ${roleColors.text}`}>
                  {staffData.role}
                </span>
              </div>
            </div>

            {/* Name */}
            <h2 className="text-xs sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 tracking-tight truncate leading-tight">
              {fullName}
            </h2>

            {/* Staff ID */}
            <p className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 tracking-wide truncate">
              {staffData.staffId}
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="p-3 sm:p-6 pt-0 mt-3 sm:mt-6">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2 sm:mb-4 uppercase tracking-wider">
          Basic Information
        </h3>
        <div className="space-y-1.5 sm:space-y-3">
          {/* Employee Number */}
          {staffData.staffId && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Employee ID</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{staffData.staffId}</span>
            </div>
          )}

          {/* Gender */}
          {staffData.gender && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Gender</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{staffData.gender}</span>
            </div>
          )}

          {/* Date Of Birth */}
          {staffData.dateOfBirth && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Date Of Birth</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {formatDate(staffData.dateOfBirth)}
              </span>
            </div>
          )}

          {/* Department */}
          {staffData.department && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Department</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{staffData.department}</span>
            </div>
          )}

          {/* Employment Type */}
          {staffData.employmentType && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Employment Type</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{staffData.employmentType}</span>
            </div>
          )}

          {/* Join Date */}
          {staffData.joinDate && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Join Date</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {formatDate(staffData.joinDate)}
              </span>
            </div>
          )}

          {/* Experience */}
          {staffData.experience !== undefined && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Experience</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{staffData.experience} years</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
