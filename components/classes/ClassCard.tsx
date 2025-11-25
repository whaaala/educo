"use client";

import Link from "next/link";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  Users,
  MapPin,
  TrendingUp,
  Target,
  BookOpen,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

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
  teachers?: Teacher[];
  subjects?: Subject[];
  students: number;
  capacity: number;
  room: string;
  averageGrade: number;
  attendanceRate: number;
  term: string;
  academicYear: string;
  stream?: string;
  // Tertiary-specific fields
  faculty?: string; // Engineering, Sciences, Arts, etc.
  department?: string; // Computer Science, Electrical Engineering, etc.
  programme?: string; // B.Sc, B.Eng, ND, HND, NCE, etc.
  courseLevel?: string; // 100L, 200L, ND1, ND2, etc.
  semester?: string; // First Semester, Second Semester
}

interface ClassCardProps {
  classData: ClassData;
  educationLevel: "Primary" | "Secondary" | "Tertiary";
  onClick?: () => void;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export default function ClassCard({
  classData,
  educationLevel,
  onClick,
  isSelected = false,
  onSelectionChange,
}: ClassCardProps) {
  const { settings } = useSchoolSettings();
  const isTertiary = educationLevel === "Tertiary";
  const hasMultipleTeachers =
    classData.teachers && classData.teachers.length > 1;
  const primaryTeacher = classData.teachers?.[0];

  // Determine terminology based on tenant settings and education level
  const teacherLabel = isTertiary ? "Lecturer" : "Teacher";
  const teachersLabel = isTertiary ? "Lecturers" : "Teachers";
  const studentsLabel = isTertiary ? "Students" : "Students"; // Could be "Learners" in some regions
  const roomLabel = isTertiary ? "Hall/Lab" : "Room";

  // Format term display based on education level
  const termDisplay = classData.term;

  return (
    <Link
      href={`/classes/${classData.id}`}
      onClick={onClick}
      className="group relative block bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-4">
        {/* Header: Class ID + Status badge + Arrow (matching StudentCard design) */}
        <div className="relative px-0 pt-0 pb-1 flex items-center justify-between mb-3 z-10">
          <div className="flex items-center gap-2">
            {onSelectionChange && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectionChange(classData.id, e.target.checked);
                }}
                className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 transition-colors duration-200">
              {classData.id}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
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
                />
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
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors" />
          </div>
        </div>

        {/* Class name + Stream/Programme */}
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
            {classData.name}
          </h3>
          {isTertiary && classData.programme && (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">
              {classData.programme}
            </span>
          )}
          {!isTertiary && classData.stream && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              {classData.stream}
            </span>
          )}
        </div>

        {/* Tertiary: Faculty & Department OR Regular: Term & Year */}
        {isTertiary ? (
          <div className="flex flex-col gap-1 mb-3">
            {classData.faculty && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Faculty:</span> {classData.faculty}
              </p>
            )}
            {classData.department && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Department:</span> {classData.department}
              </p>
            )}
            {classData.semester && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {classData.semester} • {classData.academicYear}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {classData.term} • {classData.academicYear}
          </p>
        )}

        {/* Teacher/Lecturer Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-700/10 midnight:from-gray-800/50 midnight:to-gray-800/20 purple:from-gray-800/50 purple:to-gray-800/20 rounded-lg p-3 mb-3">
          {isTertiary ? (
            // Tertiary: Show subject count
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Subjects
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {classData.subjects?.length || 0} Subjects
                  </p>
                </div>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">
                View {teachersLabel} →
              </span>
            </div>
          ) : hasMultipleTeachers ? (
            // Primary/Secondary: Multiple teachers
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {classData.teachers?.slice(0, 3).map((teacher, idx) => (
                    <img
                      key={teacher.id}
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-md object-cover"
                      style={{ zIndex: 3 - idx }}
                    />
                  ))}
                  {classData.teachers && classData.teachers.length > 3 && (
                    <div className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                      +{classData.teachers.length - 3}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Class {teachersLabel}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {classData.teachers?.length || 0} {teachersLabel}
                  </p>
                </div>
              </div>
            </div>
          ) : primaryTeacher ? (
            // Primary/Secondary: Single teacher
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={primaryTeacher.image}
                  alt={primaryTeacher.name}
                  className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-700 shadow-md object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Class {teacherLabel}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {primaryTeacher.name}
                </p>
              </div>
            </div>
          ) : (
            // No teacher assigned
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Class {teacherLabel}
                </p>
                <p className="text-sm font-medium text-gray-400">
                  Not Assigned
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row: Students + Room/Hall */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10 rounded-lg p-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTertiary ? "Enrolled" : studentsLabel}
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {isTertiary ? classData.students : `${classData.students}/${classData.capacity}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10 rounded-lg p-2">
            <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{roomLabel}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {classData.room}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics: Grade + Attendance */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 dark:bg-green-900/10 midnight:bg-green-500/10 purple:bg-green-500/10 rounded-lg p-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Avg Grade
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {classData.averageGrade}%
              </p>
            </div>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/10 midnight:bg-cyan-500/10 purple:bg-cyan-500/10 rounded-lg p-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Attendance
              </p>
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                {classData.attendanceRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Subjects footer - show for all education levels */}
        {classData.subjects && classData.subjects.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-1.5">
              {classData.subjects.slice(0, 3).map((subject) => (
                <span
                  key={subject.name}
                  className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {subject.name}
                </span>
              ))}
              {classData.subjects.length > 3 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                  +{classData.subjects.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
