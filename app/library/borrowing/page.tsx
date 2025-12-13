"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
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
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import {
  Plus,
  BookOpen,
  Eye,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  BookMarked,
  ArrowRight,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";
import type { BookLoan, LoanStatus, BorrowerType } from "@/types/library";

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
  const currencySymbol = countryConfig.currency.symbol;

  // State
  const [loans, setLoans] = useState<BookLoan[]>(MOCK_LOANS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMemberType, setSelectedMemberType] = useState("all");

  // Modal states
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [viewingLoan, setViewingLoan] = useState<BookLoan | null>(null);
  const [returningLoan, setReturningLoan] = useState<BookLoan | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Loading states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Handle filter changes
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => setIsFiltering(false), 100);
    }, 200);
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

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedMemberType("all");
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Get status badge
  const getStatusBadge = (status: LoanStatus) => {
    const statusConfig: Record<LoanStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      active: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: <BookOpen className="w-3 h-3" />,
        label: "Active",
      },
      overdue: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Overdue",
      },
      returned: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Returned",
      },
      lost: {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-700 dark:text-gray-300",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Lost",
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Get member type badge
  const getMemberTypeBadge = (type: BorrowerType) => {
    const typeConfig: Record<BorrowerType, { bg: string; text: string }> = {
      student: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
      staff: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
      teacher: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-400" },
    };

    const config = typeConfig[type];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text} capitalize`}>
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
        <span className="text-red-600 dark:text-red-400 text-xs font-medium">
          {Math.abs(diffDays)} days overdue
        </span>
      );
    } else if (diffDays === 0) {
      return <span className="text-yellow-600 dark:text-yellow-400 text-xs font-medium">Due today</span>;
    } else if (diffDays <= 3) {
      return (
        <span className="text-yellow-600 dark:text-yellow-400 text-xs font-medium">
          {diffDays} days left
        </span>
      );
    }
    return (
      <span className="text-gray-500 dark:text-gray-400 text-xs">
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
        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{loan.loanNumber}</span>
      ),
    },
    {
      key: "bookTitle",
      label: "Book",
      sortable: true,
      className: "text-left",
      render: (loan) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white" style={{ fontSize: "12px" }}>
            {loan.bookTitle}
          </div>
          <div className="text-gray-500 dark:text-gray-400 font-mono" style={{ fontSize: "10px" }}>
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
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={`https://i.pravatar.cc/150?u=${loan.memberId}`}
              alt={loan.memberName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{loan.memberName}</div>
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
        <span className="text-sm text-gray-600 dark:text-gray-400">
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
          <div className="text-sm text-gray-700 dark:text-gray-300">
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
          <span className={`font-semibold ${loan.finePaid ? "text-gray-500 line-through" : "text-red-600 dark:text-red-400"}`}>
            {formatCurrency(loan.fineAmount, countryCode)}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (loan) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleView(loan)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {(loan.status === "active" || loan.status === "overdue") && (
            <>
              <button
                onClick={() => handleReturnClick(loan)}
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title="Return Book"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {loan.renewalCount < loan.maxRenewals && (
                <button
                  className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                  title="Renew Loan"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
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
              { label: "Management", href: "/library" },
              { label: "Library", href: "/library" },
              { label: "Borrowing" },
            ]}
          />
          <PageActions
            primaryAction={{
              label: "Issue Book",
              onClick: () => setIsIssueModalOpen(true),
              icon: <Plus className="w-4 h-4" />,
            }}
            secondaryActions={[
              { label: "Export", onClick: () => {}, icon: <Download className="w-4 h-4" />, variant: "outline" },
            ]}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Loans"
            value={stats.activeLoans.toString()}
            icon={BookMarked}
            color="blue"
          />
          <StatCard
            label="Overdue"
            value={stats.overdueLoans.toString()}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            label="Returned Today"
            value={stats.returnedLoans.toString()}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            label="Pending Fines"
            value={formatCurrency(stats.totalFines, countryCode)}
            icon={AlertCircle}
            color="amber"
          />
        </div>

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by book, borrower, or loan number..."
          filters={[
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => handleFilterChange(setSelectedStatus, val),
              options: STATUS_OPTIONS,
            },
            {
              label: "Member Type",
              value: selectedMemberType,
              onChange: (val) => handleFilterChange(setSelectedMemberType, val),
              options: MEMBER_TYPE_OPTIONS,
            },
          ]}
        />

        {/* Data Table */}
        <DataTable
          data={filteredLoans}
          columns={columns}
          getRowKey={(loan) => loan.id}
          isLoading={isLoading}
          emptyMessage="No loans found"
        />
      </div>

      {/* Return Confirmation Modal */}
      <ConfirmationModal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setReturningLoan(null);
        }}
        onConfirm={handleReturnConfirm}
        title="Return Book"
        message={
          returningLoan
            ? `Are you sure you want to mark "${returningLoan.bookTitle}" as returned by ${returningLoan.memberName}?${
                returningLoan.fineAmount > 0 && !returningLoan.finePaid
                  ? ` There is an outstanding fine of ${formatCurrency(returningLoan.fineAmount, countryCode)}.`
                  : ""
              }`
            : ""
        }
        confirmLabel="Confirm Return"
        cancelLabel="Cancel"
        variant="primary"
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
          getStatusBadge={getStatusBadge}
          getMemberTypeBadge={getMemberTypeBadge}
          formatCurrency={(amount) => formatCurrency(amount, countryCode)}
        />
      )}
    </MainLayout>
  );
}

// Loan View Modal Component
function LoanViewModal({
  isOpen,
  onClose,
  loan,
  getStatusBadge,
  getMemberTypeBadge,
  formatCurrency,
}: {
  isOpen: boolean;
  onClose: () => void;
  loan: BookLoan;
  getStatusBadge: (status: LoanStatus) => React.ReactNode;
  getMemberTypeBadge: (type: BorrowerType) => React.ReactNode;
  formatCurrency: (amount: number) => string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Loan Details" size="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{loan.loanNumber}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Issued on {new Date(loan.borrowDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          {getStatusBadge(loan.status)}
        </div>

        {/* Book Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Book Information</h4>
          <p className="font-semibold text-gray-900 dark:text-white">{loan.bookTitle}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{loan.bookIsbn}</p>
        </div>

        {/* Borrower Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Borrower</h4>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={`https://i.pravatar.cc/150?u=${loan.memberId}`}
                alt={loan.memberName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{loan.memberName}</p>
              {getMemberTypeBadge(loan.memberType)}
            </div>
          </div>
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Borrow Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(loan.borrowDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Due Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(loan.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          {loan.returnDate && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 col-span-2">
              <p className="text-xs text-green-600 dark:text-green-400 uppercase mb-1">Returned On</p>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {new Date(loan.returnDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          )}
        </div>

        {/* Renewal & Fine Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Renewals</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {loan.renewalCount} / {loan.maxRenewals}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Fine</p>
            <p className={`text-sm font-medium ${loan.fineAmount > 0 ? (loan.finePaid ? "text-gray-500 line-through" : "text-red-600 dark:text-red-400") : "text-gray-900 dark:text-white"}`}>
              {loan.fineAmount > 0 ? formatCurrency(loan.fineAmount) : "None"}
              {loan.finePaid && <span className="ml-2 text-green-600 dark:text-green-400 no-underline">(Paid)</span>}
            </p>
          </div>
        </div>

        {/* Notes */}
        {loan.notes && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h4 className="text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase mb-1">Notes</h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">{loan.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Issued by: {loan.issuedBy}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
