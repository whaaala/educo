"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import Button from "@/components/shared/Button";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import StatCard from "@/components/shared/StatCard";
import Modal from "@/components/shared/Modal";
import {
  Plus,
  Users,
  Eye,
  Edit,
  UserCheck,
  UserX,
  BookOpen,
  AlertCircle,
  GraduationCap,
  Briefcase,
  School,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { LibraryMember, BorrowerType } from "@/types/library";

// Mock Library Members Data
const MOCK_MEMBERS: LibraryMember[] = [
  {
    id: "mem-001",
    memberId: "LIB-2024-0001",
    type: "student",
    personId: "STU-001",
    name: "John Adebayo",
    email: "john.adebayo@school.edu",
    phone: "08012345678",
    class: "SS3A",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-001",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 1,
    totalBorrowedCount: 12,
    finesDue: 0,
    memberSince: "2022-09-01",
    expiryDate: "2025-07-31",
    createdAt: "2022-09-01T08:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "mem-002",
    memberId: "LIB-2024-0002",
    type: "student",
    personId: "STU-002",
    name: "Amina Bello",
    email: "amina.bello@school.edu",
    phone: "08023456789",
    class: "SS2B",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-002",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 1,
    totalBorrowedCount: 8,
    finesDue: 500,
    memberSince: "2023-09-01",
    expiryDate: "2026-07-31",
    createdAt: "2023-09-01T08:00:00Z",
    updatedAt: "2024-01-05T10:30:00Z",
  },
  {
    id: "mem-003",
    memberId: "LIB-2024-0003",
    type: "teacher",
    personId: "TCH-001",
    name: "Mr. Chukwuma Obi",
    email: "c.obi@school.edu",
    phone: "08034567890",
    department: "Science",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-003",
    isActive: true,
    maxBooksAllowed: 5,
    currentBooksCount: 2,
    totalBorrowedCount: 45,
    finesDue: 0,
    memberSince: "2018-01-15",
    createdAt: "2018-01-15T08:00:00Z",
    updatedAt: "2024-01-08T11:00:00Z",
  },
  {
    id: "mem-004",
    memberId: "LIB-2024-0004",
    type: "student",
    personId: "STU-003",
    name: "Grace Eze",
    email: "grace.eze@school.edu",
    phone: "08045678901",
    class: "SS1C",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-004",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 0,
    totalBorrowedCount: 22,
    finesDue: 0,
    memberSince: "2023-09-01",
    expiryDate: "2027-07-31",
    createdAt: "2023-09-01T08:00:00Z",
    updatedAt: "2024-01-15T16:30:00Z",
  },
  {
    id: "mem-005",
    memberId: "LIB-2024-0005",
    type: "student",
    personId: "STU-004",
    name: "Ibrahim Musa",
    email: "ibrahim.musa@school.edu",
    phone: "08056789012",
    class: "JS3A",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-005",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 1,
    totalBorrowedCount: 6,
    finesDue: 0,
    memberSince: "2023-09-01",
    expiryDate: "2028-07-31",
    createdAt: "2023-09-01T08:00:00Z",
    updatedAt: "2024-01-12T09:45:00Z",
  },
  {
    id: "mem-006",
    memberId: "LIB-2024-0006",
    type: "student",
    personId: "STU-005",
    name: "Fatima Yusuf",
    email: "fatima.yusuf@school.edu",
    phone: "08067890123",
    class: "SS2A",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-006",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 0,
    totalBorrowedCount: 15,
    finesDue: 0,
    memberSince: "2023-09-01",
    expiryDate: "2026-07-31",
    createdAt: "2023-09-01T08:00:00Z",
    updatedAt: "2024-01-05T11:00:00Z",
  },
  {
    id: "mem-007",
    memberId: "LIB-2024-0007",
    type: "staff",
    personId: "STF-001",
    name: "Mrs. Adaeze Nwosu",
    email: "a.nwosu@school.edu",
    phone: "08078901234",
    department: "Administration",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-007",
    isActive: true,
    maxBooksAllowed: 4,
    currentBooksCount: 1,
    totalBorrowedCount: 28,
    finesDue: 0,
    memberSince: "2019-03-10",
    createdAt: "2019-03-10T08:00:00Z",
    updatedAt: "2024-01-11T15:30:00Z",
  },
  {
    id: "mem-008",
    memberId: "LIB-2024-0008",
    type: "student",
    personId: "STU-006",
    name: "David Okafor",
    email: "david.okafor@school.edu",
    phone: "08089012345",
    class: "SS3B",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-008",
    isActive: true,
    maxBooksAllowed: 3,
    currentBooksCount: 1,
    totalBorrowedCount: 18,
    finesDue: 900,
    memberSince: "2022-09-01",
    expiryDate: "2025-07-31",
    createdAt: "2022-09-01T08:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "mem-009",
    memberId: "LIB-2024-0009",
    type: "teacher",
    personId: "TCH-002",
    name: "Mrs. Ngozi Okoro",
    email: "n.okoro@school.edu",
    phone: "08090123456",
    department: "English",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-009",
    isActive: true,
    maxBooksAllowed: 5,
    currentBooksCount: 3,
    totalBorrowedCount: 67,
    finesDue: 0,
    memberSince: "2015-09-01",
    createdAt: "2015-09-01T08:00:00Z",
    updatedAt: "2024-01-09T14:00:00Z",
  },
  {
    id: "mem-010",
    memberId: "LIB-2024-0010",
    type: "student",
    personId: "STU-007",
    name: "Emmanuel Udo",
    email: "emmanuel.udo@school.edu",
    phone: "08001234567",
    class: "JS2B",
    avatarUrl: "https://i.pravatar.cc/150?u=mem-010",
    isActive: false,
    maxBooksAllowed: 3,
    currentBooksCount: 0,
    totalBorrowedCount: 4,
    finesDue: 200,
    memberSince: "2023-09-01",
    expiryDate: "2024-01-01",
    createdAt: "2023-09-01T08:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Filter options
const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "student", label: "Students" },
  { value: "staff", label: "Staff" },
  { value: "teacher", label: "Teachers" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const FINE_OPTIONS = [
  { value: "all", label: "All Members" },
  { value: "with-fines", label: "With Fines" },
  { value: "no-fines", label: "No Fines" },
];

export default function LibraryMembersPage() {
  const isPageLoading = usePageLoad(600);
  const { settings } = useSchoolSettings();
  const { countryCode, countryConfig } = useCountry();
  const currencySymbol = countryConfig.currency.symbol;

  // State
  const [members, setMembers] = useState<LibraryMember[]>(MOCK_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFineFilter, setSelectedFineFilter] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState<LibraryMember | null>(null);

  // Loading states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Handle filter changes
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => setIsFiltering(false), 100);
    }, 200);
  };

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.class?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || member.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && member.isActive) ||
        (selectedStatus === "inactive" && !member.isActive);
      const matchesFineFilter =
        selectedFineFilter === "all" ||
        (selectedFineFilter === "with-fines" && member.finesDue > 0) ||
        (selectedFineFilter === "no-fines" && member.finesDue === 0);

      return matchesSearch && matchesType && matchesStatus && matchesFineFilter;
    });
  }, [members, searchQuery, selectedType, selectedStatus, selectedFineFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.isActive).length;
    const totalWithFines = members.filter((m) => m.finesDue > 0).length;
    const totalFinesAmount = members.reduce((sum, m) => sum + m.finesDue, 0);
    const totalBooksBorrowed = members.reduce((sum, m) => sum + m.currentBooksCount, 0);

    return { totalMembers, activeMembers, totalWithFines, totalFinesAmount, totalBooksBorrowed };
  }, [members]);

  // Handle view member
  const handleView = (member: LibraryMember) => {
    setViewingMember(member);
    setIsViewModalOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedFineFilter("all");
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Get member type badge
  const getMemberTypeBadge = (type: BorrowerType) => {
    const typeConfig: Record<BorrowerType, { bg: string; text: string; icon: React.ReactNode }> = {
      student: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        icon: <GraduationCap className="w-3 h-3" />,
      },
      staff: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        icon: <Briefcase className="w-3 h-3" />,
      },
      teacher: {
        bg: "bg-cyan-100 dark:bg-cyan-900/30",
        text: "text-cyan-700 dark:text-cyan-400",
        icon: <School className="w-3 h-3" />,
      },
    };

    const config = typeConfig[type];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text} capitalize`}>
        {config.icon}
        {type}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          <UserCheck className="w-3 h-3" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
        <UserX className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  // Table columns
  const columns: ColumnConfig<LibraryMember>[] = [
    {
      key: "memberId",
      label: "Member ID",
      sortable: true,
      render: (member) => (
        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{member.memberId}</span>
      ),
    },
    {
      key: "name",
      label: "Member",
      sortable: true,
      render: (member) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`}
              alt={member.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">{member.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {member.class || member.department}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (member) => getMemberTypeBadge(member.type),
    },
    {
      key: "currentBooksCount",
      label: "Books",
      sortable: true,
      render: (member) => (
        <div className="text-center">
          <span className={`font-semibold ${member.currentBooksCount >= member.maxBooksAllowed ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
            {member.currentBooksCount}
          </span>
          <span className="text-gray-400"> / {member.maxBooksAllowed}</span>
        </div>
      ),
    },
    {
      key: "totalBorrowedCount",
      label: "Total Borrowed",
      sortable: true,
      render: (member) => (
        <span className="text-gray-600 dark:text-gray-400">{member.totalBorrowedCount}</span>
      ),
    },
    {
      key: "finesDue",
      label: "Fines Due",
      sortable: true,
      render: (member) =>
        member.finesDue > 0 ? (
          <span className="font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(member.finesDue, countryCode)}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (member) => getStatusBadge(member.isActive),
    },
    {
      key: "actions",
      label: "Actions",
      render: (member) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleView(member)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
            title="Edit Member"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const isLoading = isRefreshing || isFiltering;

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Members" />

      <div className={`space-y-6 transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <PageHeader
            title="Library Members"
            breadcrumbs={[
              { label: "Management", href: "/library" },
              { label: "Library", href: "/library" },
              { label: "Members" },
            ]}
          />
          <PageActions
            primaryAction={{
              label: "Add Member",
              onClick: () => setIsAddModalOpen(true),
              icon: <Plus className="w-4 h-4" />,
            }}
            secondaryActions={[
              { label: "Export", onClick: () => {}, icon: <Download className="w-4 h-4" />, variant: "outline" },
            ]}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Members"
            value={stats.totalMembers.toString()}
            icon={Users}
            color="blue"
          />
          <StatCard
            label="Active Members"
            value={stats.activeMembers.toString()}
            icon={UserCheck}
            color="green"
          />
          <StatCard
            label="Books Borrowed"
            value={stats.totalBooksBorrowed.toString()}
            icon={BookOpen}
            color="purple"
          />
          <StatCard
            label="Outstanding Fines"
            value={formatCurrency(stats.totalFinesAmount, countryCode)}
            subtitle={`${stats.totalWithFines} members`}
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name, ID, email, class, or department..."
          filters={[
            {
              label: "Type",
              value: selectedType,
              onChange: (val) => handleFilterChange(setSelectedType, val),
              options: TYPE_OPTIONS,
            },
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => handleFilterChange(setSelectedStatus, val),
              options: STATUS_OPTIONS,
            },
            {
              label: "Fines",
              value: selectedFineFilter,
              onChange: (val) => handleFilterChange(setSelectedFineFilter, val),
              options: FINE_OPTIONS,
            },
          ]}
        />

        {/* Data Table */}
        <DataTable
          data={filteredMembers}
          columns={columns}
          getRowKey={(member) => member.id}
          isLoading={isLoading}
          emptyMessage="No members found"
        />
      </div>

      {/* View Member Modal */}
      {viewingMember && (
        <MemberViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingMember(null);
          }}
          member={viewingMember}
          getMemberTypeBadge={getMemberTypeBadge}
          getStatusBadge={getStatusBadge}
          formatCurrency={(amount) => formatCurrency(amount, countryCode)}
        />
      )}
    </MainLayout>
  );
}

