"use client";

import { useState, useEffect, useRef } from "react";
import { Student } from "./StudentCard";
import { MoreVertical, MessageCircle, Phone, Mail, Eye, Edit, Lock, TrendingUp, Trash2, Plus } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import CollectFeesModal from "@/components/shared/CollectFeesModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import Tooltip from "@/components/shared/Tooltip";
import AddFeesButton from "@/components/shared/AddFeesButton";
import NameLabel from "@/components/shared/NameLabel";
import { useSidebar } from "@/contexts/SidebarContext";

interface StudentTableProps {
  students: Student[];
  isLoading?: boolean;
  loadingMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  totalStudentsCount?: number;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export default function StudentTable({ students, isLoading = false, loadingMessage = "Loading...", onClearFilters, hasActiveFilters = false, totalStudentsCount, selectedIds: externalSelectedIds, onSelectionChange }: StudentTableProps) {
  const { isCollapsed } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuStudentId, setOpenMenuStudentId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
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

  const handleAddFeesClick = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      updateSelectedIds(new Set(students.map(s => s.id)));
    } else {
      updateSelectedIds(new Set());
    }
  };

  const handleSelectRow = (studentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) {
      newSelectedIds.add(studentId);
    } else {
      newSelectedIds.delete(studentId);
    }
    updateSelectedIds(newSelectedIds);
  };

  const handleMenuToggle = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (openMenuStudentId === studentId) {
      setOpenMenuStudentId(null);
      return;
    }

    // Calculate if menu would go off-screen
    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const menuHeight = 320; // Approximate height of the menu with 6 items
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // Position menu above if not enough space below
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      setMenuPosition('top');
    } else {
      setMenuPosition('bottom');
    }

    setOpenMenuStudentId(studentId);
  };

  const handleMenuItemClick = (action: string, student: Student) => {
    if (action === 'Delete') {
      setStudentToDelete(student);
      setIsDeleteModalOpen(true);
      setOpenMenuStudentId(null);
    } else {
      console.log(`${action} clicked for student:`, student.id);
      setOpenMenuStudentId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      console.log('Deleting student:', studentToDelete.id);
      // Add your delete logic here
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      console.log('Deleting students:', Array.from(selectedIds));
      // Add your bulk delete logic here
      // After deletion, clear the selected IDs
      updateSelectedIds(new Set());
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuStudentId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAllSelected = students.length > 0 && selectedIds.size === students.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < students.length;

  // Define column configuration with left alignment
  const allColumns: ColumnConfig<Student>[] = [
    {
      key: "index",
      label: "",
      sortable: false,
      className: "text-center w-[5%] md:w-[2%]",
      render: (student) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selectedIds.has(student.id)}
            onChange={(e) => handleSelectRow(student.id, e)}
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
      label: "Admission No",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (student) => (
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 block cursor-pointer whitespace-nowrap">
          {student.id}
        </span>
      ),
    },
    {
      key: "rollNo",
      label: "Roll No",
      sortable: true,
      hidden: { mobile: true },
      className: "text-left w-[8%]",
      render: (student) => (
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
          {student.rollNo}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      className: "text-left w-[38%] md:w-[15%]",
      render: (student) => (
        <div className="flex items-center gap-1.5 md:gap-2.5 min-w-0">
          {student.avatar ? (
            <div
              className="relative cursor-pointer group/avatar flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Avatar clicked", student.id);
              }}
            >
              <img
                src={student.avatar}
                alt={student.name}
                className="w-7 h-7 md:w-8 md:h-8 xl:w-9 xl:h-9 rounded-full object-cover shrink-0 ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-lg transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                style={{ position: 'relative', transformOrigin: 'center center' }}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
            </div>
          ) : (
            <div
              className="relative cursor-pointer group/avatar flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Avatar clicked", student.id);
              }}
            >
              <div
                className="w-7 h-7 md:w-8 md:h-8 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs md:text-sm font-bold shrink-0 shadow-lg ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 transition-all duration-500 ease-out group-hover/avatar:scale-150 group-hover/avatar:shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500/90 dark:group-hover/avatar:ring-blue-400/90 midnight:group-hover/avatar:ring-cyan-400/90 purple:group-hover/avatar:ring-pink-400/90 group-hover/avatar:z-[100]"
                style={{ position: 'relative', transformOrigin: 'center center' }}
              >
                {student.name.charAt(0)}
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-0 group-hover/avatar:opacity-40 blur-md transition-all duration-500 ease-out pointer-events-none -z-10" />
            </div>
          )}
          <Tooltip content={student.name}>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 md:truncate-none truncate">
              {/* On mobile: show truncated name with first name + last initial */}
              {/* On desktop: show full name */}
              <span className="md:hidden">
                {(() => {
                  const nameParts = student.name.split(' ');
                  if (nameParts.length > 1) {
                    const firstName = nameParts[0];
                    const lastInitial = nameParts[nameParts.length - 1].charAt(0);
                    return `${firstName} ${lastInitial}`;
                  }
                  return student.name;
                })()}
              </span>
              <span className="hidden md:inline">
                {student.name}
              </span>
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      hidden: { mobile: true },
      className: "text-left w-[15%] md:w-[6%]",
      sortValue: (student) => student.class.split(", ")[0],
      render: (student) => {
        const [classNum] = student.class.split(", ");
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
            {classNum}
          </span>
        );
      },
    },
    {
      key: "section",
      label: "Section",
      sortable: true,
      hidden: { mobile: true },
      className: "text-left w-[6%]",
      sortValue: (student) => student.class.split(", ")[1],
      render: (student) => {
        const [, section] = student.class.split(", ");
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
            {section}
          </span>
        );
      },
      searchable: false,
    },
    {
      key: "gender",
      label: "Gender",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[8%]",
      render: (student) => (
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
          {student.gender}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left w-[18%] md:w-[8%]",
      render: (student) => (
        <div className="flex items-center justify-start">
          <span
            className={`inline-flex items-center justify-center px-2 md:px-3 xl:px-3.5 py-1 md:py-1.5 xl:py-2 rounded-full text-[10px] md:text-xs xl:text-sm font-semibold shadow-sm transition-all duration-300 whitespace-nowrap ${
              student.status === "Active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:bg-green-500/20 midnight:text-green-300 purple:bg-green-500/20 purple:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 midnight:bg-red-500/20 midnight:text-red-300 purple:bg-red-500/20 purple:text-red-300"
            }`}
          >
            {student.status}
          </span>
        </div>
      ),
    },
    {
      key: "joinedOn",
      label: "Date of Join",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[11%]",
      render: (student) => (
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 whitespace-nowrap">
          {student.joinedOn}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      className: "text-left w-[39%] md:w-[25%] lg:w-[20%] !overflow-visible",
      render: (student) => (
        <div className="flex items-center justify-start gap-0.5 md:gap-1 lg:gap-1.5 xl:gap-2 pr-0.5 md:pr-2">
          <div className="relative group/msg flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Message", student.id);
              }}
            >
              <MessageCircle className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/msg:text-blue-600 dark:group-hover/msg:text-blue-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="Message" variant="compact" />
            </div>
          </div>
          <div className="relative group/call flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Call", student.id);
              }}
            >
              <Phone className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/call:text-green-600 dark:group-hover/call:text-green-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/call:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="Call" variant="compact" />
            </div>
          </div>
          <div className="relative group/email flex-shrink-0">
            <button
              className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Email", student.id);
              }}
            >
              <Mail className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/email:text-purple-600 dark:group-hover/email:text-purple-400 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/email:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="Email" variant="compact" />
            </div>
          </div>
          <div className="w-px md:w-0.5 lg:w-1 hidden md:block"></div>
          <div className="relative group/addfees flex-shrink-0">
            <AddFeesButton
              onClick={(e) => handleAddFeesClick(student, e)}
              currency="₦"
              label="Add Fees"
              size="sm"
              className="md:!px-3 md:!py-1.5 md:!text-xs"
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/addfees:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="Add Fees" variant="compact" />
            </div>
          </div>
          <div className="relative flex-shrink-0 overflow-visible group/more" ref={openMenuStudentId === student.id ? menuRef : null}>
            <button
              ref={openMenuStudentId === student.id ? buttonRef : null}
              className={`p-0.5 md:p-1 xl:p-1.5 rounded-md transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer ${
                openMenuStudentId === student.id
                  ? 'bg-gray-200 dark:bg-gray-600 midnight:bg-cyan-500/30 purple:bg-pink-500/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20'
              }`}
              title="More"
              onClick={(e) => handleMenuToggle(student.id, e)}
            >
              <MoreVertical className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/more:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              <NameLabel name="More" variant="compact" />
            </div>

            {openMenuStudentId === student.id && (
              <div
                ref={menuRef}
                className={`absolute right-0 w-52 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[999999] py-1 animate-in fade-in duration-200 ${
                  menuPosition === 'top'
                    ? 'bottom-full mb-1 slide-in-from-bottom-2'
                    : 'top-full mt-1 slide-in-from-top-2'
                }`}
              >
                <button
                  onClick={() => handleMenuItemClick('View Student', student)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Student</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Edit', student)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Login Details', student)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login Details</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Disable', student)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Disable</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Promote Student', student)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Promote Student</span>
                </button>
                <button
                  onClick={() => handleMenuItemClick('Delete', student)}
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

  // Filter columns based on sidebar state - hide Roll No when sidebar is expanded
  const columns = allColumns.filter(column => {
    if (column.key === 'rollNo' && !isCollapsed) {
      return false; // Hide Roll No column when sidebar is expanded
    }
    return true;
  });

  return (
    <>
      <DataTable
        data={students}
        columns={columns}
        title="Student Records"
        searchPlaceholder="Search students..."
        getRowKey={(student) => student.id}
        emptyMessage="No students found"
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalDataCount={totalStudentsCount}
        defaultItemsPerPage={10}
        itemsPerPageOptions={[10, 20, 50, 100]}
      />

      {selectedStudent && (
        <CollectFeesModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudent(null);
          }}
          student={{
            id: selectedStudent.id,
            name: selectedStudent.name,
            class: selectedStudent.class,
            avatar: selectedStudent.avatar,
            totalOutstanding: "2000",
            lastDate: "25 May 2024",
            status: selectedStudent.status === "Active" ? "Unpaid" : "Paid",
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Student"
          itemName={studentToDelete.name}
          itemId={studentToDelete.id}
          warningMessage="This will permanently remove this student and all associated data. This action cannot be undone."
          confirmButtonText="Delete Student"
        />
      )}
    </>
  );
}
