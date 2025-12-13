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
  Receipt,
  Eye,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  AlertTriangle,
  Trash2,
  Filter,
  Download,
  Calendar,
  User,
} from "lucide-react";
import type { LibraryFine } from "@/types/library";

// Mock Library Fines Data
const MOCK_FINES: LibraryFine[] = [
  {
    id: "fine-001",
    loanId: "loan-002",
    memberId: "mem-002",
    memberName: "Amina Bello",
    bookTitle: "The Diary of a Young Girl",
    fineType: "overdue",
    amount: 500,
    daysOverdue: 5,
    isPaid: false,
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
  },
  {
    id: "fine-002",
    loanId: "loan-008",
    memberId: "mem-008",
    memberName: "David Okafor",
    bookTitle: "World History: Patterns of Interaction",
    fineType: "overdue",
    amount: 900,
    daysOverdue: 9,
    isPaid: false,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "fine-003",
    loanId: "loan-006",
    memberId: "mem-006",
    memberName: "Fatima Yusuf",
    bookTitle: "Biology: Concepts and Connections",
    fineType: "overdue",
    amount: 200,
    daysOverdue: 2,
    isPaid: true,
    paidDate: "2024-01-05",
    paidAmount: 200,
    paymentMethod: "Cash",
    paymentReference: "RCP-2024-001",
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T11:00:00Z",
  },
  {
    id: "fine-004",
    loanId: "loan-010",
    memberId: "mem-010",
    memberName: "Emmanuel Udo",
    bookTitle: "Things Fall Apart",
    fineType: "lost",
    amount: 5000,
    isPaid: false,
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
  },
  {
    id: "fine-005",
    loanId: "loan-011",
    memberId: "mem-003",
    memberName: "Mr. Chukwuma Obi",
    bookTitle: "Introduction to Physics",
    fineType: "damaged",
    amount: 1500,
    isPaid: true,
    paidDate: "2024-01-08",
    paidAmount: 1000,
    paymentMethod: "Bank Transfer",
    paymentReference: "TRF-2024-0891",
    waivedAmount: 500,
    waivedBy: "Librarian",
    waivedReason: "Staff member - partial waiver approved",
    createdAt: "2024-01-06T12:00:00Z",
    updatedAt: "2024-01-08T15:00:00Z",
  },
  {
    id: "fine-006",
    loanId: "loan-012",
    memberId: "mem-005",
    memberName: "Ibrahim Musa",
    bookTitle: "Mathematics for Junior Secondary",
    fineType: "overdue",
    amount: 300,
    daysOverdue: 3,
    isPaid: true,
    paidDate: "2024-01-12",
    paidAmount: 300,
    paymentMethod: "Card",
    paymentReference: "CARD-2024-445",
    createdAt: "2024-01-12T08:30:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "fine-007",
    loanId: "loan-013",
    memberId: "mem-004",
    memberName: "Grace Eze",
    bookTitle: "English Grammar Workbook",
    fineType: "overdue",
    amount: 100,
    daysOverdue: 1,
    isPaid: false,
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "fine-008",
    loanId: "loan-014",
    memberId: "mem-001",
    memberName: "John Adebayo",
    bookTitle: "Chemistry Fundamentals",
    fineType: "damaged",
    amount: 2000,
    isPaid: true,
    paidDate: "2024-01-02",
    paidAmount: 2000,
    paymentMethod: "Cash",
    paymentReference: "RCP-2024-002",
    createdAt: "2024-01-01T11:00:00Z",
    updatedAt: "2024-01-02T14:30:00Z",
  },
];

