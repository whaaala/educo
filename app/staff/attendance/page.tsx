"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import {
  Calendar,
  Users,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Coffee,
  Home,
  FileText,
  Save,
  Upload,
} from "lucide-react";
import {
  StaffAttendanceRecord,
  StaffAttendanceStatus,
  StaffAttendanceStats,
} from "@/types/staffAttendance";

// Mock data for staff
const mockStaffAttendance: StaffAttendanceRecord[] = [
  {
    id: "ATT001",
    staffId: "STF001",
    staffName: "John Smith",
    staffEmail: "john.smith@school.com",
    department: "Mathematics",
    designation: "Senior Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    date: "2024-11-21",
    status: "present",
    checkInTime: "08:00 AM",
    checkOutTime: "04:30 PM",
    workingHours: 8.5,
    markedBy: "ADMIN001",
    markedByName: "Admin User",
    markedAt: "2024-11-21T08:00:00Z",
  },
  {
    id: "ATT002",
    staffId: "STF002",
    staffName: "Sarah Johnson",
    staffEmail: "sarah.j@school.com",
    department: "English",
    designation: "Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    date: "2024-11-21",
    status: "late",
    checkInTime: "09:15 AM",
    checkOutTime: "04:30 PM",
    lateBy: 75,
    workingHours: 7.25,
    remarks: "Traffic jam",
    markedBy: "ADMIN001",
    markedByName: "Admin User",
    markedAt: "2024-11-21T09:15:00Z",
  },
  {
    id: "ATT003",
    staffId: "STF003",
    staffName: "Michael Brown",
    staffEmail: "m.brown@school.com",
    department: "Science",
    designation: "Lab Assistant",
    profilePhoto: "https://i.pravatar.cc/150?img=33",
    date: "2024-11-21",
    status: "absent",
    markedBy: "ADMIN001",
    markedByName: "Admin User",
    markedAt: "2024-11-21T10:00:00Z",
  },
  {
    id: "ATT004",
    staffId: "STF004",
    staffName: "Emily Davis",
    staffEmail: "emily.d@school.com",
    department: "Administration",
    designation: "Office Manager",
    profilePhoto: "https://i.pravatar.cc/150?img=25",
    date: "2024-11-21",
    status: "half-day",
    checkInTime: "08:00 AM",
    checkOutTime: "12:00 PM",
    workingHours: 4,
    remarks: "Medical appointment",
    markedBy: "ADMIN001",
    markedByName: "Admin User",
    markedAt: "2024-11-21T08:00:00Z",
  },
  {
    id: "ATT005",
    staffId: "STF005",
    staffName: "David Wilson",
    staffEmail: "d.wilson@school.com",
    department: "IT",
    designation: "IT Support",
    profilePhoto: "https://i.pravatar.cc/150?img=14",
    date: "2024-11-21",
    status: "work-from-home",
    checkInTime: "09:00 AM",
    workingHours: 8,
    remarks: "Remote server maintenance",
    markedBy: "ADMIN001",
    markedByName: "Admin User",
    markedAt: "2024-11-21T09:00:00Z",
  },
];

