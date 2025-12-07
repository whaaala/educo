"use client";

import { useState, useEffect, useMemo } from "react";
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
import AbsenceReasonModal, { AbsenceFormData } from "@/components/shared/AbsenceReasonModal";
import BulkAbsenceReasonModal, { BulkAbsenceStudent, BulkAbsenceFormData } from "@/components/shared/BulkAbsenceReasonModal";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings, EducationLevel } from "@/contexts/SchoolSettingsContext";
import { useAttendance, ABSENCE_REASONS, AbsenceReason } from "@/contexts/AttendanceContext";
import { useUser } from "@/contexts/UserContext";
import { PeriodConfig } from "@/types/school";
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
  FileQuestion,
  CheckCircle,
  User,
  UserCog,
  Building2,
  Moon,
  Sun,
  AlertTriangle,
} from "lucide-react";

// Education level classes configuration
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

// Helper to determine if a student's class belongs to a specific education level
const isClassInEducationLevel = (studentClass: string, level: EducationLevel): boolean => {
  const primaryClasses = PRIMARY_CLASSES;
  const secondaryClasses = SECONDARY_CLASSES;
  const tertiaryClasses = TERTIARY_CLASSES;

  switch (level) {
    case "Primary":
      return primaryClasses.includes(studentClass);
    case "Secondary":
      return secondaryClasses.includes(studentClass);
    case "Tertiary":
      return tertiaryClasses.includes(studentClass);
    default:
      return false;
  }
};

// Default sections - can be overridden by tenant config
const DEFAULT_SECTIONS = ["A", "B", "C", "D", "E"];

// Get terminology based on institution type and education level
const getTerminology = (institutionType: string, educationLevel: EducationLevel) => {
  const isTertiary = educationLevel === "Tertiary";
  const isInternational = institutionType === "International";

  return {
    staffRole: isTertiary ? "Lecturer" : (isInternational ? "Teacher" : "Teacher"),
    staffRoleTA: isTertiary ? "Teaching Assistant" : "Teaching Assistant",
    class: isTertiary ? "Level" : "Class",
    section: isTertiary ? "Department" : "Section",
    student: isTertiary ? "Student" : "Student",
    period: isTertiary ? "Lecture Period" : "Period",
  };
};

// Staff roles for taking attendance
type StaffRole = "lecturer" | "teaching_assistant";

interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  department?: string;
}

// Period/Lesson definitions for lesson-level attendance
const PERIODS = [
  { id: "period1", label: "Period 1", time: "8:00 AM - 8:45 AM" },
  { id: "period2", label: "Period 2", time: "8:45 AM - 9:30 AM" },
  { id: "period3", label: "Period 3", time: "9:45 AM - 10:30 AM" },
  { id: "period4", label: "Period 4", time: "10:30 AM - 11:15 AM" },
  { id: "period5", label: "Period 5", time: "11:30 AM - 12:15 PM" },
  { id: "period6", label: "Period 6", time: "12:15 PM - 1:00 PM" },
  { id: "period7", label: "Period 7", time: "2:00 PM - 2:45 PM" },
  { id: "period8", label: "Period 8", time: "2:45 PM - 3:30 PM" },
];

// Evening program periods (for after-school schedule)
const EVENING_PERIODS = [
  { id: "evening1", label: "Session 1", time: "4:00 PM - 5:00 PM" },
  { id: "evening2", label: "Session 2", time: "5:00 PM - 6:00 PM" },
  { id: "evening3", label: "Session 3", time: "6:00 PM - 7:00 PM" },
  { id: "evening4", label: "Session 4", time: "7:00 PM - 8:00 PM" },
];

// Weekend program periods
const WEEKEND_PERIODS = [
  { id: "weekend1", label: "Session 1", time: "9:00 AM - 10:30 AM" },
  { id: "weekend2", label: "Session 2", time: "10:45 AM - 12:15 PM" },
  { id: "weekend3", label: "Session 3", time: "1:00 PM - 2:30 PM" },
  { id: "weekend4", label: "Session 4", time: "2:45 PM - 4:15 PM" },
];

