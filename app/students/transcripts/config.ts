import type { FilterField, SortOption, StatCardConfig, FilterValues } from "@/types/components";
import type { TranscriptRequest } from "@/types/transcript";
import {
  FileText,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  DollarSign,
  Calendar,
} from "lucide-react";

// Filter fields configuration
export const transcriptFilterFields: FilterField[] = [
  {
    id: "year",
    label: "Year",
    options: [
      { value: "2025", label: "2025" },
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
    ],
    width: "half",
  },
  {
    id: "type",
    label: "Type",
    options: [
      { value: "official", label: "Official" },
      { value: "unofficial", label: "Unofficial" },
    ],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "ready", label: "Ready" },
      { value: "delivered", label: "Delivered" },
      { value: "rejected", label: "Rejected" },
    ],
    width: "half",
  },
  {
    id: "payment",
    label: "Payment",
    options: [
      { value: "paid", label: "Paid" },
      { value: "unpaid", label: "Unpaid" },
      { value: "partial", label: "Partial" },
      { value: "waived", label: "Waived" },
    ],
    width: "half",
  },
];

// Sort options configuration
export const transcriptSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name_asc", label: "Student A-Z" },
  { id: "name_desc", label: "Student Z-A" },
];

// Stats configuration
export const transcriptStats: StatCardConfig<TranscriptRequest>[] = [
  {
    icon: FileText,
    label: "Total Requests",
    getValue: (data) => data.length,
    color: "blue",
  },
  {
    icon: Clock,
    label: "Pending",
    getValue: (data) => data.filter((r) => r.status === "pending").length,
    color: "orange",
  },
  {
    icon: Package,
    label: "Processing",
    getValue: (data) => data.filter((r) => r.status === "processing").length,
    color: "indigo",
  },
  {
    icon: CheckCircle,
    label: "Ready",
    getValue: (data) => data.filter((r) => r.status === "ready").length,
    color: "green",
  },
  {
    icon: CheckCircle,
    label: "Delivered",
    getValue: (data) => data.filter((r) => r.status === "delivered").length,
    color: "green",
  },
  {
    icon: XCircle,
    label: "Unpaid",
    getValue: (data) => data.filter((r) => r.payment.status === "unpaid").length,
    color: "red",
  },
  {
    icon: Calendar,
    label: "This Month",
    getValue: (data) => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      return data.filter((r) => {
        if (!r.deliveredDate) return false;
        const deliveryDate = new Date(r.deliveredDate);
        return (
          deliveryDate.getMonth() === currentMonth &&
          deliveryDate.getFullYear() === currentYear
        );
      }).length;
    },
    color: "purple",
  },
  {
    icon: DollarSign,
    label: "Revenue (MTD)",
    getValue: (data) => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const revenue = data
        .filter((r) => {
          if (!r.payment.paymentDate) return false;
          const paymentDate = new Date(r.payment.paymentDate);
          return (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear &&
            r.payment.status === "paid"
          );
        })
        .reduce((sum, r) => sum + r.payment.amount, 0);
      return `\u20A6${revenue.toLocaleString()}`;
    },
    color: "green",
  },
];

// Filter function
export const filterTranscriptRequests = (
  data: TranscriptRequest[],
  filters: FilterValues
): TranscriptRequest[] => {
  return data.filter((request) => {
    const hasFilters = Object.values(filters).some(
      (values) => values && values.length > 0
    );
    if (!hasFilters) return true;

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(request.status);

    const matchesType =
      !filters.type ||
      filters.type.length === 0 ||
      filters.type.includes(request.transcriptType);

    const matchesPayment =
      !filters.payment ||
      filters.payment.length === 0 ||
      filters.payment.includes(request.payment.status);

    const matchesYear =
      !filters.year ||
      filters.year.length === 0 ||
      filters.year.includes(
        new Date(request.requestDate).getFullYear().toString()
      );

    return matchesStatus && matchesType && matchesPayment && matchesYear;
  });
};

// Sort function
export const sortTranscriptRequests = (
  data: TranscriptRequest[],
  sortOption: string
): TranscriptRequest[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.requestDate).getTime() -
          new Date(a.requestDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.requestDate).getTime() -
          new Date(b.requestDate).getTime()
        );
      case "name_asc":
        return a.studentName.localeCompare(b.studentName);
      case "name_desc":
        return b.studentName.localeCompare(a.studentName);
      default:
        return 0;
    }
  });
};
