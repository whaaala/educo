"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCall } from "@/hooks/useCall";
import { DataManagementPage } from "@/components/pages";
import StaffCard from "@/components/staff/StaffCard";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import Tooltip from "@/components/shared/Tooltip";
import { getAllTeachers, Teacher } from "@/lib/mockTeachers";
import { exportStaffToPDF } from "@/utils/staffPdfExport";
import { exportStaffToExcel } from "@/utils/staffExcelExport";
import { MoreVertical, MessageCircle, Phone, Video, Mail, Eye, Edit, Lock, Trash2 } from "lucide-react";
import type { ColumnConfig, GridCardProps } from "@/types/components";
import {
  getStaffCategories,
  staffFilterFields,
  staffSortOptions,
  sortStaff,
  filterStaff,
  filterByCategory,
  getRandomColor,
} from "./config";

// Grid card wrapper - adapts StaffCard to GridCardProps interface
function StaffGridCard({ item, isSelected, onSelectionChange }: GridCardProps<Teacher>) {
  const colorIndex = item.firstName.charCodeAt(0) + item.lastName.charCodeAt(0);
  return (
    <StaffCard
      staff={item}
      colorIndex={colorIndex}
      isSelected={isSelected}
      onSelectionChange={(_id, selected) => onSelectionChange(selected)}
    />
  );
}

