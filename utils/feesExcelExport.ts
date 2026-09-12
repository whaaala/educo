import * as XLSX from "xlsx";

/** One cell of a worksheet row. Blank cells are written as an empty string. */
type ExcelCell = string | number;

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

export function exportFeesToExcel(fees: FeeRecord[], filename: string = "fees.xlsx", studentInfo?: StudentInfo) {
  // Build the worksheet with header section
  const worksheetData: ExcelCell[][] = [];

  // Title row
  worksheetData.push(["FEE RECORDS REPORT"]);
  worksheetData.push([]); // Empty row

  // Student information if available
  if (studentInfo) {
    worksheetData.push(["STUDENT INFORMATION"]);
    worksheetData.push(["Name:", studentInfo.name, "", "Roll No:", studentInfo.rollNo]);
    worksheetData.push(["Class:", studentInfo.class, "", "Admission No:", studentInfo.admissionNumber]);
    worksheetData.push([]); // Empty row
  }

  // Generation info
  const currentDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  worksheetData.push(["Generated On:", currentDate]);
  worksheetData.push([]); // Empty row

  // Calculate summary statistics
  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalDiscount = fees.reduce((sum, fee) => sum + fee.discount, 0);
  const totalFine = fees.reduce((sum, fee) => sum + fee.fine, 0);
  const paidCount = fees.filter(fee => fee.status === "Paid").length;
  const unpaidCount = fees.filter(fee => fee.status === "Unpaid").length;
  const partialCount = fees.filter(fee => fee.status === "Partial").length;
  const overdueCount = fees.filter(fee => fee.status === "Overdue").length;

  // Summary statistics section
  worksheetData.push(["SUMMARY STATISTICS"]);
  worksheetData.push(["Total Records:", fees.length, "", "Total Amount:", totalAmount]);
  worksheetData.push(["Paid:", paidCount, "", "Unpaid:", unpaidCount]);
  worksheetData.push(["Partial:", partialCount, "", "Overdue:", overdueCount]);
  worksheetData.push(["Total Discount:", totalDiscount, "", "Total Fine:", totalFine]);
  worksheetData.push([]); // Empty row
  worksheetData.push([]); // Empty row

  // Table header row
  const headerRowIndex = worksheetData.length;
  worksheetData.push(["Fee Type", "Fee Code", "Category", "Amount", "Due Date", "Status", "Payment Date", "Method of Payment", "Discount", "Fine", "Academic Year"]);

  // Data rows
  fees.forEach((fee) => {
    worksheetData.push([
      fee.feeType,
      fee.feeCode,
      fee.category,
      fee.amount,
      fee.dueDate,
      fee.status,
      fee.paymentDate || "-",
      fee.paymentMode || "-",
      fee.discount,
      fee.fine,
      fee.academicYear,
    ]);
  });

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 25 }, // Fee Type
    { wch: 15 }, // Fee Code
    { wch: 20 }, // Category
    { wch: 12 }, // Amount
    { wch: 15 }, // Due Date
    { wch: 12 }, // Status
    { wch: 15 }, // Payment Date
    { wch: 18 }, // Method of Payment
    { wch: 12 }, // Discount
    { wch: 12 }, // Fine
    { wch: 15 }, // Academic Year
  ];
  worksheet["!cols"] = columnWidths;

  // Style the title row (row 1)
  if (worksheet["A1"]) {
    worksheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "3B82F6" } },
      alignment: { horizontal: "left", vertical: "center" },
    };
  }

  // Style section headers
  const sectionHeaders = studentInfo
    ? ["A3", "A" + (48 + (studentInfo ? 6 : 0)).toString(), "A" + headerRowIndex.toString()]
    : ["A6", "A" + headerRowIndex.toString()];

  sectionHeaders.forEach(cellRef => {
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        font: { bold: true, sz: 11, color: { rgb: "1F2937" } },
        fill: { fgColor: { rgb: "F3F4F6" } },
        alignment: { horizontal: "left", vertical: "center" },
      };
    }
  });

  // Style the table header row
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:K1");
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "3B82F6" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  }

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Fee Records");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
}
