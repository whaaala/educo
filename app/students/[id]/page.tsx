"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAttendance } from "@/contexts/AttendanceContext";
import { DashboardPage } from "@/components/pages";
import { getExtendedStudentDataById } from "@/lib/mockStudents";
import { useTranscripts } from "@/contexts/TranscriptContext";
import {
  GraduationCap,
  Calendar,
  FileText,
  BookOpen,
  Clock,
  KeyRound,
  Search,
  Trash2,
} from "lucide-react";
import type { ExtendedStudentData } from "@/lib/mockStudents";
import StudentProfileCard from "@/components/students/StudentProfileCard";
import PrimaryContactInfoCard from "@/components/students/PrimaryContactInfoCard";
import SiblingInformationCard from "@/components/students/SiblingInformationCard";
import HostelTransportCard from "@/components/students/HostelTransportCard";
import ParentsInformationCard from "@/components/students/ParentsInformationCard";
import AddressCard from "@/components/students/AddressCard";
import DocumentsCard from "@/components/students/DocumentsCard";
import PreviousSchoolDetailsCard from "@/components/students/PreviousSchoolDetailsCard";
import MedicalHistoryCard from "@/components/students/MedicalHistoryCard";
import BankDetailsCard from "@/components/students/BankDetailsCard";
import OtherInfoCard from "@/components/students/OtherInfoCard";
import CollectFeesModal from "@/components/shared/CollectFeesModal";
import ActionModal from "@/components/shared/ActionModal";
import ActionButton from "@/components/shared/ActionButton";
import SecondaryButton from "@/components/shared/SecondaryButton";
import CurrencyIcon from "@/components/shared/CurrencyIcon";
import TimeTable from "@/components/students/TimeTable";
import LoginDetailsModal from "@/components/students/LoginDetailsModal";
import LeaveStatsCard from "@/components/students/LeaveStatsCard";
import ApplyLeaveModal from "@/components/students/ApplyLeaveModal";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import AddButton from "@/components/shared/AddButton";
import AttendanceStatsCard from "@/components/students/AttendanceStatsCard";
import AttendanceCalendar from "@/components/students/AttendanceCalendar";
import AttendanceByClass from "@/components/students/AttendanceByClass";
import FeesManagement from "@/components/students/FeesManagement";
import MobileDropdown from "@/components/shared/MobileDropdown";
import CustomDropdown from "@/components/shared/CustomDropdown";
import ExamResults from "@/components/students/ExamResults";
import { getAttendanceMode } from "@/components/settings/AttendanceSettings";
import { Edit, Shield } from "lucide-react";
import StudentDisciplineManagement from "@/components/students/StudentDisciplineManagement";
import RequestTranscriptButton from "@/components/shared/RequestTranscriptButton";
import TranscriptPaymentModal from "@/components/transcript/TranscriptPaymentModal";
import TranscriptAcknowledgmentModal from "@/components/transcript/TranscriptAcknowledgmentModal";
import { generateTranscriptRequest, getEstimatedDeliveryDate } from "@/utils/transcriptRequestGenerator";
import { TranscriptRequest } from "@/types/transcript";
import TransferRequestModal, { TransferFormData } from "@/components/student/TransferRequestModal";
import TransferSuccessModal, { createTransferField } from "@/components/shared/TransferSuccessModal";
import { TRANSFER_REASONS } from "@/types/transfer";
import { ArrowRightLeft, School } from "lucide-react";
import { useTransfers } from "@/contexts/TransferContext";
import TransferHistoryCard from "@/components/students/TransferHistoryCard";
/** A tab's icon: usually a lucide icon, sometimes a small local component (the currency glyph), so the
 *  type is what both of them ARE — a component taking a className. */
type TabIcon = React.ComponentType<{ className?: string }>;

type TabType = "details" | "timetable" | "attendance" | "fees" | "exam" | "library" | "discipline";

