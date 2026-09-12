"use client";

import { useState, useMemo } from "react";
import { DashboardPage } from "@/components/pages";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Save,
  Search,
} from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface Student {
  id: string;
  studentId: string;
  name: string;
  imageUrl?: string;
  status: AttendanceStatus;
  remarks?: string;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    studentId: "STD-001",
    name: "Chidi Okafor",
    imageUrl: "https://i.pravatar.cc/150?img=1",
    status: "present",
  },
  {
    id: "2",
    studentId: "STD-002",
    name: "Amina Bello",
    imageUrl: "https://i.pravatar.cc/150?img=2",
    status: "present",
  },
  {
    id: "3",
    studentId: "STD-003",
    name: "Emeka Nwosu",
    imageUrl: "https://i.pravatar.cc/150?img=3",
    status: "late",
    remarks: "Arrived 15 mins late",
  },
  {
    id: "4",
    studentId: "STD-004",
    name: "Fatima Abubakar",
    imageUrl: "https://i.pravatar.cc/150?img=4",
    status: "absent",
  },
  {
    id: "5",
    studentId: "STD-005",
    name: "Tunde Adeyemi",
    imageUrl: "https://i.pravatar.cc/150?img=5",
    status: "present",
  },
];

const mockClasses = [
  { id: "CLS-001", name: "SS 1A - Mathematics" },
  { id: "CLS-002", name: "SS 2B - Further Mathematics" },
  { id: "CLS-003", name: "SS 3A - Mathematics" },
  { id: "CLS-004", name: "JSS 3B - Mathematics" },
];

export default function MarkAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("CLS-001");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | "all">("all");
  const [isSaving, setIsSaving] = useState(false);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || student.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [students, searchQuery, filterStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: students.length,
      present: students.filter((s) => s.status === "present").length,
      absent: students.filter((s) => s.status === "absent").length,
      late: students.filter((s) => s.status === "late").length,
      excused: students.filter((s) => s.status === "excused").length,
    };
  }, [students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, remarks } : student
      )
    );
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setStudents((prev) => prev.map((student) => ({ ...student, status })));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Attendance saved successfully!");
    }, 1000);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const badges = {
      present:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      absent: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 text-red-700 dark:text-red-300",
      late: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      excused:
        "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300",
    };
    return badges[status];
  };

  return (
    <DashboardPage
      title="Mark Student Attendance"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Teacher Portal", href: "/teachers/portal/dashboard" },
        { label: "Mark Attendance", isActive: true },
      ]}
      loadingText="Loading Attendance"
      afterStats={
        <div className="mt-6">
          {/* Class and Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mockClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-200 ease-out">
          <div className="bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Total</p>
                <p className="text-lg font-bold text-ink">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Present</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                  {stats.present}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Absent</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                  {stats.absent}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Late</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {stats.late}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Excused</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                  {stats.excused}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-250 ease-out">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AttendanceStatus | "all")}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkAll("present")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll("absent")}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 mt-6 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-[900ms] delay-300 ease-out">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border-b border-line">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] overflow-hidden">
                          {student.imageUrl ? (
                            <img
                              src={student.imageUrl}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                              {student.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted">
                            {student.studentId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {(["present", "absent", "late", "excused"] as AttendanceStatus[]).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(student.id, status)}
                              className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors ${
                                student.status === status
                                  ? getStatusBadge(status)
                                  : "bg-surface-2 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15"
                              }`}
                            >
                              {status}
                            </button>
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Add remarks..."
                        value={student.remarks || ""}
                        onChange={(e) =>
                          handleRemarksChange(student.id, e.target.value)
                        }
                        className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-md bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-ink focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-ink mb-2">
              No Students Found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    }
  />
  );
}
