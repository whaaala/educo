"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Phone, Mail, Video, CalendarPlus, Receipt, Banknote, UserCog, UserMinus, AlertTriangle, GraduationCap } from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormButton from "@/components/shared/FormButton";
import ProfileCard from "@/components/shared/ProfileCard";
import type { AdminParent } from "@/lib/mockParents";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCall } from "@/hooks/useCall";
import ScheduleMeetingModal, { ScheduledMeetingData } from "@/components/shared/ScheduleMeetingModal";
import QuickRecordPaymentModal from "./QuickRecordPaymentModal";
import EditParentContactModal from "./EditParentContactModal";
import ViewFeeStatementModal from "./ViewFeeStatementModal";
import DisconnectChildrenModal from "./DisconnectChildrenModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import { useNotifications } from "@/contexts/NotificationContext";

interface ParentCardProps {
  parent: AdminParent;
  colorIndex: number;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  onParentUpdated?: (updatedParent: AdminParent) => void;
  onParentDeleted?: (parentId: string) => void;
}

export default function ParentCard({
  parent,
  colorIndex,
  isSelected,
  onSelectionChange,
  onParentUpdated,
  onParentDeleted,
}: ParentCardProps) {
  const router = useRouter();
  const { settings } = useSchoolSettings();
  const { startVideoCall, startVoiceCall } = useCall();
  const { addNotification } = useNotifications();

  // Modal states
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isFeeStatementOpen, setIsFeeStatementOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDisconnectChildrenOpen, setIsDisconnectChildrenOpen] = useState(false);
  const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);

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

  // Create participant object for calls
  const parentParticipant = {
    id: parent.id,
    name: `${parent.firstName} ${parent.lastName}`,
    avatar: parent.profilePhoto,
    role: parent.relationship,
    phone: parent.phone,
    email: parent.email,
  };

  // Check if parent has active children
  const hasActiveChildren = parent.children && parent.children.length > 0;

  const handleView = (id: string) => {
    router.push(`/admin/parents/${id}`);
  };

  const handleDeleteClick = () => {
    if (hasActiveChildren) {
      // Show modal that parent cannot be deleted while connected to children
      setIsCannotDeleteOpen(true);
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    // Call the delete handler
    onParentDeleted?.(parent.id);
    setIsDeleteConfirmOpen(false);
    addNotification({
      type: "success",
      title: "Parent Deleted",
      message: `${parent.firstName} ${parent.lastName} has been removed from the system.`,
    });
  };

  const handleDisconnectChildren = (disconnectedChildIds: string[]) => {
    // In a real app, this would update the backend
    // For now, we'll just show a notification
    setIsDisconnectChildrenOpen(false);
    addNotification({
      type: "success",
      title: "Children Disconnected",
      message: `${disconnectedChildIds.length} ${disconnectedChildIds.length === 1 ? "child has" : "children have"} been disconnected from ${parent.firstName} ${parent.lastName}.`,
    });

    // Update the parent's children list (in a real app, this would come from the backend)
    const remainingChildren = parent.children.filter(
      (child) => !disconnectedChildIds.includes(child.id)
    );

    // If all children are disconnected, the parent can now be deleted
    if (remainingChildren.length === 0) {
      addNotification({
        type: "info",
        title: "Ready for Deletion",
        message: `${parent.firstName} ${parent.lastName} no longer has any connected children and can now be deleted.`,
      });
    }

    // Notify parent component of the update
    if (onParentUpdated) {
      onParentUpdated({
        ...parent,
        children: remainingChildren,
      });
    }
  };

  const handleScheduleMeeting = (meetingData: ScheduledMeetingData) => {
    console.log("Meeting scheduled:", meetingData);
    setIsScheduleMeetingOpen(false);
    addNotification({
      type: "meeting_scheduled",
      title: "Meeting Scheduled",
      message: `Meeting with ${parent.firstName} ${parent.lastName} has been scheduled for ${meetingData.date} at ${meetingData.time}.`,
    });
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
    const updatedParent = { ...parent, ...updatedData };
    onParentUpdated?.(updatedParent);
    setIsEditContactOpen(false);
    addNotification({
      type: "success",
      title: "Contact Updated",
      message: `${parent.firstName} ${parent.lastName}'s contact information has been updated.`,
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  // Get children names
  const childrenNames = parent.children.map((child) => child.firstName).join(", ");
  const childrenCount = parent.children.length;

  // Navigate to chat page
  const handleOpenChat = () => {
    router.push(`/admin/parents/chat/${parent.id}`);
  };

  // Build custom actions array (icon buttons at bottom of card)
  const buildCustomActions = () => {
    return [
      {
        icon: Video,
        label: "Video Call",
        onClick: () => startVideoCall(parentParticipant, { callContext: `Video call with ${parent.firstName}` }),
      },
      {
        icon: Phone,
        label: "Voice Call",
        onClick: () => startVoiceCall(parentParticipant, { callContext: `Voice call with ${parent.firstName}` }),
      },
      {
        icon: MessageCircle,
        label: "Chat",
        onClick: handleOpenChat,
      },
      {
        icon: Mail,
        label: "Send Email",
        onClick: () => window.open(`mailto:${parent.email}`),
      },
    ];
  };

  // Build custom dropdown menu items - Quick actions for admin
  const buildCustomDropdownItems = () => {
    const items = [
      {
        icon: CalendarPlus,
        label: "Schedule Meeting",
        onClick: () => setIsScheduleMeetingOpen(true),
      },
      {
        icon: Receipt,
        label: "View Fee Statement",
        onClick: () => setIsFeeStatementOpen(true),
      },
      {
        icon: Banknote,
        label: "Record Payment",
        onClick: () => setIsRecordPaymentOpen(true),
      },
      {
        icon: UserCog,
        label: "Edit Contact Info",
        onClick: () => setIsEditContactOpen(true),
      },
    ];

    // Add disconnect children option if parent has children
    if (hasActiveChildren) {
      items.push({
        icon: UserMinus,
        label: "Disconnect Children",
        onClick: () => setIsDisconnectChildrenOpen(true),
      });
    }

    return items;
  };

  return (
    <>
      <ProfileCard
        id={parent.id}
        name={`${parent.firstName} ${parent.lastName}`}
        subtitle={parent.occupation || parent.relationship}
        status={parent.status}
        avatar={parent.profilePhoto}
        colorIndex={colorIndex}
        details={[
          { label: "Children", value: `${childrenCount} (${childrenNames})` },
          { label: "Phone", value: parent.phone },
          { label: "High Balance", value: formatCurrency(parent.totalOutstandingFees) },
          { label: "Relationship", value: parent.relationship },
        ]}
        primaryAction={{ label: "View Profile", onClick: () => handleView(parent.id) }}
        customActions={buildCustomActions()}
        customDropdownItems={buildCustomDropdownItems()}
        viewLabel="View Profile"
        showPromoteOption={false}
        showEditOption={false}
        isSelected={isSelected}
        onSelectionChange={onSelectionChange}
        onView={handleView}
        onDelete={handleDeleteClick}
      />

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleMeetingOpen}
        onClose={() => setIsScheduleMeetingOpen(false)}
        onSchedule={handleScheduleMeeting}
        context="parent"
        primaryParticipant={{
          id: parent.id,
          name: `${parent.firstName} ${parent.lastName}`,
          type: "parent",
          role: parent.relationship,
          email: parent.email,
          photo: parent.profilePhoto,
        }}
        children={parent.children.map((child) => ({
          id: child.id,
          name: `${child.firstName} ${child.lastName}`,
          classLevel: child.classLevel,
        }))}
      />

      {/* Quick Record Payment Modal */}
      <QuickRecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onSubmit={handleRecordPayment}
        parent={parent}
        currencySymbol={currencySymbol}
      />

      {/* Edit Contact Info Modal */}
      <EditParentContactModal
        isOpen={isEditContactOpen}
        onClose={() => setIsEditContactOpen(false)}
        onSave={handleUpdateContact}
        parent={parent}
      />

      {/* View Fee Statement Modal */}
      <ViewFeeStatementModal
        isOpen={isFeeStatementOpen}
        onClose={() => setIsFeeStatementOpen(false)}
        parent={parent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Parent"
        itemName={`${parent.firstName} ${parent.lastName}`}
        itemId={parent.id}
        warningMessage="This will permanently remove this parent and all associated data. This action cannot be undone."
        confirmButtonText="Delete Parent"
      />

      {/* Disconnect Children Modal */}
      <DisconnectChildrenModal
        isOpen={isDisconnectChildrenOpen}
        onClose={() => setIsDisconnectChildrenOpen(false)}
        onConfirm={handleDisconnectChildren}
        parent={parent}
      />

      {/* Cannot Delete Modal - shown when trying to delete parent with children */}
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
                {parent.firstName} {parent.lastName} is currently connected to {parent.children.length} {parent.children.length === 1 ? "child" : "children"} in the system.
              </p>
            </div>
          </div>

          {/* Connected Children List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Connected Children:
            </h4>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {parent.children.map((child) => (
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
    </>
  );
}
