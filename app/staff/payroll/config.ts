import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import type { PayrollRecord } from "@/types/payroll";
import { Users, DollarSign, TrendingUp, AlertCircle, CreditCard } from "lucide-react";

// Utility: format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Filter fields configuration
export const payrollFilterFields: FilterField[] = [
  {
    id: "department",
    label: "Department",
    options: ["Mathematics", "English", "Science", "Administration", "IT"],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: [
      "draft",
      "pending-approval",
      "approved",
      "processing",
      "paid",
      "failed",
    ],
    width: "half",
  },
];

// Sort options configuration
export const payrollSortOptions: SortOption[] = [
  { id: "name_asc", label: "Name A-Z" },
  { id: "name_desc", label: "Name Z-A" },
  { id: "highest_salary", label: "Highest Salary" },
  { id: "lowest_salary", label: "Lowest Salary" },
];

// Stats configuration
export const payrollStats: StatCardConfig<PayrollRecord>[] = [
  {
    icon: Users,
    label: "Total Staff",
    getValue: (data) => data.length,
    color: "blue",
  },
  {
    icon: DollarSign,
    label: "Total Gross",
    getValue: (data) =>
      formatCurrency(data.reduce((sum, r) => sum + r.grossSalary, 0)),
    color: "green",
  },
  {
    icon: TrendingUp,
    label: "Total Allowances",
    getValue: (data) =>
      formatCurrency(data.reduce((sum, r) => sum + r.totalAllowances, 0)),
    color: "teal",
  },
  {
    icon: AlertCircle,
    label: "Total Deductions",
    getValue: (data) =>
      formatCurrency(data.reduce((sum, r) => sum + r.totalDeductions, 0)),
    color: "orange",
  },
  {
    icon: CreditCard,
    label: "Total Net Salary",
    getValue: (data) =>
      formatCurrency(data.reduce((sum, r) => sum + r.netSalary, 0)),
    color: "purple",
  },
];

// Filter function
export const filterPayrollRecords = (
  data: PayrollRecord[],
  filters: Record<string, string[]>
): PayrollRecord[] => {
  return data.filter((record) => {
    const hasFilters = Object.values(filters).some(
      (values) => values && values.length > 0
    );
    if (!hasFilters) return true;

    const matchesDepartment =
      !filters.department ||
      filters.department.length === 0 ||
      filters.department.includes(record.department);

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(record.status);

    return matchesDepartment && matchesStatus;
  });
};

// Sort function
export const sortPayrollRecords = (
  data: PayrollRecord[],
  sortOption: string
): PayrollRecord[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "name_asc":
        return a.staffName.localeCompare(b.staffName);
      case "name_desc":
        return b.staffName.localeCompare(a.staffName);
      case "highest_salary":
        return b.netSalary - a.netSalary;
      case "lowest_salary":
        return a.netSalary - b.netSalary;
      default:
        return 0;
    }
  });
};

// Search function
export const searchPayrollRecords = (
  data: PayrollRecord[],
  query: string
): PayrollRecord[] => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(
    (record) =>
      record.staffName.toLowerCase().includes(lowerQuery) ||
      record.staffEmail.toLowerCase().includes(lowerQuery) ||
      record.staffId.toLowerCase().includes(lowerQuery)
  );
};
