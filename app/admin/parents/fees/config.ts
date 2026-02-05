import type { FilterField, FilterValues, SortOption, StatCardConfig } from "@/types/components";
import type { AdminFeeRecord } from "@/lib/mockParents";
import { Banknote, CheckCircle2, Clock, TrendingUp } from "lucide-react";

// ============================================================================
// Filters / Sort / Search
// ============================================================================

export const adminParentFeeFilterFields: FilterField[] = [
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

export const adminParentFeeSortOptions: SortOption[] = [
  { id: "highest_balance", label: "Highest Balance" },
  { id: "lowest_balance", label: "Lowest Balance" },
  { id: "ascending", label: "A-Z (Parent)" },
  { id: "descending", label: "Z-A (Parent)" },
  { id: "due_date_asc", label: "Due Date (Nearest)" },
  { id: "due_date_desc", label: "Due Date (Farthest)" },
];

export function sortAdminParentFees(data: AdminFeeRecord[], sortOption: string): AdminFeeRecord[] {
  return [...data].sort((a, b) => {
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
}

export function filterAdminParentFees(data: AdminFeeRecord[], filters: FilterValues): AdminFeeRecord[] {
  const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
  if (!hasFilters) return data;

  return data.filter((record) => {
    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => s.toLowerCase() === record.status);

    const matchesFeeType =
      !filters.feeType || filters.feeType.length === 0 || filters.feeType.includes(record.feeType);

    const matchesTerm = !filters.term || filters.term.length === 0 || filters.term.includes(record.term);

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

    return matchesStatus && matchesFeeType && matchesTerm && matchesBalanceRange;
  });
}

export function searchAdminParentFees(data: AdminFeeRecord[], query: string): AdminFeeRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return data;

  return data.filter((r) => {
    const fields = [
      r.parentName,
      r.parentEmail,
      r.childName,
      r.childClass,
      r.feeType,
      r.term,
      r.academicYear,
      r.status,
    ];
    return fields.some((v) => v.toLowerCase().includes(q));
  });
}

// ============================================================================
// Stats
// ============================================================================

function computeFeeStats(records: AdminFeeRecord[]) {
  const totalFees = records.reduce((acc, r) => acc + r.amount, 0);
  const totalCollected = records.reduce((acc, r) => acc + r.paidAmount, 0);
  const totalOutstanding = records.reduce((acc, r) => acc + r.balance, 0);
  const collectionRate = totalFees > 0 ? Math.round((totalCollected / totalFees) * 100) : 0;
  const overdueCount = records.filter((r) => r.status === "overdue").length;

  return { totalFees, totalCollected, totalOutstanding, collectionRate, overdueCount };
}

export function getAdminParentFeeStats(
  money: (amount: number) => string
): StatCardConfig<AdminFeeRecord>[] {
  return [
    {
      icon: Banknote,
      label: "Total Fees",
      color: "blue",
      getValue: (data) => money(computeFeeStats(data).totalFees),
    },
    {
      icon: CheckCircle2,
      label: "Collected",
      color: "green",
      getValue: (data) => money(computeFeeStats(data).totalCollected),
    },
    {
      icon: Clock,
      label: "Outstanding",
      color: "red",
      getValue: (data) => {
        const { totalOutstanding } = computeFeeStats(data);
        return money(totalOutstanding);
      },
    },
    {
      icon: TrendingUp,
      label: "Collection Rate",
      color: "amber",
      getValue: (data) => `${computeFeeStats(data).collectionRate}%`,
      getBadge: (data) => {
        const { overdueCount } = computeFeeStats(data);
        return overdueCount > 0 ? `${overdueCount} Overdue` : undefined;
      },
    },
  ];
}

