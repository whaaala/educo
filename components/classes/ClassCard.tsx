"use client";

import { useState } from "react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  Users,
  MapPin,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Building2,
} from "lucide-react";
import ClassDetailsModal from "./ClassDetailsModal";

interface Teacher {
  id: string;
  name: string;
  image: string;
  subject?: string;
}

interface Subject {
  name: string;
  teacher: Teacher;
}

interface ClassData {
  id: string;
  name: string;
  level: "Primary" | "Secondary" | "Junior Secondary" | "Tertiary";
  section?: string;
  subjects?: Subject[];
  teachers?: Teacher[];
  students: number;
  capacity: number;
  room: string;
  schedule?: string;
  academicYear: string;
  term?: string;
  status?: "Active" | "Inactive" | "Archived";
  averageGrade?: number;
  attendanceRate?: number;
  stream?: string;
  // Tertiary-specific fields
  faculty?: string;
  department?: string;
  programme?: string;
  courseLevel?: string;
  semester?: string;
  // New fields from master list
  branch?: string;
  classTeacher?: Teacher;
  maxStudents?: number;
  enabledFeatures?: {
    lms?: boolean;
    digitalDiary?: boolean;
    transport?: boolean;
    hostel?: boolean;
    rfid?: boolean;
    onlineClasses?: boolean;
    library?: boolean;
    gradebook?: boolean;
  };
  transportZone?: string;
  hostelEligibility?: boolean;
}

const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

interface ClassCardProps {
  classData: ClassData;
  educationLevel: "Primary" | "Secondary" | "Tertiary";
  onClick?: () => void;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  adviserImage?: string;
}

