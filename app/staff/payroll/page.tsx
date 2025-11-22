"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import {
  DollarSign,
  Users,
  TrendingUp,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Plus,
} from "lucide-react";
import {
  PayrollRecord,
  PayrollStatus,
  PayrollSummary,
} from "@/types/payroll";

// Mock data for payroll
const mockPayrollRecords: PayrollRecord[] = [
  {
    id: "PAY001",
    staffId: "STF001",
    staffName: "John Smith",
    staffEmail: "john.smith@school.com",
    department: "Mathematics",
    designation: "Senior Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    basicSalary: 350000,
    allowances: {
      housing: 100000,
      transport: 50000,
      meal: 30000,
      medical: 20000,
    },
    deductions: {
      tax: 45000,
      pension: 28000,
      nhis: 5000,
    },
    grossSalary: 550000,
    totalAllowances: 200000,
    totalDeductions: 78000,
    netSalary: 472000,
    paymentMethod: "bank-transfer",
    bankName: "First Bank",
    accountNumber: "1234567890",
    accountName: "John Smith",
    month: "2024-11",
    payrollCycle: "November 2024",
    paymentDate: "2024-11-30",
    status: "approved",
    approvedBy: "ADMIN001",
    approvedByName: "HR Manager",
    approvedDate: "2024-11-25",
    workingDays: 22,
    daysPresent: 22,
    daysAbsent: 0,
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-25T10:00:00Z",
  },
  {
    id: "PAY002",
    staffId: "STF002",
    staffName: "Sarah Johnson",
    staffEmail: "sarah.j@school.com",
    department: "English",
    designation: "Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    basicSalary: 280000,
    allowances: {
      housing: 80000,
      transport: 40000,
      meal: 25000,
    },
    deductions: {
      tax: 32000,
      pension: 22400,
      nhis: 5000,
      loan: 15000,
    },
    grossSalary: 425000,
    totalAllowances: 145000,
    totalDeductions: 74400,
    netSalary: 350600,
    paymentMethod: "bank-transfer",
    bankName: "GTBank",
    accountNumber: "0987654321",
    accountName: "Sarah Johnson",
    month: "2024-11",
    payrollCycle: "November 2024",
    status: "pending-approval",
    workingDays: 22,
    daysPresent: 21,
    daysAbsent: 1,
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-20T15:00:00Z",
  },
  {
    id: "PAY003",
    staffId: "STF003",
    staffName: "Michael Brown",
    staffEmail: "m.brown@school.com",
    department: "Science",
    designation: "Lab Assistant",
    profilePhoto: "https://i.pravatar.cc/150?img=33",
    basicSalary: 180000,
    allowances: {
      housing: 50000,
      transport: 30000,
    },
    deductions: {
      tax: 18000,
      pension: 14400,
      nhis: 5000,
    },
    grossSalary: 260000,
    totalAllowances: 80000,
    totalDeductions: 37400,
    netSalary: 222600,
    paymentMethod: "bank-transfer",
    bankName: "Access Bank",
    accountNumber: "1122334455",
    accountName: "Michael Brown",
    month: "2024-11",
    payrollCycle: "November 2024",
    status: "paid",
    approvedBy: "ADMIN001",
    approvedByName: "HR Manager",
    approvedDate: "2024-11-25",
    processedBy: "FIN001",
    processedByName: "Finance Officer",
    processedDate: "2024-11-28",
    paidDate: "2024-11-28",
    workingDays: 22,
    daysPresent: 20,
    daysAbsent: 2,
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-28T14:00:00Z",
  },
  {
    id: "PAY004",
    staffId: "STF004",
    staffName: "Emily Davis",
    staffEmail: "emily.d@school.com",
    department: "Administration",
    designation: "Office Manager",
    profilePhoto: "https://i.pravatar.cc/150?img=25",
    basicSalary: 320000,
    allowances: {
      housing: 90000,
      transport: 45000,
      meal: 28000,
    },
    deductions: {
      tax: 38000,
      pension: 25600,
      nhis: 5000,
    },
    grossSalary: 483000,
    totalAllowances: 163000,
    totalDeductions: 68600,
    netSalary: 414400,
    paymentMethod: "bank-transfer",
    bankName: "UBA",
    accountNumber: "5544332211",
    accountName: "Emily Davis",
    month: "2024-11",
    payrollCycle: "November 2024",
    status: "processing",
    approvedBy: "ADMIN001",
    approvedByName: "HR Manager",
    approvedDate: "2024-11-25",
    processedBy: "FIN001",
    processedByName: "Finance Officer",
    processedDate: "2024-11-28",
    workingDays: 22,
    daysPresent: 22,
    daysAbsent: 0,
    overtime: 5,
    overtimePay: 25000,
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-28T10:00:00Z",
  },
  {
    id: "PAY005",
    staffId: "STF005",
    staffName: "David Wilson",
    staffEmail: "d.wilson@school.com",
    department: "IT",
    designation: "IT Support",
    profilePhoto: "https://i.pravatar.cc/150?img=14",
    basicSalary: 250000,
    allowances: {
      housing: 70000,
      transport: 35000,
      meal: 20000,
    },
    deductions: {
      tax: 28000,
      pension: 20000,
      nhis: 5000,
    },
    grossSalary: 375000,
    totalAllowances: 125000,
    totalDeductions: 53000,
    netSalary: 322000,
    paymentMethod: "bank-transfer",
    bankName: "Zenith Bank",
    accountNumber: "6677889900",
    accountName: "David Wilson",
    month: "2024-11",
    payrollCycle: "November 2024",
    status: "draft",
    workingDays: 22,
    daysPresent: 22,
    daysAbsent: 0,
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-15T09:00:00Z",
  },
];

