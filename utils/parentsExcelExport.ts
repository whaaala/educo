import * as XLSX from "xlsx";
import type { AdminParent } from "@/lib/mockParents";

interface ExportOptions {
  currencySymbol?: string;
  schoolName?: string;
}

export function exportParentsToExcel(
  parents: AdminParent[],
  filename: string = "parents.xlsx",
  options: ExportOptions = {}
) {
  const { currencySymbol = "₦", schoolName = "School Management System" } = options;

  // Calculate summary statistics
  const activeParents = parents.filter((p) => p.status === "Active").length;
  const inactiveParents = parents.filter((p) => p.status === "Inactive").length;
  const totalOutstanding = parents.reduce((sum, p) => sum + (p.totalOutstandingFees || 0), 0);
  const totalPaid = parents.reduce((sum, p) => sum + (p.totalPaidFees || 0), 0);
  const totalChildren = parents.reduce((sum, p) => sum + (p.children?.length || 0), 0);

  // Prepare data for Excel - Main data sheet
  const worksheetData = [
    // Header row
    [
      "Parent ID",
      "First Name",
      "Last Name",
      "Relationship",
      "Email",
      "Phone",
      "Alternate Phone",
      "Occupation",
      "Address",
      "City",
      "State",
      "Country",
      "Children Count",
      "Children Names",
      `Outstanding Fees (${currencySymbol})`,
      `Total Paid (${currencySymbol})`,
      "Last Payment Date",
      "Communication Preference",
      "Status",
    ],
    // Data rows
    ...parents.map((parent) => {
      const childrenNames = parent.children?.map((c) => `${c.firstName} ${c.lastName}`).join("; ") || "-";
      const childCount = parent.children?.length || 0;
      const addressLine = parent.address
        ? `${parent.address.line1}${parent.address.line2 ? ", " + parent.address.line2 : ""}`
        : "-";

      return [
        parent.id,
        parent.firstName,
        parent.lastName,
        parent.relationship,
        parent.email,
        parent.phone,
        parent.alternatePhone || "-",
        parent.occupation || "-",
        addressLine,
        parent.address?.city || "-",
        parent.address?.state || "-",
        parent.address?.country || "-",
        childCount,
        childrenNames,
        parent.totalOutstandingFees || 0,
        parent.totalPaidFees || 0,
        parent.lastPaymentDate || "-",
        parent.communicationPreference || "email",
        parent.status,
      ];
    }),
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 12 }, // Parent ID
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 12 }, // Relationship
    { wch: 30 }, // Email
    { wch: 18 }, // Phone
    { wch: 18 }, // Alternate Phone
    { wch: 20 }, // Occupation
    { wch: 35 }, // Address
    { wch: 15 }, // City
    { wch: 15 }, // State
    { wch: 12 }, // Country
    { wch: 12 }, // Children Count
    { wch: 35 }, // Children Names
    { wch: 18 }, // Outstanding Fees
    { wch: 15 }, // Total Paid
    { wch: 15 }, // Last Payment Date
    { wch: 18 }, // Communication Preference
    { wch: 10 }, // Status
  ];
  worksheet["!cols"] = columnWidths;

  // Style the header row
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1:S1");
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "3B82F6" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // Create metadata/info sheet
  const metadataData = [
    ["PARENT/GUARDIAN RECORDS EXPORT"],
    [""],
    ["School:", schoolName],
    ["Generated On:", new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })],
    [""],
    ["SUMMARY STATISTICS"],
    ["Total Parents/Guardians:", parents.length],
    ["Active:", activeParents],
    ["Inactive:", inactiveParents],
    ["Total Children:", totalChildren],
    [`Total Outstanding Fees:`, `${currencySymbol}${totalOutstanding.toLocaleString()}`],
    [`Total Paid Fees:`, `${currencySymbol}${totalPaid.toLocaleString()}`],
    [""],
    ["RELATIONSHIP BREAKDOWN"],
    ["Fathers:", parents.filter((p) => p.relationship === "Father").length],
    ["Mothers:", parents.filter((p) => p.relationship === "Mother").length],
    ["Guardians:", parents.filter((p) => p.relationship === "Guardian").length],
    ["Sponsors:", parents.filter((p) => p.relationship === "Sponsor").length],
    [""],
    ["COLUMN DESCRIPTIONS"],
    ["Parent ID", "Unique identifier for each parent/guardian"],
    ["First Name", "Parent's first name"],
    ["Last Name", "Parent's last name"],
    ["Relationship", "Relationship to student (Father, Mother, Guardian, Sponsor)"],
    ["Email", "Primary email address"],
    ["Phone", "Primary phone number"],
    ["Alternate Phone", "Secondary phone number"],
    ["Occupation", "Parent's occupation/profession"],
    ["Address", "Street address"],
    ["City", "City of residence"],
    ["State", "State/Region"],
    ["Country", "Country of residence"],
    ["Children Count", "Number of children enrolled"],
    ["Children Names", "Names of enrolled children"],
    ["Outstanding Fees", "Total unpaid fees across all children"],
    ["Total Paid", "Total fees paid to date"],
    ["Last Payment Date", "Date of most recent payment"],
    ["Communication Preference", "Preferred communication method"],
    ["Status", "Account status (Active/Inactive)"],
  ];

  const metadataSheet = XLSX.utils.aoa_to_sheet(metadataData);

  // Set column widths for metadata sheet
  metadataSheet["!cols"] = [
    { wch: 25 },
    { wch: 50 },
  ];

  // Style metadata title
  if (metadataSheet["A1"]) {
    metadataSheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "3B82F6" } },
      alignment: { horizontal: "left", vertical: "center" },
    };
  }

  // Create children details sheet
  const childrenData: any[][] = [
    ["Parent ID", "Parent Name", "Child ID", "Child Name", "Class", "Section", "Gender", "Status", "Relationship"],
  ];

  parents.forEach((parent) => {
    if (parent.children && parent.children.length > 0) {
      parent.children.forEach((child) => {
        childrenData.push([
          parent.id,
          `${parent.firstName} ${parent.lastName}`,
          child.id,
          `${child.firstName} ${child.lastName}`,
          child.classLevel,
          child.section || "-",
          child.gender,
          child.status,
          child.relationship,
        ]);
      });
    }
  });

  const childrenSheet = XLSX.utils.aoa_to_sheet(childrenData);
  childrenSheet["!cols"] = [
    { wch: 12 }, // Parent ID
    { wch: 25 }, // Parent Name
    { wch: 12 }, // Child ID
    { wch: 25 }, // Child Name
    { wch: 12 }, // Class
    { wch: 10 }, // Section
    { wch: 10 }, // Gender
    { wch: 10 }, // Status
    { wch: 12 }, // Relationship
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Parents");
  XLSX.utils.book_append_sheet(workbook, childrenSheet, "Children");
  XLSX.utils.book_append_sheet(workbook, metadataSheet, "Info");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
}
