"use client";

import { Student } from "./StudentCard";
import { MoreVertical, MessageCircle, Phone, Mail } from "lucide-react";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  // Define column configuration
  const columns: ColumnConfig<Student>[] = [
    {
      key: "index",
      label: "ID",
      sortable: false,
      hidden: { desktop: true },
      className: "text-center",
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
      render: (student) => (
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
          {student.id}
        </span>
      ),
    },
    {
      key: "rollNo",
      label: "Roll No",
      sortable: true,
      hidden: { mobile: true },
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
      render: (student) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 transition-all duration-300 shadow-md">
            {student.name.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-gray-900 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate max-w-[120px] md:max-w-none">
            {student.name}
          </span>
        </div>
      ),
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
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
      render: (student) => (
        <div className="flex items-center justify-start">
          <span
            className={`inline-block px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold text-center min-w-[60px] md:min-w-[70px] shadow-sm transition-all duration-300 ${
              student.status === "Active"
                ? "bg-green-500 text-white dark:bg-green-600"
                : "bg-red-500 text-white dark:bg-red-600"
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
      render: (student) => (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
          {student.joinedOn}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      className: "text-center w-32",
      render: (student) => (
        <div className="flex items-center justify-center gap-0.5">
          <button
            className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95"
            title="Message"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Message", student.id);
            }}
          >
            <MessageCircle className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95"
            title="Call"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Call", student.id);
            }}
          >
            <Phone className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95"
            title="Email"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Email", student.id);
            }}
          >
            <Mail className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 group hover:scale-105 active:scale-95"
            title="More"
            onClick={(e) => {
              e.stopPropagation();
              console.log("More", student.id);
            }}
          >
            <MoreVertical className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
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
    />
  );
}
