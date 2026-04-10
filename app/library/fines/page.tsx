"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { DataManagementPage } from "@/components/pages";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import Button from "@/components/shared/Button";
import ResponsiveListTable from "@/components/shared/ResponsiveListTable";
import Modal from "@/components/shared/Modal";
import Tooltip from "@/components/shared/Tooltip";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import {
  Receipt,
  Eye,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  AlertTriangle,
  Trash2,
  Loader2,
  Banknote,
  Wallet,
  FileText,
} from "lucide-react";
import type { LibraryFine } from "@/types/library";
import type { ColumnConfig } from "@/types/components";
import { exportFinesToExcel, exportFinesToPDF } from "@/lib/export-utils";
import {
  fineFilterFields,
  fineSortOptions,
  filterFines,
  sortFines,
  searchFines,
  getFineStats,
} from "../config";

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

export default function LibraryFinesPage() {
  const { settings } = useSchoolSettings();
  const { countryCode, countryConfig } = useCountry();
  const currencySymbol = countryConfig.currency.symbol;

  // State
  const [fines, setFines] = useState<LibraryFine[]>(MOCK_FINES);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWaiveModalOpen, setIsWaiveModalOpen] = useState(false);
  const [isIssueFineModalOpen, setIsIssueFineModalOpen] = useState(false);
  const [viewingFine, setViewingFine] = useState<LibraryFine | null>(null);
  const [processingFine, setProcessingFine] = useState<LibraryFine | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Waive form state
  const [waiveReason, setWaiveReason] = useState("");

  // Issue Fine form state
  const [issueFineType, setIssueFineType] = useState<"overdue" | "lost" | "damaged">("overdue");
  const [issueFineAmount, setIssueFineAmount] = useState("");
  const [issueFineNotes, setIssueFineNotes] = useState("");
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [selectedLoanId, setSelectedLoanId] = useState("");

  // Stats config
  const fineStats = useMemo(
    () => getFineStats(fines, (amount) => formatCurrency(amount, countryCode)),
    [fines, countryCode]
  );

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
              waivedReason: waiveReason || "Waived by administrator",
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    );

    setIsSaving(false);
    setIsWaiveModalOpen(false);
    setProcessingFine(null);
    setWaiveReason("");
  };

  // Handle issue fine
  const handleIssueFine = async () => {
    if (!selectedLoanId) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newFine: LibraryFine = {
      id: `fine-${Date.now()}`,
      loanId: selectedLoanId,
      memberId: "mem-001", // Would come from selected loan
      memberName: "John Adebayo", // Would come from selected loan
      bookTitle: "Chemistry Fundamentals", // Would come from selected loan
      fineType: issueFineType,
      amount: Number(issueFineAmount),
      daysOverdue: issueFineType === "overdue" ? Math.floor(Number(issueFineAmount) / 100) : undefined,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFines([newFine, ...fines]);
    setIsSaving(false);
    setIsIssueFineModalOpen(false);
    resetIssueFineForm();
  };

  // Reset issue fine form
  const resetIssueFineForm = () => {
    setIssueFineType("overdue");
    setIssueFineAmount("");
    setIssueFineNotes("");
    setAutoCalculate(true);
    setSelectedLoanId("");
  };

  // Export to PDF
  const handleExportPDF = () => {
    exportFinesToPDF(
      fines,
      "library-fines",
      (amount) => formatCurrency(amount, countryCode),
      settings.schoolName
    );
  };

  // Export to Excel
  const handleExportExcel = () => {
    exportFinesToExcel(
      fines,
      "library-fines",
      (amount) => formatCurrency(amount, countryCode)
    );
  };

  // Get fine type badge
  const getFineTypeBadge = (fineType: LibraryFine["fineType"]) => {
    const typeConfig: Record<LibraryFine["fineType"], { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
      overdue: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/20 purple:bg-yellow-900/20",
        text: "text-yellow-700 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-800",
        icon: <Clock className="w-3 h-3" />,
        label: "Overdue",
      },
      lost: {
        bg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/20 purple:bg-red-900/20",
        text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        border: "border-red-200 dark:border-red-800",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "Lost",
      },
      damaged: {
        bg: "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/20 purple:bg-orange-900/20",
        text: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Damaged",
      },
    };

    const config = typeConfig[fineType];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border}`}
        style={{ fontSize: "10px" }}
      >
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
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/20 purple:bg-purple-900/20 text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400 border-purple-200 dark:border-purple-800"
            style={{ fontSize: "11.8px" }}
          >
            <Trash2 className="w-3 h-3" />
            Waived
          </span>
        );
      }
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/20 purple:bg-green-900/20 text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400 border-green-200 dark:border-green-800"
          style={{ fontSize: "11.8px" }}
        >
          <CheckCircle2 className="w-3 h-3" />
          Paid
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/20 purple:bg-red-900/20 text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400 border-red-200 dark:border-red-800"
        style={{ fontSize: "11.8px" }}
      >
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  // Table columns
  const columns: ColumnConfig<LibraryFine>[] = [
    {
      key: "loanId",
      label: "Fine ID",
      sortable: true,
      render: (fine) => (
        <span
          className="font-mono text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100"
          style={{ fontSize: "11.8px" }}
        >
          {fine.id.toUpperCase()}
        </span>
      ),
    },
    {
      key: "memberName",
      label: "Member",
      sortable: true,
      className: "text-left",
      render: (fine) => (
        <div className="flex items-center gap-2">
          <div
            className="relative cursor-pointer group/avatar flex-shrink-0 w-8 h-8"
            onMouseEnter={(e) => {
              const tr = e.currentTarget.closest("tr");
              if (tr) {
                tr.style.zIndex = "100";
                tr.style.position = "relative";
              }
              const scrollContainer = e.currentTarget.closest(".overflow-x-auto");
              if (scrollContainer) {
                (scrollContainer as HTMLElement).style.zIndex = "100";
                (scrollContainer as HTMLElement).style.position = "relative";
              }
            }}
            onMouseLeave={(e) => {
              const tr = e.currentTarget.closest("tr");
              if (tr) {
                tr.style.zIndex = "";
                tr.style.position = "";
              }
              const scrollContainer = e.currentTarget.closest(".overflow-x-auto");
              if (scrollContainer) {
                (scrollContainer as HTMLElement).style.zIndex = "";
                (scrollContainer as HTMLElement).style.position = "";
              }
            }}
          >
            <Image
              src={`https://i.pravatar.cc/150?u=${fine.memberId}`}
              alt={fine.memberName}
              width={32}
              height={32}
              className="absolute inset-0 w-8 h-8 rounded-full object-cover ring-2 ring-white/80 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-300 ease-out group-hover/avatar:scale-[2.5] group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90"
              style={{ transformOrigin: "left center" }}
              unoptimized
            />
          </div>
          <div>
            <div
              className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
              style={{ fontSize: "11.8px" }}
            >
              {fine.memberName}
            </div>
            <div
              className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60"
              style={{ fontSize: "10px" }}
            >
              {fine.memberId}
            </div>
          </div>
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
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <p
              className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate"
              style={{ fontSize: "11.8px" }}
              title={fine.bookTitle}
            >
              {fine.bookTitle}
            </p>
          </div>
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
      label: "Days Overdue",
      sortable: true,
      render: (fine) =>
        fine.daysOverdue ? (
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span
              className={`font-semibold ${
                fine.daysOverdue >= 7
                  ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                  : fine.daysOverdue >= 3
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
              }`}
              style={{ fontSize: "11.8px" }}
            >
              {fine.daysOverdue}
            </span>
            <span className="text-gray-400" style={{ fontSize: "11.8px" }}>
              days
            </span>
          </div>
        ) : (
          <span className="text-gray-400" style={{ fontSize: "11.8px" }}>
            -
          </span>
        ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (fine) => (
        <span
          className={`font-semibold ${
            !fine.isPaid
              ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
              : "text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
          }`}
          style={{ fontSize: "11.8px" }}
        >
          {formatCurrency(fine.amount, countryCode)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (fine) => (
        <div>
          <div
            className="text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100"
            style={{ fontSize: "11.8px" }}
          >
            {new Date(fine.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          {fine.isPaid && fine.paidDate && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" style={{ fontSize: "10px" }}>
              <CheckCircle2 className="w-3 h-3" />
              Paid {new Date(fine.paidDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "isPaid",
      label: "Status",
      sortable: true,
      render: (fine) => getPaymentBadge(fine),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (fine) => (
        <div className="flex items-center justify-center gap-2.5">
          <Tooltip content="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView(fine);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-blue-950/30 midnight:to-blue-900/20 purple:from-blue-950/30 purple:to-blue-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 active:scale-95"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
            </button>
          </Tooltip>
          {!fine.isPaid && (
            <>
              <Tooltip content="Record Payment">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePaymentClick(fine);
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 midnight:from-green-950/30 midnight:to-green-900/20 purple:from-green-950/30 purple:to-green-900/20 hover:from-green-100 hover:to-green-100 dark:hover:from-green-900/40 dark:hover:to-green-800/30 transition-all duration-200 cursor-pointer border border-green-200/40 dark:border-green-800/30 hover:border-green-400/60 dark:hover:border-green-600/50 active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                </button>
              </Tooltip>
              <Tooltip content="Waive Fine">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWaiveClick(fine);
                  }}
                  className="group relative p-2 rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 midnight:from-purple-950/30 midnight:to-purple-900/20 purple:from-purple-950/30 purple:to-purple-900/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-purple-900/40 dark:hover:to-purple-800/30 transition-all duration-200 cursor-pointer border border-purple-200/40 dark:border-purple-800/30 hover:border-purple-400/60 dark:hover:border-purple-600/50 active:scale-95"
                >
                  <Trash2 className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataManagementPage<LibraryFine>
      title="Fines & Payments"
      breadcrumbs={[
        { label: "Library", href: "/library" },
        { label: "Fines" },
      ]}
      data={fines}
      getRowKey={(fine) => fine.id}
      columns={columns}
      stats={fineStats}
      filterFields={fineFilterFields}
      filterFn={filterFines}
      sortOptions={fineSortOptions}
      sortFn={sortFines}
      searchFn={searchFines}
      enableViewToggle={false}
      enableSelection={false}
      addButtonConfig={{
        label: "Add",
        onClick: () => setIsIssueFineModalOpen(true),
      }}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      customListComponent={
        <ResponsiveListTable variant="contained" showColumnHeaders={true}
          data={fines}
          columns={columns}
          getRowKey={(fine) => fine.id}
          emptyMessage="No fines found"
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
      itemLabel="fine"
      itemLabelPlural="fines"
      emptyStateConfig={{
        title: "No fines found",
        description: "No fines have been recorded yet.",
      }}
    >
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
          currencySymbol={currencySymbol}
          onPayment={() => {
            setIsViewModalOpen(false);
            setViewingFine(null);
            handlePaymentClick(viewingFine);
          }}
          onWaive={() => {
            setIsViewModalOpen(false);
            setViewingFine(null);
            handleWaiveClick(viewingFine);
          }}
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
          subtitle={processingFine.id.toUpperCase()}
          icon={<span className="text-base font-bold">{currencySymbol}</span>}
          maxWidth="md"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setProcessingFine(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePaymentConfirm} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Record Payment
                  </>
                )}
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Fine Summary Card */}
            <div className="rounded-xl bg-gradient-to-br from-red-50 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/10 p-4 border border-red-200/60 dark:border-red-700/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex-shrink-0 shadow-md ring-2 ring-white dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${processingFine.memberId}`}
                    alt={processingFine.memberName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{processingFine.memberName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">{processingFine.bookTitle}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Fine Amount</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                    {formatCurrency(processingFine.amount, countryCode)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <FormInput
                label="Amount Paid"
                icon={<Banknote className="w-full h-full" />}
                type="number"
                value={paymentAmount}
                onChange={(val) => setPaymentAmount(String(val))}
                placeholder="Enter amount"
                iconBgColor="bg-green-100 dark:bg-green-900/30"
                iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
              />

              <FormDropdown
                label="Payment Method"
                icon={<Wallet className="w-full h-full" />}
                value={paymentMethod}
                onChange={(val) => setPaymentMethod(val)}
                options={[
                  { value: "Cash", label: "Cash" },
                  { value: "Card", label: "Card" },
                  { value: "Bank Transfer", label: "Bank Transfer" },
                  { value: "Mobile Money", label: "Mobile Money" },
                ]}
                iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
              />
            </div>

            {/* Info Notice */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200/60 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/30">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                  A payment receipt will be automatically generated upon confirmation.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Waive Fine Modal */}
      {processingFine && (
        <Modal
          isOpen={isWaiveModalOpen}
          onClose={() => {
            setIsWaiveModalOpen(false);
            setProcessingFine(null);
            setWaiveReason("");
          }}
          title="Waive Fine"
          subtitle={processingFine.id.toUpperCase()}
          icon={<Trash2 className="w-5 h-5" />}
          maxWidth="md"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsWaiveModalOpen(false);
                  setProcessingFine(null);
                  setWaiveReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleWaiveConfirm}
                disabled={isSaving}
                className="!bg-gradient-to-r !from-purple-600 !to-violet-600 hover:!from-purple-700 hover:!to-violet-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Waive Fine
                  </>
                )}
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Warning Notice */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200/60 dark:border-amber-700/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 mb-1">This action cannot be undone</p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400/70">
                    Once waived, this fine will be permanently removed from the member&apos;s account.
                  </p>
                </div>
              </div>
            </div>

            {/* Fine Summary Card */}
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-50/80 dark:from-purple-900/20 dark:to-violet-900/10 p-4 border border-purple-200/60 dark:border-purple-700/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex-shrink-0 shadow-md ring-2 ring-white dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${processingFine.memberId}`}
                    alt={processingFine.memberName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{processingFine.memberName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">{processingFine.bookTitle}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-200/60 dark:border-purple-700/30">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Fine to Waive</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(processingFine.amount, countryCode)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason Form */}
            <FormTextarea
              label="Reason for Waiver"
              icon={<FileText className="w-full h-full" />}
              value={waiveReason}
              onChange={setWaiveReason}
              placeholder="Enter the reason for waiving this fine (e.g., book returned in good condition, special circumstances, etc.)"
              rows={3}
              optional
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
            />

            {/* Info Notice */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                  The waiver will be recorded with the current date and your user details for audit purposes.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Issue Fine Modal */}
      <IssueFineModal
        isOpen={isIssueFineModalOpen}
        onClose={() => {
          setIsIssueFineModalOpen(false);
          resetIssueFineForm();
        }}
        currencySymbol={currencySymbol}
        isTertiary={
          settings.supportedLevels.includes("Tertiary") ||
          settings.defaultEducationLevel === "Tertiary" ||
          !!settings.tertiaryType
        }
        fineType={issueFineType}
        setFineType={setIssueFineType}
        fineAmount={issueFineAmount}
        setFineAmount={setIssueFineAmount}
        notes={issueFineNotes}
        setNotes={setIssueFineNotes}
        autoCalculate={autoCalculate}
        setAutoCalculate={setAutoCalculate}
        selectedLoanId={selectedLoanId}
        setSelectedLoanId={setSelectedLoanId}
        onSubmit={handleIssueFine}
        isSaving={isSaving}
      />
    </DataManagementPage>
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
  currencySymbol,
  onPayment,
  onWaive,
}: {
  isOpen: boolean;
  onClose: () => void;
  fine: LibraryFine;
  getFineTypeBadge: (type: LibraryFine["fineType"]) => React.ReactNode;
  getPaymentBadge: (fine: LibraryFine) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  currencySymbol: string;
  onPayment: () => void;
  onWaive: () => void;
}) {
  // Get fine type config for styling
  const getFineTypeConfig = (fineType: LibraryFine["fineType"]) => {
    const configs = {
      overdue: {
        gradient: "from-amber-500 to-orange-500",
        bgLight: "bg-amber-50 dark:bg-amber-900/20",
        bgSubtle: "bg-gradient-to-br from-amber-50 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/10",
        border: "border-amber-200 dark:border-amber-700/30",
        text: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        amountColor: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        icon: <Clock className="w-5 h-5" />,
        label: "Overdue Fine",
      },
      lost: {
        gradient: "from-red-500 to-rose-500",
        bgLight: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20",
        bgSubtle: "bg-gradient-to-br from-red-50 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/10",
        border: "border-red-200 dark:border-red-700/30",
        text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        iconBg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        amountColor: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        icon: <AlertTriangle className="w-5 h-5" />,
        label: "Lost Book",
      },
      damaged: {
        gradient: "from-orange-500 to-red-500",
        bgLight: "bg-orange-50 dark:bg-orange-900/20",
        bgSubtle: "bg-gradient-to-br from-orange-50 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/10",
        border: "border-orange-200 dark:border-orange-700/30",
        text: "text-orange-700 dark:text-orange-400",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        amountColor: "text-orange-700 dark:text-orange-400",
        icon: <AlertCircle className="w-5 h-5" />,
        label: "Damaged Book",
      },
    };
    return configs[fineType];
  };

  const typeConfig = getFineTypeConfig(fine.fineType);

  // Currency icon component that shows the currency symbol
  const CurrencyIcon = () => (
    <span className="text-base font-bold">{currencySymbol}</span>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fine Details"
      subtitle={fine.id.toUpperCase()}
      icon={<CurrencyIcon />}
      maxWidth="xl"
      footer={
        <div className="flex justify-between w-full">
          <div>
            {!fine.isPaid && (
              <Button variant="ghost" onClick={onWaive} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20">
                <Trash2 className="w-4 h-4 mr-1.5" />
                Waive Fine
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {!fine.isPaid && (
              <Button variant="primary" onClick={onPayment}>
                <CreditCard className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Hero Amount Section */}
        <div className={`relative overflow-hidden rounded-2xl ${typeConfig.bgSubtle} ${typeConfig.border} border p-6 shadow-sm`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${typeConfig.iconBg}`}>
                <div className={typeConfig.iconColor}>{typeConfig.icon}</div>
              </div>
              <div>
                <p className={`text-sm font-medium ${typeConfig.text}`}>{typeConfig.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 font-mono">{fine.id.toUpperCase()}</p>
              </div>
            </div>
            {getPaymentBadge(fine)}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/40">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1">Total Amount</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-sm font-semibold ${typeConfig.amountColor}`}>{currencySymbol}</span>
              <span className={`text-4xl font-bold tracking-tight ${typeConfig.amountColor}`}>
                {fine.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {fine.daysOverdue && fine.fineType === "overdue" && (
            <div className={`mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full ${typeConfig.bgLight} w-fit`}>
              <Clock className={`w-3.5 h-3.5 ${typeConfig.iconColor}`} />
              <span className={`text-sm font-medium ${typeConfig.text}`}>{fine.daysOverdue} days overdue</span>
            </div>
          )}
        </div>

        {/* Member & Book Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Member Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-800/40 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/40 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Receipt className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wide">Member</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex-shrink-0 shadow-md ring-2 ring-white dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20">
                <Image
                  src={`https://i.pravatar.cc/150?u=${fine.memberId}`}
                  alt={fine.memberName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{fine.memberName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 font-mono">{fine.memberId}</p>
              </div>
            </div>
          </div>

          {/* Book Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/30 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wide">Book</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 line-clamp-2">{fine.bookTitle}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-1">Loan: {fine.loanId}</p>
          </div>
        </div>

        {/* Fine Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Fine Type */}
          <div className={`p-3 rounded-xl ${typeConfig.bgLight} ${typeConfig.border} border`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5">Type</p>
            <div className="flex items-center gap-1.5">
              {getFineTypeBadge(fine.fineType)}
            </div>
          </div>

          {/* Amount */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/40">
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5">Amount</p>
            <p className={`text-lg font-bold ${!fine.isPaid ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" : "text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"}`}>
              {formatCurrency(fine.amount)}
            </p>
          </div>

          {/* Created Date */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/40">
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5">Created</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {new Date(fine.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Status */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/40">
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5">Status</p>
            {getPaymentBadge(fine)}
          </div>
        </div>

        {/* Payment Details (if paid) */}
        {fine.isPaid && fine.paidAmount && fine.paidAmount > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200/60 dark:border-green-700/30 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">Payment Received</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-green-600/70 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400/60 mb-1">Amount Paid</p>
                <p className="text-base font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(fine.paidAmount)}
                </p>
              </div>
              {fine.paymentMethod && (
                <div>
                  <p className="text-xs text-green-600/70 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400/60 mb-1">Method</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">{fine.paymentMethod}</p>
                </div>
              )}
              {fine.paidDate && (
                <div>
                  <p className="text-xs text-green-600/70 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400/60 mb-1">Date</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                    {new Date(fine.paidDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              )}
              {fine.paymentReference && (
                <div>
                  <p className="text-xs text-green-600/70 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400/60 mb-1">Reference</p>
                  <p className="text-sm font-mono font-semibold text-green-700 dark:text-green-300">{fine.paymentReference}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Waiver Details (if waived) */}
        {fine.waivedAmount && fine.waivedAmount > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50/50 dark:from-purple-900/20 dark:to-violet-900/10 border border-purple-200/60 dark:border-purple-700/30 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Trash2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Fine Waived</span>
            </div>
            <div className="space-y-2">
              <p className="text-base font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(fine.waivedAmount)} waived
              </p>
              {fine.waivedBy && (
                <p className="text-xs text-purple-600/70 dark:text-purple-400/60">
                  <span className="font-medium">Waived by:</span> {fine.waivedBy}
                </p>
              )}
              {fine.waivedReason && (
                <p className="text-sm text-purple-700 dark:text-purple-300 bg-purple-100/50 dark:bg-purple-900/30 rounded-lg px-3 py-2 mt-2">
                  {fine.waivedReason}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Pending Action Notice */}
        {!fine.isPaid && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10 border border-red-200/60 dark:border-red-700/30">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mb-1">Payment Required</p>
                <p className="text-xs text-red-600/80 dark:text-red-400 midnight:text-red-400 purple:text-red-400/70">
                  This fine is pending payment. Please collect {formatCurrency(fine.amount)} from the member or waive the fine if applicable.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Issue Fine Modal Component
function IssueFineModal({
  isOpen,
  onClose,
  currencySymbol,
  isTertiary,
  fineType,
  setFineType,
  fineAmount,
  setFineAmount,
  notes,
  setNotes,
  autoCalculate,
  setAutoCalculate,
  selectedLoanId,
  setSelectedLoanId,
  onSubmit,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  isTertiary: boolean;
  fineType: "overdue" | "lost" | "damaged";
  setFineType: (type: "overdue" | "lost" | "damaged") => void;
  fineAmount: string;
  setFineAmount: (amount: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  autoCalculate: boolean;
  setAutoCalculate: (auto: boolean) => void;
  selectedLoanId: string;
  setSelectedLoanId: (id: string) => void;
  onSubmit: () => void;
  isSaving: boolean;
}) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  // Mock data for classes/levels
  const classOptions = [
    { value: "", label: "All Classes" },
    { value: "jss1", label: "JSS 1" },
    { value: "jss2", label: "JSS 2" },
    { value: "jss3", label: "JSS 3" },
    { value: "ss1", label: "SS 1" },
    { value: "ss2", label: "SS 2" },
    { value: "ss3", label: "SS 3" },
  ];

  const levelOptions = [
    { value: "", label: "All Levels" },
    { value: "100", label: "100 Level" },
    { value: "200", label: "200 Level" },
    { value: "300", label: "300 Level" },
    { value: "400", label: "400 Level" },
    { value: "500", label: "500 Level" },
  ];

  // Mock loan records filtered by class/level
  const loanOptions = [
    { value: "LN-2024-0002", label: "John Adebayo", book: "Chemistry Fundamentals", class: "SS 2", level: "200", daysOverdue: 696 },
    { value: "LN-2024-0005", label: "Amina Bello", book: "Physics Textbook", class: "SS 1", level: "100", daysOverdue: 45 },
    { value: "LN-2024-0008", label: "David Okafor", book: "Mathematics Guide", class: "JSS 3", level: "300", daysOverdue: 12 },
  ];

  const selectedLoan = loanOptions.find(l => l.value === selectedLoanId);

  // Auto-calculate fine amount when loan or type changes
  const calculateFineAmount = (loan: typeof loanOptions[0] | undefined, type: string) => {
    if (!loan) return "";
    switch (type) {
      case "overdue":
        return String(loan.daysOverdue * 100);
      case "lost":
        return "10000"; // 2x book price mock
      case "damaged":
        return "2500"; // 50% book price mock
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Fine"
      subtitle="Add fine to borrowing record"
      icon={<span className="text-base font-bold">{currencySymbol}</span>}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isSaving || !selectedLoanId || !fineAmount}
            className="!bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span className="mr-1">{currencySymbol}</span>
                Issue Fine
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Fine Type Selection - Card Style */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-3">
            <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
              <Receipt className="w-3 h-3 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            Fine Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* Overdue Fine Card */}
            <button
              type="button"
              onClick={() => {
                setFineType("overdue");
                if (autoCalculate && selectedLoan) {
                  setFineAmount(calculateFineAmount(selectedLoan, "overdue"));
                }
              }}
              className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                fineType === "overdue"
                  ? "border-amber-400 dark:border-amber-500 bg-gradient-to-br from-amber-50 via-amber-50/50 to-orange-50/30 dark:from-amber-900/30 dark:via-amber-900/20 dark:to-orange-900/10 shadow-lg shadow-amber-500/10"
                  : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-amber-300 dark:hover:border-amber-600 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] hover:shadow-md"
              }`}
            >
              {fineType === "overdue" && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl mb-3 transition-all duration-300 ${
                  fineType === "overdue"
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30"
                }`}>
                  <Clock className={`w-6 h-6 transition-colors ${
                    fineType === "overdue"
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                  }`} />
                </div>
                <span className={`text-sm font-bold transition-colors ${
                  fineType === "overdue"
                    ? "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                }`}>
                  Overdue Fine
                </span>
                <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                  fineType === "overdue"
                    ? "bg-amber-200/50 dark:bg-amber-800/30 text-amber-700 dark:text-amber-300"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                }`}>
                  {currencySymbol}100/day
                </span>
              </div>
            </button>

            {/* Lost Book Card */}
            <button
              type="button"
              onClick={() => {
                setFineType("lost");
                if (autoCalculate) {
                  setFineAmount(calculateFineAmount(selectedLoan, "lost"));
                }
              }}
              className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                fineType === "lost"
                  ? "border-red-400 dark:border-red-500 bg-gradient-to-br from-red-50 via-red-50/50 to-rose-50/30 dark:from-red-900/30 dark:via-red-900/20 dark:to-rose-900/10 shadow-lg shadow-red-500/10"
                  : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-red-300 dark:hover:border-red-600 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] hover:shadow-md"
              }`}
            >
              {fineType === "lost" && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl mb-3 transition-all duration-300 ${
                  fineType === "lost"
                    ? "bg-gradient-to-br from-red-400 to-rose-500 shadow-lg shadow-red-500/30"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] group-hover:bg-red-100 dark:group-hover:bg-red-900/30"
                }`}>
                  <AlertTriangle className={`w-6 h-6 transition-colors ${
                    fineType === "lost"
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-red-600 dark:group-hover:text-red-400"
                  }`} />
                </div>
                <span className={`text-sm font-bold transition-colors ${
                  fineType === "lost"
                    ? "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                }`}>
                  Lost Book
                </span>
                <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                  fineType === "lost"
                    ? "bg-red-200/50 dark:bg-red-800/30 text-red-700 dark:text-red-300"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                }`}>
                  2x book price
                </span>
              </div>
            </button>

            {/* Damaged Book Card */}
            <button
              type="button"
              onClick={() => {
                setFineType("damaged");
                if (autoCalculate) {
                  setFineAmount(calculateFineAmount(selectedLoan, "damaged"));
                }
              }}
              className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                fineType === "damaged"
                  ? "border-orange-400 dark:border-orange-500 bg-gradient-to-br from-orange-50 via-orange-50/50 to-amber-50/30 dark:from-orange-900/30 dark:via-orange-900/20 dark:to-amber-900/10 shadow-lg shadow-orange-500/10"
                  : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-orange-300 dark:hover:border-orange-600 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] hover:shadow-md"
              }`}
            >
              {fineType === "damaged" && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl mb-3 transition-all duration-300 ${
                  fineType === "damaged"
                    ? "bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/30"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30"
                }`}>
                  <AlertCircle className={`w-6 h-6 transition-colors ${
                    fineType === "damaged"
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                  }`} />
                </div>
                <span className={`text-sm font-bold transition-colors ${
                  fineType === "damaged"
                    ? "text-orange-700 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                }`}>
                  Damaged Book
                </span>
                <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                  fineType === "damaged"
                    ? "bg-orange-200/50 dark:bg-orange-800/30 text-orange-700 dark:text-orange-300"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                }`}>
                  50% of price
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Class/Level Filter Section */}
        <div className="grid grid-cols-2 gap-4">
          {isTertiary ? (
            <FormDropdown
              label="Filter by Level"
              icon={<BookOpen className="w-full h-full" />}
              value={selectedLevel}
              onChange={setSelectedLevel}
              options={levelOptions}
              placeholder="All Levels"
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
            />
          ) : (
            <FormDropdown
              label="Filter by Class"
              icon={<BookOpen className="w-full h-full" />}
              value={selectedClass}
              onChange={setSelectedClass}
              options={classOptions}
              placeholder="All Classes"
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
            />
          )}
          <FormDropdown
            label="Select Borrower"
            icon={<Receipt className="w-full h-full" />}
            value={selectedLoanId}
            onChange={(val) => {
              setSelectedLoanId(val);
              const loan = loanOptions.find(l => l.value === val);
              if (autoCalculate && loan) {
                setFineAmount(calculateFineAmount(loan, fineType));
              }
            }}
            options={[
              { value: "", label: "Select borrower..." },
              ...loanOptions.map((loan) => ({
                value: loan.value,
                label: `${loan.label} - ${loan.book}`,
              })),
            ]}
            placeholder="Select borrower..."
            iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
            iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            required
          />
        </div>

        {/* Fine Amount Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div></div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoCalculate}
                  onChange={(e) => setAutoCalculate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">Auto-calculate</span>
            </label>
          </div>
          <FormInput
            label="Fine Amount"
            icon={<Banknote className="w-full h-full" />}
            type="number"
            value={fineAmount}
            onChange={setFineAmount}
            placeholder="Enter amount"
            disabled={autoCalculate}
            leftIcon={<span className="text-sm font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">{currencySymbol}</span>}
            leftIconBg="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
            iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
            iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            required
          />
          {fineType === "overdue" && fineAmount && selectedLoan && (
            <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-100/50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {selectedLoan.daysOverdue} days × {currencySymbol}100 = {currencySymbol}{Number(fineAmount).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <FormTextarea
          label="Notes"
          icon={<FileText className="w-full h-full" />}
          value={notes}
          onChange={setNotes}
          placeholder="Add any notes about this fine..."
          rows={2}
          optional
          iconBgColor="bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
          iconColor="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
        />

        {/* Summary Card */}
        {selectedLoanId && fineAmount && selectedLoan && (
          <div className={`rounded-2xl p-5 border-2 transition-all duration-300 ${
            fineType === "overdue"
              ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-300 dark:border-amber-600/50"
              : fineType === "lost"
              ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10 border-red-300 dark:border-red-600/50"
              : "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border-orange-300 dark:border-orange-600/50"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                fineType === "overdue"
                  ? "bg-amber-100 dark:bg-amber-900/40"
                  : fineType === "lost"
                  ? "bg-red-100 dark:bg-red-900/40"
                  : "bg-orange-100 dark:bg-orange-900/40"
              }`}>
                {fineType === "overdue" ? (
                  <Clock className={`w-6 h-6 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400`} />
                ) : fineType === "lost" ? (
                  <AlertTriangle className={`w-6 h-6 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400`} />
                ) : (
                  <AlertCircle className={`w-6 h-6 text-orange-600 dark:text-orange-400`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-base font-bold ${
                  fineType === "overdue" ? "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" :
                  fineType === "lost" ? "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400" :
                  "text-orange-700 dark:text-orange-400"
                }`}>
                  {fineType === "overdue" ? "Overdue Fine" : fineType === "lost" ? "Lost Book Fine" : "Damaged Book Fine"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                  {selectedLoan.label} • {selectedLoan.book}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mt-0.5">
                  Loan #{selectedLoanId}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  fineType === "overdue" ? "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" :
                  fineType === "lost" ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" :
                  "text-orange-600 dark:text-orange-400"
                }`}>
                  {currencySymbol}{Number(fineAmount).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Total Fine</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
