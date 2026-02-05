"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import { getTeacherById, Teacher } from "@/lib/mockTeachers";
import {
  Briefcase,
  Calendar,
  FileText,
  BookOpen,
  KeyRound,
  Clock,
  Trash2,
  Shield,
  Edit,
  GraduationCap,
  MapPin,
} from "lucide-react";
import StaffProfileCard from "@/components/staff/StaffProfileCard";
import PrimaryContactInfoCard from "@/components/students/PrimaryContactInfoCard";
import EmploymentDetailsCard from "@/components/staff/EmploymentDetailsCard";
import QualificationsCard from "@/components/staff/QualificationsCard";
import StaffDocumentsCard from "@/components/staff/StaffDocumentsCard";
import FamilyInformationCard from "@/components/staff/FamilyInformationCard";
import ActionModal from "@/components/shared/ActionModal";
import ActionButton from "@/components/shared/ActionButton";
import SecondaryButton from "@/components/shared/SecondaryButton";
import MobileDropdown from "@/components/shared/MobileDropdown";
import TeacherTimeTable from "@/components/teacher/TeacherTimeTable";
import StaffLeaveStatsCard from "@/components/staff/StaffLeaveStatsCard";
import StaffAttendanceStatsCard from "@/components/staff/StaffAttendanceStatsCard";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import AddButton from "@/components/shared/AddButton";
import AttendanceCalendar from "@/components/students/AttendanceCalendar";
import PayrollSummaryCard from "@/components/staff/PayrollSummaryCard";
import TaxInformationCard from "@/components/staff/TaxInformationCard";
import BankDetailsCard from "@/components/staff/BankDetailsCard";
import PayslipsTable, { Payslip } from "@/components/staff/PayslipsTable";
import StaffPerformanceReviews from "@/components/staff/StaffPerformanceReviews";
import ApplyLeaveModal from "@/components/students/ApplyLeaveModal";
import { useLeaves } from "@/contexts/LeaveContext";

type TabType = "details" | "timetable" | "attendance" | "payroll" | "performance";

export default function ViewStaffPage() {
  const params = useParams();
  const staffId = params?.id as string;
  const router = useRouter();
  const [staffData, setStaffData] = useState<Teacher | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoginDetailsModalOpen, setIsLoginDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (staffId) {
      try {
        const data = getTeacherById(staffId);
        if (data) {
          setStaffData(data);
        } else {
          router.push("/staff?view=grid");
        }
      } catch (error) {
        console.error("Error loading staff data:", error);
        router.push("/staff?view=grid");
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [staffId, router]);

  if (isLoadingData || !staffData) {
    return (
      <DashboardPage
        title="Staff Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Staff", href: "/staff?view=grid" },
          { label: "Staff Details", isActive: true },
        ]}
        loadingText="Loading Staff Details"
      />
    );
  }

  const fullName = `${staffData.firstName} ${staffData.lastName}`;

  const handleDeleteStaff = () => {
    console.log('Deleting staff:', staffId);
    router.push('/staff?view=grid');
  };

  const tabs = [
    { id: "details" as TabType, label: "Staff Details", icon: Briefcase },
    { id: "timetable" as TabType, label: "Time Table", icon: Clock },
    { id: "attendance" as TabType, label: "Leave & Attendance", icon: Calendar },
    { id: "payroll" as TabType, label: "Payroll", icon: FileText },
    { id: "performance" as TabType, label: "Performance", icon: GraduationCap },
  ];

  return (
    <DashboardPage
      title="Staff Details"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Staff", href: "/staff?view=grid" },
        { label: "Staff Details", isActive: true },
      ]}
      loadingText="Loading Staff Details"
      afterStats={
        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
                Staff Details
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 flex-wrap">
                <a href="/" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                  Dashboard
                </a>
                <span>/</span>
                <a href="/staff?view=grid" className="hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 cursor-pointer transition-colors">
                  Staff
                </a>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">
                  Staff Details
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Primary Actions */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <ActionButton
                  label="Edit Staff"
                  icon={Edit}
                  onClick={() => router.push(`/staff/edit/${staffId}`)}
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
                  <span>Delete Staff</span>
                </button>
              </div>
            </div>
          </div>
          </div>

        <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-6 items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <StaffSidebar
              staffData={staffData}
              fullName={fullName}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full flex flex-col">
            <StaffTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <div className="mt-2 lg:mt-6">
              {activeTab === "details" && (
                <StaffDetailsTab
                  staffData={staffData}
                  staffId={staffId}
                />
              )}
              {activeTab === "timetable" && <TimetableTab staffData={staffData} />}
              {activeTab === "attendance" && <AttendanceTab staffData={staffData} />}
              {activeTab === "payroll" && <PayrollTab staffData={staffData} />}
              {activeTab === "performance" && <PerformanceTab staffData={staffData} />}
            </div>
          </div>
        </div>
      </div>
      }
    >

      {/* Delete Confirmation Modal */}
      {staffData && (
        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Staff"
          subtitle={`${fullName} • ${staffData.staffId}`}
          variant="danger"
          message="This will permanently remove this staff member and all associated data including attendance records, payroll, performance records, and documents. This action cannot be undone."
          confirmLabel="Delete Staff"
          cancelLabel="Cancel"
          onConfirm={handleDeleteStaff}
        />
      )}
    </DashboardPage>
  );
}

