import type { ExportConfig, FilterField, SortOption, StatCardConfig } from "@/types/components";
import type { ParentFeeRecord } from "@/types/parent";
import { Banknote, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const feeSortOptions: SortOption[] = [
  { id: "due_soon", label: "Due Date (Soonest)" },
  { id: "due_late", label: "Due Date (Latest)" },
  { id: "balance_high", label: "Balance (Highest)" },
  { id: "balance_low", label: "Balance (Lowest)" },
  { id: "amount_high", label: "Amount (Highest)" },
  { id: "amount_low", label: "Amount (Lowest)" },
  { id: "child_asc", label: "Child (A-Z)" },
  { id: "status", label: "Status" },
];

export function getFeeFilterFields(data: ParentFeeRecord[]): FilterField[] {
  const children = Array.from(
    new Map(data.map((f) => [f.childId, { value: f.childId, label: f.childName }])).values()
  );

  return [
    { id: "childId", label: "Child", options: children, width: "half" },
    {
      id: "status",
      label: "Status",
      options: [
        { value: "paid", label: "Paid" },
        { value: "partial", label: "Partial" },
        { value: "pending", label: "Pending" },
        { value: "overdue", label: "Overdue" },
      ],
      width: "half",
    },
  ];
}

export const filterFees = (
  data: ParentFeeRecord[],
  filters: Record<string, string[]>
): ParentFeeRecord[] => {
  return data.filter((fee) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const matchesChild =
      !filters.childId || filters.childId.length === 0 || filters.childId.includes(fee.childId);

    const matchesStatus =
      !filters.status || filters.status.length === 0 || filters.status.includes(fee.status);

    return matchesChild && matchesStatus;
  });
};

export const sortFees = (data: ParentFeeRecord[], sortOption: string): ParentFeeRecord[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "due_soon":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "due_late":
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      case "balance_high":
        return b.balance - a.balance;
      case "balance_low":
        return a.balance - b.balance;
      case "amount_high":
        return b.amount - a.amount;
      case "amount_low":
        return a.amount - b.amount;
      case "child_asc":
        return a.childName.localeCompare(b.childName);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
};

export const searchFees = (data: ParentFeeRecord[], query: string): ParentFeeRecord[] => {
  const q = query.toLowerCase();
  return data.filter(
    (fee) =>
      fee.childName.toLowerCase().includes(q) ||
      fee.feeType.toLowerCase().includes(q) ||
      fee.term.toLowerCase().includes(q) ||
      fee.academicYear.toLowerCase().includes(q)
  );
};

export function getFeeTotals(data: ParentFeeRecord[]) {
  const totalAmount = data.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = data.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalBalance = data.reduce((sum, f) => sum + f.balance, 0);
  const overdueCount = data.filter((f) => f.status === "overdue").length;
  return { totalAmount, totalPaid, totalBalance, overdueCount };
}

export const getFeeStats = (
  formatMoney: (amount: number) => string
): StatCardConfig<ParentFeeRecord>[] => [
  {
    icon: Banknote,
    label: "Total Fees",
    color: "blue",
    getValue: (data) => formatMoney(getFeeTotals(data).totalAmount),
  },
  {
    icon: CheckCircle2,
    label: "Total Paid",
    color: "green",
    getValue: (data) => formatMoney(getFeeTotals(data).totalPaid),
  },
  {
    icon: Clock,
    label: "Outstanding",
    color: "red",
    getValue: (data) => formatMoney(getFeeTotals(data).totalBalance),
  },
  {
    icon: AlertCircle,
    label: "Overdue",
    color: "amber",
    getValue: (data) => getFeeTotals(data).overdueCount.toString(),
    getBadge: (data) => (getFeeTotals(data).overdueCount > 0 ? "Action Required" : undefined),
  },
];

export function getFeeExcelExportConfig(
  filename: string,
  formatMoney: (amount: number) => string
): ExportConfig<ParentFeeRecord> {
  return {
    filename,
    getExcelData: (items) => ({
      sheetName: "Fee Statement",
      columns: [
        { header: "Child", key: "childName", width: 22 },
        { header: "Fee Type", key: "feeType", width: 18 },
        { header: "Term", key: "term", width: 12 },
        { header: "Academic Year", key: "academicYear", width: 14 },
        { header: "Amount", key: (f) => formatMoney(f.amount), width: 14 },
        { header: "Paid", key: (f) => formatMoney(f.paidAmount), width: 14 },
        { header: "Balance", key: (f) => formatMoney(f.balance), width: 14 },
        { header: "Due Date", key: (f) => f.dueDate, width: 14 },
        { header: "Status", key: (f) => f.status, width: 12 },
      ],
      data: items,
      summary: (() => {
        const totals = getFeeTotals(items);
        return [
          { label: "Total Fees", value: formatMoney(totals.totalAmount) },
          { label: "Total Paid", value: formatMoney(totals.totalPaid) },
          { label: "Outstanding", value: formatMoney(totals.totalBalance) },
          { label: "Overdue Items", value: totals.overdueCount.toString() },
        ];
      })(),
    }),
  };
}

