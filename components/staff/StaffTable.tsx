"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Teacher } from "@/lib/mockTeachers";
import { MoreVertical, MessageCircle, Phone, Mail, Eye, Edit, Lock, Trash2 } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Tooltip from "@/components/shared/Tooltip";
import { useSidebar } from "@/contexts/SidebarContext";

interface StaffTableProps {
  staff: Teacher[];
  isLoading?: boolean;
  loadingMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  totalStaffCount?: number;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export default function StaffTable({
  staff,
  isLoading = false,
  loadingMessage = "Loading...",
  onClearFilters,
  hasActiveFilters = false,
  totalStaffCount,
  selectedIds: externalSelectedIds,
  onSelectionChange
}: StaffTableProps) {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuStaffId, setOpenMenuStaffId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Teacher | null>(null);
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use external state if provided, otherwise use internal state
  const selectedIds = externalSelectedIds ?? internalSelectedIds;
  const updateSelectedIds = (newIds: Set<string>) => {
    if (onSelectionChange) {
      onSelectionChange(newIds);
    } else {
      setInternalSelectedIds(newIds);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      updateSelectedIds(new Set(staff.map(s => s.id)));
    } else {
      updateSelectedIds(new Set());
    }
  };

  const handleSelectRow = (staffId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) {
      newSelectedIds.add(staffId);
    } else {
      newSelectedIds.delete(staffId);
    }
    updateSelectedIds(newSelectedIds);
  };

  const handleMenuToggle = (staffId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (openMenuStaffId === staffId) {
      setOpenMenuStaffId(null);
      return;
    }

    // Calculate if menu would go off-screen
    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const menuHeight = 240; // Approximate height of the menu with 5 items
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // Position menu above if not enough space below
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      setMenuPosition('top');
    } else {
      setMenuPosition('bottom');
    }

