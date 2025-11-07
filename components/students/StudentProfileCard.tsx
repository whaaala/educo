"use client";

import Image from "next/image";
import type { ExtendedStudentData } from "@/lib/mockStudents";

interface StudentProfileCardProps {
  studentData: ExtendedStudentData;
  fullName: string;
  profilePhotoUrl: string | null;
  onAddFees?: () => void;
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

export default function StudentProfileCard({
  studentData,
  fullName,
  profilePhotoUrl,
  onAddFees,
}: StudentProfileCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-300/70 dark:hover:border-gray-700/70 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40">
      {/* Profile Header with gradient background */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-gray-800/40 dark:to-gray-900/40 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 p-3 sm:p-6 pb-4 sm:pb-8">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 dark:bg-blue-400/5 midnight:bg-cyan-400/5 purple:bg-pink-400/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/5 dark:bg-indigo-400/5 midnight:bg-blue-400/5 purple:bg-purple-400/5 rounded-full -ml-12 -mb-12"></div>

        <div className="relative flex items-center gap-2.5 sm:gap-4">
          {/* Profile Picture with enhanced styling */}
          <div className="relative flex-shrink-0">
            {profilePhotoUrl ? (
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden ring-2 sm:ring-4 ring-white/50 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg sm:shadow-xl">
                <Image
                  src={profilePhotoUrl}
                  alt={fullName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center ring-2 sm:ring-4 ring-white/50 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg sm:shadow-xl">
                <span className="text-xl sm:text-3xl font-bold text-white">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name and Details */}
          <div className="flex flex-col justify-center gap-1 sm:gap-1.5 flex-1 min-w-0">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 w-fit px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 rounded-md sm:rounded-lg border border-green-300/60 dark:border-green-700/50 midnight:border-green-600/50 purple:border-green-600/50 shadow-sm">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 dark:bg-green-400 midnight:bg-green-400 purple:bg-green-400 animate-pulse"></div>
              <span className="text-[10px] sm:text-xs font-semibold text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300 uppercase tracking-wide">
                {studentData.status || "Active"}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 tracking-tight truncate leading-tight">
              {fullName}
            </h2>

            {/* Admission Number */}
            <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 tracking-wide">
              {studentData.admissionNumber}
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
          {/* Roll No */}
          {studentData.rollNumber && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Roll No</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.rollNumber}</span>
            </div>
          )}

          {/* Gender */}
          {studentData.gender && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Gender</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.gender}</span>
            </div>
          )}

          {/* Date Of Birth */}
          {studentData.dateOfBirth && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Date Of Birth</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {formatDate(studentData.dateOfBirth)}
              </span>
            </div>
          )}

          {/* Blood Group */}
          {studentData.bloodGroup && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Blood Group</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.bloodGroup}</span>
            </div>
          )}

          {/* Religion */}
          {studentData.religion && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Religion</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.religion}</span>
            </div>
          )}

          {/* Caste */}
          {studentData.caste && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Caste</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.caste}</span>
            </div>
          )}

          {/* Category */}
          {studentData.category && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Category</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.category}</span>
            </div>
          )}

          {/* Mother tongue */}
          {studentData.motherTongue && (
            <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Mother tongue</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.motherTongue}</span>
            </div>
          )}

          {/* Language */}
          <div className="flex justify-between items-start py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 pt-0.5 sm:pt-1">Language</span>
            <div className="flex gap-1 sm:gap-1.5 flex-wrap justify-end">
              {Array.isArray(studentData.languagesKnown) && studentData.languagesKnown.length > 0 ? (
                studentData.languagesKnown.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 border border-blue-200/50 dark:border-blue-800/50 midnight:border-cyan-800/50 purple:border-pink-800/50"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">-</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Fees Button */}
      {onAddFees && (
        <div className="p-3 sm:p-6 pt-0">
          <button
            onClick={onAddFees}
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Add Fees
          </button>
        </div>
      )}
    </div>
  );
}

