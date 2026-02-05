"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import ActionModal from "@/components/shared/ActionModal";
import { DataManagementPage } from "@/components/pages";
import { getTenantSummaries } from "@/lib/mockTenants";
import type { TenantSummary } from "@/types/school";
import type { ColumnConfig } from "@/types/components";
import {
  tenantFilterFields,
  tenantSortOptions,
  filterTenants,
  sortTenants,
  searchTenants,
  getTenantStats,
} from "./config";

export default function TenantsPage() {
  const router = useRouter();
  const tenants = getTenantSummaries();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTenant, setDeletingTenant] = useState<TenantSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      Suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Trial: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.Inactive}`}>
        {status}
      </span>
    );
  };

  const getInstitutionBadge = (type: string) => {
    const styles = {
      Public: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      Private: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
      International: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {type}
      </span>
    );
  };

  const requestDelete = (tenant: TenantSummary) => {
    setDeletingTenant(tenant);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTenant) return;
    setIsDeleting(true);
    try {
      // Mock delete handler
      await new Promise((r) => setTimeout(r, 600));
      console.log("Delete tenant:", deletingTenant.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeletingTenant(null);
    }
  };

  const columns: ColumnConfig<TenantSummary>[] = useMemo(
    () => [
      {
        key: "school",
        label: "School",
        sortable: true,
        sortValue: (t) => t.name,
        render: (tenant) => (
          <div>
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {tenant.name}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {tenant.slug}
            </div>
          </div>
        ),
      },
      {
        key: "institutionType",
        label: "Type",
        sortable: true,
        sortValue: (t) => t.institutionType,
        render: (tenant) => getInstitutionBadge(tenant.institutionType),
      },
      {
        key: "region",
        label: "Region",
        sortable: true,
        sortValue: (t) => t.region,
        render: (tenant) => (
          <span className="text-sm text-neutral-900 dark:text-neutral-100">
            {tenant.region}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        sortValue: (t) => t.status,
        render: (tenant) => getStatusBadge(tenant.status),
      },
      {
        key: "subscription",
        label: "Subscription",
        render: (tenant) =>
          tenant.subscription ? (
            <div className="text-sm">
              <div className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                {tenant.subscription.plan}
              </div>
              <div className="text-neutral-500 dark:text-neutral-400 capitalize">
                {tenant.subscription.status}
              </div>
            </div>
          ) : (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              —
            </span>
          ),
      },
      {
        key: "createdAt",
        label: "Created",
        sortable: true,
        sortValue: (t) => new Date(t.createdAt).getTime(),
        render: (tenant) => (
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {new Date(tenant.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        searchable: false,
        className: "text-right",
        render: (tenant) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => router.push(`/admin/tenants/${tenant.id}`)}
              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push(`/admin/tenants/${tenant.id}/edit`)}
              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => requestDelete(tenant)}
              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [router]
  );

  return (
    <DataManagementPage
      title="Tenant Management"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Tenants", isActive: true },
      ]}
      data={tenants}
      getRowKey={(tenant) => tenant.id}
      columns={columns}
      stats={getTenantStats(tenants)}
      filterFields={tenantFilterFields}
      sortOptions={tenantSortOptions}
      defaultSort="name_asc"
      filterFn={filterTenants}
      sortFn={sortTenants}
      searchFn={searchTenants}
      searchPlaceholder="Search schools by name, slug, or region..."
      itemLabel="school"
      itemLabelPlural="schools"
      enableSelection={false}
      addButtonConfig={{ label: "Add New School", href: "/admin/tenants/create" }}
    >
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (isDeleting) return;
          setIsDeleteModalOpen(false);
          setDeletingTenant(null);
        }}
        title="Delete School"
        subtitle={deletingTenant ? deletingTenant.name : undefined}
        variant="danger"
        message="Are you sure you want to delete this school? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </DataManagementPage>
  );
}
