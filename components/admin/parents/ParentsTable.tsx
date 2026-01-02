"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoreVertical, MessageCircle, Phone, Mail, Eye, Edit, CreditCard, Users, Trash2, Lock } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Tooltip from "@/components/shared/Tooltip";
import NameLabel from "@/components/shared/NameLabel";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import type { AdminParent } from "@/lib/mockParents";

interface ParentsTableProps {
  parents: AdminParent[];
  isLoading?: boolean;
  loadingMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  totalParentsCount?: number;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export default function ParentsTable({
  parents,
  isLoading = false,
  loadingMessage = "Loading...",
  onClearFilters,
  hasActiveFilters = false,
  totalParentsCount,
  selectedIds: externalSelectedIds,
  onSelectionChange,
}: ParentsTableProps) {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const { settings } = useSchoolSettings();
  const currencySymbol = settings.currency?.symbol || "₦";

  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuParentId, setOpenMenuParentId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<AdminParent | null>(null);
  const [menuPosition, setMenuPosition] = useState<"bottom" | "top">("bottom");
  const menuRef = useRef<HTMLDivElement>(null);

  // Use external state if provided, otherwise use internal state
  const selectedIds = externalSelectedIds ?? internalSelectedIds;
  const updateSelectedIds = (newIds: Set<string>) => {
    if (onSelectionChange) {
      onSelectionChange(newIds);
    } else {
      setInternalSelectedIds(newIds);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      updateSelectedIds(new Set(parents.map((p) => p.id)));
    } else {
      updateSelectedIds(new Set());
    }
  };

  const handleSelectRow = (parentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) {
      newSelectedIds.add(parentId);
    } else {
      newSelectedIds.delete(parentId);
    }
    updateSelectedIds(newSelectedIds);
  };

