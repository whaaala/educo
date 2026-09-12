"use client";

import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { FormSection } from "@/components/shared/FormWizard";
import {
  BookMarked,
  User,
  Calendar,
  Clock,
  Hash,
  BookOpen,
  GraduationCap,
  Briefcase,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  Building2,
} from "lucide-react";
import type { Book, BookLoan, BorrowerType, LibraryMember } from "@/types/library";
import { useSchoolSettings, EducationLevel as ContextEducationLevel } from "@/contexts/SchoolSettingsContext";

interface IssueBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssue: (loanData: Omit<BookLoan, "id" | "createdAt" | "updatedAt">) => void;
  book: Book | null;
  isIssuing?: boolean;
}

interface FormData {
  memberId: string;
  memberName: string;
  memberType: BorrowerType;
  dueDate: string;
  notes: string;
}

// Education level type for filtering (lowercase for internal use)
type EducationLevel = "primary" | "secondary" | "tertiary";
// All possible education levels for mapping
const ALL_EDUCATION_LEVELS: { value: EducationLevel; label: string; contextLevel: ContextEducationLevel }[] = [
  { value: "primary", label: "Primary School", contextLevel: "Primary" },
  { value: "secondary", label: "Secondary School", contextLevel: "Secondary" },
  { value: "tertiary", label: "University / College", contextLevel: "Tertiary" },
];