    setOpenMenuStaffId(staffId);
  };

  const handleMenuItemClick = (action: string, staffMember: Teacher) => {
    if (action === 'Delete') {
      setStaffToDelete(staffMember);
      setIsDeleteModalOpen(true);
      setOpenMenuStaffId(null);
    } else if (action === 'Edit') {
      router.push(`/staff/edit/${staffMember.id}`);
      setOpenMenuStaffId(null);
    } else if (action === 'View Staff') {
      router.push(`/staff/${staffMember.id}`);
      setOpenMenuStaffId(null);
    } else {
      console.log(`${action} clicked for staff:`, staffMember.id);
      setOpenMenuStaffId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (staffToDelete) {
      console.log('Deleting staff:', staffToDelete.id);
      // Add your delete logic here
      setIsDeleteModalOpen(false);
      setStaffToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStaffToDelete(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuStaffId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAllSelected = staff.length > 0 && selectedIds.size === staff.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < staff.length;

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      Admin: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      Support: "bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      Management: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    };
    return colors[role] || colors.Support;
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Active: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      "On Leave": "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      Suspended: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      Terminated: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    };
    return colors[status] || colors.Active;
  };

  // Define column configuration matching StudentTable structure
  const allColumns: ColumnConfig<Teacher>[] = [
    {
      key: "index",
      label: "",
      sortable: false,
      className: "text-center w-[5%] md:w-[3%]",
      render: (staffMember) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selectedIds.has(staffMember.id)}
            onChange={(e) => handleSelectRow(staffMember.id, e)}
            className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 cursor-pointer transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 midnight:hover:border-cyan-400 purple:hover:border-pink-400"
          />
        </div>
      ),
      searchable: false,
      renderHeader: () => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isSomeSelected;
                }
              }}
              onChange={handleSelectAll}
              className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 cursor-pointer transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 midnight:hover:border-cyan-400 purple:hover:border-pink-400"
            />
          </div>
        </div>
      ),
    },
    {
      key: "staffId",
      label: "Staff ID",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (staffMember) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/staff/${staffMember.id}`);
          }}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 block cursor-pointer whitespace-nowrap transition-all duration-200"
        >
          {staffMember.staffId}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      className: "text-left w-[38%] md:w-[18%]",
      render: (staffMember) => (
        <div className="flex items-center gap-1.5 md:gap-2.5 min-w-0">
          {staffMember.imageUrl ? (
            <div
              className="relative cursor-pointer group/avatar flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Avatar clicked", staffMember.id);
              }}
            >
              <img
                src={staffMember.imageUrl}
                alt={`${staffMember.firstName} ${staffMember.lastName}`}
                className="w-7 h-7 md:w-8 md:h-8 xl:w-9 xl:h-9 rounded-full object-cover shrink-0 ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                style={{ position: 'relative', transformOrigin: 'center center' }}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
            </div>
          ) : (
            <div
              className="relative cursor-pointer group/avatar flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Avatar clicked", staffMember.id);
              }}
            >
              <div
                className="w-7 h-7 md:w-8 md:h-8 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs md:text-sm font-bold shrink-0 shadow-lg ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                style={{ position: 'relative', transformOrigin: 'center center' }}
              >
                {staffMember.firstName.charAt(0)}
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
            </div>
          )}
          <Tooltip content={`${staffMember.firstName} ${staffMember.lastName}`}>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 md:truncate-none truncate">
              {/* On mobile: show truncated name with first name + last initial */}
              {/* On desktop: show full name */}
              <span className="md:hidden">
                {staffMember.firstName} {staffMember.lastName.charAt(0)}
              </span>
              <span className="hidden md:inline">
                {staffMember.firstName} {staffMember.lastName}
              </span>
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      hidden: { mobile: true },
      className: "text-left w-[12%]",
      render: (staffMember) => (
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
          {staffMember.department}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (staffMember) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${getRoleBadgeColor(staffMember.role)}`}>
          {staffMember.role}
        </span>
      ),
    },
    {
      key: "employmentStatus",
      label: "Status",
      sortable: true,
      className: "text-left w-[18%] md:w-[8%]",
      render: (staffMember) => (
        <div className="flex items-center justify-start">
          <span
            className={`inline-flex items-center justify-center px-2 md:px-3 xl:px-3.5 py-1 md:py-1.5 xl:py-2 rounded-full text-[10px] md:text-xs xl:text-sm font-semibold shadow-sm transition-all duration-300 whitespace-nowrap ${getStatusBadgeColor(staffMember.employmentStatus)}`}
          >
            {staffMember.employmentStatus}
          </span>
        </div>
      ),
    },
    {
      key: "joinDate",
      label: "Date of Join",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (staffMember) => (
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 whitespace-nowrap">
          {new Date(staffMember.joinDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      className: "text-left w-[39%] md:w-[21%] !overflow-visible",
      render: (staffMember) => (
        <div className="flex items-center justify-start gap-0.5 md:gap-1 lg:gap-1.5 xl:gap-2 pr-0.5 md:pr-2">
          <div className="relative group/msg flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Message", staffMember.id);
              }}
            >
              <MessageCircle className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/msg:text-blue-600 dark:group-hover/msg:text-blue-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">
                Message
              </div>
            </div>
          </div>
          <div className="relative group/call flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Call", staffMember.id);
              }}
            >
              <Phone className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/call:text-green-600 dark:group-hover/call:text-green-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/call:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">
                Call
              </div>
            </div>
          </div>
          <div className="relative group/email flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Email", staffMember.id);
              }}
            >
              <Mail className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/email:text-purple-600 dark:group-hover/email:text-purple-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/email:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">
                Email
              </div>
            </div>
          </div>
          <div className="relative flex-shrink-0 overflow-visible group/more" ref={openMenuStaffId === staffMember.id ? menuRef : null}>
            <button
              ref={openMenuStaffId === staffMember.id ? buttonRef : null}
              className={`p-0.5 md:p-1 xl:p-1.5 rounded-md transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer ${
                openMenuStaffId === staffMember.id
                  ? 'bg-gray-200 dark:bg-gray-600 midnight:bg-cyan-500/30 purple:bg-pink-500/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20'
              }`}
              title="More"
              onClick={(e) => handleMenuToggle(staffMember.id, e)}
            >
              <MoreVertical className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/more:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">
                More
              </div>
            </div>

            {openMenuStaffId === staffMember.id && (
              <div
                ref={menuRef}
                className={`absolute right-0 w-52 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[999999] py-1 animate-in fade-in duration-200 ${
                  menuPosition === 'top'
                    ? 'bottom-full mb-1 slide-in-from-bottom-2'
                    : 'top-full mt-1 slide-in-from-top-2'
                }`}
              >
                <button
                  onClick={() => handleMenuItemClick('View Staff', staffMember)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Staff</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Edit', staffMember)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Login Details', staffMember)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login Details</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Disable', staffMember)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Disable</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Delete', staffMember)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-500/10 purple:hover:bg-red-500/10 transition-colors cursor-pointer"
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

  // Filter columns based on sidebar state
  const columns = allColumns;

  return (
    <>
      <DataTable
        data={staff}
        columns={columns}
        title="Staff Records"
        searchPlaceholder="Search staff..."
        getRowKey={(staffMember) => staffMember.id}
        emptyMessage="No staff found"
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[10, 20, 50, 100]}
      />

      {/* Delete Confirmation Modal */}
      {staffToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Staff"
          itemName={`${staffToDelete.firstName} ${staffToDelete.lastName}`}
          itemId={staffToDelete.staffId}
          warningMessage="This will permanently remove this staff member and all associated data. This action cannot be undone."
          confirmButtonText="Delete Staff"
        />
      )}
    </>
  );
}
