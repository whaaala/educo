"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";
import {
  Users,
  MapPin,
  BookOpen,
  Calendar,
  TrendingUp,
  Target,
  Building2,
  GraduationCap,
  Edit,
  Eye,
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
  faculty?: string;
  department?: string;
  programme?: string;
  courseLevel?: string;
  semester?: string;
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

interface ClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassData;
  educationLevel: "Primary" | "Secondary" | "Tertiary";
}

export default function ClassDetailsModal({
  isOpen,
  onClose,
  classData,
  educationLevel,
}: ClassDetailsModalProps) {
  const router = useRouter();
  const isTertiary = educationLevel === "Tertiary";
  const primaryTeacher = classData.classTeacher || classData.teachers?.[0];

  const handleViewFullDetails = () => {
    router.push(`/classes/${classData.id}`);
    onClose();
  };

  const handleEdit = () => {
    router.push(`/classes/edit/${classData.id}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={classData.name}
      subtitle={classData.id}
      icon={<BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
      maxWidth="3xl"
    >
      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {/* Status and Term Info */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
              classData.status === "Active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : classData.status === "Inactive"
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                classData.status === "Active"
                  ? "bg-green-500"
                  : classData.status === "Inactive"
                  ? "bg-red-500"
                  : "bg-orange-500"
              }`}
            />
            {classData.status}
          </div>

          {isTertiary && classData.programme && (
            <span className="px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              {classData.programme}
            </span>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {isTertiary ? classData.semester : classData.term} • {classData.academicYear}
            </span>
          </div>
        </div>

        {/* Tertiary: Faculty & Department */}
        {isTertiary && (classData.faculty || classData.department) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-[#22262e]/30 rounded-xl">
            {classData.faculty && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Faculty</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {classData.faculty}
                  </p>
                </div>
              </div>
            )}
            {classData.department && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {classData.department}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Teacher Information */}
        {primaryTeacher && (
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-700/10 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {isTertiary ? "Course Coordinator" : "Class Teacher"}
            </h4>
            <div className="flex items-center gap-4">
              <img
                src={primaryTeacher.image}
                alt={primaryTeacher.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {primaryTeacher.name}
                </p>
                {primaryTeacher.subject && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {primaryTeacher.subject}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isTertiary ? "Enrolled" : "Students"}
              </p>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {isTertiary ? classData.students : `${classData.students}/${classData.capacity}`}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isTertiary ? "Venue" : "Room"}
              </p>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{classData.room}</p>
          </div>

          {classData.averageGrade !== undefined && (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Avg Grade</p>
              </div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {classData.averageGrade}%
              </p>
            </div>
          )}

          {classData.attendanceRate !== undefined && (
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Attendance</p>
              </div>
              <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                {classData.attendanceRate}%
              </p>
            </div>
          )}
        </div>

        {/* Subjects/Courses List */}
        {classData.subjects && classData.subjects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {isTertiary ? "Courses" : "Subjects"} ({classData.subjects.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classData.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-[#22262e]/30 rounded-lg flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {subject.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {subject.teacher.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        {classData.schedule && (
          <div className="p-4 bg-gray-50 dark:bg-[#22262e]/30 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Schedule
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{classData.schedule}</p>
          </div>
        )}

        {/* Enabled Features */}
        {classData.enabledFeatures && Object.values(classData.enabledFeatures).some((v) => v) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Enabled Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {classData.enabledFeatures.lms && (
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  LMS
                </span>
              )}
              {classData.enabledFeatures.digitalDiary && (
                <span className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                  Digital Diary
                </span>
              )}
              {classData.enabledFeatures.transport && (
                <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  Transport
                </span>
              )}
              {classData.enabledFeatures.hostel && (
                <span className="px-3 py-1 text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full">
                  Hostel
                </span>
              )}
              {classData.enabledFeatures.rfid && (
                <span className="px-3 py-1 text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full">
                  RFID
                </span>
              )}
              {classData.enabledFeatures.onlineClasses && (
                <span className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full">
                  Online Classes
                </span>
              )}
              {classData.enabledFeatures.library && (
                <span className="px-3 py-1 text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full">
                  Library
                </span>
              )}
              {classData.enabledFeatures.gradebook && (
                <span className="px-3 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full">
                  Gradebook
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1d24]/50">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Class
          </button>
          <button
            onClick={handleViewFullDetails}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Full Details
          </button>
        </div>
      </div>
    </Modal>
  );
}
