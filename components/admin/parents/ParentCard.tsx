"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Phone, Mail, Video, CalendarPlus, FileText, Banknote, UserCog, UserMinus, AlertTriangle, GraduationCap, Send, CheckCircle2, Paperclip, XCircle, AlignLeft } from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormButton from "@/components/shared/FormButton";
import FormTextarea from "@/components/shared/FormTextarea";
import ProfileCard from "@/components/shared/ProfileCard";
import EmojiPickerPopover from "@/components/shared/EmojiPickerPopover";
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
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false);
  const [messageTab, setMessageTab] = useState<"chat" | "email">("chat");

  // Message form states
  const [chatMessage, setChatMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatAttachments, setChatAttachments] = useState<File[]>([]);
  const [emailAttachments, setEmailAttachments] = useState<File[]>([]);

  // Mock chat history
  const [chatHistory, setChatHistory] = useState([
    {
      id: "1",
      from: "parent" as const,
      message: "Hello, I wanted to ask about the upcoming parent-teacher meeting.",
      timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      read: true,
    },
    {
      id: "2",
      from: "admin" as const,
      message: "Hi! The parent-teacher meeting is scheduled for next Friday at 2 PM. Would you like to book a slot?",
      timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 1800000).toISOString(),
      read: true,
    },
    {
      id: "3",
      from: "parent" as const,
      message: "Yes, please. Can I get the 3 PM slot?",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: true,
    },
    {
      id: "4",
      from: "admin" as const,
      message: "Of course! I've booked the 3 PM slot for you. You'll receive a confirmation email shortly.",
      timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
      read: true,
    },
    {
      id: "5",
      from: "parent" as const,
      message: "Thank you so much! Also, could you please share the latest fee statement?",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: true,
    },
  ]);

  // Refs for emoji insertion and file inputs
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const emailFileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Format timestamp for chat messages
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

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

  // Open message modal
  const handleOpenMessage = (tab: "chat" | "email") => {
    setMessageTab(tab);
    setIsSendMessageOpen(true);
  };

  // Send chat message
  const handleSendChat = () => {
    if (!chatMessage.trim() && chatAttachments.length === 0) return;

    const attachmentText = chatAttachments.length > 0
      ? `📎 ${chatAttachments.length} attachment${chatAttachments.length > 1 ? "s" : ""}`
      : "";

    const newMessage = {
      id: `msg-${Date.now()}`,
      from: "admin" as const,
      message: chatMessage.trim() + (chatMessage.trim() && attachmentText ? "\n\n" : "") + attachmentText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage("");
    setChatAttachments([]);

    // Simulate parent typing response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory(prev => [...prev, {
          id: `msg-${Date.now()}`,
          from: "parent" as const,
          message: "Thank you for the quick response! I'll check it out.",
          timestamp: new Date().toISOString(),
          read: true,
        }]);
      }, 2000);
    }, 1000);
  };

  // Send email
  const handleSendEmail = () => {
    if (!emailMessage.trim() || !emailSubject.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      console.log("Email sent:", { to: parent.email, subject: emailSubject, message: emailMessage, attachments: emailAttachments.length });
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setEmailSubject("");
        setEmailMessage("");
        setEmailAttachments([]);
      }, 2000);
    }, 1500);
  };

  // Chat emoji handler
  const handleChatEmojiSelect = (emoji: string) => {
    const textarea = chatInputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = chatMessage.substring(0, start) + emoji + chatMessage.substring(end);
      setChatMessage(newMessage);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      }, 0);
    } else {
      setChatMessage(prev => prev + emoji);
    }
  };

  // Chat file handlers
  const handleChatFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setChatAttachments(prev => [...prev, ...files]);
    if (chatFileInputRef.current) chatFileInputRef.current.value = "";
  };

  const removeChatAttachment = (index: number) => {
    setChatAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Email file handlers
  const handleEmailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEmailAttachments(prev => [...prev, ...files]);
    if (emailFileInputRef.current) emailFileInputRef.current.value = "";
  };

  const removeEmailAttachment = (index: number) => {
    setEmailAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.startsWith("video/")) return "🎬";
    if (file.type.includes("pdf")) return "📄";
    return "📎";
  };

  // Email templates
  const emailTemplates = [
    { label: "Fee Reminder", subject: "Fee Payment Reminder", message: "Dear Parent,\n\nThis is a friendly reminder that your child's school fees are due. Please ensure timely payment to avoid any inconvenience.\n\nThank you for your cooperation." },
    { label: "Meeting Invite", subject: "Parent-Teacher Meeting", message: "Dear Parent,\n\nYou are cordially invited to attend the upcoming Parent-Teacher meeting scheduled for [DATE]. Your participation is important.\n\nWe look forward to seeing you." },
    { label: "General Update", subject: "School Update", message: "Dear Parent,\n\nWe hope this message finds you well. We would like to inform you about the following update:\n\n[DETAILS]\n\nPlease feel free to contact us." },
  ];

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
        onClick: () => handleOpenMessage("chat"),
      },
      {
        icon: Mail,
        label: "Send Email",
        onClick: () => handleOpenMessage("email"),
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
        icon: FileText,
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

      {/* Send Message Modal */}
      <Modal
        isOpen={isSendMessageOpen}
        onClose={() => {
          setIsSendMessageOpen(false);
          setChatMessage("");
          setEmailSubject("");
          setEmailMessage("");
          setChatAttachments([]);
          setEmailAttachments([]);
          setIsSent(false);
        }}
        title="Message Center"
        subtitle={`Conversation with ${parent.firstName} ${parent.lastName}`}
        icon={<MessageCircle className="w-5 h-5" />}
        maxWidth="xl"
      >
        <div className="flex flex-col h-[450px]">
          {/* Header with recipient info */}
          <div className="flex-shrink-0 mb-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="relative">
                {parent.profilePhoto ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={parent.profilePhoto} alt={`${parent.firstName} ${parent.lastName}`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{parent.firstName.charAt(0)}{parent.lastName.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{parent.firstName} {parent.lastName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{parent.email} • {parent.phone}</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                Online
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1.5 rounded-2xl bg-gray-100/80 dark:bg-gray-800/50 mb-4">
            <button
              onClick={() => setMessageTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                messageTab === "chat"
                  ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                {chatHistory.length}
              </span>
            </button>
            <button
              onClick={() => setMessageTab("email")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                messageTab === "email"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Chat Tab */}
            {messageTab === "chat" && (
              <div className="h-full flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto px-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {chatHistory.map((msg, index) => {
                    const isAdmin = msg.from === "admin";
                    const showDate = index === 0 ||
                      new Date(msg.timestamp).toDateString() !== new Date(chatHistory[index - 1].timestamp).toDateString();

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex items-center justify-center my-4">
                            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
                              {new Date(msg.timestamp).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                          <div className={`flex items-end gap-2 max-w-[75%] ${isAdmin ? "flex-row-reverse" : ""}`}>
                            {!isAdmin && (
                              parent.profilePhoto ? (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                                  <img src={parent.profilePhoto} alt={`${parent.firstName} ${parent.lastName}`} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">{parent.firstName.charAt(0)}</span>
                                </div>
                              )
                            )}
                            <div className={`group relative ${isAdmin ? "items-end" : "items-start"}`}>
                              <div
                                className={`px-4 py-2.5 rounded-2xl ${
                                  isAdmin
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md"
                                }`}
                              >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              </div>
                              <div className={`flex items-center gap-1.5 mt-1 ${isAdmin ? "justify-end" : "justify-start"}`}>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatTime(msg.timestamp)}</span>
                                {isAdmin && (
                                  <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-end gap-2">
                        {parent.profilePhoto ? (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                            <img src={parent.profilePhoto} alt={`${parent.firstName}`} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{parent.firstName.charAt(0)}</span>
                          </div>
                        )}
                        <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-bl-md">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex-shrink-0 pt-3 border-t border-gray-200 dark:border-gray-700 mt-3 relative overflow-visible">
                  {/* Chat Attachments Preview */}
                  {chatAttachments.length > 0 && (
                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      {chatAttachments.map((file, index) => (
                        <div key={index} className="relative flex-shrink-0 group">
                          {file.type.startsWith("image/") ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-1">
                              <span className="text-lg">{getFileIcon(file)}</span>
                              <span className="text-[8px] text-gray-500 truncate w-full text-center">{file.name.slice(0, 8)}...</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeChatAttachment(index)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <textarea
                        ref={chatInputRef}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChat();
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 pr-20 rounded-2xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500/50 resize-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                        style={{ minHeight: "48px", maxHeight: "120px" }}
                      />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <EmojiPickerPopover
                        onEmojiSelect={handleChatEmojiSelect}
                        position="top-right"
                        buttonClassName="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        pickerWidth={320}
                        pickerHeight={350}
                      />
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <input
                        ref={chatFileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                        onChange={handleChatFileSelect}
                        className="hidden"
                      />
                    </div>
                    <button
                      onClick={handleSendChat}
                      disabled={!chatMessage.trim() && chatAttachments.length === 0}
                      className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/25"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Tab */}
            {messageTab === "email" && (
              <div className="h-full flex flex-col">
                {isSent ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email Sent</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivered to {parent.email}</p>
                  </div>
                ) : (
                  <>
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                      {/* Templates */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Templates</p>
                        <div className="flex gap-2 flex-wrap">
                          {emailTemplates.map((template) => (
                            <button
                              key={template.label}
                              onClick={() => {
                                setEmailSubject(template.subject);
                                setEmailMessage(template.message);
                              }}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                                emailSubject === template.subject
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                            >
                              {template.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* To Field */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">To</label>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          {parent.profilePhoto ? (
                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                              <img src={parent.profilePhoto} alt={`${parent.firstName}`} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-white">{parent.firstName.charAt(0)}</span>
                            </div>
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300">{parent.firstName} {parent.lastName}</span>
                          <span className="text-xs text-gray-400 ml-auto">{parent.email}</span>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                          Subject <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="What's this email about?"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <FormTextarea
                          label="Message"
                          icon={<AlignLeft className="w-full h-full" />}
                          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                          iconColor="text-blue-600 dark:text-blue-400"
                          value={emailMessage}
                          onChange={setEmailMessage}
                          placeholder="Write your message..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="flex-shrink-0 pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                      {/* Emoji and Attachment buttons */}
                      <div className="flex items-center gap-1 mb-3">
                        <EmojiPickerPopover
                          onEmojiSelect={(emoji) => setEmailMessage(prev => prev + emoji)}
                          position="top"
                          buttonClassName="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          pickerWidth={320}
                          pickerHeight={350}
                        />
                        <button
                          type="button"
                          onClick={() => emailFileInputRef.current?.click()}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <input
                          ref={emailFileInputRef}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleEmailFileSelect}
                          className="hidden"
                        />
                      </div>

                      {/* Email Attachments */}
                      {emailAttachments.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Attachments ({emailAttachments.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {emailAttachments.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <span>{getFileIcon(file)}</span>
                                <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{file.name}</span>
                                <span className="text-[10px] text-gray-400">{formatFileSize(file.size)}</span>
                                <button
                                  type="button"
                                  onClick={() => removeEmailAttachment(index)}
                                  className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Send Button */}
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEmailSubject("");
                            setEmailMessage("");
                            setEmailAttachments([]);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleSendEmail}
                          disabled={!emailSubject.trim() || !emailMessage.trim() || isSending}
                          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
                        >
                          {isSending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Email</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