// Filter options
const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "overdue", label: "Overdue" },
  { value: "lost", label: "Lost Book" },
  { value: "damaged", label: "Damaged Book" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

export default function LibraryFinesPage() {
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();
  const { countryCode, countryConfig } = useCountry();
  const currencySymbol = countryConfig.currency.symbol;

  // State
  const [fines, setFines] = useState<LibraryFine[]>(MOCK_FINES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWaiveModalOpen, setIsWaiveModalOpen] = useState(false);
  const [viewingFine, setViewingFine] = useState<LibraryFine | null>(null);
  const [processingFine, setProcessingFine] = useState<LibraryFine | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

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

  // Filter fines
  const filteredFines = useMemo(() => {
    return fines.filter((fine) => {
      const matchesSearch =
        searchQuery === "" ||
        fine.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fine.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fine.paymentReference?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || fine.fineType === selectedType;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "pending" && !fine.isPaid) ||
        (selectedStatus === "paid" && fine.isPaid);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [fines, searchQuery, selectedType, selectedStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFines = fines.length;
    const pendingFines = fines.filter((f) => !f.isPaid).length;
    const pendingAmount = fines.filter((f) => !f.isPaid).reduce((sum, f) => sum + f.amount, 0);
    const collectedAmount = fines.filter((f) => f.isPaid).reduce((sum, f) => sum + (f.paidAmount || 0), 0);
    const waivedAmount = fines.reduce((sum, f) => sum + (f.waivedAmount || 0), 0);

    return { totalFines, pendingFines, pendingAmount, collectedAmount, waivedAmount };
  }, [fines]);

  // Handle view fine
  const handleView = (fine: LibraryFine) => {
    setViewingFine(fine);
    setIsViewModalOpen(true);
  };

  // Handle record payment
  const handlePaymentClick = (fine: LibraryFine) => {
    setProcessingFine(fine);
    setPaymentAmount(fine.amount.toString());
    setPaymentMethod("Cash");
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async () => {
    if (!processingFine) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const paidAmount = parseFloat(paymentAmount);
    setFines(
      fines.map((f) =>
        f.id === processingFine.id
          ? {
              ...f,
              isPaid: true,
              paidDate: new Date().toISOString().split("T")[0],
              paidAmount: paidAmount,
              paymentMethod: paymentMethod,
              paymentReference: `RCP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    );

    setIsSaving(false);
    setIsPaymentModalOpen(false);
    setProcessingFine(null);
  };

  // Handle waive fine
  const handleWaiveClick = (fine: LibraryFine) => {
    setProcessingFine(fine);
    setIsWaiveModalOpen(true);
  };

  const handleWaiveConfirm = async () => {
    if (!processingFine) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setFines(
      fines.map((f) =>
        f.id === processingFine.id
          ? {
              ...f,
              isPaid: true,
              paidAmount: 0,
              waivedAmount: f.amount,
              waivedBy: "Current User",
              waivedReason: "Waived by administrator",
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    );

    setIsSaving(false);
    setIsWaiveModalOpen(false);
    setProcessingFine(null);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setSelectedType("all");
    setSelectedStatus("all");
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Get fine type badge
  const getFineTypeBadge = (fineType: LibraryFine["fineType"]) => {
    const typeConfig: Record<LibraryFine["fineType"], { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      overdue: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Overdue",
      },
      lost: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "Lost",
      },
      damaged: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Damaged",
      },
    };

    const config = typeConfig[fineType];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (fine: LibraryFine) => {
    if (fine.isPaid) {
      if (fine.waivedAmount && fine.waivedAmount > 0 && (!fine.paidAmount || fine.paidAmount === 0)) {
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
            <Trash2 className="w-3 h-3" />
            Waived
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3" />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  // Table columns
  const columns: ColumnConfig<LibraryFine>[] = [
    {
      key: "memberName",
      label: "Member",
      sortable: true,
      render: (fine) => (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={`https://i.pravatar.cc/150?u=${fine.memberId}`}
              alt={fine.memberName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{fine.memberName}</div>
        </div>
      ),
    },
    {
      key: "bookTitle",
      label: "Book",
      sortable: true,
      className: "text-left",
      render: (fine) => (
        <div className="max-w-[200px]">
          <p className="text-sm text-gray-900 dark:text-white truncate" title={fine.bookTitle}>
            {fine.bookTitle}
          </p>
        </div>
      ),
    },
    {
      key: "fineType",
      label: "Type",
      sortable: true,
      render: (fine) => getFineTypeBadge(fine.fineType),
    },
    {
      key: "daysOverdue",
      label: "Days",
      sortable: true,
      render: (fine) =>
        fine.daysOverdue ? (
          <span className="text-sm text-gray-600 dark:text-gray-400">{fine.daysOverdue} days</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (fine) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(fine.amount, countryCode)}
        </span>
      ),
    },
    {
      key: "isPaid",
      label: "Status",
      sortable: true,
      render: (fine) => getPaymentBadge(fine),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (fine) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(fine.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (fine) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleView(fine)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {!fine.isPaid && (
            <>
              <button
                onClick={() => handlePaymentClick(fine)}
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title="Record Payment"
              >
                <CreditCard className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleWaiveClick(fine)}
                className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                title="Waive Fine"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const isLoading = isRefreshing || isFiltering;

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Fines" />

      <div className={`space-y-6 transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <PageHeader
            title="Fines & Payments"
            breadcrumbs={[
              { label: "Management", href: "/library" },
              { label: "Library", href: "/library" },
              { label: "Fines" },
            ]}
          />
          <PageActions
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
            label="Total Fines"
            value={stats.totalFines.toString()}
            icon={Receipt}
            color="blue"
          />
          <StatCard
            label="Pending"
            value={formatCurrency(stats.pendingAmount, countryCode)}
            subtitle={`${stats.pendingFines} fines`}
            icon={Clock}
            color="red"
          />
          <StatCard
            label="Collected"
            value={formatCurrency(stats.collectedAmount, countryCode)}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            label="Waived"
            value={formatCurrency(stats.waivedAmount, countryCode)}
            icon={Trash2}
            color="purple"
          />
        </div>

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by member, book, or reference..."
          filters={[
            {
              label: "Type",
              value: selectedType,
              onChange: (val) => handleFilterChange(setSelectedType, val),
              options: TYPE_OPTIONS,
            },
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => handleFilterChange(setSelectedStatus, val),
              options: STATUS_OPTIONS,
            },
          ]}
        />

        {/* Data Table */}
        <DataTable
          data={filteredFines}
          columns={columns}
          getRowKey={(fine) => fine.id}
          isLoading={isLoading}
          emptyMessage="No fines found"
        />
      </div>

      {/* View Fine Modal */}
      {viewingFine && (
        <FineViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingFine(null);
          }}
          fine={viewingFine}
          getFineTypeBadge={getFineTypeBadge}
          getPaymentBadge={getPaymentBadge}
          formatCurrency={(amount) => formatCurrency(amount, countryCode)}
        />
      )}

      {/* Payment Modal */}
      {processingFine && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setProcessingFine(null);
          }}
          title="Record Payment"
          size="sm"
        >
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Fine for</p>
              <p className="font-semibold text-gray-900 dark:text-white">{processingFine.memberName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{processingFine.bookTitle}</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-2">
                {formatCurrency(processingFine.amount, countryCode)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount Paid ({currencySymbol})
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Money">Mobile Money</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setProcessingFine(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handlePaymentConfirm} isLoading={isSaving}>
                Record Payment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Waive Confirmation Modal */}
      <ConfirmationModal
        isOpen={isWaiveModalOpen}
        onClose={() => {
          setIsWaiveModalOpen(false);
          setProcessingFine(null);
        }}
        onConfirm={handleWaiveConfirm}
        title="Waive Fine"
        message={
          processingFine
            ? `Are you sure you want to waive the fine of ${formatCurrency(processingFine.amount, countryCode)} for ${processingFine.memberName}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Waive Fine"
        cancelLabel="Cancel"
        variant="warning"
        isLoading={isSaving}
      />
    </MainLayout>
  );
}

// Fine View Modal Component
function FineViewModal({
  isOpen,
  onClose,
  fine,
  getFineTypeBadge,
  getPaymentBadge,
  formatCurrency,
}: {
  isOpen: boolean;
  onClose: () => void;
  fine: LibraryFine;
  getFineTypeBadge: (type: LibraryFine["fineType"]) => React.ReactNode;
  getPaymentBadge: (fine: LibraryFine) => React.ReactNode;
  formatCurrency: (amount: number) => string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fine Details" size="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={`https://i.pravatar.cc/150?u=${fine.memberId}`}
                alt={fine.memberName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{fine.memberName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{fine.bookTitle}</p>
            </div>
          </div>
          {getPaymentBadge(fine)}
        </div>

        {/* Fine Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Fine Type</h4>
              {getFineTypeBadge(fine.fineType)}
            </div>
            <div className="text-right">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Amount</h4>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(fine.amount)}</p>
            </div>
          </div>
          {fine.daysOverdue && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {fine.daysOverdue} days overdue
              </span>
            </div>
          )}
        </div>

        {/* Payment Details (if paid) */}
        {fine.isPaid && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-medium text-green-700 dark:text-green-400 uppercase">Payment Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">Amount Paid</p>
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {formatCurrency(fine.paidAmount || 0)}
                </p>
              </div>
              {fine.paymentMethod && (
                <div>
                  <p className="text-xs text-green-600/70 dark:text-green-400/70">Method</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">{fine.paymentMethod}</p>
                </div>
              )}
              {fine.paidDate && (
                <div>
                  <p className="text-xs text-green-600/70 dark:text-green-400/70">Date</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                    {new Date(fine.paidDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              )}
              {fine.paymentReference && (
                <div>
                  <p className="text-xs text-green-600/70 dark:text-green-400/70">Reference</p>
                  <p className="text-sm font-mono font-semibold text-green-700 dark:text-green-300">{fine.paymentReference}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Waiver Details (if waived) */}
        {fine.waivedAmount && fine.waivedAmount > 0 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase">Waiver Details</h4>
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              {formatCurrency(fine.waivedAmount)} waived
            </p>
            {fine.waivedBy && (
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70">By: {fine.waivedBy}</p>
            )}
            {fine.waivedReason && (
              <p className="text-sm text-purple-700 dark:text-purple-300">{fine.waivedReason}</p>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Created</p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(fine.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Updated</p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(fine.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