// Staff Sidebar Component
function StaffSidebar({
  staffData,
  fullName,
}: {
  staffData: Teacher;
  fullName: string;
}) {
  return (
    <div className="flex flex-col">
      {/* Staff Profile Card */}
      <div className="mb-3 sm:mb-4">
        <StaffProfileCard
          staffData={staffData}
          fullName={fullName}
        />
      </div>

      {/* Primary Contact Info */}
      <div className="mb-3 sm:mb-4">
        <PrimaryContactInfoCard
          phoneNumber={staffData.phone}
          email={staffData.email}
        />
      </div>

      {/* Employment Details */}
      <div className="mb-3 sm:mb-4">
        <EmploymentDetailsCard
          employmentType={staffData.employmentType}
          employmentStatus={staffData.employmentStatus}
          joinDate={staffData.joinDate}
          department={staffData.department}
        />
      </div>
    </div>
  );
}

// Tabs Component
function StaffTabs({
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

// Staff Details Tab Component
function StaffDetailsTab({
  staffData,
  staffId,
}: {
  staffData: Teacher;
  staffId: string;
}) {
  return (
    <div className="space-y-6">
      {/* Qualifications */}
      <QualificationsCard
        qualification={staffData.qualification}
        experience={staffData.experience}
        specialization={staffData.specialization}
      />

      {/* Subjects & Classes */}
      <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
        {/* Header */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          Teaching Assignment
        </h3>

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-3"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-2">Subjects</p>
            <div className="flex flex-wrap gap-1.5">
              {staffData.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 text-xs font-semibold rounded-md border border-blue-200/50 dark:border-blue-800/50 midnight:border-cyan-800/50 purple:border-pink-800/50"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-2">Classes</p>
            <div className="flex flex-wrap gap-1.5">
              {staffData.classes.map((className, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 text-green-700 dark:text-green-300 midnight:text-emerald-300 purple:text-emerald-300 text-xs font-semibold rounded-md border border-green-200/50 dark:border-green-800/50 midnight:border-emerald-800/50 purple:border-emerald-800/50"
                >
                  {className}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Family Information */}
      <FamilyInformationCard
        familyMembers={[
          {
            name: "Sarah Johnson",
            relationship: "Spouse",
            phone: "+1 (555) 234-5678",
            email: "sarah.johnson@email.com",
            photoUrl: "https://randomuser.me/api/portraits/women/32.jpg",
          },
          {
            name: "Michael Johnson",
            relationship: "Child",
            phone: "+1 (555) 345-6789",
            email: "michael.j@email.com",
            photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
          },
          {
            name: "Emily Johnson",
            relationship: "Child",
            phone: "+1 (555) 456-7890",
            email: "emily.johnson@email.com",
            photoUrl: "https://randomuser.me/api/portraits/women/67.jpg",
          },
        ]}
      />

      {/* Address & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address Card */}
        <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-2 sm:pb-3 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
          {/* Header */}
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
            Address
          </h3>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-2"></div>

          {/* Address Entry */}
          <div className="flex items-start gap-2 p-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-blue-50 hover:to-blue-100/60 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 midnight:hover:from-cyan-900/30 midnight:hover:to-cyan-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-blue-300/50 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 group/address">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/20 midnight:from-blue-900/40 midnight:to-blue-900/20 purple:from-blue-900/40 purple:to-blue-900/20 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/address:scale-110 group-hover/address:from-blue-200 group-hover/address:to-blue-300">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 transition-transform duration-300 group-hover/address:scale-110" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 leading-snug">
                {staffData.address}
              </p>
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <StaffDocumentsCard />
      </div>
    </div>
  );
}

// Placeholder components for other tabs
function TimetableTab({ staffData }: { staffData: Teacher }) {
  const fullName = `${staffData.firstName} ${staffData.lastName}`;
  return <TeacherTimeTable teacherName={fullName} />;
}

// Staff Leave Application Type
interface StaffLeaveApplication {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  appliedOn: string;
  status: "Approved" | "Pending" | "Rejected";
  reason?: string;
}

// Mock Leave Applications Data for Staff
const MOCK_STAFF_LEAVE_APPLICATIONS: StaffLeaveApplication[] = [
  {
    id: "1",
    leaveType: "Annual Leave",
    startDate: "15 Jan 2024",
    endDate: "19 Jan 2024",
    numberOfDays: 5,
    appliedOn: "05 Jan 2024",
    status: "Approved",
    reason: "Family vacation",
  },
  {
    id: "2",
    leaveType: "Medical Leave",
    startDate: "22 Feb 2024",
    endDate: "23 Feb 2024",
    numberOfDays: 2,
    appliedOn: "22 Feb 2024",
    status: "Approved",
    reason: "Medical checkup",
  },
  {
    id: "3",
    leaveType: "Casual Leave",
    startDate: "10 Mar 2024",
    endDate: "10 Mar 2024",
    numberOfDays: 1,
    appliedOn: "08 Mar 2024",
    status: "Pending",
    reason: "Personal work",
  },
];

function AttendanceTab({ staffData }: { staffData: Teacher }) {
  const [activeSubTab, setActiveSubTab] = useState<"leaves" | "attendance">("leaves");
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const { getStaffLeaves } = useLeaves();

  // Get leave requests for this staff member from LeaveContext
  const staffLeaveRequests = useMemo(() => getStaffLeaves(staffData.staffId), [staffData.staffId, getStaffLeaves]);

  // Transform leave requests to StaffLeaveApplication format
  const leaveApplications: StaffLeaveApplication[] = useMemo(() => {
    return staffLeaveRequests.map(request => ({
      id: request.id,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      numberOfDays: request.numberOfDays,
      appliedOn: request.requestedDate,
      status: request.status === "approved" ? "Approved" :
              request.status === "rejected" ? "Rejected" : "Pending",
      reason: request.reason,
    }));
  }, [staffLeaveRequests]);

  // Calculate leave stats from real data
  const leaveStats = useMemo(() => {
    const annualUsed = staffLeaveRequests
      .filter(req => req.leaveType === "Annual Leave" && req.status === "approved")
      .reduce((sum, req) => sum + req.numberOfDays, 0);

    const medicalUsed = staffLeaveRequests
      .filter(req => req.leaveType === "Medical Leave" && req.status === "approved")
      .reduce((sum, req) => sum + req.numberOfDays, 0);

    const casualUsed = staffLeaveRequests
      .filter(req => req.leaveType === "Casual Leave" && req.status === "approved")
      .reduce((sum, req) => sum + req.numberOfDays, 0);

    const specialUsed = staffLeaveRequests
      .filter(req => req.leaveType === "Special Leave" && req.status === "approved")
      .reduce((sum, req) => sum + req.numberOfDays, 0);

    return {
      annual: { total: 20, used: annualUsed, available: 20 - annualUsed },
      medical: { total: 10, used: medicalUsed, available: 10 - medicalUsed },
      casual: { total: 12, used: casualUsed, available: 12 - casualUsed },
      special: { total: 5, used: specialUsed, available: 5 - specialUsed },
    };
  }, [staffLeaveRequests]);

  // Mock attendance stats - in production, this would come from the attendance context
  const attendanceStats = useMemo(() => ({
    present: 45,
    absent: 2,
    halfday: 1,
    late: 3,
  }), []);

  // Status Badge Component
  const getStatusBadge = (status: StaffLeaveApplication["status"]) => {
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
  const leaveColumns: ColumnConfig<StaffLeaveApplication>[] = [
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <StaffLeaveStatsCard
                  title="Annual Leave"
                  total={leaveStats.annual.total}
                  used={leaveStats.annual.used}
                  available={leaveStats.annual.available}
                  variant="annual"
                />
                <StaffLeaveStatsCard
                  title="Medical Leave"
                  total={leaveStats.medical.total}
                  used={leaveStats.medical.used}
                  available={leaveStats.medical.available}
                  variant="medical"
                />
                <StaffLeaveStatsCard
                  title="Casual Leave"
                  total={leaveStats.casual.total}
                  used={leaveStats.casual.used}
                  available={leaveStats.casual.available}
                  variant="casual"
                />
                <StaffLeaveStatsCard
                  title="Special Leave"
                  total={leaveStats.special.total}
                  used={leaveStats.special.used}
                  available={leaveStats.special.available}
                  variant="special"
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
                <DataTable<StaffLeaveApplication>
                  data={leaveApplications}
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
                <StaffAttendanceStatsCard type="present" count={attendanceStats.present} />
                <StaffAttendanceStatsCard type="absent" count={attendanceStats.absent} />
                <StaffAttendanceStatsCard type="halfday" count={attendanceStats.halfday} />
                <StaffAttendanceStatsCard type="late" count={attendanceStats.late} />
              </div>

              {/* Attendance Calendar */}
              <AttendanceCalendar studentId={staffData.staffId} />
            </div>
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyLeaveModalOpen}
        onClose={() => setIsApplyLeaveModalOpen(false)}
        staffData={{
          staffId: staffData.staffId,
          staffName: `${staffData.firstName} ${staffData.lastName}`,
          staffEmail: staffData.email,
          staffDepartment: staffData.subjects?.[0] || staffData.department || "General",
          staffPosition: `${staffData.subjects?.[0] || staffData.department || "General"} Teacher`,
        }}
      />
    </div>
  );
}

function PayrollTab({ staffData }: { staffData: Teacher }) {
  // Mock payroll data - Replace with actual data from API
  const payrollData = {
    grossSalary: 450000,
    deductions: 85500,
    netSalary: 364500,
    taxableIncome: 450000,
    incomeTax: 42500,
    pension: 36000, // 8% of gross
    nhf: 11250, // 2.5% of gross
    bankName: "First Bank of Nigeria",
    accountNumber: "3045678912",
    accountName: `${staffData.firstName} ${staffData.lastName}`,
  };

  // Mock payslips data
  const MOCK_PAYSLIPS: Payslip[] = [
    {
      id: "1",
      month: "November",
      year: 2024,
      grossSalary: 450000,
      deductions: 85500,
      netSalary: 364500,
      paymentDate: "2024-11-30",
      status: "Paid",
    },
    {
      id: "2",
      month: "October",
      year: 2024,
      grossSalary: 450000,
      deductions: 85500,
      netSalary: 364500,
      paymentDate: "2024-10-31",
      status: "Paid",
    },
    {
      id: "3",
      month: "September",
      year: 2024,
      grossSalary: 450000,
      deductions: 85500,
      netSalary: 364500,
      paymentDate: "2024-09-30",
      status: "Paid",
    },
    {
      id: "4",
      month: "August",
      year: 2024,
      grossSalary: 450000,
      deductions: 85500,
      netSalary: 364500,
      paymentDate: "2024-08-31",
      status: "Paid",
    },
    {
      id: "5",
      month: "July",
      year: 2024,
      grossSalary: 450000,
      deductions: 85500,
      netSalary: 364500,
      paymentDate: "2024-07-31",
      status: "Paid",
    },
    {
      id: "6",
      month: "June",
      year: 2024,
      grossSalary: 450000,
      deductions: 85500,
      netSalary: 364500,
      paymentDate: "2024-06-30",
      status: "Paid",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 lg:p-8">
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Payroll Summary Section */}
        <PayrollSummaryCard
          grossSalary={payrollData.grossSalary}
          deductions={payrollData.deductions}
          netSalary={payrollData.netSalary}
        />

        {/* Tax Information and Bank Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <TaxInformationCard
            taxableIncome={payrollData.taxableIncome}
            incomeTax={payrollData.incomeTax}
            pension={payrollData.pension}
            nhf={payrollData.nhf}
          />
          <BankDetailsCard
            bankName={payrollData.bankName}
            accountNumber={payrollData.accountNumber}
            accountName={payrollData.accountName}
          />
        </div>

        {/* Payslips History Table */}
        <PayslipsTable data={MOCK_PAYSLIPS} />
      </div>
    </div>
  );
}

function PerformanceTab({ staffData }: { staffData: Teacher }) {
  const fullName = `${staffData.firstName} ${staffData.lastName}`;
  return <StaffPerformanceReviews staffName={fullName} />;
}
