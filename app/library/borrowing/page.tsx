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
import Tooltip from "@/components/shared/Tooltip";
import {
  Plus,
  BookOpen,
  Eye,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookMarked,
  RefreshCw,
} from "lucide-react";
import type { BookLoan, LoanStatus, BorrowerType } from "@/types/library";
import { exportLoansToExcel, exportLoansToPDF } from "@/lib/export-utils";
import LoanViewModal from "@/components/library/LoanViewModal";
import ReturnBookModal from "@/components/library/ReturnBookModal";
import RenewLoanModal from "@/components/library/RenewLoanModal";
import IssueLoanModal from "@/components/library/IssueLoanModal";
import IssueFineModal from "@/components/library/IssueFineModal";

// Mock Loan Data
const MOCK_LOANS: BookLoan[] = [
  {
    id: "loan-001",
    loanNumber: "LN-2024-0001",
    bookId: "book-002",
    bookTitle: "To Kill a Mockingbird",
    bookIsbn: "978-0-06-093546-7",
    memberId: "mem-001",
    memberName: "John Adebayo",
    memberType: "student",
    borrowDate: "2024-01-10",
    dueDate: "2024-01-24",
    status: "active",
    renewalCount: 0,
    maxRenewals: 2,
    fineAmount: 0,
    finePaid: false,
    issuedBy: "Librarian",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "loan-002",
    loanNumber: "LN-2024-0002",
    bookId: "book-005",
    bookTitle: "The Diary of a Young Girl",
    bookIsbn: "978-0-14-028329-7",
    memberId: "mem-002",
    memberName: "Amina Bello",
    memberType: "student",
    borrowDate: "2024-01-05",
    dueDate: "2024-01-19",
    status: "overdue",
    renewalCount: 1,
    maxRenewals: 2,
    fineAmount: 500,
    finePaid: false,
    issuedBy: "Librarian",
    createdAt: "2024-01-05T10:30:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
  },
  {
    id: "loan-003",
    loanNumber: "LN-2024-0003",
    bookId: "book-003",
    bookTitle: "A Brief History of Time",
    bookIsbn: "978-1-40-883213-6",
    memberId: "mem-003",
    memberName: "Mr. Chukwuma Obi",
    memberType: "teacher",
    borrowDate: "2024-01-08",
    dueDate: "2024-02-05",
    status: "active",
    renewalCount: 0,
    maxRenewals: 3,
    fineAmount: 0,
    finePaid: false,
    issuedBy: "Librarian",
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-08T11:00:00Z",
  },
  {
    id: "loan-004",
    loanNumber: "LN-2024-0004",
    bookId: "book-001",
    bookTitle: "Introduction to Algorithms",
    bookIsbn: "978-0-13-468599-1",
    memberId: "mem-004",
    memberName: "Grace Eze",
    memberType: "student",
    borrowDate: "2024-01-02",
    dueDate: "2024-01-16",
    returnDate: "2024-01-15",
    status: "returned",
    renewalCount: 0,
    maxRenewals: 2,
    fineAmount: 0,
    finePaid: false,
    issuedBy: "Librarian",
    returnedTo: "Librarian",
    createdAt: "2024-01-02T14:00:00Z",
    updatedAt: "2024-01-15T16:30:00Z",
  },
  {
    id: "loan-005",
    loanNumber: "LN-2024-0005",
    bookId: "book-007",
    bookTitle: "1984",
    bookIsbn: "978-0-7432-7356-5",
    memberId: "mem-005",
    memberName: "Ibrahim Musa",
    memberType: "student",
    borrowDate: "2024-01-12",
    dueDate: "2024-01-26",
    status: "active",
    renewalCount: 0,
    maxRenewals: 2,
    fineAmount: 0,
    finePaid: false,
    issuedBy: "Librarian",
    createdAt: "2024-01-12T09:45:00Z",
    updatedAt: "2024-01-12T09:45:00Z",
  },
  {
    id: "loan-006",
    loanNumber: "LN-2024-0006",
    bookId: "book-006",
    bookTitle: "Biology: Concepts and Connections",
    bookIsbn: "978-0-07-352332-3",
    memberId: "mem-006",
    memberName: "Fatima Yusuf",
    memberType: "student",
    borrowDate: "2023-12-20",
    dueDate: "2024-01-03",
    returnDate: "2024-01-05",
    status: "returned",
    renewalCount: 0,
    maxRenewals: 2,
    fineAmount: 200,
    finePaid: true,
    issuedBy: "Librarian",
    returnedTo: "Librarian",
    notes: "Returned 2 days late - fine paid",
    createdAt: "2023-12-20T10:00:00Z",
    updatedAt: "2024-01-05T11:00:00Z",
  },
  {
    id: "loan-007",
    loanNumber: "LN-2024-0007",
    bookId: "book-010",
    bookTitle: "Crime and Punishment",
    bookIsbn: "978-0-14-044913-6",
    memberId: "mem-007",
    memberName: "Mrs. Adaeze Nwosu",
    memberType: "staff",
    borrowDate: "2024-01-11",
    dueDate: "2024-02-08",
    status: "active",
    renewalCount: 0,
    maxRenewals: 3,
    fineAmount: 0,
    finePaid: false,
    issuedBy: "Librarian",
    createdAt: "2024-01-11T15:30:00Z",
    updatedAt: "2024-01-11T15:30:00Z",
  },
  {
    id: "loan-008",
    loanNumber: "LN-2024-0008",
    bookId: "book-009",
    bookTitle: "World History: Patterns of Interaction",
    bookIsbn: "978-0-521-66326-3",
    memberId: "mem-008",
    memberName: "David Okafor",
    memberType: "student",
    borrowDate: "2023-12-28",
    dueDate: "2024-01-11",
    status: "overdue",
    renewalCount: 2,
    maxRenewals: 2,
    fineAmount: 900,
    finePaid: false,
    issuedBy: "Librarian",
    notes: "Maximum renewals reached",
    createdAt: "2023-12-28T08:30:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
];

// Filter options
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "overdue", label: "Overdue" },
  { value: "returned", label: "Returned" },
  { value: "lost", label: "Lost" },
];