export default function ClassCard({
  classData,
  educationLevel,
  onClick,
  isSelected = false,
  onSelectionChange,
  adviserImage,
}: ClassCardProps) {
  const { settings } = useSchoolSettings();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const isTertiary = educationLevel === "Tertiary";
  const isPrimary = educationLevel === "Primary";

  // For tertiary, get level adviser (not class teacher)
  // For non-tertiary, get class teacher
  const primaryTeacher = isTertiary
    ? (classData as any).levelAdviser
    : classData.classTeacher || classData.teachers?.[0];

  // Determine terminology based on education level
  const teacherLabel = isTertiary ? "Level Adviser" : "Class Teacher";
  const studentsLabel = isTertiary ? "Enrolled Students" : "Students";
  const coursesLabel = isTertiary ? "Courses" : "Subjects";

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetailsModal(true);
  };

  return (
    <>
      <div className="relative group/card">
        <div className="group relative bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 hover:bg-gradient-to-br hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 dark:hover:bg-gray-800/90 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-blue-400/30 midnight:hover:shadow-cyan-400/30 purple:hover:shadow-pink-400/30 hover:border-purple-300/60 dark:hover:border-blue-400/50 midnight:hover:border-cyan-400/50 purple:hover:border-pink-400/50 h-[420px] flex flex-col">
          {/* Gradient Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-pink-500/5 dark:from-blue-400/15 dark:via-purple-400/8 dark:to-pink-400/15 midnight:from-cyan-400/15 midnight:via-purple-400/8 midnight:to-cyan-400/15 purple:from-pink-400/15 purple:via-purple-400/8 purple:to-pink-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

          {/* Animated Border Glow */}
          <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 dark:from-blue-400/40 dark:via-purple-400/40 dark:to-pink-400/40 midnight:from-cyan-400/40 midnight:via-purple-400/40 midnight:to-cyan-400/40 purple:from-pink-400/40 purple:via-purple-400/40 purple:to-pink-400/40 blur-md -z-10" />

          {/* Card Header */}
          <div className="relative px-4 pt-2 pb-0.5 flex items-center justify-between gap-4 z-10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {onSelectionChange && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectionChange(classData.id, e.target.checked);
                  }}
                  className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 transition-colors duration-200 truncate">
                {classData.id}
              </span>
              {isTertiary && classData.semester && (
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 bg-white/70 dark:bg-gray-700/50 px-2 py-0.5 rounded-md border border-gray-200/50 dark:border-gray-600/50 whitespace-nowrap flex-shrink-0">
                  {classData.semester}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-300 ${
                  classData.status === "Active"
                    ? "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30"
                    : classData.status === "Inactive"
                    ? "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30"
                    : "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      classData.status === "Active"
                        ? "bg-green-500"
                        : classData.status === "Inactive"
                        ? "bg-red-500"
                        : "bg-orange-500"
                    }`}
                  ></span>
                </span>
                <span
                  className={`text-xs font-bold ${
                    classData.status === "Active"
                      ? "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400"
                      : classData.status === "Inactive"
                      ? "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                      : "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400"
                  }`}
                >
                  {classData.status}
                </span>
              </div>

              <button
                onClick={handleViewDetails}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
                title="View Details"
              >
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 midnight:hover:text-cyan-400 purple:hover:text-pink-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Class Info with Avatar */}
          <div className="px-6 pt-6 pb-4 flex flex-col h-full">
            <div className="flex items-start gap-3 mb-4">
              {/* Avatar */}
              <div className="relative group/avatar flex-shrink-0">
                {/* Avatar Image */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200/60 dark:border-purple-400/30 midnight:border-cyan-400/30 purple:border-pink-400/30 group-hover/card:border-purple-400/80 dark:group-hover/card:border-purple-400/60 midnight:group-hover/card:border-cyan-400/60 purple:group-hover/card:border-pink-400/60 transition-all duration-300 group-hover/card:shadow-lg group-hover/card:shadow-purple-500/30 dark:group-hover/card:shadow-purple-400/40 midnight:group-hover/card:shadow-cyan-400/40 purple:group-hover/card:shadow-pink-400/40">
                  {adviserImage ? (
                    <img
                      src={adviserImage}
                      alt={primaryTeacher?.name || 'Adviser'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-500 purple:from-pink-400 purple:via-purple-500 purple:to-pink-600 flex items-center justify-center">
                      <span className="text-white text-base font-semibold">
                        {getInitials(primaryTeacher?.name || classData.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-blue-400/40 dark:from-purple-400/60 dark:via-pink-400/60 dark:to-blue-400/60 midnight:from-cyan-400/60 midnight:via-purple-400/60 midnight:to-cyan-500/60 purple:from-pink-400/60 purple:via-purple-400/60 purple:to-pink-500/60 opacity-0 group-hover/card:opacity-100 blur-md transition-opacity duration-300 -z-10" />
              </div>

              {/* Class Name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 group-hover:text-black truncate">
                  {classData.name}
                </h3>
                {isTertiary ? (
                  <div className="space-y-0.5 min-h-[34px]">
                    {classData.programme && (
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                        {classData.programme}
                      </p>
                    )}
                    {(classData.faculty || classData.department) && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                        <Building2 className="w-3 h-3 flex-shrink-0 text-gray-400" />
                        <span className="truncate">
                          {classData.faculty}
                          {classData.faculty && classData.department && " • "}
                          {classData.department}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-h-[34px]">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                      {classData.term} • {classData.academicYear}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-1 relative z-0">
            {/* Teacher Info */}
            <div className="group/detail flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-gray-700/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 group-hover:bg-white/95 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/25 purple:group-hover:bg-pink-500/25 transition-all duration-200 border border-white/40 group-hover:border-white/60">
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors uppercase tracking-wider flex-shrink-0">
                {teacherLabel}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 group-hover:text-black ml-3 truncate min-w-0">
                {primaryTeacher?.name || "Not Assigned"}
              </span>
            </div>

            {/* Students */}
            <div className="group/detail flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-gray-700/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 group-hover:bg-white/95 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/25 purple:group-hover:bg-pink-500/25 transition-all duration-200 border border-white/40 group-hover:border-white/60">
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors uppercase tracking-wider truncate">
                {studentsLabel}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 group-hover:text-black ml-3 flex-shrink-0">
                {isTertiary ? classData.students : `${classData.students}/${classData.capacity}`}
              </span>
            </div>

            {/* Room/Courses */}
            <div className="group/detail flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-gray-700/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 group-hover:bg-white/95 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/25 purple:group-hover:bg-pink-500/25 transition-all duration-200 border border-white/40 group-hover:border-white/60">
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors uppercase tracking-wider truncate">
                {isTertiary ? coursesLabel : "ROOM"}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 group-hover:text-black ml-3 flex-shrink-0">
                {isTertiary ? classData.subjects?.length || 0 : classData.room}
              </span>
            </div>
            </div>

            {/* Courses/Subjects Preview - Always render for consistent spacing */}
            <div className="border-t border-white/40 group-hover:border-white/60 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 mt-2 pt-2 pb-3 relative z-10 transition-all duration-200">
              {/* Always render header for consistency */}
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-purple-400/50" />
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 uppercase tracking-wide">
                  {isTertiary ? 'Semester Courses' : 'Subjects'}
                </h4>
              </div>

              {/* Always render exactly 3 slots + "+X more" area */}
              <div className="space-y-2">
                {[0, 1, 2].map((index) => {
                  const subject = classData.subjects?.[index];
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-3 rounded-lg transition-colors h-[30px] ${
                        subject
                          ? 'bg-white/70 backdrop-blur-sm dark:bg-gray-700/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 border border-white/40 dark:border-gray-600/40 midnight:border-cyan-500/30 purple:border-pink-500/30 group-hover:bg-white/90 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/20 purple:group-hover:bg-pink-500/20'
                          : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      {subject && (
                        <>
                          <BookOpen className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-purple-400/50" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300 truncate">
                            {subject.name}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Always render "+X more" container for consistent spacing */}
                <div className="flex items-center justify-center h-6">
                  {classData.subjects && classData.subjects.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 font-medium">
                      +{classData.subjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Flex Spacer */}
            <div className="flex-1" />
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <ClassDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        classData={classData}
        educationLevel={educationLevel}
      />
    </>
  );
}
