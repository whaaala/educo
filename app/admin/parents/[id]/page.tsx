"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import FormButton from "@/components/shared/FormButton";

// Tab type definition for parent detail page
type ParentTabType = "details" | "meetings" | "leave" | "fees" | "communications" | "events";

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
  const [meetings, setMeetings] = useState<ParentTeacherMeeting[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ParentTabType>("details");
  const [isLinkChildModalOpen, setIsLinkChildModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isExtendDueDateModalOpen, setIsExtendDueDateModalOpen] = useState(false);

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
          setMeetings(getMeetingsByParentId(parentId));
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

  if (isLoading || isLoadingData || !parent) {
    return (
      <MainLayout>
        <PageLoader isLoading={true} loadingText="Loading Parent Details" />
      </MainLayout>
    );
  }

  const fullName = `${parent.firstName} ${parent.lastName}`;

  // Define tabs for parent detail page
  const tabs = [
    { id: "details" as ParentTabType, label: "Parent Details", icon: User },
    { id: "meetings" as ParentTabType, label: "Meetings", icon: Users },
    { id: "leave" as ParentTabType, label: "Leave Requests", icon: CalendarX },
    { id: "fees" as ParentTabType, label: "Fees & Payments", icon: CreditCard },
    { id: "communications" as ParentTabType, label: "Communications", icon: MessageSquare },
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
                    <AdminActionsCard
                      parent={parent}
                      parentId={parentId}
                      onEdit={() => router.push(`/admin/parents/edit/${parentId}`)}
                      onResetPassword={() => setIsResetPasswordModalOpen(true)}
                      onStatement={() => setActiveTab("fees")}
                      onToggleStatus={() => console.log("Toggle status")}
                      onMessage={() => console.log("Send message")}
                      onDelete={() => setIsDeleteModalOpen(true)}
                      onGiveDiscount={() => setIsDiscountModalOpen(true)}
                      onExtendDueDate={() => setIsExtendDueDateModalOpen(true)}
                    />
                  </div>
                </>
              )}

              {activeTab === "meetings" && (
                <MeetingsSection meetings={meetings} />
              )}

              {activeTab === "leave" && (
                <LeaveRequestsSection leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} />
              )}

              {activeTab === "fees" && (
                <>
                  <FeesSection feeRecords={feeRecords} money={money} />
                  <PaymentHistorySection payments={payments} money={money} />
                </>
              )}

              {activeTab === "communications" && (
                <CommunicationsSection communications={communications} />
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
    </MainLayout>
  );
}