// Inline action cell component (preserves the exact action buttons from StaffTable)
function StaffActionsCell({ staff }: { staff: Teacher }) {
  const router = useRouter();
  const { startVideoCall, startVoiceCall } = useCall();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClick = (action: string) => {
    setIsMenuOpen(false);
    switch (action) {
      case "View Staff":
        router.push(`/staff/${staff.id}`);
        break;
      case "Edit":
        router.push(`/staff/edit/${staff.id}`);
        break;
      case "Delete":
        console.log("Delete staff:", staff.id);
        break;
    }
  };

  return (
    <div className="flex items-center justify-start gap-0.5 md:gap-1 lg:gap-1.5 xl:gap-2 pr-0.5 md:pr-2">
      <div className="relative group/msg flex-shrink-0">
        <button
          className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); console.log("Message", staff.id); }}
        >
          <MessageCircle className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/msg:text-blue-600 dark:group-hover/msg:text-blue-400 transition-colors" />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
          <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">Message</div>
        </div>
      </div>
      <div className="relative group/call flex-shrink-0">
        <button
          className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            startVoiceCall({
              id: staff.id,
              name: `${staff.firstName} ${staff.lastName}`,
              avatar: staff.imageUrl,
              email: staff.email,
              role: "Staff",
            }, { callContext: `Voice call with ${staff.firstName}` });
          }}
        >
          <Phone className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/call:text-green-600 dark:group-hover/call:text-green-400 transition-colors" />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/call:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
          <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">Voice Call</div>
        </div>
      </div>
      <div className="relative group/video flex-shrink-0">
        <button
          className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            startVideoCall({
              id: staff.id,
              name: `${staff.firstName} ${staff.lastName}`,
              avatar: staff.imageUrl,
              email: staff.email,
              role: "Staff",
            }, { callContext: `Video call with ${staff.firstName}` });
          }}
        >
          <Video className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/video:text-purple-600 dark:group-hover/video:text-purple-400 transition-colors" />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/video:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
          <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">Video Call</div>
        </div>
      </div>
      <div className="relative group/email flex-shrink-0">
        <button
          className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); console.log("Email", staff.id); }}
        >
          <Mail className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/email:text-purple-600 dark:group-hover/email:text-purple-400 transition-colors" />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/email:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
          <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">Email</div>
        </div>
      </div>
      <div className="relative flex-shrink-0 overflow-visible group/more">
        <button
          className={`p-0.5 md:p-1 xl:p-1.5 rounded-md transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer ${
            isMenuOpen
              ? 'bg-gray-200 dark:bg-gray-600 midnight:bg-cyan-500/30 purple:bg-pink-500/30'
              : 'hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20'
          }`}
          title="More"
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
        >
          <MoreVertical className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/more:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
          <div className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">More</div>
        </div>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[999999] py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <button onClick={() => handleMenuItemClick('View Staff')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
              <Eye className="w-4 h-4" /><span>View Staff</span>
            </button>
            <button onClick={() => handleMenuItemClick('Edit')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
              <Edit className="w-4 h-4" /><span>Edit</span>
            </button>
            <button onClick={() => handleMenuItemClick('Login Details')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
              <Lock className="w-4 h-4" /><span>Login Details</span>
            </button>
            <button onClick={() => handleMenuItemClick('Disable')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
              <Lock className="w-4 h-4" /><span>Disable</span>
            </button>
            <button onClick={() => handleMenuItemClick('Delete')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-500/10 purple:hover:bg-red-500/10 transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4" /><span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Badge color helpers
const getRoleBadgeColor = (role: string) => {
  const colors: Record<string, string> = {
    Admin: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    Support: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    Management: "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  };
  return colors[role] || colors.Admin;
};

const getStatusBadgeColor = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    "On Leave": "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    Suspended: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    Terminated: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  };
  return colors[status] || colors.Active;
};

export default function StaffPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // All staff data
  const [staff] = useState<Teacher[]>(getAllTeachers());

  // Category filter state (managed externally since DataManagementPage doesn't handle category tabs)
  const urlCategory = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || "all");

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Pre-filter by category before passing to DataManagementPage
  const categoryFilteredStaff = useMemo(
    () => filterByCategory(staff, selectedCategory),
    [staff, selectedCategory]
  );

  // Staff categories
  const staffCategories = useMemo(() => getStaffCategories(staff), [staff]);

  // Column definitions (matching StaffTable exactly)
  const staffColumns: ColumnConfig<Teacher>[] = useMemo(() => [
    {
      key: "staffId",
      label: "Staff ID",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (staffMember) => (
        <span
          onClick={(e) => { e.stopPropagation(); router.push(`/staff/${staffMember.id}`); }}
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
            <div className="relative cursor-pointer group/avatar flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <img
                src={staffMember.imageUrl}
                alt={`${staffMember.firstName} ${staffMember.lastName}`}
                className="w-7 h-7 md:w-8 md:h-8 xl:w-9 xl:h-9 rounded-full object-cover shrink-0 ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                style={{ position: 'relative', transformOrigin: 'center center' }}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
            </div>
          ) : (
            <div className="relative cursor-pointer group/avatar flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
              <span className="md:hidden">{staffMember.firstName} {staffMember.lastName.charAt(0)}</span>
              <span className="hidden md:inline">{staffMember.firstName} {staffMember.lastName}</span>
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
          <span className={`inline-flex items-center justify-center px-2 md:px-3 xl:px-3.5 py-1 md:py-1.5 xl:py-2 rounded-full text-[10px] md:text-xs xl:text-sm font-semibold shadow-sm transition-all duration-300 whitespace-nowrap ${getStatusBadgeColor(staffMember.employmentStatus)}`}>
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
          {new Date(staffMember.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      searchable: false,
      className: "text-left w-[39%] md:w-[21%] !overflow-visible",
      render: (staffMember) => <StaffActionsCell staff={staffMember} />,
    },
  ], [router]);

  // Export handlers
  const handleExportPDF = (data: Teacher[]) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    exportStaffToPDF(data, `staff_${dateStr}.pdf`);
  };

  const handleExportExcel = (data: Teacher[]) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    exportStaffToExcel(data, `staff_${dateStr}.xlsx`);
  };

  // Bulk delete handler
  const handleBulkDelete = (selectedIds: Set<string>) => {
    const selectedStaff = categoryFilteredStaff.filter(s => selectedIds.has(s.id));
    const items: BulkDeleteItem[] = selectedStaff.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      subtitle: s.staffId,
      avatarColor: s.imageUrl ? undefined : getRandomColor(`${s.firstName} ${s.lastName}`),
      avatar: s.imageUrl,
    }));
    setItemsToDelete(items);
    setIsBulkDeleteModalOpen(true);
  };

  // Category tabs JSX
  const categoryTabs = (
    <div className="mb-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {staffCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => {
              setSelectedCategory(category.value);
              const urlView = searchParams.get("view");
              router.push(`/staff?category=${category.value}${urlView ? `&view=${urlView}` : ''}`);
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200
              ${selectedCategory === category.value
                ? 'bg-blue-600 text-white dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 shadow-lg'
                : 'bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800'
              }
            `}
          >
            {category.label}
            <span className={`
              px-2 py-0.5 rounded-full text-xs font-semibold
              ${selectedCategory === category.value
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400'
              }
            `}>
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <DataManagementPage<Teacher>
      title="Personnel Management"
      subtitle="Manage all teaching and non-teaching staff"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Peoples" },
        { label: "Personnel", isActive: true },
      ]}
      data={categoryFilteredStaff}
      getRowKey={(item) => item.id}
      columns={staffColumns}
      filterFields={staffFilterFields}
      filterFn={filterStaff}
      sortOptions={staffSortOptions}
      sortFn={sortStaff}
      defaultSort="ascending"
      enableDateRange
      enableViewToggle
      defaultViewMode="grid"
      gridCardComponent={StaffGridCard}
      gridColumns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      enableSelection
      enableLoadMore
      initialGridCount={8}
      loadMoreCount={8}
      bulkActions={[
        {
          id: "delete",
          label: "Delete Selected",
          icon: Trash2,
          variant: "danger",
          onClick: handleBulkDelete,
        },
      ]}
      addButtonConfig={{
        label: "Add Personnel",
        onClick: () => router.push("/staff/add"),
      }}
      exportConfig={{ filename: "staff" }}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      itemLabel="staff member"
      itemLabelPlural="staff members"
      emptyStateConfig={{
        title: "No staff found",
        description: "No staff members match the current filters.",
      }}
      headerContent={categoryTabs}
    >
      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={(itemIds) => {
          console.log('Deleting staff:', itemIds);
          setIsBulkDeleteModalOpen(false);
          setItemsToDelete([]);
        }}
        items={itemsToDelete}
        onRemoveItem={(itemId) => {
          setItemsToDelete(prev => prev.filter(item => item.id !== itemId));
        }}
        onRestoreItem={(item) => {
          setItemsToDelete(prev => [...prev, item]);
        }}
        onRestoreAll={(items) => {
          setItemsToDelete(prev => [...prev, ...items]);
        }}
        title="Delete Staff"
        warningMessage="This will permanently remove these staff members and all associated data. This action cannot be undone."
        confirmButtonText="Delete Staff"
      />
    </DataManagementPage>
  );
}
