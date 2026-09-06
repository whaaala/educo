"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import BasicInformationSection from "@/components/classes/form-sections/BasicInformationSection";
import TertiaryDetailsSection from "@/components/classes/form-sections/TertiaryDetailsSection";
import SecondaryTrackSection from "@/components/classes/form-sections/SecondaryTrackSection";
import LogisticsSection from "@/components/classes/form-sections/LogisticsSection";
import TeacherAssignmentSection from "@/components/classes/form-sections/TeacherAssignmentSection";
import SubjectCourseSection from "@/components/classes/form-sections/SubjectCourseSection";
import FeaturesSettingsSection from "@/components/classes/form-sections/FeaturesSettingsSection";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import type { EducationLevel } from "@/utils/educationLevel";
import type { ClassFormData } from "@/components/classes/form-sections/types";
import type { FormFieldSetter } from "@/components/shared/form-section-types";

export default function AddClassPage() {
  const router = useRouter();
  const { settings } = useSchoolSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ClassFormData, string>>>({});
  const { isCollapsed } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle sticky behavior based on scroll position
  useEffect(() => {
    const mainElement = document.querySelector('main');

    const handleScroll = () => {
      if (!formRef.current || !buttonsRef.current || !mainElement) return;

      const formRect = formRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const buttonsHeight = buttonsRef.current.offsetHeight;

      if (formRect.bottom <= viewportHeight - buttonsHeight + 16) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    };

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Form state
  const [formData, setFormData] = useState<ClassFormData>({
    // Basic Information
    educationLevel: "" as EducationLevel,
    className: "",
    level: "",
    section: "A",
    stream: "",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",

    // Secondary-specific
    academicTrack: "" as "Science" | "Arts" | "Commercial" | "Technical" | "",
    streamName: "",

    // Tertiary-specific
    faculty: "",
    department: "",
    programme: "" as "B.Sc" | "B.Eng" | "B.A" | "ND" | "HND" | "NCE" | "MBBS" | "",
    courseLevel: "",
    semester: "First Semester",

    // Logistics
    room: "",
    capacity: "",
    schedule: "",

    // Teacher Assignment
    classTeacher: "", // For Primary/Secondary
    levelAdviser: "", // For Tertiary (University/College)
    assistantTeacher: "", // For Nursery/Kindergarten
    subjectTeacherAssignments: [] as Array<{ subject: string; teacher: string }>,

    // Subjects/Courses
    subjects: [] as Array<{
      name: string;
      code: string;
      category: string;
      creditUnits?: string;
    }>,

    // Features & Settings
    branch: "",
    maxStudents: "",
    enabledFeatures: {
      lms: false,
      digitalDiary: false,
      transport: false,
      hostel: false,
      rfid: false,
      onlineClasses: false,
      library: false,
      gradebook: false,
    },
    transportZone: "",
    hostelEligibility: false,
    behaviorPolicy: "",
    feeTemplate: "",
  });

  // Generate class code based on form data
  const generatedClassCode = useMemo(() => {
    if (!formData.educationLevel || !formData.level) return "";

    const isNursery = formData.educationLevel === "Nursery" || formData.educationLevel === "Kindergarten";
    const isPrimary = formData.educationLevel === "Primary";
    const isJuniorSecondary = formData.educationLevel === "Junior Secondary";
    const isSecondary = formData.educationLevel === "Secondary";
    const isTertiary = formData.educationLevel === "Tertiary";

    if (isNursery) {
      // e.g., NUR1-A, KG2-B, PG-A (Playgroup)
      const levelCode = formData.level === "Playgroup"
        ? "PG"
        : formData.level.replace(" ", "").substring(0, 4).toUpperCase(); // NUR1, NUR2, KG1, KG2
      return formData.section
        ? `${levelCode}-${formData.section}`
        : levelCode;
    }

    if (isPrimary) {
      return `PRY${formData.level}-${formData.section}`;
    }

    if (isJuniorSecondary) {
      return `JSS${formData.level}-${formData.section}`;
    }

    if (isSecondary) {
      const trackCode = formData.academicTrack
        ? formData.academicTrack.substring(0, 3).toUpperCase()
        : "";
      return trackCode
        ? `SSS${formData.level}-${trackCode}-${formData.section}`
        : `SSS${formData.level}-${formData.section}`;
    }

    if (isTertiary && formData.programme && formData.courseLevel && formData.department) {
      const deptCode = formData.department
        .split(" ")
        .map(w => w.charAt(0))
        .join("")
        .toUpperCase();

      const semCode = formData.semester === "First Semester"
        ? "SEM1"
        : formData.semester === "Second Semester"
        ? "SEM2"
        : "SIWES";

      if (formData.programme === "ND" || formData.programme === "HND") {
        return `${formData.programme}${formData.courseLevel}-${deptCode}-${semCode}`;
      }

      return `${formData.courseLevel}-${deptCode}-${semCode}`;
    }

    return "";
  }, [formData]);

  // Generic over the field, so the value has to be the right kind for the field being set — a mismatch is a
  // compile error rather than a shape that quietly reaches the form's state.
  const handleChange: FormFieldSetter<ClassFormData> = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateFormData = (): boolean => {
    const newErrors: Partial<Record<keyof ClassFormData, string>> = {};

    // Basic validation
    if (!formData.educationLevel) newErrors.educationLevel = "Education level is required";
    if (!formData.className) newErrors.className = "Class name is required";
    if (!formData.academicYear) newErrors.academicYear = "Academic year is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.room) newErrors.room = "Room/Hall is required";
    if (!formData.capacity) newErrors.capacity = "Capacity is required";

    // Level-specific validation
    const isTertiary = formData.educationLevel === "Tertiary";
    const isSecondary = formData.educationLevel === "Secondary";
    const isNursery = formData.educationLevel === "Nursery" || formData.educationLevel === "Kindergarten";

    if (!isTertiary) {
      if (!formData.level) newErrors.level = "Level is required";
      // Section is optional for Nursery
      if (!isNursery && !formData.section) newErrors.section = "Section is required";
      if (!formData.term) newErrors.term = "Term is required";

      // Class Teacher required for non-tertiary
      if (!formData.classTeacher) newErrors.classTeacher = isSecondary ? "Class tutor is required" : "Class teacher is required";
    }

    // Level Adviser required for Tertiary
    if (isTertiary) {
      if (!formData.levelAdviser) newErrors.levelAdviser = "Level adviser is required";
    }

    if (isSecondary) {
      if (!formData.academicTrack) newErrors.academicTrack = "Academic track is required";
    }

    if (isTertiary) {
      if (!formData.faculty) newErrors.faculty = "Faculty is required";
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.programme) newErrors.programme = "Programme is required";
      if (!formData.courseLevel) newErrors.courseLevel = "Course level is required";
      if (!formData.semester) newErrors.semester = "Semester is required";
    }

    // Teacher/Subject validation (Nursery doesn't need subject teachers - activity-based)
    if (!isNursery) {
      if (!formData.subjectTeacherAssignments || formData.subjectTeacherAssignments.length === 0) {
        newErrors.subjectTeacherAssignments = isTertiary
          ? "At least one course lecturer is required"
          : "At least one subject teacher is required";
      }

      // Subjects validation (Nursery uses activity-based learning, not subjects)
      if (!formData.subjects || formData.subjects.length === 0) {
        newErrors.subjects = isTertiary
          ? "At least one course is required"
          : "At least one subject is required";
      }
    }

    // Features & Settings validation
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!formData.maxStudents) newErrors.maxStudents = "Maximum students is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const classData = {
        id: generatedClassCode,
        name: formData.className,
        level: formData.educationLevel,
        section: formData.section,
        stream: formData.stream,
        academicTrack: formData.academicTrack,
        faculty: formData.faculty,
        department: formData.department,
        programme: formData.programme,
        courseLevel: formData.courseLevel,
        semester: formData.semester,
        room: formData.room,
        capacity: parseInt(formData.capacity),
        schedule: formData.schedule,
        term: formData.term,
        academicYear: formData.academicYear,
        status: formData.status,
      };

      console.log("Creating class:", classData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to classes list
      router.push("/classes?view=grid");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/classes?view=grid");
  };

  const classLabel = settings.supportedLevels.includes("Tertiary") ? "Course" : "Class";

  return (
    <DashboardPage
      title={`Add ${classLabel}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Academic" },
        { label: "Classes", href: "/classes?view=grid" },
        { label: `Add ${classLabel}`, isActive: true },
      ]}
      loadingText="Loading Form"
      afterStats={
        <div className="mt-6" suppressHydrationWarning>

        {/* Class Code Preview */}
        {generatedClassCode && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-500/10 purple:bg-pink-500/10 border border-blue-200 dark:border-blue-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Generated Class Code</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {generatedClassCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          id="add-class-form"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 pb-32 md:pb-36 lg:pb-16 xl:pb-20"
          suppressHydrationWarning
        >
          {/* Basic Information */}
          <BasicInformationSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Secondary Track (only for SSS) */}
          <SecondaryTrackSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Tertiary Details (only for Tertiary) */}
          <TertiaryDetailsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Logistics */}
          <LogisticsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Teacher Assignment */}
          <TeacherAssignmentSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Subjects/Courses */}
          <SubjectCourseSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Features & Settings */}
          <FeaturesSettingsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </form>

        {/* Action Buttons - Sticky to bottom until form ends */}
        <div
          ref={buttonsRef}
          className={`${isSticky ? 'fixed' : 'relative'} bottom-0 bg-surface border-t border-line rounded-t-xl shadow-lg backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 py-4 px-6 z-50`}
          style={isSticky ? {
            left: isLargeScreen ? `calc(${isCollapsed ? '5rem' : '18rem'} + 2rem)` : '1rem',
            right: isLargeScreen ? '2rem' : '1rem',
            transition: 'left 500ms, right 0ms'
          } : undefined}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-class-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isSubmitting ? `Adding ${classLabel}...` : `Add ${classLabel}`}
            </button>
          </div>
        </div>
        </div>
      }
    />
  );
}
