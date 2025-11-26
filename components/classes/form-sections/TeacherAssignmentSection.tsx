"use client";

import { useState } from "react";
import {
  Users,
  ChevronUp,
  ChevronDown,
  UserPlus,
  X,
  BookOpen,
} from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";

interface TeacherAssignmentSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

export default function TeacherAssignmentSection({
  formData,
  onChange,
  errors = {},
}: TeacherAssignmentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isTertiary = formData.educationLevel === "Tertiary";
  const isNursery = formData.educationLevel === "Nursery" || formData.educationLevel === "Kindergarten";
  const isPrimary = formData.educationLevel === "Primary";
  const isSecondary = formData.educationLevel === "Secondary" || formData.educationLevel === "Junior Secondary";

  // Nursery and Primary need class teacher + optional assistant, Secondary needs class tutor, Tertiary doesn't need class teacher
  const needsClassTeacher = !isTertiary;
  const canHaveAssistant = isNursery; // Only Nursery can have assistant teacher

  // Mock teacher data - should come from API
  const mockTeachers = [
    { value: "T001", label: "Mr. Adebayo Johnson (Mathematics)" },
    { value: "T002", label: "Mrs. Chioma Okafor (English)" },
    { value: "T003", label: "Dr. Emeka Nwosu (Physics)" },
    { value: "T004", label: "Miss. Fatima Ahmed (Chemistry)" },
    { value: "T005", label: "Mr. Oluwaseun Balogun (Biology)" },
  ];

  // Mock lecturer data - should come from API
  const mockLecturers = [
    { value: "L001", label: "Prof. Olumide Adeyemi (Computer Science)" },
    { value: "L002", label: "Dr. Ngozi Okeke (Software Engineering)" },
    { value: "L003", label: "Dr. Ibrahim Musa (Data Structures)" },
    { value: "L004", label: "Prof. Aisha Bello (Database Management)" },
    { value: "L005", label: "Dr. Chukwudi Eze (Web Development)" },
  ];

  // Mock subjects - should come from API or be based on education level
  const mockSubjects = isTertiary
    ? [
        { value: "CSC201", label: "CSC 201 - Data Structures" },
        { value: "CSC202", label: "CSC 202 - Algorithms" },
        { value: "CSC203", label: "CSC 203 - Database Systems" },
        { value: "CSC204", label: "CSC 204 - Web Development" },
        { value: "CSC205", label: "CSC 205 - Software Engineering" },
      ]
    : [
        { value: "MATH", label: "Mathematics" },
        { value: "ENG", label: "English Language" },
        { value: "PHY", label: "Physics" },
        { value: "CHEM", label: "Chemistry" },
        { value: "BIO", label: "Biology" },
        { value: "GEOG", label: "Geography" },
        { value: "HIST", label: "History" },
      ];

  const handleAddSubjectTeacher = () => {
    const currentAssignments = formData.subjectTeacherAssignments || [];
    onChange("subjectTeacherAssignments", [
      ...currentAssignments,
      { subject: "", teacher: "" },
    ]);
  };

  const handleRemoveSubjectTeacher = (index: number) => {
    const currentAssignments = formData.subjectTeacherAssignments || [];
    onChange(
      "subjectTeacherAssignments",
      currentAssignments.filter((_: any, i: number) => i !== index)
    );
  };

  const handleSubjectTeacherChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const currentAssignments = formData.subjectTeacherAssignments || [];
    const updatedAssignments = [...currentAssignments];
    updatedAssignments[index] = {
      ...updatedAssignments[index],
      [field]: value,
    };
    onChange("subjectTeacherAssignments", updatedAssignments);
  };

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            {isTertiary ? "Lecturer Assignment" : "Teacher Assignment"}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Class Teacher (for non-tertiary) */}
          {!isTertiary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormDropdown
                label={isSecondary ? "Class Tutor" : "Class Teacher"}
                value={formData.classTeacher}
                onChange={(value) => onChange("classTeacher", value)}
                options={mockTeachers}
                icon={<Users className="w-2.5 h-2.5" />}
                placeholder={isSecondary ? "Select class tutor" : "Select class teacher"}
                required
                error={errors.classTeacher}
              />

              {/* Assistant Teacher (only for Nursery) */}
              {canHaveAssistant && (
                <FormDropdown
                  label="Assistant Teacher (Optional)"
                  value={formData.assistantTeacher}
                  onChange={(value) => onChange("assistantTeacher", value)}
                  options={mockTeachers}
                  icon={<Users className="w-2.5 h-2.5" />}
                  placeholder="Select assistant teacher"
                  error={errors.assistantTeacher}
                />
              )}
            </div>
          )}

          {/* Subject/Course Teacher Assignments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isTertiary ? "Course Lecturers" : "Subject Teachers"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddSubjectTeacher}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add {isTertiary ? "Lecturer" : "Teacher"}
              </button>
            </div>

            {/* List of subject-teacher assignments */}
            {formData.subjectTeacherAssignments &&
            formData.subjectTeacherAssignments.length > 0 ? (
              <div className="space-y-3">
                {formData.subjectTeacherAssignments.map(
                  (assignment: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/10 purple:border-pink-500/10"
                    >
                      <FormDropdown
                        label={isTertiary ? "Course" : "Subject"}
                        value={assignment.subject}
                        onChange={(value) =>
                          handleSubjectTeacherChange(index, "subject", value)
                        }
                        options={mockSubjects}
                        icon={<BookOpen className="w-2.5 h-2.5" />}
                        placeholder={
                          isTertiary ? "Select course" : "Select subject"
                        }
                        required
                      />

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <FormDropdown
                            label={isTertiary ? "Lecturer" : "Teacher"}
                            value={assignment.teacher}
                            onChange={(value) =>
                              handleSubjectTeacherChange(index, "teacher", value)
                            }
                            options={isTertiary ? mockLecturers : mockTeachers}
                            icon={<Users className="w-2.5 h-2.5" />}
                            placeholder={
                              isTertiary ? "Select lecturer" : "Select teacher"
                            }
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubjectTeacher(index)}
                          className="h-10 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  No {isTertiary ? "course lecturers" : "subject teachers"}{" "}
                  assigned yet
                </p>
                <button
                  type="button"
                  onClick={handleAddSubjectTeacher}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Add First {isTertiary ? "Lecturer" : "Teacher"}
                </button>
              </div>
            )}

            {errors.subjectTeacherAssignments && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.subjectTeacherAssignments}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