const MEMBER_TYPE_OPTIONS = [
  { value: "all", label: "All Members" },
  { value: "student", label: "Students" },
  { value: "staff", label: "Staff" },
  { value: "teacher", label: "Teachers" },
];

export default function BorrowingPage() {
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();
  const { countryCode, countryConfig } = useCountry();

  // State
  const [loans, setLoans] = useState<BookLoan[]>(MOCK_LOANS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMemberType, setSelectedMemberType] = useState("all");

  // Modal states
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isFineModalOpen, setIsFineModalOpen] = useState(false);
  const [viewingLoan, setViewingLoan] = useState<BookLoan | null>(null);
  const [returningLoan, setReturningLoan] = useState<BookLoan | null>(null);
  const [renewingLoan, setRenewingLoan] = useState<BookLoan | null>(null);
  const [finingLoan, setFiningLoan] = useState<BookLoan | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Loading states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Animation trigger
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Create a filterKey to track filter/search changes
  const filterKey = `${searchQuery}-${selectedStatus}-${selectedMemberType}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Handle filter changes with animation
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => setIsFiltering(false), 100);
    }, 200);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Filter loans
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        searchQuery === "" ||
        loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.loanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.bookIsbn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === "all" || loan.status === selectedStatus;
      const matchesMemberType = selectedMemberType === "all" || loan.memberType === selectedMemberType;

      return matchesSearch && matchesStatus && matchesMemberType;
    });
  }, [loans, searchQuery, selectedStatus, selectedMemberType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeLoans = loans.filter((l) => l.status === "active").length;
    const overdueLoans = loans.filter((l) => l.status === "overdue").length;
    const returnedLoans = loans.filter((l) => l.status === "returned").length;
    const totalFines = loans.reduce((sum, l) => sum + (l.finePaid ? 0 : l.fineAmount), 0);

    return { activeLoans, overdueLoans, returnedLoans, totalFines };
  }, [loans]);

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

  // Handle view loan
  const handleView = (loan: BookLoan) => {
    setViewingLoan(loan);
    setIsViewModalOpen(true);
  };

  // Handle return book
  const handleReturnClick = (loan: BookLoan) => {
    setReturningLoan(loan);
    setIsReturnModalOpen(true);
  };

  const handleReturnConfirm = async () => {
    if (!returningLoan) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoans(
      loans.map((l) =>
        l.id === returningLoan.id
          ? {
              ...l,
              status: "returned" as LoanStatus,
              returnDate: new Date().toISOString().split("T")[0],
              returnedTo: "Current User",
              updatedAt: new Date().toISOString(),
            }
          : l
      )
    );

    setIsSaving(false);
    setIsReturnModalOpen(false);
    setReturningLoan(null);
  };

  // Handle renew click
  const handleRenewClick = (loan: BookLoan) => {
    setRenewingLoan(loan);
    setIsRenewModalOpen(true);
  };

  // Handle renew confirm
  const handleRenewConfirm = async (newDueDate: string) => {
    if (!renewingLoan) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoans(
      loans.map((l) =>
        l.id === renewingLoan.id
          ? {
              ...l,
              dueDate: newDueDate,
              renewalCount: l.renewalCount + 1,
              updatedAt: new Date().toISOString(),
            }
          : l
      )
    );

    setIsSaving(false);
    setIsRenewModalOpen(false);
    setRenewingLoan(null);
  };

  // Handle issue book
  const handleIssueBookSubmit = (loanData: Omit<BookLoan, "id" | "createdAt" | "updatedAt">) => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      const newLoan: BookLoan = {
        ...loanData,
        id: `loan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLoans((prev) => [newLoan, ...prev]);

      // In a real app, you would also update the book's available copies
      console.log("Book issued:", loanData);

      setIsSaving(false);
      setIsIssueModalOpen(false);
    }, 500);
  };

  // Handle issue fine
  const handleIssueFineClick = (loan: BookLoan) => {
    setFiningLoan(loan);
    setIsFineModalOpen(true);
  };

  const handleIssueFineConfirm = (
    loanId: string,
    fineAmount: number,
    fineType: "overdue" | "lost" | "damaged",
    notes?: string
  ) => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setLoans(
        loans.map((l) =>
          l.id === loanId
            ? {
                ...l,
                fineAmount: l.fineAmount + fineAmount,
                finePaid: false,
                notes: notes ? `${l.notes ? l.notes + ". " : ""}Fine: ${notes}` : l.notes,
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );

      // In a real app, you would also create a LibraryFine record
      console.log("Fine issued:", { loanId, fineAmount, fineType, notes });

      setIsSaving(false);
      setIsFineModalOpen(false);
      setFiningLoan(null);
    }, 500);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedMemberType("all");
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Export to PDF
  const handleExportPDF = () => {
    exportLoansToPDF(
      filteredLoans,
      "borrowing-records",
      (amount) => formatCurrency(amount, countryCode),
      settings.schoolName
    );
  };

  // Export to Excel
  const handleExportExcel = () => {
    exportLoansToExcel(
      filteredLoans,
      "borrowing-records",
      (amount) => formatCurrency(amount, countryCode)
    );
  };

  // Get status badge
  const getStatusBadge = (status: LoanStatus) => {
    const statusConfig: Record<LoanStatus, { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
      active: {
        bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/20 purple:bg-blue-900/20",
        text: "text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        icon: <BookOpen className="w-3 h-3" />,
        label: "Active",
      },
      overdue: {
        bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/20 purple:bg-red-900/20",
        text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        border: "border-red-200 dark:border-red-800",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Overdue",
      },
      returned: {
        bg: "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/20 purple:bg-green-900/20",
        text: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
        border: "border-green-200 dark:border-green-800",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Returned",
      },
      lost: {
        bg: "bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300",
        border: "border-gray-200 dark:border-gray-600",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Lost",
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border}`} style={{ fontSize: '11.8px' }}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Get member type badge
  const getMemberTypeBadge = (type: BorrowerType) => {
    const typeConfig: Record<BorrowerType, { bg: string; text: string; border: string }> = {
      student: {
        bg: "bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/20 purple:bg-purple-900/20",
        text: "text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
        border: "border-purple-200 dark:border-purple-800"
      },
      staff: {
        bg: "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/20 purple:bg-orange-900/20",
        text: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
        border: "border-orange-200 dark:border-orange-800"
      },
      teacher: {
        bg: "bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/20 purple:bg-cyan-900/20",
        text: "text-cyan-700 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400",
        border: "border-cyan-200 dark:border-cyan-800"
      },
    };

    const config = typeConfig[type];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold border capitalize ${config.bg} ${config.text} ${config.border}`} style={{ fontSize: '10px' }}>
        {type}
      </span>
    );
  };

  // Calculate days until due or overdue
  const getDaysStatus = (dueDate: string, status: LoanStatus) => {
    if (status === "returned") return null;

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="text-red-600 dark:text-red-400 font-medium" style={{ fontSize: '10px' }}>
          {Math.abs(diffDays)} days overdue
        </span>
      );
    } else if (diffDays === 0) {
      return <span className="text-yellow-600 dark:text-yellow-400 font-medium" style={{ fontSize: '10px' }}>Due today</span>;
    } else if (diffDays <= 3) {
      return (
        <span className="text-yellow-600 dark:text-yellow-400 font-medium" style={{ fontSize: '10px' }}>
          {diffDays} days left
        </span>
      );
    }
    return (
      <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: '10px' }}>
        {diffDays} days left
      </span>
    );
  };

  // Table columns
  const columns: ColumnConfig<BookLoan>[] = [
    {
      key: "loanNumber",
      label: "Loan #",
      sortable: true,
      render: (loan) => (
        <span className="font-mono text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100" style={{ fontSize: '11.8px' }}>{loan.loanNumber}</span>
      ),
    },
    {
      key: "bookTitle",
      label: "Book",
      sortable: true,
      className: "text-left",
      render: (loan) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50" style={{ fontSize: "11.8px" }}>
            {loan.bookTitle}
          </div>
          <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 font-mono" style={{ fontSize: "10px" }}>
            {loan.bookIsbn}
          </div>
        </div>
      ),
    },
    {
      key: "memberName",
      label: "Borrower",
      sortable: true,
      render: (loan) => (
        <div className="flex items-center gap-2">
          <div
            className="relative cursor-pointer group/avatar flex-shrink-0 w-8 h-8"
            onMouseEnter={(e) => {
              const tr = e.currentTarget.closest('tr');
              if (tr) {
                tr.style.zIndex = '100';
                tr.style.position = 'relative';
              }
              const scrollContainer = e.currentTarget.closest('.overflow-x-auto');
              if (scrollContainer) {
                (scrollContainer as HTMLElement).style.zIndex = '100';
                (scrollContainer as HTMLElement).style.position = 'relative';
              }
            }}
            onMouseLeave={(e) => {
              const tr = e.currentTarget.closest('tr');
              if (tr) {
                tr.style.zIndex = '';
                tr.style.position = '';
              }
              const scrollContainer = e.currentTarget.closest('.overflow-x-auto');
              if (scrollContainer) {
                (scrollContainer as HTMLElement).style.zIndex = '';
                (scrollContainer as HTMLElement).style.position = '';
              }
            }}
          >
            <Image
              src={`https://randomuser.me/api/portraits/${loan.memberType === 'teacher' || loan.memberType === 'staff' ? 'men' : loan.memberId.includes('002') || loan.memberId.includes('006') ? 'women' : 'men'}/${parseInt(loan.memberId.replace('mem-', '')) % 100}.jpg`}
              alt={loan.memberName}
              width={32}
              height={32}
              className="absolute inset-0 w-8 h-8 rounded-full object-cover ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-300 ease-out group-hover/avatar:scale-[2.5] group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90"
              style={{ transformOrigin: 'left center' }}
              unoptimized
            />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50" style={{ fontSize: '11.8px' }}>{loan.memberName}</div>
            {getMemberTypeBadge(loan.memberType)}
          </div>
        </div>
      ),
    },
    {
      key: "borrowDate",
      label: "Borrow Date",
      sortable: true,
      render: (loan) => (
        <span className="text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400" style={{ fontSize: '11.8px' }}>
          {new Date(loan.borrowDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (loan) => (
        <div>
          <div className="text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100" style={{ fontSize: '11.8px' }}>
            {new Date(loan.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          {getDaysStatus(loan.dueDate, loan.status)}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (loan) => getStatusBadge(loan.status),
    },
    {
      key: "fineAmount",
      label: "Fine",
      sortable: true,
      render: (loan) =>
        loan.fineAmount > 0 ? (
          <span className={`font-semibold ${loan.finePaid ? "text-gray-500 line-through" : "text-red-600 dark:text-red-400"}`} style={{ fontSize: '11.8px' }}>
            {formatCurrency(loan.fineAmount, countryCode)}
          </span>
        ) : (
          <span className="text-gray-400" style={{ fontSize: '11.8px' }}>-</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (loan) => (
        <div className="flex items-center justify-center gap-2.5">
          <Tooltip content="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView(loan);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-blue-950/30 midnight:to-blue-900/20 purple:from-blue-950/30 purple:to-blue-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 active:scale-95"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
            </button>
          </Tooltip>
          {(loan.status === "active" || loan.status === "overdue") && (
            <>
              <Tooltip content="Return Book">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReturnClick(loan);
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 midnight:from-green-950/30 midnight:to-green-900/20 purple:from-green-950/30 purple:to-green-900/20 hover:from-green-100 hover:to-green-100 dark:hover:from-green-900/40 dark:hover:to-green-800/30 transition-all duration-200 cursor-pointer border border-green-200/40 dark:border-green-800/30 hover:border-green-400/60 dark:hover:border-green-600/50 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                </button>
              </Tooltip>
              {loan.renewalCount < loan.maxRenewals && (
                <Tooltip content={`Renew Loan (${loan.renewalCount}/${loan.maxRenewals} used)`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenewClick(loan);
                    }}
                    className="group relative p-2 rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 midnight:from-purple-950/30 midnight:to-purple-900/20 purple:from-purple-950/30 purple:to-purple-900/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-purple-900/40 dark:hover:to-purple-800/30 transition-all duration-200 cursor-pointer border border-purple-200/40 dark:border-purple-800/30 hover:border-purple-400/60 dark:hover:border-purple-600/50 active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
                  </button>
                </Tooltip>
              )}
              <Tooltip content="Issue Fine">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIssueFineClick(loan);
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20 midnight:from-amber-950/30 midnight:to-amber-900/20 purple:from-amber-950/30 purple:to-amber-900/20 hover:from-amber-100 hover:to-amber-100 dark:hover:from-amber-900/40 dark:hover:to-amber-800/30 transition-all duration-200 cursor-pointer border border-amber-200/40 dark:border-amber-800/30 hover:border-amber-400/60 dark:hover:border-amber-600/50 active:scale-95"
                >
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">{countryConfig.currency.symbol}</span>
                </button>
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  const isLoading = isRefreshing || isFiltering;

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Loans" />

      <div className={`space-y-6 transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <PageHeader
            title="Borrowing & Returns"
            breadcrumbs={[
              { label: "Library", href: "/library" },
              { label: "Borrowing" },
            ]}
          />
          <PageActions
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onAdd={() => setIsIssueModalOpen(true)}
            addButtonLabel="Issue Book"
            exportDescription="Export borrowing records"
            showPrint={false}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={BookMarked}
            label="Active Loans"
            value={stats.activeLoans.toString()}
            color="blue"
            badge={`${filteredLoans.filter(l => l.status === 'active').length} shown`}
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={stats.overdueLoans.toString()}
            color="red"
            badge={stats.overdueLoans > 0 ? "Needs attention" : "All clear"}
          />
          <StatCard
            icon={CheckCircle2}
            label="Returned"
            value={stats.returnedLoans.toString()}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Pending Fines"
            value={formatCurrency(stats.totalFines, countryCode)}
            color="amber"
            badge={stats.totalFines > 0 ? "Outstanding" : "None"}
          />
        </div>

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search by book, borrower, or loan number..."
          filters={[
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => handleFilterChange(setSelectedStatus, String(val)),
              options: STATUS_OPTIONS,
            },
            {
              label: "Member Type",
              value: selectedMemberType,
              onChange: (val) => handleFilterChange(setSelectedMemberType, String(val)),
              options: MEMBER_TYPE_OPTIONS,
            },
          ]}
        />

        {/* Table Section */}
        <div>
          {isLoading ? (
            <PageSpinner message={isRefreshing ? "Refreshing..." : "Filtering..."} size="md" />
          ) : filteredLoans.length === 0 ? (
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
                  No loans found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                  {searchQuery
                    ? "No results match your search. Try adjusting your filters."
                    : "Get started by issuing your first book loan."}
                </p>
                {!searchQuery && (
                  <Button variant="primary" onClick={() => setIsIssueModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Issue Book
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
                  data={filteredLoans}
                  columns={columns}
                  getRowKey={(loan) => loan.id}
                  emptyMessage="No loans found"
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

      {/* Return Confirmation Modal */}
      <ReturnBookModal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setReturningLoan(null);
        }}
        onConfirm={handleReturnConfirm}
        loan={returningLoan}
        formatCurrency={(amount) => formatCurrency(amount, countryCode)}
        isLoading={isSaving}
      />

      {/* Renew Loan Modal */}
      <RenewLoanModal
        isOpen={isRenewModalOpen}
        onClose={() => {
          setIsRenewModalOpen(false);
          setRenewingLoan(null);
        }}
        onConfirm={handleRenewConfirm}
        loan={renewingLoan}
        renewalDays={14}
        isLoading={isSaving}
      />

      {/* View Loan Modal */}
      {viewingLoan && (
        <LoanViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingLoan(null);
          }}
          loan={viewingLoan}
          formatCurrency={(amount) => formatCurrency(amount, countryCode)}
          onRenew={() => {
            // Close view modal and open renew modal
            setIsViewModalOpen(false);
            setRenewingLoan(viewingLoan);
            setIsRenewModalOpen(true);
            setViewingLoan(null);
          }}
          onReturn={() => {
            // Close view modal and open return modal
            setIsViewModalOpen(false);
            setReturningLoan(viewingLoan);
            setIsReturnModalOpen(true);
            setViewingLoan(null);
          }}
        />
      )}

      {/* Issue New Loan Modal */}
      <IssueLoanModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssue={handleIssueBookSubmit}
        isIssuing={isSaving}
      />

      {/* Issue Fine Modal */}
      <IssueFineModal
        isOpen={isFineModalOpen}
        onClose={() => {
          setIsFineModalOpen(false);
          setFiningLoan(null);
        }}
        onIssueFine={handleIssueFineConfirm}
        loan={finingLoan}
        formatCurrency={(amount) => formatCurrency(amount, countryCode)}
        currencySymbol={countryConfig.currency.symbol}
        finePerDay={100}
        lostBookMultiplier={2}
        damagedBookPercentage={50}
        isLoading={isSaving}
      />
    </MainLayout>
  );
}
