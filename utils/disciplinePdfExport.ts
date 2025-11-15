import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DisciplineIncident } from "@/types/discipline";
import { format } from "date-fns";

export function exportDisciplineToPDF(incidents: DisciplineIncident[], filename: string = "discipline-records.pdf") {
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
  doc.text("Discipline Records Report", 14, 15);

  // Add generation date in header
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(9);
  doc.text(`Generated on: ${currentDate}`, 14, 27);

  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  let currentY = 42;

  // Calculate summary statistics
  const stats = {
    total: incidents.length,
    minor: incidents.filter(i => i.severity === "minor").length,
    moderate: incidents.filter(i => i.severity === "moderate").length,
    major: incidents.filter(i => i.severity === "major").length,
    critical: incidents.filter(i => i.severity === "critical").length,
    reported: incidents.filter(i => i.status === "reported").length,
    underReview: incidents.filter(i => i.status === "under-review").length,
    resolved: incidents.filter(i => i.status === "resolved").length,
    closed: incidents.filter(i => i.status === "closed").length,
    uniqueStudents: new Set(incidents.map(i => i.studentId)).size,
  };

  // Add summary statistics box
  doc.setFillColor(245, 247, 250);
  doc.rect(14, currentY, doc.internal.pageSize.getWidth() - 28, 30, 'F');

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

  // Row 1
  doc.text(`Total Incidents: ${stats.total}`, col1X, currentY + 12);
  doc.text(`Students Involved: ${stats.uniqueStudents}`, col2X, currentY + 12);
  doc.text(`Active Cases: ${stats.reported + stats.underReview}`, col3X, currentY + 12);
  doc.text(`Resolved: ${stats.resolved + stats.closed}`, col4X, currentY + 12);

  // Row 2 - Severity
  doc.text(`Minor: ${stats.minor}`, col1X, currentY + 18);
  doc.text(`Moderate: ${stats.moderate}`, col2X, currentY + 18);
  doc.text(`Major: ${stats.major}`, col3X, currentY + 18);
  doc.text(`Critical: ${stats.critical}`, col4X, currentY + 18);

  // Row 3 - Status
  doc.text(`Reported: ${stats.reported}`, col1X, currentY + 24);
  doc.text(`Under Review: ${stats.underReview}`, col2X, currentY + 24);
  doc.text(`Resolved: ${stats.resolved}`, col3X, currentY + 24);
  doc.text(`Closed: ${stats.closed}`, col4X, currentY + 24);

  currentY += 35;

  // Helper function to get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "disruptive-behavior": "Disruptive Behavior",
      "attendance": "Attendance",
      "academic-dishonesty": "Academic Dishonesty",
      "bullying": "Bullying",
      "violence": "Violence",
      "property-damage": "Property Damage",
      "substance-abuse": "Substance Abuse",
      "dress-code": "Dress Code",
      "technology-misuse": "Technology Misuse",
      "other": "Other",
    };
    return labels[category] || category;
  };

  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "reported": "Reported",
      "under-review": "Under Review",
      "resolved": "Resolved",
      "appealed": "Appealed",
      "closed": "Closed",
    };
    return labels[status] || status;
  };

  // Prepare table data
  const tableData = incidents.map((incident) => [
    format(new Date(incident.incidentDate), "MMM dd, yyyy"),
    incident.studentName,
    incident.studentClass,
    incident.title.length > 40 ? incident.title.substring(0, 40) + "..." : incident.title,
    getCategoryLabel(incident.category),
    incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1),
    getStatusLabel(incident.status),
    incident.reportedByName,
  ]);

  // Create table using autoTable
  autoTable(doc, {
    head: [
      [
        "Date",
        "Student",
        "Class",
        "Incident",
        "Category",
        "Severity",
        "Status",
        "Reported By",
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
      0: { cellWidth: 25 }, // Date
      1: { cellWidth: 35 }, // Student
      2: { cellWidth: 18 }, // Class
      3: { cellWidth: 55 }, // Incident
      4: { cellWidth: 30 }, // Category
      5: { cellWidth: 20 }, // Severity
      6: { cellWidth: 25 }, // Status
      7: { cellWidth: 30 }, // Reported By
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: currentY, left: 14, right: 14 },
  });

  // Add page numbers and footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);

    // Page number
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
    );

    // Footer text
    doc.setFontSize(7);
    doc.text(
      "Confidential - For Internal Use Only",
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  doc.save(filename);
}
