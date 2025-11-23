import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { StaffTransferRequest } from "@/types/staffTransfer";

/**
 * Export staff transfer requests to PDF
 */
export function exportStaffTransfersToPDF(requests: StaffTransferRequest[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Add title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Staff Transfer Requests Report", pageWidth / 2, 20, { align: "center" });

  // Add generation date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const generatedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated on: ${generatedDate}`, pageWidth / 2, 28, { align: "center" });

  // Add summary statistics
  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const inProgressCount = requests.filter(r => r.status === "in-progress").length;
  const completedCount = requests.filter(r => r.status === "completed").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;

  doc.setFontSize(9);
  doc.text(
    `Summary: Total: ${totalRequests} | Pending: ${pendingCount} | Approved: ${approvedCount} | In Progress: ${inProgressCount} | Completed: ${completedCount} | Rejected: ${rejectedCount}`,
    pageWidth / 2,
    36,
    { align: "center" }
  );

  // Prepare table data
  const tableData = requests.map((request) => {
    // Determine transfer details based on type
    let transferDetails = "";
    if (request.transferType === "department") {
      transferDetails = `${request.currentDepartment} → ${request.newDepartment}`;
    } else if (request.transferType === "branch") {
      transferDetails = `${request.currentBranch} → ${request.newBranch}`;
    } else if (request.transferType === "designation") {
      transferDetails = `${request.currentDesignation} → ${request.newDesignation}`;
    } else if (request.transferType === "promotion") {
      if (request.newDesignation) {
        transferDetails = `${request.currentDesignation} → ${request.newDesignation}`;
      } else {
        transferDetails = "Pay Raise";
      }
      if (request.currentSalary && request.newSalary) {
        const increase = request.newSalary - request.currentSalary;
        const percentage = ((increase / request.currentSalary) * 100).toFixed(1);
        transferDetails += ` (+₦${increase.toLocaleString()}, ${percentage}%)`;
      }
    } else if (request.transferType === "location") {
      transferDetails = `${request.currentLocation} → ${request.newLocation}`;
    } else if (request.transferType === "termination") {
      const typeMap: Record<string, string> = {
        resignation: "Resignation",
        dismissal: "Dismissal",
        retirement: "Retirement",
        "contract-end": "Contract End",
        "mutual-agreement": "Mutual Agreement",
      };
      transferDetails = typeMap[request.terminationType || "dismissal"] || "Termination";
    }

    return [
      request.id,
      request.staffName,
      request.currentDepartment || "-",
      request.currentDesignation || "-",
      request.transferType.charAt(0).toUpperCase() + request.transferType.slice(1),
      transferDetails,
      new Date(request.effectiveDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      request.status.charAt(0).toUpperCase() + request.status.slice(1).replace("-", " "),
    ];
  });

  // Add table
  autoTable(doc, {
    startY: 44,
    head: [
      [
        "Transfer ID",
        "Staff Name",
        "Current Dept",
        "Current Position",
        "Type",
        "Transfer Details",
        "Effective Date",
        "Status",
      ],
    ],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { top: 44, left: margin, right: margin },
    styles: {
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Transfer ID
      1: { cellWidth: 25 }, // Staff Name
      2: { cellWidth: 20 }, // Current Dept
      3: { cellWidth: 25 }, // Current Position
      4: { cellWidth: 20 }, // Type
      5: { cellWidth: 35 }, // Transfer Details
      6: { cellWidth: 22 }, // Effective Date
      7: { cellWidth: 18 }, // Status
    },
  });

  // Add page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `Staff_Transfer_Requests_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Export staff transfer requests to Excel
 */
export function exportStaffTransfersToExcel(requests: StaffTransferRequest[]) {
  // Prepare data for Excel
  const excelData = requests.map((request) => {
    // Determine transfer details
    let transferDetails = "";
    let salaryIncrease = "";
    let salaryIncreasePercentage = "";

    if (request.transferType === "department") {
      transferDetails = `${request.currentDepartment} → ${request.newDepartment}`;
    } else if (request.transferType === "branch") {
      transferDetails = `${request.currentBranch} → ${request.newBranch}`;
    } else if (request.transferType === "designation") {
      transferDetails = `${request.currentDesignation} → ${request.newDesignation}`;
    } else if (request.transferType === "promotion") {
      if (request.newDesignation) {
        transferDetails = `${request.currentDesignation} → ${request.newDesignation}`;
      } else {
        transferDetails = "Pay Raise Only";
      }
      if (request.currentSalary && request.newSalary) {
        salaryIncrease = `₦${(request.newSalary - request.currentSalary).toLocaleString()}`;
        salaryIncreasePercentage = `${(((request.newSalary - request.currentSalary) / request.currentSalary) * 100).toFixed(2)}%`;
      }
    } else if (request.transferType === "location") {
      transferDetails = `${request.currentLocation} → ${request.newLocation}`;
    } else if (request.transferType === "termination") {
      const typeMap: Record<string, string> = {
        resignation: "Resignation",
        dismissal: "Dismissal",
        retirement: "Retirement",
        "contract-end": "Contract End",
        "mutual-agreement": "Mutual Agreement",
      };
      transferDetails = typeMap[request.terminationType || "dismissal"] || "Termination";
    }

    return {
      "Transfer ID": request.id,
      "Staff ID": request.staffId,
      "Staff Name": request.staffName,
      "Staff Email": request.staffEmail,
      "Current Department": request.currentDepartment || "-",
      "Current Designation": request.currentDesignation || "-",
      "Current Branch": request.currentBranch || "-",
      "Current Location": request.currentLocation || "-",
      "Transfer Type": request.transferType.charAt(0).toUpperCase() + request.transferType.slice(1),
      "Transfer Details": transferDetails,
      "New Department": request.newDepartment || "-",
      "New Designation": request.newDesignation || "-",
      "New Branch": request.newBranch || "-",
      "New Location": request.newLocation || "-",
      "Current Salary": request.currentSalary ? `₦${request.currentSalary.toLocaleString()}` : "-",
      "New Salary": request.newSalary ? `₦${request.newSalary.toLocaleString()}` : "-",
      "Salary Increase": salaryIncrease || "-",
      "Salary Increase %": salaryIncreasePercentage || "-",
      "Transfer Date": new Date(request.transferDate).toLocaleDateString("en-US"),
      "Effective Date": new Date(request.effectiveDate).toLocaleDateString("en-US"),
      "Reason": request.reason,
      "Remarks": request.remarks || "-",
      "Status": request.status.charAt(0).toUpperCase() + request.status.slice(1).replace("-", " "),
      "Requested By": request.requestedByName || "-",
      "Requested At": request.requestedAt
        ? new Date(request.requestedAt).toLocaleDateString("en-US")
        : "-",
      "Approved By": request.approvedByName || "-",
      "Approved At": request.approvedAt
        ? new Date(request.approvedAt).toLocaleDateString("en-US")
        : "-",
      "Approval Comments": request.approvalComments || "-",
      "Rejected By": request.rejectedByName || "-",
      "Rejection Reason": request.rejectionReason || "-",
      "Completed At": request.completedAt
        ? new Date(request.completedAt).toLocaleDateString("en-US")
        : "-",
      "Completion Notes": request.completionNotes || "-",
    };
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Transfer ID
    { wch: 10 }, // Staff ID
    { wch: 20 }, // Staff Name
    { wch: 25 }, // Staff Email
    { wch: 18 }, // Current Department
    { wch: 20 }, // Current Designation
    { wch: 18 }, // Current Branch
    { wch: 15 }, // Current Location
    { wch: 15 }, // Transfer Type
    { wch: 30 }, // Transfer Details
    { wch: 18 }, // New Department
    { wch: 20 }, // New Designation
    { wch: 18 }, // New Branch
    { wch: 15 }, // New Location
    { wch: 15 }, // Current Salary
    { wch: 15 }, // New Salary
    { wch: 15 }, // Salary Increase
    { wch: 15 }, // Salary Increase %
    { wch: 15 }, // Transfer Date
    { wch: 15 }, // Effective Date
    { wch: 40 }, // Reason
    { wch: 30 }, // Remarks
    { wch: 12 }, // Status
    { wch: 20 }, // Requested By
    { wch: 15 }, // Requested At
    { wch: 20 }, // Approved By
    { wch: 15 }, // Approved At
    { wch: 30 }, // Approval Comments
    { wch: 20 }, // Rejected By
    { wch: 30 }, // Rejection Reason
    { wch: 15 }, // Completed At
    { wch: 30 }, // Completion Notes
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Transfers");

  // Add summary sheet
  const summaryData = [
    { Metric: "Total Transfer Requests", Value: requests.length },
    { Metric: "Pending Approval", Value: requests.filter(r => r.status === "pending").length },
    { Metric: "Approved", Value: requests.filter(r => r.status === "approved").length },
    { Metric: "In Progress", Value: requests.filter(r => r.status === "in-progress").length },
    { Metric: "Completed", Value: requests.filter(r => r.status === "completed").length },
    { Metric: "Rejected", Value: requests.filter(r => r.status === "rejected").length },
    { Metric: "Cancelled", Value: requests.filter(r => r.status === "cancelled").length },
    { Metric: "", Value: "" },
    { Metric: "Department Transfers", Value: requests.filter(r => r.transferType === "department").length },
    { Metric: "Branch Transfers", Value: requests.filter(r => r.transferType === "branch").length },
    { Metric: "Designation Changes", Value: requests.filter(r => r.transferType === "designation").length },
    { Metric: "Promotions", Value: requests.filter(r => r.transferType === "promotion").length },
    { Metric: "Location Transfers", Value: requests.filter(r => r.transferType === "location").length },
    { Metric: "Terminations", Value: requests.filter(r => r.transferType === "termination").length },
  ];

  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  summaryWorksheet["!cols"] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

  // Save the Excel file
  const fileName = `Staff_Transfer_Requests_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
