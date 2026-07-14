"use client";

import { useState, useCallback } from "react";
import { Trash2, Users2, User, School, ChevronDown, ChevronUp, GraduationCap, MapPin, Plus } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import { ValidationErrors } from "@/lib/validation";

interface SiblingAtSchool {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
}

interface SiblingAtOtherSchool {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  schoolName: string;
  schoolAddress: string;
}

interface FormData {
  siblingsAtSchool: SiblingAtSchool[];
  siblingsAtOtherSchools: SiblingAtOtherSchool[];
}

interface SiblingsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  currentStudentId?: string; // ID of the current student being edited (to exclude from sibling list)
  errors?: ValidationErrors;
}

export default function SiblingsSection({
  formData,
  onChange,
  currentStudentId,
  errors = {},
}: SiblingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentsCache, setStudentsCache] = useState<Record<string, { firstName: string; lastName: string; class: string }>>({});

  const siblingsAtSchool: SiblingAtSchool[] = formData.siblingsAtSchool || [];
  const siblingsAtOtherSchools: SiblingAtOtherSchool[] = formData.siblingsAtOtherSchools || [];

  // Get already selected student IDs to exclude
  const excludeIds = [
    ...siblingsAtSchool.map((s) => s.studentId),
    ...(currentStudentId ? [currentStudentId] : []),
  ];

  // Async search function for fetching students
  const searchStudents = useCallback(
    async (searchQuery: string): Promise<Array<{ value: string; label: string; firstName?: string; lastName?: string; class?: string }>> => {
      setIsLoadingStudents(true);
      try {
        const params = new URLSearchParams({
          query: searchQuery,
          excludeIds: excludeIds.join(","),
          currentStudentId: currentStudentId || "",
          limit: "50",
        });

        const response = await fetch(`/api/students/search?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.students || !Array.isArray(data.students)) {
          console.warn("Invalid response format from API");
          return [];
        }
        
        // Cache student details for later use
        const cache: Record<string, { firstName: string; lastName: string; class: string }> = {};
        data.students.forEach((student: any) => {
          if (student.firstName && student.lastName && student.class) {
            cache[student.value] = {
              firstName: student.firstName,
              lastName: student.lastName,
              class: student.class,
            };
          }
        });
        setStudentsCache((prev) => ({ ...prev, ...cache }));

        return data.students;
      } catch (error) {
        console.error("Error searching students:", error);
        // Return empty array instead of throwing to prevent UI breaking
        return [];
      } finally {
        setIsLoadingStudents(false);
      }
    },
    [excludeIds, currentStudentId]
  );

  const handleSiblingSelection = async (studentId: string) => {
    if (!studentId) return;

    // Check if sibling is already added
    if (siblingsAtSchool.some((s) => s.studentId === studentId)) {
      return;
    }

    // Get student details from cache
    let studentDetails = studentsCache[studentId];
    
    // If not in cache, fetch by searching for this specific student
    if (!studentDetails) {
      const results = await searchStudents("");
      const found = results.find((s) => s.value === studentId);
      
      if (found && found.firstName && found.lastName && found.class) {
        studentDetails = {
          firstName: found.firstName,
          lastName: found.lastName,
          class: found.class,
        };
        // Update cache
        setStudentsCache((prev) => ({
          ...prev,
          [studentId]: studentDetails,
        }));
      } else {
        console.error("Student details not found");
        return;
      }
    }

    const newSibling: SiblingAtSchool = {
      id: Date.now().toString(),
      studentId: studentId,
      firstName: studentDetails.firstName,
      lastName: studentDetails.lastName,
      class: studentDetails.class,
    };

    onChange("siblingsAtSchool", [...siblingsAtSchool, newSibling]);
    setSelectedStudentId(""); // Reset dropdown
  };

  const removeSiblingAtSchool = (id: string) => {
    onChange(
      "siblingsAtSchool",
      siblingsAtSchool.filter((s) => s.id !== id)
    );
  };

  const addSiblingAtOtherSchool = () => {
    const newSibling: SiblingAtOtherSchool = {
      id: Date.now().toString(),
      firstName: "",
      lastName: "",
      middleName: "",
      schoolName: "",
      schoolAddress: "",
    };
    onChange("siblingsAtOtherSchools", [...siblingsAtOtherSchools, newSibling]);
  };

  const removeSiblingAtOtherSchool = (id: string) => {
    onChange(
      "siblingsAtOtherSchools",
      siblingsAtOtherSchools.filter((s) => s.id !== id)
    );
  };

  const updateSiblingAtOtherSchool = (id: string, field: keyof SiblingAtOtherSchool, value: string) => {
    onChange(
      "siblingsAtOtherSchools",
      siblingsAtOtherSchools.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-green-50/50 dark:bg-green-900/10 midnight:bg-green-900/10 purple:bg-green-900/10 hover:bg-green-50 dark:hover:bg-green-900/20 midnight:hover:bg-green-900/20 purple:hover:bg-green-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 flex items-center justify-center">
            <Users2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Siblings Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Add siblings at this school or other schools
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
          {/* Siblings at This School */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <School className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Siblings at This School
              </h3>
            </div>

            {/* Dropdown to Select Sibling and Table Side by Side */}
            <div className="pl-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Dropdown Field */}
                <div className="flex-1">
                  <SearchableDropdown
                    label="Select Sibling"
                    icon={<User className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30"
                    iconColor="text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400"
                    value={selectedStudentId}
                    onChange={(value) => {
                      handleSiblingSelection(value);
                    }}
                    onSearch={searchStudents}
                    placeholder="Click to search for a sibling"
                    searchPlaceholder="Search by name, student ID, or class (min 2 characters)..."
                    excludeIds={excludeIds}
                    loading={isLoadingStudents}
                  />
                </div>

                {/* List of Selected Siblings */}
                <div className="flex-1">
                  {siblingsAtSchool.length > 0 ? (
                    <div className="border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg overflow-hidden overflow-x-auto">
                      <table className="w-full">
                        {/* Table Header */}
                        <thead>
                          <tr className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                            <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider px-4 py-3">
                              First Name
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider px-4 py-3">
                              Last Name
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider px-4 py-3">
                              Class
                            </th>
                            <th className="text-right text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider px-4 py-3">
                              Action
                            </th>
                          </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/20 purple:divide-pink-500/20">
                          {siblingsAtSchool.map((sibling) => (
                            <tr
                              key={sibling.id}
                              className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] hover:bg-gray-50 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors"
                            >
                              <td className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 px-4 py-3">
                                {sibling.firstName}
                              </td>
                              <td className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 px-4 py-3">
                                {sibling.lastName}
                              </td>
                              <td className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 px-4 py-3">
                                {sibling.class}
                              </td>
                              <td className="text-right px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => removeSiblingAtSchool(sibling.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 midnight:hover:bg-red-900/30 purple:hover:bg-red-900/30 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 font-medium text-xs transition-all duration-200 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                        No siblings at this school added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Siblings at Other Schools */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/20 midnight:bg-teal-900/20 purple:bg-teal-900/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Siblings at Other Schools
              </h3>
            </div>

            <div className="pl-2 space-y-4">
              {siblingsAtOtherSchools.length > 0 ? (
                <div className="space-y-6">
                  {siblingsAtOtherSchools.map((sibling, index) => (
                    <div
                      key={sibling.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-sm"
                    >
                      {/* Sibling Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-teal-100 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400" />
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                            Sibling {index + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSiblingAtOtherSchool(sibling.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 midnight:hover:bg-red-900/30 purple:hover:bg-red-900/30 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 font-medium text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 mb-4">
                        <FormInput
                          label="First Name"
                          icon={<User className="w-full h-full" />}
                          iconBgColor="bg-teal-100 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30"
                          iconColor="text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400"
                          value={sibling.firstName}
                          onChange={(value) => updateSiblingAtOtherSchool(sibling.id, "firstName", value)}
                          placeholder="Enter first name"
                          type="text"
                        />
                        <FormInput
                          label="Last Name"
                          icon={<User className="w-full h-full" />}
                          iconBgColor="bg-teal-100 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30"
                          iconColor="text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400"
                          value={sibling.lastName}
                          onChange={(value) => updateSiblingAtOtherSchool(sibling.id, "lastName", value)}
                          placeholder="Enter last name"
                          type="text"
                        />
                        <FormInput
                          label="Middle Name"
                          icon={<User className="w-full h-full" />}
                          iconBgColor="bg-teal-100 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30"
                          iconColor="text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400"
                          value={sibling.middleName}
                          onChange={(value) => updateSiblingAtOtherSchool(sibling.id, "middleName", value)}
                          placeholder="Enter middle name"
                          type="text"
                        />
                      </div>

                      {/* School Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7">
                        <FormInput
                          label="School Name"
                          icon={<School className="w-full h-full" />}
                          iconBgColor="bg-teal-100 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30"
                          iconColor="text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400"
                          value={sibling.schoolName}
                          onChange={(value) => updateSiblingAtOtherSchool(sibling.id, "schoolName", value)}
                          placeholder="Enter school name"
                          type="text"
                        />
                        <FormInput
                          label="School Address"
                          icon={<MapPin className="w-full h-full" />}
                          iconBgColor="bg-teal-100 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30"
                          iconColor="text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400"
                          value={sibling.schoolAddress}
                          onChange={(value) => updateSiblingAtOtherSchool(sibling.id, "schoolAddress", value)}
                          placeholder="Enter school address"
                          type="text"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-4">
                    No siblings at other schools added yet
                  </p>
                </div>
              )}

              {/* Add Sibling at Other School Button */}
              <button
                type="button"
                onClick={addSiblingAtOtherSchool}
                className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-teal-300 dark:border-teal-600 midnight:border-teal-500/50 purple:border-teal-500/50 bg-teal-50 dark:bg-teal-900/20 midnight:bg-teal-900/20 purple:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 midnight:hover:bg-teal-900/30 purple:hover:bg-teal-900/30 hover:border-teal-400 dark:hover:border-teal-500 midnight:hover:border-teal-500 purple:hover:border-teal-500 text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 midnight:hover:text-teal-300 purple:hover:text-teal-300 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <GraduationCap className="w-4 h-4" />
                Add Sibling at Other School
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
