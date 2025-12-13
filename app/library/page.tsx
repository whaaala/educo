"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import PageSpinner from "@/components/shared/PageSpinner";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import Button from "@/components/shared/Button";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import StatCard from "@/components/shared/StatCard";
import Modal from "@/components/shared/Modal";
import {
  Plus,
  BookOpen,
  Eye,
  Edit2,
  BookMarked,
  CheckCircle2,
  Library,
  BookCopy,
  Printer,
  Download,
} from "lucide-react";
import type { Book, BookStatus, BookCategory, BookCondition, BookEducationLevel } from "@/types/library";

// Book categories with labels
const BOOK_CATEGORIES: { value: BookCategory; label: string }[] = [
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

const BOOK_CONDITIONS: { value: BookCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
  { value: "damaged", label: "Damaged" },
];

const EDUCATION_LEVELS: { value: BookEducationLevel; label: string }[] = [
  { value: "Primary", label: "Primary" },
  { value: "Secondary", label: "Secondary" },
  { value: "Tertiary", label: "Tertiary" },
  { value: "All", label: "All Levels" },
];

// Mock Books Data
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
    availableCopies: 0,
    location: "Section B, Shelf 3",
    condition: "fair",
    status: "borrowed",
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

// Filter options
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "borrowed", label: "Borrowed" },
  { value: "reserved", label: "Reserved" },
  { value: "lost", label: "Lost" },
  { value: "damaged", label: "Damaged" },
  { value: "maintenance", label: "Maintenance" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...BOOK_CATEGORIES,
];

const LEVEL_OPTIONS = [
  { value: "all", label: "All Levels" },
  ...EDUCATION_LEVELS,
];

const CONDITION_OPTIONS = [
  { value: "all", label: "All Conditions" },
  ...BOOK_CONDITIONS,
];

