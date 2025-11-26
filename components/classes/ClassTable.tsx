"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Eye, Edit, Trash2, Users, BookOpen, MapPin, TrendingUp, UserPlus } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Tooltip from "@/components/shared/Tooltip";
import NameLabel from "@/components/shared/NameLabel";
import { useSidebar } from "@/contexts/SidebarContext";
import { getEducationLevelColor } from "@/utils/educationLevel";

interface Teacher {
  id: string;
  name: string;
  image: string;
  subject?: string;
}

interface Subject {
  name: string;
  teacher: Teacher;
}

export interface ClassData {
  id: string;
  name: string;
  level: "Primary" | "Secondary" | "Junior Secondary" | "Tertiary";
  section?: string;
  subjects?: Subject[];
  teachers?: Teacher[];
  students: number;
  capacity: number;
  room: string;
  schedule?: string;
  academicYear: string;
  term?: string;
  status: "Active" | "Inactive" | "Archived";
  averageGrade?: number;
  attendanceRate?: number;
  stream?: string;
  // Tertiary-specific fields
  faculty?: string;
  department?: string;
  programme?: string;
  courseLevel?: string;
  semester?: string;
  // New fields from master list
  branch?: string;
  classTeacher?: Teacher;
  maxStudents?: number;
  enabledFeatures?: {
    lms?: boolean;
    digitalDiary?: boolean;
    transport?: boolean;
    hostel?: boolean;
    rfid?: boolean;
    onlineClasses?: boolean;
    library?: boolean;
    gradebook?: boolean;
  };
  transportZone?: string;
  hostelEligibility?: boolean;
}

interface ClassTableProps {
  classes: ClassData[];
  isLoading?: boolean;
  loadingMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  totalClassesCount?: number;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export default function ClassTable({
  classes,
  isLoading = false,
  loadingMessage = "Loading...",
  onClearFilters,
  hasActiveFilters = false,
  totalClassesCount,
  selectedIds: externalSelectedIds,
  onSelectionChange
}: ClassTableProps) {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuClassId, setOpenMenuClassId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassData | null>(null);
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use external state if provided, otherwise use internal state
  const selectedIds = externalSelectedIds ?? internalSelectedIds;
  const updateSelectedIds = (newIds: Set<string>) => {
    if (onSelectionChange) {
      onSelectionChange(newIds);
    } else {
      setInternalSelectedIds(newIds);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      updateSelectedIds(new Set(classes.map(c => c.id)));
    } else {
      updateSelectedIds(new Set());
    }
  };

  const handleSelectRow = (classId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) {
      newSelectedIds.add(classId);
    } else {
      newSelectedIds.delete(classId);
    }
    updateSelectedIds(newSelectedIds);
  };

  const handleMenuToggle = (classId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (openMenuClassId === classId) {
      setOpenMenuClassId(null);
      return;
    }

    // Calculate if menu would go off-screen
    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const menuHeight = 240; // Approximate height of the menu
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // Position menu above if not enough space below
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      setMenuPosition('top');
    } else {
      setMenuPosition('bottom');
    }