export default function PayrollManagementPage() {
  const isLoading = usePageLoad(600);
  const [selectedMonth, setSelectedMonth] = useState<string>("2024-11");
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>("");

  // Calculate summary
  const summary: PayrollSummary = useMemo(() => {
    const monthRecords = payrollRecords.filter((r) => r.month === selectedMonth);

    return {
      totalStaff: monthRecords.length,
      totalGross: monthRecords.reduce((sum, r) => sum + r.grossSalary, 0),
      totalAllowances: monthRecords.reduce((sum, r) => sum + r.totalAllowances, 0),
      totalDeductions: monthRecords.reduce((sum, r) => sum + r.totalDeductions, 0),
      totalNet: monthRecords.reduce((sum, r) => sum + r.netSalary, 0),
      byStatus: {
        draft: monthRecords.filter((r) => r.status === "draft").length,
        pendingApproval: monthRecords.filter((r) => r.status === "pending-approval").length,
        approved: monthRecords.filter((r) => r.status === "approved").length,
        processing: monthRecords.filter((r) => r.status === "processing").length,
        paid: monthRecords.filter((r) => r.status === "paid").length,
        failed: monthRecords.filter((r) => r.status === "failed").length,
      },
      byDepartment: {},
    };
  }, [payrollRecords, selectedMonth]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      const matchesMonth = record.month === selectedMonth;
      const matchesDepartment =
        selectedDepartment === "all" || record.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "all" || record.status === selectedStatus;
      const matchesSearch =
        searchQuery === "" ||
        record.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.staffEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.staffId.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesMonth && matchesDepartment && matchesStatus && matchesSearch;
    });
  }, [payrollRecords, selectedMonth, selectedDepartment, selectedStatus, searchQuery]);

  const handleBulkAction = () => {
    if (selectedStaff.size === 0 || !bulkAction) {
      alert("Please select staff members and an action");
      return;
    }

    const statusMap: { [key: string]: PayrollStatus } = {
      approve: "approved",
      process: "processing",
      "mark-paid": "paid",
    };

    const newStatus = statusMap[bulkAction];
    if (!newStatus) return;

    const updatedRecords = payrollRecords.map((record) => {
      if (selectedStaff.has(record.staffId) && record.month === selectedMonth) {
        return {
          ...record,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          ...(newStatus === "approved" && {
            approvedBy: "ADMIN001",
            approvedByName: "HR Manager",
            approvedDate: new Date().toISOString().split("T")[0],
          }),
          ...(newStatus === "processing" && {
            processedBy: "FIN001",
            processedByName: "Finance Officer",
            processedDate: new Date().toISOString().split("T")[0],
          }),
          ...(newStatus === "paid" && {
            paidDate: new Date().toISOString().split("T")[0],
          }),
        };
      }
      return record;
    });

    setPayrollRecords(updatedRecords);
    setSelectedStaff(new Set());
    setBulkAction("");
    alert(`Successfully updated ${selectedStaff.size} payroll records`);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = () => {
    console.log("Exporting payroll data...");
  };

  const handleGeneratePayslips = () => {
    console.log("Generating payslips...");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoader isLoading={true} loadingText="Loading Payroll" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <PageHeader
            title="Payroll Management"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Staff", href: "/staff" },
              { label: "Payroll" },
            ]}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleGeneratePayslips}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <FileText className="w-4 h-4" />
              Generate Payslips
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard
            label="Total Staff"
            value={summary.totalStaff.toString()}
            icon={Users}
            color="blue"
          />
          <SummaryCard
            label="Total Gross"
            value={formatCurrency(summary.totalGross)}
            icon={DollarSign}
            color="green"
          />
          <SummaryCard
            label="Total Allowances"
            value={formatCurrency(summary.totalAllowances)}
            icon={TrendingUp}
            color="cyan"
          />
          <SummaryCard
            label="Total Deductions"
            value={formatCurrency(summary.totalDeductions)}
            icon={AlertCircle}
            color="orange"
          />
          <SummaryCard
            label="Total Net Salary"
            value={formatCurrency(summary.totalNet)}
            icon={CreditCard}
            color="purple"
          />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatusCard
            label="Draft"
            value={summary.byStatus.draft}
            color="gray"
          />
          <StatusCard
            label="Pending Approval"
            value={summary.byStatus.pendingApproval}
            color="yellow"
          />
          <StatusCard
            label="Approved"
            value={summary.byStatus.approved}
            color="blue"
          />
          <StatusCard
            label="Processing"
            value={summary.byStatus.processing}
            color="indigo"
          />
          <StatusCard
            label="Paid"
            value={summary.byStatus.paid}
            color="green"
          />
          <StatusCard
            label="Failed"
            value={summary.byStatus.failed}
            color="red"
          />
        </div>

        {/* Filters and Bulk Actions */}
        <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Payroll Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
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
                <option value="draft">Draft</option>
                <option value="pending-approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Search Staff
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Bulk Action
              </label>
              <div className="flex gap-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                >
                  <option value="">Select Action</option>
                  <option value="approve">Approve</option>
                  <option value="process">Process Payment</option>
                  <option value="mark-paid">Mark as Paid</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={selectedStaff.size === 0 || !bulkAction}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Apply {selectedStaff.size > 0 ? `(${selectedStaff.size})` : ""}
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

        {/* Payroll Table */}
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
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Allowances
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Gross Salary
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Status
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
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 font-medium">
                      {formatCurrency(record.basicSalary)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600 dark:text-green-400">
                      +{formatCurrency(record.totalAllowances)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 dark:text-red-400">
                      -{formatCurrency(record.totalDeductions)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 font-medium">
                      {formatCurrency(record.grossSalary)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 font-bold">
                      {formatCurrency(record.netSalary)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                No payroll records found for the selected month
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// Summary Card Component
function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
    green: "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
    cyan: "from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700",
    orange: "from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
    purple: "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
  };

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mb-1">
            {label}
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
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

// Status Card Component
function StatusCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div
      className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-3 text-center`}
    >
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium mt-1">{label}</div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: PayrollStatus }) {
  const statusConfig = {
    draft: { label: "Draft", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
    "pending-approval": { label: "Pending", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    approved: { label: "Approved", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    processing: { label: "Processing", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
    paid: { label: "Paid", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    failed: { label: "Failed", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
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
