"use client";

import { useState } from "react";
import {
  BookOpen,
  Users,
  ChevronUp,
  Home,
  FileText,
  ClipboardCheck,
  Calendar,
} from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";
import TagInput from "@/components/shared/TagInput";
import { ValidationErrors } from "@/lib/validation";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

interface SubjectsClassesSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function SubjectsClassesSection({
  formData,
  onChange,
}: SubjectsClassesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { settings: schoolSettings } = useSchoolSettings();

  // Only show for Academic Staff
  const isAcademicStaff = formData.jobCategory === "Academic Staff";

  // Don't render if not academic staff
  if (!isAcademicStaff) {
    return null;
  }

  const subjectOptions = [
    "Mathematics",
    "Further Mathematics",
    "English Language",
    "Literature",
    "Chemistry",
    "Biology",
    "Physics",
    "Computer Science",
    "ICT",
    "Geography",
    "Economics",
    "Government",
    "History",
    "Fine Arts",
    "Creative Arts",
    "Music",
    "Cultural Studies",
    "Software Engineering",
    "Civil Engineering",
    "Structural Analysis",
    "Medicine",
    "Anatomy",
  ];

  const classOptions = [
    "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
    "JSS 1", "JSS 2", "JSS 3",
    "SS 1", "SS 2", "SS 3",
    "Year 1", "Year 2", "Year 3", "Year 4", "Year 5",
    "Masters", "PhD",
  ];

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const assessmentRoles = [
    { value: "None", label: "None" },
    { value: "Grader", label: "Grader" },
    { value: "Reviewer", label: "Reviewer" },
    { value: "Moderator", label: "Moderator" },
  ];

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-cyan-50/50 dark:bg-cyan-900/10 midnight:bg-cyan-900/10 purple:bg-cyan-900/10 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-cyan-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Subjects & Teaching Assignments
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Subjects taught, classes assigned, and teaching responsibilities
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer">
          <ChevronUp
            className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Subjects Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Subjects Taught
                </h3>
              </div>
              <div className="pl-2">
                <TagInput
                  label="Subjects"
                  value={formData.subjects || []}
                  onChange={(subjects) => onChange("subjects", subjects)}
                  placeholder="Type and press Enter to add subjects"
                  suggestions={subjectOptions}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Start typing to see suggestions, or enter custom subjects
                </p>
              </div>
            </div>

            {/* Classes Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Classes Assigned
                </h3>
              </div>
              <div className="pl-2">
                <TagInput
                  label="Classes"
                  value={formData.classes || []}
                  onChange={(classes) => onChange("classes", classes)}
                  placeholder="Type and press Enter to add classes"
                  suggestions={classOptions}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Start typing to see suggestions, or enter custom classes
                </p>
              </div>
            </div>

            {/* Homeroom & Class Teacher Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
                  <Home className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Homeroom / Class Teacher
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Is Homeroom/Class Teacher?"
                  icon={<Home className="w-full h-full" />}
                  iconBgColor="bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30"
                  iconColor="text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400"
                  value={formData.isHomeroomTeacher || "No"}
                  onChange={(value) => onChange("isHomeroomTeacher", value)}
                  options={yesNoOptions}
                  placeholder="Select option"
                />
              </div>
            </div>

            {/* LMS & Assessment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  LMS & Assessment Permissions
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="LMS Access Permissions"
                  icon={<BookOpen className="w-full h-full" />}
                  iconBgColor="bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30"
                  iconColor="text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400"
                  value={formData.lmsAccess || "No"}
                  onChange={(value) => onChange("lmsAccess", value)}
                  options={yesNoOptions}
                  placeholder="Select option"
                />
                <FormDropdown
                  label="Continuous Assessment Role"
                  icon={<ClipboardCheck className="w-full h-full" />}
                  iconBgColor="bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30"
                  iconColor="text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400"
                  value={formData.assessmentRole || "None"}
                  onChange={(value) => onChange("assessmentRole", value)}
                  options={assessmentRoles}
                  placeholder="Select role"
                />
                <FormDropdown
                  label="Exam Invigilation Eligibility"
                  icon={<FileText className="w-full h-full" />}
                  iconBgColor="bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30"
                  iconColor="text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400"
                  value={formData.examInvigilationEligibility || "No"}
                  onChange={(value) => onChange("examInvigilationEligibility", value)}
                  options={yesNoOptions}
                  placeholder="Select option"
                />
              </div>
            </div>

            {/* Timetable Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Timetable / Teaching Schedule
                </h3>
              </div>
              <div className="pl-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                  Teaching schedule and timetable will be configured separately in the Timetable Management module.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
