"use client";

import { useState, useMemo } from "react";
import {
  GraduationCap,
  ChevronUp,
  Search,
  UserPlus,
  X,
  Check,
  AlertCircle,
  Filter,
} from "lucide-react";
import { ValidationErrors } from "@/lib/validation";
import { useSchoolSettings, EducationLevel } from "@/contexts/SchoolSettingsContext";
import FormDropdown from "@/components/shared/FormDropdown";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  classLevel: string;
  admissionNumber: string;
  profilePhoto?: string;
  educationLevel: EducationLevel; // Added to filter by level
}

interface LinkStudentsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

// Mock student data - In a real app, this would come from an API
const MOCK_STUDENTS: Student[] = [
  // Primary students
  {
    id: "STU001",
    firstName: "James",
    lastName: "Okonkwo",
    classLevel: "Primary 4",
    admissionNumber: "ADM-2024-0001",
    profilePhoto: "https://i.pravatar.cc/150?u=stu001",
    educationLevel: "Primary",
  },
  {
    id: "STU002",
    firstName: "Sarah",
    lastName: "Adebayo",
    classLevel: "Primary 6",
    admissionNumber: "ADM-2024-0002",
    profilePhoto: "https://i.pravatar.cc/150?u=stu002",
    educationLevel: "Primary",
  },
  // Secondary students
  {
    id: "STU003",
    firstName: "Michael",
    lastName: "Eze",
    classLevel: "SSS 1A",
    admissionNumber: "ADM-2024-0003",
    profilePhoto: "https://i.pravatar.cc/150?u=stu003",
    educationLevel: "Secondary",
  },
  {
    id: "STU004",
    firstName: "Grace",
    lastName: "Nnamdi",
    classLevel: "JSS 3C",
    admissionNumber: "ADM-2024-0004",
    profilePhoto: "https://i.pravatar.cc/150?u=stu004",
    educationLevel: "Secondary",
  },
  {
    id: "STU005",
    firstName: "David",
    lastName: "Okafor",
    classLevel: "SSS 2A",
    admissionNumber: "ADM-2024-0005",
    profilePhoto: "https://i.pravatar.cc/150?u=stu005",
    educationLevel: "Secondary",
  },
  {
    id: "STU006",
    firstName: "Blessing",
    lastName: "Amadi",
    classLevel: "JSS 1B",
    admissionNumber: "ADM-2024-0006",
    profilePhoto: "https://i.pravatar.cc/150?u=stu006",
    educationLevel: "Secondary",
  },
  // Tertiary students
  {
    id: "STU007",
    firstName: "Emmanuel",
    lastName: "Chukwu",
    classLevel: "100 Level",
    admissionNumber: "ADM-2024-0007",
    profilePhoto: "https://i.pravatar.cc/150?u=stu007",
    educationLevel: "Tertiary",
  },
  {
    id: "STU008",
    firstName: "Fatima",
    lastName: "Bello",
    classLevel: "200 Level",
    admissionNumber: "ADM-2024-0008",
    profilePhoto: "https://i.pravatar.cc/150?u=stu008",
    educationLevel: "Tertiary",
  },
  {
    id: "STU009",
    firstName: "Chioma",
    lastName: "Okeke",
    classLevel: "300 Level",
    admissionNumber: "ADM-2024-0009",
    profilePhoto: "https://i.pravatar.cc/150?u=stu009",
    educationLevel: "Tertiary",
  },
];

export default function LinkStudentsSection({
  formData,
  onChange,
  errors = {},
}: LinkStudentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | "">("");

  const { settings } = useSchoolSettings();
  const { supportedLevels } = settings;

  const linkedStudentIds: string[] = formData.linkedStudents || [];

  // Build level options based on school's supported levels
  const levelOptions = useMemo(() => {
    return supportedLevels.map((level) => ({
      value: level,
      label: level === "Tertiary"
        ? `${level} (University/College)`
        : level === "Primary"
          ? `${level} (Nursery/Primary)`
          : `${level} (JSS/SSS)`,
    }));
  }, [supportedLevels]);

  // Filter students based on selected level and search query
  const filteredStudents = useMemo(() => {
    // First filter by education level
    let students = selectedLevel
      ? MOCK_STUDENTS.filter((s) => s.educationLevel === selectedLevel)
      : [];

    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      students = students.filter(
        (student) =>
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.classLevel.toLowerCase().includes(query) ||
          student.admissionNumber.toLowerCase().includes(query)
      );
    }

    return students;
  }, [searchQuery, selectedLevel]);

  // Get linked students details
  const linkedStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => linkedStudentIds.includes(s.id));
  }, [linkedStudentIds]);

  // Toggle student selection
  const toggleStudent = (studentId: string) => {
    const newLinkedStudents = linkedStudentIds.includes(studentId)
      ? linkedStudentIds.filter((id) => id !== studentId)
      : [...linkedStudentIds, studentId];
    onChange("linkedStudents", newLinkedStudents);
  };

  // Remove a linked student
  const removeStudent = (studentId: string) => {
    onChange(
      "linkedStudents",
      linkedStudentIds.filter((id) => id !== studentId)
    );
  };

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-emerald-50/50 dark:bg-emerald-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Link Students
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Connect this parent/guardian to students
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {linkedStudentIds.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
              {linkedStudentIds.length} linked
            </span>
          )}
          <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
            <ChevronUp
              className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
            />
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
          <div className="p-4 sm:p-6 space-y-6">
            {/* Info Note */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You can link this parent/guardian to one or more students. This
                can also be done later from the parent details page.
              </p>
            </div>

            {/* Linked Students Display */}
            {linkedStudents.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Linked Students ({linkedStudents.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {linkedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                    >
                      {student.profilePhoto ? (
                        <img
                          src={student.profilePhoto}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                          {student.firstName.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        ({student.classLevel})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeStudent(student.id)}
                        className="p-0.5 rounded hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors cursor-pointer"
                        title="Remove student"
                      >
                        <X className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Select Education Level */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Select Education Level
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                Choose an education level to view and select students
              </p>
              <div className="pl-2">
                <FormDropdown
                  label="Education Level"
                  icon={<GraduationCap className="w-full h-full" />}
                  value={selectedLevel}
                  onChange={(value) => setSelectedLevel(value as EducationLevel | "")}
                  options={levelOptions}
                  placeholder="Select education level first..."
                  required
                />
              </div>
            </div>

            {/* Search Students - Only show when level is selected */}
            {selectedLevel && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Add Students ({selectedLevel})
                </h3>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedLevel.toLowerCase()} students by name, class, or admission number...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#22262e] border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>

              {/* Students List */}
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No students found
                    </p>
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const isLinked = linkedStudentIds.includes(student.id);
                    return (
                      <div
                        key={student.id}
                        onClick={() => toggleStudent(student.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isLinked
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
                            : "bg-white dark:bg-[#1a1d24] border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                            isLinked
                              ? "bg-emerald-600 border-emerald-600"
                              : "border-2 border-gray-300 dark:border-gray-500"
                          }`}
                        >
                          {isLinked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>

                        {/* Avatar */}
                        {student.profilePhoto ? (
                          <img
                            src={student.profilePhoto}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {student.firstName.charAt(0)}
                          </div>
                        )}

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.classLevel} • {student.admissionNumber}
                          </p>
                        </div>

                        {/* Status */}
                        {isLinked && (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                            Linked
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
