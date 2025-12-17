"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import StatCard from "@/components/shared/StatCard";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import Button from "@/components/shared/Button";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Download,
  Eye,
  ChevronRight,
  Calendar,
  Banknote,
  FileText,
} from "lucide-react";
import type { ParentFeeRecord, ParentPayment } from "@/types/parent";

// Mock Fee Data
const MOCK_FEES: ParentFeeRecord[] = [
  {
    id: "fee-001",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    feeType: "School Fees",
    term: "2nd Term",
    academicYear: "2024/2025",
    amount: 150000,
    paidAmount: 100000,
    balance: 50000,
    dueDate: "2024-02-15",
    status: "partial",
    paymentHistory: [
      {
        id: "pay-001",
        date: "2024-01-10",
        amount: 100000,
        method: "Bank Transfer",
        reference: "TRF-2024-0891",
        receiptNumber: "RCP-2024-001",
      },
    ],
  },
  {
    id: "fee-002",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    feeType: "School Fees",
    term: "2nd Term",
    academicYear: "2024/2025",
    amount: 180000,
    paidAmount: 180000,
    balance: 0,
    dueDate: "2024-02-15",
    status: "paid",
    paymentHistory: [
      {
        id: "pay-002",
        date: "2024-01-05",
        amount: 180000,
        method: "Card",
        reference: "CARD-2024-445",
        receiptNumber: "RCP-2024-002",
      },
    ],
  },
  {
    id: "fee-003",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    feeType: "School Fees",
    term: "1st Term",
    academicYear: "2024/2025",
    amount: 150000,
    paidAmount: 150000,
    balance: 0,
    dueDate: "2023-10-15",
    status: "paid",
    paymentHistory: [
      {
        id: "pay-003",
        date: "2023-09-20",
        amount: 75000,
        method: "Bank Transfer",
        reference: "TRF-2023-8891",
        receiptNumber: "RCP-2023-045",
      },
      {
        id: "pay-004",
        date: "2023-10-10",
        amount: 75000,
        method: "Cash",
        reference: "CASH-2023-102",
        receiptNumber: "RCP-2023-089",
      },
    ],
  },
  {
    id: "fee-004",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    feeType: "School Fees",
    term: "1st Term",
    academicYear: "2024/2025",
    amount: 180000,
    paidAmount: 180000,
    balance: 0,
    dueDate: "2023-10-15",
    status: "paid",
    paymentHistory: [
      {
        id: "pay-005",
        date: "2023-09-15",
        amount: 180000,
        method: "Card",
        reference: "CARD-2023-889",
        receiptNumber: "RCP-2023-044",
      },
    ],
  },
  {
    id: "fee-005",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    feeType: "Bus Fee",
    term: "2nd Term",
    academicYear: "2024/2025",
    amount: 25000,
    paidAmount: 0,
    balance: 25000,
    dueDate: "2024-02-01",
    status: "overdue",
    paymentHistory: [],
  },
];

// Filter options
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
];

const CHILD_OPTIONS = [
  { value: "all", label: "All Children" },
  { value: "child-001", label: "Adaeze Okonkwo" },
  { value: "child-002", label: "Chukwuemeka Okonkwo" },
];

