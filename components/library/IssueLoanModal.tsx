"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
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
  ChevronRight,
  ChevronLeft,
  MapPin,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import type { Book, BookLoan, BorrowerType, LibraryMember, BookCategory } from "@/types/library";
import { useSchoolSettings, EducationLevel as ContextEducationLevel } from "@/contexts/SchoolSettingsContext";

interface IssueLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssue: (loanData: Omit<BookLoan, "id" | "createdAt" | "updatedAt">) => void;
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

// Mock Books Data (same as library page)
const MOCK_BOOKS: Book[] = [
  {
    id: "book-001",
    isbn: "978-0-13-468599-1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    publisher: "MIT Press",
    publishYear: 2022,
    edition: "4th Edition",
    category: "textbook",
    subject: "Computer Science",
    educationLevel: "Tertiary",
    description: "Comprehensive textbook on algorithms and data structures",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200",
    totalCopies: 10,
    availableCopies: 7,
    location: "Section A, Shelf 3",
    condition: "good",
    status: "available",
    language: "English",
    pages: 1312,
    price: 15000,
    acquisitionDate: "2023-01-15",
    tags: ["algorithms", "programming", "computer science"],
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "book-002",
    isbn: "978-0-06-093546-7",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publisher: "Harper Perennial",
    publishYear: 2006,
    category: "literature",
    subject: "English Literature",
    educationLevel: "Secondary",
    description: "Classic novel exploring themes of racial injustice and moral growth",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200",
    totalCopies: 15,
    availableCopies: 12,
    location: "Section B, Shelf 1",
    condition: "good",
    status: "available",
    language: "English",
    pages: 336,
    price: 3500,
    acquisitionDate: "2022-08-20",
    tags: ["classic", "literature", "fiction"],
    createdAt: "2022-08-20T09:00:00Z",
    updatedAt: "2024-01-05T11:20:00Z",
  },
  {
    id: "book-003",
    isbn: "978-1-40-883213-6",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    publisher: "Bantam Books",
    publishYear: 2018,
    category: "science",
    subject: "Physics",
    educationLevel: "All",
    description: "Popular science book on cosmology and the universe",
    coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200",
    totalCopies: 8,
    availableCopies: 5,
    location: "Section C, Shelf 2",
    condition: "good",
    status: "available",
    language: "English",
    pages: 256,
    price: 4500,
    acquisitionDate: "2023-03-10",
    tags: ["physics", "cosmology", "science"],
    createdAt: "2023-03-10T08:30:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "book-004",
    isbn: "978-0-19-853907-4",
    title: "New Oxford Primary Mathematics Book 3",
    author: "Nicholas Horsburgh",
    publisher: "Oxford University Press",
    publishYear: 2021,
    category: "mathematics",
    subject: "Mathematics",
    educationLevel: "Primary",
    description: "Primary school mathematics textbook for grade 3 students",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200",
    totalCopies: 25,
    availableCopies: 20,
    location: "Section D, Shelf 1",
    condition: "new",
    status: "available",
    language: "English",
    pages: 180,
    price: 2500,
    acquisitionDate: "2023-09-01",
    tags: ["mathematics", "primary", "textbook"],
    createdAt: "2023-09-01T07:00:00Z",
    updatedAt: "2024-01-08T10:15:00Z",
  },
  {
    id: "book-005",
    isbn: "978-0-14-028329-7",
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    publisher: "Penguin Books",
    publishYear: 2012,
    category: "biography",
    subject: "History",
    educationLevel: "Secondary",
    description: "The diary of Anne Frank during World War II",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200",
    totalCopies: 12,
    availableCopies: 3,
    location: "Section B, Shelf 3",
    condition: "fair",
    status: "available",
    language: "English",
    pages: 352,
    price: 3000,
    acquisitionDate: "2022-05-15",
    tags: ["biography", "history", "world war"],
    createdAt: "2022-05-15T11:00:00Z",
    updatedAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "book-006",
    isbn: "978-0-07-352332-3",
    title: "Biology: Concepts and Connections",
    author: "Neil A. Campbell",
    publisher: "McGraw-Hill",
    publishYear: 2020,
    edition: "9th Edition",
    category: "science",
    subject: "Biology",
    educationLevel: "Secondary",
    description: "Comprehensive biology textbook for secondary school students",
    coverImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=200",
    totalCopies: 18,
    availableCopies: 14,
    location: "Section C, Shelf 4",
    condition: "good",
    status: "available",
    language: "English",
    pages: 850,
    price: 8500,
    acquisitionDate: "2023-06-20",
    tags: ["biology", "science", "textbook"],
    createdAt: "2023-06-20T10:00:00Z",
    updatedAt: "2024-01-10T15:00:00Z",
  },
  {
    id: "book-007",
    isbn: "978-0-7432-7356-5",
    title: "1984",
    author: "George Orwell",
    publisher: "Signet Classic",
    publishYear: 1961,
    category: "fiction",
    subject: "English Literature",
    educationLevel: "Secondary",
    description: "Dystopian novel about totalitarianism and surveillance",
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200",
    totalCopies: 10,
    availableCopies: 8,
    location: "Section B, Shelf 2",
    condition: "good",
    status: "available",
    language: "English",
    pages: 328,
    price: 2800,
    acquisitionDate: "2022-11-10",
    tags: ["fiction", "dystopia", "classic"],
    createdAt: "2022-11-10T09:30:00Z",
    updatedAt: "2024-01-11T12:00:00Z",
  },
  {
    id: "book-008",
    isbn: "978-0-19-280087-5",
    title: "Oxford English Dictionary",
    author: "Oxford University Press",
    publisher: "Oxford University Press",
    publishYear: 2023,
    edition: "12th Edition",
    category: "reference",
    subject: "English",
    educationLevel: "All",
    description: "Comprehensive English language dictionary",
    coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=200",
    totalCopies: 5,
    availableCopies: 5,
    location: "Reference Section",
    condition: "new",
    status: "available",
    language: "English",
    pages: 2112,
    price: 12000,
    acquisitionDate: "2024-01-01",
    tags: ["dictionary", "reference", "english"],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z",
  },
  {
    id: "book-009",
    isbn: "978-0-521-66326-3",
    title: "World History: Patterns of Interaction",
    author: "Roger B. Beck",
    publisher: "Cambridge University Press",
    publishYear: 2019,
    category: "history",
    subject: "History",
    educationLevel: "Secondary",
    description: "Comprehensive world history textbook",
    coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12a74?w=200",
    totalCopies: 20,
    availableCopies: 16,
    location: "Section E, Shelf 1",
    condition: "good",
    status: "available",
    language: "English",
    pages: 1024,
    price: 7500,
    acquisitionDate: "2023-02-15",
    tags: ["history", "world", "textbook"],
    createdAt: "2023-02-15T10:30:00Z",
    updatedAt: "2024-01-09T14:00:00Z",
  },
  {
    id: "book-010",
    isbn: "978-0-14-044913-6",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    publisher: "Penguin Classics",
    publishYear: 2003,
    category: "fiction",
    subject: "Literature",
    educationLevel: "Tertiary",
    description: "Classic Russian novel exploring guilt and redemption",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200",
    totalCopies: 6,
    availableCopies: 2,
    location: "Section B, Shelf 4",
    condition: "fair",
    status: "available",
    language: "English",
    pages: 671,
    price: 4000,
    acquisitionDate: "2022-07-25",
    tags: ["fiction", "classic", "russian"],
    createdAt: "2022-07-25T11:00:00Z",
    updatedAt: "2024-01-13T10:30:00Z",
  },
];

