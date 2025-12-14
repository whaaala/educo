"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { FormSection } from "@/components/shared/FormWizard";
import {
  UserPlus,
  User,
  Calendar,
  BookOpen,
  GraduationCap,
  Briefcase,
  School,
  CheckCircle2,
  Loader2,
  Search,
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  ArrowRight,
  Settings,
  AlertCircle,
} from "lucide-react";
import type { LibraryMember, BorrowerType } from "@/types/library";
import { useSchoolSettings, EducationLevel as ContextEducationLevel } from "@/contexts/SchoolSettingsContext";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memberData: Omit<LibraryMember, "id" | "createdAt" | "updatedAt">) => void;
  isAdding?: boolean;
}

interface FormData {
  type: BorrowerType;
  name: string;
  email: string;
  phone: string;
  class: string;
  department: string;
  maxBooksAllowed: number;
  expiryDate: string;
}

// Education level type for filtering (lowercase for internal use)
type EducationLevel = "primary" | "secondary" | "tertiary";

// All possible education levels for mapping
const ALL_EDUCATION_LEVELS: { value: EducationLevel; label: string; contextLevel: ContextEducationLevel }[] = [
  { value: "primary", label: "Primary School", contextLevel: "Primary" },
  { value: "secondary", label: "Secondary School", contextLevel: "Secondary" },
  { value: "tertiary", label: "University / College", contextLevel: "Tertiary" },
];