// CACHE BUSTER: 2025-11-11-20:25
export default function ViewStudentPage() {
  const params = useParams();
  const studentId = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get navigation source from query params
  const fromSource = searchParams.get("from");
  const parentId = searchParams.get("parentId");
  const parentName = searchParams.get("parentName");
  const { addTransferRequest } = useTransfers();
  const { addTranscriptRequest } = useTranscripts();
  const [studentData, setStudentData] = useState<ExtendedStudentData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [isLoginDetailsModalOpen, setIsLoginDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAcknowledgmentModalOpen, setIsAcknowledgmentModalOpen] = useState(false);
  const [pendingTranscriptRequest, setPendingTranscriptRequest] = useState<TranscriptRequest | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isTransferSuccessModalOpen, setIsTransferSuccessModalOpen] = useState(false);
  const [transferSuccessData, setTransferSuccessData] = useState<TransferFormData | null>(null);

  useEffect(() => {
    if (studentId) {
      try {
        const data = getExtendedStudentDataById(studentId);
        if (data) {
          setStudentData(data);
        } else {
          router.push("/students");
        }
      } catch (error) {
        console.error("Error loading student data:", error);
        router.push("/students");
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [studentId, router]);

  // Handler for Request Transcript button click
  const handleRequestTranscript = () => {
    // Generate transcript request
    const transcriptRequest = generateTranscriptRequest({
      id: studentData?.admissionNumber || studentId,
      name: `${studentData?.firstName || ""} ${studentData?.lastName || ""}`.trim(),
      admissionNumber: studentData?.admissionNumber || "",
      class: studentData?.classLevel || "",
      email: studentData?.email,
      phone: studentData?.phone,
      profilePhoto: typeof studentData?.profilePhoto === "string" ? studentData.profilePhoto : undefined,
    });

    setPendingTranscriptRequest(transcriptRequest);
    setIsPaymentModalOpen(true);
  };

  // Handler for payment completion
  const handlePaymentComplete = () => {
    setIsPaymentModalOpen(false);
    setIsAcknowledgmentModalOpen(true);

    // Add transcript request to context (which syncs to localStorage)
    if (pendingTranscriptRequest) {
      console.log("Transcript Request Created:", pendingTranscriptRequest);
      addTranscriptRequest(pendingTranscriptRequest);
    }
  };

  // Handler for closing acknowledgment modal
  const handleAcknowledgmentClose = () => {
    setIsAcknowledgmentModalOpen(false);
    setPendingTranscriptRequest(null);
  };

  // Handler for transfer submit
  const handleTransferSubmit = (transferData: TransferFormData) => {
    if (!studentData) return;

    console.log("=== TRANSFER REQUEST DEBUG ===");
    console.log("Student Data:", {
      studentId: studentData.admissionNumber || studentId,
      studentName: `${studentData.firstName} ${studentData.lastName}`.trim(),
      studentAdmissionNumber: studentData.admissionNumber || studentId,
      studentClass: studentData.classLevel || "",
      studentSection: studentData.section || "",
    });
    console.log("Transfer Data:", transferData);

    // Add the transfer request to global state
    addTransferRequest(
      {
        studentId: studentData.admissionNumber || studentId,
        studentName: `${studentData.firstName} ${studentData.lastName}`.trim(),
        studentAdmissionNumber: studentData.admissionNumber || studentId,
        studentClass: studentData.classLevel || "",
        studentSection: studentData.section || "",
      },
      transferData
    );

    console.log("Transfer request added to context");

    // Show success modal
    setTransferSuccessData(transferData);
    setIsTransferModalOpen(false);
    setIsTransferSuccessModalOpen(true);
  };

  if (isLoadingData || !studentData) {
    return (
      <DashboardPage
        title="Student Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Students", href: "/students" },
          { label: "Student Details", isActive: true },
        ]}
        loadingText="Loading Student Details"
      />
    );
  }

  const fullName = `${studentData.firstName || ""} ${studentData.middleName || ""} ${studentData.lastName || ""}`.trim();
  const profilePhotoUrl = typeof studentData.profilePhoto === "string" ? studentData.profilePhoto : null;
  const fatherPhotoUrl = typeof studentData.fatherPhoto === "string" ? studentData.fatherPhoto : null;
  const motherPhotoUrl = typeof studentData.motherPhoto === "string" ? studentData.motherPhoto : null;
  const guardianPhotoUrl = typeof studentData.guardianPhoto === "string" ? studentData.guardianPhoto : null;

  // Calculate status based on outstanding amount and due date
  const calculateStatus = (outstandingAmount: string, dueDate?: string): "Paid" | "Unpaid" | "Balanced" | "Due" | "Overdue" => {
    const amount = parseFloat(outstandingAmount) || 0;
    
    // If no outstanding amount, account is balanced
    if (amount === 0) {
      return "Balanced";
    }
    
    // If there's a due date, check if it's due or overdue
    if (dueDate) {
      try {
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        due.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // If due date is more than 7 days past → "Overdue"
        if (daysDiff < -7) {
          return "Overdue";
        }
        // If due date is within a week (up to 7 days past or future) → "Due"
        if (daysDiff >= -7 && daysDiff <= 7) {
          return "Due";
        }
        // If due date is more than a week in the future → "Unpaid"
        if (daysDiff > 7) {
          return "Unpaid";
        }
      } catch (error) {
        console.error("Error parsing due date:", error);
      }
    }
    
    // Default to Unpaid if there's an outstanding amount but no valid due date
    return "Unpaid";
  };

  // Map student data for the fees modal
  const getStudentForModal = () => {
    if (!studentData) return null;
    
    // You can update these with actual values from your data
    const outstandingAmount = "0"; // Get from actual fee data
    const dueDate = undefined; // Get from actual fee data, format: "YYYY-MM-DD" or Date string
    
    const status = calculateStatus(outstandingAmount, dueDate);
    
    return {
      id: studentData.admissionNumber || studentId,
      name: fullName,
      class: studentData.class || "N/A",
      avatar: profilePhotoUrl || undefined,
      totalOutstanding: outstandingAmount,
      lastDate: studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString() : "N/A",
      dueDate,
      status,
    };
  };

  const handleAddFees = () => {
    setIsFeesModalOpen(true);
  };

  const handleDeleteStudent = () => {
    // This would typically call an API to delete the student
    console.log('Deleting student:', studentId);
    // After successful deletion, redirect to students list
    // In a real implementation:
    // await deleteStudent(studentId);
    router.push('/students');
  };

  const tabs = [
    { id: "details" as TabType, label: "Student Details", icon: GraduationCap },
    { id: "timetable" as TabType, label: "Time Table", icon: Clock },
    { id: "attendance" as TabType, label: "Leave & Attendance", icon: Calendar },
    { id: "fees" as TabType, label: "Fees", icon: CurrencyIcon },
    { id: "exam" as TabType, label: "Exam & Results", icon: FileText },
    { id: "discipline" as TabType, label: "Discipline", icon: Shield },
    { id: "library" as TabType, label: "Library", icon: BookOpen },
  ];

  return (
    <DashboardPage
      title="Student Details"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Students", href: "/students" },
        { label: "Student Details", isActive: true },
      ]}
      loadingText="Loading Student Details"
      afterStats={
        <div className="mt-6">
          {/* Header */}
          <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-ink mb-1">
                Student Details
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 flex-wrap">
                <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                {fromSource === "parent" && parentId ? (
                  <>
                    <Link href="/admin/parents" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                      Parents
                    </Link>
                    <span>/</span>
                    <Link href={`/admin/parents/${parentId}`} className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors max-w-[120px] sm:max-w-none truncate inline-block">
                      {parentName || "Parent Details"}
                    </Link>
                    <span>/</span>
                  </>
                ) : (
                  <>
                    <Link href="/students" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                      Students
                    </Link>
                    <span>/</span>
                  </>
                )}
                <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium max-w-[100px] sm:max-w-none truncate inline-block">
                  {studentData ? `${studentData.firstName} ${studentData.lastName}` : "Student Details"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Primary Actions */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <ActionButton
                  label="Edit Student"
                  icon={Edit}
                  onClick={() => router.push(`/students/edit/${studentId}`)}
                />
                <SecondaryButton
                  label="Transfer Student"
                  icon={ArrowRightLeft}
                  onClick={() => setIsTransferModalOpen(true)}
                />
                <RequestTranscriptButton
                  onClick={handleRequestTranscript}
                />
                <SecondaryButton
                  label="Login Details"
                  icon={KeyRound}
                  onClick={() => setIsLoginDetailsModalOpen(true)}
                />
              </div>

              {/* Destructive Action - Separated */}
              <div className="w-full sm:w-auto sm:ml-auto">
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 border border-red-200 dark:border-red-800 midnight:border-red-700 purple:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 midnight:hover:bg-red-900/30 purple:hover:bg-red-900/30 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Student</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-6 items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <StudentSidebar
              studentData={studentData}
              fullName={fullName}
              profilePhotoUrl={profilePhotoUrl}
              onAddFees={handleAddFees}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full flex flex-col">
            <StudentTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <div className="mt-2 lg:mt-6">
              {activeTab === "details" && (
                <StudentDetailsTab
                  studentData={studentData}
                  studentId={studentData.admissionNumber || studentId}
                  fatherPhotoUrl={fatherPhotoUrl}
                  motherPhotoUrl={motherPhotoUrl}
                  guardianPhotoUrl={guardianPhotoUrl}
                />
              )}
              {activeTab === "timetable" && <TimetableTab timetable={studentData.timetable} />}
              {activeTab === "attendance" && <AttendanceTab studentId={studentId} />}
              {activeTab === "fees" && <FeesTab studentId={studentId} />}
              {activeTab === "exam" && <ExamResultsTab studentClass={studentData.class} />}
              {activeTab === "discipline" && (
                <StudentDisciplineManagement
                  studentId={studentData.admissionNumber}
                  studentName={fullName}
                  studentClass={studentData.class}
                  studentSection={studentData.section || "A"}
                />
              )}
              {activeTab === "library" && <LibraryTab />}
            </div>
          </div>
        </div>
      </div>
      }
    >

      {/* Collect Fees Modal */}
      {studentData && getStudentForModal() && (
        <CollectFeesModal
          isOpen={isFeesModalOpen}
          onClose={() => setIsFeesModalOpen(false)}
          student={getStudentForModal()!}
        />
      )}

      {/* Login Details Modal */}
      {studentData && (
        <LoginDetailsModal
          isOpen={isLoginDetailsModalOpen}
          onClose={() => setIsLoginDetailsModalOpen(false)}
          studentName={fullName}
          studentPhoto={profilePhotoUrl}
          canViewPasswords={true} // Set based on user role/permissions
          loginDetails={[
            {
              userType: "Parent",
              username: `parent${studentData.admissionNumber || "53"}`,
              password: `parent@${studentData.admissionNumber || "53"}`,
              socialLogins: [
                {
                  provider: "google",
                  email: "parent@example.com",
                },
              ],
            },
            {
              userType: "Student",
              username: `student${studentData.admissionNumber || "20"}`,
              password: `stdt@${studentData.admissionNumber || "53"}`,
              socialLogins: [
                {
                  provider: "google",
                  email: "student@example.com",
                },
                {
                  provider: "microsoft",
                  email: "student@school.edu",
                },
              ],
            },
          ]}
        />
      )}

      {/* Delete Confirmation Modal */}
      {studentData && (
        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Student"
          subtitle={`${fullName} • ${studentData.admissionNumber || studentId}`}
          variant="danger"
          message="This will permanently remove this student and all associated data including attendance records, fees, exam results, and documents. This action cannot be undone."
          confirmLabel="Delete Student"
          cancelLabel="Cancel"
          onConfirm={handleDeleteStudent}
        />
      )}

      {/* Transcript Payment Modal */}
      {pendingTranscriptRequest && (
        <TranscriptPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentComplete={handlePaymentComplete}
          transcriptType={pendingTranscriptRequest.transcriptType}
          amount={pendingTranscriptRequest.payment.amount}
          currency={pendingTranscriptRequest.payment.currency}
        />
      )}

      {/* Transcript Acknowledgment Modal */}
      {pendingTranscriptRequest && (
        <TranscriptAcknowledgmentModal
          isOpen={isAcknowledgmentModalOpen}
          onClose={handleAcknowledgmentClose}
          requestNumber={pendingTranscriptRequest.requestNumber}
          studentName={pendingTranscriptRequest.studentName}
          transcriptType={pendingTranscriptRequest.transcriptType}
          amount={pendingTranscriptRequest.payment.amount}
          currency={pendingTranscriptRequest.payment.currency}
          estimatedDelivery={getEstimatedDeliveryDate()}
        />
      )}

      {/* Transfer Request Modal */}
      {studentData && (
        <TransferRequestModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          onSubmit={handleTransferSubmit}
          currentClass={studentData.class}
          currentSection={studentData.section || "A"}
          studentName={fullName}
          admissionNumber={studentData.admissionNumber}
        />
      )}

      {/* Transfer Success Modal */}
      {transferSuccessData && (
        <TransferSuccessModal
          isOpen={isTransferSuccessModalOpen}
          onClose={() => {
            setIsTransferSuccessModalOpen(false);
            setTransferSuccessData(null);
          }}
          title={
            transferSuccessData.transferType === "external"
              ? "External Transfer Submitted!"
              : transferSuccessData.transferType === "promotion"
              ? "Promotion Request Submitted!"
              : "Transfer Request Submitted!"
          }
          subtitle="The request has been registered and is pending approval."
          fields={[
            createTransferField(
              <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
              "Transfer Type",
              transferSuccessData.transferType === "external"
                ? "External Transfer"
                : transferSuccessData.transferType === "promotion"
                ? "Promotion"
                : transferSuccessData.transferType === "class-change"
                ? "Class Change"
                : transferSuccessData.transferType === "section-change"
                ? "Section Change"
                : "Internal Transfer"
            ),
            ...(transferSuccessData.transferType === "external"
              ? [
                  createTransferField(
                    <School className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
                    "Destination School",
                    transferSuccessData.destinationSchoolName || ""
                  ),
                ]
              : [
                  createTransferField(
                    <School className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
                    "Destination Class",
                    transferSuccessData.destinationClass
                  ),
                  createTransferField(
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
                    "Destination Section",
                    transferSuccessData.destinationSection
                  ),
                ]),
            createTransferField(
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
              "Reason",
              TRANSFER_REASONS.find((r) => r.value === transferSuccessData.reason)?.label || transferSuccessData.reason
            ),
            createTransferField(
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
              "Effective Date",
              new Date(transferSuccessData.effectiveDate).toLocaleDateString()
            ),
          ]}
        />
      )}
    </DashboardPage>
  );
}

