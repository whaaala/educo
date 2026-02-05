"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import { getTeacherById, Teacher } from "@/lib/mockTeachers";
import Image from "next/image";
import {
  Users,
  Calendar,
  FileText,
  BookOpen,
  Phone,
  Mail,
  Download,
  Clock,
  KeyRound,
  Trash2,
  Edit,
  Briefcase,
  GraduationCap,
  Award,
  Building2,
  MapPin,
  CreditCard,
} from "lucide-react";
import ActionButton from "@/components/shared/ActionButton";
import SecondaryButton from "@/components/shared/SecondaryButton";
import ActionModal from "@/components/shared/ActionModal";
import MobileDropdown from "@/components/shared/MobileDropdown";
import CustomDropdown from "@/components/shared/CustomDropdown";

type TabType = "details" | "classes" | "attendance" | "performance" | "documents";

export default function ViewTeacherPage() {
  const params = useParams();
  const teacherId = params?.id as string;
  const router = useRouter();
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (teacherId) {
      try {
        const data = getTeacherById(teacherId);
        if (data) {
          setTeacherData(data);
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [teacherId]);

  const handleDelete = () => {
    console.log("Delete teacher:", teacherId);
    router.push("/teachers");
  };

  const handleEdit = () => {
    router.push(`/teachers/${teacherId}/edit`);
  };

  if (isLoadingData) {
    return (
      <DashboardPage
        title="Teacher Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Teachers", href: "/teachers" },
          { label: "Profile", isActive: true },
        ]}
        loadingText="Loading Teacher Details"
      />
    );
  }

  if (!teacherData) {
    return (
      <DashboardPage
        title="Teacher Not Found"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Teachers", href: "/teachers" },
          { label: "Not Found", isActive: true },
        ]}
        loadingText="Loading Teacher Details"
        afterStats={
          <div className="mt-6 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Teacher Not Found
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                The teacher you&apos;re looking for doesn&apos;t exist.
              </p>
              <button
                onClick={() => router.push("/teachers")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Teachers
              </button>
            </div>
          </div>
        }
      />
    );
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      Teacher: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      Lecturer: "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      Admin: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    };
    return colors[role] || colors.Teacher;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Active: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      "On Leave": "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    };
    return colors[status] || colors.Active;
  };

  return (
    <DashboardPage
      title="Teacher Profile"
      description="View and manage teacher information"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Teachers", href: "/teachers" },
        { label: `${teacherData.firstName} ${teacherData.lastName}`, isActive: true },
      ]}
      loadingText="Loading Teacher Details"
      afterStats={
        <div className="mt-6 space-y-5 sm:space-y-6">
          {/* Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">

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
          </div>

        {/* Profile Overview Card */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {teacherData.imageUrl ? (
                    <Image src={teacherData.imageUrl} alt={`${teacherData.firstName} ${teacherData.lastName}`} fill className="object-cover" />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {teacherData.firstName[0]}
                      {teacherData.lastName[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {teacherData.firstName} {teacherData.lastName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 mt-1">
                      Staff ID: {teacherData.staffId}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(teacherData.role)}`}>
                      {teacherData.role}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(teacherData.employmentStatus)}`}>
                      {teacherData.employmentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{teacherData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{teacherData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{teacherData.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: "details", label: "Details", icon: <FileText className="w-4 h-4" /> },
              { id: "classes", label: "Classes & Subjects", icon: <BookOpen className="w-4 h-4" /> },
              { id: "attendance", label: "Attendance", icon: <Calendar className="w-4 h-4" /> },
              { id: "performance", label: "Performance", icon: <Award className="w-4 h-4" /> },
              { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-5 sm:space-y-6">
          {activeTab === "details" && (
            <>
              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Full Name</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {teacherData.firstName} {teacherData.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(teacherData.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Gender</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{teacherData.gender}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Address</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{teacherData.address}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Qualification</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{teacherData.qualification}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Specialization</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{teacherData.specialization}</p>
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
                    <label className="text-xs text-gray-500 dark:text-gray-400">Join Date</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(teacherData.joinDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Employment Type</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{teacherData.employmentType}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Experience</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{teacherData.experience} years</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Branch</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{teacherData.branch}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Salary</label>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">₦{teacherData.salary.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "classes" && (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
                Classes & Subjects
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Classes</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {teacherData.classes.map((cls, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Subjects</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {teacherData.subjects.map((subject, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">Attendance Records</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teacher attendance tracking will be displayed here.</p>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">Performance Reviews</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teacher performance reviews and evaluations will be displayed here.</p>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-gray-800 purple:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">Documents</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teacher documents and certificates will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
      }
    >
      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Teacher"
        subtitle={`${teacherData.firstName} ${teacherData.lastName} • ${teacherData.staffId}`}
        variant="danger"
        message={`Are you sure you want to delete ${teacherData.firstName} ${teacherData.lastName}? This action cannot be undone.`}
        confirmLabel="Delete Teacher"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />
    </DashboardPage>
  );
}
