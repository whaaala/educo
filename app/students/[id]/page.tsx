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
  DollarSign,
  FileText,
  BookOpen,
  Phone,
  Mail,
  Lock,
  Download,
  Clock,
  Edit,
  KeyRound,
  Search,
  ExternalLink,
} from "lucide-react";
import type { ExtendedStudentData } from "@/lib/mockStudents";
import StudentProfileCard from "@/components/students/StudentProfileCard";
import PrimaryContactInfoCard from "@/components/students/PrimaryContactInfoCard";
import SiblingInformationCard from "@/components/students/SiblingInformationCard";
import HostelTransportCard from "@/components/students/HostelTransportCard";
import CollectFeesModal from "@/components/shared/CollectFeesModal";

type TabType = "details" | "timetable" | "attendance" | "fees" | "exam" | "library";

export default function ViewStudentPage() {
  const params = useParams();
  const studentId = params?.id as string;
  const router = useRouter();
  const isLoading = usePageLoad(600);
  const [studentData, setStudentData] = useState<ExtendedStudentData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);

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
    { id: "fees" as TabType, label: "Fees", icon: DollarSign },
    { id: "exam" as TabType, label: "Exam & Results", icon: FileText },
    { id: "library" as TabType, label: "Library", icon: BookOpen },
  ];

  return (
    <MainLayout>
      <PageLoader isLoading={isLoading} loadingText="Loading Student Details" />
      
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
                Student Details
              </h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                <a href="/" className="hover:text-gray-900 dark:hover:text-gray-200 midnight:hover:text-cyan-200 purple:hover:text-pink-200 transition-colors">
                  Dashboard
                </a>
                <span>/</span>
                <a href="/students" className="hover:text-gray-900 dark:hover:text-gray-200 midnight:hover:text-cyan-200 purple:hover:text-pink-200 transition-colors">
                  Student
                </a>
                <span>/</span>
                <span className="text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 font-medium">
                  Student Details
                </span>
              </nav>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                Login Details
              </button>
              <button
                onClick={() => router.push(`/students/edit/${studentId}`)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 midnight:hover:bg-cyan-700 purple:hover:bg-pink-700 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                Edit Student
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
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
            
            <div className="mt-6">
              {activeTab === "details" && (
                <StudentDetailsTab
                  studentData={studentData}
                  fatherPhotoUrl={fatherPhotoUrl}
                  motherPhotoUrl={motherPhotoUrl}
                  guardianPhotoUrl={guardianPhotoUrl}
                />
              )}
              {activeTab === "timetable" && <TimetableTab />}
              {activeTab === "attendance" && <AttendanceTab />}
              {activeTab === "fees" && <FeesTab />}
              {activeTab === "exam" && <ExamResultsTab />}
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
      <div className="mb-4">
        <StudentProfileCard
          studentData={studentData}
          fullName={fullName}
          profilePhotoUrl={profilePhotoUrl}
          onAddFees={onAddFees}
        />
      </div>

      {/* Primary Contact Info */}
      <div className="mb-4">
        <PrimaryContactInfoCard
          phoneNumber={studentData.primaryContact}
          email={studentData.email}
        />
      </div>

      {/* Sibling Information */}
      <div className="mb-4">
        <SiblingInformationCard siblings={studentData.siblings} />
      </div>

      {/* Hostel / Transportation */}
      <div className="mb-4">
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
  return (
    <div className="flex flex-wrap lg:flex-nowrap">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-2 sm:px-3 md:px-4 py-4 border-b-[3px] transition-all duration-200 whitespace-nowrap flex-1 sm:flex-initial lg:flex-initial ${
              isActive
                ? "border-blue-600 dark:border-blue-500 midnight:border-cyan-600 purple:border-pink-600 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-semibold"
                : "border-transparent text-gray-700 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:text-gray-900 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200"
            } cursor-pointer`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70"}`} />
            <span className="text-sm">{tab.label}</span>
          </button>
        );
      })}
    </div>
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

  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
      {/* Parents/Guardian Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
          Parents/Guardian Information
        </h3>
        <div className="space-y-4">
          {studentData.motherFirstName && (
            <ParentCard
              name={`${studentData.motherFirstName} ${studentData.motherMiddleName || ""} ${studentData.motherLastName || ""}`.trim()}
              role="Mother"
              phone={studentData.motherPhone || "-"}
              email={studentData.motherEmail || "-"}
              photoUrl={motherPhotoUrl}
            />
          )}
          {studentData.fatherFirstName && (
            <ParentCard
              name={`${studentData.fatherFirstName} ${studentData.fatherMiddleName || ""} ${studentData.fatherLastName || ""}`.trim()}
              role="Father"
              phone={studentData.fatherPhone || "-"}
              email={studentData.fatherEmail || "-"}
              photoUrl={fatherPhotoUrl}
            />
          )}
          {studentData.guardianFirstName && (
            <ParentCard
              name={`${studentData.guardianFirstName} ${studentData.guardianMiddleName || ""} ${studentData.guardianLastName || ""}`.trim()}
              role={`Guardian (${studentData.guardianRelation || "Guardian"})`}
              phone={studentData.guardianPhone || "-"}
              email={studentData.guardianEmail || "-"}
              photoUrl={guardianPhotoUrl}
            />
          )}
        </div>
      </div>

      {/* Documents */}
      {Array.isArray(studentData.documents) && studentData.documents.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            Documents
          </h3>
          <div className="space-y-3">
            {studentData.documents.map((doc: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">PDF</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                    {doc?.name || `Document ${idx + 1}`}
                  </span>
                </div>
                <button className="p-2 bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Address */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
          Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
                Current Address
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                {currentAddress}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
                Permanent Address
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                {permanentAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Previous School Details */}
      {studentData.previousSchoolName && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            Previous School Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                Previous School Name
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                {studentData.previousSchoolName}
              </p>
            </div>
            {studentData.previousSchoolAddress && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                  School Address
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                  {studentData.previousSchoolAddress}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bank Details */}
      {(studentData.bankName || studentData.branch || studentData.ifscNumber) && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studentData.bankName && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                  Bank Name
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                  {studentData.bankName}
                </p>
              </div>
            )}
            {studentData.branch && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                  Branch
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                  {studentData.branch}
                </p>
              </div>
            )}
            {studentData.ifscNumber && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                  IFSC
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                  {studentData.ifscNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medical History */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
          Medical History
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(studentData.allergies) && studentData.allergies.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-2">
                Known Allergies
              </p>
              <div className="flex flex-wrap gap-2">
                {studentData.allergies.map((allergy: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 rounded-full text-xs font-medium"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-2">
                Known Allergies
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                -
              </p>
            </div>
          )}
          {Array.isArray(studentData.medications) && studentData.medications.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-2">
                Medications
              </p>
              <div className="flex flex-wrap gap-2">
                {studentData.medications.map((med: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 rounded-full text-xs font-medium"
                  >
                    {med}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-2">
                Medications
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                -
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Other Info */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
          Other Info
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 leading-relaxed">
          Depending on the specific needs of your organization or system, additional information may be collected or tracked. It's important to ensure that any data collected complies with privacy regulations and policies to protect students' sensitive information.
        </p>
      </div>
    </div>
  );
}

// Parent Card Component
function ParentCard({
  name,
  role,
  phone,
  email,
  photoUrl,
}: {
  name: string;
  role: string;
  phone: string;
  email: string;
  photoUrl: string | null;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {photoUrl ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 flex-shrink-0">
            <Image
              src={photoUrl}
              alt={name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
              {name}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 flex-shrink-0">
              ({role})
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{phone}</span>
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </span>
          </div>
        </div>
      </div>
      <button className="p-2 bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 cursor-pointer flex-shrink-0 ml-2">
        <Lock className="w-4 h-4" />
      </button>
    </div>
  );
}

// Placeholder components for other tabs
function TimetableTab() {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 midnight:text-cyan-800 purple:text-pink-800 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
          Timetable content coming soon
        </p>
      </div>
    </div>
  );
}

function AttendanceTab() {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 midnight:text-cyan-800 purple:text-pink-800 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
          Attendance content coming soon
        </p>
      </div>
    </div>
  );
}

function FeesTab() {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-400 dark:text-gray-600 midnight:text-cyan-800 purple:text-pink-800 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
          Fees content coming soon
        </p>
      </div>
    </div>
  );
}

function ExamResultsTab() {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 midnight:text-cyan-800 purple:text-pink-800 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
          Exam & Results content coming soon
        </p>
      </div>
    </div>
  );
}

function LibraryTab() {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 midnight:text-cyan-800 purple:text-pink-800 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
          Library content coming soon
        </p>
      </div>
    </div>
  );
}

