"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import PageSpinner from "@/components/shared/PageSpinner";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import Button from "@/components/shared/Button";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import StatCard from "@/components/shared/StatCard";
import Tooltip from "@/components/shared/Tooltip";
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
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Hash,
  Clock,
} from "lucide-react";
import type { LibraryMember, BorrowerType } from "@/types/library";
import { exportMembersToExcel, exportMembersToPDF } from "@/lib/export-utils";
import MemberViewModal from "@/components/library/MemberViewModal";
import EditMemberModal from "@/components/library/EditMemberModal";
import AddMemberModal from "@/components/library/AddMemberModal";

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
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/men/5.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/women/6.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/women/7.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/men/8.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/women/9.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/men/10.jpg",
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
  const { countryCode } = useCountry();

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<LibraryMember | null>(null);

  // Loading states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Animation trigger
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Create a filterKey to track filter/search changes
  const filterKey = `${searchQuery}-${selectedType}-${selectedStatus}-${selectedFineFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Handle filter changes with animation
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => setIsFiltering(false), 100);
    }, 200);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
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

  // Trigger animation when filterKey changes
  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger((prev) => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  // Apply row animation when filter/search changes
  useEffect(() => {
    if (animationTrigger > 0) {
      const timeoutId = setTimeout(() => {
        const tables = document.querySelectorAll("table");
        tables.forEach((table) => {
          const rows = table.querySelectorAll("tbody tr");
          rows.forEach((row, index) => {
            const htmlRow = row as HTMLElement;
            const delay = index / 80;
            htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
          });
        });

        // Cleanup after animation completes
        setTimeout(() => {
          tables.forEach((table) => {
            const rows = table.querySelectorAll("tbody tr");
            rows.forEach((row) => {
              const htmlRow = row as HTMLElement;
              htmlRow.style.animation = "";
            });
          });
        }, 600);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [animationTrigger]);

  // Handle view member
  const handleView = (member: LibraryMember) => {
    setViewingMember(member);
    setIsViewModalOpen(true);
  };

  // Handle edit member
  const handleEdit = (member: LibraryMember) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = (updatedMember: LibraryMember) => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setMembers((prev) =>
        prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
      );
      setIsSaving(false);
      setIsEditModalOpen(false);
      setEditingMember(null);
    }, 500);
  };

  // Handle add member
  const handleAddMember = (memberData: Omit<LibraryMember, "id" | "createdAt" | "updatedAt">) => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      const newMember: LibraryMember = {
        ...memberData,
        id: `mem-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMembers((prev) => [newMember, ...prev]);
      setIsSaving(false);
      setIsAddModalOpen(false);
    }, 500);
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

  // Export to PDF
  const handleExportPDF = () => {
    exportMembersToPDF(
      filteredMembers,
      "library-members",
      (amount) => formatCurrency(amount, countryCode),
      settings.schoolName
    );
  };

  // Export to Excel
  const handleExportExcel = () => {
    exportMembersToExcel(
      filteredMembers,
      "library-members",
      (amount) => formatCurrency(amount, countryCode)
    );
  };

  // Get member type badge
  const getMemberTypeBadge = (type: BorrowerType) => {
    const typeConfig: Record<BorrowerType, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
      student: {
        bg: "bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/20 purple:bg-purple-900/20",
        text: "text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
        icon: <GraduationCap className="w-3 h-3" />,
      },
      staff: {
        bg: "bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/20 purple:bg-orange-900/20",
        text: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        icon: <Briefcase className="w-3 h-3" />,
      },
      teacher: {
        bg: "bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/20 purple:bg-cyan-900/20",
        text: "text-cyan-700 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400",
        border: "border-cyan-200 dark:border-cyan-800",
        icon: <School className="w-3 h-3" />,
      },
    };

    const config = typeConfig[type];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border} capitalize`}
        style={{ fontSize: "10px" }}
      >
        {config.icon}
        {type}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/20 purple:bg-green-900/20 text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400 border-green-200 dark:border-green-800"
          style={{ fontSize: "11.8px" }}
        >
          <UserCheck className="w-3 h-3" />
          Active
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 border-gray-200 dark:border-gray-600"
        style={{ fontSize: "11.8px" }}
      >
        <UserX className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  // Calculate membership duration
  const getMembershipDuration = (memberSince: string) => {
    const start = new Date(memberSince);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;

    if (totalMonths < 12) {
      return `${totalMonths} months`;
    }
    return `${Math.floor(totalMonths / 12)} years`;
  };

  // Table columns
  const columns: ColumnConfig<LibraryMember>[] = [
    {
      key: "memberId",
      label: "Member ID",
      sortable: true,
      render: (member) => (
        <span
          className="font-mono text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100"
          style={{ fontSize: "11.8px" }}
        >
          {member.memberId}
        </span>
      ),
    },
    {
      key: "name",
      label: "Member",
      sortable: true,
      className: "text-left",
      render: (member) => (
        <div className="flex items-center gap-2">
          <div
            className="relative cursor-pointer group/avatar flex-shrink-0 w-8 h-8"
            onMouseEnter={(e) => {
              const tr = e.currentTarget.closest("tr");
              if (tr) {
                tr.style.zIndex = "100";
                tr.style.position = "relative";
              }
              const scrollContainer = e.currentTarget.closest(".overflow-x-auto");
              if (scrollContainer) {
                (scrollContainer as HTMLElement).style.zIndex = "100";
                (scrollContainer as HTMLElement).style.position = "relative";
              }
            }}
            onMouseLeave={(e) => {
              const tr = e.currentTarget.closest("tr");
              if (tr) {
                tr.style.zIndex = "";
                tr.style.position = "";
              }
              const scrollContainer = e.currentTarget.closest(".overflow-x-auto");
              if (scrollContainer) {
                (scrollContainer as HTMLElement).style.zIndex = "";
                (scrollContainer as HTMLElement).style.position = "";
              }
            }}
          >
            <Image
              src={member.avatarUrl || `https://randomuser.me/api/portraits/${member.type === "student" ? (member.id.includes("002") || member.id.includes("004") || member.id.includes("006") ? "women" : "men") : "men"}/${parseInt(member.id.replace("mem-", "")) % 100}.jpg`}
              alt={member.name}
              width={32}
              height={32}
              className="absolute inset-0 w-8 h-8 rounded-full object-cover ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-300 ease-out group-hover/avatar:scale-[2.5] group-hover/avatar:shadow-2xl group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90"
              style={{ transformOrigin: "left center" }}
              unoptimized
            />
          </div>
          <div>
            <div
              className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
              style={{ fontSize: "11.8px" }}
            >
              {member.name}
            </div>
            <div
              className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60"
              style={{ fontSize: "10px" }}
            >
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
        <div className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
          <span
            className={`font-semibold ${
              member.currentBooksCount >= member.maxBooksAllowed
                ? "text-red-600 dark:text-red-400"
                : "text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
            }`}
            style={{ fontSize: "11.8px" }}
          >
            {member.currentBooksCount}
          </span>
          <span className="text-gray-400" style={{ fontSize: "11.8px" }}>
            / {member.maxBooksAllowed}
          </span>
        </div>
      ),
    },
    {
      key: "totalBorrowedCount",
      label: "Total Borrowed",
      sortable: true,
      render: (member) => (
        <span
          className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
          style={{ fontSize: "11.8px" }}
        >
          {member.totalBorrowedCount}
        </span>
      ),
    },
    {
      key: "memberSince",
      label: "Member Since",
      sortable: true,
      render: (member) => (
        <div>
          <div
            className="text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100"
            style={{ fontSize: "11.8px" }}
          >
            {new Date(member.memberSince).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1 text-gray-400" style={{ fontSize: "10px" }}>
            <Clock className="w-3 h-3" />
            {getMembershipDuration(member.memberSince)}
          </div>
        </div>
      ),
    },
    {
      key: "finesDue",
      label: "Fines Due",
      sortable: true,
      render: (member) =>
        member.finesDue > 0 ? (
          <span
            className="font-semibold text-red-600 dark:text-red-400"
            style={{ fontSize: "11.8px" }}
          >
            {formatCurrency(member.finesDue, countryCode)}
          </span>
        ) : (
          <span className="text-gray-400" style={{ fontSize: "11.8px" }}>
            -
          </span>
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
      className: "text-center",
      render: (member) => (
        <div className="flex items-center justify-center gap-2.5">
          <Tooltip content="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView(member);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 midnight:from-blue-950/30 midnight:to-blue-900/20 purple:from-blue-950/30 purple:to-blue-900/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 transition-all duration-200 cursor-pointer border border-blue-200/40 dark:border-blue-800/30 hover:border-blue-400/60 dark:hover:border-blue-600/50 active:scale-95"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
            </button>
          </Tooltip>
          <Tooltip content="Edit Member">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(member);
              }}
              className="group relative p-2 rounded-lg bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20 midnight:from-amber-950/30 midnight:to-amber-900/20 purple:from-amber-950/30 purple:to-amber-900/20 hover:from-amber-100 hover:to-amber-100 dark:hover:from-amber-900/40 dark:hover:to-amber-800/30 transition-all duration-200 cursor-pointer border border-amber-200/40 dark:border-amber-800/30 hover:border-amber-400/60 dark:hover:border-amber-600/50 active:scale-95"
            >
              <Edit className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const isLoading = isRefreshing || isFiltering;

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Members" />

      <div
        className={`space-y-6 transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <PageHeader
            title="Library Members"
            breadcrumbs={[
              { label: "Library", href: "/library" },
              { label: "Members" },
            ]}
          />
          <PageActions
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onAdd={() => setIsAddModalOpen(true)}
            addButtonLabel="Add Member"
            exportDescription="Export member records"
            showPrint={false}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Users}
            label="Total Members"
            value={stats.totalMembers.toString()}
            color="blue"
            badge={`${filteredMembers.length} shown`}
          />
          <StatCard
            icon={UserCheck}
            label="Active Members"
            value={stats.activeMembers.toString()}
            color="green"
            badge={`${Math.round((stats.activeMembers / stats.totalMembers) * 100)}%`}
          />
          <StatCard
            icon={BookOpen}
            label="Books Borrowed"
            value={stats.totalBooksBorrowed.toString()}
            color="purple"
          />
          <StatCard
            icon={AlertCircle}
            label="Outstanding Fines"
            value={formatCurrency(stats.totalFinesAmount, countryCode)}
            color="red"
            badge={stats.totalWithFines > 0 ? `${stats.totalWithFines} members` : "None"}
          />
        </div>

        {/* Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search by name, ID, email, class, or department..."
          filters={[
            {
              label: "Type",
              value: selectedType,
              onChange: (val) => handleFilterChange(setSelectedType, String(val)),
              options: TYPE_OPTIONS,
            },
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => handleFilterChange(setSelectedStatus, String(val)),
              options: STATUS_OPTIONS,
            },
            {
              label: "Fines",
              value: selectedFineFilter,
              onChange: (val) => handleFilterChange(setSelectedFineFilter, String(val)),
              options: FINE_OPTIONS,
            },
          ]}
        />

        {/* Table Section */}
        <div>
          {isLoading ? (
            <PageSpinner
              message={isRefreshing ? "Refreshing..." : "Filtering..."}
              size="md"
            />
          ) : filteredMembers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-16 h-16">
                    <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-1 text-center">
                  No members found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                  {searchQuery
                    ? "No results match your search. Try adjusting your filters."
                    : "Get started by adding your first library member."}
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </Button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="relative pb-16">
              {/* Mobile Scroll Indicator */}
              <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

              <div
                key={`table-data-${filterKey}`}
                className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-visible"
              >
                <DataTable
                  data={filteredMembers}
                  columns={columns}
                  getRowKey={(member) => member.id}
                  emptyMessage="No members found"
                  title=""
                  showSearch={false}
                  defaultItemsPerPage={10}
                  itemsPerPageOptions={[5, 10, 15, 20, 25]}
                  enablePagination={true}
                  enableItemsPerPage={true}
                  onRowClick={handleView}
                />
              </div>
            </div>
          )}
        </div>
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
          formatCurrency={(amount) => formatCurrency(amount, countryCode)}
          onEdit={() => {
            setIsViewModalOpen(false);
            setViewingMember(null);
            handleEdit(viewingMember);
          }}
        />
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <EditMemberModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingMember(null);
          }}
          member={editingMember}
          onSave={handleSaveEdit}
          isSaving={isSaving}
        />
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
        isAdding={isSaving}
      />
    </MainLayout>
  );
}
