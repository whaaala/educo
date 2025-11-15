"use client";

import { useState } from "react";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/shared/Button";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import SearchBar from "@/components/shared/SearchBar";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  UserCheck,
  Calendar,
  GraduationCap,
  BookOpen,
  Users,
  CircleCheckBig,
  CircleX,
  Clock,
  Download,
  Save,
  RefreshCcw,
  Check,
  X,
} from "lucide-react";
// Education level types and data
type EducationLevel = "Primary" | "Secondary" | "Tertiary";

const PRIMARY_CLASSES = [
  "Nursery 1", "Nursery 2", "KG 1", "KG 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"
];

const SECONDARY_CLASSES = [
  "JSS 1", "JSS 2", "JSS 3",
  "SSS 1", "SSS 2", "SSS 3"
];

const TERTIARY_CLASSES = [
  "100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "600 Level"
];

const getClassesByLevel = (level: EducationLevel): string[] => {
  switch (level) {
    case "Primary":
      return PRIMARY_CLASSES;
    case "Secondary":
      return SECONDARY_CLASSES;
    case "Tertiary":
      return TERTIARY_CLASSES;
    default:
      return SECONDARY_CLASSES;
  }
};

const SECTIONS = ["A", "B", "C", "D", "E"];

const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXCUSED: "excused",
} as const;

type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  avatar?: string;
}

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

// Mock student data
const MOCK_STUDENTS: Student[] = [
  { id: "STD001", name: "Alice Johnson", class: "JSS 1", section: "A", rollNo: "001", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "STD002", name: "Bob Williams", class: "JSS 1", section: "A", rollNo: "002", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "STD003", name: "Carol Davis", class: "JSS 1", section: "A", rollNo: "003", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "STD004", name: "David Miller", class: "JSS 1", section: "A", rollNo: "004", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: "STD005", name: "Emma Wilson", class: "JSS 1", section: "A", rollNo: "005", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "STD006", name: "Frank Moore", class: "JSS 1", section: "A", rollNo: "006", avatar: "https://i.pravatar.cc/150?img=6" },
  { id: "STD007", name: "Grace Taylor", class: "JSS 1", section: "A", rollNo: "007", avatar: "https://i.pravatar.cc/150?img=7" },
  { id: "STD008", name: "Henry Anderson", class: "JSS 1", section: "A", rollNo: "008", avatar: "https://i.pravatar.cc/150?img=8" },
];

