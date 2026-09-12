// Payroll Types

export type PayrollStatus = "draft" | "pending-approval" | "approved" | "processing" | "paid" | "failed";

export type PaymentMethod = "bank-transfer" | "cash" | "cheque" | "mobile-money";

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  department: string;
  designation: string;
  profilePhoto?: string;

  // Salary Structure
  basicSalary: number;
  allowances: {
    housing?: number;
    transport?: number;
    meal?: number;
    medical?: number;
    education?: number;
    other?: number;
  };

  // Deductions
  deductions: {
    tax?: number;
    pension?: number;
    nhis?: number; // National Health Insurance
    loan?: number;
    advance?: number;
    other?: number;
  };

  // Calculated Fields
  grossSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;

  // Payment Details
  paymentMethod: PaymentMethod;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;

  // Payroll Period
  month: string; // YYYY-MM
  payrollCycle: string; // e.g., "November 2024"
  paymentDate?: string; // YYYY-MM-DD

  // Status
  status: PayrollStatus;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  processedBy?: string;
  processedByName?: string;
  processedDate?: string;
  paidDate?: string;

  // Additional
  workingDays: number;
  daysPresent: number;
  daysAbsent: number;
  overtime?: number;
  overtimePay?: number;
  bonus?: number;
  remarks?: string;

  createdAt: string;
  updatedAt: string;
}

export interface PayrollSummary {
  totalStaff: number;
  totalGross: number;
  totalAllowances: number;
  totalDeductions: number;
  totalNet: number;
  byStatus: {
    draft: number;
    pendingApproval: number;
    approved: number;
    processing: number;
    paid: number;
    failed: number;
  };
  byDepartment: {
    [key: string]: {
      staff: number;
      gross: number;
      net: number;
    };
  };
}

export interface BulkPayrollAction {
  staffIds: string[];
  action: "approve" | "process" | "mark-paid" | "reject";
  remarks?: string;
}

export interface PayrollFilters {
  month: string;
  department: string;
  status: string;
  searchQuery: string;
}
