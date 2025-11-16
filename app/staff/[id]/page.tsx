"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getTeacherById, Teacher } from "@/lib/mockTeachers";
import Image from "next/image";
import {
  Users,
  Calendar,
  FileText,
  Phone,
  Mail,
  Download,
  Trash2,
  Edit,
  Briefcase,
  Building2,
  MapPin,
  CreditCard,
  Shield,
  UserCog,
} from "lucide-react";
import ActionButton from "@/components/shared/ActionButton";
import SecondaryButton from "@/components/shared/SecondaryButton";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import MobileDropdown from "@/components/shared/MobileDropdown";

type TabType = "details" | "attendance" | "performance" | "documents";

export default function ViewStaffPage() {
  const params = useParams();
  const staffId = params?.id as string;
  const router = useRouter();
  const isLoading = usePageLoad(600);
  const [staffData, setStaffData] = useState<Teacher | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (staffId) {
      try {
        const data = getTeacherById(staffId);
        // Verify it's actually a staff member (not a teacher/lecturer)
        if (data && ["Admin", "Support", "Management"].includes(data.role)) {
          setStaffData(data);
        }
      } catch (error) {
        console.error("Error loading staff data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [staffId]);

  const handleDelete = () => {
    console.log("Delete staff:", staffId);
    router.push("/staff");
  };

  const handleEdit = () => {
    router.push(`/staff/${staffId}/edit`);
  };

  if (isLoading || isLoadingData) {
    return (
      <MainLayout>
        <PageLoader isLoading={true} loadingText="Loading Staff Details" />
      </MainLayout>
    );
  }

  if (!staffData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Staff Member Not Found</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">The staff member you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push("/staff")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Staff
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      Admin: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      Support: "bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      Management: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    };
    return colors[role] || colors.Support;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Active: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      "On Leave": "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      Suspended: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      Terminated: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    };
    return colors[status] || colors.Active;
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Staff Profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 mt-1">
                View and manage staff member information
              </p>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <SecondaryButton icon={<Download className="w-4 h-4" />} onClick={() => console.log("Download")}>
                Download
              </SecondaryButton>
              <SecondaryButton icon={<Edit className="w-4 h-4" />} onClick={handleEdit}>
                Edit
              </SecondaryButton>
              <ActionButton icon={<Trash2 className="w-4 h-4" />} onClick={() => setIsDeleteModalOpen(true)} variant="danger">
                Delete
              </ActionButton>
            </div>

            {/* Mobile Actions Dropdown */}
            <div className="sm:hidden">
              <MobileDropdown
                items={[
                  { icon: <Download className="w-4 h-4" />, label: "Download", onClick: () => console.log("Download") },
                  { icon: <Edit className="w-4 h-4" />, label: "Edit", onClick: handleEdit },
                  { icon: <Trash2 className="w-4 h-4" />, label: "Delete", onClick: () => setIsDeleteModalOpen(true), variant: "danger" },
                ]}
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-x-auto">
            {[
              { id: "details", label: "Details", icon: FileText },
              { id: "attendance", label: "Attendance", icon: Calendar },
              { id: "performance", label: "Performance", icon: Shield },
              { id: "documents", label: "Documents", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Left Column - Profile Overview */}
            <div className="lg:col-span-1 space-y-5 sm:space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Profile Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold mb-4">
                    {staffData.firstName[0]}{staffData.lastName[0]}
                  </div>

                  {/* Name */}
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {staffData.firstName} {staffData.lastName}
                  </h2>

                  {/* Staff ID */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 mt-1">
                    {staffData.staffId}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(staffData.role)}`}>
                      {staffData.role}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(staffData.employmentStatus)}`}>
                      {staffData.employmentStatus}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="w-full mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">{staffData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 break-all">{staffData.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
                      {new Date(staffData.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Gender</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{staffData.gender}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Address</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{staffData.address}</p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
                  Employment Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Department</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{staffData.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Employment Type</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{staffData.employmentType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Join Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
                      {new Date(staffData.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Experience</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{staffData.experience} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Qualification</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{staffData.qualification}</p>
                  </div>
                  {staffData.branch && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">Branch</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{staffData.branch}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
            <p className="text-gray-600 dark:text-gray-400">Attendance tracking coming soon...</p>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
            <p className="text-gray-600 dark:text-gray-400">Performance metrics coming soon...</p>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
            <p className="text-gray-600 dark:text-gray-400">Documents management coming soon...</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${staffData.firstName} ${staffData.lastName}? This action cannot be undone.`}
      />
    </MainLayout>
  );
}
