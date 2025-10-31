"use client";

import { Student } from "./StudentCard";
import { MoreVertical, MessageCircle, Phone, Mail } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";

interface StudentTableProps {
  students: Student[];
  isLoading?: boolean;
  loadingMessage?: string;
}

export default function StudentTable({ students, isLoading = false, loadingMessage = "Loading..." }: StudentTableProps) {
  // Define column configuration with left alignment
  const columns: ColumnConfig<Student>[] = [
    {
      key: "index",
      label: "ID",
      sortable: false,
      hidden: { desktop: true },
      className: "text-left w-10",
      render: (_, index) => (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
          {index + 1}
        </span>
      ),
      searchable: false,
    },
    {
      key: "id",
      label: "Admission No",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left pl-6 w-[10%]",
      render: (student) => (
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 truncate block">
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
        <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
          {student.rollNo}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      className: "text-left w-[20%]",
      render: (student) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 transition-all duration-300 shadow-md">
            {student.name.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-gray-900 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">
            {student.name}
          </span>
        </div>
      ),
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      className: "text-left w-[8%]",
      sortValue: (student) => student.class.split(", ")[0],
      render: (student) => {
        const [classNum] = student.class.split(", ");
        return (
          <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
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
      className: "text-left w-[8%]",
      sortValue: (student) => student.class.split(", ")[1],
      render: (student) => {
        const [, section] = student.class.split(", ");
        return (
          <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
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
        <span className="text-xs font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
          {student.gender}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left w-[10%]",
      render: (student) => (
        <div className="flex items-center justify-start">
          <span
            className={`inline-flex items-center justify-center px-2 xl:px-3 py-1 xl:py-1.5 rounded-full text-[10px] xl:text-xs font-semibold shadow-sm transition-all duration-300 whitespace-nowrap ${
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
      className: "text-left w-[12%]",
      render: (student) => (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 whitespace-nowrap">
          {student.joinedOn}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      className: "text-left w-[13%]",
      render: (student) => (
        <div className="flex items-center justify-start gap-0.5 xl:gap-1">
          <button
            className="p-1 xl:p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95"
            title="Message"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Message", student.id);
            }}
          >
            <MessageCircle className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>
          <button
            className="p-1 xl:p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95"
            title="Call"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Call", student.id);
            }}
          >
            <Phone className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
          </button>
          <button
            className="p-1 xl:p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95"
            title="Email"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Email", student.id);
            }}
          >
            <Mail className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
          </button>
          <button
            className="p-1 xl:p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95"
            title="More"
            onClick={(e) => {
              e.stopPropagation();
              console.log("More", student.id);
            }}
          >
            <MoreVertical className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
          </button>
        </div>
      ),
      searchable: false,
    },
  ];

  return (
    <DataTable
      data={students}
      columns={columns}
      title="Student Records"
      searchPlaceholder="Search students..."
      getRowKey={(student) => student.id}
      emptyMessage="No students found"
      isLoading={isLoading}
      loadingMessage={loadingMessage}
    />
  );
}