// Mock library members for demo - expanded with more students
const MOCK_MEMBERS: LibraryMember[] = [
  // Primary School Students
  {
    id: "mem-p1",
    memberId: "LIB-2024-P001",
    type: "student",
    personId: "std-p1",
    name: "Tunde Bakare",
    email: "tunde.b@school.edu",
    phone: "+234 801 111 1111",
    class: "Primary 5A",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    isActive: true,
    maxBooksAllowed: 2,
    currentBooksCount: 0,
    totalBorrowedCount: 3,
    finesDue: 0,
    memberSince: "2023-09-01",
    createdAt: "2023-09-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "mem-p2",
    memberId: "LIB-2024-P002",
    type: "student",
    personId: "std-p2",
    name: "Amina Yusuf",
    email: "amina.y@school.edu",
    phone: "+234 801 111 2222",
    class: "Primary 6B",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    isActive: true,
    maxBooksAllowed: 2,
    currentBooksCount: 1,
    totalBorrowedCount: 5,
    finesDue: 0,
    memberSince: "2023-09-01",
    createdAt: "2023-09-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "mem-p3",
    memberId: "LIB-2024-P003",
    type: "student",
    personId: "std-p3",
    name: "Chidi Okoro",
    email: "chidi.o@school.edu",
    phone: "+234 801 111 3333",
    class: "Primary 4A",
    avatarUrl: "https://randomuser.me/api/portraits/men/85.jpg",
    isActive: true,
    maxBooksAllowed: 2,
    currentBooksCount: 0,
    totalBorrowedCount: 2,
    finesDue: 0,
    memberSince: "2023-09-01",
    createdAt: "2023-09-01",
    updatedAt: "2024-01-15",
  },
  // Secondary School Students (JSS)
  {
    id: "mem-j1",
    memberId: "LIB-2024-J001",
    type: "student",
    personId: "std-j1",
    name: "Emmanuel Nwachukwu",
    email: "emmanuel.n@school.edu",
    phone: "+234 805 678 9012",
    class: "JSS 3C",
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 2,
    totalBorrowedCount: 5,
    finesDue: 200,
    memberSince: "2023-09-01",
    createdAt: "2023-09-01",
    updatedAt: "2024-01-12",
  },
  {
    id: "mem-j2",
    memberId: "LIB-2024-J002",
    type: "student",
    personId: "std-j2",
    name: "Blessing Okafor",
    email: "blessing.o@school.edu",
    phone: "+234 805 678 9013",
    class: "JSS 2A",
    avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 0,
    totalBorrowedCount: 7,
    finesDue: 0,
    memberSince: "2023-09-01",
    createdAt: "2023-09-01",
    updatedAt: "2024-01-12",
  },
  // Secondary School Students (SSS)
  {
    id: "mem-s1",
    memberId: "LIB-2024-S001",
    type: "student",
    personId: "std-s1",
    name: "Adewale Johnson",
    email: "adewale.j@school.edu",
    phone: "+234 801 234 5678",
    class: "SSS 3A",
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 1,
    totalBorrowedCount: 12,
    finesDue: 0,
    memberSince: "2022-09-01",
    createdAt: "2022-09-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "mem-s2",
    memberId: "LIB-2024-S002",
    type: "student",
    personId: "std-s2",
    name: "Chiamaka Okonkwo",
    email: "chiamaka.o@school.edu",
    phone: "+234 802 345 6789",
    class: "SSS 2B",
    avatarUrl: "https://randomuser.me/api/portraits/women/63.jpg",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 0,
    totalBorrowedCount: 8,
    finesDue: 0,
    memberSince: "2023-01-15",
    createdAt: "2023-01-15",
    updatedAt: "2024-01-10",
  },
  {
    id: "mem-s3",
    memberId: "LIB-2024-S003",
    type: "student",
    personId: "std-s3",
    name: "Olumide Adekunle",
    email: "olumide.a@school.edu",
    phone: "+234 802 345 6790",
    class: "SSS 1A",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 1,
    totalBorrowedCount: 4,
    finesDue: 0,
    memberSince: "2023-09-01",
    createdAt: "2023-09-01",
    updatedAt: "2024-01-10",
  },
  // University/College Students
  {
    id: "mem-u1",
    memberId: "LIB-2024-U001",
    type: "student",
    personId: "std-u1",
    name: "Ngozi Eze",
    email: "ngozi.e@university.edu",
    phone: "+234 806 789 0123",
    class: "200 Level - Computer Science",
    avatarUrl: "https://randomuser.me/api/portraits/women/89.jpg",
    isActive: true,
    maxBooksAllowed: 5,
    currentBooksCount: 2,
    totalBorrowedCount: 15,
    finesDue: 0,
    memberSince: "2022-09-01",
    createdAt: "2022-09-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "mem-u2",
    memberId: "LIB-2024-U002",
    type: "student",
    personId: "std-u2",
    name: "Ibrahim Musa",
    email: "ibrahim.m@university.edu",
    phone: "+234 806 789 0124",
    class: "300 Level - Engineering",
    avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    isActive: true,
    maxBooksAllowed: 5,
    currentBooksCount: 3,
    totalBorrowedCount: 20,
    finesDue: 0,
    memberSince: "2021-09-01",
    createdAt: "2021-09-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "mem-u3",
    memberId: "LIB-2024-U003",
    type: "student",
    personId: "std-u3",
    name: "Funke Adeyemi",
    email: "funke.a@university.edu",
    phone: "+234 806 789 0125",
    class: "100 Level - Medicine",
    avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    isActive: true,
    maxBooksAllowed: 5,
    currentBooksCount: 1,
    totalBorrowedCount: 8,
    finesDue: 500,
    memberSince: "2023-09-01",
    createdAt: "2023-09-01",
    updatedAt: "2024-01-15",
  },
  // Teachers
  {
    id: "mem-t1",
    memberId: "LIB-2024-T001",
    type: "teacher",
    personId: "tch-1",
    name: "Dr. Oluwaseun Adeyemi",
    email: "o.adeyemi@school.edu",
    phone: "+234 803 456 7890",
    department: "Science",
    avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    isActive: true,
    maxBooksAllowed: 10,
    currentBooksCount: 3,
    totalBorrowedCount: 45,
    finesDue: 0,
    memberSince: "2020-09-01",
    createdAt: "2020-09-01",
    updatedAt: "2024-01-20",
  },
  {
    id: "mem-t2",
    memberId: "LIB-2024-T002",
    type: "teacher",
    personId: "tch-2",
    name: "Mrs. Patience Obi",
    email: "p.obi@school.edu",
    phone: "+234 803 456 7891",
    department: "English",
    avatarUrl: "https://randomuser.me/api/portraits/women/54.jpg",
    isActive: true,
    maxBooksAllowed: 10,
    currentBooksCount: 2,
    totalBorrowedCount: 30,
    finesDue: 0,
    memberSince: "2019-09-01",
    createdAt: "2019-09-01",
    updatedAt: "2024-01-20",
  },
  // Staff
  {
    id: "mem-st1",
    memberId: "LIB-2024-ST001",
    type: "staff",
    personId: "stf-1",
    name: "Mrs. Fatima Ibrahim",
    email: "f.ibrahim@school.edu",
    phone: "+234 804 567 8901",
    department: "Administration",
    avatarUrl: "https://randomuser.me/api/portraits/women/76.jpg",
    isActive: true,
    maxBooksAllowed: 5,
    currentBooksCount: 2,
    totalBorrowedCount: 20,
    finesDue: 500,
    memberSince: "2021-03-01",
    createdAt: "2021-03-01",
    updatedAt: "2024-01-18",
  },
  {
    id: "mem-st2",
    memberId: "LIB-2024-ST002",
    type: "staff",
    personId: "stf-2",
    name: "Mr. John Akpan",
    email: "j.akpan@school.edu",
    phone: "+234 804 567 8902",
    department: "IT Support",
    avatarUrl: "https://randomuser.me/api/portraits/men/91.jpg",
    isActive: true,
    maxBooksAllowed: 5,
    currentBooksCount: 0,
    totalBorrowedCount: 10,
    finesDue: 0,
    memberSince: "2022-01-01",
    createdAt: "2022-01-01",
    updatedAt: "2024-01-18",
  },
];

