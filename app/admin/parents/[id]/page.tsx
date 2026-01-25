"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import jsPDF from "jspdf";
import MainLayout from "@/components/layout/MainLayout";
import PageLoader from "@/components/shared/PageLoader";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import ActionButton from "@/components/shared/ActionButton";
import SecondaryButton from "@/components/shared/SecondaryButton";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import MobileDropdown from "@/components/shared/MobileDropdown";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  getParentById,
  getFeeRecordsByParentId,
  getPaymentsByParentId,
  getCommunicationsByParentId,
  getEventAttendanceByParentId,
  getLibraryPaymentsByParentId,
  getLeaveRequestsByParentId,
  getMeetingsByParentId,
  type AdminParent,
  type AdminFeeRecord,
  type PaymentRecord,
  type CommunicationRecord,
  type ParentEventAttendance,
  type LibraryPayment,
  type LeaveRequest,
  type ParentTeacherMeeting,
} from "@/lib/mockParents";
import { getAllStudents } from "@/lib/mockStudents";
import type { ParentChild } from "@/types/parent";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Edit,
  Trash2,
  GraduationCap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  FileText,
  Eye,
  Heart,
  KeyRound,
  Home,
  Building2,
  CreditCard,
  Calendar,
  BookOpen,
  CalendarCheck,
  CalendarX,
  Users,
  XCircle,
  Percent,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  User,
  Search,
  UserPlus,
  ChevronRight,
  Award,
  Video,
  Mic,
  MoreVertical,
  Receipt,
  Banknote,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  History,
  ExternalLink,
  Wallet,
  BadgeCheck,
} from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import FormButton from "@/components/shared/FormButton";
import FormTextarea from "@/components/shared/FormTextarea";
import ScheduleMeetingModal, { ScheduledMeetingData, MeetingChildReference } from "@/components/shared/ScheduleMeetingModal";
import CustomDropdown from "@/components/shared/CustomDropdown";
import MeetingDetailsModal, { MeetingDetails, CancelMeetingData, RescheduleMeetingData, AdditionalParticipant } from "@/components/shared/MeetingDetailsModal";
import ChildLeaveRequestDetailsModal from "@/components/shared/ChildLeaveRequestDetailsModal";
import { useMeetings, Meeting as ContextMeeting } from "@/contexts/MeetingsContext";
import { useCall } from "@/hooks/useCall";

// Tab type definition for parent detail page
type ParentTabType = "details" | "meetings" | "leave" | "fees" | "support" | "events";

export default function AdminParentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const parentId = params.id as string;
  const isLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();

  const [parent, setParent] = useState<AdminParent | null>(null);
  const [feeRecords, setFeeRecords] = useState<AdminFeeRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [communications, setCommunications] = useState<CommunicationRecord[]>([]);
  const [eventAttendance, setEventAttendance] = useState<ParentEventAttendance[]>([]);
  const [libraryPayments, setLibraryPayments] = useState<LibraryPayment[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [mockMeetings, setMockMeetings] = useState<ParentTeacherMeeting[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Use the meetings context for shared state across portals
  const { meetings: contextMeetings, addMeeting, getMeetingsByParent } = useMeetings();

  // Use the call hook for WebRTC calls
  const { startVideoCall, startVoiceCall, startChat, startCall } = useCall();

  const searchParams = useSearchParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ParentTabType>("details");
  const [isLinkChildModalOpen, setIsLinkChildModalOpen] = useState(false);

  // Read tab from URL search params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["details", "meetings", "leave", "fees", "communications", "events"].includes(tabParam)) {
      setActiveTab(tabParam as ParentTabType);
    }
  }, [searchParams]);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isExtendDueDateModalOpen, setIsExtendDueDateModalOpen] = useState(false);
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] = useState(false);

  // Fee management state
  const [selectedFeeRecord, setSelectedFeeRecord] = useState<AdminFeeRecord | null>(null);
  const [isFeeDetailsModalOpen, setIsFeeDetailsModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Currency formatter
  const currencyCode = settings.currency || "NGN";
  const money = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });
    return (amount: number) => formatter.format(amount);
  }, [currencyCode]);

  useEffect(() => {
    if (parentId) {
      try {
        const parentData = getParentById(parentId);
        if (parentData) {
          setParent(parentData);
          setFeeRecords(getFeeRecordsByParentId(parentId));
          setPayments(getPaymentsByParentId(parentId));
          setCommunications(getCommunicationsByParentId(parentId));
          setEventAttendance(getEventAttendanceByParentId(parentId));
          setLibraryPayments(getLibraryPaymentsByParentId(parentId));
          setLeaveRequests(getLeaveRequestsByParentId(parentId));
          setMockMeetings(getMeetingsByParentId(parentId));
        } else {
          router.push("/admin/parents");
        }
      } catch (error) {
        console.error("Error loading parent data:", error);
        router.push("/admin/parents");
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [parentId, router]);

  // Calculate fee stats for this parent
  const feeStats = useMemo(() => {
    if (!feeRecords.length) return { total: 0, paid: 0, outstanding: 0, overdue: 0 };
    const total = feeRecords.reduce((acc, r) => acc + r.amount, 0);
    const paid = feeRecords.reduce((acc, r) => acc + r.paidAmount, 0);
    const outstanding = feeRecords.reduce((acc, r) => acc + r.balance, 0);
    const overdue = feeRecords.filter((r) => r.status === "overdue").length;
    return { total, paid, outstanding, overdue };
  }, [feeRecords]);

  const handleDeleteParent = () => {
    console.log("Deleting parent:", parentId);
    router.push("/admin/parents");
  };

  // Get meetings from context for this parent (must be before early return to follow hooks rules)
  const parentContextMeetings = useMemo(() => {
    if (!parent) return [];
    return getMeetingsByParent(parent.id);
  }, [contextMeetings, getMeetingsByParent, parent]);

  // Convert context meetings to ParentTeacherMeeting format and combine with mock meetings
  const meetings: ParentTeacherMeeting[] = useMemo(() => {
    // Convert context meetings to local format
    const convertedContextMeetings: ParentTeacherMeeting[] = parentContextMeetings.map((m) => ({
      id: m.id,
      parentId: m.parentId,
      childId: m.childId || "",
      childName: m.childName || "",
      childClass: m.childClass || "",
      teacherName: m.teacherName,
      teacherRole: m.teacherRole || "",
      meetingType: m.meetingType,
      customMeetingType: m.customMeetingType,
      meetingFormat: m.meetingFormat,
      virtualType: m.virtualType,
      meetingLink: m.meetingLink,
      subject: m.title,
      date: m.scheduledDate,
      time: m.scheduledTime,
      duration: m.duration,
      status: m.status === "scheduled" || m.status === "pending_approval" ? "upcoming" : m.status === "in-progress" ? "in-progress" : m.status,
      location: m.location,
      notes: m.notes,
      outcome: m.outcome,
    }));

    // Combine with mock meetings, avoiding duplicates by ID
    const contextIds = new Set(convertedContextMeetings.map((m) => m.id));
    const uniqueMockMeetings = mockMeetings.filter((m) => !contextIds.has(m.id));

    return [...convertedContextMeetings, ...uniqueMockMeetings];
  }, [parentContextMeetings, mockMeetings]);

  if (isLoading || isLoadingData || !parent) {
    return (
      <MainLayout>
        <PageLoader isLoading={true} loadingText="Loading Parent Details" />
      </MainLayout>
    );
  }

  const fullName = `${parent.firstName} ${parent.lastName}`;

  // Create participant object for WebRTC calls
  const parentParticipant = {
    id: parent.id,
    name: fullName,
    avatar: parent.profilePhoto,
    role: parent.relationship,
    phone: parent.phone,
    email: parent.email,
  };

  // Handle starting a WebRTC call with the parent
  const handleStartCall = (callType: "video" | "voice" | "chat") => {
    const callContext = `Call with ${fullName}`;
    if (callType === "video") {
      startVideoCall(parentParticipant, { callContext });
    } else if (callType === "voice") {
      startVoiceCall(parentParticipant, { callContext });
    } else {
      startChat(parentParticipant, { callContext });
    }
  };

  // Handle scheduling a new meeting
  const handleScheduleMeeting = (meetingData: ScheduledMeetingData) => {
    // Add meeting via context for shared state across portals
    addMeeting({
      title: meetingData.subject,
      description: meetingData.notes,
      meetingType: meetingData.meetingType === "custom" ? "scheduled" : meetingData.meetingType,
      customMeetingType: meetingData.customMeetingType,
      meetingFormat: meetingData.meetingFormat,
      virtualType: meetingData.virtualType,
      scheduledDate: meetingData.date,
      scheduledTime: meetingData.time,
      duration: meetingData.duration,
      location: meetingData.location,
      meetingLink: meetingData.meetingLink,
      parentId: parent.id,
      parentName: fullName,
      childId: meetingData.childId || parent.children[0]?.id || "",
      childName: meetingData.childName || parent.children[0]?.fullName || "",
      childClass: meetingData.childClass || parent.children[0]?.classLevel || "",
      teacherId: meetingData.teacherId || "",
      teacherName: meetingData.teacherName || "",
      teacherRole: meetingData.teacherRole,
      requestedBy: "admin",
      requestedByName: "Admin",
      notes: meetingData.notes,
    });

    // Show success feedback (you could use a toast notification here)
    console.log("Meeting scheduled successfully via context");
  };

  // Prepare children data for the meeting modal
  const meetingChildrenData: MeetingChildReference[] = parent.children.map((child) => ({
    id: child.id,
    name: child.fullName,
    classLevel: child.classLevel,
  }));

  // Define tabs for parent detail page
  const tabs = [
    { id: "details" as ParentTabType, label: "Parent Details", icon: User },
    { id: "meetings" as ParentTabType, label: "Meetings", icon: Users },
    { id: "leave" as ParentTabType, label: "Leave Requests", icon: CalendarX },
    { id: "fees" as ParentTabType, label: "Fees & Payments", icon: CreditCard },
    { id: "support" as ParentTabType, label: "Support Tickets", icon: MessageSquare },
    { id: "events" as ParentTabType, label: "Events & Library", icon: CalendarCheck },
  ];

  return (
    <MainLayout>
      <PageLoader isLoading={isLoading} loadingText="Loading Parent Details" />

      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="mb-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
                Parent Details
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 flex-wrap">
                <a href="/" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                  Dashboard
                </a>
                <span>/</span>
                <a href="/admin/parents" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                  Parents
                </a>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">
                  Parent Details
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Primary Actions */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <ActionButton
                  icon={Edit}
                  onClick={() => router.push(`/admin/parents/edit/${parentId}`)}
                >
                  Edit Parent
                </ActionButton>
                <SecondaryButton
                  label="Send Message"
                  icon={MessageSquare}
                  onClick={() => console.log("Send message")}
                />
                <SecondaryButton
                  label="Login Details"
                  icon={KeyRound}
                  onClick={() => console.log("Login details")}
                />
              </div>

              {/* Destructive Action - Separated */}
              <div className="w-full sm:w-auto sm:ml-auto">
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 border border-red-200 dark:border-red-800 midnight:border-red-700 purple:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 midnight:hover:bg-red-900/30 purple:hover:bg-red-900/30 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Parent</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-6 items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <ParentSidebar
              parent={parent}
              fullName={fullName}
              feeStats={feeStats}
              money={money}
              onStartCall={handleStartCall}
            />
          </div>

          {/* Main Content with Tabs */}
          <div className="flex-1 min-w-0 w-full flex flex-col">
            {/* Tabs Navigation */}
            <ParentTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Tab Content */}
            <div className="mt-2 lg:mt-6 space-y-4">
              {activeTab === "details" && (
                <>
                  <ChildrenSection
                    parent={parent}
                    onLinkChild={() => setIsLinkChildModalOpen(true)}
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <AddressCard parent={parent} />
                    <FeeActionsCard
                      onGiveDiscount={() => setIsDiscountModalOpen(true)}
                      onExtendDueDate={() => setIsExtendDueDateModalOpen(true)}
                    />
                  </div>
                </>
              )}

              {activeTab === "meetings" && (
                <MeetingsSection meetings={meetings} onScheduleMeeting={() => setIsScheduleMeetingModalOpen(true)} />
              )}

              {activeTab === "leave" && (
                <LeaveRequestsSection leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} />
              )}

              {activeTab === "fees" && (
                <>
                  <FeesSection
                    feeRecords={feeRecords}
                    money={money}
                    onViewDetails={(record) => {
                      setSelectedFeeRecord(record);
                      setIsFeeDetailsModalOpen(true);
                    }}
                    onApprovePayment={(record) => {
                      setSelectedFeeRecord(record);
                      setIsRecordPaymentModalOpen(true);
                    }}
                    onGiveDiscount={(record) => {
                      setSelectedFeeRecord(record);
                      setIsDiscountModalOpen(true);
                    }}
                    onExtendDueDate={(record) => {
                      setSelectedFeeRecord(record);
                      setIsExtendDueDateModalOpen(true);
                    }}
                  />
                  <PaymentHistorySection
                    payments={payments}
                    money={money}
                    feeRecords={feeRecords}
                    onViewPaymentDetails={(payment) => {
                      setSelectedPayment(payment);
                      setIsPaymentDetailsModalOpen(true);
                    }}
                    currencyCode={settings.currency || "NGN"}
                    schoolName={settings.schoolName || "School"}
                    parentName={`${parent.firstName} ${parent.lastName}`}
                  />
                </>
              )}

              {activeTab === "support" && (
                <SupportTicketsSection
                  communications={communications}
                  setCommunications={setCommunications}
                  parentName={`${parent.firstName} ${parent.lastName}`}
                />
              )}

              {activeTab === "events" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <EventAttendanceSection eventAttendance={eventAttendance} />
                  <LibraryPaymentsSection libraryPayments={libraryPayments} money={money} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteParent}
        title="Delete Parent"
        itemName={fullName}
        itemId={parentId}
        warningMessage="This will permanently remove this parent and all associated data. This action cannot be undone."
        confirmButtonText="Delete Parent"
      />

      {/* Link Child Modal */}
      <LinkChildModal
        isOpen={isLinkChildModalOpen}
        onClose={() => setIsLinkChildModalOpen(false)}
        parentId={parentId}
        parentName={fullName}
        existingChildIds={parent.children.map((c) => c.id)}
        onChildLinked={(newChild) => {
          // Update the parent state with the new child
          setParent((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              children: [...prev.children, newChild],
            };
          });
        }}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        parentName={fullName}
        parentEmail={parent.email}
      />

      {/* Give Discount Modal */}
      <GiveDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        parentName={fullName}
        feeRecords={feeRecords}
        money={money}
      />

      {/* Extend Due Date Modal */}
      <ExtendDueDateModal
        isOpen={isExtendDueDateModalOpen}
        onClose={() => setIsExtendDueDateModalOpen(false)}
        parentName={fullName}
        feeRecords={feeRecords}
        money={money}
      />

      {/* Fee Record Details Modal */}
      <FeeRecordDetailsModal
        isOpen={isFeeDetailsModalOpen}
        onClose={() => {
          setIsFeeDetailsModalOpen(false);
          setSelectedFeeRecord(null);
        }}
        feeRecord={selectedFeeRecord}
        money={money}
        onRecordPayment={() => setIsRecordPaymentModalOpen(true)}
        onGiveDiscount={() => setIsDiscountModalOpen(true)}
        onExtendDueDate={() => setIsExtendDueDateModalOpen(true)}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => {
          setIsRecordPaymentModalOpen(false);
          setSelectedFeeRecord(null);
        }}
        feeRecord={selectedFeeRecord}
        money={money}
      />

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={isPaymentDetailsModalOpen}
        onClose={() => {
          setIsPaymentDetailsModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        money={money}
        currencyCode={settings.currency || "NGN"}
        schoolName={settings.schoolName || "School"}
      />

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleMeetingModalOpen}
        onClose={() => setIsScheduleMeetingModalOpen(false)}
        onSchedule={handleScheduleMeeting}
        context="parent"
        primaryParticipant={{
          id: parent.id,
          name: fullName,
          type: "parent",
          role: parent.relationship,
          email: parent.email,
          photo: parent.profilePhoto,
        }}
        children={meetingChildrenData}
      />
    </MainLayout>
  );
}