export default function AttendancePage() {
  const { settings } = useSchoolSettings();
  const isPageLoading = usePageLoad(600);

  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    settings.supportedLevels[0] || "Secondary"
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(
    new Map()
  );
  const [isSaving, setIsSaving] = useState(false);

  // Filter students based on class and section
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesSection = !selectedSection || student.section === selectedSection;
    const matchesSearch =
      !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery);
    return matchesClass && matchesSection && matchesSearch;
  });

  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setAttendance((prev) => {
      const newAttendance = new Map(prev);
      newAttendance.set(studentId, { studentId, status });
      return newAttendance;
    });
  };

  const handleMarkAllPresent = () => {
    const newAttendance = new Map(attendance);
    filteredStudents.forEach((student) => {
      newAttendance.set(student.id, {
        studentId: student.id,
        status: ATTENDANCE_STATUS.PRESENT,
      });
    });
    setAttendance(newAttendance);
  };

  const handleMarkAllAbsent = () => {
    const newAttendance = new Map(attendance);
    filteredStudents.forEach((student) => {
      newAttendance.set(student.id, {
        studentId: student.id,
        status: ATTENDANCE_STATUS.ABSENT,
      });
    });
    setAttendance(newAttendance);
  };

  const handleReset = () => {
    setAttendance(new Map());
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert("Attendance saved successfully!");
  };

  const handleExport = () => {
    if (filteredStudents.length === 0) {
      alert("No students to export!");
      return;
    }

    // Create CSV content
    const headers = ["Student ID", "Name", "Roll No", "Class", "Section", "Status", "Date"];
    const rows = filteredStudents.map((student) => {
      const record = attendance.get(student.id);
      const status = record?.status || "Unmarked";
      return [
        student.id,
        student.name,
        student.rollNo,
        selectedClass,
        selectedSection || "N/A",
        status.charAt(0).toUpperCase() + status.slice(1),
        new Date(selectedDate).toLocaleDateString(),
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${selectedClass}_${selectedDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAttendanceStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      unmarked: filteredStudents.length,
    };

    attendance.forEach((record) => {
      if (filteredStudents.some((s) => s.id === record.studentId)) {
        stats[record.status]++;
        stats.unmarked--;
      }
    });

    return stats;
  };

  const stats = getAttendanceStats();

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Attendance" />

      <div
        className={`transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <PageHeader
          title="Student Attendance"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Students", href: "/students" },
            { label: "Attendance", isActive: true },
          ]}
        />

        <div className="space-y-6 mt-6">
          {/* Configuration Section */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-visible">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Attendance Configuration
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Select class, section, and date to mark attendance
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <div
                className={`grid grid-cols-1 ${
                  settings.supportsMultipleLevels
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : "sm:grid-cols-3"
                } gap-4 sm:gap-5`}
              >
                {/* Education Level - Only for multi-level schools */}
                {settings.supportsMultipleLevels && (
                  <FormDropdown
                    label="Education Level"
                    icon={<GraduationCap className="w-full h-full" />}
                    iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                    value={educationLevel}
                    onChange={(value) => {
                      setEducationLevel(value as EducationLevel);
                      setSelectedClass("");
                      setSelectedSection("");
                    }}
                    options={settings.supportedLevels.map((level) => ({
                      value: level,
                      label: level,
                    }))}
                    required
                  />
                )}

                {/* Class */}
                <FormDropdown
                  label="Class"
                  icon={<BookOpen className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30"
                  iconColor="text-green-600 dark:text-green-400"
                  value={selectedClass}
                  onChange={(value) => setSelectedClass(value)}
                  options={[
                    { value: "", label: "Select class..." },
                    ...getClassesByLevel(educationLevel).map((cls) => ({
                      value: cls,
                      label: cls,
                    })),
                  ]}
                  placeholder="Select class..."
                  required
                />

                {/* Section */}
                <FormDropdown
                  label="Section"
                  icon={<Users className="w-full h-full" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400"
                  value={selectedSection}
                  onChange={(value) => setSelectedSection(value)}
                  options={[
                    { value: "", label: "All sections" },
                    ...SECTIONS.map((section) => ({
                      value: section,
                      label: `Section ${section}`,
                    })),
                  ]}
                  placeholder="All sections"
                />

                {/* Date */}
                <FormInput
                  label="Date"
                  icon={<Calendar className="w-full h-full" />}
                  iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                  iconColor="text-amber-600 dark:text-amber-400"
                  type="date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                />
              </div>

              {/* Search Bar */}
              {selectedClass && (
                <div className="mt-4">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by name or roll number..."
                    size="md"
                    fullWidth
                  />
                </div>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          {selectedClass && filteredStudents.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Total Card */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50 p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-0.5">
                    Total Students
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {filteredStudents.length}
                  </p>
                </div>
              </div>

              {/* Present Card */}
              <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700/50 p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-800/30 rounded-lg">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="px-1.5 py-0.5 bg-green-100 dark:bg-green-800/30 rounded-full">
                      <p className="text-[10px] sm:text-xs font-semibold text-green-700 dark:text-green-300">
                        {filteredStudents.length > 0 ? Math.round((stats.present / filteredStudents.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-0.5">
                    Present
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">
                    {stats.present}
                  </p>
                </div>
              </div>

              {/* Absent Card */}
              <div className="group relative bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl border border-red-200 dark:border-red-700/50 p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-red-100 dark:bg-red-800/30 rounded-lg">
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="px-1.5 py-0.5 bg-red-100 dark:bg-red-800/30 rounded-full">
                      <p className="text-[10px] sm:text-xs font-semibold text-red-700 dark:text-red-300">
                        {filteredStudents.length > 0 ? Math.round((stats.absent / filteredStudents.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-0.5">
                    Absent
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300">
                    {stats.absent}
                  </p>
                </div>
              </div>

              {/* Late Card */}
              <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50 p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-800/30 rounded-full">
                      <p className="text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300">
                        {filteredStudents.length > 0 ? Math.round((stats.late / filteredStudents.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-0.5">
                    Late
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {stats.late}
                  </p>
                </div>
              </div>

              {/* Unmarked Card */}
              <div className="group relative bg-gradient-to-br from-neutral-50 to-gray-50 dark:from-neutral-800/50 dark:to-gray-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-neutral-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
                      <UserCheck className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-full">
                      <p className="text-[10px] sm:text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        {filteredStudents.length > 0 ? Math.round((stats.unmarked / filteredStudents.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-0.5">
                    Unmarked
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                    {stats.unmarked}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Marking Section */}
          {selectedClass && filteredStudents.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Mark Attendance
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {selectedClass}
                      {selectedSection && ` - Section ${selectedSection}`} •{" "}
                      {new Date(selectedDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllPresent}
                      className="flex-1 sm:flex-none gap-2"
                    >
                      <Check className="w-4 h-4" />
                      All Present
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllAbsent}
                      className="flex-1 sm:flex-none gap-2"
                    >
                      <X className="w-4 h-4" />
                      All Absent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="flex-1 sm:flex-none gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {filteredStudents.map((student, index) => {
                    const record = attendance.get(student.id);
                    const currentStatus = record?.status;

                    return (
                      <div
                        key={student.id}
                        className="group relative bg-gradient-to-r from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-md overflow-hidden"
                        style={{
                          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                        }}
                      >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/30 group-hover:to-pink-50/30 dark:group-hover:from-purple-900/10 dark:group-hover:to-pink-900/10 transition-all duration-300 pointer-events-none"></div>

                        <div className="relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                          {/* Student Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 sm:gap-4">
                              {/* Student Avatar */}
                              <div className="relative flex-shrink-0">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-2 ring-purple-500/30 shadow-lg group-hover:scale-110 group-hover:ring-purple-500/50 transition-all duration-300">
                                  {student.avatar ? (
                                    <Image
                                      src={student.avatar}
                                      alt={student.name}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                      {student.rollNo}
                                    </div>
                                  )}
                                </div>
                                {/* Status indicator dot */}
                                {currentStatus && (
                                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 ${
                                    currentStatus === ATTENDANCE_STATUS.PRESENT
                                      ? "bg-green-500 animate-pulse"
                                      : currentStatus === ATTENDANCE_STATUS.ABSENT
                                      ? "bg-red-500"
                                      : currentStatus === ATTENDANCE_STATUS.LATE
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                  }`}></div>
                                )}
                              </div>

                              {/* Student Details */}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 truncate group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                  {student.name}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                  Roll No: <span className="font-medium">{student.rollNo}</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Attendance Buttons */}
                          <div className="flex gap-2">
                            {/* Present Button */}
                            <button
                              onClick={() =>
                                handleAttendanceChange(
                                  student.id,
                                  ATTENDANCE_STATUS.PRESENT
                                )
                              }
                              className={`group/btn relative p-2.5 sm:p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                currentStatus === ATTENDANCE_STATUS.PRESENT
                                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-110"
                                  : "bg-white dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 hover:scale-105"
                              }`}
                              title="Mark Present"
                            >
                              <CircleCheckBig className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                                currentStatus === ATTENDANCE_STATUS.PRESENT ? "scale-110" : "group-hover/btn:scale-110"
                              }`} />
                              {currentStatus === ATTENDANCE_STATUS.PRESENT && (
                                <div className="absolute inset-0 rounded-lg bg-white/20 animate-ping"></div>
                              )}
                            </button>

                            {/* Absent Button */}
                            <button
                              onClick={() =>
                                handleAttendanceChange(
                                  student.id,
                                  ATTENDANCE_STATUS.ABSENT
                                )
                              }
                              className={`group/btn relative p-2.5 sm:p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                currentStatus === ATTENDANCE_STATUS.ABSENT
                                  ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-110"
                                  : "bg-white dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:scale-105"
                              }`}
                              title="Mark Absent"
                            >
                              <CircleX className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                                currentStatus === ATTENDANCE_STATUS.ABSENT ? "scale-110" : "group-hover/btn:scale-110"
                              }`} />
                              {currentStatus === ATTENDANCE_STATUS.ABSENT && (
                                <div className="absolute inset-0 rounded-lg bg-white/20 animate-ping"></div>
                              )}
                            </button>

                            {/* Late Button */}
                            <button
                              onClick={() =>
                                handleAttendanceChange(
                                  student.id,
                                  ATTENDANCE_STATUS.LATE
                                )
                              }
                              className={`group/btn relative p-2.5 sm:p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                currentStatus === ATTENDANCE_STATUS.LATE
                                  ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-110"
                                  : "bg-white dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 hover:scale-105"
                              }`}
                              title="Mark Late"
                            >
                              <Clock className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                                currentStatus === ATTENDANCE_STATUS.LATE ? "scale-110" : "group-hover/btn:scale-110"
                              }`} />
                              {currentStatus === ATTENDANCE_STATUS.LATE && (
                                <div className="absolute inset-0 rounded-lg bg-white/20 animate-ping"></div>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <style jsx>{`
                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>

              {/* Action Buttons */}
              <div className="bg-neutral-50 dark:bg-neutral-900/50 px-4 sm:px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="w-full sm:w-auto gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button
                    onClick={handleSaveAttendance}
                    disabled={isSaving || attendance.size === 0}
                    className="w-full sm:w-auto gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Attendance"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedClass && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
              <UserCheck className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Select Class to Mark Attendance
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Choose a class and section from the configuration above to start
                marking attendance
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
