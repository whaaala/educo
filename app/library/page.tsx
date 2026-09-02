"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { DataManagementPage } from "@/components/pages";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import ResponsiveListTable from "@/components/shared/ResponsiveListTable";
import Tooltip from "@/components/shared/Tooltip";
import DetailViewModal from "@/components/shared/DetailViewModal";
import AddBookModal from "@/components/library/AddBookModal";
import IssueBookModal from "@/components/library/IssueBookModal";
import {
  BookOpen,
  Eye,
  Edit2,
  BookMarked,
} from "lucide-react";
import type { Book, BookStatus, BookCondition, BookLoan } from "@/types/library";
import type { ColumnConfig } from "@/types/components";
import { exportBooksToExcel, exportBooksToPDF } from "@/lib/export-utils";
import {
  bookFilterFields,
  bookSortOptions,
  filterBooks,
  sortBooks,
  searchBooks,
  getBookStats,
} from "./config";

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

export default function LibraryPage() {
  const { settings } = useSchoolSettings();
  const { countryCode } = useCountry();

  // State
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [issuingBook, setIssuingBook] = useState<Book | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

  // Stats config
  const bookStats = useMemo(() => getBookStats((price) => formatCurrency(price, countryCode)), [countryCode]);

  // Handle view book
  const handleView = (book: Book) => {
    setViewingBook(book);
    setIsViewModalOpen(true);
  };

  // Handle add/edit book
  const handleSaveBook = (bookData: Omit<Book, "id" | "createdAt" | "updatedAt">) => {
    setIsSaving(true);

    setTimeout(() => {
      if (editingBook) {
        setBooks(prev => prev.map(book =>
          book.id === editingBook.id
            ? { ...book, ...bookData, updatedAt: new Date().toISOString() }
            : book
        ));
      } else {
        const newBook: Book = {
          ...bookData,
          id: `book-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setBooks(prev => [newBook, ...prev]);
      }

      setIsSaving(false);
      setIsAddModalOpen(false);
      setEditingBook(null);
    }, 500);
  };

  // Handle edit book
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsAddModalOpen(true);
  };

  // Handle issue book
  const handleIssueBook = (book: Book) => {
    setIssuingBook(book);
    setIsIssueModalOpen(true);
  };

  // Handle issue book submission
  const handleIssueBookSubmit = (loanData: Omit<BookLoan, "id" | "createdAt" | "updatedAt">) => {
    setIsIssuing(true);

    setTimeout(() => {
      setBooks(prev => prev.map(book =>
        book.id === loanData.bookId
          ? {
              ...book,
              availableCopies: Math.max(0, book.availableCopies - 1),
              status: book.availableCopies - 1 <= 0 ? "borrowed" : book.status,
              updatedAt: new Date().toISOString()
            }
          : book
      ));

      setIsIssuing(false);
      setIsIssueModalOpen(false);
      setIssuingBook(null);
    }, 500);
  };

  // Export to PDF
  const handleExportPDF = () => {
    exportBooksToPDF(
      books,
      "book-catalog",
      (price) => formatCurrency(price, countryCode),
      settings.schoolName
    );
  };

  // Export to Excel
  const handleExportExcel = () => {
    exportBooksToExcel(
      books,
      "book-catalog",
      (price) => formatCurrency(price, countryCode)
    );
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
        bg: "bg-surface-2",
        text: "text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300",
        border: "border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30",
        label: "Maintenance",
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border}`} style={{ fontSize: '0.7375rem' }}>
        {config.label}
      </span>
    );
  };

  // Get condition badge
  const getConditionBadge = (condition: BookCondition) => {
    const conditionConfig: Record<BookCondition, { bg: string; text: string }> = {
      new: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
      good: { bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30", text: "text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" },
      fair: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" },
      poor: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
      damaged: { bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30", text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400" },
    };

    const config = conditionConfig[condition];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium capitalize ${config.bg} ${config.text}`} style={{ fontSize: '0.625rem' }}>
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
              const tr = e.currentTarget.closest('tr');
              if (tr) { tr.style.zIndex = '100'; tr.style.position = 'relative'; }
              const scrollContainer = e.currentTarget.closest('.overflow-x-auto');
              if (scrollContainer) { (scrollContainer as HTMLElement).style.zIndex = '100'; (scrollContainer as HTMLElement).style.position = 'relative'; }
            }}
            onMouseLeave={(e) => {
              const tr = e.currentTarget.closest('tr');
              if (tr) { tr.style.zIndex = ''; tr.style.position = ''; }
              const scrollContainer = e.currentTarget.closest('.overflow-x-auto');
              if (scrollContainer) { (scrollContainer as HTMLElement).style.zIndex = ''; (scrollContainer as HTMLElement).style.position = ''; }
            }}
          >
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                width={40}
                height={56}
                className="absolute inset-0 w-10 h-14 rounded-md object-cover ring-2 ring-white/80 dark:ring-gray-700 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-300 ease-out group-hover/cover:scale-[2.5] group-hover/cover:shadow-2xl group-hover/cover:ring-blue-500/90 dark:group-hover/cover:ring-blue-400/90"
                style={{ transformOrigin: 'left center' }}
                unoptimized
              />
            ) : (
              <div
                className="absolute inset-0 w-10 h-14 rounded-md bg-surface-2 ring-2 ring-white/80 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-lg flex items-center justify-center transition-all duration-300 ease-out group-hover/cover:scale-[2.5] group-hover/cover:shadow-2xl group-hover/cover:ring-blue-500/90"
                style={{ transformOrigin: 'left center' }}
              >
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-ink truncate" style={{ fontSize: "0.7375rem" }}>
              {book.title}
            </div>
            <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 truncate" style={{ fontSize: "0.625rem" }}>
              {book.author}
            </div>
            <div className="text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 font-mono" style={{ fontSize: "0.5625rem" }}>
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
        <span className="inline-flex px-2.5 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/20 purple:bg-purple-900/20 text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400 border border-purple-200 dark:border-purple-800 capitalize" style={{ fontSize: '0.7375rem' }}>
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
        <span className="inline-flex px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/20 purple:bg-blue-900/20 text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 border border-blue-200 dark:border-blue-800" style={{ fontSize: '0.7375rem' }}>
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
        <div style={{ fontSize: '0.7375rem' }}>
          <span className={`font-semibold ${book.availableCopies > 0 ? "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" : "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"}`}>
            {book.availableCopies}
          </span>
          <span className="text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400"> / {book.totalCopies}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      className: "text-left",
      render: (book) => (
        <span className="text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400" style={{ fontSize: '0.7375rem' }}>
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
          <Tooltip content="View Details">
            <button
              onClick={(e) => { e.stopPropagation(); handleView(book); }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-blue-950/30 midnight:to-blue-900/20 purple:from-blue-950/30 purple:to-blue-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 active:scale-95"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
            </button>
          </Tooltip>
          <Tooltip content="Edit Book">
            <button
              onClick={(e) => { e.stopPropagation(); handleEditBook(book); }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 midnight:from-green-950/30 midnight:to-green-900/20 purple:from-green-950/30 purple:to-green-900/20 hover:from-green-100 hover:to-green-100 dark:hover:from-green-900/40 dark:hover:to-green-800/30 transition-all duration-200 cursor-pointer border border-green-200/40 dark:border-green-800/30 hover:border-green-400/60 dark:hover:border-green-600/50 active:scale-95"
            >
              <Edit2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
            </button>
          </Tooltip>
          <Tooltip content={book.availableCopies > 0 ? "Issue Book" : "No copies available"}>
            <button
              onClick={(e) => { e.stopPropagation(); if (book.availableCopies > 0) handleIssueBook(book); }}
              disabled={book.availableCopies < 1}
              className={`group relative p-2 rounded-lg transition-all duration-200 border ${
                book.availableCopies > 0
                  ? "bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 midnight:from-purple-950/30 midnight:to-purple-900/20 purple:from-purple-950/30 purple:to-purple-900/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-purple-900/40 dark:hover:to-purple-800/30 cursor-pointer border-purple-200/40 dark:border-purple-800/30 hover:border-purple-400/60 dark:hover:border-purple-600/50 active:scale-95"
                  : "bg-gray-100/50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 cursor-not-allowed opacity-50 border-gray-200/40 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
              }`}
            >
              <BookMarked className={`w-4 h-4 transition-colors ${
                book.availableCopies > 0
                  ? "text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300"
                  : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400"
              }`} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <DataManagementPage<Book>
      title="Book Catalog"
      breadcrumbs={[
        { label: "Library", href: "/library" },
        { label: "Catalog" },
      ]}
      data={books}
      getRowKey={(book) => book.id}
      columns={columns}
      stats={bookStats}
      filterFields={bookFilterFields}
      filterFn={filterBooks}
      sortOptions={bookSortOptions}
      sortFn={sortBooks}
      searchFn={searchBooks}
      enableViewToggle={false}
      enableSelection={false}
      addButtonConfig={{
        label: "Add Book",
        onClick: () => setIsAddModalOpen(true),
      }}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      customListComponent={
        <ResponsiveListTable variant="contained" showColumnHeaders={true}
          columns={columns}
          data={books}
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
      }
      enablePagination={true}
      itemLabel="book"
      itemLabelPlural="books"
      emptyStateConfig={{
        title: "No books found",
        description: "Get started by adding your first book to the catalog.",
        actionLabel: "Add Book",
        onAction: () => setIsAddModalOpen(true),
      }}
    >
      {/* View Book Modal */}
      {viewingBook && (
        <DetailViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingBook(null);
          }}
          title={viewingBook.title}
          subtitle={`by ${viewingBook.author}`}
          icon={<BookOpen className="w-5 h-5" />}
          size="3xl"
          header={{
            image: (
              <div className="relative w-20 h-28 rounded-xl overflow-hidden ring-2 ring-white/80 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-lg">
                {viewingBook.coverImage ? (
                  <Image
                    src={viewingBook.coverImage}
                    alt={viewingBook.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            ),
            badges: [
              {
                label: viewingBook.status.replace("_", " ").toUpperCase(),
                variant:
                  viewingBook.status === "available"
                    ? "success"
                    : viewingBook.status === "reserved"
                      ? "warning"
                      : viewingBook.status === "borrowed"
                        ? "info"
                        : viewingBook.status === "maintenance"
                          ? "neutral"
                          : "danger",
                pulse: viewingBook.status === "available",
              },
              {
                label: viewingBook.condition.toUpperCase(),
                variant:
                  viewingBook.condition === "new"
                    ? "success"
                    : viewingBook.condition === "good"
                      ? "info"
                      : viewingBook.condition === "fair"
                        ? "warning"
                        : "danger",
              },
            ],
            subtitle: (
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                  {viewingBook.isbn}
                </p>
                <p className="text-xs text-muted">
                  {viewingBook.educationLevel} • {viewingBook.subject} • {viewingBook.category.replace("-", " ")}
                </p>
              </div>
            ),
            chips: viewingBook.tags?.slice(0, 6).map((t) => ({ label: t })) ?? [],
          }}
          sections={[
            viewingBook.description
              ? { id: "desc", type: "description", title: "Description", content: viewingBook.description }
              : { id: "desc-empty", type: "custom", children: null },
            {
              id: "details",
              title: "Details",
              type: "grid",
              columns: 3,
              fields: [
                { label: "Publisher", value: viewingBook.publisher || "-" },
                { label: "Year", value: viewingBook.publishYear ? String(viewingBook.publishYear) : "-" },
                { label: "Edition", value: viewingBook.edition || "-" },
                { label: "Language", value: viewingBook.language || "-" },
                { label: "Pages", value: viewingBook.pages ? String(viewingBook.pages) : "-" },
                { label: "Location", value: viewingBook.location || "-" },
                {
                  label: "Copies",
                  value: `${viewingBook.availableCopies}/${viewingBook.totalCopies}`,
                  highlight: viewingBook.availableCopies > 0 ? "green" : "red",
                },
                {
                  label: "Price",
                  value: typeof viewingBook.price === "number" ? formatCurrency(viewingBook.price, countryCode) : "-",
                  highlight: "blue",
                },
                { label: "Acquired", value: viewingBook.acquisitionDate ? new Date(viewingBook.acquisitionDate).toLocaleDateString("en-GB") : "-" },
              ],
            },
            viewingBook.tags && viewingBook.tags.length > 0
              ? { id: "tags", title: "Tags", type: "tags", tags: viewingBook.tags.map((t) => ({ label: t })) }
              : { id: "tags-empty", type: "custom", children: null },
          ]}
          actions={[
            {
              id: "edit",
              label: "Edit",
              icon: Edit2,
              variant: "secondary",
              position: "left",
              onClick: () => {
                setIsViewModalOpen(false);
                setViewingBook(null);
                handleEditBook(viewingBook);
              },
            },
            {
              id: "issue",
              label: "Issue Book",
              icon: BookMarked,
              variant: "primary",
              position: "left",
              condition: viewingBook.availableCopies > 0,
              onClick: () => {
                setIsViewModalOpen(false);
                setViewingBook(null);
                handleIssueBook(viewingBook);
              },
            },
            {
              id: "close",
              label: "Close",
              variant: "ghost",
              position: "right",
              onClick: () => {
                setIsViewModalOpen(false);
                setViewingBook(null);
              },
            },
          ]}
          footerInfo={{
            items: [
              { label: "Created", value: new Date(viewingBook.createdAt).toLocaleString() },
              { label: "Updated", value: new Date(viewingBook.updatedAt).toLocaleString() },
            ],
          }}
        />
      )}

      {/* Add/Edit Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        isSaving={isSaving}
        editingBook={editingBook}
      />

      {/* Issue Book Modal */}
      <IssueBookModal
        isOpen={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setIssuingBook(null);
        }}
        onIssue={handleIssueBookSubmit}
        book={issuingBook}
        isIssuing={isIssuing}
      />
    </DataManagementPage>
  );
}