    setOpenMenuClassId(classId);
  };

  const handleMenuItemClick = (action: string, classData: ClassData) => {
    if (action === 'Delete') {
      setClassToDelete(classData);
      setIsDeleteModalOpen(true);
      setOpenMenuClassId(null);
    } else if (action === 'Edit') {
      router.push(`/classes/${classData.id}/edit`);
      setOpenMenuClassId(null);
    } else if (action === 'View Class') {
      router.push(`/classes/${classData.id}`);
      setOpenMenuClassId(null);
    } else if (action === 'Manage Subjects') {
      router.push(`/classes/${classData.id}/subjects`);
      setOpenMenuClassId(null);
    } else if (action === 'Add Students') {
      router.push(`/classes/${classData.id}/students/add`);
      setOpenMenuClassId(null);
    } else {
      console.log(`${action} clicked for class:`, classData.id);
      setOpenMenuClassId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (classToDelete) {
      console.log('Deleting class:', classToDelete.id);
      // Add your delete logic here
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setClassToDelete(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuClassId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAllSelected = classes.length > 0 && selectedIds.size === classes.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < classes.length;

  // Define column configuration
  const allColumns: ColumnConfig<ClassData>[] = [
    {
      key: "index",
      label: "",
      sortable: false,
      className: "text-center w-[5%] md:w-[3%]",
      render: (classData) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selectedIds.has(classData.id)}
            onChange={(e) => handleSelectRow(classData.id, e)}
            className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 cursor-pointer transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 midnight:hover:border-cyan-400 purple:hover:border-pink-400"
          />
        </div>
      ),
      searchable: false,
      renderHeader: () => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isSomeSelected;
                }
              }}
              onChange={handleSelectAll}
              className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 cursor-pointer transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 midnight:hover:border-cyan-400 purple:hover:border-pink-400"
            />
          </div>
        </div>
      ),
    },
    {
      key: "id",
      label: "Class Code",
      sortable: true,
      className: "text-left w-[15%] md:w-[12%]",
      render: (classData) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/classes/${classData.id}`);
          }}
          className="text-sm font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 block cursor-pointer whitespace-nowrap hover:underline transition-all duration-200"
        >
          {classData.id}
        </span>
      ),
    },
    {
      key: "name",
      label: "Class Name",
      sortable: true,
      className: "text-left w-[20%] md:w-[15%]",
      render: (classData) => (
        <Tooltip content={classData.name}>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 truncate block">
            {classData.name}
          </span>
        </Tooltip>
      ),
    },
    {
      key: "branch",
      label: "Branch",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[12%]",
      render: (classData) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
          {classData.branch || "—"}
        </span>
      ),
    },
    {
      key: "classTeacher",
      label: "Class Teacher",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[15%]",
      render: (classData) => {
        const isTertiary = classData.level === "Tertiary";
        const teacherCount = classData.teachers?.length || 0;

        if (isTertiary) {
          return (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
              {teacherCount} Lecturer{teacherCount !== 1 ? "s" : ""}
            </span>
          );
        }

        if (classData.classTeacher) {
          return (
            <Tooltip content={classData.classTeacher.name}>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 truncate block">
                {classData.classTeacher.name}
              </span>
            </Tooltip>
          );
        }

        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">Not assigned</span>
        );
      },
    },
    {
      key: "level",
      label: "Level",
      sortable: true,
      hidden: { mobile: true },
      className: "text-left w-[12%] md:w-[10%]",
      render: (classData) => {
        const colors = getEducationLevelColor(classData.level);
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
            {classData.level}
          </span>
        );
      },
    },
    {
      key: "students",
      label: "Students",
      sortable: true,
      className: "text-left w-[12%] md:w-[10%]",
      render: (classData) => {
        const isTertiary = classData.level === "Tertiary";
        return (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
              {isTertiary ? classData.students : `${classData.students}/${classData.capacity}`}
            </span>
          </div>
        );
      },
    },
    {
      key: "subjects",
      label: "Subjects",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (classData) => {
        const isTertiary = classData.level === "Tertiary";
        const subjectCount = classData.subjects?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
              {subjectCount} {isTertiary ? "Course" : "Subject"}{subjectCount !== 1 ? "s" : ""}
            </span>
          </div>
        );
      },
    },
    {
      key: "room",
      label: "Room",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (classData) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
            {classData.room}
          </span>
        </div>
      ),
    },
    {
      key: "averageGrade",
      label: "Avg Grade",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (classData) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
            {classData.averageGrade}%
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left w-[15%] md:w-[10%]",
      render: (classData) => (
        <div className="flex items-center justify-start">
          <span
            className={`inline-flex items-center justify-center px-2 md:px-3 xl:px-3.5 py-1 md:py-1.5 xl:py-2 rounded-full text-[10px] md:text-xs xl:text-sm font-semibold shadow-sm transition-all duration-300 whitespace-nowrap ${
              classData.status === "Active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:bg-green-500/20 midnight:text-green-300 purple:bg-green-500/20 purple:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 midnight:bg-red-500/20 midnight:text-red-300 purple:bg-red-500/20 purple:text-red-300"
            }`}
          >
            {classData.status}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      className: "text-left w-[20%] md:w-[15%] !overflow-visible",
      render: (classData) => (
        <div className="flex items-center justify-start gap-0.5 md:gap-1 lg:gap-1.5 xl:gap-2 pr-0.5 md:pr-2">
          <div className="relative group/view flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/classes/${classData.id}`);
              }}
            >
              <Eye className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/view:text-blue-600 dark:group-hover/view:text-blue-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/view:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="View" variant="compact" />
            </div>
          </div>
          <div className="relative group/subjects flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/classes/${classData.id}/subjects`);
              }}
            >
              <BookOpen className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/subjects:text-purple-600 dark:group-hover/subjects:text-purple-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/subjects:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="Subjects" variant="compact" />
            </div>
          </div>
          <div className="relative group/students flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/classes/${classData.id}/students/add`);
              }}
            >
              <UserPlus className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/students:text-green-600 dark:group-hover/students:text-green-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/students:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="Add Students" variant="compact" />
            </div>
          </div>
          <div className="relative flex-shrink-0 overflow-visible group/more" ref={openMenuClassId === classData.id ? menuRef : null}>
            <button
              ref={openMenuClassId === classData.id ? buttonRef : null}
              className={`p-0.5 md:p-1 xl:p-1.5 rounded-md transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer ${
                openMenuClassId === classData.id
                  ? 'bg-gray-200 dark:bg-gray-600 midnight:bg-cyan-500/30 purple:bg-pink-500/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20'
              }`}
              title="More"
              onClick={(e) => handleMenuToggle(classData.id, e)}
            >
              <MoreVertical className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/more:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="More" variant="compact" />
            </div>

            {openMenuClassId === classData.id && (
              <div
                ref={menuRef}
                className={`absolute right-0 w-52 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[999999] py-1 animate-in fade-in duration-200 ${
                  menuPosition === 'top'
                    ? 'bottom-full mb-1 slide-in-from-bottom-2'
                    : 'top-full mt-1 slide-in-from-top-2'
                }`}
              >
                <button
                  onClick={() => handleMenuItemClick('View Class', classData)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Class</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Edit', classData)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Manage Subjects', classData)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Manage Subjects</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Add Students', classData)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Students</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Delete', classData)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-500/10 purple:hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ),
      searchable: false,
    },
  ];

  return (
    <>
      <DataTable
        data={classes}
        columns={allColumns}
        title="Class Records"
        searchPlaceholder="Search classes..."
        getRowKey={(classData) => classData.id}
        emptyMessage="No classes found"
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalDataCount={totalClassesCount}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[10, 20, 50, 100]}
      />

      {/* Delete Confirmation Modal */}
      {classToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Class"
          itemName={classToDelete.name}
          itemId={classToDelete.id}
          warningMessage="This will permanently remove this class and all associated data. This action cannot be undone."
          confirmButtonText="Delete Class"
        />
      )}
    </>
  );
}
