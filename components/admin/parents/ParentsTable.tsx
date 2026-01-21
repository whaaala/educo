"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoreVertical, MessageCircle, Phone, Mail, Eye, Trash2, Video, CalendarPlus, FileText, Banknote, UserCog, UserMinus, AlertTriangle, GraduationCap } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Modal from "@/components/shared/Modal";
import FormButton from "@/components/shared/FormButton";
import Tooltip from "@/components/shared/Tooltip";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCall } from "@/hooks/useCall";
import { useNotifications } from "@/contexts/NotificationContext";
import ScheduleMeetingModal, { ScheduledMeetingData } from "@/components/shared/ScheduleMeetingModal";
import QuickRecordPaymentModal from "./QuickRecordPaymentModal";
import EditParentContactModal from "./EditParentContactModal";
import ViewFeeStatementModal from "./ViewFeeStatementModal";
import DisconnectChildrenModal from "./DisconnectChildrenModal";
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
  const { settings } = useSchoolSettings();
  const { startVideoCall, startVoiceCall } = useCall();
  const { addNotification } = useNotifications();

  // Get currency symbol from settings
  const currencySymbol = useMemo(() => {
    const currencyCode = settings.currency || "NGN";
    try {
      const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode });
      const parts = formatter.formatToParts(0);
      return parts.find((p) => p.type === "currency")?.value || "₦";
    } catch {
      return "₦";
    }
  }, [settings.currency]);

  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuParentId, setOpenMenuParentId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<AdminParent | null>(null);
  const [menuPosition, setMenuPosition] = useState<"bottom" | "top">("bottom");
  const menuRef = useRef<HTMLDivElement>(null);

  // Modal states for parent actions
  const [activeParent, setActiveParent] = useState<AdminParent | null>(null);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isFeeStatementOpen, setIsFeeStatementOpen] = useState(false);
  const [isDisconnectChildrenOpen, setIsDisconnectChildrenOpen] = useState(false);
  const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);

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
    setOpenMenuParentId(null);
    setActiveParent(parent);

    switch (action) {
      case "Delete":
        // Check if parent has children
        if (parent.children && parent.children.length > 0) {
          setIsCannotDeleteOpen(true);
        } else {
          setParentToDelete(parent);
          setIsDeleteModalOpen(true);
        }
        break;
      case "View Profile":
        router.push(`/admin/parents/${parent.id}`);
        break;
      case "Schedule Meeting":
        setIsScheduleMeetingOpen(true);
        break;
      case "View Fee Statement":
        setIsFeeStatementOpen(true);
        break;
      case "Record Payment":
        setIsRecordPaymentOpen(true);
        break;
      case "Edit Contact Info":
        setIsEditContactOpen(true);
        break;
      case "Disconnect Children":
        setIsDisconnectChildrenOpen(true);
        break;
      default:
        console.log(`${action} clicked for parent:`, parent.id);
    }
  };

  // Handler functions for modals
  const handleScheduleMeeting = (meetingData: ScheduledMeetingData) => {
    console.log("Meeting scheduled:", meetingData);
    setIsScheduleMeetingOpen(false);
    if (activeParent) {
      addNotification({
        type: "meeting_scheduled",
        title: "Meeting Scheduled",
        message: `Meeting with ${activeParent.firstName} ${activeParent.lastName} has been scheduled for ${meetingData.date} at ${meetingData.time}.`,
      });
    }
  };

  const handleRecordPayment = (paymentData: { amount: number; childId: string; feeType: string; paymentMethod: string; reference: string }) => {
    console.log("Payment recorded:", paymentData);
    setIsRecordPaymentOpen(false);
    addNotification({
      type: "payment",
      title: "Payment Recorded",
      message: `Payment of ${currencySymbol}${paymentData.amount.toLocaleString()} has been recorded successfully.`,
    });
  };

  const handleUpdateContact = (updatedData: Partial<AdminParent>) => {
    console.log("Contact updated:", updatedData);
    setIsEditContactOpen(false);
    if (activeParent) {
      addNotification({
        type: "success",
        title: "Contact Updated",
        message: `${activeParent.firstName} ${activeParent.lastName}'s contact information has been updated.`,
      });
    }
  };

  const handleDisconnectChildren = (disconnectedChildIds: string[]) => {
    setIsDisconnectChildrenOpen(false);
    if (activeParent) {
      addNotification({
        type: "success",
        title: "Children Disconnected",
        message: `${disconnectedChildIds.length} ${disconnectedChildIds.length === 1 ? "child has" : "children have"} been disconnected from ${activeParent.firstName} ${activeParent.lastName}.`,
      });
    }
  };

  // Create participant object for calls
  const createParticipant = (parent: AdminParent) => ({
    id: parent.id,
    name: `${parent.firstName} ${parent.lastName}`,
    avatar: parent.profilePhoto,
    role: parent.relationship,
    phone: parent.phone,
    email: parent.email,
  });

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
          <div className="min-w-0 flex flex-col">
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
            <span className="text-xs text-gray-500 dark:text-gray-400 block">{parent.relationship}</span>
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
          {/* Chat Icon */}
          <Tooltip content="Chat" delay={200}>
            <button
              className="p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/parents/chat/${parent.id}`);
              }}
            >
              <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400 hover:text-blue-600" />
            </button>
          </Tooltip>
          {/* Voice Call Icon */}
          <Tooltip content="Voice Call" delay={200}>
            <button
              className="p-1 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                startVoiceCall(createParticipant(parent), { callContext: `Voice call with ${parent.firstName}` });
              }}
            >
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400 hover:text-green-600" />
            </button>
          </Tooltip>
          {/* Email Icon */}
          <Tooltip content="Send Email" delay={200}>
            <button
              className="p-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${parent.email}`);
              }}
            >
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400 hover:text-purple-600" />
            </button>
          </Tooltip>
          {/* Video Call Icon */}
          <Tooltip content="Video Call" delay={200}>
            <button
              className="p-1 rounded-md hover:bg-cyan-50 dark:hover:bg-cyan-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                startVideoCall(createParticipant(parent), { callContext: `Video call with ${parent.firstName}` });
              }}
            >
              <Video className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400 hover:text-cyan-600" />
            </button>
          </Tooltip>
          {/* More Options */}
          <div
            className="relative flex-shrink-0 overflow-visible"
            ref={openMenuParentId === parent.id ? menuRef : null}
          >
            <Tooltip content="More Options" delay={200}>
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
            </Tooltip>

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
                  onClick={() => handleMenuItemClick("View Profile", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("Schedule Meeting", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("View Fee Statement", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Fee Statement</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("Record Payment", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Banknote className="w-4 h-4" />
                  <span>Record Payment</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick("Edit Contact Info", parent)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <UserCog className="w-4 h-4" />
                  <span>Edit Contact Info</span>
                </button>
                {parent.children && parent.children.length > 0 && (
                  <button
                    onClick={() => handleMenuItemClick("Disconnect Children", parent)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>Disconnect Children</span>
                  </button>
                )}
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

      {/* Schedule Meeting Modal */}
      {activeParent && (
        <ScheduleMeetingModal
          isOpen={isScheduleMeetingOpen}
          onClose={() => setIsScheduleMeetingOpen(false)}
          onSchedule={handleScheduleMeeting}
          context="parent"
          primaryParticipant={{
            id: activeParent.id,
            name: `${activeParent.firstName} ${activeParent.lastName}`,
            type: "parent",
            role: activeParent.relationship,
            email: activeParent.email,
            photo: activeParent.profilePhoto,
          }}
          children={activeParent.children.map((child) => ({
            id: child.id,
            name: `${child.firstName} ${child.lastName}`,
            classLevel: child.classLevel,
          }))}
        />
      )}

      {/* Quick Record Payment Modal */}
      {activeParent && (
        <QuickRecordPaymentModal
          isOpen={isRecordPaymentOpen}
          onClose={() => setIsRecordPaymentOpen(false)}
          onSubmit={handleRecordPayment}
          parent={activeParent}
          currencySymbol={currencySymbol}
        />
      )}

      {/* Edit Contact Info Modal */}
      {activeParent && (
        <EditParentContactModal
          isOpen={isEditContactOpen}
          onClose={() => setIsEditContactOpen(false)}
          onSave={handleUpdateContact}
          parent={activeParent}
        />
      )}

      {/* View Fee Statement Modal */}
      {activeParent && (
        <ViewFeeStatementModal
          isOpen={isFeeStatementOpen}
          onClose={() => setIsFeeStatementOpen(false)}
          parent={activeParent}
        />
      )}

      {/* Disconnect Children Modal */}
      {activeParent && (
        <DisconnectChildrenModal
          isOpen={isDisconnectChildrenOpen}
          onClose={() => setIsDisconnectChildrenOpen(false)}
          onConfirm={handleDisconnectChildren}
          parent={activeParent}
        />
      )}

      {/* Cannot Delete Modal - shown when trying to delete parent with children */}
      {activeParent && (
        <Modal
          isOpen={isCannotDeleteOpen}
          onClose={() => setIsCannotDeleteOpen(false)}
          maxWidth="md"
          title="Cannot Delete Parent"
          subtitle="Active children detected"
          icon={<AlertTriangle className="w-5 h-5" />}
        >
          <div className="space-y-4">
            {/* Warning Message */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  This parent cannot be deleted
                </p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {activeParent.firstName} {activeParent.lastName} is currently connected to {activeParent.children.length} {activeParent.children.length === 1 ? "child" : "children"} in the system.
                </p>
              </div>
            </div>

            {/* Connected Children List */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Connected Children:
              </h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {activeParent.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {child.classLevel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                To delete this parent, you must first disconnect all children using the <strong>&quot;Disconnect Children&quot;</strong> option from the dropdown menu.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <FormButton type="button" variant="secondary" onClick={() => setIsCannotDeleteOpen(false)}>
                Close
              </FormButton>
              <FormButton
                type="button"
                variant="primary"
                onClick={() => {
                  setIsCannotDeleteOpen(false);
                  setIsDisconnectChildrenOpen(true);
                }}
              >
                Disconnect Children
              </FormButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