  const handleMenuToggle = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (openMenuParentId === parentId) {
      setOpenMenuParentId(null);
      return;
    }

    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const menuHeight = 280;
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      setMenuPosition("top");
    } else {
      setMenuPosition("bottom");
    }

    setOpenMenuParentId(parentId);
  };

  const handleMenuItemClick = (action: string, parent: AdminParent) => {
    if (action === "Delete") {
      setParentToDelete(parent);
      setIsDeleteModalOpen(true);
      setOpenMenuParentId(null);
    } else if (action === "Edit") {
      router.push(`/admin/parents/edit/${parent.id}`);
      setOpenMenuParentId(null);
    } else if (action === "View Parent") {
      router.push(`/admin/parents/${parent.id}`);
      setOpenMenuParentId(null);
    } else if (action === "View Fees") {
      router.push(`/admin/parents/${parent.id}/fees`);
      setOpenMenuParentId(null);
    } else if (action === "View Children") {
      router.push(`/admin/parents/${parent.id}/children`);
      setOpenMenuParentId(null);
    } else {
      console.log(`${action} clicked for parent:`, parent.id);
      setOpenMenuParentId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (parentToDelete) {
      console.log("Deleting parent:", parentToDelete.id);
      setIsDeleteModalOpen(false);
      setParentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setParentToDelete(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuParentId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAllSelected = parents.length > 0 && selectedIds.size === parents.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < parents.length;

  // Define column configuration
  const columns: ColumnConfig<AdminParent>[] = [
    {
      key: "index",
      label: "",
      sortable: false,
      className: "text-center w-[5%] md:w-[3%]",
      render: (parent) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selectedIds.has(parent.id)}
            onChange={(e) => handleSelectRow(parent.id, e)}
            className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all duration-200 hover:border-blue-500"
          />
        </div>
      ),
      searchable: false,
      renderHeader: () => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = isSomeSelected;
              }
            }}
            onChange={handleSelectAll}
            className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 cursor-pointer"
          />
        </div>
      ),
    },
    {
      key: "name",
      label: "Parent Name",
      sortable: true,
      className: "text-left w-[25%] md:w-[18%]",
      sortValue: (parent) => `${parent.firstName} ${parent.lastName}`,
      render: (parent) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative cursor-pointer group/avatar flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-white/80 dark:ring-gray-700/50 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 group-hover/avatar:z-[100]">
              {parent.profilePhoto ? (
                <Image
                  src={parent.profilePhoto}
                  alt={`${parent.firstName} ${parent.lastName}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold">
                  {parent.firstName.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
          </div>
          <div className="min-w-0">
            <Tooltip content={`${parent.firstName} ${parent.lastName}`}>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/parents/${parent.id}`);
                }}
                className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate block"
              >
                {parent.firstName} {parent.lastName}
              </span>
            </Tooltip>
            <span className="text-xs text-gray-500 dark:text-gray-400">{parent.relationship}</span>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[15%]",
      render: (parent) => (
        <Tooltip content={parent.email}>
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate block max-w-[150px]">
            {parent.email}
          </span>
        </Tooltip>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      hidden: { mobile: true },
      className: "text-left w-[12%]",
      render: (parent) => (
        <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{parent.phone}</span>
      ),
    },
    {
      key: "children",
      label: "Children",
      sortable: true,
      className: "text-left w-[15%] md:w-[12%]",
      sortValue: (parent) => parent.children.length,
      render: (parent) => {
        const childrenNames = parent.children.map((c) => c.firstName).join(", ");
        return (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
              {parent.children.length}
            </span>
            <Tooltip content={childrenNames}>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                {childrenNames}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      key: "outstanding",
      label: "Outstanding",
      sortable: true,
      className: "text-left w-[12%]",
      sortValue: (parent) => parent.totalOutstandingFees,
      render: (parent) => {
        const hasBalance = parent.totalOutstandingFees > 0;
        const isHighBalance = parent.totalOutstandingFees > 100000;
        return (
          <span
            className={`text-sm font-semibold ${
              !hasBalance
                ? "text-green-600 dark:text-green-400"
                : isHighBalance
                ? "text-red-600 dark:text-red-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {formatCurrency(parent.totalOutstandingFees)}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      hidden: { mobile: true },
      className: "text-left w-[8%]",
      render: (parent) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            parent.status === "Active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {parent.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      className: "text-left w-[20%] md:w-[18%] !overflow-visible",
      render: (parent) => (
        <div className="flex items-center justify-start gap-1 md:gap-1.5">
          <div className="relative group/msg flex-shrink-0">
            <button
              className="p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Message", parent.id);
              }}
            >
              <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400 group-hover/msg:text-blue-600" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/msg:opacity-100 transition-opacity pointer-events-none z-[99999]">
              <NameLabel name="Message" variant="compact" />
            </div>
          </div>
          <div className="relative group/call flex-shrink-0">
            <button
              className="p-1 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${parent.phone.replace(/\s/g, "")}`);
              }}
            >
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400 group-hover/call:text-green-600" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/call:opacity-100 transition-opacity pointer-events-none z-[99999]">
              <NameLabel name="Call" variant="compact" />
            </div>
          </div>
          <div className="relative group/email flex-shrink-0">
            <button
              className="p-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${parent.email}`);
              }}
            >
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400 group-hover/email:text-purple-600" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/email:opacity-100 transition-opacity pointer-events-none z-[99999]">
              <NameLabel name="Email" variant="compact" />
            </div>
          </div>
          <div className="relative group/fees flex-shrink-0">
            <button
              className="p-1 rounded-md hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/parents/${parent.id}/fees`);
              }}
            >
              <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400 group-hover/fees:text-amber-600" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/fees:opacity-100 transition-opacity pointer-events-none z-[99999]">
              <NameLabel name="View Fees" variant="compact" />
            </div>
          </div>
          <div
            className="relative flex-shrink-0 overflow-visible group/more"
            ref={openMenuParentId === parent.id ? menuRef : null}
          >
            <button
              className={`p-1 rounded-md transition-all duration-200 hover:scale-105 cursor-pointer ${
                openMenuParentId === parent.id
                  ? "bg-gray-200 dark:bg-gray-600"
                  : "hover:bg-gray-100 dark:hover:bg-gray-500/20"
              }`}
              onClick={(e) => handleMenuToggle(parent.id, e)}
            >
              <MoreVertical className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/more:opacity-100 transition-opacity pointer-events-none z-[99999]">
              <NameLabel name="More" variant="compact" />
            </div>

            {openMenuParentId === parent.id && (
              <div
                ref={menuRef}
                className={`absolute right-0 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-[999999] py-1 animate-in fade-in duration-200 ${
                  menuPosition === "top"
                    ? "bottom-full mb-1 slide-in-from-bottom-2"
                    : "top-full mt-1 slide-in-from-top-2"
                }`}
              >
                <button
                  onClick={() => handleMenuItemClick("View Parent", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Parent</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("Edit", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("View Children", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>View Children</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("View Fees", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>View Fees</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("Login Details", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login Details</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("Delete", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ),
      searchable: false,
    },
  ];

  return (
    <>
      <DataTable
        data={parents}
        columns={columns}
        title="Parent Records"
        searchPlaceholder="Search parents..."
        getRowKey={(parent) => parent.id}
        emptyMessage="No parents found"
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalDataCount={totalParentsCount}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[10, 20, 50, 100]}
      />

      {/* Delete Confirmation Modal */}
      {parentToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Parent"
          itemName={`${parentToDelete.firstName} ${parentToDelete.lastName}`}
          itemId={parentToDelete.id}
          warningMessage="This will permanently remove this parent and all associated data. This action cannot be undone."
          confirmButtonText="Delete Parent"
        />
      )}
    </>
  );
}
