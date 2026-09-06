// The BROADER of the two EducationLevel types in the repo. `contexts/SchoolSettingsContext` has a narrower
// one ("Primary" | "Secondary" | "Tertiary"); this form genuinely offers Nursery, Kindergarten and Junior
// Secondary too, plus "" for "not chosen yet". Typing the form is what made the difference visible.
import type { EducationLevel } from "@/utils/educationLevel";

/**
 * Everything the "add a class" form holds.
 *
 * Named here rather than left inline on the page's `useState`, because the seven form sections all need to
 * describe it and each of them was saying `formData: any` instead. With a name, a section that reads
 * `formData.acedemicYear` stops compiling.
 */
export interface ClassFormData {
  // Basic Information
  educationLevel: EducationLevel;
  className: string;
  level: string;
  section: string;
  stream: string;
  academicYear: string;
  term: string;
  status: string;

  // Secondary-specific
  academicTrack: "Science" | "Arts" | "Commercial" | "Technical" | "";
  streamName: string;

  // Tertiary-specific
  faculty: string;
  department: string;
  programme: "B.Sc" | "B.Eng" | "B.A" | "ND" | "HND" | "NCE" | "MBBS" | "";
  courseLevel: string;
  semester: string;

  // Logistics
  room: string;
  capacity: string;
  schedule: string;

  // Teacher Assignment
  classTeacher: string;
  levelAdviser: string;
  assistantTeacher: string;
  subjectTeacherAssignments: Array<{ subject: string; teacher: string }>;

  // Subjects / Courses
  subjects: Array<{ name: string; code: string; category: string; creditUnits?: string }>;

  // Features & Settings
  branch: string;
  maxStudents: string;
  enabledFeatures: {
    lms: boolean;
    digitalDiary: boolean;
    transport: boolean;
    hostel: boolean;
    rfid: boolean;
    onlineClasses: boolean;
    library: boolean;
    gradebook: boolean;
  };
  transportZone: string;
  hostelEligibility: boolean;
  behaviorPolicy: string;
  feeTemplate: string;
}
