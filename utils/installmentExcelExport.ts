import * as XLSX from "xlsx";

interface Installment {
  id: string;
  sequence: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: "pending" | "paid" | "overdue" | "partially_paid" | "waived";
  paidDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  lateFeeApplied?: number;
}

interface InstallmentPlan {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classLevel: string;
  feeTypeName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  installmentCount: number;
  frequency: "monthly" | "quarterly" | "custom";
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "defaulted" | "cancelled";
  installments: Installment[];
  academicYear: string;
  term: string;
  createdAt: string;
  updatedAt: string;
}

export function exportInstallmentPlansToExcel(
  plans: InstallmentPlan[],
  filename: string = "installment-plans.xlsx",
  currencySymbol: string = "₦"
) {
  // Convert currency symbol to display format (use NGN for Naira for better compatibility)
  const currencyPrefix = currencySymbol === "₦" ? "NGN " : currencySymbol;

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format status
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${currencyPrefix}${amount.toLocaleString()}`;
  };

  // Prepare data for Excel - Plans Sheet
  const plansData = [
    // Header row
    [
      "Student Name",
      "Student ID",
      "Class",
      "Fee Type",
      "Total Amount",
      "Paid Amount",
      "Balance",
      "Installments",
      "Frequency",
      "Status",
      "Start Date",
      "End Date",
      "Academic Year",
      "Term",
    ],
    // Data rows
    ...plans.map((plan) => {
      const paidCount = plan.installments.filter((i) => i.status === "paid").length;
      return [
        plan.studentName,
        plan.studentNumber,
        plan.classLevel,
        plan.feeTypeName,
        formatCurrency(plan.totalAmount),
        formatCurrency(plan.paidAmount),
        formatCurrency(plan.remainingAmount),
        `${paidCount}/${plan.installmentCount}`,
        formatStatus(plan.frequency),
        formatStatus(plan.status),
        formatDate(plan.startDate),
        formatDate(plan.endDate),
        plan.academicYear,
        formatStatus(plan.term.replace("-", " ")),
      ];
    }),
  ];

  // Create plans worksheet
  const plansSheet = XLSX.utils.aoa_to_sheet(plansData);

  // Set column widths for plans sheet
  plansSheet["!cols"] = [
    { wch: 25 }, // Student Name
    { wch: 15 }, // Student ID
    { wch: 10 }, // Class
    { wch: 18 }, // Fee Type
    { wch: 15 }, // Total Amount
    { wch: 15 }, // Paid Amount
    { wch: 15 }, // Balance
    { wch: 12 }, // Installments
    { wch: 12 }, // Frequency
    { wch: 12 }, // Status
    { wch: 15 }, // Start Date
    { wch: 15 }, // End Date
    { wch: 12 }, // Academic Year
    { wch: 15 }, // Term
  ];

  // Prepare data for Excel - Installments Detail Sheet
  const installmentsData = [
    // Header row
    [
      "Plan ID",
      "Student Name",
      "Student ID",
      "Installment #",
      "Due Date",
      "Amount",
      "Paid Amount",
      "Status",
      "Paid Date",
      "Payment Method",
      "Reference",
      "Late Fee",
    ],
    // Data rows
    ...plans.flatMap((plan) =>
      plan.installments.map((inst) => [
        plan.id,
        plan.studentName,
        plan.studentNumber,
        inst.sequence,
        formatDate(inst.dueDate),
        formatCurrency(inst.amount),
        formatCurrency(inst.paidAmount),
        formatStatus(inst.status),
        inst.paidDate ? formatDate(inst.paidDate) : "-",
        inst.paymentMethod || "-",
        inst.paymentReference || "-",
        inst.lateFeeApplied ? formatCurrency(inst.lateFeeApplied) : "-",
      ])
    ),
  ];

  // Create installments worksheet
  const installmentsSheet = XLSX.utils.aoa_to_sheet(installmentsData);

  // Set column widths for installments sheet
  installmentsSheet["!cols"] = [
    { wch: 12 }, // Plan ID
    { wch: 25 }, // Student Name
    { wch: 15 }, // Student ID
    { wch: 12 }, // Installment #
    { wch: 15 }, // Due Date
    { wch: 15 }, // Amount
    { wch: 15 }, // Paid Amount
    { wch: 15 }, // Status
    { wch: 15 }, // Paid Date
    { wch: 18 }, // Payment Method
    { wch: 18 }, // Reference
    { wch: 12 }, // Late Fee
  ];

  // Calculate summary stats
  const totalAmount = plans.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalCollected = plans.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = plans.reduce((sum, p) => sum + p.remainingAmount, 0);
  const activePlans = plans.filter((p) => p.status === "active").length;
  const completedPlans = plans.filter((p) => p.status === "completed").length;
  const defaultedPlans = plans.filter((p) => p.status === "defaulted").length;

  // Add summary sheet
  const summaryData = [
    ["Installment Plans Report"],
    [""],
    ["Generated On:", new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })],
    [""],
    ["Summary Statistics:"],
    ["Total Plans:", plans.length],
    ["Total Amount:", formatCurrency(totalAmount)],
    ["Total Collected:", formatCurrency(totalCollected)],
    ["Total Pending:", formatCurrency(totalPending)],
    ["Collection Rate:", `${totalAmount > 0 ? ((totalCollected / totalAmount) * 100).toFixed(1) : 0}%`],
    [""],
    ["Status Breakdown:"],
    ["Active Plans:", activePlans],
    ["Completed Plans:", completedPlans],
    ["Defaulted Plans:", defaultedPlans],
    ["Cancelled Plans:", plans.filter((p) => p.status === "cancelled").length],
    [""],
    ["Column Descriptions (Plans Sheet):"],
    ["Student Name", "Full name of the student"],
    ["Student ID", "Unique student admission number"],
    ["Class", "Student's class level"],
    ["Fee Type", "Type of fee (Tuition, Examination, etc.)"],
    ["Total Amount", "Total amount for the installment plan"],
    ["Paid Amount", "Amount already paid"],
    ["Balance", "Remaining amount to be paid"],
    ["Installments", "Paid installments / Total installments"],
    ["Status", "Current status of the plan"],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Set column widths for summary sheet
  summarySheet["!cols"] = [
    { wch: 20 },
    { wch: 40 },
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(workbook, plansSheet, "Installment Plans");
  XLSX.utils.book_append_sheet(workbook, installmentsSheet, "Installments Detail");
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
}