const BORROWER_TYPES: { value: BorrowerType | ""; label: string }[] = [
  { value: "", label: "Select borrower type" },
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "staff", label: "Staff" },
];


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

// Default loan duration in days
const DEFAULT_LOAN_DURATION = 14;

const INITIAL_FORM_DATA: FormData = {
  memberId: "",
  memberName: "",
  memberType: "student",
  dueDate: "",
  notes: "",
};

export default function IssueBookModal({
  isOpen,
  onClose,
  onIssue,
  book,
  isIssuing = false,
}: IssueBookModalProps) {
  // Get tenant/school settings
  const { settings } = useSchoolSettings();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null);
  const [showMemberSearch, setShowMemberSearch] = useState(false);

  // Filter states
  const [selectedBorrowerType, setSelectedBorrowerType] = useState<BorrowerType | "">("");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EducationLevel | "">("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Generate filtered education levels based on tenant settings
  const filteredEducationLevels = useMemo(() => {
    const levels: { value: EducationLevel | ""; label: string }[] = [
      { value: "", label: "Select education level" },
    ];

    // Filter based on supported levels from tenant settings
    ALL_EDUCATION_LEVELS.forEach((level) => {
      if (settings.supportedLevels.includes(level.contextLevel)) {
        levels.push({ value: level.value, label: level.label });
      }
    });

    return levels;
  }, [settings.supportedLevels]);

  // Check if only one education level is supported (auto-select scenario)
  const hasSingleEducationLevel = filteredEducationLevels.length === 2; // 1 placeholder + 1 actual level
  const singleEducationLevel = hasSingleEducationLevel
    ? (filteredEducationLevels[1]?.value as EducationLevel)
    : null;

  // Calculate default due date and reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + DEFAULT_LOAN_DURATION);
      setFormData({
        ...INITIAL_FORM_DATA,
        dueDate: dueDate.toISOString().split("T")[0],
      });
      setSelectedMember(null);
      setSearchQuery("");
      setErrors({});
      setSelectedBorrowerType("");
      setSelectedEducationLevel("");
      setSelectedClass("");
      setShowMemberSearch(false);
    }
  }, [isOpen]);

  // Reset class when education level changes
  useEffect(() => {
    setSelectedClass("");
  }, [selectedEducationLevel]);

  // Auto-select education level when student is selected and only one level is supported
  useEffect(() => {
    if (selectedBorrowerType === "student" && hasSingleEducationLevel && singleEducationLevel) {
      setSelectedEducationLevel(singleEducationLevel);
    }
  }, [selectedBorrowerType, hasSingleEducationLevel, singleEducationLevel]);

  // Helper function to determine education level from class string
  const getEducationLevelFromClass = (classStr: string): EducationLevel | null => {
    if (!classStr) return null;
    const lowerClass = classStr.toLowerCase();
    if (lowerClass.includes("primary")) return "primary";
    if (lowerClass.includes("jss") || lowerClass.includes("sss")) return "secondary";
    if (lowerClass.includes("level") || lowerClass.includes("postgraduate")) return "tertiary";
    return null;
  };

  // Filter members based on borrower type, education level, class, and search
  const filteredMembers = useMemo(() => {
    // Only show members after filters are selected
    if (!selectedBorrowerType) return [];

    // For students, require education level selection
    if (selectedBorrowerType === "student" && !selectedEducationLevel) return [];

    let members = MOCK_MEMBERS.filter((member) => member.type === selectedBorrowerType);

    // For students, filter by education level
    if (selectedBorrowerType === "student" && selectedEducationLevel) {
      members = members.filter((member) => {
        const memberLevel = getEducationLevelFromClass(member.class || "");
        return memberLevel === selectedEducationLevel;
      });

      // Further filter by class if selected
      if (selectedClass) {
        members = members.filter((member) =>
          member.class?.toLowerCase().includes(selectedClass.toLowerCase())
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      members = members.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.memberId.toLowerCase().includes(query) ||
          member.email?.toLowerCase().includes(query) ||
          member.class?.toLowerCase().includes(query) ||
          member.department?.toLowerCase().includes(query)
      );
    }

    return members;
  }, [selectedBorrowerType, selectedEducationLevel, selectedClass, searchQuery]);

  // Simulate loading members when filters change
  useEffect(() => {
    if (selectedBorrowerType && (selectedBorrowerType !== "student" || selectedEducationLevel)) {
      setIsLoadingMembers(true);
      const timer = setTimeout(() => {
        setIsLoadingMembers(false);
        setShowMemberSearch(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowMemberSearch(false);
    }
  }, [selectedBorrowerType, selectedEducationLevel, selectedClass]);

  const handleSelectMember = (member: LibraryMember) => {
    setSelectedMember(member);
    setFormData((prev) => ({
      ...prev,
      memberId: member.memberId,
      memberName: member.name,
      memberType: member.type,
    }));
    setShowMemberSearch(false);
    setSearchQuery("");
    // Clear member-related errors
    setErrors((prev) => ({ ...prev, memberId: undefined }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!selectedMember) {
      newErrors.memberId = "Please select a borrower";
    } else {
      // Check if member can borrow more books
      if (selectedMember.currentBooksCount >= selectedMember.maxBooksAllowed) {
        newErrors.memberId = `${selectedMember.name} has reached the maximum borrowing limit (${selectedMember.maxBooksAllowed} books)`;
      }
      // Check if member has outstanding fines
      if (selectedMember.finesDue > 0) {
        newErrors.memberId = `${selectedMember.name} has outstanding fines of ₦${selectedMember.finesDue.toLocaleString()}. Please clear fines before issuing.`;
      }
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(formData.dueDate);
      if (dueDate <= today) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !book || !selectedMember) return;

    const loanNumber = `LN-${Date.now().toString(36).toUpperCase()}`;

    const loanData: Omit<BookLoan, "id" | "createdAt" | "updatedAt"> = {
      loanNumber,
      bookId: book.id,
      bookTitle: book.title,
      bookIsbn: book.isbn,
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      memberType: selectedMember.type,
      borrowDate: new Date().toISOString().split("T")[0],
      dueDate: formData.dueDate,
      status: "active",
      renewalCount: 0,
      maxRenewals: 2,
      fineAmount: 0,
      finePaid: false,
      notes: formData.notes.trim() || undefined,
      issuedBy: "Current Librarian", // This would come from auth context
    };

    onIssue(loanData);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedMember(null);
    setSearchQuery("");
    setErrors({});
    setShowMemberSearch(false);
    setSelectedBorrowerType("");
    setSelectedEducationLevel("");
    setSelectedClass("");
    onClose();
  };

  const getMemberTypeIcon = (type: BorrowerType) => {
    switch (type) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "teacher":
        return <Users className="w-4 h-4" />;
      case "staff":
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const getMemberTypeBadge = (type: BorrowerType) => {
    const styles = {
      student: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 border-blue-200 dark:border-blue-800",
      teacher: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      staff: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 border-amber-200 dark:border-amber-800",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[type]}`}>
        {getMemberTypeIcon(type)}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (!book) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Issue Book"
      subtitle={`Issue "${book.title}" to a borrower`}
      icon={<BookMarked className="w-5 h-5" />}
      maxWidth="2xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={handleClose} disabled={isIssuing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isIssuing || book.availableCopies < 1}
          >
            {isIssuing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Issuing...
              </>
            ) : (
              <>
                <BookMarked className="w-4 h-4 mr-2" />
                Issue Book
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Book Availability Warning */}
        {book.availableCopies < 1 && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">No copies available</p>
              <p className="text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mt-1">
                All copies of this book are currently borrowed. Please wait for a return or check for reservations.
              </p>
            </div>
          </div>
        )}

        {/* Book Information Section */}
        <FormSection
          title="Book Information"
          icon={<BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
        >
          <div className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-start gap-4">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm truncate">
                  {book.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">
                  by {book.author}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                    <Hash className="w-3 h-3" />
                    {book.isbn}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    book.availableCopies > 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                  }`}>
                    {book.availableCopies} of {book.totalCopies} available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Borrower Selection Section */}
        <FormSection
          title="Select Borrower"
          icon={<User className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
        >
          {/* Selected Member Display */}
          {selectedMember ? (
            <div className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {selectedMember.avatarUrl ? (
                    <img
                      src={selectedMember.avatarUrl}
                      alt={selectedMember.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">
                        {selectedMember.name}
                      </h4>
                      {getMemberTypeBadge(selectedMember.type)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">
                      {selectedMember.memberId} • {selectedMember.class || selectedMember.department}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                        Books: {selectedMember.currentBooksCount}/{selectedMember.maxBooksAllowed}
                      </span>
                      {selectedMember.finesDue > 0 && (
                        <span className="text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 font-medium">
                          Fines: ₦{selectedMember.finesDue.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMember(null);
                    setShowMemberSearch(true);
                  }}
                >
                  Change
                </Button>
              </div>
              {/* Validation Error */}
              {errors.memberId && (
                <div className="mt-3 flex items-start gap-2 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-xs">{errors.memberId}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Borrower Type Selection */}
              <FormDropdown
                label="Borrower Type"
                icon={<Users className="w-full h-full" />}
                value={selectedBorrowerType}
                onChange={(val) => {
                  setSelectedBorrowerType(val as BorrowerType | "");
                  setSelectedMember(null);
                }}
                options={BORROWER_TYPES}
                iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                iconColor="text-purple-600 dark:text-purple-400"
                required
              />

              {/* Education Level Selection - Only for students with multiple levels */}
              {selectedBorrowerType === "student" && !hasSingleEducationLevel && (
                <FormDropdown
                  label="Education Level"
                  icon={<Building2 className="w-full h-full" />}
                  value={selectedEducationLevel}
                  onChange={(val) => setSelectedEducationLevel(val as EducationLevel | "")}
                  options={filteredEducationLevels}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                  iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  required
                />
              )}

              {/* Show auto-selected education level info for single-level schools */}
              {selectedBorrowerType === "student" && hasSingleEducationLevel && selectedEducationLevel && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                    {filteredEducationLevels.find(l => l.value === selectedEducationLevel)?.label}
                  </span>
                </div>
              )}

              {/* Class Selection - Only for students with education level */}
              {selectedBorrowerType === "student" && selectedEducationLevel && (
                <FormDropdown
                  label={selectedEducationLevel === "tertiary" ? "Level" : "Class"}
                  icon={<GraduationCap className="w-full h-full" />}
                  value={selectedClass}
                  onChange={(val) => setSelectedClass(val)}
                  options={CLASS_OPTIONS[selectedEducationLevel]}
                  iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
                  iconColor="text-emerald-600 dark:text-emerald-400"
                />
              )}

              {/* Member Search and List */}
              {showMemberSearch && !isLoadingMembers && (
                <div className="space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, ID, class, or department..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Member List */}
                  <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => handleSelectMember(member)}
                          className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-[#22262e] transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0">
                                {getMemberTypeIcon(member.type)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm truncate">
                                  {member.name}
                                </span>
                                {getMemberTypeBadge(member.type)}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">
                                {member.memberId} • {member.class || member.department}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                <span>
                                  Books: {member.currentBooksCount}/{member.maxBooksAllowed}
                                </span>
                                {member.finesDue > 0 && (
                                  <span className="text-red-500">
                                    Fines: ₦{member.finesDue.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            {member.currentBooksCount < member.maxBooksAllowed && member.finesDue === 0 && (
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-sm">
                        {searchQuery ? `No members found matching "${searchQuery}"` : "No members found for the selected filters"}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoadingMembers && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Loading members...</span>
                </div>
              )}

              {/* Validation Error */}
              {errors.memberId && !showMemberSearch && (
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-xs">{errors.memberId}</p>
                </div>
              )}
            </div>
          )}
        </FormSection>

        {/* Loan Details Section */}
        <FormSection
          title="Loan Details"
          icon={<Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Issue Date"
              icon={<Calendar className="w-full h-full" />}
              value={new Date().toISOString().split("T")[0]}
              onChange={() => {}}
              type="date"
              disabled
              iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <FormInput
              label="Due Date"
              icon={<Clock className="w-full h-full" />}
              value={formData.dueDate}
              onChange={(val) => handleChange("dueDate", val)}
              type="date"
              required
              error={errors.dueDate}
              iconBgColor="bg-amber-100 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
            />
          </div>
          <div className="mt-4">
            <FormTextarea
              label="Notes"
              icon={<FileText className="w-full h-full" />}
              value={formData.notes}
              onChange={(val) => handleChange("notes", val)}
              placeholder="Add any notes about this loan (optional)..."
              rows={2}
              optional
            />
          </div>
        </FormSection>

        {/* Loan Summary */}
        {selectedMember && book.availableCopies > 0 && !errors.memberId && (
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">Ready to issue</p>
              <p className="text-xs text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 mt-1">
                &quot;{book.title}&quot; will be issued to {selectedMember.name} until{" "}
                {formData.dueDate && new Date(formData.dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
