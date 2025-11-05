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
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-5">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          {profilePhotoUrl ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-1 ring-gray-200/50 dark:ring-gray-700/50 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-sm">
              <Image
                src={profilePhotoUrl}
                alt={fullName}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center ring-1 ring-gray-200/50 dark:ring-gray-700/50 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-sm">
              <span className="text-2xl font-bold text-white">
                {fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Name and Details */}
        <div className="flex flex-col h-20 justify-center gap-1 flex-1 min-w-0">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1 w-fit px-2 py-0.5 bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 rounded-md border border-green-200/60 dark:border-green-800/40 midnight:border-green-700/40 purple:border-green-700/40">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 midnight:bg-green-400 purple:bg-green-400"></div>
            <span className="text-xs font-medium text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400">
              {studentData.status || "Active"}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 tracking-tight truncate leading-tight">
            {fullName}
          </h2>

          {/* Admission Number */}
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
            {studentData.admissionNumber}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-5"></div>

      {/* Basic Information */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
          Basic Information
        </h3>
        <div className="space-y-3.5">
          {/* Roll No */}
          {studentData.rollNumber && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">Roll No</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.rollNumber}</span>
            </div>
          )}

          {/* Gender */}
          {studentData.gender && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">Gender</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.gender}</span>
            </div>
          )}

          {/* Date Of Birth */}
          {studentData.dateOfBirth && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">Date Of Birth</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {formatDate(studentData.dateOfBirth)}
              </span>
            </div>
          )}

          {/* Blood Group */}
          {studentData.bloodGroup && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">Blood Group</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.bloodGroup}</span>
            </div>
          )}

          {/* Religion */}
          {studentData.religion && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">Religion</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.religion}</span>
            </div>
          )}

          {/* Caste */}
          {studentData.caste && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">Caste</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.caste}</span>
            </div>
          )}

          {/* Category */}
          {studentData.category && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">Category</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.category}</span>
            </div>
          )}

          {/* Mother tongue */}
          {studentData.motherTongue && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">Mother tongue</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{studentData.motherTongue}</span>
            </div>
          )}

          {/* Language */}
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80 pt-0.5">Language</span>
            <div className="flex gap-2 flex-wrap justify-end">
              {Array.isArray(studentData.languagesKnown) && studentData.languagesKnown.length > 0 ? (
                studentData.languagesKnown.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-gray-100 dark:bg-gray-800/60 midnight:bg-gray-800/60 purple:bg-gray-800/60"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">-</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Fees Button */}
      {onAddFees && (
        <button
          onClick={onAddFees}
          className="w-full mt-5 px-4 py-2.5 bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white rounded-lg font-medium text-sm shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 midnight:hover:bg-cyan-700 purple:hover:bg-pink-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          Add Fees
        </button>
      )}
    </div>
  );
}

