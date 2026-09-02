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
import TruncateTooltip from "@/components/shared/TruncateTooltip";

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
        <div className="group relative bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 hover:bg-gradient-to-br hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 dark:hover:bg-[#22262e]/90 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-blue-400/30 midnight:hover:shadow-cyan-400/30 purple:hover:shadow-pink-400/30 hover:border-purple-300/60 dark:hover:border-blue-400/50 midnight:hover:border-cyan-400/50 purple:hover:border-pink-400/50 h-[420px] flex flex-col group-has-[:hover.group\\/avatar]:blur-[6px]">
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
              <TruncateTooltip content={classData.id}>
                <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 transition-colors duration-200 truncate">
                  {classData.id}
                </span>
              </TruncateTooltip>
              {isTertiary && classData.semester && (
                <span className="text-[0.625rem] font-medium text-gray-600 dark:text-gray-400 bg-white/70 dark:bg-[#22262e]/50 px-2 py-0.5 rounded-md border border-gray-200/50 dark:border-gray-600/50 whitespace-nowrap flex-shrink-0">
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
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
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
              <div
                className="relative cursor-pointer group/avatar flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Avatar clicked", classData.id);
                }}
              >
                {adviserImage ? (
                  <img
                    src={adviserImage}
                    alt={primaryTeacher?.name || 'Adviser'}
                    className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                    style={{ position: 'relative', transformOrigin: 'center center' }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-500 purple:from-pink-400 purple:via-purple-500 purple:to-pink-600 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                    style={{ position: 'relative', transformOrigin: 'center center' }}
                  >
                    <span className="text-white text-base font-semibold">
                      {getInitials(primaryTeacher?.name || classData.name)}
                    </span>
                  </div>
                )}

                {/* Hover Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
              </div>

              {/* Class Name */}
              <div className="flex-1 min-w-0">
                <TruncateTooltip content={classData.name}>
                  <h3 className="text-base font-bold text-ink group-hover:text-black truncate">
                    {classData.name}
                  </h3>
                </TruncateTooltip>
                {isTertiary ? (
                  <div className="space-y-0.5 min-h-[34px]">
                    {classData.programme && (
                      <TruncateTooltip content={classData.programme}>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                          {classData.programme}
                        </p>
                      </TruncateTooltip>
                    )}
                    {(classData.faculty || classData.department) && (
                      <div className="flex items-center gap-1.5 text-[0.6875rem] text-gray-500 dark:text-gray-400">
                        <Building2 className="w-3 h-3 flex-shrink-0 text-gray-400" />
                        <TruncateTooltip content={`${classData.faculty}${classData.faculty && classData.department ? " • " : ""}${classData.department}`}>
                          <span className="truncate">
                            {classData.faculty}
                            {classData.faculty && classData.department && " • "}
                            {classData.department}
                          </span>
                        </TruncateTooltip>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-h-[34px]">
                    <TruncateTooltip content={`${classData.term} • ${classData.academicYear}`}>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                        {classData.term} • {classData.academicYear}
                      </p>
                    </TruncateTooltip>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-1 relative z-0">
            {/* Teacher Info */}
            <div className="group/detail flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-[#22262e]/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 group-hover:bg-white/95 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/25 purple:group-hover:bg-pink-500/25 transition-all duration-200 border border-white/40 group-hover:border-white/60">
              <span className="text-[0.625rem] font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors uppercase tracking-wider flex-shrink-0">
                {teacherLabel}
              </span>
              <TruncateTooltip content={primaryTeacher?.name || "Not Assigned"}>
                <span className="text-sm font-bold text-ink group-hover:text-black ml-3 truncate min-w-0">
                  {primaryTeacher?.name || "Not Assigned"}
                </span>
              </TruncateTooltip>
            </div>

            {/* Students */}
            <div className="group/detail flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-[#22262e]/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 group-hover:bg-white/95 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/25 purple:group-hover:bg-pink-500/25 transition-all duration-200 border border-white/40 group-hover:border-white/60">
              <TruncateTooltip content={studentsLabel}>
                <span className="text-[0.625rem] font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors uppercase tracking-wider truncate">
                  {studentsLabel}
                </span>
              </TruncateTooltip>
              <span className="text-sm font-bold text-ink group-hover:text-black ml-3 flex-shrink-0">
                {isTertiary ? classData.students : `${classData.students}/${classData.capacity}`}
              </span>
            </div>

            {/* Room/Courses */}
            <div className="group/detail flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-[#22262e]/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 group-hover:bg-white/95 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/25 purple:group-hover:bg-pink-500/25 transition-all duration-200 border border-white/40 group-hover:border-white/60">
              <TruncateTooltip content={isTertiary ? coursesLabel : "ROOM"}>
                <span className="text-[0.625rem] font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors uppercase tracking-wider truncate">
                  {isTertiary ? coursesLabel : "ROOM"}
                </span>
              </TruncateTooltip>
              <span className="text-sm font-bold text-ink group-hover:text-black ml-3 flex-shrink-0">
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
                          ? 'bg-white/70 backdrop-blur-sm dark:bg-[#22262e]/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 border border-white/40 dark:border-gray-600/40 midnight:border-cyan-500/30 purple:border-pink-500/30 group-hover:bg-white/90 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/20 purple:group-hover:bg-pink-500/20'
                          : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      {subject && (
                        <>
                          <BookOpen className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-purple-400/50" />
                          <TruncateTooltip content={subject.name}>
                            <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300 truncate">
                              {subject.name}
                            </span>
                          </TruncateTooltip>
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