// Subjects for lesson-level attendance
const SUBJECTS = [
  { id: "math", label: "Mathematics" },
  { id: "english", label: "English Language" },
  { id: "science", label: "Science" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "biology", label: "Biology" },
  { id: "history", label: "History" },
  { id: "geography", label: "Geography" },
  { id: "computer", label: "Computer Science" },
  { id: "civic", label: "Civic Education" },
  { id: "economics", label: "Economics" },
  { id: "agric", label: "Agricultural Science" },
];

// Tertiary courses (for university/college)
const TERTIARY_COURSES = [
  { id: "csc101", label: "CSC 101 - Introduction to Computing" },
  { id: "csc201", label: "CSC 201 - Data Structures" },
  { id: "csc301", label: "CSC 301 - Algorithms" },
  { id: "mth101", label: "MTH 101 - General Mathematics" },
  { id: "phy101", label: "PHY 101 - General Physics" },
  { id: "eng101", label: "ENG 101 - Communication Skills" },
];

// Attendance mode types
type AttendanceMode = "daily" | "lesson";

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
  tenantId: string; // Which tenant/school this student belongs to
}

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
  lateMinutes?: number; // How many minutes late
  absenceReason?: AbsenceReason; // Reason for absence
  absenceExcused?: boolean; // Whether absence is excused
  markedBy?: string; // Staff ID who marked the attendance
  markedByName?: string; // Staff name for display
  markedByRole?: StaffRole; // Role of the staff member
  // Lesson-level attendance fields
  periodId?: string; // Which period/session this attendance is for
  subjectId?: string; // Which subject/course this attendance is for
}

// Mock student data - Using real student IDs from the system
// Each student is associated with a tenant (school)
const MOCK_STUDENTS: Student[] = [
  // Educo Demo School students (default tenant)
  { id: "AD9892302", name: "Aaliyah Griffin", class: "JSS 1", section: "A", rollNo: "35020", avatar: "https://i.pravatar.cc/150?img=1", tenantId: "educo-default" },
  { id: "AD9892434", name: "Janet Daniel", class: "JSS 1", section: "A", rollNo: "35013", avatar: "https://i.pravatar.cc/150?img=2", tenantId: "educo-default" },
  { id: "AD9892433", name: "Joann Michael", class: "JSS 2", section: "B", rollNo: "35012", avatar: "https://i.pravatar.cc/150?img=3", tenantId: "educo-default" },
  { id: "AD9892432", name: "Carol Davis", class: "JSS 1", section: "A", rollNo: "35011", avatar: "https://i.pravatar.cc/150?img=4", tenantId: "educo-default" },
  { id: "AD9892431", name: "David Miller", class: "JSS 1", section: "A", rollNo: "35010", avatar: "https://i.pravatar.cc/150?img=5", tenantId: "educo-default" },
  { id: "AD9892430", name: "Emma Wilson", class: "JSS 1", section: "A", rollNo: "35009", avatar: "https://i.pravatar.cc/150?img=6", tenantId: "educo-default" },
  { id: "AD9892429", name: "Frank Moore", class: "SSS 1", section: "A", rollNo: "35008", avatar: "https://i.pravatar.cc/150?img=7", tenantId: "educo-default" },
  { id: "AD9892428", name: "Grace Taylor", class: "SSS 1", section: "A", rollNo: "35007", avatar: "https://i.pravatar.cc/150?img=8", tenantId: "educo-default" },
  { id: "AD9892427", name: "Henry Anderson", class: "100 Level", section: "Computer Science", rollNo: "35006", avatar: "https://i.pravatar.cc/150?img=9", tenantId: "educo-default" },
  { id: "AD9892426", name: "Isabella Martinez", class: "100 Level", section: "Engineering", rollNo: "35005", avatar: "https://i.pravatar.cc/150?img=10", tenantId: "educo-default" },
  // Greenfield International students
  { id: "GF0001", name: "Chidi Okonkwo", class: "Primary 5", section: "A", rollNo: "GF001", avatar: "https://i.pravatar.cc/150?img=11", tenantId: "greenfield-international" },
  { id: "GF0002", name: "Amara Eze", class: "Primary 5", section: "B", rollNo: "GF002", avatar: "https://i.pravatar.cc/150?img=12", tenantId: "greenfield-international" },
  { id: "GF0003", name: "Emeka Nwachukwu", class: "JSS 2", section: "A", rollNo: "GF003", avatar: "https://i.pravatar.cc/150?img=13", tenantId: "greenfield-international" },
  // TechBridge College students (Tertiary)
  { id: "TB0001", name: "Oluwaseun Adeyemi", class: "200 Level", section: "Computer Science", rollNo: "TB001", avatar: "https://i.pravatar.cc/150?img=14", tenantId: "techbridge-college" },
  { id: "TB0002", name: "Ngozi Okoro", class: "300 Level", section: "Engineering", rollNo: "TB002", avatar: "https://i.pravatar.cc/150?img=15", tenantId: "techbridge-college" },
];

