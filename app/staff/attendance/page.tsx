"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Save,
} from "lucide-react";
import {
  StaffAttendanceRecord,
  StaffAttendanceStatus,
} from "@/types/staffAttendance";
import DataManagementPage from "@/components/pages/DataManagementPage";
import {
  attendanceFilterFields,
  attendanceSortOptions,
  attendanceStats,
  filterAttendanceRecords,
  sortAttendanceRecords,
  searchAttendanceRecords,
} from "./config";

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
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState<StaffAttendanceRecord[]>(
    mockStaffAttendance
  );
  const [bulkStatus, setBulkStatus] = useState<StaffAttendanceStatus>("present");
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());

  // Filter records by selected date
  const dateFilteredRecords = useMemo(() => {
    return attendanceRecords.filter((r) => r.date === selectedDate);
  }, [attendanceRecords, selectedDate]);

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
    if (selectedStaff.size === dateFilteredRecords.length) {
      setSelectedStaff(new Set());
    } else {
      setSelectedStaff(new Set(dateFilteredRecords.map((r) => r.staffId)));
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
  return (
    <DataManagementPage<StaffAttendanceRecord>
      title="Staff Attendance"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Staff", href: "/staff" },
        { label: "Attendance" },
      ]}
      data={dateFilteredRecords}
      getRowKey={(item) => item.id}
      columns={[]}
      stats={attendanceStats}
      statsColumns={{ default: 2, sm: 4, md: 4, lg: 7 }}
      filterFields={attendanceFilterFields}
      sortOptions={attendanceSortOptions}
      filterFn={filterAttendanceRecords}
      sortFn={sortAttendanceRecords}
      searchFn={searchAttendanceRecords}
      enableViewToggle={false}
      enableSelection={false}
      enablePagination={false}
      showTableSearch={false}
      itemLabel="attendance record"
      itemLabelPlural="attendance records"
      beforeContent={
        <div className="bg-surface rounded-xl border border-line p-4 space-y-4">
          {/* Date Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] text-ink"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 pt-4 border-t border-line">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Bulk Mark As
              </label>
              <div className="flex gap-2">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as StaffAttendanceStatus)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] text-ink"
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
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
            >
              {selectedStaff.size === dateFilteredRecords.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>
      }
      customListComponent={
        <div className="bg-surface rounded-xl border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border-b border-line">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStaff.size === dateFilteredRecords.length && dateFilteredRecords.length > 0}
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
                {dateFilteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors"
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
                          <div className="text-sm font-medium text-ink">
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
                      <AttendanceStatusBadge status={record.status} />
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

          {dateFilteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                No attendance records found for the selected date
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}

// Status Badge Component
function AttendanceStatusBadge({ status }: { status: StaffAttendanceStatus }) {
  const statusConfig = {
    present: { label: "Present", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    absent: { label: "Absent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    late: { label: "Late", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    "half-day": { label: "Half Day", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    "on-leave": { label: "On Leave", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    "work-from-home": { label: "WFH", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
    holiday: { label: "Holiday", color: "bg-gray-100 text-gray-700 dark:bg-[#0f1115]/30 dark:text-gray-400" },
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