// Student Sidebar Component
function StudentSidebar({
  studentData,
  fullName,
  profilePhotoUrl,
  onAddFees,
}: {
  studentData: ExtendedStudentData;
  fullName: string;
  profilePhotoUrl: string | null;
  onAddFees?: () => void;
}) {
  return (
    <div className="flex flex-col">
      {/* Student Profile Card */}
      <div className="mb-3 sm:mb-4">
        <StudentProfileCard
          studentData={studentData}
          fullName={fullName}
          profilePhotoUrl={profilePhotoUrl}
          onAddFees={onAddFees}
        />
      </div>

      {/* Primary Contact Info */}
      <div className="mb-3 sm:mb-4">
        <PrimaryContactInfoCard
          phoneNumber={studentData.primaryContact}
          email={studentData.email}
        />
      </div>

      {/* Sibling Information */}
      <div className="mb-3 sm:mb-4">
        <SiblingInformationCard siblings={studentData.siblings} />
      </div>

      {/* Hostel / Transportation */}
      <div className="mb-3 sm:mb-4">
        <HostelTransportCard
          useHostel={studentData.useHostel}
          useTransport={studentData.useTransport}
          hostelName={studentData.hostelName}
          roomNumber={studentData.roomNumber}
          transportRoute={studentData.transportRoute || studentData.route}
          vehicleNumber={studentData.vehicleNumber}
        />
      </div>
    </div>
  );
}

