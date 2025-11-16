import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  staffId: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  employmentType: string;
  employmentStatus: string;
  joinDate: string;
}

export function exportStaffToPDF(staff: Staff[], filename: string = "staff.pdf") {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Staff List", 14, 15);

  // Add metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${currentDate}`, 14, 22);
  doc.text(`Total Staff: ${staff.length}`, 14, 27);

  // Prepare table data
  const tableData = staff.map((member) => [
    member.staffId,
    `${member.firstName} ${member.lastName}`,
    member.email,
    member.department,
    member.role,
    member.employmentType,
    member.employmentStatus,
    new Date(member.joinDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  ]);

  // Generate table
  autoTable(doc, {
    head: [["Staff ID", "Name", "Email", "Department", "Role", "Employment Type", "Status", "Join Date"]],
    body: tableData,
    startY: 32,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Staff ID
      1: { cellWidth: 40 }, // Name
      2: { cellWidth: 50 }, // Email
      3: { cellWidth: 30 }, // Department
      4: { cellWidth: 25 }, // Role
      5: { cellWidth: 30 }, // Employment Type
      6: { cellWidth: 25 }, // Status
      7: { cellWidth: 25 }, // Join Date
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Save the PDF
  doc.save(filename);
}
