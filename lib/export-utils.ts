import * as XLSX from "xlsx";
import { LeaveRequest } from "@/types/leave";
import { TransferRequest } from "@/types/transfer";

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