// Tabs Component
function StudentTabs({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: { id: TabType; label: string; icon: TabIcon }[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
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
          onChange={(value) => setActiveTab(value as TabType)}
          icon={ActiveIcon && <ActiveIcon className="w-5 h-5" />}
        />
      </div>

      {/* Desktop Horizontal Tabs */}
      <div className="hidden md:block relative bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-[#1a1d23]/30 dark:to-[#14161b]/50 midnight:from-[#0f1729]/30 midnight:to-[#0a0f1c]/50 purple:from-[#2a1a3e]/30 purple:to-[#1f1330]/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/30 dark:border-[#1a1d24]/30 midnight:border-cyan-500/10 purple:border-pink-500/10 p-1.5 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
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
                    : "text-gray-700 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:bg-white/40 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 hover:text-gray-900 dark:hover:text-gray-200 midnight:hover:text-cyan-200 purple:hover:text-pink-200 hover:shadow-sm"
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
                <span className={`relative text-[0.7344rem] sm:text-xs font-semibold transition-all duration-300 ${
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

// Student Details Tab Component
function StudentDetailsTab({
  studentData,
  studentId,
  fatherPhotoUrl,
  motherPhotoUrl,
  guardianPhotoUrl,
}: {
  studentData: ExtendedStudentData;
  studentId: string;
  fatherPhotoUrl: string | null;
  motherPhotoUrl: string | null;
  guardianPhotoUrl: string | null;
}) {
  const currentAddress = studentData.currentAddress || (() => {
    const parts = [
      studentData.currentAddressLine1,
      studentData.currentAddressLine2,
      studentData.currentCity,
      studentData.currentState,
      studentData.currentPostalCode,
      studentData.currentCountry,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "-";
  })();

  const permanentAddress = studentData.permanentAddress || (() => {
    const parts = [
      studentData.permanentAddressLine1,
      studentData.permanentAddressLine2,
      studentData.permanentCity,
      studentData.permanentState,
      studentData.permanentPostalCode,
      studentData.permanentCountry,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "-";
  })();

  // Build parents array
  const parents = [];
  if (studentData.motherFirstName) {
    parents.push({
      name: `${studentData.motherFirstName} ${studentData.motherMiddleName || ""} ${studentData.motherLastName || ""}`.trim(),
      role: "Mother",
      phone: studentData.motherPhone || "-",
      email: studentData.motherEmail || "-",
      photoUrl: motherPhotoUrl,
    });
  }
  if (studentData.fatherFirstName) {
    parents.push({
      name: `${studentData.fatherFirstName} ${studentData.fatherMiddleName || ""} ${studentData.fatherLastName || ""}`.trim(),
      role: "Father",
      phone: studentData.fatherPhone || "-",
      email: studentData.fatherEmail || "-",
      photoUrl: fatherPhotoUrl,
    });
  }
  if (studentData.guardianFirstName) {
    parents.push({
      name: `${studentData.guardianFirstName} ${studentData.guardianMiddleName || ""} ${studentData.guardianLastName || ""}`.trim(),
      role: `Guardian (${studentData.guardianRelation || "Guardian"})`,
      phone: studentData.guardianPhone || "-",
      email: studentData.guardianEmail || "-",
      photoUrl: guardianPhotoUrl,
    });
  }

  return (
    <div className="space-y-6">
      {/* Parents/Guardian Information */}
      <ParentsInformationCard parents={parents} />

      {/* Documents and Address - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentsCard documents={studentData.documents || []} />
        <AddressCard
          currentAddress={currentAddress}
          permanentAddress={permanentAddress}
        />
      </div>

      {/* Previous School Details */}
      <PreviousSchoolDetailsCard
        schoolName={studentData.previousSchoolName}
        schoolAddress={studentData.previousSchoolAddress}
      />

      {/* Medical History and Bank Details - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MedicalHistoryCard
          allergies={studentData.allergies}
          medications={studentData.medications}
        />
        <BankDetailsCard
          bankName={studentData.bankName}
          branch={studentData.branch}
          ifscNumber={studentData.ifscNumber}
        />
      </div>

      {/* Transfer History */}
      <TransferHistoryCard studentId={studentId} />

      {/* Other Info */}
      <OtherInfoCard />
    </div>
  );
}

// Placeholder components for other tabs
function TimetableTab({ timetable }: { timetable?: import("@/lib/mockStudents").TimetableEntry[] }) {
  return <TimeTable timetable={timetable} />;
}

// Leave Application Type
interface LeaveApplication {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  appliedOn: string;
  status: "Approved" | "Pending" | "Rejected";
}

// Mock Leave Applications Data
const MOCK_LEAVE_APPLICATIONS: LeaveApplication[] = [
  {
    id: "1",
    leaveType: "Casual Leave",
    startDate: "07 May 2024",
    endDate: "07 May 2024",
    numberOfDays: 1,
    appliedOn: "07 May 2024",
    status: "Approved",
  },
  {
    id: "2",
    leaveType: "Casual Leave",
    startDate: "08 May 2024",
    endDate: "08 May 2024",
    numberOfDays: 1,
    appliedOn: "04 May 2024",
    status: "Approved",
  },
  {
    id: "3",
    leaveType: "Casual Leave",
    startDate: "20 May 2024",
    endDate: "20 May 2024",
    numberOfDays: 1,
    appliedOn: "19 May 2024",
    status: "Pending",
  },
  {
    id: "4",
    leaveType: "Medical Leave",
    startDate: "05 May 2024",
    endDate: "09 May 2024",
    numberOfDays: 5,
    appliedOn: "05 May 2024",
    status: "Approved",
  },
  {
    id: "5",
    leaveType: "Medical Leave",
    startDate: "08 May 2024",
    endDate: "11 May 2024",
    numberOfDays: 4,
    appliedOn: "08 May 2024",
    status: "Pending",
  },
  {
    id: "6",
    leaveType: "Special Leave",
    startDate: "09 May 2024",
    endDate: "09 May 2024",
    numberOfDays: 1,
    appliedOn: "09 May 2024",
    status: "Pending",
  },
];

function AttendanceTab({ studentId }: { studentId: string }) {
  const [activeSubTab, setActiveSubTab] = useState<"leaves" | "attendance">("leaves");
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const { getStudentAttendance } = useAttendance();

  // Attendance mode state - load directly from localStorage with fallback
  const [attendanceMode] = useState<"by-class" | "by-day">(() => {
    if (typeof window !== "undefined") {
      return getAttendanceMode();
    }
    return "by-day";
  });

  // Calculate real attendance stats from context
  const attendanceStats = useMemo(() => {
    const records = getStudentAttendance(studentId);
    const stats = {
      present: 0,
      absent: 0,
      halfday: 0,
      late: 0,
    };

    records.forEach((record) => {
      if (record.status === "present") stats.present++;
      else if (record.status === "absent") stats.absent++;
      else if (record.status === "halfday") stats.halfday++;
      else if (record.status === "late") stats.late++;
    });

    return stats;
  }, [studentId, getStudentAttendance]);

  // Status Badge Component
  const getStatusBadge = (status: LeaveApplication["status"]) => {
    const variants = {
      Approved: "bg-green-100 dark:bg-green-950/30 midnight:bg-green-950/30 purple:bg-green-950/30 text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300 border-green-200 dark:border-green-800 midnight:border-green-800 purple:border-green-800",
      Pending: "bg-cyan-100 dark:bg-cyan-950/30 midnight:bg-cyan-950/30 purple:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 midnight:text-cyan-300 purple:text-cyan-300 border-cyan-200 dark:border-cyan-800 midnight:border-cyan-800 purple:border-cyan-800",
      Rejected: "bg-red-100 dark:bg-red-950/30 midnight:bg-red-950/30 purple:bg-red-950/30 text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300 border-red-200 dark:border-red-800 midnight:border-red-800 purple:border-red-800",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${variants[status]}`}>
        <span className={`w-2 h-2 rounded-full ${status === "Approved" ? "bg-green-500" : status === "Pending" ? "bg-cyan-500" : "bg-red-500"}`}></span>
        {status}
      </span>
    );
  };

  // Define columns for Leave Applications DataTable
  const leaveColumns: ColumnConfig<LeaveApplication>[] = [
    {
      key: "leaveType",
      label: "Leave Type",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
          {item.leaveType}
        </span>
      ),
    },
    {
      key: "leaveDates",
      label: "Leave Date",
      sortable: true,
      sortValue: (item) => item.startDate,
      className: "text-left",
      render: (item) => (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
          {item.startDate} - {item.endDate}
        </span>
      ),
    },
    {
      key: "numberOfDays",
      label: "No of Days",
      sortable: true,
      className: "text-center",
      render: (item) => (
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
          {item.numberOfDays}
        </span>
      ),
    },
    {
      key: "appliedOn",
      label: "Applied On",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
          {item.appliedOn}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-center",
      render: (item) => getStatusBadge(item.status),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Main Content Card */}
      <div className="bg-surface rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/40 dark:border-[#1a1d24]/40 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
        {/* Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 border-b border-gray-200/40 dark:border-[#1a1d24]/40 midnight:border-cyan-500/20 purple:border-pink-500/20">
          {/* Sub Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab("leaves")}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeSubTab === "leaves"
                  ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
            >
              Leaves
            </button>
            <button
              onClick={() => setActiveSubTab("attendance")}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeSubTab === "attendance"
                  ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
            >
              Attendance
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-3 sm:p-4 lg:p-4">
          {activeSubTab === "leaves" ? (
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Leave Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <LeaveStatsCard
                  title="Medical Leave"
                  total={10}
                  used={5}
                  available={5}
                  variant="medical"
                />
                <LeaveStatsCard
                  title="Casual Leave"
                  total={12}
                  used={1}
                  available={11}
                  variant="casual"
                />
                <LeaveStatsCard
                  title="Maternity Leave"
                  total={10}
                  used={0}
                  available={10}
                  variant="maternity"
                />
                <LeaveStatsCard
                  title="Paternity Leave"
                  total={0}
                  used={0}
                  available={0}
                  variant="paternity"
                />
              </div>

              {/* Leave Applications Section */}
              <div className="space-y-3 sm:space-y-4">
                {/* Header with Apply Leave Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-bold text-ink">
                    Leave Applications
                  </h3>
                  <AddButton
                    label="Apply Leave"
                    onClick={() => setIsApplyLeaveModalOpen(true)}
                    className="w-full sm:w-auto"
                  />
                </div>

                {/* DataTable */}
                <ResponsiveListTable<LeaveApplication> variant="contained" showColumnHeaders={true}
                  data={MOCK_LEAVE_APPLICATIONS}
                  columns={leaveColumns}
                  title="Leave Applications"
                  searchPlaceholder="Search by leave type or status..."
                  showSearch={true}
                  defaultItemsPerPage={10}
                  getRowKey={(item) => item.id}
                  emptyMessage="No leave applications found"
                  enablePagination={true}
                  enableItemsPerPage={true}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Attendance Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <AttendanceStatsCard type="present" count={attendanceStats.present} />
                <AttendanceStatsCard type="absent" count={attendanceStats.absent} />
                <AttendanceStatsCard type="halfday" count={attendanceStats.halfday} />
                <AttendanceStatsCard type="late" count={attendanceStats.late} />
              </div>

              {/* Attendance Display - Shows by-class or by-day based on settings */}
              {attendanceMode === "by-class" ? (
                <AttendanceByClass studentId={studentId} />
              ) : (
                <AttendanceCalendar studentId={studentId} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyLeaveModalOpen}
        onClose={() => setIsApplyLeaveModalOpen(false)}
      />
    </div>
  );
}