// Mock existing people who are not yet library members (students, teachers, staff)
const MOCK_PEOPLE = {
  students: [
    { id: "std-new-1", name: "Adaobi Nnamdi", email: "adaobi.n@school.edu", phone: "08011111111", class: "Primary 5A", avatarUrl: "https://randomuser.me/api/portraits/women/21.jpg" },
    { id: "std-new-2", name: "Kelechi Onyema", email: "kelechi.o@school.edu", phone: "08022222222", class: "Primary 6B", avatarUrl: "https://randomuser.me/api/portraits/men/23.jpg" },
    { id: "std-new-3", name: "Zainab Bello", email: "zainab.b@school.edu", phone: "08033333333", class: "JSS 1A", avatarUrl: "https://randomuser.me/api/portraits/women/25.jpg" },
    { id: "std-new-4", name: "Chisom Okafor", email: "chisom.o@school.edu", phone: "08044444444", class: "JSS 2B", avatarUrl: "https://randomuser.me/api/portraits/men/27.jpg" },
    { id: "std-new-5", name: "Tope Adeyemi", email: "tope.a@school.edu", phone: "08055555555", class: "JSS 3C", avatarUrl: "https://randomuser.me/api/portraits/women/29.jpg" },
    { id: "std-new-6", name: "Emeka Uzoma", email: "emeka.u@school.edu", phone: "08066666666", class: "SSS 1A", avatarUrl: "https://randomuser.me/api/portraits/men/31.jpg" },
    { id: "std-new-7", name: "Folake Bakare", email: "folake.b@school.edu", phone: "08077777777", class: "SSS 2B", avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: "std-new-8", name: "Yusuf Abdullahi", email: "yusuf.a@school.edu", phone: "08088888888", class: "SSS 3A", avatarUrl: "https://randomuser.me/api/portraits/men/35.jpg" },
    { id: "std-new-9", name: "Halima Sani", email: "halima.s@university.edu", phone: "08099999999", class: "100 Level - Computer Science", avatarUrl: "https://randomuser.me/api/portraits/women/37.jpg" },
    { id: "std-new-10", name: "Obinna Eze", email: "obinna.e@university.edu", phone: "08100000000", class: "200 Level - Engineering", avatarUrl: "https://randomuser.me/api/portraits/men/39.jpg" },
  ],
  teachers: [
    { id: "tch-new-1", name: "Mr. Olayinka Ajayi", email: "o.ajayi@school.edu", phone: "08011112222", department: "Mathematics", avatarUrl: "https://randomuser.me/api/portraits/men/41.jpg" },
    { id: "tch-new-2", name: "Mrs. Amaka Okwu", email: "a.okwu@school.edu", phone: "08022223333", department: "Science", avatarUrl: "https://randomuser.me/api/portraits/women/43.jpg" },
    { id: "tch-new-3", name: "Dr. Hassan Yusuf", email: "h.yusuf@school.edu", phone: "08033334444", department: "History", avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg" },
    { id: "tch-new-4", name: "Miss Funmilayo Ade", email: "f.ade@school.edu", phone: "08044445555", department: "English", avatarUrl: "https://randomuser.me/api/portraits/women/47.jpg" },
  ],
  staff: [
    { id: "stf-new-1", name: "Mr. Chukwu Nwachukwu", email: "c.nwachukwu@school.edu", phone: "08055556666", department: "Administration", avatarUrl: "https://randomuser.me/api/portraits/men/49.jpg" },
    { id: "stf-new-2", name: "Mrs. Aisha Lawal", email: "a.lawal@school.edu", phone: "08066667777", department: "Finance", avatarUrl: "https://randomuser.me/api/portraits/women/51.jpg" },
    { id: "stf-new-3", name: "Mr. Sunday Okonkwo", email: "s.okonkwo@school.edu", phone: "08077778888", department: "IT", avatarUrl: "https://randomuser.me/api/portraits/men/53.jpg" },
  ],
};

// Class options based on education level
const CLASS_OPTIONS: Record<EducationLevel, { value: string; label: string }[]> = {
  primary: [
    { value: "", label: "Select class" },
    { value: "Primary 1", label: "Primary 1" },
    { value: "Primary 2", label: "Primary 2" },
    { value: "Primary 3", label: "Primary 3" },
    { value: "Primary 4", label: "Primary 4" },
    { value: "Primary 5", label: "Primary 5" },
    { value: "Primary 6", label: "Primary 6" },
  ],
  secondary: [
    { value: "", label: "Select class" },
    { value: "JSS 1", label: "JSS 1" },
    { value: "JSS 2", label: "JSS 2" },
    { value: "JSS 3", label: "JSS 3" },
    { value: "SSS 1", label: "SSS 1" },
    { value: "SSS 2", label: "SSS 2" },
    { value: "SSS 3", label: "SSS 3" },
  ],
  tertiary: [
    { value: "", label: "Select level" },
    { value: "100 Level", label: "100 Level" },
    { value: "200 Level", label: "200 Level" },
    { value: "300 Level", label: "300 Level" },
    { value: "400 Level", label: "400 Level" },
    { value: "500 Level", label: "500 Level" },
    { value: "600 Level", label: "600 Level" },
    { value: "Postgraduate", label: "Postgraduate" },
  ],
};

// Department options
const DEPARTMENT_OPTIONS = [
  { value: "", label: "Select department" },
  { value: "Science", label: "Science" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "English", label: "English" },
  { value: "History", label: "History" },
  { value: "Geography", label: "Geography" },
  { value: "Art", label: "Art" },
  { value: "Music", label: "Music" },
  { value: "Physical Education", label: "Physical Education" },
  { value: "Administration", label: "Administration" },
  { value: "Finance", label: "Finance" },
  { value: "IT", label: "IT" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Other", label: "Other" },
];

// Max books options
const MAX_BOOKS_OPTIONS = [
  { value: "1", label: "1 Book" },
  { value: "2", label: "2 Books" },
  { value: "3", label: "3 Books" },
  { value: "4", label: "4 Books" },
  { value: "5", label: "5 Books" },
  { value: "6", label: "6 Books" },
  { value: "7", label: "7 Books" },
  { value: "8", label: "8 Books" },
  { value: "9", label: "9 Books" },
  { value: "10", label: "10 Books" },
];

const INITIAL_FORM_DATA: FormData = {
  type: "student",
  name: "",
  email: "",
  phone: "",
  class: "",
  department: "",
  maxBooksAllowed: 3,
  expiryDate: "",
};

type Step = "category" | "personnel-type" | "person" | "settings";
type MemberCategory = "student" | "personnel";

export default function AddMemberModal({
  isOpen,
  onClose,
  onAdd,
  isAdding = false,
}: AddMemberModalProps) {
  // Get tenant/school settings
  const { settings } = useSchoolSettings();

  // Current step
  const [currentStep, setCurrentStep] = useState<Step>("category");

  // Member category (student or personnel)
  const [selectedCategory, setSelectedCategory] = useState<MemberCategory | null>(null);

  // Form data
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Person selection
  const [selectedPerson, setSelectedPerson] = useState<typeof MOCK_PEOPLE.students[0] | null>(null);
  const [personSearchQuery, setPersonSearchQuery] = useState("");
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);
  const [showPeopleList, setShowPeopleList] = useState(false);

  // Filter states for students
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EducationLevel | "">("");
  const [selectedClass, setSelectedClass] = useState("");

  // Generate filtered education levels based on tenant settings
  const filteredEducationLevels = useMemo(() => {
    const levels: { value: EducationLevel | ""; label: string }[] = [
      { value: "", label: "Select education level" },
    ];

    ALL_EDUCATION_LEVELS.forEach((level) => {
      if (settings.supportedLevels.includes(level.contextLevel)) {
        levels.push({ value: level.value, label: level.label });
      }
    });

    return levels;
  }, [settings.supportedLevels]);

  // Check if only one education level is supported (auto-select scenario)
  const hasSingleEducationLevel = filteredEducationLevels.length === 2;
  const singleEducationLevel = hasSingleEducationLevel
    ? (filteredEducationLevels[1]?.value as EducationLevel)
    : null;

  // Determine institution type based on supported levels
  const hasTertiaryLevel = settings.supportedLevels.includes("Tertiary");
  const isTertiaryOnly = settings.supportedLevels.length === 1 && hasTertiaryLevel;
  const isPrimarySecondaryOnly = settings.supportedLevels.every(level => level === "Primary" || level === "Secondary");

  // Helper function to determine education level from class string
  const getEducationLevelFromClass = (classStr: string): EducationLevel | null => {
    if (!classStr) return null;
    const lowerClass = classStr.toLowerCase();
    if (lowerClass.includes("primary")) return "primary";
    if (lowerClass.includes("jss") || lowerClass.includes("sss")) return "secondary";
    if (lowerClass.includes("level") || lowerClass.includes("postgraduate")) return "tertiary";
    return null;
  };

  // Filter people based on type, education level, class, and search
  const filteredPeople = useMemo(() => {
    let people: typeof MOCK_PEOPLE.students = [];

    if (formData.type === "student") {
      people = [...MOCK_PEOPLE.students];

      if (selectedEducationLevel) {
        people = people.filter((person) => {
          const personLevel = getEducationLevelFromClass(person.class || "");
          return personLevel === selectedEducationLevel;
        });

        if (selectedClass) {
          people = people.filter((person) =>
            person.class?.toLowerCase().includes(selectedClass.toLowerCase())
          );
        }
      }
    } else if (formData.type === "teacher") {
      people = MOCK_PEOPLE.teachers.map((t) => ({ ...t, class: "" }));
    } else if (formData.type === "staff") {
      people = MOCK_PEOPLE.staff.map((s) => ({ ...s, class: "" }));
    }

    if (personSearchQuery.trim()) {
      const query = personSearchQuery.toLowerCase();
      people = people.filter(
        (person) =>
          person.name.toLowerCase().includes(query) ||
          person.email?.toLowerCase().includes(query) ||
          person.class?.toLowerCase().includes(query) ||
          (person as any).department?.toLowerCase().includes(query)
      );
    }

    return people;
  }, [formData.type, selectedEducationLevel, selectedClass, personSearchQuery]);

  // Default max books based on type
  const getDefaultMaxBooks = (type: BorrowerType): number => {
    switch (type) {
      case "student":
        return 3;
      case "teacher":
        return 5;
      case "staff":
        return 4;
      default:
        return 3;
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      setFormData({
        ...INITIAL_FORM_DATA,
        expiryDate: expiryDate.toISOString().split("T")[0],
      });
      setSelectedPerson(null);
      setSelectedCategory(null);
      setPersonSearchQuery("");
      setErrors({});
      setSelectedEducationLevel("");
      setSelectedClass("");
      setShowPeopleList(false);
      setCurrentStep("category");
    }
  }, [isOpen]);

  // Auto-select education level when student is selected and only one level is supported
  useEffect(() => {
    if (formData.type === "student" && hasSingleEducationLevel && singleEducationLevel) {
      setSelectedEducationLevel(singleEducationLevel);
    }
  }, [formData.type, hasSingleEducationLevel, singleEducationLevel]);

  // Reset class when education level changes
  useEffect(() => {
    setSelectedClass("");
  }, [selectedEducationLevel]);

  // Simulate loading people when filters change
  useEffect(() => {
    if (currentStep === "person") {
      if (formData.type !== "student" || selectedEducationLevel) {
        setIsLoadingPeople(true);
        const timer = setTimeout(() => {
          setIsLoadingPeople(false);
          setShowPeopleList(true);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, formData.type, selectedEducationLevel, selectedClass]);

  // Handle category selection (Student or Personnel)
  const handleSelectCategory = (category: MemberCategory) => {
    setSelectedCategory(category);
    if (category === "student") {
      setFormData((prev) => ({
        ...prev,
        type: "student",
        maxBooksAllowed: getDefaultMaxBooks("student"),
        class: "",
        department: "",
      }));
      setCurrentStep("person");
    } else {
      // Personnel - show personnel type selection
      setCurrentStep("personnel-type");
    }
    setSelectedPerson(null);
    setSelectedEducationLevel("");
    setSelectedClass("");
    setPersonSearchQuery("");
  };

  // Handle personnel type selection (Teacher or Staff)
  const handleSelectPersonnelType = (type: BorrowerType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      maxBooksAllowed: getDefaultMaxBooks(type),
      class: "",
      department: "",
    }));
    setSelectedPerson(null);
    setPersonSearchQuery("");
    setCurrentStep("person");
  };

  const handleSelectPerson = (person: typeof MOCK_PEOPLE.students[0]) => {
    setSelectedPerson(person);
    setFormData((prev) => ({
      ...prev,
      name: person.name,
      email: person.email,
      phone: person.phone,
      class: person.class || "",
      department: (person as any).department || "",
    }));
    setErrors({});
    setCurrentStep("settings");
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!selectedPerson) {
      newErrors.name = "Please select a person";
    }

    if (formData.type === "student" && !formData.class) {
      newErrors.class = "Class is required for students";
    }

    if ((formData.type === "teacher" || formData.type === "staff") && !formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !selectedPerson) return;

    const memberId = `LIB-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
    const memberSince = new Date().toISOString().split("T")[0];

    const memberData: Omit<LibraryMember, "id" | "createdAt" | "updatedAt"> = {
      memberId,
      type: formData.type,
      personId: selectedPerson.id,
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      class: formData.type === "student" ? formData.class : undefined,
      department: formData.type !== "student" ? formData.department : undefined,
      avatarUrl: selectedPerson.avatarUrl,
      isActive: true,
      maxBooksAllowed: formData.maxBooksAllowed,
      currentBooksCount: 0,
      totalBorrowedCount: 0,
      finesDue: 0,
      memberSince,
      expiryDate: formData.expiryDate || undefined,
    };

    onAdd(memberData);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedPerson(null);
    setSelectedCategory(null);
    setPersonSearchQuery("");
    setErrors({});
    setSelectedEducationLevel("");
    setSelectedClass("");
    setShowPeopleList(false);
    setCurrentStep("category");
    onClose();
  };

  const goBack = () => {
    if (currentStep === "settings") {
      setCurrentStep("person");
    } else if (currentStep === "person") {
      if (selectedCategory === "personnel") {
        setCurrentStep("personnel-type");
      } else {
        setCurrentStep("category");
        setSelectedCategory(null);
      }
      setSelectedPerson(null);
      setSelectedEducationLevel("");
      setSelectedClass("");
    } else if (currentStep === "personnel-type") {
      setCurrentStep("category");
      setSelectedCategory(null);
    }
  };

  const getMemberTypeIcon = (type: BorrowerType) => {
    switch (type) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "teacher":
        return <School className="w-4 h-4" />;
      case "staff":
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const getMemberTypeBadge = (type: BorrowerType) => {
    const styles = {
      student: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      teacher: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
      staff: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    };

    // Use "Lecturer" for tertiary institutions
    const getTypeLabel = (t: BorrowerType) => {
      if (t === "teacher" && hasTertiaryLevel) return "Lecturer";
      return t.charAt(0).toUpperCase() + t.slice(1);
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[type]}`}>
        {getMemberTypeIcon(type)}
        {getTypeLabel(type)}
      </span>
    );
  };

  // Generate personnel type options based on tenant settings
  const personnelTypeOptions = useMemo(() => {
    const options: { type: BorrowerType; label: string; description: string; icon: typeof School }[] = [];

    // Teacher/Lecturer option - "Lecturer" for tertiary institutions, "Teacher" for primary/secondary
    if (hasTertiaryLevel) {
      options.push({
        type: "teacher",
        label: "Lecturer",
        description: "Academic/teaching staff",
        icon: School,
      });
    } else {
      options.push({
        type: "teacher",
        label: "Teacher",
        description: "Teaching staff member",
        icon: School,
      });
    }

    // Staff option - always available
    options.push({
      type: "staff",
      label: "Staff",
      description: "Non-teaching staff",
      icon: Briefcase,
    });

    return options;
  }, [hasTertiaryLevel]);

  // Step indicator component - same pattern as IssueLoanModal
  const StepIndicator = () => {
    // Build steps dynamically based on whether personnel is selected
    const steps: { key: Step; label: string; icon: typeof Users; completed: boolean }[] = [
      { key: "category", label: "Category", icon: Users, completed: !!selectedCategory },
    ];

    if (selectedCategory === "personnel") {
      steps.push({
        key: "personnel-type",
        label: "Type",
        icon: Briefcase,
        completed: currentStep === "person" || currentStep === "settings",
      });
    }

    steps.push({
      key: "person",
      label: "Person",
      icon: User,
      completed: !!selectedPerson,
    });
    steps.push({
      key: "settings",
      label: "Settings",
      icon: Settings,
      completed: false,
    });

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : step.completed
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}>
                {step.completed && !isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Get modal subtitle based on current step
  const getModalSubtitle = () => {
    switch (currentStep) {
      case "category":
        return "Select member category";
      case "personnel-type":
        return "Select personnel type";
      case "person":
        return formData.type === "student"
          ? "Select a student"
          : formData.type === "teacher"
            ? hasTertiaryLevel ? "Select a lecturer" : "Select a teacher"
            : "Select a staff member";
      case "settings":
        return "Configure membership settings";
      default:
        return "Register a new library member";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Library Member"
      subtitle={getModalSubtitle()}
      icon={<UserPlus className="w-5 h-5" />}
      maxWidth="2xl"
      footer={
        <div className="flex justify-between w-full">
          <div>
            {currentStep !== "category" && (
              <Button variant="ghost" onClick={goBack} disabled={isAdding}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={isAdding}>
              Cancel
            </Button>
            {currentStep === "settings" && (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isAdding || !selectedPerson}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <StepIndicator />

        {/* Step 1: Category Selection */}
        {currentStep === "category" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student Option */}
              <button
                onClick={() => handleSelectCategory("student")}
                className="group relative p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg text-left border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Student</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isTertiaryOnly ? "University/college student" : isPrimarySecondaryOnly ? "School student" : "School/university student"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0 mt-2" />
                </div>
              </button>

              {/* Personnel Option */}
              <button
                onClick={() => handleSelectCategory("personnel")}
                className="group relative p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg text-left border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Personnel</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {hasTertiaryLevel ? "Lecturers & staff members" : "Teachers & staff members"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-2" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2 (for Personnel): Select personnel type */}
        {currentStep === "personnel-type" && (
          <div className="space-y-4">
            {/* Category Badge */}
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                <Users className="w-3.5 h-3.5" />
                Personnel
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personnelTypeOptions.map((option) => {
                const Icon = option.icon;
                const isCyan = option.type === "teacher";
                return (
                  <button
                    key={option.type}
                    onClick={() => handleSelectPersonnelType(option.type)}
                    className={`group relative p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg text-left border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
                      isCyan
                        ? "hover:border-cyan-400 dark:hover:border-cyan-600"
                        : "hover:border-orange-400 dark:hover:border-orange-600"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        isCyan
                          ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{option.label}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-colors flex-shrink-0 mt-2 ${
                        isCyan ? "group-hover:text-cyan-500" : "group-hover:text-orange-500"
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Person Selection */}
        {currentStep === "person" && (
          <div className="space-y-4">
            {/* Type Badge */}
            <div className="flex items-center justify-center">
              {getMemberTypeBadge(formData.type)}
            </div>

            {/* Filters for students */}
            {formData.type === "student" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!hasSingleEducationLevel && (
                  <FormDropdown
                    label="Education Level"
                    icon={<Building2 className="w-full h-full" />}
                    value={selectedEducationLevel}
                    onChange={(val) => setSelectedEducationLevel(val as EducationLevel | "")}
                    options={filteredEducationLevels}
                    iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                    required
                  />
                )}
                {selectedEducationLevel && (
                  <FormDropdown
                    label={selectedEducationLevel === "tertiary" ? "Level" : "Class"}
                    icon={<GraduationCap className="w-full h-full" />}
                    value={selectedClass}
                    onChange={(val) => setSelectedClass(val)}
                    options={CLASS_OPTIONS[selectedEducationLevel]}
                    iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                  />
                )}
              </div>
            )}

            {/* Show auto-selected education level info for single-level schools */}
            {formData.type === "student" && hasSingleEducationLevel && selectedEducationLevel && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {filteredEducationLevels.find(l => l.value === selectedEducationLevel)?.label}
                </span>
              </div>
            )}

            {/* Search */}
            {(formData.type !== "student" || selectedEducationLevel) && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={personSearchQuery}
                  onChange={(e) => setPersonSearchQuery(e.target.value)}
                  placeholder={`Search ${formData.type === "teacher" && hasTertiaryLevel ? "lecturer" : formData.type}s by name, email...`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                />
              </div>
            )}

            {/* People list */}
            {isLoadingPeople ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">Loading...</span>
              </div>
            ) : formData.type === "student" && !selectedEducationLevel ? (
              <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select an education level to see available students
                </p>
              </div>
            ) : showPeopleList && filteredPeople.length > 0 ? (
              <div className="max-h-[320px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
                {filteredPeople.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => handleSelectPerson(person)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all text-left cursor-pointer group"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <Image
                        src={person.avatarUrl || ""}
                        alt={person.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {person.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {person.class || (person as any).department} {person.email && `• ${person.email}`}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 flex-shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            ) : showPeopleList ? (
              <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                <User className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No {formData.type === "teacher" && hasTertiaryLevel ? "lecturer" : formData.type}s found
                </p>
                {personSearchQuery && (
                  <button
                    onClick={() => setPersonSearchQuery("")}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-2"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Step 4: Membership Settings */}
        {currentStep === "settings" && (
          <div className="space-y-6">
            {/* Selected person summary */}
            {selectedPerson && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 ring-2 ring-white dark:ring-gray-700">
                    <Image
                      src={selectedPerson.avatarUrl || ""}
                      alt={selectedPerson.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400">Selected</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mt-1">
                      {selectedPerson.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getMemberTypeBadge(formData.type)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.class || formData.department} {selectedPerson.email && `• ${selectedPerson.email}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBack}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Settings form */}
            <FormSection
              title="Membership Settings"
              icon={<Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Max books */}
                <FormDropdown
                  label="Max Books Allowed"
                  icon={<BookOpen className="w-full h-full" />}
                  value={formData.maxBooksAllowed.toString()}
                  onChange={(val) => setFormData({ ...formData, maxBooksAllowed: parseInt(val) })}
                  options={MAX_BOOKS_OPTIONS}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                  iconColor="text-blue-600 dark:text-blue-400"
                />

                {/* Expiry date */}
                <FormInput
                  label="Membership Expiry"
                  icon={<Calendar className="w-full h-full" />}
                  type="date"
                  value={formData.expiryDate}
                  onChange={(val) => setFormData({ ...formData, expiryDate: String(val) })}
                  error={errors.expiryDate}
                  required
                  iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                  iconColor="text-amber-600 dark:text-amber-400"
                />

                {/* Class (for students) - editable */}
                {formData.type === "student" && (
                  <FormInput
                    label="Class"
                    icon={<GraduationCap className="w-full h-full" />}
                    value={formData.class}
                    onChange={(val) => setFormData({ ...formData, class: String(val) })}
                    placeholder="e.g., SS3A, Primary 5B"
                    error={errors.class}
                    required
                    iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                  />
                )}

                {/* Department (for teachers/staff) - editable */}
                {(formData.type === "teacher" || formData.type === "staff") && (
                  <FormDropdown
                    label="Department"
                    icon={<Building2 className="w-full h-full" />}
                    value={formData.department}
                    onChange={(val) => setFormData({ ...formData, department: val })}
                    options={DEPARTMENT_OPTIONS}
                    error={errors.department}
                    iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                    iconColor="text-orange-600 dark:text-orange-400"
                  />
                )}
              </div>
            </FormSection>

            {/* Info and validation errors */}
            {errors.class || errors.department || errors.expiryDate ? (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">Please fix the following:</p>
                  <ul className="text-xs text-red-600 dark:text-red-400 mt-1 list-disc list-inside">
                    {errors.class && <li>{errors.class}</li>}
                    {errors.department && <li>{errors.department}</li>}
                    {errors.expiryDate && <li>{errors.expiryDate}</li>}
                  </ul>
                </div>
              </div>
            ) : selectedPerson && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Ready to add</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    A unique library membership ID will be automatically generated.
                    The member will be set as active by default.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
