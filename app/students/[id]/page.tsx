"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getExtendedStudentDataById } from "@/lib/mockStudents";
import Image from "next/image";
import {
  GraduationCap,
  Calendar,
  FileText,
  BookOpen,
  Phone,
  Mail,
  Lock,
  Download,
  Clock,
  KeyRound,
  Search,
  ExternalLink,
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
import ActionButton from "@/components/shared/ActionButton";
import SecondaryButton from "@/components/shared/SecondaryButton";
import CurrencyIcon from "@/components/shared/CurrencyIcon";
import TimeTable from "@/components/students/TimeTable";
import LoginDetailsModal from "@/components/students/LoginDetailsModal";
import LeaveStatsCard from "@/components/students/LeaveStatsCard";
import ApplyLeaveModal from "@/components/students/ApplyLeaveModal";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import AddButton from "@/components/shared/AddButton";
import AttendanceStatsCard from "@/components/students/AttendanceStatsCard";
import AttendanceCalendar from "@/components/students/AttendanceCalendar";
import AttendanceByClass from "@/components/students/AttendanceByClass";
import FeesManagement from "@/components/students/FeesManagement";
import MobileDropdown from "@/components/shared/MobileDropdown";
import ExamResults from "@/components/students/ExamResults";
import { getAttendanceMode } from "@/components/settings/AttendanceSettings";
import { Edit, UserCheck, CheckCircle2 } from "lucide-react";

type TabType = "details" | "timetable" | "attendance" | "fees" | "exam" | "library";

// CACHE BUSTER: 2025-11-07-16:03
export default function ViewStudentPage() {
  const params = useParams();
  const studentId = params?.id as string;
  const router = useRouter();
  const isLoading = usePageLoad(600);
  const [studentData, setStudentData] = useState<ExtendedStudentData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [isLoginDetailsModalOpen, setIsLoginDetailsModalOpen] = useState(false);

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

  if (isLoading || isLoadingData || !studentData) {
    return (
      <MainLayout>
        <PageLoader isLoading={true} loadingText="Loading Student Details" />
      </MainLayout>
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

  const tabs = [
    { id: "details" as TabType, label: "Student Details", icon: GraduationCap },
    { id: "timetable" as TabType, label: "Time Table", icon: Clock },
    { id: "attendance" as TabType, label: "Leave & Attendance", icon: Calendar },
    { id: "fees" as TabType, label: "Fees", icon: CurrencyIcon },
    { id: "exam" as TabType, label: "Exam & Results", icon: FileText },
    { id: "library" as TabType, label: "Library", icon: BookOpen },
  ];

  return (
    <MainLayout>
      <PageLoader isLoading={isLoading} loadingText="Loading Student Details" />
      
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="mb-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
                Student Details
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 flex-wrap">
                <a href="/" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                  Dashboard
                </a>
                <span>/</span>
                <a href="/students" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                  Student
                </a>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">
                  Student Details
                </span>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <SecondaryButton
                label="Login Details"
                icon={KeyRound}
                onClick={() => setIsLoginDetailsModalOpen(true)}
              />
              <ActionButton
                label="Edit Student"
                icon={Edit}
                onClick={() => router.push(`/students/edit/${studentId}`)}
              />
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
                  fatherPhotoUrl={fatherPhotoUrl}
                  motherPhotoUrl={motherPhotoUrl}
                  guardianPhotoUrl={guardianPhotoUrl}
                />
              )}
              {activeTab === "timetable" && <TimetableTab timetable={studentData.timetable} />}
              {activeTab === "attendance" && <AttendanceTab studentId={studentId} />}
              {activeTab === "fees" && <FeesTab studentId={studentId} />}
              {activeTab === "exam" && <ExamResultsTab studentClass={studentData.class} />}
              {activeTab === "library" && <LibraryTab />}
            </div>
          </div>
        </div>
      </div>

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
          loginDetails={[
            {
              userType: "Parent",
              username: `parent${studentData.admissionNumber || "53"}`,
              password: `parent@${studentData.admissionNumber || "53"}`,
            },
            {
              userType: "Student",
              username: `student${studentData.admissionNumber || "20"}`,
              password: `stdt@${studentData.admissionNumber || "53"}`,
            },
          ]}
        />
      )}
    </MainLayout>
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
  tabs: { id: TabType; label: string; icon: any }[];
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

// Student Details Tab Component
function StudentDetailsTab({
  studentData,
  fatherPhotoUrl,
  motherPhotoUrl,
  guardianPhotoUrl,
}: {
  studentData: ExtendedStudentData;
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

  // Attendance mode state - load directly from localStorage with fallback
  const [attendanceMode, setAttendanceMode] = useState<"by-class" | "by-day">(() => {
    if (typeof window !== "undefined") {
      return getAttendanceMode();
    }
    return "by-day";
  });

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
      <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
        {/* Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 border-b border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20">
          {/* Sub Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab("leaves")}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeSubTab === "leaves"
                  ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700"
              }`}
            >
              Leaves
            </button>
            <button
              onClick={() => setActiveSubTab("attendance")}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeSubTab === "attendance"
                  ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Leave Applications
                  </h3>
                  <AddButton
                    label="Apply Leave"
                    onClick={() => setIsApplyLeaveModalOpen(true)}
                    className="w-full sm:w-auto"
                  />
                </div>

                {/* DataTable */}
                <DataTable<LeaveApplication>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <AttendanceStatsCard type="present" count={265} />
                <AttendanceStatsCard type="absent" count={5} />
                <AttendanceStatsCard type="halfday" count={1} />
                <AttendanceStatsCard type="late" count={12} />
              </div>

              {/* Attendance Display - Shows by-class or by-day based on settings */}
              {attendanceMode === "by-class" ? (
                <AttendanceByClass studentId={studentId} />
              ) : (
                <AttendanceCalendar />
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
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 lg:p-8 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      <FeesManagement educationLevel="primary" schoolType="private" studentId={studentId} />
    </div>
  );
}

function ExamResultsTab({ studentClass }: { studentClass: string }) {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 lg:p-8 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      <ExamResults studentClass={studentClass} />
    </div>
  );
}

function LibraryTab() {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-8 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 midnight:from-rose-950/30 midnight:to-pink-950/30 purple:from-pink-950/30 purple:to-rose-950/30 mb-6 mx-auto">
          <BookOpen className="w-12 h-12 text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-pink-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
          Library Records Coming Soon
        </h3>
        <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 max-w-sm mx-auto">
          View student's borrowed books, due dates, and library history
        </p>
      </div>
    </div>
  );
}