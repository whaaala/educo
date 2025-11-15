import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FeeRecord {
  feeType: string;
  feeCode: string;
  category: string;
  amount: number;
  dueDate: string;
  status: string;
  paymentDate?: string;
  paymentMode?: string;
  discount: number;
  fine: number;
  academicYear: string;
}

interface StudentInfo {
  name: string;
  rollNo: string;
  class: string;
  admissionNumber: string;
}

export function exportFeesToPDF(fees: FeeRecord[], filename: string = "fees.pdf", studentInfo?: StudentInfo) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add header section with background
  doc.setFillColor(59, 130, 246); // Blue background
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 35, 'F');

  // Add title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255); // White text
  doc.text("Fee Records Report", 14, 15);

  let currentY = 22;

  // Add student information if available
  if (studentInfo) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Student: ${studentInfo.name} | Roll No: ${studentInfo.rollNo} | Class: ${studentInfo.class} | Admission: ${studentInfo.admissionNumber}`, 14, currentY);
    currentY += 5;
  }

  // Add generation date in header
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(9);
  doc.text(`Generated on: ${currentDate}`, 14, currentY + 5);

  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  currentY = 42;

  // Calculate summary statistics
  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalDiscount = fees.reduce((sum, fee) => sum + fee.discount, 0);
  const totalFine = fees.reduce((sum, fee) => sum + fee.fine, 0);
  const paidCount = fees.filter(fee => fee.status === "Paid").length;
  const unpaidCount = fees.filter(fee => fee.status === "Unpaid").length;
  const partialCount = fees.filter(fee => fee.status === "Partial").length;

  // Add summary statistics box
  doc.setFillColor(245, 247, 250);
  doc.rect(14, currentY, doc.internal.pageSize.getWidth() - 28, 25, 'F');

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Summary Statistics", 18, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const col1X = 18;
  const col2X = 90;
  const col3X = 162;
  const col4X = 234;

  doc.text(`Total Records: ${fees.length}`, col1X, currentY + 12);
  doc.text(`Total Amount: ${totalAmount.toLocaleString()}`, col2X, currentY + 12);
  doc.text(`Discount: ${totalDiscount.toLocaleString()}`, col3X, currentY + 12);
  doc.text(`Fine: ${totalFine.toLocaleString()}`, col4X, currentY + 12);

  doc.text(`Paid: ${paidCount}`, col1X, currentY + 18);
  doc.text(`Unpaid: ${unpaidCount}`, col2X, currentY + 18);
  doc.text(`Partial: ${partialCount}`, col3X, currentY + 18);
  doc.text(`Payment Rate: ${fees.length > 0 ? ((paidCount / fees.length) * 100).toFixed(1) : 0}%`, col4X, currentY + 18);

  currentY += 30;

  // Prepare table data
  const tableData = fees.map((fee) => [
    fee.feeType,
    fee.feeCode,
    fee.category,
    fee.amount.toLocaleString(),
    new Date(fee.dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    fee.status,
    fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-",
    fee.paymentMode || "-",
    fee.discount > 0 ? `-${fee.discount}` : "-",
    fee.fine > 0 ? `+${fee.fine}` : "-",
  ]);

  // Create table using autoTable
  autoTable(doc, {
    head: [
      [
        "Fee Type",
        "Fee Code",
        "Category",
        "Amount",
        "Due Date",
        "Status",
        "Payment Date",
        "Payment Method",
        "Discount",
        "Fine",
      ],
    ],
    body: tableData,
    startY: currentY,
    theme: "grid",
    styles: {
      fontSize: 7,
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
      0: { cellWidth: 35 }, // Fee Type
      1: { cellWidth: 22 }, // Fee Code
      2: { cellWidth: 28 }, // Category
      3: { cellWidth: 18 }, // Amount
      4: { cellWidth: 22 }, // Due Date
      5: { cellWidth: 18 }, // Status
      6: { cellWidth: 22 }, // Payment Date
      7: { cellWidth: 25 }, // Payment Method
      8: { cellWidth: 16 }, // Discount
      9: { cellWidth: 16 }, // Fine
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: currentY, left: 14, right: 14 },
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
  }

  // Save the PDF
  doc.save(filename);
}
