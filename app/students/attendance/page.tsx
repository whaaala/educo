"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/shared/Button";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import SearchBar from "@/components/shared/SearchBar";
import PageLoader from "@/components/shared/PageLoader";
import Tooltip from "@/components/shared/Tooltip";
import Modal from "@/components/shared/Modal";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useAttendance } from "@/contexts/AttendanceContext";
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
  ChevronLeft,
  ChevronRight,
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
  HALFDAY: "halfday",
  HOLIDAY: "holiday",
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
  lateMinutes?: number; // How many minutes late
}

// Mock student data - Using real student IDs from the system
const MOCK_STUDENTS: Student[] = [
  { id: "AD9892302", name: "Aaliyah Griffin", class: "JSS 1", section: "A", rollNo: "35020", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "AD9892434", name: "Janet Daniel", class: "JSS 1", section: "A", rollNo: "35013", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "AD9892433", name: "Joann Michael", class: "JSS 2", section: "B", rollNo: "35012", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "AD9892432", name: "Carol Davis", class: "JSS 1", section: "A", rollNo: "35011", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: "AD9892431", name: "David Miller", class: "JSS 1", section: "A", rollNo: "35010", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "AD9892430", name: "Emma Wilson", class: "JSS 1", section: "A", rollNo: "35009", avatar: "https://i.pravatar.cc/150?img=6" },
  { id: "AD9892429", name: "Frank Moore", class: "JSS 1", section: "A", rollNo: "35008", avatar: "https://i.pravatar.cc/150?img=7" },
  { id: "AD9892428", name: "Grace Taylor", class: "JSS 1", section: "A", rollNo: "35007", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: "AD9892427", name: "Henry Anderson", class: "JSS 1", section: "A", rollNo: "35006", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: "AD9892426", name: "Isabella Martinez", class: "JSS 1", section: "A", rollNo: "35005", avatar: "https://i.pravatar.cc/150?img=10" },
];

