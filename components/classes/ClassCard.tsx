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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const isTertiary = educationLevel === "Tertiary";
  const primaryTeacher = classData.classTeacher || classData.teachers?.[0];

  // Determine terminology based on education level
  const teacherLabel = isTertiary ? "Coordinator" : "Class Teacher";
  const studentsLabel = isTertiary ? "Enrolled" : "Students";
  const roomLabel = isTertiary ? "Venue" : "Room";

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetailsModal(true);
  };

  return (
    <>
      <div
        className="group relative block bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden"
      >
        {/* Status Badge & Arrow - Top Right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              classData.status === "Active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : classData.status === "Inactive"
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                classData.status === "Active"
                  ? "bg-green-500"
                  : classData.status === "Inactive"
                  ? "bg-red-500"
                  : "bg-orange-500"
              }`}
            />
            {classData.status}
          </div>

          {/* Clickable Arrow */}
          <button
            onClick={handleViewDetails}
            className="p-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-full transition-all duration-200 cursor-pointer group/arrow"
            title="View Details"
          >
            <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/arrow:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Header: Checkbox + Class Code & Name */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {onSelectionChange && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectionChange(classData.id, e.target.checked);
                  }}
                  className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-wide">
                {classData.id}
              </span>
              {isTertiary && classData.programme && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                  {classData.programme}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 mb-1">
              {classData.name}
            </h3>
            {isTertiary ? (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                {classData.faculty && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {classData.faculty}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {classData.term} • {classData.academicYear}
              </p>
            )}
          </div>

          {/* Teacher/Coordinator Info */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 midnight:bg-gray-800/30 purple:bg-gray-800/30 rounded-lg">
            {primaryTeacher ? (
              <div className="flex items-center gap-3">
                <img
                  src={primaryTeacher.image}
                  alt={primaryTeacher.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    {teacherLabel}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {primaryTeacher.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    {teacherLabel}
                  </p>
                  <p className="text-sm font-medium text-gray-400">Not Assigned</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Students Count */}
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {studentsLabel}
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {isTertiary ? classData.students : `${classData.students}/${classData.capacity}`}
                </p>
              </div>
            </div>

            {/* Room/Venue */}
            <div className="flex items-center gap-2 p-2.5 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">{roomLabel}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {classData.room}
                </p>
              </div>
            </div>
          </div>

          {/* Subjects/Courses - Compact */}
          {classData.subjects && classData.subjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {classData.subjects.length} {isTertiary ? "Courses" : "Subjects"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {classData.subjects.slice(0, 2).map((subject) => (
                  <span
                    key={subject.name}
                    className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {subject.name}
                  </span>
                ))}
                {classData.subjects.length > 2 && (
                  <span className="px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                    +{classData.subjects.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
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
