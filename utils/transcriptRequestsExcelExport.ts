import * as XLSX from "xlsx";
import { TranscriptRequest } from "@/types/transcript";

export function exportTranscriptRequestsToExcel(
  requests: TranscriptRequest[],
  filename: string = "transcript-requests.xlsx",
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

  // Prepare data for Excel - Requests Sheet
  const requestsData = [
    // Header row
    [
      "Request Number",
      "Student Name",
      "Admission Number",
      "Email",
      "Transcript Type",
      "Request Date",
      "Status",
      "Payment Status",
      "Amount",
      "Delivery Method",
      "From Year",
      "To Year",
      "Purpose",
      "Verification Code",
    ],
    // Data rows
    ...requests.map((request) => [
      request.requestNumber,
      request.studentName,
      request.studentAdmissionNumber,
      request.studentEmail || "-",
      formatStatus(request.transcriptType),
      formatDate(request.requestDate),
      formatStatus(request.status),
      formatStatus(request.payment.status),
      formatCurrency(request.payment.amount),
      request.deliveryMethod ? formatStatus(request.deliveryMethod) : "-",
      request.fromYear || "-",
      request.toYear || "-",
      request.purpose ? formatStatus(request.purpose) : "-",
      request.verificationCode || "-",
    ]),
  ];

  // Create requests worksheet
  const requestsSheet = XLSX.utils.aoa_to_sheet(requestsData);

  // Set column widths for requests sheet
  requestsSheet["!cols"] = [
    { wch: 18 }, // Request Number
    { wch: 25 }, // Student Name
    { wch: 18 }, // Admission Number
    { wch: 28 }, // Email
    { wch: 15 }, // Transcript Type
    { wch: 15 }, // Request Date
    { wch: 12 }, // Status
    { wch: 15 }, // Payment Status
    { wch: 12 }, // Amount
    { wch: 15 }, // Delivery Method
    { wch: 10 }, // From Year
    { wch: 10 }, // To Year
    { wch: 25 }, // Purpose
    { wch: 18 }, // Verification Code
  ];

  // Prepare detailed info sheet (processing info, delivery details)
  const detailsData = [
    // Header row
    [
      "Request Number",
      "Student Name",
      "Class",
      "Processed Date",
      "Ready Date",
      "Delivered Date",
      "Processed By",
      "Urgent",
      "Recipient Name",
      "Delivery Address",
      "Tracking Number",
      "Notes",
    ],
    // Data rows
    ...requests.map((request) => [
      request.requestNumber,
      request.studentName,
      request.studentClass,
      request.processedDate ? formatDate(request.processedDate) : "-",
      request.readyDate ? formatDate(request.readyDate) : "-",
      request.deliveredDate ? formatDate(request.deliveredDate) : "-",
      request.processedByName || "-",
      request.urgentProcessing ? "Yes" : "No",
      request.recipientName || "-",
      request.deliveryAddress || "-",
      request.trackingNumber || "-",
      request.notes || "-",
    ]),
  ];

  // Create details worksheet
  const detailsSheet = XLSX.utils.aoa_to_sheet(detailsData);

  // Set column widths for details sheet
  detailsSheet["!cols"] = [
    { wch: 18 }, // Request Number
    { wch: 25 }, // Student Name
    { wch: 15 }, // Class
    { wch: 15 }, // Processed Date
    { wch: 15 }, // Ready Date
    { wch: 15 }, // Delivered Date
    { wch: 20 }, // Processed By
    { wch: 8 },  // Urgent
    { wch: 20 }, // Recipient Name
    { wch: 30 }, // Delivery Address
    { wch: 18 }, // Tracking Number
    { wch: 30 }, // Notes
  ];

  // Calculate summary stats
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const processingCount = requests.filter((r) => r.status === "processing").length;
  const readyCount = requests.filter((r) => r.status === "ready").length;
  const deliveredCount = requests.filter((r) => r.status === "delivered").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const totalFees = requests.reduce((sum, r) => sum + r.payment.amount, 0);
  const paidCount = requests.filter((r) => r.payment.status === "paid").length;
  const unpaidCount = requests.filter((r) => r.payment.status === "unpaid").length;
  const partialCount = requests.filter((r) => r.payment.status === "partial").length;
  const waivedCount = requests.filter((r) => r.payment.status === "waived").length;

  const officialCount = requests.filter((r) => r.transcriptType === "official").length;
  const unofficialCount = requests.filter((r) => r.transcriptType === "unofficial").length;

  // Add summary sheet
  const summaryData = [
    ["Transcript Requests Report"],
    [""],
    ["Generated On:", new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })],
    [""],
    ["Request Summary:"],
    ["Total Requests:", totalRequests],
    ["Total Fees:", formatCurrency(totalFees)],
    [""],
    ["Status Breakdown:"],
    ["Pending:", pendingCount],
    ["Processing:", processingCount],
    ["Ready for Pickup:", readyCount],
    ["Delivered:", deliveredCount],
    ["Rejected:", rejectedCount],
    [""],
    ["Payment Status:"],
    ["Paid:", paidCount],
    ["Unpaid:", unpaidCount],
    ["Partial:", partialCount],
    ["Waived:", waivedCount],
    [""],
    ["Transcript Types:"],
    ["Official:", officialCount],
    ["Unofficial:", unofficialCount],
    [""],
    ["Column Descriptions (Requests Sheet):"],
    ["Request Number", "Unique identifier for each transcript request"],
    ["Student Name", "Full name of the student"],
    ["Admission Number", "Student's admission/registration number"],
    ["Email", "Student's email address"],
    ["Transcript Type", "Official or Unofficial"],
    ["Request Date", "Date when the request was submitted"],
    ["Status", "Current status of the request"],
    ["Payment Status", "Payment status (Paid, Unpaid, Partial, Waived)"],
    ["Verification Code", "Code for verifying transcript authenticity"],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Set column widths for summary sheet
  summarySheet["!cols"] = [
    { wch: 20 },
    { wch: 50 },
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(workbook, requestsSheet, "Transcript Requests");
  XLSX.utils.book_append_sheet(workbook, detailsSheet, "Request Details");
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
}
