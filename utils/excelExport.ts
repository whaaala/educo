import * as XLSX from "xlsx";

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

export function exportStudentsToExcel(students: Student[], filename: string = "students.xlsx") {
  // Prepare data for Excel
  const worksheetData = [
    // Header row
    ["Student ID", "Name", "Roll No", "Class", "Gender", "Joined On", "Left On", "Status"],
    // Data rows
    ...students.map((student) => [
      student.id,
      student.name,
      student.rollNo,
      student.class,
      student.gender,
      student.joinedOn,
      student.leftOn || "-",
      student.status,
    ]),
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Student ID
    { wch: 25 }, // Name
    { wch: 12 }, // Roll No
    { wch: 15 }, // Class
    { wch: 10 }, // Gender
    { wch: 15 }, // Joined On
    { wch: 15 }, // Left On
    { wch: 10 }, // Status
  ];
  worksheet["!cols"] = columnWidths;

  // Style the header row
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1:H1");
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "3B82F6" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // Add metadata sheet
  const metadataData = [
    ["Student Records Export"],
    [""],
    ["Generated On:", new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })],
    ["Total Students:", students.length],
    [""],
    ["Column Descriptions:"],
    ["Student ID", "Unique identifier for each student"],
    ["Name", "Full name of the student"],
    ["Roll No", "Student roll number"],
    ["Class", "Class and section"],
    ["Gender", "Male or Female"],
    ["Joined On", "Date when student joined"],
    ["Left On", "Date when student left (if applicable)"],
    ["Status", "Active or Inactive"],
  ];

  const metadataSheet = XLSX.utils.aoa_to_sheet(metadataData);

  // Set column widths for metadata sheet
  metadataSheet["!cols"] = [
    { wch: 20 },
    { wch: 50 },
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
  XLSX.utils.book_append_sheet(workbook, metadataSheet, "Info");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
}
