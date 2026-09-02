"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronUp,
  ChevronDown,
  Plus,
  X,
  Hash,
  Award,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";

interface SubjectCourseSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

export default function SubjectCourseSection({
  formData,
  onChange,
  errors = {},
}: SubjectCourseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isTertiary = formData.educationLevel === "Tertiary";
  const isNursery = formData.educationLevel === "Nursery" || formData.educationLevel === "Kindergarten";

  // Nursery doesn't have subjects - they have themes/activities instead
  // This section should be hidden for Nursery or show themes instead
  if (isNursery) {
    return null; // Hide this section for Nursery - they use activity-based learning
  }

  // Subject/Course categories
  const categories = isTertiary
    ? [
        { value: "Core", label: "Core" },
        { value: "Elective", label: "Elective" },
        { value: "General Studies", label: "General Studies" },
      ]
    : [
        { value: "Core", label: "Core" },
        { value: "Elective", label: "Elective" },
        { value: "Mandatory", label: "Mandatory" },
      ];

  const handleAddSubject = () => {
    const currentSubjects = formData.subjects || [];
    onChange("subjects", [
      ...currentSubjects,
      {
        name: "",
        code: "",
        category: "Core",
        creditUnits: isTertiary ? "" : undefined,
      },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    const currentSubjects = formData.subjects || [];
    onChange(
      "subjects",
      currentSubjects.filter((_: any, i: number) => i !== index)
    );
  };

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const currentSubjects = formData.subjects || [];
    const updatedSubjects = [...currentSubjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value,
    };
    onChange("subjects", updatedSubjects);
  };

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-teal-50/50 dark:bg-teal-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-teal-50 dark:hover:bg-teal-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-base font-semibold text-ink">
            {isTertiary ? "Courses" : "Subjects"}
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
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isTertiary ? "Course List" : "Subject List"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddSubject}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add {isTertiary ? "Course" : "Subject"}
            </button>
          </div>

          {/* List of subjects/courses */}
          {formData.subjects && formData.subjects.length > 0 ? (
            <div className="space-y-4">
              {formData.subjects.map((subject: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/10 purple:border-pink-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {isTertiary ? "Course" : "Subject"} #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(index)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Subject/Course Name */}
                    <FormInput
                      label={isTertiary ? "Course Name" : "Subject Name"}
                      value={subject.name}
                      onChange={(value) =>
                        handleSubjectChange(index, "name", value)
                      }
                      icon={<BookOpen className="w-2.5 h-2.5" />}
                      placeholder={
                        isTertiary
                          ? "e.g., Data Structures"
                          : "e.g., Mathematics"
                      }
                      required
                    />

                    {/* Subject/Course Code */}
                    <FormInput
                      label={isTertiary ? "Course Code" : "Subject Code"}
                      value={subject.code}
                      onChange={(value) =>
                        handleSubjectChange(index, "code", value)
                      }
                      icon={<Hash className="w-2.5 h-2.5" />}
                      placeholder={isTertiary ? "e.g., CSC 201" : "e.g., MATH"}
                      required
                    />

                    {/* Category */}
                    <FormDropdown
                      label="Category"
                      value={subject.category}
                      onChange={(value) =>
                        handleSubjectChange(index, "category", value)
                      }
                      options={categories}
                      icon={<Award className="w-2.5 h-2.5" />}
                      placeholder="Select category"
                      required
                    />

                    {/* Credit Units (Tertiary only) */}
                    {isTertiary && (
                      <FormInput
                        label="Credit Units"
                        value={subject.creditUnits}
                        onChange={(value) =>
                          handleSubjectChange(index, "creditUnits", value)
                        }
                        icon={<Hash className="w-2.5 h-2.5" />}
                        placeholder="e.g., 3"
                        type="number"
                        required
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-gray-50 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                No {isTertiary ? "courses" : "subjects"} added yet
              </p>
              <button
                type="button"
                onClick={handleAddSubject}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add First {isTertiary ? "Course" : "Subject"}
              </button>
            </div>
          )}

          {errors.subjects && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.subjects}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
