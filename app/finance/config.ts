import type { SortOption } from "@/types/components";

// Shared sort options for finance pages
export const financeSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "amount_high", label: "Amount (High to Low)" },
  { id: "amount_low", label: "Amount (Low to High)" },
  { id: "name_asc", label: "Name (A-Z)" },
  { id: "name_desc", label: "Name (Z-A)" },
];

// Shared academic year options
export const ACADEMIC_YEARS = [
  { label: "2024/2025", value: "2024-2025" },
  { label: "2025/2026", value: "2025-2026" },
  { label: "2023/2024", value: "2023-2024" },
];

// Shared term options (with "All" option)
export const TERMS_WITH_ALL = [
  { label: "All Terms", value: "all" },
  { label: "First Term", value: "first-term" },
  { label: "Second Term", value: "second-term" },
  { label: "Third Term", value: "third-term" },
];

// Shared term options (without "All" option, for fee structure)
export const TERMS = [
  { label: "First Term", value: "first-term" },
  { label: "Second Term", value: "second-term" },
  { label: "Third Term", value: "third-term" },
  { label: "First Semester", value: "first-semester" },
  { label: "Second Semester", value: "second-semester" },
  { label: "Full Year", value: "full-year" },
];

// Shared class options
export const CLASS_OPTIONS = [
  { label: "All Classes", value: "all" },
  { label: "JSS 1", value: "JSS 1" },
  { label: "JSS 2", value: "JSS 2" },
  { label: "JSS 3", value: "JSS 3" },
  { label: "SSS 1", value: "SSS 1" },
  { label: "SSS 2", value: "SSS 2" },
  { label: "SSS 3", value: "SSS 3" },
];

// Shared status options for installments
export const INSTALLMENT_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Defaulted", value: "defaulted" },
  { label: "Cancelled", value: "cancelled" },
];

// Shared status options for receipts
export const RECEIPT_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "issued", label: "Issued" },
  { value: "pending", label: "Pending" },
  { value: "voided", label: "Voided" },
];

// Shared receipt academic year options (with "All" option)
export const RECEIPT_ACADEMIC_YEARS = [
  { value: "all", label: "All Years" },
  { value: "2024-2025", label: "2024/2025" },
  { value: "2025-2026", label: "2025/2026" },
  { value: "2023-2024", label: "2023/2024" },
];

// Shared receipt term options (with "All" option)
export const RECEIPT_TERMS = [
  { value: "all", label: "All Terms" },
  { value: "first-term", label: "First Term" },
  { value: "second-term", label: "Second Term" },
  { value: "third-term", label: "Third Term" },
];
