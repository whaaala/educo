import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  gender: "Male" | "Female";
  joinedOn: string;
  leftOn?: string;
  status: "Active" | "Inactive";
}

export function exportStudentsToPDF(students: Student[], filename: string = "students.pdf") {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Student List", 14, 15);

  // Add metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${currentDate}`, 14, 22);
  doc.text(`Total Students: ${students.length}`, 14, 27);

  // Prepare table data
  const tableData = students.map((student) => [
    student.id,
    student.name,
    student.rollNo,
    student.class,
    student.gender,
    student.joinedOn,
    student.leftOn || "-",
    student.status,
  ]);

  // Create table using autoTable
  autoTable(doc, {
    head: [
      [
        "Student ID",
        "Name",
        "Roll No",
        "Class",
        "Gender",
        "Joined On",
        "Left On",
        "Status",
      ],
    ],
    body: tableData,
    startY: 32,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: "linebreak",
      halign: "left",
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Student ID
      1: { cellWidth: 45 }, // Name
      2: { cellWidth: 25 }, // Roll No
      3: { cellWidth: 30 }, // Class
      4: { cellWidth: 22 }, // Gender
      5: { cellWidth: 30 }, // Joined On
      6: { cellWidth: 30 }, // Left On
      7: { cellWidth: 22 }, // Status
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 32, left: 14, right: 14 },
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