// Mock library members for demo
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

// Book category options
const BOOK_CATEGORY_OPTIONS: { value: BookCategory | ""; label: string }[] = [
  { value: "", label: "Select a category" },
  { value: "textbook", label: "Textbook" },
  { value: "fiction", label: "Fiction" },
  { value: "non-fiction", label: "Non-Fiction" },
  { value: "reference", label: "Reference" },
  { value: "science", label: "Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "literature", label: "Literature" },
  { value: "art", label: "Art" },
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "religion", label: "Religion" },
  { value: "biography", label: "Biography" },
  { value: "periodical", label: "Periodical" },
  { value: "other", label: "Other" },
];

const INITIAL_FORM_DATA: FormData = {
  memberId: "",
  memberName: "",
  memberType: "student",
  dueDate: "",
  notes: "",
};

type Step = "book" | "borrower" | "details";

export default function IssueLoanModal({
  isOpen,
  onClose,
  onIssue,
  isIssuing = false,
}: IssueLoanModalProps) {
  // Get tenant/school settings
  const { settings } = useSchoolSettings();

  // Current step
  const [currentStep, setCurrentStep] = useState<Step>("book");

  // Book selection
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | "">("");
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [showBookList, setShowBookList] = useState(false);

  // Borrower selection
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null);
  const [showMemberSearch, setShowMemberSearch] = useState(false);

  // Filter states for borrower
  const [selectedBorrowerType, setSelectedBorrowerType] = useState<BorrowerType | "">("");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EducationLevel | "">("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

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

  // Filter books based on category and search
  const filteredBooks = useMemo(() => {
    // Don't show any books until a category is selected
    if (!selectedCategory) return [];

    return MOCK_BOOKS.filter((book) => {
      // Must have available copies
      if (book.availableCopies < 1) return false;

      // Must match selected category
      if (book.category !== selectedCategory) return false;

      // If search query, filter by it
      if (bookSearchQuery.trim()) {
        const query = bookSearchQuery.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn.toLowerCase().includes(query) ||
          book.subject?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedCategory, bookSearchQuery]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + DEFAULT_LOAN_DURATION);
      setFormData({
        ...INITIAL_FORM_DATA,
        dueDate: dueDate.toISOString().split("T")[0],
      });
      setSelectedBook(null);
      setSelectedMember(null);
      setBookSearchQuery("");
      setMemberSearchQuery("");
      setErrors({});
      setSelectedBorrowerType("");
      setSelectedEducationLevel("");
      setSelectedClass("");
      setShowMemberSearch(false);
      setSelectedCategory("");
      setShowBookList(false);
      setCurrentStep("book");
    }
  }, [isOpen]);

  // Load books when category changes
  useEffect(() => {
    if (selectedCategory) {
      setIsLoadingBooks(true);
      setShowBookList(false);
      const timer = setTimeout(() => {
        setIsLoadingBooks(false);
        setShowBookList(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setShowBookList(false);
    }
  }, [selectedCategory]);

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
    if (!selectedBorrowerType) return [];
    if (selectedBorrowerType === "student" && !selectedEducationLevel) return [];

    let members = MOCK_MEMBERS.filter((member) => member.type === selectedBorrowerType);

    if (selectedBorrowerType === "student" && selectedEducationLevel) {
      members = members.filter((member) => {
        const memberLevel = getEducationLevelFromClass(member.class || "");
        return memberLevel === selectedEducationLevel;
      });

      if (selectedClass) {
        members = members.filter((member) =>
          member.class?.toLowerCase().includes(selectedClass.toLowerCase())
        );
      }
    }

    if (memberSearchQuery.trim()) {
      const query = memberSearchQuery.toLowerCase();
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
  }, [selectedBorrowerType, selectedEducationLevel, selectedClass, memberSearchQuery]);

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

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentStep("borrower");
  };

  const handleSelectMember = (member: LibraryMember) => {
    setSelectedMember(member);
    setFormData((prev) => ({
      ...prev,
      memberId: member.memberId,
      memberName: member.name,
      memberType: member.type,
    }));
    setShowMemberSearch(false);
    setMemberSearchQuery("");
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
      if (selectedMember.currentBooksCount >= selectedMember.maxBooksAllowed) {
        newErrors.memberId = `${selectedMember.name} has reached the maximum borrowing limit (${selectedMember.maxBooksAllowed} books)`;
      }
      if (selectedMember.finesDue > 0) {
        newErrors.memberId = `${selectedMember.name} has outstanding fines of NGN ${selectedMember.finesDue.toLocaleString()}. Please clear fines before issuing.`;
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
    if (!validateForm() || !selectedBook || !selectedMember) return;

    const loanNumber = `LN-${Date.now().toString(36).toUpperCase()}`;

    const loanData: Omit<BookLoan, "id" | "createdAt" | "updatedAt"> = {
      loanNumber,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookIsbn: selectedBook.isbn,
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
      issuedBy: "Current Librarian",
    };

    onIssue(loanData);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedBook(null);
    setSelectedMember(null);
    setBookSearchQuery("");
    setMemberSearchQuery("");
    setErrors({});
    setShowMemberSearch(false);
    setSelectedBorrowerType("");
    setSelectedEducationLevel("");
    setSelectedClass("");
    setSelectedCategory("");
    setShowBookList(false);
    setCurrentStep("book");
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

  const goToNextStep = () => {
    if (currentStep === "book" && selectedBook) {
      setCurrentStep("borrower");
    } else if (currentStep === "borrower" && selectedMember && !errors.memberId) {
      setCurrentStep("details");
    }
  };

  const goToPrevStep = () => {
    if (currentStep === "borrower") {
      setCurrentStep("book");
    } else if (currentStep === "details") {
      setCurrentStep("borrower");
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        currentStep === "book"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
          : selectedBook
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
            : "bg-gray-100 text-gray-500 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
      }`}>
        <BookOpen className="w-3.5 h-3.5" />
        <span>Book</span>
        {selectedBook && currentStep !== "book" && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400" />
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        currentStep === "borrower"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
          : selectedMember
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
            : "bg-gray-100 text-gray-500 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
      }`}>
        <User className="w-3.5 h-3.5" />
        <span>Borrower</span>
        {selectedMember && currentStep !== "borrower" && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400" />
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        currentStep === "details"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
          : "bg-gray-100 text-gray-500 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
      }`}>
        <Calendar className="w-3.5 h-3.5" />
        <span>Details</span>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Issue New Loan"
      subtitle={
        currentStep === "book"
          ? "Select a book to issue"
          : currentStep === "borrower"
            ? "Select the borrower"
            : "Confirm loan details"
      }
      icon={<BookMarked className="w-5 h-5" />}
      maxWidth="3xl"
      footer={
        <div className="flex justify-between w-full">
          <div>
            {currentStep !== "book" && (
              <Button variant="ghost" onClick={goToPrevStep} disabled={isIssuing}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={isIssuing}>
              Cancel
            </Button>
            {currentStep === "details" ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isIssuing || !selectedBook || !selectedMember}
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
            ) : (
              <Button
                variant="primary"
                onClick={goToNextStep}
                disabled={
                  (currentStep === "book" && !selectedBook) ||
                  (currentStep === "borrower" && (!selectedMember || !!errors.memberId))
                }
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <StepIndicator />

        {/* Step 1: Book Selection */}
        {currentStep === "book" && (
          <div className="space-y-4">
            {/* Selected Book Display */}
            {selectedBook && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  {selectedBook.coverImage ? (
                    <Image
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                      width={64}
                      height={80}
                      className="w-16 h-20 object-cover rounded-lg shadow-sm"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">Selected</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm mt-1">
                      {selectedBook.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                      by {selectedBook.author}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                        <Hash className="w-3 h-3" />
                        {selectedBook.isbn}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                        {selectedBook.availableCopies} available
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBook(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Book Category Selection and Search */}
            {!selectedBook && (
              <div className="space-y-4">
                {/* Category Dropdown */}
                <FormDropdown
                  label="Book Category"
                  icon={<FolderOpen className="w-full h-full" />}
                  value={selectedCategory}
                  onChange={(val) => {
                    setSelectedCategory(val as BookCategory | "");
                    setBookSearchQuery("");
                  }}
                  options={BOOK_CATEGORY_OPTIONS}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400"
                  required
                />

                {/* Loading State */}
                {isLoadingBooks && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Loading books...</span>
                  </div>
                )}

                {/* Search and Book List - Only show after category is selected and loaded */}
                {showBookList && selectedCategory && (
                  <>
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={bookSearchQuery}
                        onChange={(e) => setBookSearchQuery(e.target.value)}
                        placeholder="Search by title, author, ISBN, or subject..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>

                    {/* Book Grid */}
                    <div className="max-h-[350px] overflow-y-auto border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl">
                      {filteredBooks.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                          {filteredBooks.map((book) => (
                            <button
                              key={book.id}
                              type="button"
                              onClick={() => handleSelectBook(book)}
                              className="w-full flex items-start gap-3 p-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 midnight:hover:bg-cyan-900/10 purple:hover:bg-pink-900/10 transition-all text-left cursor-pointer group"
                            >
                              {book.coverImage ? (
                                <Image
                                  src={book.coverImage}
                                  alt={book.title}
                                  width={48}
                                  height={64}
                                  className="w-12 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-12 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {book.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                                  {book.author}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.625rem] font-medium bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                                    {book.educationLevel}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.625rem] font-semibold ${
                                    book.availableCopies > 3
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                                      : book.availableCopies > 0
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                                  }`}>
                                    {book.availableCopies}/{book.totalCopies} available
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-[0.625rem] text-gray-400">
                                  <MapPin className="w-3 h-3" />
                                  {book.location}
                                </div>
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 flex-shrink-0 transition-colors" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                          <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">
                            {bookSearchQuery
                              ? `No books found matching "${bookSearchQuery}"`
                              : `No available books in the "${BOOK_CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.label}" category`}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Empty state when no category selected */}
                {!selectedCategory && (
                  <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-xl">
                    <FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                      Select a category to browse available books
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Borrower Selection */}
        {currentStep === "borrower" && (
          <div className="space-y-4">
            {/* Selected Book Summary */}
            {selectedBook && (
              <div className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="flex items-center gap-3">
                  {selectedBook.coverImage ? (
                    <Image
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                      width={32}
                      height={40}
                      className="w-8 h-10 object-cover rounded"
                      unoptimized
                    />
                  ) : (
                    <div className="w-8 h-10 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Issuing:</p>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                      {selectedBook.title}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Member Display */}
            {selectedMember ? (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {selectedMember.avatarUrl ? (
                      <Image
                        src={selectedMember.avatarUrl}
                        alt={selectedMember.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">
                          {selectedMember.name}
                        </h4>
                        {getMemberTypeBadge(selectedMember.type)}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">
                        {selectedMember.memberId} {selectedMember.class || selectedMember.department}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                          Books: {selectedMember.currentBooksCount}/{selectedMember.maxBooksAllowed}
                        </span>
                        {selectedMember.finesDue > 0 && (
                          <span className="text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 font-medium">
                            Fines: NGN {selectedMember.finesDue.toLocaleString()}
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
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
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
                                <Image
                                  src={member.avatarUrl}
                                  alt={member.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
                                  unoptimized
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
                                  {member.memberId} {member.class || member.department}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                  <span>
                                    Books: {member.currentBooksCount}/{member.maxBooksAllowed}
                                  </span>
                                  {member.finesDue > 0 && (
                                    <span className="text-red-500">
                                      Fines: NGN {member.finesDue.toLocaleString()}
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
                          {memberSearchQuery ? `No members found matching "${memberSearchQuery}"` : "No members found for the selected filters"}
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
          </div>
        )}

        {/* Step 3: Loan Details */}
        {currentStep === "details" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Book Summary */}
              {selectedBook && (
                <div className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 uppercase">Book</p>
                  </div>
                  <div className="flex items-start gap-3">
                    {selectedBook.coverImage ? (
                      <Image
                        src={selectedBook.coverImage}
                        alt={selectedBook.title}
                        width={48}
                        height={64}
                        className="w-12 h-16 object-cover rounded-lg shadow-sm"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm truncate">
                        {selectedBook.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">
                        by {selectedBook.author}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 font-mono mt-1">
                        {selectedBook.isbn}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Borrower Summary */}
              {selectedMember && (
                <div className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 uppercase">Borrower</p>
                  </div>
                  <div className="flex items-start gap-3">
                    {selectedMember.avatarUrl ? (
                      <Image
                        src={selectedMember.avatarUrl}
                        alt={selectedMember.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">
                          {selectedMember.name}
                        </h4>
                        {getMemberTypeBadge(selectedMember.type)}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-0.5">
                        {selectedMember.memberId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mt-0.5">
                        {selectedMember.class || selectedMember.department}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Loan Details */}
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

            {/* Ready to Issue Summary */}
            {selectedMember && selectedBook && !errors.memberId && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">Ready to issue</p>
                  <p className="text-xs text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 mt-1">
                    &quot;{selectedBook.title}&quot; will be issued to {selectedMember.name} until{" "}
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
        )}
      </div>
    </Modal>
  );
}
