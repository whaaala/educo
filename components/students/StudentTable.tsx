"use client";

import { useState, useEffect, useRef } from "react";
import { Student } from "./StudentCard";
import { MoreVertical, MessageCircle, Phone, Mail, DollarSign, Eye, Edit, Lock, TrendingUp, Trash2, AlertTriangle } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import CollectFeesModal from "@/components/shared/CollectFeesModal";

interface StudentTableProps {
  students: Student[];
  isLoading?: boolean;
  loadingMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  totalStudentsCount?: number;
}

export default function StudentTable({ students, isLoading = false, loadingMessage = "Loading...", onClearFilters, hasActiveFilters = false, totalStudentsCount }: StudentTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuStudentId, setOpenMenuStudentId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAddFeesClick = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(students.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
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
    setSelectedIds(newSelectedIds);
  };

  const handleMenuToggle = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuStudentId(openMenuStudentId === studentId ? null : studentId);
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
  const columns: ColumnConfig<Student>[] = [
    {
      key: "index",
      label: "ID",
      sortable: false,
      hidden: { desktop: true },
      className: "text-left w-12",
      render: (student) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selectedIds.has(student.id)}
            onChange={(e) => handleSelectRow(student.id, e)}
            className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 cursor-pointer transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 midnight:hover:border-cyan-400 purple:hover:border-pink-400"
          />
        </div>
      ),
      searchable: false,
      renderHeader: () => (
        <div className="flex items-center justify-start" onClick={(e) => e.stopPropagation()}>
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
              className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 cursor-pointer transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 midnight:hover:border-cyan-400 purple:hover:border-pink-400"
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
      className: "text-left pl-6 w-[11%]",
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
      className: "text-left w-[7%]",
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
      className: "text-left w-[16%]",
      render: (student) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 transition-all duration-300 shadow-md cursor-pointer hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Avatar clicked", student.id);
            }}
          >
            {student.name.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 truncate">
            {student.name}
          </span>
        </div>
      ),
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      className: "text-left w-[6%]",
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
      className: "text-left w-[7%]",
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
      className: "text-left w-[7%]",
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
      className: "text-left w-[9%]",
      render: (student) => (
        <div className="flex items-center justify-start">
          <span
            className={`inline-flex items-center justify-center px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold shadow-sm transition-all duration-300 whitespace-nowrap ${
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
      className: "text-left w-[20%]",
      render: (student) => (
        <div className="flex items-center justify-start gap-1 xl:gap-1.5">
          <button
            className="p-0.5 xl:p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer"
            title="Message"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Message", student.id);
            }}
          >
            <MessageCircle className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>
          <button
            className="p-0.5 xl:p-1 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer"
            title="Call"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Call", student.id);
            }}
          >
            <Phone className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
          </button>
          <button
            className="p-0.5 xl:p-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer"
            title="Email"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Email", student.id);
            }}
          >
            <Mail className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
          </button>
          <div className="w-1"></div>
          <button
            className="px-1.5 py-1 xl:px-2 xl:py-1.5 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 midnight:from-cyan-600 midnight:to-purple-600 midnight:hover:from-cyan-700 midnight:hover:to-purple-700 purple:from-pink-600 purple:to-purple-600 purple:hover:from-pink-700 purple:hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-0.5 xl:gap-1"
            title="Add Fees"
            onClick={(e) => handleAddFeesClick(student, e)}
          >
            <DollarSign className="w-2.5 h-2.5 xl:w-3 xl:h-3 text-white flex-shrink-0" />
            <span className="text-[10px] xl:text-xs font-bold text-white whitespace-nowrap">Add Fees</span>
          </button>
          <div className="relative" ref={openMenuStudentId === student.id ? menuRef : null}>
            <button
              className={`p-0.5 xl:p-1 rounded-md transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer ${
                openMenuStudentId === student.id
                  ? 'bg-gray-200 dark:bg-gray-600 midnight:bg-cyan-500/30 purple:bg-pink-500/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20'
              }`}
              title="More"
              onClick={(e) => handleMenuToggle(student.id, e)}
            >
              <MoreVertical className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
            </button>

            {openMenuStudentId === student.id && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[9999] py-1 animate-in fade-in slide-in-from-top-2 duration-200">
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

      {/* Delete Confirmation Modal - Modern Design */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-4 overflow-y-auto animate-in fade-in duration-200"
          style={{ zIndex: 999999 }}
          onClick={handleCancelDelete}
        >
          <div
            className="relative bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', zIndex: 1000000 }}
          >
            {/* Gradient Header Background */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-red-500 via-red-600 to-orange-600 dark:from-red-600 dark:via-red-700 dark:to-orange-700 midnight:from-red-500 midnight:via-red-600 midnight:to-rose-600 purple:from-red-500 purple:via-pink-600 purple:to-rose-600 opacity-10 rounded-t-3xl"></div>

            {/* Content */}
            <div className="relative pt-4 pb-3 px-5">
              {/* Icon with animated rings */}
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 dark:bg-red-400 rounded-full opacity-20 animate-ping"></div>
                  <div className="relative w-9 h-9 bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-500 dark:to-red-600 midnight:from-red-500 midnight:to-rose-600 purple:from-red-500 purple:to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 dark:shadow-red-500/30">
                    <AlertTriangle className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-sm font-bold text-center text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-3">
                Delete Student
              </h2>
            </div>

            {/* Content */}
            <div className="relative px-5 pt-3 pb-5">
              {/* Student Info Card */}
              <div className="bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg p-2.5 mb-2.5 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                    {studentToDelete?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                      {studentToDelete?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                      {studentToDelete?.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Message - Red Background */}
              <div className="bg-red-50 dark:bg-red-900/20 midnight:bg-red-500/10 purple:bg-red-500/10 border-l-4 border-red-500 dark:border-red-400 rounded-lg p-2.5 mb-3.5">
                <p className="text-xs leading-relaxed text-red-800 dark:text-red-300 midnight:text-red-300 purple:text-red-300">
                  This will permanently remove this student and all associated data. This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 transition-all duration-200 cursor-pointer shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Delete Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
