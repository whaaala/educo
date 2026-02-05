import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import type { TenantSummary } from "@/types/school";
import { Building2, Globe, UserCheck, Clock } from "lucide-react";

export const tenantFilterFields: FilterField[] = [
  {
    id: "status",
    label: "Status",
    options: ["Active", "Trial", "Inactive", "Suspended"],
    width: "half",
  },
  {
    id: "institutionType",
    label: "Type",
    options: ["Public", "Private", "International"],
    width: "half",
  },
];

export const tenantSortOptions: SortOption[] = [
  { id: "name_asc", label: "Name A-Z" },
  { id: "name_desc", label: "Name Z-A" },
  { id: "created_newest", label: "Newest First" },
  { id: "created_oldest", label: "Oldest First" },
];

export const filterTenants = (
  data: TenantSummary[],
  filters: Record<string, string[]>
): TenantSummary[] => {
  return data.filter((tenant) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => s === tenant.status);

    const matchesType =
      !filters.institutionType ||
      filters.institutionType.length === 0 ||
      filters.institutionType.some((t) => t === tenant.institutionType);

    return matchesStatus && matchesType;
  });
};

export const sortTenants = (data: TenantSummary[], sortOption: string): TenantSummary[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "created_newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "created_oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });
};

export const searchTenants = (data: TenantSummary[], query: string): TenantSummary[] => {
  const q = query.toLowerCase();
  return data.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(q) ||
      tenant.slug.toLowerCase().includes(q) ||
      tenant.region.toLowerCase().includes(q) ||
      (tenant.shortName ? tenant.shortName.toLowerCase().includes(q) : false)
  );
};

export const getTenantStats = (allTenants: TenantSummary[]): StatCardConfig<TenantSummary>[] => [
  {
    icon: Building2,
    label: "Total Schools",
    color: "blue",
    getValue: () => allTenants.length.toLocaleString(),
    getBadge: (data) => `${data.length} shown`,
  },
  {
    icon: UserCheck,
    label: "Active",
    color: "green",
    getValue: () => allTenants.filter((t) => t.status === "Active").length.toLocaleString(),
  },
  {
    icon: Globe,
    label: "Regions",
    color: "purple",
    getValue: () => new Set(allTenants.map((t) => t.region)).size.toLocaleString(),
  },
  {
    icon: Clock,
    label: "Trial",
    color: "amber",
    getValue: () => allTenants.filter((t) => t.status === "Trial").length.toLocaleString(),
  },
];