function FeesTab({ studentId }: { studentId: string }) {
  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-gray-200/40 dark:border-[#1a1d24]/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 lg:p-8 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      <FeesManagement educationLevel="primary" schoolType="private" studentId={studentId} />
    </div>
  );
}

function ExamResultsTab({ studentClass }: { studentClass: string }) {
  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-gray-200/40 dark:border-[#1a1d24]/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 lg:p-8 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      <ExamResults studentClass={studentClass} />
    </div>
  );
}

function LibraryTab() {
  const [selectedYear, setSelectedYear] = useState("2024 / 2025");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const yearOptions = [
    { label: "This Year", value: "2024 / 2025" },
    { label: "2023 / 2024", value: "2023 / 2024" },
    { label: "2022 / 2023", value: "2022 / 2023" },
  ];

  // Mock library data
  const libraryBooks = [
    {
      id: "1",
      title: "The Small-Town Library",
      coverGradient: "from-gray-300 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
      coverText: "BOOK",
      bookTakenOn: "25 Jan 2024",
      lastDate: "25 Jan 2024",
      status: "due-soon" as const,
    },
    {
      id: "2",
      title: "Apex Time",
      coverGradient: "from-slate-700 via-slate-600 to-slate-700 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800",
      coverText: "APEX",
      bookTakenOn: "22 Jan 2024",
      lastDate: "25 Jan 2024",
      status: "active" as const,
    },
    {
      id: "3",
      title: "The Cobalt Guitar",
      coverGradient: "from-teal-500 via-teal-400 to-teal-500 dark:from-teal-700 dark:via-teal-600 dark:to-teal-700",
      coverText: "BOOK",
      bookTakenOn: "30 Jan 2024",
      lastDate: "10 Feb 2024",
      status: "active" as const,
    },
    {
      id: "4",
      title: "Shard and the Tomb",
      coverGradient: "from-orange-300 via-orange-200 to-orange-300 dark:from-orange-400 dark:via-orange-300 dark:to-orange-400",
      coverText: "SHARD",
      bookTakenOn: "10 Feb 2024",
      lastDate: "20 Feb 2024",
      status: "active" as const,
    },
    {
      id: "5",
      title: "Shard and the Tomb 2",
      coverGradient: "from-teal-600 via-teal-500 to-teal-600 dark:from-teal-700 dark:via-teal-600 dark:to-teal-700",
      coverText: "SHARD 2",
      bookTakenOn: "12 Feb 2024",
      lastDate: "22 Feb 2024",
      status: "active" as const,
    },
    {
      id: "6",
      title: "Plague of Fear",
      coverGradient: "from-gray-400 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
      coverText: "PLAGUE",
      bookTakenOn: "15 Feb 2024",
      lastDate: "25 Feb 2024",
      status: "active" as const,
    },
  ];

  // Filter books based on search
  const filteredBooks = libraryBooks.filter((book) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return book.title.toLowerCase().includes(query);
  });

  // Handle search with animation
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-gray-200/40 dark:border-[#1a1d24]/40 midnight:border-cyan-500/20 purple:border-pink-500/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2.5 sm:p-3 border-b border-line">
        <h2 className="text-sm sm:text-base font-bold text-ink flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          Library
          {searchQuery && (
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
              ({filteredBooks.length})
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full sm:w-64 pl-8 pr-2.5 py-1 sm:py-1.5 text-xs bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 text-ink placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
          <CustomDropdown
            value={selectedYear}
            options={yearOptions}
            onChange={(value) => setSelectedYear(value as string)}
            variant="blue"
            className="w-32 sm:w-40"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="p-4 sm:p-6">
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                style={{
                  animation: isSearching
                    ? `fadeSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s both`
                    : undefined,
                }}
                className="group bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl border border-line overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-600 midnight:hover:border-cyan-400 purple:hover:border-pink-400"
              >
                {/* Book Cover */}
                <div className="relative">
                  <div className={`bg-gradient-to-br ${book.coverGradient} h-40 flex items-center justify-center relative overflow-hidden`}>
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-2 right-2">
                      {book.status === "due-soon" && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                          Due Soon
                        </span>
                      )}
                    </div>
                    <div className="relative z-10 text-center transform group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-16 h-16 mx-auto mb-2 text-white drop-shadow-lg" />
                      <span className="text-white font-bold text-sm tracking-wider drop-shadow-md">
                        {book.coverText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-4">
                  {/* Book Title */}
                  <h3 className="text-base font-bold text-ink mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
                    {book.title}
                  </h3>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[0.625rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60">
                        Book taken on
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                        {book.bookTakenOn}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[0.625rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60">
                        Last Date
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                        {book.lastDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom gradient bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 midnight:from-cyan-500 midnight:via-blue-500 midnight:to-purple-500 purple:from-pink-500 purple:via-purple-500 purple:to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] mb-4">
              <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              No books found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}