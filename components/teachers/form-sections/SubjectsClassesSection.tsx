"use client";

import { useState } from "react";
import {
  BookOpen,
  Users,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";
import TagInput from "@/components/shared/TagInput";
import { ValidationErrors } from "@/lib/validation";

interface SubjectsClassesSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function SubjectsClassesSection({
  formData,
  onChange,
  errors = {},
}: SubjectsClassesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Subjects & Classes
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Subjects taught and classes assigned
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
        <div className="overflow-hidden">
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Subjects Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
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
                  error={errors.subjects}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Start typing to see suggestions, or enter custom subjects
                </p>
              </div>
            </div>

            {/* Classes Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
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
                  error={errors.classes}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Start typing to see suggestions, or enter custom classes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