export default function AttendancePage() {
  const { settings } = useSchoolSettings();
  const isPageLoading = usePageLoad(600);
  const { saveAttendance: saveToContext, getAttendanceByDate } = useAttendance();

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

  // Load attendance data when date, class, or section changes
  useEffect(() => {
    if (selectedDate && selectedClass) {
      const savedRecords = getAttendanceByDate(selectedDate);
      const relevantRecords = savedRecords.filter(
        (record) =>
          record.class === selectedClass &&
          (!selectedSection || record.section === selectedSection)
      );

      const recordsMap = new Map<string, AttendanceRecord>();
      relevantRecords.forEach((record) => {
        recordsMap.set(record.studentId, {
          studentId: record.studentId,
          status: record.status,
          lateMinutes: record.lateMinutes,
          remarks: record.remarks,
        });
      });
      setAttendance(recordsMap);
    }
  }, [selectedDate, selectedClass, selectedSection, getAttendanceByDate]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Late duration modal state
  const [lateModalOpen, setLateModalOpen] = useState(false);
  const [selectedLateStudent, setSelectedLateStudent] = useState<string | null>(null);
  const [lateMinutes, setLateMinutes] = useState<number>(15);

  // Search animation state
  const [isSearching, setIsSearching] = useState(false);

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setCurrentPage(1);
  };

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    // If marking as late, open modal to get duration
    if (status === ATTENDANCE_STATUS.LATE) {
      setSelectedLateStudent(studentId);
      setLateModalOpen(true);
      return;
    }

    // For other statuses, set directly
    setAttendance((prev) => {
      const newAttendance = new Map(prev);
      newAttendance.set(studentId, { studentId, status });
      return newAttendance;
    });
  };

  const handleConfirmLate = () => {
    if (selectedLateStudent) {
      setAttendance((prev) => {
        const newAttendance = new Map(prev);
        newAttendance.set(selectedLateStudent, {
          studentId: selectedLateStudent,
          status: ATTENDANCE_STATUS.LATE,
          lateMinutes,
        });
        return newAttendance;
      });
      setLateModalOpen(false);
      setSelectedLateStudent(null);
      setLateMinutes(15); // Reset to default
    }
  };

  const handleCancelLate = () => {
    setLateModalOpen(false);
    setSelectedLateStudent(null);
    setLateMinutes(15); // Reset to default
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

    // Prepare attendance records with full information
    const recordsToSave = Array.from(attendance.values()).map((record) => {
      const student = MOCK_STUDENTS.find((s) => s.id === record.studentId);
      return {
        studentId: record.studentId,
        status: record.status,
        date: selectedDate,
        lateMinutes: record.lateMinutes,
        remarks: record.remarks,
        class: student?.class || selectedClass,
        section: student?.section || selectedSection,
      };
    });

    // Save to context (which syncs to localStorage)
    saveToContext(recordsToSave);

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
    const headers = ["Student ID", "Name", "Roll No", "Class", "Section", "Status", "Late Duration (min)", "Date"];
    const rows = filteredStudents.map((student) => {
      const record = attendance.get(student.id);
      const status = record?.status || "Unmarked";
      const lateInfo = record?.status === ATTENDANCE_STATUS.LATE && record?.lateMinutes
        ? record.lateMinutes.toString()
        : "";
      return [
        student.id,
        student.name,
        student.rollNo,
        selectedClass,
        selectedSection || "N/A",
        status.charAt(0).toUpperCase() + status.slice(1),
        lateInfo,
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
      halfday: 0,
      holiday: 0,
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
                  onChange={handleClassChange}
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
                  onChange={handleSectionChange}
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
                    onChange={handleSearchChange}
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
                    <Tooltip content="Mark all students as present">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllPresent}
                        className="flex-1 sm:flex-none gap-2"
                      >
                        <Check className="w-4 h-4" />
                        All Present
                      </Button>
                    </Tooltip>
                    <Tooltip content="Mark all students as absent">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllAbsent}
                        className="flex-1 sm:flex-none gap-2"
                      >
                        <X className="w-4 h-4" />
                        All Absent
                      </Button>
                    </Tooltip>
                    <Tooltip content="Clear all attendance marks">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="flex-1 sm:flex-none gap-2"
                      >
                        <RefreshCcw className="w-4 h-4" />
                        Reset
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {paginatedStudents.map((student, index) => {
                    const record = attendance.get(student.id);
                    const currentStatus = record?.status;

                    return (
                      <div
                        key={student.id}
                        className="group relative bg-gradient-to-r from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-md overflow-hidden"
                        style={{
                          animation: isSearching
                            ? `fadeSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s both`
                            : `slideIn 0.3s ease-out ${index * 0.05}s both`
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
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Roll No: <span className="font-medium">{student.rollNo}</span>
                                  </p>
                                  {currentStatus === ATTENDANCE_STATUS.LATE && record?.lateMinutes && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                                      <Clock className="w-3 h-3" />
                                      {record.lateMinutes} min late
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Attendance Buttons */}
                          <div className="flex gap-2">
                            {/* Present Button */}
                            <Tooltip content="Mark as Present">
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
                              >
                                <CircleCheckBig className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                                  currentStatus === ATTENDANCE_STATUS.PRESENT ? "scale-110" : "group-hover/btn:scale-110"
                                }`} />
                                {currentStatus === ATTENDANCE_STATUS.PRESENT && (
                                  <div className="absolute inset-0 rounded-lg bg-white/20 animate-ping"></div>
                                )}
                              </button>
                            </Tooltip>

                            {/* Absent Button */}
                            <Tooltip content="Mark as Absent">
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
                              >
                                <CircleX className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                                  currentStatus === ATTENDANCE_STATUS.ABSENT ? "scale-110" : "group-hover/btn:scale-110"
                                }`} />
                                {currentStatus === ATTENDANCE_STATUS.ABSENT && (
                                  <div className="absolute inset-0 rounded-lg bg-white/20 animate-ping"></div>
                                )}
                              </button>
                            </Tooltip>

                            {/* Late Button */}
                            <Tooltip content="Mark as Late">
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
                              >
                                <Clock className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                                  currentStatus === ATTENDANCE_STATUS.LATE ? "scale-110" : "group-hover/btn:scale-110"
                                }`} />
                                {currentStatus === ATTENDANCE_STATUS.LATE && (
                                  <div className="absolute inset-0 rounded-lg bg-white/20 animate-ping"></div>
                                )}
                              </button>
                            </Tooltip>
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

                @keyframes fadeSlideIn {
                  from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                  }
                }
              `}</style>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/30">
                  <div className="flex items-center justify-between">
                    <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden md:inline">Previous</span>
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                                  currentPage === page
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 text-neutral-400">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="hidden md:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

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

      {/* Late Duration Modal */}
      <Modal isOpen={lateModalOpen} onClose={handleCancelLate}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Mark Student as Late
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {selectedLateStudent && MOCK_STUDENTS.find(s => s.id === selectedLateStudent)?.name}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              How many minutes late?
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[5, 10, 15, 20, 30, 45].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => setLateMinutes(minutes)}
                  className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    lateMinutes === minutes
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="180"
                value={lateMinutes}
                onChange={(e) => setLateMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                placeholder="Enter custom minutes"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 dark:text-neutral-400">
                minutes
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancelLate}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLate}
              className="flex-1 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              Confirm Late
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