export default function LibraryPage() {
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();
  const { countryCode } = useCountry();

  // State
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);

  // Loading states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Animation trigger
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Create a filterKey to track filter/search changes
  const filterKey = `${searchQuery}-${selectedCategory}-${selectedStatus}-${selectedLevel}-${selectedCondition}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Handle filter changes with animation
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => setIsFiltering(false), 100);
    }, 200);
  };

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subject?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || book.status === selectedStatus;
      const matchesLevel = selectedLevel === "all" || book.educationLevel === selectedLevel || book.educationLevel === "All";
      const matchesCondition = selectedCondition === "all" || book.condition === selectedCondition;

      return matchesSearch && matchesCategory && matchesStatus && matchesLevel && matchesCondition;
    });
  }, [books, searchQuery, selectedCategory, selectedStatus, selectedLevel, selectedCondition]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const borrowedBooks = totalBooks - availableBooks;
    const uniqueTitles = books.length;

    return { totalBooks, availableBooks, borrowedBooks, uniqueTitles };
  }, [books]);

  // Trigger animation when filterKey changes
  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger(prev => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  // Apply row animation when filter/search changes
  useEffect(() => {
    if (animationTrigger > 0) {
      const timeoutId = setTimeout(() => {
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach((row, index) => {
            const htmlRow = row as HTMLElement;
            const delay = index / 80;
            htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
          });
        });

        // Cleanup after animation completes
        setTimeout(() => {
          tables.forEach((table) => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row) => {
              const htmlRow = row as HTMLElement;
              htmlRow.style.animation = '';
            });
          });
        }, 600);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [animationTrigger]);

  // Handle view book
  const handleView = (book: Book) => {
    setViewingBook(book);
    setIsViewModalOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedLevel("all");
    setSelectedCondition("all");
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Export to PDF
  const handleExportPDF = () => {
    // Implementation for PDF export
    console.log("Exporting books to PDF...", filteredBooks);
  };

  // Export to Excel
  const handleExportExcel = () => {
    // Implementation for Excel export
    console.log("Exporting books to Excel...", filteredBooks);
  };

  // Get status badge
  const getStatusBadge = (status: BookStatus) => {
    const statusConfig: Record<BookStatus, { bg: string; text: string; border: string; label: string }> = {
      available: {
        bg: "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/20 purple:bg-green-900/20",
        text: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
        border: "border-green-200 dark:border-green-800",
        label: "Available",
      },
      borrowed: {
        bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/20 purple:bg-blue-900/20",
        text: "text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        label: "Borrowed",
      },
      reserved: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/20 purple:bg-yellow-900/20",
        text: "text-yellow-700 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-800",
        label: "Reserved",
      },
      lost: {
        bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/20 purple:bg-red-900/20",
        text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        border: "border-red-200 dark:border-red-800",
        label: "Lost",
      },
      damaged: {
        bg: "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/20 purple:bg-orange-900/20",
        text: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        label: "Damaged",
      },
      maintenance: {
        bg: "bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300",
        border: "border-gray-200 dark:border-gray-600",
        label: "Maintenance",
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border}`} style={{ fontSize: '11.8px' }}>
        {config.label}
      </span>
    );
  };

  // Get condition badge
  const getConditionBadge = (condition: BookCondition) => {
    const conditionConfig: Record<BookCondition, { bg: string; text: string }> = {
      new: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
      good: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
      fair: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
      poor: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
      damaged: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
    };

    const config = conditionConfig[condition];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium capitalize ${config.bg} ${config.text}`} style={{ fontSize: '10px' }}>
        {condition}
      </span>
    );
  };

  // Table columns
  const columns: ColumnConfig<Book>[] = [
    {
      key: "title",
      label: "Book",
      sortable: true,
      className: "text-left",
      render: (book) => (
        <div className="flex items-center gap-3">
          <div
            className="relative cursor-pointer group/cover flex-shrink-0 w-10 h-14"
            onMouseEnter={(e) => {
              // Find the parent tr and raise its z-index
              const tr = e.currentTarget.closest('tr');
              if (tr) {
                tr.style.zIndex = '100';
                tr.style.position = 'relative';
              }
              // Also raise the entire table container's scroll wrapper z-index
              const scrollContainer = e.currentTarget.closest('.overflow-x-auto');
              if (scrollContainer) {
                (scrollContainer as HTMLElement).style.zIndex = '100';
                (scrollContainer as HTMLElement).style.position = 'relative';
              }
            }}
            onMouseLeave={(e) => {
              // Reset the parent tr z-index
              const tr = e.currentTarget.closest('tr');
              if (tr) {
                tr.style.zIndex = '';
                tr.style.position = '';
              }
              // Reset scroll container z-index
              const scrollContainer = e.currentTarget.closest('.overflow-x-auto');
              if (scrollContainer) {
                (scrollContainer as HTMLElement).style.zIndex = '';
                (scrollContainer as HTMLElement).style.position = '';
              }
            }}
          >
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                width={40}
                height={56}
                className="absolute inset-0 w-10 h-14 rounded-md object-cover ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-300 ease-out group-hover/cover:scale-[2.5] group-hover/cover:shadow-2xl group-hover/cover:ring-blue-500/90 dark:group-hover/cover:ring-blue-400/90"
                style={{ transformOrigin: 'left center' }}
                unoptimized
              />
            ) : (
              <div
                className="absolute inset-0 w-10 h-14 rounded-md bg-gray-100 dark:bg-gray-700 ring-2 ring-white/80 dark:ring-gray-700/50 shadow-lg flex items-center justify-center transition-all duration-300 ease-out group-hover/cover:scale-[2.5] group-hover/cover:shadow-2xl group-hover/cover:ring-blue-500/90"
                style={{ transformOrigin: 'left center' }}
              >
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate" style={{ fontSize: "11.8px" }}>
              {book.title}
            </div>
            <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 truncate" style={{ fontSize: "10px" }}>
              {book.author}
            </div>
            <div className="text-gray-400 dark:text-gray-500 font-mono" style={{ fontSize: "9px" }}>
              {book.isbn}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      className: "text-left",
      render: (book) => (
        <span className="inline-flex px-2.5 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/20 purple:bg-purple-900/20 text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400 border border-purple-200 dark:border-purple-800 capitalize" style={{ fontSize: '11.8px' }}>
          {book.category.replace("-", " ")}
        </span>
      ),
    },
    {
      key: "educationLevel",
      label: "Level",
      sortable: true,
      className: "text-left",
      render: (book) => (
        <span className="inline-flex px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/20 purple:bg-blue-900/20 text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 border border-blue-200 dark:border-blue-800" style={{ fontSize: '11.8px' }}>
          {book.educationLevel}
        </span>
      ),
    },
    {
      key: "availableCopies",
      label: "Copies",
      sortable: true,
      className: "text-left",
      render: (book) => (
        <div style={{ fontSize: '11.8px' }}>
          <span className={`font-semibold ${book.availableCopies > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {book.availableCopies}
          </span>
          <span className="text-gray-400 dark:text-gray-500"> / {book.totalCopies}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      className: "text-left",
      render: (book) => (
        <span className="text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400" style={{ fontSize: '11.8px' }}>
          {book.location}
        </span>
      ),
    },
    {
      key: "condition",
      label: "Condition",
      sortable: true,
      className: "text-left",
      render: (book) => getConditionBadge(book.condition),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left",
      render: (book) => getStatusBadge(book.status),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (book) => (
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(book);
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-blue-950/30 midnight:to-blue-900/20 purple:from-blue-950/30 purple:to-blue-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 active:scale-95"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 midnight:from-green-950/30 midnight:to-green-900/20 purple:from-green-950/30 purple:to-green-900/20 hover:from-green-100 hover:to-green-100 dark:hover:from-green-900/40 dark:hover:to-green-800/30 transition-all duration-200 cursor-pointer border border-green-200/40 dark:border-green-800/30 hover:border-green-400/60 dark:hover:border-green-600/50 active:scale-95"
            title="Edit Book"
          >
            <Edit2 className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle issue book
            }}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 midnight:from-purple-950/30 midnight:to-purple-900/20 purple:from-purple-950/30 purple:to-purple-900/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-purple-900/40 dark:hover:to-purple-800/30 transition-all duration-200 cursor-pointer border border-purple-200/40 dark:border-purple-800/30 hover:border-purple-400/60 dark:hover:border-purple-600/50 active:scale-95"
            title="Issue Book"
          >
            <BookMarked className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
          </button>
        </div>
      ),
    },
  ];

  const isLoading = isRefreshing || isFiltering;

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Library" />

      <div className={`space-y-6 transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <PageHeader
            title="Book Catalog"
            breadcrumbs={[
              { label: "Library", href: "/library" },
              { label: "Catalog" },
            ]}
          />
          <PageActions
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onAdd={() => setIsAddModalOpen(true)}
            addButtonLabel="Add Book"
            exportDescription="Export book catalog"
            showPrint={false}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Library}
            label="Total Books"
            value={stats.totalBooks.toLocaleString()}
            color="blue"
            badge={`${filteredBooks.length} shown`}
          />
          <StatCard
            icon={CheckCircle2}
            label="Available"
            value={stats.availableBooks.toLocaleString()}
            color="green"
            badge={`${stats.totalBooks > 0 ? ((stats.availableBooks / stats.totalBooks) * 100).toFixed(0) : 0}%`}
          />
          <StatCard
            icon={BookMarked}
            label="Borrowed"
            value={stats.borrowedBooks.toLocaleString()}
            color="amber"
            badge={`${stats.totalBooks > 0 ? ((stats.borrowedBooks / stats.totalBooks) * 100).toFixed(0) : 0}%`}
          />
          <StatCard
            icon={BookCopy}
            label="Unique Titles"
            value={stats.uniqueTitles.toLocaleString()}
            color="purple"
          />
        </div>

        {/* Filters Bar */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search by title, author, ISBN, or subject..."
          filters={[
            {
              label: "Category",
              value: selectedCategory,
              onChange: (val) => handleFilterChange(setSelectedCategory, String(val)),
              options: CATEGORY_OPTIONS,
            },
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => handleFilterChange(setSelectedStatus, String(val)),
              options: STATUS_OPTIONS,
            },
            {
              label: "Level",
              value: selectedLevel,
              onChange: (val) => handleFilterChange(setSelectedLevel, String(val)),
              options: LEVEL_OPTIONS,
            },
            {
              label: "Condition",
              value: selectedCondition,
              onChange: (val) => handleFilterChange(setSelectedCondition, String(val)),
              options: CONDITION_OPTIONS,
            },
          ]}
        />

        {/* Table Section */}
        <div>
          {isLoading ? (
            <PageSpinner message={isRefreshing ? "Refreshing..." : "Filtering..."} size="md" />
          ) : filteredBooks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-16 h-16">
                    <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-1 text-center">
                  No books found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                  {searchQuery
                    ? "No results match your search. Try adjusting your filters."
                    : "Get started by adding your first book to the catalog."}
                </p>
                {!searchQuery && (
                  <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Book
                  </Button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="relative pb-16">
              {/* Mobile Scroll Indicator */}
              <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

              <div
                key={`table-data-${filterKey}`}
                className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-visible"
              >
                <DataTable
                  columns={columns}
                  data={filteredBooks}
                  getRowKey={(book) => book.id}
                  emptyMessage="No books found. Click 'Add Book' to add one."
                  title=""
                  showSearch={false}
                  defaultItemsPerPage={10}
                  itemsPerPageOptions={[5, 10, 15, 20, 25]}
                  enablePagination={true}
                  enableItemsPerPage={true}
                  onRowClick={handleView}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Book Modal */}
      {viewingBook && (
        <BookViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingBook(null);
          }}
          book={viewingBook}
          countryCode={countryCode}
          getStatusBadge={getStatusBadge}
          getConditionBadge={getConditionBadge}
        />
      )}
    </MainLayout>
  );
}

// Book View Modal Component
interface BookViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  countryCode: string;
  getStatusBadge: (status: BookStatus) => React.ReactNode;
  getConditionBadge: (condition: BookCondition) => React.ReactNode;
}

function BookViewModal({
  isOpen,
  onClose,
  book,
  countryCode,
  getStatusBadge,
  getConditionBadge,
}: BookViewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book.title}
      subtitle={`by ${book.author}`}
      icon={<BookOpen className="w-5 h-5" />}
      maxWidth="2xl"
      footer={
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Button variant="secondary">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary">
              <BookMarked className="w-4 h-4 mr-2" />
              Issue Book
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header with cover and basic info */}
        <div className="flex gap-6">
          <div className="relative w-32 h-44 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 shadow-lg ring-2 ring-white dark:ring-gray-800">
            {book.coverImage ? (
              <Image src={book.coverImage} alt={book.title} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(book.status)}
                {getConditionBadge(book.condition)}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {book.publisher} {book.edition && `- ${book.edition}`} ({book.publishYear})
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 capitalize">
                {book.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                {book.educationLevel}
              </span>
              {book.subject && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {book.subject}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{book.description}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">ISBN</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">{book.isbn}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Language</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{book.language}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Pages</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{book.pages || "N/A"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Location</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{book.location}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Price</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {book.price ? formatCurrency(book.price, countryCode) : "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Copies</p>
            <p className="text-sm font-medium">
              <span className={book.availableCopies > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                {book.availableCopies} available
              </span>
              <span className="text-gray-500"> / {book.totalCopies} total</span>
            </p>
          </div>
        </div>

        {/* Tags */}
        {book.tags && book.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p>Acquired: {new Date(book.acquisitionDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          <p>Last Updated: {new Date(book.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </Modal>
  );
}
