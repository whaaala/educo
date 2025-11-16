"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Teacher } from "@/lib/mockTeachers";
import { Phone, Mail, Eye } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import NameLabel from "@/components/shared/NameLabel";

interface TeacherTableProps {
  teachers: Teacher[];
  isLoading?: boolean;
  loadingMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  totalTeachersCount?: number;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export default function TeacherTable({
  teachers,
  isLoading = false,
  loadingMessage = "Loading...",
  onClearFilters,
  hasActiveFilters = false,
  totalTeachersCount,
  selectedIds: externalSelectedIds,
  onSelectionChange
}: TeacherTableProps) {
  const router = useRouter();
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());

  // Use external state if provided, otherwise use internal state
  const selectedIds = externalSelectedIds ?? internalSelectedIds;
  const updateSelectedIds = (newIds: Set<string>) => {
    if (onSelectionChange) {
      onSelectionChange(newIds);
    } else {
      setInternalSelectedIds(newIds);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      Teacher: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      Lecturer: "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      Admin: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      Support: "bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      Management: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    };
    return colors[role] || colors.Teacher;
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Active: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      "On Leave": "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      Suspended: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      Terminated: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    };
    return colors[status] || colors.Active;
  };

  const columns: ColumnConfig<Teacher>[] = [
    {
      key: "staffId",
      label: "STAFF ID",
      sortable: true,
      render: (teacher) => (
        <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-semibold">
          {teacher.staffId}
        </span>
      ),
    },
    {
      key: "name",
      label: "NAME",
      sortable: true,
      render: (teacher) => (
        <NameLabel
          name={`${teacher.firstName} ${teacher.lastName}`}
          subtitle={teacher.email}
          avatar={teacher.imageUrl}
        />
      ),
    },
    {
      key: "department",
      label: "DEPARTMENT",
      sortable: true,
      render: (teacher) => (
        <span className="text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
          {teacher.department}
        </span>
      ),
    },
    {
      key: "role",
      label: "ROLE",
      sortable: true,
      render: (teacher) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getRoleBadgeColor(teacher.role)}`}>
          {teacher.role}
        </span>
      ),
    },
    {
      key: "employmentStatus",
      label: "STATUS",
      sortable: true,
      render: (teacher) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadgeColor(teacher.employmentStatus)}`}>
          {teacher.employmentStatus}
        </span>
      ),
    },
    {
      key: "joinDate",
      label: "DATE OF JOIN",
      sortable: true,
      render: (teacher) => (
        <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
          {new Date(teacher.joinDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "ACTION",
      render: (teacher) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Message teacher");
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-colors"
            title="Message"
          >
            <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Call teacher");
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-colors"
            title="Call"
          >
            <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/teachers/${teacher.id}`);
            }}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={teachers}
      columns={columns}
      getRowKey={(teacher) => teacher.id}
      onRowClick={(teacher) => router.push(`/teachers/${teacher.id}`)}
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      emptyMessage={
        hasActiveFilters
          ? "No teachers match your filters"
          : "No teachers found"
      }
      emptyAction={
        hasActiveFilters && onClearFilters
          ? {
              label: "Clear Filters",
              onClick: onClearFilters,
            }
          : undefined
      }
      selectedIds={selectedIds}
      onSelectionChange={updateSelectedIds}
      showCheckboxes
    />
  );
}
