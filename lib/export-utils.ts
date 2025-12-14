import * as XLSX from "xlsx";
import { LeaveRequest } from "@/types/leave";
import { TransferRequest } from "@/types/transfer";
import type { Book, BookLoan, LibraryMember, LibraryFine } from "@/types/library";

// Receipt interface for export
interface ReceiptItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

interface Receipt {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classLevel: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentMethod: string;
  paymentReference?: string;
  status: "issued" | "pending" | "voided";
  issueDate: string;
  dueDate?: string;
  academicYear: string;
  term: string;
  issuedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Fee Structure Item interface (matching the page's interface)
interface FeeStructureItem {
  id: string;
  feeTypeId: string;
  feeTypeName: string;
  categoryId: string;
  categoryName: string;
  educationLevel: string;
  classLevel: string;
  amount: number;
  currency: string;
  dueDate: string;
  academicYear: string;
  term: string;
  isActive: boolean;
  allowInstallments: boolean;
  installmentCount?: number;
  lateFee?: number;
  lateFeeType?: "fixed" | "percentage";
  createdAt: string;
  updatedAt: string;
}

/**
 * Export leave requests data to Excel format
 */
export function exportLeaveRequestsToExcel(requests: LeaveRequest[], filename: string = "leave-requests") {
  // Transform data for Excel
  const excelData = requests.map((request) => ({
    "Request ID": request.id,
    "Staff Name": request.staffName,
    "Email": request.staffEmail,
    "Department": request.staffDepartment,
    "Position": request.staffPosition,
    "Leave Type": request.leaveType,
    "Start Date": request.startDate,
    "End Date": request.endDate,
    "Number of Days": request.numberOfDays,
    "Status": request.status.toUpperCase(),
    "Priority": request.priority,
    "Reason": request.reason,
    "Requested Date": request.requestedDate,
    "Manager": request.managerName || "N/A",
    "Approved By": request.approvedByName || "N/A",
    "Approved Date": request.approvedDate || "N/A",
    "Rejected By": request.rejectedByName || "N/A",
    "Rejection Reason": request.rejectionReason || "N/A",
    "Created At": new Date(request.createdAt).toLocaleString(),
    "Updated At": new Date(request.updatedAt).toLocaleString(),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Request ID
    { wch: 20 }, // Staff Name
    { wch: 25 }, // Email
    { wch: 15 }, // Department
    { wch: 18 }, // Position
    { wch: 15 }, // Leave Type
    { wch: 12 }, // Start Date
    { wch: 12 }, // End Date
    { wch: 12 }, // Number of Days
    { wch: 10 }, // Status
    { wch: 10 }, // Priority
    { wch: 40 }, // Reason
    { wch: 15 }, // Requested Date
    { wch: 20 }, // Manager
    { wch: 20 }, // Approved By
    { wch: 18 }, // Approved Date
    { wch: 20 }, // Rejected By
    { wch: 30 }, // Rejection Reason
    { wch: 20 }, // Created At
    { wch: 20 }, // Updated At
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");

  // Generate Excel file
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
}

/**
 * Export leave requests data to PDF format (using print)
 */
export function exportLeaveRequestsToPDF(requests: LeaveRequest[], filename: string = "leave-requests") {
  // Create a printable HTML structure
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Leave Requests Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 20mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            color: #1e40af;
            font-size: 24pt;
          }
          .header p {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 8px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 9pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 16pt;
            font-weight: bold;
            color: #1e40af;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #3b82f6;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 9pt;
            border: 1px solid #2563eb;
          }
          td {
            padding: 8px;
            border: 1px solid #e5e7eb;
            font-size: 9pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .status {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 8pt;
            text-transform: uppercase;
            display: inline-block;
          }
          .status.pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status.approved {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.rejected {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .status.cancelled {
            background-color: #e5e7eb;
            color: #374151;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Leave Requests Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Total Requests</div>
            <div class="value">${requests.length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Pending</div>
            <div class="value">${requests.filter(r => r.status === "pending").length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Approved</div>
            <div class="value">${requests.filter(r => r.status === "approved").length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Rejected</div>
            <div class="value">${requests.filter(r => r.status === "rejected").length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Staff Name</th>
              <th>Department</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Status</th>
              <th>Requested Date</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map(request => `
              <tr>
                <td>${request.id}</td>
                <td>${request.staffName}</td>
                <td>${request.staffDepartment}</td>
                <td>${request.leaveType}</td>
                <td>${request.startDate}</td>
                <td>${request.endDate}</td>
                <td>${request.numberOfDays}</td>
                <td><span class="status ${request.status}">${request.status}</span></td>
                <td>${request.requestedDate}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>&copy; ${new Date().getFullYear()} School Management System. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close window after printing (user can cancel)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to export to PDF");
  }
}

/**
 * Export transfer requests data to Excel format
 */
export function exportTransfersToExcel(transfers: TransferRequest[], filename: string = "transfer-requests") {
  // Transform data for Excel
  const excelData = transfers.map((transfer) => ({
    "Request ID": transfer.id,
    "Student Name": transfer.studentName,
    "Admission Number": transfer.studentAdmissionNumber,
    "Current Class": transfer.studentClass,
    "Current Section": transfer.studentSection,
    "Transfer Type": transfer.transferType,
    "Source Branch": transfer.sourceBranchName || "N/A",
    "Source Class": transfer.sourceClass,
    "Source Section": transfer.sourceSection,
    "Destination Branch": transfer.destinationBranchName || transfer.destinationSchoolName || "N/A",
    "Destination Class": transfer.destinationClass || "N/A",
    "Destination Section": transfer.destinationSection || "N/A",
    "Status": transfer.status.toUpperCase(),
    "Priority": transfer.priority,
    "Financial Clearance": transfer.financialClearance,
    "Outstanding Fees": transfer.outstandingFees || 0,
    "Reason": transfer.reason,
    "Requested Date": transfer.requestedDate,
    "Effective Date": transfer.effectiveDate,
    "Requested By": transfer.requestedByName,
    "Requested By Role": transfer.requestedByRole,
    "Approved By": transfer.approvedByName || "N/A",
    "Approved Date": transfer.approvedDate || "N/A",
    "Processed By": transfer.processedByName || "N/A",
    "Processed Date": transfer.processedDate || "N/A",
    "Rejected By": transfer.rejectedByName || "N/A",
    "Rejection Reason": transfer.rejectionReason || "N/A",
    "Parent Notified": transfer.parentNotified ? "Yes" : "No",
    "Documents Migrated": transfer.documentsMigrated ? "Yes" : "No",
    "Fee Structure Updated": transfer.feeStructureUpdated ? "Yes" : "No",
    "Created At": new Date(transfer.createdAt).toLocaleString(),
    "Updated At": new Date(transfer.updatedAt).toLocaleString(),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Request ID
    { wch: 20 }, // Student Name
    { wch: 15 }, // Admission Number
    { wch: 15 }, // Current Class
    { wch: 15 }, // Current Section
    { wch: 18 }, // Transfer Type
    { wch: 20 }, // Source Branch
    { wch: 15 }, // Source Class
    { wch: 15 }, // Source Section
    { wch: 25 }, // Destination Branch
    { wch: 15 }, // Destination Class
    { wch: 15 }, // Destination Section
    { wch: 12 }, // Status
    { wch: 10 }, // Priority
    { wch: 18 }, // Financial Clearance
    { wch: 15 }, // Outstanding Fees
    { wch: 40 }, // Reason
    { wch: 15 }, // Requested Date
    { wch: 15 }, // Effective Date
    { wch: 20 }, // Requested By
    { wch: 15 }, // Requested By Role
    { wch: 20 }, // Approved By
    { wch: 18 }, // Approved Date
    { wch: 20 }, // Processed By
    { wch: 18 }, // Processed Date
    { wch: 20 }, // Rejected By
    { wch: 30 }, // Rejection Reason
    { wch: 15 }, // Parent Notified
    { wch: 18 }, // Documents Migrated
    { wch: 20 }, // Fee Structure Updated
    { wch: 20 }, // Created At
    { wch: 20 }, // Updated At
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transfer Requests");

  // Generate Excel file
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
}

/**
 * Export transfer requests data to PDF format (using print)
 */
export function exportTransfersToPDF(transfers: TransferRequest[], filename: string = "transfer-requests") {
  // Create a printable HTML structure
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Transfer Requests Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 20mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            color: #1e40af;
            font-size: 24pt;
          }
          .header p {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 8px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 9pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 16pt;
            font-weight: bold;
            color: #1e40af;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #3b82f6;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 9pt;
            border: 1px solid #2563eb;
          }
          td {
            padding: 8px;
            border: 1px solid #e5e7eb;
            font-size: 9pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .status {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 8pt;
            text-transform: uppercase;
            display: inline-block;
          }
          .status.pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status.approved {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.processing {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status.completed {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.rejected {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .status.cancelled {
            background-color: #e5e7eb;
            color: #374151;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Transfer Requests Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Total Requests</div>
            <div class="value">${transfers.length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Pending</div>
            <div class="value">${transfers.filter(t => t.status === "pending").length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Approved</div>
            <div class="value">${transfers.filter(t => t.status === "approved").length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Completed</div>
            <div class="value">${transfers.filter(t => t.status === "completed").length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Rejected</div>
            <div class="value">${transfers.filter(t => t.status === "rejected").length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Student Name</th>
              <th>Admission No.</th>
              <th>Transfer Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Requested Date</th>
            </tr>
          </thead>
          <tbody>
            ${transfers.map(transfer => `
              <tr>
                <td>${transfer.id}</td>
                <td>${transfer.studentName}</td>
                <td>${transfer.studentAdmissionNumber}</td>
                <td>${transfer.transferType}</td>
                <td>${transfer.sourceClass}-${transfer.sourceSection}</td>
                <td>${transfer.destinationClass || transfer.destinationSchoolName || "N/A"}</td>
                <td><span class="status ${transfer.status}">${transfer.status}</span></td>
                <td>${transfer.priority}</td>
                <td>${transfer.requestedDate}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>&copy; ${new Date().getFullYear()} School Management System. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close window after printing (user can cancel)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to export to PDF");
  }
}

/**
 * Export fee structure data to Excel format
 */
export function exportFeeStructureToExcel(
  fees: FeeStructureItem[],
  filename: string = "fee-structure",
  formatCurrency?: (amount: number) => string
) {
  // Transform data for Excel
  const excelData = fees.map((fee) => ({
    "Fee ID": fee.id,
    "Fee Type": fee.feeTypeName,
    "Category": fee.categoryName,
    "Education Level": fee.educationLevel.charAt(0).toUpperCase() + fee.educationLevel.slice(1),
    "Class/Level": fee.classLevel,
    "Amount": formatCurrency ? formatCurrency(fee.amount) : fee.amount,
    "Currency": fee.currency,
    "Due Date": fee.dueDate,
    "Academic Year": fee.academicYear,
    "Term/Semester": fee.term.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    "Status": fee.isActive ? "Active" : "Inactive",
    "Installments Allowed": fee.allowInstallments ? "Yes" : "No",
    "Installment Count": fee.installmentCount || "N/A",
    "Late Fee": fee.lateFee ? (fee.lateFeeType === "percentage" ? `${fee.lateFee}%` : fee.lateFee) : "N/A",
    "Late Fee Type": fee.lateFeeType ? fee.lateFeeType.charAt(0).toUpperCase() + fee.lateFeeType.slice(1) : "N/A",
    "Created Date": fee.createdAt,
    "Last Updated": fee.updatedAt,
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Fee ID
    { wch: 25 }, // Fee Type
    { wch: 25 }, // Category
    { wch: 15 }, // Education Level
    { wch: 15 }, // Class/Level
    { wch: 15 }, // Amount
    { wch: 10 }, // Currency
    { wch: 12 }, // Due Date
    { wch: 12 }, // Academic Year
    { wch: 18 }, // Term/Semester
    { wch: 10 }, // Status
    { wch: 18 }, // Installments Allowed
    { wch: 15 }, // Installment Count
    { wch: 12 }, // Late Fee
    { wch: 12 }, // Late Fee Type
    { wch: 15 }, // Created Date
    { wch: 15 }, // Last Updated
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Fee Structure");

  // Generate Excel file
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
}

/**
 * Export fee structure data to PDF format (using print)
 */
export function exportFeeStructureToPDF(
  fees: FeeStructureItem[],
  filename: string = "fee-structure",
  formatCurrency?: (amount: number) => string,
  schoolName: string = "School Management System"
) {
  // Calculate summary statistics
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const activeFees = fees.filter(f => f.isActive).length;
  const inactiveFees = fees.filter(f => !f.isActive).length;
  const withInstallments = fees.filter(f => f.allowInstallments).length;

  // Group by category for summary
  const categoryTotals = fees.reduce((acc, fee) => {
    if (!acc[fee.categoryName]) {
      acc[fee.categoryName] = { count: 0, total: 0 };
    }
    acc[fee.categoryName].count++;
    acc[fee.categoryName].total += fee.amount;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  const formatAmount = (amount: number) => formatCurrency ? formatCurrency(amount) : `${fees[0]?.currency || 'NGN'} ${amount.toLocaleString()}`;

  // Create a printable HTML structure
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Fee Structure Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #7c3aed;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            color: #7c3aed;
            font-size: 22pt;
          }
          .header .school-name {
            font-size: 12pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .header p {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
            border-radius: 10px;
            border: 1px solid #ddd6fe;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 9pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 14pt;
            font-weight: bold;
            color: #7c3aed;
          }
          .category-summary {
            margin-bottom: 20px;
            padding: 12px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .category-summary h3 {
            margin: 0 0 10px 0;
            font-size: 11pt;
            color: #374151;
          }
          .category-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }
          .category-item {
            padding: 8px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .category-item .name {
            font-size: 9pt;
            color: #6b7280;
          }
          .category-item .count {
            font-size: 11pt;
            font-weight: bold;
            color: #374151;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
            color: white;
            padding: 10px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 8pt;
            border: 1px solid #6366f1;
          }
          td {
            padding: 8px 6px;
            border: 1px solid #e5e7eb;
            font-size: 8pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          tr:hover {
            background-color: #f3e8ff;
          }
          .status {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 7pt;
            text-transform: uppercase;
            display: inline-block;
          }
          .status.active {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.inactive {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .amount {
            font-weight: 600;
            color: #059669;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${schoolName}</div>
          <h1>Fee Structure Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Total Fee Items</div>
            <div class="value">${fees.length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Active Fees</div>
            <div class="value">${activeFees}</div>
          </div>
          <div class="summary-item">
            <div class="label">Inactive Fees</div>
            <div class="value">${inactiveFees}</div>
          </div>
          <div class="summary-item">
            <div class="label">With Installments</div>
            <div class="value">${withInstallments}</div>
          </div>
          <div class="summary-item">
            <div class="label">Total Amount</div>
            <div class="value">${formatAmount(totalFees)}</div>
          </div>
        </div>

        <div class="category-summary">
          <h3>Category Breakdown</h3>
          <div class="category-grid">
            ${Object.entries(categoryTotals).map(([name, data]) => `
              <div class="category-item">
                <div class="name">${name}</div>
                <div class="count">${data.count} items · ${formatAmount(data.total)}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Fee Type</th>
              <th>Category</th>
              <th>Level</th>
              <th>Class</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Term</th>
              <th>Status</th>
              <th>Installments</th>
            </tr>
          </thead>
          <tbody>
            ${fees.map(fee => `
              <tr>
                <td>${fee.feeTypeName}</td>
                <td>${fee.categoryName}</td>
                <td>${fee.educationLevel.charAt(0).toUpperCase() + fee.educationLevel.slice(1)}</td>
                <td>${fee.classLevel}</td>
                <td class="amount">${formatAmount(fee.amount)}</td>
                <td>${fee.dueDate}</td>
                <td>${fee.term.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</td>
                <td><span class="status ${fee.isActive ? 'active' : 'inactive'}">${fee.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>${fee.allowInstallments ? `Yes (${fee.installmentCount || 'N/A'})` : 'No'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>&copy; ${new Date().getFullYear()} ${schoolName}. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close window after printing (user can cancel)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to export to PDF");
  }
}

/**
 * Export receipts data to Excel format
 */
export function exportReceiptsToExcel(
  receipts: Receipt[],
  filename: string = "receipts",
  formatCurrency?: (amount: number) => string
) {
  // Transform data for Excel
  const excelData = receipts.map((receipt) => ({
    "Receipt Number": receipt.receiptNumber,
    "Student Name": receipt.studentName,
    "Student ID": receipt.studentNumber,
    "Class": receipt.classLevel,
    "Items": receipt.items.map(i => i.description).join(", "),
    "Subtotal": formatCurrency ? formatCurrency(receipt.subtotal) : receipt.subtotal,
    "Discount": formatCurrency ? formatCurrency(receipt.discount) : receipt.discount,
    "Total Amount": formatCurrency ? formatCurrency(receipt.totalAmount) : receipt.totalAmount,
    "Amount Paid": formatCurrency ? formatCurrency(receipt.amountPaid) : receipt.amountPaid,
    "Balance": formatCurrency ? formatCurrency(receipt.balance) : receipt.balance,
    "Payment Method": receipt.paymentMethod.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    "Payment Reference": receipt.paymentReference || "N/A",
    "Status": receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1),
    "Issue Date": receipt.issueDate,
    "Due Date": receipt.dueDate || "N/A",
    "Academic Year": receipt.academicYear,
    "Term": receipt.term.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    "Issued By": receipt.issuedBy,
    "Notes": receipt.notes || "N/A",
    "Created At": new Date(receipt.createdAt).toLocaleString(),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 18 }, // Receipt Number
    { wch: 25 }, // Student Name
    { wch: 15 }, // Student ID
    { wch: 10 }, // Class
    { wch: 40 }, // Items
    { wch: 15 }, // Subtotal
    { wch: 12 }, // Discount
    { wch: 15 }, // Total Amount
    { wch: 15 }, // Amount Paid
    { wch: 15 }, // Balance
    { wch: 15 }, // Payment Method
    { wch: 20 }, // Payment Reference
    { wch: 10 }, // Status
    { wch: 12 }, // Issue Date
    { wch: 12 }, // Due Date
    { wch: 12 }, // Academic Year
    { wch: 15 }, // Term
    { wch: 15 }, // Issued By
    { wch: 30 }, // Notes
    { wch: 20 }, // Created At
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");

  // Generate Excel file
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
}

/**
 * Export receipts data to PDF format (using print)
 */
export function exportReceiptsToPDF(
  receipts: Receipt[],
  filename: string = "receipts",
  formatCurrency?: (amount: number) => string,
  schoolName: string = "School Management System"
) {
  // Calculate summary statistics
  const totalAmount = receipts.filter(r => r.status !== "voided").reduce((sum, r) => sum + r.totalAmount, 0);
  const totalCollected = receipts.filter(r => r.status === "issued").reduce((sum, r) => sum + r.amountPaid, 0);
  const totalOutstanding = receipts.filter(r => r.status !== "voided").reduce((sum, r) => sum + r.balance, 0);
  const issuedCount = receipts.filter(r => r.status === "issued").length;
  const pendingCount = receipts.filter(r => r.status === "pending").length;
  const voidedCount = receipts.filter(r => r.status === "voided").length;

  const formatAmount = (amount: number) => formatCurrency ? formatCurrency(amount) : `NGN ${amount.toLocaleString()}`;

  // Create a printable HTML structure
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipts Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #10b981;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            color: #059669;
            font-size: 22pt;
          }
          .header .school-name {
            font-size: 12pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .header p {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-radius: 10px;
            border: 1px solid #a7f3d0;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 9pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 14pt;
            font-weight: bold;
            color: #059669;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 10px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 8pt;
            border: 1px solid #059669;
          }
          td {
            padding: 8px 6px;
            border: 1px solid #e5e7eb;
            font-size: 8pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          tr:hover {
            background-color: #ecfdf5;
          }
          .status {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 7pt;
            text-transform: uppercase;
            display: inline-block;
          }
          .status.issued {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status.voided {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .amount {
            font-weight: 600;
            color: #059669;
          }
          .amount.balance {
            color: #d97706;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${schoolName}</div>
          <h1>Receipts Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Total Receipts</div>
            <div class="value">${receipts.length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Issued</div>
            <div class="value">${issuedCount}</div>
          </div>
          <div class="summary-item">
            <div class="label">Pending</div>
            <div class="value">${pendingCount}</div>
          </div>
          <div class="summary-item">
            <div class="label">Voided</div>
            <div class="value">${voidedCount}</div>
          </div>
          <div class="summary-item">
            <div class="label">Total Amount</div>
            <div class="value">${formatAmount(totalAmount)}</div>
          </div>
          <div class="summary-item">
            <div class="label">Collected</div>
            <div class="value">${formatAmount(totalCollected)}</div>
          </div>
          <div class="summary-item">
            <div class="label">Outstanding</div>
            <div class="value">${formatAmount(totalOutstanding)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Student</th>
              <th>Class</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${receipts.map(receipt => `
              <tr>
                <td>${receipt.receiptNumber}</td>
                <td>${receipt.studentName}<br/><small style="color:#6b7280">${receipt.studentNumber}</small></td>
                <td>${receipt.classLevel}</td>
                <td class="amount">${formatAmount(receipt.totalAmount)}</td>
                <td class="amount">${formatAmount(receipt.amountPaid)}</td>
                <td class="amount ${receipt.balance > 0 ? 'balance' : ''}">${formatAmount(receipt.balance)}</td>
                <td>${receipt.paymentMethod.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td><span class="status ${receipt.status}">${receipt.status}</span></td>
                <td>${receipt.issueDate}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>&copy; ${new Date().getFullYear()} ${schoolName}. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close window after printing (user can cancel)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to export to PDF");
  }
}

/**
 * Export library books data to Excel format
 */
export function exportBooksToExcel(
  books: Book[],
  filename: string = "book-catalog",
  formatCurrency?: (amount: number) => string
) {
  // Transform data for Excel
  const excelData = books.map((book) => ({
    "ISBN": book.isbn,
    "Title": book.title,
    "Author": book.author,
    "Publisher": book.publisher,
    "Publish Year": book.publishYear,
    "Edition": book.edition || "N/A",
    "Category": book.category.charAt(0).toUpperCase() + book.category.slice(1).replace("-", " "),
    "Subject": book.subject || "N/A",
    "Education Level": book.educationLevel,
    "Total Copies": book.totalCopies,
    "Available Copies": book.availableCopies,
    "Borrowed Copies": book.totalCopies - book.availableCopies,
    "Location": book.location,
    "Condition": book.condition.charAt(0).toUpperCase() + book.condition.slice(1),
    "Status": book.status.charAt(0).toUpperCase() + book.status.slice(1),
    "Language": book.language,
    "Pages": book.pages || "N/A",
    "Price": book.price ? (formatCurrency ? formatCurrency(book.price) : book.price) : "N/A",
    "Acquisition Date": book.acquisitionDate,
    "Tags": book.tags?.join(", ") || "N/A",
    "Description": book.description || "N/A",
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 18 }, // ISBN
    { wch: 35 }, // Title
    { wch: 25 }, // Author
    { wch: 25 }, // Publisher
    { wch: 12 }, // Publish Year
    { wch: 15 }, // Edition
    { wch: 15 }, // Category
    { wch: 20 }, // Subject
    { wch: 15 }, // Education Level
    { wch: 12 }, // Total Copies
    { wch: 15 }, // Available Copies
    { wch: 15 }, // Borrowed Copies
    { wch: 20 }, // Location
    { wch: 12 }, // Condition
    { wch: 12 }, // Status
    { wch: 12 }, // Language
    { wch: 8 },  // Pages
    { wch: 15 }, // Price
    { wch: 15 }, // Acquisition Date
    { wch: 30 }, // Tags
    { wch: 50 }, // Description
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Book Catalog");

  // Generate Excel file
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
}

/**
 * Export library books data to PDF format (using print)
 */
export function exportBooksToPDF(
  books: Book[],
  filename: string = "book-catalog",
  formatCurrency?: (amount: number) => string,
  schoolName: string = "School Management System"
) {
  // Calculate summary statistics
  const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const borrowedBooks = totalBooks - availableBooks;
  const uniqueTitles = books.length;

  // Group by category
  const categoryStats = books.reduce((acc, book) => {
    const cat = book.category;
    if (!acc[cat]) {
      acc[cat] = { count: 0, copies: 0 };
    }
    acc[cat].count++;
    acc[cat].copies += book.totalCopies;
    return acc;
  }, {} as Record<string, { count: number; copies: number }>);

  const formatAmount = (amount: number) => formatCurrency ? formatCurrency(amount) : `NGN ${amount.toLocaleString()}`;

  // Create a printable HTML structure
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Book Catalog Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #8b5cf6;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            color: #7c3aed;
            font-size: 22pt;
          }
          .header .school-name {
            font-size: 12pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .header p {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
            border-radius: 10px;
            border: 1px solid #ddd6fe;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 9pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 14pt;
            font-weight: bold;
            color: #7c3aed;
          }
          .category-summary {
            margin-bottom: 20px;
            padding: 12px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .category-summary h3 {
            margin: 0 0 10px 0;
            font-size: 11pt;
            color: #374151;
          }
          .category-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }
          .category-item {
            padding: 8px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .category-item .name {
            font-size: 9pt;
            color: #6b7280;
            text-transform: capitalize;
          }
          .category-item .count {
            font-size: 11pt;
            font-weight: bold;
            color: #374151;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            padding: 10px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 8pt;
            border: 1px solid #7c3aed;
          }
          td {
            padding: 8px 6px;
            border: 1px solid #e5e7eb;
            font-size: 8pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          tr:hover {
            background-color: #f5f3ff;
          }
          .status {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 7pt;
            text-transform: capitalize;
            display: inline-block;
          }
          .status.available {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.borrowed {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status.reserved {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status.lost {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .status.damaged {
            background-color: #ffedd5;
            color: #9a3412;
          }
          .status.maintenance {
            background-color: #e5e7eb;
            color: #374151;
          }
          .condition {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 7pt;
            text-transform: capitalize;
          }
          .condition.new {
            background-color: #d1fae5;
            color: #065f46;
          }
          .condition.good {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .condition.fair {
            background-color: #fef3c7;
            color: #92400e;
          }
          .condition.poor {
            background-color: #ffedd5;
            color: #9a3412;
          }
          .condition.damaged {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .copies {
            font-weight: 600;
          }
          .copies .available {
            color: #059669;
          }
          .copies .total {
            color: #6b7280;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${schoolName}</div>
          <h1>Book Catalog Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Unique Titles</div>
            <div class="value">${uniqueTitles}</div>
          </div>
          <div class="summary-item">
            <div class="label">Total Copies</div>
            <div class="value">${totalBooks.toLocaleString()}</div>
          </div>
          <div class="summary-item">
            <div class="label">Available</div>
            <div class="value">${availableBooks.toLocaleString()}</div>
          </div>
          <div class="summary-item">
            <div class="label">Borrowed</div>
            <div class="value">${borrowedBooks.toLocaleString()}</div>
          </div>
          <div class="summary-item">
            <div class="label">Availability Rate</div>
            <div class="value">${totalBooks > 0 ? ((availableBooks / totalBooks) * 100).toFixed(1) : 0}%</div>
          </div>
        </div>

        <div class="category-summary">
          <h3>Category Distribution</h3>
          <div class="category-grid">
            ${Object.entries(categoryStats).slice(0, 8).map(([name, data]) => `
              <div class="category-item">
                <div class="name">${name.replace("-", " ")}</div>
                <div class="count">${data.count} titles · ${data.copies} copies</div>
              </div>
            `).join("")}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Title / Author</th>
              <th>Category</th>
              <th>Level</th>
              <th>Copies</th>
              <th>Location</th>
              <th>Condition</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${books.map(book => `
              <tr>
                <td style="font-family: monospace; font-size: 7pt;">${book.isbn}</td>
                <td>
                  <strong>${book.title}</strong><br/>
                  <small style="color:#6b7280">${book.author}</small>
                </td>
                <td style="text-transform: capitalize;">${book.category.replace("-", " ")}</td>
                <td>${book.educationLevel}</td>
                <td class="copies">
                  <span class="available">${book.availableCopies}</span>
                  <span class="total">/ ${book.totalCopies}</span>
                </td>
                <td>${book.location}</td>
                <td><span class="condition ${book.condition}">${book.condition}</span></td>
                <td><span class="status ${book.status}">${book.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>&copy; ${new Date().getFullYear()} ${schoolName}. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close window after printing (user can cancel)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to export to PDF");
  }
}

/**
 * Export book loans data to Excel format
 */
export function exportLoansToExcel(
  loans: BookLoan[],
  filename: string = "borrowing-records",
  formatCurrency?: (amount: number) => string
) {
  // Transform data for Excel
  const excelData = loans.map((loan) => ({
    "Loan Number": loan.loanNumber,
    "Book Title": loan.bookTitle,
    "Book ISBN": loan.bookIsbn,
    "Borrower Name": loan.memberName,
    "Borrower Type": loan.memberType.charAt(0).toUpperCase() + loan.memberType.slice(1),
    "Borrow Date": loan.borrowDate,
    "Due Date": loan.dueDate,
    "Return Date": loan.returnDate || "Not Returned",
    "Status": loan.status.charAt(0).toUpperCase() + loan.status.slice(1),
    "Renewals": `${loan.renewalCount} / ${loan.maxRenewals}`,
    "Fine Amount": loan.fineAmount > 0 ? (formatCurrency ? formatCurrency(loan.fineAmount) : loan.fineAmount) : "None",
    "Fine Paid": loan.fineAmount > 0 ? (loan.finePaid ? "Yes" : "No") : "N/A",
    "Issued By": loan.issuedBy,
    "Returned To": loan.returnedTo || "N/A",
    "Notes": loan.notes || "N/A",
    "Created At": new Date(loan.createdAt).toLocaleString(),
    "Last Updated": new Date(loan.updatedAt).toLocaleString(),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 18 }, // Loan Number
    { wch: 35 }, // Book Title
    { wch: 20 }, // Book ISBN
    { wch: 25 }, // Borrower Name
    { wch: 15 }, // Borrower Type
    { wch: 12 }, // Borrow Date
    { wch: 12 }, // Due Date
    { wch: 15 }, // Return Date
    { wch: 12 }, // Status
    { wch: 10 }, // Renewals
    { wch: 15 }, // Fine Amount
    { wch: 10 }, // Fine Paid
    { wch: 15 }, // Issued By
    { wch: 15 }, // Returned To
    { wch: 30 }, // Notes
    { wch: 20 }, // Created At
    { wch: 20 }, // Last Updated
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Borrowing Records");

  // Generate Excel file
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
}

/**
 * Export book loans data to PDF format (using print)
 */
export function exportLoansToPDF(
  loans: BookLoan[],
  filename: string = "borrowing-records",
  formatCurrency?: (amount: number) => string,
  schoolName: string = "School Management System"
) {
  // Calculate summary statistics
  const activeLoans = loans.filter(l => l.status === "active").length;
  const overdueLoans = loans.filter(l => l.status === "overdue").length;
  const returnedLoans = loans.filter(l => l.status === "returned").length;
  const lostLoans = loans.filter(l => l.status === "lost").length;
  const totalFines = loans.reduce((sum, l) => sum + (l.finePaid ? 0 : l.fineAmount), 0);
  const collectedFines = loans.reduce((sum, l) => sum + (l.finePaid ? l.fineAmount : 0), 0);

  // Group by borrower type
  const borrowerStats = loans.reduce((acc, loan) => {
    const type = loan.memberType;
    if (!acc[type]) {
      acc[type] = { count: 0, fines: 0 };
    }
    acc[type].count++;
    acc[type].fines += loan.fineAmount;
    return acc;
  }, {} as Record<string, { count: number; fines: number }>);

  const formatAmount = (amount: number) => formatCurrency ? formatCurrency(amount) : `NGN ${amount.toLocaleString()}`;

  // Create a printable HTML structure
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Borrowing Records Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            color: #1e40af;
            font-size: 22pt;
          }
          .header .school-name {
            font-size: 12pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .header p {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 10px;
            border: 1px solid #bfdbfe;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 9pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 14pt;
            font-weight: bold;
            color: #1e40af;
          }
          .summary-item .value.warning {
            color: #dc2626;
          }
          .summary-item .value.success {
            color: #059669;
          }
          .borrower-summary {
            margin-bottom: 20px;
            padding: 12px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .borrower-summary h3 {
            margin: 0 0 10px 0;
            font-size: 11pt;
            color: #374151;
          }
          .borrower-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .borrower-item {
            padding: 8px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .borrower-item .name {
            font-size: 9pt;
            color: #6b7280;
            text-transform: capitalize;
          }
          .borrower-item .count {
            font-size: 11pt;
            font-weight: bold;
            color: #374151;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            padding: 10px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 8pt;
            border: 1px solid #1e40af;
          }
          td {
            padding: 8px 6px;
            border: 1px solid #e5e7eb;
            font-size: 8pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          tr:hover {
            background-color: #eff6ff;
          }
          .status {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 7pt;
            text-transform: capitalize;
            display: inline-block;
          }
          .status.active {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status.overdue {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .status.returned {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.lost {
            background-color: #e5e7eb;
            color: #374151;
          }
          .member-type {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 7pt;
            text-transform: capitalize;
          }
          .member-type.student {
            background-color: #f3e8ff;
            color: #7c3aed;
          }
          .member-type.teacher {
            background-color: #cffafe;
            color: #0891b2;
          }
          .member-type.staff {
            background-color: #ffedd5;
            color: #c2410c;
          }
          .fine {
            font-weight: 600;
          }
          .fine.unpaid {
            color: #dc2626;
          }
          .fine.paid {
            color: #6b7280;
            text-decoration: line-through;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${schoolName}</div>
          <h1>Borrowing Records Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Total Loans</div>
            <div class="value">${loans.length}</div>
          </div>
          <div class="summary-item">
            <div class="label">Active</div>
            <div class="value">${activeLoans}</div>
          </div>
          <div class="summary-item">
            <div class="label">Overdue</div>
            <div class="value warning">${overdueLoans}</div>
          </div>
          <div class="summary-item">
            <div class="label">Returned</div>
            <div class="value success">${returnedLoans}</div>
          </div>
          <div class="summary-item">
            <div class="label">Lost</div>
            <div class="value">${lostLoans}</div>
          </div>
          <div class="summary-item">
            <div class="label">Pending Fines</div>
            <div class="value warning">${formatAmount(totalFines)}</div>
          </div>
          <div class="summary-item">
            <div class="label">Collected Fines</div>
            <div class="value success">${formatAmount(collectedFines)}</div>
          </div>
        </div>

        <div class="borrower-summary">
          <h3>Borrower Type Breakdown</h3>
          <div class="borrower-grid">
            ${Object.entries(borrowerStats).map(([type, data]) => `
              <div class="borrower-item">
                <div class="name">${type}s</div>
                <div class="count">${data.count} loans · ${formatAmount(data.fines)} fines</div>
              </div>
            `).join("")}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Loan #</th>
              <th>Book Title</th>
              <th>Borrower</th>
              <th>Type</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Fine</th>
            </tr>
          </thead>
          <tbody>
            ${loans.map(loan => `
              <tr>
                <td style="font-family: monospace;">${loan.loanNumber}</td>
                <td>
                  <strong>${loan.bookTitle}</strong><br/>
                  <small style="color:#6b7280">${loan.bookIsbn}</small>
                </td>
                <td>${loan.memberName}</td>
                <td><span class="member-type ${loan.memberType}">${loan.memberType}</span></td>
                <td>${loan.borrowDate}</td>
                <td>${loan.dueDate}</td>
                <td>${loan.returnDate || "-"}</td>
                <td><span class="status ${loan.status}">${loan.status}</span></td>
                <td class="fine ${loan.fineAmount > 0 ? (loan.finePaid ? 'paid' : 'unpaid') : ''}">
                  ${loan.fineAmount > 0 ? formatAmount(loan.fineAmount) : "-"}
                  ${loan.finePaid && loan.fineAmount > 0 ? ' (Paid)' : ''}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>&copy; ${new Date().getFullYear()} ${schoolName}. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close window after printing (user can cancel)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to export to PDF");
  }
}

/**
 * Export library members data to Excel format
 */
export function exportMembersToExcel(
  members: LibraryMember[],
  filename: string = "library-members",
  formatCurrency?: (amount: number) => string
) {
  // Transform data for Excel
  const excelData = members.map((member) => ({
    "Member ID": member.memberId,
    "Name": member.name,
    "Type": member.type.charAt(0).toUpperCase() + member.type.slice(1),
    "Email": member.email || "N/A",
    "Phone": member.phone || "N/A",
    "Class/Department": member.class || member.department || "N/A",
    "Status": member.isActive ? "Active" : "Inactive",
    "Current Books": member.currentBooksCount,
    "Max Books Allowed": member.maxBooksAllowed,
    "Total Borrowed": member.totalBorrowedCount,
    "Fines Due": member.finesDue > 0 ? (formatCurrency ? formatCurrency(member.finesDue) : member.finesDue) : "None",
    "Member Since": member.memberSince,
    "Expiry Date": member.expiryDate || "N/A",
    "Person ID": member.personId,
    "Created At": new Date(member.createdAt).toLocaleString(),
    "Last Updated": new Date(member.updatedAt).toLocaleString(),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 18 }, // Member ID
    { wch: 25 }, // Name
    { wch: 10 }, // Type
    { wch: 30 }, // Email
    { wch: 15 }, // Phone
    { wch: 20 }, // Class/Department
    { wch: 10 }, // Status
    { wch: 14 }, // Current Books
    { wch: 16 }, // Max Books Allowed
    { wch: 14 }, // Total Borrowed
    { wch: 15 }, // Fines Due
    { wch: 12 }, // Member Since
    { wch: 12 }, // Expiry Date
    { wch: 15 }, // Person ID
    { wch: 20 }, // Created At
    { wch: 20 }, // Last Updated
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Library Members");

  // Generate Excel file
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
}

/**
 * Export library members data to PDF format (using print)
 */
export function exportMembersToPDF(
  members: LibraryMember[],
  filename: string = "library-members",
  formatCurrency?: (amount: number) => string,
  schoolName: string = "School Management System"
) {
  // Calculate summary statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.isActive).length;
  const inactiveMembers = members.filter(m => !m.isActive).length;
  const membersWithFines = members.filter(m => m.finesDue > 0).length;
  const totalFines = members.reduce((sum, m) => sum + m.finesDue, 0);
  const totalBooksBorrowed = members.reduce((sum, m) => sum + m.currentBooksCount, 0);

  // Group by type
  const typeStats = members.reduce((acc, member) => {
    const type = member.type;
    if (!acc[type]) {
      acc[type] = { count: 0, fines: 0, books: 0 };
    }
    acc[type].count++;
    acc[type].fines += member.finesDue;
    acc[type].books += member.currentBooksCount;
    return acc;
  }, {} as Record<string, { count: number; fines: number; books: number }>);

  const formatAmount = (amount: number) => formatCurrency ? formatCurrency(amount) : `NGN ${amount.toLocaleString()}`;

  // Create a printable HTML structure
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Library Members Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #8b5cf6;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            color: #7c3aed;
            font-size: 22pt;
          }
          .header .school-name {
            font-size: 12pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .header p {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
            border-radius: 10px;
            border: 1px solid #ddd6fe;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 9pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 14pt;
            font-weight: bold;
            color: #7c3aed;
          }
          .summary-item .value.warning {
            color: #dc2626;
          }
          .summary-item .value.success {
            color: #059669;
          }
          .type-summary {
            margin-bottom: 20px;
            padding: 12px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .type-summary h3 {
            margin: 0 0 10px 0;
            font-size: 11pt;
            color: #374151;
          }
          .type-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .type-item {
            padding: 8px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .type-item .name {
            font-size: 9pt;
            color: #6b7280;
            text-transform: capitalize;
          }
          .type-item .count {
            font-size: 11pt;
            font-weight: bold;
            color: #374151;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            padding: 10px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 8pt;
            border: 1px solid #7c3aed;
          }
          td {
            padding: 8px 6px;
            border: 1px solid #e5e7eb;
            font-size: 8pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          tr:hover {
            background-color: #f5f3ff;
          }
          .status {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 7pt;
            text-transform: capitalize;
            display: inline-block;
          }
          .status.active {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.inactive {
            background-color: #e5e7eb;
            color: #374151;
          }
          .member-type {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 7pt;
            text-transform: capitalize;
          }
          .member-type.student {
            background-color: #f3e8ff;
            color: #7c3aed;
          }
          .member-type.teacher {
            background-color: #cffafe;
            color: #0891b2;
          }
          .member-type.staff {
            background-color: #ffedd5;
            color: #c2410c;
          }
          .fine {
            font-weight: 600;
            color: #dc2626;
          }
          .books {
            font-weight: 600;
          }
          .books .current {
            color: #059669;
          }
          .books .max {
            color: #6b7280;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${schoolName}</div>
          <h1>Library Members Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Total Members</div>
            <div class="value">${totalMembers}</div>
          </div>
          <div class="summary-item">
            <div class="label">Active</div>
            <div class="value success">${activeMembers}</div>
          </div>
          <div class="summary-item">
            <div class="label">Inactive</div>
            <div class="value">${inactiveMembers}</div>
          </div>
          <div class="summary-item">
            <div class="label">With Fines</div>
            <div class="value warning">${membersWithFines}</div>
          </div>
          <div class="summary-item">
            <div class="label">Total Fines</div>
            <div class="value warning">${formatAmount(totalFines)}</div>
          </div>
          <div class="summary-item">
            <div class="label">Books Borrowed</div>
            <div class="value">${totalBooksBorrowed}</div>
          </div>
        </div>

        <div class="type-summary">
          <h3>Member Type Breakdown</h3>
          <div class="type-grid">
            ${Object.entries(typeStats).map(([type, data]) => `
              <div class="type-item">
                <div class="name">${type}s</div>
                <div class="count">${data.count} members · ${data.books} books · ${formatAmount(data.fines)} fines</div>
              </div>
            `).join("")}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Class/Dept</th>
              <th>Books</th>
              <th>Total Borrowed</th>
              <th>Fines</th>
              <th>Status</th>
              <th>Member Since</th>
            </tr>
          </thead>
          <tbody>
            ${members.map(member => `
              <tr>
                <td style="font-family: monospace;">${member.memberId}</td>
                <td>
                  <strong>${member.name}</strong><br/>
                  <small style="color:#6b7280">${member.email || "No email"}</small>
                </td>
                <td><span class="member-type ${member.type}">${member.type}</span></td>
                <td>${member.class || member.department || "-"}</td>
                <td class="books">
                  <span class="current">${member.currentBooksCount}</span>
                  <span class="max">/ ${member.maxBooksAllowed}</span>
                </td>
                <td>${member.totalBorrowedCount}</td>
                <td class="${member.finesDue > 0 ? 'fine' : ''}">${member.finesDue > 0 ? formatAmount(member.finesDue) : "-"}</td>
                <td><span class="status ${member.isActive ? 'active' : 'inactive'}">${member.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>${member.memberSince}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>&copy; ${new Date().getFullYear()} ${schoolName}. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close window after printing (user can cancel)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to export to PDF");
  }
}

/**
 * Export library fines data to Excel format
 */
export function exportFinesToExcel(
  fines: LibraryFine[],
  filename: string = "library-fines",
  formatCurrency?: (amount: number) => string
) {
  // Transform data for Excel
  const excelData = fines.map((fine) => ({
    "Fine ID": fine.id,
    "Loan ID": fine.loanId,
    "Member ID": fine.memberId,
    "Member Name": fine.memberName,
    "Book Title": fine.bookTitle,
    "Fine Type": fine.fineType.charAt(0).toUpperCase() + fine.fineType.slice(1),
    "Amount": formatCurrency ? formatCurrency(fine.amount) : fine.amount,
    "Days Overdue": fine.daysOverdue || "N/A",
    "Status": fine.isPaid ? (fine.waivedAmount && fine.waivedAmount > 0 && (!fine.paidAmount || fine.paidAmount === 0) ? "Waived" : "Paid") : "Pending",
    "Paid Amount": fine.paidAmount ? (formatCurrency ? formatCurrency(fine.paidAmount) : fine.paidAmount) : "N/A",
    "Payment Method": fine.paymentMethod || "N/A",
    "Payment Reference": fine.paymentReference || "N/A",
    "Paid Date": fine.paidDate || "N/A",
    "Waived Amount": fine.waivedAmount ? (formatCurrency ? formatCurrency(fine.waivedAmount) : fine.waivedAmount) : "N/A",
    "Waived By": fine.waivedBy || "N/A",
    "Waived Reason": fine.waivedReason || "N/A",
    "Created At": new Date(fine.createdAt).toLocaleString(),
    "Last Updated": new Date(fine.updatedAt).toLocaleString(),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Fine ID
    { wch: 12 }, // Loan ID
    { wch: 12 }, // Member ID
    { wch: 25 }, // Member Name
    { wch: 35 }, // Book Title
    { wch: 12 }, // Fine Type
    { wch: 15 }, // Amount
    { wch: 12 }, // Days Overdue
    { wch: 10 }, // Status
    { wch: 15 }, // Paid Amount
    { wch: 15 }, // Payment Method
    { wch: 20 }, // Payment Reference
    { wch: 12 }, // Paid Date
    { wch: 15 }, // Waived Amount
    { wch: 15 }, // Waived By
    { wch: 30 }, // Waived Reason
    { wch: 20 }, // Created At
    { wch: 20 }, // Last Updated
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Library Fines");

  // Generate Excel file
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
}

/**
 * Export library fines data to PDF format (using print)
 */
export function exportFinesToPDF(
  fines: LibraryFine[],
  filename: string = "library-fines",
  formatCurrency?: (amount: number) => string,
  schoolName: string = "School Management System"
) {
  // Calculate summary statistics
  const totalFinesCount = fines.length;
  const pendingFines = fines.filter(f => !f.isPaid).length;
  const pendingAmount = fines.filter(f => !f.isPaid).reduce((sum, f) => sum + f.amount, 0);
  const collectedAmount = fines.filter(f => f.isPaid).reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const waivedAmount = fines.reduce((sum, f) => sum + (f.waivedAmount || 0), 0);

  // Group by fine type
  const typeStats = fines.reduce((acc, fine) => {
    const type = fine.fineType;
    if (!acc[type]) {
      acc[type] = { count: 0, amount: 0 };
    }
    acc[type].count++;
    acc[type].amount += fine.amount;
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  const formatAmount = (amount: number) => formatCurrency ? formatCurrency(amount) : `NGN ${amount.toLocaleString()}`;

  // Create a printable HTML structure
  const finesPrintContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Library Fines Report</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            color: #dc2626;
            font-size: 22pt;
          }
          .header .school-name {
            font-size: 12pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .header p {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-radius: 10px;
            border: 1px solid #fecaca;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 9pt;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 14pt;
            font-weight: bold;
            color: #dc2626;
          }
          .summary-item .value.warning {
            color: #dc2626;
          }
          .summary-item .value.success {
            color: #059669;
          }
          .summary-item .value.purple {
            color: #7c3aed;
          }
          .type-summary {
            margin-bottom: 20px;
            padding: 12px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .type-summary h3 {
            margin: 0 0 10px 0;
            font-size: 11pt;
            color: #374151;
          }
          .type-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .type-item {
            padding: 8px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .type-item .name {
            font-size: 9pt;
            color: #6b7280;
            text-transform: capitalize;
          }
          .type-item .count {
            font-size: 11pt;
            font-weight: bold;
            color: #374151;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 10px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 8pt;
            border: 1px solid #b91c1c;
          }
          td {
            padding: 8px 6px;
            border: 1px solid #e5e7eb;
            font-size: 8pt;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          tr:hover {
            background-color: #fef2f2;
          }
          .status {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 7pt;
            text-transform: capitalize;
            display: inline-block;
          }
          .status.pending {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .status.paid {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status.waived {
            background-color: #f3e8ff;
            color: #7c3aed;
          }
          .fine-type {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 7pt;
            text-transform: capitalize;
          }
          .fine-type.overdue {
            background-color: #fef3c7;
            color: #92400e;
          }
          .fine-type.lost {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .fine-type.damaged {
            background-color: #ffedd5;
            color: #9a3412;
          }
          .amount {
            font-weight: 600;
          }
          .amount.pending {
            color: #dc2626;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${schoolName}</div>
          <h1>Library Fines Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="label">Total Fines</div>
            <div class="value">${totalFinesCount}</div>
          </div>
          <div class="summary-item">
            <div class="label">Pending</div>
            <div class="value warning">${pendingFines}</div>
          </div>
          <div class="summary-item">
            <div class="label">Pending Amount</div>
            <div class="value warning">${formatAmount(pendingAmount)}</div>
          </div>
          <div class="summary-item">
            <div class="label">Collected</div>
            <div class="value success">${formatAmount(collectedAmount)}</div>
          </div>
          <div class="summary-item">
            <div class="label">Waived</div>
            <div class="value purple">${formatAmount(waivedAmount)}</div>
          </div>
        </div>

        <div class="type-summary">
          <h3>Fine Type Breakdown</h3>
          <div class="type-grid">
            ${Object.entries(typeStats).map(([type, data]) => `
              <div class="type-item">
                <div class="name">${type}</div>
                <div class="count">${data.count} fines · ${formatAmount(data.amount)}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Fine ID</th>
              <th>Member</th>
              <th>Book Title</th>
              <th>Type</th>
              <th>Days</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Paid</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${fines.map(fine => `
              <tr>
                <td style="font-family: monospace;">${fine.id.toUpperCase()}</td>
                <td>
                  <strong>${fine.memberName}</strong><br/>
                  <small style="color:#6b7280">${fine.memberId}</small>
                </td>
                <td>${fine.bookTitle}</td>
                <td><span class="fine-type ${fine.fineType}">${fine.fineType}</span></td>
                <td>${fine.daysOverdue || "-"}</td>
                <td class="amount ${!fine.isPaid ? 'pending' : ''}">${formatAmount(fine.amount)}</td>
                <td><span class="status ${fine.isPaid ? (fine.waivedAmount && fine.waivedAmount > 0 && (!fine.paidAmount || fine.paidAmount === 0) ? 'waived' : 'paid') : 'pending'}">${fine.isPaid ? (fine.waivedAmount && fine.waivedAmount > 0 && (!fine.paidAmount || fine.paidAmount === 0) ? 'Waived' : 'Paid') : 'Pending'}</span></td>
                <td>${fine.paidAmount ? formatAmount(fine.paidAmount) : "-"}</td>
                <td>${new Date(fine.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>&copy; ${new Date().getFullYear()} ${schoolName}. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  // Create a new window for printing
  const finesPrintWindow = window.open("", "_blank");
  if (finesPrintWindow) {
    finesPrintWindow.document.write(finesPrintContent);
    finesPrintWindow.document.close();

    // Wait for content to load then print
    finesPrintWindow.onload = () => {
      finesPrintWindow.focus();
      finesPrintWindow.print();
      // Close window after printing (user can cancel)
      setTimeout(() => {
        finesPrintWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to export to PDF");
  }
}