export default function StaffAttendancePage() {
  const isLoading = usePageLoad(600);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState<StaffAttendanceRecord[]>(
    mockStaffAttendance
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bulkStatus, setBulkStatus] = useState<StaffAttendanceStatus>("present");
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());

  // Calculate stats
  const stats: StaffAttendanceStats = useMemo(() => {
    const todayRecords = attendanceRecords.filter((r) => r.date === selectedDate);
    return {
      totalStaff: todayRecords.length,
      present: todayRecords.filter((r) => r.status === "present").length,
      absent: todayRecords.filter((r) => r.status === "absent").length,
      late: todayRecords.filter((r) => r.status === "late").length,
      halfDay: todayRecords.filter((r) => r.status === "half-day").length,
      onLeave: todayRecords.filter((r) => r.status === "on-leave").length,
      workFromHome: todayRecords.filter((r) => r.status === "work-from-home").length,
      notMarked: 0,
    };
  }, [attendanceRecords, selectedDate]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const matchesDate = record.date === selectedDate;
      const matchesDepartment =
        selectedDepartment === "all" || record.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "all" || record.status === selectedStatus;
      const matchesSearch =
        searchQuery === "" ||
        record.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.staffEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.staffId.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDate && matchesDepartment && matchesStatus && matchesSearch;
    });
  }, [attendanceRecords, selectedDate, selectedDepartment, selectedStatus, searchQuery]);

  const handleBulkMark = () => {
    if (selectedStaff.size === 0) {
      alert("Please select staff members to mark attendance");
      return;
    }

    const updatedRecords = attendanceRecords.map((record) => {
      if (selectedStaff.has(record.staffId) && record.date === selectedDate) {
        return {
          ...record,
          status: bulkStatus,
          checkInTime: bulkStatus === "present" || bulkStatus === "late" ? "08:00 AM" : undefined,
          markedAt: new Date().toISOString(),
        };
      }
      return record;
    });

    setAttendanceRecords(updatedRecords);
    setSelectedStaff(new Set());
    alert(`Marked ${selectedStaff.size} staff as ${bulkStatus}`);
  };

  const handleSelectAll = () => {
    if (selectedStaff.size === filteredRecords.length) {
      setSelectedStaff(new Set());
    } else {
      setSelectedStaff(new Set(filteredRecords.map((r) => r.staffId)));
    }
  };

  const handleToggleStaff = (staffId: string) => {
    const newSelected = new Set(selectedStaff);
    if (newSelected.has(staffId)) {
      newSelected.delete(staffId);
    } else {
      newSelected.add(staffId);
    }
    setSelectedStaff(newSelected);
  };

  const handleExport = () => {
    console.log("Exporting attendance data...");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoader isLoading={true} loadingText="Loading Attendance" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <PageHeader
            title="Staff Attendance"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Staff", href: "/staff" },
              { label: "Attendance" },
            ]}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard
            label="Total Staff"
            value={stats.totalStaff}
            icon={Users}
            color="blue"
          />
          <StatCard
            label="Present"
            value={stats.present}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            label="Absent"
            value={stats.absent}
            icon={XCircle}
            color="red"
          />
          <StatCard
            label="Late"
            value={stats.late}
            icon={Clock}
            color="orange"
          />
          <StatCard
            label="Half Day"
            value={stats.halfDay}
            icon={Coffee}
            color="yellow"
          />
          <StatCard
            label="On Leave"
            value={stats.onLeave}
            icon={FileText}
            color="purple"
          />
          <StatCard
            label="WFH"
            value={stats.workFromHome}
            icon={Home}
            color="cyan"
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 space-y-4">
          {/* Date and Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
              >
                <option value="all">All Departments</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="Administration">Administration</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Status Filter
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
                <option value="on-leave">On Leave</option>
                <option value="work-from-home">Work From Home</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Bulk Mark As
              </label>
              <div className="flex gap-2">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as StaffAttendanceStatus)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                  <option value="on-leave">On Leave</option>
                  <option value="work-from-home">Work From Home</option>
                </select>
                <button
                  onClick={handleBulkMark}
                  disabled={selectedStaff.size === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Mark {selectedStaff.size > 0 ? `(${selectedStaff.size})` : ""}
                </button>
              </div>
            </div>

            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-colors"
            >
              {selectedStaff.size === filteredRecords.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStaff.size === filteredRecords.length && filteredRecords.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Staff
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Working Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/20 purple:divide-pink-500/20">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-gray-800/50 purple:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStaff.has(record.staffId)}
                        onChange={() => handleToggleStaff(record.staffId)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {record.profilePhoto && (
                          <img
                            src={record.profilePhoto}
                            alt={record.staffName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                            {record.staffName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                            {record.designation}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {record.department}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {record.checkInTime || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {record.checkOutTime || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {record.workingHours ? `${record.workingHours}h` : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {record.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                No attendance records found for the selected date
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// Statistics Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
    green: "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
    red: "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
    orange: "from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
    yellow: "from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700",
    purple: "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
    cyan: "from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700",
  };

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            {value}
          </p>
        </div>
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: StaffAttendanceStatus }) {
  const statusConfig = {
    present: { label: "Present", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    absent: { label: "Absent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    late: { label: "Late", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    "half-day": { label: "Half Day", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    "on-leave": { label: "On Leave", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    "work-from-home": { label: "WFH", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
    holiday: { label: "Holiday", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}
