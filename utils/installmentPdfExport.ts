import { withPlugins } from "./jspdf-types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

export function exportInstallmentPlansToPDF(
  plans: InstallmentPlan[],
  filename: string = "installment-plans.pdf",
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
  doc.text("Installment Plans Report", 14, 15);

  // Add metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${currentDate}`, 14, 22);
  doc.text(`Total Plans: ${plans.length}`, 14, 27);

  // Calculate totals
  const totalAmount = plans.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalCollected = plans.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = plans.reduce((sum, p) => sum + p.remainingAmount, 0);

  doc.text(`Total Amount: ${pdfCurrencyPrefix}${totalAmount.toLocaleString()}`, 120, 22);
  doc.text(`Collected: ${pdfCurrencyPrefix}${totalCollected.toLocaleString()}`, 120, 27);
  doc.text(`Pending: ${pdfCurrencyPrefix}${totalPending.toLocaleString()}`, 200, 27);

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
  const tableData = plans.map((plan) => {
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
      formatStatus(plan.status),
      formatDate(plan.startDate),
    ];
  });

  // Create table using autoTable
  autoTable(doc, {
    head: [
      [
        "Student Name",
        "Student ID",
        "Class",
        "Fee Type",
        "Total",
        "Paid",
        "Balance",
        "Progress",
        "Status",
        "Start Date",
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
      0: { cellWidth: 35 }, // Student Name
      1: { cellWidth: 25 }, // Student ID
      2: { cellWidth: 18 }, // Class
      3: { cellWidth: 25 }, // Fee Type
      4: { cellWidth: 25, halign: "right" }, // Total
      5: { cellWidth: 25, halign: "right" }, // Paid
      6: { cellWidth: 25, halign: "right" }, // Balance
      7: { cellWidth: 20, halign: "center" }, // Progress
      8: { cellWidth: 22, halign: "center" }, // Status
      9: { cellWidth: 25 }, // Start Date
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 35, left: 14, right: 14 },
    didParseCell: function (data) {
      // Color the status cell based on value
      if (data.column.index === 8 && data.section === "body") {
        const status = data.cell.raw?.toString().toLowerCase();
        if (status === "active") {
          data.cell.styles.textColor = [37, 99, 235]; // Blue
        } else if (status === "completed") {
          data.cell.styles.textColor = [22, 163, 74]; // Green
        } else if (status === "defaulted") {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        } else if (status === "cancelled") {
          data.cell.styles.textColor = [107, 114, 128]; // Gray
        }
      }
    },
  });

  // Add page numbers
  const pageCount = withPlugins(doc).internal.getNumberOfPages();
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
      "Educo School ERP - Installment Plans Report",
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  doc.save(filename);
}
