import type { FilterField, SortOption } from "@/types/components";
import type { AdminParent } from "@/lib/mockParents";

// Filter fields configuration
export const parentFilterFields: FilterField[] = [
  {
    id: "relationship",
    label: "Relationship",
    options: ["Father", "Mother", "Guardian", "Sponsor"],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: ["Active", "Inactive"],
    width: "half",
  },
  {
    id: "feeStatus",
    label: "Fee Status",
    options: ["Paid Up", "Pending", "High Balance"],
    width: "full",
  },
  {
    id: "childrenCount",
    label: "Children",
    options: ["1 Child", "2 Children", "3+ Children"],
    width: "full",
  },
];

// Sort options configuration
export const parentSortOptions: SortOption[] = [
  { id: "ascending", label: "A-Z" },
  { id: "descending", label: "Z-A" },
  { id: "recently_added", label: "Recently Added" },
  { id: "highest_balance", label: "Highest Balance" },
  { id: "most_children", label: "Most Children" },
];

// Sort function for parents
export const sortParents = (data: AdminParent[], sortOption: string): AdminParent[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case "descending":
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
      case "recently_added":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "highest_balance":
        return b.totalOutstandingFees - a.totalOutstandingFees;
      case "most_children":
        return b.children.length - a.children.length;
      default:
        return 0;
    }
  });
};

// Filter function for parents
export const filterParents = (
  data: AdminParent[],
  filters: Record<string, string[]>
): AdminParent[] => {
  return data.filter((parent) => {
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters) return true;

    const matchesRelationship =
      !filters.relationship ||
      filters.relationship.length === 0 ||
      filters.relationship.includes(parent.relationship);

    const matchesStatus =
      !filters.status || filters.status.length === 0 || filters.status.includes(parent.status);

    const matchesFeeStatus =
      !filters.feeStatus ||
      filters.feeStatus.length === 0 ||
      filters.feeStatus.some((status) => {
        if (status === "Paid Up") return parent.totalOutstandingFees === 0;
        if (status === "High Balance") return parent.totalOutstandingFees > 100000;
        if (status === "Pending") return parent.totalOutstandingFees > 0 && parent.totalOutstandingFees <= 100000;
        return false;
      });

    const matchesChildrenCount =
      !filters.childrenCount ||
      filters.childrenCount.length === 0 ||
      filters.childrenCount.some((count) => {
        if (count === "1 Child") return parent.children.length === 1;
        if (count === "2 Children") return parent.children.length === 2;
        if (count === "3+ Children") return parent.children.length >= 3;
        return false;
      });

    return matchesRelationship && matchesStatus && matchesFeeStatus && matchesChildrenCount;
  });
};

// Get currency symbol from settings
export const getCurrencySymbol = (currencyCode: string): string => {
  try {
    const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode });
    const parts = formatter.formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value || "₦";
  } catch {
    return "₦";
  }
};

// Check if there are active filters
export const hasActiveFilters = (
  filters: Record<string, string[]>,
  dateRange: { startDate: string; endDate: string } | null
): boolean => {
  return Object.values(filters).some((values) => values && values.length > 0) || dateRange !== null;
};
