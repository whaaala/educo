import { withPlugins } from "./jspdf-types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AdminParent } from "@/lib/mockParents";

interface ExportOptions {
  currencySymbol?: string;
  schoolName?: string;
}

export function exportParentsToPDF(
  parents: AdminParent[],
  filename: string = "parents.pdf",
  options: ExportOptions = {}
) {
  const { currencySymbol = "₦", schoolName = "School Management System" } = options;

  // Create a new PDF document in landscape mode
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Add header with background color
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(0, 0, pageWidth, 30, "F");

  // Add title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Parent/Guardian Records", 14, 15);

  // Add school name
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(schoolName, 14, 23);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Add metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${currentDate} at ${currentTime}`, 14, 38);
  doc.text(`Total Records: ${parents.length}`, 14, 44);

  // Calculate summary statistics
  const activeParents = parents.filter((p) => p.status === "Active").length;
  const inactiveParents = parents.filter((p) => p.status === "Inactive").length;
  const totalOutstanding = parents.reduce((sum, p) => sum + (p.totalOutstandingFees || 0), 0);
  const totalChildren = parents.reduce((sum, p) => sum + (p.children?.length || 0), 0);

  // Add summary box
  doc.setFillColor(245, 247, 250);
  doc.rect(pageWidth - 120, 34, 106, 20, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", pageWidth - 116, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`Active: ${activeParents} | Inactive: ${inactiveParents}`, pageWidth - 116, 46);
  doc.text(`Total Children: ${totalChildren} | Outstanding: ${currencySymbol}${totalOutstanding.toLocaleString()}`, pageWidth - 116, 51);

  // Prepare table data
  const tableData = parents.map((parent) => {
    const childrenNames = parent.children?.map((c) => c.firstName).join(", ") || "-";
    const childCount = parent.children?.length || 0;

    return [
      parent.id,
      `${parent.firstName} ${parent.lastName}`,
      parent.relationship,
      parent.email,
      parent.phone,
      `${childCount} (${childrenNames})`,
      `${currencySymbol}${(parent.totalOutstandingFees || 0).toLocaleString()}`,
      parent.status,
    ];
  });

  // Create table using autoTable
  autoTable(doc, {
    head: [
      [
        "ID",
        "Name",
        "Relationship",
        "Email",
        "Phone",
        "Children",
        "Outstanding",
        "Status",
      ],
    ],
    body: tableData,
    startY: 58,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
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
      0: { cellWidth: 25, halign: "center" }, // ID
      1: { cellWidth: 40 }, // Name
      2: { cellWidth: 25, halign: "center" }, // Relationship
      3: { cellWidth: 50 }, // Email
      4: { cellWidth: 35 }, // Phone
      5: { cellWidth: 45 }, // Children
      6: { cellWidth: 28, halign: "right" }, // Outstanding
      7: { cellWidth: 20, halign: "center" }, // Status
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 58, left: 14, right: 14 },
    didParseCell: (data) => {
      // Style the status column
      if (data.column.index === 7 && data.section === "body") {
        const status = data.cell.raw as string;
        if (status === "Active") {
          data.cell.styles.textColor = [34, 197, 94]; // Green
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = [239, 68, 68]; // Red
          data.cell.styles.fontStyle = "bold";
        }
      }
      // Style outstanding column (red if > 0)
      if (data.column.index === 6 && data.section === "body") {
        const value = String(data.cell.raw).replace(/[^0-9]/g, "");
        if (parseInt(value) > 0) {
          data.cell.styles.textColor = [239, 68, 68]; // Red
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = [34, 197, 94]; // Green
        }
      }
    },
  });

  // Add page numbers and footer
  const pageCount = withPlugins(doc).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(128, 128, 128);

    // Page number
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 30,
      doc.internal.pageSize.getHeight() - 10
    );

    // Footer
    doc.text(
      "Generated by Educo School Management System",
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  doc.save(filename);
}
