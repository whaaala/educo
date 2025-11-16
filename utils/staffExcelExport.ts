import * as XLSX from "xlsx";

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

export function exportStaffToExcel(staff: Staff[], filename: string = "staff.xlsx") {
  // Prepare data for Excel
  const worksheetData = [
    // Header row
    [
      "Staff ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Department",
      "Role",
      "Employment Type",
      "Status",
      "Join Date",
    ],
    // Data rows
    ...staff.map((member) => [
      member.staffId,
      member.firstName,
      member.lastName,
      member.email,
      member.phone,
      member.department,
      member.role,
      member.employmentType,
      member.employmentStatus,
      new Date(member.joinDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    ]),
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 12 }, // Staff ID
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 30 }, // Email
    { wch: 15 }, // Phone
    { wch: 20 }, // Department
    { wch: 15 }, // Role
    { wch: 18 }, // Employment Type
    { wch: 12 }, // Status
    { wch: 15 }, // Join Date
  ];
  worksheet["!cols"] = columnWidths;

  // Style the header row
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1:J1");
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "3B82F6" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");

  // Add metadata sheet
  const metadataData = [
    ["Export Information"],
    [],
    ["Generated on:", new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })],
    ["Total Staff:", staff.length],
  ];
  const metadataSheet = XLSX.utils.aoa_to_sheet(metadataData);
  XLSX.utils.book_append_sheet(workbook, metadataSheet, "Info");

  // Generate and download the file
  XLSX.writeFile(workbook, filename);
}