export default function ParentFeesPage() {
  const searchParams = useSearchParams();
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();
  const currencyCode = settings.currency || "NGN";
  const { money, currencySymbol } = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

    const symbol =
      formatter.formatToParts(0).find((p) => p.type === "currency")?.value ??
      currencyCode;

    return {
      money: (amount: number) => formatter.format(amount),
      currencySymbol: symbol,
    };
  }, [currencyCode]);

  const initialChild = searchParams.get("child") || "all";
  const [selectedChild, setSelectedChild] = useState(initialChild);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  // Match /finance/installments: trigger row animation when filters/search change.
  const filterKey = `${searchQuery}-${selectedChild}-${selectedStatus}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Filter fees
  const filteredFees = useMemo(() => {
    return MOCK_FEES.filter((fee) => {
      const matchesChild = selectedChild === "all" || fee.childId === selectedChild;
      const matchesStatus = selectedStatus === "all" || fee.status === selectedStatus;
      const matchesSearch =
        searchQuery === "" ||
        fee.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.feeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fee.term.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChild && matchesStatus && matchesSearch;
    });
  }, [selectedChild, selectedStatus, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = MOCK_FEES.reduce((sum, f) => sum + f.amount, 0);
    const totalPaid = MOCK_FEES.reduce((sum, f) => sum + f.paidAmount, 0);
    const totalBalance = MOCK_FEES.reduce((sum, f) => sum + f.balance, 0);
    const overdueCount = MOCK_FEES.filter((f) => f.status === "overdue").length;
    return { totalAmount, totalPaid, totalBalance, overdueCount };
  }, []);

  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger((prev) => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  useEffect(() => {
    if (animationTrigger <= 0) return;
    const timeoutId = setTimeout(() => {
      const root = tableWrapRef.current;
      if (!root) return;
      const rows = root.querySelectorAll("tbody tr");
      rows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        const delay = index / 80;
        htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
      });
      setTimeout(() => {
        rows.forEach((row) => {
          const htmlRow = row as HTMLElement;
          htmlRow.style.animation = "";
        });
      }, 600);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [animationTrigger]);

  // Get status badge
  const getStatusBadge = (status: ParentFeeRecord["status"]) => {
    const config = {
      paid: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Paid",
      },
      partial: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Partial",
      },
      pending: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      overdue: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Overdue",
      },
    };

    const c = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  // Table columns
  const columns: ColumnConfig<ParentFeeRecord>[] = [
    {
      key: "childName",
      label: "Child",
      sortable: true,
      render: (fee) => (
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            <Image
              src={`https://i.pravatar.cc/150?u=${fee.childId}`}
              alt={fee.childName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {fee.childName}
          </span>
        </div>
      ),
    },
    {
      key: "feeType",
      label: "Fee Type",
      sortable: true,
      render: (fee) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{fee.feeType}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fee.term} - {fee.academicYear}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (fee) => (
        <span className="font-semibold text-gray-900 dark:text-white text-sm">
          {money(fee.amount)}
        </span>
      ),
    },
    {
      key: "paidAmount",
      label: "Paid",
      sortable: true,
      render: (fee) => (
        <span className="font-medium text-green-600 dark:text-green-400 text-sm">
          {money(fee.paidAmount)}
        </span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: true,
      render: (fee) => (
        <span className={`font-semibold text-sm ${
          fee.balance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
        }`}>
          {money(fee.balance)}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (fee) => (
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          {new Date(fee.dueDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (fee) => getStatusBadge(fee.status),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (fee) => (
        <div className="flex items-center justify-center gap-2">
          {fee.balance > 0 && (
            <Link
              href={`/parents/fees/pay?fee=${fee.id}`}
              className="inline-flex h-8 items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors px-3 whitespace-nowrap"
            >
              Pay Now
            </Link>
          )}
          {fee.paymentHistory.length > 0 && (
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="View receipt"
            >
              <span className="text-[13px] font-extrabold text-gray-700 dark:text-gray-200 leading-none">
                {currencySymbol}
              </span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Fees" />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <PageHeader
            title="Fees & Payments"
            breadcrumbs={[
              { label: "Parent Portal", href: "/parents" },
              { label: "Fees & Payments" },
            ]}
          />
          <div className="flex gap-2">
            <Button variant="ghost" className="text-gray-600 dark:text-gray-400">
              <Download className="w-4 h-4 mr-2" />
              Download History
            </Button>
            {stats.totalBalance > 0 && (
              <Link href="/parents/fees/pay">
                <Button variant="primary">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Outstanding ({money(stats.totalBalance)})
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Banknote}
            label="Total Fees"
            value={money(stats.totalAmount)}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Total Paid"
            value={money(stats.totalPaid)}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Outstanding"
            value={money(stats.totalBalance)}
            color={stats.totalBalance > 0 ? "red" : "green"}
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={stats.overdueCount.toString()}
            color={stats.overdueCount > 0 ? "red" : "green"}
            badge={stats.overdueCount > 0 ? "Action Required" : undefined}
          />
        </div>

        {/* Outstanding Balance Alert */}
        {stats.totalBalance > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10 border border-red-200/60 dark:border-red-700/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">
                    Outstanding Balance: {money(stats.totalBalance)}
                  </p>
                  <p className="text-sm text-red-600/80 dark:text-red-400/70">
                    Please clear your outstanding balance to avoid late fees and service disruptions.
                  </p>
                </div>
              </div>
              <Link
                href="/parents/fees/pay"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-sm transition-all whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" />
                Pay Now
              </Link>
            </div>
          </div>
        )}

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by child name, fee type..."
          filters={[
            {
              label: "Child",
              value: selectedChild,
              onChange: (val) => setSelectedChild(String(val)),
              options: CHILD_OPTIONS,
            },
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => setSelectedStatus(String(val)),
              options: STATUS_OPTIONS,
            },
          ]}
        />

        {/* Fee Table (match /finance/installments behavior) */}
        <div className="relative">
          {/* Mobile Scroll Indicator */}
          <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

          <div
            ref={tableWrapRef}
            key={`fees-table-${filterKey}`}
            className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden"
          >
            <DataTable
              data={filteredFees}
              columns={columns}
              getRowKey={(fee) => fee.id}
              emptyMessage="No fee records found"
              title=""
              showSearch={false}
              defaultItemsPerPage={10}
              itemsPerPageOptions={[5, 10, 15, 20, 25]}
              enablePagination={true}
              enableItemsPerPage={true}
              stickyColumnCount={1}
            />
          </div>
        </div>

        {/* Payment Methods Info */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Accepted Payment Methods
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 w-fit mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Card Payment</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Visa, Mastercard</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 w-fit mx-auto mb-2">
                <Banknote className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Bank Transfer</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">All major banks</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto mb-2">
                <Receipt className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">USSD</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">*737#, *901#</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 w-fit mx-auto mb-2">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Cash</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">At school bursary</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