export default function AttendancePage() {
  const { settings, currentTenant } = useSchoolSettings();
  const isPageLoading = usePageLoad(600);
  const { saveAttendance: saveToContext } = useAttendance();
  const { user } = useUser();

  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    settings?.supportedLevels?.[0] || "Secondary"
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Attendance mode state (daily vs lesson-level)
  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>("daily");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Current user as the attendance taker (auto-populated from user profile)
  const currentStaffMember: StaffMember | null = user ? {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    role: user.staffType || "lecturer", // Default to lecturer if not set
    department: user.department,
  } : null;

  // Check if user is admin (can see all classes) or teacher/TA (can only see assigned classes)
  const isAdmin = user?.role === "super_admin" || user?.role === "school_admin" || user?.role === "branch_admin";
  const userAssignedClasses = user?.assignedClasses || [];

  // Get available classes based on user role
  // Admins can see all classes, Teachers/TAs only see their assigned classes
  const getAvailableClasses = (): string[] => {
    const allClasses = getClassesByLevel(educationLevel);
    if (isAdmin) {
      return allClasses;
    }
    // For teachers/TAs, filter to only their assigned classes
    return allClasses.filter(cls => userAssignedClasses.includes(cls));
  };

  const availableClasses = getAvailableClasses();

  // Get terminology based on institution type and education level
  const terminology = getTerminology(settings?.institutionType || "Private", educationLevel);

  // Get available sections - can be customized per tenant in the future
  // For tertiary, use department names; for primary/secondary, use letter sections
  const availableSections = educationLevel === "Tertiary"
    ? ["Computer Science", "Engineering", "Business", "Arts", "Sciences"]
    : DEFAULT_SECTIONS;

  // Check if this is an evening/weekend program based on schedule type
  const isEveningWeekendProgram = settings?.scheduleType === "after-school" ||
    settings?.scheduleType === "weekend";

  // Helper to format time from 24hr to 12hr format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get periods from tenant configuration (respects tenant-level settings)
  const availablePeriods = useMemo(() => {
    const tenantTimetable = currentTenant?.config?.timetable;

    // Get periods based on schedule type from tenant config
    let periods: PeriodConfig[] = [];

    if (settings?.scheduleType === "after-school" && tenantTimetable?.eveningPeriods?.length) {
      periods = tenantTimetable.eveningPeriods;
    } else if (settings?.scheduleType === "weekend" && tenantTimetable?.weekendPeriods?.length) {
      periods = tenantTimetable.weekendPeriods;
    } else if (tenantTimetable?.periods?.length) {
      // Use regular periods from tenant config
      periods = tenantTimetable.periods;
    } else {
      // Fallback to hardcoded defaults if tenant has no config
      if (settings?.scheduleType === "after-school") {
        return EVENING_PERIODS;
      } else if (settings?.scheduleType === "weekend") {
        return WEEKEND_PERIODS;
      }
      return PERIODS;
    }

    // Filter out breaks/lunch for attendance purposes and format for display
    return periods
      .filter(p => p.type === "regular" || !p.type)
      .map(p => ({
        id: p.id,
        label: p.label,
        time: `${formatTime(p.startTime)} - ${formatTime(p.endTime)}`,
      }));
  }, [currentTenant, settings?.scheduleType]);

  // Get subjects/courses from tenant configuration (respects tenant-level and education level)
  // For tertiary: uses assignedCourses (by ID), for primary/secondary: uses assignedSubjects (by name)
  const availableSubjects = useMemo(() => {
    const tenantSubjects = currentTenant?.config?.subjects;

    // If tenant has subjects configured, use them
    if (tenantSubjects && tenantSubjects.length > 0) {
      // Filter subjects by education level
      let filteredSubjects = tenantSubjects.filter(
        s => !s.level || s.level === educationLevel
      );

      // For non-admin teachers/lecturers, filter to their assigned subjects/courses
      if (!isAdmin) {
        if (educationLevel === "Tertiary") {
          // For tertiary lecturers, use assignedCourses (matches by course ID)
          if (user?.assignedCourses && user.assignedCourses.length > 0) {
            filteredSubjects = filteredSubjects.filter(s =>
              user.assignedCourses?.includes(s.id)
            );
          }
        } else {
          // For primary/secondary teachers, use assignedSubjects (matches by name)
          if (user?.assignedSubjects && user.assignedSubjects.length > 0) {
            filteredSubjects = filteredSubjects.filter(s =>
              user.assignedSubjects?.includes(s.name)
            );
          }
        }
      }

      // Format for dropdown display
      return filteredSubjects.map(s => ({
        id: s.id,
        label: s.code ? `${s.code} - ${s.name}` : s.name,
      }));
    }

    // Fallback to hardcoded defaults
    if (educationLevel === "Tertiary") {
      // For tertiary lecturers with assigned courses, filter even fallback data
      if (!isAdmin && user?.assignedCourses && user.assignedCourses.length > 0) {
        return TERTIARY_COURSES.filter(c => user.assignedCourses?.includes(c.id));
      }
      return TERTIARY_COURSES;
    }
    // For teachers, filter to their assigned subjects if available
    if (!isAdmin && user?.assignedSubjects && user.assignedSubjects.length > 0) {
      return SUBJECTS.filter(s => user.assignedSubjects?.includes(s.label));
    }
    return SUBJECTS;
  }, [currentTenant, educationLevel, isAdmin, user?.assignedSubjects, user?.assignedCourses]);

  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(
    new Map()
  );
  const [isSaving, setIsSaving] = useState(false);

  // Reset attendance when date, class, or section changes
  // Start fresh with no pre-selected statuses - users must mark attendance manually
  useEffect(() => {
    if (selectedDate && selectedClass) {
      // Clear attendance to start fresh - no buttons pre-selected
      setAttendance(new Map());
    }
  }, [selectedDate, selectedClass, selectedSection]);

  // Auto-select class based on user profile
  // For teachers/TAs: auto-select their first assigned class
  // For admins: no auto-selection, they choose manually
  useEffect(() => {
    if (!isInitialized && user) {
      if (!isAdmin && userAssignedClasses.length > 0) {
        // For teachers/TAs, auto-select their first assigned class
        const firstAssignedClass = availableClasses[0];
        if (firstAssignedClass) {
          setSelectedClass(firstAssignedClass);
        }
      }
      setIsInitialized(true);
    }
  }, [isInitialized, user, isAdmin, userAssignedClasses, availableClasses]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Late duration modal state
  const [lateModalOpen, setLateModalOpen] = useState(false);
  const [selectedLateStudent, setSelectedLateStudent] = useState<string | null>(null);
  const [lateMinutes, setLateMinutes] = useState<number>(15);

  // Absence reason modal state
  const [absenceModalOpen, setAbsenceModalOpen] = useState(false);
  const [selectedAbsentStudent, setSelectedAbsentStudent] = useState<string | null>(null);

  // Bulk absence modal state
  const [bulkAbsenceModalOpen, setBulkAbsenceModalOpen] = useState(false);

  // Search animation state
  const [isSearching, setIsSearching] = useState(false);

  // Filter students based on tenant, education level, class, section, and user's assigned classes
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    // First filter by tenant - only show students from current tenant/school
    const currentTenantId = settings?.tenantId || "educo-default";
    if (student.tenantId !== currentTenantId) {
      return false;
    }
    // Filter by education level - only show students whose class belongs to the selected level
    // This ensures Tertiary shows only "Level" students, Secondary shows JSS/SSS, Primary shows Primary/Nursery/KG
    if (!isClassInEducationLevel(student.class, educationLevel)) {
      return false;
    }
    // Then check if student is in user's assigned classes (for teachers/TAs)
    if (!isAdmin && !userAssignedClasses.includes(student.class)) {
      return false;
    }
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

    // If marking as absent, open modal to get absence reason
    if (status === ATTENDANCE_STATUS.ABSENT) {
      setSelectedAbsentStudent(studentId);
      setAbsenceModalOpen(true);
      return;
    }

    // For all other statuses (present, halfday, holiday), set directly
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

  const handleConfirmAbsence = (data: AbsenceFormData) => {
    if (selectedAbsentStudent) {
      setAttendance((prev) => {
        const newAttendance = new Map(prev);
        newAttendance.set(selectedAbsentStudent, {
          studentId: selectedAbsentStudent,
          status: ATTENDANCE_STATUS.ABSENT,
          absenceReason: data.reason,
          absenceExcused: data.excused,
          remarks: data.notes || undefined,
        });
        return newAttendance;
      });
      setAbsenceModalOpen(false);
      setSelectedAbsentStudent(null);
    }
  };

  const handleCancelAbsence = () => {
    setAbsenceModalOpen(false);
    setSelectedAbsentStudent(null);
  };

  // Get students who are marked absent (for bulk absence reason assignment)
  const absentStudents: BulkAbsenceStudent[] = filteredStudents
    .filter((s) => {
      const record = attendance.get(s.id);
      return record?.status === ATTENDANCE_STATUS.ABSENT;
    })
    .map((s) => ({
      id: s.id,
      name: s.name,
      rollNo: s.rollNo,
      avatar: s.avatar,
    }));

  const handleOpenBulkAbsenceModal = () => {
    if (absentStudents.length > 0) {
      setBulkAbsenceModalOpen(true);
    }
  };

  const handleConfirmBulkAbsence = (students: BulkAbsenceStudent[], data: BulkAbsenceFormData) => {
    setAttendance((prev) => {
      const newAttendance = new Map(prev);
      students.forEach((student) => {
        const existingRecord = newAttendance.get(student.id);
        newAttendance.set(student.id, {
          ...existingRecord,
          studentId: student.id,
          status: ATTENDANCE_STATUS.ABSENT,
          absenceReason: data.reason,
          absenceExcused: data.excused,
          remarks: data.notes || undefined,
        });
      });
      return newAttendance;
    });
    setBulkAbsenceModalOpen(false);
  };

  const handleRemoveStudentFromBulkAbsence = (studentId: string) => {
    // When removing from bulk modal, mark the student as present instead
    setAttendance((prev) => {
      const newAttendance = new Map(prev);
      newAttendance.set(studentId, {
        studentId,
        status: ATTENDANCE_STATUS.PRESENT,
      });
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
    // Validate user is logged in
    if (!currentStaffMember) {
      alert("Please log in to take attendance.");
      return;
    }

    // Validate lesson-level fields if in lesson mode
    if (attendanceMode === "lesson" && (!selectedPeriod || !selectedSubject)) {
      alert("Please select both period and subject for lesson-level attendance.");
      return;
    }

    setIsSaving(true);

    // Prepare attendance records with full information including who marked it
    const recordsToSave = Array.from(attendance.values()).map((record) => {
      const student = MOCK_STUDENTS.find((s) => s.id === record.studentId);
      return {
        studentId: record.studentId,
        status: record.status,
        date: selectedDate,
        lateMinutes: record.lateMinutes,
        absenceReason: record.absenceReason,
        absenceExcused: record.absenceExcused,
        remarks: record.remarks,
        class: student?.class || selectedClass,
        section: student?.section || selectedSection,
        // Record who marked the attendance (from logged-in user)
        markedBy: currentStaffMember.id,
        markedByName: currentStaffMember.name,
        markedByRole: currentStaffMember.role,
        // Lesson-level attendance fields
        attendanceMode,
        periodId: attendanceMode === "lesson" ? selectedPeriod : undefined,
        subjectId: attendanceMode === "lesson" ? selectedSubject : undefined,
        periodLabel: attendanceMode === "lesson" ? availablePeriods.find(p => p.id === selectedPeriod)?.label : undefined,
        subjectLabel: attendanceMode === "lesson" ? availableSubjects.find(s => s.id === selectedSubject)?.label : undefined,
      };
    });

    // Save to context (which syncs to localStorage)
    saveToContext(recordsToSave);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);

    // Build success message based on attendance mode
    let successMessage = `Attendance saved successfully!\nMarked by: ${currentStaffMember.name}`;
    if (attendanceMode === "lesson") {
      const periodLabel = availablePeriods.find(p => p.id === selectedPeriod)?.label;
      const subjectLabel = availableSubjects.find(s => s.id === selectedSubject)?.label;
      successMessage += `\n${subjectLabel} - ${periodLabel}`;
    }
    alert(successMessage);
  };

  const handleExport = () => {
    if (filteredStudents.length === 0) {
      alert("No students to export!");
      return;
    }

    // Create CSV content with staff info - include period/subject for lesson mode
    const baseHeaders = ["Student ID", "Name", "Roll No", "Class", "Section", "Status", "Late Duration (min)", "Absence Reason", "Excused", "Date", "Marked By", "Staff Role"];
    const lessonHeaders = attendanceMode === "lesson" ? ["Mode", "Period", "Subject"] : [];
    const headers = [...baseHeaders, ...lessonHeaders];

    const rows = filteredStudents.map((student) => {
      const record = attendance.get(student.id);
      const status = record?.status || "Unmarked";
      const lateInfo = record?.status === ATTENDANCE_STATUS.LATE && record?.lateMinutes
        ? record.lateMinutes.toString()
        : "";
      const absenceReasonLabel = record?.absenceReason
        ? ABSENCE_REASONS.find(r => r.value === record.absenceReason)?.label || record.absenceReason
        : "";
      const excusedInfo = record?.absenceExcused ? "Yes" : (record?.status === ATTENDANCE_STATUS.ABSENT ? "No" : "");
      const staffRoleLabel = currentStaffMember?.role === "lecturer" ? "Lecturer/Teacher" : currentStaffMember?.role === "teaching_assistant" ? "Teaching Assistant" : "";

      const baseRow = [
        student.id,
        student.name,
        student.rollNo,
        selectedClass,
        selectedSection || "N/A",
        status.charAt(0).toUpperCase() + status.slice(1),
        lateInfo,
        absenceReasonLabel,
        excusedInfo,
        new Date(selectedDate).toLocaleDateString(),
        currentStaffMember?.name || "N/A",
        staffRoleLabel,
      ];

      const lessonRow = attendanceMode === "lesson" ? [
        "Lesson",
        availablePeriods.find(p => p.id === selectedPeriod)?.label || "",
        availableSubjects.find(s => s.id === selectedSubject)?.label || "",
      ] : [];

      return [...baseRow, ...lessonRow];
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

    // Include period and subject in filename for lesson mode
    const fileName = attendanceMode === "lesson"
      ? `attendance_${selectedClass}_${selectedSubject}_${selectedPeriod}_${selectedDate}.csv`
      : `attendance_${selectedClass}_${selectedDate}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
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
              {/* Primary Filters: Class, Section, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Education Level - Only for Super Admin with multiple levels */}
                {settings?.supportsMultipleLevels && (
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
                    options={(settings?.supportedLevels || []).map((level) => ({
                      value: level,
                      label: level,
                    }))}
                    required
                  />
                )}

                <div>
                  <FormDropdown
                    label={!isAdmin && userAssignedClasses.length > 0 ? `Your ${terminology.class}` : terminology.class}
                    icon={<BookOpen className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-400"
                    value={selectedClass}
                    onChange={handleClassChange}
                    options={[
                      ...(isAdmin ? [{ value: "", label: `Select ${terminology.class.toLowerCase()}...` }] : []),
                      ...availableClasses.map((cls) => ({
                        value: cls,
                        label: cls,
                      })),
                    ]}
                    placeholder={availableClasses.length === 0 ? `No ${terminology.class.toLowerCase()}es assigned to your profile` : `Select ${terminology.class.toLowerCase()}...`}
                    required
                    disabled={availableClasses.length === 0}
                  />
                  {!isAdmin && userAssignedClasses.length === 1 && (
                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                      Auto-selected from your profile
                    </p>
                  )}
                </div>

                <FormDropdown
                  label={terminology.section}
                  icon={<Users className="w-full h-full" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400"
                  value={selectedSection}
                  onChange={handleSectionChange}
                  options={[
                    { value: "", label: `All ${terminology.section.toLowerCase()}s` },
                    ...availableSections.map((section: string) => ({
                      value: section,
                      label: educationLevel === "Tertiary" ? section : `${terminology.section} ${section}`,
                    })),
                  ]}
                  placeholder={`All ${terminology.section.toLowerCase()}s`}
                />

                <FormInput
                  label="Date"
                  icon={<Calendar className="w-full h-full" />}
                  iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                  iconColor="text-amber-600 dark:text-amber-400"
                  type="date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  required
                />
              </div>

              {/* Attendance Mode Toggle */}
              <div className="mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Attendance Mode
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Choose between daily roll call or lesson-specific attendance
                    </p>
                  </div>
                  <div className="flex bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
                    <button
                      onClick={() => {
                        setAttendanceMode("daily");
                        setSelectedPeriod("");
                        setSelectedSubject("");
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        attendanceMode === "daily"
                          ? "bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setAttendanceMode("lesson")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        attendanceMode === "lesson"
                          ? "bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                      }`}
                    >
                      {terminology.period}
                    </button>
                  </div>
                </div>

                {/* Lesson-level attendance options */}
                {attendanceMode === "lesson" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                    <FormDropdown
                      label={isEveningWeekendProgram ? "Session" : terminology.period}
                      icon={<Clock className="w-full h-full" />}
                      iconBgColor="bg-cyan-100 dark:bg-cyan-900/30"
                      iconColor="text-cyan-600 dark:text-cyan-400"
                      value={selectedPeriod}
                      onChange={setSelectedPeriod}
                      options={[
                        { value: "", label: `Select ${isEveningWeekendProgram ? "session" : terminology.period.toLowerCase()}...` },
                        ...availablePeriods.map((period) => ({
                          value: period.id,
                          label: `${period.label} (${period.time})`,
                        })),
                      ]}
                      required
                    />

                    <FormDropdown
                      label={educationLevel === "Tertiary" ? "Course" : "Subject"}
                      icon={<BookOpen className="w-full h-full" />}
                      iconBgColor="bg-pink-100 dark:bg-pink-900/30"
                      iconColor="text-pink-600 dark:text-pink-400"
                      value={selectedSubject}
                      onChange={setSelectedSubject}
                      options={[
                        { value: "", label: `Select ${educationLevel === "Tertiary" ? "course" : "subject"}...` },
                        ...availableSubjects.map((subject) => ({
                          value: subject.id,
                          label: subject.label,
                        })),
                      ]}
                      required
                    />

                    {/* Show selected period/subject summary */}
                    {selectedPeriod && selectedSubject && (
                      <div className="col-span-1 sm:col-span-2 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-blue-200 dark:border-blue-700">
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                          Lesson Attendance For
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {availableSubjects.find(s => s.id === selectedSubject)?.label} - {availablePeriods.find(p => p.id === selectedPeriod)?.label}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {availablePeriods.find(p => p.id === selectedPeriod)?.time}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Attendance Taker - Auto-populated from logged-in user */}
              {currentStaffMember && (
                <div className="mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Attendance Taker
                    </p>
                    {/* Show schedule type indicator for evening/weekend programs */}
                    {isEveningWeekendProgram && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                        {settings?.scheduleType === "weekend" ? (
                          <><Sun className="w-3 h-3" /> Weekend Program</>
                        ) : (
                          <><Moon className="w-3 h-3" /> Evening Program</>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={currentStaffMember.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-indigo-900 dark:text-indigo-200">
                          {currentStaffMember.name}
                        </p>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            currentStaffMember.role === "lecturer"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          }`}>
                            <UserCog className="w-3 h-3" />
                            {currentStaffMember.role === "lecturer" ? terminology.staffRole : terminology.staffRoleTA}
                          </span>
                          {currentStaffMember.department && (
                            <span className="text-xs text-indigo-600 dark:text-indigo-400">
                              • {currentStaffMember.department}
                            </span>
                          )}
                          {/* Show institution type */}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                            <Building2 className="w-3 h-3" />
                            {settings?.institutionType || "Private"}
                          </span>
                        </div>
                        {/* Show assigned classes for teachers/TAs */}
                        {!isAdmin && userAssignedClasses.length > 0 && (
                          <div className="mt-2 flex items-center flex-wrap gap-1">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">{terminology.class}es:</span>
                            {userAssignedClasses.map((cls) => (
                              <span
                                key={cls}
                                className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                              >
                                {cls}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Show assigned courses for tertiary lecturers */}
                        {!isAdmin && educationLevel === "Tertiary" && user?.assignedCourses && user.assignedCourses.length > 0 && (
                          <div className="mt-2 flex items-center flex-wrap gap-1">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">Courses:</span>
                            {availableSubjects.slice(0, 3).map((course) => (
                              <span
                                key={course.id}
                                className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300"
                              >
                                {course.label.split(" - ")[0]}
                              </span>
                            ))}
                            {availableSubjects.length > 3 && (
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                +{availableSubjects.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        {/* Show assigned subjects for primary/secondary teachers */}
                        {!isAdmin && educationLevel !== "Tertiary" && user?.assignedSubjects && user.assignedSubjects.length > 0 && (
                          <div className="mt-2 flex items-center flex-wrap gap-1">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">Subjects:</span>
                            {user.assignedSubjects.slice(0, 3).map((subject) => (
                              <span
                                key={subject}
                                className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                              >
                                {subject}
                              </span>
                            ))}
                            {user.assignedSubjects.length > 3 && (
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                +{user.assignedSubjects.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Mark Attendance
                      </h3>
                      {/* Show attendance mode badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        attendanceMode === "lesson"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      }`}>
                        {attendanceMode === "lesson" ? (
                          <><Clock className="w-3 h-3" /> {terminology.period}</>
                        ) : (
                          <><Calendar className="w-3 h-3" /> Daily</>
                        )}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {selectedClass}
                      {selectedSection && ` - Section ${selectedSection}`} •{" "}
                      {new Date(selectedDate).toLocaleDateString()}
                      {attendanceMode === "lesson" && selectedPeriod && selectedSubject && (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {" "}• {availableSubjects.find(s => s.id === selectedSubject)?.label} ({availablePeriods.find(p => p.id === selectedPeriod)?.label})
                        </span>
                      )}
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

                {/* Lesson Mode Warning - Shows when period/subject not selected */}
                {attendanceMode === "lesson" && (!selectedPeriod || !selectedSubject) && (
                  <div className="mt-4 px-4 sm:px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Lesson attendance requires period and subject selection
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                        Please select both {isEveningWeekendProgram ? "session" : terminology.period.toLowerCase()} and {educationLevel === "Tertiary" ? "course" : "subject"} above to enable saving
                      </p>
                    </div>
                  </div>
                )}

                {/* Bulk Absence Bar - Only shows when students are marked absent */}
                {absentStudents.length > 0 && (
                  <div className="mt-4 px-4 sm:px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <CircleX className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        {absentStudents.length} {absentStudents.length === 1 ? "student" : "students"} marked absent
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleOpenBulkAbsenceModal}
                      className="gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                    >
                      <FileQuestion className="w-4 h-4" />
                      Set Absence Reasons ({absentStudents.length})
                    </Button>
                  </div>
                )}
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
                                  {currentStatus === ATTENDANCE_STATUS.ABSENT && record?.absenceReason && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                      record.absenceExcused
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                    }`}>
                                      {record.absenceExcused ? <CheckCircle className="w-3 h-3" /> : <FileQuestion className="w-3 h-3" />}
                                      {ABSENCE_REASONS.find(r => r.value === record.absenceReason)?.label || record.absenceReason}
                                      {record.absenceExcused && " (Excused)"}
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
                    disabled={isSaving || attendance.size === 0 || (attendanceMode === "lesson" && (!selectedPeriod || !selectedSubject))}
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

      {/* Absence Reason Modal */}
      <AbsenceReasonModal
        isOpen={absenceModalOpen}
        onClose={handleCancelAbsence}
        onConfirm={handleConfirmAbsence}
        studentName={selectedAbsentStudent ? MOCK_STUDENTS.find(s => s.id === selectedAbsentStudent)?.name || "" : ""}
        studentId={selectedAbsentStudent || undefined}
        studentAvatar={selectedAbsentStudent ? MOCK_STUDENTS.find(s => s.id === selectedAbsentStudent)?.avatar : undefined}
      />

      {/* Bulk Absence Reason Modal */}
      <BulkAbsenceReasonModal
        isOpen={bulkAbsenceModalOpen}
        onClose={() => setBulkAbsenceModalOpen(false)}
        onConfirm={handleConfirmBulkAbsence}
        students={absentStudents}
        onRemoveStudent={handleRemoveStudentFromBulkAbsence}
      />
    </MainLayout>
  );
}
