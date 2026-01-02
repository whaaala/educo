"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageLoader from "@/components/shared/PageLoader";
import PageSpinner from "@/components/shared/PageSpinner";
import StatCard from "@/components/shared/StatCard";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import DateRangePicker from "@/components/shared/DateRangePicker";
import FilterButton, { FilterField, FilterValues } from "@/components/shared/FilterButton";
import SortButton from "@/components/shared/SortButton";
import ViewToggle from "@/components/shared/ViewToggle";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import Tooltip from "@/components/shared/Tooltip";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { getAllFeeRecords, getFeeStats, type AdminFeeRecord } from "@/lib/mockParents";
import {
  Banknote,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileCheck,
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  Receipt,
  Send,
  MessageSquare,
} from "lucide-react";

export default function AdminParentFeesPage() {
  const { settings } = useSchoolSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePageLoading = usePageLoad(600);
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  // Get view mode from URL, default to list
  const urlView = searchParams.get("view");
  const initialView = urlView === "grid" ? "grid" : "list";

  const [feeRecords] = useState<AdminFeeRecord[]>(getAllFeeRecords());
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [isMounted, setIsMounted] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(12);

  const isPageLoading = basePageLoading && !isSwitchingView;

  // Currency formatter
  const currencyCode = settings.currency || "NGN";
  const { money, currencySymbol } = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

    const symbol =
      formatter.formatToParts(0).find((p) => p.type === "currency")?.value ?? currencyCode;

    return {
      money: (amount: number) => formatter.format(amount),
      currencySymbol: symbol,
    };
  }, [currencyCode]);

  // Get stats
  const stats = useMemo(() => getFeeStats(), []);

  // Handler to update view mode and URL
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`/admin/parents/fees?view=${newMode}`);

    setTimeout(() => {
      setIsSwitchingView(false);
    }, 700);
  };

  // Sync view mode with URL changes
  useEffect(() => {
    const urlView = searchParams.get("view");
    const newViewMode = urlView === "grid" ? "grid" : "list";
    setViewMode(newViewMode);
  }, [searchParams]);

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      id: "status",
      label: "Status",
      options: ["Paid", "Partial", "Pending", "Overdue"],
      width: "half",
    },
    {
      id: "feeType",
      label: "Fee Type",
      options: ["School Fees", "Bus Fee", "Exam Fee", "Library Fee", "Lab Fee", "Sports Fee", "Uniform Fee"],
      width: "half",
    },
    {
      id: "term",
      label: "Term",
      options: ["1st Term", "2nd Term", "3rd Term"],
      width: "half",
    },
    {
      id: "balanceRange",
      label: "Balance Range",
      options: ["Fully Paid", "Under 50K", "50K - 100K", "Over 100K"],
      width: "half",
    },
  ];

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({});
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sort state
  const [sortOption, setSortOption] = useState<string>("highest_balance");
  const [isSorting, setIsSorting] = useState(false);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Animation trigger for table rows
  const filterKey = `${JSON.stringify(filters)}-${sortOption}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Sort options
  const sortOptions = [
    { label: "Highest Balance", value: "highest_balance" },
    { label: "Lowest Balance", value: "lowest_balance" },
    { label: "A-Z (Parent)", value: "ascending" },
    { label: "Z-A (Parent)", value: "descending" },
    { label: "Due Date (Nearest)", value: "due_date_asc" },
    { label: "Due Date (Farthest)", value: "due_date_desc" },
  ];

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setDateRange({ startDate, endDate });
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleFilterChange = (updatedFilters: FilterValues) => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters(updatedFilters);
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleClearFilters = () => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters({});
      setDateRange(null);
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedRecords = filteredRecords.filter((record) => selectedIds.has(record.id));

      const items: BulkDeleteItem[] = selectedRecords.map((record) => ({
        id: record.id,
        name: `${record.childName} - ${record.feeType}`,
        subtitle: `${record.parentName} | ${money(record.balance)} outstanding`,
      }));

      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleRemoveFromDeleteList = (itemId: string) => {
    setItemsToDelete((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(itemId);
      return newIds;
    });
  };

  const handleConfirmBulkDelete = (itemIds: string[]) => {
    console.log("Deleting fee records:", itemIds);
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const handleCloseBulkDeleteModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const handleRestoreItem = (item: BulkDeleteItem) => {
    setItemsToDelete((prevItems) => [...prevItems, item]);
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.add(item.id);
      return newIds;
    });
  };

  const handleRestoreAll = (items: BulkDeleteItem[]) => {
    setItemsToDelete((prevItems) => [...prevItems, ...items]);
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      items.forEach((item) => newIds.add(item.id));
      return newIds;
    });
  };

  // Check if there are active filters
  const hasActiveFilters =
    Object.values(filters).some((values) => values && values.length > 0) || dateRange !== null;

  const handleSortChange = (sortValue: string) => {
    setIsSorting(true);
    setTimeout(() => {
      setSortOption(sortValue);
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    }, 300);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setDateRange(null);
    setFilters({});
    setSortOption("highest_balance");
    setSelectedIds(new Set());
    setResetKey((prev) => prev + 1);
    setTimeout(() => {
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    console.log("Export to PDF");
  };

  const handleExportExcel = () => {
    console.log("Export to Excel");
  };

  const handleAddFee = () => {
    router.push("/admin/parents/fees/add");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset displayedCount when view mode changes
  useEffect(() => {
    if (isMounted) {
      const initialCount = viewMode === "grid" ? 12 : 15;
      setDisplayedCount(initialCount);
      previousCountRef.current = initialCount;
    }
  }, [viewMode, isMounted]);

  useEffect(() => {
    if (displayedCount > previousCountRef.current && gridRef.current) {
      const cards = gridRef.current.children;
      const firstNewCardIndex = previousCountRef.current;

      if (cards[firstNewCardIndex]) {
        setTimeout(() => {
          (cards[firstNewCardIndex] as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }

      previousCountRef.current = displayedCount;
    }
  }, [displayedCount]);

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

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  };

  // Apply sorting
  const sortedRecords = [...feeRecords].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        return a.parentName.localeCompare(b.parentName);
      case "descending":
        return b.parentName.localeCompare(a.parentName);
      case "highest_balance":
        return b.balance - a.balance;
      case "lowest_balance":
        return a.balance - b.balance;
      case "due_date_asc":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "due_date_desc":
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      default:
        return 0;
    }
  });

  // Apply filters
  const filteredRecords = sortedRecords.filter((record) => {
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters && !dateRange) return true;

    // Status filter
    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => s.toLowerCase() === record.status);

    // Fee type filter
    const matchesFeeType =
      !filters.feeType ||
      filters.feeType.length === 0 ||
      filters.feeType.includes(record.feeType);

    // Term filter
    const matchesTerm =
      !filters.term ||
      filters.term.length === 0 ||
      filters.term.includes(record.term);

    // Balance range filter
    const matchesBalanceRange =
      !filters.balanceRange ||
      filters.balanceRange.length === 0 ||
      filters.balanceRange.some((range) => {
        if (range === "Fully Paid") return record.balance === 0;
        if (range === "Under 50K") return record.balance > 0 && record.balance < 50000;
        if (range === "50K - 100K") return record.balance >= 50000 && record.balance <= 100000;
        if (range === "Over 100K") return record.balance > 100000;
        return false;
      });

    // Date range filter (based on due date)
    let matchesDateRange = true;
    if (dateRange) {
      const dueDate = new Date(record.dueDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      matchesDateRange = dueDate >= startDate && dueDate <= endDate;
    }

    return matchesStatus && matchesFeeType && matchesTerm && matchesBalanceRange && matchesDateRange;
  });

  const displayedRecords = filteredRecords.slice(0, displayedCount);
  const hasMore = displayedCount < filteredRecords.length;

  const isLoading = isFiltering || isSorting || isRefreshing || isSwitchingView;

  // Get status badge
  const getStatusBadge = (status: AdminFeeRecord["status"]) => {
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
  const columns: ColumnConfig<AdminFeeRecord>[] = [
    {
      key: "checkbox",
      label: "",
      className: "w-12",
      render: (record) => (
        <input
          type="checkbox"
          checked={selectedIds.has(record.id)}
          onChange={(e) => {
            const newSelectedIds = new Set(selectedIds);
            if (e.target.checked) {
              newSelectedIds.add(record.id);
            } else {
              newSelectedIds.delete(record.id);
            }
            setSelectedIds(newSelectedIds);
          }}
          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      ),
    },
    {
      key: "parent",
      label: "Parent",
      sortable: true,
      render: (record) => (
        <div className="flex items-center gap-2">
          <div className="relative cursor-pointer group/avatar flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.parentId}`}
                alt={record.parentName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {record.parentName}
            </p>
            <Tooltip content={record.parentEmail}>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                {record.parentEmail}
              </p>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      key: "child",
      label: "Student",
      sortable: true,
      render: (record) => (
        <div className="flex items-center gap-2">
          <div className="relative cursor-pointer group/avatar flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-white/80 dark:ring-gray-700/50 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 group-hover/avatar:z-[100]">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.childId}`}
                alt={record.childName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {record.childName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {record.childClass}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "feeType",
      label: "Fee Type",
      sortable: true,
      render: (record) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{record.feeType}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {record.term} - {record.academicYear}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (record) => (
        <span className="font-semibold text-gray-900 dark:text-white text-sm">
          {money(record.amount)}
        </span>
      ),
    },
    {
      key: "paidAmount",
      label: "Paid",
      sortable: true,
      render: (record) => (
        <span className="font-medium text-green-600 dark:text-green-400 text-sm">
          {money(record.paidAmount)}
        </span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: true,
      render: (record) => (
        <span
          className={`font-semibold text-sm ${
            record.balance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
          }`}
        >
          {money(record.balance)}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (record) => (
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          {new Date(record.dueDate).toLocaleDateString("en-GB", {
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
      render: (record) => getStatusBadge(record.status),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (record) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip content="View Details">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </Tooltip>
          {record.paymentHistory.length > 0 && (
            <Tooltip content="View Receipt">
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </Tooltip>
          )}
          <Tooltip content="Send Reminder">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </button>
          </Tooltip>
          <div className="relative group">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Fee Records" />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <PageHeader
            title="Parent Fee Records"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: "Parents", href: "/admin/parents" },
              { label: "Fee Records", isActive: true },
            ]}
          />

          <PageActions
            addButtonLabel="Add Fee Record"
            exportDescription="Download fee records"
            onAdd={handleAddFee}
            onRefresh={handleRefresh}
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
          <StatCard
            icon={Banknote}
            label="Total Fees"
            value={money(stats.totalFees)}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Collected"
            value={money(stats.totalCollected)}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Outstanding"
            value={money(stats.totalOutstanding)}
            color={stats.totalOutstanding > 0 ? "red" : "green"}
          />
          <StatCard
            icon={TrendingUp}
            label="Collection Rate"
            value={`${stats.collectionRate}%`}
            color={stats.collectionRate >= 80 ? "green" : stats.collectionRate >= 50 ? "yellow" : "red"}
            badge={stats.overdueCount > 0 ? `${stats.overdueCount} Overdue` : undefined}
          />
        </div>

        {/* Filters Bar */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
            <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
              <DateRangePicker onChange={handleDateRangeChange} resetKey={resetKey} />
              <FilterButton fields={filterFields} onFilterChange={handleFilterChange} resetKey={resetKey} />

              {selectedIds.size > 0 && (
                <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
              )}

              <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {filteredRecords.length} records
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 lg:flex-1">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <SortButton
                options={sortOptions}
                defaultOption="highest_balance"
                onSortChange={handleSortChange}
                resetKey={resetKey}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out"
          style={{ overflow: "visible" }}
        >
          <div className="relative min-h-[400px]" style={{ overflow: "visible" }}>
            {viewMode === "list" ? (
              <div
                key={`list-view-${isFiltering ? "filtering" : "filtered"}-${sortOption}`}
                className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]"
              >
                {isLoading ? (
                  <PageSpinner
                    message={
                      isSwitchingView
                        ? "Switching view..."
                        : isRefreshing
                        ? "Refreshing..."
                        : isSorting
                        ? "Sorting..."
                        : "Filtering..."
                    }
                    size="md"
                  />
                ) : filteredRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                      </div>
                      <div className="relative z-10 flex items-center justify-center w-16 h-16">
                        <Receipt className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No fee records found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hasActiveFilters
                        ? "No results match the current filters. Try adjusting your filters."
                        : "No fee records available"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    ref={tableWrapRef}
                    key={`fees-table-${filterKey}`}
                    className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden"
                  >
                    <DataTable
                      data={filteredRecords}
                      columns={columns}
                      getRowKey={(record) => record.id}
                      emptyMessage="No fee records found"
                      title=""
                      showSearch={false}
                      defaultItemsPerPage={15}
                      itemsPerPageOptions={[10, 15, 25, 50]}
                      enablePagination={true}
                      enableItemsPerPage={true}
                      stickyColumnCount={2}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                key={`grid-view-${isFiltering ? "filtering" : "filtered"}-${sortOption}`}
                className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms]"
                style={{ overflow: "visible" }}
              >
                {isLoading ? (
                  <PageSpinner
                    message={
                      isSwitchingView
                        ? "Switching view..."
                        : isRefreshing
                        ? "Refreshing..."
                        : isSorting
                        ? "Sorting..."
                        : "Filtering..."
                    }
                    size="md"
                  />
                ) : displayedRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                      </div>
                      <div className="relative z-10 flex items-center justify-center w-16 h-16">
                        <Receipt className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No fee records found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hasActiveFilters
                        ? "No results match the current filters. Try adjusting your filters."
                        : "No fee records available"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      ref={gridRef}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2 pr-2 md:pr-0"
                      style={{ overflow: "visible" }}
                    >
                      {displayedRecords.map((record, index) => (
                        <div
                          key={record.id}
                          style={{
                            transition: "opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                            transitionDelay: `${index / 40}s`,
                          }}
                        >
                          <FeeRecordCard record={record} money={money} getStatusBadge={getStatusBadge} />
                        </div>
                      ))}
                    </div>

                    {hasMore && (
                      <LoadMoreButton
                        onClick={handleLoadMore}
                        isLoading={isLoadingMore}
                        text="Load More"
                        loadingText="Loading..."
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bulk Delete Modal */}
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={handleCloseBulkDeleteModal}
          onConfirm={handleConfirmBulkDelete}
          items={itemsToDelete}
          onRemoveItem={handleRemoveFromDeleteList}
          onRestoreItem={handleRestoreItem}
          onRestoreAll={handleRestoreAll}
          title="Delete Fee Records"
          warningMessage="This will permanently remove these fee records. This action cannot be undone."
          confirmButtonText="Delete Records"
        />
      </div>
    </MainLayout>
  );
}

// Fee Record Card Component for Grid View
interface FeeRecordCardProps {
  record: AdminFeeRecord;
  money: (amount: number) => string;
  getStatusBadge: (status: AdminFeeRecord["status"]) => React.ReactNode;
}

function FeeRecordCard({ record, money, getStatusBadge }: FeeRecordCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.childId}`}
                alt={record.childName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {record.childName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{record.childClass}</p>
            </div>
          </div>
          {getStatusBadge(record.status)}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Fee Type */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Fee Type</p>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{record.feeType}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{record.term} - {record.academicYear}</p>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount</p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{money(record.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Paid</p>
            <p className="font-medium text-green-600 dark:text-green-400 text-sm">{money(record.paidAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Balance</p>
            <p className={`font-semibold text-sm ${record.balance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
              {money(record.balance)}
            </p>
          </div>
        </div>

        {/* Parent Info */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Parent</p>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <Image
                src={`https://i.pravatar.cc/150?u=${record.parentId}`}
                alt={record.parentName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-xs truncate">{record.parentName}</p>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Due Date</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(record.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-end gap-2">
        <Tooltip content="Send Reminder">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </button>
        </Tooltip>
        <Tooltip content="View Receipt">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </Tooltip>
        <Tooltip content="View Details">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
