"use client";

import { Student } from "./StudentCard";
import { MoreVertical, MessageCircle, Phone, Mail } from "lucide-react";

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
      {/* Top Controls - Rows Per Page and Search */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
            Row Per Page
          </span>
          <select className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
            Entries
          </span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          {/* Table Header */}
          <thead className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Admission No
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Roll No
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Class
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Section
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Date of Join
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                DOB
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
            {students.map((student) => {
              // Extract class and section from "III, A" format
              const [classNum, section] = student.class.split(", ");

              return (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  {/* Admission No */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                      {student.id}
                    </span>
                  </td>

                  {/* Roll No */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.rollNo}
                    </span>
                  </td>

                  {/* Name with Avatar */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  {/* Class */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {classNum}
                    </span>
                  </td>

                  {/* Section */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {section}
                    </span>
                  </td>

                  {/* Gender */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.gender}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        student.status === "Active"
                          ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                          : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        student.status === "Active" ? "bg-green-600" : "bg-red-600"
                      }`} />
                      {student.status}
                    </span>
                  </td>

                  {/* Date of Join */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.joinedOn}
                    </span>
                  </td>

                  {/* DOB */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                      {student.joinedOn}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors group"
                        title="Message"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </button>
                      <button
                        className="p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors group"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </button>
                      <button
                        className="p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors group"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </button>
                      <button
                        className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-500/10 purple:bg-pink-500/10 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors whitespace-nowrap"
                      >
                        Collect Fees
                      </button>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
                        title="More actions"
                      >
                        <MoreVertical className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination Controls */}
      <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg transition-colors">
            Prev
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white rounded-lg shadow-md">
            1
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