// Member View Modal Component
function MemberViewModal({
  isOpen,
  onClose,
  member,
  getMemberTypeBadge,
  getStatusBadge,
  formatCurrency,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: LibraryMember;
  getMemberTypeBadge: (type: BorrowerType) => React.ReactNode;
  getStatusBadge: (isActive: boolean) => React.ReactNode;
  formatCurrency: (amount: number) => string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Details" size="md">
      <div className="space-y-6">
        {/* Header with Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`}
              alt={member.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {getMemberTypeBadge(member.type)}
              {getStatusBadge(member.isActive)}
            </div>
          </div>
        </div>

        {/* Member ID Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs uppercase opacity-80">Library Card</span>
          </div>
          <p className="font-mono text-lg font-bold">{member.memberId}</p>
          <p className="text-sm opacity-80 mt-1">{member.class || member.department}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Contact Information</h4>
          {member.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${member.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {member.email}
              </a>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{member.phone}</span>
            </div>
          )}
        </div>

        {/* Borrowing Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {member.currentBooksCount}
            </p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Current</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {member.maxBooksAllowed}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Max Allowed</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {member.totalBorrowedCount}
            </p>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Total</p>
          </div>
        </div>

        {/* Fines Due */}
        {member.finesDue > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">Outstanding Fines</h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {formatCurrency(member.finesDue)}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        )}

        {/* Membership Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Member Since</p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(member.memberSince).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          {member.expiryDate && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Expires</p>
              </div>
              <p className={`text-sm font-medium ${new Date(member.expiryDate) < new Date() ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                {new Date(member.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