// Parent Sidebar Component
function ParentSidebar({
  parent,
  fullName,
  feeStats,
  money,
  onStartCall,
}: {
  parent: AdminParent;
  fullName: string;
  feeStats: { total: number; paid: number; outstanding: number; overdue: number };
  money: (amount: number) => string;
  onStartCall: (callType: "video" | "voice" | "chat") => void;
}) {
  return (
    <div className="flex flex-col">
      {/* Parent Profile Card */}
      <div className="mb-3 sm:mb-4">
        <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
          {/* Profile Header with gradient background */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-gray-800/40 dark:to-gray-900/40 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 p-3 sm:p-6 pb-4 sm:pb-8">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 dark:bg-blue-400/5 midnight:bg-cyan-400/5 purple:bg-pink-400/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/5 dark:bg-indigo-400/5 midnight:bg-blue-400/5 purple:bg-purple-400/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative flex items-center gap-2 sm:gap-3">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                {parent.profilePhoto ? (
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden ring-2 ring-white/50 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg">
                    <Image
                      src={parent.profilePhoto}
                      alt={fullName}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center ring-2 ring-white/50 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg">
                    <span className="text-lg sm:text-2xl font-bold text-white">
                      {parent.firstName.charAt(0)}{parent.lastName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Details */}
              <div className="flex flex-col justify-center gap-0.5 sm:gap-1 flex-1 min-w-0">
                {/* Badges Row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-1 w-fit px-1.5 sm:px-2 py-0.5 rounded-md border shadow-sm ${
                    parent.status === "Active"
                      ? "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 border-green-300/60 dark:border-green-700/50 midnight:border-green-600/50 purple:border-green-600/50"
                      : "bg-gray-100 dark:bg-gray-800/30 border-gray-300/60 dark:border-gray-600/50"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${parent.status === "Active" ? "bg-green-500 dark:bg-green-400 animate-pulse" : "bg-gray-400"}`}></div>
                    <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide ${
                      parent.status === "Active"
                        ? "text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {parent.status}
                    </span>
                  </div>

                  {/* Relationship Badge */}
                  <div className="inline-flex items-center gap-1 w-fit px-1.5 sm:px-2 py-0.5 rounded-md border shadow-sm bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 border-purple-300/60 dark:border-purple-700/50">
                    <Heart className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                    <span className="text-[9px] sm:text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                      {parent.relationship}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-xs sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 tracking-tight truncate leading-tight">
                  {fullName}
                </h2>

                {/* Parent ID */}
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 tracking-wide truncate">
                  {parent.id}
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="p-3 sm:p-6 pt-0 mt-3 sm:mt-6">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2 sm:mb-4 uppercase tracking-wider">
              Basic Information
            </h3>
            <div className="space-y-1.5 sm:space-y-3">
              {/* Children Count */}
              <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Children</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{parent.children.length}</span>
              </div>

              {/* Occupation */}
              {parent.occupation && (
                <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Occupation</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{parent.occupation}</span>
                </div>
              )}

              {/* Joined Date */}
              <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Joined</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {new Date(parent.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              {/* Outstanding Fees */}
              <div className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">Outstanding</span>
                <span className={`text-xs sm:text-sm font-bold ${feeStats.outstanding > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                  {money(feeStats.outstanding)}
                </span>
              </div>
            </div>
          </div>

          {/* Send Message Button */}
          <div className="p-3 sm:p-6 pt-0">
            <button
              onClick={() => console.log("Send message")}
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Primary Contact Info */}
      <div className="mb-3 sm:mb-4">
        <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 p-2.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2 sm:mb-3 uppercase tracking-wider">
            Primary Contact Info
          </h3>

          <div className="space-y-1.5 sm:space-y-2">
            {/* Phone */}
            <a
              href={`tel:${parent.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 sm:gap-2.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-blue-900/20 midnight:to-cyan-900/20 purple:from-blue-900/20 purple:to-purple-900/20 hover:from-blue-100 hover:to-indigo-100/40 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 cursor-pointer group border border-blue-100/50 dark:border-blue-800/30 midnight:border-blue-800/30 purple:border-blue-800/30 hover:border-blue-200/70 dark:hover:border-blue-700/50"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-900/40 midnight:bg-blue-900/40 purple:bg-blue-900/40 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 group-hover:scale-110 transition-all duration-200 shadow-sm">
                <Phone className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-0.5 uppercase tracking-wide">
                  Phone Number
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
                  {parent.phone}
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${parent.email}`}
              className="flex items-center gap-2 sm:gap-2.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-50 to-violet-50/30 dark:from-purple-900/20 dark:to-violet-900/20 midnight:from-purple-900/20 midnight:to-pink-900/20 purple:from-purple-900/20 purple:to-pink-900/20 hover:from-purple-100 hover:to-violet-100/40 dark:hover:from-purple-900/30 dark:hover:to-violet-900/30 transition-all duration-200 cursor-pointer group border border-purple-100/50 dark:border-purple-800/30 midnight:border-purple-800/30 purple:border-purple-800/30 hover:border-purple-200/70 dark:hover:border-purple-700/50"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-purple-100 dark:bg-purple-900/40 midnight:bg-purple-900/40 purple:bg-purple-900/40 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 group-hover:scale-110 transition-all duration-200 shadow-sm">
                <Mail className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-0.5 uppercase tracking-wide">
                  Email Address
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 midnight:group-hover:text-purple-400 purple:group-hover:text-pink-400 transition-colors">
                  {parent.email}
                </div>
              </div>
            </a>

            {/* Quick Communication Buttons */}
            <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Quick Communication
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStartCall("video");
                  }}
                  className="flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-semibold">Video</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStartCall("voice");
                  }}
                  className="flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-semibold">Voice</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStartCall("chat");
                  }}
                  className="flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-semibold">Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Summary Card */}
      <div className="mb-3 sm:mb-4">
        <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 p-2.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2 sm:mb-3 uppercase tracking-wider">
            Fee Summary
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Total</p>
              <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{money(feeStats.total)}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 border border-green-100/50 dark:border-green-800/30 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Paid</p>
              <p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400">{money(feeStats.paid)}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 border border-red-100/50 dark:border-red-800/30 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Outstanding</p>
              <p className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400">{money(feeStats.outstanding)}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border border-amber-100/50 dark:border-amber-800/30 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Overdue</p>
              <p className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">{feeStats.overdue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Parent Tabs Component
function ParentTabs({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: { id: ParentTabType; label: string; icon: any }[];
  activeTab: ParentTabType;
  setActiveTab: (tab: ParentTabType) => void;
}) {
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveIcon = activeTabData?.icon;

  return (
    <>
      {/* Mobile Dropdown Selector */}
      <div className="md:hidden mb-3">
        <MobileDropdown
          value={activeTab}
          options={tabs.map((tab) => ({
            label: tab.label,
            value: tab.id,
          }))}
          onChange={(value) => setActiveTab(value as ParentTabType)}
          icon={ActiveIcon && <ActiveIcon className="w-5 h-5" />}
        />
      </div>

      {/* Desktop Horizontal Tabs */}
      <div className="hidden md:block relative bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-[#1a1d23]/30 dark:to-[#14161b]/50 midnight:from-[#0f1729]/30 midnight:to-[#0a0f1c]/50 purple:from-[#2a1a3e]/30 purple:to-[#1f1330]/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/30 dark:border-gray-800/30 midnight:border-cyan-500/10 purple:border-pink-500/10 p-1.5 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5 midnight:from-cyan-400/5 midnight:via-blue-400/5 midnight:to-cyan-400/5 purple:from-pink-400/5 purple:via-purple-400/5 purple:to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative flex gap-1.5 min-w-max lg:min-w-0">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
                className={`relative flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ease-out whitespace-nowrap group overflow-hidden ${
                  isActive
                    ? "bg-blue-50/80 dark:bg-blue-950/20 midnight:bg-cyan-950/20 purple:bg-pink-950/20 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 shadow-sm border border-blue-100/50 dark:border-blue-900/30 midnight:border-cyan-900/30 purple:border-pink-900/30"
                    : "text-gray-700 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:bg-white/40 dark:hover:bg-gray-800/30 midnight:hover:bg-gray-800/30 purple:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200 midnight:hover:text-cyan-200 purple:hover:text-pink-200 hover:shadow-sm"
                } cursor-pointer active:scale-95 animate-fadeIn`}
              >
                {/* Shine effect on active tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                {/* Hover glow effect for inactive tabs */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-xl" />
                )}

                <Icon className={`relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                    : "text-gray-600 dark:text-gray-500 midnight:text-cyan-300/70 purple:text-pink-300/70 group-hover:scale-110 group-hover:rotate-6"
                }`} />
                <span className={`relative text-[11.75px] sm:text-xs font-semibold transition-all duration-300 ${
                  isActive ? "tracking-wide" : "group-hover:tracking-wide"
                }`}>
                  {tab.label}
                </span>

                {/* Active indicator dot - subtle */}
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 midnight:bg-cyan-400 purple:bg-pink-400 rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// Children Section - Redesigned with better cards
function ChildrenSection({
  parent,
  onLinkChild,
}: {
  parent: AdminParent;
  onLinkChild: () => void;
}) {
  const [showAllChildren, setShowAllChildren] = useState(false);
  const childCount = parent.children.length;

  // Single Child - Modern Centered Card
  const SingleChildCard = ({ child }: { child: AdminParent["children"][0] }) => (
    <div className="flex justify-center">
      <Link
        href={`/students/${child.id}?from=parent&parentId=${parent.id}&parentName=${encodeURIComponent(`${parent.firstName} ${parent.lastName}`)}`}
        className="group block"
      >
        <div className="relative rounded-xl border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800/40 midnight:bg-gray-900/40 purple:bg-gray-900/40 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 p-4">
          {/* Avatar with status indicator */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700">
                <Image
                  src={`https://i.pravatar.cc/150?u=${child.id}`}
                  alt={child.fullName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {/* Status dot */}
              <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center ${
                child.status === "Active" ? "bg-emerald-500" : "bg-gray-400"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${child.status === "Active" ? "animate-pulse" : ""}`} />
              </span>
            </div>
          </div>

          {/* Name */}
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {child.fullName}
          </h4>

          {/* Class & ID inline */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">
              {child.classLevel}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {child.id}
            </span>
          </div>

          {/* Action */}
          <div className="mt-3 flex justify-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
              View profile
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );

  // Two Children - Modern Side by Side Cards
  const TwoChildrenCard = ({ child }: { child: AdminParent["children"][0] }) => (
    <Link
      href={`/students/${child.id}?from=parent&parentId=${parent.id}&parentName=${encodeURIComponent(`${parent.firstName} ${parent.lastName}`)}`}
      className="group block"
    >
      <div className="relative rounded-xl border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800/40 midnight:bg-gray-900/40 purple:bg-gray-900/40 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 p-4 h-full">
        {/* Avatar with status indicator */}
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700">
              <Image
                src={`https://i.pravatar.cc/150?u=${child.id}`}
                alt={child.fullName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {/* Status dot */}
            <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center ${
              child.status === "Active" ? "bg-emerald-500" : "bg-gray-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-white ${child.status === "Active" ? "animate-pulse" : ""}`} />
            </span>
          </div>
        </div>

        {/* Name */}
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {child.fullName}
        </h4>

        {/* Class & ID inline */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">
            {child.classLevel}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {child.id}
          </span>
        </div>

        {/* Action */}
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            View profile
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );

  // Modern Compact Card for 3+ Children
  const CompactChildCard = ({ child }: { child: AdminParent["children"][0] }) => (
    <Link
      href={`/students/${child.id}?from=parent&parentId=${parent.id}&parentName=${encodeURIComponent(`${parent.firstName} ${parent.lastName}`)}`}
      className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/60 dark:bg-gray-800/20 midnight:bg-gray-900/20 purple:bg-gray-900/20 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 midnight:hover:bg-gray-800/30 purple:hover:bg-gray-800/30 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
    >
      {/* Profile Image */}
      <div className="relative flex-shrink-0">
        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={`https://i.pravatar.cc/150?u=${child.id}`}
            alt={child.fullName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 ${
          child.status === "Active" ? "bg-emerald-500" : "bg-gray-400"
        }`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {child.fullName}
        </h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{child.classLevel}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{child.id}</span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );

  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Children
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {childCount} {childCount === 1 ? "child" : "children"} linked to this parent
              </p>
            </div>
          </div>
          <button
            onClick={onLinkChild}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30 rounded-lg transition-all cursor-pointer group"
          >
            <UserPlus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Link Child
          </button>
        </div>

        {/* Children Display - Adaptive Layout */}
        {childCount === 0 ? (
          // Empty State - Subtle Design
          <div className="text-center py-8 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-700/50">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-3">
              <GraduationCap className="w-7 h-7 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No children linked yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Link a student to this parent account</p>
            <button
              onClick={onLinkChild}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Link a Child
            </button>
          </div>
        ) : childCount === 1 ? (
          // Single Child - Featured Layout (Centered)
          <SingleChildCard child={parent.children[0]} />
        ) : childCount === 2 ? (
          // Two Children - Side by Side
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parent.children.map((child) => (
              <TwoChildrenCard key={child.id} child={child} />
            ))}
          </div>
        ) : (
          // Three or More Children - Modern Compact Grid
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(showAllChildren ? parent.children : parent.children.slice(0, 4)).map((child) => (
                <CompactChildCard key={child.id} child={child} />
              ))}
            </div>

            {/* Show More/Less Button - Subtle */}
            {childCount > 4 && (
              <button
                onClick={() => setShowAllChildren(!showAllChildren)}
                className="w-full py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {showAllChildren ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    Show {childCount - 4} More
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Fees Section - Enhanced with child filter, due date, and row actions
function FeesSection({
  feeRecords,
  money,
  onViewDetails,
  onApprovePayment,
  onGiveDiscount,
  onExtendDueDate,
}: {
  feeRecords: AdminFeeRecord[];
  money: (amount: number) => string;
  onViewDetails?: (record: AdminFeeRecord) => void;
  onApprovePayment?: (record: AdminFeeRecord) => void;
  onGiveDiscount?: (record: AdminFeeRecord) => void;
  onExtendDueDate?: (record: AdminFeeRecord) => void;
}) {
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Get unique children for filter
  const children = useMemo(() => {
    const uniqueChildren = new Map<string, { id: string; name: string; class: string }>();
    feeRecords.forEach((record) => {
      if (!uniqueChildren.has(record.childId)) {
        uniqueChildren.set(record.childId, {
          id: record.childId,
          name: record.childName,
          class: record.childClass,
        });
      }
    });
    return Array.from(uniqueChildren.values());
  }, [feeRecords]);

  // Filter records based on selected child and status
  const filteredRecords = useMemo(() => {
    return feeRecords.filter((record) => {
      const childMatch = selectedChild === "all" || record.childId === selectedChild;
      const statusMatch = selectedStatus === "all" || record.status === selectedStatus;
      return childMatch && statusMatch;
    });
  }, [feeRecords, selectedChild, selectedStatus]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const records = selectedChild === "all" ? feeRecords : feeRecords.filter((r) => r.childId === selectedChild);
    return {
      total: records.reduce((sum, r) => sum + r.amount, 0),
      paid: records.reduce((sum, r) => sum + r.paidAmount, 0),
      outstanding: records.reduce((sum, r) => sum + r.balance, 0),
      overdue: records.filter((r) => r.status === "overdue").length,
      pending: records.filter((r) => r.status === "pending").length,
      partial: records.filter((r) => r.status === "partial").length,
    };
  }, [feeRecords, selectedChild]);

  // Get status badge
  const getStatusBadge = (status: AdminFeeRecord["status"]) => {
    const config = {
      paid: { bg: "bg-green-100 dark:bg-green-950/30", text: "text-green-700 dark:text-green-300", icon: <CheckCircle2 className="w-3 h-3" />, label: "Paid" },
      partial: { bg: "bg-yellow-100 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-300", icon: <Clock className="w-3 h-3" />, label: "Partial" },
      pending: { bg: "bg-cyan-100 dark:bg-cyan-950/30", text: "text-cyan-700 dark:text-cyan-300", icon: <Clock className="w-3 h-3" />, label: "Pending" },
      overdue: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-300", icon: <AlertCircle className="w-3 h-3" />, label: "Overdue" },
    };
    const c = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${c.bg} ${c.text}`}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  // Format due date with overdue indicator
  const formatDueDate = (dueDate: string, status: AdminFeeRecord["status"]) => {
    const date = new Date(dueDate);
    const formattedDate = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const isOverdue = status === "overdue";

    return (
      <div className="flex flex-col">
        <span className={`text-[10px] font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
          {formattedDate}
        </span>
        {isOverdue && (
          <span className="text-[9px] text-red-500 dark:text-red-400 font-medium">Overdue</span>
        )}
      </div>
    );
  };

  // State for dropdown menu position (using fixed positioning)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [activeRecord, setActiveRecord] = useState<AdminFeeRecord | null>(null);

  // Handle action menu open with fixed position calculation
  const handleActionMenuOpen = (record: AdminFeeRecord, buttonElement: HTMLButtonElement) => {
    if (actionMenuOpen === record.id) {
      setActionMenuOpen(null);
      setActiveRecord(null);
      setMenuPosition(null);
      return;
    }

    const rect = buttonElement.getBoundingClientRect();
    const menuHeight = record.status === "paid" ? 44 : 176; // Approximate height based on options
    const menuWidth = 192;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate position - show above if not enough space below
    let top = rect.bottom + 4;
    if (top + menuHeight > viewportHeight - 10) {
      top = rect.top - menuHeight - 4;
    }

    // Ensure menu doesn't go off-screen to the right
    let left = rect.right - menuWidth;
    if (left < 10) {
      left = 10;
    }

    setMenuPosition({ top, left });
    setActiveRecord(record);
    setActionMenuOpen(record.id);
  };

  // Close menu handler
  const closeActionMenu = () => {
    setActionMenuOpen(null);
    setActiveRecord(null);
    setMenuPosition(null);
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 rounded-xl p-3.5 border border-blue-200/60 dark:border-blue-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center ring-1 ring-blue-500/20">
              <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[10px] font-semibold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider">Total Fees</span>
          </div>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{money(summaryStats.total)}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 rounded-xl p-3.5 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider">Paid</span>
          </div>
          <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{money(summaryStats.paid)}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 rounded-xl p-3.5 border border-amber-200/60 dark:border-amber-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center ring-1 ring-amber-500/20">
              <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[10px] font-semibold text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wider">Outstanding</span>
          </div>
          <p className="text-xl font-bold text-amber-900 dark:text-amber-100">{money(summaryStats.outstanding)}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 rounded-xl p-3.5 border border-red-200/60 dark:border-red-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center ring-1 ring-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-[10px] font-semibold text-red-600/80 dark:text-red-400/80 uppercase tracking-wider">Overdue</span>
          </div>
          <p className="text-xl font-bold text-red-900 dark:text-red-100">{summaryStats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Child Filter */}
        {children.length > 1 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">All Children</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.class})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-1">
          {[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "partial", label: "Partial" },
            { value: "overdue", label: "Overdue" },
            { value: "paid", label: "Paid" },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-3 py-1.5 text-[10px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                selectedStatus === status.value
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable<AdminFeeRecord>
        data={filteredRecords}
        columns={[
          {
            key: "child",
            label: "Student",
            sortable: true,
            render: (record) => (
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${record.childId}`}
                    alt={record.childName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-xs">{record.childName}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{record.childClass}</p>
                </div>
              </div>
            ),
          },
          {
            key: "feeType",
            label: "Fee Type",
            sortable: true,
            render: (record) => (
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{record.feeType}</span>
            ),
          },
          {
            key: "term",
            label: "Term",
            sortable: true,
            render: (record) => (
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{record.term}</span>
            ),
          },
          {
            key: "dueDate",
            label: "Due Date",
            sortable: true,
            render: (record) => formatDueDate(record.dueDate, record.status),
          },
          {
            key: "amount",
            label: "Amount",
            sortable: true,
            render: (record) => (
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{money(record.amount)}</span>
                {record.paidAmount > 0 && record.paidAmount < record.amount && (
                  <span className="text-[9px] text-green-600 dark:text-green-400">Paid: {money(record.paidAmount)}</span>
                )}
              </div>
            ),
          },
          {
            key: "balance",
            label: "Balance",
            sortable: true,
            render: (record) => (
              <span className={`text-xs font-bold ${record.balance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {money(record.balance)}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            sortable: true,
            render: (record) => getStatusBadge(record.status),
          },
          {
            key: "actions",
            label: "",
            sortable: false,
            render: (record) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionMenuOpen(record, e.currentTarget as HTMLButtonElement);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            ),
          },
        ]}
        title="Fee Records"
        searchPlaceholder="Search fee records..."
        showSearch={false}
        defaultItemsPerPage={4}
        getRowKey={(item) => item.id}
        emptyMessage="No fee records found"
        enablePagination={true}
        enableItemsPerPage={false}
      />

      {/* Fixed Position Action Menu (Portal-like) */}
      {actionMenuOpen && menuPosition && activeRecord && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={closeActionMenu}
          />
          {/* Menu */}
          <div
            className="fixed z-[9999] w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 overflow-hidden"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <button
              onClick={() => {
                onViewDetails?.(activeRecord);
                closeActionMenu();
              }}
              className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              View Details
            </button>
            {activeRecord.status !== "paid" && (
              <>
                <button
                  onClick={() => {
                    onApprovePayment?.(activeRecord);
                    closeActionMenu();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-green-500" />
                  Record Payment
                </button>
                <button
                  onClick={() => {
                    onGiveDiscount?.(activeRecord);
                    closeActionMenu();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Percent className="w-3.5 h-3.5 text-rose-500" />
                  Give Discount
                </button>
                <button
                  onClick={() => {
                    onExtendDueDate?.(activeRecord);
                    closeActionMenu();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-indigo-500" />
                  Extend Due Date
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Address Card
function AddressCard({ parent }: { parent: AdminParent }) {
  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Address
        </h3>
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/30 dark:from-gray-800/40 dark:to-gray-900/40 border border-gray-200/40 dark:border-gray-700/40">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Home</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {parent.address.line1}
              {parent.address.line2 && <>, {parent.address.line2}</>}<br />
              {parent.address.city}, {parent.address.state}{parent.address.postalCode && ` ${parent.address.postalCode}`}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/30 dark:from-gray-800/40 dark:to-gray-900/40 border border-gray-200/40 dark:border-gray-700/40">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Work</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">Not provided</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fee Management Actions Card - Modern sleek design with smooth animations
function FeeActionsCard({
  onGiveDiscount,
  onExtendDueDate,
}: {
  onGiveDiscount: () => void;
  onExtendDueDate: () => void;
}) {
  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/50 dark:from-[#1a1d23] dark:to-[#1a1d23]/80 midnight:from-[#0f1729] midnight:to-[#0f1729]/80 purple:from-[#2a1a3e] purple:to-[#2a1a3e]/80 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4">
        {/* Header with gradient icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/20">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Fee Management
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Manage discounts & due dates
            </p>
          </div>
        </div>

        {/* Action buttons with modern design */}
        <div className="space-y-2">
          {/* Give Discount Button */}
          <button
            onClick={onGiveDiscount}
            className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 midnight:from-rose-900/20 midnight:to-pink-900/20 purple:from-rose-900/20 purple:to-pink-900/20 border border-rose-200/50 dark:border-rose-700/30 midnight:border-rose-700/30 purple:border-rose-700/30 p-3 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-rose-500/15 dark:hover:shadow-rose-500/20 hover:-translate-y-0.5 hover:border-rose-300 dark:hover:border-rose-600 active:scale-[0.98]"
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-800/30 dark:to-pink-800/30 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md shadow-rose-500/25 group-hover/btn:shadow-lg group-hover/btn:shadow-rose-500/30 group-hover/btn:scale-110 transition-all duration-300">
                <Percent className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 group-hover/btn:text-rose-700 dark:group-hover/btn:text-rose-300 transition-colors">
                  Give Discount
                </span>
                <span className="block text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Apply percentage or fixed discount
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover/btn:text-rose-500 dark:group-hover/btn:text-rose-400 group-hover/btn:translate-x-1 transition-all duration-300" />
            </div>
          </button>

          {/* Extend Due Date Button */}
          <button
            onClick={onExtendDueDate}
            className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 midnight:from-indigo-900/20 midnight:to-violet-900/20 purple:from-indigo-900/20 purple:to-violet-900/20 border border-indigo-200/50 dark:border-indigo-700/30 midnight:border-indigo-700/30 purple:border-indigo-700/30 p-3 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/20 hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-600 active:scale-[0.98]"
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-800/30 dark:to-violet-800/30 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover/btn:shadow-lg group-hover/btn:shadow-indigo-500/30 group-hover/btn:scale-110 transition-all duration-300">
                <CalendarPlus className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 group-hover/btn:text-indigo-700 dark:group-hover/btn:text-indigo-300 transition-colors">
                  Extend Due Date
                </span>
                <span className="block text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Postpone payment deadline
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover/btn:text-indigo-500 dark:group-hover/btn:text-indigo-400 group-hover/btn:translate-x-1 transition-all duration-300" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== MEETINGS SECTION =====
// Available staff for inviting to meetings
const AVAILABLE_STAFF: AdditionalParticipant[] = [
  { id: "admin-002", name: "Mrs. Adaeze Okonkwo", role: "Vice Principal", type: "admin", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150" },
  { id: "tch-001", name: "Mr. Emeka Obi", role: "Class Teacher", type: "teacher", photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150" },
  { id: "tch-002", name: "Mr. Chidi Okoro", role: "Chemistry Teacher", type: "teacher", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: "tch-003", name: "Mrs. Ngozi Eze", role: "English Teacher", type: "teacher", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
  { id: "counselor-001", name: "Dr. Amaka Nwosu", role: "School Counselor", type: "counselor", photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150" },
];

function MeetingsSection({ meetings, onScheduleMeeting }: { meetings: ParentTeacherMeeting[]; onScheduleMeeting: () => void }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetails | null>(null);
  const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] = useState(false);
  const [modalInitialAction, setModalInitialAction] = useState<"view" | "cancel" | "reschedule" | "invite">("view");
  const upcomingMeetings = meetings.filter((m) => m.status === "upcoming");
  const pastMeetings = meetings.filter((m) => m.status !== "upcoming").slice(0, 5);
  const displayMeetings = showAll ? meetings : [...upcomingMeetings, ...pastMeetings].slice(0, 6);

  // Get meetings context for actions
  const { cancelMeeting, rescheduleMeeting, acceptMeeting, inviteParticipant, removeParticipant } = useMeetings();

  // Handler for cancelling a meeting
  const handleCancelMeeting = (meetingId: string, data: CancelMeetingData) => {
    cancelMeeting(meetingId, data);
    // Update the selected meeting to reflect the cancellation
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting({
        ...selectedMeeting,
        status: "cancelled",
        cancellationReason: data.reason,
        cancelledBy: data.cancelledBy,
        cancelledByName: data.cancelledByName,
      });
    }
  };

  // Handler for rescheduling a meeting
  const handleRescheduleMeeting = (meetingId: string, data: RescheduleMeetingData) => {
    rescheduleMeeting(meetingId, data);
    // Update the selected meeting to reflect the reschedule request
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting({
        ...selectedMeeting,
        rescheduleRequest: {
          newDate: data.newDate,
          newTime: data.newTime,
          reason: data.reason,
          requestedBy: data.requestedBy,
          requestedByName: data.requestedByName,
          requestedAt: new Date().toISOString(),
        },
      });
    }
  };

  // Handler for accepting a meeting
  const handleAcceptMeeting = (meetingId: string) => {
    acceptMeeting(meetingId);
    // Update the selected meeting to reflect the acceptance
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting({
        ...selectedMeeting,
        status: "scheduled",
      });
    }
  };

  // Handler for inviting a participant
  const handleInviteParticipant = (meetingId: string, participant: AdditionalParticipant) => {
    inviteParticipant(meetingId, participant);
    // Update the selected meeting to add the participant
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      const currentParticipants = selectedMeeting.additionalParticipants || [];
      setSelectedMeeting({
        ...selectedMeeting,
        additionalParticipants: [...currentParticipants, participant],
      });
    }
  };

  // Handler for removing a participant
  const handleRemoveParticipant = (meetingId: string, participantId: string) => {
    removeParticipant(meetingId, participantId);
    // Update the selected meeting to remove the participant
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      const currentParticipants = selectedMeeting.additionalParticipants || [];
      setSelectedMeeting({
        ...selectedMeeting,
        additionalParticipants: currentParticipants.filter(p => p.id !== participantId),
      });
    }
  };

  // Open meeting details modal
  const handleViewMeetingDetails = (meeting: ParentTeacherMeeting, action: "view" | "cancel" | "reschedule" | "invite" = "view") => {
    const meetingDetails: MeetingDetails = {
      id: meeting.id,
      title: meeting.subject,
      description: meeting.notes,
      platform: meeting.meetingFormat === "virtual" ? (meeting.virtualType === "video" ? "zoom" : "whatsapp-voice") : "in-person",
      hostName: meeting.teacherName,
      hostRole: meeting.teacherRole,
      childName: meeting.childName,
      scheduledDate: meeting.date,
      scheduledTime: meeting.time,
      duration: meeting.duration,
      status: meeting.status === "upcoming" ? "scheduled" : meeting.status === "no_show" ? "cancelled" : meeting.status,
      location: meeting.location,
      meetingType: meeting.meetingType,
      outcome: meeting.outcome,
      notes: meeting.notes,
    };
    setSelectedMeeting(meetingDetails);
    setModalInitialAction(action);
    setIsMeetingDetailsModalOpen(true);
  };

  const getStatusBadge = (status: ParentTeacherMeeting["status"]) => {
    const config = {
      upcoming: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", label: "Upcoming" },
      completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", label: "Completed" },
      cancelled: { bg: "bg-gray-100 dark:bg-gray-700/30", text: "text-gray-600 dark:text-gray-400", label: "Cancelled" },
      no_show: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "No Show" },
    };
    const c = config[status];
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  const getMeetingTypeBadge = (meeting: ParentTeacherMeeting) => {
    const typeConfig = {
      scheduled: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", label: "Scheduled" },
      requested: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", label: "Requested" },
      follow_up: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", label: "Follow-up" },
      emergency: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-300", label: "Emergency" },
      custom: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300", label: "" },
    };
    const c = typeConfig[meeting.meetingType] || typeConfig.scheduled;
    const label = meeting.meetingType === "custom" && meeting.customMeetingType
      ? meeting.customMeetingType
      : c.label;
    return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${c.bg} ${c.text}`}>{label}</span>;
  };

  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Parent-Teacher Meetings ({meetings.length})
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">{upcomingMeetings.length} Upcoming</span>
            <button
              onClick={onScheduleMeeting}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              + Schedule Meeting
            </button>
          </div>
        </div>

        {displayMeetings.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">No meetings scheduled</p>
        ) : (
          <div className="space-y-2">
            {displayMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                  meeting.status === "upcoming"
                    ? "bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 border-blue-200/50 dark:border-blue-800/30 midnight:border-cyan-800/30 purple:border-pink-800/30 hover:border-blue-300 dark:hover:border-blue-700 midnight:hover:border-cyan-600 purple:hover:border-pink-600 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20"
                    : "bg-gray-50/50 dark:bg-gray-800/20 midnight:bg-gray-800/20 purple:bg-gray-800/20 border-gray-200/40 dark:border-gray-700/40 midnight:border-gray-700/40 purple:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-500 purple:hover:border-gray-500 hover:shadow-gray-500/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{meeting.subject}</span>
                      {getMeetingTypeBadge(meeting)}
                      {getStatusBadge(meeting.status)}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(meeting.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} at {meeting.time}
                      </span>
                      <span>{meeting.duration} min</span>
                    </div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-semibold">{meeting.teacherName}</span> ({meeting.teacherRole}) • {meeting.childName}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                      {meeting.meetingFormat === "virtual" ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                          {meeting.virtualType === "video" ? <Video className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5" />}
                          {meeting.virtualType === "video" ? "Video" : "Audio"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                          <Building2 className="w-2.5 h-2.5" />
                          In-Person
                        </span>
                      )}
                      <span>📍 {meeting.location}</span>
                    </div>
                    {meeting.outcome && (
                      <div className="text-[10px] text-green-600 dark:text-green-400 mt-1 italic">{meeting.outcome}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.status === "upcoming" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMeetingDetails(meeting, "cancel");
                        }}
                        className="px-2 py-1 text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMeetingDetails(meeting, "view");
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {meetings.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAll ? "Show Less" : `Show All ${meetings.length} Meetings`}
          </button>
        )}
      </div>

      {/* Meeting Details Modal */}
      <MeetingDetailsModal
        isOpen={isMeetingDetailsModalOpen}
        onClose={() => {
          setIsMeetingDetailsModalOpen(false);
          setSelectedMeeting(null);
          setModalInitialAction("view");
        }}
        meeting={selectedMeeting}
        viewContext="admin"
        currentUserName="Admin"
        initialAction={modalInitialAction}
        onCancel={handleCancelMeeting}
        onReschedule={handleRescheduleMeeting}
        onAccept={handleAcceptMeeting}
        onInviteParticipant={handleInviteParticipant}
        onRemoveParticipant={handleRemoveParticipant}
        availableParticipants={AVAILABLE_STAFF}
      />
    </div>
  );
}

// ===== LEAVE REQUESTS SECTION =====
function LeaveRequestsSection({
  leaveRequests,
  setLeaveRequests,
}: {
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
}) {
  const [showAll, setShowAll] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [showRejectFormInitially, setShowRejectFormInitially] = useState(false);
  const pendingRequests = leaveRequests.filter((r) => r.status === "pending");
  const displayRequests = showAll ? leaveRequests : leaveRequests.slice(0, 5);

  const handleApprove = (requestId: string, notes?: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "approved" as const,
              processedAt: new Date().toISOString(),
              processedBy: "Admin",
              adminNotes: notes || undefined,
            }
          : r
      )
    );
  };

  const handleReject = (requestId: string, reason: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "rejected" as const,
              processedAt: new Date().toISOString(),
              processedBy: "Admin",
              adminNotes: reason,
            }
          : r
      )
    );
  };

  const getLeaveTypeBadge = (type: LeaveRequest["leaveType"]) => {
    const config = {
      sick: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
      family_emergency: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
      vacation: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
      religious: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
      other: { bg: "bg-gray-100 dark:bg-gray-700/30", text: "text-gray-600 dark:text-gray-400" },
    };
    const c = config[type];
    const label = type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>{label}</span>;
  };

  const getStatusBadge = (status: LeaveRequest["status"]) => {
    const config = {
      pending: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", icon: <Clock className="w-3 h-3" /> },
      approved: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", icon: <CheckCircle2 className="w-3 h-3" /> },
      rejected: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", icon: <XCircle className="w-3 h-3" /> },
    };
    const c = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>
        {c.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarX className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              Leave Requests ({leaveRequests.length})
            </h3>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-1 text-[10px] font-bold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                {pendingRequests.length} Pending Approval
              </span>
            )}
          </div>

          {displayRequests.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">No leave requests</p>
          ) : (
            <div className="space-y-2">
              {displayRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedLeave(request)}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                    request.status === "pending"
                      ? "bg-yellow-50/50 dark:bg-yellow-900/10 midnight:bg-yellow-900/10 purple:bg-yellow-900/10 border-yellow-200/50 dark:border-yellow-800/30 midnight:border-yellow-800/30 purple:border-yellow-800/30 hover:border-yellow-300 dark:hover:border-yellow-700 midnight:hover:border-yellow-600 purple:hover:border-yellow-600 hover:shadow-yellow-500/10 dark:hover:shadow-yellow-500/20 midnight:hover:shadow-yellow-500/20 purple:hover:shadow-yellow-500/20"
                      : "bg-gray-50/50 dark:bg-gray-800/20 midnight:bg-gray-800/20 purple:bg-gray-800/20 border-gray-200/40 dark:border-gray-700/40 midnight:border-gray-700/40 purple:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-500 purple:hover:border-gray-500 hover:shadow-gray-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{request.childName}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">({request.childClass})</span>
                        {getLeaveTypeBadge(request.leaveType)}
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(request.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} -{" "}
                        {new Date(request.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{request.reason}</p>
                      {request.processedBy && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 italic">
                          Processed by {request.processedBy}
                        </p>
                      )}
                      {request.status === "rejected" && request.adminNotes && (
                        <p className="text-[10px] text-red-600 dark:text-red-400 mt-1 italic line-clamp-1">
                          Reason: {request.adminNotes}
                        </p>
                      )}
                    </div>
                    {request.status === "pending" && (
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApprove(request.id); }}
                          className="px-2.5 py-1.5 text-[10px] font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowRejectFormInitially(true); setSelectedLeave(request); }}
                          className="px-2.5 py-1.5 text-[10px] font-semibold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      </div>
                    )}
                    {request.status !== "pending" && (
                      <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400">
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {leaveRequests.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showAll ? "Show Less" : `Show All ${leaveRequests.length} Requests`}
            </button>
          )}
        </div>
      </div>

      {/* Leave Request Details Modal */}
      {selectedLeave && (
        <ChildLeaveRequestDetailsModal
          leave={{
            id: selectedLeave.id,
            childId: selectedLeave.childId,
            childName: selectedLeave.childName,
            childClass: selectedLeave.childClass,
            leaveType: selectedLeave.leaveType,
            startDate: selectedLeave.startDate,
            endDate: selectedLeave.endDate,
            reason: selectedLeave.reason,
            status: selectedLeave.status,
            requestedAt: selectedLeave.requestedAt,
            processedAt: selectedLeave.processedAt,
            processedBy: selectedLeave.processedBy,
            adminNotes: selectedLeave.adminNotes,
            documents: selectedLeave.documents,
          }}
          onClose={() => { setSelectedLeave(null); setShowRejectFormInitially(false); }}
          onApprove={handleApprove}
          onReject={handleReject}
          isAdmin={true}
          showRejectFormInitially={showRejectFormInitially}
        />
      )}
    </>
  );
}

// ===== PAYMENT HISTORY SECTION =====
function PaymentHistorySection({
  payments,
  money,
  feeRecords,
  onViewPaymentDetails,
  currencyCode,
  schoolName,
  parentName,
}: {
  payments: PaymentRecord[];
  money: (amount: number) => string;
  feeRecords: AdminFeeRecord[];
  onViewPaymentDetails?: (payment: PaymentRecord) => void;
  currencyCode: string;
  schoolName: string;
  parentName: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get unique children from payments
  const children = useMemo(() => {
    const uniqueChildren = new Map<string, { id: string; name: string }>();
    payments.forEach((payment) => {
      if (!uniqueChildren.has(payment.childId)) {
        uniqueChildren.set(payment.childId, {
          id: payment.childId,
          name: payment.childName,
        });
      }
    });
    return Array.from(uniqueChildren.values());
  }, [payments]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const childMatch = selectedChild === "all" || payment.childId === selectedChild;
      const statusMatch = selectedStatus === "all" || payment.status === selectedStatus;
      return childMatch && statusMatch;
    });
  }, [payments, selectedChild, selectedStatus]);

  const displayPayments = showAll ? filteredPayments : filteredPayments.slice(0, 5);

  // Export to PDF
  const handleExportPDF = useCallback(() => {
    if (filteredPayments.length === 0) return;
    setIsExportDropdownOpen(false);

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text("Payment History Report", pageWidth / 2, y, { align: "center" });
    y += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(schoolName || "School", pageWidth / 2, y, { align: "center" });
    y += 5;

    doc.setFontSize(9);
    doc.text(`Parent: ${parentName}`, pageWidth / 2, y, { align: "center" });
    y += 8;

    // Stats Summary
    const stats = {
      total: filteredPayments.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0),
      count: filteredPayments.filter((p) => p.status === "completed").length,
      pending: filteredPayments.filter((p) => p.status === "pending").length,
      failed: filteredPayments.filter((p) => p.status === "failed").length,
    };

    doc.setFillColor(34, 197, 94);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`Total Paid: ${currencyCode} ${stats.total.toLocaleString()}`, margin + 8, y + 7);
    doc.text(`${stats.count} Completed | ${stats.pending} Pending | ${stats.failed} Failed`, margin + 8, y + 13);
    y += 22;

    // Table Header
    const colWidths = [55, 30, 25, 35, 35];
    const headers = ["Fee Type / Student", "Date", "Method", "Amount", "Status"];

    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, y, pageWidth - margin * 2, 8, "FD");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    let x = margin + 3;
    headers.forEach((header, i) => {
      doc.text(header, x, y + 5.5);
      x += colWidths[i];
    });
    y += 10;

    // Table Rows
    doc.setFont("helvetica", "normal");
    filteredPayments.forEach((payment, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const rowHeight = 12;
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, y - 2, pageWidth - margin * 2, rowHeight, "F");
      }

      doc.setTextColor(31, 41, 55);
      doc.setFontSize(8);

      x = margin + 3;
      // Fee Type & Student
      doc.setFont("helvetica", "bold");
      doc.text(payment.feeType.substring(0, 20), x, y + 3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.text(payment.childName.substring(0, 25), x, y + 7);
      x += colWidths[0];

      // Date
      doc.setFontSize(8);
      doc.setTextColor(31, 41, 55);
      doc.text(new Date(payment.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }), x, y + 5);
      x += colWidths[1];

      // Method
      doc.text(payment.paymentMethod, x, y + 5);
      x += colWidths[2];

      // Amount
      doc.setFont("helvetica", "bold");
      doc.text(`${currencyCode} ${payment.amount.toLocaleString()}`, x, y + 5);
      x += colWidths[3];

      // Status
      const statusColors: Record<string, { r: number; g: number; b: number }> = {
        completed: { r: 5, g: 150, b: 105 },
        pending: { r: 217, g: 119, b: 6 },
        failed: { r: 220, g: 38, b: 38 },
      };
      const color = statusColors[payment.status] || statusColors.completed;
      doc.setTextColor(color.r, color.g, color.b);
      doc.text(payment.status.charAt(0).toUpperCase() + payment.status.slice(1), x, y + 5);

      y += rowHeight;
    });

    // Footer
    y += 10;
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, pageWidth / 2, y, { align: "center" });

    const dateStr = new Date().toISOString().split("T")[0];
    doc.save(`payment-history-${parentName.replace(/\s+/g, "-").toLowerCase()}-${dateStr}.pdf`);
  }, [filteredPayments, currencyCode, schoolName, parentName]);

  // Export to Excel
  const handleExportExcel = useCallback(async () => {
    if (filteredPayments.length === 0) return;
    setIsExportDropdownOpen(false);

    const XLSX = await import("xlsx");

    // Prepare data
    const data = filteredPayments.map((payment) => ({
      "Fee Type": payment.feeType,
      "Student": payment.childName,
      "Date": new Date(payment.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      "Payment Method": payment.paymentMethod,
      "Amount": payment.amount,
      "Status": payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
      "Reference": payment.reference,
      "Receipt Number": payment.receiptNumber,
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Payments sheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws["!cols"] = [
      { wch: 20 }, // Fee Type
      { wch: 18 }, // Student
      { wch: 15 }, // Date
      { wch: 15 }, // Payment Method
      { wch: 12 }, // Amount
      { wch: 12 }, // Status
      { wch: 25 }, // Reference
      { wch: 18 }, // Receipt Number
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Payment History");

    // Summary sheet
    const stats = {
      totalPaid: filteredPayments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
      completedCount: filteredPayments.filter((p) => p.status === "completed").length,
      pendingCount: filteredPayments.filter((p) => p.status === "pending").length,
      failedCount: filteredPayments.filter((p) => p.status === "failed").length,
    };

    const summaryData = [
      { "Metric": "Parent Name", "Value": parentName },
      { "Metric": "School", "Value": schoolName },
      { "Metric": "Report Date", "Value": new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
      { "Metric": "", "Value": "" },
      { "Metric": "Total Paid", "Value": `${currencyCode} ${stats.totalPaid.toLocaleString()}` },
      { "Metric": "Completed Payments", "Value": stats.completedCount },
      { "Metric": "Pending Payments", "Value": stats.pendingCount },
      { "Metric": "Failed Payments", "Value": stats.failedCount },
      { "Metric": "Total Records", "Value": filteredPayments.length },
    ];

    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    summaryWs["!cols"] = [{ wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `payment-history-${parentName.replace(/\s+/g, "-").toLowerCase()}-${dateStr}.xlsx`);
  }, [filteredPayments, currencyCode, schoolName, parentName]);

  // Calculate payment stats
  const paymentStats = useMemo(() => {
    const records = selectedChild === "all" ? payments : payments.filter((p) => p.childId === selectedChild);
    return {
      totalPaid: records.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
      totalPayments: records.filter((p) => p.status === "completed").length,
      pending: records.filter((p) => p.status === "pending").length,
      failed: records.filter((p) => p.status === "failed").length,
    };
  }, [payments, selectedChild]);

  const getStatusBadge = (status: PaymentRecord["status"]) => {
    const config = {
      completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", icon: <CheckCircle2 className="w-3 h-3" /> },
      pending: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", icon: <Clock className="w-3 h-3" /> },
      failed: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", icon: <XCircle className="w-3 h-3" /> },
    };
    const c = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>
        {c.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getMethodIcon = (method: PaymentRecord["paymentMethod"]) => {
    const icons = {
      "Bank Transfer": "🏦",
      Card: "💳",
      Cash: "💵",
      USSD: "📱",
      POS: "🖥️",
    };
    return icons[method];
  };

  // Find related fee record for a payment
  const getRelatedFeeRecord = (payment: PaymentRecord) => {
    return feeRecords.find(
      (fee) => fee.childId === payment.childId && fee.feeType === payment.feeType
    );
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Payment Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 rounded-xl p-3.5 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/20">
              <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider">Total Paid</span>
          </div>
          <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{money(paymentStats.totalPaid)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 rounded-xl p-3.5 border border-blue-200/60 dark:border-blue-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center ring-1 ring-blue-500/20">
              <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[10px] font-semibold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider">Transactions</span>
          </div>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{paymentStats.totalPayments}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 rounded-xl p-3.5 border border-amber-200/60 dark:border-amber-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center ring-1 ring-amber-500/20">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[10px] font-semibold text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-xl font-bold text-amber-900 dark:text-amber-100">{paymentStats.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 rounded-xl p-3.5 border border-red-200/60 dark:border-red-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center ring-1 ring-red-500/20">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-[10px] font-semibold text-red-600/80 dark:text-red-400/80 uppercase tracking-wider">Failed</span>
          </div>
          <p className="text-xl font-bold text-red-900 dark:text-red-100">{paymentStats.failed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Child Filter */}
        {children.length > 1 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">All Children</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-1">
          {[
            { value: "all", label: "All" },
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-3 py-1.5 text-[10px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                selectedStatus === status.value
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white dark:bg-[#1a1d23] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Payment History</h3>
            <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
              {filteredPayments.length} {filteredPayments.length === 1 ? "payment" : "payments"}
            </span>
          </div>
          <div className="relative" ref={exportDropdownRef}>
            <button
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              disabled={filteredPayments.length === 0}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export
            </button>
            {isExportDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] z-20">
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                  Export as PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-green-500" />
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {filteredPayments.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No payment records found</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[250px]">
              {selectedChild !== "all" || selectedStatus !== "all"
                ? "Try adjusting your filters to see more payments."
                : "There are no payment records for this parent yet."}
            </p>
            {(selectedChild !== "all" || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSelectedChild("all");
                  setSelectedStatus("all");
                }}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Scrollable Payment List - Fixed height for 4 items */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent p-3 space-y-2">
              {displayPayments.map((payment, index) => {
                const relatedFee = getRelatedFeeRecord(payment);
                return (
                  <div
                    key={payment.id}
                    onClick={() => onViewPaymentDetails?.(payment)}
                    className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                      payment.status === "completed"
                        ? "bg-emerald-50/50 dark:bg-emerald-900/10 midnight:bg-emerald-900/10 purple:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30 midnight:border-emerald-800/30 purple:border-emerald-800/30 hover:border-emerald-300 dark:hover:border-emerald-700 midnight:hover:border-emerald-600 purple:hover:border-emerald-600 hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 midnight:hover:shadow-emerald-500/20 purple:hover:shadow-emerald-500/20"
                        : payment.status === "pending"
                        ? "bg-amber-50/50 dark:bg-amber-900/10 midnight:bg-amber-900/10 purple:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30 midnight:border-amber-800/30 purple:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-700 midnight:hover:border-amber-600 purple:hover:border-amber-600 hover:shadow-amber-500/10 dark:hover:shadow-amber-500/20 midnight:hover:shadow-amber-500/20 purple:hover:shadow-amber-500/20"
                        : "bg-red-50/50 dark:bg-red-900/10 midnight:bg-red-900/10 purple:bg-red-900/10 border-red-200/50 dark:border-red-800/30 midnight:border-red-800/30 purple:border-red-800/30 hover:border-red-300 dark:hover:border-red-700 midnight:hover:border-red-600 purple:hover:border-red-600 hover:shadow-red-500/10 dark:hover:shadow-red-500/20 midnight:hover:shadow-red-500/20 purple:hover:shadow-red-500/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Payment Method Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ${
                          payment.status === "completed"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 ring-emerald-500/20"
                            : payment.status === "pending"
                            ? "bg-amber-100 dark:bg-amber-900/30 ring-amber-500/20"
                            : "bg-red-100 dark:bg-red-900/30 ring-red-500/20"
                        }`}>
                          <span className="text-lg">{getMethodIcon(payment.paymentMethod)}</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{payment.feeType}</span>
                            {getStatusBadge(payment.status)}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{payment.childName}</span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(payment.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                            Ref: {payment.reference}
                          </p>
                          {relatedFee && relatedFee.balance > 0 && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                              Outstanding Balance: {money(relatedFee.balance)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${
                          payment.status === "completed"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : payment.status === "pending"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>{money(payment.amount)}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{payment.receiptNumber}</p>
                        <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 mt-1.5 justify-end">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More Button */}
            {filteredPayments.length > 5 && (
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAll ? "Show Less" : `View All ${filteredPayments.length} Payments`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ===== SUPPORT TICKETS SECTION =====
function SupportTicketsSection({ communications, setCommunications, parentName }: {
  communications: CommunicationRecord[];
  setCommunications: React.Dispatch<React.SetStateAction<CommunicationRecord[]>>;
  parentName: string;
}) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<CommunicationRecord | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("in_progress");

  // New ticket creation state
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    type: "inquiry" as CommunicationRecord["type"],
    priority: "medium" as CommunicationRecord["priority"],
    message: "",
    assignedTo: "",
  });

  // Mock assignable staff members
  const assignableStaff = useMemo(() => [
    { value: "", label: "Unassigned", role: "" },
    { value: "admin-001", label: "John Smith", role: "Admin" },
    { value: "admin-002", label: "Sarah Johnson", role: "Admin" },
    { value: "teacher-001", label: "Mrs. Okonkwo", role: "Teacher" },
    { value: "teacher-002", label: "Mr. Adeyemi", role: "Teacher" },
    { value: "teacher-003", label: "Dr. Williams", role: "HOD" },
    { value: "support-001", label: "David Chen", role: "Support Staff" },
    { value: "support-002", label: "Grace Eze", role: "Counselor" },
    { value: "bursar-001", label: "Mr. Thompson", role: "Bursar" },
  ], []);


  // Filter tickets
  const filteredTickets = useMemo(() => {
    return communications.filter((comm) => {
      const typeMatch = selectedType === "all" || comm.type === selectedType;
      const statusMatch = selectedStatus === "all" || comm.status === selectedStatus;
      const searchMatch = searchQuery === "" ||
        comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.message.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && statusMatch && searchMatch;
    });
  }, [communications, selectedType, selectedStatus, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: communications.length,
    open: communications.filter((c) => c.status === "open").length,
    inProgress: communications.filter((c) => c.status === "in_progress").length,
    resolved: communications.filter((c) => c.status === "resolved").length,
    closed: communications.filter((c) => c.status === "closed").length,
  }), [communications]);

  const handleCreateTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;
    setIsCreatingTicket(true);

    // Find the assigned staff name
    const assignedStaff = assignableStaff.find((s) => s.value === newTicket.assignedTo);

    // Simulate API call - in real app, this would create the ticket
    setTimeout(() => {
      console.log("Creating ticket:", {
        subject: newTicket.subject,
        type: newTicket.type,
        priority: newTicket.priority,
        message: newTicket.message,
        status: newTicket.assignedTo ? "in_progress" : "open",
        assignedTo: assignedStaff?.label || undefined,
      });
      setIsCreatingTicket(false);
      setIsNewTicketModalOpen(false);
      resetNewTicketForm();
    }, 1000);
  };

  const resetNewTicketForm = () => {
    setNewTicket({
      subject: "",
      type: "inquiry",
      priority: "medium",
      message: "",
      assignedTo: "",
    });
  };

  const getTypeBadge = (type: CommunicationRecord["type"]) => {
    const config = {
      complaint: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", icon: "🔴" },
      inquiry: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", icon: "❓" },
      feedback: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", icon: "💬" },
      request: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", icon: "📝" },
      meeting_request: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", icon: "📅" },
    };
    const c = config[type];
    const label = type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>{label}</span>;
  };

  const getStatusBadge = (status: CommunicationRecord["status"]) => {
    const config = {
      open: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", icon: <Clock className="w-3 h-3" /> },
      in_progress: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", icon: <Clock className="w-3 h-3" /> },
      resolved: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", icon: <CheckCircle2 className="w-3 h-3" /> },
      closed: { bg: "bg-gray-100 dark:bg-gray-700/30", text: "text-gray-600 dark:text-gray-400", icon: <XCircle className="w-3 h-3" /> },
    };
    const c = config[status];
    const label = status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>
        {c.icon}
        {label}
      </span>
    );
  };

  const getPriorityConfig = (priority: CommunicationRecord["priority"]) => {
    const config = {
      low: { color: "bg-green-500", label: "Low", textColor: "text-green-600 dark:text-green-400" },
      medium: { color: "bg-yellow-500", label: "Medium", textColor: "text-yellow-600 dark:text-yellow-400" },
      high: { color: "bg-red-500", label: "High", textColor: "text-red-600 dark:text-red-400" },
    };
    return config[priority];
  };

  const handleViewTicket = (ticket: CommunicationRecord) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status); // Initialize status dropdown to current ticket status
    setIsTicketModalOpen(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    setIsReplying(true);

    // Create the new response
    const newResponse = {
      from: "admin" as const,
      message: replyText.trim(),
      date: new Date().toISOString(),
    };

    // Simulate sending reply
    setTimeout(() => {
      // Update selectedTicket with the new response and status
      setSelectedTicket(prev => prev ? {
        ...prev,
        responses: [...prev.responses, newResponse],
        status: newStatus as typeof prev.status,
      } : null);

      // Update the communications list
      setCommunications(prev => prev.map(t =>
        t.id === selectedTicket.id
          ? {
              ...t,
              responses: [...t.responses, newResponse],
              status: newStatus as typeof t.status,
            }
          : t
      ));

      setIsReplying(false);
      setReplyText("");
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 rounded-xl p-3.5 border border-amber-200/60 dark:border-amber-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center ring-1 ring-amber-500/20">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[10px] font-semibold text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wider">Open</span>
          </div>
          <p className="text-xl font-bold text-amber-900 dark:text-amber-100">{stats.open}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 rounded-xl p-3.5 border border-blue-200/60 dark:border-blue-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center ring-1 ring-blue-500/20">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[10px] font-semibold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider">In Progress</span>
          </div>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{stats.inProgress}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 rounded-xl p-3.5 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider">Resolved</span>
          </div>
          <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{stats.resolved}</p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/40 dark:to-slate-900/20 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-slate-500/10 dark:bg-slate-500/20 flex items-center justify-center ring-1 ring-slate-500/20">
              <XCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <span className="text-[10px] font-semibold text-slate-600/80 dark:text-slate-400/80 uppercase tracking-wider">Closed</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <FormInput
              label="Search Tickets"
              icon={<Search className="w-full h-full" />}
              iconBgColor="bg-blue-100 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by subject or message..."
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>

          {/* Type Filter */}
          <FormDropdown
            label="Ticket Type"
            icon={<Filter className="w-full h-full" />}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            value={selectedType}
            onChange={setSelectedType}
            placeholder="All Types"
            options={[
              { value: "all", label: "All Types" },
              { value: "complaint", label: "Complaint" },
              { value: "inquiry", label: "Inquiry" },
              { value: "feedback", label: "Feedback" },
              { value: "request", label: "Request" },
              { value: "meeting_request", label: "Meeting Request" },
            ]}
          />

          {/* Status Filter */}
          <FormDropdown
            label="Status"
            icon={<CheckCircle2 className="w-full h-full" />}
            iconBgColor="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="All Status"
            options={[
              { value: "all", label: "All Status" },
              { value: "open", label: "Open" },
              { value: "in_progress", label: "In Progress" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "Closed" },
            ]}
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Support Tickets
            <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              {filteredTickets.length}
            </span>
          </h3>
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Log Ticket
          </button>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No tickets found</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {searchQuery || selectedType !== "all" || selectedStatus !== "all"
                ? "Try adjusting your filters."
                : "No support tickets from this parent."}
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredTickets.map((ticket) => {
              const priorityConfig = getPriorityConfig(ticket.priority);
              return (
                <div
                  key={ticket.id}
                  onClick={() => handleViewTicket(ticket)}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                    ticket.status === "open"
                      ? "bg-amber-50/50 dark:bg-amber-900/10 midnight:bg-amber-900/10 purple:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30 midnight:border-amber-800/30 purple:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-700 midnight:hover:border-amber-600 purple:hover:border-amber-600 hover:shadow-amber-500/10 dark:hover:shadow-amber-500/20 midnight:hover:shadow-amber-500/20 purple:hover:shadow-amber-500/20"
                      : ticket.status === "in_progress"
                      ? "bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-blue-900/10 purple:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/30 midnight:border-blue-800/30 purple:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700 midnight:hover:border-blue-600 purple:hover:border-blue-600 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-blue-500/20 purple:hover:shadow-blue-500/20"
                      : ticket.status === "resolved"
                      ? "bg-emerald-50/50 dark:bg-emerald-900/10 midnight:bg-emerald-900/10 purple:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30 midnight:border-emerald-800/30 purple:border-emerald-800/30 hover:border-emerald-300 dark:hover:border-emerald-700 midnight:hover:border-emerald-600 purple:hover:border-emerald-600 hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 midnight:hover:shadow-emerald-500/20 purple:hover:shadow-emerald-500/20"
                      : "bg-gray-50/50 dark:bg-gray-800/20 midnight:bg-gray-800/20 purple:bg-gray-800/20 border-gray-200/40 dark:border-gray-700/40 midnight:border-gray-700/40 purple:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-500 purple:hover:border-gray-500 hover:shadow-gray-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Priority Indicator */}
                      <div className="pt-0.5">
                        <span className={`block w-2.5 h-2.5 rounded-full ${priorityConfig.color} ring-2 ring-white dark:ring-gray-800`} title={`${priorityConfig.label} priority`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{ticket.subject}</span>
                          {getTypeBadge(ticket.type)}
                          {getStatusBadge(ticket.status)}
                        </div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2 mb-1.5">{ticket.message}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          {ticket.assignedTo && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {ticket.assignedTo}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {ticket.responses.length} {ticket.responses.length === 1 ? "response" : "responses"}
                          </span>
                          <span className={`font-medium ${priorityConfig.textColor}`}>{priorityConfig.label} Priority</span>
                        </div>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <Eye className="w-3 h-3" />
                      <span className="font-medium">View</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <Modal
          isOpen={isTicketModalOpen}
          onClose={() => {
            setIsTicketModalOpen(false);
            setSelectedTicket(null);
            setReplyText("");
          }}
          title={selectedTicket.subject}
          subtitle={`Ticket #${selectedTicket.id}`}
          icon={<MessageSquare className="w-5 h-5" />}
          maxWidth="2xl"
          footer={(selectedTicket.status === "open" || selectedTicket.status === "in_progress") ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Update Status:</span>
                <CustomDropdown
                  value={newStatus}
                  onChange={(value) => {
                    const status = value as string;
                    setNewStatus(status);
                    // Update selectedTicket with new status
                    setSelectedTicket(prev => prev ? {
                      ...prev,
                      status: status as typeof prev.status,
                    } : null);
                    // Update communications list
                    setCommunications(prev => prev.map(t =>
                      t.id === selectedTicket.id
                        ? { ...t, status: status as typeof t.status }
                        : t
                    ));
                  }}
                  options={[
                    { value: "open", label: "Open" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "resolved", label: "Resolved" },
                    { value: "closed", label: "Closed" },
                  ]}
                  variant="blue"
                  dropup
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsTicketModalOpen(false);
                    setSelectedTicket(null);
                    setReplyText("");
                  }}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isReplying}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl"
                >
                {isReplying ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Response
                  </>
                )}
                </button>
              </div>
            </div>
          ) : undefined}
        >
          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="flex items-center gap-2 flex-wrap">
              {getTypeBadge(selectedTicket.type)}
              {getStatusBadge(selectedTicket.status)}
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityConfig(selectedTicket.priority).textColor} bg-gray-100 dark:bg-gray-700`}>
                {getPriorityConfig(selectedTicket.priority).label} Priority
              </span>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Submitted</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {new Date(selectedTicket.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Assign To</p>
                <CustomDropdown
                  value={assignableStaff.find(s => s.label === selectedTicket.assignedTo)?.value || ""}
                  onChange={(value) => {
                    const staff = assignableStaff.find(s => s.value === value);
                    // Update the selectedTicket state with the new assignedTo value
                    setSelectedTicket(prev => prev ? {
                      ...prev,
                      assignedTo: staff?.label || undefined,
                      status: staff ? "in_progress" : prev.status,
                    } : null);
                    // Also update the communications list
                    setCommunications(prev => prev.map(t =>
                      t.id === selectedTicket.id
                        ? { ...t, assignedTo: staff?.label || undefined, status: staff ? "in_progress" : t.status }
                        : t
                    ));
                  }}
                  options={assignableStaff.map((staff) => ({
                    value: staff.value,
                    label: staff.role ? `${staff.label} (${staff.role})` : staff.label,
                  }))}
                  variant="blue"
                  className="min-w-[140px]"
                />
              </div>
            </div>

            {/* Original Message */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{parentName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{parentName}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Original Message</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedTicket.message}</p>
            </div>

            {/* Responses */}
            {selectedTicket.responses.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Responses ({selectedTicket.responses.length})</h4>
                {selectedTicket.responses.map((response, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      response.from === "admin"
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/30"
                        : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        response.from === "admin" ? "bg-green-200 dark:bg-green-800" : "bg-gray-200 dark:bg-gray-700"
                      }`}>
                        <span className={`text-xs font-bold ${
                          response.from === "admin" ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {response.from === "admin" ? "A" : parentName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          {response.from === "admin" ? "Admin" : parentName}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {new Date(response.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{response.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input - in scrollable area */}
            {(selectedTicket.status === "open" || selectedTicket.status === "in_progress") && (
              <FormTextarea
                label="Your Response"
                icon={<Send className="w-full h-full" />}
                iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-blue-600 dark:text-blue-400"
                value={replyText}
                onChange={setReplyText}
                placeholder="Type your response to the ticket..."
                rows={3}
              />
            )}
          </div>
        </Modal>
      )}

      {/* New Ticket Modal */}
      <Modal
        isOpen={isNewTicketModalOpen}
        onClose={() => {
          setIsNewTicketModalOpen(false);
          resetNewTicketForm();
        }}
        title="Log Support Ticket"
        subtitle="Create a new support ticket for this parent"
        icon={<MessageSquare className="w-5 h-5" />}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Subject */}
          <FormInput
            label="Subject"
            icon={<MessageSquare className="w-full h-full" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            value={newTicket.subject}
            onChange={(value) => setNewTicket((prev) => ({ ...prev, subject: value }))}
            placeholder="Enter ticket subject..."
            required
          />

          {/* Type and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <FormDropdown
              label="Ticket Type"
              icon={<Filter className="w-full h-full" />}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
              value={newTicket.type}
              onChange={(value) => setNewTicket((prev) => ({ ...prev, type: value as CommunicationRecord["type"] }))}
              options={[
                { value: "inquiry", label: "Inquiry" },
                { value: "complaint", label: "Complaint" },
                { value: "feedback", label: "Feedback" },
                { value: "request", label: "Request" },
                { value: "meeting_request", label: "Meeting Request" },
              ]}
              required
            />

            <FormDropdown
              label="Priority"
              icon={<AlertCircle className="w-full h-full" />}
              iconBgColor="bg-amber-100 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400"
              value={newTicket.priority}
              onChange={(value) => setNewTicket((prev) => ({ ...prev, priority: value as CommunicationRecord["priority"] }))}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
              required
            />
          </div>

          {/* Assign To */}
          <FormDropdown
            label="Assign To"
            icon={<User className="w-full h-full" />}
            iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
            iconColor="text-emerald-600 dark:text-emerald-400"
            value={newTicket.assignedTo}
            onChange={(value) => setNewTicket((prev) => ({ ...prev, assignedTo: value }))}
            placeholder="Select staff member (optional)"
            options={assignableStaff.map((staff) => ({
              value: staff.value,
              label: staff.role ? `${staff.label} (${staff.role})` : staff.label,
            }))}
          />

          {/* Message */}
          <FormTextarea
            label="Message"
            icon={<FileText className="w-full h-full" />}
            iconBgColor="bg-gray-100 dark:bg-gray-700"
            iconColor="text-gray-600 dark:text-gray-400"
            value={newTicket.message}
            onChange={(value) => setNewTicket((prev) => ({ ...prev, message: value }))}
            placeholder="Describe the issue or request in detail..."
            rows={4}
            required
          />

          {/* Preview Card */}
          {newTicket.subject && (
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Preview</p>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{newTicket.subject || "No subject"}</span>
                {getTypeBadge(newTicket.type)}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityConfig(newTicket.priority).textColor} bg-gray-100 dark:bg-gray-700`}>
                  {getPriorityConfig(newTicket.priority).label} Priority
                </span>
              </div>
              {newTicket.assignedTo && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                  <User className="w-3 h-3" />
                  <span className="font-medium">
                    Assigned to: {assignableStaff.find((s) => s.value === newTicket.assignedTo)?.label}
                  </span>
                  <span className="text-gray-400">
                    ({assignableStaff.find((s) => s.value === newTicket.assignedTo)?.role})
                  </span>
                </div>
              )}
              {!newTicket.assignedTo && (
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                  <User className="w-3 h-3" />
                  <span>Unassigned - Will be set to Open status</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setIsNewTicketModalOpen(false);
                resetNewTicketForm();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTicket}
              disabled={!newTicket.subject.trim() || !newTicket.message.trim() || isCreatingTicket}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl"
            >
              {isCreatingTicket ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ===== EVENT ATTENDANCE SECTION =====
function EventAttendanceSection({ eventAttendance }: { eventAttendance: ParentEventAttendance[] }) {
  const [showAll, setShowAll] = useState(false);
  const attendedCount = eventAttendance.filter((e) => e.attended).length;
  const attendanceRate = eventAttendance.length > 0 ? Math.round((attendedCount / eventAttendance.length) * 100) : 0;
  const displayEvents = showAll ? eventAttendance : eventAttendance.slice(0, 5);

  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Event Attendance
          </h3>
          <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
            attendanceRate >= 70
              ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30"
              : attendanceRate >= 50
              ? "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30"
              : "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30"
          }`}>
            {attendanceRate}% Attendance
          </span>
        </div>

        {displayEvents.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">No events recorded</p>
        ) : (
          <div className="space-y-1.5">
            {displayEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/20 midnight:bg-gray-800/20 purple:bg-gray-800/20 border border-gray-200/40 dark:border-gray-700/40 midnight:border-gray-700/40 purple:border-gray-700/40 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-500 purple:hover:border-gray-500 hover:shadow-gray-500/10"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{event.eventName}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {event.childName} • {new Date(event.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
                {event.attended ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Attended
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded">
                    <XCircle className="w-3 h-3" />
                    Absent
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {eventAttendance.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAll ? "Show Less" : `Show All ${eventAttendance.length} Events`}
          </button>
        )}
      </div>
    </div>
  );
}

// ===== LIBRARY PAYMENTS SECTION =====
function LibraryPaymentsSection({
  libraryPayments,
  money,
}: {
  libraryPayments: LibraryPayment[];
  money: (amount: number) => string;
}) {
  const [showAll, setShowAll] = useState(false);
  const pendingPayments = libraryPayments.filter((p) => p.status === "pending");
  const displayPayments = showAll ? libraryPayments : libraryPayments.slice(0, 5);

  const getTypeBadge = (type: LibraryPayment["paymentType"]) => {
    const config = {
      book_purchase: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", label: "Purchase" },
      late_fee: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", label: "Late Fee" },
      damage_fee: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", label: "Damage" },
      lost_book: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "Lost Book" },
    };
    const c = config[type];
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Library Payments
          </h3>
          {pendingPayments.length > 0 && (
            <span className="px-2 py-1 text-[10px] font-bold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              {pendingPayments.length} Pending
            </span>
          )}
        </div>

        {displayPayments.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">No library payments</p>
        ) : (
          <div className="space-y-1.5">
            {displayPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/20 midnight:bg-gray-800/20 purple:bg-gray-800/20 border border-gray-200/40 dark:border-gray-700/40 midnight:border-gray-700/40 purple:border-gray-700/40 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-500 purple:hover:border-gray-500 hover:shadow-gray-500/10"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{payment.bookTitle}</p>
                    {getTypeBadge(payment.paymentType)}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {payment.childName} • {new Date(payment.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{money(payment.amount)}</p>
                  <span className={`text-[10px] font-semibold ${
                    payment.status === "paid"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}>
                    {payment.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {libraryPayments.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAll ? "Show Less" : `Show All ${libraryPayments.length} Payments`}
          </button>
        )}
      </div>
    </div>
  );
}

// ===== LINK CHILD MODAL =====
// This modal allows admins to link an existing student to a parent
// Respects tenant-level settings for class/level display
function LinkChildModal({
  isOpen,
  onClose,
  parentId,
  parentName,
  existingChildIds,
  onChildLinked,
}: {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
  parentName: string;
  existingChildIds: string[];
  onChildLinked: (child: ParentChild) => void;
}) {
  const { settings } = useSchoolSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string; classLevel: string; section?: string; gender: "Male" | "Female" } | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<string>("Guardian");
  const [isLinking, setIsLinking] = useState(false);

  // Determine school type labels based on tenant settings
  const isTertiary = settings.supportedLevels.includes("Tertiary") && !settings.supportedLevels.includes("Primary") && !settings.supportedLevels.includes("Secondary");
  const isPrimaryOnly = settings.supportedLevels.includes("Primary") && !settings.supportedLevels.includes("Secondary") && !settings.supportedLevels.includes("Tertiary");
  const isSecondaryOnly = settings.supportedLevels.includes("Secondary") && !settings.supportedLevels.includes("Primary") && !settings.supportedLevels.includes("Tertiary");

  // Get appropriate label for class/level selector
  const classLevelLabel = isTertiary
    ? "Level / Course"
    : isPrimaryOnly
      ? "Class"
      : isSecondaryOnly
        ? "Class"
        : "Class / Level";

  // Get all students from the system and format them for selection
  const allStudents = useMemo(() => {
    const students = getAllStudents();
    return students.map((student) => {
      const nameParts = student.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const classLevel = student.class.split(",")[0].trim();

      return {
        id: student.id,
        name: student.name,
        firstName,
        lastName,
        classLevel,
        section: student.class.includes(",") ? student.class.split(",")[1].trim() : "",
        gender: student.gender,
      };
    });
  }, []);

  // Get unique class levels for the dropdown - STRICTLY filtered by tenant settings
  const classOptions = useMemo(() => {
    const classSet = new Set<string>();
    allStudents.forEach((student) => {
      if (!existingChildIds.includes(student.id)) {
        classSet.add(student.classLevel);
      }
    });

    const classes = Array.from(classSet).sort((a, b) => {
      const order: Record<string, number> = {
        "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6,
        "JSS 1": 10, "JSS 2": 11, "JSS 3": 12,
        "SSS 1": 20, "SSS 2": 21, "SSS 3": 22,
      };
      return (order[a] || 99) - (order[b] || 99);
    });

    // Build options based on tenant settings - STRICT filtering
    const options: { value: string; label: string }[] = [];

    // Define class patterns for Primary education level
    const primaryClassPatterns = ["I", "II", "III", "IV", "V", "VI"];

    // Helper to determine which level a class belongs to
    const getClassLevel = (cls: string): "Primary" | "Secondary" | "Tertiary" | null => {
      // Check Primary (Roman numerals I-VI)
      if (primaryClassPatterns.includes(cls)) {
        return "Primary";
      }
      // Check Secondary (JSS, SSS, Form, etc.)
      if (cls.startsWith("JSS") || cls.startsWith("SSS") || cls.startsWith("Form") ||
          /^Grade\s+(7|8|9|10|11|12)$/i.test(cls)) {
        return "Secondary";
      }
      // Check Tertiary (100 Level, 200 Level, Year 1, Level 100, etc.)
      // Matches: "100 Level", "200 Level", "Level 1", "Year 1", contains "Level"
      if (cls.includes("Level") || cls.startsWith("Year") ||
          /^\d{3}\s+Level/i.test(cls) || /^Level\s+\d/i.test(cls)) {
        return "Tertiary";
      }
      return null;
    };

    // Only add classes that match the supported education levels
    classes.forEach(cls => {
      const classLevel = getClassLevel(cls);

      // If we can determine the class level, only include if it's supported
      if (classLevel && settings.supportedLevels.includes(classLevel)) {
        let label = cls;
        if (classLevel === "Primary" && primaryClassPatterns.includes(cls)) {
          label = `Class ${cls}`;
        } else if (classLevel === "Tertiary") {
          label = cls.includes("Level") ? cls : `${cls} Level`;
        }
        options.push({ value: cls, label });
      }
      // If we can't determine the level (unknown format), only include if multi-level or as fallback
      else if (classLevel === null && settings.supportsMultipleLevels) {
        options.push({ value: cls, label: cls });
      }
    });

    return options;
  }, [allStudents, existingChildIds, settings.supportedLevels, settings.supportsMultipleLevels]);

  // Filter students based on class selection, search, and exclude already linked children
  const filteredStudents = useMemo(() => {
    if (!selectedClass) return [];

    return allStudents.filter(
      (student) =>
        !existingChildIds.includes(student.id) &&
        student.classLevel === selectedClass &&
        (searchQuery.trim() === "" ||
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allStudents, existingChildIds, selectedClass, searchQuery]);

  // Relationship options
  const relationshipOptions = [
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Guardian", label: "Guardian" },
    { value: "Sponsor", label: "Sponsor" },
  ];

  const handleLink = async () => {
    if (!selectedStudent) return;
    setIsLinking(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const studentData = allStudents.find((s) => s.id === selectedStudent.id);

    if (studentData) {
      const newChild: ParentChild = {
        id: studentData.id,
        studentId: studentData.id,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        fullName: studentData.name,
        admissionNumber: studentData.id,
        classLevel: studentData.classLevel,
        section: studentData.section,
        status: "Active",
        profilePhoto: `https://i.pravatar.cc/150?u=${studentData.id}`,
        dateOfBirth: "2010-01-01",
        gender: studentData.gender,
        relationship: selectedRelationship as "Father" | "Mother" | "Guardian" | "Sponsor",
      };

      onChildLinked(newChild);
      console.log(`Linked student ${selectedStudent.id} to parent ${parentId}`);
    }

    setIsLinking(false);
    setSelectedStudent(null);
    setSearchQuery("");
    setSelectedClass("");
    setSelectedRelationship("Guardian");
    onClose();
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setSearchQuery("");
    setSelectedClass("");
    setSelectedRelationship("Guardian");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Link Child to Parent"
      subtitle={`Link a student to ${parentName}`}
      icon={<UserPlus className="w-5 h-5" />}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <FormButton variant="secondary" onClick={handleClose}>
            Cancel
          </FormButton>
          <FormButton
            onClick={handleLink}
            icon={isLinking ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
          >
            {isLinking ? "Linking..." : "Link Student"}
          </FormButton>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Step 1: Class/Level Selection */}
        <FormDropdown
          label={`Select ${classLevelLabel}`}
          icon={<GraduationCap className="w-full h-full" />}
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
          value={selectedClass}
          onChange={(value) => {
            setSelectedClass(value);
            setSelectedStudent(null);
          }}
          options={classOptions}
          placeholder={`-- Select ${classLevelLabel.toLowerCase()} --`}
          required
        />

        {/* Step 2: Search within class (optional) - shown only after class is selected */}
        {selectedClass && (
          <FormInput
            label="Search Student (Optional)"
            icon={<Search className="w-full h-full" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
            iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Filter by name or ID..."
          />
        )}

        {/* Student List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
              <Users className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
            </div>
            <span>Select Student</span>
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          </label>

          {selectedClass && (
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-2">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found in {selectedClass}
            </p>
          )}

          <div className="space-y-2 max-h-56 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-2 bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30">
            {!selectedClass ? (
              <div className="text-center py-8">
                <GraduationCap className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 midnight:text-cyan-700 purple:text-pink-700 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Select a {classLevelLabel.toLowerCase()} above to view students
                </p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 midnight:text-cyan-700 purple:text-pink-700 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  {searchQuery ? "No students found matching your search" : "No available students in this class"}
                </p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                    selectedStudent?.id === student.id
                      ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 border-blue-300 dark:border-blue-600 midnight:border-cyan-500 purple:border-pink-500 ring-1 ring-blue-300 dark:ring-blue-600 midnight:ring-cyan-500 purple:ring-pink-500 shadow-md shadow-blue-500/10 dark:shadow-blue-500/20"
                      : "bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-300 dark:hover:border-blue-600 midnight:hover:border-cyan-500/50 purple:hover:border-pink-500/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20"
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    <Image
                      src={`https://i.pravatar.cc/150?u=${student.id}`}
                      alt={student.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                      {student.id} • {student.classLevel}{student.section ? `, ${student.section}` : ""}
                    </p>
                  </div>
                  {selectedStudent?.id === student.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Relationship Selector - shown when a student is selected */}
        {selectedStudent && (
          <FormDropdown
            label="Relationship to Student"
            icon={<Heart className="w-full h-full" />}
            iconBgColor="bg-rose-100 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-rose-900/30"
            iconColor="text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-rose-400"
            value={selectedRelationship}
            onChange={setSelectedRelationship}
            options={relationshipOptions}
            required
          />
        )}
      </div>
    </Modal>
  );
}

// ===== RESET PASSWORD MODAL =====
function ResetPasswordModal({
  isOpen,
  onClose,
  parentName,
  parentEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  parentName: string;
  parentEmail: string;
}) {
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [newPassword] = useState(() => `Parent@${Math.random().toString(36).slice(-6)}`);

  const handleReset = async () => {
    setIsResetting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsResetting(false);
    setResetComplete(true);
  };

  const handleClose = () => {
    setResetComplete(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reset Password"
      subtitle={`Reset password for ${parentName}`}
      icon={<KeyRound className="w-5 h-5" />}
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
          >
            {resetComplete ? "Close" : "Cancel"}
          </button>
          {!resetComplete && (
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              {isResetting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </button>
          )}
        </div>
      }
    >
      {resetComplete ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Password Reset Successful!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            The new password has been sent to <strong>{parentEmail}</strong>
          </p>
          <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">New Password</p>
            <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">{newPassword}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Are you sure?</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  This will generate a new password for this parent account. The new password will be sent to their registered email address.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm text-gray-500 dark:text-gray-400">Parent Name</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{parentName}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{parentEmail}</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== FEE RECORD DETAILS MODAL =====
function FeeRecordDetailsModal({
  isOpen,
  onClose,
  feeRecord,
  money,
  onRecordPayment,
  onGiveDiscount,
  onExtendDueDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  feeRecord: AdminFeeRecord | null;
  money: (amount: number) => string;
  onRecordPayment?: () => void;
  onGiveDiscount?: () => void;
  onExtendDueDate?: () => void;
}) {
  if (!feeRecord) return null;

  const getStatusConfig = (status: AdminFeeRecord["status"]) => {
    const config = {
      paid: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", label: "Paid" },
      partial: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", label: "Partial Payment" },
      pending: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", label: "Pending" },
      overdue: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "Overdue" },
    };
    return config[status];
  };

  const statusConfig = getStatusConfig(feeRecord.status);
  const progressPercentage = feeRecord.amount > 0 ? ((feeRecord.paidAmount / feeRecord.amount) * 100).toFixed(0) : 0;

  // Footer actions for the modal
  const footerContent = feeRecord.status !== "paid" ? (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={() => {
          onClose();
          onExtendDueDate?.();
        }}
        className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-xl transition-all cursor-pointer"
      >
        <CalendarPlus className="w-4 h-4" />
        Extend Due Date
      </button>
      <button
        onClick={() => {
          onClose();
          onGiveDiscount?.();
        }}
        className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 rounded-xl transition-all cursor-pointer border border-rose-200 dark:border-rose-800/50"
      >
        <Percent className="w-4 h-4" />
        Apply Discount
      </button>
      <button
        onClick={() => {
          onClose();
          onRecordPayment?.();
        }}
        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-500/25 transition-all cursor-pointer"
      >
        <BadgeCheck className="w-4 h-4" />
        Record Payment
      </button>
    </div>
  ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fee Record Details"
      subtitle={`${feeRecord.feeType} - ${feeRecord.term}`}
      icon={<CreditCard className="w-5 h-5" />}
      maxWidth="2xl"
      footer={footerContent}
    >
      <div className="space-y-6">
        {/* Top Section: Student Info + Status */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/60 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-700 shadow-lg">
              <Image
                src={`https://i.pravatar.cc/150?u=${feeRecord.childId}`}
                alt={feeRecord.childName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900 dark:text-white">{feeRecord.childName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feeRecord.childClass}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
            {feeRecord.status === "paid" && <CheckCircle2 className="w-3.5 h-3.5" />}
            {feeRecord.status === "partial" && <Clock className="w-3.5 h-3.5" />}
            {feeRecord.status === "pending" && <Clock className="w-3.5 h-3.5" />}
            {feeRecord.status === "overdue" && <AlertCircle className="w-3.5 h-3.5" />}
            {statusConfig.label}
          </span>
        </div>

        {/* Fee Details Grid - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/10 border border-blue-200/60 dark:border-blue-700/40">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Total Amount</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{money(feeRecord.amount)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-900/10 border border-green-200/60 dark:border-green-700/40">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Paid Amount</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{money(feeRecord.paidAmount)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-900/10 border border-amber-200/60 dark:border-amber-700/40">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Balance Due</p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{money(feeRecord.balance)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/20 border border-gray-200/60 dark:border-gray-700/40">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Due Date</p>
            <p className={`text-lg font-bold ${feeRecord.status === "overdue" ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
              {new Date(feeRecord.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Progress Bar - Only show if not fully paid */}
        {feeRecord.status !== "paid" && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/60 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Progress</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{progressPercentage}%</p>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Payment History */}
        {feeRecord.paymentHistory && feeRecord.paymentHistory.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/60 dark:border-gray-700/50">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Payment History</p>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {feeRecord.paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{money(payment.amount)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(payment.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} • {payment.method}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">{payment.receiptNumber}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ===== RECORD PAYMENT MODAL =====
function RecordPaymentModal({
  isOpen,
  onClose,
  feeRecord,
  money,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  feeRecord: AdminFeeRecord | null;
  money: (amount: number) => string;
  onSuccess?: () => void;
}) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && feeRecord) {
      setPaymentAmount(feeRecord.balance.toString());
      setPaymentMethod("");
      setReference("");
      setNotes("");
    }
  }, [isOpen, feeRecord]);

  if (!feeRecord) return null;

  const handleSubmit = async () => {
    if (!paymentAmount || !paymentMethod) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Recording payment:", { paymentAmount, paymentMethod, reference, notes });
    setIsProcessing(false);
    onSuccess?.();
    onClose();
  };

  const paymentMethodOptions = [
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Card", label: "Card Payment" },
    { value: "Cash", label: "Cash" },
    { value: "USSD", label: "USSD" },
    { value: "POS", label: "POS Terminal" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment"
      subtitle={`${feeRecord.feeType} - ${feeRecord.childName}`}
      icon={<Banknote className="w-5 h-5" />}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <FormButton variant="secondary" onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton
            onClick={handleSubmit}
            icon={
              isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <BadgeCheck className="w-4 h-4" />
              )
            }
            className={!paymentAmount || !paymentMethod || isProcessing ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isProcessing ? "Processing..." : "Record Payment"}
          </FormButton>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Fee Summary */}
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">Total Fee</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{money(feeRecord.amount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">Paid</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">{money(feeRecord.paidAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">Balance</p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{money(feeRecord.balance)}</p>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <FormInput
          label="Payment Amount"
          icon={<DollarSign className="w-full h-full" />}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          type="number"
          value={paymentAmount}
          onChange={setPaymentAmount}
          placeholder="Enter amount"
          required
        />

        {/* Payment Method */}
        <FormDropdown
          label="Payment Method"
          icon={<CreditCard className="w-full h-full" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          value={paymentMethod}
          onChange={setPaymentMethod}
          options={paymentMethodOptions}
          placeholder="Select payment method"
          required
        />

        {/* Reference */}
        <FormInput
          label="Reference / Transaction ID"
          icon={<FileText className="w-full h-full" />}
          iconBgColor="bg-gray-100 dark:bg-gray-800/30"
          iconColor="text-gray-600 dark:text-gray-400"
          type="text"
          value={reference}
          onChange={setReference}
          placeholder="e.g., TRX123456789"
        />

        {/* Notes */}
        <FormTextarea
          label="Notes (Optional)"
          icon={<FileText className="w-full h-full" />}
          value={notes}
          onChange={setNotes}
          placeholder="Add any notes about this payment..."
          rows={2}
        />
      </div>
    </Modal>
  );
}

// ===== PAYMENT DETAILS MODAL =====
function PaymentDetailsModal({
  isOpen,
  onClose,
  payment,
  money,
  currencyCode,
  schoolName,
}: {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  money: (amount: number) => string;
  currencyCode: string;
  schoolName: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const getStatusConfig = (status: PaymentRecord["status"]) => {
    const config = {
      completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", label: "Completed" },
      pending: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", label: "Pending" },
      failed: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "Failed" },
    };
    return config[status];
  };

  const getMethodIcon = (method: PaymentRecord["paymentMethod"]) => {
    const icons = {
      "Bank Transfer": "🏦",
      Card: "💳",
      Cash: "💵",
      USSD: "📱",
      POS: "🖥️",
    };
    return icons[method];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `${currencyCode} ${amount.toLocaleString()}`;
  };

  const handleDownload = useCallback(async () => {
    if (!payment) return;
    setIsDownloading(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      // Status colors
      const statusColors: Record<string, { r: number; g: number; b: number; label: string }> = {
        completed: { r: 5, g: 150, b: 105, label: "COMPLETED" },
        pending: { r: 217, g: 119, b: 6, label: "PENDING" },
        failed: { r: 220, g: 38, b: 38, label: "FAILED" },
      };
      const statusConfig = statusColors[payment.status] || statusColors.completed;

      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text("Payment Receipt", pageWidth / 2, y, { align: "center" });
      y += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(schoolName || "School", pageWidth / 2, y, { align: "center" });
      y += 5;

      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(`Receipt #${payment.receiptNumber}`, pageWidth / 2, y, { align: "center" });
      y += 8;

      // Divider
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // Status Banner
      doc.setFillColor(statusConfig.r, statusConfig.g, statusConfig.b);
      doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(statusConfig.label, margin + 8, y + 9);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(formatDate(payment.date), margin + 8, y + 16);

      doc.setFontSize(8);
      doc.text("Amount Paid", pageWidth - margin - 8, y + 7, { align: "right" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(payment.amount), pageWidth - margin - 8, y + 16, { align: "right" });
      y += 28;

      // Details Section
      const detailsStartY = y;
      const cardHeight = 50;
      const cardPadding = 6;

      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(margin, detailsStartY, contentWidth, cardHeight, 2, 2, "FD");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(107, 114, 128);
      doc.text("PAYMENT DETAILS", margin + cardPadding, detailsStartY + 7);

      const details = [
        { label: "Student", value: payment.childName },
        { label: "Fee Type", value: payment.feeType },
        { label: "Payment Method", value: payment.paymentMethod },
        { label: "Reference", value: payment.reference },
      ];

      let detailY = detailsStartY + 15;
      details.forEach((detail) => {
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128);
        doc.text(detail.label, margin + cardPadding, detailY);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 41, 55);
        doc.text(detail.value, pageWidth - margin - cardPadding, detailY, { align: "right" });
        detailY += 8;
      });

      y = detailsStartY + cardHeight + 6;

      // Transaction Reference
      const refBoxHeight = 18;
      doc.setFillColor(31, 41, 55);
      doc.roundedRect(margin, y, contentWidth, refBoxHeight, 2, 2, "F");

      doc.setFillColor(34, 197, 94);
      doc.roundedRect(margin, y, 3, refBoxHeight, 2, 0, "F");
      doc.rect(margin + 1.5, y, 1.5, refBoxHeight, "F");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(156, 163, 175);
      doc.text("RECEIPT NUMBER", margin + 10, y + 7);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(payment.receiptNumber, margin + 10, y + 14);

      y += refBoxHeight + 6;

      // Footer
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(`This is an official receipt from ${schoolName || "School"}`, pageWidth / 2, y + 6, { align: "center" });

      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
        pageWidth / 2,
        y + 12,
        { align: "center" }
      );

      doc.save(`Receipt-${payment.receiptNumber}.pdf`);
    } catch (error) {
      console.warn("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [payment, currencyCode, schoolName]);

  const handlePrint = useCallback(() => {
    if (!payment) return;

    const statusColors = {
      completed: { bg: "#d1fae5", text: "#065f46", label: "Completed" },
      pending: { bg: "#fef3c7", text: "#92400e", label: "Pending" },
      failed: { bg: "#fee2e2", text: "#991b1b", label: "Failed" },
    };
    const status = statusColors[payment.status] || statusColors.completed;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${payment.receiptNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
          .header h1 { font-size: 24px; color: #1f2937; margin-bottom: 5px; }
          .header p { font-size: 14px; color: #6b7280; }
          .status-banner { padding: 20px; border-radius: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; background: ${status.bg}; }
          .status-badge { padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; color: ${status.text}; background: white; }
          .amount-paid .label { font-size: 12px; color: #6b7280; }
          .amount-paid .value { font-size: 28px; font-weight: 700; color: ${status.text}; }
          .details-card { padding: 20px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 20px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .detail-row .label { color: #6b7280; }
          .detail-row .value { font-weight: 600; color: #1f2937; }
          .footer { text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Payment Receipt</h1>
          <p>${schoolName || "School"}</p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 5px;">Receipt #${payment.receiptNumber}</p>
        </div>
        <div class="status-banner">
          <div>
            <span class="status-badge">${status.label}</span>
            <p style="margin-top: 8px; font-size: 13px; color: ${status.text};">${formatDate(payment.date)}</p>
          </div>
          <div class="amount-paid" style="text-align: right;">
            <div class="label">Amount Paid</div>
            <div class="value">${money(payment.amount)}</div>
          </div>
        </div>
        <div class="details-card">
          <div class="detail-row"><span class="label">Student</span><span class="value">${payment.childName}</span></div>
          <div class="detail-row"><span class="label">Fee Type</span><span class="value">${payment.feeType}</span></div>
          <div class="detail-row"><span class="label">Payment Method</span><span class="value">${payment.paymentMethod}</span></div>
          <div class="detail-row"><span class="label">Reference</span><span class="value">${payment.reference}</span></div>
          <div class="detail-row"><span class="label">Receipt Number</span><span class="value">${payment.receiptNumber}</span></div>
        </div>
        <div class="footer">
          <p>This is an official receipt from <strong>${schoolName || "School"}</strong></p>
          <p style="margin-top: 5px;">Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }, [payment, money, schoolName]);

  if (!payment) return null;

  const statusConfig = getStatusConfig(payment.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Details"
      subtitle={payment.feeType}
      icon={<CreditCard className="w-5 h-5" />}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
            {payment.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
            {payment.status === "pending" && <Clock className="w-3.5 h-3.5" />}
            {payment.status === "failed" && <XCircle className="w-3.5 h-3.5" />}
            {statusConfig.label}
          </span>
        </div>

        {/* Amount */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/30 text-center">
          <p className="text-[10px] font-medium text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">Amount Paid</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{money(payment.amount)}</p>
        </div>

        {/* Details Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Student</span>
            </div>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">{payment.childName}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
            </div>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {new Date(payment.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Payment Method</span>
            </div>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {getMethodIcon(payment.paymentMethod)} {payment.paymentMethod}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Reference</span>
            </div>
            <span className="text-xs font-mono font-semibold text-gray-900 dark:text-white">{payment.reference}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Receipt Number</span>
            </div>
            <span className="text-xs font-mono font-semibold text-gray-900 dark:text-white">{payment.receiptNumber}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Download Receipt
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-xl transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ===== GIVE DISCOUNT MODAL =====
function GiveDiscountModal({
  isOpen,
  onClose,
  parentName,
  feeRecords,
  money,
}: {
  isOpen: boolean;
  onClose: () => void;
  parentName: string;
  feeRecords: AdminFeeRecord[];
  money: (amount: number) => string;
}) {
  const [selectedFee, setSelectedFee] = useState<string>("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [reason, setReason] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const unpaidFees = feeRecords.filter((f) => f.status !== "paid");

  // Create fee options for dropdown
  const feeOptions = unpaidFees.map((fee) => ({
    value: fee.id,
    label: `${fee.childName} - ${fee.feeType} (${money(fee.balance)} outstanding)`,
  }));

  const handleApply = async () => {
    if (!selectedFee || !discountValue) return;
    setIsApplying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Applying ${discountType} discount of ${discountValue} to fee ${selectedFee}`);
    setIsApplying(false);
    setSelectedFee("");
    setDiscountValue("");
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Give Discount"
      subtitle={`Apply a discount for ${parentName}`}
      icon={<Percent className="w-5 h-5" />}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <FormButton variant="secondary" onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton
            onClick={handleApply}
            icon={
              isApplying ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Percent className="w-4 h-4" />
              )
            }
            className={!selectedFee || !discountValue || isApplying ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isApplying ? "Applying..." : "Apply Discount"}
          </FormButton>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Fee Selection */}
        <FormDropdown
          label="Select Fee"
          icon={<CreditCard className="w-full h-full" />}
          iconBgColor="bg-rose-100 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-rose-900/30"
          iconColor="text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-rose-400"
          value={selectedFee}
          onChange={setSelectedFee}
          options={feeOptions}
          placeholder="Select a fee to discount"
          required
        />

        {/* Discount Type - Custom Toggle */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
              <div className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">
                <Percent className="w-full h-full" />
              </div>
            </div>
            <span>Discount Type</span>
            <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDiscountType("percentage")}
              className={`flex-1 group/btn relative overflow-hidden px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                discountType === "percentage"
                  ? "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 midnight:from-rose-900/30 midnight:to-pink-900/30 purple:from-rose-900/30 purple:to-pink-900/30 border-rose-400 dark:border-rose-500 midnight:border-rose-500 purple:border-rose-500 text-rose-700 dark:text-rose-300 midnight:text-rose-300 purple:text-rose-300 shadow-md shadow-rose-500/10"
                  : "bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-900/10"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Percent className={`w-4 h-4 ${discountType === "percentage" ? "text-rose-600 dark:text-rose-400" : "text-gray-400"}`} />
                <span>Percentage (%)</span>
              </div>
              {discountType === "percentage" && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setDiscountType("fixed")}
              className={`flex-1 group/btn relative overflow-hidden px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                discountType === "fixed"
                  ? "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 midnight:from-rose-900/30 midnight:to-pink-900/30 purple:from-rose-900/30 purple:to-pink-900/30 border-rose-400 dark:border-rose-500 midnight:border-rose-500 purple:border-rose-500 text-rose-700 dark:text-rose-300 midnight:text-rose-300 purple:text-rose-300 shadow-md shadow-rose-500/10"
                  : "bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-900/10"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CreditCard className={`w-4 h-4 ${discountType === "fixed" ? "text-rose-600 dark:text-rose-400" : "text-gray-400"}`} />
                <span>Fixed Amount</span>
              </div>
              {discountType === "fixed" && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Discount Value */}
        <FormInput
          label={discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
          icon={discountType === "percentage" ? <Percent className="w-full h-full" /> : <CreditCard className="w-full h-full" />}
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
          value={discountValue}
          onChange={setDiscountValue}
          placeholder={discountType === "percentage" ? "e.g., 10" : "e.g., 5000"}
          type="number"
          leftIcon={
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              {discountType === "percentage" ? "%" : "₦"}
            </span>
          }
          leftIconBg="bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800"
          required
        />

        {/* Reason */}
        <FormTextarea
          label="Reason"
          icon={<FileText className="w-full h-full" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400"
          value={reason}
          onChange={setReason}
          placeholder="Enter reason for discount..."
          rows={2}
          optional
        />

        {/* Info Box */}
        {selectedFee && discountValue && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 midnight:from-rose-900/20 midnight:to-pink-900/20 purple:from-rose-900/20 purple:to-pink-900/20 border border-rose-200/50 dark:border-rose-700/30 midnight:border-rose-700/30 purple:border-rose-700/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-800/30 flex items-center justify-center flex-shrink-0">
                <Percent className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-800 dark:text-rose-200 midnight:text-rose-200 purple:text-rose-200">
                  Discount Preview
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-300 midnight:text-rose-300 purple:text-rose-300 mt-0.5">
                  {discountType === "percentage"
                    ? `${discountValue}% discount will be applied to the selected fee`
                    : `₦${Number(discountValue).toLocaleString()} discount will be applied to the selected fee`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ===== EXTEND DUE DATE MODAL =====
function ExtendDueDateModal({
  isOpen,
  onClose,
  parentName,
  feeRecords,
  money,
}: {
  isOpen: boolean;
  onClose: () => void;
  parentName: string;
  feeRecords: AdminFeeRecord[];
  money: (amount: number) => string;
}) {
  const [selectedFee, setSelectedFee] = useState<string>("");
  const [newDueDate, setNewDueDate] = useState("");
  const [reason, setReason] = useState("");
  const [isExtending, setIsExtending] = useState(false);

  const unpaidFees = feeRecords.filter((f) => f.status !== "paid");

  // Create fee options for dropdown
  const feeOptions = unpaidFees.map((fee) => ({
    value: fee.id,
    label: `${fee.childName} - ${fee.feeType} (${money(fee.balance)} - Due: ${fee.dueDate})`,
  }));

  // Get selected fee details
  const selectedFeeDetails = unpaidFees.find((f) => f.id === selectedFee);

  const handleExtend = async () => {
    if (!selectedFee || !newDueDate) return;
    setIsExtending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Extending due date for fee ${selectedFee} to ${newDueDate}`);
    setIsExtending(false);
    setSelectedFee("");
    setNewDueDate("");
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Extend Due Date"
      subtitle={`Extend payment due date for ${parentName}`}
      icon={<CalendarPlus className="w-5 h-5" />}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <FormButton variant="secondary" onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton
            onClick={handleExtend}
            icon={
              isExtending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CalendarPlus className="w-4 h-4" />
              )
            }
            className={!selectedFee || !newDueDate || isExtending ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isExtending ? "Extending..." : "Extend Due Date"}
          </FormButton>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Fee Selection */}
        <FormDropdown
          label="Select Fee"
          icon={<CreditCard className="w-full h-full" />}
          iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
          iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
          value={selectedFee}
          onChange={setSelectedFee}
          options={feeOptions}
          placeholder="Select a fee to extend"
          required
        />

        {/* Current Due Date Info - Show when fee is selected */}
        {selectedFeeDetails && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Current Due Date: <span className="font-bold">{selectedFeeDetails.dueDate}</span>
              </span>
              {selectedFeeDetails.status === "overdue" && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                  OVERDUE
                </span>
              )}
            </div>
          </div>
        )}

        {/* New Due Date */}
        <FormInput
          label="New Due Date"
          icon={<CalendarPlus className="w-full h-full" />}
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400"
          value={newDueDate}
          onChange={setNewDueDate}
          type="date"
          placeholder="Select new due date"
          required
        />

        {/* Reason */}
        <FormTextarea
          label="Reason"
          icon={<FileText className="w-full h-full" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400"
          value={reason}
          onChange={setReason}
          placeholder="Enter reason for extension..."
          rows={2}
          optional
        />

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 midnight:from-indigo-900/20 midnight:to-violet-900/20 purple:from-indigo-900/20 purple:to-violet-900/20 border border-indigo-200/50 dark:border-indigo-700/30 midnight:border-indigo-700/30 purple:border-indigo-700/30">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 midnight:text-indigo-200 purple:text-indigo-200">
                Important Note
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-300 midnight:text-indigo-300 purple:text-indigo-300 mt-0.5">
                Extending the due date will update the fee status and remove any overdue penalties that may have been applied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
