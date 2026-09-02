"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  GraduationCap,
  ChevronUp,
  ChevronDown,
  Search,
  Check,
  User,
} from "lucide-react";
import { AdminParent } from "@/lib/mockParents";
import { ParentChild } from "@/types/parent";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Tooltip from "@/components/shared/Tooltip";

interface ParentStudentSelectionSectionProps {
  formData: {
    parentId: string;
    studentId: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
  parents: AdminParent[];
}

export default function ParentStudentSelectionSection({
  formData,
  onChange,
  errors = {},
  parents,
}: ParentStudentSelectionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Dropdown states
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [parentSearch, setParentSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  // Refs for dropdown positioning
  const parentDropdownRef = useRef<HTMLDivElement>(null);
  const studentDropdownRef = useRef<HTMLDivElement>(null);

  // Get selected parent
  const selectedParent = useMemo(() => {
    return parents.find((p) => p.id === formData.parentId);
  }, [parents, formData.parentId]);

  // Get selected student
  const selectedStudent = useMemo(() => {
    if (!selectedParent) return null;
    return selectedParent.children.find((c) => c.id === formData.studentId);
  }, [selectedParent, formData.studentId]);

  // Filter parents based on search
  const filteredParents = useMemo(() => {
    if (!parentSearch) return parents;
    const search = parentSearch.toLowerCase();
    return parents.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        p.phone.includes(search)
    );
  }, [parents, parentSearch]);

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!selectedParent) return [];
    if (!studentSearch) return selectedParent.children;
    const search = studentSearch.toLowerCase();
    return selectedParent.children.filter(
      (c) =>
        c.fullName.toLowerCase().includes(search) ||
        c.admissionNumber.toLowerCase().includes(search) ||
        c.classLevel.toLowerCase().includes(search)
    );
  }, [selectedParent, studentSearch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        parentDropdownRef.current &&
        !parentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsParentDropdownOpen(false);
        setParentSearch("");
      }
      if (
        studentDropdownRef.current &&
        !studentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStudentDropdownOpen(false);
        setStudentSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleParentSelect = (parentId: string) => {
    onChange("parentId", parentId);
    onChange("studentId", ""); // Reset student when parent changes
    setIsParentDropdownOpen(false);
    setParentSearch("");
  };

  const handleStudentSelect = (studentId: string) => {
    onChange("studentId", studentId);
    setIsStudentDropdownOpen(false);
    setStudentSearch("");
  };

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Parent & Student Selection
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Select the parent and student for this fee record
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
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7">
              {/* Parent Selection */}
              <div className="group" data-field="parentId" ref={parentDropdownRef}>
                <Tooltip content="Parent">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5 cursor-help">
                    <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                      <div className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                        <User className="w-full h-full" />
                      </div>
                    </div>
                    <span>Parent</span>
                    <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                  </label>
                </Tooltip>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsParentDropdownOpen(!isParentDropdownOpen)}
                    className={`appearance-none w-full min-h-[46px] text-sm font-normal bg-surface ${
                      errors.parentId
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                    } hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 py-2.5 pr-10 outline-none focus:ring-2 transition-all duration-200 border text-left cursor-pointer`}
                  >
                    {selectedParent ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-[#2a2d35] flex-shrink-0">
                          <Image
                            src={
                              selectedParent.profilePhoto ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                `${selectedParent.firstName} ${selectedParent.lastName}`
                              )}&background=random`
                            }
                            alt={`${selectedParent.firstName} ${selectedParent.lastName}`}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {`${selectedParent.firstName} ${selectedParent.lastName}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {selectedParent.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400/70 dark:text-gray-500/70 midnight:text-cyan-400/50 purple:text-pink-400/50 italic font-normal">
                        Select a parent
                      </span>
                    )}
                  </button>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none transition-transform ${
                      isParentDropdownOpen ? "rotate-180" : ""
                    }`}
                  />

                  {/* Parent Dropdown */}
                  {isParentDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-surface rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl max-h-80 overflow-hidden">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search parents..."
                            value={parentSearch}
                            onChange={(e) => setParentSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#22262e] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {filteredParents.length > 0 ? (
                          filteredParents.map((parent) => (
                            <button
                              key={parent.id}
                              type="button"
                              onClick={() => handleParentSelect(parent.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#22262e] transition-colors cursor-pointer ${
                                formData.parentId === parent.id
                                  ? "bg-blue-50 dark:bg-blue-900/20"
                                  : ""
                              }`}
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#2a2d35] flex-shrink-0">
                                <Image
                                  src={
                                    parent.profilePhoto ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      `${parent.firstName} ${parent.lastName}`
                                    )}&background=random`
                                  }
                                  alt={`${parent.firstName} ${parent.lastName}`}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {`${parent.firstName} ${parent.lastName}`}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {parent.email} | {parent.children.length} child
                                  {parent.children.length !== 1 ? "ren" : ""}
                                </p>
                              </div>
                              {formData.parentId === parent.id && (
                                <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No parents found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <ErrorMessage message={errors.parentId} />
              </div>

              {/* Student Selection */}
              <div className="group" data-field="studentId" ref={studentDropdownRef}>
                <Tooltip content="Student">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5 cursor-help">
                    <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                      <div className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                        <GraduationCap className="w-full h-full" />
                      </div>
                    </div>
                    <span>Student</span>
                    <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                  </label>
                </Tooltip>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedParent) {
                        setIsStudentDropdownOpen(!isStudentDropdownOpen);
                      }
                    }}
                    disabled={!selectedParent}
                    className={`appearance-none w-full min-h-[46px] text-sm font-normal bg-surface ${
                      errors.studentId
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                    } ${
                      selectedParent
                        ? "hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
                        : "opacity-60 cursor-not-allowed"
                    } focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 py-2.5 pr-10 outline-none focus:ring-2 transition-all duration-200 border text-left`}
                  >
                    {selectedStudent ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-[#2a2d35] flex-shrink-0">
                          <Image
                            src={
                              selectedStudent.profilePhoto ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                selectedStudent.fullName
                              )}&background=random`
                            }
                            alt={selectedStudent.fullName}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {selectedStudent.fullName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {selectedStudent.classLevel} | {selectedStudent.admissionNumber}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400/70 dark:text-gray-500/70 midnight:text-cyan-400/50 purple:text-pink-400/50 italic font-normal">
                        {selectedParent ? "Select a student" : "Select a parent first"}
                      </span>
                    )}
                  </button>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none transition-transform ${
                      isStudentDropdownOpen ? "rotate-180" : ""
                    }`}
                  />

                  {/* Student Dropdown */}
                  {isStudentDropdownOpen && selectedParent && (
                    <div className="absolute z-50 w-full mt-1 bg-surface rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl max-h-80 overflow-hidden">
                      {selectedParent.children.length > 3 && (
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search students..."
                              value={studentSearch}
                              onChange={(e) => setStudentSearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#22262e] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              autoFocus
                            />
                          </div>
                        </div>
                      )}
                      <div className="max-h-56 overflow-y-auto">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <button
                              key={student.id}
                              type="button"
                              onClick={() => handleStudentSelect(student.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#22262e] transition-colors cursor-pointer ${
                                formData.studentId === student.id
                                  ? "bg-blue-50 dark:bg-blue-900/20"
                                  : ""
                              }`}
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#2a2d35] flex-shrink-0">
                                <Image
                                  src={
                                    student.profilePhoto ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      student.fullName
                                    )}&background=random`
                                  }
                                  alt={student.fullName}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {student.fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {student.classLevel} | {student.admissionNumber}
                                </p>
                              </div>
                              {formData.studentId === student.id && (
                                <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No students found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <ErrorMessage message={errors.studentId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
