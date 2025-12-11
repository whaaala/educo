import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TranscriptRequest, TranscriptStatus, TranscriptType, PaymentStatus } from "@/types/transcript";

export function exportTranscriptRequestsToPDF(
  requests: TranscriptRequest[],
  filename: string = "transcript-requests.pdf",
  currencySymbol: string = "₦"
) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Convert currency symbol to PDF-safe format (Naira symbol not supported in default fonts)
  const pdfCurrencyPrefix = currencySymbol === "₦" ? "NGN " : currencySymbol;

  // Add title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Transcript Requests Report", 14, 15);

  // Add metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${currentDate}`, 14, 22);
  doc.text(`Total Requests: ${requests.length}`, 14, 27);

  // Calculate totals
  const totalFees = requests.reduce((sum, r) => sum + r.payment.amount, 0);
  const totalPaid = requests.reduce((sum, r) =>
    r.payment.status === "paid" || r.payment.status === "waived" ? sum + r.payment.amount : sum, 0
  );
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const processingRequests = requests.filter((r) => r.status === "processing").length;
  const readyRequests = requests.filter((r) => r.status === "ready").length;

  doc.text(`Total Fees: ${pdfCurrencyPrefix}${totalFees.toLocaleString()}`, 120, 22);
  doc.text(`Pending: ${pendingRequests} | Processing: ${processingRequests} | Ready: ${readyRequests}`, 120, 27);

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${pdfCurrencyPrefix}${amount.toLocaleString()}`;
  };

  // Prepare table data
  const tableData = requests.map((request) => [
    request.requestNumber,
    request.studentName,
    request.studentAdmissionNumber,
    formatStatus(request.transcriptType),
    formatDate(request.requestDate),
    formatStatus(request.status),
    formatStatus(request.payment.status),
    formatCurrency(request.payment.amount),
    request.deliveryMethod ? formatStatus(request.deliveryMethod) : "-",
  ]);

  // Create table using autoTable
  autoTable(doc, {
    head: [
      [
        "Request #",
        "Student Name",
        "Admission No",
        "Type",
        "Request Date",
        "Status",
        "Payment",
        "Amount",
        "Delivery",
      ],
    ],
    body: tableData,
    startY: 35,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
      halign: "left",
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Request #
      1: { cellWidth: 35 }, // Student Name
      2: { cellWidth: 25 }, // Admission No
      3: { cellWidth: 20 }, // Type
      4: { cellWidth: 25 }, // Request Date
      5: { cellWidth: 22, halign: "center" }, // Status
      6: { cellWidth: 20, halign: "center" }, // Payment
      7: { cellWidth: 22, halign: "right" }, // Amount
      8: { cellWidth: 22, halign: "center" }, // Delivery
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 35, left: 14, right: 14 },
    didParseCell: function (data) {
      // Color the status cell based on value
      if (data.column.index === 5 && data.section === "body") {
        const status = data.cell.raw?.toString().toLowerCase();
        if (status === "pending") {
          data.cell.styles.textColor = [234, 179, 8]; // Yellow
        } else if (status === "processing") {
          data.cell.styles.textColor = [37, 99, 235]; // Blue
        } else if (status === "ready") {
          data.cell.styles.textColor = [22, 163, 74]; // Green
        } else if (status === "delivered") {
          data.cell.styles.textColor = [16, 185, 129]; // Emerald
        } else if (status === "rejected") {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        }
      }
      // Color the payment status
      if (data.column.index === 6 && data.section === "body") {
        const paymentStatus = data.cell.raw?.toString().toLowerCase();
        if (paymentStatus === "paid" || paymentStatus === "waived") {
          data.cell.styles.textColor = [22, 163, 74]; // Green
        } else if (paymentStatus === "unpaid") {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        } else if (paymentStatus === "partial") {
          data.cell.styles.textColor = [234, 179, 8]; // Yellow
        }
      }
    },
  });

  // Add page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      "Educo School ERP - Transcript Requests Report",
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  doc.save(filename);
}