// Parent Sidebar Component
function ParentSidebar({
  parent,
  fullName,
  feeStats,
  money,
}: {
  parent: AdminParent;
  fullName: string;
  feeStats: { total: number; paid: number; outstanding: number; overdue: number };
  money: (amount: number) => string;
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

// Fees Section - Compact table display
function FeesSection({
  feeRecords,
  money,
}: {
  feeRecords: AdminFeeRecord[];
  money: (amount: number) => string;
}) {
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

  const columns: ColumnConfig<AdminFeeRecord>[] = [
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
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (record) => (
        <span className="text-xs font-bold text-gray-900 dark:text-white">{money(record.amount)}</span>
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
  ];

  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <DataTable<AdminFeeRecord>
        data={feeRecords}
        columns={columns}
        title="Fee Records"
        searchPlaceholder="Search fee records..."
        showSearch={true}
        defaultItemsPerPage={5}
        getRowKey={(item) => item.id}
        emptyMessage="No fee records found"
        enablePagination={true}
        enableItemsPerPage={false}
      />
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

// Admin Actions Card with functional handlers
function AdminActionsCard({
  parent,
  parentId,
  onEdit,
  onResetPassword,
  onStatement,
  onToggleStatus,
  onMessage,
  onDelete,
  onGiveDiscount,
  onExtendDueDate,
}: {
  parent: AdminParent;
  parentId: string;
  onEdit: () => void;
  onResetPassword: () => void;
  onStatement: () => void;
  onToggleStatus: () => void;
  onMessage: () => void;
  onDelete: () => void;
  onGiveDiscount: () => void;
  onExtendDueDate: () => void;
}) {
  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-3 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 transition-all cursor-pointer group"
          >
            <Edit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">Edit</span>
          </button>
          <button
            onClick={onResetPassword}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/30 transition-all cursor-pointer group"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400">Reset Password</span>
          </button>
          <button
            onClick={onStatement}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 transition-all cursor-pointer group"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Statement</span>
          </button>
          <button
            onClick={onToggleStatus}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-100 dark:border-amber-800/30 transition-all cursor-pointer group"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">{parent.status === "Active" ? "Deactivate" : "Activate"}</span>
          </button>
          <button
            onClick={onMessage}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 border border-cyan-100 dark:border-cyan-800/30 transition-all cursor-pointer group"
          >
            <Send className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">Message</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-100 dark:border-red-800/30 transition-all cursor-pointer group"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-red-700 dark:text-red-400">Delete</span>
          </button>
          {/* Fee Management Actions */}
          <button
            onClick={onGiveDiscount}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 border border-pink-100 dark:border-pink-800/30 transition-all cursor-pointer group"
          >
            <Percent className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-pink-700 dark:text-pink-400">Give Discount</span>
          </button>
          <button
            onClick={onExtendDueDate}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/30 transition-all cursor-pointer group"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">Extend Due Date</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== MEETINGS SECTION =====
function MeetingsSection({ meetings }: { meetings: ParentTeacherMeeting[] }) {
  const [showAll, setShowAll] = useState(false);
  const upcomingMeetings = meetings.filter((m) => m.status === "upcoming");
  const pastMeetings = meetings.filter((m) => m.status !== "upcoming").slice(0, 5);
  const displayMeetings = showAll ? meetings : [...upcomingMeetings, ...pastMeetings].slice(0, 6);

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
            <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{meeting.subject}</span>
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
                    <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                      📍 {meeting.location}
                    </div>
                    {meeting.outcome && (
                      <div className="text-[10px] text-green-600 dark:text-green-400 mt-1 italic">{meeting.outcome}</div>
                    )}
                  </div>
                  {meeting.status === "upcoming" && (
                    <button className="px-2 py-1 text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                      Cancel
                    </button>
                  )}
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
  const pendingRequests = leaveRequests.filter((r) => r.status === "pending");
  const displayRequests = showAll ? leaveRequests : leaveRequests.slice(0, 5);

  const handleApprove = (requestId: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "approved" as const, processedAt: new Date().toISOString(), processedBy: "Admin" }
          : r
      )
    );
  };

  const handleReject = (requestId: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "rejected" as const, processedAt: new Date().toISOString(), processedBy: "Admin", adminNotes: "Request not approved." }
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
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{request.reason}</p>
                    {request.processedBy && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 italic">
                        Processed by {request.processedBy}
                      </p>
                    )}
                  </div>
                  {request.status === "pending" && (
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-2.5 py-1.5 text-[10px] font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="px-2.5 py-1.5 text-[10px] font-semibold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
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
  );
}

// ===== PAYMENT HISTORY SECTION =====
function PaymentHistorySection({
  payments,
  money,
}: {
  payments: PaymentRecord[];
  money: (amount: number) => string;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayPayments = showAll ? payments : payments.slice(0, 5);

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

  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
            Payment History ({payments.length})
          </h3>
          <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            Export
          </button>
        </div>

        {displayPayments.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">No payment records</p>
        ) : (
          <div className="space-y-2">
            {displayPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 midnight:bg-gray-800/20 purple:bg-gray-800/20 border border-gray-200/40 dark:border-gray-700/40 midnight:border-gray-700/40 purple:border-gray-700/40 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-500 purple:hover:border-gray-500 hover:shadow-gray-500/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{payment.feeType}</span>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                      <span>{payment.childName}</span>
                      <span>•</span>
                      <span>{new Date(payment.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span>•</span>
                      <span>{getMethodIcon(payment.paymentMethod)} {payment.paymentMethod}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      Ref: {payment.reference}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">{money(payment.amount)}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{payment.receiptNumber}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {payments.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAll ? "Show Less" : `Show All ${payments.length} Payments`}
          </button>
        )}
      </div>
    </div>
  );
}

// ===== COMMUNICATIONS SECTION =====
function CommunicationsSection({ communications }: { communications: CommunicationRecord[] }) {
  const [showAll, setShowAll] = useState(false);
  const openComms = communications.filter((c) => c.status === "open" || c.status === "in_progress");
  const displayComms = showAll ? communications : communications.slice(0, 4);

  const getTypeBadge = (type: CommunicationRecord["type"]) => {
    const config = {
      complaint: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
      inquiry: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
      feedback: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
      request: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
      meeting_request: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
    };
    const c = config[type];
    const label = type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>{label}</span>;
  };

  const getStatusBadge = (status: CommunicationRecord["status"]) => {
    const config = {
      open: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300" },
      in_progress: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
      resolved: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
      closed: { bg: "bg-gray-100 dark:bg-gray-700/30", text: "text-gray-600 dark:text-gray-400" },
    };
    const c = config[status];
    const label = status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>{label}</span>;
  };

  const getPriorityDot = (priority: CommunicationRecord["priority"]) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return <span className={`w-2 h-2 rounded-full ${colors[priority]}`} title={`${priority} priority`}></span>;
  };

  return (
    <div className="group bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Communications ({communications.length})
          </h3>
          {openComms.length > 0 && (
            <span className="px-2 py-1 text-[10px] font-bold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              {openComms.length} Open
            </span>
          )}
        </div>

        {displayComms.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">No communications</p>
        ) : (
          <div className="space-y-2">
            {displayComms.map((comm) => (
              <div
                key={comm.id}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                  comm.status === "open" || comm.status === "in_progress"
                    ? "bg-yellow-50/50 dark:bg-yellow-900/10 midnight:bg-yellow-900/10 purple:bg-yellow-900/10 border-yellow-200/50 dark:border-yellow-800/30 midnight:border-yellow-800/30 purple:border-yellow-800/30 hover:border-yellow-300 dark:hover:border-yellow-700 midnight:hover:border-yellow-600 purple:hover:border-yellow-600 hover:shadow-yellow-500/10 dark:hover:shadow-yellow-500/20 midnight:hover:shadow-yellow-500/20 purple:hover:shadow-yellow-500/20"
                    : "bg-gray-50/50 dark:bg-gray-800/20 midnight:bg-gray-800/20 purple:bg-gray-800/20 border-gray-200/40 dark:border-gray-700/40 midnight:border-gray-700/40 purple:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-500 purple:hover:border-gray-500 hover:shadow-gray-500/10"
                }`}
              >
                <div className="flex items-start gap-2">
                  {getPriorityDot(comm.priority)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{comm.subject}</span>
                      {getTypeBadge(comm.type)}
                      {getStatusBadge(comm.status)}
                    </div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2">{comm.message}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                      <span>{new Date(comm.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      {comm.assignedTo && <span>• Assigned to {comm.assignedTo}</span>}
                      {comm.responses.length > 0 && <span>• {comm.responses.length} responses</span>}
                    </div>
                  </div>
                  <button className="px-2 py-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {communications.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAll ? "Show Less" : `Show All ${communications.length} Communications`}
          </button>
        )}
      </div>
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedFee || !discountValue || isApplying}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-2"
          >
            {isApplying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Percent className="w-4 h-4" />
                Apply Discount
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Fee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Fee</label>
          <select
            value={selectedFee}
            onChange={(e) => setSelectedFee(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white"
          >
            <option value="">Select a fee to discount</option>
            {unpaidFees.map((fee) => (
              <option key={fee.id} value={fee.id}>
                {fee.childName} - {fee.feeType} ({money(fee.balance)} outstanding)
              </option>
            ))}
          </select>
        </div>

        {/* Discount Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setDiscountType("percentage")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                discountType === "percentage"
                  ? "bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Percentage (%)
            </button>
            <button
              onClick={() => setDiscountType("fixed")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                discountType === "fixed"
                  ? "bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Fixed Amount
            </button>
          </div>
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {discountType === "percentage" ? "%" : "₦"}
            </span>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percentage" ? "e.g., 10" : "e.g., 5000"}
              className="w-full pl-8 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason (Optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for discount..."
            rows={2}
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white resize-none"
          />
        </div>
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExtend}
            disabled={!selectedFee || !newDueDate || isExtending}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-2"
          >
            {isExtending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Extending...
              </>
            ) : (
              <>
                <CalendarPlus className="w-4 h-4" />
                Extend Due Date
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Fee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Fee</label>
          <select
            value={selectedFee}
            onChange={(e) => setSelectedFee(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
          >
            <option value="">Select a fee to extend</option>
            {unpaidFees.map((fee) => (
              <option key={fee.id} value={fee.id}>
                {fee.childName} - {fee.feeType} ({money(fee.balance)} - Due: {fee.dueDate})
              </option>
            ))}
          </select>
        </div>

        {/* New Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Due Date</label>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason (Optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for extension..."
            rows={2}
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            <strong>Note:</strong> Extending the due date will update the fee status and remove any overdue penalties that may have been applied.
          </p>
        </div>
      </div>
    </Modal>
  );
}
